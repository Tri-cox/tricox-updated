"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { listComponents, deleteComponent, listAllComponents } from '../lib/api';
import { toast } from '../lib/toast';
import { Trash2, ExternalLink, Box } from 'lucide-react';

export default function ComponentsView() {
    const router = useRouter();
    const [components, setComponents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('tricox_user');
        if (storedUser) {
            const u = JSON.parse(storedUser);
            setUser(u);
            fetchComponents(u);
        }
    }, []);

    const fetchComponents = (u: any) => {
        if (u.email === 'admin@gmail.com') {
            listAllComponents().then(data => {
                setComponents(data);
                setLoading(false);
            }).catch(e => setLoading(false));
            return;
        }

        if (u.ownedOrgs?.[0]) {
            listComponents(u.ownedOrgs[0].name).then(data => {
                setComponents(data);
                setLoading(false);
            }).catch(e => setLoading(false));
        } else {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this component?')) return;

        try {
            const storedUser = localStorage.getItem('tricox_user');
            if (storedUser) {
                const u = JSON.parse(storedUser);
                await deleteComponent(id, u.token);
                // Refresh logic same for both roles
                fetchComponents(u);
                toast.success({ title: 'Deleted', message: 'Component deleted.' });
            }
        } catch (err) {
            console.error(err);
            toast.error({ title: 'Error', message: 'Failed to delete component.' });
        }
    };

    const isAdmin = user?.email === 'admin@gmail.com';

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">
                        {isAdmin ? 'Global Registry' : 'My Components'}
                    </h2>
                    <p className="text-gray-400 mt-2">
                        {isAdmin ? 'Full system component overview.' : 'Manage your shipped components registry.'}
                    </p>
                </div>
                {!isAdmin && (
                    <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium shadow-lg shadow-indigo-500/20 transition-all hover:scale-105">
                        Ship New Component
                    </button>
                )}
            </header>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading your components...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {components.length === 0 ? (
                        <div className="col-span-full py-20 text-center text-gray-500 bg-white/5 rounded-2xl border border-dashed border-white/10">
                            <Box className="w-12 h-12 mx-auto mb-4 text-gray-600 opacity-50" />
                            <p className="text-lg text-gray-300">No components yet</p>
                            <p className="text-sm">Use the CLI to ship your first component!</p>
                        </div>
                    ) : (
                        components.map((comp) => (
                            <div key={comp.id} className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-indigo-500/50 transition-all group relative shadow-sm hover:shadow-md">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(comp.id); }}
                                    className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    title="Delete Component"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>

                                <div className="flex justify-between items-start mb-6">
                                    <div className="h-12 w-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center text-indigo-400 text-xl font-bold border border-white/5">
                                        {comp.name[0].toUpperCase()}
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${comp.isPublic ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-white/5 text-gray-400 border-white/10'}`}>
                                        {comp.isPublic ? 'Public' : 'Private'}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">{comp.name}</h3>
                                <div className="flex flex-col gap-1 mb-6">
                                    <p className="text-sm text-gray-500 font-mono">v{comp.latestVersion}</p>
                                    {isAdmin && comp.org?.owner?.email && (
                                        <p className="text-xs text-indigo-300 font-medium flex items-center">
                                            <span className="opacity-50 mr-1">Owner:</span> {comp.org.owner.email}
                                        </p>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                    <p className="text-xs text-gray-500">Updated {new Date(comp.updatedAt).toLocaleDateString()}</p>
                                    <button
                                        onClick={() => router.push(`/dashboard/components/${comp.id}`)}
                                        className="text-indigo-400 text-sm font-medium hover:text-indigo-300 flex items-center"
                                    >
                                        Details <ExternalLink className="w-3 h-3 ml-1" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
