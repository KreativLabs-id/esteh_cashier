'use client';

import { LayoutDashboard, ShoppingBag, Users, LogOut, CupSoda } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dasbor', href: '/admin/dashboard' },
        { icon: ShoppingBag, label: 'Produk', href: '/admin/products' },
        { icon: Users, label: 'Staf', href: '/admin/users' },
    ];

    return (
        <div className="flex h-screen bg-secondary-50 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-secondary-200 flex flex-col">
                <div className="p-6 flex items-center gap-3 border-b border-secondary-100">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                        <CupSoda size={20} />
                    </div>
                    <span className="text-xl font-bold text-secondary-900">Es Teh Admin</span>
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
                    <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 transition-all font-medium">
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
