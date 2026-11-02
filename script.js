/**
 * Voy a Cambiar FC — 2ª Versión Campeonato Relámpago
 * Interactividad Frontend (Countdown, Acordeón de Bases, Filtros y Menú)
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ========================================================================
     1. CUENTA REGRESIVA AL 19 DE DICIEMBRE 2026 · 14:00 HRS (GMT-3)
     ======================================================================== */
  const targetDate = new Date('2026-12-19T14:00:00-03:00').getTime();
  const elDays = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMins = document.getElementById('cd-mins');
  const elSecs = document.getElementById('cd-secs');

  function updateCountdown() {
    if (!elDays) return;
    const now = Date.now();
    const diff = targetDate - now;

    if (diff <= 0) {
      elDays.textContent = '00';
      elHours.textContent = '00';
      elMins.textContent = '00';
      elSecs.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / 1000 / 60) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    elDays.textContent = String(days).padStart(2, '0');
    elHours.textContent = String(hours).padStart(2, '0');
    elMins.textContent = String(mins).padStart(2, '0');
    elSecs.textContent = String(secs).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ========================================================================
     2. MENÚ MÓVIL Y NAVEGACIÓN ACTIVA
     ======================================================================== */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ========================================================================
     3. REGLAMENTO INTERACTIVO: ACORDEÓN, CATEGORÍAS Y BUSCADOR
     ======================================================================== */
  const ruleItems = Array.from(document.querySelectorAll('.rule-item'));
  const ruleTabs = Array.from(document.querySelectorAll('.rule-tab'));
  const ruleSearch = document.getElementById('ruleSearch');
  const toggleAllBtn = document.getElementById('toggleAllRulesBtn');
  const noRulesFound = document.getElementById('noRulesFound');

  let activeFilter = 'all';
  let allExpanded = false;

  // Normalizar texto sin tildes para búsqueda flexible
  const normalizeText = (str) =>
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  // Toggle individual de cada artículo
  ruleItems.forEach((item) => {
    const trigger = item.querySelector('.rule-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.toggle('open');
      trigger.setAttribute('aria-expanded', String(isOpen));
    });
  });

  function filterRules() {
    const query = ruleSearch ? normalizeText(ruleSearch.value.trim()) : '';
    let visibleCount = 0;

    ruleItems.forEach((item) => {
      const categories = (item.getAttribute('data-category') || '').split(' ');
      const matchesCategory = activeFilter === 'all' || categories.includes(activeFilter);
      const itemText = normalizeText(item.textContent || '');
      const matchesQuery = !query || itemText.includes(query);

      if (matchesCategory && matchesQuery) {
        item.hidden = false;
        visibleCount++;
        // Si el usuario está buscando algo específico, abrir automáticamente el artículo
        if (query.length > 1) {
          item.classList.add('open');
          const btn = item.querySelector('.rule-trigger');
          if (btn) btn.setAttribute('aria-expanded', 'true');
        }
      } else {
        item.hidden = true;
      }
    });

    if (noRulesFound) {
      noRulesFound.hidden = visibleCount > 0;
    }
  }

  ruleTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      ruleTabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      activeFilter = tab.getAttribute('data-filter') || 'all';
      filterRules();
    });
  });

  if (ruleSearch) {
    ruleSearch.addEventListener('input', filterRules);
  }

  if (toggleAllBtn) {
    toggleAllBtn.addEventListener('click', () => {
      allExpanded = !allExpanded;
      ruleItems.forEach((item) => {
        item.classList.toggle('open', allExpanded);
        const btn = item.querySelector('.rule-trigger');
        if (btn) btn.setAttribute('aria-expanded', String(allExpanded));
      });
      toggleAllBtn.textContent = allExpanded ? 'Contraer Todo' : 'Expandir Todo';
    });
  }

  /* ========================================================================
     4. GENERADOR DE MENSAJE PARA INSTAGRAM (@voy_a_cambiar_f.c)
     ======================================================================== */
  const teamNameInput = document.getElementById('teamNameInput');
  const copyMsgBtn = document.getElementById('copyMsgBtn');
  const copyBtnText = document.getElementById('copyBtnText');
  const copyFeedback = document.getElementById('copyFeedback');

  if (copyMsgBtn) {
    copyMsgBtn.addEventListener('click', async () => {
      const teamName = teamNameInput && teamNameInput.value.trim()
        ? ` para nuestro equipo "${teamNameInput.value.trim()}"`
        : '';

      const message = `¡Hola @voy_a_cambiar_f.c! ⚽💜 Queremos reservar un cupo${teamName} en la 2ª Versión del Torneo Relámpago (Sábado 19 de Diciembre · 14:00 hrs en Complejo Tercer Tiempo). ¿Nos envían los datos para realizar el abono de $20.000?`;

      try {
        await navigator.clipboard.writeText(message);
        if (copyBtnText) copyBtnText.textContent = '¡Copiado!';
        if (copyFeedback) {
          copyFeedback.textContent = '✓ Mensaje copiado al portapapeles. Pégalo en el DM de @voy_a_cambiar_f.c.';
        }
        setTimeout(() => {
          if (copyBtnText) copyBtnText.textContent = 'Copiar Mensaje';
        }, 3000);
      } catch {
        if (copyFeedback) {
          copyFeedback.textContent = message;
        }
      }
    });
  }
});
