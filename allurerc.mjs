// Configuracion de Allure Report 3 (Node, sin Java).
// El historial (history.jsonl) se descarga del reporte publicado en GitHub Pages
// antes de generar, para mostrar la tendencia entre ejecuciones de la CI.
import { defineConfig } from "allure";

export default defineConfig({
  name: "E-commerce AI QA - Playwright",
  output: "./allure-report",
  historyPath: "./history.jsonl",
  historyLimit: 30,
  plugins: {
    awesome: {
      options: {
        reportName: "E-commerce AI QA - Playwright",
        reportLanguage: "es",
        groupBy: ["suite", "subSuite"],
      },
    },
    dashboard: {
      options: {
        reportName: "E-commerce AI QA - Dashboard",
        reportLanguage: "es",
      },
    },
  },
});
