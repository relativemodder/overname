<script lang="ts">
  import { THEMES, generateNickname, generateMultiple, calculateCombinations, formatCombinations } from './lib/generator'
  import type { Theme } from './lib/types'

  let chunkCount = $state(3)
  let activeThemes = $state<Theme[]>(THEMES.map(t => t.id))
  let customWords = $state<string[]>([])
  let currentNick = $state('OverLordDDoSNya1337')
  let history = $state<string[]>([])
  let copied = $state(false)
  let copyingIndex = $state<number | null>(null)
  let customInput = $state('')
  let spinning = $state(false)
  let spinValue = $state('')
  let spinDeg = $state(0)

  let totalWordCount = $derived.by(() => {
    let count = 0
    for (const id of activeThemes) {
      const t = THEMES.find(th => th.id === id)
      if (t) count += t.words.length
    }
    return count + customWords.length
  })

  let combos = $derived(formatCombinations(calculateCombinations(activeThemes, chunkCount)))

  let hasSelection = $derived(activeThemes.length > 0)

  function toggleTheme(id: Theme) {
    if (activeThemes.includes(id)) {
      if (activeThemes.length === 1) return
      activeThemes = activeThemes.filter(t => t !== id)
    } else {
      activeThemes = [...activeThemes, id]
    }
  }

  function doSpin() {
    if (!hasSelection) {
      currentNick = 'ВЫБЕРИ ХОТЬ ЧТО-ТО, ДАУН'
      return
    }

    spinning = true
    spinDeg += 360 * (3 + Math.floor(Math.random() * 5))

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let frame = 0
    const maxFrames = 20 + Math.floor(Math.random() * 15)

    const interval = setInterval(() => {
      frame++
      const len = Math.min(chunkCount, 8) + Math.floor(Math.random() * 20)
      spinValue = Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')

      if (frame >= maxFrames) {
        clearInterval(interval)
        const nick = generateNickname(activeThemes, chunkCount, customWords)
        currentNick = nick
        history = [nick, ...history].slice(0, 50)
        spinning = false
      }
    }, 50 + Math.floor(Math.random() * 30))
  }

  function doBatch(size: number) {
    if (!hasSelection) {
      currentNick = 'ВЫБЕРИ ХОТЬ ЧТО-ТО, ДАУН'
      return
    }
    const nicks = generateMultiple(size, activeThemes, chunkCount, customWords)
    currentNick = nicks[0]
    history = [...nicks, ...history].slice(0, 50)
  }

  function addCustomWord() {
    const trimmed = customInput.trim()
    if (trimmed && !customWords.includes(trimmed)) {
      customWords = [...customWords, trimmed]
      customInput = ''
    }
  }

  function removeCustomWord(word: string) {
    customWords = customWords.filter(w => w !== word)
  }

  async function copyNick(text: string, index?: number) {
    try {
      await navigator.clipboard.writeText(text)
      if (index !== undefined) {
        copyingIndex = index
        setTimeout(() => { copyingIndex = null }, 1200)
      } else {
        copied = true
        setTimeout(() => { copied = false }, 1200)
      }
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      if (index !== undefined) {
        copyingIndex = index
        setTimeout(() => { copyingIndex = null }, 1200)
      } else {
        copied = true
        setTimeout(() => { copied = false }, 1200)
      }
    }
  }

  function clearHistory() {
    history = []
  }
</script>

<div class="scanlines"></div>

<header>
  <pre class="logo">
  ██████╗ ██╗   ██╗███████╗██████╗ ███╗   ██╗ █████╗ ███╗   ███╗███████╗
 ██╔═══██╗██║   ██║██╔════╝██╔══██╗████╗  ██║██╔══██╗████╗ ████║██╔════╝
 ██║   ██║██║   ██║█████╗  ██████╔╝██╔██╗ ██║███████║██╔████╔██║█████╗
 ██║   ██║╚██╗ ██╔╝██╔══╝  ██╔══██╗██║╚██╗██║██╔══██║██║╚██╔╝██║██╔══╝
 ╚██████╔╝ ╚████╔╝ ███████╗██║  ██║██║ ╚████║██║  ██║██║ ╚═╝ ██║███████╗
  ╚═════╝   ╚═══╝  ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝</pre>
  <p class="subtitle">vibe-coding nickname generator для камчатского фрик-кибертеррориста</p>
</header>

<main>
  <div class="display-area">
    <div class="nickname-wrapper">
      {#if spinning}
        <div class="nickname spinning">{spinValue}<span class="cursor">|</span></div>
        <div class="roulette-wheel" style="transform: rotate({spinDeg}deg)">
          🎰
        </div>
      {:else}
        <div class="nickname" class:dim={!hasSelection}>{currentNick}</div>
      {/if}
    </div>

    <div class="display-actions">
      <button
        class="btn btn-copy"
        onclick={() => copyNick(currentNick)}
        disabled={!currentNick}
      >
        {copied ? '[ СКОПИРОВАНО ]' : '[ КОПИРОВАТЬ ]'}
      </button>
      <span class="copied-hint" class:visible={copied}>✓</span>
    </div>
  </div>

  <section class="controls">
    <div class="slider-block">
      <div class="slider-label">
        <span class="label-text">ЧАНКОВ:</span>
        <span class="label-value">{chunkCount}</span>
      </div>
      <div class="slider-container">
        <input
          type="range"
          min="1"
          max="100"
          bind:value={chunkCount}
          class="range-slider"
        />
        <div class="slider-labels">
          <span>1</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>
      </div>
    </div>

    <div class="themes-block">
      <span class="label-text">ТЕМЫ:</span>
      <div class="theme-toggles">
        {#each THEMES as theme}
          <button
            class="theme-tag"
            class:active={activeThemes.includes(theme.id)}
            onclick={() => toggleTheme(theme.id)}
          >
            {activeThemes.includes(theme.id) ? '[x]' : '[ ]'} {theme.label}
          </button>
        {/each}
      </div>
    </div>

    {#if customWords.length > 0}
      <div class="custom-words-block">
        <span class="label-text">КАСТОМНЫЕ СЛОВА:</span>
        <div class="custom-tags">
          {#each customWords as word}
            <button class="custom-tag" onclick={() => removeCustomWord(word)}>
              {word} ×
            </button>
          {/each}
        </div>
      </div>
    {/if}

    <div class="custom-input-block">
      <span class="label-text">СВОЁ СЛОВО:</span>
      <div class="custom-input-row">
        <input
          class="terminal-input"
          placeholder="введи слово..."
          bind:value={customInput}
          onkeydown={(e) => { if (e.key === 'Enter') addCustomWord() }}
        />
        <button class="btn btn-add" onclick={addCustomWord}>[ + ]</button>
      </div>
    </div>
  </section>

  <section class="action-block">
    <span class="label-text">ДЕЙСТВИЯ:</span>
    <div class="action-buttons">
      <button class="btn btn-primary" onclick={doSpin} disabled={!hasSelection}>
        {'>'} СГЕНЕРИРОВАТЬ {'<'}
      </button>
      <button class="btn btn-secondary" onclick={() => doBatch(5)} disabled={!hasSelection}>
        {'>'} x5 {'<'}
      </button>
      <button class="btn btn-secondary" onclick={() => doBatch(10)} disabled={!hasSelection}>
        {'>'} x10 HUI{'<'}
      </button>
    </div>
    <div class="stats">
      <span class="stat">слов в пуле: {totalWordCount}</span>
      <span class="stat">комбинаций: {combos}</span>
    </div>
  </section>

  {#if history.length > 0}
    <section class="history-block">
      <div class="history-header">
        <span class="label-text">ИСТОРИЯ ({history.length}):</span>
        <button class="btn btn-small" onclick={clearHistory}>[ ОЧИСТИТЬ ]</button>
      </div>
      <div class="history-list">
        {#each history as nick, i}
          <div class="history-item">
            <span class="history-nick">{i + 1}. {nick}</span>
            <button class="btn btn-tiny" onclick={() => copyNick(nick, i)}>
              {copyingIndex === i ? '✓' : '[C]'}
            </button>
          </div>
        {/each}
      </div>
    </section>
  {/if}
</main>

<footer>
  <pre>overname v1.0  |  сделано с любовью к оверу  |  камчатка 2025-2026</pre>
  <a class="github-link" href="https://github.com/relativemodder/overname" target="_blank" rel="noreferrer">{'>'} git clone https://github.com/relativemodder/overname</a>
</footer>

<style>
  .scanlines {
    pointer-events: none;
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 255, 65, 0.03) 2px,
      rgba(0, 255, 65, 0.03) 4px
    );
  }

  .logo {
    font-size: 8px;
    line-height: 1.1;
    color: var(--green-dim);
    text-align: center;
    margin: 0;
    user-select: none;
  }

  .subtitle {
    text-align: center;
    color: var(--green-dim);
    font-size: 13px;
    margin: 4px 0 0;
    opacity: 0.7;
  }

  .display-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin: 24px 0;
  }

  .nickname-wrapper {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }

  .nickname {
    font-size: clamp(18px, 4vw, 42px);
    font-weight: 700;
    color: var(--green);
    text-shadow: 0 0 20px var(--green-glow), 0 0 40px var(--green-glow);
    word-break: break-all;
    text-align: center;
    line-height: 1.3;
    padding: 16px 24px;
    border: 1px solid var(--green-dim);
    background: rgba(0, 255, 65, 0.03);
    border-radius: 4px;
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 200px;
    transition: border-color 0.3s;
  }

  .nickname.dim {
    color: var(--green-dim);
    text-shadow: none;
    font-size: 20px;
  }

  .nickname.spinning {
    font-family: var(--mono);
    font-weight: 400;
    font-size: clamp(14px, 3vw, 32px);
    color: var(--green-dim);
    text-shadow: 0 0 10px var(--green-glow);
  }

  .roulette-wheel {
    font-size: 48px;
    transition: transform 1.5s cubic-bezier(0.17, 0.67, 0.12, 0.99);
    flex-shrink: 0;
  }

  .display-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .copied-hint {
    color: var(--green);
    font-weight: 700;
    font-size: 18px;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .copied-hint.visible {
    opacity: 1;
  }

  .controls {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin: 20px 0;
  }

  .slider-block .slider-label {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 8px;
  }

  .label-text {
    font-size: 13px;
    color: var(--green-dim);
    letter-spacing: 1px;
  }

  .label-value {
    font-size: 22px;
    font-weight: 700;
    color: var(--green);
  }

  .slider-container {
    width: 100%;
  }

  .range-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 8px;
    background: var(--bg-light);
    border-radius: 4px;
    outline: none;
    cursor: pointer;
  }

  .range-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: var(--green);
    border-radius: 2px;
    cursor: pointer;
    box-shadow: 0 0 12px var(--green-glow);
  }

  .range-slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: var(--green);
    border: none;
    border-radius: 2px;
    cursor: pointer;
    box-shadow: 0 0 12px var(--green-glow);
  }

  .slider-labels {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: var(--green-dim);
    opacity: 0.5;
    margin-top: 4px;
  }

  .themes-block {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .theme-toggles {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .theme-tag {
    font-family: var(--mono);
    font-size: 12px;
    padding: 4px 10px;
    background: transparent;
    color: var(--green-dim);
    border: 1px solid var(--green-dim);
    border-radius: 3px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .theme-tag:hover {
    border-color: var(--green);
    color: var(--green);
  }

  .theme-tag.active {
    color: var(--green);
    border-color: var(--green);
    background: rgba(0, 255, 65, 0.08);
    text-shadow: 0 0 8px var(--green-glow);
  }

  .custom-words-block {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .custom-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .custom-tag {
    font-family: var(--mono);
    font-size: 12px;
    padding: 3px 8px;
    background: rgba(0, 255, 65, 0.06);
    color: var(--green);
    border: 1px solid var(--green);
    border-radius: 3px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .custom-tag:hover {
    background: rgba(255, 0, 0, 0.15);
    border-color: #ff3333;
    color: #ff3333;
  }

  .custom-input-block {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .custom-input-row {
    display: flex;
    gap: 8px;
  }

  .terminal-input {
    flex: 1;
    font-family: var(--mono);
    font-size: 14px;
    padding: 8px 12px;
    background: var(--bg-light);
    color: var(--green);
    border: 1px solid var(--green-dim);
    border-radius: 3px;
    outline: none;
    transition: border-color 0.2s;
  }

  .terminal-input:focus {
    border-color: var(--green);
    box-shadow: 0 0 8px var(--green-glow);
  }

  .terminal-input::placeholder {
    color: var(--green-dim);
    opacity: 0.4;
  }

  .btn {
    font-family: var(--mono);
    cursor: pointer;
    transition: all 0.2s;
    border-radius: 3px;
  }

  .btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .btn-copy {
    font-size: 14px;
    padding: 8px 20px;
    background: transparent;
    color: var(--green);
    border: 1px solid var(--green);
  }

  .btn-copy:hover:not(:disabled) {
    background: rgba(0, 255, 65, 0.1);
    box-shadow: 0 0 12px var(--green-glow);
  }

  .btn-add {
    font-size: 14px;
    padding: 8px 14px;
    background: transparent;
    color: var(--green);
    border: 1px solid var(--green);
  }

  .btn-add:hover {
    background: rgba(0, 255, 65, 0.1);
  }

  .action-block {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 8px 0;
  }

  .action-buttons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .btn-primary {
    font-size: 16px;
    padding: 12px 32px;
    background: transparent;
    color: var(--green);
    border: 2px solid var(--green);
    font-weight: 700;
    text-shadow: 0 0 8px var(--green-glow);
    box-shadow: 0 0 10px var(--green-glow);
  }

  .btn-primary:hover:not(:disabled) {
    background: rgba(0, 255, 65, 0.1);
    box-shadow: 0 0 20px var(--green-glow), 0 0 40px var(--green-glow);
  }

  .btn-secondary {
    font-size: 14px;
    padding: 8px 18px;
    background: transparent;
    color: var(--green-dim);
    border: 1px solid var(--green-dim);
  }

  .btn-secondary:hover:not(:disabled) {
    color: var(--green);
    border-color: var(--green);
    background: rgba(0, 255, 65, 0.06);
  }

  .btn-small {
    font-size: 11px;
    padding: 3px 8px;
    background: transparent;
    color: var(--green-dim);
    border: 1px solid var(--green-dim);
  }

  .btn-small:hover {
    color: var(--green);
    border-color: var(--green);
  }

  .btn-tiny {
    font-size: 10px;
    padding: 1px 6px;
    background: transparent;
    color: var(--green-dim);
    border: 1px solid var(--green-dim);
    border-radius: 2px;
  }

  .btn-tiny:hover {
    color: var(--green);
    border-color: var(--green);
  }

  .stats {
    display: flex;
    gap: 20px;
    font-size: 12px;
    color: var(--green-dim);
    opacity: 0.6;
  }

  .stat {
    letter-spacing: 0.5px;
  }

  .history-block {
    margin-top: 20px;
  }

  .history-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }

  .history-list {
    display: flex;
    flex-direction: column;
    gap: 3px;
    max-height: 300px;
    overflow-y: auto;
    padding-right: 8px;
  }

  .history-list::-webkit-scrollbar {
    width: 4px;
  }

  .history-list::-webkit-scrollbar-track {
    background: var(--bg-light);
  }

  .history-list::-webkit-scrollbar-thumb {
    background: var(--green-dim);
    border-radius: 2px;
  }

  .history-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 8px;
    border-radius: 2px;
    transition: background 0.2s;
  }

  .history-item:hover {
    background: rgba(0, 255, 65, 0.04);
  }

  .history-nick {
    font-size: 13px;
    color: var(--green-dim);
    word-break: break-all;
    flex: 1;
    cursor: pointer;
  }

  .history-nick:hover {
    color: var(--green);
  }

  footer {
    text-align: center;
    margin-top: 40px;
    padding: 16px 0;
    border-top: 1px solid var(--bg-light);
  }

  footer pre {
    font-size: 10px;
    color: var(--green-dim);
    opacity: 0.3;
    margin: 0;
  }

  .github-link {
    display: inline-block;
    margin-top: 6px;
    font-size: 11px;
    color: var(--green-dim);
    opacity: 0.5;
    text-decoration: none;
    transition: all 0.2s;
  }

  .github-link:hover {
    opacity: 1;
    color: var(--green);
    text-shadow: 0 0 8px var(--green-glow);
  }
</style>
