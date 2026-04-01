import type { SongListItem } from '../api'
import { showCodeModal } from './code-modal'
import { t } from '../i18n'

interface SongCardOptions {
  onPlay: () => void
}

export function renderSongCard(song: SongListItem, opts: SongCardOptions): HTMLElement {
  const card = document.createElement('div')
  card.className = 'song-card wood-panel'

  const tags = song.tags.map(tag => `<span class="tag">${tag}</span>`).join('')
  const composer = (song as any).composer || 'Tomo'

  card.innerHTML = `
    <div class="card-header">
      <span class="card-title">${song.title}</span>
      <span class="card-composer">by ${composer}</span>
      <div class="card-tags">${tags}</div>
    </div>
    <div class="card-actions">
      <button class="game-btn btn-forest card-btn" data-action="play">&#9654; ${t('card.play')}</button>
      <button class="game-btn card-btn" data-action="code">&#60;/&#62; ${t('card.code')}</button>
      <a class="game-btn card-btn" href="/#compose?base=${song.id}">&#9998; ${t('card.remix')}</a>
    </div>
  `

  card.querySelector('[data-action="play"]')?.addEventListener('click', opts.onPlay)
  card.querySelector('[data-action="code"]')?.addEventListener('click', () => {
    showCodeModal(song.id, song.title)
  })

  return card
}
