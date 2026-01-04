"use client";
import React, { useEffect, useState } from 'react';
import { listComponents, listUsers, deleteUser, getSystemStats } from '../lib/api';

export default function DashboardHome() {
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState({ components: 0, views: 0 });

    // Admin State
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [systemStats, setSystemStats] = useState({ totalShips: 0, totalFetches: 0 });
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('tricox_user');
        if (storedUser) {
            const u = JSON.parse(storedUser);
            setUser(u);

            if (u.email === 'admin@gmail.com') {
                setIsAdmin(true);
                fetchFees(true);
            } else if (u.ownedOrgs?.[0]) {
                listComponents(u.ownedOrgs[0].name).then(comps => {
                    setStats(s => ({ ...s, components: comps.length }));
                });
            }
        }
    }, []);

    const fetchFees = (force = false) => {
        // Only fetch if admin
        listUsers().then(data => setAllUsers(data)).catch(console.error);
        getSystemStats().then(data => setSystemStats(data)).catch(console.error);
    };

    const handleDeleteUser = async (id: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(id);
                fetchFees();
            } catch (error: any) {
                alert('Failed to delete: ' + error.message);
            }
        }
    };

    if (!user) return null;

    // --- ADMIN VIEW ---
    if (isAdmin) {
        return (
            <div className="p-8 max-w-7xl mx-auto">
                <header className="mb-10 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Admin Console</h2>
                        <p className="text-gray-400 mt-2">System Overview & User Management</p>
                    </div>
                    <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-red-500/20">
                        Restricted Area
                    </span>
                </header>

                {/* Admin Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white/5 p-6 rounded-2xl shadow-lg border border-white/10 backdrop-blur-md relative overflow-hidden group hover:border-white/20 transition-all">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <div className="w-16 h-16 bg-white rounded-full blur-xl"></div>
                        </div>
                        <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total Users</div>
                        <div className="text-4xl font-bold text-white mt-2">{allUsers.length}</div>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl shadow-lg border border-white/10 backdrop-blur-md relative overflow-hidden group hover:border-white/20 transition-all">
                        <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Active Orgs</div>
                        <div className="text-4xl font-bold text-white mt-2">
                            {allUsers.reduce((acc, u) => acc + u.ownedOrgs.length, 0)}
                        </div>
                    </div>

                    {/* New Stats */}
                    <div className="bg-white/5 p-6 rounded-2xl shadow-lg border border-white/10 backdrop-blur-md relative overflow-hidden group hover:border-white/20 transition-all">
                        <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total Ships</div>
                        <div className="text-4xl font-bold text-white mt-2">{systemStats.totalShips}</div>
                        <div className="text-[10px] text-gray-500 mt-1">Component Versions</div>
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl shadow-lg border border-white/10 backdrop-blur-md relative overflow-hidden group hover:border-white/20 transition-all">
                        <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total Fetches</div>
                        <div className="text-4xl font-bold text-white mt-2">{systemStats.totalFetches}</div>
                        <div className="text-[10px] text-gray-500 mt-1">Registry Downloads</div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white/5 rounded-2xl shadow-xl border border-white/10 overflow-hidden backdrop-blur-md">
                    <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <h3 className="font-bold text-white">Registered Users</h3>
                    </div>
                    <table className="min-w-full divide-y divide-white/10">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Org(s)</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {allUsers.map((u) => (
                                <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center text-white font-bold text-xs mr-3 border border-white/10">
                                                {u.email[0].toUpperCase()}
                                            </div>
                                            <div className="text-sm font-medium text-gray-200">{u.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                        {u.ownedOrgs.map((o: any) => (
                                            <span key={o.id} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mr-2">
                                                {o.name}
                                            </span>
                                        ))}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono text-xs">
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleDeleteUser(u.id)}
                                            className="text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 hover:border-red-500/30 px-3 py-1.5 rounded-lg transition-all text-xs"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    // --- USER VIEW ---
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="mb-10">
                <h2 className="text-3xl font-bold text-white tracking-tight">Welcome back, {user.email.split('@')[0]}</h2>
                <p className="text-gray-400 mt-2">Here's what's happening with your components today.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stat 1 */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all shadow-sm">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-indigo-500/20"></div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Shipped Components</p>
                            <p className="text-4xl font-bold text-white mt-2">{stats.components}</p>
                        </div>
                        <div className="h-12 w-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 text-xl border border-indigo-500/20">
                            🚀
                        </div>
                    </div>
                </div>

                {/* Stat 2 */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all shadow-sm">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-green-500/20"></div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Total Fetches</p>
                            <p className="text-4xl font-bold text-white mt-2">0</p>
                        </div>
                        <div className="h-12 w-12 bg-green-500/20 rounded-xl flex items-center justify-center text-green-400 text-xl border border-green-500/20">
                            📥
                        </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-4 font-mono relative z-10">Experimental (Mocked)</p>
                </div>

                {/* Stat 3 */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all shadow-sm">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-purple-500/20"></div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Organization</p>
                            <p className="text-2xl font-bold text-white mt-2 truncate max-w-[150px]">{user.ownedOrgs?.[0]?.name || 'No Org'}</p>
                        </div>
                        <div className="h-12 w-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 text-xl border border-purple-500/20">
                            🏢
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-10">
                <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
                <div className="bg-white/5 rounded-2xl border border-white/10 p-12 text-center shadow-sm">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                        <span className="text-2xl">💤</span>
                    </div>
                    <h4 className="text-lg font-medium text-white mb-2">No activity yet</h4>
                    <p className="text-gray-400 max-w-sm mx-auto">
                        Your shipping history will appear here once you start using the CLI to ship components.
                    </p>
                </div>
            </div>
        </div>
    );
}
