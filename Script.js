// Core slideshow logic
const slides = Array.from(document.querySelectorAll('.slide'));
const counter = document.getElementById('counter');
const dotsWrap = document.getElementById('dots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const playToggle = document.getElementById('playToggle');

let i = 0; // current index
let timer = null; // autoplay timer

// Build dots
slides.forEach((_, idx) => {
  const d = document.createElement('button');
  d.className = 'dot';
  d.setAttribute('aria-label', `Go to slide ${idx+1}`);
  d.addEventListener('click', () => show(idx));
  dotsWrap.appendChild(d);
});

function updateHUD() {
  counter.textContent = `${i+1} / ${slides.length}`;
  Array.from(dotsWrap.children).forEach((el, idx) => {
    el.classList.toggle('active', idx === i);
  });
}

function show(idx) {
  i = ((idx % slides.length) + slides.length) % slides.length;
  slides.forEach(s => s.classList.remove('active'));
  slides[i].classList.add('active');
  slides[i].scrollTop = 0;
  updateHUD();
}

function next() { show(i + 1); }
function prev() { show(i - 1); }

// Controls
nextBtn.addEventListener('click', () => { next(); stopAuto(); });
prevBtn.addEventListener('click', () => { prev(); stopAuto(); });

// Keyboard
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') { next(); stopAuto(); }
  if (e.key === 'ArrowLeft') { prev(); stopAuto(); }
  if (e.key === ' ') { toggleAuto(); e.preventDefault(); }
  if (e.key === 'Escape') { stopAuto(); }
});

// Touch (simple swipe)
let startX = 0;
let endX = 0;
document.addEventListener('touchstart', e => startX = e.changedTouches[0].screenX, { passive: true });
document.addEventListener('touchend', e => {
  endX = e.changedTouches[0].screenX;
  if (endX - startX > 60) { prev(); stopAuto(); }
  if (startX - endX > 60) { next(); stopAuto(); }
}, { passive: true });

// Autoplay
function startAuto() {
  if (timer) return;
  timer = setInterval(next, 5000);
  playToggle.textContent = '⏸ Pause';
}
function stopAuto() {
  if (timer) {
    clearInterval(timer);
    timer = null;
    playToggle.textContent = '▶ Play';
  }
}
function toggleAuto() { timer ? stopAuto() : startAuto(); }
playToggle.addEventListener('click', toggleAuto);

// Init
show(0);
