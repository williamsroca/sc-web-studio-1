/**
 * SC Web Studio — Site Shell
 * ─────────────────────────────────────────────────────────────────────────────
 * Injects the shared navigation header and footer into every page.
 *
 * Usage in every HTML page:
 *   <div id="sc-header"></div>
 *   <script src="[depth]/shared/js/core/shell.js" data-base="[depth]"></script>
 *
 * data-base: relative path from the HTML page back to the website root.
 *   Root page  (website/):                       data-base=""
 *   First-level (website/services/):             data-base="../"
 *   Second-level (website/products/case-x/):     data-base="../../"
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

  /* ── Navigation items ────────────────────────────────────────────────── */
  var NAV_ITEMS = [
    { href: 'products/',   label: 'Products',   id: 'products'  },
    { href: 'ecosystem/',  label: 'Ecosystem',  id: 'ecosystem' },
    { href: 'services/',   label: 'Services',   id: 'services'  },
    { href: 'labs/',       label: 'Labs',       id: 'labs'      },
    { href: 'stories/',    label: 'Stories',    id: 'stories'   },
    { href: 'about/',      label: 'About',      id: 'about'     },
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
          ' aria-label="SC Web Studio \u2014 Return to home">' +
          LOGOMARK +
          '<span class="nav-logo-wordmark">' +
            '<span class="logo-sc">SC</span> Web Studio' +
          '</span>' +
        '</a>' +
        '<nav class="nav-links" role="navigation" aria-label="Primary navigation">' +
          buildNavLinks() +
        '</nav>' +
        '<div class="nav-cta-group">' +
          '<div class="nav-cta-desktop">' +
            '<a href="' + base + 'contact/"' +
              ' class="btn btn-secondary btn-sm"' +
              ' id="nav-cta-project">Start a Project</a>' +
          '</div>' +
          '<button class="nav-mobile-toggle" id="mobile-menu-toggle"' +
            ' aria-controls="mobile-nav-menu"' +
            ' aria-expanded="false"' +
            ' aria-label="Open navigation menu"' +
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
      ' role="navigation" aria-label="Mobile navigation">' +
      buildMobileLinks() +
      '<div class="mobile-menu-divider"></div>' +
      '<a href="' + base + 'contact/" class="btn btn-primary"' +
        ' id="mnav-cta">Start a Project</a>' +
      '<a href="' + base + 'products/" class="btn btn-secondary"' +
        ' id="mnav-cta-products">Explore Products</a>' +
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
            '<p>Building software that makes work simpler and creates opportunities.</p>' +
            '<p style="margin-top:var(--space-3);font-family:var(--font-mono);' +
              'font-size:var(--text-2xs);color:var(--border-strong);">' +
              'hello@scwebstudio.com' +
            '</p>' +
          '</div>' +

          /* Products nav */
          '<nav aria-label="Products navigation">' +
            '<p class="footer-nav-title">Products</p>' +
            '<ul class="footer-nav-list">' +
              '<li><a href="' + base + 'products/case-assistant-os/"' +
                ' class="footer-nav-link" id="fnav-cao">Case Assistant OS</a></li>' +
              '<li><a href="' + base + 'products/project-home/"' +
                ' class="footer-nav-link" id="fnav-ph">Project Home</a></li>' +
              '<li><a href="https://sctech.shop" target="_blank" rel="noopener noreferrer"' +
                ' class="footer-nav-link" id="fnav-sct">SC Tech \u2197</a></li>' +
              '<li><a href="' + base + 'labs/"' +
                ' class="footer-nav-link" id="fnav-labs">SC Labs</a></li>' +
            '</ul>' +
          '</nav>' +

          /* Studio nav */
          '<nav aria-label="Studio navigation">' +
            '<p class="footer-nav-title">Studio</p>' +
            '<ul class="footer-nav-list">' +
              '<li><a href="' + base + 'about/"' +
                ' class="footer-nav-link" id="fnav-about">About</a></li>' +
              '<li><a href="' + base + 'services/"' +
                ' class="footer-nav-link" id="fnav-services">Services</a></li>' +
              '<li><a href="' + base + 'ecosystem/"' +
                ' class="footer-nav-link" id="fnav-ecosystem">Ecosystem</a></li>' +
              '<li><a href="' + base + 'stories/"' +
                ' class="footer-nav-link" id="fnav-stories">Stories</a></li>' +
            '</ul>' +
          '</nav>' +

          /* Contact nav */
          '<nav aria-label="Contact navigation">' +
            '<p class="footer-nav-title">Work with us</p>' +
            '<ul class="footer-nav-list">' +
              '<li><a href="' + base + 'contact/"' +
                ' class="footer-nav-link" id="fnav-contact">Start a Project</a></li>' +
              '<li><a href="' + base + 'contact/?path=demo"' +
                ' class="footer-nav-link" id="fnav-demo">Request a Demo</a></li>' +
              '<li><a href="' + base + 'about/#team"' +
                ' class="footer-nav-link" id="fnav-team">The Team</a></li>' +
            '</ul>' +
          '</nav>' +

        '</div>' + /* /footer-grid */

        '<div class="footer-bottom">' +
          '<p class="footer-copyright">' +
            '\u00a9 2026 SC Web Studio. All rights reserved. Based in Bolivia.' +
          '</p>' +
          '<div class="cluster">' +
            '<a href="' + base + 'privacy/"' +
              ' class="footer-nav-link"' +
              ' style="font-size:var(--text-xs);" id="fnav-privacy">Privacy</a>' +
            '<a href="' + base + 'terms/"' +
              ' class="footer-nav-link"' +
              ' style="font-size:var(--text-xs);" id="fnav-terms">Terms</a>' +
          '</div>' +
        '</div>' +

      '</div>' +
    '</footer>';

  /* ── Inject favicon & manifest into <head> ───────────────────────────── */
  (function injectHeadMeta() {
    var head = document.head;
    if (!head) return;

    function addLink(rel, type, href, extra) {
      if (document.querySelector('link[rel="' + rel + '"]')) return; // skip if already set
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

    /* Google Fonts preconnect — applied on every page for font load performance */
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
