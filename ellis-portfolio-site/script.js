(function(){
  'use strict';

  // Respect reduced motion
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Helpers
  function lerp(a,b,t){return a+(b-a)*t}

  // Elements to warp
  const warpSelector = '.glass, .card, .thumb, .showcase-main, .hero-top';
  const warpEls = Array.from(document.querySelectorAll(warpSelector));

  // assign default depth weights when not present
  warpEls.forEach(el=>{
    if(!el.dataset.warpDepth){
      if(el.classList.contains('card')) el.dataset.warpDepth = '1.6';
      else if(el.classList.contains('thumb')) el.dataset.warpDepth = '2.2';
      else if(el.classList.contains('showcase-main')) el.dataset.warpDepth = '1.0';
      else el.dataset.warpDepth = '1.0';
    }
    el.style.willChange = 'transform';
  });

  let lastY = window.scrollY, lastTime = performance.now(), vel = 0, smoothVel = 0;

  function onScroll(){
    const now = performance.now();
    const y = window.scrollY;
    const dt = Math.max(16, now - lastTime);
    const instant = (y - lastY) / dt; // px per ms
    // scale to px per frame-ish
    vel = instant * 16;
    lastY = y; lastTime = now;
  }

  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', ()=>{ /* layout may change */ }, {passive:true});

  function raf(){
    // ultra-subtle smoothing for near-static surface tension
    smoothVel = lerp(smoothVel, vel, 0.03);

    // apply transforms
    const vh = window.innerHeight || 1;
    warpEls.forEach(el=>{
      const rect = el.getBoundingClientRect();
      const centerY = rect.top + rect.height/2;
      const dist = (centerY - vh/2) / (vh/2); // -1..1
      const depth = parseFloat(el.dataset.warpDepth || 1);

      // dialed way down: very slight, surface-tension feel
      const speedEffect = smoothVel * depth * 0.5; // minimal amplify
      const translateY = -dist * depth * 1.2 + speedEffect; // tiny parallax + speed
      const rotateX = dist * depth * 0.3 - smoothVel * 0.05;
      const skewY = smoothVel * depth * 0.08;
      const scale = 1 + Math.abs(smoothVel) * depth * 0.0002;

      // very tight clamps for minimal movement
      const tY = Math.max(-6, Math.min(6, translateY));
      const rX = Math.max(-0.8, Math.min(0.8, rotateX));
      const sY = Math.max(-0.4, Math.min(0.4, skewY));

      // apply
      if(!reduce) el.style.transform = `perspective(900px) translate3d(0, ${tY}px, 0) rotateX(${rX}deg) skewY(${sY}deg) scale(${scale})`;
    });

    // subtle background parallax
    const bg = document.querySelector('.bg-gradient');
    if(bg && !reduce){
      bg.style.transform = `translateY(${smoothVel * -2}px)`;
    }

    // decay velocity toward 0 (strong damping for quick calm)
    vel = lerp(vel, 0, 0.18);

    requestAnimationFrame(raf);
  }

  // Kick off
  requestAnimationFrame(raf);

  // scroll helper referenced inline in HTML
  window.scrollToSection = function(id){
    const el = document.getElementById(id);
    if(!el) return;
    el.scrollIntoView({behavior:'smooth',block:'start'});
  };

  // Hobby modal interactions (handled by morphing implementation later)


  // small startup animation
  window.addEventListener('load', ()=>{
    document.body.style.transition = 'opacity .4s ease';
    document.body.style.opacity = '1';
  });

})();

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

// Smooth scroll for nav links and close mobile panel on click
document.querySelectorAll('.nav-links a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    e.preventDefault();
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
    // close mobile nav if open
    if(nav && nav.classList.contains('open')){
      nav.classList.remove('open');
      if(navToggle) navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

// Contact form handler: opens user's mail client prefilled to contact@ellisbrocklesby.com
const contactForm = document.getElementById('contactForm');
if(contactForm){
  contactForm.addEventListener('submit', function(e){
    e.preventDefault();
    const from = document.getElementById('fromEmail').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    if(!from || !subject || !message){
      alert('Please complete all fields before sending.');
      return;
    }

    const to = 'contact@ellisbrocklesby.com';
    const body = encodeURIComponent('From: ' + from + '\n\n') + encodeURIComponent(message);
    const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${body}`;
    // open mail client
    window.location.href = mailto;
  });
}


// Hobby modal behavior
const hobbies = document.querySelectorAll('.hobby');
const overlay = document.getElementById('overlay');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');

if(hobbies.length){
  hobbies.forEach(h => {
    h.addEventListener('click', ()=>{
      const title = h.dataset.title || h.textContent.trim();
      const content = h.dataset.content || '';
      morphOpen(h, title, content);
    });
  });
}

// overlay click is handled per interaction (morph/modal) to avoid conflicts

// Close morphs / overlay on Escape
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape'){
    const morphs = document.querySelectorAll('.morph-card');
    morphs.forEach(m => { if(m.parentNode) m.parentNode.removeChild(m); });
    const ov = document.getElementById('overlay'); if(ov){ ov.classList.remove('open'); ov.hidden = true; }
    document.body.style.overflow = '';
  }
});

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