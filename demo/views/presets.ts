import { playSong, getEngine } from '../player'
import { fetchSongs, fetchSong } from '../api'
import { renderSongCard } from '../components/song-card'
import { showLoading, hideLoading } from '../components/loading'
import { showError } from '../components/error'

export async function presetsView(container: HTMLElement) {
  const wrapper = document.createElement('div')
  wrapper.className = 'view-presets'

  const header = document.createElement('div')
  header.className = 'view-header'
  header.innerHTML = `
    <h2 class="view-title">&#9834; PRESET BGMs</h2>
    <div class="how-to-use">
      <p><strong>&#9654; PLAY</strong> — Listen to the track. Controls appear below.</p>
      <p><strong>&#60;/&#62; CODE</strong> — Get code snippet to use in your app.</p>
      <p><strong>&#9998; REMIX</strong> — Open in Compose tab to create a variation.</p>
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
      grid.innerHTML = '<p class="help-text">No presets yet. Run the seed script.</p>'
      return
    }

    for (const song of songs) {
      const card = renderSongCard(song, {
        onPlay: async () => {
          await getEngine().resume()  // Resume before async fetch (user gesture)
          const full = await fetchSong(song.id)
          playSong(full.definition, song.title)
        }
      })
      grid.appendChild(card)
    }
  } catch (err) {
    hideLoading(grid)
    showError(grid, 'Failed to load presets', () => {
      grid.innerHTML = ''
      presetsView(container)
    })
  }
}
