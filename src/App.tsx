import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Kanban, 
  FileText, 
  Settings, 
  LogOut, 
  RefreshCw,
  Search,
  Filter,
  ChevronRight,
  Clock,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Types
import { OperationItem, DriveFile } from './types';

// Components
import TimelineView from './components/TimelineView';
import KanbanView from './components/KanbanView';
import DocsView from './components/DocsView';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'timeline' | 'kanban' | 'docs'>('timeline');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    checkAuthStatus();
    
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        setIsAuthenticated(true);
        fetchFiles();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const checkAuthStatus = async () => {
    try {
      const res = await fetch('/api/auth/status');
      const data = await res.json();
      setIsAuthenticated(data.isAuthenticated);
      if (data.isAuthenticated) {
        fetchFiles();
      }
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/drive/files');
      if (res.ok) {
        const data = await res.json();
        setFiles(data);
      }
    } catch (error) {
      console.error('Failed to fetch files');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await fetch('/api/auth/url');
      const { url } = await res.json();
      window.open(url, 'google_oauth', 'width=600,height=700');
    } catch (error) {
      console.error('Login error');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout');
    setIsAuthenticated(false);
    setFiles([]);
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a] text-white">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-white p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Dashboard de Operaciones</h1>
            <p className="text-zinc-400">Conecta tu Google Drive para visualizar cronogramas y tareas en tiempo real.</p>
          </div>
          
          <button
            onClick={handleLogin}
            className="w-full py-4 px-6 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-3"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            Conectar con Google Workspace
          </button>

          <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-4 text-xs text-zinc-500">
            <div className="space-y-1">
              <Calendar className="w-4 h-4 mx-auto mb-2" />
              <span>Timeline</span>
            </div>
            <div className="space-y-1">
              <Kanban className="w-4 h-4 mx-auto mb-2" />
              <span>Kanban</span>
            </div>
            <div className="space-y-1">
              <FileText className="w-4 h-4 mx-auto mb-2" />
              <span>Docs</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-zinc-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-[#111111] border-r border-white/5 transition-all duration-300 flex flex-col",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <LayoutDashboard className="w-5 h-5 text-black" />
          </div>
          {isSidebarOpen && <span className="font-bold text-lg tracking-tight">OpsIntel</span>}
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <NavItem 
            icon={<Calendar />} 
            label="Timeline" 
            active={activeTab === 'timeline'} 
            onClick={() => setActiveTab('timeline')}
            collapsed={!isSidebarOpen}
          />
          <NavItem 
            icon={<Kanban />} 
            label="Kanban" 
            active={activeTab === 'kanban'} 
            onClick={() => setActiveTab('kanban')}
            collapsed={!isSidebarOpen}
          />
          <NavItem 
            icon={<FileText />} 
            label="Documentos" 
            active={activeTab === 'docs'} 
            onClick={() => setActiveTab('docs')}
            collapsed={!isSidebarOpen}
          />
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Buscar operaciones, archivos o tareas..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-emerald-500/50 transition-colors text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={fetchFiles}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500/20 transition-colors text-sm font-medium"
            >
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
              Sincronizar
            </button>
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10" />
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeTab === 'timeline' && <TimelineView files={files} />}
              {activeTab === 'kanban' && <KanbanView files={files} />}
              {activeTab === 'docs' && <DocsView files={files} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function NavItem({ 
  icon, 
  label, 
  active, 
  onClick, 
  collapsed 
}: { 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: () => void;
  collapsed: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group",
        active 
          ? "bg-emerald-500 text-black font-semibold shadow-lg shadow-emerald-500/20" 
          : "text-zinc-400 hover:text-white hover:bg-white/5"
      )}
    >
      <span className={cn("flex-shrink-0", active ? "text-black" : "group-hover:text-emerald-500")}>
        {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
      </span>
      {!collapsed && <span>{label}</span>}
    </button>
  );
}
