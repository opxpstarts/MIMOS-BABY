type ViewContentParams = {
  id: string;
  name: string;
  value: number;
};

export const ttkEvents = {
  viewContent: ({ id, name, value }: ViewContentParams) => {
    if (typeof window !== 'undefined' && (window as any).ttq) {
      (window as any).ttq.track('ViewContent', {
        content_id: id,
        content_name: name,
        value: value,
        currency: 'BRL',
      });
    }
  },
};
