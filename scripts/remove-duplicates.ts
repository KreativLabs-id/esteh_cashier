import "dotenv/config";
import { db } from "@/db";
import { products } from "@/db/schema";
import { sql } from "drizzle-orm";
import { exit } from "process";

async function removeDuplicates() {
    console.log("Removing duplicate products...");

    // Get all products
    const allProducts = await db.select().from(products);
    console.log(`Total products found: ${allProducts.length}`);

    // Group by name and keep only the first one
    const seen = new Set<string>();
    const toDelete: number[] = [];

    for (const product of allProducts) {
        if (seen.has(product.name)) {
            toDelete.push(product.id);
            console.log(`Marking duplicate for deletion: ${product.name} (ID: ${product.id})`);
        } else {
            seen.add(product.name);
            console.log(`Keeping: ${product.name} (ID: ${product.id})`);
        }
    }

    // Delete duplicates
    if (toDelete.length > 0) {
        for (const id of toDelete) {
            await db.delete(products).where(sql`${products.id} = ${id}`);
        }
        console.log(`Deleted ${toDelete.length} duplicate products`);
    } else {
        console.log("No duplicates found");
    }

    console.log("Done!");
    exit(0);
}

removeDuplicates();
