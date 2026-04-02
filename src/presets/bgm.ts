export { office } from './bgm/office'
export { nature } from './bgm/nature'
export { battle } from './bgm/battle'
export { dungeon } from './bgm/dungeon'
export { overworld } from './bgm/overworld'

import { office } from './bgm/office'
import { nature } from './bgm/nature'
import { battle } from './bgm/battle'
import { dungeon } from './bgm/dungeon'
import { overworld } from './bgm/overworld'
import type { BGMDefinition } from '../types'

export const BGM_PRESETS: Record<string, BGMDefinition> = {
  office,
  nature,
  battle,
  dungeon,
  overworld,
}
