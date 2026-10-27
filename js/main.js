document.addEventListener('DOMContentLoaded', () => {
    const btnEn = document.getElementById('btnEn');
    const btnPt = document.getElementById('btnPt');
    const body = document.body;
    
    // ========================================================
    // 1. BILINGUAL TOOLTIP AND TEXT TRANSLATION SYNC ENGINE
    // ========================================================
    function updateDOMText(targetLang) {
        // Atualiza textos normais
        const translatableElements = document.querySelectorAll('[data-en], [data-pt]');
        
        translatableElements.forEach(el => {
            const translation = el.getAttribute(`data-${targetLang}`);
            if (translation) {
                if (el.classList.contains('nav-dot') || el.classList.contains('lang-dot')) {
                    el.setAttribute('title', translation);
                } else {
                    el.textContent = translation;
                }
            }
        });

        // Atualiza Placeholders de Inputs e Textareas Dinamicamente
        const translatableInputs = document.querySelectorAll('[data-placeholder-en][data-placeholder-pt]');
        translatableInputs.forEach(input => {
            const placeholderTranslation = input.getAttribute(`data-placeholder-${targetLang}`);
            if (placeholderTranslation) {
                input.setAttribute('placeholder', placeholderTranslation);
            }
        });
    }
    
    // Initialize standard view to English on load
    updateDOMText('en');

    // ========================================================
    // 2. INDEPENDENT LANGUAGE DOT SWITCHERS
    // ========================================================
    btnEn.addEventListener('click', () => {
        body.classList.remove('lang-pt');
        body.classList.add('lang-en');
        btnPt.classList.remove('active');
        btnEn.classList.add('active'); 
        updateDOMText('en');
    });

    btnPt.addEventListener('click', () => {
        body.classList.remove('lang-en');
        body.classList.add('lang-pt');
        btnEn.classList.remove('active');
        btnPt.classList.add('active'); 
        updateDOMText('pt');
    });

    // ========================================================
    // 3. ROBUST MULTI-SECTION SCROLL STACK HIGHLIGHT & ANIMATION ENGINE
    // ========================================================
    function syncScrollAndAnimations() {
        let currentActiveSectionId = "";
        
        const currentSections = document.querySelectorAll('section[id], main[id], header[id]');
        const currentNavDots = document.querySelectorAll('.nav-dot');

        // --- PART A: CORE HEIGHT SYNC FOR NAVIGATION DOTS ---
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

        // --- PART B: GENERIC STICKY LAYER SCROLL STACK ENGINE ---
        const stickyTimelines = document.querySelectorAll('.about-sticky-timeline');
        
        stickyTimelines.forEach(timeline => {
            const introLayer = timeline.querySelector('.layer-intro');
            const cards = timeline.querySelectorAll('.layer-card');

            const sectionTop = timeline.offsetTop;
            const sectionHeight = timeline.offsetHeight;
            const viewportHeight = window.innerHeight;
            const scrollPosition = window.scrollY;

            const relativeScroll = (scrollPosition - sectionTop) / (sectionHeight - viewportHeight);

            if (relativeScroll > 1) {
                if (introLayer) introLayer.classList.add('faded-out');
                cards.forEach(card => card.classList.add('stage-up'));
                return;
            }

            if (relativeScroll < 0) {
                if (introLayer) introLayer.classList.remove('faded-out');
                cards.forEach(card => card.classList.remove('stage-up'));
                return;
            }

            if (introLayer) {
                if (relativeScroll > 0.15) {
                    introLayer.classList.add('faded-out');
                } else {
                    introLayer.classList.remove('faded-out');
                }
            }

            cards.forEach((card, index) => {
                const triggerThreshold = 0.20 + (index * 0.28);
                
                if (relativeScroll > triggerThreshold) {
                    card.classList.add('stage-up');
                } else {
                    card.classList.remove('stage-up');
                }
            });
        });
    }

    // Função robusta para fazer a seta navegar para o próximo card da seção
function scrollNextCard(buttonElement) {
    const timeline = buttonElement.closest('.about-sticky-timeline');
    if (timeline) {
        const rect = timeline.getBoundingClientRect();
        const timelineTop = window.scrollY + rect.top;
        const timelineHeight = timeline.offsetHeight;
        const viewportHeight = window.innerHeight;
        
        // Calcula quanto cada card ocupa de scroll dentro da timeline
        const scrollableDistance = timelineHeight - viewportHeight;
        const currentProgress = window.scrollY - timelineTop;
        
        // Define o próximo salto (aproximadamente 30% da distância rolável da seção ou 1 card adiante)
        const nextTarget = Math.min(currentProgress + (scrollableDistance / 3), scrollableDistance);
        
        window.scrollTo({
            top: timelineTop + nextTarget + 50,
            behavior: 'smooth'
        });
    }
}

// ========================================================
// 4. AJAX CONTACT FORM SUBMISSION HANDLER
// ========================================================
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const submitButton = contactForm.querySelector('.btn-submit span');
        const originalText = submitButton.textContent;

        // Feedback visual de envio
        submitButton.textContent = document.body.classList.contains('lang-pt') ? 'Enviando...' : 'Sending...';

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Sucesso! Limpa o formulário e avisa o usuário
                contactForm.reset();
                submitButton.textContent = document.body.classList.contains('lang-pt') ? 'Mensagem Enviada com Sucesso!' : 'Message Sent Successfully!';
                
                setTimeout(() => {
                    submitButton.textContent = originalText;
                }, 4000);
            } else {
                alert('Ocorreu um erro ao enviar. Por favor, tente novamente.');
                submitButton.textContent = originalText;
            }
        } catch (error) {
            alert('Erro de conexão. Verifique sua rede e tente novamente.');
            submitButton.textContent = originalText;
        }
    });
}

    // Bind real-time viewport monitors smoothly
    window.addEventListener('scroll', syncScrollAndAnimations);
    window.addEventListener('resize', syncScrollAndAnimations);

    // Initial check on load
    syncScrollAndAnimations(); 
});

// ========================================================
// DETECÇÃO AUTOMÁTICA DE SEÇÃO CLARA PARA TROCA DO LOGO
// ========================================================
window.addEventListener('scroll', function () {
    const logoImg = document.getElementById('globalLogo');
    if (!logoImg) return;

    // Busca todas as seções de fundo claro (Services + Cases)
    const lightSections = document.querySelectorAll('section.services-theme-override, section.cases-standalone-section');
    let isOverLightSection = false;

    // Altura onde o logo está posicionado na tela (~40px do topo)
    const logoCheckPoint = 60;

    lightSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        // Verifica se a área onde o logo está posicionado se encontra dentro desta seção
        if (rect.top <= logoCheckPoint && rect.bottom >= logoCheckPoint) {
            isOverLightSection = true;
        }
    });

    // Troca o arquivo do logo dinamicamente
    if (isOverLightSection) {
        if (!logoImg.src.includes('logo-black.png')) {
            logoImg.src = 'img/logo-black.png';
        }
    } else {
        if (!logoImg.src.includes('logo.png') || logoImg.src.includes('logo-black.png')) {
            logoImg.src = 'img/logo.png';
        }
    }
});

// Executa a verificação imediatamente no carregamento da página
window.dispatchEvent(new Event('scroll'));


// ============================================================
// POPUP DO LOGO — hover no desktop, clique no mobile
// ============================================================
(function () {
    const wrapper = document.getElementById('logoWrapper');
    const heroText = document.getElementById('heroText'); // Opcional, caso queira disparar pelo texto também
    const popup = wrapper ? wrapper.querySelector('.image-popup') : null;
    
    if (!wrapper || !popup) return;

    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

    function togglePopup(e) {
        if (e) e.stopPropagation();
        wrapper.classList.toggle('is-active');
    }

    function closePopup() {
        wrapper.classList.remove('is-active');
    }

    // Abre/Fecha ao clicar no logo no mobile ou telas touch
    if (isTouch) {
        wrapper.addEventListener('click', function (e) {
            e.stopPropagation();
            togglePopup(e);
        });
    }

    // Se houver um texto de gatilho opcional
    if (isTouch && heroText) {
        heroText.addEventListener('click', function (e) {
            e.stopPropagation();
            togglePopup(e);
        });
    }

    // Fecha ao clicar no fundo escuro do popup (fora da imagem)
    popup.addEventListener('click', function (e) {
        if (e.target.tagName === 'IMG') return;
        e.stopPropagation();
        closePopup();
    });

    // Fecha ao clicar fora do wrapper inteiro
    document.addEventListener('click', function (e) {
        if (!wrapper.contains(e.target)) {
            closePopup();
        }
    }, true);

    // Fecha ao pressionar a tecla ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closePopup();
        }
    });
})();

// Função para rolar diretamente até o Layer 2 do formulário de contato
function scrollToContactForm(event) {
    event.preventDefault();
    const contactTimeline = document.getElementById('contact');
    if (contactTimeline) {
        const rect = contactTimeline.getBoundingClientRect();
        const timelineTop = window.scrollY + rect.top;
        // Posiciona a tela no terço final da timeline (onde o Layer 2 está ativo)
        window.scrollTo({
            top: timelineTop + (contactTimeline.offsetHeight - window.innerHeight),
            behavior: 'smooth'
        });
    }
}

/* ============================================================
   7) LANDING — esconde logo/badge quando a landing está visível
   ============================================================ */
(function () {
  const landing = document.getElementById('landing');
  if (!landing) return;

  const body = document.body;

  // Verifica se a landing ainda está visível na viewport
  function update() {
    const rect = landing.getBoundingClientRect();
    // Se o topo da landing está acima do topo da tela + um pedaço,
    // significa que o usuário já rolou para baixo
    const isVisible = rect.bottom > window.innerHeight * 0.5;
    body.classList.toggle('page-landing', isVisible);
  }

  // Atualiza no scroll e no load
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();