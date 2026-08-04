/**
 * SC Web Studio — Site Shell (Bolivia Adaptation — Launch Hardened)
 * ─────────────────────────────────────────────────────────────────────────────
 * Injects the shared navigation header and footer into every page.
 * ─────────────────────────────────────────────────────────────────────────────
 */
(function () {
  'use strict';

  /* ── Base path resolution ────────────────────────────────────────────── */
  var base = '';
  try {
    base = document.currentScript.getAttribute('data-base') || '';
  } catch (e) { /* currentScript may be null in some edge cases */ }

  /* ── Active link detection ───────────────────────────────────────────── */
  function isActive(href) {
    try {
      var resolved = new URL(href, window.location.href).pathname
        .replace(/\/index\.html$/, '/');
      var current = window.location.pathname
        .replace(/\/index\.html$/, '/');
      if (resolved === '/' || resolved === '') {
        return current === '/' || current === '';
      }
      return current === resolved || current.startsWith(resolved);
    } catch (e) {
      return false;
    }
  }

  /* ── SVG assets ──────────────────────────────────────────────────────── */
  var LOGOMARK =
    '<svg class="nav-logo-mark" viewBox="0 0 28 28" fill="none"' +
    ' aria-hidden="true" focusable="false">' +
    '<rect x="2" y="6" width="16" height="16" rx="4" fill="#5568FF" opacity="0.9"/>' +
    '<rect x="10" y="6" width="16" height="16" rx="4" fill="#5568FF" opacity="0.45"/>' +
    '</svg>';

  var CHEVRON =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"' +
    ' stroke="currentColor" stroke-width="2" stroke-linecap="round"' +
    ' aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>';

  /* ── Navigation items (Spanish Bolivia Adaptation) ───────────────────── */
  var NAV_ITEMS = [
    { href: 'services/',   label: 'Servicios',          id: 'services'  },
    { href: 'industries/', label: 'Sectores',           id: 'industries'},
    { href: 'about/',      label: 'Por qué SC',         id: 'about'     },
    { href: 'products/',   label: 'Nuestro Ecosistema', id: 'products'  },
    { href: 'contact/',    label: 'Contacto',           id: 'contact'   },
  ];

  function buildNavLinks() {
    return NAV_ITEMS.map(function (item) {
      var href = base + item.href;
      var active = isActive(href);
      return '<a href="' + href + '"' +
        ' class="nav-link' + (active ? ' is-active' : '') + '"' +
        ' id="nav-' + item.id + '"' +
        (active ? ' aria-current="page"' : '') +
        '>' + item.label + '</a>';
    }).join('');
  }

  function buildMobileLinks() {
    return NAV_ITEMS.map(function (item) {
      var href = base + item.href;
      var active = isActive(href);
      return '<a href="' + href + '"' +
        ' class="mobile-nav-link' + (active ? ' is-active' : '') + '"' +
        ' id="mnav-' + item.id + '"' +
        (active ? ' aria-current="page"' : '') +
        '>' + item.label + ' ' + CHEVRON + '</a>';
    }).join('');
  }

  /* ── Header HTML ─────────────────────────────────────────────────────── */
  var headerHTML =
    '<header class="site-header" id="site-header" role="banner">' +
      '<div class="header-inner">' +
        '<a href="' + base + '" class="nav-logo"' +
          ' aria-label="SC Web Studio \u2014 Inicio">' +
          LOGOMARK +
          '<span class="nav-logo-wordmark">' +
            '<span class="logo-sc">SC</span> Web Studio' +
          '</span>' +
        '</a>' +
        '<nav class="nav-links" role="navigation" aria-label="Navegación principal">' +
          buildNavLinks() +
        '</nav>' +
        '<div class="nav-cta-group">' +
          '<div class="nav-cta-desktop">' +
            '<a href="' + base + 'contact/"' +
              ' class="btn btn-secondary btn-sm"' +
              ' id="nav-cta-project">Iniciar Proyecto</a>' +
          '</div>' +
          '<button class="nav-mobile-toggle" id="mobile-menu-toggle"' +
            ' aria-controls="mobile-nav-menu"' +
            ' aria-expanded="false"' +
            ' aria-label="Abrir menú de navegación"' +
            ' type="button">' +
            '<svg class="icon-menu" width="20" height="20" viewBox="0 0 24 24"' +
              ' fill="none" stroke="currentColor" stroke-width="2"' +
              ' stroke-linecap="round" aria-hidden="true">' +
              '<line x1="4" y1="8" x2="20" y2="8"/>' +
              '<line x1="4" y1="16" x2="20" y2="16"/>' +
            '</svg>' +
            '<svg class="icon-close" width="20" height="20" viewBox="0 0 24 24"' +
              ' fill="none" stroke="currentColor" stroke-width="2"' +
              ' stroke-linecap="round" aria-hidden="true">' +
              '<line x1="18" y1="6" x2="6" y2="18"/>' +
              '<line x1="6" y1="6" x2="18" y2="18"/>' +
            '</svg>' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</header>' +
    '<nav class="mobile-menu" id="mobile-nav-menu"' +
      ' role="navigation" aria-label="Navegación móvil">' +
      buildMobileLinks() +
      '<div class="mobile-menu-divider"></div>' +
      '<a href="' + base + 'contact/" class="btn btn-primary"' +
        ' id="mnav-cta">Iniciar Proyecto</a>' +
      '<a href="' + base + 'products/" class="btn btn-secondary"' +
        ' id="mnav-cta-products">Explorar Ecosistema</a>' +
    '</nav>';

  /* ── Footer HTML ─────────────────────────────────────────────────────── */
  var footerHTML =
    '<footer class="site-footer" role="contentinfo">' +
      '<div class="footer-inner">' +
        '<div class="footer-grid">' +

          /* Brand column */
          '<div class="footer-brand">' +
            '<a href="' + base + '" class="nav-logo"' +
              ' style="margin-bottom:var(--space-4);display:inline-flex;"' +
              ' aria-label="SC Web Studio">' +
              LOGOMARK +
              '<span class="nav-logo-wordmark">' +
                '<span class="logo-sc">SC</span> Web Studio' +
              '</span>' +
            '</a>' +
            '<p>Tecnología práctica que simplifica el trabajo, automatiza procesos y ayuda a hacer crecer empresas en Bolivia.</p>' +
            '<p style="margin-top:var(--space-3);font-family:var(--font-mono);' +
              'font-size:var(--text-2xs);color:var(--border-strong);">' +
              'contacto@scwebstudio.net · Santa Cruz de la Sierra, Bolivia' +
            '</p>' +
          '</div>' +

          /* Productos nav */
          '<nav aria-label="Navegación de productos">' +
            '<p class="footer-nav-title">Nuestro Ecosistema</p>' +
            '<ul class="footer-nav-list">' +
              '<li><a href="' + base + 'products/#case-assistant"' +
                ' class="footer-nav-link" id="fnav-cao">Case Assistant OS <span style="font-size:10px;opacity:0.75;color:var(--color-success);">🟢 En Vivo</span></a></li>' +
              '<li><a href="' + base + 'products/#project-home"' +
                ' class="footer-nav-link" id="fnav-ph">Project Home <span style="font-size:10px;opacity:0.75;color:var(--color-warning);">🟡 En Desarrollo</span></a></li>' +
              '<li><a href="https://sctech.shop" target="_blank" rel="noopener noreferrer"' +
                ' class="footer-nav-link" id="fnav-sct">SC Tech \u2197 <span style="font-size:10px;opacity:0.75;color:var(--color-success);">🟢 En Vivo</span></a></li>' +
              '<li><a href="' + base + 'products/"' +
                ' class="footer-nav-link" id="fnav-labs">SC Labs <span style="font-size:10px;opacity:0.75;color:var(--studio-400);">🔵 Investigación</span></a></li>' +
            '</ul>' +
          '</nav>' +

          /* Estudio nav */
          '<nav aria-label="Navegación del estudio">' +
            '<p class="footer-nav-title">Estudio</p>' +
            '<ul class="footer-nav-list">' +
              '<li><a href="' + base + 'services/"' +
                ' class="footer-nav-link" id="fnav-services">Servicios</a></li>' +
              '<li><a href="' + base + 'industries/"' +
                ' class="footer-nav-link" id="fnav-industries">Sectores</a></li>' +
              '<li><a href="' + base + 'about/"' +
                ' class="footer-nav-link" id="fnav-about">Por qué SC Web Studio</a></li>' +
              '<li><a href="' + base + 'products/"' +
                ' class="footer-nav-link" id="fnav-ecosystem">Nuestro Ecosistema</a></li>' +
            '</ul>' +
          '</nav>' +

          /* Contacto nav */
          '<nav aria-label="Navegación de contacto">' +
            '<p class="footer-nav-title">Trabajemos juntos</p>' +
            '<ul class="footer-nav-list">' +
              '<li><a href="' + base + 'contact/"' +
                ' class="footer-nav-link" id="fnav-contact">Solicitar Diagnóstico</a></li>' +
              '<li><a href="' + base + 'contact/#faqs"' +
                ' class="footer-nav-link" id="fnav-faqs">Preguntas Frecuentes</a></li>' +
              '<li><a href="' + base + 'contact/#commitments"' +
                ' class="footer-nav-link" id="fnav-commitments">Nuestra Promesa</a></li>' +
            '</ul>' +
          '</nav>' +

        '</div>' + /* /footer-grid */

        '<div class="footer-bottom">' +
          '<p class="footer-copyright">' +
            '\u00a9 2026 SC Web Studio. Todos los derechos reservados. Santa Cruz de la Sierra, Bolivia.' +
          '</p>' +
          '<div class="cluster">' +
            '<a href="' + base + 'contact/"' +
              ' class="footer-nav-link"' +
              ' style="font-size:var(--text-xs);" id="fnav-privacy">Contacto Directo</a>' +
          '</div>' +
        '</div>' +

      '</div>' +
    '</footer>';

  /* ── Inject favicon & manifest into <head> ───────────────────────────── */
  (function injectHeadMeta() {
    var head = document.head;
    if (!head) return;

    function addLink(rel, type, href, extra) {
      if (document.querySelector('link[rel="' + rel + '"]')) return;
      var el = document.createElement('link');
      el.rel  = rel;
      if (type)  el.type = type;
      if (href)  el.href = href;
      if (extra) Object.keys(extra).forEach(function (k) { el.setAttribute(k, extra[k]); });
      head.appendChild(el);
    }
    function addMeta(name, content) {
      if (document.querySelector('meta[name="' + name + '"]')) return;
      var el = document.createElement('meta');
      el.name    = name;
      el.content = content;
      head.appendChild(el);
    }

    addLink('icon',     'image/svg+xml', base + 'shared/assets/favicons/favicon.svg');
    addLink('manifest', null,            base + 'manifest.json');
    addMeta('theme-color', '#5568FF');

    function addPreconnect(href, crossorigin) {
      if (document.querySelector('link[rel="preconnect"][href="' + href + '"]')) return;
      var el = document.createElement('link');
      el.rel  = 'preconnect';
      el.href = href;
      if (crossorigin) el.crossOrigin = 'anonymous';
      document.head.insertBefore(el, document.head.firstChild);
    }
    addPreconnect('https://fonts.googleapis.com', false);
    addPreconnect('https://fonts.gstatic.com', true);
  }());

  /* ── Inject header (synchronous — runs before page content renders) ─── */
  var headerPlaceholder = document.getElementById('sc-header');
  if (headerPlaceholder) {
    headerPlaceholder.outerHTML = headerHTML;
  }

  /* ── Inject footer (after DOM is fully parsed) ───────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    var footerPlaceholder = document.getElementById('sc-footer');
    if (footerPlaceholder) {
      footerPlaceholder.outerHTML = footerHTML;
    }
  });

}());
