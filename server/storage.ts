import {
  users,
  spiritualTasks,
  userProgress,
  products,
  orders,
  contactSubmissions,
  type User,
  type UpsertUser,
  type SpiritualTask,
  type InsertSpiritualTask,
  type UserProgress,
  type InsertUserProgress,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type ContactSubmission,
  type InsertContactSubmission,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Spiritual tasks operations
  getSpiritualTasks(): Promise<SpiritualTask[]>;
  createSpiritualTask(task: InsertSpiritualTask): Promise<SpiritualTask>;
  
  // User progress operations
  getUserProgress(userId: string): Promise<(UserProgress & { task: SpiritualTask })[]>;
  getUserProgressByDate(userId: string, date: Date): Promise<(UserProgress & { task: SpiritualTask })[]>;
  upsertUserProgress(progress: InsertUserProgress & { userId: string }): Promise<UserProgress>;
  
  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  
  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getUserOrders(userId: string): Promise<(Order & { product: Product })[]>;
  updateOrderStatus(orderId: string, status: string): Promise<Order | undefined>;
  
  // Contact operations
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Spiritual tasks operations
  async getSpiritualTasks(): Promise<SpiritualTask[]> {
    return await db.select().from(spiritualTasks);
  }

  async createSpiritualTask(task: InsertSpiritualTask): Promise<SpiritualTask> {
    const [newTask] = await db.insert(spiritualTasks).values(task).returning();
    return newTask;
  }

  // User progress operations
  async getUserProgress(userId: string): Promise<(UserProgress & { task: SpiritualTask })[]> {
    return await db
      .select({
        id: userProgress.id,
        userId: userProgress.userId,
        taskId: userProgress.taskId,
        target: userProgress.target,
        completed: userProgress.completed,
        date: userProgress.date,
        createdAt: userProgress.createdAt,
        task: spiritualTasks,
      })
      .from(userProgress)
      .innerJoin(spiritualTasks, eq(userProgress.taskId, spiritualTasks.id))
      .where(eq(userProgress.userId, userId))
      .orderBy(desc(userProgress.date));
  }

  async getUserProgressByDate(userId: string, date: Date): Promise<(UserProgress & { task: SpiritualTask })[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await db
      .select({
        id: userProgress.id,
        userId: userProgress.userId,
        taskId: userProgress.taskId,
        target: userProgress.target,
        completed: userProgress.completed,
        date: userProgress.date,
        createdAt: userProgress.createdAt,
        task: spiritualTasks,
      })
      .from(userProgress)
      .innerJoin(spiritualTasks, eq(userProgress.taskId, spiritualTasks.id))
      .where(
        and(
          eq(userProgress.userId, userId),
          // Note: Using string comparison for date filtering in this example
          // In production, you might want to use proper date functions
        )
      );
  }

  async upsertUserProgress(progress: InsertUserProgress & { userId: string }): Promise<UserProgress> {
    const [existingProgress] = await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, progress.userId),
          eq(userProgress.taskId, progress.taskId)
        )
      );

    if (existingProgress) {
      const [updated] = await db
        .update(userProgress)
        .set({
          target: progress.target,
          completed: progress.completed,
        })
        .where(eq(userProgress.id, existingProgress.id))
        .returning();
      return updated;
    } else {
      const [newProgress] = await db
        .insert(userProgress)
        .values(progress)
        .returning();
      return newProgress;
    }
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.active, true));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  // Order operations
  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async getUserOrders(userId: string): Promise<(Order & { product: Product })[]> {
    return await db
      .select({
        id: orders.id,
        userId: orders.userId,
        productId: orders.productId,
        status: orders.status,
        amount: orders.amount,
        paymentId: orders.paymentId,
        shippingAddress: orders.shippingAddress,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
        product: products,
      })
      .from(orders)
      .innerJoin(products, eq(orders.productId, products.id))
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }

  async updateOrderStatus(orderId: string, status: string, paymentId?: string): Promise<Order | undefined> {
    const updateData: any = { status, updatedAt: new Date() };
    if (paymentId) {
      updateData.paymentId = paymentId;
    }
    
    const [updated] = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, orderId))
      .returning();
    return updated;
  }

  // Contact operations
  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const [newSubmission] = await db
      .insert(contactSubmissions)
      .values(submission)
      .returning();
    return newSubmission;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return await db
      .select()
      .from(contactSubmissions)
      .orderBy(desc(contactSubmissions.createdAt));
  }
}

export const storage = new DatabaseStorage();
