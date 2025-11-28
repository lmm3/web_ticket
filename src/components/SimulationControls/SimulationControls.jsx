import React from "react";
import FowardButton from "../FowardButton/FowardButton";
import ResetButton from "../ResetButton/ResetButton";

// Componente Pai: Apenas organiza os botões de controle
const SimulationControls = ({ onTimeChange }) => {
    return (
        <div className="flex gap-1 ml-4 border-l pl-4">
            <ResetButton onTimeChange={onTimeChange} />
            <FowardButton onTimeChange={onTimeChange} />
        </div>
    );
};

export default SimulationControls;