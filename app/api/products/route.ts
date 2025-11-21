import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET - Fetch all products (or only active ones based on query parameter)
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const showAll = searchParams.get('all') === 'true';
        
        let allProducts;
        if (showAll) {
            // For admin - show all products
            allProducts = await db.select().from(products);
        } else {
            // For POS - show only active products
            allProducts = await db
                .select()
                .from(products)
                .where(eq(products.isActive, true));
        }

        return NextResponse.json(allProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

// POST - Create new product
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, price, category, imageUrl, isActive } = body;

        if (!name || !price || !category) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const [newProduct] = await db
            .insert(products)
            .values({
                name,
                price,
                category,
                imageUrl: imageUrl || null,
                isActive: isActive !== undefined ? isActive : true
            })
            .returning();

        return NextResponse.json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
