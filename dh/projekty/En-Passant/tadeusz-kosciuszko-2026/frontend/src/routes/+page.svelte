<script>
  let showScenarioPopup = $state(false);
  let isStarting = $state(false);

  function openScenarioPopup() {
    showScenarioPopup = true;
  }

  function closeScenarioPopup() {
    showScenarioPopup = false;
  }

  function startGame() {
    if (isStarting) return;
    isStarting = true;
    setTimeout(() => { location.href = '/strona1'; }, 700);
  }
</script>

<main>
    <nav class="glass-nav">
        <div class="nav-container">
            <button class="nav-brand" onclick={() => (location.href = '/')}>
                <span class="nav-title">{import.meta.env.VITE_APP_NAME}</span>
            </button>
            <ul class="nav-menu">
                <li><button class="nav-link" onclick={() => (location.href = '/Biblioteka')}>{import.meta.env.VITE_NAV_2}</button></li>
                <li><button class="nav-link" onclick={openScenarioPopup}>{import.meta.env.VITE_NAV_3}</button></li>
                <li><button class="nav-link" onclick={() => (location.href = '/O_projekcie')}>{import.meta.env.VITE_NAV_4}</button></li>
            </ul>
        </div>
    </nav>

    <section class="hero">
        <div class="chess-pattern-bg"></div>
        
        <div class="hero-content">
            <div class="king-showcase">
                <img src="/src/lib/assets/whiteKing.svg" alt="White King" class="hero-king" class:king-leaving={isStarting} />
                <div class="king-glow"></div>
            </div>
            
            <div class="hero-text">
                <h1 class="hero-title">{import.meta.env.VITE_APP_NAME}</h1>
                <p class="hero-subtitle">Naucz się podstaw cyberbezpieczeństwa <br> i nie daj się zaskoczyć w sieci</p>
                <button class="cta-button" onclick={startGame} disabled={isStarting}>
                    <span>ROZPOCZNIJ GRĘ</span>
                    <svg class="button-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>

        <div class="floating-pieces">
            <div class="piece piece-1"></div>
            <div class="piece piece-2"></div>
            <div class="piece piece-3"></div>
        </div>
    </section>

    {#if showScenarioPopup}
    <div class="modal-overlay" 
         role="button" 
         tabindex="0"
         onclick={closeScenarioPopup}
         onkeydown={(e) => e.key === 'Escape' && closeScenarioPopup()}>
        <div class="modal-content" 
             role="dialog"
             onclick={(e) => e.stopPropagation()}
             onkeydown={(e) => e.stopPropagation()}>
            <button class="modal-close" 
                    onclick={closeScenarioPopup}
                    aria-label="Zamknij okno">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
            <div class="modal-icon">⚠️</div>
            <h2 class="modal-title">Scenariusze zablokowane</h2>
            <p class="modal-message">Musisz najpierw ukończyć szkolenie początkowe aby przejść do następnych scenariuszy</p>
            <button class="modal-button" onclick={closeScenarioPopup}>Rozumiem</button>
        </div>
    </div>
    {/if}
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

.nav-brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
}

.nav-logo {
    width: 40px;
    height: auto;
}

.nav-title {
    font-size: 1.6rem;
    font-weight: 800;
    font-family: 'Georgia', 'Palatino Linotype', serif;
    color: #3e4770;
    letter-spacing: -0.5px;
    font-style: italic;
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 2.5rem;
}

.nav-link {
    color: var(--color-text);
    background: none;
    border: none;
    font-weight: 500;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    padding: 0;
}

.nav-link::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--color-primary);
    transition: width 0.3s ease;
}

.nav-link:hover {
    color: var(--color-primary);
}

.nav-link:hover::after {
    width: 100%;
}

.hero {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 100px 2rem 2rem;
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

.hero-content {
    display: flex;
    align-items: center;
    gap: 4rem;
    max-width: 1200px;
    z-index: 1;
}

.king-showcase {
    position: relative;
    flex: 1;
}

.hero-king {
    width: 100%;
    max-width: 450px;
    height: auto;
    filter: drop-shadow(0 20px 60px rgba(106, 117, 155, 0.3));
    animation: float 6s ease-in-out infinite;
}

.king-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    height: 300px;
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

@keyframes kingLeave {
    0%   { transform: translateY(0) scale(1) rotate(0deg); }
    20%  { transform: translateY(-30px) scale(1.12) rotate(-8deg); }
    50%  { transform: translateY(-80px) scale(1.2) rotate(10deg); }
    100% { transform: translateY(-300px) scale(0.6) rotate(-15deg); opacity: 0; }
}

.hero-king.king-leaving {
    animation: kingLeave 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
}

.hero-text {
    flex: 1;
    text-align: left;
}

.hero-title {
    font-size: clamp(3rem, 8vw, 5rem);
    font-weight: 800;
    color: var(--color-primary);
    margin-bottom: 1.5rem;
    letter-spacing: -2px;
    line-height: 1.1;
}

.hero-subtitle {
    font-size: clamp(1.1rem, 2vw, 1.4rem);
    color: var(--color-text);
    margin-bottom: 3rem;
    line-height: 1.6;
    max-width: 500px;
}

.cta-button {
    display: inline-flex;
    align-items: center;
    gap: 1rem;
    padding: 1.2rem 3rem;
    font-size: 1.1rem;
    font-weight: 700;
    color: white;
    background: var(--color-primary);
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 10px 30px rgba(106, 117, 155, 0.3);
}

.cta-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(106, 117, 155, 0.4);
}

.cta-button:active {
    transform: translateY(-1px);
}

.button-arrow {
    transition: transform 0.3s ease;
}

.cta-button:hover .button-arrow {
    transform: translateX(5px);
}

.floating-pieces {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.piece {
    position: absolute;
    width: 60px;
    height: 60px;
    background: rgba(106, 117, 155, 0.1);
    border-radius: 8px;
    backdrop-filter: blur(5px);
}

.piece-1 {
    top: 15%;
    left: 10%;
    animation: drift 15s ease-in-out infinite;
}

.piece-2 {
    top: 60%;
    right: 15%;
    animation: drift 20s ease-in-out infinite reverse;
}

.piece-3 {
    bottom: 20%;
    left: 15%;
    animation: drift 18s ease-in-out infinite;
}

@keyframes drift {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    33% { transform: translate(30px, -30px) rotate(10deg); }
    66% { transform: translate(-20px, 20px) rotate(-10deg); }
}

@media (max-width: 968px) {
    .hero-content {
        flex-direction: column;
        text-align: center;
    }
    
    .hero-text {
        text-align: center;
    }
    
    .hero-subtitle {
        margin-left: auto;
        margin-right: auto;
    }
    
    .nav-menu {
        gap: 1.5rem;
        font-size: 0.85rem;
    }
}

@media (max-width: 640px) {
    .glass-nav {
        width: 95%;
        top: 10px;
    }
    
    .nav-container {
        padding: 0.8rem 1rem;
    }
    
    .nav-menu {
        display: none;
    }
    
    .hero-king {
        max-width: 300px;
    }
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.modal-content {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border: 2px solid rgba(106, 117, 155, 0.3);
    border-radius: 30px;
    padding: 3rem 2.5rem;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    position: relative;
    text-align: center;
    animation: slideIn 0.3s ease;
}

@keyframes slideIn {
    from { 
        transform: translateY(-30px);
        opacity: 0;
    }
    to { 
        transform: translateY(0);
        opacity: 1;
    }
}

.modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: transparent;
    border: none;
    color: var(--color-text);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.modal-close:hover {
    background: rgba(106, 117, 155, 0.1);
    transform: rotate(90deg);
}

.modal-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    animation: bounce 0.5s ease;
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.modal-title {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-primary);
    margin-bottom: 1rem;
}

.modal-message {
    font-size: 1.2rem;
    color: var(--color-text);
    line-height: 1.6;
    margin-bottom: 2rem;
}

.modal-button {
    background: var(--color-primary);
    color: white;
    border: none;
    padding: 1rem 3rem;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(106, 117, 155, 0.3);
}

.modal-button:hover {
    background: #5a6589;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(106, 117, 155, 0.4);
}

.modal-button:active {
    transform: translateY(0);
}
</style>
