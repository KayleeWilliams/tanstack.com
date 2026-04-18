import * as React from 'react'
import {
  ConsentBanner,
  ConsentDialog,
  ConsentDialogLink,
  ConsentManagerProvider,
  type Theme,
  useConsentManager,
} from '@c15t/react'
import { gtag } from '@c15t/scripts/google-tag'
import { useHubSpotChat } from '~/hooks/useHubSpotChat'

const GOOGLE_ANALYTICS_ID = 'G-JMT1Z50SPS'

const theme = {
  colors: {
    primary: '#06b6d4',
    primaryHover: '#0891b2',
    surface: '#ffffff',
    surfaceHover: '#fafafa',
    border: '#e5e5e5',
    borderHover: '#d4d4d4',
    text: '#171717',
    textMuted: '#525252',
    overlay: 'rgba(10, 10, 10, 0.58)',
    switchTrack: '#d4d4d4',
    switchTrackActive: '#06b6d4',
    switchThumb: '#ffffff',
  },
  dark: {
    primary: '#22d3ee',
    primaryHover: '#06b6d4',
    surface: '#171717',
    surfaceHover: '#0a0a0a',
    border: '#262626',
    borderHover: '#404040',
    text: '#fafafa',
    textMuted: '#a3a3a3',
    overlay: 'rgba(0, 0, 0, 0.72)',
    switchTrack: '#404040',
    switchTrackActive: '#22d3ee',
    switchThumb: '#ffffff',
  },
  typography: {
    fontFamily:
      "'Inter', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
    fontSize: {
      sm: '0.8125rem',
      base: '0.9375rem',
      lg: '1rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
    },
    lineHeight: {
      tight: '1.2',
      normal: '1.45',
      relaxed: '1.6',
    },
  },
  radius: {
    md: '0.5rem',
    lg: '0.75rem',
  },
  shadows: {
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
    lg: '0 20px 35px -18px rgba(0, 0, 0, 0.35)',
  },
  consentActions: {
    default: { mode: 'stroke' },
    accept: { variant: 'neutral', mode: 'filled' },
    customize: { variant: 'primary', mode: 'filled' },
    reject: { variant: 'neutral', mode: 'filled' },
  },
  slots: {
    consentBanner: {
      style: {
        '--consent-banner-max-width': '25rem',
      },
    },
    consentBannerCard:
      'w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-gray-900',
    consentBannerHeader:
      'gap-2 px-4 pt-4 pb-3 text-gray-600 dark:text-gray-400 sm:px-5 [&_a]:whitespace-nowrap [&_a]:font-medium [&_a]:text-cyan-700 [&_a]:underline [&_a]:decoration-cyan-500/35 [&_a]:underline-offset-3 [&_a]:transition-colors [&_a:hover]:decoration-cyan-500 [&_a:focus-visible]:decoration-cyan-500 dark:[&_a]:text-cyan-300 dark:[&_a]:decoration-cyan-400/40 dark:[&_a:hover]:decoration-cyan-300 dark:[&_a:focus-visible]:decoration-cyan-300',
    consentBannerTitle:
      'text-sm font-semibold tracking-[-0.02em] text-gray-950 dark:text-gray-50',
    consentBannerDescription: 'text-[13px] leading-5',
    consentBannerFooter:
      'border-t border-gray-200 bg-gray-50/80 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/80 sm:px-5',
    consentBannerFooterSubGroup: 'gap-2',
    consentBannerTag:
      'rounded-t-lg rounded-b-none border border-cyan-500/25 border-b-gray-200 bg-white px-3 py-1 text-[10px] font-medium tracking-[0.16em] text-cyan-700 shadow-none dark:border-cyan-400/25 dark:border-b-gray-800 dark:bg-gray-900 dark:text-cyan-300',
    consentDialog:
      'px-3 py-6 sm:px-6 sm:py-10 backdrop-blur-[3px] supports-[backdrop-filter]:bg-transparent',
    consentDialogCard:
      'overflow-visible rounded-lg border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900',
    consentDialogHeader:
      'gap-2 border-b border-gray-200 bg-gray-50/80 px-5 py-4 text-gray-600 dark:border-gray-800 dark:bg-gray-950/70 dark:text-gray-400 [&_a]:whitespace-nowrap [&_a]:font-medium [&_a]:text-cyan-700 [&_a]:underline [&_a]:decoration-cyan-500/35 [&_a]:underline-offset-3 [&_a]:transition-colors [&_a:hover]:decoration-cyan-500 [&_a:focus-visible]:decoration-cyan-500 dark:[&_a]:text-cyan-300 dark:[&_a]:decoration-cyan-400/40 dark:[&_a:hover]:decoration-cyan-300 dark:[&_a:focus-visible]:decoration-cyan-300',
    consentDialogTitle:
      'text-base font-semibold tracking-[-0.02em] text-gray-950 dark:text-gray-50',
    consentDialogDescription: 'max-w-[56ch] text-[13px] leading-5',
    consentDialogContent:
      'data-[testid=consent-dialog-content]:px-5 data-[testid=consent-dialog-content]:py-4',
    consentDialogTag:
      'rounded-t-none rounded-b-lg border border-cyan-500/25 border-t-0 bg-white px-3 py-1 text-[10px] font-medium tracking-[0.16em] text-cyan-700 shadow-none dark:border-cyan-400/25 dark:bg-gray-900 dark:text-cyan-300',
    consentWidget:
      'gap-4 [&_[data-testid=consent-widget-footer]]:mt-1 [&_[data-testid=consent-widget-footer]]:pt-4',
    consentWidgetAccordion: 'gap-3',
    consentWidgetFooter: 'items-center gap-3 sm:items-end',
    buttonPrimary: {
      noStyle: true,
      className:
        'inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-cyan-500 bg-cyan-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:border-cyan-600 hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-cyan-400 dark:bg-cyan-400 dark:text-gray-950 dark:hover:border-cyan-300 dark:hover:bg-cyan-300 dark:focus-visible:ring-cyan-400/60 dark:focus-visible:ring-offset-gray-900',
    },
    buttonSecondary: {
      noStyle: true,
      className:
        'inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-gray-300 bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus-visible:ring-cyan-400/40 dark:focus-visible:ring-offset-gray-900',
    },
    toggle:
      'data-[state=checked]:bg-cyan-500 dark:data-[state=checked]:bg-cyan-400',
  },
} satisfies Theme

export function ConsentManagerShell({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ConsentManagerProvider
      options={{
        mode: 'offline',
        consentCategories: ['necessary', 'marketing'],
        scripts: [
          gtag({
            id: GOOGLE_ANALYTICS_ID,
            category: 'marketing',
          }),
        ],
        legalLinks: {
          privacyPolicy: { href: '/privacy', target: '_self' },
          termsOfService: { href: '/terms', target: '_self' },
        },
        theme,
      }}
    >
      <ConsentAwareIntegrations />
      {children}
      <ConsentBanner
        legalLinks={['privacyPolicy', 'termsOfService']}
        layout={[['accept', 'reject'], 'customize']}
        primaryButton="customize"
      />
      <ConsentDialog
        hideBranding={false}
        legalLinks={['privacyPolicy', 'termsOfService']}
      />
    </ConsentManagerProvider>
  )
}

export function ConsentPreferencesLink({
  children = 'Manage Privacy Preferences',
  className,
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <ConsentDialogLink
      className={`cursor-pointer border-0 bg-transparent p-0 text-left hover:underline ${className ?? ''}`}
    >
      {children}
    </ConsentDialogLink>
  )
}

function ConsentAwareIntegrations() {
  const { has } = useConsentManager()
  const hasMarketingConsent = has('marketing')

  useHubSpotChat({ enabled: hasMarketingConsent })

  return null
}
