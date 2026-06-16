import { InstagramIcon, LinkedInIcon, YouTubeIcon, TikTokIcon } from './SocialIcons'
import { useSiteContent } from '../context/SiteContentContext'

type SocialLinksProps = {
  variant?: 'light' | 'dark'
}

export default function SocialLinks({ variant = 'light' }: SocialLinksProps) {
  const dark = variant === 'dark'
  const { site } = useSiteContent()

  const socials = [
    { label: 'Instagram', href: site.social.instagram, Icon: InstagramIcon },
    { label: 'LinkedIn', href: site.social.linkedin, Icon: LinkedInIcon },
    { label: 'YouTube', href: site.social.youtube, Icon: YouTubeIcon },
    { label: 'TikTok', href: site.social.tiktok, Icon: TikTokIcon },
  ]

  return (
    <div className="flex flex-wrap gap-2.5">
      {socials.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          title={label}
          aria-label={label}
          className={
            dark
              ? 'w-8 h-8 bg-gray-800 hover:bg-brand-blue border border-gray-700 hover:border-brand-blue rounded-md flex items-center justify-center text-white transition-colors'
              : 'w-8 h-8 bg-gray-100 hover:bg-brand-blue border border-gray-200 hover:border-brand-blue rounded-md flex items-center justify-center text-gray-600 hover:text-white transition-colors'
          }
        >
          <Icon className="w-3.5 h-3.5" />
        </a>
      ))}
    </div>
  )
}
