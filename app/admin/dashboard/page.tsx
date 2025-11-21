'use client';

import { mockDailySales, mockTransactions } from '@/lib/mock-data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Coffee, TrendingUp, Calendar } from 'lucide-react';

export default function AdminDashboard() {
    const totalSales = mockDailySales.reduce((acc, curr) => acc + curr.sales, 0);

    return (
        <div className="p-8 space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-secondary-900">Dashboard Overview</h1>
                <p className="text-secondary-500">Welcome back, Admin</p>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-secondary-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                            <DollarSign size={24} />
                        </div>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">+12%</span>
                    </div>
                    <h3 className="text-secondary-500 text-sm font-medium">Total Revenue</h3>
                    <p className="text-2xl font-bold text-secondary-900">Rp {totalSales.toLocaleString()}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-secondary-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-primary-100 text-primary-600 rounded-xl">
                            <Coffee size={24} />
                        </div>
                        <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-lg">+5%</span>
                    </div>
                    <h3 className="text-secondary-500 text-sm font-medium">Cups Sold</h3>
                    <p className="text-2xl font-bold text-secondary-900">1,245</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-secondary-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <h3 className="text-secondary-500 text-sm font-medium">Avg. Order Value</h3>
                    <p className="text-2xl font-bold text-secondary-900">Rp 28,500</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-secondary-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                            <Calendar size={24} />
                        </div>
                    </div>
                    <h3 className="text-secondary-500 text-sm font-medium">Active Shift</h3>
                    <p className="text-2xl font-bold text-secondary-900">Shift 1</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-secondary-100 shadow-sm">
                    <h3 className="text-lg font-bold text-secondary-900 mb-6">Weekly Sales Overview</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mockDailySales}>
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
                    <h3 className="text-lg font-bold text-secondary-900 mb-6">Recent Transactions</h3>
                    <div className="space-y-4">
                        {mockTransactions.map((trx) => (
                            <div key={trx.id} className="flex items-center justify-between p-3 hover:bg-secondary-50 rounded-xl transition-colors">
                                <div>
                                    <p className="font-bold text-secondary-800">{trx.id}</p>
                                    <p className="text-xs text-secondary-500">{trx.cashier} • {trx.method}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-primary-600">+Rp {trx.total.toLocaleString()}</p>
                                    <p className="text-xs text-secondary-400">{trx.date.split(' ')[1]}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-2 text-sm font-medium text-secondary-600 hover:text-primary-600 transition-colors">
                        View All Transactions
                    </button>
                </div>
            </div>
        </div>
    );
}
