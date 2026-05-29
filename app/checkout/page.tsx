'use client'

import { useEffect, useState } from 'react';
import { fbEvents } from '@/lib/fbevents';
import { ttkEvents } from '@/lib/ttkevents';

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
  title: 'Kit 05 Peças',
  brand: 'Mimus Kids',
  price: 89.90,
  image: '/images/Foto01.webp',
  quantity: 1,
  sku: 'BOOM-001',
};

// Preço "de" para mostrar -44% OFF (89,90 / 159,90 = 56,2% → desconto de 43,8% ≈ 44%)
const ORIGINAL_PRICE = 159.90;

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
  pagamento: 'pix', // único método disponível
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

function getCookie(name: string): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : '';
}

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [product, setProduct] = useState<CartItem>(FALLBACK_PRODUCT);
  const [fbCookies, setFbCookies] = useState({ fbc: '', fbp: '' });

  useEffect(() => {
    const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const item = cart.length > 0 ? cart[0] : FALLBACK_PRODUCT;
    if (cart.length > 0) setProduct(cart[0]);
    setFbCookies({ fbc: getCookie('_fbc'), fbp: getCookie('_fbp') });
    fbEvents.initiateCheckout({ value: item.price });
    ttkEvents.initiateCheckout({ value: item.price });
  }, []);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [pixData, setPixData] = useState<{ qrcodeImage: string; copyText: string; transactionId: number } | null>(null);
  const [timeLeft, setTimeLeft] = useState(360);

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(s => s > 0 ? s - 1 : 0), 1000);
    return () => clearInterval(t);
  }, []);

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

  const handlePaymentSuccess = (finalValue: number, eventId?: string) => {
    fbEvents.purchase({ id: product.sku, value: finalValue, eventId });
    ttkEvents.purchase({ id: product.sku, value: finalValue });
    setDone(true);
  };

  const submitPayment = async () => {
    fbEvents.addPaymentInfo();
    ttkEvents.addPaymentInfo();
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
          sku: product.sku,
          fbc: fbCookies.fbc || undefined,
          fbp: fbCookies.fbp || undefined,
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
        // Para cartão, usa transactionId retornado pelo servidor para deduplicação com CAPI
        handlePaymentSuccess(product.price, data.transactionId ? String(data.transactionId) : undefined);
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
    return <PixScreen pixData={pixData} pixPrice={pixPrice} onPaid={() => handlePaymentSuccess(pixPrice, String(pixData.transactionId))} />;
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
            <img src="/images/logo.png" alt="Mimus Kids" className="h-20 object-contain" />
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
        {/* Banner de desconto com timer */}
        {(() => {
          const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0');
          const ss = String(timeLeft % 60).padStart(2, '0');
          const urgent = timeLeft <= 60;
          return (
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl px-4 py-3 mb-3 flex items-center justify-center gap-3 shadow-md">
              {/* Ícone de relógio com fundo */}
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              {/* Frase */}
              <p className="text-white text-xs font-semibold">
                {timeLeft > 0 ? 'Desconto expira em' : 'Oferta encerrada!'}
              </p>
              {/* Timer com fundo */}
              <div className={`px-3 py-1 rounded-lg font-extrabold text-sm tabular-nums ${urgent ? 'bg-yellow-400 text-orange-700' : 'bg-white/20 text-white'}`}>
                {mm}:{ss}
              </div>
            </div>
          );
        })()}

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
            <div className="text-right flex-shrink-0">
              <p className="text-[11px] text-gray-400 line-through">{formatPrice(ORIGINAL_PRICE)}</p>
              <p className="text-sm font-bold text-gray-900">{formatPrice(product.price)}</p>
              <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded mt-0.5 inline-block">-44% OFF</span>
            </div>
          </div>
          <div className="border-t border-gray-100 mt-3 pt-3 space-y-1.5">
            <div className="flex justify-between text-xs text-green-600 font-semibold">
              <span>Frete</span>
              <span>GRÁTIS</span>
            </div>
            <div className="flex justify-between text-xs text-green-600 font-semibold">
              <span>Desconto PIX (5%)</span>
              <span>-{formatPrice(product.price - pixPrice)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-100">
              <span className="text-gray-900">Total</span>
              <span className="text-green-600 text-base font-extrabold">{formatPrice(pixPrice)}</span>
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-base font-bold text-gray-900 mb-4">Forma de pagamento</h2>

              {/* PIX — único método disponível */}
              <div className="border-2 border-green-500 bg-green-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full border-2 border-green-500 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    </div>
                    <span className="text-sm font-bold text-gray-900">PIX</span>
                    <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">5% OFF</span>
                  </div>
                  <svg className="w-8 h-8 text-teal-500" viewBox="0 0 32 32" fill="currentColor">
                    <path d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm-3.5 9.5l3.5 3.5 3.5-3.5 1.5 1.5L17 17l3.5 3.5-1.5 1.5L16 18.5l-3.5 3.5-1.5-1.5L14.5 17 11 13.5l1.5-1.5z"/>
                  </svg>
                </div>

                {/* Destaque do valor */}
                <div className="bg-white rounded-xl p-3 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">De <span className="line-through">{formatPrice(ORIGINAL_PRICE)}</span></p>
                      <p className="text-xs text-gray-500 mt-0.5">Por apenas</p>
                      <p className="text-2xl font-extrabold text-green-600 leading-tight">{formatPrice(pixPrice)}</p>
                    </div>
                    <div className="text-right">
                      <div className="bg-red-500 text-white text-xs font-extrabold px-3 py-1.5 rounded-lg mb-1">
                        -44% OFF
                      </div>
                      <p className="text-[10px] text-green-600 font-semibold">
                        Economize {formatPrice(ORIGINAL_PRICE - pixPrice)}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-green-700 font-medium mt-2 text-center">
                  ✓ Pagamento instantâneo e seguro · QR Code gerado na próxima tela
                </p>
              </div>
            </div>
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
  const [seconds, setSeconds] = useState(7200);

  // polling de status
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
      } catch {}
      finally { setChecking(false); }
    }, 5000);
    return () => clearInterval(interval);
  }, [pixData.transactionId, onPaid, checking]);

  // countdown 2h
  useEffect(() => {
    const t = setInterval(() => setSeconds(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  const copy = () => {
    navigator.clipboard.writeText(pixData.copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Header laranja */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-5 text-white text-center shadow-md">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-sm font-bold">Pedido gerado com sucesso!</span>
        </div>
        <p className="text-orange-100 text-xs">Conclua o pagamento para confirmar seu pedido</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 max-w-sm mx-auto w-full space-y-4">

        {/* Card valor + timer */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">Valor a pagar</p>
            <p className="text-2xl font-bold text-green-600">{formatPrice(pixPrice)}</p>
            <p className="text-[10px] text-orange-500 font-semibold mt-0.5">5% de desconto no PIX</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide mb-1">Expira em</p>
            <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-bold tabular-nums ${seconds < 300 ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-600'}`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {mm}:{ss}
            </div>
          </div>
        </div>

        {/* Card QR Code */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Escaneie o QR Code</p>
          <div className="relative inline-block">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 blur-xl opacity-60" />
            <img
              src={pixData.qrcodeImage}
              alt="QR Code PIX"
              className="relative w-52 h-52 rounded-2xl border-2 border-orange-100 shadow-sm"
            />
          </div>
          <p className="text-[11px] text-gray-400 mt-4">Abra o app do seu banco e escaneie</p>
        </div>

        {/* Divider ou */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">ou copie o código</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Preview do código PIX */}
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-3">
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-1">Código PIX</p>
          <p className="text-xs text-gray-600 font-mono break-all leading-relaxed">
            {pixData.copyText.slice(0, 60)}<span className="text-gray-300">...</span>
          </p>
        </div>

        {/* Botão copiar */}
        <button
          onClick={copy}
          className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-xl text-sm shadow-md active:scale-95 transition-all ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
          }`}
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Código copiado!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copiar código PIX
            </>
          )}
        </button>

        {/* Status aguardando */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-ping absolute" />
            <div className="w-3 h-3 bg-orange-500 rounded-full relative" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-800">Aguardando seu pagamento</p>
            <p className="text-[10px] text-gray-400">A confirmação é automática após o pagamento</p>
          </div>
        </div>

        {/* Selos */}
        <div className="flex items-center justify-center gap-4 py-2">
          <div className="flex items-center gap-1 text-[11px] text-gray-400">
            <svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            SSL seguro
          </div>
          <div className="flex items-center gap-1 text-[11px] text-gray-400">
            <svg className="w-3.5 h-3.5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
            </svg>
            Dados protegidos
          </div>
          <div className="flex items-center gap-1 text-[11px] text-gray-400">
            <svg className="w-3.5 h-3.5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
            Pix seguro
          </div>
        </div>

      </div>
    </div>
  );
}
