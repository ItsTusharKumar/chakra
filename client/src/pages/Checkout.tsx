// Referenced from javascript_stripe integration
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import { Order, Product } from "@shared/schema";

// Referenced from javascript_stripe integration
// Make Stripe optional - payment features won't work without it
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

const CheckoutForm = ({ orderId, order }: { orderId: string; order: Order & { product: Product } }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  const confirmPaymentMutation = useMutation({
    mutationFn: async (paymentIntentId: string) => {
      const response = await apiRequest("POST", `/api/orders/${orderId}/payment`, {
        paymentIntentId
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Payment Successful!",
        description: "Your spiritual gift box order has been confirmed. Thank you for your purchase!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Payment Verification Failed",
        description: error.message || "There was an issue confirming your payment.",
        variant: "destructive",
      });
      setIsProcessing(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || isProcessing) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsProcessing(false);
    } else if (paymentIntent) {
      if (paymentIntent.status === 'succeeded') {
        // Confirm payment with our backend
        confirmPaymentMutation.mutate(paymentIntent.id);
      } else if (paymentIntent.status === 'processing') {
        toast({
          title: "Payment Processing",
          description: "Your payment is being processed. Please wait...",
        });
        // You could implement polling here to check payment status
        setIsProcessing(false);
      } else if (paymentIntent.status === 'requires_action') {
        toast({
          title: "Payment Requires Action",
          description: "Please complete the authentication step.",
        });
        setIsProcessing(false);
      }
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Complete Payment</CardTitle>
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">{order.product.title}</p>
          <p className="text-2xl font-bold text-primary">₹{order.amount}</p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <PaymentElement />
          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setLocation("/products")}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button 
              type="submit" 
              disabled={!stripe || !elements || isProcessing}
              className="flex-1"
              data-testid="button-complete-payment"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                `Pay ₹${order.amount}`
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState("");
  const [orderId, setOrderId] = useState("");

  // Get orderId from URL parameters or state
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderIdParam = urlParams.get('orderId');
    if (orderIdParam) {
      setOrderId(orderIdParam);
    } else {
      // Redirect to products if no order ID
      setLocation("/products");
    }
  }, [setLocation]);

  // Fetch the order details
  const { data: orders } = useQuery<(Order & { product: Product })[]>({
    queryKey: ["/api/orders"],
    enabled: isAuthenticated,
  });

  const order = orders?.find(o => o.id === orderId);

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
      return;
    }

    // Only attempt to create payment intent if Stripe is configured
    if (orderId && order && stripePromise) {
      // Create PaymentIntent for this specific order
      apiRequest("POST", "/api/create-payment-intent", { orderId })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Payment service unavailable");
          }
          return res.json();
        })
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch((error) => {
          console.error("Error creating payment intent:", error);
          toast({
            title: "Payment Setup Failed",
            description: "Unable to initialize payment. Please try again.",
            variant: "destructive",
          });
          setLocation("/products");
        });
    }
  }, [orderId, order, isAuthenticated, setLocation, toast]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <p>Please log in to access checkout.</p>
            <Button onClick={() => setLocation("/")} className="mt-4">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!orderId || !order) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <p>Order not found.</p>
            <Button onClick={() => setLocation("/products")} className="mt-4">
              Browse Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Referenced from javascript_stripe integration
  // Check if Stripe is configured before attempting payment
  if (!stripePromise) {
    return (
      <div className="min-h-screen pt-16 py-8 bg-background">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Payment Not Configured</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Payment processing is not currently available. Please contact the administrator.
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => setLocation("/products")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Products
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span>Setting up payment...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 py-8 bg-background">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-serif font-bold text-center mb-8" data-testid="text-checkout-title">
          Secure Checkout
        </h1>
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm orderId={orderId} order={order} />
        </Elements>
      </div>
    </div>
  );
}