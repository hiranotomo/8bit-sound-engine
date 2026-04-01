import { registerRoute, startRouter, forceNavigate } from './router'
import { presetsView } from './views/presets'
import { libraryView } from './views/library'
import { composeView } from './views/compose'
import { initPlayer } from './player'
import { initLang, setLang, onLangChange, t, type Lang } from './i18n'
import './style.css'

// Init i18n
initLang()

// Register tab views
registerRoute('presets', presetsView)
registerRoute('library', libraryView)
registerRoute('compose', composeView)

// Init player (SE buttons, mixer, channels, floating notes)
initPlayer()

// Start router
const tabContent = document.getElementById('tab-content')
if (tabContent) {
  startRouter(tabContent)
}

// Translate all data-t elements in the static HTML
function translateStatic() {
  document.querySelectorAll('[data-t]').forEach(el => {
    const key = (el as HTMLElement).dataset.t!
    el.textContent = t(key)
  })
}
translateStatic()

// Language switcher
document.querySelectorAll('[data-global-lang]').forEach(btn => {
  btn.addEventListener('click', () => {
    const lang = (btn as HTMLElement).dataset.globalLang as Lang
    setLang(lang)
    document.querySelectorAll('[data-global-lang]').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
  })
})

// Set active button on load
import { getLang } from './i18n'
const current = getLang()
document.querySelectorAll('[data-global-lang]').forEach(b => {
  b.classList.toggle('active', (b as HTMLElement).dataset.globalLang === current)
})

// On language change: re-translate static + re-render current view
onLangChange(() => {
  translateStatic()
  if (tabContent) forceNavigate(tabContent)
})
