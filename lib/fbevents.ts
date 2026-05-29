type ContentParams = {
  id: string;
  name: string;
  value: number;
};

type PurchaseParams = {
  id: string;
  value: number;
  eventId?: string; // para deduplicação com a CAPI
};

function fire(event: string, params?: Record<string, unknown>, options?: Record<string, string>) {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', event, params, options);
  }
}

export const fbEvents = {
  viewContent: ({ id, name, value }: ContentParams) =>
    fire('ViewContent', { content_ids: [id], content_name: name, value, currency: 'BRL' }),

  addToCart: ({ id, name, value }: ContentParams) =>
    fire('AddToCart', { content_ids: [id], content_name: name, value, currency: 'BRL' }),

  initiateCheckout: ({ value }: { value: number }) =>
    fire('InitiateCheckout', { value, currency: 'BRL' }),

  addPaymentInfo: () =>
    fire('AddPaymentInfo'),

  purchase: ({ id, value, eventId }: PurchaseParams) =>
    fire(
      'Purchase',
      { content_ids: [id], value, currency: 'BRL' },
      eventId ? { eventID: eventId } : undefined,
    ),
};
