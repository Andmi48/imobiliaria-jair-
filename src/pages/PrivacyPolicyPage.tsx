import LegalPageLayout from '../components/LegalPageLayout'
import { site } from '../data/site'

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Política de Privacidade">
      <p>
        A {site.name} está comprometida em proteger a privacidade dos visitantes e clientes do
        nosso site. Esta Política de Privacidade descreve como coletamos, usamos e protegemos
        suas informações pessoais.
      </p>

      <h2 className="text-lg font-bold text-gray-900 pt-4">Informações que coletamos</h2>
      <p>
        Podemos coletar informações pessoais que você nos fornece voluntariamente, como nome,
        sobrenome, e-mail, telefone e mensagens enviadas através do formulário de contato.
      </p>

      <h2 className="text-lg font-bold text-gray-900 pt-4">Como usamos suas informações</h2>
      <p>
        Utilizamos suas informações para responder às suas solicitações, fornecer serviços
        imobiliários, melhorar nosso site e comunicar informações relevantes sobre imóveis de seu
        interesse.
      </p>

      <h2 className="text-lg font-bold text-gray-900 pt-4">Compartilhamento de dados</h2>
      <p>
        Não vendemos suas informações pessoais. Podemos compartilhar dados apenas quando
        necessário para prestação de serviços ou quando exigido por lei.
      </p>

      <h2 className="text-lg font-bold text-gray-900 pt-4">Segurança</h2>
      <p>
        Adotamos medidas de segurança adequadas para proteger suas informações pessoais contra
        acesso não autorizado, alteração, divulgação ou destruição.
      </p>

      <h2 className="text-lg font-bold text-gray-900 pt-4">Seus direitos</h2>
      <p>
        Você tem o direito de solicitar acesso, correção ou exclusão de seus dados pessoais.
        Entre em contato conosco para exercer esses direitos.
      </p>

      <h2 className="text-lg font-bold text-gray-900 pt-4">Contato</h2>
      <p>
        Para questões sobre esta Política de Privacidade, entre em contato pelo{' '}
        <a href={`mailto:${site.email}`} className="text-brand-blue hover:underline">
          {site.email}
        </a>{' '}
        ou pelos telefones {site.phones.join(' / ')}.
      </p>
    </LegalPageLayout>
  )
}
