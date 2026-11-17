// Seed del agente generador de tests (Claude Code + Playwright Test MCP): punto de partida
// para generar tests nuevos. No es un caso de prueba, por eso la CI lo excluye (@seed).
import { test, expect } from './fixtures';

test.describe('Test group', { tag: '@seed' }, () => {
  test('seed', async ({ page }) => {
    // generate code here.
  });
});
