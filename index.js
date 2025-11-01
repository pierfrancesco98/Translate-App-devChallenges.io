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
    utterance.lang = lang === 'detect-language' ? 'en' : lang;
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
    };
  });
});

const sourceButtons = document.querySelectorAll('.col-source .lang');
const targetButtons = document.querySelectorAll('.col-target .lang');

function setActiveButton(buttons, lang) {
  buttons.forEach(b => b.classList.remove('active'));
  const btn = Array.from(buttons).find(b => b.dataset.lang === lang);
  if (btn) btn.classList.add('active');
};


sourceButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    sourceLang = btn.dataset.lang;
    setActiveButton(sourceButtons, sourceLang);
    if (sourceLang === targetLang) {
      const fallback = Array.from(targetButtons).find(b => b.dataset.lang !== sourceLang && b.dataset.lang !== 'detect-language');
      if (fallback) {
        targetLang = fallback.dataset.lang;
        setActiveButton(targetButtons, targetLang);
      };
    };
  });
});


targetButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.lang === 'detect-language') return; 
    targetLang = btn.dataset.lang;
    setActiveButton(targetButtons, targetLang);

    if (targetLang === sourceLang) {
      const fallback = Array.from(sourceButtons).find(b => b.dataset.lang !== targetLang && b.dataset.lang !== 'detect-language');
      if (fallback) {
        sourceLang = fallback.dataset.lang;
        setActiveButton(sourceButtons, sourceLang);
      };
    };
  });
});

document.querySelector('.reverse-btn').addEventListener('click', () => {
  const tempText = sourceTextarea.value;
  sourceTextarea.value = targetTextarea.value;
  targetTextarea.value = tempText;

  const tempLang = sourceLang;
  sourceLang = targetLang;
  targetLang = tempLang;

  if (targetLang === 'detect-language') {
    const fallback = Array.from(targetButtons).find(b => b.dataset.lang !== 'detect-language');
    if (fallback) targetLang = fallback.dataset.lang;
  };

  setActiveButton(sourceButtons, sourceLang);
  setActiveButton(targetButtons, targetLang);
});

document.querySelector('#translate-btn').addEventListener('click', () => {
  const textToTranslate = sourceTextarea.value.trim();
  if (!textToTranslate) return;
  
  fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=${sourceLang}|${targetLang}`)
    .then(res => res.json())
    .then(data => {
      targetTextarea.value = data.responseData.translatedText;
    })
    .catch(err => console.error(err));
});




