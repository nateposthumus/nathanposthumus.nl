// --- DOM Elements ---
const appTitle = document.getElementById('app-title');
const gameTitle = document.getElementById('game-title');
const startScreen = document.getElementById('start-screen');
const setupScreen = document.getElementById('setup-screen');
const gameplayScreen = document.getElementById('gameplay-screen');
const jailScreen = document.getElementById('jail-screen');
const rulesPopup = document.getElementById('rules-popup');

const startLetterDisplay = document.getElementById('start-letter'); // Back on start screen for visual flair
const rulesBtn = document.getElementById('rules-btn');
const startGameBtn = document.getElementById('start-game-btn');
const closeRulesBtn = document.getElementById('close-rules-btn');
const playerCountBtns = document.querySelectorAll('.player-count-btn');

const currentPlayerDisplay = document.getElementById('current-player-display');
const gameCategoryDisplay = document.getElementById('game-category');
// const gameLetterDisplay = document.getElementById('game-letter'); // Removed, no longer needed on gameplay screen
const timerDisplay = document.getElementById('timer-display');
const timerBar = document.getElementById('timer-bar'); // New: for visual timer bar
const nextQuestionBtn = document.getElementById('next-question-btn'); // NEW: Next Question button
const gameMessageDisplay = document.getElementById('game-message');

const jailMessageDisplay = document.getElementById('jail-message');
const nextPlayerFromJailBtn = document.getElementById('next-player-from-jail-btn');

const scoreBar = document.getElementById('score-bar');
const currentScoreDisplay = document.getElementById('current-score');
const highScoreDisplay = document.getElementById('high-score');
const highScoreText = document.getElementById('high-score-text');

const langBtns = document.querySelectorAll('.lang-btn');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeToggleIcon = document.getElementById('theme-toggle-icon');

// --- Game State Variables ---
let players = [];
let currentPlayerIndex = 0;
let randomStartLetter = '';
let currentCategory = '';
let timer;
let timeLeft = 20; // Changed to 20 seconds
const gameDuration = 20; // Changed to 20 seconds
let score = 0;
let highScore = localStorage.getItem('woordspelHighScore') || 0;

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const categories = {
    nl: ["Dier", "Stad", "Land", "Kleur", "Eten", "Beroep", "Sport", "Merknaam", "Voertuig", "Bekende Persoon", "Film/Serie", "Muziekgenre", "Superheld", "Computerterm", "Dessert"],
    en: ["Animal", "City", "Country", "Color", "Food", "Profession", "Sport", "Brand Name", "Vehicle", "Famous Person", "Movie/Series", "Music Genre", "Superhero", "Computer Term", "Dessert"],
    fr: ["Animal", "Ville", "Pays", "Couleur", "Nourriture", "Profession", "Sport", "Nom de Marque", "Véhicule", "Personne Célèbre", "Film/Série", "Genre Musical", "Super-héros", "Terme Informatique", "Dessert"],
    de: ["Tier", "Stadt", "Land", "Farbe", "Essen", "Beruf", "Sport", "Markenname", "Fahrzeug", "Berühmte Person", "Film/Serie", "Musikgenre", "Superheld", "Computerbegriff", "Dessert"]
};
const translations = {
    nl: {
        'appTitle': 'Het Woordspel',
        'gameTitle': 'Het Woordspel',
        'rulesBtn': 'Spelregels',
        'startGameBtn': 'Start Spel',
        'promoText': 'Test je woordenschat en daag je vrienden uit!',
        'popupTitle': 'Spelregels',
        'popupWelcome': 'Welkom bij Het Woordspel! Zo werkt het:',
        'rule1': 'Begin het spel en kies het aantal spelers (1-4).',
        'rule2': 'Er verschijnt een <span class="font-semibold text-blue-700 dark:text-yellow-300">willekeurige startletter</span> en een <span class="font-semibold text-blue-700 dark:text-yellow-300">categorie</span>.',
        'rule3': 'De huidige speler moet binnen <span class="font-semibold text-yellow-600 dark:text-yellow-300">20 seconden</span> een woord bedenken dat bij de categorie past <span class="font-bold text-blue-700 dark:text-yellow-300">ÉN</span> begint met de gegeven startletter.',
        'rule4': 'Als je een woord hebt gevonden, druk dan op "Volgende Vraag" om punten te verdienen en door te gaan naar de volgende ronde.',
        'rule5': 'Als je geen woord bedenkt, of de tijd is om, dan <span class="font-semibold text-red-600 dark:text-red-400">ga je naar de gevangenis</span>. De beurt gaat dan naar de volgende speler.',
        'rule6': 'Het spel gaat door totdat alle spelers in de gevangenis zitten. Dan is het spel voorbij!',
        'closeRulesBtn': 'Sluiten',
        'playerSetupTitle': 'Aantal Spelers',
        'playerCountBtn1': '1',
        'playerCountBtn2': '2',
        'playerCountBtn3': '3',
        'playerCountBtn4': '4',
        'playerTurn': (name) => `${name}'s Beurt!`,
        'category': (cat) => `Categorie: ${cat}`,
        'nextQuestionBtn': 'Volgende Vraag', // NEW Translation
        'correctWordMsg': (name) => `Goed gedaan, ${name}!`, // Re-added translation
        'jailMessage': (name) => `${name} gaat naar de gevangenis!`,
        'allJailedMsg': 'Alle spelers zitten in de gevangenis! Spel voorbij. Herlaad de pagina om opnieuw te spelen.',
        'nextPlayerBtn': 'Volgende Speler',
        'scoreText': 'Score:',
        'highScoreText': 'Hoogste score:',
        'darkModeIcon': '🌙',
        'lightModeIcon': '☀️'
    },
    en: {
        'appTitle': 'The Word Game',
        'gameTitle': 'The Word Game',
        'rulesBtn': 'Rules',
        'startGameBtn': 'Start Game',
        'promoText': 'Test your vocabulary and challenge your friends!',
        'popupTitle': 'Game Rules',
        'popupWelcome': 'Welcome to The Word Game! Here\'s how to play:',
        'rule1': 'Start the game and choose the number of players (1-4).',
        'rule2': 'A random starting letter and a category will appear.',
        'rule3': 'The current player must think of a word that matches the category AND starts with the given letter within <span class="font-semibold text-yellow-600 dark:text-yellow-300">20 seconds</span>.',
        'rule4': 'If you found a word, press "Next Question" to earn points and proceed to the next round.',
        'rule5': 'If you can\'t think of a word, or time runs out, you "go to jail". The turn then passes to the next player.',
        'rule6': 'The game continues until all players are in jail. Then the game is over!',
        'closeRulesBtn': 'Close',
        'playerSetupTitle': 'Number of Players',
        'playerCountBtn1': '1',
        'playerCountBtn2': '2',
        'playerCountBtn3': '3',
        'playerCountBtn4': '4',
        'playerTurn': (name) => `${name}'s Turn!`,
        'category': (cat) => `Category: ${cat}`,
        'nextQuestionBtn': 'Next Question', // NEW Translation
        'correctWordMsg': (name) => `Well done, ${name}!`, // Re-added translation
        'jailMessage': (name) => `${name} goes to jail!`,
        'allJailedMsg': 'All players are in jail! Game over. Reload the page to play again.',
        'nextPlayerBtn': 'Next Player',
        'scoreText': 'Score:',
        'highScoreText': 'High Score:',
        'darkModeIcon': '🌙',
        'lightModeIcon': '☀️'
    },
    fr: {
        'appTitle': 'Le Jeu de Mots',
        'gameTitle': 'Le Jeu de Mots',
        'rulesBtn': 'Règles',
        'startGameBtn': 'Commencer',
        'promoText': 'Testez votre vocabulaire et défiez vos amis!',
        'popupTitle': 'Règles du Jeu',
        'popupWelcome': 'Bienvenue au Jeu de Mots! Voici comment jouer:',
        'rule1': 'Commencez le jeu et choisissez le nombre de joueurs (1-4).',
        'rule2': 'Une lettre de départ aléatoire et une catégorie apparaîtront.',
        'rule3': 'Le joueur actuel doit penser à un mot qui correspond à la catégorie ET commence par la lettre donnée en <span class="font-semibold text-yellow-600 dark:text-yellow-300">20 secondes</span>.',
        'rule4': 'Si vous avez trouvé un word, appuyez sur "Question Suivante" pour gagner des points et passer au tour suivant.',
        'rule5': 'Si vous ne trouvez pas de mot, ou si le temps est écoulé, vous "allez en prison". Le tour passe ensuite au joueur suivant.',
        'rule6': 'Le jeu continue jusqu\'à ce que tous les joueurs soient en prison. Le jeu est alors terminé !',
        'closeRulesBtn': 'Fermer',
        'playerSetupTitle': 'Nombre de Joueurs',
        'playerCountBtn1': '1',
        'playerCountBtn2': '2',
        'playerCountBtn3': '3',
        'playerCountBtn4': '4',
        'playerTurn': (name) => `Tour de ${name}!`,
        'category': (cat) => `Catégorie: ${cat}`,
        'nextQuestionBtn': 'Question Suivante', // NEW Translation
        'correctWordMsg': (name) => `Bien joué, ${name}!`, // Re-added translation
        'jailMessage': (name) => `${name} va en prison!`,
        'allJailedMsg': 'Tous les joueurs sont en prison! Fin de partie. Rechargez la page pour rejouer.',
        'nextPlayerBtn': 'Joueur Suivant',
        'scoreText': 'Score:',
        'highScoreText': 'Meilleur Score:',
        'darkModeIcon': '🌙',
        'lightModeIcon': '☀️'
    },
    de: {
        'appTitle': 'Das Wortspiel',
        'gameTitle': 'Das Wortspiel',
        'rulesBtn': 'Regeln',
        'startGameBtn': 'Spiel Starten',
        'promoText': 'Testen Sie Ihren Wortschatz und fordern Sie Ihre Freunde heraus!',
        'popupTitle': 'Spielregeln',
        'popupWelcome': 'Willkommen beim Wortspiel! So wird gespielt:',
        'rule1': 'Starten Sie das Spiel und wählen Sie die Anzahl der Spieler (1-4).',
        'rule2': 'Ein zufälliger Startbuchstabe und eine Kategorie werden angezeigt.',
        'rule3': 'Der aktuelle Spieler muss innerhalb von <span class="font-semibold text-yellow-600 dark:text-yellow-300">20 Sekunden</span> ein Wort finden, das zur Kategorie passt <span class="font-bold text-blue-700 dark:text-yellow-300">UND</span> mit dem angegebenen Startbuchstaben beginnt.',
        'rule4': 'Wenn Sie ein Wort gefunden haben, drücken Sie "Nächste Frage", um Punkte zu verdienen und zur nächsten Runde zu gelangen.',
        'rule5': 'Wenn Sie kein Wort finden oder die Zeit abgelaufen ist, gehen Sie <span class="font-semibold text-red-600 dark:text-red-400">ins Gefängnis</span>. Die Reihe geht dann an den nächsten Spieler.',
        'rule6': 'Das Spiel geht weiter, bis alle Spieler im Gefängnis sind. Dann ist das Spiel vorbei!',
        'closeRulesBtn': 'Schließen',
        'playerSetupTitle': 'Anzahl der Spieler',
        'playerCountBtn1': '1',
        'playerCountBtn2': '2',
        'playerCountBtn3': '3',
        'playerCountBtn4': '4',
        'playerTurn': (name) => `${name}'s Reihe!`,
        'category': (cat) => `Kategorie: ${cat}`,
        'nextQuestionBtn': 'Nächste Frage', // NEW Translation
        'correctWordMsg': (name) => `Gut gemacht, ${name}!`, // Re-added translation
        'jailMessage': (name) => `${name} geht ins Gefängnis!`,
        'allJailedMsg': 'Alle Spieler sind im Gefängnis! Spiel vorbei. Lade die Seite neu, um erneut zu spielen.',
        'nextPlayerBtn': 'Nächster Spieler',
        'scoreText': 'Punktzahl:',
        'highScoreText': 'Highscore:',
        'darkModeIcon': '🌙',
        'lightModeIcon': '☀️'
    }
};
let currentLang = localStorage.getItem('woordspelLang') || 'nl';

// --- Utility Functions ---
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function showScreen(screenToShow) {
    const screens = [startScreen, setupScreen, gameplayScreen, jailScreen, rulesPopup];
    screens.forEach(screen => screen.classList.add('hidden')); // Use Tailwind's hidden
    screenToShow.classList.remove('hidden'); // Show the desired screen
    screenToShow.classList.add('active'); // Add active for custom transitions if any
    // For popups, explicitly make it flex
    if (screenToShow === rulesPopup) {
        screenToShow.style.display = 'flex';
    }
}

function updateTranslation() {
    const langData = translations[currentLang];

    appTitle.textContent = langData.appTitle;
    gameTitle.textContent = langData.gameTitle;
    rulesBtn.textContent = langData.rulesBtn;
    startGameBtn.textContent = langData.startGameBtn;
    document.querySelector('.promo-text').textContent = langData.promoText;

    // Rules Popup - Dynamically update rules based on available keys
    rulesPopup.querySelector('h2').textContent = langData.popupTitle;
    rulesPopup.querySelector('p:first-of-type').innerHTML = langData.popupWelcome;

    const olElement = rulesPopup.querySelector('ol');
    olElement.innerHTML = ''; // Clear existing rule content

    const ruleKeys = ['rule1', 'rule2', 'rule3', 'rule4', 'rule5', 'rule6']; // Define the order of rules
    ruleKeys.forEach(ruleKey => {
        if (langData[ruleKey]) {
            const li = document.createElement('li');
            li.innerHTML = langData[ruleKey];
            olElement.appendChild(li);
        }
    });

    closeRulesBtn.textContent = langData.closeRulesBtn;

    // Setup Screen
    if (setupScreen) {
        setupScreen.querySelector('h2').textContent = langData.playerSetupTitle;
        playerCountBtns[0].textContent = langData.playerCountBtn1;
        playerCountBtns[1].textContent = langData.playerCountBtn2;
        playerCountBtns[2].textContent = langData.playerCountBtn3;
        playerCountBtns[3].textContent = langData.playerCountBtn4;
    }

    // Gameplay Screen elements (text content updates)
    nextQuestionBtn.textContent = langData.nextQuestionBtn; // New
    scoreBar.querySelector('span:first-of-type').textContent = langData.scoreText;
    highScoreText.textContent = `${langData.highScoreText} ${highScore}`;
    jailMessageDisplay.textContent = translations[currentLang].jailMessage(players[currentPlayerIndex] ? players[currentPlayerIndex].name : '');
    nextPlayerFromJailBtn.textContent = langData.nextPlayerBtn;
}

function updateThemeToggleIcon() {
    if (document.documentElement.classList.contains('dark')) {
        themeToggleIcon.textContent = translations[currentLang].lightModeIcon; // Sun icon for light mode
    } else {
        themeToggleIcon.textContent = translations[currentLang].darkModeIcon; // Moon icon for dark mode
    }
}

function resetGame() {
    players = [];
    currentPlayerIndex = 0;
    randomStartLetter = ''; // Still reset here
    currentCategory = '';
    clearInterval(timer);
    timeLeft = gameDuration;
    gameMessageDisplay.textContent = '';
    score = 0;
    currentScoreDisplay.textContent = score;
    players.forEach(p => p.inJail = false); // Reset jail status for all players

    scoreBar.classList.add('hidden');
    highScoreDisplay.classList.add('hidden');
    nextQuestionBtn.classList.add('hidden'); // Hide on start screen
}

// --- Game Logic ---

function startGameFlow() {
    resetGame();
    randomStartLetter = getRandomElement(alphabet); // Generate initial letter for start screen
    startLetterDisplay.textContent = randomStartLetter; // Show random letter on start screen
    showScreen(startScreen);
}

function setupPlayersAndStartTurn(numPlayers) {
    players = Array.from({ length: numPlayers }, (_, i) => ({
        name: `${translations[currentLang].playerCountBtn1.replace(/\d+/g, '').trim() || 'Speler'} ${i + 1}`, // Keep descriptive player names
        inJail: false
    }));
    currentPlayerIndex = 0;
    score = 0;
    currentScoreDisplay.textContent = score;
    highScoreText.textContent = `${translations[currentLang].highScoreText} ${highScore}`; // Update high score display

    scoreBar.classList.remove('hidden');
    highScoreDisplay.classList.remove('hidden');
    nextQuestionBtn.classList.remove('hidden'); // Show Next Question button
    showScreen(gameplayScreen);
    startTurn();
}

function startTurn() {
    clearInterval(timer); // Clear any existing timer
    timeLeft = gameDuration;
    gameMessageDisplay.textContent = '';

    // Reset timer bar colors to yellow gradient
    timerDisplay.classList.remove('text-error-red');
    timerBar.classList.remove('bg-error-red');
    timerBar.classList.add('from-yellow-400', 'via-yellow-500', 'to-yellow-600', 'dark:from-yellow-700', 'dark:via-yellow-800', 'dark:to-yellow-900');
    timerBar.style.width = '100%'; // Reset timer bar width

    let attempts = 0;
    const initialPlayerIndex = currentPlayerIndex;
    let foundActivePlayer = false;

    while (attempts < players.length * 2) { // Loop up to twice the number of players to find an active one
        if (!players[currentPlayerIndex].inJail) {
            foundActivePlayer = true;
            break;
        }
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        attempts++;
        if (currentPlayerIndex === initialPlayerIndex && players[currentPlayerIndex].inJail && attempts >= players.length) {
            // All players are in jail or loop completed without finding an active player
            break;
        }
    }

    if (!foundActivePlayer || players.every(p => p.inJail)) {
        gameMessageDisplay.textContent = translations[currentLang].allJailedMsg;
        scoreBar.classList.add('hidden');
        highScoreDisplay.classList.add('hidden');
        nextQuestionBtn.classList.add('hidden'); // Hide button
        setTimeout(() => showScreen(startScreen), 5000);
        return;
    }

    currentCategory = getRandomElement(categories[currentLang]);
    currentPlayerDisplay.textContent = translations[currentLang].playerTurn(players[currentPlayerIndex].name);
    gameCategoryDisplay.textContent = translations[currentLang].category(currentCategory);
    // gameLetterDisplay.textContent = randomStartLetter; // REMOVED - letter is not displayed here
    randomStartLetter = getRandomElement(alphabet); // Generate new random letter for the *next* turn's start screen

    timerDisplay.textContent = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        const percentage = (timeLeft / gameDuration) * 100;
        timerBar.style.width = `${percentage}%`;

        if (timeLeft <= 5 && timeLeft > 0) {
            timerDisplay.classList.add('text-error-red');
            timerBar.classList.remove('from-yellow-400', 'via-yellow-500', 'to-yellow-600', 'dark:from-yellow-700', 'dark:via-yellow-800', 'dark:to-yellow-900'); // Remove yellow
            timerBar.classList.add('bg-error-red'); // Add red
        } else if (timeLeft === 0) {
            clearInterval(timer);
            playerGoesToJail(); // Timer running out means going to jail now
        } else { // timeLeft > 5
            timerDisplay.classList.remove('text-error-red'); // Remove red text if it somehow got applied prematurely or from prev turn
            timerBar.classList.remove('bg-error-red'); // Remove red background
            timerBar.classList.add('from-yellow-400', 'via-yellow-500', 'to-yellow-600', 'dark:from-yellow-700', 'dark:via-yellow-800', 'dark:to-yellow-900'); // Ensure yellow gradient
        }
    }, 1000);
}

function handleNextQuestion() {
    clearInterval(timer);
    score += 10; // Award points for correct answer
    currentScoreDisplay.textContent = score;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('woordspelHighScore', highScore);
        highScoreText.textContent = `${translations[currentLang].highScoreText} ${highScore}`;
    }
    gameMessageDisplay.textContent = translations[currentLang].correctWordMsg(players[currentPlayerIndex].name);
    nextTurn(); // Removed setTimeout for instant transition
}


function playerGoesToJail() {
    clearInterval(timer); // Ensure timer stops
    players[currentPlayerIndex].inJail = true;
    jailMessageDisplay.textContent = translations[currentLang].jailMessage(players[currentPlayerIndex].name);
    showScreen(jailScreen);
}

function nextTurn() {
    if (players.every(p => p.inJail)) {
        gameMessageDisplay.textContent = translations[currentLang].allJailedMsg;
        scoreBar.classList.add('hidden');
        highScoreDisplay.classList.add('hidden');
        nextQuestionBtn.classList.add('hidden'); // Hide button
        showScreen(gameplayScreen); // Show gameplay screen to display final message
        setTimeout(() => showScreen(startScreen), 5000); // Then go back to start
        return;
    }

    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    showScreen(gameplayScreen);
    startTurn();
}


// --- Theme and Language Functions ---
function toggleTheme() {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
    updateThemeToggleIcon();
}

function loadTheme() {
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    updateThemeToggleIcon();
}

function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('woordspelLang', currentLang);
    updateTranslation();
    startGameFlow();
}

// --- Event Listeners ---
rulesBtn.addEventListener('click', () => {
    showScreen(rulesPopup);
});

closeRulesBtn.addEventListener('click', () => {
    rulesPopup.classList.add('hidden');
    rulesPopup.classList.remove('active');
    showScreen(startScreen); // ADDED: Return to start screen after closing rules
});

startGameBtn.addEventListener('click', () => {
    showScreen(setupScreen);
});

playerCountBtns.forEach(button => {
    button.addEventListener('click', (e) => {
        const numPlayers = parseInt(e.target.dataset.players);
        setupPlayersAndStartTurn(numPlayers);
    });
});

nextQuestionBtn.addEventListener('click', handleNextQuestion); // NEW: Event listener for "Next Question" button

nextPlayerFromJailBtn.addEventListener('click', () => {
    showScreen(gameplayScreen);
    nextTurn();
});

themeToggleBtn.addEventListener('click', toggleTheme);
langBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        changeLanguage(e.target.dataset.lang);
    });
});

// --- Service Worker Registration ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker geregistreerd met scope:', registration.scope);
            })
            .catch(err => {
                console.log('Service Worker registratie mislukt:', err);
            });
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    updateTranslation();
    startGameFlow();
});

// Ensure game title click also goes back to start for easy restart
gameTitle.addEventListener('click', startGameFlow);
