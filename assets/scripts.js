/* Jade — V2 premium animations
   Lenis + GSAP + SplitType + magnetic + custom cursor + image masking
*/

// ============ Lenis smooth scroll ============
(function lenisInit(){
  if (typeof Lenis === 'undefined') return;
  const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
    wheelMultiplier: 1.0,
  });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  window.__lenis = lenis;
  if (window.gsap && window.ScrollTrigger) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  // Anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1 && document.querySelector(id)) {
        e.preventDefault();
        lenis.scrollTo(id, { offset: -80, duration: 1.4 });
      }
    });
  });
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
  // Close on link click
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('is-open')));
})();

// ============ Custom cursor (desktop only) ============
(function customCursor(){
  if (window.matchMedia('(hover: none)').matches) return;
  if (window.innerWidth < 900) return;
  const dot = document.createElement('div'); dot.className = 'cursor-dot';
  const ring = document.createElement('div'); ring.className = 'cursor-ring';
  document.body.appendChild(dot); document.body.appendChild(ring);

  let mx = window.innerWidth/2, my = window.innerHeight/2;
  let rx = mx, ry = my;
  window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });

  function animate(){
    dot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    ring.style.transform = `translate(${rx - 19}px, ${ry - 19}px)`;
    requestAnimationFrame(animate);
  }
  animate();

  document.querySelectorAll('a, button, .menu-card, .card, [data-hover]').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
  });
})();

// ============ Magnetic CTAs ============
(function magnetic(){
  if (window.matchMedia('(hover: none)').matches) return;
  if (window.innerWidth < 900) return;
  document.querySelectorAll('[data-magnetic], .nav-cta').forEach(el => {
    let raf;
    const strength = 0.28;
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

// ============ GSAP reveals & SplitType ============
window.addEventListener('load', () => {
  if (!window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);

  // Split text H1/H2 with .split-target
  if (typeof SplitType !== 'undefined') {
    document.querySelectorAll('.split-target').forEach(el => {
      const split = new SplitType(el, { types: 'lines,words', tagName: 'span' });
      el.querySelectorAll('.line').forEach(line => {
        line.style.overflow = 'hidden';
        line.style.display = 'block';
      });
      const words = el.querySelectorAll('.word');
      if (words.length) {
        gsap.set(words, { yPercent: 110, opacity: 0 });
        const isInHero = el.closest('.hero') !== null;
        if (isInHero) {
          gsap.to(words, {
            yPercent: 0, opacity: 1,
            duration: 1.4, ease: 'expo.out',
            stagger: 0.05, delay: 0.2,
          });
        } else {
          gsap.to(words, {
            yPercent: 0, opacity: 1,
            duration: 1.2, ease: 'expo.out',
            stagger: 0.04,
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' }
          });
        }
      }
    });
  }

  // Reveal stagger
  document.querySelectorAll('.reveal').forEach((el, i) => {
    const isHero = el.closest('.hero') !== null;
    if (isHero) {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
        delay: 0.45 + i * 0.08,
      });
    } else {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' }
      });
    }
  });

  // Fade
  document.querySelectorAll('.reveal-fade').forEach(el => {
    gsap.to(el, {
      opacity: 1, duration: 1.6, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' }
    });
  });

  // Hero background parallax
  const heroBg = document.querySelector('.hero-bg img');
  if (heroBg) {
    gsap.to(heroBg, {
      yPercent: 12, scale: 1.08,
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
    });
  }

  // Image band parallax
  document.querySelectorAll('.image-band img').forEach(img => {
    gsap.fromTo(img, { yPercent: -10 }, {
      yPercent: 10,
      scrollTrigger: { trigger: img.closest('.image-band'), start: 'top bottom', end: 'bottom top', scrub: 1.2 }
    });
  });

  // Image reveal (mask scale)
  document.querySelectorAll('[data-img-reveal]').forEach(el => {
    const img = el.querySelector('img');
    if (!img) return;
    gsap.fromTo(img, { scale: 1.2, clipPath: 'inset(0 0 100% 0)' }, {
      scale: 1, clipPath: 'inset(0 0 0% 0)',
      duration: 1.8, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
    });
  });

  // Subtle scale-in on menu cards
  document.querySelectorAll('.menu-card').forEach((card, i) => {
    gsap.fromTo(card, { y: 40, opacity: 0 }, {
      y: 0, opacity: 1,
      duration: 1.1, ease: 'expo.out',
      delay: i * 0.08,
      scrollTrigger: { trigger: card.parentElement, start: 'top 80%', toggleActions: 'play none none reverse' }
    });
  });
});
