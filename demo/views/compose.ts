import { composeSong, fetchSong, saveSong, type ComposeResponse } from '../api'
import { playSong, stopSong } from '../player'
import { t } from '../i18n'
import type { BGMDefinition } from '../../src/types'

export async function composeView(container: HTMLElement) {
  const wrapper = document.createElement('div')
  wrapper.className = 'view-compose'

  const hashParams = new URLSearchParams(location.hash.split('?')[1] || '')
  const baseId = hashParams.get('base')
  let baseDef: BGMDefinition | undefined
  let baseTitle = ''

  wrapper.innerHTML = `
    <div class="view-header">
      <h2 class="view-title">&#9998; ${t('compose.title')}</h2>
      <div class="how-to-use">
        <p><strong>1.</strong> ${t('compose.help.1')}</p>
        <p><strong>2.</strong> ${t('compose.help.2')}</p>
        <p><strong>3.</strong> ${t('compose.help.3')}</p>
        <p class="how-to-example">${t('compose.help.example')}</p>
      </div>
    </div>
    <div id="remix-banner" class="remix-banner" style="display:none;"></div>
    <div class="wood-panel">
      <div class="panel-content">
        <textarea id="compose-prompt" class="compose-textarea" placeholder="${t('compose.placeholder')}" rows="3" maxlength="500"></textarea>
        <div class="compose-actions">
          <button id="compose-btn" class="game-btn btn-forest compose-btn">&#9835; ${t('compose.btn')}</button>
          <span id="compose-chars" class="compose-chars">0/500</span>
          <span id="compose-remaining" class="compose-remaining"></span>
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
          <div id="progress-step" class="progress-step">${t('compose.progress.1')}</div>
          <div class="progress-bar-track">
            <div id="progress-bar-fill" class="progress-bar-fill"></div>
          </div>
          <div class="progress-hint">${t('compose.progress.hint')}</div>
        </div>
      </div>
    </div>
    <div id="compose-error" class="compose-error" style="display:none;"></div>
    <div id="compose-result" class="compose-result" style="display:none;">
      <div class="wood-panel">
        <div class="panel-content">
          <div class="result-header">
            <div class="save-field">
              <label class="save-label">${t('compose.result.title')}</label>
              <input id="result-title-input" class="save-input" type="text" maxlength="60" />
            </div>
            <div class="save-field">
              <label class="save-label">${t('compose.result.composer')}</label>
              <input id="result-composer-input" class="save-input" type="text" value="Tomo" maxlength="30" />
            </div>
            <div id="result-tags" class="card-tags"></div>
          </div>
          <div class="result-actions">
            <button id="result-play" class="game-btn btn-forest">&#9654; ${t('card.play')}</button>
            <button id="result-stop" class="game-btn btn-stop" style="display:none;">&#9632; ${t('player.stop')}</button>
            <button id="result-save" class="game-btn btn-cave">&#9733; ${t('compose.result.save')}</button>
            <button id="result-discard" class="game-btn">&#10005; ${t('compose.result.discard')}</button>
          </div>
          <div id="save-status" class="save-status" style="display:none;"></div>
        </div>
      </div>
    </div>
  `

  container.appendChild(wrapper)

  const prompt = wrapper.querySelector('#compose-prompt') as HTMLTextAreaElement
  const composeBtn = wrapper.querySelector('#compose-btn') as HTMLButtonElement
  const charsSpan = wrapper.querySelector('#compose-chars') as HTMLSpanElement
  const remainingSpan = wrapper.querySelector('#compose-remaining') as HTMLSpanElement
  const loadingEl = wrapper.querySelector('#compose-loading') as HTMLElement
  const errorEl = wrapper.querySelector('#compose-error') as HTMLElement
  const resultEl = wrapper.querySelector('#compose-result') as HTMLElement
  const remixBanner = wrapper.querySelector('#remix-banner') as HTMLElement
  const titleInput = wrapper.querySelector('#result-title-input') as HTMLInputElement
  const composerInput = wrapper.querySelector('#result-composer-input') as HTMLInputElement
  const resultTags = wrapper.querySelector('#result-tags') as HTMLElement
  const playBtn = wrapper.querySelector('#result-play') as HTMLButtonElement
  const stopBtn = wrapper.querySelector('#result-stop') as HTMLButtonElement
  const saveBtn = wrapper.querySelector('#result-save') as HTMLButtonElement
  const discardBtn = wrapper.querySelector('#result-discard') as HTMLButtonElement
  const saveStatus = wrapper.querySelector('#save-status') as HTMLElement

  let currentResult: ComposeResponse | null = null
  let isPlaying = false

  prompt.addEventListener('input', () => {
    charsSpan.textContent = `${prompt.value.length}/500`
  })

  if (baseId) {
    try {
      const song = await fetchSong(baseId)
      baseDef = song.definition
      baseTitle = song.meta.title
      remixBanner.style.display = 'block'
      remixBanner.innerHTML = `&#9835; ${t('compose.remixing')} <strong>${baseTitle}</strong>`
      prompt.placeholder = t('compose.remix.placeholder')
    } catch {
      remixBanner.style.display = 'block'
      remixBanner.innerHTML = t('compose.remix.fail')
    }
  }

  composeBtn.addEventListener('click', async () => {
    const text = prompt.value.trim()
    if (!text) return

    composeBtn.disabled = true
    loadingEl.style.display = 'block'
    errorEl.style.display = 'none'
    resultEl.style.display = 'none'
    saveStatus.style.display = 'none'
    stopSong()
    isPlaying = false

    const progressStep = wrapper.querySelector('#progress-step') as HTMLElement
    const progressBar = wrapper.querySelector('#progress-bar-fill') as HTMLElement
    const steps = [
      { text: t('compose.progress.1'), pct: 10 },
      { text: t('compose.progress.2'), pct: 25 },
      { text: t('compose.progress.3'), pct: 45 },
      { text: t('compose.progress.4'), pct: 60 },
      { text: t('compose.progress.5'), pct: 75 },
      { text: t('compose.progress.6'), pct: 90 },
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
      const result = await composeSong({ prompt: text, base: baseDef })
      clearInterval(stepTimer)
      progressBar.style.width = '100%'
      progressStep.textContent = t('compose.progress.done')

      currentResult = result

      if (result.remaining !== undefined) {
        remainingSpan.textContent = `${result.remaining} ${t('compose.left')}`
      }

      titleInput.value = result.suggestedMeta.title
      resultTags.innerHTML = result.suggestedMeta.tags.map(tag => `<span class="tag">${tag}</span>`).join('')
      resultEl.style.display = 'block'

      playSong(result.definition, result.suggestedMeta.title)
      isPlaying = true
      playBtn.style.display = 'none'
      stopBtn.style.display = 'inline-block'
    } catch (err: any) {
      clearInterval(stepTimer)
      errorEl.style.display = 'block'
      errorEl.innerHTML = `<div class="error-panel"><p class="error-message">${err.message || 'Composition failed'}</p><button class="game-btn btn-battle error-retry">${t('retry')}</button></div>`
      errorEl.querySelector('.error-retry')?.addEventListener('click', () => composeBtn.click())
    } finally {
      composeBtn.disabled = false
      loadingEl.style.display = 'none'
    }
  })

  playBtn.addEventListener('click', () => {
    if (!currentResult) return
    playSong(currentResult.definition, titleInput.value)
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

  saveBtn.addEventListener('click', async () => {
    if (!currentResult) return
    saveBtn.disabled = true
    saveStatus.style.display = 'block'
    saveStatus.textContent = t('compose.result.saving')
    saveStatus.className = 'save-status'
    try {
      const { id } = await saveSong({
        title: titleInput.value.trim() || 'Untitled',
        composer: composerInput.value.trim() || 'Tomo',
        prompt: currentResult.suggestedMeta.prompt,
        tags: currentResult.suggestedMeta.tags,
        definition: currentResult.definition,
        basedOn: currentResult.suggestedMeta.basedOn,
      })
      saveStatus.textContent = `${t('compose.result.saved')} /s/${id}`
      saveStatus.className = 'save-status save-success'
      saveBtn.textContent = t('compose.result.saved')
    } catch (err: any) {
      saveStatus.textContent = err.message || 'Save failed'
      saveStatus.className = 'save-status save-error'
      saveBtn.disabled = false
    }
  })

  discardBtn.addEventListener('click', () => {
    stopSong()
    isPlaying = false
    currentResult = null
    resultEl.style.display = 'none'
    errorEl.style.display = 'none'
    saveStatus.style.display = 'none'
    saveBtn.disabled = false
    saveBtn.textContent = `★ ${t('compose.result.save')}`
    prompt.value = ''
    charsSpan.textContent = '0/500'
    prompt.focus()
  })
}
