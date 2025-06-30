// --- DOM Elements ---
const startScreen = document.getElementById('start-screen');
const setupScreen = document.getElementById('setup-screen');
const gameplayScreen = document.getElementById('gameplay-screen');
const jailScreen = document.getElementById('jail-screen');
const rulesPopup = document.getElementById('rules-popup');

const startLetterDisplay = document.getElementById('start-letter');
const rulesBtn = document.getElementById('rules-btn');
const startGameBtn = document.getElementById('start-game-btn');
const closeRulesBtn = document.getElementById('close-rules-btn');
const playerCountBtns = document.querySelectorAll('.player-count-btn');

const currentPlayerDisplay = document.getElementById('current-player-display');
const gameCategoryDisplay = document.getElementById('game-category');
const gameLetterDisplay = document.getElementById('game-letter');
const timerDisplay = document.getElementById('timer-display');
const nextQuestionBtn = document.getElementById('next-question-btn');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeToggleIcon = document.getElementById('theme-toggle-icon');
const timerBar = document.getElementById('timer-bar');

const gameMessageDisplay = document.getElementById('game-message');

const jailMessageDisplay = document.getElementById('jail-message');
const nextPlayerFromJailBtn = document.getElementById('next-player-from-jail-btn');

const gameTitle = document.getElementById('game-title');

// --- Game State Variables ---
let players = [];
let currentPlayerIndex = 0;
let randomStartLetter = '';
let currentCategory = '';
let timer;
let timeLeft = 30;
const gameDuration = 30; // seconds

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const categories = [
    "Dier", "Stad", "Land", "Kleur", "Eten", "Beroep",
    "Sport", "Merknaam", "Voertuig", "Bekende Persoon", "Film/Serie", "Muziekgenre"
];

// --- Language Support ---
const translations = {
    nl: {
        title: "Het Woordspel",
        start: "Start Spel",
        rules: "Spelregels",
        close: "Sluiten",
        promo: "Test je woordenschat en daag je vrienden uit!",
        player: n => `Speler ${n}`,
        turn: name => `${name}'s Beurt!`,
        category: cat => `Categorie: ${cat}`,
        send: "Verzenden",
        noWord: "Je hebt geen woord ingevoerd!",
        wrongLetter: letter => `Woord moet beginnen met '${letter}'!`,
        good: (name, word) => `Goed gedaan, ${name}! Je woord was: "${word}".`,
        jail: name => `${name} gaat naar de gevangenis!`,
        allJail: "Alle spelers zitten in de gevangenis! Spel voorbij.",
        next: "Volgende Speler",
        setup: "Aantal Spelers"
    },
    en: {
        title: "The Word Game",
        start: "Start Game",
        rules: "Rules",
        close: "Close",
        promo: "Test your vocabulary and challenge your friends!",
        player: n => `Player ${n}`,
        turn: name => `${name}'s Turn!`,
        category: cat => `Category: ${cat}`,
        send: "Submit",
        noWord: "You didn't enter a word!",
        wrongLetter: letter => `Word must start with '${letter}'!`,
        good: (name, word) => `Well done, ${name}! Your word was: "${word}".`,
        jail: name => `${name} goes to jail!`,
        allJail: "All players are in jail! Game over.",
        next: "Next Player",
        setup: "Number of Players"
    },
    fr: {
        title: "Le Jeu de Mots",
        start: "Démarrer le Jeu",
        rules: "Règles",
        close: "Fermer",
        promo: "Testez votre vocabulaire et défiez vos amis !",
        player: n => `Joueur ${n}`,
        turn: name => `Au tour de ${name} !`,
        category: cat => `Catégorie : ${cat}`,
        send: "Envoyer",
        noWord: "Vous n'avez pas saisi de mot !",
        wrongLetter: letter => `Le mot doit commencer par '${letter}' !`,
        good: (name, word) => `Bien joué, ${name} ! Votre mot était : "${word}".`,
        jail: name => `${name} va en prison !`,
        allJail: "Tous les joueurs sont en prison ! Fin du jeu.",
        next: "Joueur Suivant",
        setup: "Nombre de Joueurs"
    },
    de: {
        title: "Das Wortspiel",
        start: "Spiel Starten",
        rules: "Regeln",
        close: "Schließen",
        promo: "Teste deinen Wortschatz und fordere deine Freunde heraus!",
        player: n => `Spieler ${n}`,
        turn: name => `${name} ist dran!`,
        category: cat => `Kategorie: ${cat}`,
        send: "Absenden",
        noWord: "Du hast kein Wort eingegeben!",
        wrongLetter: letter => `Wort muss mit '${letter}' beginnen!`,
        good: (name, word) => `Gut gemacht, ${name}! Dein Wort war: "${word}".`,
        jail: name => `${name} kommt ins Gefängnis!`,
        allJail: "Alle Spieler sind im Gefängnis! Spiel vorbei.",
        next: "Nächster Spieler",
        setup: "Anzahl der Spieler"
    }
};

let currentLang = 'nl';

// --- Sound Effects ---
const timerEndAudio = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae2e2.mp3'); // short beep
const nextAudio = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae2e2.mp3'); // same for demo

// --- High Score ---
let highScore = 0;
let currentStreak = 0;

// --- High Score Persistence (session only) ---
function resetHighScoreSession() {
    highScore = 0;
    sessionStorage.removeItem('woordspel-highscore');
}
function loadHighScoreSession() {
    highScore = parseInt(sessionStorage.getItem('woordspel-highscore')) || 0;
}
function saveHighScoreSession() {
    sessionStorage.setItem('woordspel-highscore', highScore);
}

// --- Hints (Skip) ---
let playerHints = [];

// --- Category Translations ---
const categoryTranslations = {
    nl: {
        "Dier": "Dier",
        "Stad": "Stad",
        "Land": "Land",
        "Kleur": "Kleur",
        "Eten": "Eten",
        "Beroep": "Beroep",
        "Sport": "Sport",
        "Merknaam": "Merknaam",
        "Voertuig": "Voertuig",
        "Bekende Persoon": "Bekende Persoon",
        "Film/Serie": "Film/Serie",
        "Muziekgenre": "Muziekgenre"
    },
    en: {
        "Dier": "Animal",
        "Stad": "City",
        "Land": "Country",
        "Kleur": "Color",
        "Eten": "Food",
        "Beroep": "Profession",
        "Sport": "Sport",
        "Merknaam": "Brand",
        "Voertuig": "Vehicle",
        "Bekende Persoon": "Famous Person",
        "Film/Serie": "Movie/Series",
        "Muziekgenre": "Music Genre"
    },
    fr: {
        "Dier": "Animal",
        "Stad": "Ville",
        "Land": "Pays",
        "Kleur": "Couleur",
        "Eten": "Nourriture",
        "Beroep": "Métier",
        "Sport": "Sport",
        "Merknaam": "Marque",
        "Voertuig": "Véhicule",
        "Bekende Persoon": "Personne célèbre",
        "Film/Serie": "Film/Série",
        "Muziekgenre": "Genre musical"
    },
    de: {
        "Dier": "Tier",
        "Stad": "Stadt",
        "Land": "Land",
        "Kleur": "Farbe",
        "Eten": "Essen",
        "Beroep": "Beruf",
        "Sport": "Sport",
        "Merknaam": "Marke",
        "Voertuig": "Fahrzeug",
        "Bekende Persoon": "Berühmte Person",
        "Film/Serie": "Film/Serie",
        "Muziekgenre": "Musikgenre"
    }
};

// --- Language UI Update Helper ---
function updateAllDynamicTexts() {
    // Update gameplay screen
    if (players.length > 0) {
        currentPlayerDisplay.textContent = translations[currentLang].turn(players[currentPlayerIndex].name);
        // Show the translated category name
        gameCategoryDisplay.textContent = categoryTranslations[currentLang][currentCategory] || currentCategory;
    }
    // Jail screen
    if (jailScreen.classList.contains('active')) {
        jailMessageDisplay.textContent = translations[currentLang].jail(players[currentPlayerIndex]?.name || '');
    }
    // Next button
    nextPlayerFromJailBtn.textContent = translations[currentLang].next;
    nextQuestionBtn.textContent = translations[currentLang].next;
    // Setup screen
    document.querySelector('#setup-screen h2').textContent = translations[currentLang].setup;
    document.querySelectorAll('.player-count-btn').forEach((btn, i) => {
        btn.textContent = translations[currentLang].player(i + 1);
    });
    // Start screen
    document.getElementById('start-game-btn').textContent = translations[currentLang].start;
    document.getElementById('rules-btn').textContent = translations[currentLang].rules;
    document.querySelector('.promo-text').textContent = translations[currentLang].promo;
    // Rules popup
    document.getElementById('close-rules-btn').textContent = translations[currentLang].close;
    const rulesTitle = document.querySelector('.popup-content h2');
    if (rulesTitle) rulesTitle.textContent = translations[currentLang].rules;
    // Score bar: only show during gameplay or jail
    const currentScoreEl = document.getElementById('current-score');
    const scoreBar = document.getElementById('score-bar');
    if (scoreBar) {
        if (gameplayScreen.classList.contains('active') || jailScreen.classList.contains('active')) {
            scoreBar.classList.remove('hidden');
        } else {
            scoreBar.classList.add('hidden');
        }
    }
    if (currentScoreEl) {
        currentScoreEl.textContent = currentStreak;
    }
    // High score display (show if gameplay or jail screen is active)
    const highScoreEl = document.getElementById('high-score');
    const highScoreText = document.getElementById('high-score-text');
    if (highScoreEl && highScoreText) {
        if (gameplayScreen.classList.contains('active') || jailScreen.classList.contains('active')) {
            highScoreEl.classList.remove('hidden');
            highScoreText.textContent = `Highscore: ${highScore}`;
        } else {
            highScoreEl.classList.add('hidden');
        }
    }
    // Hint button
    const hintBtn = document.getElementById('hint-btn');
    if (hintBtn && players.length > 0) {
        hintBtn.style.display = playerHints[currentPlayerIndex] ? 'none' : 'inline-block';
        hintBtn.textContent = {
            nl: '❤️ Gratis Hart',
            en: '❤️ Free Heart',
            fr: '❤️ Cœur Gratuit',
            de: '❤️ Gratis Herz'
        }[currentLang] || '❤️ Free Heart';
    }
}

// --- Language Switch ---
function setLang(lang) {
    currentLang = lang;
    // Update static UI text
    document.querySelector('header h1').textContent = translations[lang].title;
    // Highlight active lang button with Tailwind and scale
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.dataset.lang === lang) {
            btn.classList.add(
                'bg-yellow-400', 'text-blue-900', 'ring-4', 'ring-yellow-300', 'scale-110', 'shadow-xl'
            );
            btn.classList.remove('bg-white/80', 'text-blue-900', 'shadow-md');
        } else {
            btn.classList.remove(
                'bg-yellow-400', 'text-blue-900', 'ring-4', 'ring-yellow-300', 'scale-110', 'shadow-xl'
            );
            btn.classList.add('bg-white/80', 'text-blue-900', 'shadow-md');
        }
    });
    updateAllDynamicTexts();
}

// --- Utility Functions ---
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function showScreen(screenToShow) {
    const screens = [startScreen, setupScreen, gameplayScreen, jailScreen];
    screens.forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('hidden');
    });
    screenToShow.classList.add('active');
    screenToShow.classList.remove('hidden');
}

function resetGame() {
    players = [];
    currentPlayerIndex = 0;
    randomStartLetter = '';
    currentCategory = '';
    clearInterval(timer);
    timeLeft = gameDuration;
    gameMessageDisplay.textContent = '';
    currentStreak = 0;
    loadHighScoreSession();
    updateAllDynamicTexts();
}

// --- Game Logic ---

function startGame() {
    resetGame();
    // Remove custom name prompt, use default names
    let numPlayers = 1;
    if (setupScreen.classList.contains('active')) {
        numPlayers = parseInt(prompt("Hoeveel spelers? (1-4)", "1")) || 1;
        numPlayers = Math.max(1, Math.min(4, numPlayers));
    }
    players = Array.from({ length: numPlayers }, (_, i) => ({
        name: `Speler ${i + 1}`,
        inJail: false
    }));
    playerHints = Array(numPlayers).fill(false);
    currentPlayerIndex = 0;
    randomStartLetter = getRandomElement(alphabet);
    startLetterDisplay.textContent = randomStartLetter;
    gameLetterDisplay.textContent = randomStartLetter;
    showScreen(startScreen);
    setLang(currentLang);
    updateAllDynamicTexts();
}

function setupPlayers(numPlayers) {
    // Remove custom name prompt, use default names
    players = Array.from({ length: numPlayers }, (_, i) => ({
        name: `Speler ${i + 1}`,
        inJail: false
    }));
    playerHints = Array(numPlayers).fill(false);
    currentPlayerIndex = 0;
    showScreen(gameplayScreen);
    startTurn();
}

function startTurn() {
    clearInterval(timer);
    timeLeft = gameDuration;
    gameMessageDisplay.textContent = '';
    updateTimerUI();

    // Skip jailed players
    while (players[currentPlayerIndex].inJail && players.some(p => !p.inJail)) {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        if (currentPlayerIndex === 0) {
            console.log("All players are jailed or round ended.");
        }
    }
    if (players.every(p => p.inJail)) {
        gameMessageDisplay.textContent = translations[currentLang].allJail;
        setTimeout(startGame, 5000);
        return;
    }
    currentCategory = getRandomElement(categories);
    currentPlayerDisplay.textContent = translations[currentLang].turn(players[currentPlayerIndex].name);
    gameCategoryDisplay.textContent = categoryTranslations[currentLang][currentCategory] || currentCategory;
    gameLetterDisplay.textContent = randomStartLetter;
    updateAllDynamicTexts();

    timerDisplay.classList.remove('text-red-600', 'dark:text-red-400');
    updateTimerUI();
    timer = setInterval(() => {
        timeLeft--;
        updateTimerUI();
        if (timeLeft <= 5) {
            timerDisplay.classList.add('text-red-600', 'dark:text-red-400');
        }
        if (timeLeft <= 0) {
            clearInterval(timer);
            timerEndAudio.play();
            playerGoesToJail();
        }
    }, 1000);
}

function updateTimerUI() {
    timerDisplay.textContent = timeLeft;
    const percent = Math.max(0, Math.min(1, timeLeft / gameDuration));
    timerBar.style.width = (percent * 100) + "%";
    if (timeLeft <= 5) {
        timerBar.classList.remove('from-yellow-400', 'via-yellow-500', 'to-yellow-600', 'dark:from-yellow-700', 'dark:via-yellow-800', 'dark:to-yellow-900');
        timerBar.classList.add('from-red-400', 'via-red-500', 'to-red-600', 'dark:from-red-700', 'dark:via-red-800', 'dark:to-red-900');
    } else {
        timerBar.classList.remove('from-red-400', 'via-red-500', 'to-red-600', 'dark:from-red-700', 'dark:via-red-800', 'dark:to-red-900');
        timerBar.classList.add('from-yellow-400', 'via-yellow-500', 'to-yellow-600', 'dark:from-yellow-700', 'dark:via-yellow-800', 'dark:to-yellow-900');
    }
}

function playerGoesToJail() {
    players[currentPlayerIndex].inJail = true;
    currentStreak = 0;
    jailMessageDisplay.textContent = translations[currentLang].jail(players[currentPlayerIndex].name);
    showScreen(jailScreen);
    updateAllDynamicTexts();
}

function nextTurn() {
    clearInterval(timer);
    nextAudio.play();
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    currentStreak++;
    if (currentStreak > highScore) {
        highScore = currentStreak;
        saveHighScoreSession();
    }
    updateAllDynamicTexts();
    startTurn();
}

// Free Heart (skip) logic: skip turn, do NOT reset streak/highscore
const hintBtn = document.getElementById('hint-btn');
hintBtn.addEventListener('click', () => {
    playerHints[currentPlayerIndex] = true;
    clearInterval(timer);
    nextAudio.play();
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    // Do NOT increment or reset currentStreak, just keep it as is
    updateAllDynamicTexts();
    startTurn();
});

// --- Event Listeners ---
rulesBtn.addEventListener('click', () => {
    rulesPopup.classList.remove('hidden');
    updateAllDynamicTexts();
});
closeRulesBtn.addEventListener('click', () => {
    rulesPopup.classList.add('hidden');
});

startGameBtn.addEventListener('click', () => {
    resetGame();
    showScreen(setupScreen);
    updateAllDynamicTexts();
});

playerCountBtns.forEach(button => {
    button.addEventListener('click', (e) => {
        const numPlayers = parseInt(e.target.dataset.players);
        setupPlayers(numPlayers);
    });
});

nextPlayerFromJailBtn.addEventListener('click', () => {
    showScreen(gameplayScreen);
    nextTurn();
});

// Language switch buttons
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        setLang(btn.dataset.lang);
    });
});

// Next Question button logic
nextQuestionBtn.addEventListener('click', () => {
    nextTurn();
});

// Make game name clickable to go to home/start screen
gameTitle.addEventListener('click', () => {
    resetGame();
    showScreen(startScreen);
    setLang('nl'); // Always reset to Dutch on home
});

// --- Theme Toggle ---
function setTheme(mode) {
    if (mode === 'dark') {
        document.documentElement.classList.add('dark');
        themeToggleIcon.textContent = '☀️';
        localStorage.setItem('woordspel-theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        themeToggleIcon.textContent = '🌙';
        localStorage.setItem('woordspel-theme', 'light');
    }
}
themeToggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
});
// On load, set theme from localStorage or system preference and set Dutch as default
document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('woordspel-theme');
    if (saved) {
        setTheme(saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    } else {
        setTheme('light');
    }
    setLang('nl');
    resetHighScoreSession(); // Reset highscore on full reload
    startGame();
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

// Initialize game on load
document.addEventListener('DOMContentLoaded', startGame);