"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, User, LogOut, LayoutDashboard } from 'lucide-react';

export default function PublicNavbar() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem('tricox_user');
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse user", e);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('tricox_user');
        setUser(null);
        router.push('/');
        // Optional: toast.success({ title: 'Logged out', message: 'See you soon!' });
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
                        <div className="bg-indigo-600 p-1.5 rounded-lg">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">TRICOX</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                            Features
                        </Link>

                        <Link href="/dashboard/docs" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                            Docs
                        </Link>
                        <a href="https://github.com" target="_blank" rel="noreferrer" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                            GitHub
                        </a>
                    </div>

                    <div className="flex items-center gap-4">
                        {mounted && user ? (
                            <>
                                <div className="hidden sm:flex items-center gap-2 mr-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold ring-2 ring-black text-white">
                                        {user.email?.[0].toUpperCase() || 'U'}
                                    </div>
                                    <span className="text-sm font-medium text-white">
                                        {user.email?.split('@')[0]}
                                    </span>
                                </div>

                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg transition-all border border-white/10"
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    Dashboard
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                    title="Sign Out"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/signup" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                    Sign In
                                </Link>
                                <Link href="/signup" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-all shadow-lg shadow-indigo-500/25">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
