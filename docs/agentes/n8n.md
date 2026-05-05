# N8N Translator

**Command:** `/reversa-n8n`
**Phase:** Translation (input adapter)

---

## 🔁 The certified translator

The certified translator takes an official document in one language and produces another version in a different language, preserving every clause, deadline, and legal effect. The N8N Translator does the same: it reads a workflow exported as JSON and produces an SDD spec that captures the same business behavior, ready to be reimplemented in Python or any other language.

---

## What it does

The N8N Translator is the entry point when the legacy "code" is not source code, but a visual N8N workflow exported as JSON. It walks the node graph, interprets each step semantically (not just by node type), and emits three SDD artifacts that describe the system independently of N8N.

After the spec is generated, the agent prepares `.reversa/state.json` and `.reversa/plan.md` so the regular Reversa pipeline (Scout, Archaeologist, Detective, Architect, Writer, Reviewer) can take over and refine the analysis if needed.

---

## What it analyzes

- **Workflow structure:** triggers, node graph, branches (`if`, `switch`), merges, loops (`splitInBatches`), sub-workflows
- **Each node:** purpose in the business context, inputs, outputs, transformations, external dependencies
- **Function/Code nodes:** reads embedded JS or Python and describes the logic in plain language
- **Credentials:** lists referenced credentials by type (`oAuth2Api`, `httpHeaderAuth`, etc.) without exposing values
- **External integrations:** APIs, databases, SaaS services, webhooks
- **Python equivalence:** for each node, suggests a Python library and implementation pattern (consult `references/node-catalog.md`)

---

## Input

The agent uses a dedicated input folder: `n8n_json_workflows/`. The folder is created automatically on first run. Drop your N8N workflow JSON exports there. If multiple files are present, the agent will ask which to process.

---

## What it produces

| File | Content |
|------|---------|
| `_reversa_n8n/<slug>/workflow-overview.md` | Source analysis: metadata, Mermaid flowchart, node table, credentials, ambiguities |
| `_reversa_n8n/<slug>/requirements.md` | SDD requirements: functional (`RF-NN`), non-functional (`RNF-NN`), acceptance criteria |
| `_reversa_n8n/<slug>/design.md` | Python implementation guide: architecture, components, libraries, folder structure, error handling, configuration, tests |
| `.reversa/state.json` | Initial state for the main Reversa pipeline (with `source: "n8n"` and `source_artifacts`) |
| `.reversa/plan.md` | Plan with a `Phase 0: N8N origin` section marking the translation step |

---

## When to use

Use it whenever you have an N8N workflow and want to:

- Document it as an SDD spec for review or audit
- Reimplement it in Python (or another language) without N8N as a runtime dependency
- Migrate to a custom architecture (FastAPI, worker, CLI) before applying the full Reversa pipeline

```
/reversa-n8n
```

After the agent finishes, run `/reversa` to continue with the Scout and the rest of the pipeline.
