// ────────────────────────────────────────────────────────────
// PASSPORT-STAMP SIDE-SCROLLER
// 5 stops · Muscat → Kolkata → Purdue → SF → Chicago
// Pixel art, parallax, WebAudio chiptune sfx
// ────────────────────────────────────────────────────────────
(function () {
  // ── Canvas setup (fixed internal res, CSS scales) ──────────
  const canvas = document.getElementById('passport-canvas');
  if (!canvas) return;
  const W = 480;
  const H = 210;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  // ── World ──────────────────────────────────────────────────
  const WORLD_W = 2280;
  const GROUND_Y = 160;

  // Palette (matches site)
  const COL = {
    skyTop:   '#F4ECD3',
    skyMid:   '#E9DCB9',
    skyBot:   '#DAC9A0',
    duskTop:  '#F2C9A1',
    duskMid:  '#E89C7A',
    duskBot:  '#C16A55',
    ground1:  '#C9B789',
    ground2:  '#B19E70',
    ground3:  '#8B7A52',
    ink:      '#1B1812',
    ink2:     '#3A352B',
    ink3:     '#7A715D',
    paper:    '#FAF6EC',
    brick:    '#B14B36',
    blue:     '#3D6FB5',
    gold:     '#D4A537',
    green:    '#4F7A3E',
    plum:     '#7C3F5B',
    skin:     '#E8C19F',
    hair:     '#231009',
    shirt:    '#A73F2C',
    pants:    '#2D3142',
    bag:      '#D4A537',
    cloud:    '#FBF6E6',
  };

  // Pixel helper
  const px = (x, y, w, h, c) => {
    ctx.fillStyle = c;
    ctx.fillRect(x | 0, y | 0, w | 0, h | 0);
  };

  // ── Stops (world coords, x = center of landmark) ──────────
  const STOPS = [
    { id: 'kolkata',  x: 320,  color: COL.brick, flag: '#FF9933' },
    { id: 'oman',     x: 700,  color: COL.gold,  flag: '#D71920' },
    { id: 'purdue',   x: 1080, color: COL.green, flag: '#CFB991' },
    { id: 'sf',       x: 1460, color: COL.blue,  flag: '#F1B82D' },
    { id: 'chicago',  x: 1840, color: COL.plum,  flag: '#B3DDF2' },
  ];

  // Copy in three voices
  const COPY = {
    warm: {
      kolkata: { place: 'KOLKATA · INDIA',        text: "Born here, left at 4. Still come back for family — and a very good kathi roll." },
      oman:    { place: 'MUSCAT · OMAN',          text: "Grew up here. Moved at 4, left at 18. The place I actually call home." },
      purdue:  { place: 'WEST LAFAYETTE · IN',    text: "Four years at Purdue. Where the engineering brain got installed." },
      sf:      { place: 'SAN FRANCISCO · CA',     text: "Five years at Salesforce. Fog, hills, first apartment, first job I loved." },
      chicago: { place: 'CHICAGO · IL',           text: "Here now. Kellogg, dinner parties, and figuring out what comes next." },
    },
  };

  // ── State ─────────────────────────────────────────────────
  const state = {
    char: { x: 80, vx: 0, frame: 0, frameTick: 0, walking: false, facing: 1 },
    camX: 0,
    collected: new Set(),
    keys: { left: false, right: false },
    currentStopIdx: -1,    // which stop player is currently near (or -1)
    bubbleStop: null,      // which stop's bubble is currently shown
    options: { character: 'girl', copy: 'warm', time: 'day' },
    sound: true,
    completed: false,
    t: 0,                  // animation tick
  };

  // ── Audio (WebAudio chiptune) ─────────────────────────────
  let actx = null;
  function ensureAudio() {
    if (!actx) {
      try { actx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) { actx = null; }
    }
    if (actx && actx.state === 'suspended') actx.resume();
    return actx;
  }
  function beep(freq, dur, type = 'square', vol = 0.08) {
    if (!state.sound) return;
    const ac = ensureAudio(); if (!ac) return;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.value = vol;
    g.gain.setValueAtTime(vol, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
    o.connect(g); g.connect(ac.destination);
    o.start();
    o.stop(ac.currentTime + dur);
  }
  function noise(dur, vol = 0.04) {
    if (!state.sound) return;
    const ac = ensureAudio(); if (!ac) return;
    const buf = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const src = ac.createBufferSource(); src.buffer = buf;
    const g = ac.createGain(); g.gain.value = vol;
    src.connect(g); g.connect(ac.destination);
    src.start();
  }
  let stepCooldown = 0;
  function sfxStep() {
    if (stepCooldown > 0) return;
    stepCooldown = 12;
    noise(0.05, 0.025);
  }
  function sfxStamp() {
    beep(160, 0.05, 'square', 0.12);
    setTimeout(() => beep(110, 0.12, 'square', 0.10), 50);
    setTimeout(() => noise(0.06, 0.06), 30);
  }
  function sfxArrive() {
    beep(523, 0.08, 'square', 0.06);
    setTimeout(() => beep(659, 0.1, 'square', 0.06), 80);
  }
  function sfxComplete() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((f, i) => setTimeout(() => beep(f, 0.18, 'square', 0.07), i * 130));
  }

  // ── Input ─────────────────────────────────────────────────
  window.addEventListener('keydown', (e) => {
    if (['ArrowLeft', 'a', 'A'].includes(e.key))  { state.keys.left = true;  ensureAudio(); }
    if (['ArrowRight', 'd', 'D'].includes(e.key)) { state.keys.right = true; ensureAudio(); }
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault?.();
      if (state.bubbleStop) collectStamp(state.bubbleStop);
    }
  });
  window.addEventListener('keyup', (e) => {
    if (['ArrowLeft', 'a', 'A'].includes(e.key))  state.keys.left = false;
    if (['ArrowRight', 'd', 'D'].includes(e.key)) state.keys.right = false;
  });

  const btnL = document.getElementById('walk-left');
  const btnR = document.getElementById('walk-right');
  function hold(btn, dir) {
    const press = (e) => { e.preventDefault(); state.keys[dir] = true; btn.classList.add('held'); ensureAudio(); };
    const release = () => { state.keys[dir] = false; btn.classList.remove('held'); };
    btn.addEventListener('mousedown', press);
    btn.addEventListener('touchstart', press, { passive: false });
    btn.addEventListener('mouseup', release);
    btn.addEventListener('mouseleave', release);
    btn.addEventListener('touchend', release);
    btn.addEventListener('touchcancel', release);
  }
  hold(btnL, 'left');
  hold(btnR, 'right');

  // ── Drawing helpers ───────────────────────────────────────
  function isDusk() { return state.options.time === 'dusk'; }
  function skyColors() {
    return isDusk()
      ? [COL.duskTop, COL.duskMid, COL.duskBot]
      : [COL.skyTop, COL.skyMid, COL.skyBot];
  }

  function drawSky() {
    const [a, b, c] = skyColors();
    const grad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
    grad.addColorStop(0, a); grad.addColorStop(0.6, b); grad.addColorStop(1, c);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, GROUND_Y);
  }

  function drawClouds(cam) {
    // Slow parallax: 0.2x
    const offset = (cam * 0.2) | 0;
    const clouds = [
      { x: 60,  y: 30, w: 30 }, { x: 150, y: 22, w: 22 },
      { x: 280, y: 38, w: 26 }, { x: 420, y: 28, w: 32 },
      { x: 580, y: 24, w: 24 }, { x: 720, y: 36, w: 30 },
      { x: 860, y: 30, w: 28 }, { x: 1000, y: 22, w: 22 },
    ];
    clouds.forEach((cl) => {
      const x = ((cl.x - offset) % (W + 200) + W + 200) % (W + 200) - 50;
      // Pixel cloud: stepped pyramid
      px(x,          cl.y + 6, cl.w, 4, COL.cloud);
      px(x + 4,      cl.y + 2, cl.w - 8, 4, COL.cloud);
      px(x + 8,      cl.y - 2, cl.w - 16, 4, COL.cloud);
      // shadow line
      px(x,          cl.y + 10, cl.w, 1, '#E9DDB7');
    });
  }

  function drawHills(cam) {
    // Mid parallax: 0.45x
    const offset = (cam * 0.45) | 0;
    const baseY = GROUND_Y - 40;
    const dark = isDusk() ? '#9C4F4A' : '#B9A371';
    // Repeating soft hills
    const hills = [80, 280, 480, 680, 880, 1080, 1280];
    hills.forEach((hx) => {
      const x = hx - offset;
      // 3-step pyramid
      px(x,      baseY + 24, 100, 16, dark);
      px(x + 8,  baseY + 16, 84,  8,  dark);
      px(x + 18, baseY + 8,  64,  8,  dark);
      px(x + 30, baseY + 2,  40,  6,  dark);
    });
  }

  function drawGround(cam) {
    const offset = cam | 0;
    px(0, GROUND_Y, W, H - GROUND_Y, COL.ground1);
    // Ground bands
    px(0, GROUND_Y + 6,  W, 2,  COL.ground2);
    px(0, GROUND_Y + 16, W, 1,  COL.ground2);
    px(0, GROUND_Y + 28, W, 2,  COL.ground3);
    // Tufts (deterministic pseudo-random)
    for (let i = 0; i < 80; i++) {
      const wx = (i * 53 + 17) % WORLD_W;
      const sx = wx - offset;
      if (sx < -4 || sx > W) continue;
      const tuftY = GROUND_Y + 1 + (i % 3);
      px(sx, tuftY,     2, 1, COL.ground3);
      px(sx + 1, tuftY - 1, 1, 1, COL.ground3);
    }
  }

  // ── Landmarks for each stop ───────────────────────────────
  function drawOman(sx) {
    // ── Muscat coastline — integrated into the existing ground ──
    // The world's hills become "coastal mountains," the sea is a tapered bay
    // behind the mosque. No hard rectangle of "different scene" — just additions.
    const sea      = '#5A9CAA';
    const seaDeep  = '#3C7A8A';
    const seaLight = '#8DC1C8';
    const foam     = '#F4EDD9';
    const marble   = COL.paper;
    const marbleSh = '#E5DCC0';
    const gold     = '#C9A659';

    // ── Tapered sea band — bell-shaped, peaks behind the mosque ──────
    // Visible only in the middle ~90px, fades smoothly at the edges
    const reach = 70;  // half-width of the bay
    const peakH = 12;  // tallest sea band, in the middle
    for (let i = -reach; i <= reach; i++) {
      const t = i / reach;            // -1 .. 1
      // smooth bell: cosine-shaped falloff
      const v = Math.cos(t * Math.PI / 2);
      const h = Math.round(v * peakH);
      if (h <= 0) continue;
      const colX = sx + i;
      const top = GROUND_Y - 2 - h;
      // body of sea (one pixel column)
      px(colX, top,     1, 1, seaDeep);
      px(colX, top + 1, 1, h - 1, sea);
      // animated wave hint
      const waveOn = (((state.t * 0.4) | 0) + i) % 14 === 0;
      if (waveOn && h > 3) px(colX, top + 2, 1, 1, seaLight);
      const wave2  = (((state.t * 0.4) | 0) + i + 7) % 14 === 0;
      if (wave2  && h > 5) px(colX, top + 4, 1, 1, seaLight);
      // foamy wet-sand line where sea meets ground
      px(colX, GROUND_Y - 2, 1, 1, foam);
      px(colX, GROUND_Y - 1, 1, 1, '#E8D4A0');
    }

    // ── Tiny dhow on the water (only if it's where sea exists) ──────
    const bxb = sx - 40;
    px(bxb,     GROUND_Y - 7, 9, 2, '#7A4A22');
    px(bxb + 1, GROUND_Y - 5, 7, 1, '#5A3514');
    px(bxb + 4, GROUND_Y - 13, 1, 6, COL.ink);
    px(bxb + 1, GROUND_Y - 12, 4, 5, marble);
    px(bxb + 2, GROUND_Y - 11, 3, 4, marbleSh);

    // ── Mosque (white, dome + two minarets) ─────────────────────────
    const dx = sx - 22, dy = GROUND_Y - 28;
    // central dome
    px(dx + 8,  dy - 14, 8,  4, marble);
    px(dx + 6,  dy - 10, 12, 4, marble);
    px(dx + 4,  dy - 6,  16, 6, marble);
    px(dx + 16, dy - 4,  4,  4, marbleSh);
    // body
    px(dx + 2, dy, 20, 16, marble);
    px(dx + 20, dy, 2, 16, marbleSh);
    // arched main entrance
    px(dx + 9,  dy + 4, 6, 1, '#A89A75');
    px(dx + 8,  dy + 5, 8, 1, '#A89A75');
    px(dx + 8,  dy + 6, 8, 10, '#5A6F84');
    px(dx + 11, dy + 8, 2, 6, '#8FA8C0');
    // base / step (matches local ground tone)
    px(dx + 2, dy + 16, 20, 2, '#C9B789');
    // crescent finial
    px(dx + 11, dy - 18, 2, 2, gold);
    px(dx + 11, dy - 16, 2, 2, gold);

    // left minaret (shorter)
    px(dx - 8, dy - 4,  4, 22, marble);
    px(dx - 4, dy - 4,  1, 22, marbleSh);
    px(dx - 9, dy - 8,  6, 4,  marble);
    px(dx - 7, dy - 14, 2, 6,  marble);
    px(dx - 6, dy - 18, 1, 4,  gold);

    // right minaret (taller)
    px(sx + 4, dy - 8,  4, 26, marble);
    px(sx + 8, dy - 8,  1, 26, marbleSh);
    px(sx + 3, dy - 12, 6, 4,  marble);
    px(sx + 5, dy - 18, 2, 6,  marble);
    px(sx + 6, dy - 22, 1, 4,  gold);

    // ── Palm trees ──────────────────────────────────────────────────
    function palm(pxp, pyBase, tall) {
      const trunk  = '#6B4A2E';
      const trunkD = '#4A3220';
      const green  = '#5B8A3E';
      const greenD = '#3F6F2A';
      const dates  = '#8B3F1F';
      px(pxp, pyBase - tall, 2, tall, trunk);
      for (let r = 6; r < tall; r += 6) px(pxp, pyBase - r, 2, 1, trunkD);
      const t = pyBase - tall;
      px(pxp - 9,  t - 1, 7, 2, green);
      px(pxp - 11, t + 1, 4, 1, green);
      px(pxp + 3,  t - 1, 7, 2, green);
      px(pxp + 8,  t + 1, 4, 1, green);
      px(pxp - 5,  t - 4, 4, 2, greenD);
      px(pxp + 3,  t - 4, 4, 2, greenD);
      px(pxp - 2,  t - 6, 6, 2, greenD);
      px(pxp - 1,  t + 2, 4, 2, dates);
      px(pxp,      t + 4, 2, 1, dates);
    }
    palm(sx + 30, GROUND_Y, 26);
    palm(sx - 64, GROUND_Y, 18);

    // ── Two seagulls in the sky (animated) ──────────────────────────
    const gw = Math.sin(state.t * 0.12) > 0 ? 0 : 1;
    px(sx - 30, GROUND_Y - 44 - gw, 2, 1, COL.ink2);
    px(sx - 28, GROUND_Y - 45 + gw, 2, 1, COL.ink2);
    px(sx + 18, GROUND_Y - 50 + gw, 2, 1, COL.ink2);
    px(sx + 20, GROUND_Y - 49 - gw, 2, 1, COL.ink2);
  }

  function drawKolkata(sx) {
    // ── Victoria Memorial ──────────────────────────────────
    // White marble palace: long base + 4 corner domes + huge central dome + angel
    const marble  = '#F4ECD0';   // warm white marble
    const shade   = '#D9CCA4';   // shaded marble
    const shadow  = '#B7A77B';   // deep shadow
    const trim    = '#8B7A52';   // trim line / base
    const angel   = '#C9A659';   // bronze Angel of Victory
    const reflect = '#FBF5DE';   // hot highlight

    // Reflecting pool / front terrace (subtle)
    px(sx - 44, GROUND_Y - 2, 88, 2, '#C4DCE0');
    px(sx - 44, GROUND_Y,     88, 1, '#A7C2C9');

    // Building base (long rectangle)
    const bx = sx - 38, by = GROUND_Y - 18;
    px(bx, by, 76, 18, marble);
    px(bx, by + 14, 76, 2, shade);     // base shadow line
    px(bx, by + 16, 76, 2, trim);      // plinth
    // top cornice
    px(bx, by - 2, 76, 2, marble);
    px(bx - 1, by - 3, 78, 1, shade);

    // ── Four corner domes (small) ────────────────────────
    // Each: 2-step pyramid + small dome cap
    function smallDome(cx, cy) {
      // square base
      px(cx - 5, cy + 4, 10, 4, marble);
      px(cx - 5, cy + 7, 10, 1, shade);
      // dome bulge
      px(cx - 4, cy + 1, 8, 3, marble);
      px(cx - 3, cy - 1, 6, 2, marble);
      px(cx - 2, cy - 2, 4, 1, marble);
      // tiny finial
      px(cx,     cy - 4, 1, 2, trim);
      px(cx - 1, cy - 3, 3, 1, marble);
      // highlight
      px(cx - 3, cy,     1, 1, reflect);
    }
    // top of building is by-2 ... so domes start above
    smallDome(sx - 30, by - 10);
    smallDome(sx - 12, by - 10);
    smallDome(sx + 12, by - 10);
    smallDome(sx + 30, by - 10);

    // ── Central drum + grand dome ────────────────────────
    // drum (cylindrical base under dome)
    const dx = sx, dy = by - 6;
    px(dx - 11, dy - 6, 22, 6, marble);
    px(dx - 11, dy,     22, 1, shade);
    // little columns on drum
    px(dx - 8, dy - 5, 1, 5, shadow);
    px(dx - 3, dy - 5, 1, 5, shadow);
    px(dx + 2, dy - 5, 1, 5, shadow);
    px(dx + 7, dy - 5, 1, 5, shadow);

    // dome — bulbous, layered
    const top = dy - 22;
    // bottom widest
    px(dx - 12, top + 16, 24, 2, marble);
    px(dx - 11, top + 14, 22, 2, marble);
    px(dx - 10, top + 12, 20, 2, marble);
    px(dx - 9,  top + 10, 18, 2, marble);
    px(dx - 8,  top + 8,  16, 2, marble);
    px(dx - 7,  top + 6,  14, 2, marble);
    px(dx - 5,  top + 4,  10, 2, marble);
    px(dx - 4,  top + 2,   8, 2, marble);
    px(dx - 3,  top,       6, 2, marble);
    // dome shading on right
    px(dx + 4,  top + 4,  3, 2, shade);
    px(dx + 5,  top + 6,  4, 2, shade);
    px(dx + 6,  top + 8,  4, 2, shade);
    px(dx + 7,  top + 10, 3, 2, shade);
    px(dx + 8,  top + 12, 3, 2, shade);
    px(dx + 9,  top + 14, 2, 2, shade);
    // dome highlight on left
    px(dx - 4,  top + 4,  1, 4, reflect);
    px(dx - 6,  top + 8,  1, 4, reflect);

    // ── Angel of Victory on top ──────────────────────────
    // small bronze figure with outstretched wings
    const ax = dx, ay = top - 2;
    // pedestal
    px(ax - 1, ay,      3, 2, shadow);
    // body
    px(ax,     ay - 4,  1, 4, angel);
    // head
    px(ax,     ay - 5,  1, 1, angel);
    // wings (outstretched, slight wave)
    const wing = Math.sin(state.t * 0.04) > 0 ? 0 : 1;
    px(ax - 3, ay - 4 + wing, 3, 1, angel);
    px(ax + 1, ay - 4 + wing, 3, 1, angel);
    px(ax - 2, ay - 3, 2, 1, angel);
    px(ax + 1, ay - 3, 2, 1, angel);

    // ── Arched windows along the base ────────────────────
    // 6 tall arched windows
    for (let i = 0; i < 6; i++) {
      const wxw = bx + 6 + i * 11;
      // arch top
      px(wxw + 1, by + 2, 3, 1, shadow);
      px(wxw,     by + 3, 5, 1, shadow);
      // window pane
      px(wxw + 1, by + 4, 3, 7, '#5D7894');
      // highlight
      px(wxw + 1, by + 4, 1, 3, '#8FA8C2');
    }
    // central doorway (taller, darker)
    const doorX = sx - 3;
    px(doorX,     by + 1, 6, 2, shadow);
    px(doorX + 1, by,     4, 1, shadow);
    px(doorX,     by + 3, 6, 11, '#3A4659');
    px(doorX + 2, by + 5, 1, 6, '#6F8298');
    // steps in front of door
    px(doorX - 2, by + 14, 10, 1, shade);
    px(doorX - 3, by + 15, 12, 1, trim);

    // ── Tiny yellow Ambassador taxi to the side ──────────
    const tx = sx + 30, ty = GROUND_Y - 9;
    px(tx,     ty,     18, 5, COL.gold);
    px(tx + 3, ty - 3, 12, 3, COL.gold);
    px(tx + 4, ty - 2,  9, 2, '#9DC4E6'); // window
    px(tx + 1, ty + 5,  3, 1, COL.ink);   // wheel
    px(tx + 14, ty + 5, 3, 1, COL.ink);
  }

  function drawPurdue(sx) {
    // ── Purdue Gateway Arch ────────────────────────────────────────
    const limestone = '#E8DCC0';
    const limeShade = '#C9B98A';
    const limeDark  = '#8B7A52';
    const limeHi    = '#F2E8D0';
    const carved    = '#5A4A28';
    const opening   = '#3A352B';
    const goldP     = '#CFB991';

    // Soft campus trees flanking
    function tree(tx, ty) {
      const dark = '#3D5F30';
      const lite = '#5B8A3E';
      px(tx - 4, ty,     10, 3, dark);
      px(tx - 5, ty + 2, 12, 4, dark);
      px(tx - 4, ty + 5, 10, 2, dark);
      px(tx - 3, ty,      6, 1, lite);
      px(tx - 4, ty + 3,  4, 1, lite);
      px(tx,     ty + 7,  2, 5, '#5A4A2E');
    }
    tree(sx - 56, GROUND_Y - 18);
    tree(sx + 50, GROUND_Y - 16);

    // Faint bell tower behind, off to the side
    const btx = sx + 32, bty = GROUND_Y - 40;
    px(btx,     bty,      6, 24, '#D8C89E');
    px(btx + 6, bty,      1, 24, limeShade);
    px(btx + 1, bty + 4,  4, 4,  opening);
    px(btx + 2, bty + 3,  2, 1,  opening);
    px(btx + 1, bty - 4,  4, 4,  '#A88E5C');
    px(btx + 2, bty - 8,  2, 4,  '#A88E5C');
    px(btx + 2, bty - 10, 2, 2,  goldP);

    // ── The arch (60 × 44, centered on sx) ──
    const ax = sx - 30;
    const ay = GROUND_Y - 44;
    const aw = 60;
    const ah = 44;

    // Limestone block
    px(ax, ay + 2, aw, ah - 2, limestone);

    // Top cornice (raised)
    px(ax - 1, ay,     aw + 2, 2, limeShade);
    px(ax - 1, ay - 1, aw + 2, 1, limeHi);
    px(ax,     ay + 2, aw,     1, limeHi);

    // Carved "PURDUE" lettering
    const LETTERS = {
      P: ['110','101','110','100','100'],
      U: ['101','101','101','101','111'],
      R: ['110','101','110','101','101'],
      D: ['110','101','101','101','110'],
      E: ['111','100','110','100','111'],
    };
    function letter(lx, ly, ch, c) {
      const bm = LETTERS[ch];
      for (let r = 0; r < 5; r++) {
        for (let cc = 0; cc < 3; cc++) {
          if (bm[r][cc] === '1') px(lx + cc, ly + r, 1, 1, c);
        }
      }
    }
    // PURDUE — 6 letters × 4px pitch = 23 px wide, center on sx
    const word = 'PURDUE';
    const lxStart = sx - 12;
    const lyText  = ay + 5;
    for (let i = 0; i < 6; i++) {
      letter(lxStart + i * 4, lyText, word[i], carved);
    }

    // Decorative band under the lettering
    px(ax + 6, ay + 11, aw - 12, 1, limeDark);
    px(ax + 6, ay + 12, aw - 12, 1, limeShade);

    // Archway opening (rounded top, dark recess)
    const oaw = 20;
    const oax = sx - 10;
    const oay = ay + 16;
    const oah = ah - 18;
    px(oax,     oay + 4, oaw, oah - 4, opening);
    px(oax + 4, oay,     12, 1, opening);
    px(oax + 2, oay + 1, 16, 1, opening);
    px(oax + 1, oay + 2, 18, 1, opening);
    px(oax,     oay + 3, 20, 1, opening);
    // Inner rim highlight (top edge of arch)
    px(oax + 4, oay - 1, 12, 1, limeShade);
    px(oax + 2, oay,      2, 1, limeShade);
    px(oax + 16, oay,     2, 1, limeShade);

    // Pilasters flanking the opening
    px(ax + 8,  ay + 16, 8, ah - 18, limeHi);
    px(ax + 14, ay + 16, 2, ah - 18, limeShade);
    px(ax + 8,  ay + 15, 8, 1, limeDark);
    px(ax + 44, ay + 16, 8, ah - 18, limeHi);
    px(ax + 50, ay + 16, 2, ah - 18, limeShade);
    px(ax + 44, ay + 15, 8, 1, limeDark);

    // Wider base step
    px(ax - 2, GROUND_Y - 2, aw + 4, 2, limeDark);
    px(ax - 4, GROUND_Y,     aw + 8, 1, limeShade);
  }

  function drawSF(sx) {
    // golden gate bridge (two towers + cables)
    const tx1 = sx - 30, tx2 = sx + 20;
    const ty = GROUND_Y - 56;
    const orange = '#C84A2A';
    // bridge deck
    px(tx1 - 10, GROUND_Y - 14, 80, 3, orange);
    // tower 1
    px(tx1, ty, 4, 42, orange);
    px(tx1 - 4, ty + 8, 12, 2, orange);
    px(tx1 - 4, ty + 18, 12, 2, orange);
    px(tx1 - 4, ty + 28, 12, 2, orange);
    px(tx1, ty - 6, 4, 6, orange);
    // tower 2
    px(tx2, ty, 4, 42, orange);
    px(tx2 - 4, ty + 8, 12, 2, orange);
    px(tx2 - 4, ty + 18, 12, 2, orange);
    px(tx2 - 4, ty + 28, 12, 2, orange);
    px(tx2, ty - 6, 4, 6, orange);
    // suspension cables (approx parabola via pixels)
    for (let i = 0; i <= 50; i += 2) {
      // between towers
      const t = i / 50;
      const cx = tx1 + 4 + i;
      const cyTop = ty - 6;
      const cyDip = GROUND_Y - 20;
      const cy = cyTop + (cyDip - cyTop) * 4 * t * (1 - t);
      px(cx, cy, 1, 1, orange);
    }
    // hills behind
    px(sx - 80, GROUND_Y - 24, 30, 24, '#A48B5E');
    px(sx + 50, GROUND_Y - 20, 24, 20, '#A48B5E');
  }

  function drawChicago(sx) {
    // skyline of varied skyscrapers
    const bldgs = [
      { x: -50, w: 14, h: 50, c: '#6E7C8E' },
      { x: -32, w: 10, h: 40, c: '#5C6A7D' },
      { x: -18, w: 16, h: 64, c: '#7A8AA0' },
      { x:   2, w: 12, h: 56, c: '#5C6A7D' },
      { x:  18, w: 18, h: 72, c: '#6E7C8E' }, // Willis-ish
      { x:  40, w: 10, h: 42, c: '#5C6A7D' },
    ];
    bldgs.forEach((b) => {
      const x = sx + b.x, y = GROUND_Y - b.h;
      px(x, y, b.w, b.h, b.c);
      // windows
      for (let wy = y + 4; wy < GROUND_Y - 4; wy += 4) {
        for (let wx = x + 2; wx < x + b.w - 2; wx += 4) {
          if ((wx + wy + sx) % 7 < 4) {
            px(wx, wy, 2, 2, '#F8DD8C');
          }
        }
      }
      // top accent
      px(x + 2, y - 2, b.w - 4, 2, b.c);
    });
    // antennae
    px(sx + 26, GROUND_Y - 80, 1, 8, COL.ink);
    px(sx - 12, GROUND_Y - 72, 1, 6, COL.ink);
  }

  function drawLandmark(stop, screenX) {
    if (stop.id === 'oman')    return drawOman(screenX);
    if (stop.id === 'kolkata') return drawKolkata(screenX);
    if (stop.id === 'purdue')  return drawPurdue(screenX);
    if (stop.id === 'sf')      return drawSF(screenX);
    if (stop.id === 'chicago') return drawChicago(screenX);
  }

  // Flag/sign post for each stop
  function drawFlag(stop, screenX) {
    const collected = state.collected.has(stop.id);
    const poleY = GROUND_Y - 34;
    // pole
    px(screenX, poleY, 1, 34, COL.ink2);
    px(screenX - 1, GROUND_Y, 3, 1, COL.ink2);
    // flag (waving with t)
    const wave = Math.sin(state.t * 0.06 + stop.x) * 1;
    const fy = poleY + 2;
    px(screenX + 1, fy,       8, 2, stop.flag);
    px(screenX + 1, fy + 2,   8 + (wave|0), 2, stop.flag);
    px(screenX + 1, fy + 4,   8, 2, stop.flag);
    // checkmark if collected
    if (collected) {
      // tiny check
      px(screenX + 3, fy + 2, 1, 1, COL.paper);
      px(screenX + 4, fy + 3, 1, 1, COL.paper);
      px(screenX + 5, fy + 1, 1, 1, COL.paper);
      px(screenX + 6, fy + 0, 1, 1, COL.paper);
    }
  }

  // ── Character variants ────────────────────────────────────
  function drawGirl(x, y, frame, facing) {
    // 12 wide x 26 tall
    const f = facing;
    // hair top
    px(x + 3, y + 0, 6, 3, COL.hair);
    px(x + 2, y + 2, 8, 3, COL.hair);
    // face
    px(x + 3, y + 4, 6, 4, COL.skin);
    // hair side
    px(x + 2, y + 4, 1, 6, COL.hair);
    px(x + 9, y + 4, 1, 4, COL.hair);
    // eye
    if (f > 0) {
      px(x + 7, y + 6, 1, 1, COL.ink);
    } else {
      px(x + 4, y + 6, 1, 1, COL.ink);
    }
    // mouth
    px(x + 5 + (f > 0 ? 1 : 0), y + 8, 2, 1, COL.brick);
    // neck
    px(x + 5, y + 9, 3, 1, COL.skin);
    // body / shirt
    px(x + 2, y + 10, 8, 8, COL.shirt);
    px(x + 1, y + 11, 1, 5, COL.shirt); // arm
    px(x + 10, y + 11, 1, 5, COL.shirt); // arm
    // backpack
    if (f > 0) {
      px(x + 0, y + 11, 2, 6, COL.bag);
      px(x + 0, y + 10, 1, 1, COL.bag);
    } else {
      px(x + 10, y + 11, 2, 6, COL.bag);
      px(x + 11, y + 10, 1, 1, COL.bag);
    }
    // belt
    px(x + 2, y + 18, 8, 1, COL.ink);
    // legs (walking animation)
    if (frame === 0) {
      px(x + 3, y + 19, 2, 5, COL.pants);
      px(x + 7, y + 19, 2, 5, COL.pants);
      px(x + 3, y + 24, 3, 2, COL.ink);
      px(x + 7, y + 24, 3, 2, COL.ink);
    } else {
      px(x + 2, y + 19, 3, 4, COL.pants);
      px(x + 7, y + 19, 3, 5, COL.pants);
      px(x + 1, y + 23, 4, 1, COL.ink);
      px(x + 7, y + 24, 3, 2, COL.ink);
    }
  }

  function drawSuitcase(x, y, frame, facing) {
    // rolling suitcase, 14 wide x 22 tall
    const tan = '#9C6B3F';
    const tanD = '#7A5230';
    // handle (extends up)
    px(x + 5, y + 0, 4, 2, COL.ink2);
    px(x + 5, y + 2, 1, 4, COL.ink2);
    px(x + 8, y + 2, 1, 4, COL.ink2);
    // case body
    px(x + 1, y + 6, 12, 14, tan);
    px(x + 1, y + 6, 12, 1, tanD);
    px(x + 1, y + 19, 12, 1, tanD);
    // strap
    px(x + 1, y + 11, 12, 2, tanD);
    px(x + 6, y + 11, 2, 2, COL.gold);
    // wheels (animate)
    const wf = frame === 0 ? 0 : 1;
    px(x + 2, y + 20, 3, 2, COL.ink);
    px(x + 9, y + 20, 3, 2, COL.ink);
    px(x + 2 + wf, y + 22, 1, 1, COL.ink3);
    px(x + 11 - wf, y + 22, 1, 1, COL.ink3);
    // travel sticker (changes color)
    px(x + 3, y + 8, 3, 3, COL.brick);
    px(x + 8, y + 14, 3, 3, COL.blue);
  }

  function drawPlane(x, y, frame, facing) {
    // paper plane, 16 wide x 14 tall, bobs
    const bob = Math.sin(state.t * 0.15) * 1.5;
    const yy = y + bob;
    const f = facing;
    if (f > 0) {
      // body wedge facing right
      px(x + 0, yy + 6, 14, 2, COL.paper);
      px(x + 4, yy + 4, 10, 2, COL.paper);
      px(x + 8, yy + 2, 6, 2, COL.paper);
      px(x + 12, yy + 0, 2, 2, COL.paper);
      // fold line shading
      px(x + 0, yy + 8, 14, 1, '#E9DDB7');
      px(x + 4, yy + 6, 10, 1, '#E9DDB7');
      // outline
      px(x + 0, yy + 5, 14, 1, COL.ink2);
      px(x + 14, yy + 0, 1, 7, COL.ink2);
      // tail
      px(x + 2, yy + 10, 6, 1, COL.paper);
      px(x + 2, yy + 11, 6, 1, '#E9DDB7');
    } else {
      px(x + 0, yy + 0, 2, 2, COL.paper);
      px(x + 0, yy + 2, 6, 2, COL.paper);
      px(x + 0, yy + 4, 10, 2, COL.paper);
      px(x + 0, yy + 6, 14, 2, COL.paper);
      px(x + 0, yy + 8, 14, 1, '#E9DDB7');
      px(x + 0, yy + 5, 1, 7, COL.ink2);
      px(x + 6, yy + 10, 6, 1, COL.paper);
      px(x + 6, yy + 11, 6, 1, '#E9DDB7');
    }
  }

  function drawCharacter() {
    const sx = state.char.x - state.camX;
    let yTop;
    if (state.options.character === 'plane') {
      // floats above ground
      yTop = GROUND_Y - 50;
      drawPlane(sx, yTop, state.char.frame, state.char.facing);
    } else if (state.options.character === 'suitcase') {
      yTop = GROUND_Y - 22;
      drawSuitcase(sx, yTop, state.char.frame, state.char.facing);
    } else {
      yTop = GROUND_Y - 26;
      drawGirl(sx, yTop, state.char.frame, state.char.facing);
    }
    // tiny shadow
    px(sx + 2, GROUND_Y, 8, 1, 'rgba(20,12,4,0.25)');
  }

  // ── Update / loop ─────────────────────────────────────────
  const SPEED = 1.6;
  function update() {
    state.t++;
    if (stepCooldown > 0) stepCooldown--;

    // movement
    let vx = 0;
    if (state.keys.left)  vx -= SPEED;
    if (state.keys.right) vx += SPEED;
    state.char.walking = vx !== 0;
    if (vx > 0) state.char.facing = 1;
    if (vx < 0) state.char.facing = -1;
    state.char.x = Math.max(20, Math.min(WORLD_W - 30, state.char.x + vx));

    // walk animation
    if (state.char.walking) {
      state.char.frameTick++;
      if (state.char.frameTick > 7) {
        state.char.frameTick = 0;
        state.char.frame = (state.char.frame + 1) % 2;
        sfxStep();
      }
    } else {
      state.char.frame = 0;
    }

    // camera (centered on character, clamped)
    const camTarget = state.char.x - W / 2 + 8;
    state.camX = Math.max(0, Math.min(WORLD_W - W, camTarget));

    // check current stop
    let near = -1;
    for (let i = 0; i < STOPS.length; i++) {
      if (Math.abs(state.char.x - STOPS[i].x) < 36) { near = i; break; }
    }
    if (near !== state.currentStopIdx) {
      state.currentStopIdx = near;
      updatePips();
      if (near >= 0 && !state.collected.has(STOPS[near].id)) {
        showBubble(STOPS[near]);
        sfxArrive();
      } else if (near < 0) {
        hideBubble();
      } else if (near >= 0 && state.collected.has(STOPS[near].id)) {
        // already collected, just show note
        showBubble(STOPS[near], true);
      }
    }
  }

  // ── Render ────────────────────────────────────────────────
  function render() {
    drawSky();
    drawClouds(state.camX);
    drawHills(state.camX);
    drawGround(state.camX);
    // landmarks (only those visible)
    for (const stop of STOPS) {
      const sx = stop.x - state.camX;
      if (sx < -120 || sx > W + 120) continue;
      drawLandmark(stop, sx);
      drawFlag(stop, sx);
    }
    drawCharacter();
    // dotted path on ground between stops
  }

  function loop() {
    update();
    render();
    requestAnimationFrame(loop);
  }

  // ── Bubble + readout UI ───────────────────────────────────
  const speech = document.getElementById('speech');
  const speechPlace = document.getElementById('speech-place');
  const speechText = document.getElementById('speech-text');
  const speechBtn = document.getElementById('speech-stamp-btn');
  speechBtn.addEventListener('click', () => {
    if (state.bubbleStop) collectStamp(state.bubbleStop);
  });

  function showBubble(stop, alreadyCollected) {
    state.bubbleStop = stop;
    const c = COPY[state.options.copy][stop.id];
    speechPlace.textContent = c.place;
    speechText.textContent = c.text;
    speechBtn.style.display = alreadyCollected ? 'none' : 'inline-block';
    if (alreadyCollected) speechBtn.textContent = 'STAMPED ✓';
    speech.classList.add('show');
    // position bubble above character (using percentage of canvas)
    const sx = stop.x - state.camX;
    const pct = (sx / W) * 100;
    speech.style.left = `calc(${pct}% - 60px)`;
    speech.style.top = '14px';
    // Update readout too
    readoutPlace.textContent = c.place;
    readoutText.textContent = c.text;
    readout.classList.remove('empty');
  }
  function hideBubble() {
    state.bubbleStop = null;
    speech.classList.remove('show');
  }

  // ── Passport drawer ───────────────────────────────────────
  const stampsRow = document.getElementById('stamps-row');
  const passportCount = document.getElementById('passport-count');
  const readout = document.getElementById('readout');
  const completeBanner = document.getElementById('complete-banner');

  // Inject 5 slots
  STOPS.forEach((stop, i) => {
    const slot = document.createElement('div');
    slot.className = 'stamp-slot';
    slot.dataset.id = stop.id;
    slot.style.setProperty('--rot', `${(i % 2 ? -1 : 1) * (4 + i)}deg`);
    slot.innerHTML = `
      <span class="slot-num">0${i + 1}</span>
      <span class="slot-placeholder">—</span>
      <div class="stamp-mark">${stampSVG(stop)}</div>
    `;
    stampsRow.appendChild(slot);
  });

  // Build a stamp SVG (concentric ring, city text, tiny icon)
  function stampSVG(stop) {
    const labels = {
      oman:    { line1: 'MUSCAT', line2: 'OMAN' },
      kolkata: { line1: 'KOLKATA', line2: 'INDIA' },
      purdue:  { line1: 'PURDUE', line2: 'USA' },
      sf:      { line1: 'SF', line2: 'USA' },
      chicago: { line1: 'CHICAGO', line2: 'USA' },
    };
    const L = labels[stop.id];
    const c = stop.color;
    // Two-line stamp on a ringed background
    return `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <path id="top-${stop.id}" d="M 14 50 A 36 36 0 0 1 86 50" fill="none"/>
          <path id="bot-${stop.id}" d="M 18 56 A 32 32 0 0 0 82 56" fill="none"/>
        </defs>
        <circle cx="50" cy="50" r="44" stroke="${c}" stroke-width="3" fill="none" opacity="0.85"/>
        <circle cx="50" cy="50" r="38" stroke="${c}" stroke-width="1.5" fill="none" opacity="0.8"/>
        <text font-family="JetBrains Mono, monospace" font-size="9" font-weight="600" fill="${c}" letter-spacing="1.5">
          <textPath href="#top-${stop.id}" startOffset="50%" text-anchor="middle">★ ${L.line1} ★</textPath>
        </text>
        <text x="50" y="54" text-anchor="middle" font-family="Instrument Serif, serif" font-size="14" fill="${c}" font-style="italic">${L.line2}</text>
        <text x="50" y="68" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="6" fill="${c}" letter-spacing="0.8" opacity="0.85">${stampDate(stop.id)}</text>
        <line x1="22" y1="78" x2="78" y2="78" stroke="${c}" stroke-width="1" opacity="0.5"/>
      </svg>
    `;
  }
  function stampDate(id) {
    return { kolkata:'born here', oman:'2002–2016', purdue:'2016–2020', sf:'2020–2025', chicago:'2025→' }[id];
  }

  // Per-readout DOM
  const readoutPlace = document.createElement('div');
  readoutPlace.className = 'readout-place';
  const readoutText = document.createElement('div');
  readoutText.className = 'readout-text';
  const readoutEmpty = readout.querySelector('.readout-empty');
  // We'll toggle between empty and place/text
  readout.appendChild(readoutPlace);
  readout.appendChild(readoutText);
  readout.classList.add('empty');

  // Override readout state CSS
  const styleHelper = document.createElement('style');
  styleHelper.textContent = `
    .passport-readout .readout-place,
    .passport-readout .readout-text { display: none; }
    .passport-readout:not(.empty) .readout-place,
    .passport-readout:not(.empty) .readout-text { display: block; }
    .passport-readout:not(.empty) .readout-empty { display: none; }
  `;
  document.head.appendChild(styleHelper);

  // Pips
  const pipEls = document.querySelectorAll('#progress-pips .pip');
  function updatePips() {
    pipEls.forEach((p, i) => {
      p.classList.toggle('done',   state.collected.has(STOPS[i].id));
      p.classList.toggle('active', i === state.currentStopIdx && !state.collected.has(STOPS[i].id));
    });
  }

  // Collect a stamp
  function collectStamp(stop) {
    if (state.collected.has(stop.id)) return;
    state.collected.add(stop.id);
    sfxStamp();
    const slot = stampsRow.querySelector(`[data-id="${stop.id}"]`);
    if (slot) {
      slot.classList.add('filled');
      // Briefly enlarge for thunk effect
      slot.animate(
        [
          { transform: 'scale(0.7)' },
          { transform: 'scale(1.15)' },
          { transform: 'scale(1)' },
        ],
        { duration: 380, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }
      );
    }
    // Update button text
    speechBtn.textContent = 'STAMPED ✓';
    speechBtn.style.display = 'none';
    setTimeout(() => {
      speechBtn.textContent = 'STAMP IT →';
    }, 400);

    passportCount.textContent = `${state.collected.size} / 5 stamps`;
    updatePips();

    if (state.collected.size === 5 && !state.completed) {
      state.completed = true;
      setTimeout(() => {
        sfxComplete();
        completeBanner.classList.add('show');
      }, 600);
    }
  }

  document.getElementById('restart-btn').addEventListener('click', () => {
    state.collected.clear();
    state.completed = false;
    state.char.x = 80;
    state.char.facing = 1;
    state.bubbleStop = null;
    state.currentStopIdx = -1;
    completeBanner.classList.remove('show');
    stampsRow.querySelectorAll('.stamp-slot').forEach(s => s.classList.remove('filled'));
    passportCount.textContent = '0 / 5 stamps';
    readout.classList.add('empty');
    updatePips();
    hideBubble();
  });

  // ── Option pills ──────────────────────────────────────────
  document.querySelectorAll('.opt-pills').forEach((group) => {
    const opt = group.dataset.opt;
    group.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.val;
        group.querySelectorAll('button').forEach(b => b.classList.remove('on'));
        btn.classList.add('on');
        state.options[opt] = val;
        // Re-show bubble with new copy if open
        if (state.bubbleStop) {
          const c = COPY[state.options.copy][state.bubbleStop.id];
          speechPlace.textContent = c.place;
          speechText.textContent = c.text;
          if (!state.collected.has(state.bubbleStop.id)) {
            // ensure btn visible
            speechBtn.style.display = 'inline-block';
          }
          readoutPlace.textContent = c.place;
          readoutText.textContent = c.text;
        }
        // Toggle dusk background
        const screen = document.getElementById('game-screen');
        screen.classList.toggle('dusk', state.options.time === 'dusk');
      });
    });
  });

  // Sound toggle
  const soundBtn = document.getElementById('sound-toggle');
  soundBtn.addEventListener('click', () => {
    state.sound = !state.sound;
    soundBtn.textContent = state.sound ? '♪' : '×';
    soundBtn.classList.toggle('muted', !state.sound);
    if (state.sound) ensureAudio();
  });

  // Kick off
  loop();
})();
