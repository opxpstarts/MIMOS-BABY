import { NextRequest, NextResponse } from 'next/server';
import { sendPurchaseCAPI } from '@/lib/capi';
import { pendingPurchases } from '@/lib/pending-purchases';

const BUYPIX_URL = 'https://buypix.me/api/v1';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });

  try {
    const response = await fetch(`${BUYPIX_URL}/deposits/${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.BUYPIX_API_KEY}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const json = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: 'Erro ao consultar pagamento.' }, { status: response.status });
    }

    const depositData = json.data ?? json;
    const rawStatus: string = depositData.status ?? '';

    // depix_sent = PIX confirmado/pago
    const isPaid = rawStatus === 'depix_sent';

    if (isPaid) {
      const pending = pendingPurchases.get(id);
      if (pending) {
        pendingPurchases.delete(id);
        sendPurchaseCAPI({
          eventId: id,
          value: pending.value,
          contentId: pending.contentId,
          customer: pending.customer,
          sourceUrl: pending.sourceUrl,
        }).catch(e => console.error('[CAPI] Erro PIX pago:', e));
      }
    }

    return NextResponse.json({ status: isPaid ? 'paid' : rawStatus });
  } catch {
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
  }
}
