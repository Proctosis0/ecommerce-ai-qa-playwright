---
name: retest-y-cierre
description: Re-ejecuta los tests de una historia o de un bug por su tag de Jira y propone el cambio de estado. Usar para retest después de un fix o para validar una historia.
---

# Retest y cierre

Entrada: una clave (`SCRUM-6`) o un bug (`SCRUM-17`).

1. Ejecutar solo sus tests: `npx playwright test --grep "@<CLAVE>\b"`.
2. Interpretar el resultado:
   - Historia: todos pasan → proponer pasarla a "Finalizado".
     Si algún criterio falla por un bug abierto, queda "En curso".
   - Bug: si el test marcado con `test.fail()` ahora da "unexpectedly passed",
     el bug está corregido → quitar `test.fail()` y la anotación, y proponer cerrar el bug.
3. Mostrar al usuario el resultado y el cambio propuesto. Solo con su aprobación:
   transicionar en Jira y agregar un comentario con fecha, comando y resultado;
   si es un bug, cerrar también el GitHub Issue.
4. Actualizar el estado en `docs/traceability-matrix.md`.
