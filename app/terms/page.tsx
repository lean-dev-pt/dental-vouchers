import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50/50 via-white to-cyan-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Termos e Condições de Serviço
          </h1>

          <p className="text-sm text-gray-500 mb-8">
            Última atualização: 10 de janeiro de 2025
          </p>

          <div className="prose prose-teal max-w-none space-y-8">
            {/* 1. Acceptance */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
              <p className="text-gray-700 leading-relaxed">
                Estes Termos e Condições de Serviço (&quot;Termos&quot;) regem o acesso e utilização da plataforma <strong>Cheques Dentista</strong>,
                fornecida pela <strong>The Lean Insight</strong> (&quot;Prestador&quot;, &quot;nós&quot;, &quot;nosso&quot;).
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                Ao subscrever e utilizar o serviço, a clínica dentária (&quot;Cliente&quot;, &quot;você&quot;, &quot;vossa clínica&quot;) concorda com estes Termos
                na sua totalidade. Se não concordar com estes Termos, não deverá utilizar o serviço.
              </p>

              <div className="bg-teal-50 border-l-4 border-teal-500 p-4 my-4">
                <p className="text-sm text-gray-800">
                  <strong>Prestador do Serviço:</strong><br />
                  The Lean Insight<br />
                  Avenida da República, 52, 7<br />
                  1050-196 Lisboa, Portugal<br />
                  NIPC: 509855423<br />
                  Email: <a href="mailto:info@lean-consultores.com" className="text-teal-600 hover:underline">info@lean-consultores.com</a>
                </p>
              </div>
            </section>

            {/* 2. Service Description */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Descrição do Serviço</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                O <strong>Cheques Dentista</strong> é uma plataforma SaaS (Software as a Service) que permite às clínicas dentárias
                portuguesas gerir o ciclo de vida completo dos cheques dentista, incluindo:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Registo de pacientes e médicos dentistas</li>
                <li>Rastreamento de cheques dentista através de estados (pendente, recebido, utilizado, submetido, pago)</li>
                <li>Relatórios e análises de desempenho</li>
                <li>Gestão de utilizadores com controlo de acesso baseado em funções</li>
                <li>Exportação de dados para fins de contabilidade e auditoria</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                O serviço é fornecido &quot;tal como está&quot;, com atualizações e melhorias periódicas.
              </p>
            </section>

            {/* 3. Data Processor Relationship */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Relação de Processamento de Dados (RGPD)</h2>

              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold text-blue-900 mb-3">🏛️ Responsável vs. Subcontratante</h3>
                <p className="text-gray-800 mb-4">
                  Ao abrigo do Regulamento Geral sobre a Proteção de Dados (RGPD), é essencial compreender as responsabilidades:
                </p>

                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-bold text-teal-700 mb-2">🏥 A Clínica = Responsável pelo Tratamento</h4>
                    <p className="text-sm text-gray-700">
                      A clínica dentária é o <strong>Responsável pelo Tratamento de Dados</strong> (Data Controller).
                      A clínica determina <em>que dados</em> são recolhidos, <em>como</em> são utilizados, e <em>porquê</em>.
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-bold text-blue-700 mb-2">⚙️ The Lean Insight = Subcontratante</h4>
                    <p className="text-sm text-gray-700">
                      A The Lean Insight é o <strong>Subcontratante</strong> (Data Processor).
                      Processamos dados pessoais em nome da clínica, seguindo as suas instruções, através da plataforma tecnológica.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1. Responsabilidades da Clínica (Responsável pelo Tratamento)</h3>
              <p className="text-gray-700 mb-3">A clínica dentária garante que:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                <li>Obtém todos os <strong>consentimentos necessários</strong> dos pacientes e médicos dentistas antes de introduzir os seus dados na plataforma</li>
                <li>Obtém <strong>consentimento parental</strong> para menores de 16 anos, conforme exigido pelo RGPD (Art. 8.º)</li>
                <li>Garante que tem uma <strong>base legal</strong> válida para o tratamento de dados (Art. 6.º e 9.º do RGPD)</li>
                <li>Responde a <strong>pedidos de exercício de direitos</strong> dos titulares de dados (acesso, retificação, apagamento, etc.)</li>
                <li>Notifica a The Lean Insight se receber reclamações ou pedidos relacionados com dados que requerem ação da nossa parte</li>
                <li>Mantém registos de atividades de tratamento conforme o Art. 30.º do RGPD</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2. Responsabilidades da The Lean Insight (Subcontratante)</h3>
              <p className="text-gray-700 mb-3">A The Lean Insight garante que:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                <li>Processa dados pessoais <strong>apenas conforme instruções</strong> da clínica (através da utilização da plataforma)</li>
                <li>Implementa <strong>medidas técnicas e organizacionais</strong> adequadas para proteger os dados (Art. 32.º RGPD)</li>
                <li>Garante que todo o pessoal com acesso aos dados está sujeito a <strong>obrigações de confidencialidade</strong></li>
                <li>Auxilia a clínica no <strong>exercício de direitos dos titulares</strong> de dados (exportação, retificação, apagamento)</li>
                <li>Notifica a clínica de qualquer <strong>violação de dados pessoais</strong> no prazo de 24 horas após tomar conhecimento</li>
                <li>Utiliza <strong>subcontratantes aprovados</strong> (Supabase, Stripe) com Data Processing Agreements válidos</li>
                <li>Elimina ou devolve os dados no final da prestação do serviço, se solicitado pela clínica</li>
              </ul>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
                <p className="text-sm text-gray-800">
                  <strong>⚠️ Importante:</strong> A The Lean Insight não é responsável por violações do RGPD resultantes de:
                  falta de consentimentos obtidos pela clínica, introdução de dados imprecisos ou desatualizados, ou utilização
                  indevida da plataforma por utilizadores da clínica.
                </p>
              </div>
            </section>

            {/* 4. Subscription */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Subscrição e Pagamento</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1. Planos Disponíveis</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="border-2 border-teal-200 rounded-xl p-4">
                  <h4 className="font-bold text-teal-700 mb-2">💳 Plano Mensal</h4>
                  <p className="text-2xl font-extrabold text-gray-900">€19<span className="text-sm font-normal text-gray-600">/mês</span></p>
                  <p className="text-sm text-gray-600 mt-2">Faturação mensal, cancele a qualquer momento</p>
                </div>

                <div className="border-2 border-teal-300 rounded-xl p-4 bg-teal-50">
                  <h4 className="font-bold text-teal-700 mb-2">🎯 Plano Anual</h4>
                  <p className="text-2xl font-extrabold text-gray-900">€190<span className="text-sm font-normal text-gray-600">/ano</span></p>
                  <p className="text-sm text-gray-600 mt-2">Poupe 17% • Equivale a €15,83/mês</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2. Processamento de Pagamentos</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Os pagamentos são processados de forma segura pela <strong>Stripe</strong>, um prestador de serviços de pagamento
                certificado PCI-DSS Level 1. A The Lean Insight não armazena dados de cartões de crédito/débito.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.3. Renovação Automática</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                As subscrições são <strong>renovadas automaticamente</strong> no final de cada período (mensal ou anual),
                a menos que seja cancelada antes da data de renovação. A clínica será notificada por email antes de cada renovação.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.4. Reembolsos</h3>
              <p className="text-gray-700 leading-relaxed">
                <strong>Não oferecemos reembolsos</strong> de períodos já pagos. Ao cancelar a subscrição, o serviço permanece
                ativo até ao final do período pago, após o qual o acesso é desativado.
              </p>
            </section>

            {/* 5. Cancellation */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cancelamento e Suspensão</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1. Cancelamento pelo Cliente</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                A clínica pode cancelar a subscrição a qualquer momento através da página de <strong>Conta</strong> no dashboard
                ou contactando-nos diretamente. O cancelamento terá efeito no final do período de faturação atual.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2. Suspensão por Falta de Pagamento</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Se um pagamento falhar, a The Lean Insight tentará processar o pagamento novamente nos dias seguintes.
                Se o pagamento continuar a falhar após 7 dias, o acesso à plataforma será <strong>suspenso</strong> até que o pagamento seja regularizado.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.3. Rescisão por Violação dos Termos</h3>
              <p className="text-gray-700 leading-relaxed">
                A The Lean Insight reserva-se o direito de suspender ou rescindir o acesso de uma clínica que:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mt-3">
                <li>Utilize o serviço para fins ilegais ou não autorizados</li>
                <li>Tente comprometer a segurança da plataforma</li>
                <li>Partilhe credenciais de acesso com terceiros não autorizados</li>
                <li>Viole direitos de propriedade intelectual</li>
              </ul>
            </section>

            {/* 6. Data Ownership */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Propriedade dos Dados</h2>

              <div className="bg-gradient-to-r from-teal-100 to-cyan-100 rounded-xl p-6 mb-4">
                <h3 className="text-xl font-bold text-teal-900 mb-3">🏆 Os Dados São Seus</h3>
                <p className="text-gray-800">
                  Todos os dados introduzidos pela clínica na plataforma (pacientes, médicos, cheques) são e permanecem
                  <strong> propriedade exclusiva da clínica</strong>. A The Lean Insight não reclama qualquer direito de propriedade
                  sobre os dados do Cliente.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.1. Exportação de Dados</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                A clínica pode <strong>exportar os seus dados</strong> a qualquer momento em formato CSV através das funcionalidades
                de exportação disponíveis na plataforma. Recomendamos a realização de exportações regulares para backup.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.2. Eliminação de Dados Após Cancelamento</h3>
              <p className="text-gray-700 leading-relaxed">
                Após o cancelamento da subscrição, os dados da clínica são conservados durante <strong>30 dias</strong> para
                permitir reativação. Após 30 dias, os dados pessoais são <strong>anonimizados</strong> ou eliminados, mantendo apenas
                estatísticas agregadas para fins de auditoria interna.
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                Se a clínica desejar a <strong>eliminação imediata</strong> dos dados, deve solicitá-lo expressamente por email.
              </p>
            </section>

            {/* 7. Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Propriedade Intelectual</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Todos os direitos de propriedade intelectual relacionados com a plataforma Cheques Dentista, incluindo mas não limitado a:
                código-fonte, design, marcas, logótipos, e documentação, são e permanecem propriedade exclusiva da <strong>The Lean Insight</strong>.
              </p>
              <p className="text-gray-700 leading-relaxed">
                A subscrição concede à clínica uma <strong>licença não exclusiva, intransmissível e revogável</strong> para utilizar
                a plataforma durante o período de subscrição ativa, exclusivamente para fins de gestão interna de cheques dentista.
              </p>
            </section>

            {/* 8. Availability */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disponibilidade e Suporte</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">8.1. Disponibilidade do Serviço</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                A The Lean Insight esforça-se por garantir <strong>99% de uptime</strong> mensal. No entanto, o serviço pode estar
                temporariamente indisponível devido a:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>Manutenção programada (notificada com antecedência)</li>
                <li>Problemas técnicos imprevistos</li>
                <li>Falhas de infraestrutura de terceiros (Supabase, Stripe)</li>
                <li>Ataques de segurança ou força maior</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">8.2. Suporte Técnico</h3>
              <p className="text-gray-700 leading-relaxed">
                O suporte técnico está disponível por email em{" "}
                <a href="mailto:info@lean-consultores.com" className="text-teal-600 font-semibold hover:underline">
                  info@lean-consultores.com
                </a>.
                O tempo de resposta típico é de <strong>24 horas em dias úteis</strong>.
              </p>
            </section>

            {/* 9. Liability */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitação de Responsabilidade</h2>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
                <p className="text-sm text-gray-800 leading-relaxed">
                  <strong>Na máxima extensão permitida pela lei portuguesa:</strong>
                </p>
              </div>

              <p className="text-gray-700 leading-relaxed mb-3">
                A The Lean Insight não será responsável por:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li><strong>Perda de dados</strong> resultante de ações da clínica (eliminação acidental, falta de backups)</li>
                <li><strong>Danos indiretos</strong> como perda de lucros, perda de oportunidades de negócio, ou danos reputacionais</li>
                <li><strong>Violações de RGPD</strong> resultantes de falta de consentimentos obtidos pela clínica</li>
                <li><strong>Uso indevido</strong> da plataforma por utilizadores da clínica</li>
                <li><strong>Interrupções de serviço</strong> causadas por terceiros ou força maior</li>
              </ul>

              <p className="text-gray-700 leading-relaxed">
                <strong>A responsabilidade máxima</strong> da The Lean Insight, em qualquer circunstância, está limitada ao valor total
                pago pela clínica nos <strong>12 meses anteriores</strong> ao evento que deu origem à reclamação.
              </p>
            </section>

            {/* 10. Confidentiality */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Confidencialidade</h2>
              <p className="text-gray-700 leading-relaxed">
                A The Lean Insight compromete-se a tratar toda a informação da clínica como <strong>estritamente confidencial</strong>.
                Não divulgaremos, venderemos ou partilharemos dados da clínica com terceiros, exceto:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mt-3">
                <li>Quando necessário para prestação do serviço (subcontratantes aprovados: Supabase, Stripe)</li>
                <li>Quando exigido por lei ou ordem judicial</li>
                <li>Com consentimento expresso da clínica</li>
              </ul>
            </section>

            {/* 11. Changes */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Alterações aos Termos</h2>
              <p className="text-gray-700 leading-relaxed">
                A The Lean Insight reserva-se o direito de modificar estes Termos a qualquer momento. As alterações significativas
                serão notificadas por email com <strong>30 dias de antecedência</strong>. A continuação da utilização do serviço
                após a data de entrada em vigor das alterações constitui aceitação dos novos Termos.
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                Se não concordar com as alterações, pode cancelar a subscrição antes da data de entrada em vigor.
              </p>
            </section>

            {/* 12. Governing Law */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Lei Aplicável e Jurisdição</h2>
              <p className="text-gray-700 leading-relaxed">
                Estes Termos são regidos pela <strong>lei portuguesa</strong>. Qualquer litígio emergente ou relacionado com estes
                Termos será submetido à jurisdição exclusiva dos tribunais de <strong>Lisboa, Portugal</strong>.
              </p>
            </section>

            {/* 13. Contact */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contacto</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Para questões relacionadas com estes Termos e Condições, contacte:
              </p>

              <div className="bg-gradient-to-r from-teal-100 to-cyan-100 rounded-xl p-6">
                <p className="text-gray-800 font-semibold mb-3">The Lean Insight</p>
                <div className="space-y-1 text-gray-700">
                  <p>📍 Avenida da República, 52, 7</p>
                  <p>🏙️ 1050-196 Lisboa, Portugal</p>
                  <p>🏢 NIPC: 509855423</p>
                  <p>
                    📧 Email:{" "}
                    <a href="mailto:info@lean-consultores.com" className="text-teal-600 font-semibold hover:underline">
                      info@lean-consultores.com
                    </a>
                  </p>
                </div>
              </div>
            </section>

            {/* Acceptance Statement */}
            <section className="mt-12 pt-8 border-t-2 border-gray-200">
              <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">✓ Declaração de Aceitação</h3>
                <p className="text-teal-50 leading-relaxed">
                  Ao subscrever o serviço Cheques Dentista, a clínica confirma que leu, compreendeu e concorda com estes
                  Termos e Condições de Serviço, bem como com a <Link href="/privacy" className="underline font-semibold hover:text-white">Política de Privacidade</Link> e
                  o <Link href="/dpa" className="underline font-semibold hover:text-white">Acordo de Processamento de Dados</Link>.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
