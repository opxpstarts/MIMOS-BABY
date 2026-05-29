import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Privacidade – Mimus Kids',
  description: 'Saiba como coletamos, usamos e protegemos seus dados pessoais na Mimus Kids.',
};

export default function PoliticaDePrivacidade() {
  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-5 px-4 shadow-md">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-lg">← Mimus Kids</Link>
          <span className="text-sm opacity-80">Política de Privacidade</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Política de Privacidade</h1>
        <p className="text-sm text-gray-500 mb-8">Última atualização: maio de 2026</p>

        <div className="space-y-8 text-gray-700 text-sm leading-relaxed">

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">1. Quem somos</h2>
            <p>
              A <strong>Mimus Kids</strong> (CNPJ 46.281.061/0001-75) é uma loja virtual de moda infantil que
              comercializa kits de roupas por meio do site <strong>mimusbaby.shop</strong>. Este documento descreve
              como tratamos seus dados pessoais de acordo com a Lei Geral de Proteção de Dados (LGPD – Lei n.º 13.709/2018).
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">2. Dados que coletamos</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Identificação:</strong> nome completo, CPF, e-mail e telefone.</li>
              <li><strong>Endereço:</strong> CEP, logradouro, número, complemento, bairro, cidade e estado.</li>
              <li><strong>Pagamento:</strong> dados de cartão de crédito (processados diretamente pela operadora — não armazenamos dados de cartão) e chave PIX.</li>
              <li><strong>Navegação:</strong> endereço IP, navegador, páginas visitadas e tempo de sessão (via cookies e pixel Meta).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">3. Como usamos seus dados</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Processar e entregar seu pedido.</li>
              <li>Emitir nota fiscal e documentos fiscais obrigatórios.</li>
              <li>Enviar atualizações sobre o status do pedido por e-mail ou WhatsApp.</li>
              <li>Melhorar a experiência de compra no site.</li>
              <li>Veicular anúncios personalizados em plataformas como Meta (Facebook/Instagram) — somente com seu consentimento implícito ao navegar no site.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">4. Compartilhamento de dados</h2>
            <p>
              Seus dados pessoais podem ser compartilhados exclusivamente com:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Transportadoras:</strong> para entrega do pedido.</li>
              <li><strong>Processadoras de pagamento:</strong> PrimeCash e BuyPix, para autorização das transações financeiras.</li>
              <li><strong>Meta Platforms:</strong> dados de eventos de compra (com hash SHA-256) para otimização de campanhas, conforme os Termos de Uso da plataforma.</li>
            </ul>
            <p className="mt-2">Não vendemos nem cedemos seus dados a terceiros para fins comerciais.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">5. Armazenamento e segurança</h2>
            <p>
              Os dados são armazenados em servidores seguros com criptografia SSL/TLS. Dados de pagamento não são
              persistidos em nossos servidores — são transmitidos diretamente às operadoras financeiras.
              Adotamos controles de acesso, monitoramento e atualizações regulares de segurança.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">6. Cookies</h2>
            <p>
              Utilizamos cookies essenciais (necessários para o funcionamento do site) e cookies analíticos/de
              publicidade (pixel Meta). Ao continuar navegando, você consente com o uso de cookies. Você pode
              desativá-los nas configurações do seu navegador, mas isso pode afetar funcionalidades do site.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">7. Seus direitos (LGPD)</h2>
            <p>Como titular dos dados, você tem direito a:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Confirmar a existência de tratamento de seus dados.</li>
              <li>Acessar seus dados pessoais.</li>
              <li>Solicitar a correção de dados incompletos ou incorretos.</li>
              <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários.</li>
              <li>Solicitar a portabilidade dos dados.</li>
              <li>Revogar o consentimento a qualquer momento.</li>
            </ul>
            <p className="mt-2">
              Para exercer seus direitos, entre em contato pelo e-mail: <strong>contato@mimusbaby.shop</strong>
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">8. Retenção de dados</h2>
            <p>
              Mantemos seus dados pelo prazo necessário para cumprir as finalidades descritas nesta política,
              incluindo obrigações legais e fiscais (mínimo de 5 anos, conforme o Código Tributário Nacional).
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">9. Alterações nesta política</h2>
            <p>
              Esta política pode ser atualizada a qualquer momento. Alterações relevantes serão comunicadas no
              site. Recomendamos a leitura periódica deste documento.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">10. Contato</h2>
            <p>
              Em caso de dúvidas sobre esta política ou sobre o tratamento dos seus dados, entre em contato:
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-3">
              <p><strong>Mimus Kids</strong></p>
              <p>CNPJ: 46.281.061/0001-75</p>
              <p>E-mail: contato@mimusbaby.shop</p>
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
