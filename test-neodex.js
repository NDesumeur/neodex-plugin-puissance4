// lancé par le test « local » de NeoDex : à deux, un jeton lâché au clavier tombe, rebondit deux fois puis se pose ; une partie gagnée par les rouges,
// le plein écran et la place prise (avec NEO_SHOTS : garde des images du jeu)
module.exports = async ({ pj, js, sleep }) => {
  const key = k => pj(`document.dispatchEvent(new KeyboardEvent('keydown', {key: '${k}', bubbles: true})), 0`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('p4Canvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'puissance4-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  await pj(`window.__e = []; addEventListener('error', e => __e.push(e.message)); 0`);
  await pj(`document.getElementById('p4M2').click(), 0`); await sleep(300);
  if (await pj(`document.getElementById('p4Canvas').__p4.st().turn`) === 2) { await key('r'); await sleep(200); }  // à deux, on commence chacun son tour : une partie où les rouges commencent
  // la chute suivie image par image : la vitesse doit passer deux fois sous zéro (deux rebonds) avant que le jeton se pose
  const fall = await pj(`new Promise(ok => { const T = document.getElementById('p4Canvas').__p4, ys = []; let bounces = 0, last = 0, mid = 0;
    document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter', bubbles: true}));
    const f = () => { const a = T.st().anim; if (!a) return ok({bounces, frames: ys.length, mid, landed: T.st().b[3].length}); if (a.v < 0 && last >= 0) bounces++; last = a.v; ys.push(a.y); if (bounces === 1 && !mid) mid = a.y; requestAnimationFrame(f); }; requestAnimationFrame(f); })`);
  if (fall.bounces !== 2 || fall.landed !== 1) throw new Error('chute du jeton : ' + JSON.stringify(fall));
  // les rouges jouent la colonne 3 (déjà fait), les jaunes la 4, et ainsi de suite : 4 rouges en colonne 3
  const play = async c => { const h = await pj(`document.getElementById('p4Canvas').__p4.st().hover`); for (let i = h; i < c; i++) await key('ArrowRight'); for (let i = h; i > c; i--) await key('ArrowLeft'); await key('Enter'); for (let i = 0; i < 40 && await pj(`!!document.getElementById('p4Canvas').__p4.st().anim`); i++) await sleep(100); await sleep(100); };
  for (const c of [4, 3, 4, 3]) await play(c);
  await shot('1-partie');
  await play(4); await play(3); await sleep(700); await shot('2-gagne');
  const end = await pj(`(() => { const p = document.getElementById('p4Canvas').__p4.st(); return p.over && p.win?.p; })()`);
  if (end !== 1) throw new Error('les rouges devaient gagner : ' + end);
  await pj(`document.getElementById('p4Fs').click(), 0`); await sleep(700);
  const fs = await pj(`(() => { const c = document.getElementById('p4Canvas'), r = c.getBoundingClientRect(); return document.fullscreenElement === c.parentElement && (Math.abs(r.height - innerHeight) < 3 || Math.abs(r.width - innerWidth) < 3); })()`);
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(300);
  if (!fs) throw new Error('le plein écran ne remplit pas l\'écran');
  const L = await pj(`(() => { const r = document.getElementById('p4Canvas').getBoundingClientRect(); let s = 0; for (let e = document.getElementById('p4Canvas').parentElement; e; e = e.parentElement) s += e.scrollTop; return { bottom: Math.round(r.bottom + s), h: Math.round(r.height), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
  if (L.bottom > L.wh + 1 || L.sw > L.ww + 1 || L.h < 300) throw new Error('le jeu dépasse la fenêtre ou reste petit : ' + JSON.stringify(L));
  // à distance : un faux serveur de parties dans la page de NeoDex (WebSocket remplacé) ; l'hôte, le plugin et ctx.room sont les vrais
  await js(`(() => { window.__RealWS ??= WebSocket; window.WebSocket = class { constructor(u) { this.url = u; this.sent = []; this.readyState = 1; window.__fakeWs = this;
    setTimeout(() => this.onmessage?.({data: JSON.stringify({t: 'bienvenue', id: 'moi', host: true, joueurs: []})}), 50); }
    send(d) { this.sent.push(d); } close() { this.readyState = 3; } }; return 0; })()`);
  await pj(`document.getElementById('p4M3').click(), document.getElementById('p4Host').click(), 0`); await sleep(600);
  const n0 = await pj(`[document.getElementById('p4Canvas').__p4.net().code, document.getElementById('p4NetInfo').textContent]`);
  if (!/^[A-Z0-9]{6}$/.test(n0[0]) || !/Code de la partie/.test(n0[1])) throw new Error('création de partie : ' + JSON.stringify(n0));
  const url = await js(`__fakeWs.url`); if (!/\/v1\/salle\/[A-Z0-9]{6}\/ws\?nom=les%20rouges&jeu=neodex\.puissance4$/.test(url)) throw new Error('adresse de la salle : ' + url);
  await js(`__fakeWs.onmessage({data: JSON.stringify({t: 'arrive', id: 'ami', name: 'les jaunes'})}), 0`); await sleep(300);
  const start = await js(`__fakeWs.sent.map(s => JSON.parse(s).data)`);
  if (!start.some(m => m?.t === 'start' && m.first === 1)) throw new Error('annonce du début : ' + JSON.stringify(start));
  await key('Enter'); for (let i = 0; i < 30 && await pj(`!!document.getElementById('p4Canvas').__p4.st().anim`); i++) await sleep(100);
  const mv = await js(`__fakeWs.sent.map(s => JSON.parse(s).data).filter(m => m?.t === 'coup')`);
  if (mv.length !== 1 || mv[0].n !== 0) throw new Error('mon coup envoyé : ' + JSON.stringify(mv));
  await key('Enter'); await sleep(200);  // pas mon tour : rien ne part
  await js(`__fakeWs.onmessage({data: JSON.stringify({t: 'msg', from: 'ami', data: {t: 'coup', c: 0, n: 1}})}), 0`); await sleep(1500);
  const after = await pj(`(() => { const p = document.getElementById('p4Canvas').__p4.st(); return {c0: p.b[0].length, turn: p.turn, sent: 0}; })()`);
  const sent2 = await js(`__fakeWs.sent.map(s => JSON.parse(s).data).filter(m => m?.t === 'coup').length`);
  if (after.c0 !== 1 || after.turn !== 1 || sent2 !== 1) throw new Error("coup de l'ami : " + JSON.stringify({...after, sent2}));
  await js(`__fakeWs.onmessage({data: JSON.stringify({t: 'msg', from: 'ami', data: {t: 'coup', c: 1, n: 2}})}), 0`); await sleep(300);  // hors de son tour : ignoré
  if (await pj(`document.getElementById('p4Canvas').__p4.st().b[1].length`) !== 0) throw new Error('coup hors tour accepté');
  await js(`__fakeWs.onmessage({data: JSON.stringify({t: 'part', id: 'ami'})}), 0`); await sleep(200);
  const left = await pj(`document.getElementById('p4NetInfo').textContent`); if (!/a quitté/.test(left)) throw new Error("départ de l'ami : " + left);
  await pj(`document.getElementById('p4M1').click(), 0`); await js(`window.WebSocket = window.__RealWS, 0`);
  const errs = await pj(`window.__e.join(' | ')`); if (errs) throw new Error('erreur : ' + errs);
  return 'jeton : ' + fall.frames + ' images, 2 rebonds · rouges gagnants · à distance (partie, coups, tour, départ) · plein écran · ' + L.h + ' px dans ' + L.ww + '×' + L.wh;
};
