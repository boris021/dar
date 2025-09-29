    (function() {
      const body = document.body;
      const header = document.querySelector('[data-header]');
      const burgerOpen = document.querySelector('[data-burger]');
      const panel = document.querySelector('[data-mobile-panel]');
      const burgerClose = panel.querySelector('[data-close]');
      const focusable = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
      let lastFocused = null;

      function isOpen() { return header.classList.contains('mobile-open'); }

      function openMenu() {
        if (isOpen()) return;
        lastFocused = document.activeElement;
        header.classList.add('mobile-open');
        panel.setAttribute('aria-hidden', 'false');
        burgerOpen.setAttribute('aria-expanded', 'true');
        body.classList.add('menu-lock');
        // Фокус на первое доступное в панели
        const first = panel.querySelector(focusable);
        if (first) first.focus({ preventScroll: true });
      }

      function closeMenu() {
        if (!isOpen()) return;
        header.classList.remove('mobile-open');
        panel.setAttribute('aria-hidden', 'true');
        burgerOpen.setAttribute('aria-expanded', 'false');
        body.classList.remove('menu-lock');
        // Вернуть фокус туда, где был
        if (lastFocused && document.contains(lastFocused)) {
          lastFocused.focus({ preventScroll: true });
        } else {
          burgerOpen.focus({ preventScroll: true });
        }
      }

      // Открыть/закрыть
      burgerOpen.addEventListener('click', openMenu);
      burgerClose.addEventListener('click', closeMenu);

      // Закрытие по клику вне листа
      panel.addEventListener('click', (e) => {
        const sheet = e.target.closest('.mobile-sheet');
        if (!sheet) closeMenu();
      });

      // Esc для закрытия
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen()) closeMenu();
      });

      // Закрывать при клике по ссылке внутри
      panel.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

      // Показать десктопную навигацию только когда есть место (избегаем "мигания")
      const desktopNav = document.querySelector('.desktop-nav');
      const mq = window.matchMedia('(min-width: 768px)');
      function syncDesktopNav(e){
        if (e.matches) desktopNav.removeAttribute('hidden');
        else desktopNav.setAttribute('hidden', '');
      }
      mq.addEventListener ? mq.addEventListener('change', syncDesktopNav) : mq.addListener(syncDesktopNav);
      syncDesktopNav(mq);

      // Улучшаем :focus видимость при клике мышью
      let mouseDown = false;
      document.addEventListener('mousedown', () => mouseDown = true);
      document.addEventListener('keydown', () => mouseDown = false);
      document.addEventListener('focusin', (e) => {
        if (mouseDown) e.target.style.outline = 'none';
      });
    })();
 