import React, { useState, useEffect, useMemo } from 'react';
import { Clock, Users, Monitor, FileText, AlertCircle, Play, FastForward, RotateCcw, CheckCircle, XCircle, Printer } from 'lucide-react';

import CustomHeader from './components/CustomHeader/CustomHeader.jsx';
import Totem from './components/Totem/Totem.jsx';
import AttendantConsole from './components/AttendantConsole/AttendantConsole.jsx';
import DailyStatsTable from './components/DailyStatsTable/DailyStatsTable.jsx';
import PublicPanel from './components/PublicPanel/PublicPanel.jsx';
import LogTable from './components/LogTable/LogTable.jsx';

/**
 * COMPONENTE PRINCIPAL DO SISTEMA
 * Simula os 3 Agentes:
 * 1. AS (Sistema): Lógica de background, relógio, gestão de filas.
 * 2. AA (Atendente): Interface para chamar e finalizar.
 * 3. AC (Cliente/Totem): Interface para retirar senhas.
 */
export default function LabQueueSystem() {
  // --- ESTADOS GLOBAIS ---

  // Relógio do Sistema (começa às 06:55 para teste)
  const [currentTime, setCurrentTime] = useState(new Date().setHours(6, 55, 0, 0));
  const [isExpedienteOpen, setIsExpedienteOpen] = useState(false);

  // Filas de espera (Tickets aguardando)
  const [queueSP, setQueueSP] = useState([]); // Prioritária
  const [queueSG, setQueueSG] = useState([]); // Geral
  const [queueSE, setQueueSE] = useState([]); // Exames

  // Controle de Sequência (Ciclo SP -> SE -> SG)
  // 0 = SP, 1 = SE, 2 = SG
  const [priorityCycleIndex, setPriorityCycleIndex] = useState(0);

  // Histórico e Painel
  const [allTickets, setAllTickets] = useState([]); // Log de tudo para relatório
  const [panelHistory, setPanelHistory] = useState([]); // Últimas 5 chamadas
  const [currentTicket, setCurrentTicket] = useState(null); // Atendimento atual no guichê

  // Contadores diários para gerar ID (SQ)
  const [dailyCounters, setDailyCounters] = useState({ SP: 1, SG: 1, SE: 1 });

  // --- LÓGICA DE TEMPO ---

  // Atualiza o relógio a cada segundo (simulado)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(prev => prev + 60000); // Avança 1 minuto a cada tick real (acelerado)
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Verifica horário de expediente (07:00 as 17:00)
  useEffect(() => {
    const date = new Date(currentTime);
    const hour = date.getHours();
    const isOpen = hour >= 7 && hour < 17;

    // Se fechou agora, limpar filas restantes
    if (isExpedienteOpen && !isOpen) {
      discardRemainingTickets();
    }

    setIsExpedienteOpen(isOpen);
  }, [currentTime, isExpedienteOpen]);

  // Função para formatar ID da Senha: YYMMDD-PPSQ
  const generateTicketId = (type) => {
    const date = new Date(currentTime);
    const yy = date.getFullYear().toString().slice(-2);
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');
    const sq = dailyCounters[type].toString().padStart(2, '0'); // Sequência simples
    return `${yy}${mm}${dd}-${type}${sq}`;
  };

  // --- AÇÕES DOS AGENTES ---

  // AC: Cliente retira senha no Totem
  const handleIssueTicket = (type) => {
    if (!isExpedienteOpen) {
      alert("O laboratório está fechado. Horário de funcionamento: 07:00 às 17:00.");
      return;
    }

    const newTicket = {
      id: generateTicketId(type),
      type: type,
      issueTime: currentTime,
      status: 'pending', // pending, active, finished, no-show, discarded
      attendTime: null,
      duration: 0,
    };

    // Incrementa contador
    setDailyCounters(prev => ({ ...prev, [type]: prev[type] + 1 }));

    // Adiciona na fila correta e no histórico global
    setAllTickets(prev => [...prev, newTicket]);

    if (type === 'SP') setQueueSP(prev => [...prev, newTicket]);
    if (type === 'SG') setQueueSG(prev => [...prev, newTicket]);
    if (type === 'SE') setQueueSE(prev => [...prev, newTicket]);
  };

  // AS/AA: Lógica de Chamar Próxima Senha (Complexa baseada no diagrama)
  const callNextTicket = () => {
    if (!isExpedienteOpen && queueSP.length === 0 && queueSE.length === 0 && queueSG.length === 0) {
      alert("Expediente encerrado e filas vazias.");
      return;
    }

    if (currentTicket) {
      alert("Finalize o atendimento atual antes de chamar o próximo.");
      return;
    }

    let nextTicket = null;
    let attempts = 0;
    let tempIndex = priorityCycleIndex;

    // Tenta encontrar uma senha rodando o ciclo SP -> SE -> SG
    // Tenta até 3 vezes (uma volta completa no ciclo)
    while (!nextTicket && attempts < 3) {
      if (tempIndex === 0) { // Vez da SP
        if (queueSP.length > 0) {
          nextTicket = queueSP[0];
          setQueueSP(prev => prev.slice(1));
        }
      } else if (tempIndex === 1) { // Vez da SE
        if (queueSE.length > 0) {
          nextTicket = queueSE[0];
          setQueueSE(prev => prev.slice(1));
        }
      } else if (tempIndex === 2) { // Vez da SG
        if (queueSG.length > 0) {
          nextTicket = queueSG[0];
          setQueueSG(prev => prev.slice(1));
        }
      }

      // Avança o ciclo para a próxima chamada
      tempIndex = (tempIndex + 1) % 3;
      attempts++;
    }

    // Atualiza o índice global do ciclo
    setPriorityCycleIndex(tempIndex);

    if (nextTicket) {
      // Regra dos 5% de No-Show (Cliente desistiu)
      const isNoShow = Math.random() < 0.05;

      if (isNoShow) {
        updateTicketStatus(nextTicket.id, 'no-show');
        // Se for no-show, chamamos a próxima recursivamente ou mostramos aviso?
        // Para simplificar a UI, vamos apenas mostrar que foi chamado e marcado como ausente
        // mas não vamos ocupar o guichê (chama o próximo automaticamente na vida real, 
        // mas aqui vamos deixar o atendente clicar de novo para ver o log).
      }

      // Define como atual e atualiza status
      const updatedTicket = {
        ...nextTicket,
        attendTime: currentTime,
        status: isNoShow ? 'no-show' : 'active'
      };

      if (!isNoShow) {
        setCurrentTicket(updatedTicket);
      }

      updateTicketStatus(nextTicket.id, isNoShow ? 'no-show' : 'active', currentTime);

      // Atualiza Painel (apenas se não for no-show ou se quisermos mostrar que foi chamado)
      // O prompt diz "5 últimas senhas chamadas".
      setPanelHistory(prev => [updatedTicket, ...prev].slice(0, 5));

    } else {
      alert("Não há senhas nas filas no momento.");
    }
  };

  // AA: Finalizar Atendimento
  const finishService = () => {
    if (!currentTicket) return;

    // Calcular Tempo de Retenção (TM) simulado baseado nas regras
    let duration = 0;
    const r = Math.random();

    if (currentTicket.type === 'SP') {
      // 15 min +/- 5 min (entre 10 e 20)
      duration = 15 + (Math.random() * 10 - 5);
    } else if (currentTicket.type === 'SG') {
      // 5 min +/- 3 min (entre 2 e 8)
      duration = 5 + (Math.random() * 6 - 3);
    } else if (currentTicket.type === 'SE') {
      // 95% < 1 min, 5% = 5 min
      if (r < 0.95) duration = 0.8;
      else duration = 5;
    }

    // Atualiza ticket com duração e finaliza
    const finishedTicket = { ...currentTicket, status: 'finished', duration: duration };
    updateTicketStatus(currentTicket.id, 'finished', null, duration);
    setCurrentTicket(null);
  };

  // Helper para atualizar ticket na lista global
  const updateTicketStatus = (id, status, attendTime = null, duration = 0) => {
    setAllTickets(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status,
          attendTime: attendTime || t.attendTime,
          duration: duration || t.duration
        };
      }
      return t;
    }));
  };

  // Limpeza automática às 17:00
  const discardRemainingTickets = () => {
    setQueueSP([]);
    setQueueSG([]);
    setQueueSE([]);
    setAllTickets(prev => prev.map(t => {
      if (t.status === 'pending') return { ...t, status: 'discarded' };
      return t;
    }));
  };

  // Helper de Formatação de Hora
  const formatTime = (ms) => {
    const d = new Date(ms);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  // --- RENDERIZAÇÃO ---

  return (
    <div className="min-h-screen w-full bg-gray-100 font-sans text-gray-800 p-4">

      {/* HEADER DO SISTEMA */}
      <CustomHeader
        currentTime={currentTime}
        isExpedienteOpen={isExpedienteOpen}
        setCurrentTime={setCurrentTime}
      />

      <div className="grid w-full grid-cols-1 lg:grid-cols-12 gap-6">

        {/* COLUNA 1: AC - TOTEM (CLIENTE) */}
        <div className="lg:col-span-3">
          <Totem
            onIssueTicket={handleIssueTicket}
            queues={{ SP: queueSP, SE: queueSE, SG: queueSG }}
            priorityCycleIndex={priorityCycleIndex}
          />
        </div>

        {/* COLUNA 2: AA - AGENTE ATENDENTE */}
        <div className="lg:col-span-5 space-y-6">
          <AttendantConsole
            currentTicket={currentTicket}
            onCallNext={callNextTicket}
            onFinish={finishService}
            isExpedienteOpen={isExpedienteOpen}
            queueLengths={{ SP: queueSP.length, SE: queueSE.length, SG: queueSG.length }}
          />
          {/* Relatórios Rápidos */}
          <DailyStatsTable allTickets={allTickets} />
        </div>

        {/* COLUNA 3: PAINEL DE CHAMADAS (TV) */}
        <div className="lg:col-span-4">
          <PublicPanel history={panelHistory} />
        </div>

      </div>

      {/* SEÇÃO DE DETALHES TÉCNICOS (RELATÓRIO DETALHADO) */}
      <div className="mt-8 w-full">
        <LogTable tickets={allTickets} />
      </div>
    </div>
  );
}