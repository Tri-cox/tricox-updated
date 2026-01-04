"use client";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { githubLogin } from '../../../lib/api';

export default function GitHubCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get('code');
    const [error, setError] = useState('');

    useEffect(() => {
        if (code) {
            githubLogin(code)
                .then(user => {
                    localStorage.setItem('tricox_user', JSON.stringify(user));
                    router.push('/dashboard');
                })
                .catch(err => {
                    setError('GitHub Login Failed: ' + (err.response?.data?.message || err.message));
                });
        }
    }, [code, router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            {error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <div>Authenticating with GitHub...</div>
            )}
        </div>
    );
}
