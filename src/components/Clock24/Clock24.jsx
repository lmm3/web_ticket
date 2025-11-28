import { Clock } from 'lucide-react'

const formatTime = (ms) => {
    const d = new Date(ms);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

// Componente Filho: Apenas renderiza o relógio
const Clock24 = ({ currentTime }) => {
    return (
        <div className="text-right">
        <p className="text-xs font-semibold uppercase text-gray-500">Relógio do Sistema</p>
        <div className="text-2xl font-mono font-bold text-gray-800 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          {formatTime(currentTime)}
        </div>
      </div>
    );
};

export default Clock24;