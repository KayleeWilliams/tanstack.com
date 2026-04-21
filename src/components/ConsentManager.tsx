import * as React from 'react'
import {
  ConsentBanner,
  ConsentDialog,
  ConsentDialogLink,
  ConsentManagerProvider,
  type Theme,
} from '@c15t/react'
import { gtag } from '@c15t/scripts/google-tag'

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ')
}

const surfaceCard =
  'border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900'
const headerLinkStyles =
  '[&_a]:whitespace-nowrap [&_a]:font-medium [&_a]:text-cyan-700 [&_a]:underline [&_a]:decoration-cyan-500/35 [&_a]:underline-offset-3 [&_a]:transition-colors [&_a:hover]:decoration-cyan-500 [&_a:focus-visible]:decoration-cyan-500 dark:[&_a]:text-cyan-300 dark:[&_a]:decoration-cyan-400/40 dark:[&_a:hover]:decoration-cyan-300 dark:[&_a:focus-visible]:decoration-cyan-300'
const consentTitle = 'font-semibold tracking-[-0.02em] text-gray-950 dark:text-gray-50'
const consentCopy = 'text-[13px] leading-5'
const brandTagBase =
  'border border-cyan-500/25 bg-white px-3 py-1 text-[10px] font-medium tracking-[0.16em] !text-cyan-700 shadow-none [&_*]:!text-cyan-700 dark:border-cyan-400/25 dark:bg-gray-900 dark:!text-cyan-300 dark:[&_*]:!text-cyan-300'
const buttonBase =
  'inline-flex min-h-9 items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
const buttonPrimaryFocus =
  'focus-visible:ring-cyan-500/60 focus-visible:ring-offset-white dark:focus-visible:ring-cyan-400/60 dark:focus-visible:ring-offset-gray-900'
const buttonSecondaryFocus =
  'focus-visible:ring-cyan-500/40 focus-visible:ring-offset-white dark:focus-visible:ring-cyan-400/40 dark:focus-visible:ring-offset-gray-900'

const theme = {
  colors: {
    primary: 'var(--color-cyan-500, #06b6d4)',
    primaryHover: 'var(--color-cyan-600, #0891b2)',
    surface: 'var(--color-white, #ffffff)',
    surfaceHover: 'var(--color-gray-50, #fafafa)',
    border: 'var(--color-gray-200, #e5e5e5)',
    borderHover: 'var(--color-gray-300, #d4d4d4)',
    text: 'var(--color-gray-900, #171717)',
    textMuted: 'var(--color-gray-600, #525252)',
    overlay: 'rgba(10, 10, 10, 0.58)',
    switchTrack: 'var(--color-gray-300, #d4d4d4)',
    switchTrackActive: 'var(--color-cyan-500, #06b6d4)',
    switchThumb: 'var(--color-white, #ffffff)',
  },
  dark: {
    primary: 'var(--color-cyan-400, #22d3ee)',
    primaryHover: 'var(--color-cyan-500, #06b6d4)',
    surface: 'var(--color-gray-900, #171717)',
    surfaceHover: 'var(--color-gray-950, #0a0a0a)',
    border: 'var(--color-gray-800, #262626)',
    borderHover: 'var(--color-gray-700, #404040)',
    text: 'var(--color-gray-50, #fafafa)',
    textMuted: 'var(--color-gray-400, #a3a3a3)',
    overlay: 'rgba(0, 0, 0, 0.72)',
    switchTrack: 'var(--color-gray-700, #404040)',
    switchTrackActive: 'var(--color-cyan-400, #22d3ee)',
    switchThumb: 'var(--color-white, #ffffff)',
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
    md: 'var(--shadow-lg)',
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
    consentBannerCard: cx('w-full overflow-hidden rounded-lg shadow-md', surfaceCard),
    consentBannerHeader: cx(
      'gap-2 px-4 pt-4 pb-3 text-gray-600 dark:text-gray-400 sm:px-5',
      headerLinkStyles,
    ),
    consentBannerTitle: cx('text-sm', consentTitle),
    consentBannerDescription: consentCopy,
    consentBannerFooter:
      'border-t border-gray-200 bg-gray-50/80 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/80 sm:px-5',
    consentBannerFooterSubGroup: 'gap-2',
    consentBannerTag: cx(
      'rounded-t-lg rounded-b-none border-b-gray-200 dark:border-b-gray-800',
      brandTagBase,
    ),
    consentDialog:
      'px-3 py-6 sm:px-6 sm:py-10 backdrop-blur-[3px] supports-[backdrop-filter]:bg-transparent',
    consentDialogCard: cx('overflow-hidden rounded-lg shadow-2xl', surfaceCard),
    consentDialogHeader: cx(
      'gap-2 border-b border-gray-200 bg-gray-50/80 px-5 py-4 text-gray-600 dark:border-gray-800 dark:bg-gray-950/70 dark:text-gray-400',
      headerLinkStyles,
    ),
    consentDialogTitle: cx('text-base', consentTitle),
    consentDialogDescription: cx('max-w-[56ch]', consentCopy),
    consentDialogContent:
      'data-[testid=consent-dialog-content]:px-5 data-[testid=consent-dialog-content]:py-4',
    consentDialogTag: cx(
      '!relative !right-auto !bottom-auto !translate-y-0 self-end rounded-t-none rounded-b-lg border-t-0',
      brandTagBase,
    ),
    consentWidget:
      'gap-4 [&_[data-testid=consent-widget-footer]]:mt-1 [&_[data-testid=consent-widget-footer]]:pt-4',
    consentWidgetAccordion: 'gap-3',
    consentWidgetFooter: 'items-center gap-3 sm:items-end',
    buttonPrimary: {
      noStyle: true,
      className: cx(
        buttonBase,
        buttonPrimaryFocus,
        'border border-cyan-500 bg-cyan-500 text-white hover:border-cyan-600 hover:bg-cyan-600 dark:border-cyan-400 dark:bg-cyan-400 dark:text-gray-950 dark:hover:border-cyan-300 dark:hover:bg-cyan-300',
      ),
    },
    buttonSecondary: {
      noStyle: true,
      className: cx(
        buttonBase,
        buttonSecondaryFocus,
        'border border-gray-300 bg-gray-100 text-gray-700 hover:border-gray-400 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-gray-600 dark:hover:bg-gray-700',
      ),
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
        consentCategories: ['necessary', 'measurement'],
        scripts: [
          gtag({
            id: 'G-JMT1Z50SPS',
            category: 'measurement',
          }),
          {
            id: 'hs-script-loader',
            src: 'https://js.hs-scripts.com/45982155.js',
            category: 'measurement',
            async: true,
            defer: true,
            target: 'body',
          },
        ],
        legalLinks: {
          privacyPolicy: { href: '/privacy', target: '_self' },
          termsOfService: { href: '/terms', target: '_self' },
        },
        theme,
      }}
    >
      {children}
      <ConsentBanner
        legalLinks={['privacyPolicy', 'termsOfService']}
        layout={[['accept', 'reject'], 'customize']}
        primaryButton="customize"
      />
      <ConsentDialog legalLinks={['privacyPolicy', 'termsOfService']} />
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
