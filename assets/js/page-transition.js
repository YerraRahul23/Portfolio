(function () {
  'use strict';

  var DURATION = 650;
  var overlay = null;
  var transitioning = false;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Initialise ── */
  function init() {
    createOverlay();

    if (document.documentElement.classList.contains('pt-entrance')) {
      document.documentElement.classList.remove('pt-entrance');
      handleEntrance();
    }

    interceptNavigation();
  }

  /* ── Create fixed overlay ── */
  function createOverlay() {
    if (document.getElementById('ptOverlay')) return;
    overlay = document.createElement('div');
    overlay.id = 'ptOverlay';
    overlay.className = 'pt-overlay';
    document.body.appendChild(overlay);
    /* Force paint so the initial state is applied */
    void overlay.offsetHeight;
  }

  /* ── Entrance (fade in from another page) ── */
  function handleEntrance() {
    /* Hide the rb-loader if it exists (transition came from another page) */
    var loader = document.getElementById('rbLoader');
    if (loader) loader.style.display = 'none';

    if (reduced) {
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
      return;
    }

    /* Start state: overlay is visible (set by CSS .pt-entrance .pt-overlay) */
    /* Force reflow then fade out */
    void overlay.offsetHeight;

    transitioning = true;
    overlay.style.transition = 'opacity ' + DURATION + 'ms ease, filter ' + DURATION + 'ms ease';
    overlay.style.opacity = '0';
    overlay.style.filter = 'blur(0)';

    setTimeout(function () {
      overlay.style.transition = '';
      overlay.style.pointerEvents = 'none';
      transitioning = false;
    }, DURATION + 50);
  }

  /* ── Exit (fade out before navigating) ── */
  function playExit(url) {
    if (transitioning) return;

    if (reduced) {
      sessionStorage.setItem('pt_transition', 'true');
      window.location.href = url;
      return;
    }

    transitioning = true;
    overlay.style.pointerEvents = 'auto';
    overlay.style.opacity = '0';
    overlay.style.filter = 'blur(4px)';
    overlay.style.transition = 'none';

    void overlay.offsetHeight;

    overlay.style.transition = 'opacity ' + DURATION + 'ms ease, filter ' + DURATION + 'ms ease';
    overlay.style.opacity = '1';
    overlay.style.filter = 'blur(4px)';

    setTimeout(function () {
      sessionStorage.setItem('pt_transition', 'true');
      window.location.href = url;
    }, DURATION);
  }

  /* ── BFCache / pageshow handler ── */
  function onPageShow(event) {
    if (event.persisted) {
      /* Page restored from BFCache (Back/Forward) – clean everything */
      document.documentElement.classList.remove('pt-entrance');
      var el = document.getElementById('ptOverlay');
      if (el) {
        el.style.transition = 'none';
        el.style.opacity = '0';
        el.style.filter = 'none';
        el.style.pointerEvents = 'none';
      }
      document.body.style.overflow = '';
      transitioning = false;
    }
  }

  /* ── Intercept internal navigation clicks ── */
  function interceptNavigation() {
    document.addEventListener('click', function (e) {
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      var link = e.target.closest('a');
      if (!link) return;

      var href = link.getAttribute('href');
      if (!href) return;

      if (shouldSkip(link, href)) return;

      var targetUrl = resolveUrl(href);
      var currentNoHash = resolveUrl(window.location.href).split('#')[0];
      var targetNoHash = targetUrl.split('#')[0];
      if (targetNoHash === currentNoHash) return;

      if (transitioning) return;

      e.preventDefault();

      var navOverlay = document.getElementById('navOverlay');
      var menuToggle = document.querySelector('.menu-toggle');
      if (navOverlay && navOverlay.classList.contains('active')) {
        navOverlay.classList.remove('active');
        if (menuToggle) menuToggle.classList.remove('active');
        document.body.style.overflow = '';
      }

      playExit(targetUrl);
    });
  }

  /* ── Helper: should this link be skipped? ── */
  function shouldSkip(link, href) {
    if (href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('javascript:') ||
      href === '' ||
      href === '#') {
      return true;
    }

    if (link.hasAttribute('download') ||
      link.getAttribute('target') === '_blank') {
      return true;
    }

    try {
      var a = document.createElement('a');
      a.href = href;
      if (a.origin !== window.location.origin) return true;
      return false;
    } catch (e) {
      return true;
    }
  }

  /* ── Helper: resolve relative URLs ── */
  function resolveUrl(href) {
    var a = document.createElement('a');
    a.href = href;
    return a.href;
  }

  /* ── Boot ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* Always listen for BFCache restores */
  window.addEventListener('pageshow', onPageShow);
})();