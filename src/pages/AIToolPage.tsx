import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SEOHead, generateBreadcrumbSchema } from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  Loader2, Download, Copy, Sparkles, ArrowLeft, TrendingUp, Building2, Megaphone,
  RefreshCcw, Rocket, Search, Users, ListOrdered, Kanban, RotateCcw, ShieldAlert,
  Target, Landmark, FileText, ClipboardList, FileCheck, UserCircle, Gem, UserPlus,
  AlertTriangle, BookOpen, Calendar, PenTool, ClipboardCheck, MessageSquare,
  BarChart3, Bot, Wand2, CheckCircle2, Zap
} from 'lucide-react';
import jsPDF from 'jspdf';

const toolConfig: Record<string, { 
  title: string; description: string; icon: React.ElementType; placeholder: string; color: string;
}> = {
  'market-size': { title: 'Market Demand Calculator', description: 'Calculate TAM, SAM, and SOM for your product or service', icon: TrendingUp, placeholder: 'Describe your product or service (e.g., "A mobile app for personal finance management targeting millennials in India")', color: 'from-green-500 to-emerald-600' },
  'business-model': { title: 'Easy Business Plan Creator', description: 'Generate a comprehensive Business Model Canvas', icon: Building2, placeholder: 'Describe your business idea (e.g., "An AI-powered recruitment platform for tech startups")', color: 'from-blue-500 to-cyan-600' },
  'marketing-strategy': { title: 'Marketing Strategy Planner', description: 'Develop a complete marketing strategy', icon: Megaphone, placeholder: 'Describe your product and target audience (e.g., "A SaaS tool for project management targeting remote teams")', color: 'from-orange-500 to-amber-600' },
  'product-lifecycle': { title: 'Product Journey Tracker', description: "Understand your product's lifecycle stage", icon: RefreshCcw, placeholder: 'Describe your product and its current market situation', color: 'from-pink-500 to-rose-600' },
  'gtm-strategy': { title: 'Launch Your Product Plan', description: 'Create a comprehensive GTM plan', icon: Rocket, placeholder: 'Describe your product and target market', color: 'from-violet-500 to-purple-600' },
  'market-research': { title: 'Smart Market Insights Helper', description: 'Get guidance on market research methodologies', icon: Search, placeholder: 'Describe what market you want to research', color: 'from-teal-500 to-cyan-600' },
  'competitor-analysis': { title: 'Know Your Competition Tool', description: 'Analyze competitors and find opportunities', icon: Users, placeholder: 'Describe your product and known competitors', color: 'from-red-500 to-orange-600' },
  'rice-framework': { title: 'Task Priority Score Tool', description: 'Prioritize initiatives based on RICE', icon: ListOrdered, placeholder: 'List the initiatives/features you want to prioritize', color: 'from-indigo-500 to-purple-600' },
  'scrum-sprint': { title: 'Team Task & Sprint Organizer', description: 'Plan and manage projects using Scrum', icon: RotateCcw, placeholder: 'Describe your project and team', color: 'from-cyan-500 to-blue-600' },
  'kanban': { title: 'Simple Task Board Manager', description: 'Visualize and optimize workflow using Kanban', icon: Kanban, placeholder: 'Describe your workflow or process', color: 'from-emerald-500 to-teal-600' },
  'scrumban': { title: 'Flexible Team Workflow Manager', description: 'Combine Scrum and Kanban for flexible management', icon: RefreshCcw, placeholder: 'Describe your team and current process', color: 'from-fuchsia-500 to-pink-600' },
  'pdca-cycle': { title: 'Continuous Improvement Planner', description: 'Systematic improvement using Plan-Do-Check-Act', icon: RotateCcw, placeholder: 'Describe the problem or process you want to improve', color: 'from-amber-500 to-yellow-600' },
  'risk-management': { title: 'Business Risk Checker', description: 'Identify and mitigate business risks', icon: ShieldAlert, placeholder: 'Describe your project or business for risk assessment', color: 'from-rose-500 to-red-600' },
  'kpi-tracking': { title: 'Performance Goals Tracker', description: 'Define and track Key Performance Indicators', icon: Target, placeholder: 'Describe your business/product for KPI recommendations', color: 'from-lime-500 to-green-600' },
  'ipo-guide': { title: 'Easy IPO Preparation Guide', description: 'Guidance for Initial Public Offering preparation', icon: Landmark, placeholder: 'Describe your company for IPO readiness assessment', color: 'from-slate-500 to-gray-600' },
  'prd-generator': { title: 'PRD Document Creator', description: 'Generate comprehensive Product Requirement Documents', icon: FileText, placeholder: 'Describe your product or feature', color: 'from-sky-500 to-blue-600' },
  'scope-statement': { title: 'Scope Statement Builder', description: 'Create detailed Project Scope Statements', icon: ClipboardList, placeholder: 'Describe your project', color: 'from-violet-500 to-indigo-600' },
  'project-charter': { title: 'Project Charter Generator', description: 'Build professional Project Charters', icon: FileCheck, placeholder: 'Describe your project', color: 'from-emerald-500 to-green-600' },
  'user-persona': { title: 'User Persona Generator', description: 'Create detailed customer personas', icon: UserCircle, placeholder: 'Describe your target audience', color: 'from-pink-500 to-rose-600' },
  'value-proposition': { title: 'Value Proposition Canvas', description: 'Define customer jobs-to-be-done and product-market fit', icon: Gem, placeholder: 'Describe your product and target customer', color: 'from-amber-500 to-orange-600' },
  'stakeholder-analysis': { title: 'Stakeholder Analysis Matrix', description: 'Identify and prioritize stakeholders', icon: UserPlus, placeholder: 'Describe your project and key parties involved', color: 'from-cyan-500 to-teal-600' },
  'risk-register': { title: 'Risk Register Builder', description: 'Document project risks with severity scoring', icon: AlertTriangle, placeholder: 'Describe your project for risk identification', color: 'from-red-500 to-rose-600' },
  'user-story': { title: 'User Story Generator', description: 'Create well-formatted user stories with acceptance criteria', icon: BookOpen, placeholder: 'Describe the feature or functionality', color: 'from-blue-500 to-indigo-600' },
  'sprint-planning': { title: 'Sprint Planning Assistant', description: 'Plan sprints with effort estimation', icon: Calendar, placeholder: 'Describe your team and upcoming work', color: 'from-green-500 to-teal-600' },
  'wireframe-requirements': { title: 'Wireframe Requirements Spec', description: 'Define UI/UX requirements and wireframe documentation', icon: PenTool, placeholder: 'Describe the screen or feature', color: 'from-violet-500 to-purple-600' },
  'launch-checklist': { title: 'Launch Checklist Generator', description: 'Comprehensive go-live checklists', icon: ClipboardCheck, placeholder: 'Describe your product launch', color: 'from-emerald-500 to-green-600' },
  'retrospective': { title: 'Retrospective Facilitator', description: 'Guide retrospectives with structured templates', icon: MessageSquare, placeholder: 'Describe your team and sprint context', color: 'from-indigo-500 to-blue-600' },
  'feedback-analyzer': { title: 'Customer Feedback Analyzer', description: 'Categorize and prioritize customer feedback', icon: BarChart3, placeholder: 'Paste or describe customer feedback', color: 'from-teal-500 to-cyan-600' },
  'agentic-ai': { title: 'Agentic AI Implementation Guide', description: 'Build AI assistants that take actions and complete tasks autonomously', icon: Bot, placeholder: 'Describe what you want your AI agent to do', color: 'from-indigo-500 to-blue-600' },
  'generative-ai': { title: 'Generative AI Use Case Finder', description: 'Discover practical AI use cases for your business', icon: Wand2, placeholder: 'Describe your business or task', color: 'from-purple-500 to-pink-600' },
  'app-prototype': { title: 'App Prototype Generator', description: 'Turn your idea into a detailed prototype specification', icon: Rocket, placeholder: 'Describe your app or website idea', color: 'from-cyan-500 to-blue-600' }
};

const AIToolPage = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [prompt, setPrompt] = useState('');
  const [industry, setIndustry] = useState('');
  const [targetMarket, setTargetMarket] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const tool = toolId ? toolConfig[toolId] : null;

  if (!tool) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-foreground">Tool not found</h1>
            <Button onClick={() => navigate('/ai-tools')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to AI Tools
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) { navigate('/auth'); return null; }

  const handleGenerate = async () => {
    if (!prompt.trim()) { toast.error('Please describe your product or service'); return; }
    setIsLoading(true);
    try {
      const { error: usageError } = await supabase.from('toolkit_usage').insert({
        user_id: user.id, user_email: user.email || '',
        user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
        tool_name: tool.title, tool_id: toolId || '', prompt: prompt.trim()
      });
      if (usageError) console.error('Failed to track usage:', usageError);

      supabase.functions.invoke('notify-toolkit-usage', {
        body: {
          userName: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
          userEmail: user.email || '', toolName: tool.title, toolId: toolId || '', prompt: prompt.trim()
        }
      }).catch(err => console.error('Failed to send notification:', err));

      const { data, error } = await supabase.functions.invoke('ai-business-tools', {
        body: { tool: toolId, prompt, industry: industry || undefined, targetMarket: targetMarket || undefined }
      });
      if (error) throw error;
      if (data.error) { toast.error(data.error); return; }
      setResult(data.result);
      toast.success('Analysis generated successfully!');
    } catch (error: any) {
      console.error('Error generating analysis:', error);
      toast.error('Failed to generate analysis. Please try again.');
    } finally { setIsLoading(false); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setIsCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleExportPDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    pdf.setFontSize(18); pdf.setFont('helvetica', 'bold');
    pdf.text(tool.title, margin, 20);
    pdf.setFontSize(10); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(100);
    pdf.text(`Generated by BookMyMentor AI Tools - ${new Date().toLocaleDateString()}`, margin, 28);
    pdf.setFontSize(11); pdf.setTextColor(0);
    const lines = pdf.splitTextToSize(result, maxWidth);
    let y = 40;
    for (let i = 0; i < lines.length; i++) {
      if (y > 280) { pdf.addPage(); y = 20; }
      const line = lines[i];
      if (line.includes('**') || line.startsWith('#')) {
        pdf.setFont('helvetica', 'bold');
        pdf.text(line.replace(/\*\*/g, '').replace(/^#+\s*/, ''), margin, y);
        pdf.setFont('helvetica', 'normal');
      } else { pdf.text(line, margin, y); }
      y += 6;
    }
    pdf.save(`${toolId}-analysis-${Date.now()}.pdf`);
    toast.success('PDF exported successfully!');
  };

  const IconComponent = tool.icon;

  const breadcrumbData = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://bookmymentor.com/' },
    { name: 'AI Business Toolkit', url: 'https://bookmymentor.com/ai-tools' },
    { name: tool.title, url: `https://bookmymentor.com/ai-tool/${toolId}` }
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead 
        title={`${tool.title} - Free AI Tool | BookMyMentor Business Toolkit`}
        description={`${tool.description}. Free AI-powered ${tool.title} for Product Managers, Entrepreneurs & Startups. Generate professional insights in seconds.`}
        keywords={`${tool.title.toLowerCase()}, free ${tool.title.toLowerCase()} tool, AI ${tool.title.toLowerCase()}, product management tools, business toolkit, startup tools, entrepreneur tools`}
        canonicalUrl={`https://bookmymentor.com/ai-tool/${toolId}`}
        structuredData={breadcrumbData}
      />
      <Header />
      
      <main className="flex-1">
        {/* Tool Header */}
        <section className="relative overflow-hidden py-10 md:py-14 border-b border-border/30">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/3" />
          <div className="container mx-auto px-4 relative z-10">
            {/* Breadcrumb */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/ai-tools')}
              className="mb-6 text-muted-foreground hover:text-foreground -ml-2"
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to All Tools
            </Button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                <IconComponent className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-semibold bg-primary/10 text-primary border-0">
                    Free AI Tool
                  </Badge>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight">
                  {tool.title}
                </h1>
                <p className="text-muted-foreground mt-1 max-w-2xl text-sm sm:text-base">
                  {tool.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
              {/* Input Section - 2/5 width */}
              <div className="lg:col-span-2">
                <Card className="border-border/40 shadow-sm sticky top-20">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Describe Your Product
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="prompt" className="text-sm font-medium">
                        Description <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={tool.placeholder}
                        className="h-28 mt-1.5 resize-none text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="industry" className="text-sm font-medium">Industry</Label>
                        <Input
                          id="industry"
                          value={industry}
                          onChange={(e) => setIndustry(e.target.value)}
                          placeholder="e.g., Healthcare"
                          className="mt-1.5 text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="targetMarket" className="text-sm font-medium">Target Market</Label>
                        <Input
                          id="targetMarket"
                          value={targetMarket}
                          onChange={(e) => setTargetMarket(e.target.value)}
                          placeholder="e.g., India"
                          className="mt-1.5 text-sm"
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={handleGenerate} 
                      disabled={isLoading || !prompt.trim()} 
                      className="w-full cta-primary rounded-xl"
                      size="lg"
                    >
                      {isLoading ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
                      ) : (
                        <><Zap className="h-4 w-4 mr-2" /> Generate Analysis</>
                      )}
                    </Button>

                    {/* Quick tips */}
                    <div className="bg-secondary/40 rounded-lg p-3 border border-border/30">
                      <p className="text-xs font-medium text-muted-foreground mb-1.5">💡 Tips for best results:</p>
                      <ul className="text-xs text-muted-foreground space-y-0.5">
                        <li>• Be specific about your product/service</li>
                        <li>• Include target audience details</li>
                        <li>• Mention industry & market region</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Result Section - 3/5 width */}
              <div className="lg:col-span-3">
                <Card className="border-border/40 shadow-sm min-h-[500px] flex flex-col">
                  <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/30">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                      Analysis Result
                    </CardTitle>
                    {result && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleCopy} className="text-xs h-8">
                          {isCopied ? <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-green-600" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                          {isCopied ? 'Copied' : 'Copy'}
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleExportPDF} className="text-xs h-8">
                          <Download className="h-3.5 w-3.5 mr-1" />
                          PDF
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="flex-1 pt-4">
                    {result ? (
                      <div className="prose prose-sm max-w-none dark:prose-invert overflow-auto max-h-[600px] p-5 bg-secondary/20 rounded-xl border border-border/20">
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
                          {result}
                        </pre>
                      </div>
                    ) : (
                      <div className="h-full min-h-[400px] flex items-center justify-center text-muted-foreground border-2 border-dashed border-border/40 rounded-xl bg-secondary/10">
                        <div className="text-center px-6">
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.color} opacity-20 flex items-center justify-center mx-auto mb-4`}>
                            <IconComponent className="h-8 w-8" />
                          </div>
                          <p className="font-medium mb-1">Your analysis will appear here</p>
                          <p className="text-xs text-muted-foreground/70">Fill in the details on the left and click Generate</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AIToolPage;
