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
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Tasks</h1>
        <p className="text-muted-foreground">Track and manage all project tasks</p>
      </div>

      <Card className="backdrop-blur-sm border-accent/20">
        <div className="p-6">
          <div className="space-y-3">
            {MOCK_TASKS.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-primary/5 transition-colors"
              >
                <div className="flex-shrink-0">
                  {task.status === 'completed' && <CheckCircle2 className="text-green-600" size={24} />}
                  {task.status === 'in-progress' && <Clock className="text-blue-600" size={24} />}
                  {task.status === 'pending' && <AlertCircle className="text-yellow-600" size={24} />}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{task.title}</h3>
                  <p className="text-sm text-muted-foreground">{task.project}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    task.status === 'completed' ? 'bg-green-500/20 text-green-700' :
                    task.status === 'in-progress' ? 'bg-blue-500/20 text-blue-700' :
                    'bg-yellow-500/20 text-yellow-700'
                  }`}>
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">{task.dueDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
