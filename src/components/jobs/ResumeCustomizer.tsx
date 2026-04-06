import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sparkles, Download, Copy, Check, FileText, Loader2, Upload, X, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import jsPDF from "jspdf";

interface ResumeCustomizerProps {
  jobTitle: string;
  jobDescription: string;
  companyName: string;
  hasSubscription: boolean;
  onSubscribeClick: () => void;
}

const MAX_FILE_SIZE = 1 * 1024 * 1024;

const extractTextFromPDF = async (file: File): Promise<string> => {
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const version = pdfjsLib.version;
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.mjs`;
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(" ");
    fullText += pageText + "\n";
  }
  return fullText.trim();
};

const ResumeCustomizer = ({ jobTitle, jobDescription, companyName, hasSubscription, onSubscribeClick }: ResumeCustomizerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [optimizedResume, setOptimizedResume] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<"input" | "result">("input");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast({ title: "Invalid file type", description: "Please upload a PDF file.", variant: "destructive" });
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast({ title: "File too large", description: "Maximum file size is 1MB.", variant: "destructive" });
      return;
    }
    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const sendNotification = async () => {
    try {
      await supabase.functions.invoke("notify-resume-builder", {
        body: {
          user_name: user?.user_metadata?.full_name || "Unknown",
          user_email: user?.email || "Unknown",
          job_title: jobTitle,
          company_name: companyName,
        },
      });
    } catch (err) {
      console.error("Failed to send notification:", err);
    }
  };

  const handleCustomize = async () => {
    if (!selectedFile) {
      toast({ title: "Please upload your resume PDF", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const resumeText = await extractTextFromPDF(selectedFile);
      if (!resumeText.trim()) {
        toast({ title: "Could not extract text", description: "The PDF appears to be empty or image-based.", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      const { data, error } = await supabase.functions.invoke("customize-resume", {
        body: { resume_text: resumeText, job_description: jobDescription, job_title: jobTitle, company_name: companyName },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setOptimizedResume(data.optimized_resume);
      setStep("result");
      toast({ title: "Resume built!", description: "Your ATS-friendly resume is ready to download." });
      sendNotification();
    } catch (err: any) {
      console.error("Resume building error:", err);
      toast({ title: "Resume building failed", description: err.message || "Please try again.", variant: "destructive" });
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
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - 2 * margin;
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = margin;
    const lines = optimizedResume.split("\n");

    const addPageIfNeeded = (requiredSpace: number) => {
      if (y + requiredSpace > pageHeight - margin) { doc.addPage(); y = margin; }
    };

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.includes("===") || (trimmed === trimmed.toUpperCase() && trimmed.length > 3 && /^[A-Z\s&]+$/.test(trimmed))) {
        const headerText = trimmed.replace(/===/g, "").trim();
        if (!headerText) return;
        addPageIfNeeded(14);
        y += 4;
        doc.setDrawColor(41, 98, 255);
        doc.setLineWidth(0.8);
        doc.line(margin, y, margin + contentWidth, y);
        y += 6;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(30, 30, 30);
        doc.text(headerText, margin, y);
        y += 7;
      } else if (y === margin && trimmed.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(20, 20, 20);
        const nameLines = doc.splitTextToSize(trimmed, contentWidth);
        addPageIfNeeded(nameLines.length * 8);
        doc.text(nameLines, margin, y);
        y += nameLines.length * 8 + 2;
      } else if (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*")) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        const bulletText = trimmed.replace(/^[•\-*]\s*/, "");
        const wrapped = doc.splitTextToSize(bulletText, contentWidth - 8);
        addPageIfNeeded(wrapped.length * 5);
        doc.text("•", margin + 2, y);
        doc.text(wrapped, margin + 8, y);
        y += wrapped.length * 5 + 1;
      } else if (trimmed === "") {
        y += 3;
      } else {
        const isSubHeader = trimmed.includes("|") || (trimmed.split(" ").length <= 8 && !trimmed.endsWith("."));
        if (isSubHeader && trimmed.length < 80) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10.5);
          doc.setTextColor(40, 40, 40);
        } else {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(50, 50, 50);
        }
        const wrapped = doc.splitTextToSize(trimmed, contentWidth);
        addPageIfNeeded(wrapped.length * 5);
        doc.text(wrapped, margin, y);
        y += wrapped.length * 5 + 1;
      }
    });
    doc.save(`Resume_${jobTitle.replace(/\s+/g, "_")}_ATS.pdf`);
    toast({ title: "PDF Downloaded!", description: "Your professional resume has been saved." });
  };

  const handleReset = () => {
    setStep("input");
    setOptimizedResume("");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!hasSubscription) {
    return (
      <Button variant="outline" className="w-full gap-2 border-muted text-muted-foreground" onClick={onSubscribeClick}>
        <Lock className="w-4 h-4" />
        AI Resume Pro
        <Badge className="ml-1 bg-primary/10 text-primary text-[10px] px-1.5">Premium</Badge>
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) { setStep("input"); setOptimizedResume(""); setSelectedFile(null); } }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full gap-2 border-primary/30 text-primary hover:bg-primary/5">
          <FileText className="w-4 h-4" />
          AI Resume Pro
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Resume Pro
          </DialogTitle>
          <DialogDescription>
            Build your ATS-optimized resume for <strong>{jobTitle}</strong> at <strong>{companyName}</strong>
          </DialogDescription>
        </DialogHeader>

        {step === "input" ? (
          <div className="space-y-4 pt-4">
            <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />How it works
              </h4>
              <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Upload your current resume as a PDF (max 1MB)</li>
                <li>AI analyzes the job description and rebuilds your resume</li>
                <li>Review the professional, ATS-friendly version</li>
                <li>Download as PDF or copy and use it to apply</li>
              </ol>
            </div>
            <div className="space-y-2">
              <Label>Upload your resume (PDF, max 1MB) *</Label>
              {selectedFile ? (
                <div className="flex items-center gap-3 p-4 rounded-lg border border-primary/30 bg-primary/5">
                  <FileText className="w-8 h-8 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleRemoveFile} className="text-destructive hover:text-destructive">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm font-medium">Click to upload your resume</p>
                  <p className="text-xs text-muted-foreground mt-1">PDF format only • Max 1MB</p>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" onChange={handleFileSelect} className="hidden" />
            </div>
            <Button onClick={handleCustomize} disabled={isLoading || !selectedFile} className="w-full cta-primary gap-2">
              {isLoading ? (<><Loader2 className="w-4 h-4 animate-spin" />Building your resume...</>) : (<><Sparkles className="w-4 h-4" />Updated Resume</>)}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 pt-4">
            <div className="rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-3">
              <p className="text-sm font-medium text-primary">✅ Your professional, ATS-optimized resume is ready</p>
            </div>
            <div className="space-y-2">
              <Label>Your New Resume</Label>
              <div className="rounded-lg border bg-card p-4 max-h-[400px] overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap font-sans">{optimizedResume}</pre>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleDownloadPDF} className="flex-1 gap-2 cta-primary"><Download className="w-4 h-4" />Download PDF</Button>
              <Button onClick={handleCopy} variant="outline" className="flex-1 gap-2">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy Text"}
              </Button>
            </div>
            <div className="flex gap-3 pt-2 border-t">
              <Button onClick={handleReset} variant="ghost" className="flex-1">← Upload Different Resume</Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">If satisfied, use this resume to apply. Otherwise, upload a different version and try again.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResumeCustomizer;
