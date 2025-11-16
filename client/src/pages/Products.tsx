import ProductCard from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import useAuth from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createOrderSchema, type ShippingAddress } from "@shared/schema";
import { z } from "zod";
import { useLocation } from "wouter";

export default function Products() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  // Form for shipping information
  const form = useForm<z.infer<typeof createOrderSchema>>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      productId: "",
      shippingAddress: {
        name: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        phone: ""
      }
    },
  });

  // Fetch products from database
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createOrderSchema>) => {
      const response = await apiRequest("POST", "/api/orders", data);
      return response.json();
    },
    onSuccess: (order) => {
      toast({
        title: "Order Created!",
        description: "Redirecting to secure checkout...",
      });
      setShowCheckout(false);
      setSelectedProduct(null);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      // Redirect to checkout with order ID
      setLocation(`/checkout?orderId=${order.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Order Failed",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleBuyNow = (product: Product) => {
    if (!isAuthenticated) {
      toast({
        title: "Please Login",
        description: "You need to be logged in to place an order.",
        variant: "destructive",
      });
      return;
    }
    setSelectedProduct(product);
    form.setValue("productId", product.id);
    setShowCheckout(true);
  };

  const handlePlaceOrder = (data: z.infer<typeof createOrderSchema>) => {
    createOrderMutation.mutate(data);
  };

  if (productsLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading products...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-card via-background to-chart-2/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6" data-testid="text-products-title">
            Spiritual Gift Boxes
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-products-subtitle">
            Carefully curated collections of authentic spiritual items to enhance your devotional practice. 
            Each box contains blessed items sourced from sacred temples across India.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {products?.map((product) => (
              <ProductCard
                key={product.id}
                tier={product.tier || "Tier 1"}
                title={product.title || "Spiritual Gift Box"}
                description={product.description || ""}
                price={`₹${product.price}`}
                originalPrice={product.originalPrice ? `₹${product.originalPrice}` : undefined}
                features={product.features || []}
                popular={product.popular || false}
                onBuyNow={() => handleBuyNow(product)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-16 bg-card/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-6" data-testid="text-quality-title">
            Blessed & Authentic
          </h2>
          <p className="text-lg text-muted-foreground mb-8" data-testid="text-quality-description">
            Every item in our gift boxes is personally blessed by temple priests and sourced directly from 
            sacred places. We ensure the highest quality and spiritual purity in every package we send.
          </p>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <p className="font-devanagari text-lg text-primary mb-2">
              यत्र योगेश्वरः कृष्णो यत्र पार्थो धनुर्धरः
            </p>
            <p className="text-sm text-muted-foreground italic" data-testid="text-blessing-translation">
              "Where there is Krishna, the Lord of Yoga, and Arjuna, the archer, there is prosperity, victory, happiness, and sound morality."
            </p>
          </div>
        </div>
      </section>

      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Complete Your Order</DialogTitle>
            <DialogDescription>
              {selectedProduct && (
                <span>Ordering: {selectedProduct.title} - ₹{selectedProduct.price}</span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handlePlaceOrder)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="shippingAddress.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input data-testid="input-shipping-name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shippingAddress.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input data-testid="input-shipping-phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="shippingAddress.address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea data-testid="textarea-shipping-address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="shippingAddress.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input data-testid="input-shipping-city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shippingAddress.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input data-testid="input-shipping-state" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shippingAddress.pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PIN Code</FormLabel>
                      <FormControl>
                        <Input data-testid="input-shipping-pincode" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowCheckout(false)} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1" 
                  disabled={createOrderMutation.isPending}
                  data-testid="button-place-order"
                >
                  {createOrderMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Placing Order...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}