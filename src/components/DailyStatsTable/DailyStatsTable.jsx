import React from "react";
import { FileText } from "lucide-react";

function DailyStatsTable({ allTickets }) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b flex justify-between items-center">
                <h3 className="font-bold text-gray-700 text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Relatório Diário
                </h3>
                <span className="text-xs text-gray-500">Filtrado (hoje)</span>
            </div>
            <div className="p-4 overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="text-gray-500 border-b">
                            <th className="pb-2">Tipo</th>
                            <th className="pb-2 text-right">Emitidas</th>
                            <th className="pb-2 text-right">Atendidas</th>
                            <th className="pb-2 text-right">No-Show</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {['SP', 'SG', 'SE'].map(type => {
                            const total = allTickets.filter(t => t.type === type).length;
                            const finished = allTickets.filter(t => t.type === type && t.status === 'finished').length;
                            const noshow = allTickets.filter(t => t.type === type && t.status === 'no-show').length;
                            return (
                                <tr key={type}>
                                    <td className="py-2 font-bold">{type}</td>
                                    <td className="py-2 text-right">{total}</td>
                                    <td className="py-2 text-right text-green-600">{finished}</td>
                                    <td className="py-2 text-right text-red-400">{noshow}</td>
                                </tr>
                            )
                        })}
                        <tr className="bg-gray-50 font-bold">
                            <td className="py-2 pl-2">Total</td>
                            <td className="py-2 text-right pr-2">{allTickets.length}</td>
                            <td className="py-2 text-right pr-2">{allTickets.filter(t => t.status === 'finished').length}</td>
                            <td className="py-2 text-right pr-2">{allTickets.filter(t => t.status === 'no-show').length}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DailyStatsTable;