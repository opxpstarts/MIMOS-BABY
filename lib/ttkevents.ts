type ContentParams = {
  id: string;
  name: string;
  value: number;
};

type PurchaseParams = {
  id: string;
  value: number;
};

function fire(event: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && (window as any).ttq) {
    (window as any).ttq.track(event, params);
  }
}

export const ttkEvents = {
  viewContent: ({ id, name, value }: ContentParams) =>
    fire('ViewContent', { content_id: id, content_name: name, value, currency: 'BRL' }),

  addToCart: ({ id, name, value }: ContentParams) =>
    fire('AddToCart', { content_id: id, content_name: name, value, currency: 'BRL' }),

  initiateCheckout: ({ value }: { value: number }) =>
    fire('InitiateCheckout', { value, currency: 'BRL' }),

  addPaymentInfo: () =>
    fire('AddPaymentInfo'),

  purchase: ({ id, value }: PurchaseParams) =>
    fire('CompletePayment', { content_id: id, value, currency: 'BRL' }),
};
