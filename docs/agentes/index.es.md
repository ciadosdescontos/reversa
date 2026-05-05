# Agentes

Reversa coordina un equipo de 14 especialistas. Cada agente hace una cosa y la hace bien.

---

## Agentes obligatorios

| Agente | Fase | Analogía | Función |
|--------|------|----------|---------|
| [Reversa](reversa.md) | Orquestación | El director de orquesta | Coordina todos los agentes, guarda checkpoints, guía al usuario |
| [Scout](scout.md) | Reconocimiento | El agente inmobiliario | Mapea la superficie: carpetas, lenguajes, frameworks, dependencias |
| [Archaeologist](arqueologo.md) | Excavación | El excavador | Análisis profundo módulo a módulo: algoritmos, flujos, estructuras de datos |
| [Detective](detetive.md) | Interpretación | Sherlock Holmes | Extrae reglas de negocio implícitas, ADRs, máquinas de estado, permisos |
| [Architect](arquiteto.md) | Interpretación | El cartógrafo | Sintetiza todo en diagramas C4, ERD y mapa de integraciones |
| [Writer](redator.md) | Generación | El notario | Genera specs SDD, OpenAPI y user stories con trazabilidad de código |

---

## Agentes opcionales

| Agente | Analogía | Cuándo usar |
|--------|----------|-------------|
| [Reviewer](revisor.md) | El revisor de specs | Después del Writer: revisa specs críticamente y valida brechas |
| [Visor](visor.md) | El ilustrador forense | Cuando tengas screenshots del sistema disponibles |
| [Data Master](data-master.md) | El geólogo | Cuando haya DDL, migrations o modelos ORM disponibles |
| [Design System](design-system.md) | El estilista | Cuando haya archivos CSS, temas o screenshots de interfaz |

---

## Traductores (adaptadores de entrada)

Use cuando el "código" heredado no sea código fuente, sino un artefacto estructurado como un workflow visual. Generan una spec SDD y preparan el estado para que el pipeline principal continúe.

| Agente | Analogía | Cuándo usar |
|--------|----------|-------------|
| [N8N Translator](n8n.md) | El traductor jurado | Cuando tengas un workflow N8N exportado en JSON y quieras documentarlo como spec o portar a Python |

---

## Secuencia recomendada

```
/reversa → orquesta todo automáticamente

O manualmente:
Scout → Archaeologist (N sesiones) → Detective → Architect → Writer → Reviewer

Opcionales en cualquier fase:
Visor · Data Master · Design System
```
