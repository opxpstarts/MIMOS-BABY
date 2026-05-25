import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

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
      // erro intermitente do adquirente — tenta de novo
      if (attempt < MAX_RETRIES && errMsg.toLowerCase().includes('adquirente')) {
        await sleep(RETRY_DELAY_MS);
        continue;
      }
      return { ok: false, error: errMsg, data: null };
    }

    // PIX gerado mas sem QR code — tenta de novo
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
    const { paymentMethod, customer, card, installments, amount, items } = body;

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
          title: '2 Meia-Calça Forrada Térmica Translúcida · Lã Peluciada',
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

    if (paymentMethod === 'pix') {
      const pixText = data.pix.qrcode as string;
      const qrcodeImage = await QRCode.toDataURL(pixText, { width: 256, margin: 2 });
      return NextResponse.json({ pix: { qrcodeImage, copyText: pixText, transactionId: data.id } });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
