(function(){
  'use strict';

  // Respect reduced motion and allow user-controlled 'disable animations' override
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function reducedMotionEnabled(){
    return prefersReduce || document.documentElement.classList.contains('no-animations');
  }

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

      // apply (skip if reduced motion requested)
      if(!reducedMotionEnabled()) el.style.transform = `perspective(900px) translate3d(0, ${tY}px, 0) rotateX(${rX}deg) skewY(${sY}deg) scale(${scale})`;
    });

    // subtle background parallax
    const bg = document.querySelector('.bg-gradient');
    if(bg && !reducedMotionEnabled()){
      bg.style.transform = `translateY(${smoothVel * -2}px)`;
    }

    // decay velocity toward 0 (strong damping for quick calm)
    vel = lerp(vel, 0, 0.18);

    requestAnimationFrame(raf);
  }

  // Kick off
  requestAnimationFrame(raf);

  // expose check to global code so morphs can react
  window.reducedMotionEnabled = reducedMotionEnabled;

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
      // initialize theme from localStorage or system
      const saved = localStorage.getItem('theme');
      const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
      const useLight = saved === 'light' || (!saved && prefersLight);
      if(useLight) document.documentElement.classList.add('light-theme');
      const themeToggle = document.getElementById('themeToggle');
      if(themeToggle) themeToggle.checked = useLight;
      // initialize disable-animations toggle
      const disableToggle = document.getElementById('disableAnimationsToggle');
      const savedDisable = localStorage.getItem('disableAnimations') === '1';
      if(savedDisable) document.documentElement.classList.add('no-animations');
      if(disableToggle) disableToggle.checked = savedDisable;
      if(disableToggle) disableToggle.addEventListener('change', (e)=>{
        if(e.target.checked){
          document.documentElement.classList.add('no-animations');
          localStorage.setItem('disableAnimations','1');
          // clear JS transforms so elements rest
          document.querySelectorAll('.glass, .card, .thumb, .showcase-main, .hero-top').forEach(el=> el.style.transform = '');
          const bg = document.querySelector('.bg-gradient'); if(bg) bg.style.transform = '';
        } else {
          document.documentElement.classList.remove('no-animations');
          localStorage.removeItem('disableAnimations');
        }
      });

      // page-load reveal: stagger cards/sections unless animations are disabled
      const revealEls = document.querySelectorAll('.card, .section');
      revealEls.forEach((el, i)=> el.style.setProperty('--i', i));
      if(reducedMotionEnabled()){
        revealEls.forEach(el=>{ el.style.opacity = 1; el.style.transform = 'none'; el.classList.add('revealed'); });
      } else {
        // small delay so styles/layout settle, then add loaded which triggers stagger
        setTimeout(()=>{
          document.body.classList.add('loaded');
          // after animation end, mark elements revealed so they won't re-run
          revealEls.forEach(el=>{
            const onAnimEnd = (ev)=>{ el.classList.add('revealed'); el.removeEventListener('animationend', onAnimEnd); };
            el.addEventListener('animationend', onAnimEnd, { once: true });
          });
        }, 80);
      }
  });

})();

/* scroll reveal animation (intersection reveals when scrolled into view) */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.style.opacity = 1;
      entry.target.style.transform = "translateY(0px)";
    }
  });
});

// Stagger indices will be assigned on load; observe all revealable elements now
document.querySelectorAll('.card, .section').forEach((el, i) => {
  el.style.setProperty('--i', i);
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


// Hobby modal behavior - render from JSON and attach listeners
const overlay = document.getElementById('overlay');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');

let hobbies = [];
const hobbiesContainer = document.getElementById('hobbiesGrid') || document.querySelector('.hobbies-grid');

function renderHobbies(list){
  if(!hobbiesContainer){
    console.warn('renderHobbies: no hobbies container found');
    return;
  }
  hobbiesContainer.innerHTML = '';
  list.forEach(item=>{
    const btn = document.createElement('button');
    btn.className = 'card glass hobby';
    btn.textContent = item.title || 'Hobby';
    btn.dataset.title = item.title || '';
    btn.dataset.content = item.content || '';
    if(item.image) btn.dataset.image = item.image;
    if(item.specs) btn.dataset.specs = JSON.stringify(item.specs);
    if(item.instagram) btn.dataset.instagram = item.instagram;
    if(item.youtube) btn.dataset.youtube = item.youtube;
    hobbiesContainer.appendChild(btn);
  });
  hobbies = Array.from(document.querySelectorAll('.hobby'));
  hobbies.forEach(h => h.addEventListener('click', ()=>{
    const title = h.dataset.title || h.textContent.trim();
    const content = h.dataset.content || '';
    morphOpen(h, title, content);
  }));
}
// try to load JSON manifest for hobbies; fallback to inline or defaults
(() => {
  const src = (hobbiesContainer && hobbiesContainer.dataset && hobbiesContainer.dataset.source) ? hobbiesContainer.dataset.source : 'assets/data/hobbies.json';
  fetch(src).then(r=> r.json()).then(list=>{
    try{
      if(Array.isArray(list) && list.length) return renderHobbies(list);
      // empty manifest: render nothing and offer local file loader
      renderHobbies([]);
      attachLocalLoader(hobbiesContainer);
    }catch(err){
      console.error('renderHobbies error', err);
    }
  }).catch(err=>{
    console.warn('Failed to load hobbies.json', err);
    // Attempt to read inline JSON in the page (helps when opening via file://)
    try{
      const inpage = document.getElementById('hobbiesData');
      if(inpage){
        const parsed = JSON.parse(inpage.textContent);
        if(Array.isArray(parsed) && parsed.length){ renderHobbies(parsed); return; }
      }
    }catch(e){ console.warn('Failed to parse in-page hobbiesData', e); }
    // final fallback: minimal set
    renderHobbies([
      { title: 'PC Building', content: 'Building custom PCs, cooling, and benchmarking.', image: 'assets/hobbies/pc.jpg' },
      { title: 'Servers & Linux', content: 'Home labs, Linux servers, networking and container setups.', image: 'assets/hobbies/servers.jpg' },
      { title: 'Speed Cubing', content: 'Competitive cubing and algorithms practice.', image: 'assets/hobbies/cube.jpg' }
    ]);
  });
})();

// Add a small local-file loader UI so users can load `hobbies.json` from disk when fetch is blocked
function attachLocalLoader(container){
  if(!container) return;
  if(container.querySelector('.local-loader')) return; // already attached
  const wrap = document.createElement('div'); wrap.className = 'local-loader';
  wrap.style.marginTop = '10px'; wrap.style.display = 'flex'; wrap.style.gap = '8px'; wrap.style.alignItems = 'center';
  const info = document.createElement('div'); info.textContent = 'If hobbies are not showing, you can load a local JSON file:';
  info.style.fontSize = '0.9rem'; info.style.opacity = '0.9';
  const input = document.createElement('input'); input.type = 'file'; input.accept = '.json';
  input.title = 'Select hobbies.json';
  input.addEventListener('change', (e)=>{
    const f = e.target.files && e.target.files[0]; if(!f) return;
    const reader = new FileReader();
    reader.onload = ()=>{
      try{
        const parsed = JSON.parse(reader.result);
        if(Array.isArray(parsed) && parsed.length){ renderHobbies(parsed); }
        else alert('JSON parsed but contains no hobby entries.');
      }catch(err){ alert('Failed to parse JSON: '+err.message); }
    };
    reader.readAsText(f);
  });
  wrap.appendChild(info); wrap.appendChild(input);
  container.parentNode.insertBefore(wrap, container.nextSibling);
}

// Dock-like hover magnify for hobby buttons (works after render)
if(hobbiesContainer){
  let leaveTimer = null;
  hobbiesContainer.addEventListener('pointermove', (e)=>{
    if(reducedMotionEnabled()) return;
    if(leaveTimer){ clearTimeout(leaveTimer); leaveTimer = null; }
    const rects = hobbies.map(h=> h.getBoundingClientRect());
    const sigma = Math.max(70, window.innerWidth * 0.08);
    hobbies.forEach((h, i)=>{
      const r = rects[i]; if(!r) return;
      const cx = r.left + r.width/2;
      const dx = e.clientX - cx;
      const d = Math.abs(dx);
      const influence = Math.exp(-(d*d)/(2*sigma*sigma));
      const scale = 1 + Math.min(1.1, influence * 1.2);
      h.style.setProperty('--s', scale.toFixed(3));
    });
  }, { passive: true });

  hobbiesContainer.addEventListener('pointerleave', ()=>{
    hobbies.forEach(h=> h.style.setProperty('--s','1'));
    if(leaveTimer) clearTimeout(leaveTimer);
    leaveTimer = setTimeout(()=>{ hobbies.forEach(h=> h.style.setProperty('--s','1')); }, 120);
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

// Settings panel interactions
const settingsToggle = document.getElementById('settingsToggle');
const settingsPanel = document.getElementById('settingsPanel');
const settingsClose = document.getElementById('settingsClose');
const themeToggle = document.getElementById('themeToggle');

if(settingsToggle && settingsPanel){
  settingsToggle.addEventListener('click', ()=>{
    const isHidden = settingsPanel.hasAttribute('hidden');
    if(isHidden){
      settingsPanel.hidden = false;
      // allow layout to settle then show
      requestAnimationFrame(()=> settingsPanel.classList.add('open'));
    } else {
        // close animation then hide; if animations disabled, hide immediately
        settingsPanel.classList.remove('open');
        if(window.reducedMotionEnabled && window.reducedMotionEnabled()){
          settingsPanel.hidden = true;
        } else {
          const onEnd = (e)=>{
            if(e.target !== settingsPanel) return;
            settingsPanel.hidden = true;
            settingsPanel.removeEventListener('transitionend', onEnd);
          };
          settingsPanel.addEventListener('transitionend', onEnd);
        }
    }
  });
}
if(settingsClose && settingsPanel){
  settingsClose.addEventListener('click', ()=>{
    settingsPanel.classList.remove('open');
    if(window.reducedMotionEnabled && window.reducedMotionEnabled()){
      settingsPanel.hidden = true;
    } else {
      settingsPanel.addEventListener('transitionend', function te(){ settingsPanel.hidden = true; settingsPanel.removeEventListener('transitionend', te); }, { once: true });
    }
  });
}

// Toggle theme and persist
if(themeToggle){
  themeToggle.addEventListener('change', (e)=>{
    if(e.target.checked){
      document.documentElement.classList.add('light-theme');
      localStorage.setItem('theme','light');
    } else {
      document.documentElement.classList.remove('light-theme');
      localStorage.setItem('theme','dark');
    }
  });
}

// Robust handler for Disable Animations toggle (bind outside load to ensure it works)
(() => {
  const disableId = 'disableAnimationsToggle';
  const sel = '.glass, .card, .thumb, .showcase-main, .hero-top';
  const disable = document.getElementById(disableId);
  if(!disable) return;
  // initialize from storage if not already set by load handler
  const saved = localStorage.getItem('disableAnimations') === '1';
  disable.checked = saved;
  const applyOff = ()=>{
    document.documentElement.classList.add('no-animations');
    localStorage.setItem('disableAnimations','1');
    document.querySelectorAll(sel).forEach(el=> el.style.transform = '');
    const bg = document.querySelector('.bg-gradient'); if(bg) bg.style.transform = '';
  };
  const applyOn = ()=>{
    document.documentElement.classList.remove('no-animations');
    localStorage.removeItem('disableAnimations');
  };
  disable.addEventListener('change', (e)=>{ if(e.target.checked) applyOff(); else applyOn(); });
})();

// Close settings clicking outside
document.addEventListener('click', (e)=>{
  if(settingsPanel && !settingsPanel.hidden){
    const inside = settingsPanel.contains(e.target) || (settingsToggle && settingsToggle.contains(e.target));
    if(!inside){
      settingsPanel.classList.remove('open');
      if(window.reducedMotionEnabled && window.reducedMotionEnabled()){
        settingsPanel.hidden = true;
      } else {
        settingsPanel.addEventListener('transitionend', function te(){ settingsPanel.hidden = true; settingsPanel.removeEventListener('transitionend', te); }, { once: true });
      }
    }
  }
});

// Morphing open/close implementation for hobby buttons

/* Media carousel for showcase - loads assets/portfolio/manifest.json */
(() => {
  const slidesEl = document.getElementById('mediaSlides');
  const dotsEl = document.getElementById('mediaDots');
  const prevBtn = document.querySelector('.media-arrow.prev');
  const nextBtn = document.querySelector('.media-arrow.next');
  if(!slidesEl) return;

  let items = [];
  let index = 0;
  let autoplay = true;
  let interval = 3500;
  let timer = null;

  function render(){
    slidesEl.innerHTML = '';
    dotsEl && (dotsEl.innerHTML = '');
    items.forEach((it,i)=>{
      const slide = document.createElement('div'); slide.className = 'media-slide';
      slide.dataset.index = i;
      if(it.type === 'video'){
        const v = document.createElement('video'); v.src = encodeURI(it.src); v.muted = true; v.loop = false; v.playsInline = true; v.preload = 'metadata'; v.controls = false;
        slide.appendChild(v);
      } else {
        const img = document.createElement('img'); img.src = encodeURI(it.src); img.alt = it.name || ('media-'+i);
        slide.appendChild(img);
      }
      slide.style.opacity = i===index? '1':'0';
      slide.style.transition = 'opacity 420ms ease';
      slidesEl.appendChild(slide);

      if(dotsEl){
        const d = document.createElement('button'); d.className = 'media-dot'+(i===index? ' active':''); d.dataset.index = i; d.addEventListener('click', ()=>{ goTo(i); });
        dotsEl.appendChild(d);
      }
    });
  }

  function goTo(i){
    if(i<0) i = items.length-1; if(i>=items.length) i = 0;
    const prev = index; index = i;
    const slides = slidesEl.querySelectorAll('.media-slide');
    slides.forEach(s=> s.style.opacity = s.dataset.index==index? '1':'0');
    if(dotsEl){ Array.from(dotsEl.children).forEach((d,idx)=> d.classList.toggle('active', idx===index)); }
    // start video if applicable; pause others and reset
    slides.forEach(s=>{
      const v = s.querySelector('video');
      if(v){
        if(parseInt(s.dataset.index,10)===index){ try{ v.currentTime = 0; v.play().catch(()=>{}); }catch(e){} }
        else { try{ v.pause(); v.currentTime = 0; }catch(e){} }
      }
    });
    // schedule next slide according to media type (video finishes or image shows for 3s)
    scheduleNext();
  }

  function next(){ goTo(index+1); }
  function prev(){ goTo(index-1); }

  function startTimer(){
    // legacy compatibility: schedule next for current slide
    if(timer) clearTimeout(timer);
    if(!autoplay) return;
    scheduleNext();
  }
  function stopTimer(){ if(timer) clearTimeout(timer); timer = null; }

  function scheduleNext(){
    // clear any pending
    if(timer) clearTimeout(timer);
    const slides = slidesEl.querySelectorAll('.media-slide');
    const current = slidesEl.querySelector('.media-slide[style*="opacity: 1"]') || slides[index];
    if(!current) return;
    const v = current.querySelector('video');
    if(v){
      // wait for video to end then advance
      const onEnd = ()=>{ try{ if(timer) { clearTimeout(timer); timer = null; } }catch(e){} v.removeEventListener('ended', onEnd); if(autoplay) next(); };
      v.addEventListener('ended', onEnd, { once: true });
      // as fallback, if video already ended or can't play, set safety timeout (e.g., 10s)
      timer = setTimeout(()=>{ try{ v.removeEventListener('ended', onEnd); if(autoplay) next(); }catch(e){} timer = null; }, Math.max(10000, v.duration? (v.duration*1000 + 200):10000));
    } else {
      // image: show for 3 seconds
      timer = setTimeout(()=>{ if(autoplay) next(); }, 3000);
    }
  }

  // controls
  if(prevBtn) prevBtn.addEventListener('click', ()=>{ prev(); startTimer(); });
  if(nextBtn) nextBtn.addEventListener('click', ()=>{ next(); startTimer(); });

  slidesEl.addEventListener('mouseenter', ()=>{ autoplay = false; stopTimer(); });
  slidesEl.addEventListener('mouseleave', ()=>{ autoplay = true; startTimer(); });

  // keyboard navigation
  slidesEl.addEventListener('keydown', (e)=>{ if(e.key==='ArrowLeft') prev(); if(e.key==='ArrowRight') next(); });

  // Use a direct list of files from the `assets/portfolio` folder so the carousel
  // does not rely on a separate manifest file. Update this array if you add/remove files.
  items = [
    { src: 'assets/portfolio/best eye.png', type: 'image', name: 'best eye.png' },
    { src: 'assets/portfolio/Screenshot 2026-06-20 151058.png', type: 'image', name: 'screenshot' },
    { src: 'assets/portfolio/Star wars.mp4', type: 'video', name: 'star wars' },
    { src: 'assets/portfolio/bed.mp4', type: 'video', name: 'bed' }
  ];
  render(); goTo(index);

  // Ensure videos can start by using a user gesture unlock (some browsers block autoplay).
  window.mediaUnlocked = false;
  function unlockMedia(){
    if(window.mediaUnlocked) return; window.mediaUnlocked = true;
    const vids = document.querySelectorAll('.media-slide video');
    vids.forEach(v=>{ try{ v.play().catch(()=>{}); }catch(e){} });
    document.removeEventListener('pointerdown', unlockMedia);
  }
  // Inline mute toggle next to the dots (no play/pause control)
  if(dotsEl){
    const muteBtn = document.createElement('button'); muteBtn.id = 'muteToggleInline'; muteBtn.className = 'media-mute';
    muteBtn.setAttribute('aria-label','Toggle mute');
    function updateMuteIcon(){
      if(window.mediaMuted){
        muteBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.5 12a4.5 4.5 0 00-4.5-4.5v9A4.5 4.5 0 0016.5 12z" fill="currentColor" opacity="0.9"/><path d="M19 3L5 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      } else {
        muteBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 10v4h4l5 5V5L7 10H3z" fill="currentColor"/><path d="M16 8a4 4 0 010 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      }
    }

    muteBtn.addEventListener('click', ()=>{
      window.mediaMuted = !window.mediaMuted;
      localStorage.setItem('mediaMuted', window.mediaMuted ? '1':'0');
      const s = document.getElementById('muteToggleSettings'); if(s) s.checked = window.mediaMuted;
      updateMuteIcon();
      const workInView = document.getElementById('work') && document.getElementById('work').getBoundingClientRect().top < window.innerHeight && document.getElementById('work').getBoundingClientRect().bottom > window.innerHeight*0.2;
      document.querySelectorAll('#mediaSlides video').forEach(v=>{ try{ v.muted = (window.mediaMuted) ? true : !(workInView && window.mediaUnlocked); }catch(e){} });
    });

    dotsEl.appendChild(muteBtn);
    // initialize mute state from localStorage (default: unmuted)
    const saved = localStorage.getItem('mediaMuted');
    window.mediaMuted = (saved === null) ? false : (saved === '1');
    const sCheckbox = document.getElementById('muteToggleSettings'); if(sCheckbox) sCheckbox.checked = window.mediaMuted;
    updateMuteIcon();
    // apply initial mute state to current videos
    const workInViewInit = document.getElementById('work') && document.getElementById('work').getBoundingClientRect().top < window.innerHeight && document.getElementById('work').getBoundingClientRect().bottom > window.innerHeight*0.2;
    document.querySelectorAll('#mediaSlides video').forEach(v=>{ try{ v.muted = (window.mediaMuted) ? true : !(workInViewInit && window.mediaUnlocked); if(!v.muted) v.volume = 0.8; }catch(e){} });
    if(sCheckbox){ sCheckbox.addEventListener('change', (e)=>{ window.mediaMuted = e.target.checked; localStorage.setItem('mediaMuted', window.mediaMuted ? '1':'0'); updateMuteIcon();
        // apply immediately to visible videos
        const workInView = document.getElementById('work') && document.getElementById('work').getBoundingClientRect().top < window.innerHeight && document.getElementById('work').getBoundingClientRect().bottom > window.innerHeight*0.2;
        document.querySelectorAll('#mediaSlides video').forEach(v=>{ try{ v.muted = (window.mediaMuted) ? true : !(workInView && window.mediaUnlocked); }catch(e){} });
      } ); }
  }
  // also unlock on first pointer interaction anywhere
  document.addEventListener('pointerdown', unlockMedia, { once: true, passive: true });

  startTimer();

})();

// When the user scrolls to the `#work` section, allow video audio if the user has unlocked media.
(() => {
  const work = document.getElementById('work');
  if(!work) return;
  const obs = new IntersectionObserver(entries => {
    const e = entries[0];
    const inView = e.isIntersecting && e.intersectionRatio > 0.5;
    const vids = document.querySelectorAll('#mediaSlides video');
    vids.forEach(v => {
      try{
        // respect user mute preference: if user muted, keep muted; otherwise only unmute when inView and unlocked
        if(window.mediaMuted){ v.muted = true; }
        else { v.muted = !(inView && window.mediaUnlocked); if(!v.muted) v.volume = 0.8; }
      }catch(e){ /* ignore */ }
    });
  }, { threshold: [0.5] });
  obs.observe(work);
})();
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
  // freeze source button to avoid wobble/looping while morph animates
  const hadWobble = button.classList.contains('wobble');
  const origTransition = button.style.transition || '';
  const origTransform = button.style.transform || '';
  const origPointer = button.style.pointerEvents || '';
  if(hadWobble) { button.classList.remove('wobble'); button.dataset.hadWobble = '1'; }
  // lock current computed transform and disable transitions temporarily
  button.style.transform = getComputedStyle(button).transform;
  button.style.transition = 'none';
  // prevent the source button from capturing taps while morph is open (mobile issue)
  button.style.pointerEvents = 'none';

  const el = document.createElement('div');
  el.className = 'morph-card glass';
  el.style.left = start.left + 'px';
  el.style.top = start.top + 'px';
  el.style.width = start.width + 'px';
  el.style.height = start.height + 'px';
  el.style.borderRadius = getComputedStyle(button).borderRadius || '12px';

  const inner = document.createElement('div'); inner.className = 'morph-inner';

  // Left media panel (only shown when data-image present)
  const mediaPanel = document.createElement('div'); mediaPanel.className = 'morph-media';
  const imgSrc = button.dataset.image || button.getAttribute('data-image') || '';
  if(imgSrc){
    const mi = document.createElement('img'); mi.src = encodeURI(imgSrc); mi.alt = title + ' image'; mediaPanel.appendChild(mi);
  } else {
    // placeholder graphic
    const ph = document.createElement('div'); ph.style.padding = '20px'; ph.style.opacity = '0.6'; ph.textContent = ''; mediaPanel.appendChild(ph);
  }

  const body = document.createElement('div'); body.className = 'morph-body';
  const h = document.createElement('div'); h.className = 'morph-title'; h.textContent = title;
  const closeBtn = document.createElement('button'); closeBtn.className = 'morph-close'; closeBtn.textContent = '✕';
  const contentDiv = document.createElement('div'); contentDiv.className = 'morph-content';

  // collect potential social links (WCA/profile, Instagram, YouTube)
  const link = button.dataset.link || button.getAttribute('data-link') || (title && title.toLowerCase().includes('speed cubing') ? 'https://www.worldcubeassociation.org/persons/2022HARR08' : '');
  const igUrl = button.dataset.instagram || button.getAttribute('data-instagram') || button.dataset.ig || button.getAttribute('data-ig') || '';
  const ytUrl = button.dataset.youtube || button.getAttribute('data-youtube') || button.dataset.yt || button.getAttribute('data-yt') || '';

  if(link || igUrl || ytUrl){
    // if there's a primary link, try to show an iframe preview; otherwise only show buttons
    if(link){
      const frameWrap = document.createElement('div'); frameWrap.style.width = '100%'; frameWrap.style.height = '280px'; frameWrap.style.background = '#061018'; frameWrap.style.overflow = 'hidden';
      const iframe = document.createElement('iframe'); iframe.src = link; iframe.style.width = '100%'; iframe.style.height = '100%'; iframe.style.border = '0'; iframe.setAttribute('loading','lazy');
      frameWrap.appendChild(iframe);
      contentDiv.appendChild(frameWrap);
    }

    const linkRow = document.createElement('div'); linkRow.style.display = 'flex'; linkRow.style.gap = '8px'; linkRow.style.marginTop = '8px';
    if(link){
      const openBtn = document.createElement('a'); openBtn.className = 'btn-ghost'; openBtn.textContent = 'Open on WCA'; openBtn.href = link; openBtn.target = '_blank'; openBtn.rel = 'noopener noreferrer';
      linkRow.appendChild(openBtn);
    }

    if(igUrl){
      const igBtn = document.createElement('a'); igBtn.className = 'btn-ghost social-ig'; igBtn.href = igUrl; igBtn.target = '_blank'; igBtn.rel = 'noopener noreferrer';
      igBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.2"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.2"/><circle cx="17.5" cy="6.5" r="0.7" fill="currentColor"/></svg><span>Instagram</span>';
      linkRow.appendChild(igBtn);
    }

    if(ytUrl){
      const ytBtn = document.createElement('a'); ytBtn.className = 'btn-ghost social-yt'; ytBtn.href = ytUrl; ytBtn.target = '_blank'; ytBtn.rel = 'noopener noreferrer';
      ytBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 15l5.2-3L10 9v6z" fill="currentColor"/><rect x="3" y="6" width="18" height="12" rx="3" stroke="currentColor" stroke-width="1.2" fill="none"/></svg><span>YouTube</span>';
      linkRow.appendChild(ytBtn);
    }

    contentDiv.appendChild(linkRow);
    // render specs list if present
    try{
      if(button.dataset.specs){
        const specs = JSON.parse(button.dataset.specs);
        if(Array.isArray(specs) && specs.length){
          const ul = document.createElement('ul'); ul.style.marginTop = '10px'; ul.style.paddingLeft = '18px';
          specs.forEach(s=>{ const li = document.createElement('li'); li.textContent = s; ul.appendChild(li); });
          contentDiv.appendChild(ul);
        }
      }
    }catch(e){ console.warn('Failed to parse specs for hobby', e); }
    // also append the textual content below if provided
    if(content){ const p = document.createElement('div'); p.style.marginTop = '8px'; p.textContent = content; contentDiv.appendChild(p); }
  } else {
    // no links/buttons; render specs (if any) then content
    try{
      if(button.dataset.specs){
        const specs = JSON.parse(button.dataset.specs);
        if(Array.isArray(specs) && specs.length){
          const ul = document.createElement('ul'); ul.style.marginTop = '10px'; ul.style.paddingLeft = '18px';
          specs.forEach(s=>{ const li = document.createElement('li'); li.textContent = s; ul.appendChild(li); });
          contentDiv.appendChild(ul);
        }
      }
    }catch(e){ console.warn('Failed to parse specs for hobby', e); }
    if(content) contentDiv.appendChild(document.createTextNode(content || ''));
  }

  body.appendChild(h);
  body.appendChild(closeBtn);
  body.appendChild(contentDiv);

  inner.appendChild(mediaPanel);
  inner.appendChild(body);
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
  // after transition, reveal content. If animations are disabled, skip waiting.
  const onEnd = (e)=>{
    if(e && e.target && e.target !== el) return;
    el.removeEventListener('transitionend', onEnd);
    h.style.transform = 'scale(1.06)';
    setTimeout(()=> h.style.transform = 'scale(1)');
    contentDiv.classList.add('show');
    document.body.style.overflow = 'hidden';
  };
  el.addEventListener('transitionend', onEnd);
  // if animations disabled, call onEnd immediately
  if(window.reducedMotionEnabled && window.reducedMotionEnabled()){
    // ensure final geometry is applied
    el.style.left = targetLeft + 'px';
    el.style.top = targetTop + 'px';
    el.style.width = targetW + 'px';
    el.style.height = targetH + 'px';
    el.style.borderRadius = '14px';
    // directly reveal content
    onEnd({ target: el });
  }

  function closeMorph(){
    contentDiv.classList.remove('show');
    // animate back (or remove immediately if animations disabled)
    if(window.reducedMotionEnabled && window.reducedMotionEnabled()){
      // restore source button state
      try { if(button){ if(button.dataset.hadWobble){ button.classList.add('wobble'); delete button.dataset.hadWobble; } button.style.transition = origTransition; button.style.transform = origTransform; } } catch(e){}
      try { if(button){ button.style.pointerEvents = origPointer; } } catch(e){}
      if(el && el.parentNode) el.parentNode.removeChild(el);
      overlay.classList.remove('open');
      overlay.hidden = true;
      document.body.style.overflow = '';
      return;
    }
    el.style.left = start.left + 'px';
    el.style.top = start.top + 'px';
    el.style.width = start.width + 'px';
    el.style.height = start.height + 'px';
    overlay.classList.remove('open');
    // after return animation remove
    el.addEventListener('transitionend', ()=>{
      // restore source button state
      try { if(button){ if(button.dataset.hadWobble){ button.classList.add('wobble'); delete button.dataset.hadWobble; } button.style.transition = origTransition; button.style.transform = origTransform; } } catch(e){}
      try { if(button){ button.style.pointerEvents = origPointer; } } catch(e){}
      if(el && el.parentNode) el.parentNode.removeChild(el);
      overlay.hidden = true;
      document.body.style.overflow = '';
    }, { once: true });
  }

  // ensure morph and close button sit above overlay
  el.style.zIndex = '99999';
  el.style.pointerEvents = 'auto';
  closeBtn.style.zIndex = '100000';
  closeBtn.style.pointerEvents = 'auto';
  // stop propagation so the overlay click handler doesn't intercept the close
  const closeHandler = (ev)=>{ ev.stopPropagation(); ev.preventDefault && ev.preventDefault(); closeMorph(); };
  closeBtn.addEventListener('click', closeHandler);
  closeBtn.addEventListener('touchend', (ev)=>{ ev.stopPropagation(); ev.preventDefault && ev.preventDefault(); closeMorph(); });
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

// Set footer year automatically
(function(){
  try{
    const el = document.getElementById('year');
    if(el) el.textContent = new Date().getFullYear();
  }catch(e){ /* no-op */ }
})();