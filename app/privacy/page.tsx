import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
            Política de Privacidade
          </h1>

          <p className="text-sm text-gray-500 mb-8">
            Última atualização: 10 de janeiro de 2025
          </p>

          <div className="prose prose-teal max-w-none space-y-8">
            {/* 1. Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Quem Somos</h2>
              <p className="text-gray-700 leading-relaxed">
                A <strong>Cheques Dentista</strong> é um serviço fornecido pela <strong>The Lean Insight</strong>,
                uma empresa portuguesa especializada em soluções de gestão para clínicas dentárias.
              </p>
              <div className="bg-teal-50 border-l-4 border-teal-500 p-4 my-4">
                <p className="text-sm text-gray-800">
                  <strong>The Lean Insight</strong><br />
                  Avenida da República, 52, 7<br />
                  1050-196 Lisboa, Portugal<br />
                  NIPC: 509855423<br />
                  Email: <a href="mailto:info@lean-consultores.com" className="text-teal-600 hover:underline">info@lean-consultores.com</a>
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Nesta Política de Privacidade, explicamos que dados pessoais recolhemos, como os utilizamos,
                e quais são os seus direitos ao abrigo do Regulamento Geral sobre a Proteção de Dados (RGPD).
              </p>
            </section>

            {/* 2. Data Controller vs Processor */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Responsável pelo Tratamento de Dados</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                É importante compreender a diferença entre <strong>Responsável pelo Tratamento</strong> e <strong>Subcontratante</strong>:
              </p>

              <div className="bg-gradient-to-r from-teal-100 to-cyan-100 rounded-xl p-6 mb-4">
                <h3 className="font-bold text-teal-800 mb-2">🏥 A Sua Clínica Dentária = Responsável pelo Tratamento</h3>
                <p className="text-gray-700 text-sm">
                  A clínica dentária determina <em>que dados</em> são recolhidos e <em>como</em> são utilizados.
                  A clínica é responsável por obter os consentimentos necessários dos pacientes e médicos dentistas,
                  incluindo consentimento parental para menores.
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl p-6">
                <h3 className="font-bold text-blue-800 mb-2">⚙️ The Lean Insight = Subcontratante</h3>
                <p className="text-gray-700 text-sm">
                  Nós processamos dados em nome da clínica, seguindo as suas instruções. Fornecemos a plataforma
                  tecnológica, mas não decidimos que dados recolher nem como utilizá-los. Toda a responsabilidade
                  de conformidade com o RGPD recai sobre a clínica.
                </p>
              </div>
            </section>

            {/* 3. Data We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Que Dados Recolhemos</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Seguimos o princípio de <strong>minimização de dados</strong> — recolhemos apenas o estritamente necessário
                para o funcionamento do serviço.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1. Dados de Pacientes</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li><strong>Nome completo</strong> — para identificar o paciente nos registos de cheques dentista</li>
                <li><strong>Ano de nascimento</strong> — para verificar elegibilidade (menores, grávidas, seniores)</li>
              </ul>
              <p className="text-sm text-gray-600 italic mb-6">
                ⚠️ Não recolhemos números de telefone, emails, moradas, ou qualquer outro dado de contacto dos pacientes.
                Toda a comunicação com pacientes é da responsabilidade da clínica.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2. Dados de Médicos Dentistas</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                <li><strong>Nome completo</strong> — para registar qual o médico que utilizou o cheque dentista</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3. Dados de Utilizadores da Plataforma (Pessoal da Clínica)</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                <li><strong>Nome completo</strong> — identificação do utilizador</li>
                <li><strong>Email</strong> — autenticação e comunicações relacionadas com o serviço</li>
                <li><strong>Palavra-passe encriptada</strong> — segurança da conta</li>
                <li><strong>Função na clínica</strong> — controlo de acessos (admin, médico, staff)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.4. Dados de Cheques Dentista</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                <li><strong>Número do cheque</strong> — identificação única</li>
                <li><strong>Valor do cheque</strong> — montante a pagar</li>
                <li><strong>Estado do cheque</strong> — ciclo de vida (recebido, utilizado, submetido, pago, etc.)</li>
                <li><strong>Datas de transição de estado</strong> — auditoria e rastreabilidade</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.5. Dados de Pagamento</h3>
              <p className="text-gray-700 mb-4">
                Os dados de pagamento de subscrições (cartão de crédito/débito) são processados pela <strong>Stripe</strong>,
                um subcontratante certificado PCI-DSS. Nunca armazenamos dados de cartões nos nossos servidores.
              </p>
            </section>

            {/* 4. Legal Basis */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Base Legal para o Tratamento</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Ao abrigo do RGPD (Artigo 6.º e Artigo 9.º), o tratamento de dados pessoais requer uma base legal:
              </p>

              <div className="space-y-4">
                <div className="border-l-4 border-teal-500 pl-4">
                  <h4 className="font-bold text-gray-800">✅ Execução de Contrato (Art. 6.º, n.º 1, al. b)</h4>
                  <p className="text-sm text-gray-700">
                    Processamos dados de pacientes e médicos para cumprir o contrato de prestação de serviços com a clínica dentária.
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-bold text-gray-800">✅ Interesse Legítimo (Art. 6.º, n.º 1, al. f)</h4>
                  <p className="text-sm text-gray-700">
                    A gestão de registos de cheques dentista é necessária para a atividade legítima da clínica e para o cumprimento de obrigações com a ARS.
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-bold text-gray-800">✅ Dados de Saúde (Art. 9.º, n.º 2, al. h)</h4>
                  <p className="text-sm text-gray-700">
                    Os cheques dentista são considerados dados de saúde. A base legal é a <strong>prestação de cuidados de saúde</strong>,
                    que permite o tratamento de dados de saúde sem consentimento explícito quando necessário para fins médicos.
                  </p>
                </div>
              </div>
            </section>

            {/* 5. Data Retention */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Quanto Tempo Guardamos os Dados</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Seguimos as obrigações legais de conservação de registos clínicos em Portugal:
              </p>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
                <p className="text-gray-800 font-semibold">
                  📅 Período de Conservação: <strong>5 anos</strong>
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  Os dados de pacientes, médicos e cheques dentista são conservados durante 5 anos após o último
                  movimento do cheque, em conformidade com a legislação portuguesa sobre registos de saúde.
                </p>
              </div>

              <p className="text-gray-700 leading-relaxed mt-4">
                Após o período de conservação, os dados pessoais são <strong>anonimizados</strong> (o nome é substituído por um
                identificador genérico) ou eliminados, mantendo apenas os dados estatísticos agregados.
              </p>
            </section>

            {/* 6. Data Security */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Como Protegemos os Dados</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Implementamos medidas técnicas e organizacionais para proteger os dados pessoais:
              </p>

              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Encriptação em trânsito</strong> — todas as comunicações usam HTTPS/TLS</li>
                <li><strong>Encriptação em repouso</strong> — dados armazenados encriptados (AES-256)</li>
                <li><strong>Controlo de acesso</strong> — Row-Level Security (RLS) garante isolamento entre clínicas</li>
                <li><strong>Autenticação forte</strong> — palavras-passe encriptadas, possibilidade de 2FA</li>
                <li><strong>Auditoria completa</strong> — todas as alterações de estado são registadas com timestamp e utilizador</li>
                <li><strong>Backups regulares</strong> — recuperação de desastres garantida</li>
                <li><strong>Infraestrutura certificada</strong> — hospedagem na Supabase (conformidade ISO 27001, SOC 2)</li>
              </ul>
            </section>

            {/* 7. Data Sharing */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Partilha de Dados com Terceiros</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Não vendemos, alugamos ou partilhamos dados pessoais com terceiros para fins de marketing.
                Partilhamos dados apenas com subcontratantes necessários à prestação do serviço:
              </p>

              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-bold text-gray-800">🗄️ Supabase (Infraestrutura)</h4>
                  <p className="text-sm text-gray-700">
                    Base de dados e autenticação. Certificada ISO 27001, SOC 2, GDPR-compliant.
                    Data Processing Agreement assinado.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-bold text-gray-800">💳 Stripe (Pagamentos)</h4>
                  <p className="text-sm text-gray-700">
                    Processamento de subscrições. Certificada PCI-DSS Level 1, GDPR-compliant.
                    Não armazenamos dados de cartões.
                  </p>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mt-4">
                <strong>Todos os subcontratantes estão sujeitos a Data Processing Agreements (DPA)</strong> que garantem
                a conformidade com o RGPD e a segurança dos dados.
              </p>
            </section>

            {/* 8. Your Rights */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Os Seus Direitos ao Abrigo do RGPD</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Enquanto titular de dados pessoais, tem os seguintes direitos:
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-teal-200 rounded-lg p-4">
                  <h4 className="font-bold text-teal-700 mb-2">📄 Direito de Acesso (Art. 15.º)</h4>
                  <p className="text-sm text-gray-700">
                    Pode solicitar uma cópia de todos os dados pessoais que temos sobre si.
                  </p>
                </div>

                <div className="border border-blue-200 rounded-lg p-4">
                  <h4 className="font-bold text-blue-700 mb-2">✏️ Direito de Retificação (Art. 16.º)</h4>
                  <p className="text-sm text-gray-700">
                    Pode corrigir dados incorretos ou desatualizados.
                  </p>
                </div>

                <div className="border border-red-200 rounded-lg p-4">
                  <h4 className="font-bold text-red-700 mb-2">🗑️ Direito ao Apagamento (Art. 17.º)</h4>
                  <p className="text-sm text-gray-700">
                    Pode solicitar a eliminação dos seus dados, sujeito a obrigações legais de conservação.
                  </p>
                </div>

                <div className="border border-purple-200 rounded-lg p-4">
                  <h4 className="font-bold text-purple-700 mb-2">🚫 Direito de Oposição (Art. 21.º)</h4>
                  <p className="text-sm text-gray-700">
                    Pode opor-se ao tratamento de dados para fins de marketing direto.
                  </p>
                </div>

                <div className="border border-amber-200 rounded-lg p-4">
                  <h4 className="font-bold text-amber-700 mb-2">📦 Direito à Portabilidade (Art. 20.º)</h4>
                  <p className="text-sm text-gray-700">
                    Pode receber os seus dados em formato estruturado e legível por máquina (CSV/JSON).
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-bold text-gray-700 mb-2">⏸️ Direito à Limitação (Art. 18.º)</h4>
                  <p className="text-sm text-gray-700">
                    Pode solicitar a restrição temporária do tratamento dos seus dados.
                  </p>
                </div>
              </div>

              <div className="bg-teal-50 border-2 border-teal-300 rounded-xl p-6 mt-6">
                <h4 className="font-bold text-teal-800 mb-2">📧 Como Exercer os Seus Direitos</h4>
                <p className="text-gray-700 mb-3">
                  <strong>Se é paciente ou médico dentista:</strong> Contacte a sua clínica dentária.
                  A clínica é o Responsável pelo Tratamento e tratará do seu pedido.
                </p>
                <p className="text-gray-700">
                  <strong>Se é pessoal da clínica:</strong> Contacte-nos diretamente em{" "}
                  <a href="mailto:info@lean-consultores.com" className="text-teal-600 font-semibold hover:underline">
                    info@lean-consultores.com
                  </a>
                </p>
                <p className="text-sm text-gray-600 mt-3">
                  Responderemos a todos os pedidos no prazo de <strong>30 dias</strong>, conforme exigido pelo RGPD.
                </p>
              </div>
            </section>

            {/* 9. Data Breach */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Violação de Dados Pessoais</h2>
              <p className="text-gray-700 leading-relaxed">
                No caso improvável de uma violação de dados pessoais que represente um risco para os seus direitos e liberdades,
                notificaremos a Comissão Nacional de Proteção de Dados (CNPD) no prazo de <strong>72 horas</strong> após a descoberta,
                conforme exigido pelo RGPD (Art. 33.º).
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                Se o risco for elevado, notificaremos também os titulares de dados afetados diretamente, através da clínica dentária.
              </p>
            </section>

            {/* 10. Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Cookies e Tecnologias Similares</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Utilizamos cookies estritamente necessários para o funcionamento da plataforma:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Cookies de sessão</strong> — autenticação do utilizador (essenciais)</li>
                <li><strong>Cookies de preferências</strong> — idioma e configurações da interface (funcionais)</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                <strong>Não utilizamos cookies de analytics, publicidade ou tracking de terceiros.</strong>
              </p>
            </section>

            {/* 11. Children */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Dados de Menores</h2>
              <p className="text-gray-700 leading-relaxed">
                Os cheques dentista aplicam-se frequentemente a menores de idade. Ao abrigo do RGPD (Art. 8.º),
                menores com menos de 16 anos necessitam de <strong>consentimento parental</strong> para o tratamento de dados pessoais.
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                <strong>É da responsabilidade da clínica dentária obter e documentar o consentimento parental</strong> antes de
                introduzir dados de menores na plataforma. A The Lean Insight, enquanto subcontratante, confia que a clínica
                obteve os consentimentos necessários.
              </p>
            </section>

            {/* 12. International Transfers */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Transferências Internacionais de Dados</h2>
              <p className="text-gray-700 leading-relaxed">
                Todos os dados são armazenados em servidores localizados na <strong>União Europeia</strong> (região eu-west-1, Irlanda),
                garantindo total conformidade com o RGPD. Não efetuamos transferências internacionais de dados para países terceiros.
              </p>
            </section>

            {/* 13. Updates */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Alterações a Esta Política</h2>
              <p className="text-gray-700 leading-relaxed">
                Podemos atualizar esta Política de Privacidade periodicamente para refletir alterações nos nossos serviços ou
                na legislação aplicável. A data de &quot;Última atualização&quot; no topo desta página indica quando foi efetuada a revisão mais recente.
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                Notificaremos as clínicas de alterações significativas por email e publicaremos a nova versão no nosso website.
              </p>
            </section>

            {/* 14. Contact */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contacto</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Se tiver dúvidas sobre esta Política de Privacidade ou sobre o tratamento dos seus dados pessoais,
                pode contactar-nos:
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

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
                <p className="text-sm text-gray-700">
                  <strong>Autoridade de Controlo:</strong> Se considerar que os seus direitos não foram respeitados,
                  pode apresentar queixa à Comissão Nacional de Proteção de Dados (CNPD):{" "}
                  <a href="https://www.cnpd.pt" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    www.cnpd.pt
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
