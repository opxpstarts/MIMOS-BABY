const WEBHOOK_URL = 'https://www.pos-venda.online/api/public/webhooks/d7f0d2fd-788d-4c3a-80db-e0c27cfca2b3';

export type PosVendaCustomer = {
  name?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  address?: {
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    country?: string;
  };
};

export type PosVendaTransaction = {
  id: string;
  status: string;
  amount_cents?: number;
  pix_qrcode?: string | null;
  pix_copia_cola?: string | null;
  pix_expires_at?: string | null;
  tracking_code?: string | null;
};

export async function sendPosVendaEvent(
  event: 'order.paid' | 'order.pix_generated',
  customer: PosVendaCustomer,
  transaction: PosVendaTransaction
): Promise<void> {
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, customer, transaction }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error(`[PosVenda] Erro ${res.status}:`, err);
    } else {
      console.log(`[PosVenda] ${event} enviado — id: ${transaction.id}`);
    }
  } catch (e) {
    console.error('[PosVenda] Falha de rede:', e);
  }
}
