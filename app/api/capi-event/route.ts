import { NextRequest, NextResponse } from 'next/server';
import { sendCAPIEvent } from '@/lib/capi';

// Recebe eventos do browser e os espelha na CAPI (server-side)
// Isso garante que fbc/fbp cheguem ao Meta mesmo com bloqueadores de anúncios
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      eventName,
      eventId,
      value,
      contentId,
      contentName,
      sourceUrl,
      fbc,
      fbp,
      email,
      phone,
      name,
      city,
      state,
      zipCode,
      externalId,
    } = body;

    if (!eventName || !eventId) {
      return NextResponse.json({ ok: false, error: 'eventName e eventId são obrigatórios' }, { status: 400 });
    }

    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      '';
    const userAgent = req.headers.get('user-agent') || '';

    // Não await — dispara em background para não atrasar a resposta ao browser
    sendCAPIEvent({
      eventName,
      eventId,
      value: value !== undefined ? Number(value) : undefined,
      contentId,
      contentName,
      customer: { email, phone, name, city, state, zipCode, fbc, fbp, externalId, clientIp, userAgent },
      sourceUrl: sourceUrl || 'https://mimusbaby.shop',
    }).catch(e => console.error('[capi-event] Erro:', e));

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[capi-event] Erro ao processar:', e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
