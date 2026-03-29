import { createSoundEngine } from '../src/index'
import { office as officeBGM } from './bgm/office'
import { nature as natureBGM } from './bgm/nature'
import './style.css'

const engine = createSoundEngine()

// --- BGM Controls ---

const bgms = { office: officeBGM, nature: natureBGM }
const bgmLabels: Record<string, string> = { office: 'Office / City', nature: 'Nature / Adventure' }
let currentBGM: string | null = null

document.querySelectorAll('[data-bgm]').forEach(btn => {
  btn.addEventListener('click', async () => {
    await engine.resume()
    const name = (btn as HTMLElement).dataset.bgm!
    if (name === 'stop') {
      engine.bgm.stop({ fade: 300 })
      currentBGM = null
      updateNowPlaying()
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
