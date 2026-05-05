# N8N Translator

**Comando:** `/reversa-n8n`
**Fase:** Traducción (adaptador de entrada)

---

## 🔁 El traductor jurado

El traductor jurado toma un documento oficial en un idioma y produce otra versión en idioma diferente, conservando cada cláusula, plazo y efecto legal. El N8N Translator hace lo mismo: lee un workflow exportado como JSON y produce una spec SDD que captura el mismo comportamiento de negocio, lista para ser reimplementada en Python o en cualquier otro lenguaje.

---

## Qué hace

El N8N Translator es el punto de entrada cuando el "código" heredado no es código fuente, sino un workflow visual de N8N exportado como JSON. Recorre el grafo de nodos, interpreta cada paso semánticamente (no solo por el tipo del nodo) y emite tres artefactos SDD que describen el sistema de forma independiente de N8N.

Tras generar la spec, el agente prepara `.reversa/state.json` y `.reversa/plan.md` para que el pipeline estándar de Reversa (Scout, Archaeologist, Detective, Architect, Writer, Reviewer) pueda continuar y refinar el análisis, si es necesario.

---

## Qué analiza

- **Estructura del workflow:** triggers, grafo de nodos, ramificaciones (`if`, `switch`), uniones, bucles (`splitInBatches`), sub-workflows
- **Cada nodo:** propósito en el contexto de negocio, entradas, salidas, transformaciones, dependencias externas
- **Nodos Function/Code:** lee el JS o Python embebido y describe la lógica en lenguaje natural
- **Credenciales:** lista credenciales referenciadas por tipo (`oAuth2Api`, `httpHeaderAuth`, etc.) sin exponer valores
- **Integraciones externas:** APIs, bases de datos, servicios SaaS, webhooks
- **Equivalencia en Python:** para cada nodo, sugiere una librería Python y patrón de implementación (consulte `references/node-catalog.md`)

---

## Entrada

El agente usa una carpeta dedicada: `n8n_json_workflows/`. La carpeta se crea automáticamente en la primera ejecución. Coloque los JSONs exportados de N8N allí. Si hay varios archivos, el agente pregunta cuál procesar.

---

## Qué produce

| Archivo | Contenido |
|---------|-----------|
| `_reversa_n8n/<slug>/workflow-overview.md` | Análisis de la fuente: metadatos, diagrama Mermaid, tabla de nodos, credenciales, ambigüedades |
| `_reversa_n8n/<slug>/requirements.md` | Requisitos SDD: funcionales (`RF-NN`), no funcionales (`RNF-NN`), criterios de aceptación |
| `_reversa_n8n/<slug>/design.md` | Guía de implementación Python: arquitectura, componentes, librerías, estructura de carpetas, manejo de errores, configuración, pruebas |
| `.reversa/state.json` | Estado inicial del pipeline principal (con `source: "n8n"` y `source_artifacts`) |
| `.reversa/plan.md` | Plan con sección `Fase 0: Origen N8N` marcando la etapa de traducción |

---

## Cuándo usar

Úselo siempre que tenga un workflow N8N y quiera:

- Documentarlo como spec SDD para revisión o auditoría
- Reimplementarlo en Python (u otro lenguaje) sin tener N8N como dependencia de runtime
- Migrar a arquitectura propia (FastAPI, worker, CLI) antes de aplicar el pipeline completo de Reversa

```
/reversa-n8n
```

Cuando el agente termine, ejecute `/reversa` para continuar con el Scout y el resto del pipeline.
