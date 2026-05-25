# Sistema de Landing Pages - Template 3

Sistema Next.js 14 para criação de landing pages de produtos com múltiplos templates.

## 🚀 Estrutura do Projeto

```
├── app/
│   ├── [slug]/
│   │   └── page.tsx          # Página dinâmica de produtos
│   ├── checkout/
│   │   └── page.tsx          # Página de checkout
│   ├── layout.tsx            # Layout principal
│   └── globals.css           # Estilos globais
├── templates/
│   └── template-3/
│       └── index.tsx         # Template 3 (novo)
├── lib/
│   ├── types.ts              # Tipos TypeScript
│   ├── cart.ts               # Funções do carrinho
│   ├── fbevents.ts           # Eventos Facebook Pixel
│   └── ttkevents.ts          # Eventos TikTok Pixel
└── data/
    └── settings.json         # Configurações dos templates
```

## 📦 Instalação

```bash
npm install
```

## 🏃 Executar o Projeto

```bash
npm run dev
```

Acesse: `http://localhost:3001`

## 🎨 Template 3 - Características

O Template 3 foi criado seguindo o contrato especificado e inclui:

### ✅ Elementos Obrigatórios Implementados

1. **Logo da loja** - Header fixo com logo
2. **Galeria de imagens** - Carrossel interativo com miniaturas
3. **Nome + Marca** - Destaque para brand e título
4. **Preços** - Preço atual, preço riscado e desconto
5. **Botão de compra** - Integrado com carrinho e checkout
6. **Descrição** - Renderização HTML da descrição
7. **Imagens da descrição** - Grid responsivo
8. **FAQ** - Accordion interativo
9. **Reviews com foto** - Grid com suporte a vídeo
10. **Avaliações texto** - Sistema de estrelas e comentários

### 🎯 Funcionalidades

- **Tracking automático**: Facebook Pixel e TikTok Pixel
- **Carrinho de compras**: LocalStorage com persistência
- **Design responsivo**: Mobile-first com Tailwind CSS
- **Gradientes modernos**: Visual atraente e profissional
- **Animações suaves**: Transições e hover effects
- **SEO-friendly**: Estrutura semântica HTML

### 🎨 Design

- Gradiente de fundo: slate-50 to slate-100
- Cores primárias: blue-600 to indigo-600
- Sombras e bordas arredondadas
- Tipografia hierárquica clara
- Espaçamento consistente

## 🔧 Configuração

### Adicionar Template 3 ao Sistema

O template já está configurado em:

1. **`app/[slug]/page.tsx`** - Importação e condição adicionadas
2. **`data/settings.json`** - Template-3 no array de disponíveis

### Estrutura de Dados do Produto

```typescript
type DashboardProduct = {
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
    photoReviews?: { name: string; subtitle: string; image: string; video?: string }[];
    reviews?: { author: string; rating: number; title: string; body: string; date: string }[];
    sku: string;
    volume: string | null;
    type?: string;
  };
};
```

## 📝 Próximos Passos

1. Conectar com seu banco de dados ou API em `app/[slug]/page.tsx`
2. Adicionar imagens reais (logo, produtos)
3. Configurar Facebook Pixel e TikTok Pixel IDs
4. Implementar gateway de pagamento no checkout
5. Adicionar outros templates (template-1, template-2)

## 🛠️ Tecnologias

- Next.js 14 (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- React Hooks

## 📄 Licença

Projeto privado - Todos os direitos reservados
