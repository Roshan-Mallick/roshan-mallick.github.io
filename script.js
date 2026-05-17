

/* ════════════════════════════════════════
   ROSHAN MALLICK — PORTFOLIO SCRIPT
   ════════════════════════════════════════ */

// ── NAV: scrolled class ──
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });


// ── LEFT PROGRESS BAR ──
const progressBar = document.getElementById('scroll-progress-bar');

window.addEventListener('scroll', () => {

  const scrollTop =
    window.scrollY;

  const docHeight =
    document.documentElement.scrollHeight -
    window.innerHeight;

  const pct =
    docHeight > 0
      ? (scrollTop / docHeight) * 100
      : 0;

  progressBar.style.height = pct + '%';

}, { passive: true });


// ── SIDEBAR SECTION LIST ──
window.addEventListener('scroll', () => {

  if (window.scrollY > window.innerHeight * 0.6) {

    document.body.classList.add(
      'sidebar-visible'
    );

  } else {

    document.body.classList.remove(
      'sidebar-visible'
    );

  }

}, { passive: true });


// ── ACTIVE SECTION ──
const sections =
  document.querySelectorAll('section[id]');

const navLinks =
  document.querySelectorAll('.nav-links a');

const secLinks =
  document.querySelectorAll('.sec-link');


const sectionObserver =
  new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        const id =
          entry.target.getAttribute('id');

        // top nav
        navLinks.forEach(link => {

          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${id}`
          );

        });

        // sidebar nav
        secLinks.forEach(link => {

          link.classList.toggle(
            'active',
            link.dataset.section === id
          );

        });

      }

    });

  }, {
    threshold: 0.35
  });


sections.forEach(section => {
  sectionObserver.observe(section);
});


// ── FADE IN ON SCROLL ──
const fadeObserver =
  new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        entry.target.classList.add(
          'visible'
        );

        fadeObserver.unobserve(
          entry.target
        );

      }

    });

  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -60px 0px'
  });


document
  .querySelectorAll('.fade-in')
  .forEach(el => fadeObserver.observe(el));


// ── SMOOTH SCROLL ──
document
  .querySelectorAll('a[href^="#"]')
  .forEach(link => {

    link.addEventListener('click', (e) => {

      const target =
        document.querySelector(
          link.getAttribute('href')
        );

      if (target) {

        e.preventDefault();

        target.scrollIntoView({
          behavior: 'smooth'
        });

      }

    });

  });