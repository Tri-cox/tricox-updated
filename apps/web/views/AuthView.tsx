"use client";
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signup, login } from '../lib/api';
import { toast } from '../lib/toast';
import { Mail, Lock, Building, Github, ArrowLeft, ArrowRight, Code2, Box, Cpu, Layers } from 'lucide-react';
import Link from 'next/link';
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function AuthView() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [org, setOrg] = useState('');
    const router = useRouter();

    const containerRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline();

        // 3D Floating Elements Animation
        gsap.to(".floating-ui-card", {
            y: "random(-20, 20)",
            x: "random(-10, 10)",
            rotation: "random(-5, 5)",
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            stagger: {
                amount: 1.5,
                from: "random"
            }
        });

        // Form Entrance
        tl.from(".glass-form", {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power4.out"
        })
            .from(".form-input-group", {
                x: -20,
                opacity: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.5");

    }, { scope: containerRef });

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isLogin && password !== confirmPassword) {
            toast.error({ title: 'Error', message: 'Passwords do not match' });
            return;
        }

        try {
            if (isLogin) {
                const user = await login(email, password);
                localStorage.setItem('tricox_user', JSON.stringify(user));
                toast.success({ title: 'Success', message: 'Welcome back!' });

                router.push('/dashboard');
            } else {
                await signup(email, org, password);
                toast.success({ title: 'Success', message: 'Account created! Please sign in.' });
                setIsLogin(true); // Switch to login view
                setPassword('');
                setConfirmPassword('');
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message;
            if (isLogin && err.response?.status === 404) {
                toast.warning({ title: 'Account Not Found', message: 'Please create an account.' });
            } else if (!isLogin && err.response?.status === 401) {
                toast.warning({ title: 'User Exists', message: 'Please sign in instead.' });
            } else {
                toast.error({ title: 'Error', message: msg || 'Authentication failed' });
            }
        }
    };

    const handleGithubLogin = () => {
        const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || 'Ov23li9vXw7R2L12Jk3f'; // Fallback or env
        const redirectUri = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '';
        const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user`;
        window.location.href = githubUrl;
    };

    return (
        <div ref={containerRef} className="min-h-screen w-full flex bg-[#030014] font-sans text-white overflow-hidden relative selection:bg-purple-500/50">

            {/* Ambient Background & Noise */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-purple-900/30 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-indigo-900/30 rounded-full blur-[120px] animate-pulse delay-1000"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            {/* Left Column: 3D Visuals */}
            <div className="hidden lg:flex w-[55%] relative z-10 flex-col justify-center items-center perspective-1000">
                <div className="relative w-full max-w-2xl h-[600px] flex items-center justify-center transform-style-3d">

                    {/* Floating Card 1: Components */}
                    <div className="floating-ui-card absolute top-10 left-10 w-64 bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl transform -rotate-6 transition-transform hover:scale-105 hover:z-50 hover:border-purple-500/50 duration-300">
                        <div className="flex items-center gap-3 mb-3 border-b border-white/5 pb-3">
                            <Box className="w-5 h-5 text-purple-400" />
                            <span className="text-sm font-bold text-gray-200">Button.tsx</span>
                        </div>
                        <div className="space-y-2">
                            <div className="h-2 w-3/4 bg-white/10 rounded-full"></div>
                            <div className="h-2 w-1/2 bg-white/10 rounded-full"></div>
                            <div className="h-2 w-full bg-white/5 rounded-full mt-4"></div>
                        </div>
                    </div>

                    {/* Floating Card 2: Terminal */}
                    <div className="floating-ui-card absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 bg-[#0f0f1a] border border-white/10 rounded-xl shadow-[0_0_50px_rgba(139,92,246,0.3)] p-6 transform rotate-0 z-20">
                        <div className="flex gap-1.5 mb-4">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="font-mono text-xs space-y-2">
                            <div className="flex gap-2">
                                <span className="text-green-400">➜</span>
                                <span className="text-purple-400">~</span>
                                <span className="text-gray-300">tricox ship ./libs/ui</span>
                            </div>
                            <div className="text-gray-500">Parsing AST...</div>
                            <div className="text-gray-500">Resolving dependencies...</div>
                            <div className="text-green-400">✔ Published @org/ui v1.0.4</div>
                        </div>
                    </div>

                    {/* Floating Card 3: Stats */}
                    <div className="floating-ui-card absolute bottom-20 right-20 w-56 bg-gradient-to-br from-indigo-900/60 to-purple-900/60 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-xl transform rotate-3">
                        <div className="flex items-center justify-between mb-2">
                            <Cpu className="w-5 h-5 text-indigo-300" />
                            <span className="text-xs font-mono text-indigo-200">USAGE</span>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">98.2%</div>
                        <div className="text-xs text-indigo-300">Efficiency Boost</div>
                        <div className="mt-3 h-1 w-full bg-black/20 rounded-full overflow-hidden">
                            <div className="h-full w-[98%] bg-indigo-400"></div>
                        </div>
                    </div>

                    {/* Floating Card 4: Architecture */}
                    <div className="floating-ui-card absolute bottom-10 left-20 w-48 bg-black/60 backdrop-blur-lg border border-white/5 p-4 rounded-xl transform -rotate-3 blur-[1px]">
                        <Layers className="w-8 h-8 text-gray-600 mb-2" />
                        <div className="text-xs text-gray-500 font-mono">
                            Modular Architecture <br /> Verified
                        </div>
                    </div>

                </div>
            </div>

            {/* Right Column: Glass Form */}
            <div className="w-full lg:w-[45%] min-h-screen flex flex-col justify-center items-center relative z-10 px-6 py-12">

                <div className="glass-form w-full max-w-[480px] bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    {/* Top Shine */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50"></div>

                    {/* Header */}
                    <div className="text-center mb-6">
                        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
                            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                                T
                            </div>
                            <span className="font-bold text-xl tracking-tight text-white">TRICOX</span>
                        </Link>

                        {/* Auth Tabs */}
                        <div className="flex p-1 bg-black/40 border border-white/10 rounded-xl mb-6 backdrop-blur-md">
                            <button
                                onClick={() => setIsLogin(true)}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/10' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                SIGN IN
                            </button>
                            <button
                                onClick={() => setIsLogin(false)}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/10' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                SIGN UP
                            </button>
                        </div>

                        <h2 className="text-xl font-bold text-white mb-1">
                            {isLogin ? 'Welcome Back' : 'Create an Account'}
                        </h2>
                        <p className="text-xs text-gray-400 font-mono">
                            {isLogin ? 'Enter your credentials to access.' : 'Initialize your private registry.'}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-3">

                        <div className="space-y-2.5">
                            <div className="form-input-group">
                                <GlassInput
                                    id="email"
                                    type="email"
                                    placeholder="dev@example.com"
                                    icon={<Mail className="w-3.5 h-3.5" />}
                                    value={email}
                                    onChange={setEmail}
                                    label="Email Address"
                                />
                            </div>

                            {!isLogin && (
                                <div className="form-input-group">
                                    <GlassInput
                                        id="org"
                                        type="text"
                                        placeholder="acme-corp"
                                        icon={<Building className="w-3.5 h-3.5" />}
                                        value={org}
                                        onChange={setOrg}
                                        label="Organization ID"
                                    />
                                </div>
                            )}

                            <div className="form-input-group">
                                <GlassInput
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    icon={<Lock className="w-3.5 h-3.5" />}
                                    value={password}
                                    onChange={setPassword}
                                    label="Password"
                                />
                            </div>

                            {!isLogin && (
                                <div className="form-input-group">
                                    <GlassInput
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        icon={<Lock className="w-3.5 h-3.5" />}
                                        value={confirmPassword}
                                        onChange={setConfirmPassword}
                                        label="Confirm Password"
                                    />
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="form-input-group w-full relative group overflow-hidden rounded-xl p-[1px] focus:outline-none focus:ring-2 focus:ring-purple-500/50 mt-3"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 group-hover:opacity-100 opacity-70"></span>
                            <div className="relative bg-black hover:bg-zinc-900 transition-colors rounded-xl px-4 py-3 flex items-center justify-center">
                                <span className="font-bold text-xs tracking-widest uppercase group-hover:text-white transition-colors">
                                    {isLogin ? 'Authenticate' : 'Initialize System'}
                                </span>
                                <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform text-purple-400" />
                            </div>
                        </button>
                    </form>

                    <div className="mt-5 pt-4 border-t border-white/5 text-center form-input-group">
                        <button
                            onClick={handleGithubLogin}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white"
                        >
                            <Github className="w-4 h-4" />
                            GitHub Access
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function GlassInput({ id, type, placeholder, icon, value, onChange, label }: any) {
    return (
        <div className="group">
            <label htmlFor={id} className="block text-xs font-semibold text-gray-500 mb-1.5 ml-1 uppercase tracking-wider group-focus-within:text-purple-400 transition-colors">
                {label}
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                    {icon}
                </div>
                <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required
                    suppressHydrationWarning
                    className="block w-full pl-11 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-purple-500/5 transition-all shadow-inner sm:text-sm backdrop-blur-sm"
                />
                {/* Glow Effect on Focus */}
                <div className="absolute inset-0 rounded-xl bg-purple-500/20 blur-md opacity-0 group-focus-within:opacity-100 transition-opacity -z-10"></div>
            </div>
        </div>
    );
}
