import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import giftItemsImage from "@assets/generated_images/Individual_spiritual_devotional_items_a6b12037.png";

interface ProductFeature {
  name: string;
  included: boolean;
}

interface ProductCardProps {
  tier: string;
  title: string;
  description: string;
  price: string;
  originalPrice?: string;
  features: ProductFeature[];
  popular?: boolean;
  onBuyNow?: () => void;
}

export default function ProductCard({ 
  tier, 
  title, 
  description, 
  price, 
  originalPrice, 
  features, 
  popular = false,
  onBuyNow
}: ProductCardProps) {
  return (
    <Card className={`relative hover-elevate transition-all duration-300 ${popular ? 'border-primary shadow-lg scale-105' : ''}`} data-testid={`product-card-${tier.toLowerCase().replace(/\s+/g, '-')}`}>
      {popular && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground" data-testid="badge-popular">
          Most Popular
        </Badge>
      )}
      
      <CardHeader className="text-center space-y-4 pb-6">
        <div className="mx-auto w-full h-48 rounded-lg overflow-hidden">
          <img
            src={giftItemsImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="space-y-2">
          <Badge variant="secondary" className="text-xs font-medium" data-testid={`badge-tier-${tier.toLowerCase()}`}>
            {tier}
          </Badge>
          <h3 className="text-2xl font-serif font-bold text-foreground" data-testid={`text-title-${tier.toLowerCase()}`}>
            {title}
          </h3>
          <p className="text-muted-foreground" data-testid={`text-description-${tier.toLowerCase()}`}>
            {description}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Pricing */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl font-bold text-primary" data-testid={`text-price-${tier.toLowerCase()}`}>
              {price}
            </span>
            {originalPrice && (
              <span className="text-lg text-muted-foreground line-through" data-testid={`text-original-price-${tier.toLowerCase()}`}>
                {originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3" data-testid={`feature-${tier.toLowerCase()}-${index}`}>
              <Check className={`h-4 w-4 ${feature.included ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`text-sm ${feature.included ? 'text-foreground' : 'text-muted-foreground'}`}>
                {feature.name}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button 
          className="w-full" 
          variant={popular ? "default" : "outline"}
          onClick={onBuyNow}
          data-testid={`button-buy-${tier.toLowerCase()}`}
        >
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  );
}