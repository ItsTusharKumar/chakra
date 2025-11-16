import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

export default function Membership() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", credentials);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Login Successful",
        description: "Welcome back to your spiritual journey!",
      });
      setLocation("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-card via-background to-chart-2/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6" data-testid="text-membership-title">
            Spiritual Membership
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-membership-subtitle">
            Join our community of devotees and track your spiritual progress with personalized guidance and courses.
          </p>
        </div>
      </section>

      <div className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Login Form */}
            <Card data-testid="login-card">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-serif">Member Login</CardTitle>
                <p className="text-muted-foreground">Access your spiritual dashboard</p>
                <div className="mt-4 p-3 bg-muted/50 rounded-md text-sm">
                  <p className="font-semibold text-foreground mb-1">Demo Credentials:</p>
                  <p className="text-muted-foreground">Email: demo@chakravya.com</p>
                  <p className="text-muted-foreground">Password: demo123</p>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={loginData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      required
                      data-testid="input-login-email"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={loginData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      data-testid="input-login-password"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    data-testid="button-login"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Signing In..." : "Sign In"}
                  </Button>
                  
                  <div className="text-center text-sm">
                    <a href="#" className="text-primary hover:underline" data-testid="link-forgot-password">
                      Forgot password?
                    </a>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Membership Benefits */}
            <div className="space-y-8">
              <Card data-testid="benefits-card">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif">Membership Benefits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-semibold text-foreground" data-testid="text-benefit-tracker-title">Spiritual Progress Tracker</h3>
                      <p className="text-muted-foreground text-sm" data-testid="text-benefit-tracker-description">
                        Monitor your daily spiritual practices and see your growth over time
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-semibold text-foreground" data-testid="text-benefit-courses-title">Exclusive Courses</h3>
                      <p className="text-muted-foreground text-sm" data-testid="text-benefit-courses-description">
                        Access to premium spiritual learning modules and guided meditations
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-semibold text-foreground" data-testid="text-benefit-community-title">Community Access</h3>
                      <p className="text-muted-foreground text-sm" data-testid="text-benefit-community-description">
                        Connect with fellow devotees and share your spiritual journey
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-semibold text-foreground" data-testid="text-benefit-guidance-title">Personal Guidance</h3>
                      <p className="text-muted-foreground text-sm" data-testid="text-benefit-guidance-description">
                        Monthly spiritual counseling sessions with experienced devotees
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Become a Member CTA */}
              <Card className="bg-primary/5 border-primary/20" data-testid="become-member-card">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-serif font-bold text-primary mb-4" data-testid="text-become-member-title">
                    Not a Member Yet?
                  </h3>
                  <p className="text-muted-foreground mb-6" data-testid="text-become-member-description">
                    Join our spiritual community and begin your guided journey toward divine consciousness.
                  </p>
                  <Button size="lg" className="bg-primary hover:bg-primary/90" data-testid="button-become-member">
                    Become a Member
                  </Button>
                  
                  <div className="mt-6 pt-6 border-t border-primary/20">
                    <p className="font-devanagari text-primary text-lg mb-2">
                      सत्संगत्वे निस्सङ्गत्वं निस्सङ्गत्वे निर्मोहत्वम्
                    </p>
                    <p className="text-sm text-muted-foreground italic" data-testid="text-become-member-sloka">
                      "Through good association comes non-attachment, from non-attachment comes freedom from delusion"
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}