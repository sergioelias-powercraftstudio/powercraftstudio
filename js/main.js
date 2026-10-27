document.addEventListener('DOMContentLoaded', () => {


     // 1. Correção do Header Mobile
    const portal = document.getElementById('mobile-header-portal');
    if (portal) {
        // Move o portal para o topo do body para não sofrer com as animações das sections
        document.body.prepend(portal);
    }
    const btnEn = document.getElementById('btnEn');
    const btnPt = document.getElementById('btnPt');
    const btnEnMobile = document.getElementById('btnEnMobile');
    const btnPtMobile = document.getElementById('btnPtMobile');
    const body = document.body;
    
    // ========================================================
    // 1. BILINGUAL TOOLTIP AND TEXT TRANSLATION SYNC ENGINE
    // ========================================================
    function updateDOMText(targetLang) {
        const translatableElements = document.querySelectorAll('[data-en], [data-pt]');
        translatableElements.forEach(el => {
            // Ignora os botões para não injetar texto
            if (el.classList.contains('lang-dot')) return;

            const translation = el.getAttribute(`data-${targetLang}`);
            if (translation) {
                if (el.classList.contains('nav-dot')) {
                    el.setAttribute('title', translation);
                } else {
                    el.textContent = translation;
                }
            }
        });

        const translatableInputs = document.querySelectorAll('[data-placeholder-en][data-placeholder-pt]');
        translatableInputs.forEach(input => {
            const placeholderTranslation = input.getAttribute(`data-placeholder-${targetLang}`);
            if (placeholderTranslation) {
                input.setAttribute('placeholder', placeholderTranslation);
            }
        });
    }
    
    updateDOMText('en');

    // ========================================================
    // 2. INDEPENDENT LANGUAGE DOT SWITCHERS
    // ========================================================
    function setLanguage(lang) {
        body.classList.remove('lang-pt', 'lang-en');
        body.classList.add('lang-' + lang);
        
        if (btnEn) btnEn.classList.toggle('active', lang === 'en');
        if (btnPt) btnPt.classList.toggle('active', lang === 'pt');
        if (btnEnMobile) btnEnMobile.classList.toggle('active', lang === 'en');
        if (btnPtMobile) btnPtMobile.classList.toggle('active', lang === 'pt');

        updateDOMText(lang);
    }

    if (btnEn) btnEn.addEventListener('click', () => setLanguage('en'));
    if (btnPt) btnPt.addEventListener('click', () => setLanguage('pt'));
    if (btnEnMobile) btnEnMobile.addEventListener('click', () => setLanguage('en'));
    if (btnPtMobile) btnPtMobile.addEventListener('click', () => setLanguage('pt'));

    // ========================================================
    // 3. ROBUST MULTI-SECTION SCROLL STACK
    // ========================================================
    function syncScrollAndAnimations() {
        let currentActiveSectionId = "";
        const currentSections = document.querySelectorAll('section[id], main[id]');
        const currentNavDots = document.querySelectorAll('.nav-dot');

        currentSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5) {
                currentActiveSectionId = section.getAttribute('id');
            }
        });

        if (currentActiveSectionId) {
            currentNavDots.forEach(dot => {
                dot.classList.remove('active');
                if (dot.getAttribute('href') === `#${currentActiveSectionId}`) {
                    dot.classList.add('active');
                }
            });
        }

        const stickyTimelines = document.querySelectorAll('.about-sticky-timeline');
        stickyTimelines.forEach(timeline => {
            const introLayer = timeline.querySelector('.layer-intro');
            const cards = timeline.querySelectorAll('.layer-card');
            const rect = timeline.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const scrollableDistance = rect.height - viewportHeight;
            
            if (rect.top > 0 || rect.bottom < viewportHeight) return;

            const progress = Math.abs(rect.top) / scrollableDistance;

            if (introLayer) {
                if (progress > 0.15) {
                    introLayer.classList.add('faded-out');
                } else {
                    introLayer.classList.remove('faded-out');
                }
            }

            cards.forEach((card, index) => {
                const startTrigger = 0.15 + (index * 0.25);
                if (progress > startTrigger) {
                    card.classList.add('stage-up');
                } else {
                    card.classList.remove('stage-up');
                }
            });
        });
    }

    // ========================================================
    // 4. CONTACT FORM
    // ========================================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const submitButton = contactForm.querySelector('.btn-submit span');
            if (!submitButton) return;
            
            const originalText = submitButton.textContent;
            submitButton.textContent = document.body.classList.contains('lang-pt') ? 'Enviando...' : 'Sending...';

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    contactForm.reset();
                    submitButton.textContent = document.body.classList.contains('lang-pt') ? 'Enviado!' : 'Sent!';
                    setTimeout(() => { submitButton.textContent = originalText; }, 4000);
                } else {
                    alert('Erro ao enviar.');
                    submitButton.textContent = originalText;
                }
            } catch (error) {
                alert('Erro de conexão.');
                submitButton.textContent = originalText;
            }
        });
    }

    window.addEventListener('scroll', syncScrollAndAnimations);
    window.addEventListener('resize', syncScrollAndAnimations);
    syncScrollAndAnimations(); 
});

// ========================================================
// 5. TROCA DO LOGO E LANDING PAGE
// ========================================================
window.addEventListener('scroll', function () {
    const logoImg = document.getElementById('globalLogo');
    if (!logoImg) return;
    const lightSections = document.querySelectorAll('section.services-theme-override, section.cases-standalone-section');
    let isOverLightSection = false;
    const logoCheckPoint = 60;
    lightSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= logoCheckPoint && rect.bottom >= logoCheckPoint) isOverLightSection = true;
    });
    if (isOverLightSection) {
        if (!logoImg.src.includes('logo-black.png')) logoImg.src = 'img/logo-black.png';
    } else {
        if (!logoImg.src.endsWith('img/logo.png') || logoImg.src.includes('logo-black.png')) logoImg.src = 'img/logo.png';
    }
});
window.dispatchEvent(new Event('scroll'));

// ============================================================
// 6. POPUP DO LOGO
// ============================================================
(function () {
    const wrapper = document.getElementById('logoWrapper');
    const popup = wrapper ? wrapper.querySelector('.image-popup') : null;
    if (!wrapper || !popup) return;
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (isTouch) {
        wrapper.addEventListener('click', function (e) { e.stopPropagation(); wrapper.classList.toggle('is-active'); });
    }
    popup.addEventListener('click', function (e) { if (e.target.tagName === 'IMG') return; e.stopPropagation(); wrapper.classList.remove('is-active'); });
    document.addEventListener('click', function (e) { if (!wrapper.contains(e.target)) wrapper.classList.remove('is-active'); }, true);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') wrapper.classList.remove('is-active'); });
})();

function scrollToContactForm(event) {
    event.preventDefault();
    const contactTimeline = document.getElementById('contact');
    if (contactTimeline) {
        const rect = contactTimeline.getBoundingClientRect();
        const timelineTop = window.scrollY + rect.top;
        window.scrollTo({ top: timelineTop + (contactTimeline.offsetHeight - window.innerHeight), behavior: 'smooth' });
    }
}

// ============================================================
// 7. LANDING
// ============================================================
(function () {
  const landing = document.getElementById('landing');
  if (!landing) return;
  const body = document.body;
  function update() {
    const rect = landing.getBoundingClientRect();
    const isVisible = rect.bottom > window.innerHeight * 0.5;
    body.classList.toggle('page-landing', isVisible);
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();