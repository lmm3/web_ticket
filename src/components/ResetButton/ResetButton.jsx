import React from "react";
import { RotateCcw } from "lucide-react";

const handleReset = (onTimeChange) => {
    // Reseta para 06:55
    onTimeChange(new Date().setHours(6, 55, 0, 0));
};

function ResetButton({ onTimeChange }) {
    return (
        <button 
            onClick={() => handleReset(onTimeChange)} 
            className="p-1 bg-white hover:bg-gray-200 text-gray-500 hover:text-blue-600 rounded transition-colors" 
            title="Resetar 06:55"
         >
            <RotateCcw size={16}/>
         </button>
    );
}

export default ResetButton;