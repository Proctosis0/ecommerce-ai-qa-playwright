---
name: reportar-bug
description: Documenta un defecto encontrado por un test: test.fail con anotación, bug en Jira vinculado a su historia, GitHub Issue y defect log. Usar cuando un test revela un comportamiento incorrecto de la aplicación.
---

# Reportar un bug

1. Confirmar que es un defecto de la aplicación y no del test: reproducirlo a mano
   (o con el usuario de control, ej. `standard_user`) y comparar.
2. Dejar el test validando el comportamiento CORRECTO y marcarlo:
   `test.fail(true, 'Bug conocido')` + `test.info().annotations.push({ type: 'bug', description })`.
3. Preparar el borrador del bug y MOSTRARLO al usuario antes de crearlo:
   - Título: `BUG-NN: <qué pasa>`; área; severidad (High/Medium/Low) y prioridad.
   - Pasos para reproducir, resultado esperado, resultado obtenido, evidencia
     (captura en `docs/bugs/` o request/response).
4. Con la aprobación del usuario:
   - Jira: crear el issue tipo *Error* (Bug), con prioridad, y vincularlo a la historia (*Relates*).
   - GitHub: crear el Issue con label `bug` y la severidad en el título.
5. Agregar el tag del bug al test: `{ tag: ['@bug', '@SCRUM-<n>'] }`.
6. Sumar la fila en el *Defect log* de `docs/traceability-matrix.md` (ID, Jira, GitHub,
   área, resumen, esperado, obtenido, severidad).
7. Ejecutar el test: debe figurar como "expected to fail".
