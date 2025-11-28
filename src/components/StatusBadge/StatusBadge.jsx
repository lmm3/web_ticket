import React from 'react';
import { CheckCircle, Play, XCircle, AlertCircle } from 'lucide-react';

export default function StatusBadge({ status }) {
  const styles = {
    finished: { color: 'text-green-600', label: 'Atendido', icon: CheckCircle },
    active: { color: 'text-blue-600', label: 'Em andamento', icon: Play },
    pending: { color: 'text-gray-500', label: 'Aguardando', icon: AlertCircle }, // <--- Confirme esta linha
    'no-show': { color: 'text-red-500', label: 'Desistiu', icon: XCircle },
    discarded: { color: 'text-orange-500', label: 'Descartada', icon: XCircle },
  };

  // Se o status vier vazio ou errado, usa 'pending' como padrão
  const config = styles[status] || styles.pending;
  const Icon = config.icon;

  return (
    <span className={`flex items-center gap-1 ${config.color} text-xs font-medium`}>
      <Icon size={12} /> {config.label}
    </span>
  );
}