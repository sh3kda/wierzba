<script>
  const categories = [
    {
      title: "Podstawy Kryptografii",
      items: [
        {
          name: "Wprowadzenie do szyfrowania",
          def: "Szyfrowanie to proces przekształcania czytelnych danych (tekstu jawnego) w nieczytelną formę (szyfrogram) za pomocą algorytmu i klucza. Tylko osoby posiadające odpowiedni klucz mogą odszyfrować wiadomość i odczytać jej treść."
        },
        {
          name: "Klucze publiczne i prywatne",
          def: "Kryptografia asymetryczna używa pary kluczy: klucz publiczny służy do szyfrowania i może być udostępniany wszystkim, natomiast klucz prywatny jest ściśle tajny i służy do odszyfrowania wiadomości."
        },
        {
          name: "Certyfikaty SSL/TLS",
          def: "Certyfikat SSL/TLS to cyfrowy dokument potwierdzający tożsamość serwera i umożliwiający zaszyfrowanie komunikacji między przeglądarką a stroną internetową. Widoczny jest jako ikona kłódki i skrót 'https://'."
        }
      ]
    },
    {
      title: "Bezpieczeństwo Haseł",
      items: [
        {
          name: "Silne hasła",
          def: "Silne hasło powinno mieć co najmniej 12 znaków i zawierać kombinację wielkich i małych liter, cyfr oraz symboli specjalnych. Nie powinno zawierać słów słownikowych ani łatwo odgadywalnych informacji."
        },
        {
          name: "Menedżery haseł",
          def: "Menedżer haseł to aplikacja, która bezpiecznie przechowuje i zarządza hasłami do różnych serwisów. Szyfruje bazę haseł jednym głównym hasłem, dzięki czemu użytkownik musi zapamiętać tylko jedno."
        },
        {
          name: "Uwierzytelnianie dwuskładnikowe",
          def: "Uwierzytelnianie dwuskładnikowe (2FA) wymaga potwierdzenia tożsamości dwoma niezależnymi metodami: czymś co wiesz (hasło) i czymś co posiadasz (kod SMS, aplikacja TOTP) lub czymś czym jesteś (odcisk palca)."
        }
      ]
    },
    {
      title: "Ataki i Zagrożenia",
      items: [
        {
          name: "Phishing",
          def: "Phishing to atak socjotechniczny, w którym cyberprzestępca podszywa się pod zaufaną instytucję i nakłania ofiarę do ujawnienia poufnych danych – haseł, numerów kart – poprzez fałszywe e-maile lub strony WWW."
        },
        {
          name: "Man-in-the-Middle",
          def: "Atak Man-in-the-Middle (MitM) polega na przechwyceniu komunikacji między dwiema stronami bez ich wiedzy. Atakujący może podsłuchiwać lub modyfikować dane, np. w niezabezpieczonych sieciach Wi-Fi."
        },
        {
          name: "Ransomware",
          def: "Ransomware to złośliwe oprogramowanie, które szyfruje pliki ofiary i żąda okupu za klucz deszyfrujący. Rozprzestrzenia się przez zainfekowane załączniki e-mail, złośliwe strony lub luki w oprogramowaniu."
        }
      ]
    }
  ];

  let showScenarioPopup = $state(false);
  let selectedItem = $state(null); // { name, def, categoryTitle }

  function openScenarioPopup() {
    showScenarioPopup = true;
  }

  function closeScenarioPopup() {
    showScenarioPopup = false;
  }

  function openItemModal(item, categoryTitle) {
    selectedItem = { ...item, categoryTitle };
  }

  function closeItemModal() {
    selectedItem = null;
  }
</script>

<main>
    <nav class="glass-nav">
        <div class="nav-container">
            <button class="nav-brand" onclick={() => (location.href = '/')}>
                <span class="nav-title">{import.meta.env.VITE_APP_NAME}</span>
            </button>
            <ul class="nav-menu">
                <li><button class="nav-link nav-link-active" onclick={() => (location.href = '/Biblioteka')}>{import.meta.env.VITE_NAV_2}</button></li>
                <li><button class="nav-link" onclick={openScenarioPopup}>{import.meta.env.VITE_NAV_3}</button></li>
                <li><button class="nav-link" onclick={() => (location.href = '/O_projekcie')}>{import.meta.env.VITE_NAV_4}</button></li>
            </ul>
        </div>
    </nav>

    <section class="library-section">
        <div class="chess-pattern-bg"></div>

        <div class="library-content">
            <div class="library-header">
                <div class="header-icon">📚</div>
                <h1 class="library-title">Biblioteka Wiedzy</h1>
                <p class="library-subtitle">Materiały edukacyjne o cyberbezpieczeństwie i kryptografii</p>
            </div>

            <div class="categories-grid">
                {#each categories as category}
                <div class="category-card">
                    <h3 class="category-title">{category.title}</h3>
                    <ul class="category-items">
                        {#each category.items as item}
                        <li class="category-item">
                            <button class="item-button" onclick={() => openItemModal(item, category.title)}>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M6 8L8 10L10 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                {item.name}
                            </button>
                        </li>
                        {/each}
                    </ul>
                </div>
                {/each}
            </div>

            <div class="coming-soon">
                <p>🚧 Więcej materiałów wkrótce! 🚧</p>
            </div>
        </div>
    </section>

    <!-- Modal: scenariusze zablokowane -->
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
            <button class="modal-close" onclick={closeScenarioPopup} aria-label="Zamknij okno">
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

    <!-- Modal: definicja itemu -->
    {#if selectedItem}
    <div class="modal-overlay"
         role="button"
         tabindex="0"
         onclick={closeItemModal}
         onkeydown={(e) => e.key === 'Escape' && closeItemModal()}>
        <div class="modal-content"
             role="dialog"
             onclick={(e) => e.stopPropagation()}
             onkeydown={(e) => e.stopPropagation()}>
            <button class="modal-close" onclick={closeItemModal} aria-label="Zamknij okno">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
            <div class="modal-category-tag">{selectedItem.categoryTitle}</div>
            <h2 class="modal-title">{selectedItem.name}</h2>
            <p class="modal-message">{selectedItem.def}</p>
            <button class="modal-button" onclick={closeItemModal}>Zamknij</button>
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

/* NAV */
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
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
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
    align-items: center;
    gap: 0.5rem;
    list-style: none;
}

.nav-link {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--color-text);
    padding: 0.55rem 1.1rem;
    border-radius: 50px;
    transition: all 0.25s ease;
    opacity: 0.75;
}

.nav-link:hover { background: rgba(106,117,155,0.12); opacity: 1; }
.nav-link-active { background: var(--color-primary); color: white; opacity: 1; }
.nav-link-active:hover { background: #5a6487; color: white; }

/* LIBRARY SECTION */
.library-section {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 120px 2rem 4rem;
    position: relative;
}

.chess-pattern-bg {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    opacity: 0.03;
    background-image:
        linear-gradient(45deg, #6A759B 25%, transparent 25%),
        linear-gradient(-45deg, #6A759B 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #6A759B 75%),
        linear-gradient(-45deg, transparent 75%, #6A759B 75%);
    background-size: 100px 100px;
    background-position: 0 0, 0 50px, 50px -50px, -50px 0;
}

.library-content {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 1100px;
    text-align: center;
}

.library-header {
    margin-bottom: 3rem;
}

.header-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.library-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--color-text);
    margin-bottom: 0.75rem;
}

.library-subtitle {
    font-size: 1.1rem;
    color: #6b6f76;
}

/* CATEGORIES GRID */
.categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.category-card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 20px;
    padding: 2rem 1.5rem;
    box-shadow: 0 8px 32px rgba(106, 117, 155, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.category-title {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--color-primary);
    margin-bottom: 1.25rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid rgba(106, 117, 155, 0.15);
    width: 100%;
    text-align: center;
}

.category-items {
    list-style: none;
    width: 100%;
    margin-bottom: 1.5rem;
    flex: 1;
}

.category-item {
    margin-bottom: 0.6rem;
}

/* Klikalny item */
.item-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    background: rgba(106, 117, 155, 0.07);
    border: 1px solid rgba(106, 117, 155, 0.15);
    border-radius: 10px;
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
    color: var(--color-text);
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
}

.item-button:hover {
    background: rgba(106, 117, 155, 0.18);
    border-color: rgba(106, 117, 155, 0.4);
    color: var(--color-primary);
    transform: translateY(-1px);
}

.item-button:active {
    transform: translateY(0);
}

.item-button svg {
    flex-shrink: 0;
    color: var(--color-primary);
}

.explore-button {
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: 50px;
    padding: 0.65rem 1.5rem;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    margin-top: auto;
}

.explore-button:hover {
    background: #5a6487;
}

.coming-soon {
    color: #888;
    font-size: 1rem;
    margin-top: 1rem;
}

/* MODAL */
.modal-overlay {
    position: fixed; inset: 0; z-index: 2000;
    background: rgba(0,0,0,0.45);
    backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    padding: 1rem;
    animation: fadeInModal 0.2s ease;
}

.modal-content {
    position: relative;
    background: white;
    border-radius: 24px;
    padding: 2.5rem 2rem 2rem;
    max-width: 440px;
    width: 100%;
    box-shadow: 0 24px 64px rgba(0,0,0,0.2);
    text-align: center;
    animation: slideUpModal 0.25s ease;
}

.modal-close {
    position: absolute; top: 1rem; right: 1rem;
    background: transparent; border: none; cursor: pointer;
    color: var(--color-text); opacity: 0.5;
    transition: opacity 0.2s;
}
.modal-close:hover { opacity: 1; }

.modal-category-tag {
    display: inline-block;
    background: rgba(106, 117, 155, 0.12);
    color: var(--color-primary);
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 0.3rem 0.9rem;
    border-radius: 50px;
    margin-bottom: 1rem;
}

.modal-icon { font-size: 3rem; margin-bottom: 1rem; }

.modal-title {
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--color-primary);
    margin-bottom: 0.75rem;
}

.modal-message {
    font-size: 0.97rem;
    color: var(--color-text);
    line-height: 1.7;
    opacity: 0.85;
    margin-bottom: 1.75rem;
    text-align: left;
}

.modal-button {
    background: var(--color-primary); color: white;
    border: none; border-radius: 50px;
    padding: 0.75rem 2rem; font-size: 1rem; font-weight: 600;
    cursor: pointer; transition: background 0.2s;
}
.modal-button:hover { background: #5a6487; }

@keyframes fadeInModal {
    from { opacity: 0; } to { opacity: 1; }
}
@keyframes slideUpModal {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
}

/* RESPONSIVE */
@media (max-width: 768px) {
    .categories-grid {
        grid-template-columns: 1fr;
    }
    .library-title {
        font-size: 1.8rem;
    }
    .nav-container {
        padding: 0.8rem 1rem;
    }
}

@media (max-width: 640px) {
    .glass-nav { width: 95%; top: 10px; }
    .library-section { padding: 100px 1rem 3rem; }
}
</style>