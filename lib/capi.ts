import crypto from 'crypto';

const PIXEL_ID = process.env.FACEBOOK_PIXEL_ID || '1020308653670796';
const GRAPH_API_VERSION = 'v21.0';

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
  fbc?: string;
  fbp?: string;
  externalId?: string;
};

export type CAPIEventParams = {
  eventName: string;
  eventId: string;
  value?: number;
  currency?: string;
  contentId?: string;
  contentName?: string;
  customer: CAPICustomer;
  sourceUrl?: string;
};

export async function sendCAPIEvent({
  eventName,
  eventId,
  value,
  currency = 'BRL',
  contentId,
  contentName,
  customer,
  sourceUrl = 'https://mimusbaby.shop',
}: CAPIEventParams) {
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

  if (customer.email)      userData.em          = sha256(customer.email);
  if (customer.phone)      userData.ph          = hashPhone(customer.phone);
  if (firstName)           userData.fn          = sha256(firstName);
  if (lastName)            userData.ln          = sha256(lastName);
  if (customer.city)       userData.ct          = sha256(customer.city.replace(/\s+/g, ''));
  if (customer.state)      userData.st          = sha256(customer.state.toLowerCase().substring(0, 2));
  if (customer.zipCode)    userData.zp          = sha256(customer.zipCode.replace(/\D/g, ''));
  if (customer.externalId) userData.external_id = sha256(customer.externalId);
  // fbc, fbp, IP e UA não são hasheados
  if (customer.fbc)        userData.fbc               = customer.fbc;
  if (customer.fbp)        userData.fbp               = customer.fbp;
  if (customer.clientIp)   userData.client_ip_address = customer.clientIp;
  if (customer.userAgent)  userData.client_user_agent  = customer.userAgent;

  const customData: Record<string, unknown> = {};
  if (value !== undefined) customData.value        = value;
  if (currency)            customData.currency     = currency;
  if (contentId)           customData.content_ids  = [contentId];
  if (contentName)         customData.content_name = contentName;
  if (contentId)           customData.content_type = 'product';

  const payload = {
    data: [
      {
        event_name:       eventName,
        event_time:       Math.floor(Date.now() / 1000),
        event_id:         eventId,
        action_source:    'website',
        event_source_url: sourceUrl,
        user_data:        userData,
        ...(Object.keys(customData).length > 0 && { custom_data: customData }),
      },
    ],
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${PIXEL_ID}/events?access_token=${token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error(`[CAPI] Erro ${eventName}:`, JSON.stringify(err));
    } else {
      console.log(`[CAPI] ${eventName} enviado — eventId: ${eventId}${value !== undefined ? `, valor: R$${value}` : ''}`);
    }
  } catch (e) {
    console.error(`[CAPI] Falha de rede ${eventName}:`, e);
  }
}

// Mantido para compatibilidade com código existente
export async function sendPurchaseCAPI({
  eventId,
  value,
  contentId,
  customer,
  sourceUrl,
}: {
  eventId: string;
  value: number;
  contentId: string;
  customer: CAPICustomer;
  sourceUrl?: string;
}) {
  return sendCAPIEvent({
    eventName: 'Purchase',
    eventId,
    value,
    contentId,
    customer,
    sourceUrl,
  });
}
