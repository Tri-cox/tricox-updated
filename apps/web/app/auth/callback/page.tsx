"use client";
import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from '../../../lib/toast';
import axios from 'axios';

export default function AuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get('code');
    const processed = useRef(false);

    useEffect(() => {
        if (!code) {
            router.push('/signup?error=No+code+provided');
            return;
        }

        if (processed.current) return;
        processed.current = true;

        const exchangeCode = async () => {
            const toastId = toast.loading('Authenticating with GitHub...', { title: 'Please wait' });

            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const res = await axios.post(`${API_URL}/auth/github`, { code });

                const user = res.data;

                if (user.token) {
                    localStorage.setItem('tricox_user', JSON.stringify(user));
                    toast.success({ title: 'Success', message: 'GitHub Login Successful' });
                    router.push('/dashboard');
                } else {
                    throw new Error('No token returned from backend');
                }

            } catch (error: any) {
                toast.error({ title: 'Login Failed', message: error.response?.data?.message || error.message });
                router.push('/signup');
            }
        };

        exchangeCode();
    }, [code, router]);

    return (
        <div className="h-screen w-full flex items-center justify-center bg-[#0A0A0A] text-white">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-mono text-gray-400">Handshaking with satellite...</p>
            </div>
        </div>
    );
}
