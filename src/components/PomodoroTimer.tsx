import { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Play, Pause, Square, Trophy } from 'lucide-react';
import { useAuthStore } from '../store/authStore'; // Para dar puntos

interface PomodoroTimerProps {
    onComplete: () => void;
    onCancel: () => void;
}

export function PomodoroTimer({ onComplete, onCancel }: PomodoroTimerProps) {
    // Para pruebas rápidas puedes cambiar esto a 10 (10 segundos)
    // Pero para la entrega final debe ser 25 * 60
    const SESSION_LENGTH = 25 * 60;

    const [timeLeft, setTimeLeft] = useState(SESSION_LENGTH);
    const [isRunning, setIsRunning] = useState(true);
    const addPoints = useAuthStore((state) => state.addPoints);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            if (isRunning) {
                setIsRunning(false);
                // ¡Lógica de Recompensa!
                addPoints(25); // Damos 25 XP por cada Pomodoro
                onComplete();
                alert("¡Excelente trabajo! Has ganado 25 XP.");
            }
        }
        return () => clearInterval(interval);
    }, [isRunning, timeLeft, onComplete, addPoints]);

    const toggleTimer = () => setIsRunning(!isRunning);

    const resetTimer = () => {
        if (confirm("¿Estás seguro de cancelar? Perderás el progreso de esta sesión.")) {
            setIsRunning(false);
            onCancel();
        }
    };

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="bg-white/10 dark:bg-black/10 rounded-xl p-6 mt-2 border border-indigo-200/50 dark:border-indigo-900/50 flex flex-col items-center shadow-inner animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-amber-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Focus Session</span>
            </div>

            <div className="text-4xl font-mono font-bold tracking-wider text-indigo-600 dark:text-indigo-400 mb-4 drop-shadow-md">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>

            <div className="flex gap-3">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={toggleTimer}
                    className="w-28 bg-white/50 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 shadow-sm"
                >
                    {isRunning ? (
                        <><Pause className="w-4 h-4 mr-2" /> Pause</>
                    ) : (
                        <><Play className="w-4 h-4 mr-2" /> Resume</>
                    )}
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetTimer}
                    className="px-3 text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                    title="Cancel Session"
                >
                    <Square className="w-4 h-4" />
                </Button>
            </div>

            <p className="mt-4 text-[10px] text-gray-400 italic">
                No cierres la pestaña para no perder el progreso.
            </p>
        </div>
    );
}