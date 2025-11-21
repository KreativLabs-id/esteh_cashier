import { pgTable, text, integer, timestamp, boolean, serial, pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["admin", "cashier"]);

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    username: text("username").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    role: roleEnum("role").notNull().default("cashier"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    price: integer("price").notNull(), // Stored in lowest unit (e.g. Rupiah)
    category: text("category").notNull(),
    imageUrl: text("image_url"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
    id: serial("id").primaryKey(),
    cashierId: integer("cashier_id").references(() => users.id),
    totalAmount: integer("total_amount").notNull(),
    paymentMethod: text("payment_method").notNull(), // 'cash', 'qris', 'transfer'
    cashAmount: integer("cash_amount"), // Amount of cash received (for cash payments)
    changeAmount: integer("change_amount"), // Change given (for cash payments)
    createdAt: timestamp("created_at").defaultNow(),
});

export const transactionItems = pgTable("transaction_items", {
    id: serial("id").primaryKey(),
    transactionId: integer("transaction_id").references(() => transactions.id),
    productId: integer("product_id").references(() => products.id),
    quantity: integer("quantity").notNull(),
    priceAtSnapshot: integer("price_at_snapshot").notNull(),
});
