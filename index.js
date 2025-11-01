const sourceTextarea = document.querySelector('#source-text');
const targetTextarea = document.querySelector('#target-text');
const counter = document.querySelector('.char-counter');

sourceTextarea.addEventListener('input', () => {
  const lengthLetter = sourceTextarea.value.length;
  counter.textContent = lengthLetter < 500 ? `${lengthLetter}/500` : 'MAX/500';
});

let sourceLang = "en";
let targetLang = "fr";

// Text-to-speech
document.querySelectorAll('.play-sound').forEach(btn => {
  btn.addEventListener('click', () => {
    const col = btn.closest('.col'); 
    const textValue = col.querySelector('textarea').value.trim();
    if (!textValue) return;

    const activeLang = col.querySelector('.lang.active');
    const lang = activeLang.dataset.lang;
    const utterance = new SpeechSynthesisUtterance(textValue);
    utterance.lang = lang === 'auto' || lang === 'dt' ? 'en' : lang; 
    speechSynthesis.speak(utterance);
  });
});

// Copy-to-clipboard
document.querySelectorAll('.copy-text').forEach(btn => {
  btn.addEventListener('click', async () => {
    const col = btn.closest('.col'); 
    const textValue = col.querySelector('textarea').value.trim();
    try {
      await navigator.clipboard.writeText(textValue);
      alert("Testo copiato negli appunti!");
    } catch (err) {
      console.error(err);
    }
  });
});

// Source buttons
const sourceButtons = document.querySelectorAll('.col-source .lang');
const targetButtons = document.querySelectorAll('.col-target .lang');

sourceButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.lang === 'dt') return;
    sourceLang = btn.dataset.lang;

    sourceButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
    btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true');

    const availableTargets = Array.from(targetButtons)
      .filter(b => b.dataset.lang !== sourceLang && b.dataset.lang !== 'dt');

    if (availableTargets.length > 0) {
      targetButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      availableTargets[0].classList.add('active');
      availableTargets[0].setAttribute('aria-pressed', 'true');
      targetLang = availableTargets[0].dataset.lang;
    }
  });
});

// Target buttons
targetButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.lang === 'dt') return;
    targetLang = btn.dataset.lang;

    targetButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
    btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true');

    const availableSources = Array.from(sourceButtons)
      .filter(b => b.dataset.lang !== targetLang && b.dataset.lang !== 'dt');

    if (availableSources.length > 0) {
      sourceButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      availableSources[0].classList.add('active');
      availableSources[0].setAttribute('aria-pressed', 'true');
      sourceLang = availableSources[0].dataset.lang;
    }
  });
});

// Reverse
document.querySelector('.reverse-btn').addEventListener('click', () => {
  const tempText = sourceTextarea.value;
  sourceTextarea.value = targetTextarea.value;
  targetTextarea.value = tempText;

  const sourceActive = document.querySelector('.col-source .lang.active');
  const targetActive = document.querySelector('.col-target .lang.active');

  const tempLang = sourceActive.dataset.lang;
  const newSourceLang = targetActive.dataset.lang;
  const newTargetLang = tempLang;

  sourceButtons.forEach(btn => btn.classList.remove('active'));
  targetButtons.forEach(btn => btn.classList.remove('active'));

  const newSource = document.querySelector(`.col-source .lang[data-lang="${newSourceLang}"]`);
  const newTarget = document.querySelector(`.col-target .lang[data-lang="${newTargetLang}"]`);

  if (newSource && newSource.dataset.lang !== 'dt') newSource.classList.add('active');
  if (newTarget && newTarget.dataset.lang !== 'dt') newTarget.classList.add('active');

  sourceLang = newSourceLang;
  targetLang = newTargetLang;
});

// Translate
document.querySelector('#translate-btn').addEventListener('click', () => {
  const textToTranslate = sourceTextarea.value.trim();
  fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=${sourceLang}|${targetLang}`)
    .then(res => res.json())
    .then(data => {
      targetTextarea.value = data.responseData.translatedText;
    })
    .catch(err => console.error(err));
});

