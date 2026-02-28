import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { CheckSquare } from 'lucide-react';
import { signIn, signUp } from '../services/api'; // Importamos funciones reales
import { useNavigate } from 'react-router-dom';

export function Login() {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        setLoading(true);
        try {
            if (isRegister) {
                // Lógica de Registro Real
                await signUp(email, password);
                alert('¡Registro exitoso! Ya puedes iniciar sesión.');
                setIsRegister(false);
            } else {
                // Lógica de Login Real
                await signIn(email, password);
                navigate('/'); // Nos vamos al Dashboard al entrar
            }
        } catch (error: any) {
            alert('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
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

                    <Button
                        type="submit"
                        className="w-full mt-6"
                        size="lg"
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : (isRegister ? 'Create Account' : 'Sign In')}
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