import { test, expect, chromium } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import path from 'node:path';

// Criando equivalentes do __dirname para módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dist = path.resolve(__dirname, '..', 'dist');

async function setupPersistentContext(func: (popup: any) => Promise<void>) {
  // Wrapper para criar um contexto persistente com a extensão carregada.
  const context = await chromium.launchPersistentContext('', {
    channel: 'chromium',
    args: [
      `--disable-extensions-except=${dist}`,
      `--load-extension=${dist}`
    ]
  });
  
  let [serviceWorker] = context.serviceWorkers();
  if (!serviceWorker)
    serviceWorker = await context.waitForEvent('serviceworker');
  const extensionId = serviceWorker.url().split('/')[2];

  try {
    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/src/popup/popup.html`);
    await popup.waitForLoadState('domcontentloaded');

    await func(popup);
  } finally {
    await context.close();
  }
}

test('popup carrega corretamente', async () => {
  await setupPersistentContext(async (popup) => {
    expect(popup).toBeDefined();
  });
});

test('exibe UI corretamente', async () => {
  await setupPersistentContext(async (popup) => {
    // Verifica elementos principais da UI
    await expect(popup.locator('.timer-display')).toBeVisible();
    await expect(popup.locator('#display-min')).toHaveText('15');
    await expect(popup.locator('#display-sec')).toHaveText('00');
    
    // Verifica botões de tempo
    await expect(popup.locator('#timer-1')).toHaveText('15 min');
    await expect(popup.locator('#timer-2')).toHaveText('30 min');
    await expect(popup.locator('#timer-3')).toHaveText('45 min');
    await expect(popup.locator('#timer-4')).toHaveText('1 hr');

    // Verifica botões de controle
    await expect(popup.locator('#start')).toHaveText('Iniciar');
    await expect(popup.locator('#reset')).toHaveText('Zerar');
  });
});

test('botões de tempo alteram o temporizador', async () => {
  await setupPersistentContext(async (popup) => {
    // Testa botão de 30 minutos
    await popup.click('#timer-2');
    await expect(popup.locator('#display-min')).toHaveText('30');
    await expect(popup.locator('#display-sec')).toHaveText('00');

    // Testa botão de 45 minutos
    await popup.click('#timer-3');
    await expect(popup.locator('#display-min')).toHaveText('45');
    await expect(popup.locator('#display-sec')).toHaveText('00');

    // Testa botão de 1 hora
    await popup.click('#timer-4');
    await expect(popup.locator('#display-min')).toHaveText('60');
    await expect(popup.locator('#display-sec')).toHaveText('00');

    // Volta para 15 minutos
    await popup.click('#timer-1');
    await expect(popup.locator('#display-min')).toHaveText('15');
    await expect(popup.locator('#display-sec')).toHaveText('00');
  });
});

test('botão reset zera o temporizador', async () => {
  await setupPersistentContext(async (popup) => {
    // Configura para 30 minutos
    await popup.click('#timer-2');
    await expect(popup.locator('#display-min')).toHaveText('30');

    // Inicia o timer
    await popup.click('#start');
    
    // Aguarda 2 segundos para garantir que o timer iniciou
    await popup.waitForTimeout(2000);

    // Reseta o timer
    await popup.click('#reset');

    // Verifica se voltou para 30:00
    await expect(popup.locator('#display-min')).toHaveText('30');
    await expect(popup.locator('#display-sec')).toHaveText('00');
  });
});

test('timer decrementa corretamente', async () => {
  await setupPersistentContext(async (popup) => {
    // Configura para 15 minutos
    await popup.click('#timer-1');
    
    // Inicia o timer
    await popup.click('#start');

    // Aguarda 3 segundos
    await popup.waitForTimeout(3000);

    // Verifica se decrementou os segundos
    const seconds = await popup.locator('#display-sec').textContent();
    const secondsNum = parseInt(seconds);
    expect(secondsNum).toBeLessThan(59);
  });
});

