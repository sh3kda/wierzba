<script>
  import { onMount } from 'svelte';

  let displayedText = $state('');
  let isTyping = $state(false);
  let typeInterval = undefined;
  let showChoices = $state(false);
  let choiceSelected = $state(false);
  let choiceResponseText = $state('');
  let choiceResponseTyping = $state(false);
  let selectedChoiceIndex = $state(-1);
  let aleText = $state('');
  let aleTyping = $state(false);
  let kingEntranceDone = $state(false);
  let showConfirm = $state(false);
  let isCentered = $derived(showChoices || choiceSelected);

  const messages = [
    { text: "Witaj, pionku!" },
    { text: "Nie podoba mi się to, ale muszę przyznać..." },
    { text: "...potrzebuję twojej pomocy!" },
    { text: "Wroga królowa uzurpuje sobie prawa do tronu mojego cyber-królestwa, a ja kompletnie nie znam się na tym." },
    { text: "To znaczy, na bezpieczeństwie." },
    { text: "Bo jak wiesz, JESTEM KRÓLEM. Na królowaniu znam się jak mało kto!" },
    { text: "No, ale w każdym razie..." },
    { text: "...potrzebuję kogoś, kto pomoże mi odzyskać mój tron i pokonać tę bezwzględną królową." },
    { text: "Czy mogę na ciebie liczyć?", isQuestion: true }
  ];

  const choices = [
    "Oczywiście! Jestem gotowy królu!",
    "Pionku? Cyber-królestwo? Ja ciebie nawet nie zn...",
  ];

  let currentMessageIndex = $state(0);

  function typeMessage() {
    if (typeInterval) clearInterval(typeInterval);
    showChoices = false;
    choiceSelected = false;
    choiceResponseText = '';
    isTyping = true;
    displayedText = '';
    const msg = messages[currentMessageIndex];
    const fullText = msg.text;
    let charIndex = 0;
    typeInterval = setInterval(() => {
      if (charIndex < fullText.length) {
        displayedText += fullText[charIndex];
        charIndex++;
      } else {
        clearInterval(typeInterval);
        isTyping = false;
        if (msg.isQuestion) showChoices = true;
      }
    }, 50);
  }

  function handleAdvance() {
    if (showChoices || choiceSelected) return;
    if (isTyping) {
      clearInterval(typeInterval);
      displayedText = messages[currentMessageIndex].text;
      isTyping = false;
      if (messages[currentMessageIndex].isQuestion) showChoices = true;
      return;
    }
    if (currentMessageIndex < messages.length - 1) {
      currentMessageIndex++;
      sessionStorage.setItem('strona1_index', currentMessageIndex.toString());
      typeMessage();
    }
  }

  function handleChoice(index) {
    showChoices = false;
    choiceSelected = true;
    selectedChoiceIndex = index;
    choiceResponseText = '';
    choiceResponseTyping = false;
    aleText = '';
    aleTyping = false;

    const responses = [
      "Wspaniałe! Wiedziałem, że ci poddani mogą się jednak na coś czasem przydać!",
      "Wiedziałem, że się zgodzisz. Dobrze mieć w tobie wsparcie!"
    ];

    if (index === 1) {
      aleTyping = true;
      const aleFullText = 'Ale...';
      let a = 0;
      const aleInterval = setInterval(() => {
        if (a < aleFullText.length) {
          aleText += aleFullText[a];
          a++;
        } else {
          clearInterval(aleInterval);
          aleTyping = false;
          startKingResponse(responses[index]);
        }
      }, 60);
    } else {
      startKingResponse(responses[index]);
    }
  }

  function startKingResponse(response) {
    choiceResponseTyping = true;
    let i = 0;
    const t = setInterval(() => {
      if (i < response.length) {
        choiceResponseText += response[i];
        i++;
      } else {
        clearInterval(t);
        choiceResponseTyping = false;
      }
    }, 40);
  }

  function handleChoiceConfirm() {
    location.href = '/strona2';
  }

  function handleBack() {
    if (typeInterval) clearInterval(typeInterval);
    isTyping = false;
    showChoices = false;
    choiceSelected = false;
    choiceResponseText = '';

    if (currentMessageIndex === 0) {
      location.href = '/';
      return;
    }

    currentMessageIndex--;
    sessionStorage.setItem('strona1_index', currentMessageIndex.toString());
    typeMessage();
  }

  function handleKeydown(e) {
    if (showConfirm) {
      if (e.key === 'Escape') { e.preventDefault(); showConfirm = false; }
      return;
    }
    if (['INPUT', 'TEXTAREA', 'BUTTON'].includes(e.target.tagName)) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (choiceSelected && !choiceResponseTyping && !aleTyping) { handleChoiceConfirm(); }
      else { handleAdvance(); }
      return;
    }
    if (showChoices) {
      const num = parseInt(e.key);
      if (!isNaN(num) && num >= 1 && num <= choices.length) {
        e.preventDefault();
        handleChoice(num - 1);
      }
    }
  }

  onMount(() => {
    const savedIndex = sessionStorage.getItem('strona1_index');
    if (savedIndex !== null) {
      currentMessageIndex = parseInt(savedIndex);
      kingEntranceDone = true;
    } else {
      sessionStorage.removeItem('strona2_index');
      setTimeout(() => { kingEntranceDone = true; }, 900);
    }
    typeMessage();
    window.addEventListener('keydown', handleKeydown);
    return () => {
      if (typeInterval) clearInterval(typeInterval);
      window.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

<main>
  <nav class="glass-nav">
    <div class="nav-container">
      <button class="back-button" onclick={handleBack} aria-label="Cofnij">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button class="page-title-btn" onclick={() => showConfirm = true}>
        {import.meta.env.VITE_APP_NAME}
      </button>
      <div class="page-counter">1 / 10</div>
    </div>
  </nav>

  {#if showConfirm}
  <div class="confirm-overlay" role="dialog" aria-modal="true"
       onkeydown={(e) => e.key === 'Escape' && (showConfirm = false)}>
    <div class="confirm-box">
      <p class="confirm-msg">Czy jesteś pewny? Postęp tej sesji zostanie utracony.</p>
      <div class="confirm-btns">
        <button class="confirm-yes" onclick={() => { sessionStorage.clear(); location.href = '/'; }}>Tak, wróć do menu</button>
        <button class="confirm-no" onclick={() => showConfirm = false}>Nie, kontynuuj</button>
      </div>
    </div>
  </div>
  {/if}

  <section class="story-section">
    <div class="chess-pattern-bg"></div>

    {#if isCentered}
      <div class="center-scene" class:center-scene-row={choiceSelected}
           onclick={choiceSelected && !choiceResponseTyping && !aleTyping ? handleChoiceConfirm : undefined}
           role={choiceSelected ? 'button' : undefined}
           tabindex={choiceSelected ? 0 : undefined}
           onkeydown={choiceSelected ? (e) => (e.key === ' ' || e.key === 'Enter') && !choiceResponseTyping && !aleTyping && handleChoiceConfirm() : undefined}
           style={choiceSelected ? 'cursor: pointer' : ''}>
        <div class="center-king-wrap">
          <div class="center-king-glow"></div>
          <img class="center-king-img king-float" src="/src/lib/assets/whiteKing.svg" alt="White King"/>
        </div>
        <div class="center-dialogue">
          {#if showChoices}
            <div class="speech-bubble no-pointer">
              <p class="bubble-text">{displayedText}</p>
            </div>
            <div class="choices">
              {#each choices as choice, i}
                <button class="choice-btn" class:choice-btn-alt={i > 0} onclick={() => handleChoice(i)}>
                  <span class="choice-key">{i + 1}.</span> {choice}
                </button>
              {/each}
            </div>
            <p class="hint-small">Naciśnij <kbd>1</kbd> lub <kbd>2</kbd></p>
          {/if}
          {#if choiceSelected}
            {#if aleText || aleTyping}
              <div class="speech-bubble player-bubble no-pointer">
                <p class="bubble-text">{aleText}{aleTyping ? '▌' : ''}</p>
              </div>
            {/if}
            {#if !aleTyping && choiceResponseText}
              <div class="speech-bubble no-pointer">
                <p class="bubble-text">{choiceResponseText}{choiceResponseTyping ? '▌' : ''}</p>
              </div>
              {#if !choiceResponseTyping}
                <p class="hint-small">{selectedChoiceIndex === 0 ? 'Do dzieła! → Kliknij lub Spacja' : 'Dalej → Kliknij lub Spacja'}</p>
              {/if}
            {/if}
          {/if}
        </div>
      </div>

    {:else}
      <div class="story-layout"
           onclick={handleAdvance}
           onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleAdvance()}
           role="button"
           tabindex="0">
        <div class="king-col">
          <div class="king-glow"></div>
          <img
            class="king-img"
            class:king-entrance={!kingEntranceDone}
            class:king-float={kingEntranceDone}
            src="/src/lib/assets/whiteKing.svg"
            alt="White King"
          />
        </div>
        <div class="bubble-col">
          <div class="speech-bubble">
            <p class="bubble-text">{displayedText}{isTyping ? '▌' : ''}</p>
          </div>
          <p class="hint-text">
            {isTyping ? 'Skip' : 'Kontynuuj →'}
          </p>
        </div>
      </div>
    {/if}
  </section>
</main>

<style>
:root {
  --color-primary: #6A759B;
  --color-text: #373A40;
  --font-family: 'Inter', sans-serif;
}
* { margin: 0; padding: 0; box-sizing: border-box; font-family: var(--font-family); }

main {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 50%, #f0f0f0 100%);
  position: relative;
  overflow: hidden;
}

.glass-nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
  background: rgba(255,255,255,0.7);
  border-bottom: 1px solid rgba(255,255,255,0.5);
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}
.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 2rem;
}
.back-button {
  display: flex;
  align-items: center;
  background: transparent;
  color: var(--color-text);
  border: 2px solid var(--color-primary);
  padding: 0.5rem 0.75rem;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.back-button:hover { background: var(--color-primary); color: white; transform: translateX(-3px); }
.page-title-btn {
  font-size: 1.6rem;
  font-weight: 800;
  font-family: 'Georgia', 'Palatino Linotype', serif;
  color: #3e4770;
  letter-spacing: -0.5px;
  font-style: italic;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
  transition: background 0.2s;
}
.page-title-btn:hover { background: rgba(106,117,155,0.1); }
.page-counter { font-size: 1rem; color: var(--color-text); font-weight: 600; opacity: 0.7; }

.confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
}
.confirm-box {
  background: white;
  border-radius: 20px;
  padding: 2rem 2.5rem;
  max-width: 420px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  text-align: center;
}
.confirm-msg { font-size: 1.15rem; color: var(--color-text); font-weight: 500; line-height: 1.5; }
.confirm-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
.confirm-yes {
  background: #e05a5a; color: white; border: none;
  padding: 0.75rem 1.5rem; border-radius: 50px;
  font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: all 0.2s;
}
.confirm-yes:hover { background: #c94444; transform: translateY(-2px); }
.confirm-no {
  background: transparent; color: var(--color-primary);
  border: 2px solid var(--color-primary); padding: 0.75rem 1.5rem;
  border-radius: 50px; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: all 0.2s;
}
.confirm-no:hover { background: rgba(106,117,155,0.1); transform: translateY(-2px); }

.story-section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding-top: 70px;
  position: relative;
}
.chess-pattern-bg {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  opacity: 0.03;
  background-image:
    linear-gradient(45deg, #6A759B 25%, transparent 25%),
    linear-gradient(-45deg, #6A759B 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #6A759B 75%),
    linear-gradient(-45deg, transparent 75%, #6A759B 75%);
  background-size: 100px 100px;
  background-position: 0 0, 0 50px, 50px -50px, -50px 0;
}

.story-layout {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 3rem;
  align-items: center;
  max-width: 1100px;
  width: 100%;
  padding: 0 3rem;
  z-index: 2;
  cursor: pointer;
}
.king-col {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.king-img {
  width: 380px;
  max-width: 100%;
  height: auto;
  filter: drop-shadow(0 20px 60px rgba(106,117,155,0.3));
}
.king-glow {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 280px; height: 280px;
  background: radial-gradient(circle, rgba(106,117,155,0.2) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulseCenter 4s ease-in-out infinite;
}
.bubble-col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.center-scene {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  max-width: 680px;
  width: 100%;
  padding: 1rem 2rem;
  z-index: 2;
}
.center-scene-row {
  flex-direction: row;
  align-items: flex-end;
  max-width: 1100px;
  gap: 3rem;
}
.center-scene-row .center-king-wrap {
  flex-shrink: 0;
}
.center-scene-row .center-king-img {
  width: 320px;
}
.center-scene-row .center-dialogue {
  flex: 1;
  align-items: flex-start;
  padding-bottom: 0.5rem;
}
.center-king-wrap {
  position: relative;
  display: flex;
  justify-content: center;
}
.center-king-img {
  width: 220px;
  height: auto;
  filter: drop-shadow(0 15px 40px rgba(106,117,155,0.3));
}
.center-king-glow {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 160px; height: 160px;
  background: radial-gradient(circle, rgba(106,117,155,0.18) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulseCenter 4s ease-in-out infinite;
}
.center-dialogue {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.speech-bubble {
  width: 100%;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(106,117,155,0.2);
  border-radius: 20px;
  padding: 1.8rem 2.5rem;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 40px rgba(106,117,155,0.15);
  cursor: pointer;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}
.speech-bubble:hover { box-shadow: 0 15px 50px rgba(106,117,155,0.25); border-color: rgba(106,117,155,0.4); }
.no-pointer { cursor: default; }
.no-pointer:hover { box-shadow: 0 10px 40px rgba(106,117,155,0.15); border-color: rgba(106,117,155,0.2); }
.player-bubble {
  background: rgba(106,117,155,0.12);
  border-color: rgba(106,117,155,0.35);
  min-height: unset;
  padding: 1rem 1.8rem;
  align-self: flex-end;
}
.bubble-text {
  font-size: 1.45rem;
  color: var(--color-text);
  font-weight: 500;
  line-height: 1.5;
  text-align: center;
}

.choices { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }
.choice-btn {
  background: var(--color-primary); color: white; border: none;
  padding: 0.85rem 1.8rem; border-radius: 50px;
  font-size: 1rem; font-weight: 600; cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 4px 15px rgba(106,117,155,0.4);
  display: flex; align-items: center; gap: 0.5rem;
  flex: 1; min-width: 0; justify-content: center;
}
.choice-btn:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(106,117,155,0.5); }
.choice-btn-alt {
  background: transparent; color: var(--color-primary);
  border: 2px solid var(--color-primary); box-shadow: none;
}
.choice-btn-alt:hover { background: rgba(106,117,155,0.08); transform: translateY(-3px); }
.choice-key { font-size: 0.82rem; opacity: 0.72; font-weight: 700; }
.confirm-row { display: flex; flex-direction: column; align-items: center; gap: 0.4rem; }
.next-btn {
  background: var(--color-primary); color: white; border: none;
  padding: 0.9rem 2.5rem; border-radius: 50px;
  font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.25s ease;
}
.next-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(106,117,155,0.4); }

.hint-text {
  color: var(--color-primary); font-size: 0.9rem;
  font-style: italic; opacity: 0.75; min-height: 1.2em;
  animation: fadeInOut 2s ease-in-out infinite; text-align: center;
}
.hint-small { color: var(--color-primary); font-size: 0.85rem; font-style: italic; opacity: 0.7; text-align: center; }
kbd {
  background: rgba(106,117,155,0.12); border: 1px solid rgba(106,117,155,0.3);
  border-radius: 4px; padding: 0.1rem 0.4rem;
  font-family: monospace; font-size: 0.8rem; font-style: normal;
}

@keyframes fadeInOut { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.9; } }
@keyframes kingEntrance {
  0%   { transform: translateY(60%) scale(0.6); opacity: 0; }
  65%  { transform: translateY(-10px) scale(1.03); opacity: 1; }
  85%  { transform: translateY(4px) scale(0.98); }
  100% { transform: translateY(0) scale(1); opacity: 1; }
}
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
@keyframes pulseCenter {
  0%, 100% { opacity: 0.5; transform: translate(-50%,-50%) scale(1); }
  50%       { opacity: 0.9; transform: translate(-50%,-50%) scale(1.1); }
}
.king-entrance { animation: kingEntrance 0.85s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
.king-float    { animation: float 6s ease-in-out infinite; }

@media (max-width: 900px) {
  .story-layout { grid-template-columns: 1fr; padding: 0 1.5rem; }
  .king-img { width: 220px; }
  .king-col { order: -1; }
}
@media (max-width: 640px) {
  .bubble-text { font-size: 1.15rem; }
  .speech-bubble { padding: 1.4rem 1.6rem; min-height: 90px; }
  .choices { flex-direction: column; align-items: stretch; }
  .center-king-img { width: 160px; }
}
</style>
