import "dotenv/config";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

async function updateNames() {
    console.log("Updating existing user names...");

    try {
        // Update admin user
        await db.update(users)
            .set({ name: "Administrator" })
            .where(eq(users.username, "admin"));
        
        console.log("Updated admin name");

        // Update kasir1 user
        await db.update(users)
            .set({ name: "Kasir Satu" })
            .where(eq(users.username, "kasir1"));
        
        console.log("Updated kasir1 name");

        console.log("All names updated successfully!");
    } catch (error) {
        console.error("Error updating names:", error);
    }

    process.exit(0);
}

updateNames();
