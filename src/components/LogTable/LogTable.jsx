import React from 'react';
import { Printer } from 'lucide-react';
import StatusBadge from '../StatusBadge/StatusBadge'; 

function LogTable({ tickets = [] }) {
  
  // Helper de formatação de hora
  const formatTime = (ms) => {
    if (!ms) return '-';
    return new Date(ms).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  // Inverte a lista para mostrar o mais recente no topo
  // Usamos useMemo ou apenas slice() aqui para não mutar a prop original
  const sortedTickets = [...tickets].reverse();

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
      <h2 className="text-lg font-bold mb-4 text-gray-700 flex items-center gap-2">
         <Printer className="w-5 h-5"/> Log Detalhado do Sistema (Auditoria)
      </h2>
      
      <div className="overflow-x-auto max-h-60 overflow-y-auto border rounded scrollbar-thin scrollbar-thumb-gray-300">
        <table className="w-full text-xs text-left">
          <thead className="bg-gray-100 text-gray-600 sticky top-0 shadow-sm z-10">
             <tr>
               <th className="p-3 font-semibold">Senha</th>
               <th className="p-3 font-semibold">Tipo</th>
               <th className="p-3 font-semibold">Status</th>
               <th className="p-3 font-semibold">Emissão</th>
               <th className="p-3 font-semibold">Atendimento</th>
               <th className="p-3 font-semibold text-right">Duração (TM)</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
             {sortedTickets.map(ticket => (
               <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-mono font-bold text-gray-700">{ticket.id}</td>
                  <td className="p-3">
                     <span className={`px-2 py-0.5 rounded-full text-[10px] text-white font-bold shadow-sm
                        ${ticket.type === 'SP' ? 'bg-red-500' : ticket.type === 'SE' ? 'bg-blue-500' : 'bg-green-500'}`}>
                        {ticket.type}
                     </span>
                  </td>
                  <td className="p-3">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="p-3 text-gray-600">{formatTime(ticket.issueTime)}</td>
                  <td className="p-3 text-gray-600">{ticket.attendTime ? formatTime(ticket.attendTime) : '-'}</td>
                  <td className="p-3 text-right font-mono text-gray-600">
                    {ticket.duration > 0 ? `${ticket.duration.toFixed(1)} min` : '-'}
                  </td>
               </tr>
             ))}
             
             {tickets.length === 0 && (
               <tr>
                 <td colSpan="6" className="p-8 text-center text-gray-400 italic">
                   Nenhuma senha emitida hoje.
                 </td>
               </tr>
             )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LogTable;