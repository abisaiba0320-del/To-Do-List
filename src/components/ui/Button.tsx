import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper para combinar clases de Tailwind de forma inteligente
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    // Clases base con transiciones suaves
                    'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
                    {
                        // Estilo sólido y vibrante
                        'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20': variant === 'primary',

                        // Estilo Glassmorphism para el botón secundario
                        'bg-white/40 dark:bg-white/5 text-gray-900 dark:text-gray-100 border border-white/20 dark:border-white/10 backdrop-blur-md hover:bg-white/60 dark:hover:bg-white/10': variant === 'secondary',

                        // Estilo Danger (Red)
                        'bg-red-500 text-white hover:bg-red-600 shadow-sm': variant === 'danger',

                        // Estilo Ghost (Sin fondo)
                        'bg-transparent hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400': variant === 'ghost',

                        // Tamaños
                        'h-8 px-3 text-xs': size === 'sm',
                        'h-10 px-4 py-2 text-sm': size === 'md',
                        'h-12 px-8 text-base': size === 'lg',
                    },
                    className
                )}
                {...props}
            />
        );
    }
);

Button.displayName = 'Button';

export { Button };