'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Coffee, TrendingUp, Calendar } from 'lucide-react';

interface Transaction {
    id: number;
    totalAmount: number;
    paymentMethod: string;
    createdAt: string;
    items: Array<{
        productName: string;
        quantity: number;
        priceAtSnapshot: number;
    }>;
}

export default function AdminDashboard() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await fetch('/api/transactions');
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate statistics from real data
    const totalSales = transactions.reduce((sum, trx) => sum + trx.totalAmount, 0);
    const totalCups = transactions.reduce((sum, trx) => 
        sum + trx.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );
    const avgOrderValue = transactions.length > 0 ? Math.round(totalSales / transactions.length) : 0;

    // Group sales by day for chart (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
    });

    const dailySales = last7Days.map(date => {
        const dayTransactions = transactions.filter(trx => 
            trx.createdAt.startsWith(date)
        );
        const sales = dayTransactions.reduce((sum, trx) => sum + trx.totalAmount, 0);
        const dayName = new Date(date).toLocaleDateString('id-ID', { weekday: 'short' });
        return {
            name: dayName,
            sales: sales
        };
    });

    // Get recent transactions (last 5)
    const recentTransactions = [...transactions]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .map(trx => ({
            id: `TRX-${trx.id.toString().padStart(3, '0')}`,
            cashier: 'John Doe',
            total: trx.totalAmount,
            method: trx.paymentMethod,
            date: new Date(trx.createdAt).toLocaleTimeString('id-ID', { 
                hour: '2-digit', 
                minute: '2-digit' 
            })
        }));

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
            <header className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900">Ringkasan Dasbor</h1>
                    <p className="text-secondary-500 text-sm sm:text-base">Selamat datang kembali, Admin</p>
                </div>
            </header>

            {loading ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">Memuat...</p>
                </div>
            ) : (
                <div className="space-y-6 lg:space-y-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                        <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-secondary-100 shadow-sm">
                            <div className="flex justify-between items-start mb-3 sm:mb-4">
                                <div className="p-2 sm:p-3 bg-green-100 text-green-600 rounded-lg sm:rounded-xl">
                                    <DollarSign size={20} className="sm:w-6 sm:h-6" />
                                </div>
                            </div>
                            <h3 className="text-secondary-500 text-xs sm:text-sm font-medium">Total Pendapatan</h3>
                            <p className="text-lg sm:text-2xl font-bold text-secondary-900">Rp {totalSales.toLocaleString()}</p>
                        </div>

                        <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-secondary-100 shadow-sm">
                            <div className="flex justify-between items-start mb-3 sm:mb-4">
                                <div className="p-2 sm:p-3 bg-primary-100 text-primary-600 rounded-lg sm:rounded-xl">
                                    <Coffee size={20} className="sm:w-6 sm:h-6" />
                                </div>
                            </div>
                            <h3 className="text-secondary-500 text-xs sm:text-sm font-medium">Gelas Terjual</h3>
                            <p className="text-lg sm:text-2xl font-bold text-secondary-900">{totalCups.toLocaleString()}</p>
                        </div>

                        <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-secondary-100 shadow-sm">
                            <div className="flex justify-between items-start mb-3 sm:mb-4">
                                <div className="p-2 sm:p-3 bg-blue-100 text-blue-600 rounded-lg sm:rounded-xl">
                                    <TrendingUp size={20} className="sm:w-6 sm:h-6" />
                                </div>
                            </div>
                            <h3 className="text-secondary-500 text-xs sm:text-sm font-medium">Rata-rata Pesanan</h3>
                            <p className="text-lg sm:text-2xl font-bold text-secondary-900">Rp {avgOrderValue.toLocaleString()}</p>
                        </div>

                        <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-secondary-100 shadow-sm">
                            <div className="flex justify-between items-start mb-3 sm:mb-4">
                                <div className="p-2 sm:p-3 bg-purple-100 text-purple-600 rounded-lg sm:rounded-xl">
                                    <Calendar size={20} className="sm:w-6 sm:h-6" />
                                </div>
                            </div>
                            <h3 className="text-secondary-500 text-xs sm:text-sm font-medium">Total Transaksi</h3>
                            <p className="text-lg sm:text-2xl font-bold text-secondary-900">{transactions.length}</p>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
                        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-secondary-100 shadow-sm">
                            <h3 className="text-base sm:text-lg font-bold text-secondary-900 mb-4 sm:mb-6">Ringkasan Penjualan Mingguan</h3>
                            <div className="h-60 sm:h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={dailySales}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} tickFormatter={(value) => `${value / 1000}k`} width={40} />
                                        <Tooltip
                                            cursor={{ fill: '#f8fafc' }}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            formatter={(value: number) => [`Rp ${value.toLocaleString()}`, 'Penjualan']}
                                        />
                                        <Bar dataKey="sales" fill="#ffc107" radius={[6, 6, 0, 0]} barSize={30} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-secondary-100 shadow-sm">
                            <h3 className="text-base sm:text-lg font-bold text-secondary-900 mb-4 sm:mb-6">Transaksi Terbaru</h3>
                            <div className="space-y-3 sm:space-y-4">
                                {recentTransactions.length === 0 ? (
                                    <p className="text-center text-gray-500 py-4 text-sm">Belum ada transaksi</p>
                                ) : (
                                    recentTransactions.map((trx) => (
                                        <div key={trx.id} className="flex items-center justify-between p-2 sm:p-3 hover:bg-secondary-50 rounded-lg sm:rounded-xl transition-colors">
                                            <div>
                                                <p className="font-bold text-secondary-800 text-sm">{trx.id}</p>
                                                <p className="text-xs text-secondary-500">{trx.cashier} • {trx.method}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-primary-600 text-sm">+Rp {trx.total.toLocaleString()}</p>
                                                <p className="text-xs text-secondary-400">{trx.date}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
