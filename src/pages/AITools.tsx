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
  Landmark
} from 'lucide-react';

const aiTools = [
  {
    id: 'wireframe',
    title: 'Quick App & Website Layout Maker',
    description: 'Create interactive wireframe mockups from natural language descriptions. Drag, drop, and export your designs.',
    icon: Wand2,
    color: 'from-purple-500 to-indigo-600',
    route: '/wireframe-tool',
    features: ['Visual drag-drop editor', 'Multiple style presets', 'Export to PDF/JSON']
  },
  {
    id: 'market-size',
    title: 'Market Demand Calculator',
    description: 'Calculate TAM, SAM, and SOM for your product or service with AI-powered market analysis.',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-600',
    route: '/ai-tool/market-size',
    features: ['TAM/SAM/SOM analysis', 'CAGR projections', 'Industry benchmarks']
  },
  {
    id: 'business-model',
    title: 'Easy Business Plan Creator',
    description: 'Generate comprehensive Business Model Canvas with AI assistance for your startup or product.',
    icon: Building2,
    color: 'from-blue-500 to-cyan-600',
    route: '/ai-tool/business-model',
    features: ['Full BMC framework', 'Revenue stream ideas', 'Partnership strategies']
  },
  {
    id: 'marketing-strategy',
    title: 'Marketing Game Plan Maker',
    description: 'Develop a complete marketing strategy with digital and traditional marketing recommendations.',
    icon: Megaphone,
    color: 'from-orange-500 to-amber-600',
    route: '/ai-tool/marketing-strategy',
    features: ['4P marketing mix', 'Digital strategy', 'Budget allocation']
  },
  {
    id: 'product-lifecycle',
    title: 'Product Journey Tracker',
    description: 'Understand your product\'s lifecycle stage and get recommendations for each phase.',
    icon: RefreshCcw,
    color: 'from-pink-500 to-rose-600',
    route: '/ai-tool/product-lifecycle',
    features: ['Stage identification', 'Extension strategies', 'Revenue optimization']
  },
  {
    id: 'gtm-strategy',
    title: 'Launch Your Product Plan',
    description: 'Create a comprehensive GTM plan with pricing, distribution, and launch timeline.',
    icon: Rocket,
    color: 'from-violet-500 to-purple-600',
    route: '/ai-tool/gtm-strategy',
    features: ['Launch timeline', 'Pricing strategy', 'Sales channels']
  },
  {
    id: 'market-research',
    title: 'Smart Market Insights Helper',
    description: 'Get guidance on primary and secondary market research methodologies and frameworks.',
    icon: Search,
    color: 'from-teal-500 to-cyan-600',
    route: '/ai-tool/market-research',
    features: ['PESTLE analysis', 'Porter\'s Five Forces', 'Survey templates']
  },
  {
    id: 'competitor-analysis',
    title: 'Know Your Competition Tool',
    description: 'Analyze competitors, identify competitive advantages, and find market opportunities.',
    icon: Users,
    color: 'from-red-500 to-orange-600',
    route: '/ai-tool/competitor-analysis',
    features: ['Competitor profiling', 'Feature comparison', 'Gap analysis']
  },
  {
    id: 'rice-framework',
    title: 'Task Priority Score Tool',
    description: 'Prioritize work based on Reach, Impact, Confidence, and Effort for high ROI initiatives.',
    icon: ListOrdered,
    color: 'from-indigo-500 to-purple-600',
    route: '/ai-tool/rice-framework',
    features: ['RICE score calculation', 'Priority ranking', 'ROI analysis']
  },
  {
    id: 'scrum-sprint',
    title: 'Team Task & Sprint Organizer',
    description: 'Plan and manage projects using Scrum methodology with sprint planning and tracking.',
    icon: RotateCcw,
    color: 'from-cyan-500 to-blue-600',
    route: '/ai-tool/scrum-sprint',
    features: ['Sprint planning', 'User stories', 'Velocity tracking']
  },
  {
    id: 'kanban',
    title: 'Simple Task Board Manager',
    description: 'Visualize workflow and optimize processes using Kanban methodology.',
    icon: Kanban,
    color: 'from-emerald-500 to-teal-600',
    route: '/ai-tool/kanban',
    features: ['WIP limits', 'Flow optimization', 'Cycle time tracking']
  },
  {
    id: 'scrumban',
    title: 'Flexible Team Workflow Manager',
    description: 'Combine Scrum and Kanban for flexible, continuous project management.',
    icon: RefreshCcw,
    color: 'from-fuchsia-500 to-pink-600',
    route: '/ai-tool/scrumban',
    features: ['Hybrid methodology', 'Flexible sprints', 'Pull-based planning']
  },
  {
    id: 'pdca-cycle',
    title: 'Continuous Improvement Planner',
    description: 'Systematic improvement using Plan-Do-Check-Act cycle for minimal risk testing.',
    icon: RotateCcw,
    color: 'from-amber-500 to-yellow-600',
    route: '/ai-tool/pdca-cycle',
    features: ['Deming cycle', 'Root cause analysis', 'Continuous improvement']
  },
  {
    id: 'risk-management',
    title: 'Business Risk Checker',
    description: 'Identify, assess, and mitigate risks with comprehensive risk management frameworks.',
    icon: ShieldAlert,
    color: 'from-rose-500 to-red-600',
    route: '/ai-tool/risk-management',
    features: ['Risk matrix', 'Mitigation plans', 'Contingency planning']
  },
  {
    id: 'kpi-tracking',
    title: 'Performance Goals Tracker',
    description: 'Define, track, and optimize Key Performance Indicators for your business.',
    icon: Target,
    color: 'from-lime-500 to-green-600',
    route: '/ai-tool/kpi-tracking',
    features: ['SMART KPIs', 'Dashboard design', 'Performance thresholds']
  },
  {
    id: 'ipo-guide',
    title: 'Easy IPO Preparation Guide',
    description: 'Comprehensive guidance for Initial Public Offering preparation and execution.',
    icon: Landmark,
    color: 'from-slate-500 to-gray-600',
    route: '/ai-tool/ipo-guide',
    features: ['IPO timeline', 'Valuation methods', 'Regulatory compliance']
  }
];

const AITools = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleToolClick = (route: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate(route);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 md:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary-light/5 to-background"></div>
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[10%] right-[10%] w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-[20%] left-[5%] w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-pulse-glow"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <Badge variant="secondary" className="mb-4 px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Free for Registered Users
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
                AI-Powered Business Tools
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Accelerate your product journey with our suite of AI tools. From market sizing to competitor analysis, 
                get actionable insights in seconds.
              </p>
              {!user && (
                <Button 
                  size="lg" 
                  className="cta-primary px-8 py-6 text-lg rounded-xl"
                  onClick={() => navigate('/auth')}
                >
                  Get Free Access
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="py-16 container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {aiTools.map((tool) => (
              <Card 
                key={tool.id}
                className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 cursor-pointer"
                onClick={() => handleToolClick(tool.route)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <tool.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {tool.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-2 mb-4">
                    {tool.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full group-hover:bg-primary/10 group-hover:text-primary transition-colors"
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
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Use Our AI Tools?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI-Powered Insights</h3>
                <p className="text-muted-foreground">Get comprehensive analysis powered by advanced AI in seconds, not hours.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Data-Driven Decisions</h3>
                <p className="text-muted-foreground">Make informed decisions with industry benchmarks and market data.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <Rocket className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Accelerate Growth</h3>
                <p className="text-muted-foreground">Launch faster with ready-to-use frameworks and strategies.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AITools;
