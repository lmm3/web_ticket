import React from "react";

function QueueCount({ label, count, color }) {
    return (
        <div className={`bg-${color}-50 p-2 rounded`}>
            <div className={`text-xl font-bold text-${color}-700`}>{count}</div>
            <div className={`text-xs text-${color}-500`}>{label}</div>
        </div>
    );
};

export default QueueCount;

