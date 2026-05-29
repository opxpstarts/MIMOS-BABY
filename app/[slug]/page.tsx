import { notFound } from 'next/navigation';
import type { DashboardProduct } from '@/lib/types';
import Template3 from '@/templates/template-3';

const getProduct = async (slug: string): Promise<DashboardProduct | null> => {
  return {
    slug,
    product: {
      title: "Kit 10 Peças Moletom Infantil Menina Inverno Confeccionados em Algodão Macio",
      brand: "Mimus Kids",
      price: 89.90,
      compareAtPrice: 159.90,
      discount: 44,
      images: [
        "/images/Foto01.webp",
        "/images/Foto02.webp",
        "/images/Foto03.webp",
        "/images/Foto04.webp",
        "/images/Foto05.webp",
        "/images/Foto06.webp",
        "/images/Foto07.webp",
        "/images/Foto08.webp",
        "/images/Foto09.webp",
      ],
      description: "<h2>Descrição do Produto</h2><p>Creme anticelulite com 5x mais Nicotinato de Metila. Fórmula exclusiva que age nas áreas com celulite, flacidez e lipedema.</p><ul><li>Resultados visíveis em 7 dias</li><li>Textura leve e rápida absorção</li><li>Vegano e Cruelty Free</li><li>Aprovado pela Anvisa</li></ul>",
      descriptionImages: ["/images/Foto.Descriçao.jpeg"],
      faq: [
        {
          question: "A loja é confiável?",
          answer: "Sim! Somos 100% seguros com milhares de clientes satisfeitos. Pagamento protegido e garantia de devolução do dinheiro.",
        },
        {
          question: "Qual o prazo de entrega?",
          answer: "Enviamos em até 24h e entregamos em 2 a 4 dias úteis. Você recebe o código de rastreamento por e-mail.",
        },
        {
          question: "Posso trocar se não servir?",
          answer: "Sim! Você tem 30 dias para trocar. A troca é GRÁTIS e nossa equipe cuida de tudo.",
        },
        {
          question: "Quais formas de pagamento?",
          answer: "PIX (com desconto), cartão em até 6x sem juros. Pagamento 100% seguro.",
        },
      ],
      reviews: [
        {
          author: "Carla Mendes",
          rating: 5,
          title: "Produto incrível!",
          body: "Estou usando há 2 semanas e já vejo diferença na celulite. Recomendo muito!",
          date: "15/01/2024",
        },
        {
          author: "Patricia Lima",
          rating: 5,
          title: "Melhor creme que já usei",
          body: "Textura ótima, absorve rápido e realmente funciona. Vale cada centavo!",
          date: "10/01/2024",
        },
      ],
      sku: "BOOM-001",
      type: "moletom",
    },
  };
};

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);

  if (!product) notFound();

  return <Template3 product={product} logoUrl="/images/logo.png" />;
}
