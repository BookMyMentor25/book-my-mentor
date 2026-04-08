import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  Crown, Lock, Zap, Shield, BarChart3, PenTool
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

interface CoverLetterAnalysis {
  overall_summary: string;
  matched_keywords: string[];
  missing_keywords: string[];
  strengths: string[];
  recommendations: string[];
  tone_assessment: string;
}

const CoverLetterTool = () => {
  const { user } = useAuth();
  const { hasActiveSubscription } = useJobSubscription();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [applicantName, setApplicantName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [matchPercentage, setMatchPercentage] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<CoverLetterAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<"input" | "result">("input");
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);

  // Pre-fill from query params (when coming from a job listing)
  useEffect(() => {
    const jt = searchParams.get("jobTitle");
    const cn = searchParams.get("companyName");
    const jd = searchParams.get("jobDescription");
    if (jt) setJobTitle(jt);
    if (cn) setCompanyName(cn);
    if (jd) setJobDescription(jd);
  }, [searchParams]);

  useEffect(() => {
    if (!user) navigate("/auth?redirect=/cover-letter-tool");
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      setApplicantName(user.user_metadata?.full_name || "");
    }
  }, [user]);

  if (user && !hasActiveSubscription) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <Card className="max-w-lg w-full border-primary/20 shadow-xl">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Crown className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Premium Feature</h2>
              <p className="text-muted-foreground">AI Cover Letter Pro is available exclusively for Jobs & Internships subscribers.</p>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-left">
                <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-primary" />ATS-optimized cover letters</div>
                <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-primary" />JD match percentage analysis</div>
                <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-primary" />PDF download & copy</div>
                <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-primary" />Professional, confident tone</div>
              </div>
              <Button onClick={() => navigate("/jobs/subscribe")} className="cta-primary w-full gap-2" size="lg">
                <Crown className="w-5 h-5" /> Subscribe — ₹299 for 3 months
              </Button>
              <Button variant="ghost" onClick={() => navigate("/jobs")} className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />Back to Jobs
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") { toast.error("Please upload a PDF file"); return; }
    if (file.size > MAX_FILE_SIZE) { toast.error("File size must be under 1MB"); return; }
    setSelectedFile(file);
  };

  const handleGenerate = async () => {
    if (!jobDescription.trim()) { toast.error("Job description is required"); return; }
    setIsLoading(true);

    try {
      let resumeText = "";
      if (selectedFile) {
        resumeText = await extractTextFromPDF(selectedFile);
        if (!resumeText.trim()) { toast.error("Could not extract text from PDF"); setIsLoading(false); return; }
      }

      // Track usage
      if (user) {
        await supabase.from("toolkit_usage").insert({
          user_id: user.id,
          user_email: user.email || "",
          user_name: user.user_metadata?.full_name || "",
          tool_id: "cover-letter-pro",
          tool_name: "AI Cover Letter Pro",
          prompt: `Job: ${jobTitle} at ${companyName}`,
        });

        supabase.functions.invoke("notify-toolkit-usage", {
          body: {
            user_name: user.user_metadata?.full_name || "User",
            user_email: user.email,
            tool_name: "AI Cover Letter Pro",
            prompt: `Cover letter for ${jobTitle} at ${companyName}`,
          },
        }).catch(console.error);
      }

      const { data, error } = await supabase.functions.invoke("generate-cover-letter", {
        body: {
          resume_text: resumeText,
          job_description: jobDescription,
          job_title: jobTitle,
          company_name: companyName,
          applicant_name: applicantName,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setCoverLetter(data.cover_letter || "");
      setMatchPercentage(data.match_percentage || null);
      setAnalysis(data.analysis || null);
      setStep("result");
      toast.success("Cover letter generated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate cover letter");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;
    const pageHeight = doc.internal.pageSize.getHeight() - margin * 2;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    
    const lines = doc.splitTextToSize(coverLetter, pageWidth);
    let y = margin;
    
    for (const line of lines) {
      if (y > pageHeight + margin) { doc.addPage(); y = margin; }
      doc.text(line, margin, y);
      y += 6;
    }
    
    doc.save(`Cover_Letter_${companyName || "Professional"}_${jobTitle || "Position"}.pdf`);
    toast.success("PDF downloaded!");
  };

  const getMatchColor = (pct: number) => {
    if (pct >= 80) return "text-green-600";
    if (pct >= 60) return "text-amber-600";
    return "text-red-500";
  };

  const getMatchBg = (pct: number) => {
    if (pct >= 80) return "bg-green-500";
    if (pct >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="AI Cover Letter Pro | ATS-Friendly Cover Letter Generator | BookMyMentor"
        description="Generate professional, ATS-optimized cover letters tailored to any job description. Get JD match score, keyword analysis, and PDF download. Professional, confident tone guaranteed."
        keywords="cover letter generator, ATS cover letter, professional cover letter, job application, cover letter builder, AI cover letter, ATS friendly cover letter, job description match"
      />
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 lg:py-12">
        {/* Back Navigation */}
        <button onClick={() => navigate("/jobs")} className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />Back to Jobs & Internships
        </button>

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm font-medium text-primary mb-4">
            <PenTool className="w-4 h-4" />AI Cover Letter Pro
            <Badge className="bg-primary/20 text-primary text-[10px]">Premium</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Generate <span className="text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">ATS-Optimized</span> Cover Letters
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Professional, confident, and tailored cover letters that match job descriptions. 
            Download as PDF or copy instantly.
          </p>
        </div>

        {step === "input" ? (
          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="border-primary/10">
              <CardContent className="p-6 space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="applicantName">Your Full Name</Label>
                    <Input id="applicantName" value={applicantName} onChange={(e) => setApplicantName(e.target.value)} placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title *</Label>
                    <Input id="jobTitle" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Product Manager" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Google, Microsoft..." />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jd">Job Description & Requirements *</Label>
                  <Textarea id="jd" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste the full job description here..." rows={8} className="resize-none" />
                </div>

                {/* Optional Resume Upload */}
                <div className="space-y-2">
                  <Label>Upload Resume (Optional — for personalized content)</Label>
                  <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-4 text-center">
                    {selectedFile ? (
                      <div className="flex items-center justify-center gap-3">
                        <FileText className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium">{selectedFile.name}</span>
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">PDF only, max 1MB</p>
                        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                          Choose File
                        </Button>
                      </div>
                    )}
                    <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                  </div>
                </div>

                <Button onClick={handleGenerate} disabled={isLoading || !jobDescription.trim()} className="w-full cta-primary gap-2" size="lg">
                  {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" />Generating Cover Letter...</> : <><Sparkles className="w-5 h-5" />Generate ATS Cover Letter</>}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Match Score */}
            {matchPercentage !== null && (
              <Card className="border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      <span className="font-semibold">JD Match Score</span>
                    </div>
                    <span className={`text-3xl font-bold ${getMatchColor(matchPercentage)}`}>{matchPercentage}%</span>
                  </div>
                  <Progress value={matchPercentage} className="h-3" />
                  {analysis?.overall_summary && (
                    <p className="text-sm text-muted-foreground mt-3">{analysis.overall_summary}</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Cover Letter */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />Your Cover Letter
                  </h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1">
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                    <Button size="sm" onClick={handleDownloadPDF} className="gap-1 cta-primary">
                      <Download className="w-4 h-4" />PDF
                    </Button>
                  </div>
                </div>
                <div className="bg-muted/30 rounded-lg p-6 font-mono text-sm whitespace-pre-wrap leading-relaxed border">
                  {coverLetter}
                </div>
              </CardContent>
            </Card>

            {/* Analysis */}
            {analysis && (
              <Card>
                <CardContent className="p-6">
                  <button onClick={() => setShowFullAnalysis(!showFullAnalysis)} className="w-full flex items-center justify-between">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />Detailed Analysis
                    </h3>
                    {showFullAnalysis ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>

                  {showFullAnalysis && (
                    <div className="mt-4 space-y-4">
                      {analysis.tone_assessment && (
                        <div>
                          <h4 className="font-medium text-sm mb-1 flex items-center gap-1"><Shield className="w-4 h-4 text-primary" />Tone Assessment</h4>
                          <p className="text-sm text-muted-foreground">{analysis.tone_assessment}</p>
                        </div>
                      )}

                      {analysis.matched_keywords?.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm mb-2 flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-600" />Matched Keywords</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {analysis.matched_keywords.map((kw, i) => <Badge key={i} className="bg-green-100 text-green-800 text-xs">{kw}</Badge>)}
                          </div>
                        </div>
                      )}

                      {analysis.missing_keywords?.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm mb-2 flex items-center gap-1"><AlertCircle className="w-4 h-4 text-amber-600" />Keywords to Consider</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {analysis.missing_keywords.map((kw, i) => <Badge key={i} variant="outline" className="text-xs">{kw}</Badge>)}
                          </div>
                        </div>
                      )}

                      {analysis.strengths?.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm mb-2 flex items-center gap-1"><TrendingUp className="w-4 h-4 text-primary" />Strengths</h4>
                          <ul className="space-y-1">
                            {analysis.strengths.map((s, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-green-600 flex-shrink-0" />{s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {analysis.recommendations?.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm mb-2 flex items-center gap-1"><Zap className="w-4 h-4 text-amber-600" />Recommendations</h4>
                          <ul className="space-y-1">
                            {analysis.recommendations.map((r, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <AlertCircle className="w-3.5 h-3.5 mt-0.5 text-amber-600 flex-shrink-0" />{r}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => { setStep("input"); setCoverLetter(""); setMatchPercentage(null); setAnalysis(null); }}>
                <ArrowLeft className="w-4 h-4 mr-2" />Generate Another
              </Button>
              <Button variant="outline" onClick={() => navigate("/jobs")}>
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

export default CoverLetterTool;
