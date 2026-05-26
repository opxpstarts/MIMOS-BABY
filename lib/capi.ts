import crypto from 'crypto';

const PIXEL_ID = '1020308653670796';

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

function hashPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  const withCountry = digits.startsWith('55') ? digits : `55${digits}`;
  return crypto.createHash('sha256').update(withCountry).digest('hex');
}

export type CAPICustomer = {
  email?: string;
  phone?: string;
  name?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  clientIp?: string;
  userAgent?: string;
};

export async function sendPurchaseCAPI({
  eventId,
  value,
  contentId,
  customer,
  sourceUrl = 'https://mimusbaby.shop/checkout',
}: {
  eventId: string;
  value: number;
  contentId: string;
  customer: CAPICustomer;
  sourceUrl?: string;
}) {
  const token = process.env.FACEBOOK_CAPI_TOKEN;
  if (!token) {
    console.error('[CAPI] FACEBOOK_CAPI_TOKEN não configurado');
    return;
  }

  const [firstName, ...rest] = (customer.name || '').trim().split(' ');
  const lastName = rest.join(' ');

  const userData: Record<string, string> = {
    country: sha256('br'),
  };
  if (customer.email)   userData.em  = sha256(customer.email);
  if (customer.phone)   userData.ph  = hashPhone(customer.phone);
  if (firstName)        userData.fn  = sha256(firstName);
  if (lastName)         userData.ln  = sha256(lastName);
  if (customer.city)    userData.ct  = sha256(customer.city);
  if (customer.state)   userData.st  = sha256(customer.state.toLowerCase());
  if (customer.zipCode) userData.zp  = sha256(customer.zipCode.replace(/\D/g, ''));
  if (customer.clientIp)  userData.client_ip_address  = customer.clientIp;
  if (customer.userAgent) userData.client_user_agent  = customer.userAgent;

  const body = {
    data: [
      {
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: 'website',
        event_source_url: sourceUrl,
        user_data: userData,
        custom_data: {
          value,
          currency: 'BRL',
          content_ids: [contentId],
          content_type: 'product',
        },
      },
    ],
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('[CAPI] Erro:', JSON.stringify(err));
    } else {
      console.log(`[CAPI] Purchase enviado — eventId: ${eventId}, valor: R$${value}`);
    }
  } catch (e) {
    console.error('[CAPI] Falha de rede:', e);
  }
}
