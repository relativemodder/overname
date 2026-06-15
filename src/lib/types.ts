export type Theme =
  | 'overlord'
  | 'ddos'
  | 'security'
  | 'linux'
  | 'hackintosh'
  | 'femboy'
  | 'vibecode'
  | 'mobile'
  | 'meme'

export interface ThemeConfig {
  id: Theme
  label: string
  words: string[]
}

export interface GeneratorState {
  chunkCount: number
  activeThemes: Theme[]
  customWords: string[]
}
