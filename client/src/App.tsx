import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import useAuth from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Products from "@/pages/Products";
import Gallery from "@/pages/Gallery";
import Membership from "@/pages/Membership";
import Contact from "@/pages/Contact";
import Dashboard from "@/pages/Dashboard";
import Checkout from "@/pages/Checkout";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/about" component={About} />
          <Route path="/products" component={Products} />
          <Route path="/gallery" component={Gallery} />
          <Route path="/membership" component={Membership} />
          <Route path="/contact" component={Contact} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/products" component={Products} />
          <Route path="/gallery" component={Gallery} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/contact" component={Contact} />
          <Route path="/checkout" component={Checkout} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider defaultTheme="light" storageKey="chakravya-theme">
          <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            
            {/* Theme Toggle - Fixed Position */}
            <div className="fixed top-20 right-4 z-40">
              <ThemeToggle />
            </div>
            
            <main>
              <Router />
            </main>
            
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;