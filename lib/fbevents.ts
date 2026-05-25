type ViewContentParams = {
  id: string;
  name: string;
  value: number;
};

export const fbEvents = {
  viewContent: ({ id, name, value }: ViewContentParams) => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'ViewContent', {
        content_ids: [id],
        content_name: name,
        value: value,
        currency: 'BRL',
      });
    }
  },
};
