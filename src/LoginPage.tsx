import { useState, FormEvent } from 'react';
import { Lock, User, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export interface LoginPageProps {
    title: string;
    titleHighlight: string;
    subtitle: string;
    authType: 'local' | 'oidc' | null;
    error?: string;
    isLoading?: boolean;
    onLogin: (username: string, password: string) => void;
    onOidcLogin: () => void;
    theme?: string;
    onToggleTheme?: () => void;
}

export const LoginPage = ({
    title,
    titleHighlight,
    subtitle,
    authType,
    error,
    isLoading = false,
    onLogin,
    onOidcLogin,
    theme,
    onToggleTheme,
}: LoginPageProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onLogin(username, password);
    };

    if (authType === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-app-bg dark:bg-app-bg-dark text-text-primary dark:text-text-primary-dark">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-app-bg dark:bg-app-bg-dark p-4 text-text-primary dark:text-text-primary-dark font-sans">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black/5 dark:from-black/40 via-transparent to-transparent opacity-70 z-0"></div>

            {theme !== undefined && onToggleTheme && (
                <div className="absolute top-4 right-4 z-20">
                    <ThemeToggle theme={theme} onToggle={onToggleTheme} />
                </div>
            )}

            <div className="w-full max-w-md glass-card relative z-10 overflow-hidden animate-fade-in shadow-2xl">
                <div className="h-1 w-full bg-gradient-to-r from-primary to-primary-hover"></div>

                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-card dark:bg-card-dark mb-4 shadow-inner border border-border dark:border-border-dark animate-pulse-soft">
                            <Lock className="w-10 h-10 text-primary drop-shadow-glow-accent animate-pulse-glow" />
                        </div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-text-primary dark:text-text-primary-dark mb-1">
                            {title} <span className="text-primary">{titleHighlight}</span>
                        </h2>
                        <p className="text-text-muted text-xs uppercase tracking-[0.3em] font-bold opacity-80">{subtitle}</p>
                    </div>

                    {authType === 'oidc' ? (
                        <div className="space-y-6">
                            <div className="bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-lg p-6 text-center">
                                <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-text-primary dark:text-text-primary-dark mb-2">Single Sign-On Enabled</h3>
                                <p className="text-text-muted dark:text-text-muted-dark text-sm mb-6">Please log in using your identity provider.</p>
                                <button
                                    onClick={onOidcLogin}
                                    className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-glow-accent hover:shadow-primary/20 active:scale-[0.98]"
                                >
                                    Login with OIDC
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-900/20 border border-red-800/50 text-red-200 text-sm p-4 rounded-lg flex items-start gap-3 animate-pulse-soft">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="group">
                                    <label className="block text-xs font-semibold text-text-muted uppercase mb-1.5 ml-1 group-focus-within:text-primary transition-colors">Username</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-text-muted group-focus-within:text-primary transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-2.5 bg-input-bg dark:bg-input-bg-dark border border-input-border dark:border-input-border-dark rounded-lg text-text-primary dark:text-text-primary-dark placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all sm:text-sm"
                                            placeholder="Enter your username"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="block text-xs font-semibold text-text-muted uppercase mb-1.5 ml-1 group-focus-within:text-primary transition-colors">Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-text-muted group-focus-within:text-primary transition-colors" />
                                        </div>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-2.5 bg-input-bg dark:bg-input-bg-dark border border-input-border dark:border-input-border-dark rounded-lg text-text-primary dark:text-text-primary-dark placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all sm:text-sm"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-glow-accent hover:shadow-primary/20 active:scale-[0.98]"
                            >
                                {isLoading ? 'Signing in...' : 'Sign in to Dashboard'}
                                {!isLoading && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
