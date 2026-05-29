import { NextRequest, NextResponse } from 'next/server';
import { sendPurchaseCAPI } from '@/lib/capi';
import { pendingPurchases } from '@/lib/pending-purchases';
import { sendPosVendaEvent } from '@/lib/pos-venda';

// Webhook recebido do BuyPix quando depósito é confirmado
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[Webhook BuyPix] Payload recebido:', JSON.stringify(body));

    // BuyPix envia o objeto do depósito — tenta múltiplos formatos
    const deposit = body.data ?? body.deposit ?? body;
    const id: string = String(deposit.id ?? body.id ?? '');
    const status: string = String(deposit.status ?? body.status ?? '');

    if (!id) {
      console.warn('[Webhook BuyPix] ID não encontrado no payload');
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    console.log(`[Webhook BuyPix] id=${id} status=${status}`);

    // depix_sent = PIX confirmado/pago
    if (status === 'depix_sent' || status === 'paid' || status === 'completed') {
      const pending = pendingPurchases.get(id);
      if (pending) {
        pendingPurchases.delete(id);
        await sendPurchaseCAPI({
          eventId: id,
          value: pending.value,
          contentId: pending.contentId,
          customer: pending.customer,
          sourceUrl: pending.sourceUrl,
        });
        if (pending.posVendaCustomer) {
          await sendPosVendaEvent('order.paid', pending.posVendaCustomer, {
            id,
            status: 'paid',
            amount_cents: Math.round(pending.value * 100),
          });
        }
        console.log(`[Webhook BuyPix] CAPI + PosVenda disparadas para depósito ${id}`);
      } else {
        console.warn(`[Webhook BuyPix] Nenhum pendingPurchase para id=${id} (já processado ou expirado)`);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[Webhook BuyPix] Erro:', e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
