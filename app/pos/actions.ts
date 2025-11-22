'use server';

import { signOut } from '@/lib/auth';

export async function handleLogout() {
    console.log('🚪 Logout initiated...');
    try {
        await signOut({ redirectTo: '/login' });
        console.log('✅ Logout successful');
    } catch (error) {
        console.error('❌ Logout error:', error);
        throw error;
    }
}
