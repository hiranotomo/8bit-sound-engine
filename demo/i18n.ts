export type Lang = 'en' | 'ja' | 'zh'

let currentLang: Lang = 'en'
const listeners: (() => void)[] = []

export function getLang(): Lang {
  return currentLang
}

export function setLang(lang: Lang) {
  currentLang = lang
  localStorage.setItem('8bit-lang', lang)
  listeners.forEach(fn => fn())
}

export function onLangChange(fn: () => void) {
  listeners.push(fn)
}

export function initLang() {
  const saved = localStorage.getItem('8bit-lang') as Lang | null
  if (saved && ['en', 'ja', 'zh'].includes(saved)) {
    currentLang = saved
  }
}

export function t(key: string): string {
  return (translations[currentLang] as Record<string, string>)[key] || (translations.en as Record<string, string>)[key] || key
}

const translations = {
  en: {
    // Header
    'header.title': '8BIT SOUND STUDIO',
    'header.subtitle': 'for Claude Code',
    'header.credit': 'by Tomoyasu Hirano',
    // Tabs
    'tab.presets': 'PRESETS',
    'tab.library': 'LIBRARY',
    'tab.compose': 'COMPOSE',
    // Presets
    'presets.title': 'PRESET BGMs',
    'presets.help.play': 'PLAY — Listen to the track. Controls appear below.',
    'presets.help.code': 'CODE — Get prompt / code to use in your app.',
    'presets.help.remix': 'REMIX — Open in Compose tab to create a variation.',
    'presets.empty': 'No presets yet.',
    'presets.error': 'Failed to load presets',
    // Library
    'library.title': 'LIBRARY',
    'library.help': 'Songs created with the Compose tab appear here.',
    'library.help2': 'Play, copy code, or remix any song.',
    'library.empty': 'No songs yet. Go to the COMPOSE tab to create one!',
    'library.error': 'Failed to load library',
    // Compose
    'compose.title': 'COMPOSE',
    'compose.help.1': '1. Describe your song\'s mood, style, and tempo below.',
    'compose.help.2': '2. Click COMPOSE — AI generates a unique chiptune BGM.',
    'compose.help.3': '3. Listen, edit the title, then SAVE to library.',
    'compose.help.example': 'Try: "peaceful snowy village, slow and magical" or "intense boss battle, fast and aggressive"',
    'compose.placeholder': 'cheerful morning forest, gentle and cozy...',
    'compose.btn': 'COMPOSE',
    'compose.remixing': 'Remixing:',
    'compose.remix.fail': 'Could not load base song',
    'compose.remix.placeholder': 'How to modify this song...',
    'compose.progress.1': 'Analyzing prompt...',
    'compose.progress.2': 'Choosing key and tempo...',
    'compose.progress.3': 'Composing melody...',
    'compose.progress.4': 'Adding bass line...',
    'compose.progress.5': 'Building harmony...',
    'compose.progress.6': 'Creating variations...',
    'compose.progress.done': 'Done!',
    'compose.progress.hint': 'Usually takes 10-20 seconds',
    'compose.result.title': 'Song Title',
    'compose.result.composer': 'Composer',
    'compose.result.save': 'SAVE',
    'compose.result.saved': '✓ SAVED',
    'compose.result.discard': 'DISCARD',
    'compose.result.new': 'NEW',
    'compose.result.saving': 'Saving...',
    'compose.left': 'left this hour',
    // Player
    'player.silence': 'Silence...',
    'player.stop': 'STOP',
    'player.arrangement': 'ARRANGEMENT',
    // SE
    'se.title': 'SOUND EFFECTS',
    'se.help': 'Tap to trigger — plays on top of BGM',
    // Channels
    'channels.title': 'CHANNELS',
    // Mixer
    'mixer.title': 'MIXER',
    // Cards
    'card.play': 'PLAY',
    'card.code': 'CODE',
    'card.remix': 'REMIX',
    // Footer
    'footer.hint': 'Browse presets, listen, and integrate into your app!',
    'footer.built': 'Built with Web Audio API',
    // Loading
    'loading': 'Loading...',
    'retry': 'RETRY',
  },
  ja: {
    'header.title': '8BIT SOUND STUDIO',
    'header.subtitle': 'for Claude Code',
    'header.credit': 'by Tomoyasu Hirano',
    'tab.presets': 'プリセット',
    'tab.library': 'ライブラリ',
    'tab.compose': '作曲',
    'presets.title': 'プリセット BGM',
    'presets.help.play': 'PLAY — 曲を再生。コントロールが下に表示されます。',
    'presets.help.code': 'CODE — アプリに組み込むためのプロンプト/コードを取得。',
    'presets.help.remix': 'REMIX — 作曲タブでアレンジを作成。',
    'presets.empty': 'プリセットがまだありません。',
    'presets.error': 'プリセットの読み込みに失敗しました',
    'library.title': 'ライブラリ',
    'library.help': '作曲タブで作った曲がここに表示されます。',
    'library.help2': '再生、コード取得、リミックスができます。',
    'library.empty': 'まだ曲がありません。作曲タブで作ってみましょう！',
    'library.error': 'ライブラリの読み込みに失敗しました',
    'compose.title': '作曲',
    'compose.help.1': '1. 曲の雰囲気、スタイル、テンポを入力してください。',
    'compose.help.2': '2. 「作曲」をクリック — AIがチップチューンBGMを生成。',
    'compose.help.3': '3. 試聴して、タイトルを編集、保存。',
    'compose.help.example': '例: 「雪の静かな村、ゆっくりで幻想的」「激しいボス戦、速くてアグレッシブ」',
    'compose.placeholder': '朝の森、穏やかで心地よい...',
    'compose.btn': '作曲',
    'compose.remixing': 'リミックス中:',
    'compose.remix.fail': '元の曲を読み込めませんでした',
    'compose.remix.placeholder': 'この曲をどう変えたいか...',
    'compose.progress.1': 'プロンプト分析中...',
    'compose.progress.2': 'キーとテンポを選択中...',
    'compose.progress.3': 'メロディ作曲中...',
    'compose.progress.4': 'ベースライン追加中...',
    'compose.progress.5': 'ハーモニー構築中...',
    'compose.progress.6': 'バリエーション作成中...',
    'compose.progress.done': '完了！',
    'compose.progress.hint': '通常10-20秒かかります',
    'compose.result.title': '曲名',
    'compose.result.composer': '作曲者',
    'compose.result.save': '保存',
    'compose.result.saved': '✓ 保存済み',
    'compose.result.discard': '破棄',
    'compose.result.new': '新規',
    'compose.result.saving': '保存中...',
    'compose.left': '残り（1時間あたり）',
    'player.silence': '無音...',
    'player.stop': '停止',
    'player.arrangement': 'アレンジ',
    'se.title': '効果音',
    'se.help': 'タップで再生 — BGMの上に重ねて鳴ります',
    'channels.title': 'チャンネル',
    'mixer.title': 'ミキサー',
    'card.play': '再生',
    'card.code': 'コード',
    'card.remix': 'リミックス',
    'footer.hint': 'プリセットを聴いて、アプリに組み込もう！',
    'footer.built': 'Web Audio API で構築',
    'loading': '読み込み中...',
    'retry': 'リトライ',
  },
  zh: {
    'header.title': '8BIT SOUND STUDIO',
    'header.subtitle': 'for Claude Code',
    'header.credit': 'by Tomoyasu Hirano',
    'tab.presets': '预设',
    'tab.library': '曲库',
    'tab.compose': '作曲',
    'presets.title': '预设 BGM',
    'presets.help.play': 'PLAY — 播放曲目。控制面板显示在下方。',
    'presets.help.code': 'CODE — 获取集成到应用的提示/代码。',
    'presets.help.remix': 'REMIX — 在作曲页面创建变奏。',
    'presets.empty': '暂无预设。',
    'presets.error': '加载预设失败',
    'library.title': '曲库',
    'library.help': '作曲页面创建的歌曲会显示在这里。',
    'library.help2': '播放、复制代码或混音任何歌曲。',
    'library.empty': '暂无歌曲。去作曲页面创作一首吧！',
    'library.error': '加载曲库失败',
    'compose.title': '作曲',
    'compose.help.1': '1. 描述歌曲的氛围、风格和节奏。',
    'compose.help.2': '2. 点击「作曲」— AI生成独特的芯片音乐BGM。',
    'compose.help.3': '3. 试听，编辑标题，保存到曲库。',
    'compose.help.example': '试试: "宁静雪村，缓慢而梦幻" 或 "激烈Boss战，快速而凶猛"',
    'compose.placeholder': '早晨的森林，温暖而舒适...',
    'compose.btn': '作曲',
    'compose.remixing': '混音中:',
    'compose.remix.fail': '无法加载原曲',
    'compose.remix.placeholder': '如何修改这首曲子...',
    'compose.progress.1': '分析提示...',
    'compose.progress.2': '选择调式和节奏...',
    'compose.progress.3': '创作旋律...',
    'compose.progress.4': '添加低音...',
    'compose.progress.5': '构建和声...',
    'compose.progress.6': '创建变奏...',
    'compose.progress.done': '完成！',
    'compose.progress.hint': '通常需要10-20秒',
    'compose.result.title': '曲名',
    'compose.result.composer': '作曲者',
    'compose.result.save': '保存',
    'compose.result.saved': '✓ 已保存',
    'compose.result.discard': '丢弃',
    'compose.result.new': '新建',
    'compose.result.saving': '保存中...',
    'compose.left': '本小时剩余',
    'player.silence': '静音...',
    'player.stop': '停止',
    'player.arrangement': '编曲',
    'se.title': '音效',
    'se.help': '点击播放 — 叠加在BGM上',
    'channels.title': '声道',
    'mixer.title': '混音器',
    'card.play': '播放',
    'card.code': '代码',
    'card.remix': '混音',
    'footer.hint': '浏览预设，试听，集成到你的应用！',
    'footer.built': '基于 Web Audio API',
    'loading': '加载中...',
    'retry': '重试',
  },
}
