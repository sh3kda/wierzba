<script>
  import { onMount } from 'svelte';
  
  let displayedText = $state('');
  let currentIndex = $state(0);
  
  const messages = [
    "Strona 3 - Kontynuuj swoją przygodę!",
    "Dodaj tu kolejną część historii",
    "Edytuj te wiadomości według potrzeb"
  ];
  
  let currentMessageIndex = $state(0);
  const fullText = $derived(messages[currentMessageIndex]);
  
  onMount(() => {
    const typeInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        displayedText = fullText.slice(0, currentIndex + 1);
        currentIndex++;
      } else {
        setTimeout(() => {
          currentMessageIndex = (currentMessageIndex + 1) % messages.length;
          currentIndex = 0;
          displayedText = '';
        }, 2000);
      }
    }, 80);
    
    return () => clearInterval(typeInterval);
  });
</script>

<main>
    <nav class="glass-nav">
        <div class="nav-container">
            <button class="back-button" onclick={() => (location.href = '/strona2')}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Powrót
            </button>
            <h2 class="page-title">{import.meta.env.VITE_APP_NAME}</h2>
            <div class="page-counter">3 / 10</div>
        </div>
    </nav>

    <section class="story-section">
        <div class="chess-pattern-bg"></div>
        
        <div class="story-content">
            <div class="king-container">
                <img class="story-king" src="/src/lib/assets/whiteKing.svg" alt="White King" />
                <div class="king-glow"></div>
            </div>
            
            <div class="chat-bubble-container" 
                 onclick={() => (location.href = '/strona4')} 
                 onkeydown={(e) => e.key === 'Enter' && (location.href = '/strona4')}
                 role="button" 
                 tabindex="0">
                <div class="chat-bubble">
                    <p class="bubble-text">{displayedText}<span class="cursor">|</span></p>
                    <div class="bubble-tail"></div>
                </div>
                <p class="hint-text">Kliknij, aby kontynuować →</p>
            </div>
        </div>
    </section>
</main>

<style>
:root {
    --color-background: #eeeeee;
    --color-primary: #6A759B;
    --color-text: #373A40;
    --font-family: 'Inter', sans-serif;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: var(--font-family);
}

main {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 50%, #f0f0f0 100%);
    position: relative;
    overflow: hidden;
}

.glass-nav {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 1200px;
    z-index: 1000;
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
}

.back-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: transparent;
    color: var(--color-text);
    border: 2px solid var(--color-primary);
    padding: 0.7rem 1.5rem;
    font-size: 1rem;
    border-radius: 50px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
}

.back-button:hover {
    background: var(--color-primary);
    color: white;
    transform: translateX(-3px);
}

.page-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-primary);
    letter-spacing: -0.5px;
}

.page-counter {
    font-size: 1rem;
    color: var(--color-text);
    font-weight: 600;
    opacity: 0.7;
}

.story-section {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 120px 2rem 2rem;
    position: relative;
}

.chess-pattern-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.03;
    background-image: 
        linear-gradient(45deg, #6A759B 25%, transparent 25%),
        linear-gradient(-45deg, #6A759B 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #6A759B 75%),
        linear-gradient(-45deg, transparent 75%, #6A759B 75%);
    background-size: 100px 100px;
    background-position: 0 0, 0 50px, 50px -50px, -50px 0;
}

.story-content {
    display: grid;
    grid-template-columns: 450px 1fr;
    align-items: center;
    gap: 4rem;
    max-width: 1200px;
    width: 100%;
    z-index: 1;
}

.king-container {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.story-king {
    width: 100%;
    max-width: 400px;
    height: auto;
    filter: drop-shadow(0 20px 60px rgba(106, 117, 155, 0.3));
    animation: float 6s ease-in-out infinite;
    will-change: transform;
}

.king-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 280px;
    height: 280px;
    background: radial-gradient(circle, rgba(106, 117, 155, 0.2) 0%, transparent 70%);
    border-radius: 50%;
    animation: pulse 4s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
}

@keyframes pulse {
    0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
    50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
}

.chat-bubble-container {
    flex: 1;
    cursor: pointer;
    transition: all 0.3s ease;
}

.chat-bubble {
    position: relative;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border: 2px solid rgba(106, 117, 155, 0.2);
    border-radius: 25px;
    padding: 2.5rem 3rem;
    min-width: 350px;
    min-height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 40px rgba(106, 117, 155, 0.15);
    transition: all 0.3s ease;
}

.chat-bubble-container:hover .chat-bubble {
    transform: scale(1.02);
    box-shadow: 0 15px 50px rgba(106, 117, 155, 0.25);
    border-color: rgba(106, 117, 155, 0.4);
}

.chat-bubble-container:active .chat-bubble {
    transform: scale(0.98);
}

.bubble-text {
    font-size: 1.6rem;
    color: var(--color-text);
    margin: 0;
    font-weight: 500;
    line-height: 1.5;
}

.cursor {
    animation: blink 1s infinite;
    margin-left: 2px;
    color: var(--color-primary);
}

@keyframes blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
}

.bubble-tail {
    position: absolute;
    left: -18px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-top: 15px solid transparent;
    border-bottom: 15px solid transparent;
    border-right: 20px solid rgba(255, 255, 255, 0.9);
}

.hint-text {
    text-align: center;
    color: var(--color-primary);
    font-size: 1rem;
    margin-top: 1.5rem;
    opacity: 0.8;
    font-style: italic;
    animation: fadeInOut 2s ease-in-out infinite;
}

@keyframes fadeInOut {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
}

@media (max-width: 968px) {
    .story-content {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
    
    .king-container {
        order: -1;
    }
    
    .chat-bubble {
        min-width: 300px;
    }
    
    .nav-container {
        padding: 0.8rem 1rem;
    }
    
    .page-title {
        font-size: 1.2rem;
    }
}

@media (max-width: 640px) {
    .glass-nav {
        width: 95%;
        top: 10px;
    }
    
    .story-king {
        max-width: 280px;
    }
    
    .chat-bubble {
        min-width: 250px;
        padding: 2rem;
    }
    
    .bubble-text {
        font-size: 1.3rem;
    }
}
</style>
