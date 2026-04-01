import { composeSong, fetchSong, type ComposeResponse } from '../api'
import { playSong, stopSong } from '../player'
import type { BGMDefinition } from '../../src/types'

export async function composeView(container: HTMLElement) {
  const wrapper = document.createElement('div')
  wrapper.className = 'view-compose'

  // Check for remix base
  const hashParams = new URLSearchParams(location.hash.split('?')[1] || '')
  const baseId = hashParams.get('base')
  let baseDef: BGMDefinition | undefined
  let baseTitle = ''

  wrapper.innerHTML = `
    <div class="view-header">
      <h2 class="view-title">&#9998; COMPOSE</h2>
      <div class="how-to-use">
        <p><strong>1.</strong> Describe your song's mood, style, and tempo below.</p>
        <p><strong>2.</strong> Click COMPOSE — AI generates a unique chiptune BGM.</p>
        <p><strong>3.</strong> Listen, then find it in the LIBRARY tab.</p>
        <p class="how-to-example">Try: "peaceful snowy village, slow and magical" or "intense boss battle, fast and aggressive"</p>
      </div>
    </div>
    <div id="remix-banner" class="remix-banner" style="display:none;"></div>
    <div class="wood-panel">
      <div class="panel-content">
        <textarea id="compose-prompt" class="compose-textarea" placeholder="cheerful morning forest, gentle and cozy..." rows="3" maxlength="500"></textarea>
        <div class="compose-actions">
          <button id="compose-btn" class="game-btn btn-forest compose-btn">&#9835; COMPOSE</button>
          <span id="compose-chars" class="compose-chars">0/500</span>
        </div>
      </div>
    </div>
    <div id="compose-loading" class="compose-loading" style="display:none;">
      <div class="compose-progress wood-panel">
        <div class="panel-content">
          <div class="progress-notes">
            <span class="prog-note prog-note-1">&#9835;</span>
            <span class="prog-note prog-note-2">&#9834;</span>
            <span class="prog-note prog-note-3">&#9835;</span>
            <span class="prog-note prog-note-4">&#9834;</span>
            <span class="prog-note prog-note-5">&#9835;</span>
          </div>
          <div id="progress-step" class="progress-step">Analyzing prompt...</div>
          <div class="progress-bar-track">
            <div id="progress-bar-fill" class="progress-bar-fill"></div>
          </div>
          <div class="progress-hint">Usually takes 10-20 seconds</div>
        </div>
      </div>
    </div>
    <div id="compose-error" class="compose-error" style="display:none;"></div>
    <div id="compose-result" class="compose-result" style="display:none;">
      <div class="wood-panel">
        <div class="panel-content">
          <div class="result-header">
            <span id="result-title" class="card-title"></span>
            <div id="result-tags" class="card-tags"></div>
          </div>
          <div class="result-actions">
            <button id="result-play" class="game-btn btn-forest">&#9654; PLAY</button>
            <button id="result-stop" class="game-btn btn-stop" style="display:none;">&#9632; STOP</button>
            <button id="result-again" class="game-btn">&#9998; NEW</button>
            <button id="result-publish" class="game-btn btn-cave">&#9733; LIBRARY</button>
          </div>
        </div>
      </div>
    </div>
  `

  container.appendChild(wrapper)

  // Elements
  const prompt = wrapper.querySelector('#compose-prompt') as HTMLTextAreaElement
  const composeBtn = wrapper.querySelector('#compose-btn') as HTMLButtonElement
  const charsSpan = wrapper.querySelector('#compose-chars') as HTMLSpanElement
  const loadingEl = wrapper.querySelector('#compose-loading') as HTMLElement
  const errorEl = wrapper.querySelector('#compose-error') as HTMLElement
  const resultEl = wrapper.querySelector('#compose-result') as HTMLElement
  const remixBanner = wrapper.querySelector('#remix-banner') as HTMLElement
  const resultTitle = wrapper.querySelector('#result-title') as HTMLElement
  const resultTags = wrapper.querySelector('#result-tags') as HTMLElement
  const playBtn = wrapper.querySelector('#result-play') as HTMLButtonElement
  const stopBtn = wrapper.querySelector('#result-stop') as HTMLButtonElement
  const againBtn = wrapper.querySelector('#result-again') as HTMLButtonElement
  const publishBtn = wrapper.querySelector('#result-publish') as HTMLButtonElement

  let currentResult: ComposeResponse | null = null
  let isPlaying = false

  // Char counter
  prompt.addEventListener('input', () => {
    charsSpan.textContent = `${prompt.value.length}/500`
  })

  // Load remix base if present
  if (baseId) {
    try {
      const song = await fetchSong(baseId)
      baseDef = song.definition
      baseTitle = song.meta.title
      remixBanner.style.display = 'block'
      remixBanner.innerHTML = `&#9835; Remixing: <strong>${baseTitle}</strong>`
      prompt.placeholder = `How to modify "${baseTitle}"...`
    } catch {
      remixBanner.style.display = 'block'
      remixBanner.innerHTML = 'Could not load base song'
    }
  }

  // Compose
  composeBtn.addEventListener('click', async () => {
    const text = prompt.value.trim()
    if (!text) return

    composeBtn.disabled = true
    loadingEl.style.display = 'block'
    errorEl.style.display = 'none'
    resultEl.style.display = 'none'
    stopSong()
    isPlaying = false

    // Animated progress steps
    const progressStep = wrapper.querySelector('#progress-step') as HTMLElement
    const progressBar = wrapper.querySelector('#progress-bar-fill') as HTMLElement
    const steps = [
      { text: 'Analyzing prompt...', pct: 10 },
      { text: 'Choosing key and tempo...', pct: 25 },
      { text: 'Composing melody...', pct: 45 },
      { text: 'Adding bass line...', pct: 60 },
      { text: 'Building harmony...', pct: 75 },
      { text: 'Creating variations...', pct: 90 },
    ]
    let stepIndex = 0
    progressStep.textContent = steps[0].text
    progressBar.style.width = '5%'
    const stepTimer = setInterval(() => {
      if (stepIndex < steps.length) {
        progressStep.textContent = steps[stepIndex].text
        progressBar.style.width = `${steps[stepIndex].pct}%`
        stepIndex++
      }
    }, 2500)

    try {
      const result = await composeSong({
        prompt: text,
        base: baseDef,
      })
      clearInterval(stepTimer)
      progressBar.style.width = '100%'
      progressStep.textContent = 'Done!'

      currentResult = result

      // Show result
      resultTitle.textContent = result.meta.title
      resultTags.innerHTML = result.meta.tags
        .map(t => `<span class="tag">${t}</span>`)
        .join('')

      resultEl.style.display = 'block'

      // Auto-play
      playSong(result.definition, result.meta.title)
      isPlaying = true
      playBtn.style.display = 'none'
      stopBtn.style.display = 'inline-block'
    } catch (err: any) {
      clearInterval(stepTimer)
      errorEl.style.display = 'block'
      errorEl.innerHTML = `
        <div class="error-panel">
          <p class="error-message">${err.message || 'Composition failed'}</p>
          <button class="game-btn btn-battle error-retry">RETRY</button>
        </div>
      `
      errorEl.querySelector('.error-retry')?.addEventListener('click', () => {
        composeBtn.click()
      })
    } finally {
      composeBtn.disabled = false
      loadingEl.style.display = 'none'
    }
  })

  // Play/Stop
  playBtn.addEventListener('click', () => {
    if (!currentResult) return
    playSong(currentResult.definition, currentResult.meta.title)
    isPlaying = true
    playBtn.style.display = 'none'
    stopBtn.style.display = 'inline-block'
  })

  stopBtn.addEventListener('click', () => {
    stopSong()
    isPlaying = false
    playBtn.style.display = 'inline-block'
    stopBtn.style.display = 'none'
  })

  // New composition
  againBtn.addEventListener('click', () => {
    stopSong()
    isPlaying = false
    currentResult = null
    resultEl.style.display = 'none'
    errorEl.style.display = 'none'
    prompt.value = ''
    charsSpan.textContent = '0/500'
    prompt.focus()
  })

  // Go to library
  publishBtn.addEventListener('click', () => {
    location.hash = '#library'
  })
}
