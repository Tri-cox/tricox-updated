"use client";
import React from 'react';
import { Terminal, Shield, Upload, Download, Cpu, Globe, Settings, Lock } from 'lucide-react';

export default function DocsPage() {
    return (
        <div className="max-w-7xl mx-auto px-8 py-8">
            <header className="mb-12 border-b border-white/10 pb-8">
                <h1 className="text-4xl font-bold text-white tracking-tight">Documentation</h1>
                <p className="mt-4 text-gray-400 text-lg max-w-2xl">
                    The complete reference for the Tricox Component Registry. Learn how to ship, dock, and manage your UI components.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* TOC Sidebar (Sticky) */}
                <div className="hidden lg:block col-span-1">
                    <nav className="sticky top-24 space-y-1">
                        <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Getting Started</p>
                        <a href="#introduction" className="block px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Introduction</a>
                        <a href="#installation" className="block px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Installation</a>
                        <a href="#authentication" className="block px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Authentication</a>

                        <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-6">Core Concepts</p>
                        <a href="#architecture" className="block px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Architecture</a>
                        <a href="#registry" className="block px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">The Registry</a>

                        <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-6">Workflow</p>
                        <a href="#shipping" className="block px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Shipping Components</a>
                        <a href="#docking" className="block px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Docking Components</a>

                        <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-6">Reference</p>
                        <a href="#cli-reference" className="block px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">CLI Commands</a>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="col-span-1 lg:col-span-3 space-y-20 pb-20">

                    {/* Introduction */}
                    <section id="introduction" className="scroll-mt-24">
                        <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
                        <p className="text-gray-400 leading-relaxed">
                            Tricox is a private component registry designed for modern frontend teams. It allows you to "ship" (upload) React components from your codebase and "dock" (download) them into other projects, preserving your unique design system and logic. Unlike generic UI libraries, Tricox acts as a synchronization layer for your own code.
                        </p>
                    </section>

                    {/* Installation */}
                    <section id="installation" className="scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-indigo-500/10 rounded-lg">
                                <Terminal className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Installation</h2>
                        </div>
                        <p className="text-gray-400 mb-4">
                            The Tricox CLI is your primary tool for interacting with the registry. Install it globally via npm.
                        </p>
                        <div className="bg-black/50 border border-white/10 rounded-xl p-6 shadow-2xl relative group">
                            <button className="absolute top-4 right-4 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">COPY</button>
                            <code className="text-green-400 font-mono text-sm">npm install -g @tricox/cli</code>
                        </div>
                    </section>

                    {/* Authentication */}
                    <section id="authentication" className="scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-500/10 rounded-lg">
                                <Shield className="w-6 h-6 text-green-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Authentication</h2>
                        </div>
                        <div className="prose prose-invert max-w-none text-gray-400">
                            <p>
                                To ensure security, all interactions with the registry are authenticated. You need to link your local machine to your Tricox account.
                            </p>
                            <ol className="list-decimal pl-5 space-y-2 mt-4 text-gray-400">
                                <li>Navigate to <a href="/dashboard/settings" className="text-indigo-400 hover:underline">Settings</a>.</li>
                                <li>Click "Generate New Token" to create a personal access token.</li>
                                <li>Run the auth command with your new token:</li>
                            </ol>
                        </div>
                        <div className="bg-black/50 border border-white/10 rounded-xl p-6 shadow-2xl mt-6">
                            <code className="text-blue-400 font-mono text-sm">tricox auth --token=tx_7d9f...</code>
                        </div>
                    </section>

                    <hr className="border-white/5" />

                    {/* Architecture */}
                    <section id="architecture" className="scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Cpu className="w-6 h-6 text-blue-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Architecture</h2>
                        </div>
                        <p className="text-gray-400 mb-6">
                            Tricox operates on a decentralized-first philosophy. Your components are stored in a central registry but are consumed as <strong>source code</strong>, not compiled node_modules.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white/5 p-6 rounded-xl border border-white/10 shadow-sm">
                                <h4 className="text-white font-bold mb-2">The Registry</h4>
                                <p className="text-sm text-gray-400">Stores the source code, metadata, and version history of your components. It handles permission checks and organization scoping.</p>
                            </div>
                            <div className="bg-white/5 p-6 rounded-xl border border-white/10 shadow-sm">
                                <h4 className="text-white font-bold mb-2">The CLI</h4>
                                <p className="text-sm text-gray-400">Reads your local file system, bundles component dependencies, and pushes them to the registry. Conversely, it fetches and writes code directly to your project.</p>
                            </div>
                        </div>
                    </section>

                    {/* Workflow: Shipping */}
                    <section id="shipping" className="scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <Upload className="w-6 h-6 text-purple-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Shipping Components</h2>
                        </div>
                        <p className="text-gray-400 mb-6">
                            Use the <code>ship</code> command to upload a component. Tricox will automatically detect imports and prompt you to include them.
                        </p>

                        <div className="space-y-6">
                            <div>
                                <h4 className="text-white font-medium mb-2">Private Ship (Default)</h4>
                                <div className="bg-black/50 border border-white/10 rounded-xl p-4">
                                    <code className="text-yellow-400 font-mono text-sm">tricox ship src/components/Button.tsx</code>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Only members of your organization can see this component.</p>
                            </div>

                            <div>
                                <h4 className="text-white font-medium mb-2">Public Ship</h4>
                                <div className="bg-black/50 border border-white/10 rounded-xl p-4">
                                    <code className="text-yellow-400 font-mono text-sm">tricox ship src/components/Button.tsx --public</code>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Anyone on the internet can dock this component.</p>
                            </div>
                        </div>
                    </section>

                    {/* Workflow: Docking */}
                    <section id="docking" className="scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-pink-500/10 rounded-lg">
                                <Download className="w-6 h-6 text-pink-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Docking Components</h2>
                        </div>
                        <p className="text-gray-400 mb-6">
                            Docking is the process of pulling a component into your local project. You specify the component by its organization and name.
                        </p>

                        <div className="bg-black/50 border border-white/10 rounded-xl p-6 mb-6">
                            <code className="text-cyan-400 font-mono text-sm">tricox dock @acme/Button</code>
                        </div>

                        <h4 className="text-white font-medium mb-3">Custom Paths</h4>
                        <p className="text-gray-400 mb-4 text-sm">By default, components go to <code>src/components</code>. You can override this:</p>
                        <div className="bg-black/50 border border-white/10 rounded-xl p-4">
                            <code className="text-gray-300 font-mono text-sm">tricox dock @acme/Button <span className="text-purple-400">--path src/ui/atoms</span></code>
                        </div>
                    </section>

                    {/* CLI Reference */}
                    <section id="cli-reference" className="scroll-mt-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-gray-500/10 rounded-lg">
                                <Settings className="w-6 h-6 text-gray-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">CLI Reference</h2>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-white/10">
                            <table className="min-w-full divide-y divide-white/10 bg-white/5">
                                <thead className="bg-white/5">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Command</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-indigo-400">auth</td>
                                        <td className="px-6 py-4 text-sm text-gray-400">Login to the registry.</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-indigo-400">init</td>
                                        <td className="px-6 py-4 text-sm text-gray-400">Initialize a new Tricox project context.</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-indigo-400">ship</td>
                                        <td className="px-6 py-4 text-sm text-gray-400">Upload/Publish a component.</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-indigo-400">dock</td>
                                        <td className="px-6 py-4 text-sm text-gray-400">Download/Install a component.</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-indigo-400">list</td>
                                        <td className="px-6 py-4 text-sm text-gray-400">List all your components.</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-indigo-400">info</td>
                                        <td className="px-6 py-4 text-sm text-gray-400">Display current session info.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
