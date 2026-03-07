/* =============================================
   El Cuento de Steffi — App Logic
   ============================================= */

'use strict';

// --- State -----------------------------------------------------------
const state = {
  hero:      null,  // "Steffi" | "La Aventurera" | "La Princesa"
  sidekick:  null,  // "Guau" | "Ramón"
  setting:   null,  // "alps" | "pyramids" | "castle"
  timeOfDay: null,  // "una mañana soleada" | "una noche estrellada"
  item:      null,  // "un mapa misterioso" | "una llave dorada"
  ending:    null,  // "un tesoro escondido" | "una amistad para siempre"
  currentChoiceStep: 0,
  currentPage: 0,
  assembledPages: [],
};

// --- Vocabulary ------------------------------------------------------
const VOCAB = {
  hero:      { es: 'la heroína',          en: 'the hero' },
  sidekick:  { es: 'el compañero',        en: 'the companion' },
  setting:   { es: 'el lugar',            en: 'the place' },
  mañana:    { es: 'una mañana soleada',  en: 'on a sunny morning' },
  noche:     { es: 'una noche estrellada',en: 'on a starry night' },
  mapa:      { es: 'un mapa misterioso',  en: 'a mysterious map' },
  llave:     { es: 'una llave dorada',    en: 'a golden key' },
  tesoro:    { es: 'un tesoro escondido', en: 'a hidden treasure' },
  amistad:   { es: 'una amistad para siempre', en: 'a friendship forever' },
  guau:      { es: '¡Guau!',              en: '(Wuff! — in Spanish!)' },
  cuento:    { es: 'el cuento',           en: 'the story' },
  aventura:  { es: 'la aventura',         en: 'the adventure' },
  misterioso:{ es: 'misterioso',          en: 'mysterious' },
  dorada:    { es: 'dorada',              en: 'golden' },
};

// --- Choice Questions (Screen 4) ------------------------------------
const CHOICE_QUESTIONS = [
  {
    id:       'timeOfDay',
    question: '¿Cuándo empieza la aventura?',
    subtitle: 'When does the adventure begin?',
    options: [
      { label: 'Una mañana soleada',   hint: '(on a sunny morning)',   value: 'una mañana soleada' },
      { label: 'Una noche estrellada', hint: '(on a starry night)',     value: 'una noche estrellada' },
    ],
  },
  {
    id:       'item',
    question: '¿Qué encuentra la heroína?',
    subtitle: 'What does the hero find?',
    options: [
      { label: 'Un mapa misterioso', hint: '(a mysterious map)',  value: 'un mapa misterioso' },
      { label: 'Una llave dorada',   hint: '(a golden key)',      value: 'una llave dorada' },
    ],
  },
  {
    id:       'ending',
    question: '¿Cómo termina el cuento?',
    subtitle: 'How does the story end?',
    options: [
      { label: 'Un tesoro escondido',       hint: '(a hidden treasure)',      value: 'un tesoro escondido' },
      { label: 'Una amistad para siempre',  hint: '(a friendship forever)',   value: 'una amistad para siempre' },
    ],
  },
];

// --- Story Template --------------------------------------------------
const STORY_PAGES = [
  {
    scene:     'setting',
    vocabKey:  'aventura',
    buildText: (s) =>
      `${capitalise(s.timeOfDay)}, <span class="vocab-word">${s.hero}</span>
       y su <span class="vocab-word">compañero <span class="vocab-hint">(companion)</span></span>
       <span class="vocab-word">${sidekickName(s.sidekick)}</span>
       salieron de <span class="vocab-word">${settingLabel(s.setting)}</span>
       con <span class="vocab-word">${s.item}</span>
       <span class="vocab-hint">${itemHint(s.item)}</span> en la mano.`,
  },
  {
    scene:     'journey',
    vocabKey:  'misterioso',
    buildText: (s) =>
      `«<span class="vocab-word">${sidekickSound(s.sidekick)}</span>
       <span class="vocab-hint">${sidekickSoundHint(s.sidekick)}</span>»
       — dijo <span class="vocab-word">${sidekickName(s.sidekick)}</span>.
       <br><br>
       «¡<span class="vocab-word">Vamos a encontrar</span>
       <span class="vocab-hint">(let's find)</span>
       algo <span class="vocab-word">especial <span class="vocab-hint">(special)</span></span>!»`,
  },
  {
    scene:     'arrival',
    vocabKey:  endingVocabKey,
    buildText: (s) =>
      `Al <span class="vocab-word">llegar <span class="vocab-hint">(arriving)</span></span>,
       encontraron <span class="vocab-word">${s.ending}</span>
       <span class="vocab-hint">${endingHint(s.ending)}</span>.
       <br><br>
       El <span class="vocab-word">corazón <span class="vocab-hint">(heart)</span></span>
       de <span class="vocab-word">${s.hero}</span>
       se llenó de <span class="vocab-word">alegría <span class="vocab-hint">(joy)</span></span>.`,
  },
  {
    scene:     'birthday',
    vocabKey:  'cuento',
    buildText: (_s) =>
      `Y <span class="vocab-word">colorín colorado</span>
       <span class="vocab-hint">(and that's the end — a classic Spanish story closer)</span>,
       este <span class="vocab-word">cuento <span class="vocab-hint">(story)</span></span>
       ha terminado.
       <br><br>
       <strong>¡Feliz cumpleaños, Steffi!</strong> 🎂`,
  },
];

// --- Helpers ---------------------------------------------------------
function capitalise(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function sidekickName(s) {
  return s === 'Guau' ? 'Guau el perro' : 'Ramón el valiente';
}

function sidekickSound(s) {
  return s === 'Guau' ? '¡Guau! ¡Guau!' : '¡Adelante, amiga!';
}

function sidekickSoundHint(s) {
  return s === 'Guau' ? '(Wuff! Wuff! — in Spanish!)' : '(Onward, friend!)';
}

function settingLabel(s) {
  const map = {
    alps:     'los Alpes Suizos',
    pyramids: 'las Pirámides de Egipto',
    castle:   'el Castillo de Vaduz',
  };
  return map[s] || s;
}

function itemHint(item) {
  if (item.includes('mapa'))  return '(mysterious map)';
  if (item.includes('llave')) return '(golden key)';
  return '';
}

function endingHint(ending) {
  if (ending.includes('tesoro'))   return '(a hidden treasure)';
  if (ending.includes('amistad'))  return '(a friendship forever)';
  return '';
}

function endingVocabKey(s) {
  return s.ending && s.ending.includes('tesoro') ? 'tesoro' : 'amistad';
}

// --- Screen Management -----------------------------------------------
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('screen-' + id);
  if (target) target.classList.add('active');
}

// --- Screen 1: Hero --------------------------------------------------
function initHeroScreen() {
  document.querySelectorAll('#screen-hero .card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('#screen-hero .card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.hero = card.dataset.value;
    });
  });

  document.getElementById('btn-hero-next').addEventListener('click', () => {
    if (!state.hero) { shake('screen-hero'); return; }
    showScreen('sidekick');
  });
}

// --- Screen 2: Sidekick ----------------------------------------------
function initSidekickScreen() {
  document.querySelectorAll('#screen-sidekick .card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('#screen-sidekick .card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.sidekick = card.dataset.value;
    });
  });

  document.getElementById('btn-sidekick-next').addEventListener('click', () => {
    if (!state.sidekick) { shake('screen-sidekick'); return; }
    showScreen('setting');
  });
}

// --- Screen 3: Setting -----------------------------------------------
function initSettingScreen() {
  document.querySelectorAll('#screen-setting .card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('#screen-setting .card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.setting = card.dataset.value;
    });
  });

  document.getElementById('btn-setting-next').addEventListener('click', () => {
    if (!state.setting) { shake('screen-setting'); return; }
    state.currentChoiceStep = 0;
    showScreen('choices');
    renderChoiceStep();
  });
}

// --- Screen 4: Story Choices -----------------------------------------
function renderChoiceStep() {
  const step = CHOICE_QUESTIONS[state.currentChoiceStep];
  const stepCount  = document.getElementById('choice-step-count');
  const questionEl = document.getElementById('choice-question');
  const subtitleEl = document.getElementById('choice-subtitle');
  const optionsEl  = document.getElementById('choice-options');
  const progressEl = document.getElementById('choice-progress');

  stepCount.textContent = `Paso ${state.currentChoiceStep + 1} de ${CHOICE_QUESTIONS.length}`;
  questionEl.textContent = step.question;
  subtitleEl.textContent = step.subtitle;

  optionsEl.innerHTML = '';
  step.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerHTML = `<strong>${opt.label}</strong> <span class="vocab-hint">${opt.hint}</span>`;
    btn.addEventListener('click', () => {
      state[step.id] = opt.value;
      state.currentChoiceStep++;
      if (state.currentChoiceStep >= CHOICE_QUESTIONS.length) {
        buildStory();
        state.currentPage = 0;
        showScreen('storybook');
        renderPage(0);
      } else {
        renderChoiceStep();
      }
    });
    optionsEl.appendChild(btn);
  });

  // Update progress dots
  if (progressEl) {
    progressEl.innerHTML = '';
    CHOICE_QUESTIONS.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'progress-dot' +
        (i < state.currentChoiceStep ? ' done' : i === state.currentChoiceStep ? ' active' : '');
      progressEl.appendChild(dot);
    });
  }
}

// --- Story Assembly --------------------------------------------------
function buildStory() {
  state.assembledPages = STORY_PAGES.map(page => {
    const vocabKey = typeof page.vocabKey === 'function'
      ? page.vocabKey(state)
      : page.vocabKey;
    // First story page uses the player's chosen setting as its scene
    const scene = page.scene === 'setting' ? state.setting : page.scene;
    return {
      scene,
      text:      page.buildText(state),
      vocabKey,
    };
  });
}

// --- Screen 5: Storybook ---------------------------------------------
function renderPage(n) {
  const pages = state.assembledPages;
  const page  = pages[n];
  if (!page) return;

  // Counter
  document.getElementById('page-counter').textContent =
    `Página ${n + 1} de ${pages.length}`;

  // Scene
  const sceneContainer = document.getElementById('book-scene');
  const tpl = document.getElementById('scene-' + page.scene);
  sceneContainer.innerHTML = '';
  if (tpl) {
    sceneContainer.appendChild(tpl.content.cloneNode(true));
    // Starry night class toggle
    if (state.timeOfDay && state.timeOfDay.includes('noche')) {
      sceneContainer.querySelector('svg')?.classList.add('night');
    }
  }

  // Text
  const textEl = document.getElementById('book-story-text');
  textEl.innerHTML = page.text;

  // Vocab card
  const vocabCard  = document.getElementById('book-vocab-card');
  const vocabEntry = VOCAB[page.vocabKey];
  if (vocabCard && vocabEntry) {
    vocabCard.querySelector('.vocab-card-word').textContent        = vocabEntry.es;
    vocabCard.querySelector('.vocab-card-translation').textContent = vocabEntry.en;
    vocabCard.style.display = 'block';
  }

  // Navigation buttons
  document.getElementById('btn-prev-page').style.display = n === 0 ? 'none' : 'inline-block';
  const nextBtn = document.getElementById('btn-next-page');
  const celebrateBtn = document.getElementById('btn-celebrate');
  const isLast = n === pages.length - 1;
  nextBtn.style.display     = isLast ? 'none' : 'inline-block';
  celebrateBtn.style.display = isLast ? 'inline-block' : 'none';

  // Animate page
  const bookPage = document.getElementById('book-page');
  bookPage.style.animation = 'none';
  bookPage.offsetHeight; // reflow
  bookPage.style.animation = '';
}

function initStorybookScreen() {
  document.getElementById('btn-prev-page').addEventListener('click', () => {
    if (state.currentPage > 0) {
      state.currentPage--;
      renderPage(state.currentPage);
    }
  });

  document.getElementById('btn-next-page').addEventListener('click', () => {
    if (state.currentPage < state.assembledPages.length - 1) {
      state.currentPage++;
      renderPage(state.currentPage);
    }
  });

  document.getElementById('btn-celebrate').addEventListener('click', () => {
    showScreen('surprise');
    startConfetti();
  });
}

// --- Screen 6: Birthday Surprise ------------------------------------
function startConfetti() {
  const container = document.getElementById('confetti-container');
  container.innerHTML = '';

  const colors = [
    '#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF',
    '#FF922B', '#CC5DE8', '#FF6BB5', '#87CEEB',
  ];

  for (let i = 0; i < 80; i++) {
    const el = document.createElement('div');
    el.className = 'confetti';
    el.style.left            = Math.random() * 100 + 'vw';
    el.style.top             = -(Math.random() * 20 + 10) + 'px';
    el.style.background      = colors[Math.floor(Math.random() * colors.length)];
    el.style.width           = (Math.random() * 8 + 6) + 'px';
    el.style.height          = (Math.random() * 8 + 6) + 'px';
    el.style.borderRadius    = Math.random() > 0.5 ? '50%' : '2px';
    el.style.animationDuration  = (Math.random() * 3 + 2.5) + 's';
    el.style.animationDelay     = (Math.random() * 3) + 's';
    container.appendChild(el);
  }

  // Re-trigger confetti every 6 seconds
  setTimeout(startConfetti, 6000);
}

// --- Shake animation for missing selection ---------------------------
function shake(screenId) {
  const el = document.getElementById('screen-' + screenId);
  el.style.animation = 'shake 0.4s ease';
  el.addEventListener('animationend', () => { el.style.animation = ''; }, { once: true });
}

// Inject shake keyframes
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    25%      { transform: translateX(-10px); }
    75%      { transform: translateX(10px); }
  }
`;
document.head.appendChild(shakeStyle);

// --- Init All --------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  showScreen('welcome');
  initHeroScreen();
  initSidekickScreen();
  initSettingScreen();
  initStorybookScreen();

  // Welcome CTA
  document.getElementById('btn-start').addEventListener('click', () => {
    showScreen('hero');
  });

  // Play again from surprise screen
  const playAgain = document.getElementById('btn-play-again');
  if (playAgain) {
    playAgain.addEventListener('click', () => {
      Object.assign(state, {
        hero: null, sidekick: null, setting: null,
        timeOfDay: null, item: null, ending: null,
        currentChoiceStep: 0, currentPage: 0, assembledPages: [],
      });
      document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
      document.getElementById('confetti-container').innerHTML = '';
      showScreen('welcome');
    });
  }
});
