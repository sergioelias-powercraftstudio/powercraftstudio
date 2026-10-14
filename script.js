/* ==================== CONFIG ==================== */
/* Envio do formulário via Web3Forms (https://web3forms.com).
   1) Informe contact@powercraftstudio.digital no site deles e confirme o e-mail.
   2) Cole abaixo a Access Key recebida (ela é pública por design). */
var WEB3FORMS_ACCESS_KEY = '071c34fe-8de8-4574-9e3a-c8473502ba6b';
var WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

var DEFAULT_LANG = 'en';           // sempre inicia em inglês (pode mudar depois)
var currentLang = DEFAULT_LANG;

var HTML_LANG = { en: 'en-US', pt: 'pt-BR' };

var I18N_MISC = {
    en: {
        errRequired: 'Please fill in your name, email and project description.',
        errEmail: 'Please enter a valid email address.',
        subject: 'Website contact from ',
        sending: 'Sending...',
        success: 'Thank you! Your message was sent. We will get back to you soon.',
        errSend: 'Could not send your message. Please try again in a moment.',
        errConfig: 'The contact form is not configured yet.'
    },
    pt: {
        errRequired: 'Preencha seu nome, e-mail e a descrição do projeto.',
        errEmail: 'Informe um endereço de e-mail válido.',
        subject: 'Contato pelo site de ',
        sending: 'Enviando...',
        success: 'Obrigado! Sua mensagem foi enviada. Retornaremos em breve.',
        errSend: 'Não foi possível enviar sua mensagem. Tente novamente em instantes.',
        errConfig: 'O formulário de contato ainda não foi configurado.'
    }
};

/* ==================== MENU ==================== */
function toggleMenu() {
    var open = !document.getElementById('mobileMenu').classList.contains('active');
    setMenu(open);
}
function closeMenu() { setMenu(false); }
function setMenu(open) {
    document.getElementById('mobileMenu').classList.toggle('active', open);
    document.getElementById('hamburgerBtn').classList.toggle('active', open);
    document.getElementById('menuBackdrop').classList.toggle('active', open);
    document.getElementById('hamburgerBtn').setAttribute('aria-expanded', open ? 'true' : 'false');
}

/* ==================== IDIOMAS ==================== */
function setLanguage(lang) {
    if (!HTML_LANG[lang]) { lang = DEFAULT_LANG; }
    currentLang = lang;
    document.documentElement.lang = HTML_LANG[lang];

    // Textos
    document.querySelectorAll('[data-' + lang + ']').forEach(function (el) {
        var txt = el.getAttribute('data-' + lang);
        if (txt !== null) { el.textContent = txt; }
    });

    // Imagens com texto embutido: img/<nome>-en.png | img/<nome>-pt.png
    document.querySelectorAll('img[data-img]').forEach(function (img) {
        img.src = 'img/' + img.getAttribute('data-img') + '-' + lang + '.png';
        var alt = img.getAttribute('data-alt-' + lang);
        if (alt) { img.alt = alt; }
    });

    // aria-labels traduzíveis
    document.querySelectorAll('[data-' + lang + '-aria]').forEach(function (el) {
        el.setAttribute('aria-label', el.getAttribute('data-' + lang + '-aria'));
    });

    // Botão de idioma ativo
    var en = document.querySelector('.btn-en');
    var pt = document.querySelector('.btn-pt');
    if (en && pt) {
        en.classList.toggle('active', lang === 'en');
        pt.classList.toggle('active', lang === 'pt');
    }

    // Limpa mensagens do formulário (idioma antigo)
    var err = document.getElementById('formError');
    if (err) { err.hidden = true; }
    var ok = document.getElementById('formSuccess');
    if (ok) { ok.hidden = true; }
}

/* ==================== POWER PLATFORM (hover / toque no título) ==================== */
(function () {
    var title = document.getElementById('heroTitle');
    var overlay = document.getElementById('ppOverlay');
    if (!title || !overlay) { return; }

    var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    var shown = false;

    function show(v) {
        shown = v;
        overlay.classList.toggle('show', v);
        title.classList.toggle('open', v);
        overlay.setAttribute('aria-hidden', v ? 'false' : 'true');
    }

    if (isTouch) {
        overlay.classList.add('touch');
        title.addEventListener('click', function (e) { e.stopPropagation(); show(!shown); });
        overlay.addEventListener('click', function () { show(false); });
    } else {
        title.addEventListener('mouseenter', function () { show(true); });
        title.addEventListener('mouseleave', function () { show(false); });
    }
    // Teclado (acessibilidade)
    title.addEventListener('focus', function () { if (!isTouch) { show(true); } });
    title.addEventListener('blur', function () { if (!isTouch) { show(false); } });
    title.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(!shown); }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { show(false); } });
})();

/* ==================== MODAL DE CONTATO ==================== */
(function () {
    var modal = document.getElementById('contactModal');
    var openBtn = document.getElementById('openContact');
    var closeBtn = document.getElementById('closeContact');
    var form = document.getElementById('contactForm');
    var errBox = document.getElementById('formError');
    var lastFocus = null;
    if (!modal) { return; }

    modal.removeAttribute('hidden');   // visibilidade passa a ser controlada pela classe .open

    function openModal() {
        lastFocus = document.activeElement;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        setTimeout(function () { document.getElementById('cName').focus(); }, 50);
    }
    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
        if (lastFocus) { lastFocus.focus(); }
    }

    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) { if (e.target === modal) { closeModal(); } });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('open')) { closeModal(); }
    });

    var submitBtn = form.querySelector('.submit-btn');
    var sending = false;

    /* Pop-up de confirmação após o envio */
    var successModal = document.getElementById('successModal');
    var successClose = document.getElementById('closeSuccess');
    var successTimer = null;
    successModal.removeAttribute('hidden');

    function openSuccess() {
        successModal.classList.add('open');
        document.body.style.overflow = 'hidden';
        successClose.focus();
        clearTimeout(successTimer);
        successTimer = setTimeout(closeSuccess, 8000);   // fecha sozinho após 8 s
    }
    function closeSuccess() {
        clearTimeout(successTimer);
        successModal.classList.remove('open');
        document.body.style.overflow = '';
    }
    successClose.addEventListener('click', closeSuccess);
    successModal.addEventListener('click', function (e) { if (e.target === successModal) { closeSuccess(); } });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && successModal.classList.contains('open')) { closeSuccess(); }
    });

    function showError(text) { errBox.textContent = text; errBox.hidden = false; }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (sending) { return; }
        var t = I18N_MISC[currentLang];
        var name = document.getElementById('cName').value.trim();
        var email = document.getElementById('cEmail').value.trim();
        var msg = document.getElementById('cMsg').value.trim();
        var honeypot = document.getElementById('cBotcheck').checked;

        if (honeypot) { return; }   // robôs preenchem o campo oculto
        if (!name || !email || !msg) { showError(t.errRequired); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError(t.errEmail); return; }
        if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY.indexOf('YOUR_ACCESS_KEY') === 0) {
            console.warn('Defina WEB3FORMS_ACCESS_KEY no script.js.');
            showError(t.errConfig);
            return;
        }

        errBox.hidden = true;
        sending = true;
        submitBtn.disabled = true;
        submitBtn.textContent = t.sending;

        fetch(WEB3FORMS_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                access_key: WEB3FORMS_ACCESS_KEY,
                subject: t.subject + name,
                from_name: 'PowerCraftStudio.digital',
                name: name,
                email: email,
                message: msg,
                language: currentLang
            })
        })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (data && data.success) {
                form.reset();
                closeModal();
                openSuccess();
            } else {
                showError(t.errSend);
            }
        })
        .catch(function () { showError(t.errSend); })
        .then(function () {
            sending = false;
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.getAttribute('data-' + currentLang);
        });
    });
})();

/* ==================== ANIMAÇÕES (revelar + contadores) ==================== */
(function () {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function runCounter(el) {
        var to = parseFloat(el.getAttribute('data-to'));
        if (reduce || isNaN(to) || to === 0) { el.textContent = isNaN(to) ? el.textContent : to; return; }
        var dur = 1400, start = null;
        function step(ts) {
            if (start === null) { start = ts; }
            var p = Math.min((ts - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(to * eased);
            if (p < 1) { requestAnimationFrame(step); }
        }
        el.textContent = '0';
        requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
        return;
    }

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) { return; }
            var el = entry.target;
            el.classList.add('in');
            el.querySelectorAll('.count').forEach(runCounter);
            io.unobserve(el);
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

    // Item do menu destacado conforme a seção visível
    var links = document.querySelectorAll('.mobile-menu a[href^="#page-"]');
    var groups = { 'page-1': 'page-1', 'page-2': 'page-2', 'page-3': 'page-3', 'page-4': 'page-4',
                   'page-5': 'page-5', 'page-6': 'page-5', 'page-7': 'page-5', 'page-8': 'page-5', 'page-9': 'page-9' };
    var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) { return; }
            var target = groups[entry.target.id];
            links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + target); });
        });
    }, { threshold: 0.55 });
    document.querySelectorAll('.page').forEach(function (s) { spy.observe(s); });
})();

/* Teclado no hambúrguer */
document.getElementById('hamburgerBtn').addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); }
});
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeMenu(); } });

/* ==================== INIT ==================== */
document.addEventListener('DOMContentLoaded', function () { setLanguage(DEFAULT_LANG); });
