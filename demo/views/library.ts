import { playSong, getEngine } from '../player'
import { fetchSongs, fetchSong } from '../api'
import { renderSongCard } from '../components/song-card'
import { showLoading, hideLoading } from '../components/loading'
import { showError } from '../components/error'
import { t } from '../i18n'

export async function libraryView(container: HTMLElement) {
  const wrapper = document.createElement('div')
  wrapper.className = 'view-library'

  const header = document.createElement('div')
  header.className = 'view-header'
  header.innerHTML = `
    <h2 class="view-title">&#9733; ${t('library.title')}</h2>
    <div class="how-to-use">
      <p>${t('library.help')}</p>
      <p>${t('library.help2')}</p>
    </div>
  `
  wrapper.appendChild(header)

  const grid = document.createElement('div')
  grid.className = 'song-grid'
  wrapper.appendChild(grid)

  container.appendChild(wrapper)

  showLoading(grid)

  try {
    const songs = await fetchSongs(false)
    hideLoading(grid)

    if (songs.length === 0) {
      grid.innerHTML = `<p class="help-text">${t('library.empty')}</p>`
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
    showError(grid, t('library.error'), () => {
      grid.innerHTML = ''
      libraryView(container)
    })
  }
}
