import * as React from 'react'
import { useLocation } from '@tanstack/react-router'
import { useScript } from './useScript'

/**
 * Configuration for HubSpot chat widget
 */
export interface HubSpotChatConfig {
  /**
   * Whether the integration is allowed to load at all.
   * Useful for consent-gating third-party chat widgets.
   * @default true
   */
  enabled?: boolean
  /**
   * Array of path patterns where HubSpot should load.
   * Can be exact paths or path prefixes (e.g., '/paid-support' or '/workshops')
   * @default ['/paid-support', '/workshops']
   */
  enabledPaths?: string[]
  /**
   * HubSpot script source URL
   * @default '//js-na1.hs-scripts.com/45982155.js'
   */
  scriptSrc?: string
  /**
   * HubSpot script ID
   * @default 'hs-script-loader'
   */
  scriptId?: string
}

const defaultConfig = {
  enabled: true,
  enabledPaths: ['/paid-support', '/workshops'],
  scriptSrc: '//js-na1.hs-scripts.com/45982155.js',
  scriptId: 'hs-script-loader',
}

/**
 * Hook to conditionally load HubSpot chat widget based on current route
 * @param config Optional configuration object to override defaults
 */
export function useHubSpotChat(config?: HubSpotChatConfig) {
  const location = useLocation()
  const { enabled, enabledPaths, scriptSrc, scriptId } = {
    ...defaultConfig,
    ...config,
  }

  const shouldLoad = React.useMemo(() => {
    if (!enabled) {
      return false
    }

    return enabledPaths.some((path) => {
      // Exact match
      if (location.pathname === path) {
        return true
      }
      // Prefix match (e.g., '/paid-support' matches '/paid-support/anything')
      if (location.pathname.startsWith(path + '/')) {
        return true
      }
      return false
    })
  }, [enabled, location.pathname, enabledPaths])

  React.useEffect(() => {
    if (shouldLoad) {
      return
    }

    document.getElementById(scriptId)?.remove()
    document
      .querySelectorAll(
        '#hubspot-messages-iframe-container, [id^="hubspot-"], [class*="hubspot"]',
      )
      .forEach((node) => node.remove())
  }, [scriptId, shouldLoad])

  // Only load the script if we should load the chat widget
  useScript(
    shouldLoad
      ? {
          id: scriptId,
          async: true,
          defer: true,
          src: scriptSrc,
        }
      : null,
  )
}
