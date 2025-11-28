# 🎫 WebTicket - Sistema de Gestão de Filas Laboratoriais

O **WebTicket** é uma aplicação que simula um sistema inteligente de gerenciamento de filas para laboratórios de análises clínicas. O projeto implementa uma arquitetura baseada em **Sistemas Multiagentes**, orquestrando a interação entre a retirada de senhas, o atendimento nos guichês e o gerenciamento temporal do fluxo de pacientes.

A especificação completa pode ser encontrada em [Sistema para controle de atendimento](./Sistema%20para%20controle%20de%20atendimento.pdf).

---

## 👨‍💻 Autores

Projeto desenvolvido pela equipe:

* **Alcides Germano da Costa Neto**
* **Iago Raimundo de Barros Wanderley**
* **Lucas Barbosa França**
* **Lucas Mota Mendes**
* **Robson Mateus Gomes de Souza**

---

## ⚙️ Funcionalidades e Agentes

O sistema é dividido em três "Agentes" principais, cada um com responsabilidades distintas na simulação:

### 1. AC - Agente Cliente (Totem)
Interface de autoatendimento onde o usuário retira sua senha.
* **SP (Prioritário):** Idosos, gestantes e PCDs.
* **SE (Exames):** Retirada rápida de exames.
* **SG (Geral):** Consultas e atendimentos gerais.

### 2. AA - Agente Atendente (Console)
Interface utilizada pelo funcionário no guichê.
* **Chamar Próximo:** Aciona o algoritmo de prioridade para buscar a próxima senha.
* **Finalizar Atendimento:** Conclui o serviço atual e registra a duração.
* **Monitoramento:** Visualiza fila de espera e status do guichê em tempo real.

### 3. AS - Agente Sistema (Background & Painel)
O "cérebro" da aplicação que gerencia o estado global.
* **Painel de TV:** Exibe a senha atual e o histórico das últimas chamadas para o público.
* **Relógio Simulado:** O tempo corre de forma acelerada (1 segundo real = 1 minuto simulado).
* **Horário de Expediente:** O sistema opera das 07:00 às 17:00, bloqueando senhas fora deste horário.

---

## 🧠 Regras de Negócio e Algoritmos

O **WebTicket** implementa regras específicas para garantir fluidez e realismo na simulação:

### 🔄 Lógica de Prioridade (Alternância Ponderada)
O sistema não utiliza um ciclo simples, mas sim uma lógica de alternância para garantir que a fila Prioritária (SP) tenha precedência sem bloquear totalmente as outras filas. A sequência ideal de chamadas segue o fluxo:

`SP ➔ SE ➔ SP ➔ SG ➔ SP ➔ ...`

1.  **Vez do Prioritário:** O sistema tenta chamar uma senha **SP**. Se atendida, passa a vez para as filas comuns.
2.  **Vez do Comum:** O sistema alterna entre **SE** e **SG**.
3.  **Fallback (Anti-Ociosidade):** Caso a fila da vez esteja vazia (ex: é a vez do SP, mas não há ninguém), o sistema busca automaticamente na próxima fila disponível (SE ou SG) para não parar o atendimento.

### ⏱️ Tempos de Atendimento (Probabilístico)
Ao finalizar um atendimento, o tempo gasto (TM) é calculado aleatoriamente baseado no tipo de senha:
* **SP:** Média de 15 min (variação ±5 min).
* **SG:** Média de 5 min (variação ±3 min).
* **SE:** 95% de chance de durar < 1 min; 5% de chance de durar 5 min (exceções).

### 🚫 No-Show (Desistência)
Existe uma chance global de **5%** do cliente não comparecer ao guichê quando chamado. O sistema registra o evento como "No-Show" e permite chamar o próximo.

---

## 🛠️ Tecnologias Utilizadas

* **React JS** (Vite)
* **Tailwind CSS** (Estilização Moderna)
* **Lucide React** (Ícones)
* **JavaScript (ES6+)**

---

## 🚀 Como Executar o Projeto

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/lmm3/web_ticket.git](https://github.com/lmm3/web_ticket.git)
   ```

2. **Instale as dependências**
    ```bash
    cd web_ticket
    npm install
    ```

3. **Rode o servidorde desenvolvimento**
    ```bash
    npm rum dev
    ```

4. **Acesse:** O projeto estará rodando em `http://localhost:5173`.

## 📂 Estrutura do Projeto
```
 src/
├── components/
│   ├── AttendantConsole/  # (AA) Controles do Guichê
│   ├── Clock24/           # Visualização do relógio analógico
│   ├── CustomHeader/      # Cabeçalho da aplicação
│   ├── ForwardButton/     # Controle de simulação
│   ├── LogTable/          # Tabela de Auditoria Detalhada
│   ├── PublicPanel/       # (AS) Painel de TV Público
│   ├── ResetButton/       # Reiniciar simulação
│   ├── SimulationControls/# Agrupador de controles de tempo
│   ├── StatusBadge/       # Componente visual de status
│   ├── SystemClock/       # Lógica do relógio do sistema
│   └── TotemSection/      # (AC) Botões de Emissão de Senha
├── App.jsx                # Orquestrador de Estado
└── main.jsx
```



Projeto acadêmico desenvolvido para demonstração de lógica de filas, simulação de tempo e gerenciamento de estado.