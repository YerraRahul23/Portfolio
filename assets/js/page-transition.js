(function () {
  'use strict';

  var DURATION = 650;
  var wrap = null;
  var transitioning = false;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    wrapContent();

    if (document.documentElement.classList.contains('pt-entrance')) {
      document.documentElement.classList.remove('pt-entrance');
      handleEntrance();
    }

    interceptNavigation();
  }

  function wrapContent() {
    wrap = document.createElement('div');
    wrap.className = 'page-transition-wrap';

    while (document.body.firstChild) {
      wrap.appendChild(document.body.firstChild);
    }

    document.body.appendChild(wrap);
  }

  function handleEntrance() {
    var loader = document.getElementById('rbLoader');
    if (loader) loader.style.display = 'none';

    if (reduced) return;

    wrap.style.opacity = '0';
    wrap.style.transform = 'scale(0.99)';
    wrap.style.filter = 'blur(4px)';

    void wrap.offsetHeight;

    transitioning = true;
    wrap.style.transition = 'opacity ' + DURATION + 'ms ease, transform ' + DURATION + 'ms ease, filter ' + DURATION + 'ms ease';
    wrap.style.opacity = '1';
    wrap.style.transform = 'scale(1)';
    wrap.style.filter = 'blur(0)';

    setTimeout(function () {
      wrap.style.transition = '';
      transitioning = false;
    }, DURATION);
  }

  function playExit(url) {
    if (transitioning) return;

    if (reduced) {
      sessionStorage.setItem('pt_transition', 'true');
      window.location.href = url;
      return;
    }

    transitioning = true;
    wrap.style.transition = 'opacity ' + DURATION + 'ms ease, transform ' + DURATION + 'ms ease, filter ' + DURATION + 'ms ease';
    wrap.style.opacity = '0';
    wrap.style.transform = 'scale(0.99)';
    wrap.style.filter = 'blur(4px)';

    setTimeout(function () {
      sessionStorage.setItem('pt_transition', 'true');
      window.location.href = url;
    }, DURATION);
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
})();
