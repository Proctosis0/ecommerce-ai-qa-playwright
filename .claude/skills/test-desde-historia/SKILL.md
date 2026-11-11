---
name: test-desde-historia
description: Genera un test Playwright a partir de una historia de Jira (SCRUM-n), lo ejecuta y, si pasa, cierra la historia con un comentario. Usar cuando se pida automatizar una historia.
---

# Historia de Jira → test Playwright

Entrada: la clave de la historia (ej. `SCRUM-12`).

1. Traer la historia con el MCP de Jira (título, descripción y criterios de aceptación).
2. Generar el test con el MCP de Playwright, no a mano: agente `playwright-test-generator`
   con `tests/seed.spec.ts` como seed, recorriendo los pasos en el navegador real.
   Al terminar, cerrar el navegador del MCP (`browser_close`).
3. Adaptar el test a las convenciones de `.claude/CLAUDE.md` (Page Objects, fixtures,
   datos en `data/test-data.ts`, tag `@<CLAVE>`, un `test.step()` por paso).
4. Ejecutar `npx playwright test --grep "@<CLAVE>\b"` y después `npx tsc --noEmit && npm test`.
5. Si falla: corregir y reintentar. Si no se logra, NO tocar Jira y explicar el problema.
6. Si pasa (los dos pasos son obligatorios):
   - Pasar la historia a "Finalizado" (`get_transitions` → `transition_issue`).
   - `add_comment` con: ruta del test, resultado (PASSED, chromium), fecha y
     "generado con playwright-test-generator y adaptado a Page Objects y fixtures".
7. Agregar el caso a `docs/traceability-matrix.md`.
8. Resumir: archivos creados o modificados, resultado, estado de la historia y comentario.
