"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getComponentDetails, updateComponent, deleteComponent } from '../../../../lib/api';
import { toast } from '../../../../lib/toast';
import { Trash2, Save, ArrowLeft, Terminal } from 'lucide-react';

export default function ComponentDetailsPage() {
    const params = useParams();
    const id = params.id as string;

    const [component, setComponent] = useState<any>(null);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!id) return;

        getComponentDetails(id)
            .then(data => {
                setComponent(data);
                setContent(data.content);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
                if (err.response?.status !== 404) {
                    toast.error({ title: 'Error', message: 'Failed to load component details' });
                }
            });
    }, [id]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateComponent(id, content);
            setComponent({ ...component, latestVersion: '1.0.' + Date.now() }); // Optimistic update
            toast.success({ title: 'Saved', message: 'Changes saved successfully!' });
        } catch (err: any) {
            console.error(err);
            toast.error({ title: 'Error', message: 'Failed to save changes: ' + (err.response?.data?.message || err.message) });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this component? This usage cannot be undone.')) return;
        try {
            const storedUser = localStorage.getItem('tricox_user');
            if (storedUser) {
                const u = JSON.parse(storedUser);
                await deleteComponent(id, u.token);
                router.push('/dashboard/components');
                toast.success({ title: 'Deleted', message: 'Component deleted.' });
            } else {
                toast.error({ title: 'Error', message: 'Authentication missing.' });
            }
        } catch (err) {
            console.error(err);
            toast.error({ title: 'Error', message: 'Failed to delete component' });
        }
    };

    if (loading) return <div className="p-8 text-white">Loading...</div>;
    if (!component) return <div className="p-8 text-white">Component not found</div>;

    return (
        <div className="flex flex-col h-full bg-black text-white">
            <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-black/50 backdrop-blur-md sticky top-0 z-10">
                <div>
                    <div className="flex items-center space-x-4 mb-2">
                        <button
                            onClick={() => router.push('/dashboard/components')}
                            className="text-gray-400 hover:text-white flex items-center transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back
                        </button>
                        <h1 className="text-2xl font-bold text-white tracking-tight">{component.name}</h1>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${component.isPublic ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                            {component.isPublic ? 'Public' : 'Private'}
                        </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 font-mono ml-14 space-x-4">
                        <span>{component.org}</span>
                        <span>•</span>
                        <span>v{component.latestVersion}</span>
                        <span>•</span>
                        <span>Updated {new Date(component.updatedAt).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 border border-red-500/20 text-red-400 bg-red-500/10 rounded-lg hover:bg-red-500/20 text-sm font-medium transition-colors flex items-center"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none transition-all flex items-center shadow-lg shadow-indigo-600/20 ${saving ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <div className="flex-1 p-8 overflow-hidden flex flex-col">
                <div className="bg-white/5 rounded-xl border border-white/10 flex flex-col flex-1 overflow-hidden shadow-2xl">
                    <div className="bg-black/40 px-4 py-3 border-b border-white/10 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-gray-500" />
                            <h3 className="font-mono text-xs font-medium text-gray-400 uppercase tracking-wider">Source Code</h3>
                        </div>
                        <span className="text-xs text-gray-600">Editable Preview</span>
                    </div>
                    <div className="flex-1 relative bg-[#0d0d0d]">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="absolute inset-0 w-full h-full p-6 font-mono text-sm leading-relaxed resize-none focus:outline-none text-gray-300 bg-transparent selection:bg-indigo-500/30"
                            spellCheck="false"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
