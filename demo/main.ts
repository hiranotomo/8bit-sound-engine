import { registerRoute, startRouter } from './router'
import { presetsView } from './views/presets'
import { libraryView } from './views/library'
import { composeView } from './views/compose'
import { initPlayer } from './player'
import './style.css'

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
