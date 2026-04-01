import { playSong } from '../player'
import { fetchSongs, fetchSong } from '../api'
import { renderSongCard } from '../components/song-card'
import { showLoading, hideLoading } from '../components/loading'
import { showError } from '../components/error'

export async function libraryView(container: HTMLElement) {
  const wrapper = document.createElement('div')
  wrapper.className = 'view-library'

  const header = document.createElement('div')
  header.className = 'view-header'
  header.innerHTML = '<h2 class="view-title">&#9733; LIBRARY</h2><p class="help-text">Community-published songs</p>'
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
      grid.innerHTML = '<p class="help-text">No songs in the library yet. Compose one in Phase 3!</p>'
      return
    }

    for (const song of songs) {
      const card = renderSongCard(song, {
        onPlay: async () => {
          const full = await fetchSong(song.id)
          playSong(full.definition, song.title)
        }
      })
      grid.appendChild(card)
    }
  } catch (err) {
    hideLoading(grid)
    showError(grid, 'Failed to load library', () => {
      grid.innerHTML = ''
      libraryView(container)
    })
  }
}
