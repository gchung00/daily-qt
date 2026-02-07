"use client";

import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Lock } from "lucide-react";

export default function LoginPage() {
    const { isAdmin, loading, login } = useAuth();
    const router = useRouter();
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!loading && isAdmin) {
            router.push("/admin");
        }
    }, [isAdmin, loading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(false);
        const success = await login(pin);
        if (!success) {
            setError(true);
            setIsSubmitting(false);
        }
        // If success, AuthProvider state updates and useEffect redirects
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">관리자 접속</h1>
                    <p className="text-muted">비밀번호를 입력해주세요</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="tel"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            placeholder="비밀번호 4자리"
                            className="w-full text-center text-3xl font-bold tracking-[1em] py-4 border-b-2 border-gray-200 focus:border-primary outline-none transition-colors placeholder:text-gray-200 placeholder:tracking-normal placeholder:text-lg"
                            maxLength={4}
                            autoFocus
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm text-center font-medium animate-pulse">
                            비밀번호가 올바르지 않습니다
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting || pin.length < 4}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                    >
                        {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : '접속하기'}
                    </button>
                </form>
            </div>
        </div>
    );
}
