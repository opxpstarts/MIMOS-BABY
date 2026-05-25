export type DashboardProduct = {
  slug: string;
  product: {
    title: string;
    brand: string;
    price: number;
    compareAtPrice: number;
    discount: number;
    images: string[];
    description: string;
    descriptionImages?: string[];
    faq?: { question: string; answer: string }[];
    reviews?: { author: string; rating: number; title: string; body: string; date: string }[];
    sku: string;
    volume?: string | null | undefined;
    type?: string;
  };
};
