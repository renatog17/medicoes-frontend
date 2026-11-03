import { useSyncExternalStore } from 'react'
import { sectionFromPath } from '../config/routes.js'

const navigationEvent = 'app:navigate'

function subscribe(onChange) {
  window.addEventListener('popstate', onChange)
  window.addEventListener(navigationEvent, onChange)
  return () => {
    window.removeEventListener('popstate', onChange)
    window.removeEventListener(navigationEvent, onChange)
  }
}

export function navigate(path, { replace = false } = {}) {
  if (window.location.pathname === path) return
  window.history[replace ? 'replaceState' : 'pushState']({}, '', path)
  window.dispatchEvent(new Event(navigationEvent))
}

export function useRouter() {
  const pathname = useSyncExternalStore(subscribe, () => window.location.pathname)
  return { pathname, section: sectionFromPath(pathname) }
}
