import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wand2, 
  TrendingUp, 
  Building2, 
  Megaphone, 
  RefreshCcw, 
  Rocket, 
  Search, 
  Users,
  ArrowRight,
  Lock,
  Sparkles,
  ListOrdered,
  Kanban,
  RotateCcw,
  ShieldAlert,
  Target,
  LineChart,
  Landmark,
  FileText,
  ClipboardList,
  FileCheck,
  Lightbulb,
  Layers,
  CheckCircle2
} from 'lucide-react';

// Tools organized chronologically by Product Lifecycle stages
const lifecycleStages = [
  {
    id: 'ideation',
    name: 'Ideation & Research',
    description: 'Discover opportunities and validate your idea',
    icon: Lightbulb,
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'planning',
    name: 'Planning & Documentation',
    description: 'Create foundational documents and plans',
    icon: FileText,
    color: 'from-blue-500 to-indigo-500'
  },
  {
    id: 'development',
    name: 'Development & Execution',
    description: 'Build and manage your product development',
    icon: Layers,
    color: 'from-purple-500 to-violet-500'
  },
  {
    id: 'launch',
    name: 'Launch & Growth',
    description: 'Take your product to market and scale',
    icon: Rocket,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'optimization',
    name: 'Optimization & Maturity',
    description: 'Monitor, improve, and prepare for the future',
    icon: CheckCircle2,
    color: 'from-teal-500 to-cyan-500'
  }
];

const aiTools = [
  // Stage 1: Ideation & Research
  {
    id: 'market-research',
    title: 'Smart Market Insights Helper',
    description: 'Get guidance on primary and secondary market research methodologies and frameworks.',
    icon: Search,
    color: 'from-teal-500 to-cyan-600',
    route: '/ai-tool/market-research',
    features: ['PESTLE analysis', 'Porter\'s Five Forces', 'Survey templates'],
    stage: 'ideation'
  },
  {
    id: 'market-size',
    title: 'Market Demand Calculator',
    description: 'Calculate TAM, SAM, and SOM for your product or service with AI-powered market analysis.',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-600',
    route: '/ai-tool/market-size',
    features: ['TAM/SAM/SOM analysis', 'CAGR projections', 'Industry benchmarks'],
    stage: 'ideation'
  },
  {
    id: 'competitor-analysis',
    title: 'Know Your Competition Tool',
    description: 'Analyze competitors, identify competitive advantages, and find market opportunities.',
    icon: Users,
    color: 'from-red-500 to-orange-600',
    route: '/ai-tool/competitor-analysis',
    features: ['Competitor profiling', 'Feature comparison', 'Gap analysis'],
    stage: 'ideation'
  },
  {
    id: 'business-model',
    title: 'Easy Business Plan Creator',
    description: 'Generate comprehensive Business Model Canvas with AI assistance for your startup or product.',
    icon: Building2,
    color: 'from-blue-500 to-cyan-600',
    route: '/ai-tool/business-model',
    features: ['Full BMC framework', 'Revenue stream ideas', 'Partnership strategies'],
    stage: 'ideation'
  },
  
  // Stage 2: Planning & Documentation
  {
    id: 'project-charter',
    title: 'Project Charter Generator',
    description: 'Build professional Project Charters with objectives, stakeholders, and success criteria.',
    icon: FileCheck,
    color: 'from-emerald-500 to-green-600',
    route: '/ai-tool/project-charter',
    features: ['Charter template', 'RACI matrix', 'Milestone planning'],
    stage: 'planning'
  },
  {
    id: 'scope-statement',
    title: 'Scope Statement Builder',
    description: 'Create detailed Project Scope Statements defining boundaries, deliverables, and constraints.',
    icon: ClipboardList,
    color: 'from-violet-500 to-indigo-600',
    route: '/ai-tool/scope-statement',
    features: ['Scope definition', 'Deliverables list', 'Exclusions & assumptions'],
    stage: 'planning'
  },
  {
    id: 'prd-generator',
    title: 'PRD Document Creator',
    description: 'Generate comprehensive Product Requirement Documents with proper format and structure.',
    icon: FileText,
    color: 'from-sky-500 to-blue-600',
    route: '/ai-tool/prd-generator',
    features: ['PRD template', 'User stories', 'Acceptance criteria'],
    stage: 'planning'
  },
  {
    id: 'wireframe',
    title: 'Quick App & Website Layout Maker',
    description: 'Create interactive wireframe mockups from natural language descriptions. Drag, drop, and export your designs.',
    icon: Wand2,
    color: 'from-purple-500 to-indigo-600',
    route: '/wireframe-tool',
    features: ['Visual drag-drop editor', 'Multiple style presets', 'Export to PDF/JSON'],
    stage: 'planning'
  },
  {
    id: 'risk-management',
    title: 'Business Risk Checker',
    description: 'Identify, assess, and mitigate risks with comprehensive risk management frameworks.',
    icon: ShieldAlert,
    color: 'from-rose-500 to-red-600',
    route: '/ai-tool/risk-management',
    features: ['Risk matrix', 'Mitigation plans', 'Contingency planning'],
    stage: 'planning'
  },
  
  // Stage 3: Development & Execution
  {
    id: 'rice-framework',
    title: 'Task Priority Score Tool',
    description: 'Prioritize work based on Reach, Impact, Confidence, and Effort for high ROI initiatives.',
    icon: ListOrdered,
    color: 'from-indigo-500 to-purple-600',
    route: '/ai-tool/rice-framework',
    features: ['RICE score calculation', 'Priority ranking', 'ROI analysis'],
    stage: 'development'
  },
  {
    id: 'scrum-sprint',
    title: 'Team Task & Sprint Organizer',
    description: 'Plan and manage projects using Scrum methodology with sprint planning and tracking.',
    icon: RotateCcw,
    color: 'from-cyan-500 to-blue-600',
    route: '/ai-tool/scrum-sprint',
    features: ['Sprint planning', 'User stories', 'Velocity tracking'],
    stage: 'development'
  },
  {
    id: 'kanban',
    title: 'Simple Task Board Manager',
    description: 'Visualize workflow and optimize processes using Kanban methodology.',
    icon: Kanban,
    color: 'from-emerald-500 to-teal-600',
    route: '/ai-tool/kanban',
    features: ['WIP limits', 'Flow optimization', 'Cycle time tracking'],
    stage: 'development'
  },
  {
    id: 'scrumban',
    title: 'Flexible Team Workflow Manager',
    description: 'Combine Scrum and Kanban for flexible, continuous project management.',
    icon: RefreshCcw,
    color: 'from-fuchsia-500 to-pink-600',
    route: '/ai-tool/scrumban',
    features: ['Hybrid methodology', 'Flexible sprints', 'Pull-based planning'],
    stage: 'development'
  },
  
  // Stage 4: Launch & Growth
  {
    id: 'gtm-strategy',
    title: 'Launch Your Product Plan',
    description: 'Create a comprehensive GTM plan with pricing, distribution, and launch timeline.',
    icon: Rocket,
    color: 'from-violet-500 to-purple-600',
    route: '/ai-tool/gtm-strategy',
    features: ['Launch timeline', 'Pricing strategy', 'Sales channels'],
    stage: 'launch'
  },
  {
    id: 'marketing-strategy',
    title: 'Marketing Strategy Planner',
    description: 'Develop a complete marketing strategy with digital and traditional marketing recommendations.',
    icon: Megaphone,
    color: 'from-orange-500 to-amber-600',
    route: '/ai-tool/marketing-strategy',
    features: ['4P marketing mix', 'Digital strategy', 'Budget allocation'],
    stage: 'launch'
  },
  
  // Stage 5: Optimization & Maturity
  {
    id: 'product-lifecycle',
    title: 'Product Journey Tracker',
    description: 'Understand your product\'s lifecycle stage and get recommendations for each phase.',
    icon: RefreshCcw,
    color: 'from-pink-500 to-rose-600',
    route: '/ai-tool/product-lifecycle',
    features: ['Stage identification', 'Extension strategies', 'Revenue optimization'],
    stage: 'optimization'
  },
  {
    id: 'kpi-tracking',
    title: 'Performance Goals Tracker',
    description: 'Define, track, and optimize Key Performance Indicators for your business.',
    icon: Target,
    color: 'from-lime-500 to-green-600',
    route: '/ai-tool/kpi-tracking',
    features: ['SMART KPIs', 'Dashboard design', 'Performance thresholds'],
    stage: 'optimization'
  },
  {
    id: 'pdca-cycle',
    title: 'Continuous Improvement Planner',
    description: 'Systematic improvement using Plan-Do-Check-Act cycle for minimal risk testing.',
    icon: RotateCcw,
    color: 'from-amber-500 to-yellow-600',
    route: '/ai-tool/pdca-cycle',
    features: ['Deming cycle', 'Root cause analysis', 'Continuous improvement'],
    stage: 'optimization'
  },
  {
    id: 'ipo-guide',
    title: 'Easy IPO Preparation Guide',
    description: 'Comprehensive guidance for Initial Public Offering preparation and execution.',
    icon: Landmark,
    color: 'from-slate-500 to-gray-600',
    route: '/ai-tool/ipo-guide',
    features: ['IPO timeline', 'Valuation methods', 'Regulatory compliance'],
    stage: 'optimization'
  }
];

const AITools = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const handleToolClick = (route: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate(route);
  };

  const filteredTools = selectedStage 
    ? aiTools.filter(tool => tool.stage === selectedStage)
    : aiTools;

  const getToolsByStage = (stageId: string) => aiTools.filter(tool => tool.stage === stageId);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section - Enhanced for SEO and Conversion */}
        <section className="relative overflow-hidden py-12 md:py-20 lg:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary-light/5 to-background"></div>
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[10%] right-[10%] w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-[20%] left-[5%] w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-pulse-glow"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
                <Sparkles className="w-4 h-4 mr-2" />
                Free AI Tools for Product Managers & Entrepreneurs
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent leading-tight">
                Business Toolkit: AI-Powered Product Management Tools
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                From idea validation to IPO readiness—19 free AI tools to help you build, launch, and scale your product. 
                Get professional documents, strategic insights, and actionable frameworks in seconds.
              </p>
              {!user && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    size="lg" 
                    className="cta-primary px-8 py-6 text-lg rounded-xl w-full sm:w-auto"
                    onClick={() => navigate('/auth')}
                  >
                    Get Free Access Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <p className="text-sm text-muted-foreground">No credit card required • Instant access</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Lifecycle Stage Navigation - 3-Click Navigation */}
        <section className="py-8 border-b border-border/50 bg-secondary/20 sticky top-0 z-20 backdrop-blur-lg">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-2 md:gap-4">
              <Button
                variant={selectedStage === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStage(null)}
                className="rounded-full px-4 py-2 text-sm"
              >
                All Tools ({aiTools.length})
              </Button>
              {lifecycleStages.map((stage) => (
                <Button
                  key={stage.id}
                  variant={selectedStage === stage.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStage(stage.id)}
                  className="rounded-full px-4 py-2 text-sm gap-2"
                >
                  <stage.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{stage.name}</span>
                  <span className="sm:hidden">{stage.name.split(' ')[0]}</span>
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {getToolsByStage(stage.id).length}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Tools by Lifecycle Stage */}
        <section className="py-12 md:py-16 container mx-auto px-4">
          {selectedStage === null ? (
            // Show all tools grouped by stage
            <div className="space-y-16">
              {lifecycleStages.map((stage, stageIndex) => {
                const stageTools = getToolsByStage(stage.id);
                return (
                  <div key={stage.id} className="scroll-mt-32" id={stage.id}>
                    <div className="flex items-center gap-4 mb-8">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stage.color} flex items-center justify-center`}>
                        <stage.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">Stage {stageIndex + 1}</Badge>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold">{stage.name}</h2>
                        <p className="text-muted-foreground">{stage.description}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {stageTools.map((tool) => (
                        <ToolCard 
                          key={tool.id} 
                          tool={tool} 
                          user={user} 
                          onToolClick={handleToolClick} 
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Show filtered tools
            <div>
              {lifecycleStages
                .filter(s => s.id === selectedStage)
                .map((stage, stageIndex) => (
                  <div key={stage.id}>
                    <div className="flex items-center gap-4 mb-8">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stage.color} flex items-center justify-center`}>
                        <stage.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">Stage {lifecycleStages.findIndex(s => s.id === selectedStage) + 1}</Badge>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold">{stage.name}</h2>
                        <p className="text-muted-foreground">{stage.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTools.map((tool) => (
                  <ToolCard 
                    key={tool.id} 
                    tool={tool} 
                    user={user} 
                    onToolClick={handleToolClick} 
                  />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Benefits Section - SEO Keywords */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Our Free Business Toolkit?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Trusted by 500+ product managers, startup founders, and business analysts worldwide
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI-Powered Analysis</h3>
                <p className="text-muted-foreground">Get comprehensive market research, competitor analysis, and strategic insights powered by advanced AI.</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Professional Documents</h3>
                <p className="text-muted-foreground">Generate PRDs, project charters, scope statements, and business plans with industry-standard templates.</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <Rocket className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Launch Faster</h3>
                <p className="text-muted-foreground">From idea to IPO, use our complete product lifecycle toolkit to accelerate every stage of your journey.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {!user && (
          <section className="py-16 bg-gradient-to-br from-primary/10 via-primary-light/5 to-background">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Accelerate Your Product Journey?</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join hundreds of product managers and entrepreneurs using our free AI business toolkit
              </p>
              <Button 
                size="lg" 
                className="cta-primary px-8 py-6 text-lg rounded-xl"
                onClick={() => navigate('/auth')}
              >
                Start Using Free Tools
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

// Tool Card Component
interface ToolCardProps {
  tool: typeof aiTools[0];
  user: any;
  onToolClick: (route: string) => void;
}

const ToolCard = ({ tool, user, onToolClick }: ToolCardProps) => {
  return (
    <Card 
      className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 cursor-pointer flex flex-col h-full"
      onClick={() => onToolClick(tool.route)}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      
      <CardHeader className="pb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <tool.icon className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-lg group-hover:text-primary transition-colors leading-tight">
          {tool.title}
        </CardTitle>
        <CardDescription className="text-sm line-clamp-2">
          {tool.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0 flex-1 flex flex-col">
        <ul className="space-y-2 mb-4 flex-1">
          {tool.features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2 flex-shrink-0"></span>
              {feature}
            </li>
          ))}
        </ul>
        
        <Button 
          variant="ghost" 
          className="w-full group-hover:bg-primary/10 group-hover:text-primary transition-colors mt-auto"
        >
          {user ? (
            <>
              Open Tool
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Login to Access
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AITools;
