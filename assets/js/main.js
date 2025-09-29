const qs = (s, el=document) => el.querySelector(s);
const qsa = (s, el=document) => [...el.querySelectorAll(s)];


// Год в футере
const y = qs('#year'); if (y) y.textContent = new Date().getFullYear();


// Бургер / офф-канвас без дёргания макета
const burger = qs('#burger');
const drawer = qs('#mobileMenu');
const overlay = drawer ? qs('.drawer__overlay', drawer) : null;
const panel = drawer ? qs('.drawer__panel', drawer) : null;


let scrollTop = 0;
function openMenu(){
if(!drawer) return;
drawer.hidden = false;
requestAnimationFrame(()=>drawer.classList.add('open'));
burger?.classList.add('active');
burger?.setAttribute('aria-expanded','true');
scrollTop = window.scrollY || document.documentElement.scrollTop;
document.body.style.top = `-${scrollTop}px`;
document.body.classList.add('no-scroll');
const firstLink = panel?.querySelector('a,button');
firstLink && firstLink.focus();
}
function closeMenu(){
if(!drawer) return;
drawer.classList.remove('open');
burger?.classList.remove('active');
burger?.setAttribute('aria-expanded','false');
document.body.classList.remove('no-scroll');
document.body.style.top = '';
window.scrollTo(0, scrollTop);
setTimeout(()=>{ drawer.hidden = true; }, 300);
burger?.focus();
}


burger?.addEventListener('click', ()=>{
burger.classList.contains('active') ? closeMenu() : openMenu();
});


drawer?.addEventListener('click', (e)=>{
if (e.target.matches('[data-close], .drawer__overlay')) closeMenu();
});


window.addEventListener('keydown', (e)=>{
if (e.key === 'Escape' && drawer && !drawer.hidden) closeMenu();
});


// Плавный скролл к якорям
qsa('a[href^="#"]').forEach(a=>{
a.addEventListener('click', (e)=>{
const id = a.getAttribute('href').slice(1);
const t = qs('#'+id);
if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth', block:'start'}); }
});
});


// Простая проверка формы
const form = qs('#contactForm'); const note = qs('#formNote');
const emailRe=/^[^\s@]+@[^\s@]+\.[^\s@]+$/; const phoneRe=/^[+\d()\-\s]{7,}$/;
form?.addEventListener('submit', async (e)=>{
e.preventDefault();
const fd = new FormData(form);
const name=(fd.get('name')||'').trim();
const phone=(fd.get('phone')||'').trim();
const email=(fd.get('email')||'').trim();
if(name.length<2){note.textContent='Укажите имя';return}
if(!phoneRe.test(phone)){note.textContent='Проверьте телефон';return}
if(!emailRe.test(email)){note.textContent='Проверьте email';return}
note.textContent='Отправка...'; await new Promise(r=>setTimeout(r,700));
note.textContent='Спасибо! Мы свяжемся с вами.'; form.reset();
});