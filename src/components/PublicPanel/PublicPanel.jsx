import React from 'react';

function PublicPanel({ history = [] }) {
  // Separa o atual (índice 0) dos anteriores
  const currentTicket = history.length > 0 ? history[0] : null;
  const previousTickets = history.slice(1, 5); // Pega os próximos 4

  // Helper simples para cores
  const getColorClass = (type) => {
    switch (type) {
      case 'SP': return 'text-red-400';
      case 'SE': return 'text-blue-400';
      case 'SG': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-2xl min-h-[500px] flex flex-col h-full">
      <h2 className="text-center font-bold text-xl mb-6 tracking-wider border-b border-gray-600 pb-4 uppercase">
        Painel de Chamadas
      </h2>
      
      {/* Destaque Principal (Última Senha Chamada) */}
      <div className="mb-8 text-center bg-gray-700 p-6 rounded-xl border border-gray-600 shadow-inner flex-grow flex flex-col justify-center">
         <span className="block text-gray-400 text-sm uppercase mb-2">Senha Atual</span>
         {currentTicket ? (
           <div className="animate-pulse"> {/* Animação simples para chamar atenção */}
             <div className={`text-6xl font-black mb-2 ${getColorClass(currentTicket.type)}`}>
                {currentTicket.id}
             </div>
             <div className="text-xl font-bold text-white">GUICHÊ 01</div>
           </div>
         ) : (
           <div className="text-4xl font-bold text-gray-600 py-4">--</div>
         )}
      </div>

      {/* Lista de Histórico Recente */}
      <div className="flex-1">
         <h3 className="text-xs text-gray-500 uppercase mb-3 border-b border-gray-700 pb-1">Últimas Chamadas</h3>
         <div className="space-y-3">
           {previousTickets.map((ticket, idx) => (
             <div key={idx} className="flex justify-between items-center bg-gray-700/50 p-3 rounded border-l-4 border-gray-500">
                <span className={`font-bold text-xl ${getColorClass(ticket.type)}`}>
                  {ticket.id}
                </span>
                <span className="text-sm text-gray-400">Guichê 01</span>
             </div>
           ))}
           
           {history.length < 2 && (
              <p className="text-gray-600 text-sm italic text-center mt-10">Aguardando histórico...</p>
           )}
         </div>
      </div>
      
      <div className="mt-auto pt-4 border-t border-gray-700 text-center">
         <p className="text-xs text-gray-500">Agente Sistema (AS) - Visualização Pública</p>
      </div>
    </div>
  );
}

export default PublicPanel;
