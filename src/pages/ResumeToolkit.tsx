import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
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
  ArrowLeft, Target, TrendingUp, AlertCircle, CheckCircle2, ChevronDown, ChevronUp
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
    if (!user) navigate("/auth");
  }, [user, navigate]);

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

      // Track usage
      supabase.from("toolkit_usage").insert({
        user_id: user.id,
        user_email: user.email || "",
        user_name: user.user_metadata?.full_name || "",
        tool_name: "ATS Resume Builder",
        tool_id: "ats-resume-builder",
        prompt: `Job: ${jobTitle} at ${companyName}`,
      }).then(({ error }) => { if (error) console.error("Usage tracking error:", error); });

      // Send notification
      supabase.functions.invoke("notify-resume-builder", {
        body: {
          user_name: user.user_metadata?.full_name || "Unknown",
          user_email: user.email || "Unknown",
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
        title="ATS Resume Builder - Free AI Tool | BookMyMentor"
        description="Build ATS-optimized resumes tailored to any job description. Get JD match analysis, ATS score, and professional PDF download. Free for registered users."
        keywords="ats resume builder, ats friendly resume, resume builder ai, job description match, resume optimizer, ats score checker, free resume tool"
        canonicalUrl="https://bookmymentor.com/ai-tool/ats-resume-builder"
      />
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <Button variant="ghost" onClick={() => navigate("/ai-tools")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to AI Tools
        </Button>

        {/* Hero */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-accent/10 px-4 py-2 rounded-full mb-4">
            <FileText className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">ATS Resume Builder</span>
            <Badge className="bg-green-500/10 text-green-600 text-xs">Free</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Build Your ATS-Optimized Resume
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload your resume, paste the job description, and get an AI-optimized resume with detailed JD match analysis and ATS compatibility score.
          </p>
        </div>

        {step === "input" ? (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Upload */}
            <Card className="border-primary/10">
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
                      className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all mt-2"
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
            <Card className="border-primary/10">
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

                <div className="rounded-lg bg-muted/50 p-3 space-y-1">
                  <h4 className="text-xs font-medium flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" /> What you get
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-0.5">
                    <li>• ATS-optimized resume tailored to the JD</li>
                    <li>• JD match percentage & detailed analysis</li>
                    <li>• Skills gap identification & recommendations</li>
                    <li>• Professional PDF download</li>
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
              <Card className="border-primary/20 overflow-hidden">
                <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="text-center md:text-left flex-shrink-0">
                      <p className="text-sm text-muted-foreground mb-1">JD Match Score</p>
                      <div className={`text-5xl font-bold ${getMatchColor(matchPercentage)}`}>
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
              <Card className="border-primary/10">
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
                    <div className="mt-4 space-y-5">
                      {/* Matched vs Missing Skills */}
                      <div className="grid md:grid-cols-2 gap-4">
                        {analysis.matched_skills?.length > 0 && (
                          <div className="rounded-lg bg-green-50 dark:bg-green-950/20 p-4">
                            <h4 className="text-sm font-semibold text-green-700 dark:text-green-400 flex items-center gap-1.5 mb-2">
                              <CheckCircle2 className="w-4 h-4" /> Matched Skills ({analysis.matched_skills.length})
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {analysis.matched_skills.map((s, i) => (
                                <Badge key={i} variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs border-green-200">{s}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {analysis.missing_skills?.length > 0 && (
                          <div className="rounded-lg bg-red-50 dark:bg-red-950/20 p-4">
                            <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 flex items-center gap-1.5 mb-2">
                              <AlertCircle className="w-4 h-4" /> Missing Skills ({analysis.missing_skills.length})
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {analysis.missing_skills.map((s, i) => (
                                <Badge key={i} variant="outline" className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs border-red-200">{s}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Keywords */}
                      <div className="grid md:grid-cols-2 gap-4">
                        {analysis.matched_keywords?.length > 0 && (
                          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-4">
                            <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">✅ Matched Keywords</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {analysis.matched_keywords.map((k, i) => (
                                <Badge key={i} variant="outline" className="text-xs bg-blue-100 dark:bg-blue-900/30 border-blue-200">{k}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {analysis.missing_keywords?.length > 0 && (
                          <div className="rounded-lg bg-orange-50 dark:bg-orange-950/20 p-4">
                            <h4 className="text-sm font-semibold text-orange-700 dark:text-orange-400 mb-2">⚠️ Missing Keywords</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {analysis.missing_keywords.map((k, i) => (
                                <Badge key={i} variant="outline" className="text-xs bg-orange-100 dark:bg-orange-900/30 border-orange-200">{k}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Experience & Education Match */}
                      <div className="grid md:grid-cols-2 gap-4">
                        {analysis.experience_match && (
                          <div className="rounded-lg bg-muted/50 p-4">
                            <h4 className="text-sm font-semibold mb-1">💼 Experience Match</h4>
                            <p className="text-sm text-muted-foreground">{analysis.experience_match}</p>
                          </div>
                        )}
                        {analysis.education_match && (
                          <div className="rounded-lg bg-muted/50 p-4">
                            <h4 className="text-sm font-semibold mb-1">🎓 Education Match</h4>
                            <p className="text-sm text-muted-foreground">{analysis.education_match}</p>
                          </div>
                        )}
                      </div>

                      {/* Strengths & Improvements */}
                      <div className="grid md:grid-cols-2 gap-4">
                        {analysis.strengths?.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-green-600 mb-2">💪 Strengths</h4>
                            <ul className="space-y-1">
                              {analysis.strengths.map((s, i) => (
                                <li key={i} className="text-sm text-muted-foreground flex items-start gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" /> {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {analysis.improvement_areas?.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-amber-600 mb-2">🔧 Areas to Improve</h4>
                            <ul className="space-y-1">
                              {analysis.improvement_areas.map((a, i) => (
                                <li key={i} className="text-sm text-muted-foreground flex items-start gap-1.5">
                                  <AlertCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" /> {a}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Recommendations */}
                      {analysis.recommendations?.length > 0 && (
                        <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                          <h4 className="text-sm font-semibold text-primary mb-2">💡 Recommendations</h4>
                          <ul className="space-y-1.5">
                            {analysis.recommendations.map((r, i) => (
                              <li key={i} className="text-sm text-muted-foreground">{i + 1}. {r}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Resume Output */}
            <Card className="border-primary/10">
              <CardContent className="p-6">
                <Label className="text-base font-semibold">Your ATS-Optimized Resume</Label>
                <div className="rounded-lg border bg-card p-4 max-h-[400px] overflow-y-auto mt-2">
                  <pre className="text-sm whitespace-pre-wrap font-sans">{optimizedResume}</pre>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleDownloadPDF} className="flex-1 gap-2 cta-primary">
                <Download className="w-4 h-4" /> Download PDF
              </Button>
              <Button onClick={handleCopy} variant="outline" className="flex-1 gap-2">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy Text"}
              </Button>
            </div>

            <div className="flex gap-3 pt-2 border-t">
              <Button onClick={handleReset} variant="ghost" className="flex-1">
                ← Build Another Resume
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
