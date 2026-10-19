(function () {
    'use strict';

    var translations = {
        en: { 'nav.home': 'Home', 'nav.about': 'About', 'nav.contact': 'Contact', 'cta.learn': 'Learn More', 'cta.contact': 'Contact Me', 'about.title': 'About Me', 'contact.title': 'Contact Me', 'profile.title': 'Profile', 'basic.title': 'Basic Information', 'interests.title': 'Personal Interests', 'contact.info': 'Contact Information', 'label.email': 'Email', 'label.location': 'Location', 'label.Douyin': 'Douyin', 'label.Telegram': 'TG Channel', 'label.Steam': 'Steam ID' },
        cn: { 'nav.home': '首页', 'nav.about': '关于', 'nav.contact': '联系', 'cta.learn': '了解更多', 'cta.contact': '联系我', 'about.title': '关于我', 'contact.title': '联系我', 'profile.title': '个人简介', 'basic.title': '基本信息', 'interests.title': '个人兴趣', 'contact.info': '联系信息', 'label.email': '邮箱', 'label.location': '地点', 'label.Douyin': '抖音', 'label.Telegram': 'TG 频道', 'label.Steam': 'Steam ID' }
    };

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var menuBtn = document.getElementById('menuBtn');
    var mobileMenu = document.getElementById('mobileMenu');
    var nav = document.getElementById('siteNavbar');
    var langBtn = document.getElementById('langBtn');
    var langWrapper = langBtn ? langBtn.closest('.lang-wrapper') : null;
    var i18nEls = null;

    function applyLang(lang) {
        if (!i18nEls) i18nEls = Array.prototype.slice.call(document.querySelectorAll('[data-i18n]'));
        var pack = translations[lang] || translations.en;
        i18nEls.forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            if (el.dataset.i18nBase === undefined) el.dataset.i18nBase = el.textContent;
            el.textContent = pack[key] || translations.en[key] || el.dataset.i18nBase;
        });
        if (langBtn) langBtn.textContent = lang === 'cn' ? '中文' : 'EN';
        document.documentElement.lang = lang === 'cn' ? 'zh-CN' : 'en';
        try { localStorage.setItem('siteLang', lang); } catch (e) {}
    }

    var stored = null;
    try { stored = localStorage.getItem('siteLang'); } catch (e) {}
    applyLang(stored || (navigator.language && navigator.language.indexOf('zh') === 0 ? 'cn' : 'en'));

    function isMenuOpen() {
        return !!mobileMenu && !mobileMenu.classList.contains('hidden');
    }

    function setMenu(open) {
        if (!menuBtn || !mobileMenu) return;
        mobileMenu.classList.toggle('hidden', !open);
        menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    function setLangOpen(open, persistent) {
        if (!langWrapper) return;
        langWrapper.classList.toggle('open', open);
        langWrapper.classList.toggle('open-persistent', !!open && !!persistent);
        if (langBtn) langBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    function closeLang() {
        setLangOpen(false, false);
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', function () {
            var open = !isMenuOpen();
            setMenu(open);
            if (open) closeLang();
        });
    }

    if (langBtn) {
        langBtn.addEventListener('click', function () {
            var persistent = langWrapper.classList.contains('open-persistent');
            setMenu(false);
            setLangOpen(!persistent, !persistent);
        });
    }

    document.querySelectorAll('#langDropdown [data-lang]').forEach(function (b) {
        b.addEventListener('click', function () {
            applyLang(b.getAttribute('data-lang'));
            closeLang();
        });
    });

    if (langWrapper && window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        langWrapper.addEventListener('mouseenter', function () {
            setLangOpen(true, langWrapper.classList.contains('open-persistent'));
        });
        langWrapper.addEventListener('mouseleave', function () {
            if (!langWrapper.classList.contains('open-persistent')) setLangOpen(false, false);
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        if (langWrapper && langWrapper.classList.contains('open')) {
            closeLang();
            if (langBtn) langBtn.focus();
            return;
        }
        if (isMenuOpen()) {
            setMenu(false);
            if (menuBtn) menuBtn.focus();
        }
    });

    document.addEventListener('click', function (e) {
        if (langWrapper && langWrapper.contains(e.target)) return;
        closeLang();
        if (isMenuOpen() && !(nav && nav.contains(e.target))) setMenu(false);
    });

    document.addEventListener('click', function (e) {
        var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
        if (!a) return;
        var href = a.getAttribute('href');
        if (href === '#' || href.length < 2) return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        setMenu(false);
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        if (location.hash === href) return;
        if (history.pushState) history.pushState(null, '', href);
        else location.hash = href;
    });

    function reveal() {
        var cards = Array.prototype.slice.call(document.querySelectorAll('.card'));
        if (!('IntersectionObserver' in window) || reduceMotion) {
            cards.forEach(function (el) { el.classList.add('animate-slide-up'); });
            return;
        }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('animate-slide-up');
                io.unobserve(entry.target);
            });
        }, { threshold: 0.1 });
        cards.forEach(function (el) { io.observe(el); });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', reveal);
    } else {
        reveal();
    }

    if (nav) {
        var rafId = null;
        var updateNavbar = function () {
            nav.classList.toggle('site-navbar-expanded', window.scrollY > 91);
        };
        window.addEventListener('scroll', function () {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(updateNavbar);
        }, { passive: true });
        updateNavbar();
    }
})();
