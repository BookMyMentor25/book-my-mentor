import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Checkout from "./pages/Checkout";
import Team from "./pages/Team";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import CourseDetails from "./pages/CourseDetails";
import WireframeTool from "./pages/WireframeTool";
import AITools from "./pages/AITools";
import AIToolPage from "./pages/AIToolPage";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import RecruiterRegister from "./pages/RecruiterRegister";
import RecruiterDashboard from "./pages/RecruiterDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/team" element={<Team />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/course/:courseId" element={<CourseDetails />} />
            <Route path="/ai-tools" element={<AITools />} />
            <Route path="/ai-tool/:toolId" element={<AIToolPage />} />
            <Route path="/wireframe-tool" element={<WireframeTool />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/job/:jobId" element={<JobDetails />} />
            <Route path="/recruiter/register" element={<RecruiterRegister />} />
            <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
