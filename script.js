// Costanti globali
const header = document.getElementById('header');
const backToTop = document.getElementById('backToTop');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

// ===== Optimization: Throttling Scroll Events =====
let isScrolling = false;
window.addEventListener('scroll', () => {
  if (!isScrolling) {
    window.requestAnimationFrame(() => {
      handleScrollEffects();
      isScrolling = false;
    });
    isScrolling = true;
  }
}, { passive: true });

function handleScrollEffects() {
  const scrollY = window.scrollY;

  // Header Scroll Effect
  if (scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  // Back to Top Button
  if (scrollY > 300) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }

  // Active Navigation Link (Aggiornato solo se necessario)
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

// ===== Mobile Menu (Ottimizzato) =====
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');

const toggleMenu = () => {
  mobileToggle.classList.toggle('active');
  mobileMenu.classList.toggle('active');
};

mobileToggle.addEventListener('click', toggleMenu);

document.querySelectorAll('.mobile-nav-links a').forEach(link => {
  link.addEventListener('click', toggleMenu);
});

// ===== Portfolio Filter (Hardware Accelerated) =====
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    const filter = button.dataset.filter;
    
    portfolioCards.forEach(card => {
      const isVisible = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !isVisible);
      if (isVisible) {
        // Usiamo le classi CSS invece di .style per performance migliori
        card.style.opacity = '1';
      }
    });
  });
});

// ===== Intersection Observer (Lazy Animation) =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // Smette di osservare una volta animato (risparmia CPU)
    }
  });
}, observerOptions);

document.querySelectorAll('.service-card, .portfolio-card, .value-card').forEach(el => {
  el.classList.add('scroll-animate');
  observer.observe(el);
});

// ===== Contact Form & Toast =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    showToast(`Grazie ${formData.get('name')}! Ti risponderò presto.`);
    contactForm.reset();
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMessage = toast.querySelector('.toast-message');
  toastMessage.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}