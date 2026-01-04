"use client";
import React, { useEffect, useState } from 'react';
import { createToken, changePassword, listTokens, deleteToken } from '../lib/api';
import { toast } from '../lib/toast';
import { Copy, Eye, EyeOff, Trash2, Key, Shield, User } from 'lucide-react';

export default function SettingsView() {
    const [user, setUser] = useState<any>(null);
    const [tokens, setTokens] = useState<any[]>([]);

    // Password State
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('tricox_user');
        if (storedUser) {
            const u = JSON.parse(storedUser);
            setUser(u);
            fetchTokens(u);
        }
    }, []);

    const fetchTokens = (userData: any) => {
        listTokens(userData.id).then(setTokens).catch(console.error);
    };

    const handleGenerateDefaultToken = async () => {
        try {
            await createToken(user.id, 'Default Token');
            fetchTokens(user);
            toast.success({ title: 'Success', message: 'Token generated!' });
        } catch (err) {
            console.error(err);
            toast.error({ title: 'Error', message: 'Failed to generate token' });
        }
    };

    const handleDeleteToken = async (id: string) => {
        if (!confirm('Are you sure? CLI access will stop working.')) return;
        try {
            const storedUser = localStorage.getItem('tricox_user');
            if (storedUser) {
                const u = JSON.parse(storedUser);
                await deleteToken(id, u.token);
                fetchTokens(user);
                toast.success({ title: 'Deleted', message: 'Token deleted successfully' });
            } else {
                toast.warning({ title: 'Session Expired', message: 'Please sign in again.' });
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || 'Unknown error';
            toast.error({ title: 'Failed', message: msg });
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await changePassword(user.id, oldPass, newPass);
            toast.success({ title: 'Success', message: 'Password updated successfully!' });
            setOldPass('');
            setNewPass('');
        } catch (err: any) {
            toast.error({ title: 'Failed', message: err.response?.data?.message || 'Error updating password' });
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.info({ title: 'Copied', message: 'Token copied to clipboard', position: 'bottomRight' });
    };

    const TokenItem = ({ token }: { token: any }) => {
        const [visible, setVisible] = useState(false);
        const tokenValue = token.token;

        return (
            <div className="bg-black/20 rounded-xl border border-white/10 p-5 mb-4 hover:border-white/20 transition-all">
                <div className="flex justify-between items-center mb-3">
                    <span className="font-medium text-white text-sm flex items-center">
                        <Key className="w-4 h-4 mr-2 text-indigo-400" />
                        {token.name || 'Tricox CLI Token'}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                        {new Date(token.createdAt).toLocaleString()}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {tokenValue ? (
                        <>
                            <div className="flex-1 bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 font-mono text-xs text-gray-300 overflow-hidden text-ellipsis shadow-inner">
                                {visible ? tokenValue : 'tcx_••••••••••••••••••••••••••••••••'}
                            </div>
                            <button
                                onClick={() => setVisible(!visible)}
                                className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors"
                            >
                                {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={() => copyToClipboard(tokenValue)}
                                className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDeleteToken(token.id)}
                                className="p-2 text-red-400 hover:text-red-300 bg-red-500/10 rounded-lg border border-red-500/10 hover:bg-red-500/20 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </>
                    ) : (
                        <div className="text-sm text-red-400 italic flex-1">
                            Legacy token (hidden).
                        </div>
                    )}
                </div>
            </div>
        );

    };

    if (!user) return null;

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 tracking-tight">Settings</h2>

            {/* Profile Section */}
            <div className="bg-white/5 rounded-2xl border border-white/10 p-8 mb-8 backdrop-blur-sm shadow-sm">
                <div className="flex items-center mb-6">
                    <User className="w-6 h-6 text-indigo-400 mr-3" />
                    <h3 className="text-xl font-bold text-white">Profile Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                        <div className="p-4 bg-white/5 rounded-xl text-white font-medium border border-white/5">{user.email}</div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">User ID</label>
                        <div className="p-4 bg-white/5 rounded-xl text-gray-400 font-mono text-xs border border-white/5 break-all">{user.id}</div>
                    </div>
                </div>
            </div>

            {/* Change Password */}
            <div className="bg-white/5 rounded-2xl border border-white/10 p-8 mb-8 backdrop-blur-sm shadow-sm">
                <div className="flex items-center mb-6">
                    <Shield className="w-6 h-6 text-green-400 mr-3" />
                    <h3 className="text-xl font-bold text-white">Security</h3>
                </div>
                <form onSubmit={handleChangePassword} className="max-w-md space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Current Password</label>
                        <input type="password" required value={oldPass} onChange={e => setOldPass(e.target.value)} className="block w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
                        <input type="password" required value={newPass} onChange={e => setNewPass(e.target.value)} className="block w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
                    </div>
                    <button type="submit" className="px-6 py-2.5 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors">Update Password</button>
                </form>
            </div>

            {/* Access Tokens */}
            {user.email !== 'admin@gmail.com' && (
                <div className="bg-white/5 rounded-2xl border border-white/10 p-8 backdrop-blur-sm shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <Key className="w-6 h-6 text-yellow-400 mr-3" />
                            <h3 className="text-xl font-bold text-white">Access Tokens</h3>
                        </div>
                        <button
                            onClick={handleGenerateDefaultToken}
                            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
                        >
                            Generate New Token
                        </button>
                    </div>

                    {tokens.length > 0 ? (
                        <div>
                            {tokens.map(t => <TokenItem key={t.id} token={t} />)}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-black/20 rounded-xl border border-dashed border-white/10">
                            <p className="text-sm text-gray-500 mb-4">No access tokens found.</p>
                            <button
                                onClick={handleGenerateDefaultToken}
                                className="text-indigo-400 hover:text-indigo-300 font-medium text-sm underline"
                            >
                                Generate Default Token
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
