import LegalPageLayout from '../components/LegalPageLayout'
import { site } from '../data/site'

export default function LegalDisclaimerPage() {
  return (
    <LegalPageLayout title="Isenção de responsabilidade jurídica">
      <p>
        As informações contidas neste site são fornecidas pela {site.name} apenas para fins
        informativos. Embora nos esforcemos para manter as informações atualizadas e corretas,
        não fazemos representações ou garantias de qualquer tipo, expressas ou implícitas, sobre a
        completude, precisão, confiabilidade, adequação ou disponibilidade do site ou das
        informações contidas nele.
      </p>
      <p>
        Qualquer confiança que você depositar nas informações deste site é estritamente por sua
        conta e risco. Em nenhuma circunstância seremos responsáveis por qualquer perda ou dano,
        incluindo, sem limitação, perda ou dano indireto ou consequencial, ou qualquer perda ou
        dano decorrente da perda de dados ou lucros decorrentes do uso deste site.
      </p>
      <p>
        Através deste site, você pode acessar links para outros sites que não estão sob o controle
        da {site.name}. Não temos controle sobre a natureza, conteúdo e disponibilidade desses
        sites. A inclusão de quaisquer links não implica necessariamente uma recomendação ou
        endossa as opiniões expressas neles.
      </p>
      <p>
        CRECI: {site.creci}. Recomendamos que busque orientação jurídica e profissional antes de
        tomar qualquer decisão relacionada à compra, venda ou locação de imóveis.
      </p>
      <p>
        Para dúvidas, entre em contato:{' '}
        <a href={`mailto:${site.email}`} className="text-brand-blue hover:underline">
          {site.email}
        </a>
      </p>
    </LegalPageLayout>
  )
}
