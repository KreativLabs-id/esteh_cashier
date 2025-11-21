import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// GET - Fetch all users
export async function GET() {
    try {
        const allUsers = await db.select({
            id: users.id,
            username: users.username,
            name: users.name,
            role: users.role,
            createdAt: users.createdAt
        }).from(users);

        return NextResponse.json(allUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

// POST - Create new user
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, name, password, role } = body;

        if (!username || !name || !password || !role) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if username already exists
        const existingUser = await db.select()
            .from(users)
            .where(eq(users.username, username))
            .limit(1);

        if (existingUser.length > 0) {
            return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        const [newUser] = await db
            .insert(users)
            .values({
                username,
                name,
                passwordHash,
                role
            })
            .returning({
                id: users.id,
                username: users.username,
                name: users.name,
                role: users.role,
                createdAt: users.createdAt
            });

        return NextResponse.json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}
