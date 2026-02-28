import { useEffect, useState } from 'react';
import { fetchTasks } from '../services/api';
import { type Task } from '../store/taskStore'; // Importamos el tipo
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { CheckCircle2, Clock, Zap, Target, Loader2 } from 'lucide-react';
import { format, subDays, isSameDay, parseISO } from 'date-fns';

export function Dashboard() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const data = await fetchTasks();
                setTasks(data || []);
            } catch (error) {
                console.error("Error cargando datos del dashboard:", error);
            } finally {
                setLoading(false);
            }
        };
        loadDashboardData();
    }, []);

    // Estadísticas
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = tasks.length - completedTasks;
    const totalPomodoros = tasks.reduce((acc, t) => acc + (t.pomodoro_sessions || 0), 0);

    // Gráfico de Pastel: Distribución por Categoría
    const categoryCounts = tasks.reduce((acc, task) => {
        const cat = task.category || 'Other';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));
    const COLORS = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6'];

    // Gráfico de Barras: Actividad últimos 7 días
    const activityData = Array.from({ length: 7 }).map((_, i) => {
        const date = subDays(new Date(), 6 - i);
        const label = format(date, 'MMM dd');

        const completedOnDay = tasks.filter(t => {
            if (!t.completed || !t.completed_at) return false;
            // parseISO es más seguro para fechas de base de datos
            return isSameDay(parseISO(t.completed_at), date);
        }).length;

        return { name: label, completed: completedOnDay };
    });

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                    <p className="text-gray-500 animate-pulse font-medium">Cargando estadísticas...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                    Dashboard Overview
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Sigue tu progreso y mejora tu productividad.</p>
            </div>

            {/* Grid de Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Tasks"
                    value={tasks.length.toString()}
                    icon={<Target className="w-5 h-5 text-blue-500" />}
                    trend="Carga histórica"
                />
                <StatCard
                    title="Completed"
                    value={completedTasks.toString()}
                    icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                    trend={`${tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}% de efectividad`}
                />
                <StatCard
                    title="Pending"
                    value={pendingTasks.toString()}
                    icon={<Clock className="w-5 h-5 text-amber-500" />}
                    trend="Tareas por hacer"
                />
                <StatCard
                    title="Pomodoros"
                    value={totalPomodoros.toString()}
                    icon={<Zap className="w-5 h-5 text-pink-500" />}
                    trend={totalPomodoros > 0 ? "¡Buen ritmo de enfoque!" : "Inicia un timer"}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico de Barras */}
                <div className="glass p-6 min-h-[400px]">
                    <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-indigo-500" />
                        Productivity Pulse
                    </h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={activityData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.1)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                                    contentStyle={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        backdropFilter: 'blur(8px)'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="completed" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Gráfico de Pastel */}
                <div className="glass p-6 min-h-[400px]">
                    <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Target className="w-5 h-5 text-pink-500" />
                        Task Distribution
                    </h2>
                    <div className="h-[300px] w-full">
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%" cy="50%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={8}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {categoryData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '12px'
                                        }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-gray-400 italic">
                                No data available for categories.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, trend }: { title: string; value: string; icon: React.ReactNode; trend: string }) {
    return (
        <div className="glass p-6 hover:translate-y-[-4px] transition-all duration-300 border-white/5 dark:border-white/10">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">{title}</p>
                    <h3 className="text-3xl font-extrabold">{value}</h3>
                </div>
                <div className="p-3 bg-indigo-500/10 rounded-xl">
                    {icon}
                </div>
            </div>
            <div className="mt-4 text-[10px] font-medium text-gray-400 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-indigo-500" />
                {trend}
            </div>
        </div>
    );
}