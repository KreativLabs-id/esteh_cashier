import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { transactions, transactionItems, products } from '@/db/schema';
import { and, gte, lte, sql, eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        if (!startDate || !endDate) {
            return NextResponse.json(
                { error: 'Start date and end date are required' },
                { status: 400 }
            );
        }

        // Parse dates and set time boundaries
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        // Fetch transactions within date range
        const transactionsList = await db
            .select()
            .from(transactions)
            .where(
                and(
                    gte(transactions.createdAt, start),
                    lte(transactions.createdAt, end)
                )
            )
            .orderBy(transactions.createdAt);

        // Fetch transaction items for all transactions
        const transactionIds = transactionsList.map(t => t.id);
        let items: any[] = [];

        if (transactionIds.length > 0) {
            items = await db
                .select()
                .from(transactionItems)
                .where(
                    sql`${transactionItems.transactionId} IN ${transactionIds}`
                );
        }

        // Calculate summary
        const totalRevenue = transactionsList.reduce((sum, t) => sum + t.totalAmount, 0);
        const totalTransactions = transactionsList.length;
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

        // Calculate top products
        const productSales = new Map<string, { quantity: number; revenue: number }>();

        items.forEach(item => {
            const existing = productSales.get(item.productName) || { quantity: 0, revenue: 0 };
            productSales.set(item.productName, {
                quantity: existing.quantity + item.quantity,
                revenue: existing.revenue + (item.quantity * item.priceAtSnapshot)
            });
        });

        const topProducts = Array.from(productSales.entries())
            .map(([name, data]) => ({
                name,
                quantity: data.quantity,
                revenue: data.revenue
            }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);

        // Format transactions with items
        const formattedTransactions = transactionsList.map(t => ({
            id: t.id,
            totalAmount: t.totalAmount,
            paymentMethod: t.paymentMethod,
            createdAt: t.createdAt,
            items: items
                .filter(item => item.transactionId === t.id)
                .map(item => ({
                    productName: item.productName,
                    quantity: item.quantity,
                    priceAtSnapshot: item.priceAtSnapshot
                }))
        }));

        return NextResponse.json({
            totalRevenue,
            totalTransactions,
            totalItems,
            topProducts,
            transactions: formattedTransactions
        });
    } catch (error) {
        console.error('Error fetching report:', error);
        return NextResponse.json(
            { error: 'Failed to fetch report' },
            { status: 500 }
        );
    }
}
