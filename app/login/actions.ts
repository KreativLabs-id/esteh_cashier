'use server';

import { signIn } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;

        await signIn('credentials', {
            username,
            password,
            redirectTo: '/pos',
        });

        return 'success';
    } catch (error: any) {
        if (error) {
            // NextAuth throws NEXT_REDIRECT on successful login
            if (error.message?.includes('NEXT_REDIRECT')) {
                redirect('/pos');
            }
            return 'Invalid credentials.';
        }
        return 'Something went wrong.';
    }
}
