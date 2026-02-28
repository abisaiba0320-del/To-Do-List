import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { CheckSquare } from 'lucide-react';

export function Login() {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const login = useAuthStore(state => state.login);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        // In a real app we'd await supabase.auth.signInWithPassword here
        login(email);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass max-w-md w-full p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center mb-4">
                        <CheckSquare className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Welcome to TaskFlow</h1>
                    <p className="text-gray-500 text-center">
                        {isRegister ? 'Create an account to track your productivity' : 'Sign in to your account'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Button type="submit" className="w-full mt-6" size="lg">
                        {isRegister ? 'Create Account' : 'Sign In'}
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    {isRegister ? 'Already have an account? ' : "Don't have an account? "}
                    <button
                        type="button"
                        className="text-indigo-600 hover:text-indigo-500 font-medium font-semibold"
                        onClick={() => setIsRegister(!isRegister)}
                    >
                        {isRegister ? 'Sign In' : 'Register'}
                    </button>
                </p>
            </div>
        </div>
    );
}
