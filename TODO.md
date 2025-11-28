# 📝 TODO - Próximos Passos

Lista de melhorias e funcionalidades planejadas para as próximas versões do WebTicket.

- [ ] **Persistência de Dados:** Implementar `localStorage` ou um banco de dados simples (Firebase/Supabase) para que as filas não sejam perdidas ao recarregar a página.
- [ ] **Roteamento (React Router):** Separar as interfaces em URLs distintas (ex: `/painel-tv`, `/totem`, `/atendente`) para permitir o uso em múltiplas telas reais.
- [ ] **Múltiplos Guichês:** Expandir a lógica do agente "Atendente" para suportar múltiplos guichês funcionando simultaneamente (Guichê 01, 02, 03...).
- [ ] **Backend Real:** Migrar a regra de negócio (filas e prioridades) do frontend para uma API (Node.js), permitindo conexão via WebSocket para atualização em tempo real.
- [ ] **Testes Automatizados:** Criar testes unitários (Jest/Vitest) para validar o algoritmo de prioridade `SP ➔ SE/SG` e garantir que a alternância funcione em cenários de borda.