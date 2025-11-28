import React from "react";

function TicketButton({ type, label, sub, color, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`w-full py-4 px-4 bg-${color}-100 hover:bg-${color}-200 text-${color}-800 font-bold rounded-lg border border-${color}-200 transition flex justify-between items-center group`}>
            <span>{label} ({type})</span>
            <span className="bg-white px-2 py-1 rounded text-xs opacity-70 group-hover:opacity-100">{sub}</span>
        </button>
    );
};

export default TicketButton;