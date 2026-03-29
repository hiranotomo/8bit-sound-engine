import { createSoundEngine } from '../src/index'
import { office as officeBGM } from './bgm/office'
import { nature as natureBGM } from './bgm/nature'
import './style.css'

const engine = createSoundEngine({
  reverb: { duration: 1.8, decay: 2.5, mix: 0.2 }
})

// --- BGM Controls ---

const bgms = { office: officeBGM, nature: natureBGM }
const bgmLabels: Record<string, string> = { office: 'Office / City', nature: 'Nature / Adventure' }
// Variation presets: each is a name + which layers are ON [melody, bass, harmony, rhythm/arpeggio]
interface Variation { name: string; layers: boolean[] }
const variations: Record<string, Variation[]> = {
  office: [
    { name: 'FULL',       layers: [true,  true,  true,  true]  },
    { name: 'HUSTLE',     layers: [false, true,  false, true]  },
    { name: 'FOCUS',      layers: [true,  false, true,  false] },
    { name: 'COFFEE',     layers: [true,  true,  false, false] },
    { name: 'ELEVATOR',   layers: [false, false, true,  true]  },
    { name: 'SOLO',       layers: [true,  false, false, false] },
  ],
  nature: [
    { name: 'FULL',       layers: [true,  true,  true,  true]  },
    { name: 'RIVERSIDE',  layers: [false, true,  true,  true]  },
    { name: 'FIREFLY',    layers: [true,  false, true,  false] },
    { name: 'CAMPFIRE',   layers: [true,  true,  false, false] },
    { name: 'RAIN',       layers: [false, false, true,  true]  },
    { name: 'SOLO',       layers: [true,  false, false, false] },
  ],
}
let currentBGM: string | null = null
let currentVariation: number = -1

const variationPanel = document.getElementById('variation-panel')
const variationButtons = document.getElementById('variation-buttons')

document.querySelectorAll('[data-bgm]').forEach(btn => {
  btn.addEventListener('click', async () => {
    await engine.resume()
    const name = (btn as HTMLElement).dataset.bgm!
    if (name === 'stop') {
      engine.bgm.stop({ fade: 300 })
      currentBGM = null
      currentVariation = -1
      updateNowPlaying()
      updateVariationPanel()
      return
    }
    const def = bgms[name as keyof typeof bgms]
    if (currentBGM) {
      engine.bgm.changeTo(def, { fade: 500 })
    } else {
      engine.bgm.play(def)
    }
    currentBGM = name
    currentVariation = -1
    updateNowPlaying()
    updateVariationPanel()
    // Auto-select FULL (first button) on start
    setTimeout(() => applyVariation(0), currentBGM ? 600 : 100)
    spawnFloatingNote()
  })
})

// --- SE Controls ---

document.querySelectorAll('[data-se]').forEach(btn => {
  btn.addEventListener('click', async () => {
    await engine.resume()
    const name = (btn as HTMLElement).dataset.se!
    engine.se.play(name)
    btn.classList.add('active')
    setTimeout(() => btn.classList.remove('active'), 150)
    spawnFloatingNote()
  })
})

// --- Now Playing Display ---

function updateNowPlaying() {
  const el = document.getElementById('now-playing')
  if (el) {
    if (currentBGM) {
      const label = bgmLabels[currentBGM] || currentBGM.toUpperCase()
      el.innerHTML = `<span class="now-playing-text">Now Playing: ${label} &#9835;</span>`
    } else {
      el.innerHTML = '<span class="now-playing-text">Silence...</span>'
    }
  }
  document.querySelectorAll('[data-bgm]').forEach(btn => {
    const name = (btn as HTMLElement).dataset.bgm
    btn.classList.toggle('playing', name === currentBGM)
  })
}

// --- Channel Visualization ---

const channelBars = document.querySelectorAll('.channel-bar-fill')
let lastAnimTime = 0

function animateChannels(time: number) {
  if (time - lastAnimTime > 100) {
    lastAnimTime = time
    channelBars.forEach(bar => {
      if (currentBGM) {
        const base = 15 + Math.random() * 70
        ;(bar as HTMLElement).style.width = `${base}%`
      } else {
        ;(bar as HTMLElement).style.width = '0%'
      }
    })
  }
  requestAnimationFrame(animateChannels)
}

requestAnimationFrame(animateChannels)

// --- Floating Music Notes ---

const noteSymbols = ['♪', '♫', '♬', '♩']

function spawnFloatingNote() {
  const container = document.getElementById('floating-notes')
  if (!container) return

  const note = document.createElement('div')
  note.className = 'music-note'
  note.textContent = noteSymbols[Math.floor(Math.random() * noteSymbols.length)]
  note.style.left = `${20 + Math.random() * 60}%`
  note.style.bottom = `${20 + Math.random() * 20}%`
  note.style.fontSize = `${14 + Math.random() * 10}px`
  container.appendChild(note)

  setTimeout(() => note.remove(), 3000)
}

// Spawn notes periodically when BGM is playing
setInterval(() => {
  if (currentBGM) spawnFloatingNote()
}, 2000)

// --- Variation Controls ---

function updateVariationPanel() {
  if (!variationPanel || !variationButtons) return
  if (!currentBGM) {
    variationPanel.style.display = 'none'
    return
  }
  variationPanel.style.display = 'block'
  const vars = variations[currentBGM] || []
  variationButtons.innerHTML = ''
  vars.forEach((v, i) => {
    const btn = document.createElement('button')
    btn.className = 'layer-btn'
    btn.textContent = v.name
    btn.addEventListener('click', () => applyVariation(i))
    variationButtons.appendChild(btn)
  })
}

function applyVariation(index: number) {
  if (!currentBGM) return
  const vars = variations[currentBGM]
  if (!vars || !vars[index]) return
  currentVariation = index
  const v = vars[index]
  for (let i = 0; i < v.layers.length; i++) {
    engine.bgm.setChannelMute(i, !v.layers[i])
  }
  // Update button highlight
  if (variationButtons) {
    Array.from(variationButtons.children).forEach((btn, i) => {
      btn.classList.toggle('current', i === index)
    })
  }
}

// --- Mixer Controls ---

function formatPan(value: number): string {
  if (value === 0) return 'C'
  return value > 0 ? `R ${value}` : `L ${Math.abs(value)}`
}

const reverbSlider = document.getElementById('reverb-mix') as HTMLInputElement
const reverbValue = document.getElementById('reverb-value')
reverbSlider?.addEventListener('input', () => {
  const val = parseInt(reverbSlider.value)
  engine.setReverbMix(val / 100)
  if (reverbValue) reverbValue.textContent = `${val}%`
})

const melodyPanSlider = document.getElementById('melody-pan') as HTMLInputElement
const melodyPanValue = document.getElementById('melody-pan-value')
melodyPanSlider?.addEventListener('input', () => {
  const val = parseInt(melodyPanSlider.value)
  engine.bgm.setChannelPan(0, val / 100)
  if (melodyPanValue) melodyPanValue.textContent = formatPan(val)
})

const bassPanSlider = document.getElementById('bass-pan') as HTMLInputElement
const bassPanValue = document.getElementById('bass-pan-value')
bassPanSlider?.addEventListener('input', () => {
  const val = parseInt(bassPanSlider.value)
  engine.bgm.setChannelPan(1, val / 100)
  if (bassPanValue) bassPanValue.textContent = formatPan(val)
})
