(function () {
  var STORAGE_KEY = 'anotando_docs_lang';

  function resolveInitialLang() {
    try {
      var params = new URLSearchParams(window.location.search);
      var queryLang = params.get('lang');
      if (queryLang === 'en' || queryLang === 'pt-BR') {
        return queryLang;
      }
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'pt-BR') {
        return saved;
      }
    } catch (e) {
      // Ignore storage access errors
    }
    return 'pt-BR';
  }

  function applyLanguage(lang) {
    var isEn = lang === 'en';
    document.documentElement.lang = isEn ? 'en' : 'pt-BR';

    var body = document.body;
    if (body) {
      var title = isEn ? body.getAttribute('data-title-en') : body.getAttribute('data-title-pt');
      if (title) {
        document.title = title;
      }
    }

    var textNodes = document.querySelectorAll('[data-pt][data-en]');
    for (var i = 0; i < textNodes.length; i++) {
      var el = textNodes[i];
      el.textContent = isEn ? el.getAttribute('data-en') : el.getAttribute('data-pt');
    }

    var htmlNodes = document.querySelectorAll('[data-pt-html][data-en-html]');
    for (var j = 0; j < htmlNodes.length; j++) {
      var hel = htmlNodes[j];
      hel.innerHTML = isEn ? hel.getAttribute('data-en-html') : hel.getAttribute('data-pt-html');
    }

    var altNodes = document.querySelectorAll('[data-alt-pt][data-alt-en]');
    for (var k = 0; k < altNodes.length; k++) {
      var ael = altNodes[k];
      ael.setAttribute('alt', isEn ? ael.getAttribute('data-alt-en') : ael.getAttribute('data-alt-pt'));
    }

    var buttons = document.querySelectorAll('[data-lang-btn]');
    for (var b = 0; b < buttons.length; b++) {
      var btn = buttons[b];
      var active = btn.getAttribute('data-lang-btn') === lang;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    }

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      // Ignore storage errors
    }

    window.__anotandoLang = lang;
    document.dispatchEvent(new CustomEvent('anotando:langchange', { detail: { lang: lang } }));
  }

  window.anotandoGetLang = function () {
    return window.__anotandoLang || 'pt-BR';
  };

  window.anotandoSetLang = applyLanguage;

  document.addEventListener('DOMContentLoaded', function () {
    var buttons = document.querySelectorAll('[data-lang-btn]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function () {
        var target = this.getAttribute('data-lang-btn');
        if (target) {
          applyLanguage(target);
        }
      });
    }
    applyLanguage(resolveInitialLang());
  });
})();
