'use client'

import { useEffect, useState } from 'react';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

type CartItem = {
  title: string;
  brand: string;
  price: number;
  image: string;
  quantity: number;
  sku: string;
};

const FALLBACK_PRODUCT: CartItem = {
  title: 'Kit 10 Peças Moletom Infantil Menina Inverno Confeccionados em Algodão Macio',
  brand: 'Mimas Kids',
  price: 89.90,
  image: '/images/Foto01.webp',
  quantity: 1,
  sku: 'BOOM-001',
};

const STEPS = ['Identificação', 'Entrega', 'Pagamento'];

type FormData = {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  pagamento: 'pix' | 'cartao';
  cartaoNumero: string;
  cartaoNome: string;
  cartaoValidade: string;
  cartaoCvv: string;
  parcelas: string;
};

const INITIAL: FormData = {
  nome: '', email: '', cpf: '', telefone: '',
  cep: '', rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '',
  pagamento: 'pix',
  cartaoNumero: '', cartaoNome: '', cartaoValidade: '', cartaoCvv: '', parcelas: '1x',
};

function mask(value: string, pattern: string) {
  const v = value.replace(/\D/g, '');
  if (!v) return '';
  let result = '';
  let vi = 0;
  for (const char of pattern) {
    if (vi >= v.length) break;
    if (char === '#') result += v[vi++];
    else result += char;
  }
  return result;
}

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [product, setProduct] = useState<CartItem>(FALLBACK_PRODUCT);

  useEffect(() => {
    const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length > 0) setProduct(cart[0]);
  }, []);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [pixData, setPixData] = useState<{ qrcodeImage: string; copyText: string; transactionId: number } | null>(null);

  const set = (field: keyof FormData, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (step === 0) {
      if (!form.nome.trim()) e.nome = 'Campo obrigatório';
      if (!form.email.includes('@')) e.email = 'E-mail inválido';
      if (form.cpf.replace(/\D/g, '').length < 11) e.cpf = 'CPF inválido';
      if (form.telefone.replace(/\D/g, '').length < 10) e.telefone = 'Telefone inválido';
    }
    if (step === 1) {
      if (form.cep.replace(/\D/g, '').length < 8) e.cep = 'CEP inválido';
      if (!form.rua.trim()) e.rua = 'Campo obrigatório';
      if (!form.numero.trim()) e.numero = 'Campo obrigatório';
      if (!form.bairro.trim()) e.bairro = 'Campo obrigatório';
      if (!form.cidade.trim()) e.cidade = 'Campo obrigatório';
      if (!form.estado.trim()) e.estado = 'Campo obrigatório';
    }
    if (step === 2 && form.pagamento === 'cartao') {
      if (form.cartaoNumero.replace(/\D/g, '').length < 16) e.cartaoNumero = 'Número inválido';
      if (!form.cartaoNome.trim()) e.cartaoNome = 'Campo obrigatório';
      if (form.cartaoValidade.replace(/\D/g, '').length < 4) e.cartaoValidade = 'Data inválida';
      if (form.cartaoCvv.replace(/\D/g, '').length < 3) e.cartaoCvv = 'CVV inválido';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitPayment = async () => {
    setLoading(true);
    setApiError('');
    try {
      const installmentsNum = parseInt(form.parcelas.replace('x', '')) || 1;
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(product.price * (form.pagamento === 'pix' ? 0.95 : 1) * 100),
          paymentMethod: form.pagamento === 'cartao' ? 'credit_card' : 'pix',
          customer: {
            name: form.nome,
            email: form.email,
            phone: form.telefone,
            cpf: form.cpf,
            street: form.rua,
            streetNumber: form.numero,
            complement: form.complemento,
            zipCode: form.cep,
            neighborhood: form.bairro,
            city: form.cidade,
            state: form.estado,
          },
          ...(form.pagamento === 'cartao' && {
            installments: installmentsNum,
            card: {
              number: form.cartaoNumero,
              holderName: form.cartaoNome,
              expirationDate: form.cartaoValidade,
              cvv: form.cartaoCvv,
            },
          }),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.error ?? 'Erro ao processar pagamento.');
        return;
      }

      if (data.pix?.qrcodeImage && data.pix?.copyText) {
        setPixData({ qrcodeImage: data.pix.qrcodeImage, copyText: data.pix.copyText, transactionId: data.pix.transactionId });
      } else {
        setDone(true);
      }
    } catch {
      setApiError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    if (!validate()) return;
    if (step < 2) setStep(s => s + 1);
    else submitPayment();
  };

  const buscarCep = async () => {
    const cep = form.cep.replace(/\D/g, '');
    if (cep.length !== 8) return;
    try {
      const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const d = await r.json();
      if (!d.erro) {
        setForm(f => ({ ...f, rua: d.logradouro, bairro: d.bairro, cidade: d.localidade, estado: d.uf }));
      }
    } catch {}
  };

  const pixPrice = product.price * 0.95;

  // Tela PIX aguardando pagamento
  if (pixData) {
    return <PixScreen pixData={pixData} pixPrice={pixPrice} onPaid={() => setDone(true)} />;
  }

  if (done) {
    return (
      <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Pedido realizado!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Obrigado, <span className="font-semibold text-orange-500">{form.nome.split(' ')[0]}</span>!<br />
            Você receberá a confirmação em <span className="font-semibold">{form.email}</span>.
          </p>
          <a href="/kit-10-peca-moletomin-fantil" className="block w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 rounded-xl text-sm">
            Voltar à loja
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white shadow-sm flex-shrink-0 z-30">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/kit-10-peca-moletomin-fantil">
            <img src="/images/Logo.png" alt="Mimas Kids" className="h-20 object-contain" />
          </a>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Compra segura
          </div>
        </div>

        {/* Progresso */}
        <div className="max-w-lg mx-auto px-4 pb-4">
          <div className="flex items-center gap-0">
            {STEPS.map((label, i) => (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    i < step ? 'bg-orange-500 text-white' :
                    i === step ? 'bg-orange-500 text-white ring-4 ring-orange-100' :
                    'bg-gray-200 text-gray-400'
                  }`}>
                    {i < step ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : i + 1}
                  </div>
                  <span className={`text-[10px] mt-1 font-medium ${i <= step ? 'text-orange-500' : 'text-gray-400'}`}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 mb-4 transition-all ${i < step ? 'bg-orange-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
      <div className="max-w-lg mx-auto px-4 py-4 pb-36">
        {/* Resumo do pedido */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Resumo do pedido</p>
          <div className="flex gap-3">
            <img src={product.image} alt={product.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900 leading-tight">{product.title}</p>
              <p className="text-xs text-orange-500 font-semibold mt-0.5">{product.brand}</p>
              <p className="text-xs text-gray-400 mt-1">Qtd: {product.quantity}</p>
            </div>
            <p className="text-sm font-bold text-gray-900 flex-shrink-0">{formatPrice(product.price)}</p>
          </div>
          <div className="border-t border-gray-100 mt-3 pt-3 space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Subtotal</span>
              <span>{formatPrice(product.price)}</span>
            </div>
            <div className="flex justify-between text-xs text-green-600 font-semibold">
              <span>Frete</span>
              <span>GRÁTIS</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-100">
              <span>Total</span>
              <span className="text-orange-500">{formatPrice(product.price)}</span>
            </div>
          </div>
        </div>

        {/* Etapa 1 — Identificação */}
        {step === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
            <h2 className="text-base font-bold text-gray-900">Seus dados</h2>
            <Field label="Nome completo" error={errors.nome}>
              <input value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="João da Silva" className={input(errors.nome)} />
            </Field>
            <Field label="E-mail" error={errors.email}>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="joao@email.com" className={input(errors.email)} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="CPF" error={errors.cpf}>
                <input value={form.cpf} onChange={e => set('cpf', mask(e.target.value, '###.###.###-##'))} placeholder="000.000.000-00" className={input(errors.cpf)} maxLength={14} />
              </Field>
              <Field label="Telefone" error={errors.telefone}>
                <input value={form.telefone} onChange={e => set('telefone', mask(e.target.value, '(##) #####-####'))} placeholder="(11) 99999-0000" className={input(errors.telefone)} maxLength={15} />
              </Field>
            </div>
          </div>
        )}

        {/* Etapa 2 — Entrega */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
            <h2 className="text-base font-bold text-gray-900">Endereço de entrega</h2>
            <Field label="CEP" error={errors.cep}>
              <input
                value={form.cep}
                onChange={e => set('cep', mask(e.target.value, '#####-###'))}
                onBlur={buscarCep}
                placeholder="00000-000"
                className={input(errors.cep)}
                maxLength={9}
              />
            </Field>
            <Field label="Rua / Avenida" error={errors.rua}>
              <input value={form.rua} onChange={e => set('rua', e.target.value)} placeholder="Rua das Flores" className={input(errors.rua)} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Número" error={errors.numero}>
                <input value={form.numero} onChange={e => set('numero', e.target.value)} placeholder="123" className={input(errors.numero)} />
              </Field>
              <Field label="Complemento">
                <input value={form.complemento} onChange={e => set('complemento', e.target.value)} placeholder="Apto, bloco..." className={input()} />
              </Field>
            </div>
            <Field label="Bairro" error={errors.bairro}>
              <input value={form.bairro} onChange={e => set('bairro', e.target.value)} placeholder="Centro" className={input(errors.bairro)} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Cidade" error={errors.cidade}>
                <input value={form.cidade} onChange={e => set('cidade', e.target.value)} placeholder="São Paulo" className={input(errors.cidade)} />
              </Field>
              <Field label="Estado" error={errors.estado}>
                <select value={form.estado} onChange={e => set('estado', e.target.value)} className={input(errors.estado)}>
                  <option value="">UF</option>
                  {['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO'].map(uf => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <p className="text-xs font-semibold text-green-700">Frete grátis para todo o Brasil</p>
            </div>
          </div>
        )}

        {/* Etapa 3 — Pagamento */}
        {step === 2 && (
          <div className="space-y-3">
            {/* Seleção de método */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-base font-bold text-gray-900 mb-4">Forma de pagamento</h2>
              <div className="space-y-2">
                {/* PIX */}
                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.pagamento === 'pix' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
                  <input type="radio" name="pagamento" value="pix" checked={form.pagamento === 'pix'} onChange={() => set('pagamento', 'pix')} className="hidden" />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${form.pagamento === 'pix' ? 'border-orange-500' : 'border-gray-300'}`}>
                    {form.pagamento === 'pix' && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">PIX</span>
                      <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">5% OFF</span>
                    </div>
                    <p className="text-xs text-gray-500">À vista por <span className="font-bold text-green-600">{formatPrice(pixPrice)}</span></p>
                  </div>
                  <svg className="w-8 h-8 text-teal-500" viewBox="0 0 32 32" fill="currentColor">
                    <path d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm-3.5 9.5l3.5 3.5 3.5-3.5 1.5 1.5L17 17l3.5 3.5-1.5 1.5L16 18.5l-3.5 3.5-1.5-1.5L14.5 17 11 13.5l1.5-1.5z"/>
                  </svg>
                </label>

                {/* Cartão */}
                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.pagamento === 'cartao' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
                  <input type="radio" name="pagamento" value="cartao" checked={form.pagamento === 'cartao'} onChange={() => set('pagamento', 'cartao')} className="hidden" />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${form.pagamento === 'cartao' ? 'border-orange-500' : 'border-gray-300'}`}>
                    {form.pagamento === 'cartao' && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-bold text-gray-900">Cartão de crédito</span>
                    <p className="text-xs text-gray-500">Até 6x de {formatPrice(product.price / 6)} sem juros</p>
                  </div>
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </label>

              </div>
            </div>

            {/* Campos do cartão */}
            {form.pagamento === 'cartao' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
                <h3 className="text-sm font-bold text-gray-900">Dados do cartão</h3>
                <Field label="Número do cartão" error={errors.cartaoNumero}>
                  <input value={form.cartaoNumero} onChange={e => set('cartaoNumero', mask(e.target.value, '#### #### #### ####'))} placeholder="0000 0000 0000 0000" className={input(errors.cartaoNumero)} maxLength={19} />
                </Field>
                <Field label="Nome no cartão" error={errors.cartaoNome}>
                  <input value={form.cartaoNome} onChange={e => set('cartaoNome', e.target.value.toUpperCase())} placeholder="JOÃO DA SILVA" className={input(errors.cartaoNome)} />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Validade" error={errors.cartaoValidade}>
                    <input value={form.cartaoValidade} onChange={e => set('cartaoValidade', mask(e.target.value, '##/##'))} placeholder="MM/AA" className={input(errors.cartaoValidade)} maxLength={5} />
                  </Field>
                  <Field label="CVV" error={errors.cartaoCvv}>
                    <input value={form.cartaoCvv} onChange={e => set('cartaoCvv', e.target.value.replace(/\D/g, ''))} placeholder="123" className={input(errors.cartaoCvv)} maxLength={4} />
                  </Field>
                </div>
                <Field label="Parcelas">
                  <select value={form.parcelas} onChange={e => set('parcelas', e.target.value)} className={input()}>
                    {[1,2,3,4,5,6].map(n => (
                      <option key={n} value={`${n}x`}>
                        {n}x de {formatPrice(product.price / n)} {n === 1 ? '(à vista)' : 'sem juros'}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            )}


          </div>
        )}

      </div>
      </div>

      {/* Rodapé fixo — botões + erro + selos */}
      <div className="flex-shrink-0 bg-white border-t border-gray-100 px-4 pt-3 pb-5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        {apiError && (
          <div className="mb-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 font-medium">
            {apiError}
          </div>
        )}
        <div className="max-w-lg mx-auto space-y-2">
          <button
            onClick={next}
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 rounded-xl text-sm shadow-md active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Processando...
              </>
            ) : step < 2 ? 'Continuar' : 'Finalizar pedido'}
          </button>
          {step > 0 && !loading && (
            <button onClick={() => setStep(s => s - 1)} className="w-full text-gray-500 text-sm py-2 font-medium">
              ← Voltar
            </button>
          )}
          <div className="flex items-center justify-center gap-4 pt-1">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              SSL seguro
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <svg className="w-3.5 h-3.5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
              </svg>
              Dados protegidos
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <svg className="w-3.5 h-3.5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
              Pagamento seguro
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function input(error?: string) {
  return `w-full px-3 py-2.5 text-base border rounded-xl outline-none transition-all ${
    error
      ? 'border-red-400 focus:ring-2 focus:ring-red-200'
      : 'border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100'
  }`;
}

function PixScreen({
  pixData,
  pixPrice,
  onPaid,
}: {
  pixData: { qrcodeImage: string; copyText: string; transactionId: number };
  pixPrice: number;
  onPaid: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (checking) return;
      setChecking(true);
      try {
        const res = await fetch(`/api/payment/status?id=${pixData.transactionId}`);
        const data = await res.json();
        if (data.status === 'paid') {
          clearInterval(interval);
          onPaid();
        }
      } catch {
        // silencioso — tenta de novo no próximo ciclo
      } finally {
        setChecking(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [pixData.transactionId, onPaid, checking]);

  const copy = () => {
    navigator.clipboard.writeText(pixData.copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center">
        <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-teal-500" viewBox="0 0 32 32" fill="currentColor">
            <path d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm4.95-3.54l-7.07 7.07-3.54-3.54-1.41 1.41 4.95 4.95 8.49-8.49-1.42-1.4z"/>
          </svg>
        </div>

        <h2 className="text-base font-bold text-gray-900 mb-1">Pague com PIX</h2>
        <p className="text-xs text-gray-500 mb-4">Escaneie o QR Code ou copie o código abaixo</p>

        <img src={pixData.qrcodeImage} alt="QR Code PIX" className="w-48 h-48 mx-auto mb-4 rounded-xl border border-gray-100" />

        <p className="text-xl font-bold text-green-600 mb-4">{formatPrice(pixPrice)}</p>

        <button
          onClick={copy}
          className="w-full flex items-center justify-center gap-2 bg-orange-50 border border-orange-200 text-orange-600 font-semibold text-sm py-3 rounded-xl mb-4 hover:bg-orange-100 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {copied ? 'Copiado!' : 'Copiar código PIX'}
        </button>

        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <svg className="w-3.5 h-3.5 animate-spin text-orange-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
          Aguardando confirmação do pagamento...
        </div>

        <p className="text-[10px] text-gray-300 mt-3">O QR Code expira em 2 horas</p>
      </div>
    </div>
  );
}
