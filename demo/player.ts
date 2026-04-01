import { createSoundEngine, type BGMDefinition, type Variation } from '../src/index'

const engine = createSoundEngine({
  reverb: { duration: 1.8, decay: 2.5, mix: 0.2 }
})

let currentDefinition: BGMDefinition | null = null
let currentTitle: string | null = null
let currentVariation = -1
let isPlaying = false

// --- Public API ---

export async function playSong(definition: BGMDefinition, title: string) {
  await engine.resume()
  if (isPlaying) {
    engine.bgm.changeTo(definition, { fade: 500 })
  } else {
    engine.bgm.play(definition)
  }
  currentDefinition = definition
  currentTitle = title
  isPlaying = true
  currentVariation = -1
  updatePlayerUI()
  // Auto-select FULL
  setTimeout(() => applyVariation(0), isPlaying ? 600 : 100)
}

export function stopSong() {
  engine.bgm.stop({ fade: 300 })
  currentDefinition = null
  currentTitle = null
  isPlaying = false
  currentVariation = -1
  updatePlayerUI()
}

export async function playSE(name: string) {
  await engine.resume()
  engine.se.play(name)
}

export function getEngine() {
  return engine
}

export function isCurrentlyPlaying(): boolean {
  return isPlaying
}

export function getCurrentTitle(): string | null {
  return currentTitle
}

// --- Player UI ---

function getVariations(): Variation[] {
  if (!currentDefinition) return []
  return currentDefinition.variations || []
}

function applyVariation(index: number) {
  if (!currentDefinition) return
  const vars = getVariations()
  if (!vars[index]) return
  currentVariation = index
  engine.bgm.setVariation(vars[index].name)
  updateVariationHighlight()
}

function updateVariationHighlight() {
  const btns = document.getElementById('variation-buttons')
  if (!btns) return
  Array.from(btns.children).forEach((btn, i) => {
    btn.classList.toggle('current', i === currentVariation)
  })
}

function updatePlayerUI() {
  // Now playing
  const nowPlaying = document.getElementById('now-playing')
  if (nowPlaying) {
    nowPlaying.innerHTML = currentTitle
      ? `<span class="now-playing-text">Now Playing: ${currentTitle} &#9835;</span>`
      : '<span class="now-playing-text">Silence...</span>'
  }

  // Variation panel
  const panel = document.getElementById('variation-panel')
  const btns = document.getElementById('variation-buttons')
  if (!panel || !btns) return

  if (!currentDefinition) {
    panel.style.display = 'none'
    return
  }

  const vars = getVariations()
  if (vars.length === 0) {
    panel.style.display = 'none'
    return
  }

  panel.style.display = 'block'
  btns.innerHTML = ''
  vars.forEach((v, i) => {
    const btn = document.createElement('button')
    btn.className = 'layer-btn'
    btn.textContent = v.name
    btn.addEventListener('click', () => applyVariation(i))
    btns.appendChild(btn)
  })
}

// --- Init player section (mixer, channels, SE, floating notes) ---

export function initPlayer() {
  // SE buttons
  document.querySelectorAll('[data-se]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const name = (btn as HTMLElement).dataset.se!
      await playSE(name)
      btn.classList.add('active')
      setTimeout(() => btn.classList.remove('active'), 150)
      spawnFloatingNote()
    })
  })

  // Stop button
  document.querySelector('[data-bgm="stop"]')?.addEventListener('click', () => {
    stopSong()
  })

  // Mixer: reverb
  const reverbSlider = document.getElementById('reverb-mix') as HTMLInputElement
  const reverbValue = document.getElementById('reverb-value')
  reverbSlider?.addEventListener('input', () => {
    const val = parseInt(reverbSlider.value)
    engine.setReverbMix(val / 100)
    if (reverbValue) reverbValue.textContent = `${val}%`
  })

  // Mixer: melody pan
  const melodyPanSlider = document.getElementById('melody-pan') as HTMLInputElement
  const melodyPanValue = document.getElementById('melody-pan-value')
  melodyPanSlider?.addEventListener('input', () => {
    const val = parseInt(melodyPanSlider.value)
    engine.bgm.setChannelPan(0, val / 100)
    if (melodyPanValue) melodyPanValue.textContent = formatPan(val)
  })

  // Mixer: bass pan
  const bassPanSlider = document.getElementById('bass-pan') as HTMLInputElement
  const bassPanValue = document.getElementById('bass-pan-value')
  bassPanSlider?.addEventListener('input', () => {
    const val = parseInt(bassPanSlider.value)
    engine.bgm.setChannelPan(1, val / 100)
    if (bassPanValue) bassPanValue.textContent = formatPan(val)
  })

  // Channel visualization
  const channelBars = document.querySelectorAll('.channel-bar-fill')
  let lastAnimTime = 0
  function animateChannels(time: number) {
    if (time - lastAnimTime > 100) {
      lastAnimTime = time
      channelBars.forEach(bar => {
        (bar as HTMLElement).style.width = isPlaying ? `${15 + Math.random() * 70}%` : '0%'
      })
    }
    requestAnimationFrame(animateChannels)
  }
  requestAnimationFrame(animateChannels)

  // Floating notes
  setInterval(() => {
    if (isPlaying) spawnFloatingNote()
  }, 2000)
}

function formatPan(value: number): string {
  if (value === 0) return 'C'
  return value > 0 ? `R ${value}` : `L ${Math.abs(value)}`
}

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
