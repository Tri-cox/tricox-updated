"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, Package, BookOpen, Settings, LogOut, Terminal, Bell, Search, Menu, X } from 'lucide-react';
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const containerRef = React.useRef(null);

    useGSAP(() => {
        gsap.to(".dashboard-content", {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            delay: 0.1
        });
    }, { scope: containerRef, dependencies: [pathname] });

    useEffect(() => {
        const stored = localStorage.getItem('tricox_user');
        if (stored) setUser(JSON.parse(stored));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('tricox_user');
        router.push('/signup');
    };

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        {
            name: user?.email === 'admin@gmail.com' ? 'Global Registry' : 'My Components',
            icon: Package,
            path: '/dashboard/components'
        },
        { name: 'Documents', icon: BookOpen, path: '/dashboard/docs' },
        { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
    ];

    return (
        <div ref={containerRef} className="flex h-screen bg-black font-sans text-white selection:bg-indigo-500 selection:text-white transition-colors duration-300">
            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex w-64 border-r border-white/10 flex-col bg-black transition-colors duration-300">
                <div className="p-6 flex items-center gap-3">
                    <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
                        <Terminal className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white">TRICOX</h1>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Developer Console</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-6">
                    {navItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => router.push(item.path)}
                            className={`flex items-center w-full px-4 py-3 rounded-lg transition-all text-sm font-medium ${pathname === item.path
                                ? 'bg-white/10 text-white shadow-sm border border-white/5'
                                : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 mr-3 ${pathname === item.path ? 'text-indigo-400' : 'text-gray-500'}`} />
                            {item.name}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors group"
                    >
                        <LogOut className="w-5 h-5 mr-3 text-red-400 group-hover:text-red-300 transition-colors" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 bg-black transition-colors duration-300">
                {/* Top Navbar */}
                <header className="h-16 border-b border-white/10 flex items-center justify-between px-4 sm:px-8 bg-black/50 backdrop-blur-xl sticky top-0 z-10 transition-colors duration-300">
                    <div className="flex items-center">
                        <button
                            className="md:hidden mr-4 text-gray-400 hover:text-white"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X /> : <Menu />}
                        </button>
                        {/* Breadcrumbs or Page Title could go here */}
                        <div className="hidden sm:flex items-center text-sm text-gray-500">
                            <span className="text-gray-300">Overview</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Search Bar Mockup */}
                        <div className="hidden md:flex relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-64 transition-all placeholder-gray-500"
                            />
                        </div>

                        {/* Notifications */}
                        <button className="text-gray-400 hover:text-white transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-indigo-500 rounded-full border-2 border-black"></span>
                        </button>

                        {/* User Profile */}
                        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold ring-2 ring-black text-white">
                                {user?.email?.[0].toUpperCase() || 'U'}
                            </div>
                            <span className="hidden sm:block text-sm font-medium text-gray-300">
                                {user?.email?.split('@')[0] || 'User'}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Mobile Menu (Overlay) */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-16 left-0 w-full bg-black border-b border-white/10 z-20 shadow-2xl p-4 transition-colors duration-300">
                        <nav className="space-y-2">
                            {navItems.map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => {
                                        router.push(item.path);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium ${pathname === item.path
                                        ? 'bg-white/10 text-white'
                                        : 'text-gray-400'
                                        }`}
                                >
                                    <item.icon className={`w-5 h-5 mr-3 ${pathname === item.path ? 'text-indigo-400' : 'text-gray-500'}`} />
                                    {item.name}
                                </button>
                            ))}
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-lg mt-4"
                            >
                                <LogOut className="w-5 h-5 mr-3" />
                                Sign Out
                            </button>
                        </nav>
                    </div>
                )}

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto dashboard-content opacity-0">
                    {children}
                </div>
            </main>
        </div>
    );
}
