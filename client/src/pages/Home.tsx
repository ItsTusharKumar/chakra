import HeroSection from "@/components/HeroSection";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Users, Heart } from "lucide-react";

export default function Home() {
  const highlights = [
    {
      icon: Gift,
      title: "Gifting Tiers",
      description: "Choose from Divine Essentials, Premium Blessings, or Exclusive Grace."
    },
    {
      icon: Users,
      title: "Membership",
      description: "Track your devotion & spiritual progress."
    },
    {
      icon: Heart,
      title: "Community",
      description: "Be part of a global devotee family."
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Devotee, Delhi",
      content: "The Divine Essentials box brought such peace to our home. My family cherishes our daily prayers now.",
      rating: 5
    },
    {
      name: "Rajesh Kumar",
      role: "Member, Mumbai",
      content: "Chakravya Global has transformed my spiritual journey. The quality of items is exceptional.",
      rating: 5
    },
    {
      name: "Anita Patel",
      role: "Devotee, Ahmedabad",
      content: "The membership program helps me stay consistent with my spiritual practices. Highly recommended!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      <HeroSection />
      
      {/* Highlights Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-4" data-testid="text-highlights-title">
              Spiritual Wellness for Every Journey
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-highlights-subtitle">
              Whether you're beginning your devotional path or deepening your practice, 
              we have the perfect spiritual companion for you.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => (
              <Card key={index} className="text-center hover-elevate transition-all duration-300" data-testid={`highlight-card-${index}`}>
                <CardContent className="p-8">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <highlight.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-foreground mb-3" data-testid={`text-highlight-title-${index}`}>
                    {highlight.title}
                  </h3>
                  <p className="text-muted-foreground" data-testid={`text-highlight-description-${index}`}>
                    {highlight.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-4" data-testid="text-testimonials-title">
              What Devotees Say
            </h2>
            <p className="text-lg text-muted-foreground" data-testid="text-testimonials-subtitle">
              Join thousands of devotees who have found peace through Chakravya Global
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover-elevate transition-all duration-300" data-testid={`testimonial-card-${index}`}>
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-primary text-lg" data-testid={`star-${index}-${i}`}>★</span>
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic" data-testid={`text-testimonial-content-${index}`}>
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-foreground" data-testid={`text-testimonial-name-${index}`}>{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground" data-testid={`text-testimonial-role-${index}`}>{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}