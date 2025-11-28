import React from 'react';
import { Monitor } from 'lucide-react';
import SystemClock from '../SystemClock/SystemClock.jsx';

function CustomHeader({ currentTime, isExpedienteOpen, setCurrentTime }) {
    return (
        <header className="bg-white shadow-md rounded-lg p-4 mb-6 flex flex-col md:flex-row justify-between items-center border-b-4 border-blue-600">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <Monitor className="text-blue-600 w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">SysLab Atendimento</h1>
            <p className="text-xs text-gray-500">Sistema de Gestão de Filas Laboratoriais</p>
          </div>
        </div>
        <SystemClock 
          currentTime={currentTime} 
          isOpen={isExpedienteOpen} 
          onTimeChange={setCurrentTime} 
        /> 
      </header>
    );
}

export default CustomHeader;