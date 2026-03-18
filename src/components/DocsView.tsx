import React from 'react';
import { DriveFile } from '../types';
import { FileText, ExternalLink, Clock, FileSearch } from 'lucide-react';

export default function DocsView({ files }: { files: DriveFile[] }) {
  const docs = files.filter(f => f.mimeType === 'application/vnd.google-apps.document');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Documentación de Operaciones</h2>
          <p className="text-zinc-400 text-sm">Instrucciones y guías de operación extraídas de Google Docs.</p>
        </div>
      </div>

      {docs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
          <FileSearch className="w-12 h-12 text-zinc-600 mb-4" />
          <p className="text-zinc-500">No se encontraron documentos de Google Docs.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map(doc => (
            <div key={doc.id}>
              <DocCard doc={doc} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DocCard({ doc }: { doc: DriveFile }) {
  return (
    <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 space-y-4 hover:border-emerald-500/30 transition-all group">
      <div className="flex items-start justify-between">
        <div className="p-3 bg-blue-500/10 rounded-xl">
          <FileText className="w-6 h-6 text-blue-500" />
        </div>
        <a 
          href={`https://docs.google.com/document/d/${doc.id}/edit`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="space-y-1">
        <h3 className="font-bold text-lg group-hover:text-emerald-400 transition-colors line-clamp-1">
          {doc.name}
        </h3>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Clock className="w-3 h-3" />
          <span>Modificado: {new Date(doc.modifiedTime).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-white/5">
        <p className="text-sm text-zinc-400 line-clamp-3 leading-relaxed">
          Este documento contiene las instrucciones operativas críticas para el despliegue del proyecto. 
          Incluye protocolos de seguridad y pasos de verificación.
        </p>
      </div>

      <button className="w-full py-2 text-xs font-semibold text-emerald-500 bg-emerald-500/5 rounded-lg hover:bg-emerald-500/10 transition-colors">
        Ver Resumen de IA
      </button>
    </div>
  );
}
