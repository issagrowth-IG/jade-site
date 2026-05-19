/* La Bonne Méthode — V1.1 premium animations
   Lenis smooth scroll + GSAP + SplitType + magnetic CTAs + custom cursor
*/

// ============ Lenis smooth scroll ============
(function lenisInit(){
  if (typeof Lenis === 'undefined') return;
  const lenis = new Lenis({
    duration: 1.25,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
  });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  window.__lenis = lenis;
  // sync with GSAP ScrollTrigger
  if (window.gsap && window.ScrollTrigger) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
})();

// ============ Navbar scrolled state ============
(function navScroll(){
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  const update = () => {
    if (window.scrollY > 32) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// ============ Mobile toggle ============
(function navToggle(){
  const btn = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!btn || !links) return;
  btn.addEventListener('click', () => links.classList.toggle('is-open'));
})();

// ============ Custom cursor ============
(function customCursor(){
  if (window.matchMedia('(hover: none)').matches) return;
  const dot = document.createElement('div'); dot.className = 'cursor-dot';
  const ring = document.createElement('div'); ring.className = 'cursor-ring';
  document.body.appendChild(dot); document.body.appendChild(ring);

  let mx = window.innerWidth/2, my = window.innerHeight/2;
  let rx = mx, ry = my;

  window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });

  function animate(){
    dot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx - 19}px, ${ry - 19}px)`;
    requestAnimationFrame(animate);
  }
  animate();

  // Hover state on interactive elements
  document.querySelectorAll('a, button, .menu-card, .card, [data-hover]').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
  });
})();

// ============ Magnetic CTA effect ============
(function magnetic(){
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('[data-magnetic], .btn-primary, .nav-cta').forEach(el => {
    let raf;
    const strength = 0.35;
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width/2;
      const y = e.clientY - r.top - r.height/2;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate(${x*strength}px, ${y*strength}px)`;
      });
    });
    el.addEventListener('mouseleave', () => {
      cancelAnimationFrame(raf);
      el.style.transform = 'translate(0,0)';
    });
  });
})();

// ============ Split text + GSAP reveals ============
window.addEventListener('load', () => {
  if (!window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);

  // Split text on H1 / H2 with .split-target
  if (typeof SplitType !== 'undefined') {
    document.querySelectorAll('.split-target').forEach(el => {
      const split = new SplitType(el, { types: 'words,chars', tagName: 'span' });
      // Wrap words for clipping
      el.querySelectorAll('.word').forEach(w => {
        w.style.overflow = 'hidden';
        w.style.display = 'inline-block';
        w.style.paddingBottom = '0.05em';
        w.style.marginRight = '0.18em';
      });
      const chars = el.querySelectorAll('.char');
      if (chars.length) {
        gsap.set(chars, { yPercent: 110 });
        const trigger = el.closest('.hero-text, section') || el;
        const isInHero = el.closest('.hero-split') !== null;
        if (isInHero) {
          gsap.to(chars, {
            yPercent: 0,
            duration: 1.1,
            ease: 'power4.out',
            stagger: 0.012,
            delay: 0.2,
          });
        } else {
          gsap.to(chars, {
            yPercent: 0,
            duration: 1,
            ease: 'power4.out',
            stagger: 0.01,
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
          });
        }
      }
    });
  }

  // Standard reveals
  document.querySelectorAll('.reveal').forEach((el, i) => {
    const isHero = el.closest('.hero-split') !== null;
    if (isHero) {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
        delay: 0.35 + i * 0.06,
      });
    } else {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.95, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' }
      });
    }
  });

  // Fade reveals (no Y)
  document.querySelectorAll('.reveal-fade').forEach(el => {
    gsap.to(el, {
      opacity: 1, duration: 1.4, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' }
    });
  });

  // Parallax on hero visual
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    gsap.to(heroVisual, {
      yPercent: -6,
      scrollTrigger: { trigger: '.hero-split', start: 'top top', end: 'bottom top', scrub: 1 }
    });
  }

  // Parallax image bands
  document.querySelectorAll('.image-band img').forEach(img => {
    gsap.fromTo(img, { yPercent: -8 }, {
      yPercent: 8,
      scrollTrigger: { trigger: img.closest('.image-band'), start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  // Image scale-in on scroll
  document.querySelectorAll('[data-img-reveal]').forEach(el => {
    const img = el.querySelector('img');
    if (!img) return;
    gsap.fromTo(img, { scale: 1.18 }, {
      scale: 1,
      duration: 1.6, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
    });
  });
});
