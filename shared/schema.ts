import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import { 
  pgTable, 
  text, 
  varchar, 
  timestamp, 
  integer, 
  boolean,
  jsonb,
  index,
  decimal
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for  Auth and local auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  passwordHash: varchar("password_hash"), // For local auth (nullable for  auth users)
  role: varchar("role").default("user"), // 'user' or 'admin'
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Spiritual tasks that users can perform
export const spiritualTasks = pgTable("spiritual_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  category: varchar("category").notNull(), // 'chanting', 'reading', 'service', 'meditation'
  defaultTarget: integer("default_target").default(1), // e.g., 16 rounds, 1 chapter
  unit: varchar("unit").default("times"), // 'rounds', 'chapters', 'minutes', 'times'
  createdAt: timestamp("created_at").defaultNow(),
});

// User's progress on spiritual tasks
export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  taskId: varchar("task_id").notNull().references(() => spiritualTasks.id, { onDelete: "cascade" }),
  target: integer("target").notNull(), // User's personal target
  completed: integer("completed").default(0),
  date: timestamp("date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Gift box products
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tier: varchar("tier").notNull(), // 'tier1', 'tier2', 'tier3'
  title: text("title").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  features: jsonb("features").$type<{ name: string; included: boolean }[]>(),
  popular: boolean("popular").default(false),
  imageUrl: varchar("image_url"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Orders for gift boxes
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "set null" }),
  productId: varchar("product_id").notNull().references(() => products.id),
  status: varchar("status").notNull().default("pending"), // 'pending', 'paid', 'shipped', 'delivered'
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentId: varchar("payment_id"),
  shippingAddress: jsonb("shipping_address").$type<{
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact form submissions
export const contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: varchar("email").notNull(),
  message: text("message").notNull(),
  status: varchar("status").default("unread"), // 'unread', 'read', 'replied'
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  progress: many(userProgress),
  orders: many(orders),
}));

export const spiritualTasksRelations = relations(spiritualTasks, ({ many }) => ({
  userProgress: many(userProgress),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  task: one(spiritualTasks, {
    fields: [userProgress.taskId],
    references: [spiritualTasks.id],
  }),
}));

export const productsRelations = relations(products, ({ many }) => ({
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [orders.productId],
    references: [products.id],
  }),
}));

// Schema exports for  Auth
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Additional schema exports
export type SpiritualTask = typeof spiritualTasks.$inferSelect;
export type InsertSpiritualTask = typeof spiritualTasks.$inferInsert;

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = typeof userProgress.$inferInsert;

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = typeof contactSubmissions.$inferInsert;

// Zod schemas
export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).pick({
  name: true,
  email: true,
  message: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).pick({
  taskId: true,
  target: true,
  completed: true,
});

// Define shipping address schema for validation
export const shippingAddressSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "PIN code must be 6 digits"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
});

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

// Enhanced order creation schema with validation
export const createOrderSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  shippingAddress: shippingAddressSchema,
});
