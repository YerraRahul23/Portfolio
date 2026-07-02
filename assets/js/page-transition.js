(function () {
  'use strict';

  var DURATION = 350;
  var overlay = null;
  var transitioning = false;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    createOverlay();
    interceptNavigation();
  }

  function createOverlay() {
    if (document.getElementById('ptOverlay')) return;
    overlay = document.createElement('div');
    overlay.id = 'ptOverlay';
    overlay.className = 'pt-overlay';
    document.body.appendChild(overlay);
    void overlay.offsetHeight;
  }

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
    overlay.style.transition = 'none';
    void overlay.offsetHeight;
    overlay.style.transition = 'opacity ' + DURATION + 'ms ease';
    overlay.style.opacity = '1';

    setTimeout(function () {
      sessionStorage.setItem('pt_transition', 'true');
      window.location.href = url;
    }, DURATION);
  }

  function onPageShow(event) {
    if (event.persisted) {
      var el = document.getElementById('ptOverlay');
      if (el) {
        el.style.transition = 'none';
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
      }
      document.body.style.overflow = '';
      transitioning = false;
    }
  }

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

  function resolveUrl(href) {
    var a = document.createElement('a');
    a.href = href;
    return a.href;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('pageshow', onPageShow);
})();
