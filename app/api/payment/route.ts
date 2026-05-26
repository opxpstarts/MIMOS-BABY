import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { sendPurchaseCAPI } from '@/lib/capi';
import { pendingPurchases } from '@/lib/pending-purchases';

const PRIMECASH_URL = 'https://api.primecashbrasil.com/v1/transactions';
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1200;

function getAuthHeader() {
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

async function createTransaction(payload: Record<string, unknown>) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const response = await fetch(PRIMECASH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getAuthHeader(),
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

    if (payload.paymentMethod === 'pix' && !data?.pix?.qrcode) {
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS);
        continue;
      }
      return { ok: false, error: 'PIX não gerado. Tente novamente.', data: null };
    }

    return { ok: true, error: null, data };
  }
  return { ok: false, error: 'Não foi possível gerar o PIX. Tente novamente.', data: null };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { paymentMethod, customer, card, installments, amount, items, sku } = body;

    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      '';
    const userAgent = req.headers.get('user-agent') || '';
    const sourceUrl = req.headers.get('referer') || 'https://mimusbaby.shop/checkout';
    const contentId = sku || 'kit-mimas-kids';
    const valueInBRL = amount / 100;

    const payload: Record<string, unknown> = {
      amount,
      paymentMethod,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone.replace(/\D/g, ''),
        document: {
          type: 'cpf',
          number: customer.cpf.replace(/\D/g, ''),
        },
        address: {
          street: customer.street,
          streetNumber: customer.streetNumber,
          complement: customer.complement || '',
          zipCode: customer.zipCode.replace(/\D/g, ''),
          neighborhood: customer.neighborhood,
          city: customer.city,
          state: customer.state,
          country: 'BR',
        },
      },
      items: items ?? [
        {
          title: 'Kit Moletom Infantil Menina Inverno',
          quantity: 1,
          unitPrice: amount,
          tangible: true,
        },
      ],
    };

    if (paymentMethod === 'credit_card') {
      payload.installments = installments;
      payload.card = {
        number: card.number.replace(/\s/g, ''),
        holderName: card.holderName,
        expirationDate: card.expirationDate,
        cvv: card.cvv,
      };
    }

    const { ok, error, data } = await createTransaction(payload);

    if (!ok || !data) {
      return NextResponse.json({ error }, { status: 502 });
    }

    const capiCustomer = {
      email: customer.email,
      phone: customer.phone,
      name: customer.name,
      city: customer.city,
      state: customer.state,
      zipCode: customer.zipCode,
      clientIp,
      userAgent,
    };

    if (paymentMethod === 'pix') {
      const transactionId = String(data.id);
      const pixText = data.pix.qrcode as string;
      const qrcodeImage = await QRCode.toDataURL(pixText, { width: 256, margin: 2 });

      // Salva dados do cliente para disparar CAPI quando PIX for pago
      pendingPurchases.set(transactionId, {
        customer: capiCustomer,
        value: valueInBRL * 0.95, // desconto PIX de 5%
        contentId,
        sourceUrl,
      });

      return NextResponse.json({
        pix: { qrcodeImage, copyText: pixText, transactionId: data.id },
      });
    }

    // Cartão aprovado — dispara CAPI imediatamente no servidor
    sendPurchaseCAPI({
      eventId: String(data.id),
      value: valueInBRL,
      contentId,
      customer: capiCustomer,
      sourceUrl,
    }).catch(e => console.error('[CAPI] Erro cartão:', e));

    return NextResponse.json({ ...data, transactionId: data.id });
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
