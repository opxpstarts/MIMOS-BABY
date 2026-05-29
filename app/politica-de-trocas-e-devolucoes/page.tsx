import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Trocas e Devoluções – Mimus Kids',
  description: 'Veja nossa política de trocas, devoluções e reembolso. Troca grátis em 30 dias.',
};

export default function PoliticaDeTrocas() {
  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-5 px-4 shadow-md">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-lg">← Mimus Kids</Link>
          <span className="text-sm opacity-80">Trocas e Devoluções</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Política de Trocas e Devoluções</h1>
        <p className="text-sm text-gray-500 mb-8">Última atualização: maio de 2026</p>

        {/* Destaque: prazo */}
        <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-5 mb-8 flex items-start gap-4">
          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-orange-700 text-base">Troca e devolução grátis em até 30 dias</p>
            <p className="text-sm text-orange-600 mt-1">
              A partir da data de recebimento do produto, você tem 30 dias para solicitar troca ou devolução sem nenhum custo.
            </p>
          </div>
        </div>

        <div className="space-y-8 text-gray-700 text-sm leading-relaxed">

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">1. Prazo para solicitação</h2>
            <p>
              O cliente tem até <strong>30 (trinta) dias corridos</strong> após o recebimento do produto para solicitar
              troca ou devolução, conforme o artigo 49 do Código de Defesa do Consumidor (CDC – Lei 8.078/1990).
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">2. Condições para troca ou devolução</h2>
            <p className="mb-2">O produto deve ser devolvido nas seguintes condições:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Produto sem uso, lavagem ou alterações.</li>
              <li>Etiquetas originais preservadas e afixadas.</li>
              <li>Embalagem original intacta ou em condições adequadas de transporte.</li>
              <li>Acompanhado da nota fiscal de compra.</li>
            </ul>
            <p className="mt-3 text-orange-700 font-medium">
              Produtos com sinais de uso, lavagem, rasgos ou danos causados pelo cliente não são elegíveis para troca ou devolução.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">3. Motivos aceitos para troca</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Produto com defeito de fabricação.</li>
              <li>Tamanho incorreto em relação ao pedido realizado.</li>
              <li>Produto diferente do descrito no site.</li>
              <li>Arrependimento da compra (dentro dos 30 dias, sem necessidade de justificativa).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">4. Como solicitar troca ou devolução</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</div>
                <div>
                  <p className="font-semibold text-gray-900">Entre em contato</p>
                  <p>Envie um e-mail para <strong>contato@mimusbaby.shop</strong> com o número do pedido, motivo da troca/devolução e fotos do produto (se houver defeito).</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</div>
                <div>
                  <p className="font-semibold text-gray-900">Aguarde a aprovação</p>
                  <p>Nossa equipe analisará sua solicitação em até <strong>2 dias úteis</strong> e enviará as instruções de envio por e-mail.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</div>
                <div>
                  <p className="font-semibold text-gray-900">Envie o produto</p>
                  <p>Utilize a etiqueta de postagem que enviaremos por e-mail. O frete de devolução é por nossa conta.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</div>
                <div>
                  <p className="font-semibold text-gray-900">Troca ou reembolso</p>
                  <p>Após recebermos e inspecionarmos o produto, processaremos a troca ou o reembolso em até <strong>5 dias úteis</strong>.</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">5. Reembolso</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Cartão de crédito:</strong> estorno na fatura em até 2 ciclos de faturamento (conforme a operadora).</li>
              <li><strong>PIX:</strong> transferência para a chave PIX cadastrada em até 5 dias úteis após aprovação.</li>
              <li>O reembolso incluirá o valor integral do produto. Frete pago não é reembolsável, exceto em casos de defeito ou erro nosso.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">6. Produtos com defeito</h2>
            <p>
              Se o produto apresentar defeito de fabricação, você tem direito à troca por um produto novo ou
              ao reembolso integral, incluindo o frete. Neste caso, o prazo de reclamação é de <strong>90 dias</strong>
              a partir do recebimento, conforme o CDC.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">7. Contato</h2>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p><strong>Mimus Kids</strong></p>
              <p>CNPJ: 46.281.061/0001-75</p>
              <p>E-mail: contato@mimusbaby.shop</p>
              <p className="mt-1 text-xs text-gray-500">Horário de atendimento: seg. a sex., 9h às 18h</p>
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-6 px-4 mt-10 text-center text-xs">
        <p>© Mimus Kids 2026 – Todos os direitos reservados.</p>
        <div className="flex justify-center gap-4 mt-2 opacity-90">
          <Link href="/politica-de-privacidade" className="underline">Privacidade</Link>
          <Link href="/politica-de-trocas-e-devolucoes" className="underline">Trocas e Devoluções</Link>
        </div>
      </footer>
    </div>
  );
}
