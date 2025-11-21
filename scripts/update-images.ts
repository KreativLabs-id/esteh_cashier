import "dotenv/config";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { exit } from "process";

async function updateImages() {
    console.log("Updating product images...");

    const productUpdates = [
        { name: "Original Es Teh", imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&auto=format&fit=crop&q=60" },
        { name: "Es Teh Lemon", imageUrl: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=400&auto=format&fit=crop&q=60" },
        { name: "Es Teh Susu", imageUrl: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&auto=format&fit=crop&q=60" },
        { name: "Es Teh Leci", imageUrl: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&auto=format&fit=crop&q=60" },
        { name: "Es Teh Tarik", imageUrl: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&auto=format&fit=crop&q=60" },
        { name: "Es Teh Matcha", imageUrl: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&auto=format&fit=crop&q=60" },
        { name: "Es Teh Yakult", imageUrl: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&auto=format&fit=crop&q=60" },
        { name: "Es Teh Coklat", imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&auto=format&fit=crop&q=60" },
    ];

    for (const product of productUpdates) {
        await db
            .update(products)
            .set({ imageUrl: product.imageUrl })
            .where(eq(products.name, product.name));
        console.log(`Updated: ${product.name}`);
    }

    console.log("All product images updated!");
    exit(0);
}

updateImages();
