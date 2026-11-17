// Severidad del test para Allure Report (se muestra en el dashboard y permite filtrar).
// Criterio: impacto de negocio si la funcionalidad falla en produccion.
//   blocker  -> sin esto no se puede usar la aplicacion (login)
//   critical -> flujo de compra, autenticacion de la API, permisos, bugs de severidad alta
//   normal   -> validaciones y operaciones secundarias, bugs de severidad media
//   minor    -> bugs de severidad baja
export type Severity = 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial';

export const severity = (level: Severity) => ({ type: '@allure.label.severity', description: level });
