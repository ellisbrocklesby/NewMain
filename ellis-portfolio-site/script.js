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

// overlay click is handled per interaction (morph/modal) to avoid conflicts
if(modalClose) modalClose.addEventListener('click', closeModal);

document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape') closeModal();
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