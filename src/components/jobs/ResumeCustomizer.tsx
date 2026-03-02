import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sparkles, Download, Copy, Check, FileText, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

interface ResumeCustomizerProps {
  jobTitle: string;
  jobDescription: string;
  companyName: string;
}

const ResumeCustomizer = ({ jobTitle, jobDescription, companyName }: ResumeCustomizerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [optimizedResume, setOptimizedResume] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<"input" | "result">("input");

  const handleCustomize = async () => {
    if (!resumeText.trim()) {
      toast({ title: "Please paste your resume", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("customize-resume", {
        body: {
          resume_text: resumeText,
          job_description: jobDescription,
          job_title: jobTitle,
          company_name: companyName,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setOptimizedResume(data.optimized_resume);
      setStep("result");
      toast({ title: "Resume optimized!", description: "Your ATS-friendly resume is ready." });
    } catch (err: any) {
      toast({
        title: "Optimization failed",
        description: err.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(optimizedResume);
    setCopied(true);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth() - 2 * margin;
    const lines = doc.splitTextToSize(optimizedResume, pageWidth);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    
    let y = margin;
    const lineHeight = 6;
    
    lines.forEach((line: string) => {
      if (y > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
      // Bold section headers
      if (line.includes("===") || line === line.toUpperCase() && line.trim().length > 2) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
      } else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
      }
      doc.text(line.replace(/===/g, '').trim(), margin, y);
      y += lineHeight;
    });

    doc.save(`Resume_${jobTitle.replace(/\s+/g, '_')}_ATS.pdf`);
    toast({ title: "PDF Downloaded!", description: "Your ATS-friendly resume has been saved." });
  };

  const handleReset = () => {
    setStep("input");
    setOptimizedResume("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) { setStep("input"); setOptimizedResume(""); }
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full gap-2 border-primary/30 text-primary hover:bg-primary/5">
          <Sparkles className="w-4 h-4" />
          AI Resume Customizer (ATS)
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Resume Customizer
          </DialogTitle>
          <DialogDescription>
            Customize your resume for <strong>{jobTitle}</strong> at <strong>{companyName}</strong> — optimized for ATS (Applicant Tracking System)
          </DialogDescription>
        </DialogHeader>

        {step === "input" ? (
          <div className="space-y-4 pt-4">
            <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                How it works
              </h4>
              <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Paste your current resume text below</li>
                <li>AI analyzes the job description and optimizes your resume</li>
                <li>Review the ATS-friendly version</li>
                <li>Download as PDF or copy and use it to apply</li>
              </ol>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resume-input">Paste your current resume *</Label>
              <Textarea
                id="resume-input"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your entire resume here including name, contact info, experience, education, skills..."
                rows={12}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Tip: Copy your resume text from a Word doc, PDF, or LinkedIn profile
              </p>
            </div>

            <Button
              onClick={handleCustomize}
              disabled={isLoading || !resumeText.trim()}
              className="w-full cta-primary gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Optimizing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Customize for ATS
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 pt-4">
            <div className="rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-3">
              <p className="text-sm text-green-800 dark:text-green-300 font-medium">
                ✅ Your resume has been optimized for ATS compatibility
              </p>
            </div>

            <div className="space-y-2">
              <Label>Optimized Resume (ATS-Friendly)</Label>
              <div className="rounded-lg border bg-card p-4 max-h-[400px] overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap font-sans">{optimizedResume}</pre>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleDownloadPDF} className="flex-1 gap-2 cta-primary">
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
              <Button onClick={handleCopy} variant="outline" className="flex-1 gap-2">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy Text"}
              </Button>
            </div>

            <div className="flex gap-3 pt-2 border-t">
              <Button onClick={handleReset} variant="ghost" className="flex-1">
                ← Try Again
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              If you're satisfied with this resume, use it to apply. Otherwise, go back and modify your input.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResumeCustomizer;
