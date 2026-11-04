<script>
  let showScenarioPopup = $state(false);

  function openScenarioPopup() {
    showScenarioPopup = true;
  }

  function closeScenarioPopup() {
    showScenarioPopup = false;
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
        <li><button class="nav-link nav-link-active" onclick={() => (location.href = '/O_projekcie')}>{import.meta.env.VITE_NAV_4}</button></li>
      </ul>
    </div>
  </nav>

  <section class="about-section">
    <div class="chess-pattern-bg"></div>

    <div class="about-content">

      <div class="about-header">
        <h1 class="about-title">O Projekcie</h1>
        <p class="about-subtitle">Interaktywna gra edukacyjna o cyberbezpieczeństwie</p>
      </div>

      <div class="info-cards">
        <div class="info-card">
          <div class="card-accent"></div>
          <h3 class="card-title">Misja</h3>
          <p class="card-text">
            <strong>en Passant</strong> to projekt konkursowy stworzony na Kościuszkon 2026.
            Naszym celem jest edukacja w zakresie cyberbezpieczeństwa w formie angażującej narracji —
            bez suchej teorii, za to z interaktywnymi dialogami i wyborami, które mają znaczenie.
          </p>
        </div>

        <div class="info-card">
          <div class="card-accent"></div>
          <h3 class="card-title">Czego się nauczysz?</h3>
          <p class="card-text">
            Tworzenie silnych haseł, rozpoznawanie phishingu, ochrona przed malware,
            bezpieczne korzystanie z sieci Wi-Fi, uwierzytelnianie dwuskładnikowe, ochrona prywatności,
            inżynieria społeczna i kopie zapasowe — osiem tematów, które każdy powinien znać. Tutaj jakieś bzdety, dopracować.
          </p>
        </div>

        <div class="info-card">
          <div class="card-accent"></div>
          <h3 class="card-title">Kierunek rozwoju</h3>
          <p class="card-text">
            Planujemy rozwijać projekt o dodatkowe scenariusze, bardziej rozbudowane mechaniki gry,
            a także wersję mobilną. Chcemy, by <strong>en Passant</strong> nie było kolejną platformą e-learningową, ale prawdziwą grą, która uczy przez zabawę, mini-fabułę i angażuje na dłużej.
          </p>
        </div>

        <div class="info-card">
          <div class="card-accent"></div>
          <h3 class="card-title">Dla kogo?</h3>
          <p class="card-text">
            Aplikacja jest skierowana do wszystkich, którzy korzystają z internetu na co dzień,
            a chcą lepiej rozumieć zagrożenia cyfrowe. Żadnej wiedzy wstępnej nie wymagamy —
            wystarczy ciekawość i chęć do nauki.
          </p>
        </div>
      </div>

      <div class="team-section">
        <h2 class="section-title">Zespół</h2>
        <p class="section-subtitle">Poznaj ludzi stojących za projektem</p>
        <div class="team-grid">
          <div class="team-card">
            <div class="avatar">PG</div>
            <h4 class="member-name">Piotr Gąska</h4>
            <p class="member-role">Kapitan zespołu</p>
            <p class="member-desc">Odpowiada za architekturę aplikacji, logikę gry i integrację backendu. Nie wiem co dodać.</p>
          </div>
          <div class="team-card">
            <div class="avatar" style="background: #7c6a9b;">AD</div>
            <h4 class="member-name">Antoni Dawid</h4>
            <p class="member-role">Logika i mechanika gry + redakcja</p>
            <p class="member-desc">Nasz mózg operacji pozakodowej. Odpowiada za logikę gry, mechaniki interakcji oraz redakcję treści.</p>
          </div>
          <div class="team-card">
            <div class="avatar" style="background: #4a7c6a;">FD</div>
            <h4 class="member-name">Franciszek Dawid</h4>
            <p class="member-role">Frontend & UI</p>
            <p class="member-desc">Tworzy interfejs użytkownika i dba o spójność wizualną projektu. Aranżuje użytkownikom niepowtarzalne doświadczenie użytkownika.</p>
          </div>
        </div>
      </div>

      <div class="tech-stack">
        <h2 class="section-title">Technologie</h2>
        <p class="section-subtitle">Narzędzia, którymi zbudowaliśmy projekt</p>
        <div class="tech-icons">
         <div class="tech-item">
            <div class="tech-icon-wrap">
              <img src="/src/lib/assets/HTML5.svg" alt="HTML5" width="48" height="48" />
            </div>
            <span class="tech-name">HTML5</span>
          </div>

          <div class="tech-item">
            <div class="tech-icon-wrap">
              <img src="/src/lib/assets/CSS3.svg" alt="CSS3" width="48" height="48" />
            </div>
            <span class="tech-name">CSS3</span>
          </div>

          <div class="tech-item">
            <div class="tech-icon-wrap">
              <img src="/src/lib/assets/JavaScript.svg" alt="JavaScript" width="48" height="48" />
            </div>
            <span class="tech-name">JavaScript</span>
          </div>

          <div class="tech-item">
            <div class="tech-icon-wrap">
              <img src="/src/lib/assets/Svelte.svg" alt="SvelteKit" width="48" height="48" />
            </div>
            <span class="tech-name">SvelteKit</span>
          </div>

          <div class="tech-item">
            <div class="tech-icon-wrap">
              <img src="/src/lib/assets/Vite.js.svg" alt="Vite" width="48" height="48" />
            </div>
            <span class="tech-name">Vite</span>
          </div>

          <div class="tech-item">
            <div class="tech-icon-wrap">
              <img src="/src/lib/assets/Java.svg" alt="Java" width="48" height="48" />
            </div>
            <span class="tech-name">Java</span>
          </div>

        </div>
      </div>

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
  --color-primary: #6A759B;
  --color-text: #373A40;
  --font-family: 'Inter', sans-serif;
}
* { margin: 0; padding: 0; box-sizing: border-box; font-family: var(--font-family); }

main {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 50%, #f0f0f0 100%);
  position: relative;
  overflow-x: hidden;
}

.glass-nav {
  position: fixed;
  top: 20px; left: 50%;
  transform: translateX(-50%);
  width: 90%; max-width: 1200px;
  z-index: 1000;
  backdrop-filter: blur(10px);
  background: rgba(255,255,255,0.7);
  border: 1px solid rgba(255,255,255,0.5);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}
.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}
.nav-brand {
  display: flex; align-items: center; gap: 0.8rem;
  background: transparent; border: none; cursor: pointer;
}
.nav-logo { width: 36px; height: auto; }
.nav-title {
  font-size: 1.6rem;
  font-weight: 800;
  font-family: 'Georgia', 'Palatino Linotype', serif;
  color: #3e4770;
  letter-spacing: -0.5px;
  font-style: italic;
}
.nav-menu {
  display: flex; align-items: center; gap: 0.5rem;
  list-style: none;
}
.nav-link {
  background: transparent; border: none; cursor: pointer;
  font-size: 0.95rem; font-weight: 600; color: var(--color-text);
  padding: 0.55rem 1.1rem; border-radius: 50px;
  transition: all 0.25s ease; opacity: 0.75;
}
.nav-link:hover { background: rgba(106,117,155,0.12); opacity: 1; }
.nav-link-active { background: var(--color-primary); color: white; opacity: 1; }
.nav-link-active:hover { background: #5a6487; color: white; }

.about-section {
  min-height: 100vh;
  padding: 130px 2rem 5rem;
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
.about-content {
  max-width: 1200px; margin: 0 auto;
  position: relative; z-index: 1;
  display: flex; flex-direction: column; gap: 5rem;
}

.about-header { text-align: center; animation: fadeInDown 0.6s ease; }
.header-icon { font-size: 4.5rem; margin-bottom: 1rem; }
.header-rook { width: 80px; height: 80px; object-fit: contain; }
.about-title {
  font-size: 3rem; font-weight: 700;
  color: var(--color-primary); letter-spacing: -1px; margin-bottom: 0.75rem;
}
.about-subtitle { font-size: 1.25rem; color: var(--color-text); opacity: 0.75; }

.info-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.75rem;
}
.info-card {
  background: rgba(255,255,255,0.85); backdrop-filter: blur(10px);
  border: 2px solid rgba(106,117,155,0.15); border-radius: 24px;
  padding: 2.25rem; box-shadow: 0 8px 32px rgba(106,117,155,0.1);
  transition: all 0.3s ease; animation: fadeInUp 0.6s ease backwards;
}
.info-card:nth-child(1) { animation-delay: 0.1s; }
.info-card:nth-child(2) { animation-delay: 0.2s; }
.info-card:nth-child(3) { animation-delay: 0.3s; }
.info-card:nth-child(4) { animation-delay: 0.4s; }
.info-card:hover { transform: translateY(-5px); box-shadow: 0 16px 48px rgba(106,117,155,0.2); border-color: rgba(106,117,155,0.35); }
.card-accent { width: 32px; height: 3px; background: var(--color-primary); border-radius: 2px; opacity: 0.55; margin-bottom: 1.1rem; }
.card-title { font-size: 1.4rem; font-weight: 700; color: var(--color-primary); margin-bottom: 0.75rem; }
.card-text { font-size: 1rem; color: var(--color-text); line-height: 1.75; }

.team-section { text-align: center; }
.section-title {
  font-size: 2.2rem; font-weight: 700;
  color: var(--color-primary); margin-bottom: 0.5rem; letter-spacing: -0.5px;
}
.section-subtitle { font-size: 1.1rem; color: var(--color-text); opacity: 0.7; margin-bottom: 2.5rem; }
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}
.team-card {
  background: rgba(255,255,255,0.85); backdrop-filter: blur(10px);
  border: 2px solid rgba(106,117,155,0.15); border-radius: 24px;
  padding: 2rem 1.5rem; box-shadow: 0 8px 32px rgba(106,117,155,0.1);
  transition: all 0.3s ease; animation: fadeInUp 0.6s ease backwards;
  display: flex; flex-direction: column; align-items: center; gap: 0.6rem;
}
.team-card:nth-child(1) { animation-delay: 0.1s; }
.team-card:nth-child(2) { animation-delay: 0.2s; }
.team-card:nth-child(3) { animation-delay: 0.3s; }
.team-card:hover { transform: translateY(-5px); box-shadow: 0 16px 48px rgba(106,117,155,0.2); }
.avatar {
  width: 64px; height: 64px; border-radius: 50%;
  background: var(--color-primary); color: white;
  font-size: 1.2rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 0.4rem;
}
.member-name { font-size: 1.1rem; font-weight: 700; color: var(--color-text); }
.member-role {
  font-size: 0.85rem; font-weight: 600; color: var(--color-primary);
  background: rgba(106,117,155,0.1); padding: 0.25rem 0.75rem; border-radius: 50px;
}
.member-desc { font-size: 0.92rem; color: var(--color-text); opacity: 0.75; line-height: 1.6; text-align: center; }

.tech-stack { text-align: center; }
.tech-icons {
  display: flex; justify-content: center;
  gap: 2.5rem; flex-wrap: wrap;
}
.tech-item {
  display: flex; flex-direction: column; align-items: center; gap: 0.7rem;
  transition: transform 0.25s ease; cursor: default;
}
.tech-item:hover { transform: translateY(-6px); }
.tech-icon-wrap {
  width: 80px; height: 80px; border-radius: 20px;
  background: white;
  border: 2px solid rgba(106,117,155,0.1);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  transition: box-shadow 0.25s ease;
  padding: 10px;
}
.tech-item:hover .tech-icon-wrap { box-shadow: 0 12px 30px rgba(0,0,0,0.28); }
.tech-name { font-size: 0.9rem; font-weight: 600; color: var(--color-text); opacity: 0.8; }

.modal-overlay {
  position: fixed; inset: 0; z-index: 2000;
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  padding: 1rem;
  animation: fadeIn 0.2s ease;
}
.modal-content {
  position: relative;
  background: white; border-radius: 24px;
  padding: 2.5rem 2rem 2rem;
  max-width: 420px; width: 100%;
  box-shadow: 0 24px 64px rgba(0,0,0,0.2);
  text-align: center;
  animation: slideUp 0.25s ease;
}
.modal-close {
  position: absolute; top: 1rem; right: 1rem;
  background: transparent; border: none; cursor: pointer;
  color: var(--color-text); opacity: 0.5;
  transition: opacity 0.2s;
}
.modal-close:hover { opacity: 1; }
.modal-icon { font-size: 3rem; margin-bottom: 1rem; }
.modal-title {
  font-size: 1.5rem; font-weight: 700;
  color: var(--color-primary); margin-bottom: 0.75rem;
}
.modal-message {
  font-size: 1rem; color: var(--color-text);
  line-height: 1.65; opacity: 0.8; margin-bottom: 1.75rem;
}
.modal-button {
  background: var(--color-primary); color: white;
  border: none; border-radius: 50px;
  padding: 0.75rem 2rem; font-size: 1rem; font-weight: 600;
  cursor: pointer; transition: background 0.2s;
}
.modal-button:hover { background: #5a6487; }
@keyframes fadeIn {
  from { opacity: 0; } to { opacity: 1; }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-30px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (max-width: 900px) {
  .about-title { font-size: 2.4rem; }
  .team-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .glass-nav { width: 95%; top: 10px; }
  .nav-container { padding: 0.8rem 1rem; }
  .nav-menu { gap: 0; }
  .nav-link { font-size: 0.8rem; padding: 0.45rem 0.7rem; }
  .about-section { padding: 100px 1rem 3rem; }
  .about-title { font-size: 1.9rem; }
  .info-card { padding: 1.6rem; }
  .team-grid { grid-template-columns: 1fr; }
  .tech-icons { gap: 1.5rem; }
}
</style>
