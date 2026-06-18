# Project Archive

This file stores snapshots of important files. Newest snapshot at the top.

## Snapshot: 2026-06-18  (index.html)

```
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Ellis | VFX Portfolio</title>

<link rel="stylesheet" href="styles.css">
</head>

<body>

<!-- BACKGROUND LAYERS -->
<div class="bg-gradient"></div>
<div class="bg-noise"></div>

<!-- ================= NAV ================= -->
<header class="nav">
  <div class="logo">ELLIS</div>

  <button class="nav-toggle" aria-label="Open menu">☰</button>
  <nav class="nav-links">
    <a href="#hero">Home</a>
    <a href="#about">About</a>
    <a href="#work">Work</a>
    <a href="#education">Education</a>
    <a href="#hobbies">Hobbies</a>
    <a href="#contact">Contact</a>
  </nav>
</header>

<!-- ================= HERO ================= -->
<section id="hero" class="hero">
  <div class="hero-content">

    <div class="hero-top">
      <h1>VFX • CGI • CAD Artist</h1>
      <p class="tagline">Building worlds in Blender, CAD, and code.</p>
    </div>

    <div class="profile-card glass">
      <div class="avatar-wrap">
        <img src="assets/profile.jpg" alt="Ellis" class="avatar" onerror="this.style.display='none'">
        <div class="avatar-fallback">E</div>
      </div>
      <div class="profile-info">
        <strong>Ellis</strong>
        <p class="lorem">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Student & VFX artist focused on 3D, CAD, and experimental systems.</p>
        <div class="hero-buttons">
          <button onclick="scrollToSection('work')">View Work</button>
          <button onclick="scrollToSection('contact')">Contact</button>
        </div>
      </div>
    </div>

  </div>

  <div class="hero-glow"></div>
</section>

<!-- ================= ABOUT ================= -->
<section id="about" class="section glass">
  <h2>About</h2>
  <p class="lorem">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.
    Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris.
  </p>
</section>

<!-- ================= WORK ================= -->
<section id="work" class="section">
  <h2>Showcase — CGI / VFX / CAD</h2>

  <div class="showcase glass">
    <div class="showcase-main placeholder">
      <div style="padding:16px" class="lorem">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus fermentum in, dolor. Pellentesque facilisis. Nulla imperdiet sit amet magna.</div>
    </div>
    <div class="showcase-side">
      <div class="thumb placeholder"></div>
      <div class="thumb placeholder"></div>
      <div class="thumb placeholder"></div>
    </div>
  </div>
</section>

<!-- ================= EDUCATION ================= -->
<section id="education" class="section glass">
  <h2>Education</h2>

  <div class="timeline">
    <div class="dot">Level 2 NZQA</div>
    <div class="dot">Tech Focus: VFX + Design</div>
    <div class="dot">Future: Advanced CGI / Industry Pathway</div>
  </div>
</section>

<!-- ================= HOBBIES ================= -->
<section id="hobbies" class="section">
  <h2>Hobbies</h2>

  <div class="grid hobbies-grid">

    <button class="card glass hobby" data-title="PC Building" data-content="Building custom PCs, cooling, and benchmarking.">PC Building</button>
    <button class="card glass hobby" data-title="Servers & Linux" data-content="Home labs, Linux servers, networking and container setups.">Servers & Linux</button>
    <button class="card glass hobby" data-title="Speed Cubing" data-content="Competitive cubing and algorithms practice.">Speed Cubing</button>
    <button class="card glass hobby" data-title="3D Printing" data-content="Designing and printing functional parts and prototypes.">3D Printing</button>
    <button class="card glass hobby" data-title="Karate" data-content="Training and discipline in martial arts.">Karate</button>

  </div>
</section>

<!-- Modal / overlay for hobby details -->
<div id="overlay" class="overlay" hidden></div>
<div id="modal" class="modal" role="dialog" aria-modal="true" hidden>
  <button id="modalClose" class="modal-close" aria-label="Close">✕</button>
  <h3 id="modalTitle"></h3>
  <div id="modalContent"></div>
</div>

<!-- ================= CONTACT ================= -->
<section id="contact" class="section glass">
  <h2>Contact</h2>
  <p class="lorem">email@example.com — Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent libero.</p>
</section>

<footer>
  <p>© Ellis Portfolio</p>
</footer>

<script src="script.js"></script>
</body>
</html>
```


## Snapshot: 2026-06-18  (styles.css)

```
/* ================= BASE ================= */

body {
  margin: 0;
  font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  background: #05070f;
  color: #edf2ff;
  overflow-x: hidden;
  -webkit-font-smoothing:antialiased;
}

/* ================= BACKGROUND ================= */

.bg-gradient {
  position: fixed;
  inset: 0;
  background: radial-gradient(1000px circle at 10% 20%, #2b2fff33, transparent 25%),
              radial-gradient(800px circle at 90% 80%, #8a2be233, transparent 25%),
              linear-gradient(180deg,#050514 0%, #07122a 100%);
  z-index: -2;
}

.bg-noise {
  position: fixed;
  inset: 0;
  background-image: url("https://cdn.jsdelivr.net/gh/stephband/grainy-gradients@main/noise.svg");
  opacity: 0.12;
  z-index: -1;
}

/* ================= NAV ================= */

.nav {
  position: fixed;
  top: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  z-index: 60;
}

.logo { font-weight:700; letter-spacing:2px }

.nav-toggle {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.08);
  color: #fff;
  padding: 8px 12px;
  border-radius: 10px;
  backdrop-filter: blur(8px);
}

.nav-links {
  display: none;
  gap: 12px;
}

.nav-links a {
  color: #e9f0ff;
  text-decoration: none;
  opacity: 0.9;
  padding: 8px 10px;
  border-radius: 8px;
}

.nav-links a.active{ background: rgba(255,255,255,0.06); box-shadow: 0 6px 20px rgba(2,6,23,0.45) }

.nav.open .nav-links { display:flex }

/* ================= HERO ================= */

.hero {
  min-height: 84vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  padding: 40px 18px;
  background-image: radial-gradient(circle at 20% 30%, rgba(106,92,255,0.06), transparent 20%);
  background-size: cover;
}

.hero-top h1 { font-size: clamp(1.6rem,4vw,2.6rem); margin:0 }
.tagline { opacity:0.85; margin-top:6px }

.hero-glow {
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #6a5cff, transparent);
  filter: blur(80px);
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%,100% { transform: translateY(0px); }
  50% { transform: translateY(-30px); }
}

/* ================= GLASS ================= */

.glass {
  position: relative;
  background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(10px) saturate(120%);
  border-radius: 14px;
  overflow: hidden;
}

.glass::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(600px circle at 10% 10%, rgba(255,255,255,0.03), transparent 20%),
              linear-gradient(180deg, rgba(255,255,255,0.01), transparent 60%);
  mix-blend-mode: overlay;
  pointer-events: none;
}

.glass.liquid::after {
  content: "";
  position: absolute;
  left: -30%;
  top: -40%;
  width: 160%;
  height: 160%;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.05), transparent 20%);
  transform: rotate(-12deg);
  filter: blur(18px);
  opacity: 0.6;
}

/* ================= SECTIONS ================= */

.section {
  padding: 48px 18px;
  max-width: 1100px;
  margin: auto;
}

/* ================= GRID ================= */

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 14px;
}

.card {
  padding: 20px;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-10px);
}

/* ================= PLACEHOLDER ================= */

.placeholder {
  height: 120px;
  margin-top: 10px;
  background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
  border-radius: 10px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.02);
}

/* ================= TIMELINE ================= */

.timeline {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.dot {
  padding: 10px;
  border-left: 2px solid #6a5cff;
  padding-left: 15px;
}

/* ================= FOOTER ================= */

footer {
  text-align: center;
  padding: 40px;
  opacity: 0.6;
}

/* Profile card inside hero */
.profile-card {
  display:flex;
  gap:12px;
  align-items:center;
  padding:14px;
  max-width:520px;
  margin:18px auto 0;
}
.avatar-wrap{width:72px;height:72px;flex:0 0 72px;border-radius:12px;overflow:hidden;position:relative;background:linear-gradient(135deg,#6a5cff,#8a2be2);display:flex;align-items:center;justify-content:center}
.avatar{width:100%;height:100%;object-fit:cover;display:block}
.avatar-fallback{position:absolute;color:white;font-weight:700;font-size:28px}
.profile-info p{margin:6px 0 0;font-size:0.9rem;opacity:0.95}
.hero-buttons{display:flex;gap:10px;margin-top:10px}
.hero-buttons button{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.06);color:white;padding:8px 12px;border-radius:10px}

/* Showcase */
.showcase{display:flex;gap:12px;padding:12px}
.showcase-main{flex:2;min-height:220px}
.showcase-side{flex:1;display:flex;flex-direction:column;gap:10px}
.thumb{height:66px}

/* Hobbies as clickable cards */
.hobbies-grid .card{cursor:pointer;text-align:center;padding:18px}

/* Modal + overlay */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(6px);z-index:120;display:flex;align-items:center;justify-content:center}
.modal{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:130;max-width:520px;width:92%;background:linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01));border-radius:12px;padding:18px;box-shadow:0 8px 30px rgba(2,6,23,0.6)}
.modal-close{position:absolute;right:12px;top:12px;background:transparent;border:none;color:#fff;font-size:18px}

/* Desktop tweaks */
@media(min-width:820px){
  .nav { top:18px; left:24px; right:24px }
  .nav-links{display:flex}
  .nav-toggle{display:none}
  .hero { padding:72px 40px }
  .hero-content{display:flex;align-items:center;justify-content:space-between;gap:24px}
  .profile-card { margin:0 }
  .showcase-main{min-height:320px}
}

/* Respect hidden attribute so overlay isn't visible by default */
.overlay[hidden], .modal[hidden] { display: none !important; opacity: 0; pointer-events: none }

/* Modal open animation: magic lamp pop */
.overlay.open{ animation: fadeInOverlay 220ms ease both }
.modal.open{ animation: magicLamp 420ms cubic-bezier(.2,.9,.3,1) both }

@keyframes fadeInOverlay {
  from { opacity: 0 }
  to { opacity: 1 }
}

@keyframes magicLamp {
  0% { transform: translate(-50%,-40%) scale(0.85) rotate(-6deg); opacity: 0 }
  60% { transform: translate(-50%,-52%) scale(1.03) rotate(2deg); opacity: 1 }
  100% { transform: translate(-50%,-50%) scale(1) rotate(0deg); opacity: 1 }
}

/* Wobble tiles: subtle continuous motion + pointer-driven momentum */
.card{ --tx:0; --ty:0; --r:0; transform: translate3d(var(--tx), var(--ty), 0) rotate(var(--r)); transition: transform 350ms cubic-bezier(.2,.9,.3,1) }
.card.wobble { animation: slowWobble 6s ease-in-out infinite }

@keyframes slowWobble{
  0%{ transform: translate3d(0,0,0) rotate(-0.3deg) }
  50%{ transform: translate3d(0.6px,-1px,0) rotate(0.4deg) }
  100%{ transform: translate3d(0,0,0) rotate(-0.3deg) }
}

/* Liquid sheen hover */
.glass:hover::after{ transform: translateX(12%) rotate(-8deg); opacity:0.85 }

/* Mobile full-screen nav when open */
.nav.open .nav-links{
  position:fixed; inset:72px 16px 24px 16px; display:flex; flex-direction:column; gap:18px; align-items:center; justify-content:center; background:linear-gradient(180deg, rgba(6,10,26,0.85), rgba(6,10,26,0.95)); border-radius:14px; padding:18px; box-shadow: 0 18px 60px rgba(2,6,23,0.6);
  animation: panelIn 300ms cubic-bezier(.2,.9,.3,1) both;
}

@keyframes panelIn{ from{ transform: translateY(8px); opacity:0 } to{ transform:none; opacity:1 } }

/* depth */
.card{ box-shadow: 0 6px 24px rgba(2,6,23,0.5) }

/* Text placeholders */
.lorem{ color: rgba(255,255,255,0.85); opacity:0.95; line-height:1.4 }

/* Morphing card (button -> full tile) */
.morph-card{
  position:fixed; z-index:140; left:0; top:0; width:100px; height:40px; border-radius:12px;
  background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
  box-shadow: 0 18px 60px rgba(2,6,23,0.6);
  overflow:hidden; display:flex; flex-direction:column; transition: all 420ms cubic-bezier(.2,.9,.3,1);
}
.morph-inner{ padding:18px; color: #f2f6ff; display:flex; flex-direction:column; gap:8px; }
.morph-title{ font-size:1.05rem; font-weight:700; transform-origin:left top; transition: transform 320ms cubic-bezier(.2,.9,.3,1); }
.morph-content{ opacity:0; transform: translateY(8px); transition: opacity 240ms ease, transform 240ms ease; color: rgba(255,255,255,0.9) }
.morph-content.show{ opacity:1; transform:none }
.morph-close{ margin-left:auto;background:transparent;border:none;color:#fff;font-size:18px }

```

## Snapshot: 2026-06-18  (script.js)

```
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({
    behavior: "smooth"
  });
}

/* scroll reveal animation */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.style.opacity = 1;
      entry.target.style.transform = "translateY(0px)";
    }
  });
});

document.querySelectorAll(".card, .section").forEach(el => {
  el.style.opacity = 0;
  el.style.transform = "translateY(30px)";
  el.style.transition = "all 0.6s ease";
  observer.observe(el);
});

// Navigation toggle (mobile)
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');
if(navToggle){
  navToggle.addEventListener('click', ()=>{
    const opened = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
  });
}

// Hobby modal behavior
const hobbies = document.querySelectorAll('.hobby');
const overlay = document.getElementById('overlay');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');

function openModal(title, content){
  modalTitle.textContent = title;
  modalContent.textContent = content;
  overlay.hidden = false;
  modal.hidden = false;
  // add animation classes
  requestAnimationFrame(()=>{
    overlay.classList.add('open');
    modal.classList.add('open');
  });
  document.body.style.overflow = 'hidden';
}

function closeModal(){
  overlay.classList.remove('open');
  modal.classList.remove('open');
  // wait for animation out then hide
  setTimeout(()=>{
    overlay.hidden = true;
    modal.hidden = true;
    document.body.style.overflow = '';
  }, 260);
}

if(hobbies.length){
  hobbies.forEach(h => {
    h.addEventListener('click', ()=>{
      const title = h.dataset.title || h.textContent.trim();
      const content = h.dataset.content || '';
      morphOpen(h, title, content);
    });
  });
}

if(overlay) overlay.addEventListener('click', closeModal);
if(modalClose) modalClose.addEventListener('click', closeModal);

document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape') closeModal();
});

// Give cards subtle pointer-driven wobble momentum
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
  // add gentle continuous wobble
  card.classList.add('wobble');

  let lastX = 0, lastY = 0, vx = 0, vy = 0;
  card.addEventListener('pointermove', e=>{
    const rect = card.getBoundingClientRect();
    const cx = e.clientX - (rect.left + rect.width/2);
    const cy = e.clientY - (rect.top + rect.height/2);
    const tx = Math.max(Math.min(cx/12, 8), -8);
    const ty = Math.max(Math.min(cy/18, 6), -6);
    const r = tx/6;
    card.style.setProperty('--tx', tx+'px');
    card.style.setProperty('--ty', ty+'px');
    card.style.setProperty('--r', r+'deg');
    lastX = tx; lastY = ty;
  });
  card.addEventListener('pointerleave', ()=>{
    card.style.setProperty('--tx','0px');
    card.style.setProperty('--ty','0px');
    card.style.setProperty('--r','0deg');
  });
});

// Highlight nav links based on visible section
const sectionObserver = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    const id = entry.target.id;
    const link = document.querySelector('.nav-links a[href="#'+id+'"]');
    if(link){
      if(entry.isIntersecting){
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
},{ threshold: 0.56 });

document.querySelectorAll('section[id]').forEach(s=> sectionObserver.observe(s));

// Morphing open/close implementation for hobby buttons
function morphOpen(button, title, content){
  // compute start rect
  const rect = button.getBoundingClientRect();
  const start = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
  // target size (centered)
  const targetW = Math.min(window.innerWidth * 0.96, 920);
  const targetH = Math.min(window.innerHeight * 0.86, 720);
  const targetLeft = (window.innerWidth - targetW)/2;
  const targetTop = Math.max(18, (window.innerHeight - targetH)/6);

  // create morph element
  const el = document.createElement('div');
  el.className = 'morph-card glass';
  el.style.left = start.left + 'px';
  el.style.top = start.top + 'px';
  el.style.width = start.width + 'px';
  el.style.height = start.height + 'px';
  el.style.borderRadius = getComputedStyle(button).borderRadius || '12px';

  const inner = document.createElement('div'); inner.className = 'morph-inner';
  const h = document.createElement('div'); h.className = 'morph-title'; h.textContent = title;
  const closeBtn = document.createElement('button'); closeBtn.className = 'morph-close'; closeBtn.textContent = '✕';
  const contentDiv = document.createElement('div'); contentDiv.className = 'morph-content'; contentDiv.textContent = content + '\n\nLorem ipsum dolor sit amet, consectetur.';

  inner.appendChild(h);
  inner.appendChild(closeBtn);
  inner.appendChild(contentDiv);
  el.appendChild(inner);
  document.body.appendChild(el);

  // show overlay behind morph
  overlay.hidden = false;
  overlay.classList.add('open');

  // force reflow then animate to target
  requestAnimationFrame(()=>{
    el.style.left = targetLeft + 'px';
    el.style.top = targetTop + 'px';
    el.style.width = targetW + 'px';
    el.style.height = targetH + 'px';
    el.style.borderRadius = '14px';
  });

  // after transition, reveal content
  const onEnd = (e)=>{
    if(e.target !== el) return;
    el.removeEventListener('transitionend', onEnd);
    h.style.transform = 'scale(1.06)';
    setTimeout(()=> h.style.transform = 'scale(1)');
    contentDiv.classList.add('show');
    document.body.style.overflow = 'hidden';
  };
  el.addEventListener('transitionend', onEnd);

  function closeMorph(){
    contentDiv.classList.remove('show');
    // animate back
    el.style.left = start.left + 'px';
    el.style.top = start.top + 'px';
    el.style.width = start.width + 'px';
    el.style.height = start.height + 'px';
    overlay.classList.remove('open');
    // after return animation remove
    el.addEventListener('transitionend', ()=>{
      if(el && el.parentNode) el.parentNode.removeChild(el);
      overlay.hidden = true;
      document.body.style.overflow = '';
    }, { once: true });
  }

  closeBtn.addEventListener('click', closeMorph);
  overlay.addEventListener('click', closeMorph, { once: true });
}

```

---

_New snapshots will be prepended here on future changes._
