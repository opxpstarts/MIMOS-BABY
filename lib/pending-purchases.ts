import fs from 'fs';
import path from 'path';
import type { CAPICustomer } from './capi';

export type PendingPurchase = {
  customer: CAPICustomer;
  value: number;
  contentId: string;
  sourceUrl: string;
};

// Arquivo em disco — sobrevive reinícios do PM2
const DATA_FILE = path.join(process.cwd(), 'data', 'pending-purchases.json');

function load(): Record<string, PendingPurchase> {
  try {
    if (!fs.existsSync(DATA_FILE)) return {};
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

function save(store: Record<string, PendingPurchase>) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (e) {
    console.error('[pendingPurchases] Erro ao salvar:', e);
  }
}

export const pendingPurchases = {
  set(id: string, data: PendingPurchase) {
    const store = load();
    store[id] = data;
    save(store);
  },
  get(id: string): PendingPurchase | undefined {
    return load()[id];
  },
  delete(id: string) {
    const store = load();
    delete store[id];
    save(store);
  },
};
