
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Mail, Lock, User, Phone, Eye, EyeOff, Shield } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect');
  const { signIn, signUp, resetPassword, user } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ 
    email: '', 
    password: '', 
    fullName: '',
    phone: '',
    confirmPassword: '' 
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if already logged in
  if (user) {
    navigate(redirectTo || '/');
    return null;
  }

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^[6-9]\d{9}$/.test(phone);
  const validatePassword = (password: string) => password.length >= 6;

  const validateSignupForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!signupData.fullName.trim() || signupData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }
    if (!validateEmail(signupData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!validatePhone(signupData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number';
    }
    if (!validatePassword(signupData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!validateEmail(loginData.email)) {
      setErrors({ loginEmail: 'Please enter a valid email' });
      return;
    }
    
    setIsLoading(true);
    const { error } = await signIn(loginData.email, loginData.password);
    
    if (error) {
      toast({
        title: "Sign In Failed",
        description: error.message === 'Invalid login credentials' 
          ? 'Invalid email or password. Please check and try again.'
          : error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back! 🎉",
        description: "You have successfully signed in.",
      });
      navigate(redirectTo || '/');
    }
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSignupForm()) return;

    setIsLoading(true);
    const { error } = await signUp(signupData.email, signupData.password, signupData.fullName, signupData.phone);
    
    if (error) {
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account Created! 🎉",
        description: "Please check your email to verify your account, then sign in.",
      });
    }
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail || !validateEmail(resetEmail)) {
      toast({
        title: "Valid Email Required",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await resetPassword(resetEmail);
    
    if (error) {
      toast({
        title: "Reset Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Reset Email Sent ✉️",
        description: "Check your email for password reset instructions.",
      });
      setResetEmail('');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      <SEOHead 
        title="Sign In or Create Account | BookMyMentor"
        description="Join BookMyMentor to access Product Management courses, Jobs & Internships, AI Resume Builder and more. Sign up today!"
        keywords="sign in BookMyMentor, create account, register, login, product management courses"
      />
      <Header />
      
      <div className="flex-1 flex items-center justify-center px-4 py-8 md:py-12">
        <div className="w-full max-w-md">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 hover:bg-primary/5 text-muted-foreground"
          >
            <ArrowLeft className="mr-2" size={16} />
            Back to Home
          </Button>

          <Card className="shadow-xl border-primary/10">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Welcome to BookMyMentor
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Start your career journey today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="signin" className="text-sm">Sign In</TabsTrigger>
                  <TabsTrigger value="signup" className="text-sm">Sign Up</TabsTrigger>
                  <TabsTrigger value="forgot" className="text-sm">Reset</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                      <Label htmlFor="signin-email">Email</Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signin-email"
                          type="email"
                          value={loginData.email}
                          onChange={(e) => { setLoginData({ ...loginData, email: e.target.value }); setErrors({}); }}
                          placeholder="Enter your email"
                          className="pl-10"
                          required
                        />
                      </div>
                      {errors.loginEmail && <p className="text-xs text-destructive mt-1">{errors.loginEmail}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="signin-password">Password</Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signin-password"
                          type={showPassword ? "text" : "password"}
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          placeholder="Enter your password"
                          className="pl-10 pr-10"
                          required
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full cta-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-3">
                    <div>
                      <Label htmlFor="signup-name">Full Name *</Label>
                      <div className="relative mt-1">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          type="text"
                          value={signupData.fullName}
                          onChange={(e) => { setSignupData({ ...signupData, fullName: e.target.value }); setErrors(prev => ({...prev, fullName: ''})); }}
                          placeholder="Enter your full name"
                          className="pl-10"
                          required
                          maxLength={100}
                        />
                      </div>
                      {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="signup-email">Email *</Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          value={signupData.email}
                          onChange={(e) => { setSignupData({ ...signupData, email: e.target.value }); setErrors(prev => ({...prev, email: ''})); }}
                          placeholder="Enter your email"
                          className="pl-10"
                          required
                          maxLength={255}
                        />
                      </div>
                      {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <Label htmlFor="signup-phone">Mobile Number *</Label>
                      <div className="relative mt-1">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-phone"
                          type="tel"
                          value={signupData.phone}
                          onChange={(e) => { 
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setSignupData({ ...signupData, phone: val }); 
                            setErrors(prev => ({...prev, phone: ''}));
                          }}
                          placeholder="10-digit mobile number"
                          className="pl-10"
                          required
                          maxLength={10}
                        />
                      </div>
                      {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="signup-password">Password *</Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          value={signupData.password}
                          onChange={(e) => { setSignupData({ ...signupData, password: e.target.value }); setErrors(prev => ({...prev, password: ''})); }}
                          placeholder="Min. 6 characters"
                          className="pl-10 pr-10"
                          required
                          minLength={6}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="confirm-password">Confirm Password *</Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          value={signupData.confirmPassword}
                          onChange={(e) => { setSignupData({ ...signupData, confirmPassword: e.target.value }); setErrors(prev => ({...prev, confirmPassword: ''})); }}
                          placeholder="Confirm your password"
                          className="pl-10 pr-10"
                          required
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>}
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full cta-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-1">
                      <Shield className="w-3 h-3" />
                      <span>Your data is safe & secured</span>
                    </div>
                  </form>
                </TabsContent>
                
                <TabsContent value="forgot">
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <Label htmlFor="reset-email">Email</Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="reset-email"
                          type="email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full cta-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending Reset Email..." : "Send Reset Email"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Auth;
