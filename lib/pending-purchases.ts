import type { CAPICustomer } from './capi';

export type PendingPurchase = {
  customer: CAPICustomer;
  value: number;
  contentId: string;
  sourceUrl: string;
};

// Store compartilhado entre payment/route.ts e payment/status/route.ts
// no mesmo processo Node.js (PM2 fork mode)
export const pendingPurchases = new Map<string, PendingPurchase>();
