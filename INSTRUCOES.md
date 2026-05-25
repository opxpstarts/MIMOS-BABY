# 📋 Instruções de Uso

## 🎯 Você tem 2 opções:

### Opção 1: HTML Simples (Página Única)
**Arquivo:** `template-simples.html`

✅ **Vantagens:**
- Não precisa instalar nada
- Abra direto no navegador
- Perfeito para testes rápidos
- Usa Tailwind CSS via CDN

📝 **Como usar:**
1. Abra o arquivo `template-simples.html` no navegador
2. Edite o HTML para personalizar conteúdo
3. Troque as imagens pelas suas
4. Pronto!

---

### Opção 2: Sistema Next.js Completo (Recomendado)
**Estrutura completa com múltiplos templates**

✅ **Vantagens:**
- Sistema profissional e escalável
- Suporte a múltiplos produtos
- Tracking integrado (Facebook + TikTok)
- Carrinho de compras funcional
- TypeScript + Tailwind CSS
- Fácil adicionar novos templates

📝 **Como usar:**

#### 1. Instalar dependências
```bash
cd /Users/a777/Desktop/Templet03
npm install
```

#### 2. Rodar o projeto
```bash
npm run dev
```

#### 3. Acessar no navegador
```
http://localhost:3001
```

#### 4. Configurar seu produto

Edite o arquivo `app/[slug]/page.tsx` e substitua a função `getProduct`:

```typescript
const getProduct = async (slug: string): Promise<DashboardProduct | null> => {
  // Exemplo com dados estáticos
  if (slug === 'meu-produto') {
    return {
      slug: 'meu-produto',
      product: {
        title: 'Meu Produto Incrível',
        brand: 'Minha Marca',
        price: 199.90,
        compareAtPrice: 299.90,
        discount: 33,
        images: [
          'https://sua-imagem-1.jpg',
          'https://sua-imagem-2.jpg',
        ],
        description: '<p>Descrição do produto...</p>',
        sku: 'PROD-001',
        volume: '100ml',
        // ... outros campos
      }
    };
  }
  return null;
};
```

#### 5. Acessar seu produto
```
http://localhost:3001/meu-produto
```

---

## 📁 Estrutura de Arquivos

```
Templet03/
├── template-simples.html          ← Página HTML única
├── templates/
│   └── template-3/
│       └── index.tsx              ← Template 3 (Next.js)
├── app/
│   ├── [slug]/page.tsx            ← Página dinâmica de produtos
│   ├── checkout/page.tsx          ← Página de checkout
│   └── layout.tsx                 ← Layout principal
├── lib/
│   ├── types.ts                   ← Tipos TypeScript
│   ├── cart.ts                    ← Funções do carrinho
│   ├── fbevents.ts                ← Facebook Pixel
│   └── ttkevents.ts               ← TikTok Pixel
├── data/
│   ├── settings.json              ← Configurações
│   └── example-product.json       ← Exemplo de produto
└── README.md                      ← Documentação completa
```

---

## 🎨 Personalização

### Cores
Edite as classes Tailwind no template:
- `from-blue-600 to-indigo-600` → Gradiente do botão
- `bg-gradient-to-br from-slate-50 to-slate-100` → Fundo da página

### Logo
Substitua a URL da logo em:
- **HTML simples:** Linha 17
- **Next.js:** Função `getLogoUrl()` em `app/[slug]/page.tsx`

### Imagens
Substitua as URLs das imagens do produto no array `images`

---

## 🚀 Deploy

### Vercel (Recomendado para Next.js)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Faça upload da pasta .next
```

### HTML Simples
Faça upload do arquivo `template-simples.html` para qualquer hospedagem

---

## 📞 Suporte

Se tiver dúvidas:
1. Leia o `README.md` completo
2. Veja o `example-product.json` para estrutura de dados
3. Teste primeiro com o `template-simples.html`

---

## ✅ Checklist de Implementação

- [ ] Escolher entre HTML simples ou Next.js
- [ ] Instalar dependências (se Next.js)
- [ ] Configurar dados do produto
- [ ] Trocar logo e imagens
- [ ] Testar no navegador
- [ ] Configurar tracking (Facebook/TikTok)
- [ ] Implementar gateway de pagamento
- [ ] Deploy em produção

---

**Criado com ❤️ seguindo o contrato Template-3**
