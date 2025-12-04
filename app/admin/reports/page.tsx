'use client';

import { useState, useEffect } from 'react';
import { Calendar, Download, TrendingUp, DollarSign, ShoppingBag, FileText, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

type ReportPeriod = 'daily' | 'weekly' | 'monthly';

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

interface ReportData {
    totalRevenue: number;
    totalTransactions: number;
    totalItems: number;
    transactions: Transaction[];
    topProducts: Array<{
        name: string;
        quantity: number;
        revenue: number;
    }>;
}

export default function ReportsPage() {
    const [period, setPeriod] = useState<ReportPeriod>('daily');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);

    // Set default dates
    useEffect(() => {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        setEndDate(todayStr);

        if (period === 'daily') {
            setStartDate(todayStr);
        } else if (period === 'weekly') {
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            setStartDate(weekAgo.toISOString().split('T')[0]);
        } else if (period === 'monthly') {
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            setStartDate(monthAgo.toISOString().split('T')[0]);
        }
    }, [period]);

    const fetchReport = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/reports?startDate=${startDate}&endDate=${endDate}`);
            if (response.ok) {
                const data = await response.json();
                setReportData(data);
            }
        } catch (error) {
            console.error('Error fetching report:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (startDate && endDate) {
            fetchReport();
        }
    }, [startDate, endDate]);

    const exportToPDF = async () => {
        if (!reportData) return;

        setExporting(true);
        try {
            // Dynamic import to avoid SSR issues
            const jsPDF = (await import('jspdf')).default;
            const autoTable = (await import('jspdf-autotable')).default;

            const doc = new jsPDF();

            // Header
            doc.setFontSize(20);
            doc.setFont('helvetica', 'bold');
            doc.text('TEH BARUDAK INDONESIA', 105, 20, { align: 'center' });

            doc.setFontSize(16);
            doc.text('Laporan Penjualan', 105, 30, { align: 'center' });

            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`Periode: ${new Date(startDate).toLocaleDateString('id-ID')} - ${new Date(endDate).toLocaleDateString('id-ID')}`, 105, 38, { align: 'center' });
            doc.text(`Dicetak: ${new Date().toLocaleString('id-ID')}`, 105, 44, { align: 'center' });

            // Summary boxes
            doc.setFillColor(16, 185, 129);
            doc.rect(14, 50, 60, 25, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(10);
            doc.text('Total Pendapatan', 44, 58, { align: 'center' });
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text(`Rp ${reportData.totalRevenue.toLocaleString('id-ID')}`, 44, 68, { align: 'center' });

            doc.setFillColor(59, 130, 246);
            doc.rect(78, 50, 60, 25, 'F');
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text('Total Transaksi', 108, 58, { align: 'center' });
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text(reportData.totalTransactions.toString(), 108, 68, { align: 'center' });

            doc.setFillColor(168, 85, 247);
            doc.rect(142, 50, 60, 25, 'F');
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text('Total Item Terjual', 172, 58, { align: 'center' });
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text(reportData.totalItems.toString(), 172, 68, { align: 'center' });

            // Top Products Table
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('Produk Terlaris', 14, 85);

            autoTable(doc, {
                startY: 90,
                head: [['Produk', 'Jumlah Terjual', 'Pendapatan']],
                body: reportData.topProducts.map(p => [
                    p.name,
                    p.quantity.toString(),
                    `Rp ${p.revenue.toLocaleString('id-ID')}`
                ]),
                theme: 'grid',
                headStyles: { fillColor: [16, 185, 129] },
            });

            // Transactions Table
            const finalY = (doc as any).lastAutoTable.finalY || 90;
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('Rincian Transaksi', 14, finalY + 10);

            autoTable(doc, {
                startY: finalY + 15,
                head: [['Tanggal', 'ID Transaksi', 'Metode', 'Total']],
                body: reportData.transactions.map(t => [
                    new Date(t.createdAt).toLocaleString('id-ID'),
                    `TRX-${t.id.toString().padStart(3, '0')}`,
                    t.paymentMethod.toUpperCase(),
                    `Rp ${t.totalAmount.toLocaleString('id-ID')}`
                ]),
                theme: 'striped',
                headStyles: { fillColor: [59, 130, 246] },
            });

            // Save PDF
            const filename = `Laporan_${period}_${startDate}_${endDate}.pdf`;
            doc.save(filename);
        } catch (error) {
            console.error('Error exporting PDF:', error);
            alert('Gagal export PDF. Silakan coba lagi.');
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Laporan Penjualan</h1>
                    <p className="text-gray-600 text-xs sm:text-sm">Lihat dan download laporan penjualan</p>
                </div>
                <button
                    onClick={exportToPDF}
                    disabled={!reportData || exporting}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium w-full sm:w-auto"
                >
                    {exporting ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Exporting...
                        </>
                    ) : (
                        <>
                            <Download size={18} />
                            Export PDF
                        </>
                    )}
                </button>
            </div>

            {/* Period Selection */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="text-primary-600" size={18} />
                    <h2 className="font-semibold text-gray-800 text-sm sm:text-base">Pilih Periode</h2>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4">
                    <button
                        onClick={() => setPeriod('daily')}
                        className={clsx(
                            'p-2 sm:p-4 rounded-lg border-2 transition-all text-center',
                            period === 'daily'
                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                : 'border-gray-200 hover:border-gray-300'
                        )}
                    >
                        <div className="font-semibold text-xs sm:text-base">Harian</div>
                        <div className="text-xs text-gray-600 hidden sm:block">Laporan hari ini</div>
                    </button>
                    <button
                        onClick={() => setPeriod('weekly')}
                        className={clsx(
                            'p-2 sm:p-4 rounded-lg border-2 transition-all text-center',
                            period === 'weekly'
                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                : 'border-gray-200 hover:border-gray-300'
                        )}
                    >
                        <div className="font-semibold text-xs sm:text-base">Mingguan</div>
                        <div className="text-xs text-gray-600 hidden sm:block">7 hari terakhir</div>
                    </button>
                    <button
                        onClick={() => setPeriod('monthly')}
                        className={clsx(
                            'p-2 sm:p-4 rounded-lg border-2 transition-all text-center',
                            period === 'monthly'
                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                : 'border-gray-200 hover:border-gray-300'
                        )}
                    >
                        <div className="font-semibold text-xs sm:text-base">Bulanan</div>
                        <div className="text-xs text-gray-600 hidden sm:block">30 hari terakhir</div>
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Tanggal Mulai</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Tanggal Akhir</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 size={40} className="animate-spin text-primary-600" />
                </div>
            )}

            {/* Report Data */}
            {!loading && reportData && (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
                        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 sm:p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                                <DollarSign size={24} className="sm:w-8 sm:h-8" />
                                <TrendingUp size={20} className="opacity-80 sm:w-6 sm:h-6" />
                            </div>
                            <div className="text-xs sm:text-sm opacity-90">Total Pendapatan</div>
                            <div className="text-lg sm:text-2xl font-bold mt-1">Rp {reportData.totalRevenue.toLocaleString('id-ID')}</div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 sm:p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                                <FileText size={24} className="sm:w-8 sm:h-8" />
                                <TrendingUp size={20} className="opacity-80 sm:w-6 sm:h-6" />
                            </div>
                            <div className="text-xs sm:text-sm opacity-90">Total Transaksi</div>
                            <div className="text-lg sm:text-2xl font-bold mt-1">{reportData.totalTransactions}</div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 sm:p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                                <ShoppingBag size={24} className="sm:w-8 sm:h-8" />
                                <TrendingUp size={20} className="opacity-80 sm:w-6 sm:h-6" />
                            </div>
                            <div className="text-xs sm:text-sm opacity-90">Total Item Terjual</div>
                            <div className="text-lg sm:text-2xl font-bold mt-1">{reportData.totalItems}</div>
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
                        <h2 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">Produk Terlaris</h2>
                        <div className="overflow-x-auto -mx-4 sm:mx-0">
                            <table className="w-full min-w-[400px]">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-2 sm:py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Produk</th>
                                        <th className="text-right py-2 sm:py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Qty</th>
                                        <th className="text-right py-2 sm:py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Pendapatan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.topProducts.map((product, idx) => (
                                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm">{product.name}</td>
                                            <td className="py-2 sm:py-3 px-4 text-right font-medium text-xs sm:text-sm">{product.quantity}</td>
                                            <td className="py-2 sm:py-3 px-4 text-right font-medium text-green-600 text-xs sm:text-sm">
                                                Rp {product.revenue.toLocaleString('id-ID')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Transactions List */}
                    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
                        <h2 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">Rincian Transaksi</h2>
                        
                        {/* Mobile Card View */}
                        <div className="sm:hidden space-y-3">
                            {reportData.transactions.map((transaction) => (
                                <div key={transaction.id} className="border border-gray-200 rounded-lg p-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-semibold text-sm">TRX-{transaction.id.toString().padStart(3, '0')}</p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(transaction.createdAt).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                            {transaction.paymentMethod.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-bold text-green-600">
                                            Rp {transaction.totalAmount.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Tanggal</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">ID Transaksi</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Metode</th>
                                        <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.transactions.map((transaction) => (
                                        <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm">
                                                {new Date(transaction.createdAt).toLocaleString('id-ID')}
                                            </td>
                                            <td className="py-3 px-4 font-medium text-sm">
                                                TRX-{transaction.id.toString().padStart(3, '0')}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                                    {transaction.paymentMethod.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right font-medium text-green-600 text-sm">
                                                Rp {transaction.totalAmount.toLocaleString('id-ID')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
