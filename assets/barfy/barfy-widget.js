(() => {
  'use strict';

  if (document.getElementById('barfy-assistant-host')) return;

  const script = document.currentScript;
  const scriptBase = script?.src
    ? new URL('.', script.src)
    : new URL('./', document.baseURI);
  const apiUrl = script?.dataset.api || 'https://api.barfeand.com/asistente-v2.php';
  const avatarUrl = script?.dataset.avatar
    ? new URL(script.dataset.avatar, document.baseURI).href
    : new URL('barfy-avatar.png', scriptBase).href;

  const host = document.createElement('div');
  host.id = 'barfy-assistant-host';
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });
  shadow.innerHTML = `
    <style>
      :host {
        --barfy-pink: #d2265f;
        --barfy-pink-dark: #981d49;
        --barfy-green: #1f2e22;
        --barfy-panel: #152018;
        --barfy-text: #fffaf2;
        --barfy-muted: #b8c4b3;
        color-scheme: dark;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      *, *::before, *::after { box-sizing: border-box; }
      button, input, select { font: inherit; }

      .launcher {
        position: fixed;
        right: 22px;
        bottom: 22px;
        z-index: 2147483000;
        width: 72px;
        height: 72px;
        padding: 3px;
        overflow: hidden;
        border: 3px solid #fff;
        border-radius: 999px;
        background: var(--barfy-pink);
        cursor: pointer;
        box-shadow: 0 12px 30px rgba(0, 0, 0, .3);
        transition: transform .18s ease, box-shadow .18s ease;
      }

      .launcher:hover { transform: translateY(-2px) scale(1.03); }
      .launcher:focus-visible,
      button:focus-visible,
      input:focus-visible,
      select:focus-visible,
      a:focus-visible { outline: 3px solid #ff8db1; outline-offset: 3px; }

      .launcher img,
      .avatar img,
      .orb img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .panel {
        position: fixed;
        right: 22px;
        bottom: 108px;
        z-index: 2147483000;
        display: flex;
        width: min(380px, calc(100vw - 32px));
        height: min(570px, calc(100vh - 140px));
        flex-direction: column;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, .09);
        border-radius: 22px;
        background: var(--barfy-panel);
        color: var(--barfy-text);
        box-shadow: 0 22px 65px rgba(0, 0, 0, .42);
        opacity: 0;
        pointer-events: none;
        transform: translateY(14px) scale(.98);
        transform-origin: right bottom;
        transition: opacity .18s ease, transform .18s ease;
      }

      .panel.open {
        opacity: 1;
        pointer-events: auto;
        transform: translateY(0) scale(1);
      }

      .header {
        display: flex;
        min-height: 70px;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 12px 14px;
        border-bottom: 1px solid rgba(255, 255, 255, .08);
      }

      .identity { display: flex; min-width: 0; align-items: center; gap: 10px; }
      .avatar {
        width: 43px;
        height: 43px;
        flex: 0 0 auto;
        overflow: hidden;
        border: 2px solid var(--barfy-pink);
        border-radius: 999px;
        background: #fff;
      }
      .identity-text { min-width: 0; }
      .identity strong { display: block; font-size: 16px; line-height: 1.15; }
      .identity span {
        display: block;
        overflow: hidden;
        color: var(--barfy-muted);
        font-size: 11.5px;
        line-height: 1.35;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .header-actions { display: flex; align-items: center; gap: 7px; }
      .language {
        max-width: 86px;
        height: 32px;
        border: 1px solid rgba(255, 255, 255, .16);
        border-radius: 10px;
        background: #203026;
        color: var(--barfy-text);
        font-size: 11px;
        cursor: pointer;
      }
      .close {
        width: 32px;
        height: 32px;
        border: 0;
        border-radius: 10px;
        background: transparent;
        color: var(--barfy-muted);
        font-size: 20px;
        cursor: pointer;
      }
      .close:hover { background: rgba(255, 255, 255, .08); color: #fff; }

      .body {
        display: flex;
        min-height: 0;
        flex: 1;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 13px;
        padding: 18px 20px 14px;
      }

      .orb {
        position: relative;
        width: 124px;
        height: 124px;
        flex: 0 0 auto;
        padding: 5px;
        overflow: hidden;
        border: 4px solid var(--barfy-pink);
        border-radius: 999px;
        background: #fff;
        cursor: pointer;
        box-shadow: 0 0 0 0 rgba(210, 38, 95, .48);
        transition: opacity .15s ease, transform .15s ease;
      }
      .orb:active { transform: scale(.97); }
      .orb[disabled] { cursor: not-allowed; opacity: .5; }
      .orb.listening { animation: listen 1.4s ease-out infinite; }
      .orb.speaking { animation: speak .75s ease-in-out infinite; }
      .orb.thinking { opacity: .68; }

      .mic-badge {
        position: absolute;
        right: 3px;
        bottom: 3px;
        display: grid;
        width: 34px;
        height: 34px;
        place-items: center;
        border: 2px solid #fff;
        border-radius: 999px;
        background: var(--barfy-pink);
        color: #fff;
      }
      .mic-badge svg { width: 17px; height: 17px; fill: currentColor; }

      @keyframes listen {
        from { box-shadow: 0 0 0 0 rgba(210, 38, 95, .52); }
        to { box-shadow: 0 0 0 25px rgba(210, 38, 95, 0); }
      }
      @keyframes speak {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.045); }
      }

      .state {
        min-height: 18px;
        color: var(--barfy-muted);
        font-size: 12.5px;
        text-align: center;
      }
      .caption {
        width: 100%;
        min-height: 68px;
        max-height: 116px;
        overflow: auto;
        margin: 0;
        color: var(--barfy-text);
        font-size: 14.5px;
        line-height: 1.5;
        text-align: center;
      }
      .caption.user { color: #ff8db1; font-weight: 650; }

      .actions {
        display: flex;
        width: 100%;
        min-height: 38px;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
      }
      .action {
        display: inline-flex;
        min-height: 36px;
        align-items: center;
        justify-content: center;
        padding: 8px 13px;
        border: 1px solid var(--barfy-pink);
        border-radius: 999px;
        background: var(--barfy-pink);
        color: #fff;
        font-size: 12px;
        font-weight: 750;
        line-height: 1.2;
        text-decoration: none;
      }
      .action.secondary { background: transparent; }

      .end {
        border: 0;
        background: transparent;
        color: var(--barfy-muted);
        font-size: 11.5px;
        cursor: pointer;
        text-decoration: underline;
        text-underline-offset: 3px;
      }

      .composer {
        display: flex;
        gap: 8px;
        padding: 12px;
        border-top: 1px solid rgba(255, 255, 255, .08);
        background: rgba(0, 0, 0, .12);
      }
      .composer input {
        min-width: 0;
        height: 42px;
        flex: 1;
        padding: 0 13px;
        border: 1px solid rgba(255, 255, 255, .16);
        border-radius: 12px;
        background: #203026;
        color: #fff;
        font-size: 13px;
      }
      .composer input::placeholder { color: #91a08c; }
      .composer button {
        width: 44px;
        height: 42px;
        border: 0;
        border-radius: 12px;
        background: var(--barfy-pink);
        color: #fff;
        font-size: 20px;
        cursor: pointer;
      }
      .composer button[disabled] { cursor: wait; opacity: .55; }
      .hint {
        min-height: 25px;
        padding: 0 14px 10px;
        color: #82907e;
        font-size: 10.5px;
        line-height: 1.35;
        text-align: center;
      }

      @media (max-width: 520px) {
        .launcher { right: 15px; bottom: 15px; width: 66px; height: 66px; }
        .panel {
          right: 8px;
          bottom: 91px;
          width: calc(100vw - 16px);
          height: min(620px, calc(100dvh - 108px));
          max-height: none;
          transform-origin: center bottom;
        }
        .body { padding-top: 14px; }
        .orb { width: 112px; height: 112px; }
      }

      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after { animation: none !important; transition: none !important; }
      }
    </style>

    <button class="launcher" type="button" aria-label="Obrir Barfy" aria-expanded="false">
      <img src="${avatarUrl}" alt="">
    </button>

    <section class="panel" role="dialog" aria-modal="false" aria-label="Barfy" aria-hidden="true">
      <header class="header">
        <div class="identity">
          <div class="avatar"><img src="${avatarUrl}" alt=""></div>
          <div class="identity-text">
            <strong>Barfy</strong>
            <span class="subtitle"></span>
          </div>
        </div>
        <div class="header-actions">
          <select class="language" aria-label="Idioma">
            <option value="ca">Català</option>
            <option value="es">Español</option>
          </select>
          <button class="close" type="button" aria-label="Tancar">×</button>
        </div>
      </header>

      <div class="body">
        <button class="orb" type="button" aria-label="Parlar amb Barfy">
          <img src="${avatarUrl}" alt="">
          <span class="mic-badge" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M12 15a3 3 0 0 0 3-3V5a3 3 0 1 0-6 0v7a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V22h2v-3.08A7 7 0 0 0 19 12h-2Z"/></svg>
          </span>
        </button>
        <div class="state" aria-live="polite"></div>
        <p class="caption" aria-live="polite"></p>
        <div class="actions"></div>
        <button class="end" type="button"></button>
      </div>

      <form class="composer">
        <input type="text" maxlength="800" autocomplete="off">
        <button type="submit" aria-label="Enviar">➜</button>
      </form>
      <div class="hint"></div>
    </section>
  `;

  const $ = (selector) => shadow.querySelector(selector);
  const launcher = $('.launcher');
  const panel = $('.panel');
  const closeButton = $('.close');
  const languageSelect = $('.language');
  const subtitle = $('.subtitle');
  const orb = $('.orb');
  const state = $('.state');
  const caption = $('.caption');
  const actions = $('.actions');
  const endButton = $('.end');
  const form = $('.composer');
  const input = $('.composer input');
  const sendButton = $('.composer button');
  const hint = $('.hint');

  const copy = {
    ca: {
      open: 'Obrir Barfy',
      close: 'Tancar',
      subtitle: 'T’ajudo amb la dieta BARF i els productes',
      idle: 'Toca la imatge per parlar',
      listening: 'T’escolto…',
      thinking: 'Estic pensant…',
      speaking: 'Barfy està parlant…',
      intro: 'Hola! Soc Barfy. Em pots preguntar sobre la dieta BARF, les receptes, les racions o com comprar.',
      placeholder: 'Escriu la teva pregunta…',
      end: 'Finalitzar conversa',
      unheard: 'No t’he sentit bé. Toca la imatge i torna-ho a provar.',
      unsupported: 'El teu navegador no permet parlar amb Barfy. Pots escriure la pregunta.',
      unavailable: 'Ara mateix no puc respondre. Torna-ho a provar d’aquí a uns segons.',
      empty: 'No he rebut cap resposta. Ho tornem a provar?'
    },
    es: {
      open: 'Abrir Barfy',
      close: 'Cerrar',
      subtitle: 'Te ayudo con la dieta BARF y los productos',
      idle: 'Toca la imagen para hablar',
      listening: 'Te escucho…',
      thinking: 'Estoy pensando…',
      speaking: 'Barfy está hablando…',
      intro: '¡Hola! Soy Barfy. Puedes preguntarme sobre la dieta BARF, las recetas, las raciones o cómo comprar.',
      placeholder: 'Escribe tu pregunta…',
      end: 'Terminar conversación',
      unheard: 'No te he oído bien. Toca la imagen y vuelve a intentarlo.',
      unsupported: 'Tu navegador no permite hablar con Barfy. Puedes escribir la pregunta.',
      unavailable: 'Ahora mismo no puedo responder. Inténtalo de nuevo en unos segundos.',
      empty: 'No he recibido ninguna respuesta. ¿Lo intentamos otra vez?'
    }
  };

  const detectedPageLanguage = (document.documentElement.lang || '').toLowerCase();
  let language = detectedPageLanguage.startsWith('es') ? 'es' : 'ca';
  let history = [];
  let recognizer = null;
  let voiceSessionActive = false;
  let requestPending = false;

  languageSelect.value = language;

  function text() {
    return copy[language];
  }

  function applyLanguage() {
    const t = text();
    launcher.setAttribute('aria-label', t.open);
    closeButton.setAttribute('aria-label', t.close);
    orb.setAttribute('aria-label', language === 'ca' ? 'Parlar amb Barfy' : 'Hablar con Barfy');
    subtitle.textContent = t.subtitle;
    input.placeholder = t.placeholder;
    endButton.textContent = t.end;
    if (!requestPending && !orb.classList.contains('listening') && !orb.classList.contains('speaking')) {
      state.textContent = t.idle;
    }
    if (!history.length) caption.textContent = t.intro;
    if (recognizer) recognizer.lang = language === 'ca' ? 'ca-ES' : 'es-ES';
  }

  function setMode(mode) {
    orb.classList.remove('listening', 'thinking', 'speaking');
    if (mode !== 'idle') orb.classList.add(mode);
    const labels = {
      idle: text().idle,
      listening: text().listening,
      thinking: text().thinking,
      speaking: text().speaking
    };
    state.textContent = labels[mode] || labels.idle;
  }

  function openPanel() {
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    launcher.setAttribute('aria-expanded', 'true');
  }

  function closePanel() {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    launcher.setAttribute('aria-expanded', 'false');
    stopConversation();
    launcher.focus();
  }

  function stopConversation() {
    voiceSessionActive = false;
    if (recognizer) {
      try { recognizer.stop(); } catch (_) { /* already stopped */ }
    }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setMode('idle');
  }

  function guessSpeechLanguage(value) {
    const sample = ` ${value.toLowerCase()} `;
    const catalanHints = [' que ', ' amb ', ' per ', ' els ', ' les ', ' una ', ' ració', ' productes', ' gràcies', ' aquí', ' també'];
    const catalanScore = catalanHints.filter((word) => sample.includes(word)).length;
    return catalanScore >= 2 ? 'ca-ES' : (language === 'ca' ? 'ca-ES' : 'es-ES');
  }

  function speak(value, onEnd) {
    if (!('speechSynthesis' in window)) {
      onEnd?.();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(value);
    utterance.lang = guessSpeechLanguage(value);
    utterance.pitch = 1.2;
    utterance.rate = 1.03;

    const voices = window.speechSynthesis.getVoices();
    const exactVoice = voices.find((voice) => voice.lang?.toLowerCase().startsWith(utterance.lang.slice(0, 2)));
    if (exactVoice) utterance.voice = exactVoice;

    utterance.onend = () => onEnd?.();
    utterance.onerror = () => onEnd?.();
    window.speechSynthesis.speak(utterance);
  }

  function startListening() {
    if (!recognizer || requestPending) return;
    voiceSessionActive = true;
    recognizer.lang = language === 'ca' ? 'ca-ES' : 'es-ES';
    try { recognizer.start(); } catch (_) { /* already listening */ }
  }

  function safeAction(action) {
    if (!action || typeof action.label !== 'string' || typeof action.url !== 'string') return null;
    try {
      const url = new URL(action.url);
      const allowedHosts = ['barfeand.com', 'www.barfeand.com', 'elrebostdelnord.com', 'www.elrebostdelnord.com', 'wa.me'];
      if (url.protocol !== 'https:' || !allowedHosts.includes(url.hostname)) return null;
      return { label: action.label.slice(0, 80), url: url.href, type: action.type || 'navigate' };
    } catch (_) {
      return null;
    }
  }

  function renderActions(items) {
    actions.replaceChildren();
    (Array.isArray(items) ? items : [])
      .map(safeAction)
      .filter(Boolean)
      .slice(0, 2)
      .forEach((action, index) => {
        const link = document.createElement('a');
        link.className = `action${index ? ' secondary' : ''}`;
        link.href = action.url;
        link.textContent = action.label;
        if (action.type !== 'navigate' || new URL(action.url).hostname !== location.hostname) {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }
        actions.appendChild(link);
      });
  }

  async function processTurn(message, speakReply = true) {
    const cleanMessage = message.trim().slice(0, 800);
    if (!cleanMessage || requestPending) return;

    requestPending = true;
    sendButton.disabled = true;
    input.disabled = true;
    renderActions([]);
    history.push({ role: 'user', content: cleanMessage });
    history = history.slice(-8);
    caption.textContent = cleanMessage;
    caption.className = 'caption user';
    setMode('thinking');

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify({
          message: cleanMessage,
          history,
          page: {
            path: location.pathname,
            hash: location.hash,
            title: document.title
          }
        }),
        signal: controller.signal
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || `HTTP ${response.status}`);

      const reply = typeof result.reply === 'string' && result.reply.trim()
        ? result.reply.trim()
        : text().empty;

      history.push({ role: 'assistant', content: reply });
      history = history.slice(-8);
      caption.textContent = reply;
      caption.className = 'caption';
      renderActions(result.actions);

      if (speakReply) {
        setMode('speaking');
        speak(reply, () => {
          if (voiceSessionActive && panel.classList.contains('open')) startListening();
          else setMode('idle');
        });
      } else {
        setMode('idle');
      }
    } catch (error) {
      const reply = text().unavailable;
      caption.textContent = reply;
      caption.className = 'caption';
      setMode('idle');
      console.warn('Barfy:', error);
    } finally {
      window.clearTimeout(timeout);
      requestPending = false;
      sendButton.disabled = false;
      input.disabled = false;
      if (!voiceSessionActive) input.focus();
    }
  }

  launcher.addEventListener('click', openPanel);
  closeButton.addEventListener('click', closePanel);
  endButton.addEventListener('click', stopConversation);
  languageSelect.addEventListener('change', () => {
    language = languageSelect.value === 'es' ? 'es' : 'ca';
    stopConversation();
    applyLanguage();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = input.value;
    input.value = '';
    voiceSessionActive = false;
    processTurn(value, true);
  });

  orb.addEventListener('click', () => {
    if (!recognizer || requestPending) return;
    if (!voiceSessionActive && !history.length) {
      voiceSessionActive = true;
      caption.textContent = text().intro;
      caption.className = 'caption';
      setMode('speaking');
      speak(text().intro, startListening);
      return;
    }
    startListening();
  });

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognizer = new SpeechRecognition();
    recognizer.interimResults = false;
    recognizer.continuous = false;
    recognizer.maxAlternatives = 1;
    recognizer.onstart = () => setMode('listening');
    recognizer.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      processTurn(transcript, true);
    };
    recognizer.onerror = (event) => {
      if (event.error === 'aborted' || event.error === 'no-speech') {
        setMode('idle');
        return;
      }
      voiceSessionActive = false;
      caption.textContent = text().unheard;
      caption.className = 'caption';
      setMode('idle');
    };
  } else {
    orb.disabled = true;
    hint.textContent = text().unsupported;
  }

  applyLanguage();
})();
