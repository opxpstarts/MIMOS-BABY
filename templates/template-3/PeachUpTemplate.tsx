'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { DashboardProduct } from '@/lib/types';
import { fbEvents } from '@/lib/fbevents';
import { ttkEvents } from '@/lib/ttkevents';
import MobileHeader from './MobileHeader';

type Props = {
  product: DashboardProduct;
  logoUrl: string;
};

export default function PeachUpTemplate({ product, logoUrl }: Props) {
  const dp = product.product;
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [sizeSheetOpen, setSizeSheetOpen] = useState(false);
  const [reviewsToShow, setReviewsToShow] = useState(5);
  const [addedToCart, setAddedToCart] = useState(false);
  const profilePhotos = [
    '/images/foto.perfil.avaliacao1.jpg',
    '/images/foto.perfil.avaliacao2.jpeg',
    '/images/foto.perfil.avaliacao3.jpeg',
    '/images/foto.perfil.avaliacao4.jpeg',
    '/images/foto.perfil.avaliacao5.jpeg',
    '/images/foto.perfil.avaliacao6.jpeg',
    '/images/foto.perfil.avaliacao7.jpeg',
    '/images/foto.perfil.avaliacao8.jpeg',
    '/images/foto.perfil.avaliacao9.jpeg',
    '/images/foto.perfil.avaliacao10.jpeg',
    '/images/foto.perfil.avaliacao11.jpeg',
    '/images/foto.perfil.avaliacao12.jpeg',
    '/images/foto.perfil.avaliacao13.jpeg',
    '/images/foto.perfil.avaliacao14.avif',
    '/images/Fotos.avaliacoess1.jpeg',
    '/images/Fotos.avaliacoess2.jpeg',
    '/images/Fotos.avaliacoess3.jpeg',
    '/images/Fotos.avaliacoess4.jpeg',
    '/images/Fotos.avaliacoess5.jpeg',
    '/images/Fotos.avaliacoess6.jpeg',
    '/images/Fotos.avaliacoess7.jpeg',
    '/images/Fotos.avaliacoess8.jpeg',
    '/images/Fotos.avaliacoess9.jpeg',
    '/images/Fotos.avaliacoess10.jpeg',
    '/images/images.jpeg',
  ];

  // Avaliações dos clientes
  const customerReviews = [
    {
      name: "Carla Souza",
      date: "04/05/2026",
      rating: 5,
      comment: "Demorei para avaliar pois queria saber como ficaria depois da lavagem e digo está perfeito não solta tinta não encolheu, comprei tamanho 3 para minha filha de 2 anos ficou um pouquinho folgado, porém no comprimento ficou ótimo.",
      photos: ['/images/Avaliacao01.webp'],
    },
    {
      name: "Jessica Silva",
      date: "11/05/2026",
      rating: 5,
      comment: "Comprei o tamanho 6, minha filha tem 4 anos e o tamanho ficou ótimo. São boas pelo preço que paguei e muito bonitas as blusas. Tecido flanelado fino, mas confortável.",
      photos: ['/images/Avaliacao02.webp.webp', '/images/Avaliacao02.1.webp.webp'],
    },
    {
      name: "Luiza Fernandes",
      date: "29/04/2026",
      rating: 5,
      comment: "Minha bebê tem 11 meses mais tem peso e altura de uma bebê de mais de 1 ano, pedi o tamanho 2 e ficou um pouco grande mais até gostei pq não perde rápido e a qualidade do produto é ótima com certeza comprarei novamente.",
      photos: ['/images/Avaliacao03.webp.webp'],
    },
    {
      name: "Luisa",
      date: "02/05/2026",
      rating: 5,
      comment: "Cores lindas, tamanho ótimo, amei as estampas !!!",
      photos: ['/images/Avaliacao04.webp.webp', '/images/Avaliacao04.1.webp.webp'],
    },
    {
      name: "Mariana Costa",
      date: "15/01/2026",
      rating: 5,
      comment: "Produto de excelente qualidade! Minha filha amou as estampas e o tecido é muito macio. Recomendo demais!",
      photos: ['/images/Avaliacao05.webp.webp.webp', '/images/Avaliacao05.1.webp.webp'],
    },
    {
      name: "Fernanda Oliveira",
      date: "22/01/2026",
      rating: 4,
      comment: "Muito bom! O tecido é quentinho e confortável. Comprei tamanho 4 e ficou perfeito. Única observação é que demorou um pouco para chegar.",
      photos: ['/images/Avaliacao06.webp.webp', '/images/Avaliacao06.1webp.webp'],
    },
    {
      name: "Patricia Santos",
      date: "05/02/2026",
      rating: 5,
      comment: "Simplesmente perfeito! A qualidade superou minhas expectativas. Já é a segunda vez que compro e sempre chega certinho.",
      photos: ['/images/Avaliacao07.webp.webp.webp', '/images/Avaliacao07.1.webp.webp.webp'],
    },
    {
      name: "Amanda Lima",
      date: "12/02/2026",
      rating: 5,
      comment: "Amei! As cores são vibrantes e não desbotam. Minha pequena adora usar, super confortável para brincar.",
      photos: ['/images/Avaliacao08.webp.webp.webp', '/images/Avaliacao08.1.webp.webp.webp'],
    },
    {
      name: "Juliana Rodrigues",
      date: "18/02/2026",
      rating: 5,
      comment: "Excelente custo benefício! Kit completo com estampas lindas. O tamanho 2 ficou perfeito na minha bebê de 1 ano e meio.",
      photos: ['/images/Avaliacao09.webp.webp.webp', '/images/Avaliacao09.1.webp.webp.webp'],
    },
    {
      name: "Camila Alves",
      date: "25/02/2026",
      rating: 4,
      comment: "Produto bom, tecido de qualidade. Comprei tamanho 6 e veio um pouco grande, mas nada que atrapalhe. Recomendo!",
      photos: ['/images/Avaliacao10.1.webp1.webp.webp.webp.webp', '/images/Avaliacao10.1.webp2.webp'],
    },
    {
      name: "Renata Martins",
      date: "03/03/2026",
      rating: 5,
      comment: "Maravilhoso! Chegou super rápido e bem embalado. As estampas são ainda mais bonitas pessoalmente. Minha filha não quer tirar!",
      photos: ['/images/Avaliacao11.webp.webp.webp.webp.webp', '/images/Avaliacao11.1.webp.webp.webp.webp.webp.webp'],
    },
    {
      name: "Beatriz Pereira",
      date: "10/03/2026",
      rating: 5,
      comment: "Qualidade impecável! Já lavei várias vezes e continua como novo. O tecido é grossinho e quentinho, perfeito para o inverno.",
      photos: ['/images/Avaliacao12.1.webp.webp.webp.webp.webp'],
    },
    {
      name: "Gabriela Souza",
      date: "17/03/2026",
      rating: 5,
      comment: "Simplesmente apaixonada! Comprei para minha sobrinha e ela amou. As cores são lindas e o tecido é muito bom.",
      photos: ['/images/Avaliacao13.webp.webp.webp.webp.webp', '/images/Avaliacao13.1.webp.webp.webp.webp.webp.webp'],
    },
    {
      name: "Roberta Dias",
      date: "24/03/2026",
      rating: 4,
      comment: "Muito bom! O único detalhe é que achei o tamanho 8 um pouco justo, mas a qualidade é ótima.",
      photos: ['/images/Avaliacao14.webp.webp.webp.webp.webp.webp'],
    },
    {
      name: "Daniela Ferreira",
      date: "31/03/2026",
      rating: 5,
      comment: "Perfeito! Comprei 2 kits e todos vieram lindos. Tecido de qualidade, costuras bem feitas. Super recomendo!",
      photos: ['/images/Avaliacao15.webp.webp.webp.webp.webp.webp'],
    },
    {
      name: "Vanessa Ribeiro",
      date: "07/04/2026",
      rating: 5,
      comment: "Adorei! Minha filha tem 3 anos e o tamanho 4 ficou ótimo. O tecido é macio e quentinho. Já quero comprar mais!",
      photos: ['/images/Avaliacao16.webp.webp.webp.webp.webp.webp', '/images/Avaliacao16.1.webp.webp.webp.webp.webp.webp.webp'],
    },
    {
      name: "Tatiana Gomes",
      date: "14/04/2026",
      rating: 5,
      comment: "Excelente! Chegou antes do prazo e a qualidade é surpreendente. As estampas são fofas demais!",
      photos: ['/images/Avaliacao17.webp.webp.webp.webp.webp.webp.webp', '/images/Avaliacao17.1webp.webp.webp.webp.webp.webp.webp.webp'],
    },
    {
      name: "Priscila Carvalho",
      date: "21/04/2026",
      rating: 5,
      comment: "Muito satisfeita com a compra! O tecido é de ótima qualidade e não encolheu na lavagem. Voltarei a comprar com certeza!",
      photos: ['/images/Avaliacao18.webp.webp.webp.webp.webp.webp.webp.webp', '/images/Avaliacao18.1webp.webp'],
    },
    {
      name: "Larissa Moreira",
      date: "28/04/2026",
      rating: 4,
      comment: "Bom produto! As estampas são lindas e o tecido é confortável. Comprei tamanho 3 e ficou um pouco folgado, mas está ótimo.",
      photos: ['/images/Avaliacao19.webp.webp'],
    },
    {
      name: "Aline Barbosa",
      date: "05/05/2026",
      rating: 5,
      comment: "Perfeito! Minha filha adorou as estampas. O tecido é quentinho e muito confortável. Entrega rápida!",
      photos: ['/images/Avaliacao20.webp'],
    },
    {
      name: "Cristina Azevedo",
      date: "12/05/2026",
      rating: 5,
      comment: "Maravilhoso! Já é a terceira vez que compro. A qualidade é sempre a mesma, excelente! Super indico!",
      photos: ['/images/Avaliacao21.webp.webp'],
    },
    {
      name: "Simone Teixeira",
      date: "19/05/2026",
      rating: 5,
      comment: "Amei demais! O kit veio completo, bem embalado e as peças são lindas. Minha pequena está um amor com essas roupinhas!",
      photos: ['/images/Avaliacao22.webp.webp'],
    },
    {
      name: "Elaine Monteiro",
      date: "23/05/2026",
      rating: 5,
      comment: "Produto excelente! Tecido de primeira qualidade, costuras perfeitas. Comprei tamanho 6 e ficou perfeito na minha filha de 4 anos.",
      photos: ['/images/Avaliacao23.webp'],
    },
    {
      name: "Mônica Araújo",
      date: "24/05/2026",
      rating: 5,
      comment: "Simplesmente perfeito! As cores são vibrantes, o tecido é macio e quentinho. Minha filha está linda e confortável. Recomendo muito!",
      photos: ['/images/Avaliacao24webp.webp'],
    },
  ];

  const showMoreReviews = () => {
    setReviewsToShow(prev => Math.min(prev + 5, customerReviews.length));
  };

  useEffect(() => {
    const id = dp.sku || product.slug;
    const name = `${dp.brand} ${dp.title}`;
    const value = selectedKit.price;

    fbEvents.viewContent({ id, name, value });
    ttkEvents.viewContent({ id, name, value });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.slug]);

  const kitOptions = [
    { qty: 1, label: 'Kit 05 Peças', price: 89.90,  compareAt: 159.90, sku: dp.sku },
    { qty: 2, label: 'Kit 10 Peças', price: 119.90, compareAt: 219.90, sku: `${dp.sku}-10` },
  ];
  const selectedKit = kitOptions.find(k => k.qty === quantity) ?? kitOptions[0];

  const cartItem = {
    handle: product.slug,
    title: `${dp.title} — ${selectedKit.label}`,
    brand: dp.brand,
    volume: dp.volume,
    price: selectedKit.price,
    image: dp.images[0] || '',
    quantity: 1,
    sku: selectedKit.sku,
    type: dp.type,
  };

  const handleBuyClick = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify([cartItem]));
    }
    fbEvents.addToCart({ id: cartItem.sku || '', name: cartItem.title, value: selectedKit.price });
    ttkEvents.addToCart({ id: cartItem.sku || '', name: cartItem.title, value: selectedKit.price });
    router.push('/checkout');
  };

  const handleAddToCart = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify([cartItem]));
    }
    fbEvents.addToCart({ id: cartItem.sku || '', name: cartItem.title, value: selectedKit.price });
    ttkEvents.addToCart({ id: cartItem.sku || '', name: cartItem.title, value: selectedKit.price });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Mobile */}
      <MobileHeader logoUrl={logoUrl} />
      
      {/* Header Desktop */}
      <header className="hidden lg:block bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-center">
          <img src={logoUrl} alt="Logo" className="h-28 object-contain" />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4 md:max-w-7xl lg:pt-4 pt-[104px] pb-28">
        {/* Imagem Principal do Produto */}
        <div className="mb-4">
          <div className="bg-white rounded-2xl overflow-hidden">
            <img
              src={dp.images[selectedImage] || dp.images[0]}
              alt={dp.title}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Miniaturas */}
          {dp.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 px-1 mt-3">
              {dp.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === idx
                      ? 'border-orange-500 scale-105'
                      : 'border-gray-200'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${dp.title} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Informações do Produto */}
        <div id="produto" className="mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            {dp.title}
          </h2>

          {/* Benefícios */}
          <div className="space-y-1.5 mb-3">
            <div className="flex items-start gap-1.5">
              <svg className="w-3.5 h-3.5 text-orange-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <p className="text-gray-700 text-xs">
                Tecido macio: <span className="font-bold">60% algodão e 40% poliéster</span>
              </p>
            </div>
            <div className="flex items-start gap-1.5">
              <svg className="w-3.5 h-3.5 text-orange-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <p className="text-gray-700 text-xs">
                Interior peluciado para <span className="font-bold">aquecimento extra</span>
              </p>
            </div>
            <div className="flex items-start gap-1.5">
              <svg className="w-3.5 h-3.5 text-orange-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <p className="text-gray-700 text-xs">
                Punhos e barra com <span className="font-bold">ajuste confortável</span>
              </p>
            </div>
            <div className="flex items-start gap-1.5">
              <svg className="w-3.5 h-3.5 text-orange-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <p className="text-gray-700 text-xs">
                <span className="font-bold">5 estampas lindas e variadas</span> em um único kit
              </p>
            </div>
          </div>

          {/* Avaliações */}
          <div className="flex items-center gap-2 mb-2">
            {renderStars(4.9)}
            <span className="font-bold text-sm">4,9/5 avaliações</span>
          </div>

          {/* Compras no mês */}
          <p className="text-teal-600 font-semibold text-xs mb-3">
            🔥 Mais de 16.800 compras no último mês
          </p>

          {/* Badges de Certificação */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            <span className="border-2 border-orange-500 text-orange-500 text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Confortável
            </span>
            <span className="border-2 border-orange-500 text-orange-500 text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Quentinho
            </span>
            <span className="border-2 border-orange-500 text-orange-500 text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Prático para o dia a dia
            </span>
          </div>
        </div>

        {/* Seção de Preço e Quantidade */}
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          {/* Preço Original e Desconto */}
          {selectedKit.compareAt > selectedKit.price && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-400 line-through text-sm">
                {formatPrice(selectedKit.compareAt)}
</span>
              <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                -{Math.round((1 - selectedKit.price / selectedKit.compareAt) * 100)}% OFF
              </span>
            </div>
          )}

          {/* Preço Principal */}
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(selectedKit.price)}
            </span>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            ou 6x de {formatPrice(selectedKit.price / 6)} sem juros
          </p>

          {/* Seleção de Tamanho */}
          <div className="mb-4 relative">
            <button
              onClick={() => setSizeSheetOpen(o => !o)}
              className={`w-full flex items-center justify-between px-4 py-3 bg-white border-2 rounded-xl transition-all ${sizeSheetOpen ? 'border-orange-500' : 'border-gray-200 hover:border-orange-400'}`}
            >
              <span className={`text-sm font-semibold ${selectedSize ? 'text-gray-900' : 'text-gray-400'}`}>
                {selectedSize ? `Idade: ${selectedSize}` : 'Selecione a idade'}
              </span>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${sizeSheetOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {sizeSheetOpen && (
              <div className="absolute left-0 right-0 z-20 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {['1-2 anos', '2-3 anos', '3-4 anos', '5-6 anos', '7-8 anos', '9-10 anos'].map((size, i, arr) => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setSizeSheetOpen(false); }}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold transition-colors ${
                      i < arr.length - 1 ? 'border-b border-gray-100' : ''
                    } ${selectedSize === size ? 'bg-orange-50 text-orange-500' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {size}
                    {selectedSize === size && (
                      <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cupom Aplicado */}
          <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-4">
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-green-700 text-xs font-semibold">Cupom já aplicado no preço</span>
            </div>
          </div>

          {/* Escolha a Quantidade */}
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-900 mb-3">Escolha a quantidade:</p>
            
            {/* Opção Kit 5 Peças */}
            <div 
              onClick={() => setQuantity(1)}
              className={`border-2 rounded-xl p-3 mb-2 cursor-pointer transition-all ${
                quantity === 1 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-200 bg-white hover:border-orange-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="quantity"
                    checked={quantity === 1}
                    onChange={() => setQuantity(1)}
                    className="w-4 h-4 text-orange-500"
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-900">Kit • 05 Peças</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="bg-green-500 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                        🏷️ -44% OFF
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 line-through mt-0.5">De R$ 159,90</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-orange-500">R$ 89,90</p>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    <svg className="w-3 h-3" viewBox="0 0 512 512" fill="#32BCAD">
                      <path d="M242.4 292.5C247.8 287.1 257.1 287.1 262.5 292.5L339.5 369.5C353.7 383.7 372.6 391.5 392.6 391.5H407.7L310.6 488.6C280.3 518.1 231.1 518.1 200.8 488.6L103.3 391.2H112.6C132.6 391.2 151.5 383.4 165.7 369.2L242.4 292.5zM262.5 218.9C257.1 224.3 247.8 224.3 242.4 218.9L165.7 142.2C151.5 127.1 132.6 120.2 112.6 120.2H103.3L200.7 22.8C231.1-7.6 280.3-7.6 310.6 22.8L407.8 119.9H392.6C372.6 119.9 353.7 127.7 339.5 141.9L262.5 218.9zM112.6 142.7C126.4 142.7 139.1 148.3 149.7 158.1L226.4 234.8C233.6 241.1 243 245.6 252.5 245.6C261.9 245.6 271.3 241.1 278.5 234.8L355.5 157.8C365.3 148.1 378.8 142.5 392.6 142.5H430.3L488.6 200.8C518.9 231.1 518.9 280.3 488.6 310.6L430.3 368.9H392.6C378.8 368.9 365.3 363.3 355.5 353.5L278.5 276.5C264.6 262.6 240.3 262.6 226.4 276.6L149.7 353.2C139.1 363 126.4 368.6 112.6 368.6H80.8L22.8 310.6C-7.6 280.3-7.6 231.1 22.8 200.8L80.8 142.8H112.6z"/>
                    </svg>
                    <span className="text-[10px] text-gray-500">oferta apenas no pix</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Opção Kit 10 Peças */}
            <div 
              onClick={() => setQuantity(2)}
              className={`border-2 rounded-xl p-3 relative cursor-pointer transition-all ${
                quantity === 2 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-200 bg-white hover:border-orange-300'
              }`}
            >
              <div className="absolute -top-2 right-3">
                <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                  🔥 MAIS VANTAJOSO
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="quantity"
                    checked={quantity === 2}
                    onChange={() => setQuantity(2)}
                    className="w-4 h-4 text-orange-500"
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-900">Kits • 10 Peças</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="bg-green-500 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                        🏷️ -44% OFF
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 line-through mt-0.5">De R$ 219,90</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-orange-500">R$ 119,90</p>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    <svg className="w-3 h-3" viewBox="0 0 512 512" fill="#32BCAD">
                      <path d="M242.4 292.5C247.8 287.1 257.1 287.1 262.5 292.5L339.5 369.5C353.7 383.7 372.6 391.5 392.6 391.5H407.7L310.6 488.6C280.3 518.1 231.1 518.1 200.8 488.6L103.3 391.2H112.6C132.6 391.2 151.5 383.4 165.7 369.2L242.4 292.5zM262.5 218.9C257.1 224.3 247.8 224.3 242.4 218.9L165.7 142.2C151.5 127.1 132.6 120.2 112.6 120.2H103.3L200.7 22.8C231.1-7.6 280.3-7.6 310.6 22.8L407.8 119.9H392.6C372.6 119.9 353.7 127.7 339.5 141.9L262.5 218.9zM112.6 142.7C126.4 142.7 139.1 148.3 149.7 158.1L226.4 234.8C233.6 241.1 243 245.6 252.5 245.6C261.9 245.6 271.3 241.1 278.5 234.8L355.5 157.8C365.3 148.1 378.8 142.5 392.6 142.5H430.3L488.6 200.8C518.9 231.1 518.9 280.3 488.6 310.6L430.3 368.9H392.6C378.8 368.9 365.3 363.3 355.5 353.5L278.5 276.5C264.6 262.6 240.3 262.6 226.4 276.6L149.7 353.2C139.1 363 126.4 368.6 112.6 368.6H80.8L22.8 310.6C-7.6 280.3-7.6 231.1 22.8 200.8L80.8 142.8H112.6z"/>
                    </svg>
                    <span className="text-[10px] text-gray-500">oferta apenas no pix</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Botão de Compra */}
        <button
          onClick={handleBuyClick}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 rounded-xl text-base shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Comprar Agora
        </button>

        {/* Banner de Frete Grátis */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
            </svg>
            <p className="text-green-700 text-xs font-bold whitespace-nowrap">📦 Aproveite FRETE GRÁTIS e receba em 2 a 4 dias</p>
          </div>
        </div>

        {/* Reviews com Vídeos */}
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="relative rounded-xl overflow-hidden">
              <video
                src="/Video/7626402037441285394.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full aspect-[3/4] object-cover"
              />
            </div>
            <div className="relative rounded-xl overflow-hidden">
              <video
                src="/Video/7632010366918200597.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full aspect-[3/4] object-cover"
              />
            </div>
          </div>
        </div>

        {/* Cards Expansíveis */}
        <div id="descricao" className="space-y-3 mb-4">
          {/* Descrição do Produto - SEMPRE ABERTO */}
          <details open className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors font-bold text-base text-gray-900">
              Descrição do produto
              <svg
                className="w-5 h-5 text-gray-500 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-4 pb-4 border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-700 mb-3">
                <span className="font-bold">Kit Sortido com 10 Conjuntos de Moletom para Meninas</span>
              </p>
              <p className="text-sm text-gray-700 mb-4">
                Sua princesa quentinha, confortável e estilosa todos os dias!
              </p>
              
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-gray-700">Tecido premium: <span className="font-bold">60% algodão e 40% poliéster</span>, super macio e confortável</p>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-gray-700">Interior peluciado que <span className="font-bold">aquece nos dias frios</span></p>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-gray-700">Punhos e barra com ribana para <span className="font-bold">melhor ajuste e proteção contra o frio</span></p>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-gray-700"><span className="font-bold">5 conjuntos com estampas lindas e variadas</span> em um único kit</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mt-4 mb-3">
                ✨ Mais praticidade para o dia a dia e muito mais estilo para sua pequena!
              </p>
              <p className="text-sm text-gray-700">
                📏 Consulte a tabela de medidas nas imagens ou na guia de tamanho
              </p>
              <div className="mt-4 rounded-lg overflow-hidden">
                <img
                  src="/images/tabela de tamanho.png"
                  alt="Tabela de medidas"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </details>

          {/* Especificações */}
          <details className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors font-bold text-base text-gray-900">
              Especificações
              <svg
                className="w-5 h-5 text-gray-500 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-4 pb-4 border-t border-gray-200 pt-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Composição</span>
                  <span className="font-semibold text-gray-900">60% Algodão, 40% Poliéster</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Tipo</span>
                  <span className="font-semibold text-gray-900">Conjunto de Moletom</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Quantidade</span>
                  <span className="font-semibold text-gray-900">5 Conjuntos Completos</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Tamanhos</span>
                  <span className="font-semibold text-gray-900">1, 2, 3, 4, 6, 8, 10</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Características</span>
                  <span className="font-semibold text-gray-900">Interior Peluciado</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Estampas</span>
                  <span className="font-semibold text-gray-900">Variadas e Coloridas</span>
                </div>
              </div>
            </div>
          </details>

          {/* Entrega e Devoluções */}
          <details className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors font-bold text-base text-gray-900">
              Entrega e Devoluções
              <svg
                className="w-5 h-5 text-gray-500 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-4 pb-4 border-t border-gray-200 pt-4">
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                    </svg>
                    Frete Grátis
                  </h4>
                  <p className="text-gray-700">Entrega grátis para todo o Brasil em compras acima de 2 unidades.</p>
                  <p className="text-gray-700 mt-1">Prazo de entrega: 2 a 4 dias úteis (Entrega Full).</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" clipRule="evenodd" />
                    </svg>
                    Trocas e Devoluções
                  </h4>
                  <p className="text-gray-700">Você tem 30 dias para trocar ou devolver o produto.</p>
                  <p className="text-gray-700 mt-1">Troca grátis garantida. Produto deve estar lacrado e sem uso.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Rastreamento
                  </h4>
                  <p className="text-gray-700">Acompanhe seu pedido em tempo real pelo código de rastreamento enviado por e-mail.</p>
                </div>
              </div>
            </div>
          </details>
        </div>

        {/* Carrossel de Imagens do Produto */}
        {dp.images && dp.images.length > 0 && (
          <div className="mb-4 relative overflow-hidden rounded-xl">
            <div
              className="flex"
              style={{ animation: `scroll ${dp.images.length * 0.8}s linear infinite` }}
            >
              {[...dp.images, ...dp.images].map((img, idx) => (
                <div key={idx} className="flex-shrink-0 w-1/4 px-1">
                  <img src={img} alt={`${dp.title} - Foto ${idx + 1}`} className="w-full rounded-lg shadow-md" />
                </div>
              ))}
            </div>
            <style jsx>{`
              @keyframes scroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
            `}</style>
          </div>
        )}

        {/* Seção de Avaliações dos Clientes */}
        <div id="avaliacoes" className="mb-4">
          <h3 className="text-base font-bold text-gray-900 mb-3">
            Avaliações dos Clientes
          </h3>
          {/* Header de Avaliações com Gráfico */}
          <div className="bg-white rounded-xl p-4 mb-4">
            
            <div className="flex gap-6">
              {/* Nota Geral */}
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-gray-900 mb-1">4.9</div>
                <div className="flex gap-0.5 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xs text-gray-600">{customerReviews.length} avaliações</p>
              </div>

              {/* Gráfico de Barras */}
              <div className="flex-1 space-y-1.5">
                {/* 5 Estrelas */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-gray-900 w-2">5</span>
                  <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <span className="text-xs font-semibold text-gray-600 w-8 text-right">92%</span>
                </div>

                {/* 4 Estrelas */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-gray-900 w-2">4</span>
                  <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: '6%' }}></div>
                  </div>
                  <span className="text-xs font-semibold text-gray-600 w-8 text-right">6%</span>
                </div>

                {/* 3 Estrelas */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-gray-900 w-2">3</span>
                  <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: '1%' }}></div>
                  </div>
                  <span className="text-xs font-semibold text-gray-600 w-8 text-right">1%</span>
                </div>

                {/* 2 Estrelas */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-gray-900 w-2">2</span>
                  <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: '1%' }}></div>
                  </div>
                  <span className="text-xs font-semibold text-gray-600 w-8 text-right">1%</span>
                </div>

                {/* 1 Estrela */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-gray-900 w-2">1</span>
                  <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <span className="text-xs font-semibold text-gray-600 w-8 text-right">0%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Avaliações */}
          <div className="space-y-3">
            {customerReviews.slice(0, reviewsToShow).map((review, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={profilePhotos[idx]}
                      alt={review.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{review.name}</p>
                      <p className="text-xs text-gray-500">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                {review.photos && review.photos.length > 0 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                    {review.photos.map((photo, pIdx) => (
                      <img
                        key={pIdx}
                        src={photo}
                        alt={`Foto da avaliação`}
                        className="flex-shrink-0 w-28 h-28 rounded-lg object-cover"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Botão Ver Mais */}
          {reviewsToShow < customerReviews.length && (
            <button
              onClick={showMoreReviews}
              className="w-full mt-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-4 rounded-full transition-all flex items-center justify-center gap-2 shadow-md"
            >
              Ver mais avaliações
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}

          {/* Mensagem quando todas as avaliações estão visíveis */}
          {reviewsToShow >= customerReviews.length && customerReviews.length > 5 && (
            <div className="mt-4 text-center bg-orange-50 rounded-xl p-3 border border-orange-200">
              <p className="text-sm text-orange-700 font-semibold">
                ✨ Você visualizou todas as {customerReviews.length} avaliações
              </p>
            </div>
          )}
        </div>

        {/* FAQ */}
        {dp.faq && dp.faq.length > 0 && (
          <div id="faq" className="mb-3">
            <h3 className="text-sm font-bold text-gray-900 mb-2">
              Perguntas Frequentes
            </h3>
            <div className="space-y-1">
              {dp.faq.map((item, idx) => (
                <details key={idx} className="bg-white border border-gray-200 rounded-lg overflow-hidden group">
                  <summary className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors">
                    <span className="font-medium text-xs text-gray-900 pr-3">
                      {item.question}
                    </span>
                    <svg
                      className="w-3.5 h-3.5 text-gray-400 transition-transform group-open:rotate-180 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-3 pb-2 text-[11px] text-gray-600 border-t border-gray-100 pt-1.5">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Espaçamento para o footer */}
        <div className="h-2"></div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-orange-500 to-orange-700 text-white">
        <div className="max-w-2xl mx-auto px-4 pt-6 pb-24">

          {/* Logo + tagline */}
          <div className="text-center mb-4">
            <img src={logoUrl} alt="Mimus Kids" className="h-20 object-contain mx-auto drop-shadow-md" />
            <p className="text-xs font-medium opacity-80 mt-1 tracking-wide">Moda Infantil com Carinho ✨</p>
          </div>

          {/* Links + Atendimento */}
          <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
            <div>
              <p className="text-[9px] uppercase tracking-widest font-bold opacity-50 mb-2">Informações</p>
              <ul className="space-y-1.5">
                <li>
                  <a href="/politica-de-privacidade" className="opacity-80 hover:opacity-100 transition-opacity">
                    Política de Privacidade
                  </a>
                </li>
                <li>
                  <a href="/politica-de-trocas-e-devolucoes" className="opacity-80 hover:opacity-100 transition-opacity">
                    Trocas e Devoluções
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-widest font-bold opacity-50 mb-2">Atendimento</p>
              <ul className="space-y-1.5 opacity-80">
                <li>contato@mimusbaby.shop</li>
                <li>Seg–Sex, 9h às 18h</li>
              </ul>
            </div>
          </div>

          {/* Divisor + Copyright */}
          <div className="border-t border-white/20 pt-3 text-center">
            <p className="text-[10px] font-semibold opacity-80">© Mimus Kids 2026 – Todos os direitos reservados.</p>
            <p className="text-[10px] opacity-55 mt-0.5">CNPJ: 46.281.061/0001-75</p>
          </div>

        </div>
      </footer>
      {/* Navbar fixa de compra */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-3">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <div className="flex-shrink-0">
            <p className="text-[10px] text-gray-400 leading-none">por apenas</p>
            <p className="text-base font-bold text-orange-500 leading-tight">{formatPrice(selectedKit.price)}</p>
          </div>
          <button
            onClick={handleAddToCart}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold text-sm transition-all active:scale-95 ${
              addedToCart
                ? 'border-green-500 bg-green-50 text-green-600'
                : 'border-orange-500 bg-white text-orange-500 hover:bg-orange-50'
            }`}
          >
            {addedToCart ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Adicionado!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Carrinho
              </>
            )}
          </button>
          <button
            onClick={handleBuyClick}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-sm shadow-md active:scale-95 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Comprar agora
          </button>
        </div>
      </div>

    </div>
  );
}
