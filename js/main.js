/**
 * Portfolio JavaScript for Lê Thanh Minh
 * Features: Mobile Nav Toggle, Scroll Spy, Hero Line Rotator,
 * Stat Counters, Project Filtering, and Scroll Reveal.
 */

// Mark that JavaScript is enabled for progressive enhancement styling
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     1. Navigation Toggle (Mobile < 900px)
     ========================================================================== */
  const navToggle = document.getElementById('nav-toggle');
  const primaryNav = document.getElementById('primary-nav');

  if (navToggle && primaryNav) {
    const toggleNav = (open) => {
      const isOpen = open !== undefined ? open : navToggle.getAttribute('aria-expanded') !== 'true';
      navToggle.setAttribute('aria-expanded', String(isOpen));
      if (isOpen) {
        primaryNav.classList.add('is-open');
      } else {
        primaryNav.classList.remove('is-open');
      }
    };

    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleNav();
    });

    // Close when clicking any nav link
    const navLinks = primaryNav.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        toggleNav(false);
      });
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        toggleNav(false);
        navToggle.focus();
      }
    });

    // Close when clicking outside of the navigation
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !primaryNav.contains(e.target)) {
        if (navToggle.getAttribute('aria-expanded') === 'true') {
          toggleNav(false);
        }
      }
    });
  }

  /* ==========================================================================
     2. Sticky Header Scroll Indicator & Scroll Spy
     ========================================================================== */
  const siteHeader = document.getElementById('site-header');

  const updateHeaderScroll = () => {
    if (!siteHeader) return;
    if (window.scrollY > 20) {
      siteHeader.classList.add('is-scrolled');
    } else {
      siteHeader.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', updateHeaderScroll, { passive: true });
  updateHeaderScroll();

  // Scroll Spy for Nav Links
  const sections = document.querySelectorAll('main section[id]');
  const allNavLinks = document.querySelectorAll('.nav-link');

  if (sections.length > 0 && allNavLinks.length > 0 && 'IntersectionObserver' in window) {
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          allNavLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.setAttribute('aria-current', 'page');
            } else {
              link.removeAttribute('aria-current');
            }
          });
        }
      });
    }, {
      rootMargin: '-25% 0px -65% 0px',
      threshold: 0
    });

    sections.forEach((sec) => spyObserver.observe(sec));
  }

  /* ==========================================================================
     3. Hero Rotating Lines (Typing / Rotating)
     ========================================================================== */
  const rotatorText = document.getElementById('rotator-text');
  const rotatingLines = [
    'Building LLM apps with RAG & multi-agent systems',
    'Edge AI on NVIDIA Jetson — fully offline',
    'Django · FastAPI · Android backends',
    'Codeforces Specialist · Round #983 problem setter'
  ];

  if (rotatorText) {
    if (prefersReducedMotion) {
      rotatorText.textContent = rotatingLines[0];
    } else {
      let currentLineIndex = 0;
      let currentCharIndex = rotatingLines[0].length;
      let isDeleting = false;
      rotatorText.textContent = rotatingLines[0];

      const tickRotator = () => {
        const fullText = rotatingLines[currentLineIndex];

        if (isDeleting) {
          currentCharIndex--;
          rotatorText.textContent = fullText.substring(0, currentCharIndex);

          if (currentCharIndex === 0) {
            isDeleting = false;
            currentLineIndex = (currentLineIndex + 1) % rotatingLines.length;
            setTimeout(tickRotator, 350);
            return;
          }
          setTimeout(tickRotator, 25);
        } else {
          currentCharIndex++;
          rotatorText.textContent = fullText.substring(0, currentCharIndex);

          if (currentCharIndex === fullText.length) {
            isDeleting = true;
            setTimeout(tickRotator, 2500); // Pause on complete string
            return;
          }
          setTimeout(tickRotator, 45);
        }
      };

      // Initial pause before rotating starts
      setTimeout(() => {
        isDeleting = true;
        tickRotator();
      }, 2500);
    }
  }

  /* ==========================================================================
     4. Animated Stat Counters
     ========================================================================== */
  const statsContainer = document.getElementById('stats');
  const statNumbers = document.querySelectorAll('.stat-number');

  if (statNumbers.length > 0) {
    let hasAnimated = false;

    const animateStats = () => {
      if (hasAnimated) return;
      hasAnimated = true;

      statNumbers.forEach((el) => {
        const target = parseFloat(el.getAttribute('data-target') || '0');
        const isFloat = el.getAttribute('data-format') === 'float';

        if (prefersReducedMotion) {
          el.textContent = isFloat ? target.toFixed(2) : Math.round(target).toString();
          return;
        }

        const duration = 1600;
        const startTime = performance.now();

        const step = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Cubic ease-out
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentVal = target * easeProgress;

          if (isFloat) {
            el.textContent = currentVal.toFixed(2);
          } else {
            el.textContent = Math.round(currentVal).toString();
          }

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = isFloat ? target.toFixed(2) : Math.round(target).toString();
            el.classList.add('is-done');
          }
        };

        requestAnimationFrame(step);
      });
    };

    if (prefersReducedMotion) {
      animateStats();
    } else if (statsContainer && 'IntersectionObserver' in window) {
      const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateStats();
            statsObserver.disconnect();
          }
        });
      }, { threshold: 0.3 });

      statsObserver.observe(statsContainer);
    } else {
      animateStats();
    }
  }

  /* ==========================================================================
     5. Project Category Filtering
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project');

  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filterVal = (btn.getAttribute('data-filter') || 'all').toLowerCase();

        // Update button states
        filterBtns.forEach((b) => {
          b.classList.remove('is-active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');

        // Toggle card visibility
        projectCards.forEach((card) => {
          const tagsAttr = (card.getAttribute('data-tags') || '').toLowerCase();
          const tags = tagsAttr.split(/\s+/).filter(Boolean);

          if (filterVal === 'all' || tags.includes(filterVal)) {
            card.classList.remove('is-hidden');
            card.removeAttribute('hidden');
          } else {
            card.classList.add('is-hidden');
            card.setAttribute('hidden', '');
          }
        });
      });
    });
  }

  /* ==========================================================================
     6. Scroll Reveal Observer
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealElements.forEach((el) => el.classList.add('is-visible'));
    } else {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      });

      revealElements.forEach((el) => revealObserver.observe(el));
    }
  }
});
