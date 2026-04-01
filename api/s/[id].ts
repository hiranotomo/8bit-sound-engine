import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'

const kv = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

interface SongMeta {
  id: string; title: string; prompt: string; basedOn?: string
  tags: string[]; createdAt: string; isPreset: boolean
}
interface StoredSong { definition: Record<string, unknown>; meta: SongMeta }

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query
  if (typeof id !== 'string') {
    return res.status(400).send('Invalid id')
  }

  const song = await kv.get<StoredSong>(`songs:${id}`)
  if (!song) {
    return res.status(404).send('Song not found')
  }

  const { meta, definition } = song
  const tagsText = meta.tags.length > 0 ? meta.tags.join(', ') : 'chiptune'
  const definitionJson = JSON.stringify(definition)

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(meta.title)} — 8bit Sound Engine</title>
  <meta property="og:title" content="${escapeHtml(meta.title)} — 8bit Sound Engine" />
  <meta property="og:description" content="Listen to this chiptune: ${escapeHtml(tagsText)}" />
  <meta property="og:type" content="music.song" />
  <meta property="og:url" content="https://8bit-eight.vercel.app/s/${id}" />
  <meta name="twitter:card" content="summary" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; border-radius: 0 !important; }
    :root {
      --brown-dark: #5c3a1e; --brown-mid: #8b6040; --brown-light: #c4965c; --brown-pale: #e0c090;
      --gold: #f0c040; --gold-dark: #c89020; --green-dark: #2d5a1e; --green-mid: #4a8c2a;
      --white: #f8f0e0; --cream: #f0e8d0; --text: #3a2010; --red: #d83030;
    }
    body {
      font-family: 'Press Start 2P', monospace;
      background: linear-gradient(180deg, #3b1e5e 0%, #c85a3a 50%, #f2b866 100%);
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      padding: 16px; image-rendering: pixelated;
    }
    .card {
      background: var(--brown-mid); border: 4px solid var(--brown-dark);
      box-shadow: 6px 6px 0 var(--brown-dark), inset 0 0 0 2px var(--brown-light);
      max-width: 420px; width: 100%; padding: 20px; text-align: center;
    }
    .title { font-size: 0.7rem; color: var(--gold); margin-bottom: 8px; text-shadow: 2px 2px 0 var(--brown-dark); }
    .tags { font-size: 0.35rem; color: var(--brown-pale); margin-bottom: 16px; }
    .tag { background: var(--brown-dark); padding: 2px 6px; border: 1px solid var(--brown-mid); margin: 0 2px; display: inline-block; }
    .btn-row { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-bottom: 12px; }
    .btn {
      font-family: 'Press Start 2P', monospace; font-size: 0.5rem;
      padding: 10px 16px; border: 3px solid; cursor: pointer; color: var(--white);
      text-decoration: none;
    }
    .btn-play { background: var(--green-dark); border-color: var(--green-mid); }
    .btn-play:hover { background: var(--green-mid); }
    .btn-stop { background: var(--red); border-color: #a02020; display: none; }
    .btn-stop:hover { background: #b02020; }
    .btn-studio { background: var(--brown-dark); border-color: var(--brown-mid); }
    .btn-studio:hover { background: var(--brown-mid); }
    .variations { margin-top: 12px; display: none; }
    .var-title { font-size: 0.4rem; color: var(--cream); margin-bottom: 8px; }
    .var-row { display: flex; gap: 4px; justify-content: center; flex-wrap: wrap; }
    .var-btn {
      font-family: 'Press Start 2P', monospace; font-size: 0.35rem;
      padding: 5px 8px; background: var(--brown-dark); border: 2px solid var(--brown-mid);
      color: var(--cream); cursor: pointer;
    }
    .var-btn:hover { background: var(--brown-light); }
    .var-btn.current { background: var(--gold-dark); border-color: var(--gold); color: var(--white); }
    .now-playing { font-size: 0.4rem; color: var(--cream); margin-top: 8px; }
    .footer { margin-top: 16px; font-size: 0.3rem; color: var(--brown-pale); }
  </style>
</head>
<body>
  <div class="card">
    <h1 class="title">${escapeHtml(meta.title)}</h1>
    <div class="tags">${meta.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join(' ')}</div>
    <div class="btn-row">
      <button class="btn btn-play" id="play-btn">&#9654; PLAY</button>
      <button class="btn btn-stop" id="stop-btn">&#9632; STOP</button>
    </div>
    <div class="variations" id="variations">
      <div class="var-title">ARRANGEMENT</div>
      <div class="var-row" id="var-row"></div>
    </div>
    <div class="now-playing" id="now-playing"></div>
    <div class="btn-row" style="margin-top:16px;">
      <a class="btn btn-studio" href="https://8bit-eight.vercel.app/#presets">&#9834; OPEN STUDIO</a>
    </div>
    <div class="footer">8bit Sound Engine</div>
  </div>

  <script src="https://8bit-eight.vercel.app/sdk.js"></script>
  <script>
    const definition = ${definitionJson};
    const engine = EightBit.createSoundEngine({ reverb: { duration: 1.5, decay: 2.0, mix: 0.2 } });
    const playBtn = document.getElementById('play-btn');
    const stopBtn = document.getElementById('stop-btn');
    const variationsEl = document.getElementById('variations');
    const varRow = document.getElementById('var-row');
    const nowPlaying = document.getElementById('now-playing');
    let playing = false;

    // Build variation buttons
    if (definition.variations && definition.variations.length > 0) {
      definition.variations.forEach(function(v, i) {
        const btn = document.createElement('button');
        btn.className = 'var-btn';
        btn.textContent = v.name;
        btn.addEventListener('click', function() {
          engine.bgm.setVariation(v.name);
          varRow.querySelectorAll('.var-btn').forEach(function(b, j) {
            b.classList.toggle('current', j === i);
          });
        });
        varRow.appendChild(btn);
      });
    }

    playBtn.addEventListener('click', async function() {
      await engine.resume();
      engine.bgm.play(definition);
      playing = true;
      playBtn.style.display = 'none';
      stopBtn.style.display = 'inline-block';
      if (definition.variations && definition.variations.length > 0) {
        variationsEl.style.display = 'block';
        // Auto-select FULL
        setTimeout(function() {
          engine.bgm.setVariation(definition.variations[0].name);
          varRow.querySelector('.var-btn').classList.add('current');
        }, 100);
      }
      nowPlaying.textContent = 'Now Playing \\u266B';
    });

    stopBtn.addEventListener('click', function() {
      engine.bgm.stop({ fade: 300 });
      playing = false;
      playBtn.style.display = 'inline-block';
      stopBtn.style.display = 'none';
      variationsEl.style.display = 'none';
      nowPlaying.textContent = '';
    });
  </script>
</body>
</html>`

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.send(html)
  } catch (err: any) {
    console.error('s/[id] error:', err)
    res.status(500).json({ error: err.message || 'Internal server error' })
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
