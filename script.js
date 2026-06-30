const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');
const themeToggle = document.getElementById('themeToggle');
const backToTop = document.querySelector('.back-to-top');
const scrollProgress = document.querySelector('.scroll-progress');
const loaderScreen = document.querySelector('.loader-screen');
const revealItems = document.querySelectorAll('.reveal');
const counters = document.querySelectorAll('[data-count]');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialPrev = document.getElementById('testimonialPrev');
const testimonialNext = document.getElementById('testimonialNext');
const contactForm = document.getElementById('contactForm');
const modal = document.getElementById('galleryModal');
const modalPreview = document.getElementById('modalPreview');
const modalClose = document.getElementById('modalClose');
const typingText = document.getElementById('typingText');

const typedWords = ['Excellence', 'Innovation', 'Service', 'Care'];
let typingIndex = 0;
let charIndex = 0;
let typingForward = true;
let testimonialIndex = 0;
let testimonialTimer;

function initTheme() {
  const savedTheme = localStorage.getItem('gistTheme') || 'light';
  document.body.dataset.theme = savedTheme;
  if (themeToggle) {
    themeToggle.textContent = savedTheme === 'light' ? '☾' : '☀︎';
  }
}

function toggleNav() {
  siteNav?.classList.toggle('open');
}

function closeNav() {
  siteNav?.classList.remove('open');
}

function updateScrollProgress() {
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const progress = height > 0 ? (window.scrollY / height) * 100 : 0;
  if (scrollProgress) {
    scrollProgress.style.width = `${progress}%`;
  }
}

function revealOnScroll() {
  revealItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      item.classList.add('visible');
    }
  });
}

function animateCounters() {
  counters.forEach((counter) => {
    if (counter.dataset.animated || counter.getBoundingClientRect().top > window.innerHeight - 90) {
      return;
    }
    counter.dataset.animated = 'true';
    const target = Number(counter.dataset.count);
    const duration = 1200;
    const start = performance.now();
    const step = (timestamp) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const value = Math.floor(progress * target);
      counter.textContent = value.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        counter.textContent = target.toLocaleString();
      }
    };
    requestAnimationFrame(step);
  });
}

function updateActiveNav() {
  document.querySelectorAll('.site-nav a').forEach((link) => link.classList.remove('active'));
  const sections = document.querySelectorAll('section[id]');
  sections.forEach((section) => {
    const link = document.querySelector(`.site-nav a[href*="${section.id}"]`);
    if (!link) return;
    const top = section.offsetTop - 120;
    const bottom = top + section.offsetHeight;
    if (window.scrollY >= top && window.scrollY < bottom) {
      link.classList.add('active');
    }
  });
}

function handleBackToTop() {
  backToTop?.classList.toggle('visible', window.scrollY > 450);
}

function typeText() {
  if (!typingText) return;
  const currentWord = typedWords[typingIndex];
  const part = currentWord.slice(0, charIndex);
  if (typingForward) {
    charIndex += 1;
    if (charIndex > currentWord.length) {
      typingForward = false;
      setTimeout(typeText, 1100);
      return;
    }
  } else {
    charIndex -= 1;
    if (charIndex < 0) {
      typingForward = true;
      typingIndex = (typingIndex + 1) % typedWords.length;
    }
  }
  typingText.textContent = part;
  setTimeout(typeText, typingForward ? 120 : 60);
}

function showTestimonial(index) {
  testimonialCards.forEach((card, cardIndex) => {
    card.classList.toggle('active', cardIndex === index);
  });
}

function startTestimonialCarousel() {
  clearInterval(testimonialTimer);
  testimonialTimer = setInterval(() => {
    testimonialIndex = (testimonialIndex + 1) % testimonialCards.length;
    showTestimonial(testimonialIndex);
  }, 5000);
}

function validateForm(form) {
  const fields = [...form.querySelectorAll('[required]')];
  let valid = true;
  fields.forEach((field) => {
    if (!field.value.trim()) {
      field.classList.add('invalid');
      valid = false;
    } else {
      field.classList.remove('invalid');
    }
  });
  return valid;
}

navToggle?.addEventListener('click', toggleNav);
siteNav?.addEventListener('click', (event) => {
  if (event.target.tagName === 'A') {
    closeNav();
  }
});

themeToggle?.addEventListener('click', () => {
  const nextTheme = document.body.dataset.theme === 'light' ? 'dark' : 'light';
  document.body.dataset.theme = nextTheme;
  localStorage.setItem('gistTheme', nextTheme);
  themeToggle.textContent = nextTheme === 'light' ? '☾' : '☀︎';
});

backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

testimonialPrev?.addEventListener('click', () => {
  testimonialIndex = (testimonialIndex - 1 + testimonialCards.length) % testimonialCards.length;
  showTestimonial(testimonialIndex);
  startTestimonialCarousel();
});

testimonialNext?.addEventListener('click', () => {
  testimonialIndex = (testimonialIndex + 1) % testimonialCards.length;
  showTestimonial(testimonialIndex);
  startTestimonialCarousel();
});

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!validateForm(contactForm)) return;
  alert('Thank you for contacting Gursewa Institute of Science and Technology. We will reply shortly.');
  contactForm.reset();
});

document.querySelectorAll('.gallery-card').forEach((card) => {
  card.addEventListener('click', () => {
    const image = card.dataset.image;
    if (modal && modalPreview && image) {
      modalPreview.style.backgroundImage = `url(${image})`;
      modal.classList.add('open');
    }
  });
});

modalClose?.addEventListener('click', () => modal?.classList.remove('open'));
modal?.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.classList.remove('open');
  }
});

window.addEventListener('scroll', () => {
  updateScrollProgress();
  revealOnScroll();
  animateCounters();
  updateActiveNav();
  handleBackToTop();
});

window.addEventListener('load', () => {
  initTheme();
  updateActiveNav();
  revealOnScroll();
  animateCounters();
  handleBackToTop();
  if (testimonialCards.length) {
    showTestimonial(0);
    startTestimonialCarousel();
  }
  typeText();
  setTimeout(() => loaderScreen?.classList.add('hide'), 650);
});
