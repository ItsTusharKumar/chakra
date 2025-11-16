import HeroSection from "@/components/HeroSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Users, Heart, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Product } from "@shared/schema";
import giftItemsImage from "@assets/generated_images/Individual_spiritual_devotional_items_a6b12037.png";

export default function Landing() {
  const [, setLocation] = useLocation();
  
  // Fetch products from database
  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

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

      {/* Products Preview Section */}
      <section className="py-16 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-4" data-testid="text-products-preview-title">
              Spiritual Gift Boxes
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-products-preview-subtitle">
              Discover thoughtfully curated spiritual items that enhance your devotional practice
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {products?.slice(0, 3).map((product) => (
              <Card 
                key={product.id} 
                className="hover-elevate active-elevate-2 cursor-pointer transition-all duration-300 overflow-hidden"
                onClick={() => setLocation("/products")}
                data-testid={`product-preview-card-${product.id}`}
              >
                <div className="relative">
                  {product.popular && (
                    <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground z-10" data-testid={`badge-popular-${product.id}`}>
                      Most Popular
                    </Badge>
                  )}
                  <div className="w-full h-48 overflow-hidden">
                    <img
                      src={giftItemsImage}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      data-testid={`img-product-${product.id}`}
                    />
                  </div>
                </div>
                
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-xs font-medium" data-testid={`badge-tier-${product.id}`}>
                      {product.tier}
                    </Badge>
                    <h3 className="text-xl font-serif font-bold text-foreground" data-testid={`text-product-title-${product.id}`}>
                      {product.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-product-description-${product.id}`}>
                      {product.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="text-2xl font-bold text-primary" data-testid={`text-product-price-${product.id}`}>
                        ₹{product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through ml-2" data-testid={`text-product-original-price-${product.id}`}>
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                    <ArrowRight className="h-5 w-5 text-primary" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => setLocation("/products")}
              data-testid="button-view-all-products"
            >
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Membership CTA */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8">
              <h2 className="text-3xl font-serif font-bold text-primary mb-4" data-testid="text-join-title">
                Join Our Spiritual Community
              </h2>
              <p className="text-lg text-muted-foreground mb-8" data-testid="text-join-description">
                Begin your guided journey toward divine consciousness with authentic spiritual practices and community support.
              </p>
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90"
                onClick={() => setLocation("/membership")}
                data-testid="button-join-now"
              >
                Sign In to Access Dashboard
              </Button>
              
              <div className="mt-6 pt-6 border-t border-primary/20">
                <p className="font-devanagari text-primary text-lg mb-2">
                  श्रीकृष्ण शरणं मम
                </p>
                <p className="text-sm text-muted-foreground italic" data-testid="text-join-sloka">
                  "Lord Krishna is my refuge"
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-background">
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