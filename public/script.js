document.addEventListener('DOMContentLoaded', () => {
     'use strict';

     // ------------------------------------------------------------------
     // 1. FOOTER COPYRIGHT YEAR AUTO-UPDATE
     // ------------------------------------------------------------------
     const currentYearSpan = document.getElementById('currentYear');
     if (currentYearSpan) {
         currentYearSpan.textContent = new Date().getFullYear();
     }

     // ------------------------------------------------------------------
     // 2. STICKY HEADER & SCROLL SPY CONTROLLER
     // ------------------------------------------------------------------
     const header = document.getElementById('siteHeader');
     const sections = document.querySelectorAll('section[id]');
     const navLinks = document.querySelectorAll('.nav-link');
     const backToTopBtn = document.getElementById('backToTop');

     const handleScrollEffects = () => {
         const scrollY = window.pageYOffset;

         // Sticky header appearance
         if (scrollY > 60) {
             header.classList.add('scrolled');
         } else {
             header.classList.remove('scrolled');
         }

         // Floating Back-to-Top visibility
         if (scrollY > 400) {
             backToTopBtn.classList.add('visible');
         } else {
             backToTopBtn.classList.remove('visible');
         }

         // ScrollSpy active link highlighting
         sections.forEach((section) => {
             const sectionHeight = section.offsetHeight;
             const sectionTop = section.offsetTop - 120;
             const sectionId = section.getAttribute('id');

             if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                 navLinks.forEach((link) => {
                     link.classList.remove('active');
                     if (link.getAttribute('href') === `#${sectionId}`) {
                         link.classList.add('active');
                     }
                 });
             }
         });
     };

     window.addEventListener('scroll', handleScrollEffects, {
         passive: true
     });
     handleScrollEffects(); // Initial execution

     // Back to top click trigger
     if (backToTopBtn) {
         backToTopBtn.addEventListener('click', () => {
             window.scrollTo({
                 top: 0,
                 behavior: 'smooth'
             });
         });
     }

     // ------------------------------------------------------------------
     // 3. RESPONSIVE MOBILE NAVIGATION TOGGLE
     // ------------------------------------------------------------------
     const hamburgerBtn = document.getElementById('hamburgerBtn');
     const navMenu = document.getElementById('navMenu');

     const toggleMobileMenu = () => {
         const isOpen = hamburgerBtn.classList.toggle('open');
         navMenu.classList.toggle('open');
         hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
         document.body.style.overflow = isOpen ? 'hidden' : '';
     };

     if (hamburgerBtn && navMenu) {
         hamburgerBtn.addEventListener('click', toggleMobileMenu);

         // Close menu when clicking on any nav link
         navLinks.forEach((link) => {
             link.addEventListener('click', () => {
                 if (navMenu.classList.contains('open')) {
                     toggleMobileMenu();
                 }
             });
         });

         // Close menu when clicking outside
         document.addEventListener('click', (e) => {
             if (
                 navMenu.classList.contains('open') &&
                 !navMenu.contains(e.target) &&
                 !hamburgerBtn.contains(e.target)
             ) {
                 toggleMobileMenu();
             }
         });
     }

     // ------------------------------------------------------------------
     // 4. MENU CATEGORY FILTERING
     // ------------------------------------------------------------------
     const filterButtons = document.querySelectorAll('.filter-btn');
     const menuCards = document.querySelectorAll('.menu-card');

     filterButtons.forEach((button) => {
         button.addEventListener('click', () => {
             // Remove active states from all buttons
             filterButtons.forEach((btn) => {
                 btn.classList.remove('active');
                 btn.setAttribute('aria-selected', 'false');
             });

             button.classList.add('active');
             button.setAttribute('aria-selected', 'true');

             const filterValue = button.getAttribute('data-filter');

             menuCards.forEach((card) => {
                 const itemCategory = card.getAttribute('data-category');

                 if (filterValue === 'all' || filterValue === itemCategory) {
                     card.classList.remove('hidden');
                     // Trigger subtle entrance re-render
                     card.style.opacity = '0';
                     card.style.transform = 'scale(0.95)';
                     requestAnimationFrame(() => {
                         card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                         card.style.opacity = '1';
                         card.style.transform = 'scale(1)';
                     });
                 } else {
                     card.classList.add('hidden');
                 }
             });
         });
     });

     // ------------------------------------------------------------------
     // 5. FOOD GALLERY LIGHTBOX MODAL
     // ------------------------------------------------------------------
     const galleryItems = document.querySelectorAll('.gallery-item');
     const lightboxModal = document.getElementById('lightboxModal');
     const lightboxImg = document.getElementById('lightboxImg');
     const lightboxCaption = document.getElementById('lightboxCaption');
     const lightboxClose = document.getElementById('lightboxClose');
     const lightboxBackdrop = document.getElementById('lightboxBackdrop');

     const openLightbox = (src, caption) => {
         lightboxImg.src = src;
         lightboxImg.alt = caption;
         lightboxCaption.textContent = caption;
         lightboxModal.classList.add('active');
         lightboxModal.setAttribute('aria-hidden', 'false');
         document.body.style.overflow = 'hidden';
     };

     const closeLightbox = () => {
         lightboxModal.classList.remove('active');
         lightboxModal.setAttribute('aria-hidden', 'true');
         lightboxImg.src = '';
         document.body.style.overflow = '';
     };

     galleryItems.forEach((item) => {
         item.addEventListener('click', () => {
             const fullSrc = item.getAttribute('data-src');
             const caption = item.getAttribute('data-caption') || '';
             openLightbox(fullSrc, caption);
         });
     });

     if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
     if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

     // Keyboard accessibility: ESC key to close modal
     window.addEventListener('keydown', (e) => {
         if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
             closeLightbox();
         }
     });

     // ------------------------------------------------------------------
     // 6. CUSTOMER TESTIMONIALS SLIDER
     // ------------------------------------------------------------------
     const reviewsTrack = document.getElementById('reviewsTrack');
     const reviewCards = document.querySelectorAll('.review-card');
     const revPrevBtn = document.getElementById('revPrevBtn');
     const revNextBtn = document.getElementById('revNextBtn');
     const dotsContainer = document.getElementById('carouselDots');

     let currentSlide = 0;
     const totalSlides = reviewCards.length;

     // Build pagination dots
     if (dotsContainer && totalSlides > 0) {
         dotsContainer.innerHTML = '';
         for (let i = 0; i < totalSlides; i++) {
             const dot = document.createElement('button');
             dot.classList.add('dot');
             if (i === 0) dot.classList.add('active');
             dot.setAttribute('aria-label', `Go to testimonial slide ${i + 1}`);
             dot.addEventListener('click', () => goToSlide(i));
             dotsContainer.appendChild(dot);
         }
     }

     const updateDots = (index) => {
         const dots = dotsContainer.querySelectorAll('.dot');
         dots.forEach((dot, i) => {
             dot.classList.toggle('active', i === index);
         });
     };

     const goToSlide = (index) => {
         currentSlide = (index + totalSlides) % totalSlides;
         reviewsTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
         updateDots(currentSlide);
     };

     if (revPrevBtn && revNextBtn) {
         revPrevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
         revNextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
     }

     // Touch Swipe Support for Testimonials
     let startX = 0;
     let endX = 0;

     reviewsTrack.addEventListener('touchstart', (e) => {
         startX = e.touches[0].clientX;
     }, {
         passive: true
     });

     reviewsTrack.addEventListener('touchend', (e) => {
         endX = e.changedTouches[0].clientX;
         const diff = startX - endX;
         if (Math.abs(diff) > 40) {
             if (diff > 0) {
                 goToSlide(currentSlide + 1); // Swiped left
             } else {
                 goToSlide(currentSlide - 1); // Swiped right
             }
         }
     }, {
         passive: true
     });

     // Optional subtle auto-rotation
     let reviewInterval = setInterval(() => {
         goToSlide(currentSlide + 1);
     }, 6500);

     reviewsTrack.addEventListener('mouseenter', () => clearInterval(reviewInterval));
     reviewsTrack.addEventListener('mouseleave', () => {
         reviewInterval = setInterval(() => {
             goToSlide(currentSlide + 1);
         }, 6500);
     });

     // ------------------------------------------------------------------
     // 7. ACCESSIBLE FAQ ACCORDION
     // ------------------------------------------------------------------
     const accordionTriggers = document.querySelectorAll('.accordion-trigger');

     accordionTriggers.forEach((trigger) => {
         trigger.addEventListener('click', () => {
             const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
             const panelId = trigger.getAttribute('aria-controls');
             const panel = document.getElementById(panelId);

             // Close all other panels (single expand mode for clean UX)
             accordionTriggers.forEach((otherTrigger) => {
                 if (otherTrigger !== trigger) {
                     otherTrigger.setAttribute('aria-expanded', 'false');
                     const otherPanelId = otherTrigger.getAttribute('aria-controls');
                     const otherPanel = document.getElementById(otherPanelId);
                     if (otherPanel) {
                         otherPanel.style.maxHeight = null;
                         otherPanel.hidden = true;
                     }
                 }
             });

             // Toggle current panel
             if (!isExpanded) {
                 trigger.setAttribute('aria-expanded', 'true');
                 panel.hidden = false;
                 panel.style.maxHeight = panel.scrollHeight + 'px';
             } else {
                 trigger.setAttribute('aria-expanded', 'false');
                 panel.style.maxHeight = null;
                 panel.hidden = true;
             }
         });
     });

     // ------------------------------------------------------------------
     // 8. SCROLL REVEAL ANIMATIONS & STATS COUNTER TRIGGER
     // ------------------------------------------------------------------
     const animatedElements = document.querySelectorAll('[data-animate]');
     const counterElements = document.querySelectorAll('.counter');
     let countersAnimated = false;

     const animateCounters = () => {
         counterElements.forEach((counter) => {
             const target = parseFloat(counter.getAttribute('data-target'));
             const isDecimal = counter.getAttribute('data-decimal') === 'true';
             const duration = 1800; // ms
             const frameRate = 1000 / 60;
             const totalFrames = Math.round(duration / frameRate);
             let frame = 0;

             const timer = setInterval(() => {
                 frame++;
                 const progress = frame / totalFrames;
                 // Ease-out quadratic progression
                 const easeVal = progress * (2 - progress);
                 const currentVal = target * easeVal;

                 if (isDecimal) {
                     counter.textContent = currentVal.toFixed(1);
                 } else {
                     counter.textContent = Math.floor(currentVal);
                 }

                 if (frame === totalFrames) {
                     clearInterval(timer);
                     counter.textContent = isDecimal ? target.toFixed(1) : target;
                 }
             }, frameRate);
         });
     };

     const observerOptions = {
         root: null,
         rootMargin: '0px',
         threshold: 0.15
     };

     const revealObserver = new IntersectionObserver((entries, observer) => {
         entries.forEach((entry) => {
             if (entry.isIntersecting) {
                 const delay = entry.target.getAttribute('data-delay') || 0;
                 setTimeout(() => {
                     entry.target.classList.add('is-revealed');
                 }, delay);

                 // Check if statistics section came into view
                 if (entry.target.closest('#stats') && !countersAnimated) {
                     countersAnimated = true;
                     animateCounters();
                 }

                 observer.unobserve(entry.target);
             }
         });
     }, observerOptions);

     animatedElements.forEach((el) => revealObserver.observe(el));

     // ------------------------------------------------------------------
     // 9. CLIENT-SIDE RESERVATION FORM VALIDATION & CONFIRMATION
     // ------------------------------------------------------------------
     const reservationForm = document.getElementById('reservationForm');
     const fullNameInput = document.getElementById('fullName');
     const emailInput = document.getElementById('contactEmail');
     const phoneInput = document.getElementById('contactPhone');
     const formStatus = document.getElementById('formStatus');
     const submitBtn = document.getElementById('submitBtn');

     // Input Error Helper
     const setFieldError = (inputElement, errorElementId, message) => {
         const parentGroup = inputElement.closest('.form-group');
         const errorSpan = document.getElementById(errorElementId);
         if (parentGroup) parentGroup.classList.add('has-error');
         if (errorSpan) errorSpan.textContent = message;
     };

     const clearFieldError = (inputElement, errorElementId) => {
         const parentGroup = inputElement.closest('.form-group');
         const errorSpan = document.getElementById(errorElementId);
         if (parentGroup) parentGroup.classList.remove('has-error');
         if (errorSpan) errorSpan.textContent = '';
     };

     // Real-time input cleaning
     if (fullNameInput) fullNameInput.addEventListener('input', () => clearFieldError(fullNameInput, 'nameError'));
     if (emailInput) emailInput.addEventListener('input', () => clearFieldError(emailInput, 'emailError'));
     if (phoneInput) phoneInput.addEventListener('input', () => clearFieldError(phoneInput, 'phoneError'));

     if (reservationForm) {
         reservationForm.addEventListener('submit', (e) => {
             e.preventDefault();
             let isValid = true;

             // 1. Name Validation
             const nameVal = fullNameInput.value.trim();
             if (!nameVal || nameVal.length < 2) {
                 setFieldError(fullNameInput, 'nameError', 'Please enter your full name (at least 2 letters).');
                 isValid = false;
             } else {
                 clearFieldError(fullNameInput, 'nameError');
             }

             // 2. Email Validation
             const emailVal = emailInput.value.trim();
             const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
             if (!emailVal || !emailRegex.test(emailVal)) {
                 setFieldError(emailInput, 'emailError', 'Please enter a valid email address.');
                 isValid = false;
             } else {
                 clearFieldError(emailInput, 'emailError');
             }

             // 3. Phone Validation
             const phoneVal = phoneInput.value.trim();
             const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]{7,14}$/;
             if (!phoneVal || !phoneRegex.test(phoneVal)) {
                 setFieldError(phoneInput, 'phoneError', 'Please enter a valid contact phone number.');
                 isValid = false;
             } else {
                 clearFieldError(phoneInput, 'phoneError');
             }

             if (!isValid) return;

             // Simulate asynchronous form handling
             submitBtn.classList.add('loading');
             submitBtn.disabled = true;

             setTimeout(() => {
                 submitBtn.classList.remove('loading');
                 submitBtn.disabled = false;

                 formStatus.className = 'form-status-alert success';
                 formStatus.innerHTML = `
          <strong>Thank you, ${nameVal}!</strong><br>
          Your table reservation inquiry has been recorded successfully. Our maître d' will call or email you shortly to confirm your table placement.
        `;

                 // Clear input fields
                 reservationForm.reset();

                 // Auto-dismiss confirmation after 8 seconds
                 setTimeout(() => {
                     formStatus.style.display = 'none';
                 }, 8000);
             }, 900);
         });
     }
});
