import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { transactions, transactionItems, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// GET - Fetch all transactions
export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch transactions with items
        const allTransactions = await db
            .select({
                id: transactions.id,
                cashierId: transactions.cashierId,
                totalAmount: transactions.totalAmount,
                paymentMethod: transactions.paymentMethod,
                cashAmount: transactions.cashAmount,
                changeAmount: transactions.changeAmount,
                createdAt: transactions.createdAt,
            })
            .from(transactions)
            .orderBy(desc(transactions.createdAt));

        // Fetch transaction items for each transaction
        const transactionsWithItems = await Promise.all(
            allTransactions.map(async (transaction) => {
                const items = await db
                    .select()
                    .from(transactionItems)
                    .where(eq(transactionItems.transactionId, transaction.id));

                return {
                    ...transaction,
                    items,
                };
            })
        );

        return NextResponse.json(transactionsWithItems);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
    }
}

// POST - Create new transaction
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { items, totalAmount, paymentMethod, cashAmount, changeAmount } = body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: 'Items are required' }, { status: 400 });
        }

        if (!totalAmount || !paymentMethod) {
            return NextResponse.json({ error: 'Total amount and payment method are required' }, { status: 400 });
        }

        // Get cashier user ID from session
        const cashierUser = await db
            .select()
            .from(users)
            .where(eq(users.username, session.user.name || ''))
            .limit(1);

        if (!cashierUser || cashierUser.length === 0) {
            return NextResponse.json({ error: 'Cashier not found' }, { status: 404 });
        }

        // Create transaction
        const [newTransaction] = await db
            .insert(transactions)
            .values({
                cashierId: cashierUser[0].id,
                totalAmount,
                paymentMethod,
                cashAmount: cashAmount || null,
                changeAmount: changeAmount || null,
            })
            .returning();

        // Create transaction items
        const transactionItemsData = items.map((item: any) => ({
            transactionId: newTransaction.id,
            productId: item.productId,
            quantity: item.quantity,
            priceAtSnapshot: item.price,
        }));

        await db.insert(transactionItems).values(transactionItemsData);

        return NextResponse.json({
            success: true,
            transaction: newTransaction,
        });
    } catch (error) {
        console.error('Error creating transaction:', error);
        return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
    }
}
