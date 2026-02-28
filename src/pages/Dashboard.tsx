import { useTaskStore } from '../store/taskStore';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { CheckCircle2, Clock, Zap, Target } from 'lucide-react';
import { format, subDays } from 'date-fns';

export function Dashboard() {
    const tasks = useTaskStore(state => state.tasks);

    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = tasks.length - completedTasks;
    const totalPomodoros = tasks.reduce((acc, t) => acc + t.pomodoroSessions, 0);

    // Category data for Pie Chart
    const categoryCounts = tasks.reduce((acc, task) => {
        acc[task.category] = (acc[task.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));
    const COLORS = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6'];

    // Activity data for Bar Chart (last 7 days)
    const activityData = Array.from({ length: 7 }).map((_, i) => {
        const d = subDays(new Date(), 6 - i);
        const dateStr = format(d, 'MMM dd');

        // For realistic dummy data, let's just make up some numbers based on the date index
        // In a real app, you'd filter `tasks` where `completedAt` === d
        return {
            name: dateStr,
            completed: Math.floor(Math.random() * 5) + (i === 6 ? completedTasks : 0), // spike on current day for realism
        };
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Dashboard Overview
                </h1>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Tasks"
                    value={tasks.length.toString()}
                    icon={<Target className="w-5 h-5 text-blue-500" />}
                    trend="+3% this week"
                />
                <StatCard
                    title="Completed"
                    value={completedTasks.toString()}
                    icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                    trend="+12% this week"
                />
                <StatCard
                    title="Pending Focus"
                    value={pendingTasks.toString()}
                    icon={<Clock className="w-5 h-5 text-amber-500" />}
                    trend="-2% this week"
                />
                <StatCard
                    title="Pomodoros"
                    value={totalPomodoros.toString()}
                    icon={<Zap className="w-5 h-5 text-pink-500" />}
                    trend={totalPomodoros > 0 ? "Great job!" : "Start focusing"}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart Activity */}
                <div className="glass p-6 min-h-[400px]">
                    <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-indigo-500" />
                        Productivity Pulse
                    </h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={activityData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.2)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                                    contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                                />
                                <Bar dataKey="completed" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart Categories */}
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
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {categoryData.map((_entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-gray-500">
                                No tasks to display yet.
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
        <div className="glass p-6 hover:translate-y-[-2px] transition-transform duration-300">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold">{value}</h3>
                </div>
                <div className="p-3 bg-white/50 dark:bg-white/5 rounded-xl border border-white/10">
                    {icon}
                </div>
            </div>
            <div className="mt-4 text-xs font-medium text-gray-400">
                {trend}
            </div>
        </div>
    );
}
