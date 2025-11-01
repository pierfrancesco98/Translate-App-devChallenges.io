const sourceTextarea = document.querySelector('#source-text');
const targetTextarea = document.querySelector('#target-text');
const counter = document.querySelector('.char-counter');

sourceTextarea.addEventListener('input', () => {
  const lengthLetter = sourceTextarea.value.length;
  counter.textContent = lengthLetter < 500 ? `${lengthLetter}/500` : 'MAX/500';
});

let sourceLang = "en";
let targetLang = "fr";

document.querySelectorAll('.play-sound').forEach(btn => {
  btn.addEventListener('click', () => {
    const col = btn.closest('.col'); 
    const textValue = col.querySelector('textarea').value.trim();
    if (!textValue) return;

    const activeLang = col.querySelector('.lang.active');
    const lang = activeLang.dataset.lang;
    const utterance = new SpeechSynthesisUtterance(textValue);
    utterance.lang = lang === 'auto' || lang === 'detect' ? 'en' : lang; 
    speechSynthesis.speak(utterance);
  });
});

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

const sourceButtons = document.querySelectorAll('.col-source .lang');
const targetButtons = document.querySelectorAll('.col-target .lang');

sourceButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.lang === 'detect' || btn.dataset.lang === targetLang) return;
    sourceButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    sourceLang = btn.dataset.lang;
  });
});

targetButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.lang === 'detect' || btn.dataset.lang === sourceLang) return;
    targetButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    targetLang = btn.dataset.lang;
  });
});


document.querySelector('.reverse-btn').addEventListener('click', () => {
  const tempText = sourceTextarea.value;
  sourceTextarea.value = targetTextarea.value;
  targetTextarea.value = tempText;

  const sourceActive = document.querySelector('.col-source .lang.active');
  const targetActive = document.querySelector('.col-target .lang.active');

  sourceActive.classList.remove('active');
  targetActive.classList.remove('active');

  const newSource = document.querySelector(`.col-source .lang[data-lang="${targetActive.dataset.lang}"]`);
  const newTarget = document.querySelector(`.col-target .lang[data-lang="${sourceActive.dataset.lang}"]`);

  if (newSource.dataset.lang !== 'detect') newSource.classList.add('active');
  if (newTarget.dataset.lang !== 'detect') newTarget.classList.add('active');

  sourceLang = newSource.dataset.lang;
  targetLang = newTarget.dataset.lang;
});

document.querySelector('#translate-btn').addEventListener('click', () => {
  const textToTranslate = sourceTextarea.value.trim();
  fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=${sourceLang}|${targetLang}`)
    .then(res => res.json())
    .then(data => {
     targetTextarea.value = data.responseData.translatedText;
    })
    .catch(err => console.error(err));
});



