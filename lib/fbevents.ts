// Lê um cookie do browser por nome
function getCookie(name: string): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : '';
}

// Gera UUID único por evento — usado para deduplicação CAPI ↔ Pixel
function generateEventId(): string {
  if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

// Dispara o pixel do Facebook no browser
function fire(event: string, params?: Record<string, unknown>, options?: Record<string, string>) {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', event, params, options);
  }
}

// Espelha o evento no servidor via CAPI — inclui fbc/fbp/IP/UA automaticamente
async function mirrorCAPI(
  eventName: string,
  eventId: string,
  extra?: {
    value?: number;
    contentId?: string;
    contentName?: string;
    email?: string;
    phone?: string;
    name?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    externalId?: string;
  }
) {
  const fbc = getCookie('_fbc');
  const fbp = getCookie('_fbp');
  const sourceUrl = typeof window !== 'undefined' ? window.location.href : undefined;

  try {
    await fetch('/api/capi-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName,
        eventId,
        sourceUrl,
        fbc: fbc || undefined,
        fbp: fbp || undefined,
        ...extra,
      }),
    });
  } catch {
    // Falha silenciosa — pixel browser continua funcionando
  }
}

// ─── Tipos ────────────────────────────────────────────────────────────────────

type ContentParams = {
  id: string;
  name: string;
  value: number;
};

type PurchaseParams = {
  id: string;
  value: number;
  eventId?: string; // se fornecido, usa para deduplicação com CAPI servidor
};

// ─── Eventos ──────────────────────────────────────────────────────────────────

export const fbEvents = {
  viewContent({ id, name, value }: ContentParams) {
    const eventId = generateEventId();
    fire('ViewContent', { content_ids: [id], content_name: name, value, currency: 'BRL' }, { eventID: eventId });
    mirrorCAPI('ViewContent', eventId, { value, contentId: id, contentName: name });
  },

  addToCart({ id, name, value }: ContentParams) {
    const eventId = generateEventId();
    fire('AddToCart', { content_ids: [id], content_name: name, value, currency: 'BRL' }, { eventID: eventId });
    mirrorCAPI('AddToCart', eventId, { value, contentId: id, contentName: name });
  },

  initiateCheckout({ value }: { value: number }) {
    const eventId = generateEventId();
    fire('InitiateCheckout', { value, currency: 'BRL' }, { eventID: eventId });
    mirrorCAPI('InitiateCheckout', eventId, { value });
  },

  addPaymentInfo() {
    const eventId = generateEventId();
    fire('AddPaymentInfo', {}, { eventID: eventId });
    mirrorCAPI('AddPaymentInfo', eventId);
  },

  // Purchase: servidor já dispara CAPI (payment route + webhook)
  // Pixel browser usa o mesmo eventId do servidor para deduplicação
  purchase({ id, value, eventId }: PurchaseParams) {
    const eid = eventId || generateEventId();
    fire(
      'Purchase',
      { content_ids: [id], value, currency: 'BRL' },
      { eventID: eid },
    );
  },
};
