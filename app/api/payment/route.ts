import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { sendPurchaseCAPI } from '@/lib/capi';
import { pendingPurchases } from '@/lib/pending-purchases';

const BUYPIX_URL = 'https://buypix.me/api/v1';
const PRIMECASH_URL = 'https://api.primecashbrasil.com/v1/transactions';
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1200;

// ── PrimeCash (cartão de crédito) ─────────────────────────────────────────────

function getPrimeCashAuthHeader() {
  const key = process.env.PRIMECASH_SECRET_KEY ?? '';
  return 'Basic ' + Buffer.from(`${key}:x`).toString('base64');
}

function parseError(data: unknown): string {
  if (!data || typeof data !== 'object') return 'Erro ao processar pagamento.';
  const d = data as Record<string, unknown>;
  if (typeof d.message === 'string') return d.message;
  if (Array.isArray(d.error)) return d.error[0] as string;
  if (typeof d.error === 'string') return d.error;
  return 'Erro ao processar pagamento.';
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function createCardTransaction(payload: Record<string, unknown>) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const response = await fetch(PRIMECASH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getPrimeCashAuthHeader(),
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      const errMsg = parseError(data);
      if (attempt < MAX_RETRIES && errMsg.toLowerCase().includes('adquirente')) {
        await sleep(RETRY_DELAY_MS);
        continue;
      }
      return { ok: false, error: errMsg, data: null };
    }

    return { ok: true, error: null, data };
  }
  return { ok: false, error: 'Não foi possível processar. Tente novamente.', data: null };
}

// ── BuyPix (PIX) ──────────────────────────────────────────────────────────────

async function createPixDeposit(amountBRL: number, clientIp: string, idempotencyKey: string) {
  const body: Record<string, unknown> = { amount: amountBRL };
  if (clientIp) body.payer_ip = clientIp;

  const response = await fetch(`${BUYPIX_URL}/deposits`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.BUYPIX_API_KEY}`,
      'Content-Type': 'application/json',
      'X-Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    return { ok: false, error: data.message || 'Erro ao gerar PIX.', data: null };
  }

  return { ok: true, error: null, data: data.data };
}

// ── Handler principal ─────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { paymentMethod, customer, card, installments, amount, sku } = body;

    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      '';
    const userAgent  = req.headers.get('user-agent') || '';
    const sourceUrl  = req.headers.get('referer') || 'https://mimusbaby.shop/checkout';
    const contentId  = sku || 'kit-mimas-kids';
    const valueInBRL = amount / 100;

    const capiCustomer = {
      email:   customer.email,
      phone:   customer.phone,
      name:    customer.name,
      city:    customer.city,
      state:   customer.state,
      zipCode: customer.zipCode,
      clientIp,
      userAgent,
    };

    // ── PIX via BuyPix ──────────────────────────────────────────────────────
    if (paymentMethod === 'pix') {
      const idempotencyKey = randomUUID();
      const { ok, error, data } = await createPixDeposit(valueInBRL, clientIp, idempotencyKey);

      if (!ok || !data) {
        return NextResponse.json({ error }, { status: 502 });
      }

      const transactionId = String(data.id);

      // Guarda dados para CAPI quando PIX for confirmado
      pendingPurchases.set(transactionId, {
        customer: capiCustomer,
        value: valueInBRL,
        contentId,
        sourceUrl,
      });

      return NextResponse.json({
        pix: {
          qrcodeImage: data.pix_qr_code_base64, // já é data URL base64
          copyText:    data.pix_qr_code,
          transactionId,
        },
      });
    }

    // ── Cartão via PrimeCash ────────────────────────────────────────────────
    const installmentsNum = parseInt(String(installments).replace('x', '')) || 1;

    const payload: Record<string, unknown> = {
      amount,
      paymentMethod: 'credit_card',
      customer: {
        name:     customer.name,
        email:    customer.email,
        phone:    customer.phone.replace(/\D/g, ''),
        document: { type: 'cpf', number: customer.cpf.replace(/\D/g, '') },
        address: {
          street:       customer.street,
          streetNumber: customer.streetNumber,
          complement:   customer.complement || '',
          zipCode:      customer.zipCode.replace(/\D/g, ''),
          neighborhood: customer.neighborhood,
          city:         customer.city,
          state:        customer.state,
          country:      'BR',
        },
      },
      installments: installmentsNum,
      card: {
        number:         card.number.replace(/\s/g, ''),
        holderName:     card.holderName,
        expirationDate: card.expirationDate,
        cvv:            card.cvv,
      },
      items: [
        {
          title:     'Kit Moletom Infantil Menina Inverno',
          quantity:  1,
          unitPrice: amount,
          tangible:  true,
        },
      ],
    };

    const { ok, error, data } = await createCardTransaction(payload);

    if (!ok || !data) {
      return NextResponse.json({ error }, { status: 502 });
    }

    // CAPI para cartão — dispara imediatamente no servidor
    sendPurchaseCAPI({
      eventId:   String(data.id),
      value:     valueInBRL,
      contentId,
      customer:  capiCustomer,
      sourceUrl,
    }).catch(e => console.error('[CAPI] Erro cartão:', e));

    return NextResponse.json({ ...data, transactionId: data.id });
  } catch (e) {
    console.error('[payment] Erro interno:', e);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
