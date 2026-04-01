export type Route = 'presets' | 'library' | 'compose'

type RouteHandler = (container: HTMLElement) => void | Promise<void>

const routes: Record<string, RouteHandler> = {}
let currentRoute: Route | null = null
let container: HTMLElement | null = null

export function registerRoute(name: Route, handler: RouteHandler) {
  routes[name] = handler
}

export function startRouter(el: HTMLElement) {
  container = el

  const navigate = () => {
    const rawHash = location.hash.slice(1) || 'presets'
    const route = rawHash.split('?')[0] as Route
    if (route === currentRoute) return
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
