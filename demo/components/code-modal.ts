let modalEl: HTMLElement | null = null

function buildClaudePrompt(songId: string, title: string, lang: 'en' | 'ja' | 'zh'): string {
  const prompts = {
    en: `Run "npm install 8bit-sound-engine" in my project.
Then load the BGM "${title}" from https://8bit-eight.vercel.app/api/songs/${songId} and play it when this page opens.
Also add a "coin" sound effect on button clicks and a "select" sound on navigation.
Use the AGENTS.md in the installed package for the full API reference.`,
    ja: `このプロジェクトで npm install 8bit-sound-engine を実行して。
その後、BGM「${title}」を https://8bit-eight.vercel.app/api/songs/${songId} から読み込んでページを開いたら再生して。
ボタンクリックに「coin」、ナビゲーションに「select」の効果音も追加して。
APIの詳細はインストールしたパッケージのAGENTS.mdを参照して。`,
    zh: `在我的项目中运行 npm install 8bit-sound-engine。
然后从 https://8bit-eight.vercel.app/api/songs/${songId} 加载BGM「${title}」，打开页面时播放。
按钮点击添加「coin」音效，导航添加「select」音效。
API详情参考安装包中的AGENTS.md。`,
  }
  return prompts[lang]
}

export function showCodeModal(songId: string, title: string) {
  closeCodeModal()

  let currentLang: 'en' | 'ja' | 'zh' = 'en'

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
        <span class="panel-icon">&#60;/&#62;</span> ${escapeHtml(title)}
        <button class="modal-close">&times;</button>
      </div>
      <div class="panel-content">

        <div class="code-section claude-section">
          <div class="code-label">&#9835; Claude Code — copy &amp; paste this prompt</div>
          <div class="lang-switcher">
            <button class="lang-btn active" data-lang="en">EN</button>
            <button class="lang-btn" data-lang="ja">JA</button>
            <button class="lang-btn" data-lang="zh">ZH</button>
          </div>
          <pre class="code-block claude-prompt" id="claude-prompt"><code>${escapeHtml(buildClaudePrompt(songId, title, 'en'))}</code></pre>
          <button class="game-btn btn-forest card-btn copy-btn" data-snippet="claude">COPY PROMPT</button>
          <div class="claude-steps">
            <p>Claude Code will automatically:</p>
            <p>1. <strong>npm install</strong> 8bit-sound-engine</p>
            <p>2. Read <strong>AGENTS.md</strong> for API usage</p>
            <p>3. Write all the code for you</p>
          </div>
        </div>

        <details class="code-details">
          <summary class="code-summary">Manual integration (CDN / npm)</summary>
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
        </details>

        <div class="code-section">
          <div class="code-label">Share URL</div>
          <pre class="code-block"><code>https://8bit-eight.vercel.app/s/${songId}</code></pre>
          <button class="game-btn card-btn copy-btn" data-snippet="url">COPY</button>
        </div>

      </div>
    </div>
  `

  modalEl.querySelector('.modal-close')?.addEventListener('click', closeCodeModal)
  modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl) closeCodeModal()
  })

  // Language switcher
  const promptEl = modalEl.querySelector('#claude-prompt code') as HTMLElement
  modalEl.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentLang = (btn as HTMLElement).dataset.lang as 'en' | 'ja' | 'zh'
      promptEl.textContent = buildClaudePrompt(songId, title, currentLang)
      modalEl!.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
    })
  })

  // Copy buttons
  const snippets: Record<string, () => string> = {
    claude: () => buildClaudePrompt(songId, title, currentLang),
    cdn: () => cdnSnippet,
    npm: () => npmSnippet,
    url: () => `https://8bit-eight.vercel.app/s/${songId}`,
  }
  modalEl.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const key = (btn as HTMLElement).dataset.snippet!
      await navigator.clipboard.writeText(snippets[key]())
      const orig = btn.textContent
      btn.textContent = 'COPIED!'
      setTimeout(() => { btn.textContent = orig }, 1500)
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
