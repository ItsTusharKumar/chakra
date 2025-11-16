import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { insertContactSubmissionSchema, insertUserProgressSchema, createOrderSchema } from "@shared/schema";
import { z } from "zod";
import Stripe from "stripe";

// Make Stripe optional - payment features won't work without it
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-08-27.basil",
    })
  : null;

if (!stripe) {
  console.warn('⚠️  STRIPE_SECRET_KEY not found - payment features will be disabled');
}

// Helper function to get user ID from request
function getUserId(req: any): string {
  if (!req.user || !req.user.id) {
    throw new Error("Unauthorized - no user in request");
  }
  return req.user.id;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove sensitive fields before sending to client
      const { passwordHash, ...sanitizedUser } = user;
      res.json(sanitizedUser);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Spiritual tasks routes
  app.get('/api/spiritual-tasks', async (req, res) => {
    try {
      const tasks = await storage.getSpiritualTasks();
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching spiritual tasks:", error);
      res.status(500).json({ message: "Failed to fetch spiritual tasks" });
    }
  });

  // User progress routes
  app.get('/api/user-progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching user progress:", error);
      res.status(500).json({ message: "Failed to fetch user progress" });
    }
  });

  app.post('/api/user-progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const validatedData = insertUserProgressSchema.parse(req.body);
      
      const progress = await storage.upsertUserProgress({
        ...validatedData,
        userId,
      });
      
      res.json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating user progress:", error);
      res.status(500).json({ message: "Failed to update user progress" });
    }
  });

  // Products routes
  app.get('/api/products', async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Orders routes
  app.get('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const orders = await storage.getUserOrders(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.post('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      
      // Validate request body
      const validationResult = createOrderSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid order data", 
          errors: validationResult.error.errors 
        });
      }
      
      const { productId, shippingAddress } = validationResult.data;
      
      // Get product to calculate amount
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      const order = await storage.createOrder({
        userId,
        productId,
        amount: product.price,
        shippingAddress,
        status: "pending",
      });
      
      res.json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Stripe payment intent route - Referenced from javascript_stripe integration
  app.post('/api/create-payment-intent', isAuthenticated, async (req: any, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ 
          message: "Payment processing is not configured. Please add STRIPE_SECRET_KEY to enable payments." 
        });
      }

      const { orderId } = req.body;
      const userId = getUserId(req);
      
      // Get the order to find the amount
      const orders = await storage.getUserOrders(userId);
      const order = orders.find(o => o.id === orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      if (order.status !== "pending") {
        return res.status(400).json({ message: "Order is not pending" });
      }
      
      // Create payment intent with order amount (converting to cents for USD equivalent)
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(parseFloat(order.amount) * 100), // Convert to cents
        currency: "inr", // Indian Rupees
        automatic_payment_methods: { enabled: true },
        metadata: {
          orderId: order.id,
          userId: userId,
        },
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Update order payment status
  app.post('/api/orders/:orderId/payment', isAuthenticated, async (req: any, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ 
          message: "Payment processing is not configured. Please add STRIPE_SECRET_KEY to enable payments." 
        });
      }

      const { orderId } = req.params;
      const { paymentIntentId } = req.body;
      const userId = getUserId(req);
      
      // Get the user's orders to verify ownership
      const orders = await storage.getUserOrders(userId);
      const order = orders.find(o => o.id === orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found or access denied" });
      }
      
      if (order.status !== "pending") {
        return res.status(400).json({ message: "Order is not pending" });
      }
      
      // Verify the payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === "succeeded" && 
          paymentIntent.metadata.orderId === orderId &&
          paymentIntent.metadata.userId === userId &&
          Math.round(parseFloat(order.amount) * 100) === paymentIntent.amount) {
        // Update order status
        await storage.updateOrderStatus(orderId, "paid", paymentIntentId);
        res.json({ success: true, message: "Payment confirmed" });
      } else {
        res.status(400).json({ message: "Payment verification failed" });
      }
    } catch (error: any) {
      console.error("Error confirming payment:", error);
      res.status(500).json({ message: "Error confirming payment: " + error.message });
    }
  });

  // Contact form route
  app.post('/api/contact', async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      res.json(submission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating contact submission:", error);
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
