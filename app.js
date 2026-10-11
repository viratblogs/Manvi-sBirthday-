/* ============================================================
   Manvi's Magical October Birthday — app logic
   Vanilla JS. No backend. No external assets required.
   ============================================================ */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSmall = window.matchMedia('(max-width: 560px)').matches;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ---------------------------------------------------------
     1. PANDA CHARACTER (single reusable SVG, expressions via state)
     --------------------------------------------------------- */
  const PANDA_SVG = `
  <svg class="panda-svg" viewBox="0 0 220 214" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse class="panda-shadow" cx="110" cy="200" rx="66" ry="11"/>
    <ellipse class="panda-foot" cx="74" cy="184" rx="24" ry="15"/>
    <ellipse class="panda-foot" cx="146" cy="184" rx="24" ry="15"/>
    <ellipse class="panda-body" cx="110" cy="150" rx="56" ry="48"/>
    <ellipse class="panda-arm panda-arm--left" cx="54" cy="150" rx="18" ry="27" transform="rotate(20 54 150)"/>
    <ellipse class="panda-arm panda-arm--right" cx="166" cy="150" rx="18" ry="27" transform="rotate(-20 166 150)"/>
    <circle class="panda-ear" cx="58" cy="52" r="27"/>
    <circle class="panda-ear" cx="162" cy="52" r="27"/>
    <circle class="panda-ear-in" cx="58" cy="52" r="13"/>
    <circle class="panda-ear-in" cx="162" cy="52" r="13"/>
    <ellipse class="panda-head" cx="110" cy="102" rx="74" ry="66"/>
    <ellipse class="panda-patch" cx="80" cy="98" rx="23" ry="27" transform="rotate(-14 80 98)"/>
    <ellipse class="panda-patch" cx="140" cy="98" rx="23" ry="27" transform="rotate(14 140 98)"/>
    <g class="panda-eye-open">
      <circle class="panda-eye-white" cx="82" cy="100" r="9"/>
      <circle class="panda-pupil" cx="82" cy="101" r="5"/>
      <circle class="panda-glint" cx="79" cy="97" r="2"/>
      <circle class="panda-eye-white" cx="138" cy="100" r="9"/>
      <circle class="panda-pupil" cx="138" cy="101" r="5"/>
      <circle class="panda-glint" cx="135" cy="97" r="2"/>
    </g>
    <g class="panda-eye-closed">
      <path d="M71 101 q9 9 18 0"/>
      <path d="M129 101 q9 9 18 0"/>
    </g>
    <ellipse class="panda-blush" cx="62" cy="120" rx="12" ry="8"/>
    <ellipse class="panda-blush" cx="158" cy="120" rx="12" ry="8"/>
    <ellipse class="panda-nose" cx="110" cy="112" rx="9" ry="6"/>
    <path class="panda-mouth-smile" d="M100 124 q10 11 20 0"/>
    <ellipse class="panda-mouth-open" cx="110" cy="129" rx="9" ry="8"/>
  </svg>`;

  document.querySelectorAll('[data-panda]').forEach((el) => {
    el.insertAdjacentHTML('afterbegin', PANDA_SVG);
  });

  // gentle idle blinking
  if (!reduceMotion) {
    const pandas = document.querySelectorAll('.panda');
    setInterval(() => {
      pandas.forEach((p) => {
        if (p.dataset.expr === 'sleep') return;
        p.classList.add('blink');
        setTimeout(() => p.classList.remove('blink'), 160);
      });
    }, 4200);
  }

  const panda = (id) => document.querySelector('[data-panda-id="' + id + '"]');

  /* ---------------------------------------------------------
     2. AMBIENT LAYERS — falling leaves + twinkling stars
     --------------------------------------------------------- */
  const LEAF_COLORS = ['#ef9d5a', '#e07f3a', '#f6b184', '#f2a2b9', '#c2b2e8', '#9cbd84', '#f3c96b'];
  function leafSVG(color) {
    return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2 C20 6 22 16 12 22 C2 16 4 6 12 2 Z" fill="' + color + '"/><path d="M12 4 L12 20" stroke="rgba(120,80,40,.35)" stroke-width="1"/></svg>';
  }
  function buildAmbient() {
    const ambient = document.getElementById('ambient');
    const leafCount = isSmall ? 9 : 15;
    for (let i = 0; i < leafCount; i++) {
      const leaf = document.createElement('div');
      leaf.className = 'leaf';
      leaf.style.left = Math.random() * 100 + 'vw';
      leaf.style.animationDuration = (9 + Math.random() * 9) + 's';
      leaf.style.animationDelay = (-Math.random() * 14) + 's';
      const s = 14 + Math.random() * 16;
      leaf.style.width = s + 'px';
      leaf.style.height = s + 'px';
      leaf.style.opacity = 0.55 + Math.random() * 0.4;
      leaf.innerHTML = leafSVG(LEAF_COLORS[i % LEAF_COLORS.length]);
      ambient.appendChild(leaf);
    }
    const starCount = isSmall ? 16 : 30;
    for (let i = 0; i < starCount; i++) {
      const st = document.createElement('div');
      st.className = 'star';
      st.style.left = Math.random() * 100 + 'vw';
      st.style.top = Math.random() * 100 + 'vh';
      st.style.animationDelay = (Math.random() * 3.4) + 's';
      const sz = 4 + Math.random() * 5;
      st.style.width = sz + 'px';
      st.style.height = sz + 'px';
      ambient.appendChild(st);
    }
  }
  buildAmbient();

  function sparkleAt(x, y, n) {
    if (reduceMotion) return;
    for (let i = 0; i < (n || 6); i++) {
      const s = document.createElement('div');
      s.className = 'sparkle';
      s.style.left = (x + (Math.random() - 0.5) * 60) + 'px';
      s.style.top = (y + (Math.random() - 0.5) * 60) + 'px';
      s.style.color = LEAF_COLORS[i % LEAF_COLORS.length];
      s.innerHTML = '<svg viewBox="0 0 20 20" width="16" height="16"><path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" fill="currentColor"/></svg>';
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 1150);
    }
  }

  /* ---------------------------------------------------------
     4. SCENE ENGINE
     --------------------------------------------------------- */
  let current = 1;
  const dots = document.querySelectorAll('.dot');
  function updateDots(n) {
    dots.forEach((d, i) => {
      d.classList.toggle('on', i + 1 === n);
      d.classList.toggle('done', i + 1 < n);
    });
    const bar = document.getElementById('dots');
    bar.setAttribute('aria-valuenow', String(n));
  }
  function goTo(n) {
    const target = document.getElementById('scene' + n);
    if (!target || n === current) return;
    const cur = document.querySelector('.scene.active');
    if (cur) {
      cur.classList.remove('active');
      cur.classList.add('leaving');
      setTimeout(() => cur.classList.remove('leaving'), 620);
    }
    target.classList.add('active');
    target.scrollTop = 0;
    current = n;
    updateDots(n);
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  }
  document.querySelectorAll('[data-next]').forEach((btn) => {
    btn.addEventListener('click', () => goTo(parseInt(btn.dataset.next, 10)));
  });

  /* ---------------------------------------------------------
     5. MUSIC — soft generated melody (no external files)
     --------------------------------------------------------- */
  const Music = {
    ctx: null, master: null, timer: null, step: 0, on: false, userOff: false,
    melody: [
      659.25, 783.99, 880.00, 783.99, 659.25, 587.33, 523.25, 587.33,
      783.99, 880.00, 1046.50, 880.00, 783.99, 659.25, 587.33, 523.25
    ],
    ensure() {
      if (this.ctx) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.0;
      this.master.connect(this.ctx.destination);
    },
    tone(freq, t, dur, type, vol) {
      if (!this.ctx) return;
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = type || 'triangle';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol || 0.14, t + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g);
      g.connect(this.master);
      o.start(t);
      o.stop(t + dur + 0.05);
    },
    pad(freqs, t, dur) {
      freqs.forEach((f) => this.tone(f, t, dur, 'sine', 0.05));
    },
    start() {
      this.ensure();
      if (!this.ctx || this.on) return;
      this.on = true;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      this.master.gain.cancelScheduledValues(this.ctx.currentTime);
      this.master.gain.setValueAtTime(this.master.gain.value, this.ctx.currentTime);
      this.master.gain.linearRampToValueAtTime(0.55, this.ctx.currentTime + 1.4);
      const beat = 0.46;
      const tick = () => {
        if (!this.on || !this.ctx) return;
        const t = this.ctx.currentTime + 0.05;
        const f = this.melody[this.step % this.melody.length];
        this.tone(f, t, 1.1, 'triangle', 0.12);
        if (this.step % 2 === 0) this.tone(f / 2, t, 1.6, 'sine', 0.06);
        if (this.step % 8 === 0) this.pad([261.63, 329.63, 392.00], t, 3.4);
        this.step++;
      };
      tick();
      this.timer = setInterval(tick, beat * 1000);
      setMusicUI(true);
    },
    stop() {
      if (!this.on) return;
      this.on = false;
      clearInterval(this.timer);
      if (this.ctx && this.master) {
        this.master.gain.cancelScheduledValues(this.ctx.currentTime);
        this.master.gain.setValueAtTime(this.master.gain.value, this.ctx.currentTime);
        this.master.gain.linearRampToValueAtTime(0.0, this.ctx.currentTime + 0.6);
      }
      setMusicUI(false);
    },
    blip(freq) {
      if (!this.ctx || !this.on) return;
      this.tone(freq || 880, this.ctx.currentTime + 0.02, 0.35, 'sine', 0.18);
    }
  };
  const musicBtn = document.getElementById('musicBtn');
  function setMusicUI(playing) {
    musicBtn.classList.toggle('playing', playing);
    musicBtn.setAttribute('aria-pressed', playing ? 'true' : 'false');
    musicBtn.querySelector('.mlabel').textContent = playing ? 'Music on' : 'Music';
  }
  musicBtn.addEventListener('click', () => {
    Music.ensure();
    if (Music.on) { Music.userOff = true; Music.stop(); }
    else { Music.userOff = false; Music.start(); }
  });
  let musicPrimed = false;
  function primeMusic() {
    if (musicPrimed) return;
    musicPrimed = true;
    if (!Music.userOff) Music.start();
  }

  /* ---------------------------------------------------------
     6. SCENE 1 — wake up
     --------------------------------------------------------- */
  const wakeBtn = document.getElementById('wakeBtn');
  wakeBtn.addEventListener('click', () => {
    primeMusic();
    const p1 = panda('p1');
    if (p1) {
      p1.dataset.expr = 'happy';
      p1.classList.add('wave');
      setTimeout(() => p1.classList.remove('wave'), 2600);
    }
    document.getElementById('s1speech').classList.remove('show');
    wakeBtn.closest('.btn-row').style.display = 'none';
    setTimeout(() => {
      const w = document.getElementById('s1welcome');
      w.style.display = 'flex';
      sparkleAt(window.innerWidth / 2, window.innerHeight / 2, 8);
      Music.blip(1046.5);
    }, 700);
  });

  /* ---------------------------------------------------------
     7. SCENE 2 — flower hunt
     --------------------------------------------------------- */
  const COMPLIMENTS = [
    'Officially smarter than this panda!',
    'Cute face, dangerous brain. 😂',
    'Creative mind, unlimited ideas.',
    'Future entrepreneur in progress...',
    'Warning: excessive talent detected!'
  ];
  const FLOWER_POS = [
    { x: 16, y: 30 }, { x: 37, y: 66 }, { x: 58, y: 24 },
    { x: 78, y: 60 }, { x: 89, y: 30 }
  ];
  const FLOWER_COLORS = ['#f2a2b9', '#c2b2e8', '#f6b184', '#f3c96b', '#9cbd84'];
  function flowerSVG(color) {
    let petals = '';
    for (let i = 0; i < 5; i++) {
      petals += '<ellipse cx="50" cy="25" rx="14" ry="21" fill="' + color + '" transform="rotate(' + (i * 72) + ' 50 50)"/>';
    }
    return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
      '<g class="fglow"><circle cx="50" cy="50" r="42" fill="' + color + '" opacity=".28"/></g>' +
      petals +
      '<circle cx="50" cy="50" r="13" fill="#fff3b0"/>' +
      '<circle cx="50" cy="50" r="5" fill="#f6b184"/></svg>';
  }
  const garden = document.getElementById('garden');
  const counterEl = document.getElementById('flowerCounter');
  const complimentEl = document.getElementById('compliment');
  const s2next = document.getElementById('s2next');
  let collected = 0;
  function renderFlowers() {
    garden.innerHTML = '';
    FLOWER_POS.forEach((pos, i) => {
      const b = document.createElement('button');
      b.className = 'flower-btn';
      b.style.left = pos.x + '%';
      b.style.top = pos.y + '%';
      b.style.animationDelay = (i * 0.4) + 's';
      b.setAttribute('aria-label', 'Collect flower ' + (i + 1));
      b.innerHTML = flowerSVG(FLOWER_COLORS[i]);
      b.addEventListener('click', () => pickFlower(b, i));
      garden.appendChild(b);
    });
  }
  function pickFlower(btn, i) {
    if (btn.classList.contains('picked')) return;
    btn.classList.add('picked');
    const r = btn.getBoundingClientRect();
    sparkleAt(r.left + r.width / 2, r.top + r.height / 2, 7);
    collected++;
    counterEl.textContent = 'Flowers collected: ' + collected + '/5';
    complimentEl.textContent = COMPLIMENTS[i];
    complimentEl.classList.remove('pop');
    void complimentEl.offsetWidth;
    complimentEl.classList.add('pop');
    Music.blip(700 + i * 120);
    setTimeout(() => btn.style.visibility = 'hidden', 620);
    if (collected === 5) finishFlowers();
  }
  function finishFlowers() {
    const p2 = panda('p2');
    if (p2) {
      p2.classList.add('clap');
      p2.dataset.expr = 'happy';
      setTimeout(() => p2.classList.remove('clap'), 2600);
    }
    complimentEl.textContent = 'All five! You collected every single one. 🌟';
    complimentEl.classList.add('pop');
    s2next.disabled = false;
    confettiBurst(window.innerWidth / 2, window.innerHeight * 0.55, 60);
    Music.blip(1318.5);
  }
  document.getElementById('skipFlowers').addEventListener('click', () => goTo(3));
  renderFlowers();

  /* ---------------------------------------------------------
     8. SCENE 3 — talents
     --------------------------------------------------------- */
  document.querySelectorAll('.talent').forEach((card) => {
    card.addEventListener('click', () => {
      const open = card.classList.toggle('open');
      card.setAttribute('aria-expanded', open ? 'true' : 'false');
      const hint = card.querySelector('.t-hint');
      if (hint) hint.classList.toggle('open-hide', open);
      if (open) {
        const r = card.getBoundingClientRect();
        sparkleAt(r.left + r.width / 2, r.top + 30, 5);
        Music.blip(760);
      }
    });
  });

  /* ---------------------------------------------------------
     9. SCENE 5 — wish / celebration
     --------------------------------------------------------- */
  const WISHES = ['Stay curious ✨', 'Keep creating 🎨', 'Dream big 🚀', 'Laugh often 😄', 'You\'ve got this 💪', 'Shine on 🌟'];
  document.getElementById('wishBtn').addEventListener('click', () => {
    const candles = document.getElementById('candles');
    candles.classList.add('lit');
    const p5 = panda('p5');
    if (p5) {
      p5.classList.add('dance');
      setTimeout(() => p5.classList.remove('dance'), 5200);
    }
    confettiBurst(window.innerWidth / 2, window.innerHeight * 0.5, 90);
    setTimeout(() => confettiRain(70), 350);
    spawnWishes();
    document.getElementById('wishCard').classList.add('show');
    document.getElementById('s5nextRow').style.display = 'flex';
    document.getElementById('wishBtn').disabled = true;
    Music.blip(1046.5);
  });
  function spawnWishes() {
    const wrap = document.getElementById('wishes');
    const count = isSmall ? 3 : 5;
    const picks = WISHES.slice().sort(() => Math.random() - 0.5).slice(0, count);
    picks.forEach((w, i) => {
      setTimeout(() => {
        const el = document.createElement('div');
        el.className = 'wish-float';
        el.textContent = w;
        el.style.left = (5 + Math.random() * 58) + 'vw';
        el.style.bottom = (isSmall ? '18vh' : '14vh');
        wrap.appendChild(el);
        setTimeout(() => el.remove(), 4800);
      }, i * 460);
    });
  }

  /* ---------------------------------------------------------
     10. CONFETTI
     --------------------------------------------------------- */
  const canvas = document.getElementById('confetti');
  const cctx = canvas.getContext('2d');
  const CONFETTI_COLORS = ['#ef9d5a', '#f2a2b9', '#c2b2e8', '#9cbd84', '#f3c96b', '#ffd4de', '#e6ddf7'];
  let particles = [];
  let raf = null;
  function sizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  sizeCanvas();
  window.addEventListener('resize', sizeCanvas);
  function makeParticle(x, y, spread) {
    return {
      x: x, y: y,
      vx: (Math.random() - 0.5) * (spread || 9),
      vy: -Math.random() * 11 - 3,
      g: 0.16 + Math.random() * 0.1,
      s: 6 + Math.random() * 8,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.25,
      color: CONFETTI_COLORS[(Math.random() * CONFETTI_COLORS.length) | 0],
      life: 1
    };
  }
  function confettiBurst(x, y, count) {
    if (reduceMotion) return;
    for (let i = 0; i < count; i++) particles.push(makeParticle(x, y, 12));
    run();
  }
  function confettiRain(count) {
    if (reduceMotion) return;
    for (let i = 0; i < count; i++) {
      const p = makeParticle(Math.random() * canvas.width, -20, 4);
      p.vy = Math.random() * 2 + 1;
      p.g = 0.05;
      particles.push(p);
    }
    run();
  }
  function run() {
    if (raf) return;
    const loop = () => {
      cctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.vy += p.g;
        p.vx *= 0.995;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life -= 0.004;
        cctx.save();
        cctx.translate(p.x, p.y);
        cctx.rotate(p.rot);
        cctx.globalAlpha = Math.max(0, p.life);
        cctx.fillStyle = p.color;
        cctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
        cctx.restore();
      });
      particles = particles.filter((p) => p.y < canvas.height + 40 && p.life > 0);
      if (particles.length) {
        raf = requestAnimationFrame(loop);
      } else {
        cctx.clearRect(0, 0, canvas.width, canvas.height);
        raf = null;
      }
    };
    raf = requestAnimationFrame(loop);
  }

  /* ---------------------------------------------------------
     11. SCENE 6 — letter typewriter
     --------------------------------------------------------- */
  const LETTER = [
    'Happy Birthday, Manvi! 🌷',
    'You are one of those rare people who can be incredibly intelligent, unexpectedly funny, and ridiculously cute at the same time.',
    'I hope this new chapter of your life brings you closer to all the dreams you\'re working towards. And about that big entrepreneur dream of yours — I genuinely believe you can make it happen.',
    'There will be difficult days, but I hope you never forget how much potential you have.',
    'Keep creating, keep dreaming, keep laughing at your own silly jokes, and please consider revealing those mysterious singing and dancing talents someday. 😂',
    'No matter how big your dreams become or how far life takes you, I genuinely wish to see you happy, growing, and becoming the person you dream of being.',
    'And whenever you need someone to cheer you on, remember that I\'ll always be wishing the best for you.',
    'Happiest Birthday, Manvi. You deserve so many wonderful things. 🤍'
  ];
  let typing = false;
  let typeToken = 0;
  document.getElementById('letterBtn').addEventListener('click', () => {
    if (typing) return;
    document.getElementById('envelopeWrap').style.display = 'none';
    const wrap = document.getElementById('letterWrap');
    wrap.style.display = 'flex';
    typeLetter();
  });
  async function typeLetter() {
    typing = true;
    const token = ++typeToken;
    const body = document.getElementById('letterBody');
    body.innerHTML = '';
    const cursor = document.createElement('span');
    cursor.className = 'typed-cursor';
    for (let i = 0; i < LETTER.length; i++) {
      if (token !== typeToken) return;
      const p = document.createElement('p');
      body.appendChild(p);
      const chars = Array.from(LETTER[i]);
      if (reduceMotion) {
        p.textContent = LETTER[i];
        continue;
      }
      p.appendChild(cursor);
      for (let c = 0; c < chars.length; c++) {
        if (token !== typeToken) { cursor.remove(); return; }
        cursor.insertAdjacentText('beforebegin', chars[c]);
        await sleep(chars[c] === ' ' ? 9 : 15);
      }
      cursor.remove();
      p.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      await sleep(180);
    }
    if (token !== typeToken) return;
    cursor.remove();
    typing = false;
    showFinale();
  }
  function showFinale() {
    const fin = document.getElementById('finale');
    fin.style.display = 'flex';
    fin.classList.add('fade-in');
    const p6 = panda('p6');
    if (p6) { p6.classList.add('hold'); p6.dataset.expr = 'happy'; }
    confettiBurst(window.innerWidth / 2, window.innerHeight * 0.4, 50);
    Music.blip(1318.5);
    setTimeout(() => fin.scrollIntoView({ block: 'center', behavior: 'smooth' }), 300);
  }

  /* ---------------------------------------------------------
     12. REPLAY
     --------------------------------------------------------- */
  document.getElementById('replayBtn').addEventListener('click', () => {
    // reset scene 1
    const p1 = panda('p1');
    if (p1) { p1.dataset.expr = 'sleep'; p1.classList.remove('wave', 'dance', 'clap'); }
    document.getElementById('s1speech').classList.add('show');
    wakeBtn.closest('.btn-row').style.display = 'flex';
    document.getElementById('s1welcome').style.display = 'none';

    // reset scene 2
    collected = 0;
    counterEl.textContent = 'Flowers collected: 0/5';
    complimentEl.textContent = '';
    s2next.disabled = true;
    renderFlowers();

    // reset scene 3
    document.querySelectorAll('.talent').forEach((c) => {
      c.classList.remove('open');
      c.setAttribute('aria-expanded', 'false');
      const h = c.querySelector('.t-hint');
      if (h) h.classList.remove('open-hide');
    });

    // reset scene 5
    document.getElementById('candles').classList.remove('lit');
    document.getElementById('wishCard').classList.remove('show');
    document.getElementById('s5nextRow').style.display = 'none';
    document.getElementById('wishBtn').disabled = false;
    const p5 = panda('p5');
    if (p5) p5.classList.remove('dance');

    // reset scene 6
    typeToken++;
    typing = false;
    document.getElementById('envelopeWrap').style.display = 'block';
    document.getElementById('letterWrap').style.display = 'none';
    document.getElementById('finale').style.display = 'none';
    document.getElementById('letterBody').innerHTML = '';

    particles = [];
    if (raf) { cancelAnimationFrame(raf); raf = null; }
    cctx.clearRect(0, 0, canvas.width, canvas.height);

    goTo(1);
  });

  /* ---------------------------------------------------------
     13. first-interaction priming (any button starts the magic)
     --------------------------------------------------------- */
  document.addEventListener('pointerdown', function (e) {
    const btn = e.target.closest('button');
    if (btn && btn.id !== 'musicBtn') primeMusic();
  }, false);

  updateDots(1);
})();
