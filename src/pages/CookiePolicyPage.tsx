import LegalPageLayout from '../components/LegalPageLayout'
import { site } from '../data/site'

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout title="Política de Cookies">
      <p>
        Bem-vindo à nossa página de Política de Cookies. Aqui, fornecemos informações gerais e
        pouco específicas sobre como redigir a sua própria Política de Cookies. No entanto, é
        importante ressaltar que estas informações não devem ser interpretadas como orientação
        jurídica ou recomendações específicas para as suas práticas relacionadas a cookies.
        Recomendamos que busque aconselhamento jurídico para compreender e criar a sua Política de
        Cookies.
      </p>

      <h2 className="text-lg font-bold text-gray-900 pt-4">Conceitos fundamentais sobre a Política de Cookies</h2>
      <p>
        Em determinadas jurisdições, é necessário informar aos visitantes do seu site se este
        utiliza cookies ou tecnologias similares para rastrear informações pessoais. As normas
        locais frequentemente exigem a divulgação das ferramentas de rastreamento utilizadas, bem
        como os tipos de informações pessoais coletadas por tais tecnologias. Adicionalmente,
        essas políticas costumam informar aos visitantes como as informações coletadas são
        utilizadas pelo site.
      </p>
      <p>
        É importante destacar que os serviços de terceiros que aplicam cookies ou utilizam outras
        tecnologias de rastreamento por meio dos nossos serviços podem possuir políticas próprias
        de coleta e armazenamento de informações. Por serem serviços externos, tais práticas não
        são abrangidas pela nossa Política de Privacidade.
      </p>

      <h2 className="text-lg font-bold text-gray-900 pt-4">O que são cookies?</h2>
      <p>
        Cookies são pequenos arquivos de texto que são colocados no seu dispositivo quando você
        visita um site. Eles ajudam o site a lembrar de suas ações e preferências (como login,
        idioma, tamanho da fonte e outras preferências de exibição) por um período de tempo, para
        que você não precise reintroduzi-los sempre que voltar ao site ou navegar de uma página
        para outra.
      </p>

      <h2 className="text-lg font-bold text-gray-900 pt-4">Que tipos de cookies usamos?</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Cookies Estritamente Necessários:</strong> Essenciais para navegar pelo site e usar seus recursos, como acessar áreas seguras.</li>
        <li><strong>Cookies de Desempenho:</strong> Coletam informações sobre como os visitantes usam o site para melhorar seu funcionamento.</li>
        <li><strong>Cookies Funcionais:</strong> Permitem que o site se lembre de suas escolhas e forneça recursos mais pessoais.</li>
        <li><strong>Cookies de Publicidade:</strong> Usados para fornecer anúncios mais relevantes para você e seus interesses.</li>
      </ul>

      <h2 className="text-lg font-bold text-gray-900 pt-4">Cookies de terceiros</h2>
      <p>
        Podemos usar cookies de terceiros para relatar estatísticas de uso do serviço, entregar
        anúncios no e através do serviço, e assim por diante.
      </p>

      <h2 className="text-lg font-bold text-gray-900 pt-4">Seu consentimento</h2>
      <p>
        Ao usar nosso site, você concorda com a colocação de cookies em seu dispositivo conforme
        descrito nesta Política de Cookies. Você pode alterar suas preferências de cookies a
        qualquer momento por meio das configurações do seu navegador.
      </p>

      <h2 className="text-lg font-bold text-gray-900 pt-4">Gerenciamento de cookies</h2>
      <p>
        Você pode controlar e/ou excluir cookies como desejar. Você pode deletar todos os cookies
        que já estão no seu computador e pode configurar a maioria dos navegadores para impedir que
        eles sejam colocados. Se fizer isso, entretanto, você pode ter que ajustar manualmente
        algumas preferências toda vez que visitar um site e alguns serviços e funcionalidades podem
        não funcionar.
      </p>

      <h2 className="text-lg font-bold text-gray-900 pt-4">Contato</h2>
      <p>
        Se você tiver dúvidas sobre nossa Política de Cookies, entre em contato conosco pelo{' '}
        <a href={`mailto:${site.email}`} className="text-brand-blue hover:underline">
          {site.email}
        </a>.
      </p>
    </LegalPageLayout>
  )
}
