import { NextRequest, NextResponse } from 'next/server';
import { sendPurchaseCAPI } from '@/lib/capi';
import { pendingPurchases } from '@/lib/pending-purchases';
import { sendPosVendaEvent } from '@/lib/pos-venda';

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
    console.log(`[status] BuyPix raw response para ${id}:`, JSON.stringify(json));

    if (!response.ok) {
      return NextResponse.json({ error: 'Erro ao consultar pagamento.' }, { status: response.status });
    }

    const depositData = json.data ?? json;
    const rawStatus: string = depositData.status ?? '';
    const isPaid = rawStatus === 'depix_sent';

    console.log(`[status] id=${id} rawStatus=${rawStatus} isPaid=${isPaid}`);

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
        if (pending.posVendaCustomer) {
          sendPosVendaEvent('order.paid', pending.posVendaCustomer, {
            id,
            status: 'paid',
            amount_cents: Math.round(pending.value * 100),
          }).catch(e => console.error('[PosVenda] Erro order.paid status:', e));
        }
      } else {
        console.log(`[status] CAPI já disparada ou sem dados para id=${id}`);
      }
    }

    return NextResponse.json({ status: isPaid ? 'paid' : rawStatus });
  } catch (e) {
    console.error('[status] Erro interno:', e);
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
  }
}
