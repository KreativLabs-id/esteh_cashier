'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Coffee, TrendingUp, Calendar, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

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
        <div className="p-8 space-y-8">
            <header className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-secondary-900">Ringkasan Dasbor</h1>
                    <p className="text-secondary-500">Selamat datang kembali, Admin</p>
                </div>
                <button
                    onClick={async () => {
                        if (confirm('Apakah Anda yakin ingin logout?')) {
                            await signOut({ callbackUrl: '/login' });
                        }
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                >
                    <LogOut size={18} />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </header>

            {loading ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">Memuat...</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-secondary-100 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                                    <DollarSign size={24} />
                                </div>
                            </div>
                            <h3 className="text-secondary-500 text-sm font-medium">Total Pendapatan</h3>
                            <p className="text-2xl font-bold text-secondary-900">Rp {totalSales.toLocaleString()}</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-secondary-100 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-primary-100 text-primary-600 rounded-xl">
                                    <Coffee size={24} />
                                </div>
                            </div>
                            <h3 className="text-secondary-500 text-sm font-medium">Gelas Terjual</h3>
                            <p className="text-2xl font-bold text-secondary-900">{totalCups.toLocaleString()}</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-secondary-100 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                                    <TrendingUp size={24} />
                                </div>
                            </div>
                            <h3 className="text-secondary-500 text-sm font-medium">Rata-rata Nilai Pesanan</h3>
                            <p className="text-2xl font-bold text-secondary-900">Rp {avgOrderValue.toLocaleString()}</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-secondary-100 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                                    <Calendar size={24} />
                                </div>
                            </div>
                            <h3 className="text-secondary-500 text-sm font-medium">Total Transaksi</h3>
                            <p className="text-2xl font-bold text-secondary-900">{transactions.length}</p>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-secondary-100 shadow-sm">
                            <h3 className="text-lg font-bold text-secondary-900 mb-6">Ringkasan Penjualan Mingguan</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={dailySales}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} tickFormatter={(value) => `Rp ${value / 1000}k`} />
                                        <Tooltip
                                            cursor={{ fill: '#f8fafc' }}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Bar dataKey="sales" fill="#ffc107" radius={[6, 6, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div className="bg-white p-6 rounded-2xl border border-secondary-100 shadow-sm">
                            <h3 className="text-lg font-bold text-secondary-900 mb-6">Transaksi Terbaru</h3>
                            <div className="space-y-4">
                                {recentTransactions.length === 0 ? (
                                    <p className="text-center text-gray-500 py-4">Belum ada transaksi</p>
                                ) : (
                                    recentTransactions.map((trx) => (
                                        <div key={trx.id} className="flex items-center justify-between p-3 hover:bg-secondary-50 rounded-xl transition-colors">
                                            <div>
                                                <p className="font-bold text-secondary-800">{trx.id}</p>
                                                <p className="text-xs text-secondary-500">{trx.cashier} • {trx.method}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-primary-600">+Rp {trx.total.toLocaleString()}</p>
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
