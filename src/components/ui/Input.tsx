import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from './Button';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        // Base: Glassmorphism + Transiciones
                        'flex h-10 w-full rounded-lg border border-gray-300/50 bg-white/50 px-3 py-2 text-sm transition-all duration-200',
                        'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500',
                        // Dark mode
                        'dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-100 dark:focus:ring-indigo-500/30',
                        // Estados
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        error && 'border-red-500 focus:ring-red-500/50 focus:border-red-500 dark:border-red-500/50',
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="mt-1.5 text-xs font-medium text-red-500 ml-1 animate-in fade-in slide-in-from-top-1">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);
Input.displayName = 'Input';

export { Input };