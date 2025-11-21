import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET - Fetch all active products
export async function GET(request: NextRequest) {
    try {
        const allProducts = await db
            .select()
            .from(products)
            .where(eq(products.isActive, true));

        return NextResponse.json(allProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}
