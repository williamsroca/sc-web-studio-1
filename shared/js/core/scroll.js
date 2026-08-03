/**
 * SC Web Studio — Scroll & Reveal Core Module
 * ─────────────────────────────────────────────────────────────────────────────
 * Loaded on EVERY page. Handles:
 *   - IntersectionObserver scroll reveal (.reveal elements)
 *   - Staggered group reveals (.reveal-group)
 *   - Counter animation (data-counter attribute)
 *   - Manifesto scroll sequence
 * ─────────────────────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ── Scroll Reveal ───────────────────────────────────────────────────────── */
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Unobserve after reveal (one-shot animation)
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '-8% 0px',
      }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  }


  /* ── Counter Animation ───────────────────────────────────────────────────── */
  const counterElements = document.querySelectorAll('[data-counter]');

  function animateCounter(el, target, duration = 1400) {
    const prefix = el.dataset.counterPrefix || '';
    const suffix = el.dataset.counterSuffix || '';
    const start  = performance.now();

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function update(timestamp) {
      const elapsed  = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutCubic(progress);
      const current  = Math.round(eased * target);

      el.textContent = prefix + current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  if (counterElements.length > 0) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el     = entry.target;
            const target = parseInt(el.dataset.counter, 10);
            if (!isNaN(target)) {
              animateCounter(el, target);
            }
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    counterElements.forEach(el => counterObserver.observe(el));
  }


  /* ── Manifesto Scroll Sequence ───────────────────────────────────────────── */
  const manifestoSection = document.querySelector('.manifesto-sequence');

  if (manifestoSection) {
    const statements = manifestoSection.querySelectorAll('.manifesto-statement');

    if ('IntersectionObserver' in window && statements.length > 0) {
      const manifestoObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
            } else {
              // Allow re-animation when scrolling back up
              entry.target.classList.remove('is-visible');
            }
          });
        },
        {
          threshold: 0.4,
          rootMargin: '-15% 0px',
        }
      );

      statements.forEach(el => manifestoObserver.observe(el));
    }
  }


  /* ── Mouse Parallax (Hero floating mockup) ───────────────────────────────── */
  const heroMockup = document.querySelector('.mockup-floating');

  if (heroMockup && window.matchMedia('(pointer: fine)').matches) {
    // Only on non-touch devices
    let rafId = null;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      document.addEventListener('mousemove', (e) => {
        targetX = (e.clientX / window.innerWidth  - 0.5) * 20;
        targetY = (e.clientY / window.innerHeight - 0.5) * 12;
      }, { passive: true });

      function smoothParallax() {
        // Lerp for smooth follow (0.06 = smooth, 0.1 = snappier)
        currentX += (targetX - currentX) * 0.06;
        currentY += (targetY - currentY) * 0.06;

        heroMockup.style.transform =
          `perspective(1000px)
           rotateY(${-8 + currentX * 0.15}deg)
           rotateX(${4 - currentY * 0.15}deg)
           translateX(${currentX * 0.4}px)
           translateY(${currentY * 0.3}px)`;

        rafId = requestAnimationFrame(smoothParallax);
      }

      // Only run parallax when hero is in viewport
      const heroSection = heroMockup.closest('section, .hero-section, [data-section="hero"]');

      if (heroSection) {
        const heroObserver = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              rafId = requestAnimationFrame(smoothParallax);
            } else {
              if (rafId) cancelAnimationFrame(rafId);
              // Reset to base position
              heroMockup.style.transform =
                'perspective(1000px) rotateY(-8deg) rotateX(4deg)';
            }
          },
          { threshold: 0 }
        );
        heroObserver.observe(heroSection);
      }
    }
  }


  /* ── How We Work — Step Pipeline Animation ───────────────────────────────── */
  const pipelineSteps = document.querySelectorAll('.pipeline-step');

  if (pipelineSteps.length > 0) {
    const pipelineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-active');
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '-10% 0px',
      }
    );

    pipelineSteps.forEach((step, i) => {
      step.style.transitionDelay = `${i * 120}ms`;
      pipelineObserver.observe(step);
    });
  }


  /* ── Ecosystem Connector Lines ───────────────────────────────────────────── */
  // Draws SVG connector lines between ecosystem nodes after they render.
  // Only runs if there's an ecosystem connector canvas.
  const ecosystemCanvas = document.querySelector('#ecosystem-connectors');

  if (ecosystemCanvas && typeof SVGSVGElement !== 'undefined') {
    function drawConnectors() {
      const nodes = document.querySelectorAll('[data-ecosystem-node]');
      const parent = document.querySelector('[data-ecosystem-parent]');
      if (!parent || nodes.length === 0) return;

      const svg = ecosystemCanvas;
      const containerRect = svg.parentElement.getBoundingClientRect();
      svg.setAttribute('width',  containerRect.width);
      svg.setAttribute('height', containerRect.height);
      svg.innerHTML = '';

      const parentRect = parent.getBoundingClientRect();
      const px = parentRect.left + parentRect.width / 2  - containerRect.left;
      const py = parentRect.top  + parentRect.height      - containerRect.top;

      nodes.forEach(node => {
        const nodeRect = node.getBoundingClientRect();
        const nx = nodeRect.left + nodeRect.width  / 2 - containerRect.left;
        const ny = nodeRect.top  - containerRect.top;

        // Cubic bezier control points
        const cy1 = py + (ny - py) * 0.4;
        const cy2 = ny - (ny - py) * 0.4;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${px} ${py} C ${px} ${cy1}, ${nx} ${cy2}, ${nx} ${ny}`);
        path.setAttribute('stroke', 'rgba(85, 104, 255, 0.2)');
        path.setAttribute('stroke-width', '1');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-dasharray', '4 4');

        svg.appendChild(path);
      });
    }

    // Draw after layout settles
    requestAnimationFrame(() => setTimeout(drawConnectors, 100));
    window.addEventListener('resize', drawConnectors, { passive: true });
  }

})();
