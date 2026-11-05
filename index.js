// Puissance 4 : Aligne 4 jetons avant l'autre : contre l'ordinateur (3 niveaux) ou à deux sur le même écran, en pixel art.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Puissance 4</span><span class="hint">Clic sur une colonne · ← → puis Entrée · R : rejouer</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="p4Canvas" width="224" height="230"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>PARTIE</b>
        <div class="row"><button class="tab" id="p4M1">CONTRE L'ORDI</button><button class="tab" id="p4M2">À DEUX</button></div>
        <div class="row" id="p4Lv"><button class="tab" data-lv="1">FACILE</button><button class="tab" data-lv="2">NORMAL</button><button class="tab" data-lv="3">DIFFICILE</button></div>
        <div class="row"><button class="btn main" id="p4New">NOUVELLE PARTIE</button><button class="btn" id="p4Undo">ANNULER</button></div></div>
      <div class="sysCard"><b>BILAN</b><div class="gStats" id="p4Stats"></div></div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:2;min-width:320px;position:relative}
.gameBox canvas{width:100%;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}
.gameBox canvas{max-width:640px;aspect-ratio:224/230}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}


export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: 'PUISSANCE 4', T: { k: '#05061a', k2: '#0a0d2c', fill: '#101640', fillOn: '#18215c', hl: '#1d2a6e', line: '#2c3c94', acc: '#ffd23f', accL: '#fff1a8', accS: '#c99a14', accD: '#5a4206',
  rivet: '#fff7d1', btn: '#1d2a6e', btnHi: '#3a52c4', btnLo: '#0c1240', btnHov: '#27389a', btnHovHi: '#5571e6', text: '#eef1ff', muted: '#8f9ad8', acc2: '#ff4f6a', gold: '#ffd23f',
  orange: '#ff9a3c', red: '#ff4f6a', green: '#5ef0a8', green2: '#1f9a64', bg: '#070a24', bgDot: '#18215c', bgDot2: '#0e1440', spark: '#2c3c94', spark2: '#fff1a8',
  tile: ['................', '......:.........', '................', '................', '..+.............', '................', '...........:....', '................',
    '................', '....:...........', '................', '..............+.', '................', '........:.......', '................', '................'] },
  emblem: ['..kkkkkkkkkkk..', '.kbbbbbbbbbbbk.', 'kbbbbbbbbbbbbbk', 'kb.r.bb.g.bb.bk', 'kbrrrbbgggbb.bk', 'kb.r.bb.g.bb.bk', 'kbbbbbbbbbbbbbk', 'kb.g.bb.r.bb.bk', 'kbgggbbrrrbb.bk', 'kb.g.bb.r.bb.bk', 'kbbbbbbbbbbbbbk', '.kbbbbbbbbbbbk.', '..kkkkkkkkkkk..'],
  icons: [[/^NOUVELLE/, 'play'], [/^ANNULER/, 'down'], [/^BILAN/, 'crown'], [/^PARTIE/, 'star']] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const games = { best: {}, ...(await doc('games')) };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (b == null || v > b) { games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel, sur une bande sombre
  g.fillStyle = 'rgba(11,3,28,.72)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
  lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };

const clock = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');

/* ---------- Puissance 4 : 7 colonnes, 6 lignes. L'ordinateur : negamax avec élagage alpha-bêta, profondeur 2 / 4 / 6 selon le niveau ---------- */
const P4 = {W: 224, H: 230, C: 28, X0: 14, Y0: 34, COLS: 7, ROWS: 6};
const P4_LV = {1: 'Facile', 2: 'Normal', 3: 'Difficile'};
const p4s = gstore('p4', {mode: 1, lv: 2, stats: {}});
let p4 = null;
const p4New = () => {  // le même objet d'une partie à l'autre (la boucle de jeu le garde) ; on commence chacun son tour
  p4 = Object.assign(p4 || {tick: 0, mode: 'play', raf: 0, hover: 3, nextFirst: 1}, {b: Array.from({length: P4.COLS}, () => []), hist: [], win: null, over: false, anim: null, think: false, gen: (p4?.gen || 0) + 1});
  p4.first = p4.turn = p4.nextFirst; p4.nextFirst = 3 - p4.first; p4Info(); if (p4s.mode === 1 && p4.turn === 2) p4Cpu();
};
const at = (b, c, r) => b[c][r] || 0;
function p4Wins(b, c) {  // le jeton du haut de la colonne c fait-il un 4 ? -> les 4 cases ou null
  const r = b[c].length - 1, p = b[c][r];
  for (const [dc, dr] of [[1, 0], [0, 1], [1, 1], [1, -1]]) {
    const line = [[c, r]];
    for (const s of [1, -1]) for (let k = 1; k < 4; k++) { const x = c + dc * k * s, y = r + dr * k * s; if (x < 0 || x >= P4.COLS || y < 0 || y >= P4.ROWS || at(b, x, y) !== p) break; line.push([x, y]); }
    if (line.length >= 4) return line;
  }
  return null;
}
function p4Eval(b, p) {  // la valeur d'une position pour p : fenêtres de 4 cases encore possibles, le centre compte double
  let s = 0; const o = 3 - p;
  for (let r = 0; r < P4.ROWS; r++) if (at(b, 3, r) === p) s += 3; else if (at(b, 3, r) === o) s -= 3;
  const win = cells => { let a = 0, e = 0; for (const [c, r] of cells) { const v = at(b, c, r); if (v === p) a++; else if (v === o) e++; } if (a && e) return 0; return a === 3 ? 5 : a === 2 ? 2 : e === 3 ? -4 : e === 2 ? -1 : 0; };
  for (let c = 0; c < P4.COLS; c++) for (let r = 0; r < P4.ROWS; r++) for (const [dc, dr] of [[1, 0], [0, 1], [1, 1], [1, -1]]) {
    const ec = c + dc * 3, er = r + dr * 3; if (ec >= P4.COLS || er < 0 || er >= P4.ROWS) continue;
    s += win([0, 1, 2, 3].map(k => [c + dc * k, r + dr * k]));
  }
  return s;
}
const ORDER = [3, 2, 4, 1, 5, 0, 6];
function negamax(b, p, d, a, be) {
  let moves = ORDER.filter(c => b[c].length < P4.ROWS); if (!moves.length) return 0;
  if (d === 0) return p4Eval(b, p);
  let bestv = -1e9;
  for (const c of moves) {
    b[c].push(p); const w = p4Wins(b, c); const v = w ? 1000 + d : -negamax(b, 3 - p, d - 1, -be, -a); b[c].pop();
    if (v > bestv) bestv = v; if (v > a) a = v; if (a >= be) break;
  }
  return bestv;
}
function p4Best(b, p, lv) {
  const d = {1: 2, 2: 4, 3: 6}[lv], moves = ORDER.filter(c => b[c].length < P4.ROWS); let bc = moves[0], bv = -1e9;
  for (const c of moves) { b[c].push(p); const v = p4Wins(b, c) ? 1e6 : -negamax(b, 3 - p, d - 1, -1e9, 1e9); b[c].pop(); if (v > bv) { bv = v; bc = c; } }
  if (lv === 1 && Math.random() < .3) bc = moves[Math.floor(Math.random() * moves.length)];  // Facile se trompe parfois
  return bc;
}
function p4Drop(c) {
  if (!p4 || p4.over || p4.anim || p4.b[c].length >= P4.ROWS) return false;
  const r = p4.b[c].length; p4.anim = {c, r, p: p4.turn, y: -1, v: 0}; p4Beep(220 + 40 * r, .05); return true;
}
function p4Land() {
  const {c, r, p} = p4.anim; p4.anim = null; p4.b[c].push(p); p4.hist.push(c); p4Beep(140, .08, 'square');
  const w = p4Wins(p4.b, c), full = p4.b.every(col => col.length >= P4.ROWS);
  if (w || full) {
    p4.over = true; p4.win = w ? {p, line: w} : {p: 0, line: []};
    const key = p4s.mode === 2 ? 'deux' : P4_LV[p4s.lv], st = p4s.stats[key] ??= {v: 0, d: 0, n: 0};
    if (p4s.mode === 1) { if (!w) st.n++; else if (p === 1) st.v++; else st.d++; } else { if (!w) st.n++; else if (p === 1) st.v++; else st.d++; }
    saveGames(); p4Beep(w ? 660 : 300, .25, 'triangle'); p4Info(); return;
  }
  p4.turn = 3 - p; p4Info();
  if (p4s.mode === 1 && p4.turn === 2) p4Cpu();
}
function p4Cpu() { p4.think = true; const gen = p4.gen; setTimeout(() => { if (!p4 || p4.over || p4.gen !== gen) return; const c = p4Best(p4.b.map(x => x.slice()), 2, p4s.lv); p4.think = false; p4Drop(c); }, 380); }
let p4ac = null;
function p4Beep(f, d, type = 'sine') { try { p4ac ??= new AudioContext(); const o = p4ac.createOscillator(), g = p4ac.createGain(), t = p4ac.currentTime; o.type = type; o.frequency.value = f; g.gain.setValueAtTime(.08, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(p4ac.destination); o.start(t); o.stop(t + d + .02); } catch {} }
function p4Update() {
  p4.tick++;
  if (p4.anim) { const a = p4.anim, target = P4.ROWS - 1 - a.r; a.v = Math.min(.5, a.v + .04); a.y += a.v; if (a.y >= target) p4Land(); }
}
const P4_COL = {1: ['#ff4f6a', '#ffb3c0', '#a3203a', '#5c0f20'], 2: ['#ffd23f', '#fff1a8', '#c99a14', '#5a4206']};
function p4Disc(g, x, y, p, glow) {  // un jeton 24 px dessiné à la main : bord sombre, face, reflet, creux central
  const [m, l, s, d] = P4_COL[p], R = ['....kkkk....', '..kkmmmmkk..', '.kmllmmmmmk.', '.kmlmmmmmsk.', 'kmlmmssmmmsk', 'kmmmsmmsmmsk', 'kmmmsmmsmmsk', 'kmmmmssmmmsk', '.kmmmmmmmsk.', '.kmmmmmmssk.', '..kkssssk...', '....kkkk....'];
  const pal = {k: d, m, l, s}; R.forEach((row, j) => { for (let i = 0; i < 12; i++) { const c = pal[row[i]]; if (c) px(g, c, x + i * 2, y + j * 2, 2, 2); } });  // 12 × 12 pixels d'art, tracés en 2 × 2
  if (glow) { g.globalAlpha = .35 + .3 * Math.sin(p4.tick / 5); g.fillStyle = '#ffffff'; for (const [a, b, w, h] of [[8, 2, 8, 20], [2, 8, 20, 8], [4, 4, 16, 16]]) g.fillRect(x + a, y + b, w, h); g.globalAlpha = 1; }
}
function p4Draw() {
  const g = p4.g, {C, X0, Y0} = P4;
  g.fillStyle = '#070a24'; g.fillRect(0, 0, P4.W, P4.H);
  for (let i = 0; i < 40; i++) px(g, i % 3 ? '#121a4a' : '#1d2a6e', (i * 53) % P4.W, (i * 29) % 30);
  // le jeton qui attend au-dessus de la colonne
  const human = !p4.over && !p4.anim && !p4.think && !(p4s.mode === 1 && p4.turn === 2);
  if (human) { const bob = Math.round(Math.sin(p4.tick / 8) * 2); p4Disc(g, X0 + p4.hover * C + 2, 6 + bob, p4.turn); }
  // les jetons posés, dessinés derrière la grille (on les voit par les trous)
  for (let c = 0; c < P4.COLS; c++) for (let r = 0; r < p4.b[c].length; r++) {
    const glow = p4.win?.line.some(([x, y]) => x === c && y === r); p4Disc(g, X0 + c * C + 2, Y0 + (P4.ROWS - 1 - r) * C + 2, p4.b[c][r], glow);
  }
  if (p4.anim) p4Disc(g, X0 + p4.anim.c * C + 2, Y0 + p4.anim.y * C + 2, p4.anim.p);
  // la grille : un cadre bleu percé de trous ronds, ombré à droite et en bas
  const grid = p4.grid ??= (() => {
    const c = document.createElement('canvas'); c.width = C * P4.COLS + 8; c.height = C * P4.ROWS + 12; const q = c.getContext('2d');
    q.fillStyle = '#05061a'; q.fillRect(0, 0, c.width, c.height - 4); q.fillStyle = '#2c4bd8'; q.fillRect(2, 2, c.width - 4, c.height - 8);
    q.fillStyle = '#5571e6'; q.fillRect(2, 2, c.width - 4, 2); q.fillStyle = '#1a2c96'; q.fillRect(2, c.height - 8, c.width - 4, 2); q.fillRect(c.width - 4, 2, 2, c.height - 8);
    q.fillStyle = '#0c1240'; q.fillRect(6, c.height - 4, 6, 4); q.fillRect(c.width - 12, c.height - 4, 6, 4);  // les pieds
    const hole = ['....xxxx....', '..xxxxxxxx..', '.xxxxxxxxxx.', '.xxxxxxxxxx.', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', 'xxxxxxxxxxxx', '.xxxxxxxxxx.', '.xxxxxxxxxx.', '..xxxxxxxx..', '....xxxx....'];
    for (let cc = 0; cc < P4.COLS; cc++) for (let r = 0; r < P4.ROWS; r++) {
      const hx = 4 + cc * C + 2, hy = 4 + r * C + 2;
      hole.forEach((row, j) => { for (let i = 0; i < 12; i++) if (row[i] === 'x') q.clearRect(hx + i * 2, hy + j * 2, 2, 2); });
      q.fillStyle = '#1a2c96'; q.fillRect(hx + 6, hy - 1, 12, 1); q.fillStyle = '#5571e6'; q.fillRect(hx + 6, hy + 24, 12, 1);  // relief du trou
    }
    return c;
  })();
  g.drawImage(grid, X0 - 4, Y0 - 4);
  if (human) { g.globalAlpha = .25; px(g, P4_COL[p4.turn][0], X0 + p4.hover * C, Y0 - 2, C, 2); g.globalAlpha = 1; }
  // bas : à qui le tour
  const who = p4s.mode === 1 ? (p4.turn === 1 ? 'À TOI' : 'L’ORDI RÉFLÉCHIT…') : (p4.turn === 1 ? 'TOUR DES ROUGES' : 'TOUR DES JAUNES');
  if (!p4.over) pxFont(g, who, P4.W / 2, P4.H - 4, P4_COL[p4.turn][1], 8, 'center');
  else {
    const t = !p4.win.p ? 'ÉGALITÉ' : p4s.mode === 1 ? (p4.win.p === 1 ? 'GAGNÉ !' : 'PERDU…') : (p4.win.p === 1 ? 'LES ROUGES GAGNENT' : 'LES JAUNES GAGNENT');
    gameText(g, P4.W, [[t, p4.win.p ? P4_COL[p4.win.p][1] : '#ffffff', 12], ['Clic ou R : rejouer', '#8f9ad8']], 100);
  }
}
function p4Info() {
  $('p4M1').classList.toggle('on', p4s.mode === 1); $('p4M2').classList.toggle('on', p4s.mode === 2); $('p4Lv').style.display = p4s.mode === 1 ? '' : 'none';
  for (const b of $('p4Lv').children) b.classList.toggle('on', +b.dataset.lv === p4s.lv);
  const rows = []; for (const k of [...Object.values(P4_LV), 'deux']) { const s = p4s.stats[k]; if (!s) continue; rows.push(el('span', '', k === 'deux' ? 'À deux (rouges / jaunes)' : 'Contre ' + k), el('b', '', k === 'deux' ? `${s.v} / ${s.d} · ${s.n} nuls` : `${s.v} V · ${s.d} D · ${s.n} N`)); }
  $('p4Stats').replaceChildren(...(rows.length ? rows : [el('span', 'hint', 'Aucune partie pour l’instant.')]));
}
const p4Col = e => { const r = $('p4Canvas').getBoundingClientRect(); return Math.max(0, Math.min(6, Math.floor(((e.clientX - r.left) / r.width * P4.W - P4.X0) / P4.C))); };
$('p4Canvas').onpointermove = e => { if (p4) p4.hover = p4Col(e); };
$('p4Canvas').onpointerdown = e => { if (!p4) return; if (p4.over) return p4New(); if (p4.think || (p4s.mode === 1 && p4.turn === 2)) return; p4.hover = p4Col(e); p4Drop(p4.hover); };
document.addEventListener('keydown', e => {
  if (!view.classList.contains('on') || !p4 || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
  if (e.key === 'ArrowLeft') p4.hover = Math.max(0, p4.hover - 1);
  else if (e.key === 'ArrowRight') p4.hover = Math.min(6, p4.hover + 1);
  else if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') { e.preventDefault(); if (p4.over) p4New(); else if (!p4.think && !(p4s.mode === 1 && p4.turn === 2)) p4Drop(p4.hover); }
  else if (e.key.toLowerCase() === 'r') p4New();
});
$('p4M1').onclick = () => { p4s.mode = 1; saveGames(); p4New(); };
$('p4M2').onclick = () => { p4s.mode = 2; saveGames(); p4New(); };
for (const b of $('p4Lv').children) b.onclick = () => { p4s.lv = +b.dataset.lv; saveGames(); p4New(); };
$('p4New').onclick = () => p4New();
$('p4Undo').onclick = () => {  // contre l'ordi : on annule ton coup et le sien
  if (!p4 || p4.anim || p4.think) return;
  const n = p4s.mode === 1 ? 2 : 1; for (let i = 0; i < n && p4.hist.length; i++) { const c = p4.hist.pop(); p4.b[c].pop(); }
  p4.over = false; p4.win = null; p4.turn = p4s.mode === 1 ? 1 : (p4.hist.length % 2 ? 3 - p4.first : p4.first); p4Info();
};
{  // vérification : un alignement horizontal, vertical et en diagonale est vu ; l'ordinateur gagne quand il peut, et bloque ton 4
  const B = () => Array.from({length: 7}, () => []);
  let b = B(); b[0].push(1); b[1].push(1); b[2].push(1); b[3].push(1); const h = !!p4Wins(b, 3);
  b = B(); b[2].push(2, 2, 2, 2); const v = !!p4Wins(b, 2);
  b = B(); b[0].push(1); b[1].push(2, 1); b[2].push(2, 2, 1); b[3].push(2, 2, 2, 1); const dg = !!p4Wins(b, 3);
  b = B(); b[5].push(2, 2, 2); b[0].push(1); b[1].push(1); const take = p4Best(b, 2, 2) === 5;
  b = B(); b[0].push(1); b[1].push(1); b[2].push(1); b[6].push(2); const block = p4Best(b, 2, 2) === 3;
  console.assert(h && v && dg && take && block, 'puissance 4', {h, v, dg, take, block});
}
ctx.onOpen(() => {
  if (!p4) { p4New(); p4.g = $('p4Canvas').getContext('2d'); p4.g.imageSmoothingEnabled = false; }
  gameLoop(p4, 'p4', p4Update, p4Draw); p4Info();
});
}
