"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/DashboardLayout';
import { toast } from '../../lib/toast';

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    const toastShown = React.useRef(false);

    useEffect(() => {
        const user = localStorage.getItem('tricox_user');
        if (!user) {
            if (!toastShown.current) {
                toast.error({
                    title: 'Access Denied',
                    message: 'Please sign in to access the dashboard.',
                    position: 'topCenter'
                });
                toastShown.current = true;
            }
            router.push('/signup');
        } else {
            setAuthorized(true);
        }
    }, [router]);

    if (!authorized) {
        return null; // Or a loading spinner
    }

    return (
        <DashboardLayout>
            {children}
        </DashboardLayout>
    );
}
