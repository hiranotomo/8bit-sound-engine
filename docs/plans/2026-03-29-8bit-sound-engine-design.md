# 8bit Sound Engine Design

## Concept
Web Audio APIベースの8bitゲームサウンドライブラリ。ファミコン風の波形合成でBGMとSEをリアルタイム生成する。外部ファイル不要、コードのみで完結。

## Architecture

### Core Components
- **SoundEngine** — エントリポイント。AudioContext管理
- **BGMPlayer** — JSON定義の曲をリアルタイム合成・ループ再生。シーン切り替え時にフェード遷移
- **SEPlayer** — 効果音トリガー。プリセット＋カスタム定義対応
- **Synth** — ファミコン風4チャンネル合成

### Channel Configuration (FC-style)
| Channel  | Waveform | Usage          |
|----------|----------|----------------|
| Pulse 1  | Square (variable duty) | Melody |
| Pulse 2  | Square (variable duty) | Harmony |
| Triangle | Triangle | Bass |
| Noise    | Noise    | Percussion/SE |

### API (declarative, JSON-driven)
- `createSoundEngine()` — 初期化
- `engine.bgm.play(definition)` — BGM再生
- `engine.bgm.changeTo(definition, { fade })` — シーン切り替え
- `engine.bgm.stop({ fade })` — 停止
- `engine.se.play(nameOrDefinition, options?)` — SE再生

### BGM Definition Format
```json
{
  "bpm": 140,
  "loop": true,
  "channels": [
    {
      "wave": "square",
      "duty": 0.5,
      "volume": 0.7,
      "notes": [
        { "pitch": "C4", "duration": "8n" },
        { "pitch": null, "duration": "8n" }
      ]
    }
  ]
}
```

### SE Preset List
jump, coin, damage, powerup, gameover, select, cancel, explosion, laser, 1up

## Tech Stack
- TypeScript
- Web Audio API (OscillatorNode, GainNode)
- Vite (library mode + demo)
- No external dependencies

## Demo Page
- Pixel art style UI
- BGM playback / scene switching controls
- SE trigger buttons
- Visual feedback for active channels

## Dynamic Behavior
- Scene-based BGM switching with fade in/out
- SE layered on top of BGM
- Multiple SE can play simultaneously
