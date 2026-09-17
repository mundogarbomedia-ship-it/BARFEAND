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
    : new URL('barfy-avatar-daxter.png', scriptBase).href;

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
      button { font: inherit; }

      .launcher {
        position: fixed;
        right: 22px;
        bottom: max(22px, calc(env(safe-area-inset-bottom) + 12px));
        z-index: 2147483000;
        display: flex;
        width: auto;
        min-width: 164px;
        height: 54px;
        align-items: center;
        gap: 9px;
        padding: 6px 17px 6px 7px;
        border: 2px solid #fff;
        border-radius: 999px;
        background: var(--barfy-pink);
        color: #fff;
        cursor: pointer;
        box-shadow: 0 12px 30px rgba(0, 0, 0, .3);
        transition: transform .18s ease, box-shadow .18s ease;
      }

      .launcher-avatar {
        position: relative;
        width: 40px;
        height: 40px;
        flex: 0 0 auto;
        overflow: hidden;
        border: 2px solid rgba(255, 255, 255, .9);
        border-radius: 999px;
        background: #fff;
      }
      .launcher-label { font-size: 13px; font-weight: 750; white-space: nowrap; }

      .launcher:hover { transform: translateY(-2px) scale(1.03); }
      .launcher:focus-visible,
      button:focus-visible,
      a:focus-visible { outline: 3px solid #ff8db1; outline-offset: 3px; }

      .launcher-avatar img,
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
        width: min(360px, calc(100vw - 32px));
        min-height: 350px;
        max-height: min(470px, calc(100vh - 135px));
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
        min-height: 60px;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 9px 13px;
        border-bottom: 1px solid rgba(255, 255, 255, .08);
      }

      .identity { display: flex; min-width: 0; align-items: center; gap: 10px; }
      .avatar {
        width: 38px;
        height: 38px;
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

      .header-actions { display: flex; align-items: center; gap: 9px; }
      .status-dot {
        width: 9px;
        height: 9px;
        border-radius: 999px;
        background: #70806d;
        box-shadow: 0 0 0 4px rgba(255, 255, 255, .04);
      }
      .status-dot.active { background: var(--barfy-pink); }
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
        gap: 12px;
        padding: 17px 15px 13px;
      }

      .orb {
        position: relative;
        width: 108px;
        height: 108px;
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
        min-height: 78px;
        max-height: 124px;
        overflow: auto;
        margin: 0;
        padding: 12px 13px;
        border-radius: 13px;
        background: rgba(0, 0, 0, .2);
        color: var(--barfy-text);
        font-size: 13.5px;
        line-height: 1.5;
        text-align: left;
      }
      .caption.user { color: #ff8db1; font-weight: 650; }
      .caption-final,
      .caption-interim { display: block; }
      .caption-interim { opacity: .72; font-style: italic; }

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

      .hint {
        min-height: 20px;
        padding: 0 14px 12px;
        color: #82907e;
        font-size: 10.5px;
        line-height: 1.35;
        text-align: center;
      }

      @media (max-width: 520px) {
        .launcher {
          right: 15px;
          bottom: max(15px, calc(env(safe-area-inset-bottom) + 8px));
          min-width: 152px;
          height: 50px;
        }
        .panel {
          right: 8px;
          bottom: max(78px, calc(env(safe-area-inset-bottom) + 70px));
          width: calc(100vw - 16px);
          min-height: 340px;
          max-height: calc(100dvh - 95px);
          transform-origin: center bottom;
        }
        .body { padding-top: 14px; }
        .orb { width: 102px; height: 102px; }
      }

      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after { animation: none !important; transition: none !important; }
      }
    </style>

    <button class="launcher" type="button" aria-label="Parlar amb Barfy" aria-expanded="false">
      <span class="launcher-avatar"><img src="${avatarUrl}" alt=""></span>
      <span class="launcher-label">Parla amb Barfy</span>
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
          <span class="status-dot" aria-hidden="true"></span>
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
        <p class="caption">
          <span class="caption-final" aria-live="polite"></span>
          <span class="caption-interim" aria-hidden="true"></span>
        </p>
        <div class="actions"></div>
      </div>

      <div class="hint"></div>
    </section>
  `;

  const $ = (selector) => shadow.querySelector(selector);
  const launcher = $('.launcher');
  const launcherLabel = $('.launcher-label');
  const panel = $('.panel');
  const closeButton = $('.close');
  const statusDot = $('.status-dot');
  const subtitle = $('.subtitle');
  const orb = $('.orb');
  const state = $('.state');
  const caption = $('.caption');
  const captionFinal = $('.caption-final');
  const captionInterim = $('.caption-interim');
  const actions = $('.actions');
  const hint = $('.hint');

  const copy = {
    ca: {
      close: 'Tancar',
      start: 'Parla amb Barfy',
      stop: 'Atura',
      subtitle: 'T’ajudo amb la dieta BARF i els productes',
      idle: 'Toca en Barfy per parlar',
      listening: 'T’escolto…',
      thinking: 'Estic pensant…',
      speaking: 'Barfy està parlant…',
      intro: 'Hola! Soc en Barfy, l’assistent de BARFEAND. En què puc ajudar la teva mascota avui?',
      languageReady: 'Perfecte, parlem en català. Si vols canviar, digues castellano. Què vols saber?',
      unheard: 'No t’he sentit bé. Toca en Barfy i torna-ho a provar.',
      permission: 'Necessito permís per utilitzar el micròfon. Activa’l al navegador i torna-ho a provar.',
      microphone: 'No trobo cap micròfon disponible.',
      voiceNetwork: 'El reconeixement de veu no està disponible ara mateix.',
      unsupported: 'Aquest navegador no permet la conversa per veu amb Barfy.',
      unavailable: 'Ara mateix no puc respondre. Torna-ho a provar d’aquí a uns segons.',
      empty: 'No he rebut cap resposta. Ho tornem a provar?',
      hint: 'Només veu · Digues «castellano» per canviar d’idioma',
      you: 'Tu',
      barfy: 'Barfy'
    },
    es: {
      close: 'Cerrar',
      start: 'Habla con Barfy',
      stop: 'Detener',
      subtitle: 'Te ayudo con la dieta BARF y los productos',
      idle: 'Toca a Barfy para hablar',
      listening: 'Te escucho…',
      thinking: 'Estoy pensando…',
      speaking: 'Barfy está hablando…',
      intro: '¡Hola! Soy Barfy. Puedes preguntarme sobre la dieta BARF, las recetas, las raciones o cómo comprar.',
      languageReady: 'Perfecto, hablamos en español. Si quieres cambiar, di català. ¿Qué quieres saber?',
      unheard: 'No te he oído bien. Toca a Barfy y vuelve a intentarlo.',
      permission: 'Necesito permiso para usar el micrófono. Actívalo en el navegador y vuelve a intentarlo.',
      microphone: 'No encuentro ningún micrófono disponible.',
      voiceNetwork: 'El reconocimiento de voz no está disponible ahora mismo.',
      unsupported: 'Este navegador no permite la conversación por voz con Barfy.',
      unavailable: 'Ahora mismo no puedo responder. Inténtalo de nuevo en unos segundos.',
      empty: 'No he recibido ninguna respuesta. ¿Lo intentamos otra vez?',
      hint: 'Solo voz · Di «català» para cambiar de idioma',
      you: 'Tú',
      barfy: 'Barfy'
    }
  };

  const languagePrompt = 'Per començar, digues català o castellano. Para empezar, di català o español.';
  const languageRetry = 'No t’he entès. Digues només català o castellano. No te he entendido. Di solo català o español.';
  const detectedPageLanguage = (document.documentElement.lang || '').toLowerCase();

  // Barfy always welcomes visitors in Catalan. The API detects the language
  // of every answer and returns it so the next turn uses the matching voice.
  let language = 'ca';
  let languageChosen = true;
  let selectingLanguage = false;
  let history = [];
  let recognizer = null;
  let isListening = false;
  let recognitionHandled = false;
  let voiceSessionActive = false;
  let requestPending = false;
  let activeController = null;
  let speechController = null;
  let audioContext = null;
  let activeAudioSource = null;
  let activeHtmlAudio = null;
  let activeAudioUrl = '';
  let sessionVersion = 0;
  let speechVersion = 0;

  function text() {
    return copy[language];
  }

  function setCaption(value, speaker = 'barfy') {
    const isUser = speaker === 'user';
    const prefix = isUser ? text().you : text().barfy;
    caption.classList.toggle('user', isUser);
    captionFinal.textContent = `${prefix}: ${value}`;
    captionInterim.textContent = '';
  }

  function setInterimCaption(value) {
    caption.classList.add('user');
    captionFinal.textContent = '';
    captionInterim.textContent = value ? `${text().you}: ${value}` : '';
  }

  function setLauncherActive(active) {
    statusDot.classList.toggle('active', active);
    launcherLabel.textContent = active ? text().stop : text().start;
    launcher.setAttribute('aria-label', active ? text().stop : text().start);
  }

  function syncControls() {
    orb.disabled = !recognizer || requestPending;
  }

  function applyLanguage() {
    const t = text();
    closeButton.setAttribute('aria-label', t.close);
    orb.setAttribute('aria-label', language === 'ca' ? 'Parlar amb Barfy' : 'Hablar con Barfy');
    subtitle.textContent = languageChosen ? t.subtitle : 'Assistent de veu · Asistente de voz';
    hint.textContent = languageChosen ? t.hint : 'Tria l’idioma parlant · Elige el idioma hablando';
    setLauncherActive(voiceSessionActive);
    if (!requestPending && !orb.classList.contains('listening') && !orb.classList.contains('speaking')) {
      state.textContent = languageChosen ? t.idle : 'Toca per començar · Toca para empezar';
    }
    if (!captionFinal.textContent && !captionInterim.textContent) {
      setCaption(languageChosen ? t.intro : languagePrompt);
    }
    if (recognizer) recognizer.lang = language === 'ca' ? 'ca-ES' : 'es-ES';
    syncControls();
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

  function stopRecognition(useAbort = true) {
    if (!recognizer) return;
    try {
      if (useAbort) recognizer.abort();
      else recognizer.stop();
    } catch (_) {
      /* Recognition was already stopped. */
    }
  }

  function ensureAudioContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    try {
      if (!audioContext) audioContext = new AudioContextClass();
      if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
      return audioContext;
    } catch (_) {
      return null;
    }
  }

  function clearSpeechPlayback() {
    if (speechController) {
      speechController.abort();
      speechController = null;
    }
    if (activeAudioSource) {
      try {
        activeAudioSource.onended = null;
        activeAudioSource.stop();
      } catch (_) {
        /* Audio was already stopped. */
      }
      activeAudioSource.disconnect();
      activeAudioSource = null;
    }
    if (activeHtmlAudio) {
      activeHtmlAudio.onended = null;
      activeHtmlAudio.onerror = null;
      activeHtmlAudio.pause();
      activeHtmlAudio.removeAttribute('src');
      activeHtmlAudio = null;
    }
    if (activeAudioUrl) {
      URL.revokeObjectURL(activeAudioUrl);
      activeAudioUrl = '';
    }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }

  function cancelSpeech() {
    speechVersion += 1;
    clearSpeechPlayback();
  }

  function stopConversation() {
    sessionVersion += 1;
    voiceSessionActive = false;
    selectingLanguage = false;
    recognitionHandled = true;
    isListening = false;
    if (activeController) {
      activeController.abort();
      activeController = null;
    }
    requestPending = false;
    stopRecognition(true);
    cancelSpeech();
    setMode('idle');
    setLauncherActive(false);
    syncControls();
  }

  function closePanel() {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    launcher.setAttribute('aria-expanded', 'false');
    stopConversation();
    launcher.focus();
  }

  function speakWithBrowser(value, forcedLanguage, finish) {
    if (!('speechSynthesis' in window)) {
      finish();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(value);
    utterance.lang = forcedLanguage || (language === 'ca' ? 'ca-ES' : 'es-ES');
    utterance.pitch = 1.24;
    utterance.rate = 1.04;

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((item) => item.lang?.toLowerCase().startsWith(utterance.lang.slice(0, 2)));
    if (voice) utterance.voice = voice;

    utterance.onend = finish;
    utterance.onerror = finish;
    window.speechSynthesis.speak(utterance);
  }

  async function speak(value, onEnd, forcedLanguage) {
    stopRecognition(true);
    isListening = false;

    const currentSpeech = speechVersion + 1;
    speechVersion = currentSpeech;
    clearSpeechPlayback();
    const speechLanguage = forcedLanguage
      ? (forcedLanguage.toLowerCase().startsWith('es') ? 'es' : 'ca')
      : language;
    const controller = new AbortController();
    speechController = controller;
    const timeout = window.setTimeout(() => controller.abort(), 35000);
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(timeout);
      if (speechController === controller) speechController = null;
      if (activeHtmlAudio) activeHtmlAudio = null;
      if (activeAudioUrl) {
        URL.revokeObjectURL(activeAudioUrl);
        activeAudioUrl = '';
      }
      if (currentSpeech === speechVersion) onEnd?.();
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify({
          mode: 'speech',
          text: String(value).slice(0, 600),
          language: speechLanguage
        }),
        signal: controller.signal
      });

      if (!response.ok) throw new Error(`TTS HTTP ${response.status}`);
      const audioData = await response.arrayBuffer();
      window.clearTimeout(timeout);
      if (!audioData.byteLength || currentSpeech !== speechVersion) return;

      const context = ensureAudioContext();
      if (context) {
        await context.resume();
        const audioBuffer = await context.decodeAudioData(audioData.slice(0));
        if (controller.signal.aborted || currentSpeech !== speechVersion) return;
        const source = context.createBufferSource();
        activeAudioSource = source;
        source.buffer = audioBuffer;
        source.connect(context.destination);
        source.onended = () => {
          if (activeAudioSource === source) activeAudioSource = null;
          source.disconnect();
          finish();
        };
        source.start(0);
        return;
      }

      const blob = new Blob([audioData], { type: 'audio/wav' });
      activeAudioUrl = URL.createObjectURL(blob);
      const audio = new Audio(activeAudioUrl);
      activeHtmlAudio = audio;
      audio.onended = finish;
      audio.onerror = finish;
      await audio.play();
    } catch (error) {
      window.clearTimeout(timeout);
      if (currentSpeech !== speechVersion) return;
      console.warn('Barfy TTS:', error);
      speakWithBrowser(value, forcedLanguage, finish);
    }
  }

  function startListening(forLanguageChoice = false) {
    if (!recognizer || requestPending || isListening || !voiceSessionActive) return;
    selectingLanguage = forLanguageChoice;
    recognitionHandled = false;
    recognizer.lang = forLanguageChoice
      ? (detectedPageLanguage.startsWith('es') ? 'es-ES' : 'ca-ES')
      : (language === 'ca' ? 'ca-ES' : 'es-ES');
    setLauncherActive(true);
    setMode('listening');
    isListening = true;
    try {
      recognizer.start();
    } catch (_) {
      isListening = false;
      setMode('idle');
    }
  }

  function normalizeSpeech(value) {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z ]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function languageFromSpeech(value, requireCommand = false) {
    const normalized = normalizeSpeech(value);
    const catalan = /\b(catala|catalan)\b/.test(normalized);
    const spanish = /\b(espanol|espanyol|castellano|castella)\b/.test(normalized);
    if (catalan === spanish) return null;

    if (requireCommand) {
      const exactChoice = /^(?:en )?(?:catala|catalan|espanol|espanyol|castellano|castella)(?: por favor| si us plau)?$/.test(normalized);
      const changeCommand = /\b(cambia|cambiar|canvia|canviar|idioma|parla|parlar|habla|hablar)\b/.test(normalized);
      if (!exactChoice && !changeCommand) return null;
    }

    return catalan ? 'ca' : 'es';
  }

  function confirmLanguage(nextLanguage) {
    stopRecognition(false);
    language = nextLanguage;
    languageChosen = true;
    selectingLanguage = false;
    voiceSessionActive = true;
    applyLanguage();
    const reply = text().languageReady;
    setCaption(reply);
    setMode('speaking');
    const currentSession = sessionVersion;
    speak(reply, () => {
      if (currentSession === sessionVersion && voiceSessionActive) startListening(false);
    });
  }

  function askForLanguage(retry = false) {
    openPanel();
    voiceSessionActive = true;
    selectingLanguage = true;
    setLauncherActive(true);
    const prompt = retry ? languageRetry : languagePrompt;
    setCaption(prompt);
    setMode('speaking');
    const currentSession = sessionVersion;
    speak(prompt, () => {
      if (currentSession === sessionVersion && voiceSessionActive) startListening(true);
    }, detectedPageLanguage.startsWith('es') ? 'es-ES' : 'ca-ES');
  }

  function startOrResumeConversation() {
    ensureAudioContext();
    openPanel();
    if (!recognizer) {
      setCaption(text().unsupported);
      return;
    }
    if (!languageChosen) {
      askForLanguage(false);
      return;
    }

    voiceSessionActive = true;
    setLauncherActive(true);
    if (!history.length) {
      setCaption(text().intro);
      setMode('speaking');
      const currentSession = sessionVersion;
      speak(text().intro, () => {
        if (currentSession === sessionVersion && voiceSessionActive) startListening(false);
      });
      return;
    }
    startListening(false);
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

  async function processTurn(message) {
    const cleanMessage = message.trim().slice(0, 800);
    if (!cleanMessage || requestPending) return;

    requestPending = true;
    syncControls();
    renderActions([]);
    const previousHistory = history.slice(-8);
    history.push({ role: 'user', content: cleanMessage });
    history = history.slice(-8);
    setCaption(cleanMessage, 'user');
    setMode('thinking');

    const controller = new AbortController();
    const currentSession = sessionVersion;
    activeController = controller;
    const timeout = window.setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify({
          message: cleanMessage,
          history: previousHistory,
          language,
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
      if (controller.signal.aborted || currentSession !== sessionVersion) return;

      if (result.language === 'ca' || result.language === 'es') {
        language = result.language;
        languageChosen = true;
        applyLanguage();
      }

      const reply = typeof result.reply === 'string' && result.reply.trim()
        ? result.reply.trim()
        : text().empty;

      history.push({ role: 'assistant', content: reply });
      history = history.slice(-8);
      setCaption(reply);
      renderActions(result.actions);
      setMode('speaking');
      speak(reply, () => {
        if (
          currentSession === sessionVersion
          && voiceSessionActive
          && panel.classList.contains('open')
        ) {
          startListening(false);
        } else {
          setMode('idle');
        }
      });
    } catch (error) {
      if (controller.signal.aborted || currentSession !== sessionVersion || error?.name === 'AbortError') return;
      const reply = text().unavailable;
      setCaption(reply);
      setMode('speaking');
      speak(reply, () => {
        voiceSessionActive = false;
        setLauncherActive(false);
        setMode('idle');
      });
      console.warn('Barfy:', error);
    } finally {
      window.clearTimeout(timeout);
      if (activeController === controller) {
        activeController = null;
        requestPending = false;
        syncControls();
      }
    }
  }

  launcher.addEventListener('click', () => {
    if (voiceSessionActive || requestPending) {
      stopConversation();
      return;
    }
    startOrResumeConversation();
  });
  closeButton.addEventListener('click', closePanel);

  orb.addEventListener('click', () => {
    if (!recognizer || requestPending) return;
    if (voiceSessionActive) {
      stopConversation();
      return;
    }
    startOrResumeConversation();
  });

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognizer = new SpeechRecognition();
    recognizer.interimResults = true;
    recognizer.continuous = false;
    recognizer.maxAlternatives = 1;
    recognizer.onstart = () => {
      isListening = true;
      setMode('listening');
    };
    recognizer.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const transcript = event.results[index]?.[0]?.transcript || '';
        if (event.results[index].isFinal) finalTranscript += transcript;
        else interimTranscript += transcript;
      }

      if (interimTranscript && !finalTranscript) setInterimCaption(interimTranscript.trim());
      finalTranscript = finalTranscript.trim();
      if (!finalTranscript || recognitionHandled) return;

      recognitionHandled = true;
      stopRecognition(false);
      setCaption(finalTranscript, 'user');

      if (selectingLanguage) {
        const chosenLanguage = languageFromSpeech(finalTranscript, false);
        if (chosenLanguage) confirmLanguage(chosenLanguage);
        else askForLanguage(true);
        return;
      }

      const requestedLanguage = languageFromSpeech(finalTranscript, true);
      if (requestedLanguage) {
        confirmLanguage(requestedLanguage);
        return;
      }

      processTurn(finalTranscript);
    };
    recognizer.onerror = (event) => {
      isListening = false;
      if (event.error === 'aborted') return;

      const errorMessage = event.error === 'not-allowed' || event.error === 'service-not-allowed'
        ? text().permission
        : event.error === 'audio-capture'
          ? text().microphone
          : event.error === 'network'
            ? text().voiceNetwork
            : text().unheard;

      voiceSessionActive = false;
      selectingLanguage = false;
      setLauncherActive(false);
      setCaption(errorMessage);
      setMode('speaking');
      speak(errorMessage, () => setMode('idle'));
    };
    recognizer.onend = () => {
      isListening = false;
      if (orb.classList.contains('listening')) setMode('idle');
    };
  } else {
    hint.textContent = text().unsupported;
    setCaption(text().unsupported);
  }

  applyLanguage();
})();
