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
  const [isHighPriorityTurn, setIsHighPriorityTurn] = useState(true); // Começa com SP
  const [nextCommonType, setNextCommonType] = useState('SE'); // O primeiro comum é SE


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
  // 1. Verificação de segurança (Filas vazias)
  if (!isExpedienteOpen && queueSP.length === 0 && queueSE.length === 0 && queueSG.length === 0) {
    alert("Expediente encerrado e filas vazias.");
    return;
  }
  
  if (currentTicket) {
    alert("Finalize o atendimento atual antes de chamar o próximo.");
    return;
  }

  let nextTicket = null;
  let ticketType = null;

  // --- LÓGICA: SP -> (SE ou SG) -> SP -> (SG ou SE) ---

  // Passo A: Tentar definir quem deveria ser chamado agora
  if (isHighPriorityTurn) {
    // É A VEZ DO SP
    if (queueSP.length > 0) {
      nextTicket = queueSP[0];
      setQueueSP(prev => prev.slice(1));
      ticketType = 'SP';
      
      // Se atendeu SP, passa a vez para os Comuns
      setIsHighPriorityTurn(false); 
    } else {
      // SP está vazia? Não podemos parar. Vamos tentar atender um Comum.
      // (Nota: mantemos isHighPriorityTurn = true para tentar SP de novo na próxima)
      const fallback = tryCallCommon();
      nextTicket = fallback.ticket;
      ticketType = fallback.type;
    }
  } else {
    // É A VEZ DOS COMUNS (SE ou SG)
    const result = tryCallCommon();
    nextTicket = result.ticket;
    ticketType = result.type;

    if (nextTicket) {
      // Se atendeu um comum, a próxima OBRIGATORIAMENTE é SP
      setIsHighPriorityTurn(true);
    } else {
      // Se os dois comuns (SE e SG) estão vazios, tenta salvar com um SP
      if (queueSP.length > 0) {
        nextTicket = queueSP[0];
        setQueueSP(prev => prev.slice(1));
        ticketType = 'SP';
        // Mantemos a vez como 'false' para tentar atender um comum assim que chegar alguém
      }
    }
  }

  // Função auxiliar para gerenciar a alternância SE <-> SG
  function tryCallCommon() {
    let selected = null;
    let type = null;
    
    // Tenta o preferido (ex: SE)
    if (nextCommonType === 'SE') {
      if (queueSE.length > 0) {
        selected = queueSE[0];
        setQueueSE(prev => prev.slice(1));
        type = 'SE';
        setNextCommonType('SG'); // Próximo comum será SG
      } else if (queueSG.length > 0) {
        // SE vazia? Pega SG (conforme seu exemplo)
        selected = queueSG[0];
        setQueueSG(prev => prev.slice(1));
        type = 'SG';
        setNextCommonType('SE'); // Alterna mesmo assim, para manter o fluxo
      }
    } else { 
      // Vez do SG
      if (queueSG.length > 0) {
        selected = queueSG[0];
        setQueueSG(prev => prev.slice(1));
        type = 'SG';
        setNextCommonType('SE'); // Próximo comum será SE
      } else if (queueSE.length > 0) {
        // SG vazia? Pega SE
        selected = queueSE[0];
        setQueueSE(prev => prev.slice(1));
        type = 'SE';
        setNextCommonType('SG'); // Alterna
      }
    }
    return { ticket: selected, type };
  }

  // --- FIM DA LÓGICA ---

  if (nextTicket) {
    // ... Código padrão de atendimento (No-show, log, etc) ...
    const isNoShow = Math.random() < 0.05;
    // ... (Copiar o restante da sua função original aqui)
     if (isNoShow) {
        updateTicketStatus(nextTicket.id, 'no-show');
        // Se deu no-show, você pode decidir se chama o próximo recursivamente ou espera o clique.
      } else {
        const updatedTicket = { ...nextTicket, attendTime: currentTime, status: 'active' };
        setCurrentTicket(updatedTicket);
        updateTicketStatus(nextTicket.id, 'active', currentTime);
        setPanelHistory(prev => [updatedTicket, ...prev].slice(0, 5));
      }
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
            isHighPriorityTurn={isHighPriorityTurn}
            nextCommonType={nextCommonType}
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