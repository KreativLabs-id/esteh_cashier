import "dotenv/config";
import { db } from "@/db";
import { users, products, transactions, transactionItems } from "@/db/schema";
import bcrypt from "bcryptjs";
import { exit } from "process";
import { sql } from "drizzle-orm";

async function resetAndSeed() {
    console.log("🗑️  Clearing database...");

    try {
        // Delete all data in correct order (respecting foreign keys)
        await db.delete(transactionItems);
        await db.delete(transactions);
        await db.delete(products);
        await db.delete(users);

        console.log("✅ Database cleared!");
        console.log("🌱 Seeding database...");

        // Create Users
        const adminPassword = await bcrypt.hash("admin123", 10);
        const cashierPassword = await bcrypt.hash("cashier123", 10);

        await db.insert(users).values([
            {
                username: "admin",
                name: "Administrator",
                passwordHash: adminPassword,
                role: "admin",
            },
            {
                username: "kasir1",
                name: "Kasir Satu",
                passwordHash: cashierPassword,
                role: "cashier",
            },
        ]);

        console.log("✅ Users created!");

        // Create Products
        await db.insert(products).values([
            { name: "Original Es Teh", price: 5000, category: "Classic Series", imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&auto=format&fit=crop&q=60" },
            { name: "Es Teh Lemon", price: 7000, category: "Fruit Series", imageUrl: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=400&auto=format&fit=crop&q=60" },
            { name: "Es Teh Susu", price: 8000, category: "Milk Series", imageUrl: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&auto=format&fit=crop&q=60" },
            { name: "Es Teh Leci", price: 9000, category: "Fruit Series", imageUrl: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&auto=format&fit=crop&q=60" },
            { name: "Es Teh Tarik", price: 10000, category: "Milk Series", imageUrl: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&auto=format&fit=crop&q=60" },
            { name: "Es Teh Matcha", price: 12000, category: "Milk Series", imageUrl: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&auto=format&fit=crop&q=60" },
            { name: "Es Teh Yakult", price: 11000, category: "Fruit Series", imageUrl: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&auto=format&fit=crop&q=60" },
            { name: "Es Teh Coklat", price: 10000, category: "Milk Series", imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&auto=format&fit=crop&q=60" },
        ]);

        console.log("✅ Products created!");
        console.log("🎉 Database reset and seeding complete!");

    } catch (error) {
        console.error("❌ Error:", error);
        exit(1);
    }

    exit(0);
}

resetAndSeed();
