import { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Play, Pause, Square } from 'lucide-react';

interface PomodoroTimerProps {
    onComplete: () => void;
    onCancel: () => void;
}

export function PomodoroTimer({ onComplete, onCancel }: PomodoroTimerProps) {
    // Configurable session length (25 minutes by default)
    const SESSION_LENGTH = 25 * 60;

    const [timeLeft, setTimeLeft] = useState(SESSION_LENGTH);
    const [isRunning, setIsRunning] = useState(true); // start immediately

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            if (isRunning) {
                setIsRunning(false);
                onComplete();
            }
        }
        return () => clearInterval(interval);
    }, [isRunning, timeLeft, onComplete]);

    const toggleTimer = () => setIsRunning(!isRunning);

    const resetTimer = () => {
        setIsRunning(false);
        onCancel();
    };

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="bg-white/10 dark:bg-black/10 rounded-lg p-4 mt-2 border border-indigo-200/50 dark:border-indigo-900/50 flex flex-col items-center">
            <div className="text-3xl font-mono font-bold tracking-wider text-indigo-600 dark:text-indigo-400 mb-3 drop-shadow-sm">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>

            <div className="flex gap-2">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={toggleTimer}
                    className="w-24 bg-white/50 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800"
                >
                    {isRunning ? (
                        <><Pause className="w-4 h-4 mr-1" /> Pause</>
                    ) : (
                        <><Play className="w-4 h-4 mr-1 ml-1" /> Resume</>
                    )}
                </Button>
                <Button
                    variant="danger"
                    size="sm"
                    onClick={resetTimer}
                    className="px-3"
                    title="Cancel Session"
                >
                    <Square className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
