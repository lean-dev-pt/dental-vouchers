import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function DPAPage() {
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
            Acordo de Processamento de Dados (DPA)
          </h1>

          <p className="text-sm text-gray-500 mb-2">
            Data Processing Agreement / Contrato de Subcontratação
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Última atualização: 10 de janeiro de 2025
          </p>

          <div className="prose prose-teal max-w-none space-y-8">
            {/* Preamble */}
            <section>
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl p-6 mb-6">
                <h2 className="text-2xl font-bold text-blue-900 mb-3">📋 Preâmbulo</h2>
                <p className="text-gray-800 leading-relaxed">
                  Este Acordo de Processamento de Dados (&quot;DPA&quot;) complementa os <Link href="/terms" className="text-blue-700 font-semibold hover:underline">Termos e Condições de Serviço</Link> e
                  estabelece os termos aplicáveis ao processamento de dados pessoais pela <strong>The Lean Insight</strong> em nome da clínica dentária,
                  em conformidade com o Regulamento (UE) 2016/679 (RGPD).
                </p>
              </div>
            </section>

            {/* 1. Definitions */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Definições</h2>

              <div className="space-y-4">
                <div className="border-l-4 border-teal-500 pl-4">
                  <h4 className="font-bold text-gray-800">🏥 Responsável pelo Tratamento (Data Controller)</h4>
                  <p className="text-sm text-gray-700">
                    A clínica dentária subscritora do serviço Cheques Dentista. É a entidade que determina as finalidades e os meios
                    de tratamento de dados pessoais de pacientes e médicos dentistas.
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-bold text-gray-800">⚙️ Subcontratante (Data Processor)</h4>
                  <p className="text-sm text-gray-700">
                    <strong>The Lean Insight</strong> (NIPC 509855423), sediada na Avenida da República, 52, 7, 1050-196 Lisboa, Portugal.
                    Entidade que trata dados pessoais em nome do Responsável pelo Tratamento através da plataforma Cheques Dentista.
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-bold text-gray-800">👤 Titulares de Dados</h4>
                  <p className="text-sm text-gray-700">
                    Pacientes e médicos dentistas cujos dados pessoais são processados através da plataforma.
                  </p>
                </div>

                <div className="border-l-4 border-amber-500 pl-4">
                  <h4 className="font-bold text-gray-800">📊 Dados Pessoais</h4>
                  <p className="text-sm text-gray-700">
                    Informação relativa aos titulares de dados, incluindo: nomes, ano de nascimento (pacientes),
                    e dados de saúde implícitos (registos de cheques dentista).
                  </p>
                </div>
              </div>
            </section>

            {/* 2. Object and Duration */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Objeto e Duração</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1. Objeto do Acordo</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                O Subcontratante compromete-se a processar dados pessoais em nome do Responsável pelo Tratamento, estritamente para as seguintes finalidades:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                <li>Gestão do ciclo de vida de cheques dentista (registo, rastreamento de estados, auditoria)</li>
                <li>Registo e gestão de pacientes e médicos dentistas</li>
                <li>Geração de relatórios e estatísticas para o Responsável pelo Tratamento</li>
                <li>Exportação de dados para fins de contabilidade e auditoria</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2. Duração</h3>
              <p className="text-gray-700 leading-relaxed">
                Este DPA entra em vigor na data de subscrição do serviço e permanece válido durante todo o período de subscrição ativa.
                Cessa automaticamente com o término da relação contratual, sem prejuízo das obrigações de conservação e eliminação de dados.
              </p>
            </section>

            {/* 3. Obligations of Controller */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Obrigações do Responsável pelo Tratamento (Clínica)</h2>

              <div className="bg-teal-50 border-2 border-teal-300 rounded-xl p-6 mb-4">
                <h3 className="text-lg font-bold text-teal-900 mb-3">✓ A Clínica Garante Que:</h3>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="text-teal-600 font-bold text-xl">1.</span>
                  <div>
                    <h4 className="font-bold text-gray-800">Licitude do Tratamento</h4>
                    <p className="text-sm text-gray-700">
                      Possui uma base legal válida para o tratamento de dados ao abrigo do RGPD (Art. 6.º e 9.º),
                      nomeadamente a execução de contrato com pacientes e interesse legítimo para gestão de registos clínicos.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="text-teal-600 font-bold text-xl">2.</span>
                  <div>
                    <h4 className="font-bold text-gray-800">Obtenção de Consentimentos</h4>
                    <p className="text-sm text-gray-700">
                      Obteve todos os consentimentos necessários dos pacientes e médicos dentistas antes de introduzir os seus dados na plataforma,
                      incluindo <strong>consentimento parental válido</strong> para menores de 16 anos, conforme Art. 8.º do RGPD.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="text-teal-600 font-bold text-xl">3.</span>
                  <div>
                    <h4 className="font-bold text-gray-800">Informação aos Titulares</h4>
                    <p className="text-sm text-gray-700">
                      Informou os titulares de dados sobre o processamento, incluindo a identidade do Subcontratante (The Lean Insight)
                      e os seus direitos ao abrigo do RGPD (Art. 13.º e 14.º).
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="text-teal-600 font-bold text-xl">4.</span>
                  <div>
                    <h4 className="font-bold text-gray-800">Precisão dos Dados</h4>
                    <p className="text-sm text-gray-700">
                      Garante que os dados introduzidos na plataforma são precisos, completos e atualizados.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="text-teal-600 font-bold text-xl">5.</span>
                  <div>
                    <h4 className="font-bold text-gray-800">Resposta a Pedidos de Titulares</h4>
                    <p className="text-sm text-gray-700">
                      É responsável por responder a pedidos de exercício de direitos dos titulares de dados (acesso, retificação, apagamento),
                      podendo solicitar assistência ao Subcontratante quando necessário.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="text-teal-600 font-bold text-xl">6.</span>
                  <div>
                    <h4 className="font-bold text-gray-800">Instrucções ao Subcontratante</h4>
                    <p className="text-sm text-gray-700">
                      Reconhece que a utilização das funcionalidades da plataforma Cheques Dentista constitui as suas instruções
                      documentadas para o processamento de dados pelo Subcontratante (Art. 28.º, n.º 3, al. a) do RGPD).
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Obligations of Processor */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Obrigações do Subcontratante (The Lean Insight)</h2>

              <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6 mb-4">
                <h3 className="text-lg font-bold text-blue-900 mb-3">✓ O Subcontratante Compromete-se a:</h3>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="text-blue-600 font-bold text-xl">1.</span>
                  <div>
                    <h4 className="font-bold text-gray-800">Processar Apenas Conforme Instruções</h4>
                    <p className="text-sm text-gray-700">
                      Tratar dados pessoais apenas conforme instruções documentadas do Responsável pelo Tratamento (através da utilização da plataforma)
                      e não para qualquer outra finalidade, salvo se exigido por lei (Art. 28.º, n.º 3, al. a) do RGPD).
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="text-blue-600 font-bold text-xl">2.</span>
                  <div>
                    <h4 className="font-bold text-gray-800">Confidencialidade</h4>
                    <p className="text-sm text-gray-700">
                      Garantir que todas as pessoas autorizadas a tratar dados pessoais estão sujeitas a obrigações de confidencialidade
                      (Art. 28.º, n.º 3, al. b) do RGPD).
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="text-blue-600 font-bold text-xl">3.</span>
                  <div>
                    <h4 className="font-bold text-gray-800">Medidas de Segurança (Art. 32.º RGPD)</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      Implementar medidas técnicas e organizacionais adequadas para proteger os dados pessoais:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                      <li>Encriptação em trânsito (HTTPS/TLS) e em repouso (AES-256)</li>
                      <li>Row-Level Security (RLS) para isolamento entre clínicas</li>
                      <li>Controlo de acesso baseado em funções (RBAC)</li>
                      <li>Autenticação forte com possibilidade de autenticação multi-fator</li>
                      <li>Backups regulares e recuperação de desastres</li>
                      <li>Logs de auditoria completos (voucher_status_history)</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="text-blue-600 font-bold text-xl">4.</span>
                  <div>
                    <h4 className="font-bold text-gray-800">Assistência em Direitos dos Titulares</h4>
                    <p className="text-sm text-gray-700">
                      Auxiliar o Responsável pelo Tratamento, na medida do possível, no cumprimento de obrigações relativas a pedidos
                      de exercício de direitos dos titulares (Art. 28.º, n.º 3, al. e) do RGPD), fornecendo funcionalidades de
                      exportação, retificação e eliminação de dados.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="text-blue-600 font-bold text-xl">5.</span>
                  <div>
                    <h4 className="font-bold text-gray-800">Notificação de Violações de Dados</h4>
                    <p className="text-sm text-gray-700">
                      Notificar o Responsável pelo Tratamento de qualquer violação de dados pessoais no prazo de <strong>24 horas</strong> após
                      tomar conhecimento (Art. 33.º RGPD), fornecendo informação sobre a natureza da violação, categorias de titulares afetados,
                      e medidas adotadas.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="text-blue-600 font-bold text-xl">6.</span>
                  <div>
                    <h4 className="font-bold text-gray-800">Auditorias e Inspeções</h4>
                    <p className="text-sm text-gray-700">
                      Disponibilizar toda a informação necessária para demonstrar conformidade com as obrigações do Art. 28.º do RGPD
                      e permitir auditorias por parte do Responsável pelo Tratamento ou auditores autorizados, mediante aviso prévio
                      de 30 dias.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="text-blue-600 font-bold text-xl">7.</span>
                  <div>
                    <h4 className="font-bold text-gray-800">Subcontratantes Autorizados</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      O Responsável pelo Tratamento autoriza expressamente a utilização dos seguintes sub-subcontratantes:
                    </p>
                    <div className="ml-4 space-y-2">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="font-semibold text-gray-800">Supabase, Inc.</p>
                        <p className="text-xs text-gray-600">Infraestrutura de base de dados e autenticação (servidor EU West 1 - Irlanda)</p>
                        <p className="text-xs text-gray-600">DPA disponível em: <a href="https://supabase.com/dpa" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">supabase.com/dpa</a></p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="font-semibold text-gray-800">Stripe, Inc.</p>
                        <p className="text-xs text-gray-600">Processamento de pagamentos de subscrições</p>
                        <p className="text-xs text-gray-600">DPA disponível em: <a href="https://stripe.com/privacy-center/legal#data-processing-agreement" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">stripe.com/privacy-center/legal</a></p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">
                      O Subcontratante notificará o Responsável com <strong>30 dias de antecedência</strong> sobre qualquer adição ou substituição de sub-subcontratantes.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="text-blue-600 font-bold text-xl">8.</span>
                  <div>
                    <h4 className="font-bold text-gray-800">Eliminação ou Devolução de Dados</h4>
                    <p className="text-sm text-gray-700">
                      Após o término da prestação de serviços, o Subcontratante eliminará ou devolverá todos os dados pessoais
                      ao Responsável pelo Tratamento, a pedido deste, e eliminará cópias existentes, salvo se a legislação da União
                      ou nacional exigir a conservação (Art. 28.º, n.º 3, al. g) do RGPD).
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Período de Conservação Pós-Cancelamento:</strong> 30 dias para permitir reativação, após os quais os dados
                      são anonimizados ou eliminados, exceto se solicitada eliminação imediata.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. Data Transfers */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Transferências Internacionais de Dados</h2>
              <p className="text-gray-700 leading-relaxed">
                Todos os dados pessoais são armazenados e processados exclusivamente em servidores localizados na <strong>União Europeia</strong>
                (região eu-west-1, Irlanda), garantindo total conformidade com o RGPD.
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                O Subcontratante <strong>não efetua transferências</strong> de dados pessoais para países terceiros fora do Espaço Económico Europeu (EEE),
                exceto se expressamente autorizado por escrito pelo Responsável pelo Tratamento e com garantias adequadas conforme o Capítulo V do RGPD.
              </p>
            </section>

            {/* 6. Data Breach Procedure */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Procedimento em Caso de Violação de Dados</h2>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <h4 className="font-bold text-red-800 mb-2">🚨 Em Caso de Violação de Dados Pessoais:</h4>
              </div>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <span className="text-red-600 font-bold">1.</span>
                  <p className="text-sm text-gray-700">
                    <strong>Notificação ao Responsável:</strong> O Subcontratante notificará o Responsável pelo Tratamento no prazo de
                    <strong> 24 horas</strong> após tomar conhecimento da violação, por email para o endereço registado.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="text-red-600 font-bold">2.</span>
                  <p className="text-sm text-gray-700">
                    <strong>Informação Fornecida:</strong> Natureza da violação, categorias e número aproximado de titulares afetados,
                    categorias e número aproximado de registos afetados, consequências prováveis, medidas adotadas para remediar.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="text-red-600 font-bold">3.</span>
                  <p className="text-sm text-gray-700">
                    <strong>Cooperação:</strong> O Subcontratante cooperará com o Responsável na investigação e resolução da violação,
                    e na notificação à Comissão Nacional de Proteção de Dados (CNPD) se aplicável (prazo de 72 horas).
                  </p>
                </div>
              </div>
            </section>

            {/* 7. Liability */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Responsabilidade</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">7.1. Responsabilidade do Subcontratante</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                O Subcontratante é responsável por danos causados por processamento de dados pessoais que viole o RGPD ou que não cumpra
                instruções lícitas do Responsável pelo Tratamento (Art. 82.º RGPD).
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">7.2. Isenção de Responsabilidade</h3>
              <p className="text-gray-700 leading-relaxed">
                O Subcontratante não será responsável por:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mt-3">
                <li>Violações resultantes de falta de consentimentos obtidos pelo Responsável pelo Tratamento</li>
                <li>Introdução de dados imprecisos ou desatualizados pelo Responsável</li>
                <li>Utilização indevida da plataforma por utilizadores do Responsável pelo Tratamento</li>
                <li>Não cumprimento de obrigações de informação aos titulares por parte do Responsável</li>
              </ul>
            </section>

            {/* 8. Duration and Termination */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Vigência e Cessação</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">8.1. Vigência</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Este DPA entra em vigor na data de subscrição do serviço e permanece válido durante toda a relação contratual.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">8.2. Cessação</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                O DPA cessa automaticamente com o término da subscrição do serviço Cheques Dentista, sem prejuízo das obrigações
                de eliminação ou devolução de dados.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Após a cessação, o Subcontratante procederá à eliminação de todos os dados pessoais conforme estipulado na cláusula 4.8.
              </p>
            </section>

            {/* 9. Governing Law */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Lei Aplicável e Resolução de Litígios</h2>
              <p className="text-gray-700 leading-relaxed">
                Este DPA é regido pela <strong>lei portuguesa</strong> e pelo <strong>RGPD</strong>. Qualquer litígio emergente deste DPA
                será submetido à jurisdição exclusiva dos tribunais de <strong>Lisboa, Portugal</strong>.
              </p>
            </section>

            {/* 10. Contact */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contactos</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-teal-50 rounded-xl p-6">
                  <h4 className="font-bold text-teal-800 mb-3">Subcontratante</h4>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p className="font-semibold">The Lean Insight</p>
                    <p>Avenida da República, 52, 7</p>
                    <p>1050-196 Lisboa, Portugal</p>
                    <p>NIPC: 509855423</p>
                    <p>
                      Email: <a href="mailto:info@lean-consultores.com" className="text-teal-600 font-semibold hover:underline">info@lean-consultores.com</a>
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-6">
                  <h4 className="font-bold text-blue-800 mb-3">Responsável pelo Tratamento</h4>
                  <p className="text-sm text-gray-700">
                    Os dados de contacto do Responsável pelo Tratamento (clínica dentária) constam da subscrição do serviço
                    e são mantidos atualizados nas definições da conta.
                  </p>
                </div>
              </div>
            </section>

            {/* Signature */}
            <section className="mt-12 pt-8 border-t-2 border-gray-200">
              <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-4 text-center">✓ Aceitação do DPA</h3>
                <p className="text-teal-50 leading-relaxed text-center mb-6">
                  Ao subscrever o serviço Cheques Dentista e marcar a caixa de consentimento durante o processo de registo,
                  o Responsável pelo Tratamento (clínica dentária) confirma que:
                </p>
                <ul className="text-teal-50 space-y-2 max-w-2xl mx-auto">
                  <li>✓ Leu e compreendeu este Acordo de Processamento de Dados</li>
                  <li>✓ Concorda com os termos e obrigações aqui estabelecidos</li>
                  <li>✓ Obteve todos os consentimentos necessários dos titulares de dados</li>
                  <li>✓ Autoriza o Subcontratante a processar dados conforme descrito</li>
                  <li>✓ Autoriza expressamente os sub-subcontratantes listados (Supabase, Stripe)</li>
                </ul>
                <p className="text-sm text-teal-100 text-center mt-6">
                  Data de aceitação: Data de subscrição do serviço
                </p>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Para obter uma cópia assinada deste DPA para os seus registos, contacte{" "}
                  <a href="mailto:info@lean-consultores.com" className="text-teal-600 font-semibold hover:underline">
                    info@lean-consultores.com
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
