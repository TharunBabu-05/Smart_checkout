import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, AlertCircle, Loader, LogIn } from 'lucide-react';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isRateLimited, setIsRateLimited] = useState(false);
    const [rateLimitReset, setRateLimitReset] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setMessage('Logging in...');
            setError('');
            setLoading(true);

            const result = await login(email, password, rememberMe);

            if (result.success) {
                setMessage('Login successful!');
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);
            } else {
                if (result.isRateLimited) {
                    setIsRateLimited(true);
                    if (result.rateLimitReset) {
                        setRateLimitReset(new Date(result.rateLimitReset));
                    }
                    setError('Too many login attempts. Please try again later.');
                } else {
                    setError(result.error);
                }
                setMessage('');
            }
        } catch (error) {
            setError('An unexpected error occurred');
            setMessage('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="bg-slate-800 rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="mx-auto w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                            <LogIn className="h-6 w-6 text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">
                            Welcome Back
                        </h2>
                        <p className="mt-2 text-slate-400">
                            Sign in to Smart Checkout
                        </p>
                    </div>

                    {message && (
                        <div className="mb-6 px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <p className="text-sm text-green-400 flex items-center">
                                {loading && <Loader className="h-4 w-4 mr-2 animate-spin" />}
                                {message}
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <p className="text-sm text-red-400 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-2" />
                                {error}
                            </p>
                            {isRateLimited && rateLimitReset && (
                                <p className="mt-1 text-sm text-red-400">
                                    Try again after: {rateLimitReset.toLocaleTimeString()}
                                </p>
                            )}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                                Email address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="block w-full pl-10 bg-slate-700 border-0 rounded-lg py-2.5 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your email"
                                    disabled={isRateLimited || loading}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="block w-full pl-10 bg-slate-700 border-0 rounded-lg py-2.5 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your password"
                                    disabled={isRateLimited || loading}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    disabled={isRateLimited || loading}
                                    className="h-4 w-4 bg-slate-700 border-slate-600 rounded text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-800"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300">
                                    Remember me
                                </label>
                            </div>

                            <Link 
                                to="/forgot-password" 
                                className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isRateLimited || loading}
                            className={`w-full flex items-center justify-center px-4 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white 
                                ${isRateLimited || loading 
                                    ? 'bg-blue-500/50 cursor-not-allowed' 
                                    : 'bg-blue-500 hover:bg-blue-600 transition-colors'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-800`}
                        >
                            {loading && <Loader className="h-4 w-4 mr-2 animate-spin" />}
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link 
                            to="/register" 
                            className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            Don't have an account? Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;