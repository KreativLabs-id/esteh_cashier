import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// PUT - Update user
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        const body = await request.json();
        const { username, name, password, role } = body;

        if (!username || !name || !role) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const updateData: Record<string, string> = {
            username,
            name,
            role
        };

        // Only hash and update password if provided
        if (password) {
            updateData.passwordHash = await bcrypt.hash(password, 10);
        }

        const [updatedUser] = await db
            .update(users)
            .set(updateData)
            .where(eq(users.id, id))
            .returning({
                id: users.id,
                username: users.username,
                name: users.name,
                role: users.role,
                createdAt: users.createdAt
            });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

// DELETE - Delete user
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);

        await db
            .delete(users)
            .where(eq(users.id, id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
