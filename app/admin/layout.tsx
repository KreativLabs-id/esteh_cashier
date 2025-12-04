'use client';

import { LayoutDashboard, ShoppingBag, Users, LogOut, CupSoda, FileText, Loader2, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { useState, useEffect } from 'react';
import { handleLogout } from '@/app/pos/actions';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { icon: LayoutDashboard, label: 'Dasbor', href: '/admin/dashboard' },
        { icon: ShoppingBag, label: 'Produk', href: '/admin/products' },
        { icon: FileText, label: 'Laporan', href: '/admin/reports' },
        { icon: Users, label: 'Staf', href: '/admin/users' },
    ];

    // Close sidebar when route changes
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    return (
        <div className="flex h-screen bg-secondary-50 font-sans">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-secondary-200 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                            <CupSoda size={16} />
                        </div>
                        <span className="font-bold text-secondary-900">Teh Barudak</span>
                    </div>
                </div>
            </div>

            {/* Overlay */}
            {sidebarOpen && (
                <div 
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={clsx(
                "fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-white border-r border-secondary-200 flex flex-col transform transition-transform duration-300 ease-in-out",
                sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                <div className="p-4 lg:p-6 flex items-center justify-between border-b border-secondary-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                            <CupSoda size={20} />
                        </div>
                        <span className="text-lg lg:text-xl font-bold text-secondary-900">Teh Barudak Admin</span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map(item => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                                    isActive
                                        ? "bg-primary-50 text-primary-700"
                                        : "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900"
                                )}
                            >
                                <item.icon size={20} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-secondary-100">
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        disabled={isLoggingOut}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoggingOut ? <Loader2 size={20} className="animate-spin" /> : <LogOut size={20} />}
                        {isLoggingOut ? 'Logging out...' : 'Sign Out'}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto pt-14 lg:pt-0">
                {children}
            </main>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mx-auto">
                            <LogOut size={32} className="text-red-600" />
                        </div>

                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-bold text-gray-800">Konfirmasi Logout</h3>
                            <p className="text-gray-600">
                                Apakah Anda yakin ingin keluar dari sistem admin?
                            </p>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={() => {
                                    console.log('❌ [ADMIN-MODAL] User clicked Cancel');
                                    setShowLogoutModal(false);
                                }}
                                disabled={isLoggingOut}
                                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Batal
                            </button>
                            <button
                                onClick={async () => {
                                    console.log('✅ [ADMIN-MODAL] User clicked Logout');
                                    console.log('⏳ [ADMIN-MODAL] Setting loading state...');
                                    setIsLoggingOut(true);
                                    console.log('📞 [ADMIN-MODAL] Calling handleLogout()...');
                                    try {
                                        await handleLogout();
                                        console.log('✅ [ADMIN-MODAL] handleLogout() completed');
                                    } catch (error: any) {
                                        console.log('🔄 [ADMIN-MODAL] Caught error:', error?.message || error);
                                        // NEXT_REDIRECT is expected, let it propagate
                                        if (error?.message?.includes('NEXT_REDIRECT')) {
                                            console.log('✅ [ADMIN-MODAL] NEXT_REDIRECT detected - this is normal!');
                                            throw error;
                                        }
                                        console.error('❌ [ADMIN-MODAL] Unexpected error:', error);
                                        setIsLoggingOut(false);
                                        setShowLogoutModal(false);
                                    }
                                }}
                                disabled={isLoggingOut}
                                className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoggingOut ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Logging out...
                                    </>
                                ) : (
                                    'Ya, Logout'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
