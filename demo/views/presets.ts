import { playSong, getEngine } from '../player'
import { fetchSongs, fetchSong } from '../api'
import { renderSongCard } from '../components/song-card'
import { showLoading, hideLoading } from '../components/loading'
import { showError } from '../components/error'
import { t } from '../i18n'

export async function presetsView(container: HTMLElement) {
  const wrapper = document.createElement('div')
  wrapper.className = 'view-presets'

  const header = document.createElement('div')
  header.className = 'view-header'
  header.innerHTML = `
    <h2 class="view-title">&#9834; ${t('presets.title')}</h2>
    <div class="how-to-use">
      <p><strong>&#9654; ${t('card.play')}</strong> — ${t('presets.help.play')}</p>
      <p><strong>&#60;/&#62; ${t('card.code')}</strong> — ${t('presets.help.code')}</p>
      <p><strong>&#9998; ${t('card.remix')}</strong> — ${t('presets.help.remix')}</p>
    </div>
  `
  wrapper.appendChild(header)

  const grid = document.createElement('div')
  grid.className = 'song-grid'
  wrapper.appendChild(grid)

  container.appendChild(wrapper)

  showLoading(grid)

  try {
    const songs = await fetchSongs(true)
    hideLoading(grid)

    if (songs.length === 0) {
      grid.innerHTML = `<p class="help-text">${t('presets.empty')}</p>`
      return
    }

    for (const song of songs) {
      const card = renderSongCard(song, {
        onPlay: async () => {
          await getEngine().resume()
          const full = await fetchSong(song.id)
          playSong(full.definition, song.title)
        }
      })
      grid.appendChild(card)
    }
  } catch (err) {
    hideLoading(grid)
    showError(grid, t('presets.error'), () => {
      grid.innerHTML = ''
      presetsView(container)
    })
  }
}
