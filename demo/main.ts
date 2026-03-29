import { createSoundEngine } from '../src/index'
import { overworld as overworldBGM } from './bgm/overworld'
import { dungeon as dungeonBGM } from './bgm/dungeon'
import { battle as battleBGM } from './bgm/battle'
import './style.css'

const engine = createSoundEngine()

// --- BGM Controls ---

const bgms = { overworld: overworldBGM, dungeon: dungeonBGM, battle: battleBGM }
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
  })
})

// --- SE Controls ---

document.querySelectorAll('[data-se]').forEach(btn => {
  btn.addEventListener('click', async () => {
    await engine.resume()
    const name = (btn as HTMLElement).dataset.se!
    engine.se.play(name)
    // Flash effect
    btn.classList.add('active')
    setTimeout(() => btn.classList.remove('active'), 150)
  })
})

// --- Now Playing Display ---

function updateNowPlaying() {
  const el = document.getElementById('now-playing')
  if (el) {
    if (currentBGM) {
      el.innerHTML = `NOW PLAYING: ${currentBGM.toUpperCase()} <span class="notes">&#9835;&#9835;&#9835;</span>`
    } else {
      el.textContent = 'STOPPED'
    }
  }
  // Update active button states
  document.querySelectorAll('[data-bgm]').forEach(btn => {
    const name = (btn as HTMLElement).dataset.bgm
    btn.classList.toggle('playing', name === currentBGM)
  })
}

// --- Channel Visualization (simple random animation) ---

const channelBars = document.querySelectorAll('.channel-bar-fill')
let animFrameId: number | null = null

function animateChannels() {
  channelBars.forEach(bar => {
    if (currentBGM) {
      const base = 20 + Math.random() * 60
      ;(bar as HTMLElement).style.width = `${base}%`
    } else {
      ;(bar as HTMLElement).style.width = '0%'
    }
  })
  animFrameId = requestAnimationFrame(animateChannels)
}

// Throttle the animation to ~10fps for a retro stepped feel
let lastAnimTime = 0
function animateChannelsThrottled(time: number) {
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
  animFrameId = requestAnimationFrame(animateChannelsThrottled)
}

animFrameId = requestAnimationFrame(animateChannelsThrottled)

// --- Background Stars ---

function createStars() {
  const container = document.querySelector('.stars')
  if (!container) return
  for (let i = 0; i < 60; i++) {
    const star = document.createElement('div')
    star.className = 'star'
    star.style.left = `${Math.random() * 100}%`
    star.style.top = `${Math.random() * 100}%`
    star.style.animationDelay = `${Math.random() * 4}s`
    star.style.opacity = `${0.1 + Math.random() * 0.5}`
    container.appendChild(star)
  }
}

createStars()
