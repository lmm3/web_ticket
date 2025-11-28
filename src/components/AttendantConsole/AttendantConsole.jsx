// src/components/AttendantConsole/AttendantConsole.jsx
import React from 'react';
import { Monitor, Play, CheckCircle } from 'lucide-react';

function AttendantConsole({ currentTicket, onCallNext, onFinish, isExpedienteOpen, queueLengths }) {
  
  const hasPendingTickets = (queueLengths.SP + queueLengths.SE + queueLengths.SG) > 0;
  const canCall = !currentTicket && (isExpedienteOpen || hasPendingTickets);

  // Helper para formatar hora (pode extrair para utils se quiser)
  const formatTime = (ms) => new Date(ms).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-indigo-500">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-indigo-900">
        <Monitor className="w-5 h-5" /> Console do Atendente
      </h2>

      {/* Display do Guichê */}
      <div className="bg-gray-100 rounded-xl p-6 mb-6 text-center border-2 border-dashed border-gray-300 min-h-[160px] flex flex-col justify-center items-center">
        {currentTicket ? (
          <>
            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Em Atendimento</span>
            <div className={`text-5xl font-black mb-2 tracking-tighter
              ${currentTicket.type === 'SP' ? 'text-red-600' : 
                currentTicket.type === 'SE' ? 'text-blue-600' : 'text-green-600'}`}>
              {currentTicket.id}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Chegada: {formatTime(currentTicket.issueTime)}</span>
              <span>•</span>
              <span>Início: {formatTime(currentTicket.attendTime)}</span>
            </div>
          </>
        ) : (
          <div className="text-gray-400 flex flex-col items-center">
            <Monitor className="w-12 h-12 mb-2 opacity-20" />
            <span>Guichê Livre</span>
          </div>
        )}
      </div>

      {/* Botões de Ação */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={onCallNext}
          disabled={!canCall}
          className="py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded shadow flex items-center justify-center gap-2 transition">
          <Play className="w-4 h-4" /> Chamar Próximo
        </button>

        <button
          onClick={onFinish}
          disabled={!currentTicket}
          className="py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded shadow flex items-center justify-center gap-2 transition">
          <CheckCircle className="w-4 h-4" /> Finalizar
        </button>
      </div>
      <div className="mt-auto pt-4  border-gray-700 text-center">
         <p className="text-xs text-gray-500">Agente Atendente (AA) - Visualização Atendente</p>
      </div>
    </div>
  );
}

export default AttendantConsole;