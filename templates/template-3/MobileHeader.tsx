'use client'

import { useState, useEffect } from 'react';

type Props = {
  logoUrl: string;
};

const menuItems = [
  { label: 'O Produto', id: 'produto' },
  { label: 'Descrição', id: 'descricao' },
  { label: 'Avaliações', id: 'avaliacoes' },
  { label: 'Perguntas Frequentes', id: 'faq' },
  { label: 'Por que comprar conosco?', id: 'beneficios' },
];

export default function MobileHeader({ logoUrl }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const scrollTo = (id: string) => {
    setIsMenuOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  };

  return (
    <>
      {/* Banner + Header Mobile — container único fixo */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex flex-col shadow-sm">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center py-2 px-4">
          <p className="font-bold text-sm">Frete Grátis para todo o Brasil</p>
        </div>
        <header className="bg-white">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg transition-colors hover:bg-orange-50"
            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          <div className="absolute left-1/2 transform -translate-x-1/2">
            <img src={logoUrl} alt="Mimus Kids" className="h-24 object-contain" />
          </div>

          <button
            onClick={() => scrollTo('produto')}
            className="p-2 rounded-lg hover:bg-orange-50 transition-colors"
            aria-label="Comprar"
          >
            <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
        </div>
        </header>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[60] bg-black/50"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho do menu */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-6">
              <img src={logoUrl} alt="Mimus Kids" className="h-16 object-contain" />
              <p className="text-white/80 text-xs mt-2">Moda infantil quentinha e estilosa</p>
            </div>

            {/* Itens de navegação */}
            <nav className="flex-1 py-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left border-b border-gray-100 hover:bg-orange-50 transition-colors group"
                >
                  <span className="font-semibold text-gray-800 group-hover:text-orange-500 transition-colors text-sm">
                    {item.label}
                  </span>
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </nav>

            {/* Botão comprar no rodapé do menu */}
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => scrollTo('produto')}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 rounded-xl text-sm shadow-md active:scale-95 transition-all"
              >
                Comprar agora
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
