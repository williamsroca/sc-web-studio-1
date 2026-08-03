/**
 * SC Web Studio — Navigation Core Module
 * ─────────────────────────────────────────────────────────────────────────────
 * Loaded on EVERY page. Handles:
 *   - Glass header scroll activation
 *   - Mobile menu open/close
 *   - Active link detection
 *   - Scroll progress bar
 *   - Keyboard accessibility (focus trap in mobile menu)
 * ─────────────────────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ── DOM References ──────────────────────────────────────────────────────── */
  const header        = document.querySelector('.site-header');
  const mobileToggle  = document.querySelector('.nav-mobile-toggle');
  const mobileMenu    = document.querySelector('.mobile-menu');
  const navLinks      = document.querySelectorAll('.nav-link');
  const mobileLinks   = document.querySelectorAll('.mobile-nav-link');
  const scrollBar     = document.querySelector('.scroll-progress');
  const body          = document.body;

  if (!header) return; // Safety guard: nav not on this page


  /* ── Scroll State — Glass Header ─────────────────────────────────────────── */
  let ticking = false;
  const SCROLL_THRESHOLD = 20;

  function updateScrollState() {
    const scrollY = window.scrollY;

    // Glass header
    if (scrollY > SCROLL_THRESHOLD) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }

    // Scroll progress bar
    if (scrollBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      scrollBar.style.width = Math.min(progress, 100) + '%';
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollState);
      ticking = true;
    }
  }, { passive: true });

  // Run on load
  updateScrollState();


  /* ── Mobile Menu ─────────────────────────────────────────────────────────── */
  let menuOpen = false;

  function openMenu() {
    menuOpen = true;
    header.classList.add('menu-open');
    mobileMenu.classList.add('is-open');
    mobileToggle.setAttribute('aria-expanded', 'true');
    mobileToggle.setAttribute('aria-label', 'Close navigation menu');
    body.classList.add('modal-open');

    // Move focus to first menu link
    const firstLink = mobileMenu.querySelector('.mobile-nav-link');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 50);
    }
  }

  function closeMenu() {
    menuOpen = false;
    header.classList.remove('menu-open');
    mobileMenu.classList.remove('is-open');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.setAttribute('aria-label', 'Open navigation menu');
    body.classList.remove('modal-open');
    mobileToggle.focus();
  }

  function toggleMenu() {
    menuOpen ? closeMenu() : openMenu();
  }

  if (mobileToggle && mobileMenu) {
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.setAttribute('aria-label', 'Open navigation menu');
    mobileToggle.setAttribute('aria-controls', 'mobile-menu');
    if (!mobileMenu.id) mobileMenu.id = 'mobile-menu';

    mobileToggle.addEventListener('click', toggleMenu);

    // Close on overlay click (clicking outside menu area)
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) closeMenu();
    });

    // Close on mobile link click
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (menuOpen) closeMenu();
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuOpen) {
        e.preventDefault();
        closeMenu();
      }
    });

    // Focus trap within mobile menu
    mobileMenu.addEventListener('keydown', (e) => {
      if (!menuOpen || e.key !== 'Tab') return;

      const focusable = mobileMenu.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusable = focusable[0];
      const lastFocusable  = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    });
  }

  // Close menu when viewport resizes to desktop
  window.addEventListener('resize', () => {
    if (menuOpen && window.innerWidth >= 768) {
      closeMenu();
    }
  }, { passive: true });


  /* ── Active Link Detection ───────────────────────────────────────────────── */
  function setActiveLink() {
    const currentPath = window.location.pathname;

    const allLinks = [...navLinks, ...mobileLinks];
    allLinks.forEach(link => {
      const linkPath = new URL(link.href, window.location.origin).pathname;

      // Exact match, or prefix match for non-root paths
      const isActive = linkPath === currentPath ||
        (linkPath !== '/' && currentPath.startsWith(linkPath));

      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  setActiveLink();

})();
