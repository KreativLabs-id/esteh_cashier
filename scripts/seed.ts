import "dotenv/config";
import { db } from "@/db";
import { users, products } from "@/db/schema";
import bcrypt from "bcryptjs";
import { exit } from "process";

async function seed() {
    console.log("Seeding database...");

    // Create Users
    const adminPassword = await bcrypt.hash("admin123", 10);
    const cashierPassword = await bcrypt.hash("cashier123", 10);

    await db.insert(users).values([
        {
            username: "admin",
            passwordHash: adminPassword,
            role: "admin",
        },
        {
            username: "cashier1",
            passwordHash: cashierPassword,
            role: "cashier",
        },
    ]).onConflictDoNothing();

    // Create Products
    await db.insert(products).values([
        { name: "Original Es Teh", price: 5000, category: "Classic Series", imageUrl: "/placeholder.png" },
        { name: "Es Teh Lemon", price: 7000, category: "Fruit Series", imageUrl: "/placeholder.png" },
        { name: "Es Teh Susu", price: 8000, category: "Milk Series", imageUrl: "/placeholder.png" },
        { name: "Es Teh Leci", price: 9000, category: "Fruit Series", imageUrl: "/placeholder.png" },
        { name: "Es Teh Tarik", price: 10000, category: "Milk Series", imageUrl: "/placeholder.png" },
        { name: "Es Teh Matcha", price: 12000, category: "Milk Series", imageUrl: "/placeholder.png" },
    ]).onConflictDoNothing();

    console.log("Seeding complete!");
    exit(0);
}

seed();
