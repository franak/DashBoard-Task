import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  ReferenceLine
} from 'recharts';
import { DriveFile, OperationItem } from '../types';
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

// Mock data for demonstration as requested
const MOCK_MILESTONES: OperationItem[] = [
  { id: '1', title: 'Fase de Diseño', type: 'milestone', status: 'completed', startDate: '2024-03-01', endDate: '2024-03-10', source: 'sheet' },
  { id: '2', title: 'Desarrollo Core', type: 'milestone', status: 'in-progress', startDate: '2024-03-11', endDate: '2024-03-25', source: 'sheet' },
  { id: '3', title: 'Pruebas QA', type: 'milestone', status: 'pending', startDate: '2024-03-26', endDate: '2024-04-05', source: 'sheet' },
  { id: '4', title: 'Lanzamiento Beta', type: 'milestone', status: 'pending', startDate: '2024-04-06', endDate: '2024-04-10', source: 'sheet' },
];

export default function TimelineView({ files }: { files: DriveFile[] }) {
  // Transform dates to relative days for the Gantt visualization
  const baseDate = new Date('2024-03-01').getTime();
  const chartData = MOCK_MILESTONES.map(m => {
    const start = new Date(m.startDate!).getTime();
    const end = new Date(m.endDate!).getTime();
    return {
      name: m.title,
      start: (start - baseDate) / (1000 * 60 * 60 * 24),
      duration: (end - start) / (1000 * 60 * 60 * 24),
      status: m.status,
      original: m
    };
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Línea de Tiempo de Operaciones</h2>
          <p className="text-zinc-400 text-sm">Visualización de hitos y plazos críticos desde Google Sheets.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gantt Chart Card */}
        <div className="lg:col-span-2 bg-[#111111] border border-white/5 rounded-2xl p-6 h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              barCategoryGap={20}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                stroke="#888" 
                fontSize={12} 
                width={120}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                formatter={(value: any, name: any, props: any) => [
                  `${props.payload.original.startDate} a ${props.payload.original.endDate}`,
                  'Plazo'
                ]}
              />
              <Bar dataKey="duration" radius={[0, 4, 4, 0]} stackId="a">
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={
                      entry.status === 'completed' ? '#10b981' : 
                      entry.status === 'in-progress' ? '#3b82f6' : '#3f3f46'
                    } 
                  />
                ))}
              </Bar>
              {/* This invisible bar creates the offset for the Gantt effect */}
              <Bar dataKey="start" stackId="a" fill="transparent" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Milestone List */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 px-2">Hitos Recientes</h3>
          {MOCK_MILESTONES.map(milestone => (
            <div key={milestone.id}>
              <MilestoneItem milestone={milestone} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MilestoneItem({ milestone }: { milestone: OperationItem }) {
  const statusColors = {
    completed: 'text-emerald-500 bg-emerald-500/10',
    'in-progress': 'text-blue-500 bg-blue-500/10',
    pending: 'text-zinc-500 bg-zinc-500/10'
  };

  const StatusIcon = {
    completed: CheckCircle2,
    'in-progress': Clock,
    pending: AlertCircle
  }[milestone.status || 'pending'];

  return (
    <div className="bg-[#111111] border border-white/5 rounded-xl p-4 flex items-start gap-4 hover:border-white/10 transition-colors group cursor-pointer">
      <div className={cn("p-2 rounded-lg", statusColors[milestone.status || 'pending'])}>
        <StatusIcon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate group-hover:text-emerald-400 transition-colors">
          {milestone.title}
        </h4>
        <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
          <span>{milestone.startDate}</span>
          <span>•</span>
          <span>{milestone.endDate}</span>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
