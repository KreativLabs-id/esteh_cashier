import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';

// PUT - Update product
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        const body = await request.json();
        const { name, price, category, imageUrl, isActive } = body;

        console.log('📝 Updating product:', id, { name, price, category, imageUrl, isActive });

        if (!name || !price || !category) {
            console.error('❌ Missing required fields');
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const [updatedProduct] = await db
            .update(products)
            .set({
                name,
                price,
                category,
                imageUrl: imageUrl || null,
                isActive: isActive !== undefined ? isActive : true
            })
            .where(eq(products.id, id))
            .returning();

        if (!updatedProduct) {
            console.error('❌ Product not found:', id);
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        console.log('✅ Product updated successfully:', updatedProduct);
        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error('❌ Error updating product:', error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

// DELETE - Delete product
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);

        console.log('🗑️ Deleting product:', id);

        const deleted = await db
            .delete(products)
            .where(eq(products.id, id))
            .returning();

        if (!deleted || deleted.length === 0) {
            console.error('❌ Product not found:', id);
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        console.log('✅ Product deleted successfully:', id);
        return NextResponse.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('❌ Error deleting product:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
