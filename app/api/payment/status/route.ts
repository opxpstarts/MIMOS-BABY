import { NextRequest, NextResponse } from 'next/server';
import { sendPurchaseCAPI } from '@/lib/capi';
import { pendingPurchases } from '@/lib/pending-purchases';

const PRIMECASH_URL = 'https://api.primecashbrasil.com/v1/transactions';

function getAuthHeader() {
  const key = process.env.PRIMECASH_SECRET_KEY ?? '';
  return 'Basic ' + Buffer.from(`${key}:x`).toString('base64');
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });

  try {
    const response = await fetch(`${PRIMECASH_URL}/${id}`, {
      headers: { Authorization: getAuthHeader() },
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: 'Erro ao consultar pagamento.' }, { status: response.status });
    }

    // PIX confirmado como pago — dispara CAPI uma única vez
    if (data.status === 'paid') {
      const pending = pendingPurchases.get(id);
      if (pending) {
        pendingPurchases.delete(id); // remove antes de disparar para evitar disparo duplo
        sendPurchaseCAPI({
          eventId: id,
          value: pending.value,
          contentId: pending.contentId,
          customer: pending.customer,
          sourceUrl: pending.sourceUrl,
        }).catch(e => console.error('[CAPI] Erro PIX pago:', e));
      }
    }

    return NextResponse.json({ status: data.status });
  } catch {
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
  }
}
