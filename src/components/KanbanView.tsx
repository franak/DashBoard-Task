import React from 'react';
import { DriveFile, OperationItem } from '../types';
import { MoreVertical, Plus, Clock, User } from 'lucide-react';

const MOCK_TASKS: OperationItem[] = [
  { id: 't1', title: 'Configurar API Drive', status: 'in-progress', type: 'task', source: 'sheet' },
  { id: 't2', title: 'Diseñar UI Dashboard', status: 'completed', type: 'task', source: 'sheet' },
  { id: 't3', title: 'Integrar Calendar', status: 'pending', type: 'task', source: 'sheet' },
  { id: 't4', title: 'Pruebas de Seguridad', status: 'pending', type: 'task', source: 'sheet' },
];

export default function KanbanView({ files }: { files: DriveFile[] }) {
  const columns = [
    { id: 'pending', title: 'Pendiente', color: 'bg-zinc-500' },
    { id: 'in-progress', title: 'En Proceso', color: 'bg-blue-500' },
    { id: 'completed', title: 'Completado', color: 'bg-emerald-500' },
  ];

  return (
    <div className="h-full flex flex-col space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Tablero Kanban</h2>
        <p className="text-zinc-400 text-sm">Estado de operaciones y tareas sincronizadas.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0">
        {columns.map(col => (
          <div key={col.id} className="flex flex-col space-y-4 bg-white/5 rounded-2xl p-4 border border-white/5">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${col.color}`} />
                <h3 className="font-semibold text-sm">{col.title}</h3>
                <span className="text-xs text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full">
                  {MOCK_TASKS.filter(t => t.status === col.id).length}
                </span>
              </div>
              <button className="p-1 hover:bg-white/5 rounded text-zinc-500">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {MOCK_TASKS.filter(t => t.status === col.id).map(task => (
                <div key={task.id}>
                  <KanbanCard task={task} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KanbanCard({ task }: { task: OperationItem }) {
  return (
    <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-4 space-y-4 hover:border-white/10 transition-all cursor-grab active:cursor-grabbing group">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium leading-tight group-hover:text-emerald-400 transition-colors">
          {task.title}
        </h4>
        <button className="text-zinc-600 hover:text-zinc-400">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Clock className="w-3 h-3" />
          <span>2d</span>
        </div>
        <div className="flex -space-x-2">
          <div className="w-6 h-6 rounded-full bg-zinc-800 border-2 border-[#1a1a1a] flex items-center justify-center">
            <User className="w-3 h-3 text-zinc-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
