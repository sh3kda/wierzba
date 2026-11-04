<script>
  import { onMount } from 'svelte';

  let displayedText = $state('');
  let isTyping = $state(false);
  let typeInterval = undefined;
  let showConfirm = $state(false);

  // Stan specyficzny dla zadania
  let isSuccess = $state(false);
  let isError = $state(false);
  let showHint = $state(false);

  // Tablica przechowująca wybory użytkownika dla 5 kroków
  let answers = $state(['', '', '', '', '']);
  
  // Prawidłowe odpowiedzi: jawny, szyfr, szyfr, szyfr, jawny
  const correctAnswers = ['jawny', 'szyfr', 'szyfr', 'szyfr', 'jawny'];

  const journeySteps = [
    "1. Nadawca pisze wiadomość",
    "2. Moment zaszyfrowania kłódką",
    "3. Podróż przez dziki Internet",
    "4. Dotarcie na urządzenie odbiorcy",
    "5. Odszyfrowanie prywatnym kluczem"
  ];

  const messages = [
    { text: "Skoro wiesz już, po co nam te dwa klucze... czas na mały test!" },
    { text: "Wyobraź sobie, że wiadomość wyrusza w podróż od nadawcy do odbiorcy." },
    { text: "Twoim zadaniem jest określić, w jakiej formie znajduje się ta wiadomość na poszczególnych etapach." },
    { text: "Zaznacz odpowiedni stan z listy przy każdym kroku. Jeśli utkniesz, kliknij we mnie po małą wskazówkę!" },
  ];

  const hintMessage = "Podpowiedź: Pomyśl logicznie. Kto ma prawo przeczytać tekst? Tylko ten kto go pisze i ten kto go odbiera! Przez całą resztę drogi wiadomość musi być ukryta.";
  const successMessage = "Znakomicie! Zrozumiałeś to perfekcyjnie. Wiadomość jest w pełni bezpieczna tylko wtedy, gdy podróżuje jako szyfrogram. Kliknij, by iść dalej.";

  let currentMessageIndex = $state(0);

  function typeText(fullText) {
    if (typeInterval) clearInterval(typeInterval);
    isTyping = true;
    displayedText = '';
    let charIndex = 0;
    typeInterval = setInterval(() => {
      if (charIndex < fullText.length) {
        displayedText += fullText[charIndex];
        charIndex++;
      } else {
        clearInterval(typeInterval);
        isTyping = false;
      }
    }, 50);
  }

  function typeCurrentMessage() {
    typeText(messages[currentMessageIndex].text);
  }

  function handleAdvance() {
    if (isTyping) {
      clearInterval(typeInterval);
      if (isSuccess) displayedText = successMessage;
      else if (showHint) displayedText = hintMessage;
      else displayedText = messages[currentMessageIndex].text;
      
      isTyping = false;
      return;
    }

    if (isSuccess) {
      location.href = '/strona8'; // Przejście do kolejnej lekcji
      return;
    }

    if (currentMessageIndex < messages.length - 1) {
      currentMessageIndex++;
      sessionStorage.setItem('strona7_index', currentMessageIndex.toString());
      typeCurrentMessage();
    } else {
      if (!showHint) {
        showHint = true;
        typeText(hintMessage);
      }
    }
  }

  function handleBack() {
    if (isTyping) {
      clearInterval(typeInterval);
      if (isSuccess) displayedText = successMessage;
      else if (showHint) displayedText = hintMessage;
      else displayedText = messages[currentMessageIndex].text;
      
      isTyping = false;
      return;
    }

    if (showHint || isSuccess) {
      showHint = false;
      isSuccess = false;
      isError = false;
      typeCurrentMessage();
      return;
    }

    if (currentMessageIndex > 0) {
      currentMessageIndex--;
      sessionStorage.setItem('strona7_index', currentMessageIndex.toString());
      typeCurrentMessage();
    } else {
      location.href = '/strona6';
    }
  }

  function checkAnswer() {
    // Sprawdzamy, czy wszystkie odpowiedzi się zgadzają
    const allCorrect = answers.every((val, index) => val === correctAnswers[index]);
    const allFilled = answers.every(val => val !== '');

    if (!allFilled) {
      isError = true;
      setTimeout(() => isError = false, 2000);
      return; // Gracz nie wypełnił wszystkich pół
    }

    if (allCorrect) {
      isSuccess = true;
      isError = false;
      typeText(successMessage);
    } else {
      isError = true;
      setTimeout(() => isError = false, 2000); 
    }
  }

  function handleKeydown(e) {
    if (showConfirm) {
      if (e.key === 'Escape') { e.preventDefault(); showConfirm = false; }
      return;
    }
    if (['SELECT', 'BUTTON'].includes(e.target.tagName)) return;
    
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleAdvance();
    }
  }

  onMount(() => {
    const savedIndex = sessionStorage.getItem('strona7_index');
    if (savedIndex) {
      currentMessageIndex = parseInt(savedIndex);
    }
    typeCurrentMessage();
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
      <div class="page-counter">7 / 10</div>
    </div>
  </nav>

  {#if showConfirm}
  <div class="confirm-overlay" role="dialog" aria-modal="true" onkeydown={(e) => e.key === 'Escape' && (showConfirm = false)}>
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

    <div class="right-panel">
      {#if currentMessageIndex > 1}
      <div class="workspace">
        <span class="ws-tag">Zadanie Logiczne</span>
        <h2 class="ws-title" style="margin-bottom: 0.5rem;">Podróż Wiadomości</h2>
        <p class="ws-content">Wybierz odpowiedni stan dokumentu dla każdego etapu jego trasy.</p>
        
        <div style="margin-top: 1rem; position: relative; padding-left: 2rem;">
          <div style="position: absolute; left: 0.6rem; top: 1rem; bottom: 1.5rem; width: 3px; background: rgba(106,117,155,0.2); border-radius: 3px;"></div>

          <div style="display: flex; flex-direction: column; gap: 1.2rem;">
            {#each journeySteps as step, index}
              <div style="position: relative; background: rgba(106,117,155,0.04); padding: 0.8rem 1rem; border-radius: 12px; border: 1px solid rgba(106,117,155,0.1);">
                <div style="position: absolute; left: -1.8rem; top: 50%; transform: translateY(-50%); width: 0.9rem; height: 0.9rem; background: var(--color-primary); border-radius: 50%; border: 2px solid white; box-shadow: 0 0 0 2px rgba(106,117,155,0.2);"></div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
                  <span style="font-weight: 600; font-size: 0.95rem; color: var(--color-text);">{step}</span>
                  
                  <select 
                    bind:value={answers[index]} 
                    disabled={isSuccess}
                    style="padding: 0.5rem; border-radius: 8px; border: 2px solid {answers[index] === '' ? 'rgba(106,117,155,0.3)' : 'var(--color-primary)'}; background: white; color: var(--color-text); font-weight: bold; cursor: pointer; outline: none; min-width: 140px;"
                  >
                    <option value="" disabled>Wybierz...</option>
                    <option value="jawny">Tekst jawny</option>
                    <option value="szyfr">Szyfrogram</option>
                  </select>
                </div>
              </div>
            {/each}
          </div>
        </div>

        <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem;">
          {#if !isSuccess}
            <button 
              onclick={checkAnswer}
              style="padding: 1rem; border-radius: 8px; background: var(--color-primary); color: white; font-weight: bold; cursor: pointer; border: none; transition: opacity 0.2s;"
            >
              Sprawdź trasę
            </button>
          {/if}

          {#if isError}
            <p style="color: #e05a5a; text-align: center; margin: 0; font-size: 0.95rem; font-weight: 600;">Gdzieś jest błąd! Upewnij się, że zaznaczyłeś wszystkie pola właściwie.</p>
          {/if}
        </div>

      </div>
      {/if}

      <div class="dialogue-area"
           onclick={handleAdvance}
           onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleAdvance()}
           role="button"
           tabindex="0">
        <div class="speech-bubble">
          <p class="bubble-text">{displayedText}{isTyping ? '◌' : ''}</p>
        </div>
        <p class="hint-text">
          {isTyping
            ? 'Skip'
            : isSuccess 
              ? 'Przejdź dalej →'
              : showHint 
                ? 'Rozwiąż zadanie wyżej ↑'
                : currentMessageIndex < messages.length - 1
                  ? 'Kontynuuj →'
                  : 'Kliknij po podpowiedź 💡'}
        </p>
      </div>
    </div>

    <div class="king-abs-wrap">
      <div class="king-abs-glow"></div>
      <img class="king-abs-img" src="/src/lib/assets/whiteKing.svg" alt="White King" />
    </div>
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
  height: 100vh;
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
  text-align: left;
}
.confirm-msg {
  font-size: 1.15rem;
  color: var(--color-text);
  font-weight: 500;
  line-height: 1.5;
}
.confirm-btns {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}
.confirm-yes {
  background: #e05a5a;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.confirm-yes:hover { background: #c94444; transform: translateY(-2px); }
.confirm-no {
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.confirm-no:hover { background: rgba(106,117,155,0.1); transform: translateY(-2px); }

.story-section {
  position: relative;
  height: 100vh;
  padding-top: 70px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
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


.right-panel {
  position: absolute;
  top: 80px;
  left: calc(4vw + 210px + 2rem);
  right: 2.5rem;
  bottom: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 1.5rem;
  z-index: 2;
}

.workspace {
  flex: 1;
  background: rgba(255,255,255,0.87);
  backdrop-filter: blur(14px);
  border: 1.5px solid rgba(106,117,155,0.14);
  border-radius: 24px;
  padding: 1.8rem 2.2rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  overflow-y: auto;
  box-shadow: 0 8px 40px rgba(106,117,155,0.12);
  animation: wsFadeIn 0.4s cubic-bezier(0.22,1,0.36,1) both;
}
@keyframes wsFadeIn {
  from { opacity: 0; transform: translateY(-10px) scale(0.985); }
  to   { opacity: 1; transform: translateY(0)     scale(1); }
}
.ws-tag {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-primary);
  opacity: 0.5;
}
.ws-title {
  font-size: 1.45rem;
  font-weight: 800;
  color: var(--color-primary);
  line-height: 1.2;
  margin: 0;
}
.ws-content {
  font-size: 0.97rem;
  color: var(--color-text);
  line-height: 1.75;
  opacity: 0.82;
}

.ws-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding-left: 0;
  list-style: none;
}
.ws-item {
  font-size: 0.94rem;
  color: var(--color-text);
  line-height: 1.5;
  padding: 0.55rem 1rem 0.55rem 1.1rem;
  border-left: 3px solid rgba(106,117,155,0.3);
  background: rgba(106,117,155,0.05);
  border-radius: 0 10px 10px 0;
  animation: itemSlide 0.35s ease both;
}
.ws-item:nth-child(1) { animation-delay: 0.04s; border-left-color: #6A759B; }
.ws-item:nth-child(2) { animation-delay: 0.09s; border-left-color: #7e8fba; }
.ws-item:nth-child(3) { animation-delay: 0.14s; border-left-color: #9aaad0; }
.ws-item:nth-child(4) { animation-delay: 0.19s; border-left-color: #b5c3e0; }
@keyframes itemSlide {
  from { transform: translateX(-10px); opacity: 0; }
  to   { transform: none; opacity: 1; }
}

.ws-steps {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-left: 0;
  list-style: none;
  counter-reset: step-counter;
}
.ws-step {
  counter-increment: step-counter;
  font-size: 0.94rem;
  color: var(--color-text);
  line-height: 1.5;
  padding: 0.45rem 0.9rem 0.45rem 3rem;
  position: relative;
  margin-bottom: 0.55rem;
}
.ws-step::before {
  content: counter(step-counter);
  position: absolute;
  left: 0;
  top: 0.35rem;
  width: 1.65rem; height: 1.65rem;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  font-size: 0.72rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}
.ws-step::after {
  content: '';
  position: absolute;
  left: 0.78rem;
  top: 2rem;
  bottom: -0.55rem;
  width: 2px;
  background: linear-gradient(to bottom, rgba(106,117,155,0.35), rgba(106,117,155,0.04));
}
.ws-step:last-child::after { display: none; }

.ws-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.65rem;
}
.ws-card {
  background: rgba(106,117,155,0.06);
  border-radius: 14px;
  padding: 0.9rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  border-top: 3px solid transparent;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.ws-card:nth-child(4n+1) { border-top-color: #6A759B; }
.ws-card:nth-child(4n+2) { border-top-color: #8e9fc5; }
.ws-card:nth-child(4n+3) { border-top-color: #5a6b92; }
.ws-card:nth-child(4n+4) { border-top-color: #a0b0d4; }
.ws-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(106,117,155,0.14); }
.ws-card-head { font-size: 0.88rem; font-weight: 700; color: var(--color-primary); }
.ws-card-body { font-size: 0.82rem; color: var(--color-text); opacity: 0.75; line-height: 1.4; }

.ws-stat-block {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  padding: 1.1rem 1.5rem;
  background: linear-gradient(135deg, rgba(106,117,155,0.09), rgba(106,117,155,0.04));
  border-radius: 18px;
  border-left: 4px solid var(--color-primary);
  position: relative;
  overflow: hidden;
}
.ws-stat-block::after {
  content: '';
  position: absolute;
  right: -25px; top: -25px;
  width: 110px; height: 110px;
  border-radius: 50%;
  background: rgba(106,117,155,0.07);
  pointer-events: none;
}
.ws-stat {
  font-size: 3rem;
  font-weight: 900;
  color: var(--color-primary);
  line-height: 1;
  animation: statPop 0.55s cubic-bezier(0.34,1.56,0.64,1) both;
  animation-delay: 0.15s;
}
.ws-stat-label { font-size: 0.88rem; color: var(--color-text); opacity: 0.6; font-weight: 600; }
@keyframes statPop {
  from { transform: scale(0.55) translateY(6px); opacity: 0; }
  to   { transform: scale(1) translateY(0); opacity: 1; }
}

.ws-examples {
  display: flex;
  gap: 0;
  position: relative;
  align-items: stretch;
  border-radius: 14px;
  overflow: hidden;
}
.ws-examples::after {
  content: 'VS';
  position: absolute;
  left: 50%; top: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.68rem;
  font-weight: 900;
  color: var(--color-primary);
  opacity: 0.35;
  letter-spacing: 0.12em;
  z-index: 1;
  background: white;
  border-radius: 50%;
  width: 1.5rem; height: 1.5rem;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(106,117,155,0.15);
}
.ws-example { flex: 1; padding: 1rem 1.4rem; display: flex; flex-direction: column; gap: 0.4rem; border: none; }
.ws-bad  { background: rgba(200,70,70,0.08); }
.ws-good { background: rgba(60,180,100,0.08); }
.ws-ex-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.55; }
.ws-bad  .ws-ex-label { color: #b83a3a; }
.ws-good .ws-ex-label { color: #2e8c52; }
.ws-ex-value { font-family: 'Courier New', monospace; font-size: 1rem; font-weight: 700; color: var(--color-text); padding: 0.3rem 0.6rem; background: rgba(0,0,0,0.05); border-radius: 6px; display: inline-block; word-break: break-all; }

.ws-bars { display: flex; flex-direction: column; gap: 0.75rem; }
.ws-bar-row { display: grid; grid-template-columns: 9rem 1fr 2.8rem; align-items: center; gap: 0.75rem; }
.ws-bar-label { font-size: 0.85rem; color: var(--color-text); font-weight: 500; text-align: right; opacity: 0.85; }
.ws-bar-track { height: 10px; background: rgba(106,117,155,0.1); border-radius: 99px; overflow: hidden; }
.ws-bar-fill {
  height: 100%;
  border-radius: 99px;
  background: linear-gradient(90deg, #5a6b92, #8e9fc5);
  transform-origin: left;
  animation: barGrow 0.65s cubic-bezier(0.22,1,0.36,1) both;
  animation-delay: 0.2s;
}
.ws-bar-val { font-size: 0.78rem; color: var(--color-primary); font-weight: 700; opacity: 0.8; }
@keyframes barGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }

.ws-note { font-size: 0.86rem; color: var(--color-primary); font-style: italic; opacity: 0.72; padding: 0.55rem 1rem; background: rgba(106,117,155,0.06); border-radius: 10px; border-left: 3px solid rgba(106,117,155,0.28); }

.dialogue-area {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  cursor: pointer;
}

.king-abs-wrap {
  position: absolute;
  bottom: 0;
  left: 4vw;
  display: flex;
  align-items: flex-end;
  pointer-events: none;
  z-index: 1;
}
.king-abs-img {
  width: 210px;
  height: auto;
  filter: drop-shadow(0 10px 30px rgba(106,117,155,0.3));
  animation: float 6s ease-in-out infinite;
}
.king-abs-glow {
  position: absolute;
  bottom: 30px;
  left: 50px;
  width: 110px;
  height: 110px;
  background: radial-gradient(circle, rgba(106,117,155,0.18) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse 4s ease-in-out infinite;
}

.speech-bubble {
  width: 100%;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(106,117,155,0.2);
  border-radius: 20px;
  padding: 1.8rem 2.5rem;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  box-shadow: 0 10px 40px rgba(106,117,155,0.15);
  cursor: pointer;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
  position: relative;
}
.speech-bubble::before {
  content: '';
  position: absolute;
  bottom: -1px;
  left: -18px;
  width: 0; height: 0;
  border-top: 12px solid transparent;
  border-bottom: 0px solid transparent;
  border-right: 20px solid rgba(106,117,155,0.2);
  filter: drop-shadow(-2px 1px 1px rgba(106,117,155,0.1));
}
.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: 1px;
  left: -14px;
  width: 0; height: 0;
  border-top: 10px solid transparent;
  border-bottom: 0px solid transparent;
  border-right: 18px solid rgba(255,255,255,0.97);
}
.speech-bubble:hover { box-shadow: 0 15px 50px rgba(106,117,155,0.25); border-color: rgba(106,117,155,0.4); }
.bubble-text {
  font-size: 1.45rem;
  color: var(--color-text);
  font-weight: 500;
  line-height: 1.5;
  text-align: center;
}
.hint-text {
  color: var(--color-primary);
  font-size: 0.9rem;
  font-style: italic;
  opacity: 0.75;
  min-height: 1.2em;
  animation: fadeInOut 2s ease-in-out infinite;
  text-align: center;
}

@keyframes fadeInOut { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.9; } }
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
@keyframes pulse { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 0.9; transform: scale(1.1); } }

@media (max-width: 768px) {
  .king-abs-img { width: 150px; }
  .bubble-text { font-size: 1.2rem; }
  .speech-bubble { padding: 1.4rem 1.8rem; }
  .dialogue-area { margin-bottom: 2rem; padding: 0 1rem; }
}
</style>
