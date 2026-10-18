/* ============================================================================
   LÓGICA INTERACTIVA · LANDING PAGE CUMPLEAÑOS LORENA
   1. Scroll reveal & Surfacing de textos e ilustraciones
   2. Navegación por capítulos con indicadores activos
   3. Control de reproductor flotante Spotify
   4. Efecto de lluvia suave en Canvas (con escudo de paraguas)
   5. ConfettiJS en celebración y clics
   6. Modal de carta romántica con foco accesible y tecla Escape
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  /* 0. CARGADOR DE PÁGINAS MODULARES (/pages/*.html) */
  var includePlaceholders = Array.prototype.slice.call(document.querySelectorAll('[data-include]'));
  if (includePlaceholders.length > 0) {
    Promise.all(
      includePlaceholders.map(function (node) {
        var url = node.getAttribute('data-include');
        return fetch(url)
          .then(function (res) { return res.ok ? res.text() : ''; })
          .then(function (html) {
            node.outerHTML = html;
          })
          .catch(function (err) {
            console.error('Error al cargar ' + url + ':', err);
          });
      })
    ).then(function () {
      initAllModules();
    });
  } else {
    initAllModules();
  }

  function initAllModules() {
  /* 1. FADE-IN Y SURFACING ELEGANTE DE TEXTOS E ILUSTRACIONES */
  (function initScrollReveal() {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return;

    document.documentElement.classList.add('js-fade', 'js-scene-fade');

    var textBlocks = document.querySelectorAll('.copy, .title-block');
    var artBlocks = document.querySelectorAll('.scene-art-wrap');

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
        } else {
          entry.target.classList.remove('is-in');
        }
      });
    }, { threshold: 0.18 });

    textBlocks.forEach(function (b) { io.observe(b); });
    artBlocks.forEach(function (a) { io.observe(a); });
  })();

  /* 2. NAVEGACIÓN ENTRE CAPÍTULOS CON INDICADORES Y SPOTIFY */
  (function initNavigation() {
    var dots = document.querySelectorAll('.dot');
    var secs = document.querySelectorAll('section');
    var s3 = document.getElementById('escena-3');

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var targetId = dot.getAttribute('data-target');
        var el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      });
    });

    var sleepyBubble = document.getElementById('sleepyBubbleText');
    var sleepyWidget = document.getElementById('sleepyBubuWidget');
    var sleepySprite = document.getElementById('bubuCloudSprite');
    var sleepyTag = document.getElementById('sleepyCloudTag');
    var btnSleepy = document.getElementById('btnSleepyBubu');
    var bubbleTimer = null;
    var wakeStepTimer = null;
    var isAtFinalChapter = false;

    // Precargar los sprites de despertar asustada y soplar velita para transición instantánea
    ['assets/bubu-wake-startled.png', 'assets/bubu-wake-blowing.png'].forEach(function (src) {
      var preloadImg = new Image();
      preloadImg.src = src;
    });

    function showSleepyBubble(durationMs) {
      if (!sleepyWidget) return;
      sleepyWidget.classList.add('show-bubble');
      if (bubbleTimer) clearTimeout(bubbleTimer);
      bubbleTimer = setTimeout(function () {
        sleepyWidget.classList.remove('show-bubble');
        bubbleTimer = null;
      }, durationMs || 3500);
    }

    function triggerSleepyWakeAndBlow() {
      if (!sleepyWidget) return;
      if (wakeStepTimer) clearTimeout(wakeStepTimer);

      // Fase 1: Se despierta asustada/sorprendida de su camita
      sleepyWidget.classList.remove('is-blowing-cake');
      sleepyWidget.classList.add('is-startled');
      if (sleepySprite) sleepySprite.src = 'assets/bubu-wake-startled.png';
      if (sleepyTag) sleepyTag.innerHTML = '&iexcl;Despert&oacute; de golpe! 😱❗';
      if (sleepyBubble) sleepyBubble.innerHTML = '&iexcl;&iquest;Eh?! &iexcl;Me qued&eacute; dormida! 😱🎂';
      showSleepyBubble(6000);

      // Fase 2: Sopla la velita de su pastel de cumpleaños con confeti
      wakeStepTimer = setTimeout(function () {
        sleepyWidget.classList.remove('is-startled');
        sleepyWidget.classList.add('is-blowing-cake');
        if (sleepySprite) sleepySprite.src = 'assets/bubu-wake-blowing.png';
        if (sleepyTag) sleepyTag.innerHTML = '&iexcl;Soplando su velita! 🎂💨';
        if (sleepyBubble) sleepyBubble.innerHTML = '&iexcl;Fuuuu! &iexcl;Feliz cumplea&ntilde;os! 🎂💨✨';
        showSleepyBubble(5000);

        if (typeof window.confetti === 'function' && btnSleepy) {
          var rect = btnSleepy.getBoundingClientRect();
          window.confetti({
            position: { x: rect.left + rect.width * 0.65, y: rect.top + 30 },
            count: 45,
            size: 0.95,
            velocity: 155,
            fade: true
          });
        }
      }, 1350);
    }

    function resetSleepyToBed() {
      if (wakeStepTimer) {
        clearTimeout(wakeStepTimer);
        wakeStepTimer = null;
      }
      if (!sleepyWidget) return;
      sleepyWidget.classList.remove('is-startled', 'is-blowing-cake');
      if (sleepySprite) sleepySprite.src = 'assets/bubu-sleepy-body.png';
      if (sleepyTag) sleepyTag.innerHTML = 'Mi dormiloncita 🐼💤';
    }

    // Mostrar burbujita temporalmente al cargar la página
    setTimeout(function () {
      showSleepyBubble(3500);
    }, 700);

    var chapterDreams = {
      'portada': '&iexcl;Despierta mi dormiloncita, te traje tu torta! 🎂💤',
      'escena-1': '5 minutitos m&aacute;s y comemos pastel... 🌅🎂',
      'escena-2': 'Huele a tortita de Dudu... 😂🎂💤',
      'escena-3': 'Cuidando tu sue&ntilde;o y tu pastel ☔🎂',
      'escena-4': 'Flores y torta para mi dormiloncita 🌸🎂',
      'escena-5': 'Guardando pastel con Eloy 🏖️🎂💤',
      'nuestros-recuerdos': '&iexcl;Nuestra pel&iacute;cula de amor en fotos reales! 🎞️📸💖',
      'cumpleanos': '&iexcl;A soplar la velita, mi amor! 🎂🎉💖'
    };

    if ('IntersectionObserver' in window) {
      var navObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            dots.forEach(function (d) {
              d.classList.toggle('active', d.getAttribute('data-target') === id);
            });
            if (id === 'escena-3' && s3) {
              s3.classList.add('rain-active');
            }
            if (id === 'cumpleanos') {
              isAtFinalChapter = true;
              triggerSleepyWakeAndBlow();
            } else {
              if (isAtFinalChapter) {
                isAtFinalChapter = false;
                resetSleepyToBed();
              }
              if (sleepyBubble && chapterDreams[id]) {
                sleepyBubble.innerHTML = chapterDreams[id];
                showSleepyBubble(3500);
              }
            }
          }
        });
      }, { threshold: 0.4 });

      secs.forEach(function (s) { navObserver.observe(s); });
    }

    // Efecto Parallax continuo en bucle vertical con separación constante (0% colisión)
    var parallaxLayers = document.querySelectorAll('.parallax-sleepy-layer, .parallax-nurse-layer');
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function updateParallax() {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      var vh = window.innerHeight || 800;
      var cycleHeight = Math.max(vh * 1.65, 1280);
      var totalLayers = parallaxLayers.length || 4;
      var slotSpacing = cycleHeight / totalLayers;
      var baseAngles = [-5, 4, 5, -4];

      parallaxLayers.forEach(function (layer, idx) {
        var baseOffset = 90 + (idx * slotSpacing);
        var rawY = baseOffset - (scrollY * 0.32);
        var wrappedY = (((rawY % cycleHeight) + cycleHeight) % cycleHeight) - 220;
        var swayX = Math.sin((scrollY * 0.003) + idx * 1.6) * 8;
        var angle = baseAngles[idx % 4] + Math.cos((scrollY * 0.0025) + idx) * 2.5;
        var flip = (idx === 2) ? ' scaleX(-1)' : '';

        layer.style.transform =
          'translate3d(' + swayX.toFixed(1) + 'px, ' + wrappedY.toFixed(1) + 'px, 0) rotate(' + angle.toFixed(1) + 'deg)' + flip;
      });

      if (sleepyWidget) {
        var maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
        var progress = Math.min(1, Math.max(0, scrollY / maxScroll));
        var sideParallaxY = -Math.sin(progress * Math.PI) * 28;
        sleepyWidget.style.transform = 'translate3d(0, ' + sideParallaxY.toFixed(1) + 'px, 0)';
      }
    }

    if (parallaxLayers.length > 0 || sleepyWidget) {
      updateParallax();
      if (!reduceMotion) {
        var ticking = false;
        var onScrollOrResize = function () {
          if (!ticking) {
            window.requestAnimationFrame(function () {
              updateParallax();
              ticking = false;
            });
            ticking = true;
          }
        };
        window.addEventListener('scroll', onScrollOrResize, { passive: true });
        window.addEventListener('resize', onScrollOrResize, { passive: true });
      }
    }

    // Interacción al tocar la nubecita de Bubu dormiloncita
    var extraSleepyPhrases = [
      '&iexcl;Mira la torta que te trajo tu Dudu! 🐻🎂',
      '5 minutitos m&aacute;s y soplo la velita... 🐼💤',
      'So&ntilde;ando con mi torta de cumplea&ntilde;os 🎂✨',
      'Mi dormiloncita hermosa de cumplea&ntilde;os 👑💖',
      '&iexcl;Feliz cumple de parte de Dudu y Eloy! 🎉🎂'
    ];
    var phraseIdx = 0;
    if (btnSleepy && sleepyBubble) {
      btnSleepy.addEventListener('click', function (e) {
        e.stopPropagation();
        if (isAtFinalChapter) {
          triggerSleepyWakeAndBlow();
          return;
        }
        sleepyBubble.innerHTML = extraSleepyPhrases[phraseIdx % extraSleepyPhrases.length];
        phraseIdx++;
        showSleepyBubble(4000);
        if (typeof window.confetti === 'function') {
          var rect = btnSleepy.getBoundingClientRect();
          window.confetti({
            position: { x: rect.left + rect.width * 0.5, y: rect.top + 20 },
            count: 35,
            size: 0.9,
            velocity: 140,
            fade: true
          });
        }
      });
    }
  })();

  /* 3. EFECTO DE LLUVIA POÉTICA CON PARAGUAS PROTECTOR EN ESCENA 3 */
  (function initRain() {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    var canvas = document.getElementById('rainCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var w = 0, h = 0;
    var drops = [];
    var DROP_COUNT = 65;
    var animId = null;

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      w = canvas.width = rect.width || window.innerWidth;
      h = canvas.height = rect.height || window.innerHeight;
    }

    function createDrop() {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        len: 12 + Math.random() * 14,
        speed: 2.2 + Math.random() * 2.2,
        alpha: 0.2 + Math.random() * 0.2
      };
    }

    resize();
    for (var i = 0; i < DROP_COUNT; i++) drops.push(createDrop());
    window.addEventListener('resize', resize);

    function drawRain() {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = '#8D4F5A';
      ctx.lineWidth = 1.2;
      ctx.lineCap = 'round';

      var shieldX = w * 0.5;
      var shieldY = h * 0.72;
      var shieldRx = Math.min(w * 0.35, 260);
      var shieldRy = Math.min(h * 0.24, 180);

      for (var i = 0; i < drops.length; i++) {
        var d = drops[i];
        d.y += d.speed;
        d.x -= 0.3;

        var dx = (d.x - shieldX) / shieldRx;
        var dy = (d.y - shieldY) / shieldRy;
        var insideUmbrella = (d.y > shieldY - shieldRy * 0.75) && ((dx * dx + dy * dy) < 1);

        if (insideUmbrella || d.y > h) {
          d.y = -20;
          d.x = Math.random() * w;
        } else {
          ctx.globalAlpha = d.alpha;
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x - 1.5, d.y + d.len);
          ctx.stroke();
        }
      }
      animId = requestAnimationFrame(drawRain);
    }
    animId = requestAnimationFrame(drawRain);
  })();

  /* 4. CONFETTI.JS (https://confettijs.org/) — CELEBRACIÓN DE CUMPLEAÑOS */
  (function initConfetti() {
    function fireConfettiAt(x, y) {
      if (typeof window.confetti === 'function') {
        window.confetti({
          position: { x: x, y: y },
          count: 90,
          size: 1.15,
          velocity: 215,
          fade: true
        });
      }
    }

    var cakeCard = document.getElementById('cakeCard');
    var wishToast = document.getElementById('wishToast');
    var wishToastTimer = null;

    function showWishToast() {
      if (!wishToast) return;
      wishToast.classList.add('show');
      wishToast.setAttribute('aria-hidden', 'false');
      if (wishToastTimer) clearTimeout(wishToastTimer);
      wishToastTimer = setTimeout(function () {
        wishToast.classList.remove('show');
        wishToast.setAttribute('aria-hidden', 'true');
        wishToastTimer = null;
      }, 5500);
    }

    function fireBirthdayShower() {
      var vw = window.innerWidth;
      var vh = window.innerHeight;
      fireConfettiAt(vw * 0.25, vh * 0.55);
      setTimeout(function () { fireConfettiAt(vw * 0.75, vh * 0.55); }, 220);
      setTimeout(function () { fireConfettiAt(vw * 0.5, vh * 0.35); }, 450);
    }

    function triggerBirthdayBlowAndCelebration() {
      if (cakeCard) {
        cakeCard.classList.remove('cake-blow-active');
        void cakeCard.offsetWidth;
        cakeCard.classList.add('cake-blow-active');
      }
      showWishToast();
      var vw = window.innerWidth;
      var vh = window.innerHeight;
      fireConfettiAt(vw * 0.2, vh * 0.5);
      setTimeout(function () { fireConfettiAt(vw * 0.8, vh * 0.5); }, 180);
      setTimeout(function () { fireConfettiAt(vw * 0.5, vh * 0.3); }, 380);
      setTimeout(function () { fireConfettiAt(vw * 0.35, vh * 0.65); }, 580);
      setTimeout(function () { fireConfettiAt(vw * 0.65, vh * 0.65); }, 780);
    }

    var finalSec = document.getElementById('cumpleanos');
    var hasAutoFired = false;
    if (finalSec && 'IntersectionObserver' in window) {
      var cObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !hasAutoFired) {
            hasAutoFired = true;
            setTimeout(fireBirthdayShower, 450);
          } else if (!entry.isIntersecting) {
            hasAutoFired = false;
          }
        });
      }, { threshold: 0.5 });
      cObserver.observe(finalSec);
    }

    var btnConfetti = document.getElementById('btnConfetti');
    if (btnConfetti) {
      btnConfetti.addEventListener('click', function (e) {
        e.stopPropagation();
        triggerBirthdayBlowAndCelebration();
      });
    }

    document.addEventListener('click', function (e) {
      if (
        e.target.closest('button') ||
        e.target.closest('a') ||
        e.target.closest('.letter-card') ||
        e.target.closest('.analog-cinema-showcase') ||
        e.target.closest('.wish-toast')
      ) return;
      fireConfettiAt(e.clientX, e.clientY);
    });

    /* 5. MODAL ACCESIBLE CON FOCO Y TECLA ESCAPE */
    var modal = document.getElementById('letterModal');
    var btnOpen = document.getElementById('btnOpenLetter');
    var btnClose = document.getElementById('btnCloseLetter');
    var previouslyFocused = null;

    function openModal() {
      if (!modal) return;
      previouslyFocused = document.activeElement;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      if (btnClose) btnClose.focus();
      fireConfettiAt(window.innerWidth * 0.5, window.innerHeight * 0.3);
    }

    function closeModal() {
      if (!modal) return;
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    }

    if (btnOpen) {
      btnOpen.addEventListener('click', function (e) {
        e.stopPropagation();
        openModal();
      });
    }

    if (btnClose) {
      btnClose.addEventListener('click', function (e) {
        e.stopPropagation();
        closeModal();
        triggerBirthdayBlowAndCelebration();
      });
    }

    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
      });
    }

    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
        closeModal();
      }
    });
  })();

  /* 6. ROLLO ANALÓGICO 35MM + POLAROIDS + TRANSICIÓN CINEMATOGRÁFICA */
  (function initAnalogPolaroidReel() {
    var section = document.getElementById('nuestros-recuerdos');
    var deck = document.getElementById('polaroidDeck');
    if (!section || !deck) return;

    var frames = Array.prototype.slice.call(deck.querySelectorAll('.polaroid-frame'));
    var cells = Array.prototype.slice.call(section.querySelectorAll('.film-cell'));
    var btnPrev = document.getElementById('btnPrevMemory');
    var btnNext = document.getElementById('btnNextMemory');
    var btnToggle = document.getElementById('btnToggleReel');
    var playIcon = document.getElementById('reelPlayIcon');
    var playText = document.getElementById('reelPlayText');
    var filmCodeEl = document.getElementById('analogFilmCode');
    var flashEl = document.getElementById('projectorFlash');
    var lightLeakEl = document.getElementById('analogLightLeak');

    var total = frames.length;
    if (!total) return;

    var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var currentIndex = 0;
    var isAutoPlaying = true;
    var isSectionVisible = false;
    var reelTimer = null;

    function updateDeckPositions(triggerFlash) {
      var prevIndex = (currentIndex - 1 + total) % total;
      var nextIndex = (currentIndex + 1) % total;

      if (triggerFlash && !prefersReducedMotion) {
        if (flashEl) {
          flashEl.classList.remove('is-flashing');
          void flashEl.offsetWidth;
          flashEl.classList.add('is-flashing');
        }
        if (lightLeakEl) {
          lightLeakEl.classList.add('leak-pulse');
          setTimeout(function () {
            lightLeakEl.classList.remove('leak-pulse');
          }, 520);
        }
      }

      frames.forEach(function (frame, idx) {
        frame.classList.remove('is-active', 'is-prev', 'is-next');
        if (idx === currentIndex) {
          frame.classList.add('is-active');
        } else if (idx === prevIndex) {
          frame.classList.add('is-prev');
        } else if (idx === nextIndex) {
          frame.classList.add('is-next');
        }
      });

      var trackEl = document.getElementById('filmStripTrack');
      cells.forEach(function (cell, idx) {
        var active = idx === currentIndex;
        cell.classList.toggle('is-active', active);
        cell.setAttribute('aria-selected', active ? 'true' : 'false');
        if (active && trackEl && trackEl.scrollWidth > trackEl.clientWidth) {
          var targetScroll = cell.offsetLeft - (trackEl.clientWidth / 2) + (cell.offsetWidth / 2);
          trackEl.scrollTo({ left: Math.max(0, targetScroll), behavior: 'smooth' });
        }
      });

      if (filmCodeEl) {
        var n = currentIndex + 1;
        var numStr = (n < 10 ? '0' : '') + n + 'A';
        var totalStr = (total < 10 ? '0' : '') + total + 'A';
        filmCodeEl.textContent = '🎞️ KODAK PORTRA 400 · ' + numStr + ' / ' + totalStr;
      }
    }

    function goToSlide(index, fromUser) {
      currentIndex = ((index % total) + total) % total;
      updateDeckPositions(true);
      if (fromUser && isAutoPlaying) {
        restartAutoPlay();
      }
    }

    function startAutoPlay() {
      stopAutoPlay();
      if (!isAutoPlaying || !isSectionVisible || prefersReducedMotion) return;
      reelTimer = setInterval(function () {
        goToSlide(currentIndex + 1, false);
      }, 4500);
    }

    function stopAutoPlay() {
      if (reelTimer) {
        clearInterval(reelTimer);
        reelTimer = null;
      }
    }

    function restartAutoPlay() {
      stopAutoPlay();
      startAutoPlay();
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', function () {
        goToSlide(currentIndex - 1, true);
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', function () {
        goToSlide(currentIndex + 1, true);
      });
    }

    cells.forEach(function (cell) {
      cell.addEventListener('click', function () {
        var idx = parseInt(cell.getAttribute('data-index'), 10);
        if (!isNaN(idx) && idx !== currentIndex) {
          goToSlide(idx, true);
        }
      });
    });

    /* Clic en la Polaroid activa pasa al siguiente recuerdo */
    deck.addEventListener('click', function () {
      goToSlide(currentIndex + 1, true);
    });

    /* Soporte táctil (Swipe izquierda/derecha en celular) */
    var touchStartX = 0;
    deck.addEventListener('touchstart', function (e) {
      if (e.changedTouches && e.changedTouches[0]) {
        touchStartX = e.changedTouches[0].screenX;
      }
    }, { passive: true });

    deck.addEventListener('touchend', function (e) {
      if (e.changedTouches && e.changedTouches[0]) {
        var diff = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(diff) > 40) {
          if (diff < 0) goToSlide(currentIndex + 1, true);
          else goToSlide(currentIndex - 1, true);
        }
      }
    }, { passive: true });

    /* Navegación con flechas del teclado cuando la sección está visible */
    window.addEventListener('keydown', function (e) {
      if (!isSectionVisible) return;
      if (e.key === 'ArrowRight') {
        goToSlide(currentIndex + 1, true);
      } else if (e.key === 'ArrowLeft') {
        goToSlide(currentIndex - 1, true);
      }
    });

    if (btnToggle) {
      btnToggle.addEventListener('click', function () {
        isAutoPlaying = !isAutoPlaying;
        btnToggle.setAttribute('aria-pressed', isAutoPlaying ? 'true' : 'false');
        if (playIcon) playIcon.textContent = isAutoPlaying ? '⏸' : '▶';
        if (playText) {
          playText.innerHTML = isAutoPlaying
            ? 'Proyecci&oacute;n autom&aacute;tica activa'
            : 'Proyecci&oacute;n en pausa';
        }
        if (isAutoPlaying) startAutoPlay();
        else stopAutoPlay();
      });
    }

    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          isSectionVisible = entry.isIntersecting;
          if (isSectionVisible) startAutoPlay();
          else stopAutoPlay();
        });
      }, { threshold: 0.35 });
      obs.observe(section);
    }

    updateDeckPositions(false);
  })();
  }
});
