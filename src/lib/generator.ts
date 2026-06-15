import type { Theme, ThemeConfig } from './types'

export const THEMES: ThemeConfig[] = [
  {
    id: 'overlord',
    label: 'OverLord',
    words: [
      'OverLord', 'KDOne', 'Lord', 'Over', 'Danila', 'Kondrashov',
      'KDO', 'Overlord', 'OverLordKDOne',
    ],
  },
  {
    id: 'ddos',
    label: 'DDoS',
    words: [
      'DDoS', 'Ddos', 'L7', 'TLS', 'TLSHandshake', 'Handshake',
      'Bypass', 'Stresser', 'Flood', 'Flooder', 'SYN', 'ACK',
      'Mirai', 'Botnet', 'Packet', 'Socket', 'Amplification',
      'Dudos', 'DudoS', 'Dudoc', 'UDP', 'HTTP', 'Slowloris',
      'RST', 'Reflection', 'Booter', 'IPStresser',
    ],
  },
  {
    id: 'security',
    label: 'Security',
    words: [
      'FBI', 'CIA', 'FSB', 'KGB', 'Crime', 'ForHire', 'Cyber',
      'Terror', 'Secret', 'Witness', 'Anon', 'Anonymous',
      'Leak', 'Dox', 'Doxxer', 'Doxbin', 'OpSec', 'Exploit',
      'Payload', 'ZeroDay', 'Backdoor', 'Rootkit', 'Ransom',
    ],
  },
  {
    id: 'linux',
    label: 'Linux',
    words: [
      'Linux', 'Tux', 'Penguin', 'Arch', 'NixOS', 'Gentoo',
      'Fedora', 'Kali', 'Debian', 'Ubuntu', 'RedOS', 'CachyOS',
      'ShefOS', 'MakuOS', 'Systemd', 'Segfault', 'Kernel',
      'Root', 'Sudo', 'Bash', 'Hyprland', 'Wayland', 'Xorg',
      'Distro', 'Hop', 'LFS', 'GNU', 'LinuxFromScratch',
      'Asahi', 'Secureblue', 'Graphene',
    ],
  },
  {
    id: 'hackintosh',
    label: 'Hackintosh',
    words: [
      'Hackintosh', 'Mac', 'MacOS', 'Darwin', 'OpenCore',
      'EFI', 'Bootloader', 'HackBook', 'iBoot', 'HackPro',
      'Kext', 'Hack', 'Apple', 'MacBook', 'HackMini',
    ],
  },
  {
    id: 'femboy',
    label: 'Femboy',
    words: [
      'CrossDresser', 'Femboy', 'Fem', 'Trap', 'Nya',
      'UwU', 'Senpai', 'Kitty', 'Waifu', 'Kitsune',
      'Dildo', 'Dilda', 'EggNet', 'Femboi', 'Trans',
      'Omni', 'DigitGender', 'Nekokitty', 'Nekochan',
    ],
  },
  {
    id: 'vibecode',
    label: 'VibeCode',
    words: [
      'VibeHack', 'VibeCoder', 'Vibe', 'Reverse',
      'Engineer', 'Protocol', 'API', 'Prompt', 'GPT',
      'LLM', 'Neural', 'DeepSeek', 'Gemini', 'Claude',
      'Transformer', 'Tensor', 'FloatingPoint',
      'SegmentationFault', 'CoreDump', 'StackOverflow',
    ],
  },
  {
    id: 'mobile',
    label: 'Mobile',
    words: [
      'IPhone', 'IOS', 'Jailbreak', 'PostmarketOS',
      'GrapheneOS', 'Arm', 'Samsung', 'Galaxy',
      'Redmi', 'Xiaomi', 'Android', 'AOSP',
      'LineageOS', 'GSI', 'EvolutionX', 'HentaiOS',
      'HelluvaOS', 'RisingOS',
    ],
  },
  {
    id: 'meme',
    label: 'Meme',
    words: [
      'FastOpenCookie', 'Kirdish', 'StopLamers',
      'AtlasOS', 'Vepur', 'OpenVK', 'Seberpedia',
      'Gorispolkom', 'HackYourMom', 'Killnet',
      'CyberSpecnaz', 'ParasJa', '41Region',
      'Vindoblyad', 'TinkoffTravel', 'AppleInsider',
    ],
  },
]

const MEME_NUMBERS = [69, 420, 1337, 1488, 228, 42, 404, 666, 13337, 1488228]

export function generateNickname(
  activeThemes: Theme[],
  chunkCount: number,
  customWords: string[],
): string {
  const words: string[] = []

  for (const themeId of activeThemes) {
    const config = THEMES.find(t => t.id === themeId)
    if (config) words.push(...config.words)
  }

  words.push(...customWords.map(w =>
    w.charAt(0).toUpperCase() + w.slice(1),
  ))

  if (words.length === 0) return ''

  const parts: string[] = []
  for (let i = 0; i < chunkCount; i++) {
    const word = words[Math.floor(Math.random() * words.length)]
    parts.push(word.charAt(0).toUpperCase() + word.slice(1))
  }

  let nick = parts.join('')

  if (Math.random() < 0.3) {
    if (Math.random() < 0.1 && MEME_NUMBERS.length > 0) {
      nick += MEME_NUMBERS[Math.floor(Math.random() * MEME_NUMBERS.length)]
    } else {
      const digitCount = 2 + Math.floor(Math.random() * 3)
      const min = Math.pow(10, digitCount - 1)
      const max = Math.pow(10, digitCount) - 1
      nick += Math.floor(Math.random() * (max - min + 1)) + min
    }
  }

  return nick
}

export function generateMultiple(
  count: number,
  activeThemes: Theme[],
  chunkCount: number,
  customWords: string[],
): string[] {
  const result: string[] = []
  const seen = new Set<string>()
  let attempts = 0

  while (result.length < count && attempts < count * 10) {
    const nick = generateNickname(activeThemes, chunkCount, customWords)
    if (!seen.has(nick)) {
      seen.add(nick)
      result.push(nick)
    }
    attempts++
  }

  return result
}

export function calculateCombinations(
  activeThemes: Theme[],
  chunkCount: number,
): number {
  let wordCount = 0
  for (const themeId of activeThemes) {
    const config = THEMES.find(t => t.id === themeId)
    if (config) wordCount += config.words.length
  }

  if (wordCount === 0) return 0
  return Math.pow(wordCount, chunkCount)
}

export function formatCombinations(n: number): string {
  if (n === 0) return '0'
  if (n < 1000) return n.toLocaleString()
  if (n < 1_000_000) return Math.floor(n).toLocaleString()
  if (n < 10 ** 12) return (n / 10 ** 6).toFixed(1) + 'M'
  if (n < 10 ** 15) return (n / 10 ** 12).toFixed(1) + 'T'
  return '∞ (ПИЗДЕЦ)'
}
