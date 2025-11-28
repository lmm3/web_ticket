import React from 'react';
import Clock24 from '../Clock24/Clock24';
import SimulationControls from '../SimulationControls/SimulationControls';
import ClockStatusBadge from '../ClockStatusBadge/ClockStatusBadge';


// Componente Filho: Apenas renderiza e manda comandos de volta pro pai
const SystemClock = ({ currentTime, isOpen, onTimeChange }) => {

  return (
    <div className="flex items-center gap-6 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
      {/* Mostrador de Hora */}
      <Clock24 currentTime={currentTime} />
      
      {/* Badge de Status */}
      <ClockStatusBadge isOpen={isOpen} />
      
      {/* Controles de Simulação */}
      <SimulationControls onTimeChange={onTimeChange} />
    </div>
  );
};

export default SystemClock; // Caso seja arquivo separado