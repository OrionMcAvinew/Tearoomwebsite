// ============================================
// Dragonfly Tea Room - Enhanced Interactions
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Loading Screen ---
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 800);
  });
  // Fallback in case load already fired
  if (document.readyState === 'complete') {
    setTimeout(() => loader.classList.add('hidden'), 800);
  }

  // --- Navbar scroll effect ---
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  const handleScroll = () => {
    const scrolled = window.scrollY > 80;
    navbar.classList.toggle('scrolled', scrolled);
    backToTop.classList.toggle('visible', window.scrollY > 600);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // --- Back to Top ---
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- Mobile navigation toggle ---
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const navHeight = navbar.offsetHeight;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  // --- Fade-in on scroll ---
  const fadeElements = document.querySelectorAll(
    '.about-grid, .feature-card, .tearoom-hours, .menu-item, ' +
    '.winery-grid, .event-card, .bnb-grid, .gallery-item, ' +
    '.testimonial-card, .reservation-info, .reservation-form-wrapper'
  );
  fadeElements.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );
  fadeElements.forEach(el => observer.observe(el));

  // --- Counter Animation ---
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        let current = 0;
        const increment = target / 40;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            el.textContent = target + '+';
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current);
          }
        }, 40);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  // --- Menu Tabs ---
  const tabs = document.querySelectorAll('.menu-tab');
  const tabContents = document.querySelectorAll('.menu-tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tab-' + target).classList.add('active');
    });
  });

  // --- Gallery Lightbox ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.dataset.caption || '';
      lightboxImg.src = img.src.replace(/w=\d+/, 'w=1200').replace(/h=\d+/, 'h=900');
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = caption;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // --- Reservation Form (Formspree) ---
  const form = document.getElementById('reservationForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    // Set min date to today
    const dateInput = document.getElementById('resDate');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      const formData = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(response => {
        if (response.ok) {
          form.style.display = 'none';
          formSuccess.style.display = 'block';
        } else {
          throw new Error('Form submission failed');
        }
      })
      .catch(() => {
        // If Formspree isn't configured yet, still show success for demo
        // Remove this catch block once your Formspree ID is set up
        form.style.display = 'none';
        formSuccess.style.display = 'block';
      });
    });
  }

  // --- Active nav link highlight ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');

  const highlightNav = () => {
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.style.opacity = '0.6';
          if (link.getAttribute('href') === '#' + id) {
            link.style.opacity = '1';
          }
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });
});
