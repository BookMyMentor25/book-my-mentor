import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useJobSubscription } from "@/hooks/useJobSubscription";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Loader2, Download, Copy, Check, FileText, Upload, X, Sparkles,
  ArrowLeft, Target, TrendingUp, AlertCircle, CheckCircle2, ChevronDown, ChevronUp,
  Crown, Lock, Zap, Shield, BarChart3
} from "lucide-react";
import jsPDF from "jspdf";

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

interface AnalysisData {
  overall_summary: string;
  matched_skills: string[];
  missing_skills: string[];
  matched_keywords: string[];
  missing_keywords: string[];
  experience_match: string;
  education_match: string;
  recommendations: string[];
  strengths: string[];
  improvement_areas: string[];
}

const ResumeToolkit = () => {
  const { user } = useAuth();
  const { hasActiveSubscription } = useJobSubscription();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [optimizedResume, setOptimizedResume] = useState("");
  const [matchPercentage, setMatchPercentage] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<"input" | "result">("input");
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);

  useEffect(() => {
    if (!user) navigate("/auth?redirect=/ai-tool/ats-resume-builder");
  }, [user, navigate]);

  // Gate behind subscription
  if (user && !hasActiveSubscription) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SEOHead
          title="AI Resume Pro – ATS Resume Builder | Jobs & Internships | BookMyMentor"
          description="Build ATS-optimized resumes tailored to any job description. Get JD match analysis, ATS score, and professional PDF download. Premium feature for Jobs & Internships subscribers."
          keywords="ats resume builder, ai resume pro, ats friendly resume, resume builder ai, job description match, resume optimizer, ats score checker"
          canonicalUrl="https://bookmymentor.com/ai-tool/ats-resume-builder"
        />
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <Card className="max-w-lg w-full border-primary/20 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 p-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold">AI Resume Pro</h1>
              <p className="text-muted-foreground">
                This premium AI tool is exclusively available for Jobs & Internships subscribers. 
                Get ATS-optimized resumes, JD match scores, and more.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <Badge className="bg-primary/10 text-primary gap-1"><Zap className="w-3 h-3" />ATS Optimized</Badge>
                <Badge className="bg-accent/10 text-accent gap-1"><BarChart3 className="w-3 h-3" />Match Score</Badge>
                <Badge className="bg-green-500/10 text-green-600 gap-1"><Download className="w-3 h-3" />PDF Export</Badge>
              </div>
            </div>
            <CardContent className="p-6 space-y-4">
              <Button
                onClick={() => navigate(user ? '/jobs/subscribe' : '/auth?redirect=/jobs/subscribe')}
                className="w-full cta-primary gap-2 py-6 text-base"
              >
                <Crown className="w-5 h-5" /> Subscribe — ₹299 for 3 Months
              </Button>
              <Button variant="outline" onClick={() => navigate('/jobs')} className="w-full gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Jobs & Internships
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Maximum file size is 1MB.");
      return;
    }
    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getMatchColor = (pct: number) => {
    if (pct >= 80) return "text-green-600";
    if (pct >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getMatchLabel = (pct: number) => {
    if (pct >= 90) return "Excellent Match";
    if (pct >= 75) return "Strong Match";
    if (pct >= 60) return "Good Match";
    if (pct >= 40) return "Partial Match";
    return "Needs Improvement";
  };

  const getProgressColor = (pct: number) => {
    if (pct >= 80) return "[&>div]:bg-green-500";
    if (pct >= 60) return "[&>div]:bg-amber-500";
    return "[&>div]:bg-red-500";
  };

  const handleGenerate = async () => {
    if (!selectedFile) {
      toast.error("Please upload your resume PDF.");
      return;
    }
    if (!jobDescription.trim()) {
      toast.error("Please paste the Job Description.");
      return;
    }

    setIsLoading(true);
    try {
      const resumeText = await extractTextFromPDF(selectedFile);
      if (!resumeText.trim()) {
        toast.error("Could not extract text from PDF. It may be image-based.");
        setIsLoading(false);
        return;
      }

      supabase.from("toolkit_usage").insert({
        user_id: user!.id,
        user_email: user!.email || "",
        user_name: user!.user_metadata?.full_name || "",
        tool_name: "AI Resume Pro",
        tool_id: "ats-resume-builder",
        prompt: `Job: ${jobTitle} at ${companyName}`,
      }).then(({ error }) => { if (error) console.error("Usage tracking error:", error); });

      supabase.functions.invoke("notify-resume-builder", {
        body: {
          user_name: user!.user_metadata?.full_name || "Unknown",
          user_email: user!.email || "Unknown",
          job_title: jobTitle || "Not specified",
          company_name: companyName || "Not specified",
        },
      }).catch(err => console.error("Notification error:", err));

      const { data, error } = await supabase.functions.invoke("resume-toolkit", {
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
      setMatchPercentage(data.match_percentage || 0);
      setAnalysis(data.analysis || null);
      setStep("result");
      toast.success("Resume built and analyzed successfully!");
    } catch (err: any) {
      console.error("Resume toolkit error:", err);
      toast.error(err.message || "Failed to generate resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(optimizedResume);
    setCopied(true);
    toast.success("Copied to clipboard!");
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

    const addPageIfNeeded = (space: number) => {
      if (y + space > pageHeight - margin) { doc.addPage(); y = margin; }
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
    doc.save(`Resume_${(jobTitle || "ATS").replace(/\s+/g, "_")}_Optimized.pdf`);
    toast.success("PDF downloaded!");
  };

  const handleReset = () => {
    setStep("input");
    setOptimizedResume("");
    setMatchPercentage(null);
    setAnalysis(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="AI Resume Pro – ATS Resume Builder | Jobs & Internships | BookMyMentor"
        description="Build ATS-optimized resumes tailored to any job description. Get JD match analysis, ATS score, and professional PDF download. Premium feature included with Jobs & Internships subscription."
        keywords="ats resume builder, ai resume pro, ats friendly resume, resume builder ai, job description match, resume optimizer, ats score checker, free resume tool, jobs india"
        canonicalUrl="https://bookmymentor.com/ai-tool/ats-resume-builder"
      />
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <Button variant="ghost" onClick={() => navigate("/jobs")} className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs & Internships
        </Button>

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-accent/10 px-5 py-2.5 rounded-full mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">AI Resume Pro</span>
            <Badge className="bg-primary/10 text-primary text-xs gap-1"><Crown className="w-3 h-3" />Premium</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
            Build Your <span className="text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">ATS-Optimized</span> Resume
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Upload your resume, paste the job description, and get an AI-optimized resume with detailed JD match analysis and ATS compatibility score.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground"><Shield className="w-4 h-4 text-green-500" />ATS Optimized</div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground"><BarChart3 className="w-4 h-4 text-primary" />JD Match Score</div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground"><Download className="w-4 h-4 text-accent" />PDF Download</div>
          </div>
        </div>

        {step === "input" ? (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Upload */}
            <Card className="border-primary/10 shadow-lg">
              <CardContent className="p-6 space-y-5">
                <div>
                  <Label className="text-base font-semibold mb-2 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-primary" /> Upload Resume (PDF)
                  </Label>
                  {selectedFile ? (
                    <div className="flex items-center gap-3 p-4 rounded-lg border border-primary/30 bg-primary/5 mt-2">
                      <FileText className="w-8 h-8 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(0)} KB</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={handleRemoveFile} className="text-destructive">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all mt-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                      <p className="text-sm font-medium">Click to upload</p>
                      <p className="text-xs text-muted-foreground mt-1">PDF only • Max 1MB</p>
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" onChange={handleFileSelect} className="hidden" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Job Title</Label>
                    <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Software Engineer" className="mt-1" />
                  </div>
                  <div>
                    <Label>Company</Label>
                    <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. Google" className="mt-1" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right: JD */}
            <Card className="border-primary/10 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label className="text-base font-semibold mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" /> Job Description *
                  </Label>
                  <Textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description here including requirements, responsibilities, and qualifications..."
                    className="min-h-[240px] mt-2"
                  />
                </div>

                <div className="rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 p-4 space-y-2 border border-primary/10">
                  <h4 className="text-sm font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-primary" /> What you'll get
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" />ATS-optimized resume tailored to the JD</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" />JD match percentage & detailed analysis</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" />Skills gap identification & recommendations</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" />Professional PDF download</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <div className="md:col-span-2">
              <Button
                onClick={handleGenerate}
                disabled={isLoading || !selectedFile || !jobDescription.trim()}
                className="w-full cta-primary gap-2 py-6 text-base"
              >
                {isLoading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" />Analyzing & Building Resume...</>
                ) : (
                  <><Sparkles className="w-5 h-5" />Build ATS Resume & Analyze Match</>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Match Score Card */}
            {matchPercentage !== null && (
              <Card className="border-primary/20 overflow-hidden shadow-lg">
                <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 p-6 md:p-8">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="text-center md:text-left flex-shrink-0">
                      <p className="text-sm text-muted-foreground mb-1">JD Match Score</p>
                      <div className={`text-5xl md:text-6xl font-bold ${getMatchColor(matchPercentage)}`}>
                        {matchPercentage}%
                      </div>
                      <Badge className={`mt-2 ${matchPercentage >= 75 ? 'bg-green-500/10 text-green-600' : matchPercentage >= 60 ? 'bg-amber-500/10 text-amber-600' : 'bg-red-500/10 text-red-600'}`}>
                        {getMatchLabel(matchPercentage)}
                      </Badge>
                    </div>
                    <div className="flex-1 w-full">
                      <Progress value={matchPercentage} className={`h-3 mb-3 ${getProgressColor(matchPercentage)}`} />
                      {analysis?.overall_summary && (
                        <p className="text-sm text-muted-foreground">{analysis.overall_summary}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Analysis Card */}
            {analysis && (
              <Card className="border-primary/10 shadow-lg">
                <CardContent className="p-6">
                  <button
                    className="w-full flex items-center justify-between text-left"
                    onClick={() => setShowFullAnalysis(!showFullAnalysis)}
                  >
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Detailed Match Analysis
                    </h3>
                    {showFullAnalysis ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>

                  {showFullAnalysis && (
                    <div className="mt-6 space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        {analysis.matched_skills?.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-green-600 flex items-center gap-1 mb-2"><CheckCircle2 className="w-4 h-4" />Matched Skills</h4>
                            <div className="flex flex-wrap gap-1.5">{analysis.matched_skills.map((s, i) => <Badge key={i} variant="secondary" className="bg-green-50 text-green-700 text-xs">{s}</Badge>)}</div>
                          </div>
                        )}
                        {analysis.missing_skills?.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-red-600 flex items-center gap-1 mb-2"><AlertCircle className="w-4 h-4" />Missing Skills</h4>
                            <div className="flex flex-wrap gap-1.5">{analysis.missing_skills.map((s, i) => <Badge key={i} variant="secondary" className="bg-red-50 text-red-700 text-xs">{s}</Badge>)}</div>
                          </div>
                        )}
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        {analysis.matched_keywords?.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2">✅ Matched Keywords</h4>
                            <div className="flex flex-wrap gap-1.5">{analysis.matched_keywords.map((k, i) => <Badge key={i} variant="outline" className="text-xs">{k}</Badge>)}</div>
                          </div>
                        )}
                        {analysis.missing_keywords?.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2">⚠️ Missing Keywords</h4>
                            <div className="flex flex-wrap gap-1.5">{analysis.missing_keywords.map((k, i) => <Badge key={i} variant="outline" className="text-xs border-amber-300 text-amber-700">{k}</Badge>)}</div>
                          </div>
                        )}
                      </div>

                      {analysis.experience_match && (
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div><h4 className="text-sm font-semibold mb-1">Experience Match</h4><p className="text-sm text-muted-foreground">{analysis.experience_match}</p></div>
                          {analysis.education_match && <div><h4 className="text-sm font-semibold mb-1">Education Match</h4><p className="text-sm text-muted-foreground">{analysis.education_match}</p></div>}
                        </div>
                      )}

                      {analysis.strengths?.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-green-600 mb-2">💪 Strengths</h4>
                          <ul className="space-y-1">{analysis.strengths.map((s, i) => <li key={i} className="text-sm text-muted-foreground flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-green-500 flex-shrink-0" />{s}</li>)}</ul>
                        </div>
                      )}

                      {analysis.recommendations?.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-primary mb-2">💡 Recommendations</h4>
                          <ul className="space-y-1">{analysis.recommendations.map((r, i) => <li key={i} className="text-sm text-muted-foreground flex items-start gap-2"><Sparkles className="w-3.5 h-3.5 mt-0.5 text-primary flex-shrink-0" />{r}</li>)}</ul>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Resume Preview */}
            <Card className="border-primary/10 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Optimized Resume
                  </h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                    <Button size="sm" onClick={handleDownloadPDF} className="gap-1.5 cta-primary">
                      <Download className="w-4 h-4" />Download PDF
                    </Button>
                  </div>
                </div>
                <div className="bg-muted/30 rounded-xl p-6 max-h-[500px] overflow-y-auto border">
                  <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">{optimizedResume}</pre>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleReset} className="gap-2 flex-1">
                <ArrowLeft className="w-4 h-4" />Try Another Resume
              </Button>
              <Button onClick={() => navigate('/jobs')} className="gap-2 flex-1" variant="outline">
                Browse Jobs
              </Button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ResumeToolkit;
