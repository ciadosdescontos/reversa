---
schemaVersion: 1
generatedAt: <ISO-8601>
reversa:
  version: "x.y.z"
kind: handoff
producedBy: orchestrator
hash: "sha256:<hash do corpo abaixo do front-matter>"
---

# Handoff para o Agente de Codificação

> Este documento é a porta de entrada para o agente de codificação (Claude Code, Codex, Cursor, Antigravity, etc.) que vai escrever o sistema novo a partir das specs.

## ⚠️ Leitura obrigatória primeiro

1. **`paradigm_decision.md`**, leitura inegociável. O paradigma alvo molda como toda a codificação deve acontecer.
2. **`topology_decision.md`**, leitura inegociável. A topologia escolhida (preservar / modernizar / híbrido) define a árvore de pastas e a fronteira entre módulos.

## Ordem de leitura recomendada

1. `paradigm_decision.md` (obrigatório, primeiro)
2. `topology_decision.md` (obrigatório, segundo)
3. `migration_brief.md`
4. `target_business_rules.md`
5. `migration_strategy.md`
6. `target_architecture.md`
7. `target_domain_model.md`
8. `target_data_model.md`
9. `data_migration_plan.md`
10. `parity_specs.md` + `parity_tests/`
11. `risk_register.md` + `cutover_plan.md`
12. `discard_log.md` (consultivo)
13. `ambiguity_log.md` (consultivo)

## Lista de artefatos produzidos

| Artefato | Produzido por | Status |
|---|---|---|
| migration_brief.md | orchestrator | criado |
| paradigm_decision.md | paradigm_advisor | criado |
| target_business_rules.md | curator | criado |
| discard_log.md | curator | criado |
| migration_strategy.md | strategist | criado |
| risk_register.md | strategist | criado |
| cutover_plan.md | strategist | criado |
| topology_decision.md | designer (Fase 1) | criado |
| target_architecture.md | designer | criado |
| target_domain_model.md | designer | criado |
| target_data_model.md | designer | criado |
| data_migration_plan.md | designer | criado |
| parity_specs.md | inspector | criado |
| parity_tests/*.feature | inspector | <N> arquivos |
| ambiguity_log.md | orchestrator | consolidado |

## Bloqueadores para começar a implementação
> Itens que precisam de decisão humana antes do agente de codificação começar.

- <AMB-XXX: descrição curta + onde decidir>
- <ou: nenhum bloqueador, prosseguir>

## Próximos passos para o agente de codificação

1. **Ler `paradigm_decision.md` e internalizar**: o paradigma alvo é <do paradigm_decision>. Toda escolha de código deve honrar esse paradigma.
2. **Ler `topology_decision.md` e internalizar**: a topologia escolhida é <preservar | modernizar | híbrido>. Use o esboço da árvore registrado nesse artefato como base para criar a estrutura de pastas do novo repositório.
3. **Configurar o repositório novo** com a stack declarada em `migration_brief.md` e a topologia decidida.
4. **Implementar bottom-up** seguindo `target_architecture.md` e `target_domain_model.md`:
   - infraestrutura → dados → domínio → aplicação → bordas.
5. **Escrever os testes** a partir de `parity_specs.md` e `parity_tests/*.feature` desde o início.
6. **Para cada componente**, validar que respeita o paradigma escolhido (sinais explícitos em `target_architecture.md § Honra ao paradigma escolhido`) e a topologia escolhida (sinais explícitos em `target_architecture.md § Honra à topologia escolhida`).
7. **Para a migração de dados**, seguir `data_migration_plan.md`.
8. **Para o cutover**, seguir `cutover_plan.md` e os critérios go/no-go.

## Itens auto-decididos (apenas se executado em --auto)
> Listar aqui itens cujo default foi aplicado sem confirmação humana. Recomenda-se revisar antes do cutover.

- <ou: pipeline executado em modo interativo, nenhum item auto-decidido>

## Notas finais
<Observações do orquestrador para o agente de codificação.>
