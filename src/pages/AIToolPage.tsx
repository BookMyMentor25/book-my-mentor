import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  Loader2, 
  Download, 
  Copy, 
  Sparkles,
  ArrowLeft,
  TrendingUp,
  Building2,
  Megaphone,
  RefreshCcw,
  Rocket,
  Search,
  Users,
  ListOrdered,
  Kanban,
  RotateCcw,
  ShieldAlert,
  Target,
  Landmark,
  FileText,
  ClipboardList,
  FileCheck
} from 'lucide-react';
import jsPDF from 'jspdf';

const toolConfig: Record<string, { 
  title: string; 
  description: string; 
  icon: React.ElementType;
  placeholder: string;
  color: string;
}> = {
  'market-size': {
    title: 'Market Demand Calculator',
    description: 'Calculate TAM, SAM, and SOM for your product or service',
    icon: TrendingUp,
    placeholder: 'Describe your product or service (e.g., "A mobile app for personal finance management targeting millennials in India")',
    color: 'from-green-500 to-emerald-600'
  },
  'business-model': {
    title: 'Easy Business Plan Creator',
    description: 'Generate a comprehensive Business Model Canvas',
    icon: Building2,
    placeholder: 'Describe your business idea (e.g., "An AI-powered recruitment platform for tech startups")',
    color: 'from-blue-500 to-cyan-600'
  },
  'marketing-strategy': {
    title: 'Marketing Strategy Planner',
    description: 'Develop a complete marketing strategy',
    icon: Megaphone,
    placeholder: 'Describe your product and target audience (e.g., "A SaaS tool for project management targeting remote teams")',
    color: 'from-orange-500 to-amber-600'
  },
  'product-lifecycle': {
    title: 'Product Journey Tracker',
    description: 'Understand your product\'s lifecycle stage',
    icon: RefreshCcw,
    placeholder: 'Describe your product and its current market situation (e.g., "An e-commerce platform launched 2 years ago with growing user base")',
    color: 'from-pink-500 to-rose-600'
  },
  'gtm-strategy': {
    title: 'Launch Your Product Plan',
    description: 'Create a comprehensive GTM plan',
    icon: Rocket,
    placeholder: 'Describe your product and target market (e.g., "A B2B cybersecurity solution for mid-size enterprises")',
    color: 'from-violet-500 to-purple-600'
  },
  'market-research': {
    title: 'Smart Market Insights Helper',
    description: 'Get guidance on market research methodologies',
    icon: Search,
    placeholder: 'Describe what market you want to research (e.g., "The electric vehicle charging infrastructure market in Southeast Asia")',
    color: 'from-teal-500 to-cyan-600'
  },
  'competitor-analysis': {
    title: 'Know Your Competition Tool',
    description: 'Analyze competitors and find opportunities',
    icon: Users,
    placeholder: 'Describe your product and known competitors (e.g., "A food delivery app competing with Swiggy and Zomato")',
    color: 'from-red-500 to-orange-600'
  },
  'rice-framework': {
    title: 'Task Priority Score Tool',
    description: 'Prioritize initiatives based on Reach, Impact, Confidence, and Effort',
    icon: ListOrdered,
    placeholder: 'List the initiatives/features you want to prioritize (e.g., "Feature A: Add payment integration, Feature B: Mobile app redesign, Feature C: Customer support chatbot")',
    color: 'from-indigo-500 to-purple-600'
  },
  'scrum-sprint': {
    title: 'Team Task & Sprint Organizer',
    description: 'Plan and manage projects using Scrum methodology',
    icon: RotateCcw,
    placeholder: 'Describe your project and team (e.g., "E-commerce platform development with a 5-member development team")',
    color: 'from-cyan-500 to-blue-600'
  },
  'kanban': {
    title: 'Simple Task Board Manager',
    description: 'Visualize and optimize workflow using Kanban',
    icon: Kanban,
    placeholder: 'Describe your workflow or process (e.g., "Software development workflow from requirements to deployment")',
    color: 'from-emerald-500 to-teal-600'
  },
  'scrumban': {
    title: 'Flexible Team Workflow Manager',
    description: 'Combine Scrum and Kanban for flexible management',
    icon: RefreshCcw,
    placeholder: 'Describe your team and current process (e.g., "Support team handling both planned features and urgent bug fixes")',
    color: 'from-fuchsia-500 to-pink-600'
  },
  'pdca-cycle': {
    title: 'Continuous Improvement Planner',
    description: 'Systematic improvement using Plan-Do-Check-Act',
    icon: RotateCcw,
    placeholder: 'Describe the problem or process you want to improve (e.g., "Customer onboarding process with 40% drop-off rate")',
    color: 'from-amber-500 to-yellow-600'
  },
  'risk-management': {
    title: 'Business Risk Checker',
    description: 'Identify and mitigate business risks',
    icon: ShieldAlert,
    placeholder: 'Describe your project or business for risk assessment (e.g., "Launching a new fintech product in emerging markets")',
    color: 'from-rose-500 to-red-600'
  },
  'kpi-tracking': {
    title: 'Performance Goals Tracker',
    description: 'Define and track Key Performance Indicators',
    icon: Target,
    placeholder: 'Describe your business/product for KPI recommendations (e.g., "B2B SaaS platform for HR management with 500 enterprise clients")',
    color: 'from-lime-500 to-green-600'
  },
  'ipo-guide': {
    title: 'Easy IPO Preparation Guide',
    description: 'Guidance for Initial Public Offering preparation',
    icon: Landmark,
    placeholder: 'Describe your company for IPO readiness assessment (e.g., "Tech startup with $50M ARR, 200 employees, operating for 5 years")',
    color: 'from-slate-500 to-gray-600'
  },
  'prd-generator': {
    title: 'PRD Document Creator',
    description: 'Generate comprehensive Product Requirement Documents',
    icon: FileText,
    placeholder: 'Describe your product or feature (e.g., "A mobile banking app with biometric authentication and peer-to-peer payment features")',
    color: 'from-sky-500 to-blue-600'
  },
  'scope-statement': {
    title: 'Scope Statement Builder',
    description: 'Create detailed Project Scope Statements',
    icon: ClipboardList,
    placeholder: 'Describe your project (e.g., "Website redesign project for an e-commerce company with 500K monthly visitors")',
    color: 'from-violet-500 to-indigo-600'
  },
  'project-charter': {
    title: 'Project Charter Generator',
    description: 'Build professional Project Charters',
    icon: FileCheck,
    placeholder: 'Describe your project (e.g., "ERP implementation project for a manufacturing company with 3 plants and 500 employees")',
    color: 'from-emerald-500 to-green-600'
  }
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

  const tool = toolId ? toolConfig[toolId] : null;

  if (!tool) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Tool not found</h1>
            <Button onClick={() => navigate('/ai-tools')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to AI Tools
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please describe your product or service');
      return;
    }

    setIsLoading(true);
    try {
      // Track usage in database
      const { error: usageError } = await supabase.from('toolkit_usage').insert({
        user_id: user.id,
        user_email: user.email || '',
        user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
        tool_name: tool.title,
        tool_id: toolId || '',
        prompt: prompt.trim()
      });

      if (usageError) {
        console.error('Failed to track usage:', usageError);
      }

      // Send admin notification (fire and forget)
      supabase.functions.invoke('notify-toolkit-usage', {
        body: {
          userName: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
          userEmail: user.email || '',
          toolName: tool.title,
          toolId: toolId || '',
          prompt: prompt.trim()
        }
      }).catch(err => console.error('Failed to send notification:', err));

      const { data, error } = await supabase.functions.invoke('ai-business-tools', {
        body: { 
          tool: toolId, 
          prompt, 
          industry: industry || undefined, 
          targetMarket: targetMarket || undefined 
        }
      });

      if (error) throw error;
      
      if (data.error) {
        toast.error(data.error);
        return;
      }

      setResult(data.result);
      toast.success('Analysis generated successfully!');
    } catch (error: any) {
      console.error('Error generating analysis:', error);
      toast.error('Failed to generate analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    toast.success('Copied to clipboard!');
  };

  const handleExportPDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    
    // Title
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text(tool.title, margin, 20);
    
    // Subtitle
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100);
    pdf.text(`Generated by BookMyMentor AI Tools - ${new Date().toLocaleDateString()}`, margin, 28);
    
    // Content
    pdf.setFontSize(11);
    pdf.setTextColor(0);
    
    const lines = pdf.splitTextToSize(result, maxWidth);
    let y = 40;
    
    for (let i = 0; i < lines.length; i++) {
      if (y > 280) {
        pdf.addPage();
        y = 20;
      }
      
      // Check for headers (lines starting with **)
      const line = lines[i];
      if (line.includes('**') || line.startsWith('#')) {
        pdf.setFont('helvetica', 'bold');
        pdf.text(line.replace(/\*\*/g, '').replace(/^#+\s*/, ''), margin, y);
        pdf.setFont('helvetica', 'normal');
      } else {
        pdf.text(line, margin, y);
      }
      y += 6;
    }
    
    pdf.save(`${toolId}-analysis-${Date.now()}.pdf`);
    toast.success('PDF exported successfully!');
  };

  const IconComponent = tool.icon;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/ai-tools')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to AI Tools
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4">FREE AI TOOL</Badge>
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center mx-auto mb-4`}>
            <IconComponent className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {tool.title}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {tool.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Describe Your Product/Service
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="prompt">Description *</Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={tool.placeholder}
                  className="h-32 mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="industry">Industry (optional)</Label>
                  <Input
                    id="industry"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g., Healthcare, Fintech"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="targetMarket">Target Market (optional)</Label>
                  <Input
                    id="targetMarket"
                    value={targetMarket}
                    onChange={(e) => setTargetMarket(e.target.value)}
                    placeholder="e.g., India, North America"
                    className="mt-2"
                  />
                </div>
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={isLoading || !prompt.trim()} 
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Analysis...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Analysis
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Result Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Analysis Result</CardTitle>
              {result && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExportPDF}>
                    <Download className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="prose prose-sm max-w-none dark:prose-invert overflow-auto max-h-[500px] p-4 bg-secondary/30 rounded-lg">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {result}
                  </pre>
                </div>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <IconComponent className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p>Your analysis will appear here</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AIToolPage;
