# N8N Translator

**Comando:** `/reversa-n8n`
**Fase:** Tradução (adaptador de entrada)

---

## 🔁 O tradutor juramentado

O tradutor juramentado pega um documento oficial em uma língua e produz outra versão em língua diferente, preservando cada cláusula, prazo e efeito legal. O N8N Translator faz o mesmo: lê um workflow exportado como JSON e produz uma spec SDD que captura o mesmo comportamento de negócio, pronta para ser reimplementada em Python ou em qualquer outra linguagem.

---

## O que faz

O N8N Translator é o ponto de entrada quando o "código" legado não é código-fonte, e sim um workflow visual do N8N exportado como JSON. Ele percorre o grafo de nós, interpreta cada passo semanticamente (não só pelo tipo do nó) e emite três artefatos SDD que descrevem o sistema de forma independente do N8N.

Após gerar a spec, o agente prepara `.reversa/state.json` e `.reversa/plan.md` para que o pipeline padrão do Reversa (Scout, Archaeologist, Detective, Architect, Writer, Reviewer) possa assumir e refinar a análise, se necessário.

---

## O que ele analisa

- **Estrutura do workflow:** triggers, grafo de nós, ramificações (`if`, `switch`), junções, loops (`splitInBatches`), sub-workflows
- **Cada nó:** propósito no contexto de negócio, entradas, saídas, transformações, dependências externas
- **Nós Function/Code:** lê o JS ou Python embutido e descreve a lógica em linguagem natural
- **Credenciais:** lista credenciais referenciadas por tipo (`oAuth2Api`, `httpHeaderAuth`, etc.) sem expor valores
- **Integrações externas:** APIs, bancos, serviços SaaS, webhooks
- **Equivalência em Python:** para cada nó, sugere uma biblioteca Python e padrão de implementação (consulte `references/node-catalog.md`)

---

## Entrada

O agente usa uma pasta dedicada: `n8n_json_workflows/`. A pasta é criada automaticamente na primeira execução. Coloque os JSONs exportados do N8N lá. Se houver múltiplos arquivos, o agente pergunta qual processar.

---

## O que ele produz

| Arquivo | Conteúdo |
|---------|----------|
| `_reversa_n8n/<slug>/workflow-overview.md` | Análise da fonte: metadados, fluxograma Mermaid, tabela de nós, credenciais, ambiguidades |
| `_reversa_n8n/<slug>/requirements.md` | Requisitos SDD: funcionais (`RF-NN`), não-funcionais (`RNF-NN`), critérios de aceitação |
| `_reversa_n8n/<slug>/design.md` | Guia de implementação Python: arquitetura, componentes, bibliotecas, estrutura de pastas, tratamento de erros, configuração, testes |
| `.reversa/state.json` | Estado inicial do pipeline principal (com `source: "n8n"` e `source_artifacts`) |
| `.reversa/plan.md` | Plano com seção `Fase 0: Origem N8N` marcando a etapa de tradução |

---

## Quando usar

Use sempre que tiver um workflow N8N e quiser:

- Documentar como spec SDD para revisão ou auditoria
- Reimplementar em Python (ou outra linguagem) sem ter o N8N como dependência de runtime
- Migrar para arquitetura própria (FastAPI, worker, CLI) antes de aplicar o pipeline completo do Reversa

```
/reversa-n8n
```

Depois que o agente concluir, execute `/reversa` para continuar com o Scout e o restante do pipeline.
