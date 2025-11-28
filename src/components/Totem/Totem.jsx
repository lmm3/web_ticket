// src/components/TotemSection/TotemSection.jsx
import React from 'react';
import { Users } from 'lucide-react';
import TicketButton from '../TicketButton/TicketButton';
import QueueCount from '../QueueCount/QueueCount'; 
function Totem({ onIssueTicket, queues, isHighPriorityTurn, nextCommonType}) {
  const nextType = isHighPriorityTurn ? 'SP' : nextCommonType;

  const getNextColor = () => {
    if (nextType === 'SP') return 'text-red-600';
    if (nextType === 'SE') return 'text-blue-600';
    return 'text-green-600';
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-700">
          <Users className="w-5 h-5" /> Totem de Autoatendimento
        </h2>
        
        <div className="space-y-3">
          <TicketButton type="SP" label="Prioritário" sub="Idosos/Gestantes" color="red" onClick={() => onIssueTicket('SP')} />
          <TicketButton type="SE" label="Retirada Exames" sub="Rápido" color="blue" onClick={() => onIssueTicket('SE')} />
          <TicketButton type="SG" label="Geral" sub="Consultas" color="green" onClick={() => onIssueTicket('SG')} />
        </div>
      </div>

      {/* Mini Dashboard das Filas */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase">Pessoas na Fila</h3>
        <div className="grid grid-cols-3 gap-2 text-center">
           <QueueCount label="SP" count={queues.SP.length} color="red" />
           <QueueCount label="SE" count={queues.SE.length} color="blue" />
           <QueueCount label="SG" count={queues.SG.length} color="green" />
        </div>
        <div className="mt-2 text-xs text-center text-gray-400">
           Próxima Prioridade: <span className="font-bold text-gray-600">{nextType}</span>
        </div>
      </div>
    </div>
  );
}

export default Totem;