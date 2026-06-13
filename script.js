

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


// ── TERMINAL TYPING ANIMATION ──
(function(){
  const terminal = document.getElementById('terminal-output');
  if (!terminal) return;

  const CODE = [
    '#include <stdio.h>',
    '',
    'typedef struct {',
    '    char *name;',
    '    char *role;',
    '    char *location;',
    '    int projects;',
    '    int available;',
    '} Developer;',
    'void status(Developer *d) {',
    '    if (d->available)',
    '        printf("%s · %s\\n", d->name, d->role);',
    '}',
    '',
    'int main() {',
    '    Developer dev = {',
    '        "Roshan Mallick",',
    '        "CSE Student",',
    '        "Kolkata, IN",',
    '        12, 1',
    '    };',
    '    char *skills[] = {"C", "JavaScript",',
    '                      "Linux", "Git"};',
    '    status(&dev);',
    '    return 0;',
    '}'
  ];

  function escapeHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function tokenize(line) {
    const out = [];
    let i = 0;
    while (i < line.length) {
      // comment
      if (line[i] === '/' && line[i+1] === '/') {
        out.push('<span class="t-comment">' + escapeHtml(line.slice(i)) + '</span>');
        break;
      }
      // string
      if (line[i] === '"') {
        let j = i + 1;
        while (j < line.length && line[j] !== '"') j++;
        if (j < line.length) j++;
        out.push('<span class="t-string">' + escapeHtml(line.slice(i, j)) + '</span>');
        i = j;
        continue;
      }
      // keyword
      const m = line.slice(i).match(/^[A-Za-z_]\w*/);
      if (m) {
        const kw = {typedef:1,struct:1,return:1,int:1,char:1,main:1,if:1,void:1,for:1};
        if (kw[m[0]]) out.push('<span class="t-keyword">' + m[0] + '</span>');
        else out.push(escapeHtml(m[0]));
        i += m[0].length;
        continue;
      }
      // number
      if (/[0-9]/.test(line[i])) {
        let n = line[i];
        i++;
        while (i < line.length && /[0-9]/.test(line[i])) n += line[i++];
        out.push('<span class="t-fn">' + n + '</span>');
        continue;
      }
      const c = line[i];
      if (c === ' ') out.push('&nbsp;');
      else out.push(escapeHtml(c));
      i++;
    }
    return out.join('');
  }

  function renderCode(el, buf, cursorLine, cursorCol) {
    let html = '';
    for (let l = 0; l < buf.length; l++) {
      const line = buf[l];
      if (l === cursorLine && cursorCol >= 0) {
        const before = line.slice(0, cursorCol);
        const after = line.slice(cursorCol);
        html += '<div>' + tokenize(before) + '<span class="terminal-cursor"></span>' + tokenize(after) + '</div>';
      } else {
        html += '<div>' + tokenize(line) + '</div>';
      }
    }
    el.innerHTML = html;
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    renderCode(terminal, CODE, -1, -1);
    return;
  }

  (async function typeOnce() {
    terminal.innerHTML = '';
    const buf = [];
    for (let li = 0; li < CODE.length; li++) {
      const line = CODE[li];
      buf.push('');
      for (let ci = 0; ci <= line.length; ci++) {
        buf[li] = line.slice(0, ci);
        renderCode(terminal, buf, li, ci);
        const ch = line[ci - 1] || '';
        let d = 5 + Math.random() * 5;
        if ('{});'.includes(ch)) d += 20;
        if (ci === line.length) { renderCode(terminal, buf, -1, -1); d = 30; }
        await sleep(d);
      }
      buf[li] = line;
    }
    renderCode(terminal, CODE, -1, -1);
  })();
})();