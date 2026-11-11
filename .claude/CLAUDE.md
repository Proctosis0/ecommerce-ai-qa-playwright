# Contexto fijo del proyecto (steering)

Portafolio de QA Automation: Playwright + TypeScript sobre SauceDemo (UI) y Restful-Booker (API),
con trazabilidad a Jira (proyecto SCRUM) y CI en GitHub Actions.

## Convenciones de código
- Page Object Model: locators y acciones en `tests/pages/`; los specs no definen selectores.
- `test` y `expect` se importan desde `tests/fixtures.ts`, que inyecta los Page Objects.
- Datos (usuarios, productos, rutas, casos) en `data/test-data.ts`; nada fijo en los specs.
- Selectores: `getByTestId` (atributo `data-test`) y `getByRole` donde no haya `data-test`.
- Un `test.step()` por paso de la historia y un mensaje descriptivo en cada `expect`.
- API: cliente en `tests/api/booking/bookingApi.ts`, contratos con Zod (`.strict()`),
  y cada test limpia los datos que crea.

## Nomenclatura y trazabilidad
- Archivo: `tests/<area>/<CLAVE>-<nombre-corto>.spec.ts` (ej. `SCRUM-6-checkout-validaciones.spec.ts`).
- Cada test lleva el tag de su historia: `{ tag: '@SCRUM-6' }`.
- Bugs conocidos: `test.fail()` + anotación `bug` + tags `['@bug', '@SCRUM-<n del bug>']`.
  El test valida el comportamiento CORRECTO; si el bug se arregla, pasa a "unexpectedly passed".
- Cada test nuevo se agrega a `docs/traceability-matrix.md`.

## Validación antes de dar algo por terminado
`npx tsc --noEmit && npm test` en verde (los bugs conocidos cuentan como "expected to fail").

## Reglas con sistemas externos (control humano)
- No escribir en Jira ni en GitHub (comentarios, transiciones, issues) sin aprobación explícita,
  salvo los pasos que una skill indica y que el usuario pidió al invocarla.
- Si un test no pasa, NO mover la historia ni comentar: explicar el problema.
- No hacer commit ni push: los revisa y sube el usuario.
- No leer, mostrar ni versionar `.env` ni `.mcp.json` (tienen credenciales).
