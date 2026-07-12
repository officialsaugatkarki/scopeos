'use client';

import { Card } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';

const MOCK_TASKS = [
  { id: 1, title: 'Update hero section with animations', status: 'completed', project: 'Website Redesign', dueDate: '2024-04-10' },
  { id: 2, title: 'Design mobile responsive layout', status: 'in-progress', project: 'Website Redesign', dueDate: '2024-04-15' },
  { id: 3, title: 'Optimize images and assets', status: 'pending', project: 'Mobile App Update', dueDate: '2024-04-20' },
  { id: 4, title: 'Setup database migrations', status: 'in-progress', project: 'CMS Migration', dueDate: '2024-04-18' },
  { id: 5, title: 'Create API endpoints', status: 'pending', project: 'CMS Migration', dueDate: '2024-04-22' },
];

export default function TasksPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Tasks</h1>
        <p className="text-white/60 font-medium">Track and manage all project tasks</p>
      </div>

      <Card className="bg-white/[0.02] border border-white/[0.06] rounded-2xl shadow-sm">
        <div className="p-6">
          <div className="space-y-3">
            {MOCK_TASKS.map((task) => (
              <div
                key={task.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-xl border border-white/[0.06] hover:bg-white/[0.04] transition-colors cursor-pointer group"
              >
                <div className="flex-shrink-0 mt-0.5 sm:mt-0">
                  {task.status === 'completed' && <CheckCircle2 className="text-emerald-400 group-hover:scale-110 transition-transform" size={24} />}
                  {task.status === 'in-progress' && <Clock className="text-blue-400 group-hover:scale-110 transition-transform" size={24} />}
                  {task.status === 'pending' && <AlertCircle className="text-amber-400 group-hover:scale-110 transition-transform" size={24} />}
                </div>
                <div className="flex-1 min-w-0 w-full">
                  <h3 className="font-semibold text-white truncate">{task.title}</h3>
                  <p className="text-sm text-white/60 mt-1 truncate">{task.project}</p>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-2 sm:mt-0">
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full border ${
                    task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    task.status === 'in-progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {task.status.replace('-', ' ')}
                  </span>
                  <p className="text-xs text-white/40 mt-0 sm:mt-1.5">{task.dueDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
