import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

const PRIMECASH_URL = 'https://api.primecashbrasil.com/v1/transactions';

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
          title: 'Kit 10 Peças Moletom Infantil Menina Inverno Confeccionados em Algodão Macio',
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
      return NextResponse.json({ error: parseError(data) }, { status: response.status });
    }

    if (paymentMethod === 'pix') {
      const pixText = data?.pix?.qrcode;
      if (!pixText) {
        return NextResponse.json({ error: 'PIX não gerado. Tente novamente.' }, { status: 502 });
      }
      const qrcodeImage = await QRCode.toDataURL(pixText, { width: 256, margin: 2 });
      return NextResponse.json({ pix: { qrcodeImage, copyText: pixText } });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
