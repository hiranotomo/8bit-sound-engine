export type Route = 'presets' | 'library' | 'compose'

type RouteHandler = (container: HTMLElement) => void | Promise<void>

const routes: Record<string, RouteHandler> = {}
let currentRoute: Route | null = null
let currentHash: string | null = null
let container: HTMLElement | null = null

export function registerRoute(name: Route, handler: RouteHandler) {
  routes[name] = handler
}

export function startRouter(el: HTMLElement) {
  container = el

  const navigate = () => {
    const rawHash = location.hash.slice(1) || 'presets'
    if (rawHash === currentHash) return
    currentHash = rawHash
    const route = rawHash.split('?')[0] as Route
    currentRoute = route
    if (container) {
      container.innerHTML = ''
      routes[route]?.(container)
    }
    document.querySelectorAll('[data-tab]').forEach(t =>
      t.classList.toggle('active', (t as HTMLElement).dataset.tab === route)
    )
  }

  window.addEventListener('hashchange', navigate)
  navigate()
}

export function getCurrentRoute(): Route | null {
  return currentRoute
}
