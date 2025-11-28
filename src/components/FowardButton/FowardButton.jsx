import React from "react";
import { FastForward } from "lucide-react";

const handleFastForward = (onTimeChange) => {
    // Avança 30 minutos
    onTimeChange(prev => prev + (30 * 60000));
};

function FowardButton({ onTimeChange }) {
    return (
        <button 
            onClick={() => handleFastForward(onTimeChange)} 
            className="p-1 bg-white hover:bg-gray-200 text-gray-500 hover:text-blue-600 rounded transition-colors" 
            title="Avançar 30 min"
         >
            <FastForward size={16}/>
         </button>
    );
}

export default FowardButton;