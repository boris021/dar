main.js// Helpers
const qs = (s, el=document) => el.querySelector(s);
const qsa = (s, el=document) => [...el.querySelectorAll(s)];

// Year
qs('#year').textContent = new Date().getFullYear();

// Burger / drawer
(() => {
  const burger = qs('#burger');
  const drawer = qs('#mobileMenu');
  if(!burger || !drawer) return;

  const open = () => {
    drawer.hidden = false;
    drawer.classList.add('open');
    burger.setAttribute('aria-expanded','true');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    drawer.classList.remove('open');
    burger.setAttribute('aria-expanded','false');
    document.body.style.overflow = '';
    setTimeout(()=>{drawer.hidden = true;}, 300);
  };

  burger.addEventListener('click', () => {
    const expanded = burger.getAttribute('aria-expanded') === 'true';
    expanded ? close() : open();
  });

  drawer.addEventListener('click', (e) => {
    if (e.target.matches('[data-close], .drawer')) close();
  });

  // close on ESC
  window.addEventListener('keydown', (e)=>{ if(e.key==='Escape') close(); });
})();

// Smooth scroll for anchor links
qsa('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const id = a.getAttribute('href').slice(1);
    const target = qs('#'+id);
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth', block:'start'});
      // close drawer on mobile
      const drawer = qs('#mobileMenu');
      if (!drawer.hidden) drawer.dispatchEvent(new Event('click'));
    }
  });
});

// Slider (reviews) — minimal vanilla
(() => {
  const slider = qs('[data-slider]');
  if(!slider) return;
  const track = qs('.slider__track', slider);
  const items = qsa('.review', track);
  const prev = qs('[data-prev]', slider);
  const next = qs('[data-next]', slider);
  const dotsWrap = qs('.slider__dots', slider);

  let index = 0;
  const update = () => {
    const itemWidth = items[0].getBoundingClientRect().width + 16; // gap
    track.scrollTo({left: index * itemWidth, behavior: 'smooth'});
    qsa('button', dotsWrap).forEach((d,i)=>d.setAttribute('aria-current', i===index));
  };

  // dots
  items.forEach((_, i)=>{
    const b = document.createElement('button');
    b.type='button';
    b.addEventListener('click', ()=>{ index = i; update(); });
    dotsWrap.appendChild(b);
  });

  prev.addEventListener('click', ()=>{ index = Math.max(0, index-1); update(); });
  next.addEventListener('click', ()=>{ index = Math.min(items.length-1, index+1); update(); });

  // swipe support
  let startX=null;
  track.addEventListener('pointerdown', e=>{ startX=e.clientX; track.setPointerCapture(e.pointerId); });
  track.addEventListener('pointerup', e=>{
    if(startX===null) return;
    const dx = e.clientX - startX;
    if(dx > 40) index = Math.max(0, index-1);
    if(dx < -40) index = Math.min(items.length-1, index+1);
    startX=null; update();
  });

  update();
})();

// Simple form validation (client-side)
(() => {
  const form = qs('#contactForm');
  const note = qs('#formNote');
  if(!form) return;

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRe = /^[+\d()\-\s]{7,}$/;

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const fd = new FormData(form);
    const name = (fd.get('name')||'').trim();
    const phone = (fd.get('phone')||'').trim();
    const email = (fd.get('email')||'').trim();

    if(name.length < 2){ note.textContent='Укажите имя'; return; }
    if(!phoneRe.test(phone)){ note.textContent='Проверьте телефон'; return; }
    if(!emailRe.test(email)){ note.textContent='Проверьте email'; return; }

    note.textContent='Отправка...';
    try{
      // Имитация успешной отправки
      await new Promise(r=>setTimeout(r,700));
      note.textContent='Спасибо! Мы свяжемся с вами в ближайшее время.';
      form.reset();
    }catch(err){
      note.textContent='Ошибка отправки. Попробуйте позже.';
    }
  });
})();
