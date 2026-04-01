let modalEl: HTMLElement | null = null

export function showCodeModal(songId: string, title: string) {
  closeCodeModal()

  const cdnSnippet = `<script src="https://8bit-eight.vercel.app/sdk.js"><\/script>
<script>
  const engine = EightBit.createSoundEngine()
  fetch('https://8bit-eight.vercel.app/api/songs/${songId}')
    .then(r => r.json())
    .then(song => {
      document.addEventListener('click', () => {
        engine.resume().then(() => engine.bgm.play(song.definition))
      }, { once: true })
    })
<\/script>`

  const npmSnippet = `import { createSoundEngine } from '8bit-sound-engine'

const engine = createSoundEngine()
const res = await fetch('https://8bit-eight.vercel.app/api/songs/${songId}')
const song = await res.json()
engine.bgm.play(song.definition)`

  modalEl = document.createElement('div')
  modalEl.className = 'code-modal-overlay'
  modalEl.innerHTML = `
    <div class="code-modal wood-panel">
      <div class="panel-header">
        <span class="panel-icon">&#60;/&#62;</span> ${title}
        <button class="modal-close">&times;</button>
      </div>
      <div class="panel-content">
        <div class="code-section">
          <div class="code-label">CDN</div>
          <pre class="code-block"><code>${escapeHtml(cdnSnippet)}</code></pre>
          <button class="game-btn card-btn copy-btn" data-snippet="cdn">COPY</button>
        </div>
        <div class="code-section">
          <div class="code-label">npm</div>
          <pre class="code-block"><code>${escapeHtml(npmSnippet)}</code></pre>
          <button class="game-btn card-btn copy-btn" data-snippet="npm">COPY</button>
        </div>
        <div class="code-section">
          <div class="code-label">Share URL</div>
          <pre class="code-block"><code>https://8bit-eight.vercel.app/s/${songId}</code></pre>
          <button class="game-btn card-btn copy-btn" data-snippet="url">COPY</button>
        </div>
        <div class="code-section">
          <div class="code-label">Claude Code</div>
          <div class="claude-code-help">
            <p>Add AGENTS.md to your project, then ask Claude Code:</p>
            <pre class="code-block"><code>"Add 8bit sound to my app. Use the ${escapeHtml(title)} BGM (ID: ${songId}) and play coin SE on button clicks."</code></pre>
            <p>Claude Code reads AGENTS.md and integrates automatically.</p>
            <p>Install: <code>npm i 8bit-sound-engine</code></p>
          </div>
        </div>
      </div>
    </div>
  `

  modalEl.querySelector('.modal-close')?.addEventListener('click', closeCodeModal)
  modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl) closeCodeModal()
  })

  // Copy buttons
  const snippets: Record<string, string> = { cdn: cdnSnippet, npm: npmSnippet, url: `https://8bit-eight.vercel.app/s/${songId}` }
  modalEl.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const key = (btn as HTMLElement).dataset.snippet!
      await navigator.clipboard.writeText(snippets[key])
      btn.textContent = 'COPIED!'
      setTimeout(() => { btn.textContent = 'COPY' }, 1500)
    })
  })

  document.body.appendChild(modalEl)
}

export function closeCodeModal() {
  if (modalEl) {
    modalEl.remove()
    modalEl = null
  }
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
