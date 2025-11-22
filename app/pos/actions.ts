'use server';

import { signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function handleLogout() {
    console.log('🚪 Starting logout process...');
    try {
        // Sign out without automatic redirect
        await signOut({ redirect: false });
        console.log('✅ Session cleared');
    } catch (error) {
        console.error('❌ Logout error:', error);
    }
    // Manual redirect after signout
    redirect('/login');
}
