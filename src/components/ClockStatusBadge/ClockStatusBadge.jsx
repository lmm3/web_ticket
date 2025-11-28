import React from 'react';

function ClockStatusBadge({ isOpen }) {
    return (
        <div className={`px-3 py-1 rounded-full text-sm font-bold ${isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isOpen ? 'ABERTO' : 'FECHADO'}
        </div>
    );
}

export default ClockStatusBadge;