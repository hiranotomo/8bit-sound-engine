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
const layerNames: Record<string, string[]> = {
  office: ['MELODY', 'BASS', 'HARMONY', 'RHYTHM'],
  nature: ['MELODY', 'BASS', 'HARMONY', 'ARPEGGIO']
}
let currentBGM: string | null = null

const layerPanel = document.getElementById('layer-panel')

document.querySelectorAll('[data-bgm]').forEach(btn => {
  btn.addEventListener('click', async () => {
    await engine.resume()
    const name = (btn as HTMLElement).dataset.bgm!
    if (name === 'stop') {
      engine.bgm.stop({ fade: 300 })
      currentBGM = null
      updateNowPlaying()
      updateLayerPanel()
      return
    }
    const def = bgms[name as keyof typeof bgms]
    if (currentBGM) {
      engine.bgm.changeTo(def, { fade: 500 })
    } else {
      engine.bgm.play(def)
    }
    currentBGM = name
    updateNowPlaying()
    updateLayerPanel()
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

// --- Layer Toggle Controls ---

function updateLayerPanel() {
  if (!layerPanel) return
  if (!currentBGM) {
    layerPanel.style.display = 'none'
    return
  }
  layerPanel.style.display = 'block'
  const names = layerNames[currentBGM] || ['CH 0', 'CH 1', 'CH 2', 'CH 3']
  for (let i = 0; i < 4; i++) {
    const btn = document.getElementById(`layer-${i}`)
    if (btn) {
      btn.classList.add('active')
      btn.innerHTML = `<span class="layer-indicator on"></span> ${names[i]}`
    }
  }
}

document.querySelectorAll('[data-layer]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!currentBGM) return
    const idx = parseInt((btn as HTMLElement).dataset.layer!)
    const muted = engine.bgm.toggleChannel(idx)
    btn.classList.toggle('active', !muted)
    const indicator = btn.querySelector('.layer-indicator')
    if (indicator) {
      indicator.classList.toggle('on', !muted)
    }
  })
})

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
