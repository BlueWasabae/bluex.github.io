// ========================================================
// BlueX Portfolio & Trading Ecosystem - Core Engine
// Features:
// 1. Navigation & Smooth Scroll
// 2. Light & Dark Theme Toggle with Persistence
// 3. Complete Bilingual Khmer (ážáŸ’áž˜áŸ‚ážš) & English Localization Engine
// 4. Institutional Forex & Gold Lot Size & Risk Calculator
// 5. YouTube Video Showcase Switcher
// 6. Interactive FAQ Accordion
// 7. Scroll Reveal & Ambient Light Animations
// 8. Contact Form Handling
// ========================================================

document.addEventListener('DOMContentLoaded', () => {

  // ========================================================
  // 0. CLEAN URL NORMALIZATION: Strip .html without reloading
  // ========================================================
  if (window.history && window.history.replaceState && window.location.pathname.endsWith('.html')) {
    const cleanPath = window.location.pathname.replace(/\.html$/, '');
    window.history.replaceState(null, '', cleanPath + window.location.search + window.location.hash);
  }

  // ========================================================
  // 1. NAVIGATION ACTIVE STATE & SMOOTH SCROLLING (ZERO REFLOW)
  // ========================================================
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');
  let sectionPositions = [];

  function cacheSectionPositions() {
    sectionPositions = Array.from(sections).map(current => ({
      id: current.getAttribute('id'),
      top: current.offsetTop - 140,
      height: current.offsetHeight
    }));
  }
  cacheSectionPositions();
  window.addEventListener('resize', cacheSectionPositions, { passive: true });
  window.addEventListener('load', cacheSectionPositions, { passive: true });

  let navScrollTicking = false;
  function updateActiveNavLink() {
    const currentPath = window.location.pathname.replace(/\/$/, '');
    const isSmcGenesis = currentPath.endsWith('smc-genesis') || currentPath.endsWith('smc-genesis.html');
    const isGoldHedging = currentPath.endsWith('gold-hedging') || currentPath.endsWith('gold-hedging.html');
    const isKnowledge = currentPath.endsWith('knowledge') || currentPath.endsWith('knowledge.html');

    if (isSmcGenesis || isGoldHedging || isKnowledge) {
      navLinks.forEach(link => {
        const href = (link.getAttribute('href') || '').replace(/\/$/, '');
        if (
          (isSmcGenesis && (href.includes('smc-genesis') || href.endsWith('smc-genesis'))) ||
          (isGoldHedging && (href.includes('gold-hedging') || href.endsWith('gold-hedging'))) ||
          (isKnowledge && (href.includes('knowledge') || href.endsWith('knowledge')))
        ) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
      navScrollTicking = false;
      return;
    }

    const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    for (let i = 0; i < sectionPositions.length; i++) {
      const s = sectionPositions[i];
      if (scrollY >= s.top && scrollY < s.top + s.height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${s.id}`) {
            if (!link.classList.contains('active')) link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
        break;
      }
    }
    navScrollTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!navScrollTicking) {
      window.requestAnimationFrame(updateActiveNavLink);
      navScrollTicking = true;
    }
  }, { passive: true });
  updateActiveNavLink();

  // ========================================================
  // 1A. LUXURY MOBILE NAVIGATION DRAWER & BACKDROP
  // ========================================================
  const siteHeader = document.querySelector('.site-header');
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  // Inject or retrieve drawer backdrop
  let navBackdrop = document.querySelector('.nav-drawer-backdrop');
  if (!navBackdrop) {
    navBackdrop = document.createElement('div');
    navBackdrop.className = 'nav-drawer-backdrop';
    document.body.appendChild(navBackdrop);
  }

  function updateHamburgerIcon(isOpen) {
    const hbIcon = document.getElementById('hamburgerIcon');
    const closeIcon = document.getElementById('hamburgerCloseIcon');
    if (hbIcon && closeIcon) {
      hbIcon.style.display = isOpen ? 'none' : 'block';
      closeIcon.style.display = isOpen ? 'block' : 'none';
    }
  }

  function openMobileMenu() {
    if (!navMenu) return;
    if (siteHeader) {
      siteHeader.classList.remove('header-hidden');
      siteHeader.classList.add('menu-open');
    }
    navMenu.classList.add('mobile-open');
    if (mobileToggle) mobileToggle.classList.add('active');
    if (navBackdrop) navBackdrop.classList.add('active');
    document.body.classList.add('menu-drawer-locked');
    document.documentElement.classList.add('menu-open');
    
    // Explicitly hide floating action CTA so it NEVER collides with drawer buttons
    const floatingCta = document.querySelector('.genesis-floating-cta');
    if (floatingCta) {
      floatingCta.style.setProperty('display', 'none', 'important');
    }

    updateHamburgerIcon(true);
    // CRITICAL: Pause background canvas immediately to guarantee zero lag in menu
    if (window.pauseBluexCanvas) {
      window.pauseBluexCanvas();
    }
  }

  function closeMobileMenu() {
    if (!navMenu) return;
    navMenu.classList.remove('mobile-open');
    if (siteHeader) siteHeader.classList.remove('menu-open');
    if (mobileToggle) mobileToggle.classList.remove('active');
    if (navBackdrop) navBackdrop.classList.remove('active');
    document.body.classList.remove('menu-drawer-locked');
    document.documentElement.classList.remove('menu-open');

    // Restore floating action CTA
    const floatingCta = document.querySelector('.genesis-floating-cta');
    if (floatingCta) {
      floatingCta.style.removeProperty('display');
    }

    updateHamburgerIcon(false);
    // Resume background canvas smoothly
    if (window.resumeBluexCanvas) {
      window.resumeBluexCanvas();
    }
  }

  if (mobileToggle && navMenu) {
    let lastToggleTime = 0;
    function handleMenuToggle(e) {
      const now = Date.now();
      if (now - lastToggleTime < 300) {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        return;
      }
      lastToggleTime = now;
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (navMenu.classList.contains('mobile-open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    }

    // Bind pointerup, touchend, and click with debounce for instant response on all mobile engines
    mobileToggle.addEventListener('pointerup', handleMenuToggle);
    mobileToggle.addEventListener('touchend', handleMenuToggle, { passive: false });
    mobileToggle.addEventListener('click', handleMenuToggle);

    if (navBackdrop) {
      navBackdrop.addEventListener('pointerup', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeMobileMenu();
      });
      navBackdrop.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeMobileMenu();
      }, { passive: false });
      navBackdrop.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeMobileMenu();
      });
    }

    document.addEventListener('click', (e) => {
      if (e.target.closest('#navDrawerCloseBtn')) {
        e.preventDefault();
        closeMobileMenu();
      }
    });
    document.addEventListener('touchend', (e) => {
      if (e.target.closest('#navDrawerCloseBtn')) {
        e.preventDefault();
        closeMobileMenu();
      }
    }, { passive: false });

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href) {
          closeMobileMenu();
          return;
        }

        const currentPath = window.location.pathname.replace(/\/$/, '');
        const isCurrentIndex = currentPath === '' || currentPath.endsWith('index.html');
        const targetsIndex = href === 'index.html' || href.startsWith('index.html#') || href === '/index.html' || href.startsWith('/index.html#');

        // Navigating from a subpage (e.g. smc-genesis.html) to index.html
        if (!isCurrentIndex && targetsIndex) {
          closeMobileMenu();
          window.location.href = href;
          return;
        }

        // On index page with hash link
        if (isCurrentIndex && href.startsWith('#')) {
          const targetEl = document.querySelector(href);
          if (targetEl) {
            e.preventDefault();
            closeMobileMenu();
            setTimeout(() => {
              targetEl.scrollIntoView({ behavior: 'smooth' });
            }, 60);
            return;
          }
        }

        // Standard link close with small delay so click event finishes dispatch
        setTimeout(() => {
          closeMobileMenu();
        }, 80);
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('mobile-open')) {
        closeMobileMenu();
      }
    });
  }

  // ========================================================
  // 1B. CLICK LOGO TO SMOOTH SCROLL TO TOP OR NAVIGATE HOME
  // ========================================================
  const logoTriggers = document.querySelectorAll('.logo, .nav-logo-3d-img, a[href="#top"], a[href="#hero"]');
  logoTriggers.forEach(el => {
    el.addEventListener('click', (e) => {
      const anchor = el.closest('a') || (el.tagName === 'A' ? el : null);
      const href = anchor ? anchor.getAttribute('href') : null;
      const currentPath = window.location.pathname.replace(/\/$/, '');
      const isIndex = currentPath === '' || currentPath.endsWith('index.html');

      // If on index (or root) and link points to top/hero or has no href
      if (isIndex) {
        if (!href || href === '#top' || href === '#hero' || href === '#' || href === 'index.html' || href === 'index.html#top' || href === 'index.html#hero') {
          e.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
          if (window.history && window.history.replaceState) {
            window.history.replaceState(null, null, window.location.pathname + window.location.search);
          }
          closeMobileMenu();
        }
      } else {
        // On subpage (smc-genesis.html, knowledge.html)
        if (href && (href === 'index.html' || href.startsWith('index.html') || href === '/' || href.startsWith('/index.html'))) {
          closeMobileMenu();
          window.location.href = href;
          return;
        }
        if (href === '#top' || href === '#') {
          e.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
          closeMobileMenu();
        }
      }
    });
  });


  // Safe LocalStorage helpers for file:// and sandboxed iframe environments
  function safeGetStorage(key, fallback) {
    try {
      return localStorage.getItem(key) || fallback;
    } catch (e) {
      return fallback;
    }
  }

  function safeSetStorage(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {}
  }

  let currentLang = safeGetStorage('bluex_lang', 'en');

  // ========================================================
  // GLOBAL TOAST NOTIFICATION ENGINE
  // ========================================================
  let toastNoticeEl = null;
  let toastMsgEl = null;
  let toastTimer = null;

  function showToast(message) {
    if (!toastNoticeEl) {
      toastNoticeEl = document.getElementById('toastNotice');
      if (!toastNoticeEl) {
        toastNoticeEl = document.createElement('div');
        toastNoticeEl.id = 'toastNotice';
        toastNoticeEl.className = 'toast-notice';
        toastMsgEl = document.createElement('span');
        toastMsgEl.id = 'toastMessage';
        toastNoticeEl.appendChild(toastMsgEl);
        document.body.appendChild(toastNoticeEl);
      } else {
        toastMsgEl = document.getElementById('toastMessage') || toastNoticeEl;
      }
    }
    if (!toastMsgEl) {
      toastMsgEl = document.getElementById('toastMessage') || toastNoticeEl;
    }
    toastMsgEl.textContent = message;
    toastNoticeEl.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNoticeEl.classList.remove('show');
    }, 4000);
  }
  window.showToast = showToast;

  // ========================================================
  // 2. LIGHT & DARK MODE THEME TOGGLE
  // ========================================================
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const sunIcon = document.getElementById('sunIcon');
  const moonIcon = document.getElementById('moonIcon');

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'block';
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (sunIcon) sunIcon.style.display = 'block';
      if (moonIcon) moonIcon.style.display = 'none';
    }
    safeSetStorage('bluex_theme', theme);
  }

  const savedTheme = safeGetStorage('bluex_theme', 'dark');
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
    });
  }

  // ========================================================
  // 2B. EFFECTS FREEZE & PERFORMANCE LITE ENGINE (SMOOTH MOBILE 60FPS)
  // ========================================================
  const fxToggleBtn = document.getElementById('fxToggleBtn');
  const fxToggleDrawerBtn = document.getElementById('fxToggleDrawerBtn');
  const fxNavIcon = document.getElementById('fxNavIcon');
  const fxBtnText = document.getElementById('fxBtnText');
  const fxDrawerIcon = document.getElementById('fxDrawerIcon');
  const fxDrawerText = document.getElementById('fxDrawerText');

  function updateFxButtonTexts() {
    const isFrozen = document.documentElement.classList.contains('effects-frozen');
    if (isFrozen) {
      if (fxNavIcon) fxNavIcon.textContent = 'â„ï¸';
      if (fxBtnText) fxBtnText.textContent = 'OFF';
      if (fxToggleBtn) {
        fxToggleBtn.classList.add('fx-frozen');
        fxToggleBtn.setAttribute('title', currentLang === 'km' ? 'áž…áž›áž“áž¶: áž•áŸ’áž¢áž¶áž€ (áž…áž»áž…ážŠáž¾áž˜áŸ’áž”áž¸áž”áž¾áž€)' : 'Effects: Frozen (Click to Resume)');
      }
      if (fxDrawerIcon) fxDrawerIcon.textContent = 'â„ï¸';
      if (fxDrawerText) {
        fxDrawerText.textContent = currentLang === 'km' ? 'áž…áž›áž“áž¶: áž•áŸ’áž¢áž¶áž€ (áž…áž»áž…ážŠáž¾áž˜áŸ’áž”áž¸áž”áž¾áž€)' : 'Effects: Frozen (Tap to Resume)';
      }
      if (fxToggleDrawerBtn) fxToggleDrawerBtn.classList.add('fx-frozen');
    } else {
      if (fxNavIcon) fxNavIcon.textContent = 'âš¡';
      if (fxBtnText) fxBtnText.textContent = 'FX';
      if (fxToggleBtn) {
        fxToggleBtn.classList.remove('fx-frozen');
        fxToggleBtn.setAttribute('title', currentLang === 'km' ? 'áž…áž›áž“áž¶: áž”áž¾áž€ (áž…áž»áž…ážŠáž¾áž˜áŸ’áž”áž¸áž•áŸ’áž¢áž¶áž€)' : 'Effects: Active (Click to Freeze)');
      }
      if (fxDrawerIcon) fxDrawerIcon.textContent = 'âš¡';
      if (fxDrawerText) {
        fxDrawerText.textContent = currentLang === 'km' ? 'áž…áž›áž“áž¶: áž”áž¾áž€ (áž…áž»áž…ážŠáž¾áž˜áŸ’áž”áž¸áž•áŸ’áž¢áž¶áž€)' : 'Effects: Active (Tap to Freeze)';
      }
      if (fxToggleDrawerBtn) fxToggleDrawerBtn.classList.remove('fx-frozen');
    }
  }

  function applyFxMode(isFrozen, triggerToast = false) {
    if (isFrozen) {
      document.documentElement.classList.add('effects-frozen');
      safeSetStorage('bluex_fx_mode', 'off');
      updateFxButtonTexts();
      if (triggerToast) {
        showToast(currentLang === 'km' ? 'â„ï¸ áž”áž¶áž“áž•áŸ’áž¢áž¶áž€áž…áž›áž“áž¶ â€” ážŠáŸ†ážŽáž¾ážšáž€áž¶ážšáž›áž¿áž“ážšáž›áž¼áž“ (Smooth 60FPS)' : 'â„ï¸ Effects Frozen â€” Smooth Performance Mode');
      }
    } else {
      document.documentElement.classList.remove('effects-frozen');
      safeSetStorage('bluex_fx_mode', 'on');
      updateFxButtonTexts();
      if (triggerToast) {
        showToast(currentLang === 'km' ? 'âš¡ áž…áž›áž“áž¶ážáŸ’ážšáž¼ážœáž”áž¶áž“áž”áž¾áž€ážŠáŸ†ážŽáž¾ážšáž€áž¶ážšáž¡áž¾áž„ážœáž·áž‰' : 'âš¡ Visual Effects Resumed');
      }
      if (typeof window.resumeBluexCanvas === 'function') {
        window.resumeBluexCanvas();
      }
    }
  }

  function toggleFxMode() {
    const isCurrentlyFrozen = document.documentElement.classList.contains('effects-frozen');
    applyFxMode(!isCurrentlyFrozen, true);
  }

  if (fxToggleBtn) {
    fxToggleBtn.addEventListener('click', toggleFxMode);
  }
  if (fxToggleDrawerBtn) {
    fxToggleDrawerBtn.addEventListener('click', toggleFxMode);
  }

  const savedFxMode = safeGetStorage('bluex_fx_mode', 'on');
  if (savedFxMode === 'off') {
    applyFxMode(true, false);
  } else {
    applyFxMode(false, false);
  }


  // ========================================================
  // 3. COMPLETE KHMER (ážáŸ’áž˜áŸ‚ážš) & ENGLISH I18N DICTIONARY & ENGINE
  // ========================================================
  const translations = {
    en: {
      // Nav
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.brokers': 'Brokers',
      'nav.courses': 'Courses',
      'nav.genesis': '<span class="genesis-pulse-dot"></span> SMC Genesis <span class="nav-new-badge">NEW</span>',
      'nav.hedging': '<span class="nav-label-full">Gold </span>Hedging',
      'nav.drawerBrand': 'BLUEX TERMINAL',
      'nav.spotlightDesc': 'Institutional Blueprint: 10 Quantitative Modules',
      'nav.drawerDm': 'Register Now â€” Direct DM (@Le_Bluue)',
      'nav.capital': 'Strategy',
      'nav.calculator': 'Calculator',
      'nav.knowledge': 'Knowledge',
      'nav.pillars': 'Pillars',
      'nav.media': 'Media',
      'nav.faq': 'FAQ',
      'nav.connect': 'Connect',
      'nav.telegram': 'Telegram',
      'nav.register': 'Register Now',
      'nav.registerNow': 'Register Now',
      'nav.fx': 'FX',
      'nav.fxDrawer': 'Effects: Active (Tap to Freeze)',
      'nav.fxDrawerOff': 'Effects: Frozen (Tap to Resume)',

      // Hero
      'hero.hey': 'Hey',
      'hero.imBluex': "I'm BlueX",
      'hero.roleMentor': 'Study Course (Live Teaching) & Portfolio Strategy',
      'hero.sagfxPartner': 'SAGFX Partner',
      'hero.title': 'Master Your <span class="serif-accent">Ego.</span><br>Master Your <span class="gold-accent">Trades.</span>',
      'hero.subRole1': 'Disciplined Trading',
      'hero.subRole2': 'Study Course',
      'hero.subRole3': 'Portfolio Strategy',
      'hero.btnCourse': 'Study Course (Live Teaching)',
      'hero.btnCapital': 'Private Portfolio Strategy â†—',
      'hero.offeringsTitle': 'Core Offerings',
      'hero.offering1': 'Study Course & Live Teaching',
      'hero.offering2': 'Private Portfolio Strategy',
      'hero.offering3': 'Treno Markets, GTC GO & Lirunex',
      'hero.offering4': 'Institutional Liquidity',
      'hero.offering5': 'Strategic Risk Control',
      'hero.offering6': 'Trading Psychology & Ego',
      'hero.bioSnippet': 'Passionate senior trader and mentor committed to building high-probability trading discipline, institutional risk architecture, and long-term capital preservation.',

      // About
      'about.mentorBadge': 'BlueX â€¢ Senior Mentor',
      'about.availableTag': 'Available for Mentorship',
      'about.signatureMotto': '"Master Your Ego.<br><span>Master Your Trades.</span>"',
      'about.signatureRole': 'Senior Trader & Private Mentor',
      'about.leadText': 'I\'m a passionate trader and mentor committed to building opportunities through <span style="color:var(--color-gold);">disciplined execution</span>, strategic risk management, and a long-term market perspective.',
      'about.p1': 'I believe that <strong>successful investing is driven by consistency, patience, and sound decision making</strong> â€” not emotion or speculation. My focus is on creating sustainable value while navigating the markets with <strong>professionalism, transparency, and integrity</strong>.',
      'about.p2': 'Whether you\'re an experienced investor or an ambitious trader looking to eliminate psychological sabotage and achieve true consistency, <strong>I welcome individuals who share a long-term vision</strong> and appreciate a disciplined approach to capital management.',
      'about.sagfxNote': 'Affiliate partnerships and payment gateway inquiries via SAGFX are available upon direct request.',
      'about.btnExplore': 'Explore Study Course',

      // Study Course
      'course.badge': 'Selective Admission â€¢ Direct Live Coaching',
      'course.title': 'Study Course with BlueX:<br><span class="highlight">Interactive Live Teaching.</span>',
      'course.leadPitch': 'Direct, interactive live teaching sessions where we dissect real-time market structure together. Every concept is taught live, verified on real-time charts, and tailored to build disciplined institutional execution.',
      'course.standardsTitle': 'Curriculum Standards & Prerequisites',
      'course.standardsSub': 'We uphold selective admission standards to ensure high-conviction execution.',
      'course.std1Title': 'Capital Preservation First',
      'course.std1Desc': 'Must commit to zero-tolerance risk management (0.5%â€“1.0% per trade). Gamblers seeking "get-rich-quick" signals are not admitted.',
      'course.std2Title': 'Rule-Based Mechanical Execution',
      'course.std2Desc': 'Dedication to objective setups: liquidity sweeps, market structure shifts, and imbalances rather than emotional guessing.',
      'course.std3Title': 'Trade Journaling & Review Discipline',
      'course.std3Desc': 'Active maintenance of trade logs, statistical tracking, and execution checklists to eradicate psychological errors.',
      'course.std4Title': 'Commitment to Live Sessions & Practice',
      'course.std4Desc': 'Active participation in live chart sessions, disciplined note-taking, and systematic simulation before deploying live capital.',
      'course.liveBarTitle': 'Direct Live Screen-Sharing Sessions',
      'course.liveBarSub': 'Interactive Real-Time Execution',
      'course.bodyText': 'Most retail traders burn through accounts not because their charts lack technical indicators, but because they have never been taught how institutional Supply & Demand operates, nor how to conquer the emotional sabotage of fear, greed, and ego. In my Study Course, everything is taught through live, real-time chart breakdowns â€” covering market liquidity sweeps, displacement imbalances, asymmetric 1:3+ risk-to-reward architecture, and live execution checklists. You receive real-time guidance to eliminate hesitation, master your ego, and build an enduring, profitable career in financial markets.',
      'course.card1Title': 'Interactive Live Teaching',
      'course.card1Desc': 'Real-time live sessions covering institutional Supply & Demand, liquidity sweeps, and high-probability mechanical setups.',
      'course.card2Title': 'Asymmetric Risk Control',
      'course.card2Desc': 'Zero-tolerance capital preservation with minimum 1:3 risk-to-reward ratios and strict drawdown mitigation.',
      'course.card3Title': 'Ego & Psychology Mastery',
      'course.card3Desc': 'Dedicated psychology curriculum to dismantle revenge trading, FOMO, overleveraging, and emotional bias.',
      'course.card4Title': 'Real-Time Chart Breakdowns',
      'course.card4Desc': 'Hands-on live market analysis, setup reviews, and direct 1-on-1 Q&A to master your execution discipline.',
      'course.btnEnroll': 'Apply via Direct Telegram (@Le_Bluue)',
      'course.btnInquire': 'Submit Study Course Inquiry Below',
      'course.genesisBannerTitle': 'âš¡ SMC GENESIS â€¢ BEYOND THE CHARTS â€” Official Institutional Masterclass âž”',
      'course.genesisBannerSub': 'Explore our 10-Module Quantitative Architecture for XAU/USD Market Structure, S&D Extractions, Liquidity Traps, and Asymmetric Execution.',
      'course.genesisBannerBtn': 'Explore SMC Genesis âž”',

      // Capital & Portfolio Strategy
      'capital.badge': 'Private Capital & Portfolio Strategy â€¢ Negotiable Terms',
      'capital.title': 'Private Capital & Portfolio Strategy for <span class="gold-accent">Qualified Partners.</span>',
      'capital.leadText': 'Systematic portfolio execution and disciplined risk architecture. Bespoke terms negotiable for qualified partners â€” 100% segregated client custody with zero pooled risk.',
      'capital.p1Title': 'Segregated Custody & Account Sovereignty',
      'capital.p1Desc': 'Capital remains strictly in the client\'s own segregated account via institutional broker API, PAMM, or MAM architecture. No pooled retail funds; you retain 100% custodial ownership.',
      'capital.p2Title': 'Negotiable Risk & Drawdown Frameworks',
      'capital.p2Desc': 'Risk parameters, stop-out boundaries, and performance hurdles are established through bilateral negotiation to align precisely with your capital preservation goals.',
      'capital.p3Title': 'Strict Legal & Regulatory Compliance',
      'capital.p3Desc': 'Conducted privately with accredited partners in full adherence to applicable financial laws and SERC non-public solicitation standards.',
      'capital.btnInquire': 'Inquire via Direct Telegram (@Le_Bluue) â†—',
      'capital.confidentialNote': 'Confidential 1-on-1 Consultation',
      'capital.overlayBadge': 'Institutional Execution Active',
      'capital.targetModel': 'Target Risk Model:',
      'capital.govTitle': 'Private Portfolio Strategy Architecture',
      'capital.govSub': 'Direct API / PAMM / MAM Integration',
      'capital.custodyLabel': 'Custody',
      'capital.custodyVal': '100% Client Held',
      'capital.structureLabel': 'Structure',
      'capital.structureVal': 'Bilateral Negotiable',
      'capital.riskGateLabel': 'Risk Gate',
      'capital.riskGateVal': 'Predefined Stop',

      // Calculator
      'calc.badge': 'Risk Architecture â€¢ Position Sizing',
      'calc.title': 'Forex & Gold <span class="gold-accent">Lot Size Calculator</span>',
      'calc.desc': 'Calculate your exact mathematical position size before every market entry. Protect your equity by adhering strictly to BlueX\'s disciplined 0.5%â€“1.0% risk rule.',
      'calc.ruleLabel': 'BlueX Rule 01',
      'calc.ruleVal': 'Never Risk > 1.0% Per Trade',
      'calc.pairLabel': 'Select Instrument / Pair',
      'calc.balanceLabel': 'Account Balance ($)',
      'calc.stopLossLabel': 'Stop Loss (Points / Pips)',
      'calc.riskPercentLabel': 'Risk Percentage (%)',
      'calc.resultsTag': 'Recommended Position Size',
      'calc.safeRisk': 'Disciplined Risk',
      'calc.lotsUnit': 'Standard Lots',
      'calc.cashRiskLabel': 'Max Cash Loss',
      'calc.pipValLabel': 'Point / Pip Value',
      'calc.contractUnitsLabel': 'Contract Volume',
      'calc.targetRewardLabel': '1:3 Target Profit',
      'calc.mottoQuote': '"Master your ego. Never risk capital beyond your rule-based edge." â€” BlueX',

      // Brokers Header
      'broker.sectionSubtitle': 'Partner Infrastructure',
      'broker.sectionTitle': 'Official <span class="italic">Broker Partners</span>',

      // Brokers (GTC GO)
      'broker.tag': 'Recommended Broker Platform',
      'broker.title': 'Trade with <span class="cyan-accent">GTC GO</span>',
      'broker.subDesc': 'Institutional multi-asset trading infrastructure with deep liquidity, ultra-fast STP execution, and advanced charting tools.',
      'broker.trust1': 'âœ“ Tier-1 Regulated',
      'broker.trust2': 'âœ“ Fast Deposit & Withdrawal',
      'broker.trust3': 'âœ“ Raw Interbank Liquidity',
      'broker.tier1Badge': 'Standard Account',
      'broker.tier1Chip': 'Zero Commission',
      'broker.tier1Title': 'Standard STP Account',
      'broker.tier1Desc': 'Direct market STP execution with zero trading commission. Optimized for active intraday traders and disciplined risk execution.',
      'broker.tier1Check1': 'Zero deposit & withdrawal fees',
      'broker.tier1Check2': 'Ultra-low latency STP routing',
      'broker.tier1Check3': 'Full access to Gold, FX, & Indices',
      'broker.tier2Badge': 'Low Spread Account',
      'broker.tier2Chip': 'Zero Markup',
      'broker.tier2Title': 'Raw Spread Interbank Tier',
      'broker.tier2Desc': 'Direct interbank spreads and institutional zero markup. Ideal for institutional swing traders and precision limit entries.',
      'broker.tier2Check1': 'Raw interbank institutional spreads',
      'broker.tier2Check2': 'Zero markup on market spreads',
      'broker.tier2Check3': 'Maximum precision for institutional setups',
      'broker.registerBtn': 'Register here',

      // Brokers (LIRUNEX)
      'lirunex.tag': 'Recommended Broker Platform',
      'lirunex.title': 'Trade with <span class="gold-accent">LIRUNEX</span>',
      'lirunex.subDesc': 'Multi-regulated global STP/ECN brokerage with raw interbank spreads from 0.0 pips, rapid execution, and advanced MT4/MT5 trading infrastructure.',
      'lirunex.trust1': 'âœ“ Multi-Regulated (CySEC & LFSA)',
      'lirunex.trust2': 'âœ“ Fast Deposit & Withdrawal',
      'lirunex.trust3': 'âœ“ Raw Interbank STP / ECN',
      'lirunex.tier1Badge': 'Standard Account',
      'lirunex.tier1Chip': 'Zero Commission',
      'lirunex.tier1Title': 'Standard STP Account',
      'lirunex.tier1Desc': 'Direct market STP execution with zero trading commission. Optimized for active intraday traders and disciplined trade execution.',
      'lirunex.tier1Check1': 'Zero deposit & withdrawal fees',
      'lirunex.tier1Check2': 'Ultra-low latency STP routing',
      'lirunex.tier1Check3': 'Full access to Gold (XAU/USD), FX & Indices',
      'lirunex.tier2Badge': 'Low Spread Account',
      'lirunex.tier2Chip': 'Raw 0.0 Pips',
      'lirunex.tier2Title': 'Prime ECN Interbank Tier',
      'lirunex.tier2Desc': 'Direct interbank spreads starting from 0.0 pips and raw institutional liquidity. Ideal for precision limit entries, algorithmic execution, and swing setups.',
      'lirunex.tier2Check1': 'Raw interbank spreads from 0.0 pips',
      'lirunex.tier2Check2': 'Direct ECN liquidity & depth of market',
      'lirunex.tier2Check3': 'Maximum precision for institutional setups',

      // Treno Markets Broker
      'treno.tag': 'Recommended Broker Platform',
      'treno.title': 'Trade with <span class="cyan-accent">TRENO MARKETS</span>',
      'treno.subDesc': 'Next-generation multi-asset brokerage powered by MetaTrader 5 (MT5), ultra-fast market routing, tight interbank spreads, and instant deposit/withdrawal execution.',
      'treno.trust1': 'âœ“ MetaTrader 5 (MT5)',
      'treno.trust2': 'âœ“ Fast Deposit & Withdrawal',
      'treno.trust3': 'âœ“ Deep Interbank Liquidity',
      'treno.tier1Badge': 'Standard Account',
      'treno.tier1Chip': 'Zero Commission',
      'treno.tier1Title': 'Standard MT5 Account',
      'treno.tier1Desc': 'Direct market execution with zero trading commission. Designed for active swing traders, trend execution, and disciplined risk management.',
      'treno.tier1Check1': 'Zero deposit & withdrawal processing fees',
      'treno.tier1Check2': 'Ultra-fast MT5 execution routing',
      'treno.tier1Check3': 'Full access to Gold, FX, Indices & Commodities',
      'treno.tier2Badge': 'Low Spread Account',
      'treno.tier2Chip': 'Raw 0.0 Pips',
      'treno.tier2Title': 'Raw Spread ECN Tier',
      'treno.tier2Desc': 'Direct interbank spreads starting from 0.0 pips with raw depth-of-market liquidity. Engineered for scalpers, algorithmic traders, and precision entries.',
      'treno.tier2Check1': 'Raw interbank spreads from 0.0 pips',
      'treno.tier2Check2': 'Direct market depth & institutional routing',
      'treno.tier2Check3': 'Maximum precision for tight stop-loss executions',

      // Knowledge & Must-Read Books
      'knowledge.badge': 'Proven Market Wisdom â€¢ Curated Library',
      'knowledge.title': 'Knowledge I Learned & <span class="gold-accent">Must-Read Books</span>',
      'knowledge.subDesc': 'Hard-earned market principles, psychological truths, and timeless books on trading, money, and emotional mastery that shaped my disciplined edge.',
      'knowledge.tabAll': 'All Resources',
      'knowledge.tabLessons': 'Lessons Learned',
      'knowledge.tabBooks': 'Popular Books',
      'knowledge.lessonsHeading': 'Core Lessons Learned in the Real Market',
      'knowledge.booksHeading': 'Must-Read Books: Trading, Money & Psychology',
      'knowledge.openPageBtn': 'Open Full Knowledge Vault â†—',

      // Lessons
      'knowledge.l1Tag': 'Market Structure & Liquidity',
      'knowledge.l1Title': 'Liquidity Sweeps Over Blind Patterns',
      'knowledge.l1Text': 'Retail traders memorize static chart patterns like double tops and trendlines. Institutions view these exact patterns as liquidity pools to sweep before moving price. Never enter until retail stops have been triggered and market structure confirms institutional directional alignment.',
      'knowledge.l1Rule': 'â€œWait for the liquidity sweep before committing capital. Without a sweep, you are the liquidity.â€',

      'knowledge.l2Tag': 'Risk & Survival Math',
      'knowledge.l2Title': 'Capital Preservation is Your Only Lifeline',
      'knowledge.l2Text': 'A trader with a 40% win rate and a 1:3 Risk-to-Reward ratio will exponentially outperform a 90% scalper with no stop loss. Always calculate your exact lot size based on dollar risk (1% to 2% max per trade) and the distance to invalidationâ€”never on emotion.',
      'knowledge.l2Rule': 'â€œDefine your dollar risk before you even consider potential reward. Survive first, compound second.â€',

      'knowledge.l3Tag': 'Trading Psychology & Ego',
      'knowledge.l3Title': 'Ego is the Greatest Account Destroyer',
      'knowledge.l3Text': 'The market has no memory and zero personal interest in you. Losses are operating business expenses, not personal insults. Revenge trading is ego demanding to be right. Elite trading is executing a probabilistic edge with complete emotional detachment.',
      'knowledge.l3Rule': 'â€œMaster your ego. If a loss makes you angry, your position size was too big for your nervous system.â€',

      'knowledge.l4Tag': 'Process & Daily Routine',
      'knowledge.l4Title': 'Consistency is Built in the Unseen Habits',
      'knowledge.l4Text': 'Professional trading is a high-performance mental sport. Consistency is not created during the trade; it is forged through pre-market session reviews, trade journaling, emotional check-ins, and strict adherence to personal non-negotiables.',
      'knowledge.l4Rule': 'â€œA trade outside your rules is a losing trade, even if it ended in profit. Process is everything.â€',

      // Books
      'knowledge.b1Genre': 'Psychology & Probabilities',
      'knowledge.b1Title': 'Trading in the Zone',
      'knowledge.b1Author': 'By Mark Douglas',
      'knowledge.b1Desc': 'The definitive masterwork on eliminating fear, accepting unavoidable market risk, and thinking in statistical probabilities.',
      'knowledge.b1Quote': 'â€œWhen you genuinely accept the risks, you will be at peace with any outcome.â€',
      'knowledge.b1Why': 'Essential for: Overcoming fear of losing & trade execution paralysis.',

      'knowledge.b2Genre': 'Money & Wealth Mindset',
      'knowledge.b2Title': 'The Psychology of Money',
      'knowledge.b2Author': 'By Morgan Housel',
      'knowledge.b2Desc': 'Timeless lessons on how behavioral discipline, staying humble, and long-term compounding surpass raw technical intelligence.',
      'knowledge.b2Quote': 'â€œDoing well with money has a little to do with how smart you are and a lot to do with how you behave.â€',
      'knowledge.b2Why': 'Essential for: Capital longevity & managing wealth without reckless greed.',

      'knowledge.b3Genre': 'Emotional Discipline',
      'knowledge.b3Title': 'The Disciplined Trader',
      'knowledge.b3Author': 'By Mark Douglas',
      'knowledge.b3Desc': 'Deep psychological roadmap detailing how internal beliefs and fear of being wrong sabotage traders, and how to construct rigid mental boundaries.',
      'knowledge.b3Quote': 'â€œNinety-five percent of trading errors stem from fearâ€”fear of being wrong, losing money, and missing out.â€',
      'knowledge.b3Why': 'Essential for: Eradicating emotional tilt and impulsive overtrading.',

      'knowledge.b4Genre': 'Market History & Tape',
      'knowledge.b4Title': 'Reminiscences of a Stock Operator',
      'knowledge.b4Author': 'By Edwin LefÃ¨vre',
      'knowledge.b4Desc': 'The legendary fictionalized biography of Jesse Livermore. Unmatched insights on sitting through winning trends and respecting price action.',
      'knowledge.b4Quote': 'â€œIt was never my thinking that made the big money for me. It was always my sitting.â€',
      'knowledge.b4Why': 'Essential for: Developing immense patience & letting winning trades run.',

      'knowledge.b5Genre': 'Master Strategies',
      'knowledge.b5Title': 'Market Wizards',
      'knowledge.b5Author': 'By Jack D. Schwager',
      'knowledge.b5Desc': 'Legendary interviews with top institutional traders proving that divergent methodologies all share one bedrock: ruthless risk management.',
      'knowledge.b5Quote': 'â€œRisk control is the single most important factor shared by all great traders.â€',
      'knowledge.b5Why': 'Essential for: Understanding how real institutional winners think and operate.',

      'knowledge.b6Genre': 'Habits & Routine',
      'knowledge.b6Title': 'Atomic Habits',
      'knowledge.b6Author': 'By James Clear',
      'knowledge.b6Desc': 'Practical guide to building systematic routines, eliminating friction in positive habits, and compounding 1% daily process improvements.',
      'knowledge.b6Quote': 'â€œYou do not rise to the level of your goals. You fall to the level of your systems.â€',
      'knowledge.b6Why': 'Essential for: Creating daily pre-market preparation & journaling discipline.',

      'knowledge.b7Genre': 'Decision Under Pressure',
      'knowledge.b7Title': 'Thinking, Fast and Slow',
      'knowledge.b7Author': 'By Daniel Kahneman',
      'knowledge.b7Desc': 'Nobel laureate breakdown of System 1 (emotional intuition) vs System 2 (analytical logic), exposing dangerous cognitive biases.',
      'knowledge.b7Quote': 'â€œWe are prone to overestimate how much we understand and underestimate the role of chance.â€',
      'knowledge.b7Why': 'Essential for: Recognizing cognitive bias and eliminating impulsive gambling.',

      'knowledge.b8Genre': 'Margin of Safety',
      'knowledge.b8Title': 'The Intelligent Investor',
      'knowledge.b8Author': 'By Benjamin Graham',
      'knowledge.b8Desc': 'The foundational bible of investment discipline. Teaches emotional detachment from market swings and the vital concept of risk margins.',
      'knowledge.b8Quote': 'â€œThe essence of investment management is the management of risks, not returns.â€',
      'knowledge.b8Why': 'Essential for: High-level risk valuation & swing trading perspective.',

      // Pillars
      'pillars.subtitle': 'Trading Philosophy',
      'pillars.title': 'The Three Pillars of <span class="italic">Consistent Success</span>',
      'pillars.quoteHead': 'Master Your Ego. Master Your Trades.',
      'pillars.quoteSub': 'Calm execution, zero emotional interference, and mechanical edge in financial markets.',
      'pillars.p1Num': 'Pillar 01',
      'pillars.p1Title': 'Disciplined Execution & Risk Management',
      'pillars.p1Desc': 'Every position is backed by strict position sizing, predefined stop levels, and systematic risk-to-reward parameters. Protecting capital is the prerequisite to growing capital.',
      'pillars.p2Num': 'Pillar 02',
      'pillars.p2Title': 'Ego Mastery & Emotional Control',
      'pillars.p2Desc': '"Master Your Ego. Master Your Trades." Overcoming FOMO, greed, and impulsive speculation. We trade with patience and sound decision-making driven by data and probabilistic edges.',
      'pillars.p3Num': 'Pillar 03',
      'pillars.p3Title': 'Long-Term Vision & Market Literacy',
      'pillars.p3Desc': 'Continuous education and deep understanding of global financial markets. Building trusted partnerships, sustainable value, and growing with purpose alongside dedicated traders.',

      // Media
      'media.subtitle': 'Watch & Learn',
      'media.title': 'Latest Breakdowns & <span class="italic">Media Feed</span>',
      'media.ytBadge': 'Featured YouTube Video',
      'media.latestUpload': 'Latest Upload',
      'media.ytSubscribe': 'Subscribe on YouTube',
      'media.watchDirect': 'Watch on YouTube',
      'media.tiktokTitle': 'TikTok Daily Shorts',
      'media.tt1Title': 'Why 95% of Traders Lose Money (The Ego Trap Explained)',
      'media.tt2Title': 'How Banks Hunt Retail Stop Losses Before Big Moves',
      'media.fbTitle': 'Facebook Insights',
      'media.fbPostMeta': 'Recent Market Update â€¢ Public',
      'media.fbPostText': '"Patience is your greatest edge in volatile markets. Never chase green candles out of fear of missing out. True professionals wait for their rules to align and execute with zero hesitation."',
      'media.fbView': 'View Discussions on Facebook',

      // FAQ
      'faq.subtitle': 'Frequently Asked Questions',
      'faq.title': 'Clear Answers for <span class="italic">Disciplined Traders</span>',
      'faq.desc': 'Everything you need to know about our trading curriculum, mentorship framework, risk models, and regulatory compliance.',
      'faq.q1': 'Who are the trading courses and mentorship programs designed for?',
      'faq.a1': 'The curriculum is engineered for developing and intermediate traders who are frustrated with inconsistent results, retail indicator clutter, or emotional trading sabotage. Whether you are seeking structured foundational market literacy or transitioning to institutional Supply & Demand and disciplined capital execution, the program delivers clear, repeatable frameworks.',
      'faq.q2': 'What trading methodology and markets do you cover?',
      'faq.a2': 'We specialize in institutional Supply & Demand, liquidity sweeps, supply-and-demand imbalances, and asymmetric risk architecture. Our primary focus is centered on high-liquidity global markets including major Forex currency pairs, Gold (XAU/USD), and benchmark indices. We do not engage in erratic speculation or low-liquidity gambling.',
      'faq.q3': 'How is the Study Course structured and delivered?',
      'faq.a3': 'All education is delivered through direct, interactive live teaching sessions with BlueX. Every concept is taught live on real-time market charts with screen sharing, direct voice interaction, real-time trade breakdowns, and hands-on execution coaching tailored to eliminate your psychological mistakes.',
      'faq.q4': 'What is your strict approach to risk management?',
      'faq.a4': 'Risk mitigation is our primary core pillar: <em>protect capital before seeking yield</em>. Every position sizing model adheres strictly to predefined account risk (typically 0.5% to 1.0% per trade) and targets asymmetric reward-to-risk ratios of minimum 1:3. We enforce strict stop losses and explicitly reject high-risk martingale or grid tactics.',
      'faq.q5': 'What is BlueX\'s relationship with SAGFX?',
      'faq.a5': 'SAGFX is an affiliate partner and payment gateway service provider. Participation with any third-party broker or platform is entirely voluntary and conducted independently at the trader\'s discretion. Visitors are free to ask about partnership options upon direct inquiry.',
      'faq.q6': 'How is BlueX compliant with Cambodian financial regulations (SERC)?',
      'faq.a6': 'In strict adherence to the regulatory standards set forth by the Securities and Exchange Regulator of Cambodia (SERC) and the Law on Non-Government Securities, all content, study courses, live teaching sessions, and market analysis frameworks provided by BlueX are <strong>100% educational, analytical, and informational</strong>. BlueX does not solicit, accept, pool, or manage public funds, nor act as an unlicensed derivative broker in the Kingdom of Cambodia. All trading activity is strictly self-directed by the individual.',
      'faq.q7': 'How can I enroll in the Study Course or get in touch?',
      'faq.a7': 'You can reach out directly via personal Telegram DM (<a href="https://t.me/Le_Bluue" target="_blank" rel="noopener noreferrer" style="color:var(--color-gold); font-weight:700;">@Le_Bluue</a>), join our official Community Telegram group (<a href="https://t.me/moonbluefx" target="_blank" rel="noopener noreferrer" style="color:var(--color-cyan); font-weight:700;">t.me/moonbluefx</a>), or complete the direct inquiry form on this site. We will promptly provide complete program details and schedule availability.',

      // Connect
      'connect.heading': 'Follow & Connect with <span class="gold">BlueX</span>.',
      'connect.desc': 'Follow my official social channels for daily trade breakdowns, market psychology insights, mentorship announcements, and live market updates.',
      'connect.nameLabel': 'Your Full Name',
      'connect.emailLabel': 'Your Email Address',
      'connect.messageLabel': 'Message / Mentorship Inquiry',
      'connect.btnSubmit': 'Send Direct Inquiry',

      // Compliance
      'compliance.flagBadge': 'Cambodia Regulatory Framework',
      'compliance.title': 'Legal & Regulatory Compliance Statement',
      'compliance.sercBadge': 'SERC Guidance â€¢ Law on Non-Government Securities',
      'compliance.item1Title': '100% Educational & Analytical Purpose',
      'compliance.item1Desc': 'All study courses, live teaching sessions, and market commentary presented on this website are provided strictly for educational and academic purposes. BlueX does not provide personalized investment advice, financial advisory services, or trade execution signals.',
      'compliance.item2Title': 'No Public Fund Management or Capital Pooling',
      'compliance.item2Desc': 'In strict compliance with the laws of the Kingdom of Cambodia, BlueX does NOT solicit, pool, receive, or manage collective funds or public investment capital. No managed accounts, collective investment schemes (CIS), or profit-sharing fund arrangements are offered to retail investors.',
      'compliance.item3Title': 'Independent Education, Not an Unlicensed Broker',
      'compliance.item3Desc': 'BlueX operates as an independent private educator and mentor, NOT as an unlicensed securities firm, broker-dealer, or derivatives broker in Cambodia. References to SAGFX are strictly limited to optional affiliate and payment gateway infrastructure.',
      'compliance.item4Title': 'Self-Directed Execution & Capital Risk Notice',
      'compliance.item4Desc': 'Trading foreign exchange, CFDs, and financial derivatives carries substantial risk of capital loss and is not suitable for all individuals. Market participants are strictly self-directed and must practice sound risk management according to their own financial capacity.',
      'compliance.exactDisclaimer': '<strong>Official Disclaimer:</strong> Disclaimer: This content is for educational purposes only and does not constitute financial or investment advice. Trading in financial markets involves risk. Always conduct your own research and trade responsibly.',

      // SMC Genesis Institutional Portal
      'genesis.badge': 'SMC GENESIS â€¢ BEYOND THE CHARTS',
      'genesis.heroTitle': 'SMC GENESIS â€¢ BEYOND THE CHARTS<br><span class="highlight">Institutional Trading Architecture & Masterclass.</span>',
      'genesis.heroSub': 'An institutional-grade synthesis of Smart Money Concepts 2.0 & 3.0 engineered for Gold (XAU/USD) and major liquid markets. SMC Genesis replaces retail indicator guesswork with a structured 10-Module Quantitative Architectureâ€”teaching you how institutions engineer liquidity, transfer multi-timeframe data, and execute with asymmetric risk precision.',
      'genesis.metric1Val': '10 Modules',
      'genesis.metric1Label': 'Structured Quantitative Curriculum',
      'genesis.metric2Val': 'Zero Indicators',
      'genesis.metric2Label': 'Pure Structure, S&D & Liquidity',
      'genesis.metric3Val': '0.5% â€“ 1.0%',
      'genesis.metric3Label': 'Strict Capital Risk Per Setup',
      'genesis.metric4Val': '1:3 to 1:10+',
      'genesis.metric4Label': 'Asymmetric Risk-to-Reward Profile',
      'genesis.heroApplyBtn': 'âš¡ Register Now â€¢ DM @Le_Bluue',
      'genesis.heroCurriculumBtn': 'Explore 10-Module Syllabus â†“',
      'genesis.heroCommunityBtn': 'ðŸ‘¥ Join Community Telegram (t.me/moonbluefx)',
      'genesis.heroBrokerBtn': 'Execute on Low-Latency Raw Spreads â†’',
      'genesis.tenet1Title': 'MINDSET',
      'genesis.tenet1Desc': 'Probabilistic thinking, emotional neutrality & controlled risk acceptance',
      'genesis.tenet2Title': 'RULES',
      'genesis.tenet2Desc': '100% mechanical checklist discipline â€” no confirmation, no execution',
      'genesis.tenet3Title': 'CONSISTENT',
      'genesis.tenet3Desc': 'Long-term durability where Profit = Knowledge + Repeatable Skill',
      'genesis.specAssetLabel': 'ASSET FOCUS',
      'genesis.specAssetVal': 'XAU/USD (Gold) & Majors',
      'genesis.specStructLabel': 'STRUCTURE LAW',
      'genesis.specStructVal': 'Body-Close BOS / CHoCH',
      'genesis.specBaseLabel': 'BASE FORMATIONS',
      'genesis.specBaseVal': 'RBD â€¢ DBR â€¢ RBR â€¢ DBD',
      'genesis.specMtfLabel': 'TIMEFRAME PIPELINE',
      'genesis.specMtfVal': '4H Macro â†’ 15M S&D â†’ 1M/3M Entry',
      'genesis.specRiskLabel': 'CAPITAL DISCIPLINE',
      'genesis.specRiskVal': '0.5% â€“ 1.0% Risk â€¢ Min 1:3 RR',
      'genesis.introTag': 'EXECUTIVE BRIEFING â€¢ BEYOND THE CHARTS',
      'genesis.introTitle': 'A Quantitative Operating System for Institutional Price Delivery',
      'genesis.introP1': 'Financial markets do not move by random chance or retail chart patterns. Every major price expansion is driven by institutional liquidity engineeringâ€”accumulating orders where retail traders place predictable stop-losses.',
      'genesis.introP2': 'SMC Genesis is the proprietary flagship curriculum of BlueX Academy. It synthesizes foundational Smart Money Concepts into a clean, rule-based institutional desk frameworkâ€”designed to take a trader from raw structural mapping to surgical lower-timeframe execution without ever relying on lagging indicators.',
      'genesis.charter1': 'Data Collection & Homework Discipline: Theory alone builds zero skill. Mastery requires structured backtesting, forward-testing, and systematic chart logging.',
      'genesis.charter2': 'Objective Rule Validation: Every structural break (BOS), internal pullback (IBOS), fractal shift (FTS), and sweep is governed by strict mechanical criteria.',
      'genesis.charter3': 'Protected Intellectual Property: Complete lesson schematics, proprietary entry checklists, and live chart drills are reserved exclusively for enrolled SMC Genesis students.',
      'genesis.wisdom1Tag': 'INSTITUTIONAL WISDOM',
      'genesis.wisdom2Tag': 'DISCIPLINE OVER EMOTION',
      'genesis.creedText': 'SMC GENESIS: áž’áŸ’ážœáž¾áž‚ážºážŠáž¾áž˜áŸ’áž”áž¸áž‘áž¶áŸ†áž„áž¢ážŸáŸ‹áž‚áŸ’áž“áž¶ áž‘áž¶áŸ†áž„áž¢ážŸáŸ‹áž‚áŸ’áž“áž¶áž‚ážºáž’áŸ’ážœáž¾ážŠáž¾áž˜áŸ’áž”áž¸ážáŸ’áž›áž½áž“áž¯áž„!',
      'genesis.creedSub': 'Built for the collective â€¢ Mastered through personal discipline',
      'genesis.shiftBadge': 'The Paradigm Shift â€¢ Institutional vs Retail',
      'genesis.shiftTitle': 'Why 95% of Retail Traders Are Simply Liquidity',
      'genesis.shiftDesc': 'Retail technical analysis teaches traders to place stops right where smart money algorithms look to fill massive institutional orders. SMC Genesis teaches you to identify the engineered traps and execute alongside institutional capital.',
      'genesis.retailColTitle': 'The Retail Indicator Fallacy',
      'genesis.instColTitle': 'The SMC Genesis Institutional Edge',
      'genesis.shiftR1': 'Trading lagging indicators (RSI, MACD, Stochastics) that react long after moves happened.',
      'genesis.shiftI1': 'Reading institutional liquidity sweeps and high-displacement Supply & Demand base formations.',
      'genesis.shiftR2': 'Buying breakouts above resistance, becoming instant liquidity for institutional sell orders.',
      'genesis.shiftI2': 'Waiting for Buy-Side Liquidity sweeps (BSL) and entering on structural shifts into fresh displacement zones.',
      'genesis.shiftR3': 'Poor 1:1 or 1:1.5 risk-to-reward requiring a fragile 70%+ win rate to avoid blowouts.',
      'genesis.shiftI3': 'Asymmetric 1:3+ to 1:5+ risk architecture where a 40% win rate yields substantial compound growth.',
      'genesis.shiftR4': 'Emotional revenge trading, widening stops, and guessing arbitrary tops and bottoms.',
      'genesis.shiftI4': 'Clear institutional invalidation points, predefined risk management, and structured execution routines.',
      'genesis.matrixBadge': 'Multi-Timeframe Synchronization',
      'genesis.matrixTitle': 'Timeframe Execution Matrix: HTF Bias to LTF Refinement',
      'genesis.matrixSub': 'How institutional capital transfers data across timeframes to eliminate retail noise and filter high-conviction entries.',
      'genesis.matrixHtfTier': 'HTF (H4 / D1)',
      'genesis.matrixHtfRole': 'Macro Directional Bias & Major BOS',
      'genesis.matrixHtfDesc': 'Identifies primary institutional macro structural trend and establishes high-probability macro extreme zones.',
      'genesis.matrixMtfTier': 'MTF (M15 / H1)',
      'genesis.matrixMtfRole': 'S&D Zones & Pullback IBOS',
      'genesis.matrixMtfDesc': 'Extracts institutional footprint zones and filters internal structural pullbacks to pinpoint real reversal points.',
      'genesis.matrixLtfTier': 'LTF (M1 / M3)',
      'genesis.matrixLtfRole': 'Surgical Trigger & Tight SL (RR â‰¥ 1:3)',
      'genesis.matrixLtfDesc': 'Confirms micro fractal structural shifts, delivering surgical limit entries with minimal drawdown and maximum yield.',
      'genesis.curriculumBadge': 'Institutional Curriculum Topics',
      'genesis.curriculumTitle': 'Master Topics & Core Institutional Pillars',
      'genesis.curriculumSub': 'A comprehensive introduction to the foundational topics taught inside SMC Genesis. Designed to equip serious traders with the algorithmic mechanics needed to navigate financial markets alongside smart money.',
      'genesis.m1Num': 'Module 01',
      'genesis.m1Title': 'Institutional Mindset & TradingView Setup',
      'genesis.m1Desc': 'The foundational operating philosophy: probabilistic thinking, emotional neutrality, and mechanical checklist discipline. Complete TradingView chart configuration, trendline templates, and zone styling.',
      'genesis.m2Num': 'Module 02',
      'genesis.m2Title': 'Market Structure Foundations (BOS, IBOS, FTS)',
      'genesis.m2Desc': 'The mechanical grammar of price action: distinguishing between Major Trend Continuation (BOS), Internal Retracement Pullbacks (IBOS), and Fractal Structural Shifts (FTS) without retail lagging indicators.',
      'genesis.m3Num': 'Module 03',
      'genesis.m3Title': 'Multi-Timeframe Matrix & Data Transfer Theory',
      'genesis.m3Desc': 'How institutions transfer data across timeframes: High Timeframe (H4/D1) macro bias synchronized with Middle Timeframe (M15/H1) structural pullbacks and Low Timeframe (M1/M3) surgical execution triggers.',
      'genesis.m4Num': 'Module 04',
      'genesis.m4Title': 'The 4 Supply & Demand Extraction Models',
      'genesis.m4Desc': 'Moving beyond basic support/resistance into institutional footprints: Range-Based, Pivot-Based, Single-Candle Extreme Order Block, and Fractal Wick S&D at high-displacement structural origins.',
      'genesis.m5Num': 'Module 05',
      'genesis.m5Title': 'Mitigation Lifecycle & Last Defender (LDD)',
      'genesis.m5Desc': 'The 3-phase institutional zone lifecycle: Zone Creation, Continuation Model, and Reversal Shift. Tracking unmitigated fresh zones, break-even settlements, and the Last Defender Demand/Supply protocol.',
      'genesis.m6Num': 'Module 06',
      'genesis.m6Title': 'Liquidity Anatomy & The 5 Core Retail Traps',
      'genesis.m6Desc': 'How smart money engineers liquidity pools: Buy-Side & Sell-Side pools, the 5 Visual Traps (Swing stops, Double structures, Trendline inducement, Range purges), BCC sweeps vs. Liquidity RUN, and BIO Theory.',
      'genesis.m7Num': 'Module 07',
      'genesis.m7Title': 'Sweep Taxonomy, BCC & BIO Theory',
      'genesis.m7Desc': 'Deep dive into Wick Sweeps vs. Body Candle Closed (BCC) traps. Applying By Independent Objective (BIO) Theory where BOS confirms BOS, IBOS confirms IBOS, and FT confirms FT to prevent false validation.',
      'genesis.m8Num': 'Module 08',
      'genesis.m8Title': 'Canonical Liquidity Sweeps (Cases 1, 2 & 3)',
      'genesis.m8Desc': 'Surgical execution rules for Candlestick Closed In (-X-) notation: Case 1 (BOS sweep requiring IBOS shift), Case 2 (IBOS sweep requiring FT shift), and Case 3 (Fractal sweep requiring structural validation).',
      'genesis.m9Num': 'Module 09',
      'genesis.m9Title': 'The 3 Execution Scenarios (Counter, Pro & Momentum)',
      'genesis.m9Desc': 'Standard operating procedures: Scenario 1 (Counter-Trend Exhaustion at major zones), Scenario 2 (Pro-Trend Refinement Types 1, 2, 3), and Scenario 3 (Instant Momentum Breakout without deep pullback).',
      'genesis.m10Num': 'Module 10',
      'genesis.m10Title': 'Institutional Trade & Risk Management',
      'genesis.m10Desc': 'Defending capital with mathematical rigor: 2-3 Pip Stop Loss Padding against spread spikes, mechanical Break-Even rules, asymmetric 1:3 to 1:10+ RR targets, and strict 0.5%â€“1.0% risk limits.',
      'genesis.tabPillars': 'The Learning Experience',
      'genesis.tabLiquidity': '1. Core Structure & S&D',
      'genesis.tabCommunity': '2. Liquidity & Sweeps',
      'genesis.tabOB': '3. Execution Scenarios',
      'genesis.tabRisk': '4. Class Community & Risk',
      'genesis.tabLqHeading': 'Market Structure & Institutional S&D Architecture',
      'genesis.tabLqText': 'Master the foundational grammar of institutional trading: mapping major BOS, internal IBOS pullbacks, and extracting the 4 high-displacement base formations (RBD, DBR, RBR, DBD) with extreme vs. decisional precision.',
      'genesis.tabLqRule': 'Structure Law: BOS is confirmed ONLY by a full candle-body close past major swing points.',
      'genesis.tabCommunityHeading': 'Liquidity Engineering & The 5 Core Retail Traps',
      'genesis.tabCommunityText': 'Deconstruct how smart money engineers liquidity to fill massive orders. Learn to identify the 5 visual traps, distinguish between BCC (Body Candle Closed) and wick sweeps, and apply BIO Theory to navigate market runs.',
      'genesis.tabCommunityRule': 'Liquidity Law: Never enter at retail support/resistance. Wait for the sweep of liquidity first.',
      'genesis.tabObHeading': 'The 3 High-Probability Execution Scenarios',
      'genesis.tabObText': 'Execute with precision using the 3 mechanical scenario models developed in SMC Genesis: Counter-Trend Sweep (Scenario 1), Pro-Trend Pullback Refinement (Scenario 2), and Clean Expansion Breakout (Scenario 3).',
      'genesis.tabObRule': 'Execution Law: Select your entry model based on market data collection, never emotional anticipation.',
      'genesis.tabRiskHeading': 'Capital Preservation & Official Student Community',
      'genesis.tabRiskText': 'Institutional success requires unbreakable risk discipline and a focused learning environment. Adhere to our strict 0.5%â€“1.0% risk rule and collaborate with fellow disciplined traders inside our official group (t.me/moonbluefx).',
      'genesis.tabRiskRule': 'Capital Philosophy: Keep risk strictly at 0.5%â€“1.0% per trade. Let asymmetric math create long-term compound growth.',
      'genesis.admissionBadge': 'ðŸŽ“ 5-Pillar Mastery Framework â€¢ Official Institutional Class',
      'genesis.admissionTitle': 'Institutional Class: The 5-Pillar Mastery Framework',
      'genesis.admissionSub': 'A structured curriculum designed to build professional competence across market structure, supply and demand extraction, liquidity traps, execution scenarios, and capital allocation:',
      'genesis.std1Title': 'Pillar 01: Market Structure Mechanics (BOS, IBOS, FTS)',
      'genesis.std1Desc': 'Master Swing High/Low mechanics, distinguishing between Major BOS (continuation), IBOS (internal pullbacks), and Fractal Structural Shifts (FTS).',
      'genesis.std1Outcome': 'Applied Outcome: Map swing flow & synchronized multi-timeframe matrix with clarity.',
      'genesis.std2Title': 'Pillar 02: Institutional S&D Architecture (RBD, DBR, RBR, DBD)',
      'genesis.std2Desc': 'Learn the 4 core institutional base formations: Rally-Base-Drop, Drop-Base-Rally, Rally-Base-Rally, and Drop-Base-Drop with Extreme vs. Decisional mitigation mapping.',
      'genesis.std2Outcome': 'Applied Outcome: Accurately mark high-displacement base formations and mitigation chains.',
      'genesis.std3Title': 'Pillar 03: Liquidity Sweeps & Trap Exploitation',
      'genesis.std3Desc': 'Unpack the 5 core retail liquidity traps: Swing pools, Double structure liquidity, Trendline traps, Range sweeps, and Inducement mechanics.',
      'genesis.std3Outcome': 'Applied Outcome: Detect stop-hunts, liquidity magnets, and inducement traps in advance.',
      'genesis.std4Title': 'Pillar 04: Precision Execution Scenarios (Scenarios 1, 2, 3)',
      'genesis.std4Desc': 'Understand high-probability scenario execution: Counter-Trend Exhaustion, Structure Refinement Pro-Trend, and Instant Momentum Expansion.',
      'genesis.std4Outcome': 'Applied Outcome: Confidently execute order scenarios with refined triggers and tight stops.',
      'genesis.std5Title': 'Pillar 05: Asymmetric Capital Allocation (0.5%â€“1.0% Rule)',
      'genesis.std5Desc': 'Defend trading capital through disciplined position sizing (0.5%â€“1.0%), dynamic break-even progression, and targeting asymmetric RR â‰¥ 1:3.',
      'genesis.std5Outcome': 'Applied Outcome: Safeguard capital longevity through mathematical asymmetric expectancy.',
      'genesis.quoteText': '"Trading success is not built on never taking a loss, but on unwavering discipline and defending your capital at all costs."',
      'genesis.quoteAuthor': 'â€” SMC Genesis Institutional Blueprint â€¢ BlueX',
      'genesis.applyTelegramBtn': 'Message BlueX on Telegram (Direct DM: @Le_Bluue)',
      'genesis.communityTelegramBtn': 'Join Official Community Group (t.me/moonbluefx)',
      'genesis.announcementBadge': 'ðŸ”¥ Admissions Open',
      'genesis.announcementText': 'SMC Genesis Class â€” Master Gold (XAU/USD) Market Structure & S&D with BlueX',
      'genesis.announcementBtn': 'Enroll in Class via Telegram â†’',
      'genesis.spotlightBadge': 'ðŸŽ¯ Official SMC Genesis Class',
      'genesis.spotlightTitle': 'Enroll in the SMC Genesis Institutional Class',
      'genesis.spotlightSub': 'We cut through retail illusions to teach you the mechanical precision required to trade institutional markets. Gain the confidence, rules, and execution habits of a professional operator.',
      'genesis.spotlightStatus': 'â— Admissions Active â€¢ Limited Class Intake',
      'genesis.spotlightPerk1Title': 'Structured Class Curriculum',
      'genesis.spotlightPerk1Desc': 'Direct instruction from master trader BlueX through structured lecture modules, step-by-step chart breakdowns, and live student Q&A.',
      'genesis.spotlightPerk2Title': 'Pure Mechanical Playbook',
      'genesis.spotlightPerk2Desc': 'Zero subjective guesswork. Definitive rules for body-close BOS, 4 S&D extraction types, and 3 execution scenarios.',
      'genesis.spotlightPerk3Title': 'Live Chart Case Studies',
      'genesis.spotlightPerk3Desc': 'Analyze live Gold (XAU/USD) market structure before high-volume sessions. See how institutional zones are identified in real time.',
      'genesis.spotlightPerk4Title': 'Official Student Community',
      'genesis.spotlightPerk4Desc': 'Access to the verified student community group (t.me/moonbluefx) for daily bias sharing, key structural levels, and ongoing member growth.',
      'genesis.spotlightActionTitle': 'Ready to Master Institutional Trading?',
      'genesis.spotlightActionDesc': 'Limited seats per class intake to ensure high-conviction student execution and focused learning.',
      'genesis.spotlightActionBtn': 'âš¡ Inquire for Class Admissions: DM @Le_Bluue',
      'genesis.floatingCta': 'âš¡ Register Now - DM @Le_Bluue',
      'genesis.brokerBadge': 'Execution Speed & Raw Liquidity',
      'genesis.brokerTitle': 'Recommended Brokers for SMC Execution',
      'genesis.brokerDesc': 'Smart Money Concepts execution requires ultra-low latency, tightest raw spreads, deep order books, and zero artificial slippage. We recommend the following tier-1 regulated partners:',
      'genesis.brokerTrenoNote': 'Top Partner â€¢ Raw Spreads â€¢ Ultra-Low Latency',
      'genesis.brokerGtcNote': 'Global Multi-Regulated â€¢ Institutional Liquidity',
      'genesis.brokerLirunexNote': 'Regulated STP Broker â€¢ Deep Forex & Gold Liquidity',
      'genesis.faqBadge': 'Frequently Asked Questions',
      'genesis.faqTitle': 'Everything You Need to Know About SMC Genesis',
      'genesis.faq1Q': 'What makes SMC Genesis fundamentally different from retail technical analysis?',
      'genesis.faq1A': 'Retail analysis relies on lagging indicators (RSI, moving averages) and retail trendlines that smart money routinely sweeps for liquidity. SMC Genesis teaches you how institutions actually move price, where stop loss pools accumulate, and how to execute strictly after liquidity sweeps into refined Supply & Demand zones.',
      'genesis.faq2Q': 'Can beginners learn SMC Genesis, or is prior experience required?',
      'genesis.faq2A': 'Beginners often excel faster because they do not have years of bad retail indicator habits to unlearn. SMC Genesis starts from the absolute bedrock of market liquidity and builds up step-by-step into advanced multi-timeframe execution.',
      'genesis.faq3Q': 'Which financial instruments work best with SMC Genesis?',
      'genesis.faq3A': 'SMC Genesis is a universal institutional Supply & Demand framework. It applies seamlessly to Gold (XAUUSD), major Forex pairs (EURUSD, GBPUSD, USDJPY), equity indices (US30, NAS100), and liquid cryptocurrencies (BTC, ETH).',
      'genesis.faq4Q': 'What kind of risk-to-reward ratios can I expect from this strategy?',
      'genesis.faq4A': 'SMC setups target asymmetric profiles starting from 1:3 up to 1:5+. Because entries are refined on lower timeframes at pristine imbalance zones, stop losses are tight and structural, maximizing your capital efficiency.',
      'genesis.faq5Q': 'How can I enroll in the class or contact BlueX directly?',
      'genesis.faq5A': 'To enroll in the class or ask questions, send a direct Telegram message (DM) to BlueX at @Le_Bluue. To join the public discussion and daily market outlooks, join our official Community Telegram group at t.me/moonbluefx.',
      'genesis.ctaTitle': 'Ready to Step Into the Institutional Flow?',
      'genesis.ctaSub': 'Stop donating retail liquidity to algorithms. Connect directly with BlueX or join our growing trader community.',

      // ========================================================
      // Gold Hedging Protocol (English)
      // ========================================================
      'hedging.heroBadge': 'Delta-Neutral Bullion & Treasury Architecture',
      'hedging.heroSubBadge': 'XAU/USD Physical Shop Integration',
      'hedging.heroTitle': 'Gold Hedging <span class="gold-accent">Protocol</span>',
      'hedging.heroDesc': 'Eliminate directional market exposure for jewelry stores, physical bullion vaults, and bullion custodians. Seamlessly translate Cambodian Damlung (ážáž˜áŸ’áž›áž¹áž„), Chi (áž‡áž¸), and Grams into exact MT4/MT5 digital spot positions to lock in 100% of retail spread and fabrication margins.',
      'hedging.btnCalc': 'âš¡ Launch Hedging Calculator',
      'hedging.btnArch': 'Delta-Neutral Mechanics âž”',
      'hedging.ribbonDelta': 'Delta-Neutral Equilibrium',
      'hedging.ribbonConversion': 'Precision Standard Lot Conversion',
      'hedging.ribbonProfit': 'Retail Spread & Fabrication Margin Protected',
      'hedging.calcBadge': 'Real-Time Treasury Tool',
      'hedging.calcTitle': 'Physical-to-Digital <span class="gold-accent">Hedging Calculator</span>',
      'hedging.calcSubtitle': 'Calculate the exact mathematical counter-order, required initial margin, and safe fluctuation buffer required to keep your business delta-neutral.',
      'hedging.ribbonStep1Title': '1. Shop Counter Inflow',
      'hedging.ribbonStep1Sub': 'Customer exchanges physical gold at local counter rate',
      'hedging.ribbonStep2Title': '2. Open Hedge on MT5 (10s)',
      'hedging.ribbonStep2Sub': 'Place the exact Lot size calculated by the engine',
      'hedging.ribbonStep3Title': '3. Zero Price Risk',
      'hedging.ribbonStep3Sub': '100% of retail spread and fabrication profit secured',
      'hedging.assetSelectLabel': '1. Select Precious Metal',
      'hedging.metalGoldName': 'Gold (XAU/USD)',
      'hedging.metalSilverName': 'Silver (XAG/USD)',
      'hedging.btnRefresh': 'Refresh',
      'hedging.step1Label': '2. Physical Inventory Flow',
      'hedging.inputStep1Title': 'Physical Counter Inflow',
      'hedging.inputStep1Desc': 'Select shop inventory direction and exact physical weight',
      'hedging.dirBuyTitle': 'Shop Buys Metal',
      'hedging.dirBuySub': 'Inventory UP (+Weight) âž” Need Digital SHORT',
      'hedging.dirSellTitle': 'Shop Sells Metal',
      'hedging.dirSellSub': 'Inventory DOWN (-Weight) âž” Need Digital LONG',
      'hedging.presetsCaption': 'Quick Presets (Standard Sizes):',
      'hedging.fieldWeight': 'Physical Weight',
      'hedging.fieldUnit': 'Unit',
      'hedging.localRateLabel': '3. Cambodian Physical Shop Cash Price (Outside Digital)',
      'hedging.btnSyncSpot': 'Auto-Sync Spot',
      'hedging.damlungRateLabel': 'Local Cash / Damlung (USD / 1 Damlung)',
      'hedging.chiRateLabel': 'Equivalent per Chi (USD / 1 Chi)',
      'hedging.localRateHelp': 'Physical counter cash rate quoted in Cambodian shops. 1 Damlung = 10 Chi = 37.5g â‰ˆ 1.20565 Troy Ounces.',
      'hedging.step2Label': '4. Physical Quantity & Unit',
      'hedging.shopPresetsTitle': 'Shop Standard Presets (Relatable Unit Sizes):',
      'hedging.inputStep2Title': 'Broker Capital & Safety Buffer',
      'hedging.inputStep2Desc': 'Set adequate equity buffer to guarantee zero stop-out risk',
      'hedging.paramSpot': 'Digital Spot Price ($/oz)',
      'hedging.paramLeverage': 'Broker Leverage',
      'hedging.accountBalanceLabel': '5. Your Broker Account Balance ($ USD Equity)',
      'hedging.btnAutoFillBalance': 'Auto-Fill Safe Target',
      'hedging.balanceHelperNote': 'How much to deposit: Enter your account equity to verify if your capital buffer safely covers adverse market swings or if more capital is needed.',
      'hedging.paramBuffer': 'Adverse Price Swing Buffer ($/oz)',
      'hedging.bufferHelp': 'Capital reserve held in broker equity to absorb market moves against your hedge without triggering a stop-out before physical inventory is settled.',
      'hedging.btnCopyOrder': 'Copy Trade',
      'hedging.cashCounterBadge': 'COUNTER CASH & LOCKED SPREAD PROFIT',
      'hedging.counterCashLabel': 'Physical Counter Cash Paid/Received:',
      'hedging.digitalSpotLabel': 'Digital Hedge Spot Value:',
      'hedging.lockedSpreadLabel': 'ðŸ”’ Locked Counter Margin Profit:',
      'hedging.resBrokerLots': 'Standard Broker Lots',
      'hedging.resResidual': 'Unhedged Micro-Residual',
      'hedging.resNotional': 'Physical Inventory Value',
      'hedging.resMargin': 'Initial Margin Required',
      'hedging.stopOutRisk': 'Stop-Out Invalidation Spot',
      'hedging.safeCapBadge': 'RECOMMENDED BROKER CAPITAL',
      'hedging.safeCapTag': 'Zero Stop-Out Architecture',
      'hedging.healthStatusLabel': 'Account Capital Status:',
      'hedging.fastSopTitle': 'âš¡ 30-Second Cashier Action:',
      'hedging.fastStep1': 'Settle customer cash at shop counter',
      'hedging.fastStep2': 'Open broker app & place',
      'hedging.fastStep3': 'Market risk is eliminated. Retail spread profit is 100% secured.',
      'hedging.toggleDetails': 'â–¼ Show Advanced Arithmetic & Residuals',
      'hedging.hideDetails': 'â–² Hide Advanced Arithmetic',
      'hedging.userBalanceRow': 'Your Input Balance:',
      'hedging.capRowMargin': 'Initial Margin (Broker Lock):',
      'hedging.capRowBuffer': 'Adverse Swing Buffer (+$100/oz):',
      'hedging.balanceStatusLabel': 'Buffer Surplus / Shortfall:',
      'hedging.sopHeader': 'Practical Cashier Execution (How Every Shop Uses It)',
      'hedging.step1Title': 'Client Arrives at Shop Counter',
      'hedging.step1Desc': 'Weigh physical metal (Damlung/Chi) âž” Pay/receive local counter cash.',
      'hedging.step2Title': 'Open Broker App on Phone/PC (10 Seconds)',
      'hedging.step2Desc': 'Place the exact digital hedge lot size displayed by the calculator.',
      'hedging.step3Title': 'Complete â€¢ Zero Gold Price Risk',
      'hedging.step3Desc': 'Whether gold moves $100-$300 up or down, your shop profit is 100% protected.',
      'hedging.proofTitle': 'Institutional Conversion Formulation',
      'hedging.simTitle': 'Market Crash Simulator: <span class="gold-accent">See How Hedging Protects Your Money</span>',
      'hedging.simSubtitle': 'What happens to your shop\'s capital if global gold prices move right now? Click any scenario below to run an instant real-time stress test on your physical inventory:',
      'hedging.balanceStatusLabel': 'Buffer Surplus / Shortfall:',
      'hedging.sopHeader': 'Practical Cashier Execution (How Every Shop Uses It)',
      'hedging.step1Title': 'Client Arrives at Shop Counter',
      'hedging.step1Desc': 'Weigh physical metal (Damlung/Chi) âž” Pay/receive local counter cash.',
      'hedging.step2Title': 'Open Broker App on Phone/PC (10 Seconds)',
      'hedging.step2Desc': 'Place the exact digital hedge lot size displayed by the calculator.',
      'hedging.step3Title': 'Complete â€¢ Zero Gold Price Risk',
      'hedging.step3Desc': 'Whether gold moves $100-$300 up or down, your shop profit is 100% protected.',
      'hedging.proofTitle': 'Institutional Conversion Formulation',
      'hedging.archBadge': 'Dealer Principles',
      'hedging.archTitle': 'The Mechanics of <span class="gold-accent">Delta-Neutral Equilibrium</span>',
      'hedging.archSubtitle': 'Physical gold shops generate consistent profit from retail spreads, fabrication premiums, and minting markups. Holding naked directional risk gambles your business equity against global macroeconomic volatility.',
      'hedging.unhedgedTag': 'TRADITIONAL UNHEDGED SHOP',
      'hedging.unhedgedTitle': 'Naked Inventory Exposure',
      'hedging.unhedgedDesc': 'A shop buys 100 Damlung ($274,000) of gold from walk-in retail clients. Over the weekend, gold drops $120/oz on global macroeconomic news.',
      'hedging.hedgedTag': 'BLUEX DELTA-NEUTRAL PROTOCOL',
      'hedging.hedgedTitle': 'Pure Delta Equilibrium (Î” = 0)',
      'hedging.hedgedDesc': 'The shop logs 100 Damlung into BlueX Terminal and opens a 1.21 Lot XAU/USD digital short immediately upon receiving physical gold.',
      'hedging.protocolBadge': 'SOP Protocol',
      'hedging.protocolTitle': 'The 4-Step <span class="gold-accent">Dealer Operating SOP</span>',
      'hedging.protocolSubtitle': 'Mechanical procedures executed by cashiers, vault managers, and bullion treasurers to guarantee zero slippage and flawless balance.',
      'hedging.sop1Title': 'Physical Inflow & Verification',
      'hedging.sop1Desc': 'Weigh incoming jewelry or bullion bars on certified scales. Log exact Damlung, Chi, or grams into the shop register. Confirm purity (99.99% or 24K).',
      'hedging.sop2Title': 'Instant Counter-Order Execution',
      'hedging.sop2Desc': 'Open your dedicated hedging terminal (MT4/MT5). Execute the exact calculated Lot counter-order. If physical gold was bought, place a Market Short. If sold, place a Market Long.',
      'hedging.sop3Title': 'Physical Resale & Digital Unwind',
      'hedging.sop3Desc': 'When the physical gold is sold to retail customers or dispatched to a refinery, simultaneously close the corresponding digital position on MT4/MT5.',
      'hedging.sop4Title': 'Financing & Swap-Free Discipline',
      'hedging.sop4Desc': 'Bullion inventory cycles often span days or weeks. Standard retail accounts charge overnight swap fees that slowly erode profits. Always utilize a Swap-Free institutional account.',
      'hedging.matrixBadge': 'Conversion Matrix',
      'hedging.matrixTitle': 'Institutional <span class="gold-accent">Weight Standards</span>',
      'hedging.matrixSubtitle': 'Mathematical equivalence between traditional Cambodian gold units, metric mass, international Troy Ounces, and digital spot lots.',
      'hedging.colUnit': 'Gold Unit',
      'hedging.colKhmer': 'Traditional Name',
      'hedging.colGrams': 'Metric Grams',
      'hedging.colOunces': 'Troy Ounces (oz)',
      'hedging.colLots': 'MT4/MT5 Standard Lots',
      'hedging.colEquiv': 'Equivalence',
      'hedging.brokerBadge': 'Institutional Infrastructure Partner',
      'hedging.brokerTitle': 'Zero-Spread Execution via <span class="cyan-accent">Treno Markets</span>',
      'hedging.brokerDesc': 'Hedging thin physical margins requires ultra-tight institutional conditions. Treno Markets provides raw liquidity spreads (0.0 pips on XAU/USD), swap-free holding accounts, and sub-millisecond execution to ensure zero basis slippage on counter-orders.',
      'hedging.brokerCta': 'Open Institutional Account on Treno Markets âž”',
      'hedging.faqBadge': 'Frequently Answered',
      'hedging.faqTitle': 'Institutional <span class="gold-accent">Hedging FAQ</span>',
      'hedging.q1Title': 'Why should our shop hedge when gold generally rises in the long term?',
      'hedging.q1Answer': 'As a gold retailer, your profit engine is the spread between your buying price and selling price plus fabrication markup. You are in the business of high-turnover retail trading, not long-term speculative investing. Sudden 3%â€“5% intra-week market drops can completely wipe out months of retail profits if your vault inventory remains unhedged.',
      'hedging.q2Title': 'What happens if gold spikes while we have an open Short hedge?',
      'hedging.q2Answer': 'If the gold spot price surges, your digital short position will show a floating loss. However, the physical gold in your shop\'s vault appreciates by the exact same dollar amount. That is why holding our recommended Safe Capital Buffer ($100/oz adverse reserve) is essential: it ensures your broker account comfortably absorbs the temporary digital drawdown while your physical bullion gains value.',
      'hedging.q3Title': 'How do we handle odd weights smaller than 0.01 lot (31.1g)?',
      'hedging.q3Answer': 'Standard MT4/MT5 brokers execute in minimum increments of 0.01 lot (1 Troy Ounce = 31.10g â‰ˆ 0.83 Damlung). For fractional transactions below 1 Troy Ounce, the calculator identifies your exact unhedged micro-residual. You simply accumulate minor retail purchases until reaching the 0.01 lot threshold, maintaining over 98% portfolio hedging efficiency.',
      'hedging.q4Title': 'Can we hedge other metals like Silver or Platinum?',
      'hedging.q4Answer': 'Yes. The mathematical delta-neutral principles remain identical across Silver (XAG/USD) and Platinum (XPT/USD), adjusting only for standard contract sizes (5,000 oz per standard Silver lot). BlueX Terminal provides custom formulas for multi-metal treasury desks.',
      'hedging.floatingCta': 'Consult Treasury Setup â€¢ DM @Le_Bluue',

      // Real Phnom Penh Case Study (English)
      'hedging.caseBadge': 'ðŸ“ REAL PHNOM PENH CASE STUDY',
      'hedging.caseTitle': 'How Heng Dara Jewelry (Phsar Thmey) Saved <span class="gold-accent">$3,375.00</span> Over a Weekend',
      'hedging.caseCol1Title': 'The Saturday Inflow',
      'hedging.caseCol1Desc': 'On Saturday afternoon, retail clients sold <strong>20 Damlung (750.00g)</strong> of gold jewelry to the shop. The cashier paid <strong>$96,000 USD</strong> physical cash at $4,800/Damlung. Spot was $3,948/oz.',
      'hedging.caseCol2Title': 'The 10-Second Action',
      'hedging.caseCol2Desc': 'Instead of praying gold wouldn\'t crash over Sunday, the treasurer opened BlueX Terminal and placed a <strong>0.24 Lot XAU/USD Short</strong> on MT5, locking in a $789.80 counter spread profit.',
      'hedging.caseCol3Title': 'The Monday Market Shock',
      'hedging.caseCol3Desc': 'Monday 6:00 AM: Global geopolitical news breaks, gold plunges <strong>-$140.00/oz</strong>. An unhedged shop lost $3,375 on inventory. Heng Dara shop\'s MT5 position gained +$3,360, neutralizing the drop completely. Net loss: <strong>$0.00</strong>.',

      // Crash & Rally Simulator (English)
      'hedging.simBadge': 'CRASH & RALLY SCENARIO SIMULATOR',
      'hedging.simTitle': 'Stress-Test Inventory vs. Digital Short',
      'hedging.simSubtitle': 'See what happens to a 10 Damlung jewelry purchase if market crashes -$100/oz vs surges +$100/oz.',
      'hedging.simShockLabel': 'Select Market Shock Move:',
      'hedging.simUnhedgedBadge': 'TRADITIONAL UNHEDGED SHOP (áž áž¶áž„áž‚áŸ’áž˜áž¶áž“ HEDGING)',
      'hedging.simUnhedgedTitle': 'Exposed Directional Loss',
      'hedging.simRowStockDeval': 'Physical Stock Devaluation:',
      'hedging.simRowDigitalProtect': 'Broker Digital Protection:',
      'hedging.simRowNetLoss': 'Net Market P&L:',
      'hedging.simHedgedBadge': 'BLUEX DELTA-NEUTRAL PROTOCOL (áž áž¶áž„áž˜áž¶áž“ HEDGING)',
      'hedging.simHedgedTitle': 'Protected Equilibrium Result',
      'hedging.simRowDigitalGain': 'MT5 Short Hedge Gain:',
      'hedging.simRowNetFluct': 'Net Market Fluctuation:',

      // Progressive 3-Step Navigation (English)
      'hedging.tab1': '1. Physical Counter Inflow',
      'hedging.tab2': '2. Broker Safety & Capital',
      'hedging.tab3': '3. Execution Ticket',
      'hedging.btnNextStep2': 'Next: Safety Buffer & Capital âž”',
      'hedging.btnBackStep1': 'â† Back to Counter Inflow',
      'hedging.btnNextStep3': 'View Execution Ticket âž”',

      // Footer
      'footer.copy': 'Â© 2026 BlueX. Master Your Ego. Master Your Trades. All rights reserved.'
    },

    km: {
      // Nav
      'nav.home': 'áž‘áŸ†áž–áŸážšážŠáž¾áž˜',
      'nav.about': 'áž¢áŸ†áž–áž¸ BlueX',
      'nav.brokers': 'ážˆáŸ’áž˜áž½áž‰áž€ážŽáŸ’ážáž¶áž›',
      'nav.courses': 'ážœáž‚áŸ’áž‚ážŸáž·áž€áŸ’ážŸáž¶',
      'nav.genesis': '<span class="genesis-pulse-dot"></span> SMC Genesis <span class="nav-new-badge">ážáŸ’áž˜áž¸</span>',
      'nav.hedging': 'Hedging<span class="nav-label-full"> áž˜áž¶ážŸ</span>',
      'nav.drawerBrand': 'áž”ážŽáŸ’ážáž¶áž‰ BLUEX TERMINAL',
      'nav.spotlightDesc': 'ážŸáŸ’ážáž¶áž”ážáŸ’áž™áž€áž˜áŸ’áž˜ážŸáŸ’ážáž¶áž”áŸáž“ áŸ¡áŸ  áž˜áŸ‰áž¼ážŒáž»áž›',
      'nav.drawerDm': 'áž…áž»áŸ‡ážˆáŸ’áž˜áŸ„áŸ‡áž¥áž¡áž¼ážœáž“áŸáŸ‡ â€” áž•áŸ’áž‰áž¾ážŸáž¶ážšáž•áŸ’áž‘áž¶áž›áŸ‹ (@Le_Bluue)',
      'nav.capital': 'áž™áž»áž‘áŸ’áž’ážŸáž¶ážŸáŸ’ážáŸ’ážš',
      'nav.calculator': 'áž‚ážŽáž“áž¶ Lot',
      'nav.knowledge': 'áž…áŸ†ážŽáŸáŸ‡ážŠáž¹áž„',
      'nav.pillars': 'áž‚áŸ„áž›áž€áž¶ážšážŽáŸáž‚áŸ’ážšáž¹áŸ‡',
      'nav.media': 'áž˜áŸážŒáž¶',
      'nav.faq': 'ážŸáŸ†ážŽáž½ážš-áž…áž˜áŸ’áž›áž¾áž™',
      'nav.connect': 'áž‘áŸ†áž“áž¶áž€áŸ‹áž‘áŸ†áž“áž„',
      'nav.telegram': 'ážáŸáž¡áŸáž€áŸ’ážšáž¶áž˜',
      'nav.register': 'áž…áž»áŸ‡ážˆáŸ’áž˜áŸ„áŸ‡',
      'nav.registerNow': 'áž…áž»áŸ‡ážˆáŸ’áž˜áŸ„áŸ‡',
      'nav.fx': 'FX',
      'nav.fxDrawer': 'áž…áž›áž“áž¶: áž”áž¾áž€ (áž…áž»áž…ážŠáž¾áž˜áŸ’áž”áž¸áž•áŸ’áž¢áž¶áž€)',
      'nav.fxDrawerOff': 'áž…áž›áž“áž¶: áž•áŸ’áž¢áž¶áž€ (áž…áž»áž…ážŠáž¾áž˜áŸ’áž”áž¸áž”áž¾áž€)',

      // Hero
      'hero.hey': 'ážŸáž½ážŸáŸ’ážáž¸',
      'hero.imBluex': 'ážáŸ’áž‰áž»áŸ†áž‚ážº BlueX',
      'hero.roleMentor': 'ážœáž‚áŸ’áž‚ážŸáž·áž€áŸ’ážŸáž¶ (áž”áž„áŸ’ážšáŸ€áž“áž•áŸ’áž‘áž¶áž›áŸ‹) & áž™áž»áž‘áŸ’áž’ážŸáž¶ážŸáŸ’ážáŸ’ážšáž•áž›áž”áŸážáŸ’ážš',
      'hero.sagfxPartner': 'ážŠáŸƒáž‚áž¼ SAGFX',
      'hero.title': 'áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž¢áž áŸ†áž€áž¶ážš (Ego) ážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€áŸ”<br>áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž€áž¶ážšáž‡áž½áž‰ážŠáž¼ážšážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€áŸ”',
      'hero.subRole1': 'áž€áž¶ážšáž‡áž½áž‰ážŠáž¼ážšáž”áŸ’ážšáž€áž”ážŠáŸ„áž™ážœáž·áž“áŸáž™',
      'hero.subRole2': 'ážœáž‚áŸ’áž‚ážŸáž·áž€áŸ’ážŸáž¶áž•áŸ’áž‘áž¶áž›áŸ‹',
      'hero.subRole3': 'áž™áž»áž‘áŸ’áž’ážŸáž¶ážŸáŸ’ážáŸ’ážšáž•áž›áž”áŸážáŸ’ážš',
      'hero.btnCourse': 'ážœáž‚áŸ’áž‚ážŸáž·áž€áŸ’ážŸáž¶ (áž”áž„áŸ’ážšáŸ€áž“áž•áŸ’áž‘áž¶áž›áŸ‹)',
      'hero.btnCapital': 'áž™áž»áž‘áŸ’áž’ážŸáž¶ážŸáŸ’ážáŸ’ážšáž•áž›áž”áŸážáŸ’ážšáž¯áž€áž‡áž“ â†—',
      'hero.offeringsTitle': 'ážŸáŸážœáž¶áž€áž˜áŸ’áž˜áž…áž˜áŸ’áž”áž„',
      'hero.offering1': 'ážœáž‚áŸ’áž‚ážŸáž·áž€áŸ’ážŸáž¶ & áž€áž¶ážšáž”áž„áŸ’ážšáŸ€áž“áž•áŸ’áž‘áž¶áž›áŸ‹',
      'hero.offering2': 'áž™áž»áž‘áŸ’áž’ážŸáž¶ážŸáŸ’ážáŸ’ážšáž•áž›áž”áŸážáŸ’ážšáž¯áž€áž‡áž“ (áž…ážšáž…áž¶áž›áž€áŸ’ážážážŽáŸ’ážŒáž”áž¶áž“)',
      'hero.offering3': 'ážˆáŸ’áž˜áž½áž‰áž€ážŽáŸ’ážáž¶áž›ážŠáŸƒáž‚áž¼ Treno Markets, GTC GO & Lirunex',
      'hero.offering4': 'ážŸáŸ’ážœáŸ‚áž„áž™áž›áŸ‹áž–áž¸ Liquidity ážŸáŸ’ážáž¶áž”áŸáž“',
      'hero.offering5': 'áž™áž»áž‘áŸ’áž’ážŸáž¶ážŸáŸ’ážáŸ’ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž áž¶áž“áž·áž—áŸáž™',
      'hero.offering6': 'áž…áž·ážáŸ’ážážœáž·áž‘áŸ’áž™áž¶áž‡áž½áž‰ážŠáž¼ážš & áž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„ Ego',
      'hero.bioSnippet': 'áž‡áž¶ Trader áž“áž·áž„áž‚áŸ’ážšáž¼áž”áž„áŸ’ážœáž¹áž€áž•áŸ’áž‘áž¶áž›áŸ‹ ážŠáŸ‚áž›áž•áŸ’ážáŸ„ážáž›áž¾áž€áž¶ážšáž€ážŸáž¶áž„ážœáž·áž“áŸáž™áž‡áž½áž‰ážŠáž¼ážšáž±áŸ’áž™áž˜áž¶áž“áž”áŸ’ážšážŸáž·áž‘áŸ’áž’áž—áž¶áž–ážáŸ’áž–ážŸáŸ‹ áž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž áž¶áž“áž·áž—áŸáž™áž”áŸ‚áž”ážŸáŸ’ážáž¶áž”áŸáž“ áž“áž·áž„áž€áž¶ážšáž€áž¶ážšáž–áž¶ážšážŠáž¾áž˜áž‘áž»áž“áž±áŸ’áž™áž‚áž„áŸ‹ážœáž„áŸ’ážŸážšáž™áŸˆáž–áŸáž›ážœáŸ‚áž„áŸ”',

      // About
      'about.mentorBadge': 'BlueX â€¢ áž‚áŸ’ážšáž¼áž”áž„áŸ’ážœáž¹áž€áž‡áž¶áž“áŸ‹ážáŸ’áž–ážŸáŸ‹',
      'about.availableTag': 'áž”áž¾áž€áž‘áž‘áž½áž›áž€áž¶ážšáž”áž„áŸ’ážœáž¹áž€áž•áŸ’áž‘áž¶áž›áŸ‹',
      'about.signatureMotto': '"áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž¢áž áŸ†áž€áž¶ážšážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€áŸ”<br><span>áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž€áž¶ážšáž‡áž½áž‰ážŠáž¼ážšážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€áŸ”</span>"',
      'about.signatureRole': 'Senior Trader & áž‚áŸ’ážšáž¼áž”áž„áŸ’ážœáž¹áž€áž¯áž€áž‡áž“',
      'about.leadText': 'ážáŸ’áž‰áž»áŸ†áž‡áž¶ Trader áž“áž·áž„áž‡áž¶áž¢áŸ’áž“áž€áž”áž„áŸ’áž áž¶ážáŸ‹áž”áž„áŸ’ážšáŸ€áž“áž•áŸ’áž‘áž¶áž›áŸ‹ ážŠáŸ‚áž›áž‡áž¿áž‡áž¶áž€áŸ‹áž›áž¾<span style="color:var(--color-gold);">áž€áž¶ážšáž‡áž½áž‰ážŠáž¼ážšáž”áŸ’ážšáž€áž”ážŠáŸ„áž™ážœáž·áž“áŸáž™áž˜áŸ‰ážºáž„áž˜áŸ‰áž¶ážáŸ‹</span> áž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž áž¶áž“áž·áž—áŸáž™áž…áŸ’áž”áž¶ážŸáŸ‹áž›áž¶ážŸáŸ‹ áž“áž·áž„áž€áž¶ážšáž˜áž¾áž›ážƒáž¾áž‰áž‘áž¸áž•áŸ’ážŸáž¶ážšáž€áŸ’áž“áž»áž„ážšáž™áŸˆáž–áŸáž›ážœáŸ‚áž„áŸ”',
      'about.p1': 'ážáŸ’áž‰áž»áŸ†áž‡áž¿áž‡áž¶áž€áŸ‹ážáž¶ <strong>áž€áž¶ážšáž‡áž½áž‰ážŠáž¼ážšážŠáŸ‚áž›áž‡áŸ„áž‚áž‡áŸáž™ áž“áž·áž„áž˜áž¶áž“ážŸáŸ’ážáž·ážšáž—áž¶áž– áž‚ážºáž€áž¾ážáž…áŸáž‰áž–áž¸áž€áž¶ážšáž¢ážáŸ‹áž’áŸ’áž˜ážáŸ‹ ážœáž·áž“áŸáž™ áž“áž·áž„áž€áž¶ážšážŸáž˜áŸ’ážšáŸáž…áž…áž·ážáŸ’ážáž•áŸ’áž¢áŸ‚áž€áž›áž¾áž€áŸ’áž”áž½áž“áž…áŸ’áž”áž¶áž”áŸ‹</strong> â€” áž˜áž·áž“áž˜áŸ‚áž“áž€áž¾ážáž…áŸáž‰áž–áž¸áž¢áž¶ážšáž˜áŸ’áž˜ážŽáŸ áž¬áž€áž¶ážšážŸáŸ’áž˜áž¶áž“áž“áŸ„áŸ‡áž¡áž¾áž™áŸ” áž‚áŸ„áž›ážŠáŸ…ážšáž”ážŸáŸ‹ážáŸ’áž‰áž»áŸ†áž‚ážºáž”áž„áŸ’áž€áž¾ážážáž˜áŸ’áž›áŸƒáž–áž·ážáž”áŸ’ážšáž¶áž€ážŠ áž“áž·áž„áž™áž¼ážšáž¢áž„áŸ’ážœáŸ‚áž„ ážáž¶áž˜ážšáž™áŸˆ<strong>ážœáž·áž‡áŸ’áž‡áž¶áž‡áž¸ážœáŸˆ ážáž˜áŸ’áž›áž¶áž—áž¶áž– áž“áž·áž„áž—áž¶áž–ážŸáŸ’áž˜áŸ„áŸ‡ážáŸ’ážšáž„áŸ‹</strong>áŸ”',
      'about.p2': 'áž˜áž·áž“ážáž¶áž¢áŸ’áž“áž€áž‡áž¶ážœáž·áž“áž·áž™áŸ„áž‚áž·áž“ áž¬áž‡áž¶ Trader ážŠáŸ‚áž›áž…áž„áŸ‹áž€áž˜áŸ’áž…áž¶ážáŸ‹áž”áž‰áŸ’áž áž¶áž•áŸ’áž›áž¼ážœáž…áž·ážáŸ’ážážŠáž¾áž˜áŸ’áž”áž¸ážŸáž˜áŸ’ážšáŸáž…áž”áž¶áž“áž›áž‘áŸ’áž’áž•áž›ážáž·ážážáŸážšáž“áŸ„áŸ‡áž‘áŸ <strong>ážáŸ’áž‰áž»áŸ†ážŸáŸ’ážœáž¶áž‚áž˜áž“áŸáž¢áŸ’áž“áž€ážŠáŸ‚áž›áž˜áž¶áž“áž€áž¶ážšáž‚áž·ážážœáŸ‚áž„áž†áŸ’áž„áž¶áž™</strong> áž“áž·áž„áž±áŸ’áž™ážáž˜áŸ’áž›áŸƒážáŸ’áž–ážŸáŸ‹áž›áž¾áž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž áž¶áž“áž·áž—áŸáž™ áž“áž·áž„áž€áž¶ážšáž€áž¶ážšáž–áž¶ážšážŠáž¾áž˜áž‘áž»áž“áŸ”',
      'about.sagfxNote': 'ážŠáŸƒáž‚áž¼ážŸáž áž€áž¶ážš áž“áž·áž„áž…áŸ’ážšáž€áž‘áž¼áž‘áž¶ážáŸ‹áž”áŸ’ážšáž¶áž€áŸ‹ážáž¶áž˜ SAGFX áž¢áž¶áž…ážŸáž¶áž€ážŸáž½ážšáž”áž¶áž“ážáž¶áž˜áž€áž¶ážšážŸáŸ’áž“áž¾ážŸáž»áŸ†áž•áŸ’áž‘áž¶áž›áŸ‹áŸ”',
      'about.btnExplore': 'ážŸáŸ’ážœáŸ‚áž„áž™áž›áŸ‹áž–áž¸ážœáž‚áŸ’áž‚ážŸáž·áž€áŸ’ážŸáž¶',

      // Study Course
      'course.badge': 'áž‘áž‘áž½áž›áž…áŸ†áž“áž½áž“áž€áŸ†ážŽážáŸ‹ â€¢ áž”áž„áŸ’ážšáŸ€áž“áž•áŸ’áž‘áž¶áž›áŸ‹ (Live 1-on-1 / Group)',
      'course.title': 'ážœáž‚áŸ’áž‚ážŸáž·áž€áŸ’ážŸáž¶áž•áŸ’áž‘áž¶áž›áŸ‹áž‡áž¶áž˜áž½áž™ BlueX:<br><span class="highlight">Interactive Live Teaching (áž”áž„áŸ’ážšáŸ€áž“áž›áž¾áž€áŸ’ážšáž¶áž áŸ’ážœáž·áž€áž•áŸ’áž‘áž¶áž›áŸ‹)</span>',
      'course.leadPitch': 'áž€áž¶ážšáž”áž„áŸ’ážšáŸ€áž“áž•áŸ’áž‘áž¶áž›áŸ‹ážáž¶áž˜ážšáž™áŸˆáž€áž¶ážšáž…áŸ‚áž€ážšáŸ†áž›áŸ‚áž€áž¢áŸáž€áŸ’ážšáž„áŸ‹ (Share Screen) ážŠáŸ„áž™áž™áž¾áž„ážœáž·áž—áž¶áž‚ážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’áž‘áž¸áž•áŸ’ážŸáž¶ážšáž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„áž‡áž¶áž˜áž½áž™áž‚áŸ’áž“áž¶áŸ” áž‚áŸ’áž˜áž¶áž“ážœáž¸ážŠáŸáž¢áž¼áž…áž¶ážŸáŸ‹ážážáž‘áž»áž€áž¡áž¾áž™ â€” ážšáž¶áž›áŸ‹áž˜áŸážšáŸ€áž“áž‘áž¶áŸ†áž„áž¢ážŸáŸ‹áž‚ážºáž”áž„áŸ’ážšáŸ€áž“áž•áŸ’áž‘áž¶áž›áŸ‹ áž•áŸ’áž‘áŸ€áž„áž•áŸ’áž‘áž¶ážáŸ‹áž›áž¾áž€áŸ’ážšáž¶áž áŸ’ážœáž·áž€ Real-Time áž“áž·áž„áž•áŸ’ážáŸ„ážáž›áž¾áž€áž¶ážšáž¢áž“áž»ážœážáŸ’ážáž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„áŸ”',
      'course.standardsTitle': 'áž›áž€áŸ’ážážážŽáŸ’ážŒážáž˜áŸ’ážšáž¼ážœáž€áŸ’áž“áž»áž„áž€áž¶ážšáž…áž¼áž›ážšáŸ€áž“',
      'course.standardsSub': 'áž™áž¾áž„áž€áŸ†ážŽážáŸ‹ážŸáŸ’ážáž„áŸ‹ážŠáž¶ážšáž…áŸ’áž”áž¶ážŸáŸ‹áž›áž¶ážŸáŸ‹ ážŠáž¾áž˜áŸ’áž”áž¸áž’áž¶áž“áž¶ážáž¶áž¢áŸ’áž“áž€ážšáŸ€áž“áž–áž·ážáž‡áž¶áž‘áž‘áž½áž›áž”áž¶áž“áž›áž‘áŸ’áž’áž•áž›áž–áž·ážáž”áŸ’ážšáž¶áž€ážŠáŸ”',
      'course.std1Title': 'áž•áŸ’ážáž›áŸ‹áž¢áž¶áž‘áž·áž—áž¶áž–áž›áž¾áž€áž¶ážšáž€áž¶ážšáž–áž¶ážšážŠáž¾áž˜áž‘áž»áž“áž‡áž¶áž…áž˜áŸ’áž”áž„',
      'course.std1Desc': 'ážáŸ’ážšáž¼ážœážáŸ‚áž”áŸ’ážáŸáž‡áŸ’áž‰áž¶áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž áž¶áž“áž·áž—áŸáž™áž™áŸ‰áž¶áž„ážáž¹áž„ážšáŸ‰áž¹áž„ (0.5%â€“1.0% áž€áŸ’áž“áž»áž„áž˜áž½áž™ Trade)áŸ” áž˜áž·áž“áž‘áž‘áž½áž›áž¢áŸ’áž“áž€ážŠáŸ‚áž›áž…áž„áŸ‹áž›áŸáž„áž›áŸ’áž”áŸ‚áž„ áž¬ážšáŸ†áž–áž¹áž„áž…áž„áŸ‹áž˜áž¶áž“áž”áž¶áž“áž›áž¿áž“ážáž¶áž˜ážŸáž‰áŸ’áž‰áž¶ (Signals) áž¡áž¾áž™áŸ”',
      'course.std2Title': 'áž‡áž½áž‰ážŠáž¼ážšážáž¶áž˜áž€áŸ’áž”áž½áž“áž…áŸ’áž”áž¶áž”áŸ‹áž…áŸ’áž”áž¶ážŸáŸ‹áž›áž¶ážŸáŸ‹',
      'course.std2Desc': 'ážšáŸ€áž“áž–áž¸ Setup ážŸáŸ’ážáž¶áž”áŸáž“áž–áž·ážáž”áŸ’ážšáž¶áž€ážŠáŸ– Liquidity Sweeps, Market Structure Shifts, áž“áž·áž„ Imbalances áž˜áž·áž“áž˜áŸ‚áž“ážŸáŸ’áž˜áž¶áž“ážáž¶áž˜áž…áž·ážáŸ’ážáž¡áž¾áž™áŸ”',
      'course.std3Title': 'áž€ážáŸ‹ážáŸ’ážšáž¶áž€áŸ†ážŽážáŸ‹áž áŸážáž» (Trade Journal) áž‚áŸ’ážšáž”áŸ‹ Trade',
      'course.std3Desc': 'ážáž¶áž˜ážŠáž¶áž“ážŸáŸ’ážáž·ážáž· áž“áž·áž„áž”áŸ’ážšáž¾áž”áŸ’ážšáž¶ážŸáŸ‹ Checklist áž˜áž»áž“áž…áž¼áž›áž•áŸ’ážŸáž¶ážš ážŠáž¾áž˜áŸ’áž”áž¸áž›áž»áž”áž”áŸ†áž”áž¶ážáŸ‹áž€áŸ†áž áž»ážŸáž•áŸ’áž›áž¼ážœáž…áž·ážáŸ’áž áž“áž·áž„áž€áž¶ážšáž‡áž½áž‰ážŠáž¼ážšážáž¶áž˜áž¢áž¶ážšáž˜áŸ’áž˜ážŽáŸáŸ”',
      'course.std4Title': 'áž”áŸ’ážáŸáž‡áŸ’áž‰áž¶áž…áž·ážáŸ’ážáž…áž¼áž›ážšáž½áž˜ážšáŸ€áž“ áž“áž·áž„áž¢áž“áž»ážœážáŸ’ážáž•áŸ’áž‘áž¶áž›áŸ‹',
      'course.std4Desc': 'áž…áž¼áž›ážšáž½áž˜ážšáŸ€áž“áž›áž¾ Live Chart áž™áŸ‰áž¶áž„ážŸáž€áž˜áŸ’áž˜ áž€ážáŸ‹ážáŸ’ážšáž¶áž˜áŸážšáŸ€áž“ áž“áž·áž„áž¢áž“áž»ážœážáŸ’ážáž›áž¾áž‚ážŽáž“áž¸ Demo/Simulation áž±áŸ’áž™ážŸáŸ’áž‘áž¶ážáŸ‹áž‡áŸ†áž“áž¶áž‰ážŸáž·áž“ áž˜áž»áž“áž“áž¹áž„áž”áŸ’ážšáž¾áž”áŸ’ážšáž¶ážŸáŸ‹áž›áž»áž™áž–áž·ážáŸ”',
      'course.liveBarTitle': 'ážœáž‚áŸ’áž‚áž…áŸ‚áž€ážšáŸ†áž›áŸ‚áž€áž¢áŸáž€áŸ’ážšáž„áŸ‹áž”áž„áŸ’ážšáŸ€áž“áž•áŸ’áž‘áž¶áž›áŸ‹ (Live Screen-Share)',
      'course.liveBarSub': 'ážœáž·áž—áž¶áž‚ áž“áž·áž„áž¢áž“áž»ážœážáŸ’ážáž›áž¾áž‘áž¸áž•áŸ’ážŸáž¶ážšáž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„',
      'course.bodyText': 'Trader áž—áž¶áž‚áž…áŸ’ážšáž¾áž“ážáž¶ážáž”áž„áŸ‹áž‚ážŽáž“áž¸ áž˜áž·áž“áž˜áŸ‚áž“ážŠáŸ„áž™ážŸáž¶ážšážáŸ’ážœáŸ‡ Indicator áž“áŸ„áŸ‡áž‘áŸ áž”áŸ‰áž»áž“áŸ’ážáŸ‚ážŠáŸ„áž™ážŸáž¶ážšáž–áž½áž€áž‚áŸáž˜áž·áž“áž™áž›áŸ‹áž–áž¸ážšáž”áŸ€áž”ážŠáŸ‚áž›ážŸáŸ’ážáž¶áž”áŸáž“áž’áŸ†áŸ—áž‡áž½áž‰ážŠáž¼ážš (Supply & Demand) áž“áž·áž„áž˜áž·áž“áž¢áž¶áž…áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž¢áž¶ážšáž˜áŸ’áž˜ážŽáŸáž—áŸáž™ážáŸ’áž›áž¶áž… áž›áŸ„áž—áž›áž“áŸ‹ áž“áž·áž„ Ego ážšáž”ážŸáŸ‹ážáŸ’áž›áž½áž“áž”áž¶áž“áŸ” áž“áŸ…áž€áŸ’áž“áž»áž„ážœáž‚áŸ’áž‚ážŸáž·áž€áŸ’ážŸáž¶ážšáž”ážŸáŸ‹ážáŸ’áž‰áž»áŸ† áž¢áŸ’ážœáž¸áŸ—áž‘áž¶áŸ†áž„áž¢ážŸáŸ‹ážáŸ’ážšáž¼ážœáž”áž¶áž“áž”áž„áŸ’ážšáŸ€áž“áž•áŸ’áž‘áž¶áž›áŸ‹ážáž¶áž˜ážšáž™áŸˆáž€áž¶ážšážœáž·áž—áž¶áž‚áž€áŸ’ážšáž¶áž áŸ’ážœáž·áž€ Real-Time â€” áž‚áŸ’ážšáž”ážŠážŽáŸ’ážáž”áŸ‹áž›áž¾ Liquidity Sweeps, Supply & Demand Imbalances, ážŸáž˜áž¶áž˜áž¶ážáŸ’ážšáž…áŸ†ážŽáŸáž‰áž’áŸ€áž”áž€áž¶ážšážáž¶áž 1:3+ áž“áž·áž„ Checklist ážáŸ’ážšáž½ážáž–áž·áž“áž·ážáŸ’áž™áž˜áž»áž“áž…áž¼áž›áž•áŸ’ážŸáž¶ážšáŸ” áž¢áŸ’áž“áž€áž“áž¹áž„áž‘áž‘áž½áž›áž”áž¶áž“áž€áž¶ážšáž”áž„áŸ’áž áž¶ážáŸ‹áž”áž„áŸ’áž áž¶áž‰áž•áŸ’áž‘áž¶áž›áŸ‹ážŠáž¾áž˜áŸ’áž”áž¸áž”áŸ†áž”áž¶ážáŸ‹áž€áž¶ážšážŸáŸ’áž‘áž¶áž€áŸ‹ážŸáŸ’áž‘áž¾ážš áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„ Ego áž“áž·áž„áž€ážŸáž¶áž„áž¢áž¶áž‡áž¸áž–áž‡áž½áž‰ážŠáž¼ážšážŠáŸ‚áž›áž‘áž‘áž½áž›áž”áž¶áž“áž•áž›áž…áŸ†ážŽáŸáž‰áž™áž¼ážšáž¢áž„áŸ’ážœáŸ‚áž„áŸ”',
      'course.card1Title': 'áž€áž¶ážšáž”áž„áŸ’ážšáŸ€áž“áž•áŸ’áž‘áž¶áž›áŸ‹ Interactive Live',
      'course.card1Desc': 'áž”áž„áŸ’ážšáŸ€áž“áž•áŸ’áž‘áž¶áž›áŸ‹áž›áž¾áž€áŸ’ážšáž¶áž áŸ’ážœáž·áž€áž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„ áž™áž›áŸ‹ážŠáž¹áž„áž–áž¸ Institutional Supply & Demand, Liquidity Sweeps áž“áž·áž„ Setup ážŠáŸ‚áž›áž˜áž¶áž“áž—áž¶áž‚ážšáž™ážˆáŸ’áž“áŸ‡ážáŸ’áž–ážŸáŸ‹áŸ”',
      'course.card2Title': 'áž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž áž¶áž“áž·áž—áŸáž™ Asymmetric 1:3+',
      'course.card2Desc': 'áž€áž¶ážšáž–áž¶ážšážŠáž¾áž˜áž‘áž»áž“áž‡áž¶áž…áž˜áŸ’áž”áž„ áž‡áž¶áž˜áž½áž™ážŸáž˜áž¶áž˜áž¶ážáŸ’ážšáž…áŸ†ážŽáŸáž‰áž’áŸ€áž”áž áž¶áž“áž·áž—áŸáž™áž™áŸ‰áž¶áž„ážáž·áž… 1:3 áž“áž·áž„áž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„ Drawdown áž™áŸ‰áž¶áž„áž˜áŸ‰ážºáž„áž˜áŸ‰áž¶ážáŸ‹áŸ”',
      'course.card3Title': 'áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„ Ego & áž…áž·ážáŸ’ážážœáž·áž‘áŸ’áž™áž¶áž‡áž½áž‰ážŠáž¼ážš',
      'course.card3Desc': 'áž€áž˜áŸ’áž…áž¶ážáŸ‹áž€áž¶ážšáž‡áž½áž‰ážŠáž¼ážšáž”áŸ‚áž”ážŸáž„ážŸáž¹áž€áž‘áž¸áž•áŸ’ážŸáž¶ážš (Revenge Trading), FOMO, áž€áž¶ážš Overtrade áž“áž·áž„áž—áž¶áž–áž—áŸáž™ážáŸ’áž›áž¶áž…áž–áŸáž›áž…áž¼áž›áž•áŸ’ážŸáž¶ážšáŸ”',
      'course.card4Title': 'ážœáž·áž—áž¶áž‚áž€áŸ’ážšáž¶áž áŸ’ážœáž·áž€áž‘áž¸áž•áŸ’ážŸáž¶ážšáž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„',
      'course.card4Desc': 'ážœáž·áž—áž¶áž‚áž‘áž¸áž•áŸ’ážŸáž¶ážšáž•áŸ’áž‘áž¶áž›áŸ‹ áž–áž·áž“áž·ážáŸ’áž™ Setup áž‡áž¶áž˜áž½áž™áž‚áŸ’áž“áž¶ áž“áž·áž„ážŸáž½ážšážŸáŸ†ážŽáž½ážšážŠáŸáž‰ážŠáŸ„áž›áž•áŸ’áž‘áž¶áž›áŸ‹áž˜áž¶ážáŸ‹ ážŠáž¾áž˜áŸ’áž”áž¸áž–áž„áŸ’ážšáž¹áž„áž€áž¶ážšáž¢áž“áž»ážœážáŸ’ážáž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„áŸ”',
      'course.btnEnroll': 'áž…áž»áŸ‡ážˆáŸ’áž˜áŸ„áŸ‡ / áž•áŸ’áž‰áž¾ážŸáž¶ážšáž•áŸ’áž‘áž¶áž›áŸ‹áž‘áŸ…áž€áž¶áž“áŸ‹ BlueX (@Le_Bluue)',
      'course.btnInquire': 'áž•áŸ’áž‰áž¾ážŸáŸ†ážŽáž½ážšážŸáž¶áž€ážŸáž½ážšážáž¶áž„áž€áŸ’ážšáŸ„áž˜',
      'course.genesisBannerTitle': 'âš¡ SMC GENESIS â€¢ BEYOND THE CHARTS â€” ážœáž‚áŸ’áž‚ážŸáž·áž€áŸ’ážŸáž¶ážŸáŸ’ážáž¶áž”ážáŸ’áž™áž€áž˜áŸ’áž˜ážŸáŸ’ážáž¶áž”áŸáž“áž•áŸ’áž›áž¼ážœáž€áž¶ážš âž”',
      'course.genesisBannerSub': 'ážŸáŸ’ážœáŸ‚áž„áž™áž›áŸ‹áž–áž¸ážŸáŸ’ážáž¶áž”ážáŸ’áž™áž€áž˜áŸ’áž˜ Quantitative áž‘áž¶áŸ†áž„ áŸ¡áŸ  áž˜áŸ‰áž¼ážŒáž»áž›ážŸáž˜áŸ’ážšáž¶áž”áŸ‹ážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’áž˜áž¶ážŸ XAU/USD, áž€áž¶ážšážŸáŸ’ážšáž„áŸ‹ážáŸ†áž”áž“áŸ‹ S&D, áž¢áž“áŸ’áž‘áž¶áž€áŸ‹ážŸáž¶áž…áŸ‹áž”áŸ’ážšáž¶áž€áŸ‹ áž“áž·áž„áž€áž¶ážšáž…áž¼áž›áž•áŸ’ážŸáž¶ážšáž”áŸ‚áž” AsymmetricáŸ”',
      'course.genesisBannerBtn': 'ážŸáŸ’ážœáŸ‚áž„áž™áž›áŸ‹ SMC Genesis âž”',

      // Capital & Portfolio Strategy
      'capital.badge': 'áž™áž»áž‘áŸ’áž’ážŸáž¶ážŸáŸ’ážáŸ’ážšážŠáž¾áž˜áž‘áž»áž“ & áž•áž›áž”áŸážáŸ’ážšáž¯áž€áž‡áž“ â€¢ áž›áž€áŸ’ážážážŽáŸ’ážŒáž¢áž¶áž…áž…ážšáž…áž¶áž”áž¶áž“',
      'capital.title': 'áž™áž»áž‘áŸ’áž’ážŸáž¶ážŸáŸ’ážáŸ’ážšážŠáž¾áž˜áž‘áž»áž“ & áž•áž›áž”áŸážáŸ’ážšážŸáž˜áŸ’ážšáž¶áž”áŸ‹ <span class="gold-accent">ážŠáŸƒáž‚áž¼ážœáž·áž“áž·áž™áŸ„áž‚</span>',
      'capital.leadText': 'áž€áž¶ážšáž¢áž“áž»ážœážáŸ’ážáž‡áž½áž‰ážŠáž¼ážšáž•áž›áž”áŸážáŸ’ážšáž‡áž¶áž”áŸ’ážšáž–áŸáž“áŸ’áž’ áž“áž·áž„áž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž áž¶áž“áž·áž—áŸáž™áž™áŸ‰áž¶áž„áž˜áŸ‰ážºáž„áž˜áŸ‰áž¶ážáŸ‹áŸ” áž™áž¾áž„áž¢áž¶áž…áž‡áž½áž”áž–áž·áž—áž¶áž€áŸ’ážŸáž¶áž…ážšáž…áž¶áž›áž€áŸ’ážážážŽáŸ’ážŒáž•áŸ’áž‘áž¶áž›áŸ‹ážáŸ’áž›áž½áž“ ážŠáŸ„áž™áž¢áž“áž»áž›áŸ„áž˜ážáž¶áž˜áž…áŸ’áž”áž¶áž”áŸ‹áž áž·ážšáž‰áŸ’áž‰ážœážáŸ’ážáž»áž™áŸ‰áž¶áž„ážáž¹áž„ážšáŸ‰áž¹áž„ â€” áž¢ážáž·ážáž·áž‡áž“ážšáž€áŸ’ážŸáž¶áž€áž˜áŸ’áž˜ážŸáž·áž‘áŸ’áž’áž· áŸ¡áŸ áŸ % áž›áž¾áž‚ážŽáž“áž¸áž•áŸ’áž‘áž¶áž›áŸ‹ážáŸ’áž›áž½áž“ áž‚áŸ’áž˜áž¶áž“áž€áž¶ážšáž”áŸ’ážšáž˜áž¼áž›áž”áŸ’ážšáž¶áž€áŸ‹ážšáž½áž˜áž¡áž¾áž™áŸ”',
      'capital.p1Title': 'áž¢ážáž·ážáž·áž‡áž“áž€áž¶áž“áŸ‹áž€áž¶áž”áŸ‹áž‚ážŽáž“áž¸áž•áŸ’áž‘áž¶áž›áŸ‹ážáŸ’áž›áž½áž“ áŸ¡áŸ áŸ % (Segregated Custody)',
      'capital.p1Desc': 'ážŠáž¾áž˜áž‘áž»áž“ážŸáŸ’ážáž·ážáž“áŸ…áž€áŸ’áž“áž»áž„áž‚ážŽáž“áž¸áž•áŸ’áž‘áž¶áž›áŸ‹ážáŸ’áž›áž½áž“ážšáž”ážŸáŸ‹áž¢ážáž·ážáž·áž‡áž“áž“áŸ…áž¯ Broker ážŸáŸ’ážáž¶áž”áŸáž“ ážáž¶áž˜ážšáž™áŸˆáž”áŸ’ážšáž–áŸáž“áŸ’áž’ API, PAMM áž¬ MAMáŸ” áž‚áŸ’áž˜áž¶áž“áž€áž¶ážšáž”áŸ’ážšáž˜áž¼áž›áž›áž»áž™ážšáž½áž˜áž¡áž¾áž™ â€” áž¢áŸ’áž“áž€áž˜áž¶áž“ážŸáž·áž‘áŸ’áž’áž·áž€áž¶áž“áŸ‹áž€áž¶áž”áŸ‹ áž“áž·áž„ážŠáž€áž”áŸ’ážšáž¶áž€áŸ‹áž‚áŸ’ážšáž”áŸ‹áž–áŸáž›ážœáŸáž›áž¶áŸ”',
      'capital.p2Title': 'áž¢áž¶áž…áž…ážšáž…áž¶áž€áž˜áŸ’ážšáž·ážáž áž¶áž“áž·áž—áŸáž™ & Drawdown áž”áž¶áž“',
      'capital.p2Desc': 'áž€áž˜áŸ’ážšáž·ážáž áž¶áž“áž·áž—áŸáž™ áž€áž˜áŸ’ážšáž·áž Stop-Out áž“áž·áž„áž‚áŸ„áž›ážŠáŸ…áž”áŸ’ážšáž¶áž€áŸ‹áž…áŸ†ážŽáŸáž‰ áž¢áž¶áž…áž‡áž½áž”áž–áž·áž—áž¶áž€áŸ’ážŸáž¶áž…ážšáž…áž¶áž‚áŸ’áž“áž¶áž‡áž¶áž›áž€áŸ’ážážŽáŸˆáž¯áž€áž‡áž“ ážŠáž¾áž˜áŸ’áž”áž¸áž†áŸ’áž›áž¾áž™ážáž”áž‘áŸ…áž“áž¹áž„áž‚áŸ„áž›ážŠáŸ…áž€áž¶ážšáž–áž¶ážšážŠáž¾áž˜áž‘áž»áž“ážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€áŸ”',
      'capital.p3Title': 'áž¢áž“áž»áž›áŸ„áž˜ážáž¶áž˜áž…áŸ’áž”áž¶áž”áŸ‹ & áž”áž‘ážŠáŸ’áž‹áž¶áž“ SERC áž™áŸ‰áž¶áž„ážáž¹áž„ážšáŸ‰áž¹áž„',
      'capital.p3Desc': 'áž’áŸ’ážœáž¾áž¡áž¾áž„áž‡áž¶áž›áž€áŸ’ážážŽáŸˆáž¯áž€áž‡áž“áž‡áž¶áž˜áž½áž™ážŠáŸƒáž‚áž¼ážŠáŸ‚áž›áž˜áž¶áž“áž›áž€áŸ’ážážŽáŸˆážŸáž˜áŸ’áž”ážáŸ’ážáž·áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž¶áž“áŸ‹ ážŠáŸ„áž™áž‚áŸ„ážšáž–ážáž¶áž˜áž”áž‘áž”áŸ’áž”áž‰áŸ’áž‰ážáŸ’ážáž·áž áž·ážšáž‰áŸ’áž‰ážœážáŸ’ážáž» áž“áž·áž„áž‚áŸ„áž›áž€áž¶ážšážŽáŸáž˜áž·áž“áž€áŸ€ážšáž‚ážšáž‘áž»áž“ážŸáž¶áž’áž¶ážšážŽáŸˆážšáž”ážŸáŸ‹áž“áž·áž™áŸážáž€ážšáž˜áž¼áž›áž”ážáŸ’ážšáž€áž˜áŸ’áž–áž»áž‡áž¶ (SERC)áŸ”',
      'capital.btnInquire': 'ážŸáž¶áž€ážŸáž½ážšážáž¶áž˜ Telegram áž•áŸ’áž‘áž¶áž›áŸ‹ (@Le_Bluue) â†—',
      'capital.confidentialNote': 'áž€áž¶ážšáž–áž·áž‚áŸ’ážšáŸ„áŸ‡áž™áŸ„áž”áž›áŸ‹áž¯áž€áž‡áž“ áŸ¡ áž‘áž›áŸ‹áž“áž¹áž„ áŸ¡',
      'capital.overlayBadge': 'áž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž•áž›áž”áŸážáŸ’ážšáž€áŸ†áž–áž»áž„ážŠáŸ†ážŽáž¾ážšáž€áž¶ážš',
      'capital.targetModel': 'áž˜áŸ‰áž¼ážŠáŸ‚áž›áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž áž¶áž“áž·áž—áŸáž™:',
      'capital.govTitle': 'ážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’áž™áž»áž‘áŸ’áž’ážŸáž¶ážŸáŸ’ážáŸ’ážšáž•áž›áž”áŸážáŸ’ážšáž¯áž€áž‡áž“',
      'capital.govSub': 'áž—áŸ’áž‡áž¶áž”áŸ‹ážáž¶áž˜ážšáž™áŸˆ Direct API / PAMM / MAM',
      'capital.custodyLabel': 'áž€áž¶ážšáž€áž¶áž“áŸ‹áž€áž¶áž”áŸ‹áž‚ážŽáž“áž¸',
      'capital.custodyVal': 'áž¢ážáž·ážáž·áž‡áž“áž€áž¶áž“áŸ‹áž€áž¶áž”áŸ‹ áŸ¡áŸ áŸ %',
      'capital.structureLabel': 'áž›áž€áŸ’ážážážŽáŸ’ážŒ',
      'capital.structureVal': 'áž…ážšáž…áž¶áž‡áž¶áž¯áž€áž‡áž“áž‘áŸ’ážœáŸáž—áž¶áž‚áž¸',
      'capital.riskGateLabel': 'áž€áž˜áŸ’ážšáž·ážáž€áž¶ážšáž–áž¶ážš',
      'capital.riskGateVal': 'áž€áŸ†ážŽážáŸ‹ Stop-Out ážŠáž¶áž…áŸ‹ážáž¶áž',

      // Calculator
      'calc.badge': 'áž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž áž¶áž“áž·áž—áŸáž™ â€¢ áž€áž¶ážšáž‚ážŽáž“áž¶áž‘áŸ†áž áŸ† Lot',
      'calc.title': 'áž€áž˜áŸ’áž˜ážœáž·áž’áž¸áž‚ážŽáž“áž¶ <span class="gold-accent">áž‘áŸ†áž áŸ† Lot áž˜áž¶ážŸ & Forex</span>',
      'calc.desc': 'áž‚ážŽáž“áž¶áž‘áŸ†áž áŸ† Position ážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€ážáž¶áž˜ážšáž¼áž”áž˜áž“áŸ’ážáž…áŸ’áž”áž¶ážŸáŸ‹áž›áž¶ážŸáŸ‹ áž˜áž»áž“áž–áŸáž›áž…áž¼áž›áž•áŸ’ážŸáž¶ážšáž“áž¸áž˜áž½áž™áŸ—áŸ” áž€áž¶ážšáž–áž¶ážšážŠáž¾áž˜áž‘áž»áž“ážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€ážŠáŸ„áž™áž”áŸ’ážšáž€áž¶áž“áŸ‹ážáŸ’áž‡áž¶áž”áŸ‹áž“áž¼ážœáž…áŸ’áž”áž¶áž”áŸ‹áž áž¶áž“áž·áž—áŸáž™ 0.5%â€“1.0% ážšáž”ážŸáŸ‹ BlueXáŸ”',
      'calc.ruleLabel': 'áž…áŸ’áž”áž¶áž”áŸ‹ BlueX áž‘áž¸ áŸ áŸ¡',
      'calc.ruleVal': 'áž€áž»áŸ†áž”áŸ’ážšážáž»áž™áž›áž¾ážŸáž–áž¸ áŸ¡.áŸ % áž€áŸ’áž“áž»áž„áž˜áž½áž™ Trade',
      'calc.pairLabel': 'áž‡áŸ’ážšáž¾ážŸážšáž¾ážŸáž‚áž¼ážšáž¼áž”áž·áž™áž”áŸážŽáŸ’ážŽ / áž˜áž¶ážŸ',
      'calc.balanceLabel': 'ážŸáž˜ážáž»áž›áŸ’áž™áž‚ážŽáž“áž¸ ($)',
      'calc.stopLossLabel': 'Stop Loss (Points / Pips)',
      'calc.riskPercentLabel': 'áž—áž¶áž‚ážšáž™áž áž¶áž“áž·áž—áŸáž™ (%)',
      'calc.resultsTag': 'áž‘áŸ†áž áŸ† Lot ážŠáŸ‚áž›ážáŸ’ážšáž¼ážœáž…áž¼áž›',
      'calc.safeRisk': 'áž áž¶áž“áž·áž—áŸáž™áž˜áž¶áž“ážœáž·áž“áŸáž™',
      'calc.lotsUnit': 'Standard Lots',
      'calc.cashRiskLabel': 'áž€áž¶ážšážáž¶ážáž”áž„áŸ‹áž‡áž¶ážŸáž¶áž…áŸ‹áž”áŸ’ážšáž¶áž€áŸ‹áž¢ážáž·áž”ážšáž˜áž¶',
      'calc.pipValLabel': 'ážáž˜áŸ’áž›áŸƒáž€áŸ’áž“áž»áž„ áŸ¡ Point / Pip',
      'calc.contractUnitsLabel': 'áž”ážšáž·áž˜áž¶ážŽáž€áž·áž…áŸ’áž…ážŸáž“áŸ’áž™áž¶',
      'calc.targetRewardLabel': 'áž‚áŸ„áž›ážŠáŸ…áž…áŸ†ážŽáŸáž‰ áŸ¡:áŸ£',
      'calc.mottoQuote': 'Â«áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž¢áž áŸ†áž€áž¶ážšážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€áŸ” áž€áž»áŸ†áž”áŸ’ážšážáž»áž™ážŠáž¾áž˜áž‘áž»áž“áž›áž¾ážŸáž–áž¸áž…áŸ’áž”áž¶áž”áŸ‹ážŠáŸ‚áž›áž¢áŸ’áž“áž€áž”áž¶áž“áž€áŸ†ážŽážáŸ‹áž±áŸ’áž™ážŸáŸ„áŸ‡áŸ”Â» â€” BlueX',

      // Brokers Header
      'broker.sectionSubtitle': 'ážŠáŸƒáž‚áž¼áž áŸážŠáŸ’áž‹áž¶ážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’',
      'broker.sectionTitle': 'ážŠáŸƒáž‚áž¼ <span class="italic">ážˆáŸ’áž˜áž½áž‰áž€ážŽáŸ’ážáž¶áž›áž•áŸ’áž›áž¼ážœáž€áž¶ážš</span>',

      // Brokers (GTC GO)
      'broker.tag': 'ážˆáŸ’áž˜áž½áž‰áž€ážŽáŸ’ážáž¶áž›ážŠáŸ‚áž›áž”áž¶áž“ážŽáŸ‚áž“áž¶áŸ†',
      'broker.title': 'áž‡áž½áž‰ážŠáž¼ážšáž‡áž¶áž˜áž½áž™ <span class="cyan-accent">GTC GO</span>',
      'broker.subDesc': 'áž”áŸ’ážšáž–áŸáž“áŸ’áž’áž‡áž½áž‰ážŠáž¼ážšáž€áž˜áŸ’ážšáž·ážážŸáŸ’ážáž¶áž”áŸáž“ áž˜áž¶áž“ážŸáž“áŸ’áž‘áž»áŸ‡ážŸáž¶áž…áŸ‹áž”áŸ’ážšáž¶áž€áŸ‹áž‡áŸ’ážšáŸ… áž€áž¶ážšáž”áž‰áŸ’áž‡áž¼áž“áž”áž‰áŸ’áž‡áž¶ STP áž›áŸ’áž”áž¿áž“áž›áž¿áž“ áž“áž·áž„áž§áž”áž€ážšážŽáŸážœáž·áž—áž¶áž‚áž‘áž¶áž“áŸ‹ážŸáž˜áŸáž™áŸ”',
      'broker.trust1': 'âœ“ áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„ážŠáŸ„áž™áž¢áž¶áž‡áŸ’áž‰áž¶áž”áŸážŽáŸ’ážŽ Tier-1',
      'broker.trust2': 'âœ“ ážŠáž¶áž€áŸ‹ & ážŠáž€áž”áŸ’ážšáž¶áž€áŸ‹ážšáž áŸážŸáž‘áž¶áž“áŸ‹áž…áž·ážáŸ’áž',
      'broker.trust3': 'âœ“ ážŸáž“áŸ’áž‘áž»áŸ‡ážŸáž¶áž…áŸ‹áž”áŸ’ážšáž¶áž€áŸ‹ Interbank áž•áŸ’áž‘áž¶áž›áŸ‹',
      'broker.tier1Badge': 'áž‚ážŽáž“áž¸ Standard',
      'broker.tier1Chip': 'áž‚áŸ’áž˜áž¶áž“áž€áž˜áŸ’ážšáŸƒáž‡áž¾áž„ážŸáž¶ážš (Zero Commission)',
      'broker.tier1Title': 'áž‚ážŽáž“áž¸ Standard STP',
      'broker.tier1Desc': 'áž€áž¶ážšáž¢áž“áž»ážœážáŸ’ážáž”áž‰áŸ’áž‡áž¶ STP áž•áŸ’áž‘áž¶áž›áŸ‹áž‘áŸ…áž€áž¶áž“áŸ‹áž‘áž¸áž•áŸ’ážŸáž¶ážš ážŠáŸ„áž™áž‚áŸ’áž˜áž¶áž“áž€áž˜áŸ’ážšáŸƒáž‡áž¾áž„ážŸáž¶ážšáž”áž“áŸ’ážáŸ‚áž˜áŸ” ážŸáŸáž€áŸ’ážáž·ážŸáž˜áž”áŸ†áž•áž»ážážŸáž˜áŸ’ážšáž¶áž”áŸ‹ Trader ážŠáŸ‚áž›áž‡áž½áž‰ážŠáž¼ážšáž”áŸ’ážšáž…áž¶áŸ†ážáŸ’áž„áŸƒáŸ”',
      'broker.tier1Check1': 'áž‚áŸ’áž˜áž¶áž“áž€áž˜áŸ’ážšáŸƒáž›áž¾áž€áž¶ážšážŠáž¶áž€áŸ‹ & ážŠáž€áž”áŸ’ážšáž¶áž€áŸ‹',
      'broker.tier1Check2': 'áž€áž¶ážšáž”áž‰áŸ’áž‡áž¼áž“áž”áž‰áŸ’áž‡áž¶ STP áž›áŸ’áž”áž¿áž“áž›áž¿áž“áž”áŸ†áž•áž»áž',
      'broker.tier1Check3': 'áž‡áž½áž‰ážŠáž¼ážšáž˜áž¶ážŸ, Forex áž“áž·áž„ážŸáž“áŸ’áž‘ážŸáŸ’ážŸáž“áŸážŸáž€áž›áž–áŸáž‰áž›áŸáž‰',
      'broker.tier2Badge': 'áž‚ážŽáž“áž¸ Spread áž‘áž¶áž”',
      'broker.tier2Chip': 'Spread ážŠáž¾áž˜áž–áž¸áž•áŸ’ážŸáž¶ážš (Zero Markup)',
      'broker.tier2Title': 'áž‚ážŽáž“áž¸ Raw Spread Interbank',
      'broker.tier2Desc': 'Spread ážŠáž¾áž˜áž•áŸ’áž‘áž¶áž›áŸ‹áž–áž¸áž‘áž¸áž•áŸ’ážŸáž¶ážš Interbank ážŠáŸ„áž™áž‚áŸ’áž˜áž¶áž“áž€áž¶ážšáž”áž“áŸ’ážáŸ‚áž˜ Markup áž¡áž¾áž™áŸ” ážŸáŸáž€áŸ’ážáž·ážŸáž˜ážŸáž˜áŸ’ážšáž¶áž”áŸ‹ Swing Trader áž“áž·áž„áž€áž¶ážšáž…áž¼áž›áž•áŸ’ážŸáž¶ážšáž…áŸ’áž”áž¶ážŸáŸ‹áž›áž¶ážŸáŸ‹áŸ”',
      'broker.tier2Check1': 'Spread áž€áž˜áŸ’ážšáž·ážážŸáŸ’ážáž¶áž”áŸáž“áž•áŸ’áž‘áž¶áž›áŸ‹áž–áž¸ Interbank',
      'broker.tier2Check2': 'áž‚áŸ’áž˜áž¶áž“áž€áž¶ážšáž”áž“áŸ’ážáŸ‚áž˜ Markup áž›áž¾ Spread áž‘áž¸áž•áŸ’ážŸáž¶ážšáž¡áž¾áž™',
      'broker.tier2Check3': 'áž—áž¶áž–áž‡áž¶áž€áŸ‹áž›áž¶áž€áŸ‹ážáŸ’áž–ážŸáŸ‹áž”áŸ†áž•áž»ážážŸáž˜áŸ’ážšáž¶áž”áŸ‹ Setup ážŸáŸ’ážáž¶áž”áŸáž“',
      'broker.registerBtn': 'Register here',

      // Brokers (LIRUNEX)
      'lirunex.tag': 'ážˆáŸ’áž˜áž½áž‰áž€ážŽáŸ’ážáž¶áž›ážŠáŸ‚áž›áž”áž¶áž“ážŽáŸ‚áž“áž¶áŸ†',
      'lirunex.title': 'áž‡áž½áž‰ážŠáž¼ážšáž‡áž¶áž˜áž½áž™ <span class="gold-accent">LIRUNEX</span>',
      'lirunex.subDesc': 'ážˆáŸ’áž˜áž½áž‰áž€ážŽáŸ’ážáž¶áž› STP/ECN ážŸáž€áž›ážŠáŸ‚áž›áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„ážŠáŸ„áž™áž¢áž¶áž‡áŸ’áž‰áž¶áž”áŸážŽáŸ’ážŽáž¢áž“áŸ’ážážšáž‡áž¶ážáž· áž•áŸ’ážáž›áŸ‹áž‡áž¼áž“ Spread áž…áž¶áž”áŸ‹áž–áž¸ 0.0 pips áž€áž¶ážšáž”áž‰áŸ’áž‡áž¶áž‘áž·áž‰ážšáž áŸážŸ áž“áž·áž„áž”áŸ’ážšáž–áŸáž“áŸ’áž’ MT4/MT5 áž‘áŸ†áž“áž¾áž”áŸ”',
      'lirunex.trust1': 'âœ“ áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„ážŠáŸ„áž™áž¢áž¶áž‡áŸ’áž‰áž¶áž”áŸážŽáŸ’ážŽ (CySEC & LFSA)',
      'lirunex.trust2': 'âœ“ ážŠáž¶áž€áŸ‹ & ážŠáž€áž”áŸ’ážšáž¶áž€áŸ‹ážšáž áŸážŸáž‘áž¶áž“áŸ‹áž…áž·ážáŸ’áž',
      'lirunex.trust3': 'âœ“ ážŸáž“áŸ’áž‘áž»áŸ‡ážŸáž¶áž…áŸ‹áž”áŸ’ážšáž¶áž€áŸ‹ Interbank STP / ECN',
      'lirunex.tier1Badge': 'áž‚ážŽáž“áž¸ Standard',
      'lirunex.tier1Chip': 'áž‚áŸ’áž˜áž¶áž“áž€áž˜áŸ’ážšáŸƒáž‡áž¾áž„ážŸáž¶ážš (Zero Commission)',
      'lirunex.tier1Title': 'áž‚ážŽáž“áž¸ Standard STP',
      'lirunex.tier1Desc': 'áž€áž¶ážšáž¢áž“áž»ážœážáŸ’ážáž”áž‰áŸ’áž‡áž¶ STP áž•áŸ’áž‘áž¶áž›áŸ‹áž‘áŸ…áž€áž¶áž“áŸ‹áž‘áž¸áž•áŸ’ážŸáž¶ážš ážŠáŸ„áž™áž‚áŸ’áž˜áž¶áž“áž€áž˜áŸ’ážšáŸƒáž‡áž¾áž„ážŸáž¶ážšáž”áž“áŸ’ážáŸ‚áž˜áŸ” ážŸáŸáž€áŸ’ážáž·ážŸáž˜áž”áŸ†áž•áž»ážážŸáž˜áŸ’ážšáž¶áž”áŸ‹ Trader ážŠáŸ‚áž›áž‡áž½áž‰ážŠáž¼ážšáž”áŸ’ážšáž…áž¶áŸ†ážáŸ’áž„áŸƒáŸ”',
      'lirunex.tier1Check1': 'áž‚áŸ’áž˜áž¶áž“áž€áž˜áŸ’ážšáŸƒáž›áž¾áž€áž¶ážšážŠáž¶áž€áŸ‹ & ážŠáž€áž”áŸ’ážšáž¶áž€áŸ‹',
      'lirunex.tier1Check2': 'áž€áž¶ážšáž”áž‰áŸ’áž‡áž¼áž“áž”áž‰áŸ’áž‡áž¶ STP áž›áŸ’áž”áž¿áž“áž›áž¿áž“',
      'lirunex.tier1Check3': 'áž‡áž½áž‰ážŠáž¼ážšáž˜áž¶ážŸ (XAU/USD), Forex & ážŸáž“áŸ’áž‘ážŸáŸ’ážŸáž“áŸáž–áŸáž‰áž›áŸáž‰',
      'lirunex.tier2Badge': 'áž‚ážŽáž“áž¸ Spread áž‘áž¶áž”',
      'lirunex.tier2Chip': 'Raw áž…áž¶áž”áŸ‹áž–áž¸ 0.0 Pips',
      'lirunex.tier2Title': 'áž‚ážŽáž“áž¸ Prime ECN Interbank',
      'lirunex.tier2Desc': 'Spread áž•áŸ’áž‘áž¶áž›áŸ‹áž–áž¸áž‘áž¸áž•áŸ’ážŸáž¶ážš Interbank áž…áž¶áž”áŸ‹áž–áž¸ 0.0 pips áž“áž·áž„ážŸáž“áŸ’áž‘áž»áŸ‡ážŸáž¶áž…áŸ‹áž”áŸ’ážšáž¶áž€áŸ‹áž€áž˜áŸ’ážšáž·ážážŸáŸ’ážáž¶áž”áŸáž“áŸ” ážŸáŸáž€áŸ’ážáž·ážŸáž˜ážŸáž˜áŸ’ážšáž¶áž”áŸ‹áž€áž¶ážšáž…áž¼áž›áž•áŸ’ážŸáž¶ážšáž…áŸ’áž”áž¶ážŸáŸ‹áž›áž¶ážŸáŸ‹ áž“áž·áž„áž€áž¶ážšáž‡áž½áž‰ážŠáž¼ážš SwingáŸ”',
      'lirunex.tier2Check1': 'Spread áž•áŸ’áž‘áž¶áž›áŸ‹áž–áž¸ Interbank áž…áž¶áž”áŸ‹áž–áž¸ 0.0 pips',
      'lirunex.tier2Check2': 'ážŸáž“áŸ’áž‘áž»áŸ‡ážŸáž¶áž…áŸ‹áž”áŸ’ážšáž¶áž€áŸ‹ ECN áž•áŸ’áž‘áž¶áž›áŸ‹ & áž‡áž˜áŸ’ážšáŸ…áž‘áž¸áž•áŸ’ážŸáž¶ážšáž‡áŸ’ážšáŸ…',
      'lirunex.tier2Check3': 'áž—áž¶áž–áž‡áž¶áž€áŸ‹áž›áž¶áž€áŸ‹ážáŸ’áž–ážŸáŸ‹áž”áŸ†áž•áž»ážážŸáž˜áŸ’ážšáž¶áž”áŸ‹ Setup ážŸáŸ’ážáž¶áž”áŸáž“',

      // Treno Markets Broker
      'treno.tag': 'ážˆáŸ’áž˜áž½áž‰áž€ážŽáŸ’ážáž¶áž›ážŠáŸ‚áž›áž”áž¶áž“ážŽáŸ‚áž“áž¶áŸ†',
      'treno.title': 'áž‡áž½áž‰ážŠáž¼ážšáž‡áž¶áž˜áž½áž™ <span class="cyan-accent">TRENO MARKETS</span>',
      'treno.subDesc': 'ážˆáŸ’áž˜áž½áž‰áž€ážŽáŸ’ážáž¶áž›áž–áž áž»áž‘áŸ’ážšáž–áŸ’áž™ážŸáž€áž˜áŸ’áž˜áž‡áŸ†áž“áž¶áž“áŸ‹ážáŸ’áž˜áž¸ ážŠáŸ†ážŽáž¾ážšáž€áž¶ážšáž›áž¾ MetaTrader 5 (MT5) áž‡áž¶áž˜áž½áž™áž›áŸ’áž”áž¿áž“áž”áž‰áŸ’áž‡áž¼áž“áž”áž‰áŸ’áž‡áž¶áž›áž¿áž“áž”áŸ†áž•áž»áž Spread ážŸáŸ’ážáž¾áž„áž–áž¸áž‘áž¸áž•áŸ’ážŸáž¶ážš áž“áž·áž„áž€áž¶ážšážŠáž¶áž€áŸ‹/ážŠáž€áž”áŸ’ážšáž¶áž€áŸ‹ážšáž áŸážŸáž‘áž¶áž“áŸ‹áž…áž·ážáŸ’ážáŸ”',
      'treno.trust1': 'âœ“ ážŠáŸ†ážŽáž¾ážšáž€áž¶ážšáž›áž¾ MetaTrader 5 (MT5)',
      'treno.trust2': 'âœ“ ážŠáž¶áž€áŸ‹ & ážŠáž€áž”áŸ’ážšáž¶áž€áŸ‹ážšáž áŸážŸáž‘áž¶áž“áŸ‹áž…áž·ážáŸ’áž',
      'treno.trust3': 'âœ“ ážŸáž“áŸ’áž‘áž»áŸ‡ážŸáž¶áž…áŸ‹áž”áŸ’ážšáž¶áž€áŸ‹ Interbank áž‡áŸ’ážšáŸ…',
      'treno.tier1Badge': 'áž‚ážŽáž“áž¸ Standard',
      'treno.tier1Chip': 'áž‚áŸ’áž˜áž¶áž“áž€áž˜áŸ’ážšáŸƒáž‡áž¾áž„ážŸáž¶ážš (Zero Commission)',
      'treno.tier1Title': 'áž‚ážŽáž“áž¸ Standard MT5',
      'treno.tier1Desc': 'áž€áž¶ážšáž¢áž“áž»ážœážáŸ’ážáž”áž‰áŸ’áž‡áž¶áž•áŸ’áž‘áž¶áž›áŸ‹áž‘áŸ…áž€áž¶áž“áŸ‹áž‘áž¸áž•áŸ’ážŸáž¶ážšážŠáŸ„áž™áž‚áŸ’áž˜áž¶áž“áž€áž˜áŸ’ážšáŸƒáž‡áž¾áž„ážŸáž¶ážšáŸ” ážŸáŸáž€áŸ’ážáž·ážŸáž˜áž”áŸ†áž•áž»ážážŸáž˜áŸ’ážšáž¶áž”áŸ‹áž¢áŸ’áž“áž€áž‡áž½áž‰ážŠáž¼ážšáž”áŸ’ážšáž…áž¶áŸ†ážáŸ’áž„áŸƒ áž“áž·áž„áž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž áž¶áž“áž·áž—áŸáž™áž”áŸ’ážšáž€áž”ážŠáŸ„áž™ážœáž·áž“áŸáž™áŸ”',
      'treno.tier1Check1': 'áž‚áŸ’áž˜áž¶áž“áž€áž˜áŸ’ážšáŸƒáž›áž¾áž€áž¶ážšážŠáž¶áž€áŸ‹ & ážŠáž€áž”áŸ’ážšáž¶áž€áŸ‹',
      'treno.tier1Check2': 'áž€áž¶ážšáž”áž‰áŸ’áž‡áž¼áž“áž”áž‰áŸ’áž‡áž¶ MT5 áž›áŸ’áž”áž¿áž“áž›áž¿áž“áž”áŸ†áž•áž»áž',
      'treno.tier1Check3': 'áž‡áž½áž‰ážŠáž¼ážšáž˜áž¶ážŸ (XAU/USD), Forex, ážŸáž“áŸ’áž‘ážŸáŸ’ážŸáž“áŸ & áž‘áŸ†áž“áž·áž‰áž–áŸáž‰áž›áŸáž‰',
      'treno.tier2Badge': 'áž‚ážŽáž“áž¸ Spread áž‘áž¶áž”',
      'treno.tier2Chip': 'Raw áž…áž¶áž”áŸ‹áž–áž¸ 0.0 Pips',
      'treno.tier2Title': 'áž‚ážŽáž“áž¸ Raw Spread ECN',
      'treno.tier2Desc': 'Spread áž•áŸ’áž‘áž¶áž›áŸ‹áž–áž¸áž‘áž¸áž•áŸ’ážŸáž¶ážš Interbank áž…áž¶áž”áŸ‹áž–áž¸ 0.0 pips áž“áž·áž„áž‡áž˜áŸ’ážšáŸ…áž‘áž¸áž•áŸ’ážŸáž¶ážšáž‡áŸ’ážšáŸ…áŸ” áž”áž„áŸ’áž€áž¾ážáž¡áž¾áž„ážŸáž˜áŸ’ážšáž¶áž”áŸ‹ Scalper, áž€áž¶ážšáž‡áž½áž‰ážŠáž¼ážšážáž¶áž˜áž”áŸ’ážšáž–áŸáž“áŸ’áž’ Algo áž“áž·áž„áž…áŸ†ážŽáž»áž…áž…áž¼áž›áž…áŸ’áž”áž¶ážŸáŸ‹áž›áž¶ážŸáŸ‹áŸ”',
      'treno.tier2Check1': 'Spread áž•áŸ’áž‘áž¶áž›áŸ‹áž–áž¸ Interbank áž…áž¶áž”áŸ‹áž–áž¸ 0.0 pips',
      'treno.tier2Check2': 'ážŸáž“áŸ’áž‘áž»áŸ‡ážŸáž¶áž…áŸ‹áž”áŸ’ážšáž¶áž€áŸ‹áž€áž˜áŸ’ážšáž·ážážŸáŸ’ážáž¶áž”áŸáž“ & áž‡áž˜áŸ’ážšáŸ…áž‘áž¸áž•áŸ’ážŸáž¶ážš',
      'treno.tier2Check3': 'áž—áž¶áž–áž‡áž¶áž€áŸ‹áž›áž¶áž€áŸ‹ážáŸ’áž–ážŸáŸ‹áž”áŸ†áž•áž»ážážŸáž˜áŸ’ážšáž¶áž”áŸ‹ Stop-Loss ážáž¼áž…áž”áŸ†áž•áž»áž',

      // Knowledge & Must-Read Books
      'knowledge.badge': 'áž…áŸ†ážŽáŸáŸ‡ážŠáž¹áž„áž–áž·ážáž–áž¸áž‘áž¸áž•áŸ’ážŸáž¶ážš â€¢ áž”ážŽáŸ’ážŽáž¶áž›áŸáž™ážŸáŸ€ážœáž—áŸ…áž›áŸ’áž¢áŸ—',
      'knowledge.title': 'áž…áŸ†ážŽáŸáŸ‡ážŠáž¹áž„ážŠáŸ‚áž›ážáŸ’áž‰áž»áŸ†áž”áž¶áž“ážšáŸ€áž“ & <span class="gold-accent">ážŸáŸ€ážœáž—áŸ…áž›áŸ’áž¢áŸ—áž‚áž½ážšáž¢áž¶áž“</span>',
      'knowledge.subDesc': 'áž‚áŸ„áž›áž€áž¶ážšážŽáŸáž‘áž¸áž•áŸ’ážŸáž¶ážšážŠáŸ‚áž›áž†áŸ’áž›áž„áž€áž¶ážáŸ‹áž€áž¶ážšáž¢áž“áž»ážœážáŸ’ážáž•áŸ’áž‘áž¶áž›áŸ‹ áž…áž·ážáŸ’ážážœáž·áž‘áŸ’áž™áž¶áž–áž·áž áž“áž·áž„ážŸáŸ€ážœáž—áŸ…áž›áŸ’áž”áž¸áŸ—áž›áž¾áž–áž·áž—áž–áž›áŸ„áž€ážŸáŸ’ážáž¸áž–áž¸áž€áž¶ážšáž‡áž½áž‰ážŠáž¼ážš áž›áž»áž™áž€áž¶áž€áŸ‹ áž“áž·áž„áž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž…áž·ážáŸ’ážáŸ”',
      'knowledge.tabAll': 'áž‘áž¶áŸ†áž„áž¢ážŸáŸ‹',
      'knowledge.tabLessons': 'áž˜áŸážšáŸ€áž“ážŠáŸ‚áž›áž”áž¶áž“ážšáŸ€áž“',
      'knowledge.tabBooks': 'ážŸáŸ€ážœáž—áŸ…áž–áŸáž‰áž“áž·áž™áž˜',
      'knowledge.lessonsHeading': 'áž˜áŸážšáŸ€áž“áž‚áŸ’ážšáž¹áŸ‡ážŠáŸ‚áž›ážáŸ’áž‰áž»áŸ†áž”áž¶áž“ážšáŸ€áž“áž–áž¸áž‘áž¸áž•áŸ’ážŸáž¶ážšáž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„',
      'knowledge.booksHeading': 'ážŸáŸ€ážœáž—áŸ…áž–áŸáž‰áž“áž·áž™áž˜áž”áŸ†áž•áž»ážáŸ– áž€áž¶ážšáž‡áž½áž‰ážŠáž¼ážš áž›áž»áž™áž€áž¶áž€áŸ‹ & áž…áž·ážáŸ’ážážœáž·áž‘áŸ’áž™áž¶',
      'knowledge.openPageBtn': 'áž…áž¼áž›áž˜áž¾áž›áž‘áŸ†áž–áŸážšáž”ážŽáŸ’ážŽáž¶áž›áŸáž™áž–áŸáž‰áž›áŸáž‰ â†—',

      // Lessons Khmer
      'knowledge.l1Tag': 'áž‘áž˜áŸ’ážšáž„áŸ‹áž‘áž¸áž•áŸ’ážŸáž¶ážš & Liquidity',
      'knowledge.l1Title': 'áž€áž¶ážšáž”áŸ„ážŸážŸáž˜áŸ’áž¢áž¶áž Liquidity ážŸáŸ†ážáž¶áž“áŸ‹áž‡áž¶áž„ Pattern',
      'knowledge.l1Text': 'Trader áž‘áž¼áž‘áŸ…ážáŸ‚áž„áž…áž¶áŸ† Chart Pattern áž”áŸ‚áž”ážŸáŸ’ážáž„áŸ‹ážŠáž¶ážš áž”áŸ‰áž»áž“áŸ’ážáŸ‚ážŸáŸ’ážáž¶áž”áŸáž“áž’áž“áž¶áž‚áž¶ážšáž’áŸ†áŸ—áž˜áž¾áž›ážƒáž¾áž‰ Pattern áž‘áž¶áŸ†áž„áž“áŸ„áŸ‡áž‡áž¶áž€áž“áŸ’áž›áŸ‚áž„ Stop Loss ážšáž”ážŸáŸ‹áž‚áŸáŸ” áž€áž»áŸ†áž”áŸ’ážšáž‰áž¶áž”áŸ‹áž…áž¼áž›áž•áŸ’ážŸáž¶ážšážšáž áž¼ážážŠáž›áŸ‹áž‘áž¸áž•áŸ’ážŸáž¶ážšáž”áŸ„ážŸážŸáž˜áŸ’áž¢áž¶áž Liquidity ážšáž½áž…ážšáž¶áž›áŸ‹ áž áž¾áž™ Supply & Demand áž”áž‰áŸ’áž‡áž¶áž€áŸ‹áž…áŸ’áž”áž¶ážŸáŸ‹áž›áž¶ážŸáŸ‹áŸ”',
      'knowledge.l1Rule': 'Â«ážšáž„áŸ‹áž…áž¶áŸ†áž‘áž¸áž•áŸ’ážŸáž¶ážš Sweep Liquidity ážŸáž·áž“áž˜áž»áž“áž“áž¹áž„áž…áž¼áž›áž”áž‰áŸ’áž‡áž¶áŸ” áž”áž¾áž‚áŸ’áž˜áž¶áž“áž€áž¶ážš Sweep áž‘áŸ áž¢áŸ’áž“áž€áž áž¾áž™áž‚ážºáž‡áž¶ Liquidity ážšáž”ážŸáŸ‹áž‘áž¸áž•áŸ’ážŸáž¶ážšáŸ”Â»',

      'knowledge.l2Tag': 'áž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž áž¶áž“áž·áž—áŸáž™ & áž€áž¶ážšážšážŸáŸ‹ážšáž¶áž“',
      'knowledge.l2Title': 'áž€áž¶ážšáž€áž¶ážšáž–áž¶ážšážŠáž¾áž˜áž‘áž»áž“ áž‚ážºáž‡áž¶áž‡áž¸ážœáž·ážážáŸ‚áž˜áž½áž™áž‚ážáŸ‹ážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€',
      'knowledge.l2Text': 'Trader ážŠáŸ‚áž›áž˜áž¶áž“ Win Rate ážáŸ’ážšáž¹áž˜ 40% áž‡áž¶áž˜áž½áž™ážŸáž˜áž¶áž˜áž¶ážáŸ’ážš Risk-to-Reward 1:3 áž¢áž¶áž…áž”áž„áŸ’áž€áž¾ážáž”áŸ’ážšáž¶áž€áŸ‹áž…áŸ†ážŽáŸáž‰áž”áž¶áž“áž…áŸ’ážšáž¾áž“áž‡áž¶áž„ Scalper ážŠáŸ‚áž›áž˜áž¶áž“ Win Rate 90% ážáŸ‚áž‚áŸ’áž˜áž¶áž“ Stop LossáŸ” áž‚ážŽáž“áž¶áž‘áŸ†áž áŸ† Lot Size áž‡áž¶áž€áŸ‹áž›áž¶áž€áŸ‹áž‡áž¶áž“áž·áž…áŸ’áž… áž˜áž·áž“áž›áž¾ážŸáž–áž¸ 1% áž‘áŸ… 2% áž€áŸ’áž“áž»áž„ áŸ¡ Trade áž¡áž¾áž™áŸ”',
      'knowledge.l2Rule': 'Â«áž€áŸ†ážŽážáŸ‹áž áž¶áž“áž·áž—áŸáž™ážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€áž±áŸ’áž™áž…áŸ’áž”áž¶ážŸáŸ‹áž›áž¶ážŸáŸ‹ áž˜áž»áž“áž–áŸáž›áž‚áž·ážážŠáž›áŸ‹áž”áŸ’ážšáž¶áž€áŸ‹áž…áŸ†ážŽáŸáž‰áŸ” áž€áž¶ážšáž–áž¶ážšážŠáž¾áž˜áž‘áž»áž“áž‡áž¶áž…áž˜áŸ’áž”áž„áŸ”Â»',

      'knowledge.l3Tag': 'áž…áž·ážáŸ’ážážœáž·áž‘áŸ’áž™áž¶ & áž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž¢áž áŸ†áž€áž¶ážš',
      'knowledge.l3Title': 'áž¢áž áŸ†áž€áž¶ážš (Ego) áž‚ážºáž‡áž¶áž¢áŸ’áž“áž€áž”áŸ†áž•áŸ’áž›áž¶áž‰áž‚ážŽáž“áž¸áž’áŸ†áž”áŸ†áž•áž»áž',
      'knowledge.l3Text': 'áž‘áž¸áž•áŸ’ážŸáž¶ážšáž˜áž·áž“ážŠáŸ‚áž›áž…áž¶áŸ†áž¢áŸ’áž“áž€ áž¬ážáŸ’ážœáž›áŸ‹áž–áž¸áž¢áž¶ážšáž˜áŸ’áž˜ážŽáŸáž¢áŸ’áž“áž€áž¡áž¾áž™áŸ” áž€áž¶ážšážáž¶ážáž”áž„áŸ‹áž‚ážºáž‡áž¶ážáŸ’áž›áŸƒážŠáž¾áž˜áž¢áž¶áž‡áž¸ážœáž€áž˜áŸ’áž˜ áž˜áž·áž“áž˜áŸ‚áž“áž‡áž¶áž€áž¶ážšáž”áŸ’ážšáž˜áž¶ážáž›áž¾ážáŸ’áž›áž½áž“áž¢áŸ’áž“áž€áž‘áŸáŸ” áž€áž¶ážšáž‡áž½áž‰ážŠáž¼ážšáž”áŸ‚áž”ážŸáž„ážŸáž¹áž€ áž‚ážºáž‡áž¶áž€áž¶ážšáž…áž„áŸ‹ážˆáŸ’áž“áŸ‡áž‘áž¸áž•áŸ’ážŸáž¶ážšáŸ” Trader áž¢áž¶áž‡áž¸áž–áž‡áž½áž‰ážŠáž¼ážšáž›áž¾áž”áŸ’ážšáž¼áž”áž¶áž”áŸŠáž¸áž›áž¸ážáŸ ážŠáŸ„áž™áž‚áŸ’áž˜áž¶áž“áž¢áž¶ážšáž˜áŸ’áž˜ážŽáŸáž›áŸ„áž—áž›áž“áŸ‹ áž¬áž—áŸáž™ážáŸ’áž›áž¶áž…áŸ”',
      'knowledge.l3Rule': 'Â«áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž¢áž áŸ†áž€áž¶ážšážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€áŸ” áž”áž¾áž€áž¶ážšážáž¶ážáž’áŸ’ážœáž¾áž±áŸ’áž™áž¢áŸ’áž“áž€ážáž¹áž„ áž˜áž¶áž“áž“áŸáž™ážáž¶áž‘áŸ†áž áŸ† Lot ážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€áž’áŸ†áž‡áŸ’ážšáž»áž›áž áž½ážŸáž€áž˜áŸ’ážšáž·ážáŸ”Â»',

      'knowledge.l4Tag': 'ážœáž·áž“áŸáž™ & áž‘áž˜áŸ’áž›áž¶áž”áŸ‹áž”áŸ’ážšáž…áž¶áŸ†ážáŸ’áž„áŸƒ',
      'knowledge.l4Title': 'áž—áž¶áž–ážŸáŸ’ážáž·ážážŸáŸ’ážáŸážšáž€áž¾ážáž…áŸáž‰áž–áž¸áž‘áž˜áŸ’áž›áž¶áž”áŸ‹ážšáŸ€áž”áž…áŸ†áž‘áž»áž€áž‡áž¶áž˜áž»áž“',
      'knowledge.l4Text': 'áž€áž¶ážšáž‡áž½áž‰ážŠáž¼ážšáž‚ážºáž‡áž¶áž€áž¸áž¡áž¶áž•áŸ’áž›áž¼ážœáž…áž·ážáŸ’ážáž€áž˜áŸ’ážšáž·ážážáŸ’áž–ážŸáŸ‹áŸ” áž—áž¶áž–áž‡áŸ„áž‚áž‡áŸáž™áž˜áž·áž“áž˜áŸ‚áž“áž€áž¾ážáž¡áž¾áž„áž–áŸáž›áž€áŸ†áž–áž»áž„áž…áž»áž… Trade áž‘áŸ áž‚ážºáž€áž¾ážáž…áŸáž‰áž–áž¸áž€áž¶ážšážœáž·áž—áž¶áž‚áž‘áž»áž€áž‡áž¶áž˜áž»áž“ áž€áž¶ážšáž€ážáŸ‹ážáŸ’ážšáž¶ Journal áž‚áŸ’ážšáž”áŸ‹ Trade áž“áž·áž„áž€áž¶ážšáž”áŸ’ážšáž€áž¶áž“áŸ‹ážáŸ’áž‡áž¶áž”áŸ‹áž“áž¼ážœáž…áŸ’áž”áž¶áž”áŸ‹ážšáž”ážŸáŸ‹ážáŸ’áž›áž½áž“áž™áŸ‰áž¶áž„áž˜áŸ‰ážºáž„áž˜áŸ‰áž¶ážáŸ‹áŸ”',
      'knowledge.l4Rule': 'Â«Trade ážŽáž¶ážŠáŸ‚áž›áž…áž¼áž›ážáž»ážŸáž–áž¸áž•áŸ‚áž“áž€áž¶ážš áž‚ážºáž‡áž¶ Trade ážáž¶áž áž‘áŸ„áŸ‡áž”áž¸áž‡áž¶áž‘áž‘áž½áž›áž”áž¶áž“áž”áŸ’ážšáž¶áž€áŸ‹áž…áŸ†ážŽáŸáž‰áž€áŸážŠáŸ„áž™áŸ” ážŠáŸ†ážŽáž¾ážšáž€áž¶ážšážáŸ’ážšáž¹áž˜ážáŸ’ážšáž¼ážœážŸáŸ†ážáž¶áž“áŸ‹áž‡áž¶áž„áž¢áŸ’ážœáž¸áŸ—áž‘áž¶áŸ†áž„áž¢ážŸáŸ‹áŸ”Â»',

      // Books Khmer
      'knowledge.b1Genre': 'áž…áž·ážáŸ’ážážœáž·áž‘áŸ’áž™áž¶ & áž”áŸ’ážšáž¼áž”áž¶áž”áŸŠáž¸áž›áž¸ážáŸ',
      'knowledge.b1Title': 'Trading in the Zone',
      'knowledge.b1Author': 'áž“áž·áž–áž“áŸ’áž’ážŠáŸ„áž™ Mark Douglas',
      'knowledge.b1Desc': 'ážŸáŸ€ážœáž—áŸ…áž‚áŸ’ážšáž¹áŸ‡ážŠáŸáž›áŸ’áž”áž¸áž›áŸ’áž”áž¶áž‰áž”áŸ†áž•áž»ážáž›áž¾áž–áž·áž—áž–áž›áŸ„áž€ážŸáŸ’ážáž¸áž–áž¸áž€áž¶ážšáž›áž»áž”áž”áŸ†áž”áž¶ážáŸ‹áž€áž¶ážšáž—áŸáž™ážáŸ’áž›áž¶áž… áž€áž¶ážšáž‘áž‘áž½áž›áž™áž€áž áž¶áž“áž·áž—áŸáž™ áž“áž·áž„áž€áž¶ážšáž‚áž·ážáž›áž¾áž”áŸ’ážšáž¼áž”áž¶áž”áŸŠáž¸áž›áž¸ážáŸáŸ”',
      'knowledge.b1Quote': 'Â«áž“áŸ…áž–áŸáž›ážŠáŸ‚áž›áž¢áŸ’áž“áž€áž‘áž‘áž½áž›áž™áž€áž áž¶áž“áž·áž—áŸáž™ážŠáŸ„áž™ážŸáŸ’áž˜áŸ„áŸ‡ážŸáŸ’áž˜áŸáž‚áŸ’ážš áž…áž·ážáŸ’ážážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€áž“áž¹áž„áž˜áž¶áž“ážŸáŸáž…áž€áŸ’ážáž¸ážŸáŸ’áž„áž”áŸ‹áž…áŸ†áž–áŸ„áŸ‡áž‚áŸ’ážšáž”áŸ‹áž›áž‘áŸ’áž’áž•áž›áŸ”Â»',
      'knowledge.b1Why': 'áž…áž¶áŸ†áž”áž¶áž…áŸ‹ážŸáž˜áŸ’ážšáž¶áž”áŸ‹áŸ– áž€áž¶ážšáž›áž»áž”áž”áŸ†áž”áž¶ážáŸ‹áž€áž¶ážšáž—áŸáž™ážáŸ’áž›áž¶áž… áž“áž·áž„áž€áž¶ážšážŸáŸ’áž‘áž¶áž€áŸ‹ážŸáŸ’áž‘áž¾ážšáž–áŸáž›áž…áž¼áž›áž•áŸ’ážŸáž¶ážšáŸ”',

      'knowledge.b2Genre': 'áž•áŸ’áž“ážáŸ‹áž‚áŸ†áž“áž·ážáž›áž»áž™áž€áž¶áž€áŸ‹',
      'knowledge.b2Title': 'The Psychology of Money',
      'knowledge.b2Author': 'áž“áž·áž–áž“áŸ’áž’ážŠáŸ„áž™ Morgan Housel',
      'knowledge.b2Desc': 'áž˜áŸážšáŸ€áž“áž˜áž·áž“áž…áŸáŸ‡áž…áž¶ážŸáŸ‹ážŸáŸ’ážáž¸áž–áž¸áž¥ážšáž·áž™áž¶áž”ážáž€áŸ’áž“áž»áž„áž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž›áž»áž™ áž—áž¶áž–ážšáž¶áž”áž‘áž¶áž” áž“áž·áž„áž€áž¶ážšáž”áž„áŸ’áž€áž¾ážáž‘áŸ’ážšáž–áŸ’áž™ážŸáž˜áŸ’áž”ážáŸ’ážáž·ážŠáŸ„áž™áž“áž·ážšáž“áŸ’ážážšáž—áž¶áž–áŸ”',
      'knowledge.b2Quote': 'Â«áž€áž¶ážšáž‡áŸ„áž‚áž‡áŸáž™áž‡áž¶áž˜áž½áž™áž›áž»áž™ áž¢áž¶ážŸáŸ’ážšáŸáž™áž›áž¾áž—áž¶áž–áž†áŸ’áž›áž¶ážážœáŸƒáž”áž“áŸ’ážáž·áž…áž”áž“áŸ’ážáž½áž…áž”áŸ‰áž»ážŽáŸ’ážŽáŸ„áŸ‡ ážáŸ‚áž¢áž¶ážŸáŸ’ážšáŸáž™áž›áž¾áž¥ážšáž·áž™áž¶áž”ážážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€ážŸáŸ’áž‘áž¾ážšážáŸ‚áž‘áž¶áŸ†áž„ážŸáŸ’ážšáž»áž„áŸ”Â»',
      'knowledge.b2Why': 'áž…áž¶áŸ†áž”áž¶áž…áŸ‹ážŸáž˜áŸ’ážšáž¶áž”áŸ‹áŸ– áž€áž¶ážšážšáž€áŸ’ážŸáž¶ážŠáž¾áž˜áž‘áž»áž“ áž“áž·áž„áž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž‘áŸ’ážšáž–áŸ’áž™ážŸáž˜áŸ’áž”ážáŸ’ážáž·ážŠáŸ„áž™áž˜áž·áž“áž›áŸ„áž—áž›áž“áŸ‹áŸ”',

      'knowledge.b3Genre': 'áž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž¢áž¶ážšáž˜áŸ’áž˜ážŽáŸ',
      'knowledge.b3Title': 'The Disciplined Trader',
      'knowledge.b3Author': 'áž“áž·áž–áž“áŸ’áž’ážŠáŸ„áž™ Mark Douglas',
      'knowledge.b3Desc': 'áž–áž“áŸ’áž™áž›áŸ‹áž›áž˜áŸ’áž¢áž·ážáž¢áŸ†áž–áž¸áž‡áŸ†áž“áž¿áž•áŸ’áž‘áŸƒáž€áŸ’áž“áž»áž„ážŠáŸ‚áž›áž’áŸ’ážœáž¾áž±áŸ’áž™ Trader áž”ážšáž¶áž‡áŸáž™ áž“áž·áž„ážœáž·áž’áž¸ážŸáž¶ážŸáŸ’ážáŸ’ážšáž€ážŸáž¶áž„ážœáž·áž“áŸáž™áž•áŸ’áž›áž¼ážœáž…áž·ážáŸ’ážážšáž¹áž„áž˜áž¶áŸ†áž€áŸ’áž“áž»áž„áž€áž¶ážšáž‡áž½áž‰ážŠáž¼ážšáŸ”',
      'knowledge.b3Quote': 'Â«áž€áŸ†áž áž»ážŸ áŸ©áŸ¥% áž€áŸ’áž“áž»áž„áž€áž¶ážšáž‡áž½áž‰ážŠáž¼ážšáž€áž¾ážáž…áŸáž‰áž–áž¸áž€áž¶ážšáž—áŸáž™ážáŸ’áž›áž¶áž…â€”ážáŸ’áž›áž¶áž…ážáž»ážŸ ážáŸ’áž›áž¶áž…áž”áž¶ážáŸ‹áž”áž„áŸ‹áž›áž»áž™ áž“áž·áž„ážáŸ’áž›áž¶áž…ážáž€ážáž¶áž“áž±áž€áž¶ážŸ (FOMO)áŸ”Â»',
      'knowledge.b3Why': 'áž…áž¶áŸ†áž”áž¶áž…áŸ‹ážŸáž˜áŸ’ážšáž¶áž”áŸ‹áŸ– áž€áž¶ážšáž”áž‰áŸ’ážˆáž”áŸ‹áž€áž¶ážšáž‡áž½áž‰ážŠáž¼ážšážáž¶áž˜áž¢áž¶ážšáž˜áŸ’áž˜ážŽáŸ áž“áž·áž„áž€áž¶ážš OvertradeáŸ”',

      'knowledge.b4Genre': 'áž”áŸ’ážšážœážáŸ’ážáž·áž‘áž¸áž•áŸ’ážŸáž¶ážš & Tape Reading',
      'knowledge.b4Title': 'Reminiscences of a Stock Operator',
      'knowledge.b4Author': 'áž“áž·áž–áž“áŸ’áž’ážŠáŸ„áž™ Edwin LefÃ¨vre',
      'knowledge.b4Desc': 'áž‡áž¸ážœáž”áŸ’ážšážœážáŸ’ážáž·áž”áŸ‚áž”áž”áŸ’ážšáž›áŸ„áž˜áž›áŸ„áž€ážšáž”ážŸáŸ‹ážŸáŸ’ážáŸáž…áž‡áž½áž‰ážŠáž¼ážš Jesse Livermore áž”áž„áŸ’áž áž¶áž‰áž–áž¸áž€áž¶ážšáž¢ážáŸ‹áž’áŸ’áž˜ážáŸ‹áž€áŸ’áž“áž»áž„áž€áž¶ážšážšáž„áŸ‹áž…áž¶áŸ†áž±áž€áž¶ážŸ áž“áž·áž„áž€áž¶ážšáž”ážŽáŸ’ážáŸ„áž™áž±áŸ’áž™áž…áŸ†ážŽáŸáž‰ážšážáŸ‹áž‘áŸ…áž˜áž»ážáŸ”',
      'knowledge.b4Quote': 'Â«ážœáž¶áž˜áž·áž“áž˜áŸ‚áž“áž‡áž¶áž€áž¶ážšáž‚áž·ážáž…áŸ’ážšáž¾áž“ážšáž”ážŸáŸ‹ážáŸ’áž‰áž»áŸ†ážŠáŸ‚áž›ážšáž€áž›áž»áž™áž”áž¶áž“áž…áŸ’ážšáž¾áž“áž“áŸ„áŸ‡áž‘áŸ áž”áŸ‰áž»áž“áŸ’ážáŸ‚áž‚ážºáž€áž¶ážšáž…áŸáŸ‡áž¢áž„áŸ’áž‚áž»áž™ážšáž„áŸ‹áž…áž¶áŸ†ážŠáŸ„áž™áž¢ážáŸ‹áž’áŸ’áž˜ážáŸ‹áŸ”Â»',
      'knowledge.b4Why': 'áž…áž¶áŸ†áž”áž¶áž…áŸ‹ážŸáž˜áŸ’ážšáž¶áž”áŸ‹áŸ– áž€áž¶ážšáž”ážŽáŸ’ážáž»áŸ‡áž€áž¶ážšáž¢ážáŸ‹áž’áŸ’áž˜ážáŸ‹ážáŸ’áž–ážŸáŸ‹ áž“áž·áž„áž€áž¶ážšáž˜áž·áž“áž”áŸ’ážšáž‰áž¶áž”áŸ‹áž€áž¶ážáŸ‹áž…áŸ†ážŽáŸáž‰áŸ”',

      'knowledge.b5Genre': 'áž™áž»áž‘áŸ’áž’ážŸáž¶ážŸáŸ’ážáŸ’ážšážŸáŸ’ážáž¶áž”áŸáž“áž€áŸ†áž–áž¼áž›',
      'knowledge.b5Title': 'Market Wizards',
      'knowledge.b5Author': 'áž“áž·áž–áž“áŸ’áž’ážŠáŸ„áž™ Jack D. Schwager',
      'knowledge.b5Desc': 'áž€áž·áž…áŸ’áž…ážŸáž˜áŸ’áž—áž¶ážŸáž“áŸáž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„áž‡áž¶áž˜áž½áž™áž€áŸ†áž–áž¼áž› Trader áž“áž·áž„áž¢áŸ’áž“áž€áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž˜áž¼áž›áž“áž·áž’áž·áž’áŸ†áŸ—áž›áž¾áž–áž·áž—áž–áž›áŸ„áž€ ážŠáŸ‚áž›ážŸáž»áž‘áŸ’áž’ážŸáž¹áž„áž”áŸ’ážšáž€áž¶áž“áŸ‹ážáŸ’áž‡áž¶áž”áŸ‹áž“áž¼ážœáž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž áž¶áž“áž·áž—áŸáž™áŸ”',
      'knowledge.b5Quote': 'Â«áž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž áž¶áž“áž·áž—áŸáž™ áž‚ážºáž‡áž¶áž€ážáŸ’ážáž¶ážŸáŸ†ážáž¶áž“áŸ‹áž”áŸ†áž•áž»ážážŠáŸ‚áž›áž€áŸ†áž–áž¼áž› Trader áž‘áž¶áŸ†áž„áž¢ážŸáŸ‹áž”áŸ’ážšáž€áž¶áž“áŸ‹ážáŸ’áž‡áž¶áž”áŸ‹ážŠáž¼áž…áž‚áŸ’áž“áž¶áŸ”Â»',
      'knowledge.b5Why': 'áž…áž¶áŸ†áž”áž¶áž…áŸ‹ážŸáž˜áŸ’ážšáž¶áž”áŸ‹áŸ– áž€áž¶ážšáž™áž›áŸ‹ážŠáž¹áž„áž–áž¸áž•áŸ’áž“ážáŸ‹áž‚áŸ†áž“áž·ážážšáž”ážŸáŸ‹ Trader áž¢áž¶áž‡áž¸áž–áž€áŸ†áž–áž¼áž› áŸ¡%áŸ”',

      'knowledge.b6Genre': 'áž‘áž˜áŸ’áž›áž¶áž”áŸ‹ & ážœáž·áž“áŸáž™',
      'knowledge.b6Title': 'Atomic Habits',
      'knowledge.b6Author': 'áž“áž·áž–áž“áŸ’áž’ážŠáŸ„áž™ James Clear',
      'knowledge.b6Desc': 'áž€áž¶ážšáž€ážŸáž¶áž„áž”áŸ’ážšáž–áŸáž“áŸ’áž’áž‘áž˜áŸ’áž›áž¶áž”áŸ‹ážáž¼áž…áŸ— áŸ¡% áž‡áž¶ážšáŸ€áž„ážšáž¶áž›áŸ‹ážáŸ’áž„áŸƒ ážŠáŸ‚áž›áž‡áž½áž™áž”áž„áŸ’áž€áž¾ážážœáž·áž“áŸáž™áž‡áž¶áž”áŸ‹áž›áž¶áž”áŸ‹áž€áŸ’áž“áž»áž„áž€áž¶ážšážšáŸ€áž”áž…áŸ†áž•áŸ‚áž“áž€áž¶ážš áž“áž·áž„áž€áž¶ážšáž€ážáŸ‹ážáŸ’ážšáž¶ JournaláŸ”',
      'knowledge.b6Quote': 'Â«áž¢áŸ’áž“áž€áž˜áž·áž“áž¢áž¶áž…ážˆáž¶áž“ážŠáž›áŸ‹áž€áž˜áŸ’ážšáž·ážáž“áŸƒáž‚áŸ„áž›ážŠáŸ…ážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€áž‘áŸ áž”áŸ‰áž»áž“áŸ’ážáŸ‚áž¢áŸ’áž“áž€áž“áž¹áž„áž’áŸ’áž›áž¶áž€áŸ‹áž˜áž€ážáŸ’ážšáž¹áž˜áž€áž˜áŸ’ážšáž·ážáž“áŸƒáž”áŸ’ážšáž–áŸáž“áŸ’áž’áž‘áž˜áŸ’áž›áž¶áž”áŸ‹ážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€áŸ”Â»',
      'knowledge.b6Why': 'áž…áž¶áŸ†áž”áž¶áž…áŸ‹ážŸáž˜áŸ’ážšáž¶áž”áŸ‹áŸ– áž€áž¶ážšáž”áž„áŸ’áž€áž¾ážáž‘áž˜áŸ’áž›áž¶áž”áŸ‹ážáŸ’ážšáŸ€áž˜ážáŸ’áž›áž½áž“áž˜áž»áž“áž‘áž¸áž•áŸ’ážŸáž¶ážšáž”áž¾áž€ áž“áž·áž„áž€áž¶ážšáž€ážáŸ‹ážáŸ’ážšáž¶áž‘áž·áž“áŸ’áž“áž“áŸáž™áŸ”',

      'knowledge.b7Genre': 'áž€áž¶ážšážŸáž˜áŸ’ážšáŸáž…áž…áž·ážáŸ’ážáž€áŸ’ážšáŸ„áž˜ážŸáž˜áŸ’áž–áž¶áž’',
      'knowledge.b7Title': 'Thinking, Fast and Slow',
      'knowledge.b7Author': 'áž“áž·áž–áž“áŸ’áž’ážŠáŸ„áž™ Daniel Kahneman',
      'knowledge.b7Desc': 'áž€áž¶ážšážŸáŸ’ážšáž¶ážœáž‡áŸ’ážšáž¶ážœáž€áž˜áŸ’ážšáž·ážážšáž„áŸ’ážœáž¶áž“áŸ‹ážŽáž¼áž”áŸ‚áž›áž¢áŸ†áž–áž¸áž€áž¶ážšáž‚áž·ážáž”áŸ‚áž”áž¢áž¶ážšáž˜áŸ’áž˜ážŽáŸáž‘áž¶áž“áŸ‹áž áž“áŸ‹ (System 1) áž“áž·áž„áž€áž¶ážšáž‚áž·ážáž”áŸ‚áž”ážœáž·áž—áž¶áž‚ážŸáŸŠáž¸áž‡áž˜áŸ’ážšáŸ… (System 2) áž€áŸ’áž“áž»áž„áž‘áž¸áž•áŸ’ážŸáž¶ážšáŸ”',
      'knowledge.b7Quote': 'Â«áž˜áž“áž»ážŸáŸ’ážŸáž™áž¾áž„áž…áŸ’ážšáž¾áž“ážáŸ‚ážœáž¶áž™ážáž˜áŸ’áž›áŸƒážáŸ’áž–ážŸáŸ‹áž›áž¾áž€áž¶ážšáž™áž›áŸ‹ážŠáž¹áž„ážšáž”ážŸáŸ‹ážáŸ’áž›áž½áž“ áž áž¾áž™ážœáž¶áž™ážáž˜áŸ’áž›áŸƒáž‘áž¶áž”áž›áž¾ážáž½áž“áž¶áž‘áž¸áž“áŸƒáž”áŸ’ážšáž¼áž”áž¶áž”áŸŠáž¸áž›áž¸ážáŸáŸ”Â»',
      'knowledge.b7Why': 'áž…áž¶áŸ†áž”áž¶áž…áŸ‹ážŸáž˜áŸ’ážšáž¶áž”áŸ‹áŸ– áž€áž¶ážšážŠáž¹áž„áž‘áž¶áž“áŸ‹áž“áž¼ážœáž—áž¶áž–áž›áŸ†áž¢áŸ€áž„áž“áŸƒáž€áž¶ážšáž‚áž·áž áž“áž·áž„áž€áž¶ážšáž”áž‰áŸ’ážˆáž”áŸ‹áž€áž¶ážšáž—áŸ’áž“áž¶áž›áŸ‹ážŠáŸ„áž™áž„áž„áž¹ážáž„áž„áž›áŸ‹áŸ”',

      'knowledge.b8Genre': 'Margin of Safety',
      'knowledge.b8Title': 'The Intelligent Investor',
      'knowledge.b8Author': 'áž“áž·áž–áž“áŸ’áž’ážŠáŸ„áž™ Benjamin Graham',
      'knowledge.b8Desc': 'ážŸáŸ€ážœáž—áŸ…áž‚áŸ’ážšáž¹áŸ‡ážŠáŸáž›áŸ’áž”áž¸ážŸáŸ’ážáž¸áž–áž¸áž€áž¶ážšážœáž·áž“áž·áž™áŸ„áž‚ážŠáŸ„áž™ážœáž·áž“áŸáž™ áž€áž¶ážšáž˜áž·áž“ážáž€áŸ‹ážŸáŸ’áž›áž»ážážáž¶áž˜áž‘áž¸áž•áŸ’ážŸáž¶ážš (Mr. Market) áž“áž·áž„áž€áž¶ážšáž€áž¶ážšáž–áž¶ážšáž áž¶áž“áž·áž—áŸáž™áž‡áž¶áž…áž˜áŸ’áž”áž„áŸ”',
      'knowledge.b8Quote': 'Â«ážáŸ’áž›áž¹áž˜ážŸáž¶ážšáž“áŸƒáž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž€áž¶ážšážœáž·áž“áž·áž™áŸ„áž‚ áž‚ážºáž‡áž¶áž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž áž¶áž“áž·áž—áŸáž™ áž˜áž·áž“áž˜áŸ‚áž“áž‡áž¶áž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž”áŸ’ážšáž¶áž€áŸ‹áž…áŸ†ážŽáŸáž‰áž“áŸ„áŸ‡áž‘áŸáŸ”Â»',
      'knowledge.b8Why': 'áž…áž¶áŸ†áž”áž¶áž…áŸ‹ážŸáž˜áŸ’ážšáž¶áž”áŸ‹áŸ– áž€áž¶ážšáž™áž›áŸ‹ážŠáž¹áž„áž–áž¸ážáž˜áŸ’áž›áŸƒáž áž¶áž“áž·áž—áŸáž™ áž“áž·áž„áž€áž¶ážšáž‡áž½áž‰ážŠáž¼ážšáž”áŸ‚áž” Swing TradingáŸ”',

      // Pillars
      'pillars.subtitle': 'áž‘ážŸáŸ’ážŸáž“ážœáž·áž‡áŸ’áž‡áž¶áž‡áž½áž‰ážŠáž¼ážš',
      'pillars.title': 'áž‚áŸ„áž›áž€áž¶ážšážŽáŸáž‚áŸ’ážšáž¹áŸ‡ áŸ£ áž“áŸƒ <span class="italic">áž—áž¶áž–áž‡áŸ„áž‚áž‡áŸáž™áž™áž¼ážšáž¢áž„áŸ’ážœáŸ‚áž„</span>',
      'pillars.quoteHead': 'áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž¢áž áŸ†áž€áž¶ážšážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€áŸ” áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž€áž¶ážšáž‡áž½áž‰ážŠáž¼ážšážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€áŸ”',
      'pillars.quoteSub': 'áž‡áž½áž‰ážŠáž¼ážšážŠáŸ„áž™áž…áž·ážáŸ’ážážŸáŸ’áž„áž”áŸ‹ áž‚áŸ’áž˜áž¶áž“áž€áž¶ážšážšáŸ†ážáž¶áž“áž–áž¸áž¢áž¶ážšáž˜áŸ’áž˜ážŽáŸ áž“áž·áž„áž”áŸ’ážšáž€áž¶áž“áŸ‹ážáŸ’áž‡áž¶áž”áŸ‹áž“áž¼ážœáž€áŸ’áž”áž½áž“áž…áŸ’áž”áž¶áž”áŸ‹áž…áŸ’áž”áž¶ážŸáŸ‹áž›áž¶ážŸáŸ‹áŸ”',
      'pillars.p1Num': 'áž‚áŸ„áž›áž€áž¶ážšážŽáŸáž‚áŸ’ážšáž¹áŸ‡ áŸ áŸ¡',
      'pillars.p1Title': 'áž€áž¶ážšáž¢áž“áž»ážœážáŸ’ážáž”áŸ’ážšáž€áž”ážŠáŸ„áž™ážœáž·áž“áŸáž™ & áž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž áž¶áž“áž·áž—áŸáž™',
      'pillars.p1Desc': 'ážšáž¶áž›áŸ‹áž€áž¶ážšáž…áž¼áž›áž•áŸ’ážŸáž¶ážšáž‘áž¶áŸ†áž„áž¢ážŸáŸ‹ážáŸ’ážšáž¼ážœáž˜áž¶áž“áž‘áŸ†áž áŸ† Position áž…áŸ’áž”áž¶ážŸáŸ‹áž›áž¶ážŸáŸ‹ áž€áž˜áŸ’ážšáž·áž Stop Loss áž€áŸ†ážŽážáŸ‹áž‡áž¶áž˜áž»áž“ áž“áž·áž„ážŸáž˜áž¶áž˜áž¶ážáŸ’ážšáž…áŸ†ážŽáŸáž‰áž’áŸ€áž”áž áž¶áž“áž·áž—áŸáž™áž‡áž¶áž”áŸ’ážšáž–áŸáž“áŸ’áž’áŸ” áž€áž¶ážšáž€áž¶ážšáž–áž¶ážšážŠáž¾áž˜áž‘áž»áž“ áž‚ážºáž‡áž¶áž€áž¶ážáž–áŸ’ážœáž€áž·áž…áŸ’áž…áž…áž˜áŸ’áž”áž„ áž˜áž»áž“áž“áž¹áž„áž‚áž·ážážŠáž›áŸ‹áž€áž¶ážšáž”áž„áŸ’áž€áž¾áž“áž”áŸ’ážšáž¶áž€áŸ‹áž…áŸ†ážŽáŸáž‰áŸ”',
      'pillars.p2Num': 'áž‚áŸ„áž›áž€áž¶ážšážŽáŸáž‚áŸ’ážšáž¹áŸ‡ áŸ áŸ¢',
      'pillars.p2Title': 'áž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„ Ego & áž¢áž¶ážšáž˜áŸ’áž˜ážŽáŸ',
      'pillars.p2Desc': 'Â«áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž¢áž áŸ†áž€áž¶ážšážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€áŸ” áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž€áž¶ážšáž‡áž½áž‰ážŠáž¼ážšážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€áŸ”Â» áž™áž€ážˆáŸ’áž“áŸ‡ FOMO áž€áž¶ážšáž›áŸ„áž—áž›áž“áŸ‹ áž“áž·áž„áž€áž¶ážšáž‡áž½áž‰ážŠáž¼ážšážáž¶áž˜áž¢áž¶ážšáž˜áŸ’áž˜ážŽáŸáŸ” áž™áž¾áž„áž‡áž½áž‰ážŠáž¼ážšážŠáŸ„áž™áž€áž¶ážšáž¢ážáŸ‹áž’áŸ’áž˜ážáŸ‹ áž“áž·áž„áž’áŸ’ážœáž¾áž€áž¶ážšážŸáž˜áŸ’ážšáŸáž…áž…áž·ážáŸ’ážáž•áŸ’áž¢áŸ‚áž€áž›áž¾áž‘áž·áž“áŸ’áž“áž“áŸáž™ áž“áž·áž„áž”áŸ’ážšáž¼áž”áž¶áž”áŸŠáž¸áž›áž¸ážáŸáŸ”',
      'pillars.p3Num': 'áž‚áŸ„áž›áž€áž¶ážšážŽáŸáž‚áŸ’ážšáž¹áŸ‡ áŸ áŸ£',
      'pillars.p3Title': 'áž‘ážŸáŸ’ážŸáž“ážœáž·ážŸáŸáž™ážœáŸ‚áž„áž†áŸ’áž„áž¶áž™ & áž€áž¶ážšážšáŸ€áž“ážŸáž¼ážáŸ’ážšáž‡áž¶áž”áŸ’ážšáž…áž¶áŸ†',
      'pillars.p3Desc': 'áž€áž¶ážšážšáŸ€áž“ážŸáž¼ážáŸ’ážšáž‡áž¶áž”áž“áŸ’áž áž“áž·áž„áž€áž¶ážšáž™áž›áŸ‹ážŠáž¹áž„ážŸáŸŠáž¸áž‡áž˜áŸ’ážšáŸ…áž¢áŸ†áž–áž¸áž‘áž¸áž•áŸ’ážŸáž¶ážšáž áž·ážšáž‰áŸ’áž‰ážœážáŸ’ážáž»ážŸáž€áž›áŸ” áž€ážŸáž¶áž„áž‘áŸ†áž“áž»áž€áž…áž·ážáŸ’áž áž”áž„áŸ’áž€áž¾ážážáž˜áŸ’áž›áŸƒáž™áž¼ážšáž¢áž„áŸ’ážœáŸ‚áž„ áž“áž·áž„ážšáž¸áž€áž…áž˜áŸ’ážšáž¾áž“áž‡áž¶áž˜áž½áž™áž‚áŸ’áž“áž¶áž”áŸ’ážšáž€áž”ážŠáŸ„áž™áž…áž€áŸ’ážáž»ážœáž·ážŸáŸáž™ážœáŸ‚áž„áž†áŸ’áž„áž¶áž™áŸ”',

      // Media
      'media.subtitle': 'áž‘ážŸáŸ’ážŸáž“áž¶ & ážšáŸ€áž“ážŸáž¼ážáŸ’ážš',
      'media.title': 'ážœáž¸ážŠáŸáž¢áž¼ážœáž·áž—áž¶áž‚áž…áž»áž„áž€áŸ’ážšáŸ„áž™ & <span class="italic">áž”ážŽáŸ’ážáž¶áž‰ážŸáž„áŸ’áž‚áž˜</span>',
      'media.ytBadge': 'ážœáž¸ážŠáŸáž¢áž¼ YouTube áž–áž·ážŸáŸážŸ',
      'media.latestUpload': 'ážœáž¸ážŠáŸáž¢áž¼áž…áž»áž„áž€áŸ’ážšáŸ„áž™',
      'media.ytSubscribe': 'áž‡áž¶ážœ (Subscribe) áž›áž¾ YouTube',
      'media.watchDirect': 'áž˜áž¾áž›áž›áž¾ YouTube',
      'media.tiktokTitle': 'TikTok ážœáž¸ážŠáŸáž¢áž¼ážáŸ’áž›áž¸áž”áŸ’ážšáž…áž¶áŸ†ážáŸ’áž„áŸƒ',
      'media.tt1Title': 'áž˜áž¼áž›áž áŸážáž» 95% áž“áŸƒ Trader ážáž¶ážáž”áž„áŸ‹áž”áŸ’ážšáž¶áž€áŸ‹ (áž¢áž“áŸ’áž‘áž¶áž€áŸ‹ Ego)',
      'media.tt2Title': 'ážšáž”áŸ€áž”ážŠáŸ‚áž›áž’áž“áž¶áž‚áž¶ážš Sweep Stop Loss áž˜áž»áž“áž–áŸáž›áž‘áž¸áž•áŸ’ážŸáž¶ážšážšážáŸ‹áž’áŸ†',
      'media.fbTitle': 'áž€áž¶ážšáž…áŸ‚áž€ážšáŸ†áž›áŸ‚áž€áž›áž¾ Facebook',
      'media.fbPostMeta': 'áž€áž¶ážšáž¢áž¶áž”áŸ‹ážŠáŸážáž‘áž¸áž•áŸ’ážŸáž¶ážšážáŸ’áž˜áž¸áŸ— â€¢ ážŸáž¶áž’áž¶ážšážŽáŸˆ',
      'media.fbPostText': 'Â«áž€áž¶ážšáž¢ážáŸ‹áž’áŸ’áž˜ážáŸ‹áž‚ážºáž‡áž¶áž”áŸ’ážšáŸ€áž”ážáŸ’áž›áž¶áŸ†áž„áž”áŸ†áž•áž»ážážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€áž€áŸ’áž“áž»áž„áž‘áž¸áž•áŸ’ážŸáž¶ážšáž”áŸ’ážšáŸ‚áž”áŸ’ážšáž½áž›áŸ” áž€áž»áŸ†ážŠáŸáž‰áž…áž¶áž”áŸ‹áž‘áŸ€áž“áž”áŸƒážáž„ážŠáŸ„áž™ážŸáž¶ážšážáŸ‚ážáŸ’áž›áž¶áž…ážáž€ážáž¶áž“áž±áž€áž¶ážŸ (FOMO)áŸ” áž¢áŸ’áž“áž€áž‡áŸ†áž“áž¶áž‰áž–áž·ážáž”áŸ’ážšáž¶áž€ážŠážáŸ‚áž„ážáŸ‚ážšáž„áŸ‹áž…áž¶áŸ† Setup ážšáž”ážŸáŸ‹ážáŸ’áž›áž½áž“áž±áŸ’áž™ážŸáŸ’ážšáž”ážáž¶áž˜áž€áŸ’áž”áž½áž“áž…áŸ’áž”áž¶ážŸáŸ‹áž›áž¶ážŸáŸ‹ áž‘áž¾áž”áž…áž¼áž›áž•áŸ’ážŸáž¶ážšážŠáŸ„áž™áž‚áŸ’áž˜áž¶áž“áž—áž¶áž–ážŸáŸ’áž‘áž¶áž€áŸ‹ážŸáŸ’áž‘áž¾ážšáŸ”Â»',
      'media.fbView': 'áž˜áž¾áž›áž€áž¶ážšáž–áž·áž—áž¶áž€áŸ’ážŸáž¶áž›áž¾ Facebook',

      // FAQ
      'faq.subtitle': 'ážŸáŸ†ážŽáž½ážšážŠáŸ‚áž›ážŸáž½ážšáž‰áž¹áž€áž‰áž¶áž”áŸ‹',
      'faq.title': 'áž…áž˜áŸ’áž›áž¾áž™áž…áŸ’áž”áž¶ážŸáŸ‹áž›áž¶ážŸáŸ‹ážŸáž˜áŸ’ážšáž¶áž”áŸ‹ <span class="italic">Trader áž”áŸ’ážšáž€áž”ážŠáŸ„áž™ážœáž·áž“áŸáž™</span>',
      'faq.desc': 'áž¢áŸ’ážœáž¸áŸ—ážŠáŸ‚áž›áž¢áŸ’áž“áž€áž‚áž½ážšážŠáž¹áž„áž¢áŸ†áž–áž¸áž€áž˜áŸ’áž˜ážœáž·áž’áž¸ážŸáž·áž€áŸ’ážŸáž¶ áž€áž¶ážšáž”áž„áŸ’ážšáŸ€áž“áž•áŸ’áž‘áž¶áž›áŸ‹ áž˜áŸ‰áž¼ážŠáŸ‚áž›áž áž¶áž“áž·áž—áŸáž™ áž“áž·áž„áž¢áž“áž»áž›áŸ„áž˜áž—áž¶áž–áž…áŸ’áž”áž¶áž”áŸ‹áŸ”',
      'faq.q1': 'ážáž¾ážœáž‚áŸ’áž‚ážŸáž·áž€áŸ’ážŸáž¶ áž“áž·áž„áž€áž˜áŸ’áž˜ážœáž·áž’áž¸áž”áž„áŸ’ážœáž¹áž€áž“áŸáŸ‡ážŸáŸáž€áŸ’ážáž·ážŸáž˜ážŸáž˜áŸ’ážšáž¶áž”áŸ‹áž¢áŸ’áž“áž€ážŽáž¶?',
      'faq.a1': 'áž€áž˜áŸ’áž˜ážœáž·áž’áž¸ážŸáž·áž€áŸ’ážŸáž¶áž“áŸáŸ‡ážšáŸ€áž”áž…áŸ†áž¡áž¾áž„ážŸáž˜áŸ’ážšáž¶áž”áŸ‹ Trader áž€áž˜áŸ’ážšáž·ážážŠáŸ†áž”áž¼áž„ áž“áž·áž„áž˜áž’áŸ’áž™áž˜ ážŠáŸ‚áž›áž˜áž·áž“áž‘áž¶áž“áŸ‹áž‘áž‘áž½áž›áž”áž¶áž“áž›áž‘áŸ’áž’áž•áž›ážáž·ážážáŸážš áž¬áž€áŸ†áž–áž»áž„ážœáž„áŸ’ážœáŸáž„áž‡áž¶áž˜áž½áž™ Indicator áž…áŸ’ážšáž¾áž“áž–áŸáž€ áž¬áž‡áž½áž‰ážŠáž¼ážšážáž¶áž˜áž¢áž¶ážšáž˜áŸ’áž˜ážŽáŸáŸ” áž˜áž·áž“ážáž¶áž¢áŸ’áž“áž€áž…áž„áŸ‹áž™áž›áŸ‹ážŠáž¹áž„áž–áž¸áž˜áž¼áž›ážŠáŸ’áž‹áž¶áž“áž‚áŸ’ážšáž¹áŸ‡áž‘áž¸áž•áŸ’ážŸáž¶ážš áž¬áž…áž„áŸ‹áž”áŸ’ážáž¼ážšáž˜áž€áž‡áž½áž‰ážŠáž¼ážšáž”áŸ‚áž” Institutional Supply & Demand áž“áŸ„áŸ‡áž‘áŸ áž€áž˜áŸ’áž˜ážœáž·áž’áž¸áž“áŸáŸ‡áž•áŸ’ážáž›áŸ‹áž‡áž¼áž“áž“áž¼ážœáž€áŸ’áž”áž½áž“áž…áŸ’áž”áž¶áž”áŸ‹áž…áŸ’áž”áž¶ážŸáŸ‹áž›áž¶ážŸáŸ‹ áž“áž·áž„áž¢áž¶áž…áž¢áž“áž»ážœážáŸ’ážáž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„áž”áž¶áž“áŸ”',
      'faq.q2': 'ážáž¾áž¢áŸ’áž“áž€áž”áž„áŸ’ážšáŸ€áž“áž›áž¾ážœáž·áž’áž¸ážŸáž¶ážŸáŸ’ážáŸ’ážšáž‡áž½áž‰ážŠáž¼ážš áž“áž·áž„áž‘áž¸áž•áŸ’ážŸáž¶ážšážŽáž¶ážáŸ’áž›áŸ‡?',
      'faq.a2': 'áž™áž¾áž„áž˜áž¶áž“áž‡áŸ†áž“áž¶áž‰áž›áž¾ Institutional Supply & Demand, Liquidity Sweeps, Supply & Demand Imbalances áž“áž·áž„ Asymmetric Risk ArchitectureáŸ” áž™áž¾áž„áž•áŸ’ážáŸ„ážáž›áž¾áž‘áž¸áž•áŸ’ážŸáž¶ážšážŠáŸ‚áž›áž˜áž¶áž“ážŸáž“áŸ’áž‘áž»áŸ‡ážŸáž¶áž…áŸ‹áž”áŸ’ážšáž¶áž€áŸ‹ážáŸ’áž–ážŸáŸ‹ ážšáž½áž˜áž˜áž¶áž“áž‚áž¼ážšáž¼áž”áž·áž™áž”áŸážŽáŸ’ážŽážŸáŸ†ážáž¶áž“áŸ‹áŸ— áž˜áž¶ážŸ (XAU/USD) áž“áž·áž„ážŸáž“áŸ’áž‘ážŸáŸ’ážŸáž“áŸážŸáž€áž›áŸ” áž™áž¾áž„áž˜áž·áž“áž‡áž½áž‰ážŠáž¼ážšážáž¶áž˜áž€áž¶ážšážŸáŸ’áž˜áž¶áž“ áž¬áž‘áž¸áž•áŸ’ážŸáž¶ážšážŠáŸ‚áž›áž‚áŸ’áž˜áž¶áž“ážŸáž¶áž…áŸ‹áž”áŸ’ážšáž¶áž€áŸ‹áž“áŸ„áŸ‡áž¡áž¾áž™áŸ”',
      'faq.q3': 'ážáž¾ážœáž‚áŸ’áž‚ážŸáž·áž€áŸ’ážŸáž¶ Study Course ážáŸ’ážšáž¼ážœáž”áž¶áž“ážšáŸ€áž”áž…áŸ† áž“áž·áž„áž”áž„áŸ’ážšáŸ€áž“áž™áŸ‰áž¶áž„ážŠáž¼áž…áž˜áŸ’ážáŸáž…?',
      'faq.a3': 'ážšáž¶áž›áŸ‹áž€áž¶ážšáž”áž„áŸ’ážšáŸ€áž“áž‘áž¶áŸ†áž„áž¢ážŸáŸ‹áž‚ážºáž’áŸ’ážœáž¾áž¡áž¾áž„ážáž¶áž˜ážšáž™áŸˆáž€áž¶ážš Live áž”áž„áŸ’ážšáŸ€áž“áž•áŸ’áž‘áž¶áž›áŸ‹áž‡áž¶áž˜áž½áž™ BlueX (Share Screen)áŸ” ážšáž¶áž›áŸ‹áž‘áŸ’ážšáž¹ážŸáŸ’ážáž¸áž‘áž¶áŸ†áž„áž¢ážŸáŸ‹ážáŸ’ážšáž¼ážœáž”áž¶áž“áž”áž„áŸ’ážšáŸ€áž“áž•áŸ’áž‘áž¶áž›áŸ‹áž›áž¾áž€áŸ’ážšáž¶áž áŸ’ážœáž·áž€áž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„ Real-Time áž‡áž‡áŸ‚áž€ážŸáž½ážšážŠáŸáž‰ážŠáŸ„áž›áž•áŸ’áž‘áž¶áž›áŸ‹áž˜áž¶ážáŸ‹ ážœáž·áž—áž¶áž‚ Trade áž•áŸ’áž‘áž¶áž›áŸ‹ áž“áž·áž„áž€áŸ‚ážáž˜áŸ’ážšáž¼ážœáž€áŸ†áž áž»ážŸáž•áŸ’áž›áž¼ážœáž…áž·ážáŸ’ážážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€áž—áŸ’áž›áž¶áž˜áŸ—áŸ”',
      'faq.q4': 'ážáž¾ážœáž·áž’áž¸ážŸáž¶ážŸáŸ’ážáŸ’ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž áž¶áž“áž·áž—áŸáž™ážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€áž˜áž¶áž“áž›áž€áŸ’ážážŽáŸˆážŠáž¼áž…áž˜áŸ’ážáŸáž…?',
      'faq.a4': 'áž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž áž¶áž“áž·áž—áŸáž™áž‚ážºáž‡áž¶áž”áŸáŸ‡ážŠáž¼áž„áž…áž˜áŸ’áž”áž„áŸ– <em>áž€áž¶ážšáž–áž¶ážšážŠáž¾áž˜áž‘áž»áž“áž‡áž¶áž˜áž»áž“ážŸáž·áž“ áž˜áž»áž“áž“áž¹áž„ážŸáŸ’ážœáŸ‚áž„ážšáž€áž•áž›áž…áŸ†ážŽáŸáž‰</em>áŸ” áž€áž¶ážšáž€áŸ†ážŽážáŸ‹áž‘áŸ†áž áŸ† Position ážáŸ’ážšáž¼ážœážáŸ‚áž‚áŸ„ážšáž–ážáž¶áž˜áž áž¶áž“áž·áž—áŸáž™ážŠáŸ‚áž›áž”áž¶áž“áž€áŸ†ážŽážáŸ‹ (0.5% áž‘áŸ… 1.0% áž€áŸ’áž“áž»áž„áž˜áž½áž™ Trade) áž“áž·áž„áž€áŸ†ážŽážáŸ‹áž‚áŸ„áž›ážŠáŸ…áž…áŸ†ážŽáŸáž‰áž’áŸ€áž”áž áž¶áž“áž·áž—áŸáž™áž™áŸ‰áž¶áž„áž áŸ„áž…ážŽáž¶ážŸáŸ‹ 1:3áŸ” áž™áž¾áž„áž”áŸ’ážšáž¾áž”áŸ’ážšáž¶ážŸáŸ‹ Stop Loss ážŠáž¶áž…áŸ‹ážáž¶áž áž“áž·áž„áž˜áž·áž“áž”áŸ’ážšáž¾áž”áŸ’ážšáž¶ážŸáŸ‹áž™áž»áž‘áŸ’áž’ážŸáž¶ážŸáŸ’ážáŸ’ážš Martingale áž¬ Grid ážŠáŸ‚áž›áž”áŸ’ážšážáž»áž™áž”áŸ’ážšážáž¶áž“áž¡áž¾áž™áŸ”',
      'faq.q5': 'ážáž¾áž‘áŸ†áž“áž¶áž€áŸ‹áž‘áŸ†áž“áž„ážšážœáž¶áž„ BlueX áž“áž·áž„ SAGFX áž‚ážºáž‡áž¶áž¢áŸ’ážœáž¸?',
      'faq.a5': 'SAGFX áž‚ážºáž‡áž¶ážŠáŸƒáž‚áž¼ Affiliate áž“áž·áž„áž‡áž¶áž¢áŸ’áž“áž€áž•áŸ’ážáž›áŸ‹ážŸáŸážœáž¶áž…áŸ’ážšáž€áž‘áž¼áž‘áž¶ážáŸ‹áž”áŸ’ážšáž¶áž€áŸ‹ (Payment Gateway)áŸ” áž€áž¶ážšáž…áž¼áž›ážšáž½áž˜áž‡áž¶áž˜áž½áž™ Broker áž¬ážœáŸáž‘áž·áž€áž¶áž—áž¶áž‚áž¸áž‘áž¸áž”áž¸ážŽáž¶áž˜áž½áž™ áž‚ážºáž‡áž¶áž€áž¶ážšážŸáŸ’áž˜áŸáž‚áŸ’ážšáž…áž·ážáŸ’áž áž“áž·áž„áž€áž¶ážšážŸáž˜áŸ’ážšáŸáž…áž…áž·ážáŸ’ážáž•áŸ’áž‘áž¶áž›áŸ‹ážáŸ’áž›áž½áž“ážšáž”ážŸáŸ‹ Trader áž˜áŸ’áž“áž¶áž€áŸ‹áŸ—áŸ” áž¢ážáž·ážáž·áž‡áž“áž¢áž¶áž…ážŸáž¶áž€ážŸáž½ážšáž–áŸážáŸŒáž˜áž¶áž“áž”áž“áŸ’ážáŸ‚áž˜áž”áž¶áž“ážáž¶áž˜áž€áž¶ážšážŸáŸ’áž“áž¾ážŸáž»áŸ†áŸ”',
      'faq.q6': 'ážáž¾ BlueX áž¢áž“áž»ážœážáŸ’ážážŸáŸ’ážšáž”ážáž¶áž˜áž”áž‘áž”áŸ’áž”áž‰áŸ’áž‰ážáŸ’ážáž·áž áž·ážšáž‰áŸ’áž‰ážœážáŸ’ážáž»áž€áž˜áŸ’áž–áž»áž‡áž¶ (SERC) áž™áŸ‰áž¶áž„ážŠáž¼áž…áž˜áŸ’ážáŸáž…?',
      'faq.a6': 'ážŠáž¾áž˜áŸ’áž”áž¸áž‚áŸ„ážšáž–ážáž¶áž˜áž”áž‘áž”áŸ’áž”áž‰áŸ’áž‰ážáŸ’ážáž·ážšáž”ážŸáŸ‹áž“áž·áž™áŸážáž€ážšáž˜áž¼áž›áž”ážáŸ’ážšáž€áž˜áŸ’áž–áž»áž‡áž¶ (SERC) áž“áž·áž„áž…áŸ’áž”áž¶áž”áŸ‹ážŸáŸ’ážáž¸áž–áž¸áž˜áž¼áž›áž”ážáŸ’ážšáž˜áž·áž“áž˜áŸ‚áž“ážšážŠáŸ’áž‹ ážšáž¶áž›áŸ‹áž˜áž¶ážáž·áž€áž¶ ážœáž‚áŸ’áž‚ážŸáž·áž€áŸ’ážŸáž¶ áž€áž¶ážšáž”áž„áŸ’ážšáŸ€áž“áž•áŸ’áž‘áž¶áž›áŸ‹ áž“áž·áž„áž€áž¶ážšážœáž·áž—áž¶áž‚áž‘áž¸áž•áŸ’ážŸáž¶ážšážŠáŸ‚áž›áž•áŸ’ážáž›áŸ‹ážŠáŸ„áž™ BlueX áž‚ážºážŸáž˜áŸ’ážšáž¶áž”áŸ‹áž‚áŸ„áž›áž”áŸ†ážŽáž„<strong>áž¢áž”áŸ‹ážšáŸ† áž“áž·áž„áž€áž¶ážšážœáž·áž—áž¶áž‚ áŸ¡áŸ áŸ %</strong>áŸ” BlueX áž˜áž·áž“áž€áŸ€ážšáž‚ážš áž‘áž‘áž½áž› áž¬áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž˜áž¼áž›áž“áž·áž’áž·ážŸáž¶áž’áž¶ážšážŽáŸˆáž¡áž¾áž™ áž áž¾áž™áž˜áž·áž“áž˜áŸ‚áž“áž‡áž¶ážˆáŸ’áž˜áž½áž‰áž€ážŽáŸ’ážáž¶áž›áž§áž”áž€ážšážŽáŸáž áž·ážšáž‰áŸ’áž‰ážœážáŸ’ážáž»ážŠáŸ‚áž›áž‚áŸ’áž˜áž¶áž“áž¢áž¶áž‡áŸ’áž‰áž¶áž”áŸážŽáŸ’ážŽáž“áŸ…áž€áž˜áŸ’áž–áž»áž‡áž¶áž¡áž¾áž™áŸ” ážšáž¶áž›áŸ‹ážŸáž€áž˜áŸ’áž˜áž—áž¶áž–áž‡áž½áž‰ážŠáž¼ážšáž‘áž¶áŸ†áž„áž¢ážŸáŸ‹áž‚ážºáž‡áž¶áž€áž¶ážšážŸáž˜áŸ’ážšáŸáž…áž…áž·ážáŸ’ážážŠáŸ„áž™ážáŸ’áž›áž½áž“áž¯áž„ážšáž”ážŸáŸ‹áž”áž»áž‚áŸ’áž‚áž›áž˜áŸ’áž“áž¶áž€áŸ‹áŸ—áŸ”',
      'faq.q7': 'ážáž¾ážáŸ’áž‰áž»áŸ†áž¢áž¶áž…áž…áž»áŸ‡ážˆáŸ’áž˜áŸ„áŸ‡áž…áž¼áž›ážšáŸ€áž“ áž¬áž‘áž¶áž€áŸ‹áž‘áž„ážŠáŸ„áž™ážšáž”áŸ€áž”ážŽáž¶?',
      'faq.a7': 'áž¢áŸ’áž“áž€áž¢áž¶áž…áž‘áž¶áž€áŸ‹áž‘áž„áž˜áž€áž€áž¶áž“áŸ‹ Telegram áž•áŸ’áž‘áž¶áž›áŸ‹ážšáž”ážŸáŸ‹ BlueX (<a href="https://t.me/Le_Bluue" target="_blank" rel="noopener noreferrer" style="color:var(--color-gold); font-weight:700;">@Le_Bluue</a>) áž¬áž…áž¼áž›ážšáž½áž˜áž€áŸ’áž“áž»áž„áž€áŸ’ážšáž»áž˜ Telegram ážŸáž áž‚áž˜áž“áŸáž•áŸ’áž›áž¼ážœáž€áž¶ážš (<a href="https://t.me/moonbluefx" target="_blank" rel="noopener noreferrer" style="color:var(--color-cyan); font-weight:700;">t.me/moonbluefx</a>) áž¬áž”áŸ†áž–áŸáž‰áž‘áž˜áŸ’ážšáž„áŸ‹ážŸáž¶áž€ážŸáž½ážšáž“áŸ…áž›áž¾áž‚áŸáž áž‘áŸ†áž–áŸážšáž“áŸáŸ‡áŸ” ážáŸ’áž‰áž»áŸ†áž“áž¹áž„áž•áŸ’ážáž›áŸ‹áž‡áž¼áž“áž“áž¼ážœáž–áŸážáŸŒáž˜áž¶áž“áž›áž˜áŸ’áž¢áž·áž áž“áž·áž„áž€áž¶áž›ážœáž·áž—áž¶áž‚áž‡áž¼áž“áž¢áŸ’áž“áž€áŸ”',

      // Connect
      'connect.heading': 'ážáž¶áž˜ážŠáž¶áž“ & áž‘áŸ†áž“áž¶áž€áŸ‹áž‘áŸ†áž“áž„áž‡áž¶áž˜áž½áž™ <span class="gold">BlueX</span>',
      'connect.desc': 'ážáž¶áž˜ážŠáž¶áž“áž”ážŽáŸ’ážáž¶áž‰ážŸáž„áŸ’áž‚áž˜áž•áŸ’áž›áž¼ážœáž€áž¶ážšážšáž”ážŸáŸ‹ážáŸ’áž‰áž»áŸ† ážŠáž¾áž˜áŸ’áž”áž¸áž‘áž‘áž½áž›áž”áž¶áž“áž€áž¶ážšážœáž·áž—áž¶áž‚áž‘áž¸áž•áŸ’ážŸáž¶ážšáž”áŸ’ážšáž…áž¶áŸ†ážáŸ’áž„áŸƒ áž…áž·ážáŸ’ážážœáž·áž‘áŸ’áž™áž¶áž‡áž½áž‰ážŠáž¼ážš áž€áž¶ážšáž”áŸ’ážšáž€áž¶ážŸážœáž‚áŸ’áž‚ážŸáž·áž€áŸ’ážŸáž¶ áž“áž·áž„áž€áž¶ážšáž¢áž¶áž”áŸ‹ážŠáŸážáž‘áž¸áž•áŸ’ážŸáž¶ážšáž•áŸ’áž‘áž¶áž›áŸ‹áŸ”',
      'connect.nameLabel': 'ážˆáŸ’áž˜áŸ„áŸ‡áž–áŸáž‰ážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€',
      'connect.emailLabel': 'áž¢áŸŠáž¸áž˜áŸ‚áž›ážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€',
      'connect.messageLabel': 'ážŸáž¶ážš / áž€áž¶ážšážŸáž¶áž€ážŸáž½ážšáž–áŸážáŸŒáž˜áž¶áž“ážœáž‚áŸ’áž‚ážŸáž·áž€áŸ’ážŸáž¶',
      'connect.btnSubmit': 'áž•áŸ’áž‰áž¾ážŸáž¶ážšážŸáž¶áž€ážŸáž½ážšáž•áŸ’áž‘áž¶áž›áŸ‹',

      // Compliance
      'compliance.flagBadge': 'áž€áŸ’ážšáž”ážáŸážŽáŸ’ážŒáž”áž‘áž”áŸ’áž”áž‰áŸ’áž‰ážáŸ’ážáž·áž€áž˜áŸ’áž–áž»áž‡áž¶',
      'compliance.title': 'ážŸáŸáž…áž€áŸ’ážáž¸ážáŸ’áž›áŸ‚áž„áž€áž¶ážšážŽáŸážŸáŸ’ážáž¸áž–áž¸áž¢áž“áž»áž›áŸ„áž˜áž—áž¶áž–áž…áŸ’áž”áž¶áž”áŸ‹ & áž”áž‘áž”áŸ’áž”áž‰áŸ’áž‰ážáŸ’ážáž·',
      'compliance.sercBadge': 'áž‚áŸ„áž›áž€áž¶ážšážŽáŸážŽáŸ‚áž“áž¶áŸ† SERC â€¢ áž…áŸ’áž”áž¶áž”áŸ‹ážŸáŸ’ážáž¸áž–áž¸áž˜áž¼áž›áž”ážáŸ’ážšáž˜áž·áž“áž˜áŸ‚áž“ážšážŠáŸ’áž‹',
      'compliance.item1Title': 'áž‚áŸ„áž›áž”áŸ†ážŽáž„áž¢áž”áŸ‹ážšáŸ† & áž€áž¶ážšážœáž·áž—áž¶áž‚ áŸ¡áŸ áŸ %',
      'compliance.item1Desc': 'ážšáž¶áž›áŸ‹ážœáž‚áŸ’áž‚ážŸáž·áž€áŸ’ážŸáž¶ áž€áž¶ážšáž”áž„áŸ’ážšáŸ€áž“áž•áŸ’áž‘áž¶áž›áŸ‹ áž“áž·áž„áž€áž¶ážšážœáž·áž—áž¶áž‚áž‘áž¸áž•áŸ’ážŸáž¶ážšáž“áŸ…áž›áž¾áž‚áŸáž áž‘áŸ†áž–áŸážšáž“áŸáŸ‡ áž‚ážºáž•áŸ’ážáž›áŸ‹áž‡áž¼áž“áž€áŸ’áž“áž»áž„áž‚áŸ„áž›áž”áŸ†ážŽáž„áž¢áž”áŸ‹ážšáŸ†ážáŸ‚áž”áŸ‰áž»ážŽáŸ’ážŽáŸ„áŸ‡áŸ” BlueX áž˜áž·áž“áž•áŸ’ážáž›áŸ‹ážŠáŸ†áž”áž¼áž“áŸ’áž˜áž¶áž“ážœáž·áž“áž·áž™áŸ„áž‚áž•áŸ’áž‘áž¶áž›áŸ‹ážáŸ’áž›áž½áž“ ážŸáŸážœáž¶áž”áŸ’ážšáž¹áž€áŸ’ážŸáž¶áž áž·ážšáž‰áŸ’áž‰ážœážáŸ’ážáž» áž¬áž•áŸ’ážáž›áŸ‹ážŸáž‰áŸ’áž‰áž¶áž‡áž½áž‰ážŠáž¼ážš (Signals) áž¡áž¾áž™áŸ”',
      'compliance.item2Title': 'áž˜áž·áž“áž˜áž¶áž“áž€áž¶ážšáž€áŸ€ážšáž‚ážšáž‘áž»áž“ áž¬áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž˜áž¼áž›áž“áž·áž’áž·ážŸáž¶áž’áž¶ážšážŽáŸˆáž¡áž¾áž™',
      'compliance.item2Desc': 'ážŠáž¾áž˜áŸ’áž”áž¸áž¢áž“áž»áž›áŸ„áž˜ážáž¶áž˜áž…áŸ’áž”áž¶áž”áŸ‹áž“áŸƒáž–áŸ’ážšáŸ‡ážšáž¶áž‡áž¶ážŽáž¶áž…áž€áŸ’ážšáž€áž˜áŸ’áž–áž»áž‡áž¶ BlueX áž˜áž·áž“áž€áŸ€ážšáž‚ážš áž”áŸ’ážšáž˜áž¼áž› áž‘áž‘áž½áž› áž¬áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž˜áž¼áž›áž“áž·áž’áž·ážšáž½áž˜ áž¬ážŠáž¾áž˜áž‘áž»áž“ážœáž·áž“áž·áž™áŸ„áž‚ážŸáž¶áž’áž¶ážšážŽáŸˆáž¡áž¾áž™áŸ” áž˜áž·áž“áž˜áž¶áž“áž€áž¶ážšáž•áŸ’ážáž›áŸ‹áž‡áž¼áž“áž“áž¼ážœáž‚ážŽáž“áž¸áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„ áž¬áž‚áž˜áŸ’ážšáŸ„áž„ážœáž·áž“áž·áž™áŸ„áž‚ážšáž½áž˜ (CIS) ážŠáž›áŸ‹ážœáž·áž“áž·áž™áŸ„áž‚áž·áž“áž‘áž¼áž‘áŸ…áž¡áž¾áž™áŸ”',
      'compliance.item3Title': 'áž‡áž¶áž¢áŸ’áž“áž€áž”ážŽáŸ’ážáž»áŸ‡áž”ážŽáŸ’ážáž¶áž›áž¯áž€ážšáž¶áž‡áŸ’áž™ áž˜áž·áž“áž˜áŸ‚áž“áž‡áž¶ážˆáŸ’áž˜áž½áž‰áž€ážŽáŸ’ážáž¶áž›áž‚áŸ’áž˜áž¶áž“áž¢áž¶áž‡áŸ’áž‰áž¶áž”áŸážŽáŸ’ážŽ',
      'compliance.item3Desc': 'BlueX ážŠáŸ†ážŽáž¾ážšáž€áž¶ážšáž‡áž¶áž‚áŸ’ážšáž¼áž”áž„áŸ’ážœáž¹áž€ áž“áž·áž„áž‡áž¶áž¢áŸ’áž“áž€áž¢áž”áŸ‹ážšáŸ†áž¯áž€ážšáž¶áž‡áŸ’áž™ áž˜áž·áž“áž˜áŸ‚áž“áž‡áž¶áž€áŸ’ážšáž»áž˜áž áŸŠáž»áž“áž˜áž¼áž›áž”ážáŸ’ážš áž¬ážˆáŸ’áž˜áž½áž‰áž€ážŽáŸ’ážáž¶áž›áž§áž”áž€ážšážŽáŸáž áž·ážšáž‰áŸ’áž‰ážœážáŸ’ážáž»ážŠáŸ‚áž›áž‚áŸ’áž˜áž¶áž“áž¢áž¶áž‡áŸ’áž‰áž¶áž”áŸážŽáŸ’ážŽáž“áŸ…áž€áž˜áŸ’áž–áž»áž‡áž¶áž¡áž¾áž™áŸ” áž€áž¶ážšáž›áž¾áž€áž¡áž¾áž„áž¢áŸ†áž–áž¸ SAGFX áž‚ážºáž€áŸ†ážŽážáŸ‹ážáŸ’ážšáž¹áž˜ážáŸ‚áž‡áž¶ážŠáŸƒáž‚áž¼ Affiliate áž“áž·áž„áž…áŸ’ážšáž€áž‘áž¼áž‘áž¶ážáŸ‹áž”áŸ’ážšáž¶áž€áŸ‹ážŸáŸ’ážšáŸáž…áž…áž·ážáŸ’ážážáŸ‚áž”áŸ‰áž»ážŽáŸ’ážŽáŸ„áŸ‡áŸ”',
      'compliance.item4Title': 'áž€áž¶ážšáž‡áž½áž‰ážŠáž¼ážšážŠáŸ„áž™ážáŸ’áž›áž½áž“áž¯áž„ & ážŸáŸáž…áž€áŸ’ážáž¸áž‡áž¼áž“ážŠáŸ†ážŽáž¹áž„áž¢áŸ†áž–áž¸áž áž¶áž“áž·áž—áŸáž™',
      'compliance.item4Desc': 'áž€áž¶ážšáž‡áž½áž‰ážŠáž¼ážšážšáž¼áž”áž·áž™áž”áŸážŽáŸ’ážŽáž”ážšáž‘áŸážŸ (Forex), CFD áž“áž·áž„áž§áž”áž€ážšážŽáŸáž áž·ážšáž‰áŸ’áž‰ážœážáŸ’ážáž»ážŠáŸážšáž¸ážœáŸáž‘áž¸ážœ áž˜áž¶áž“áž áž¶áž“áž·áž—áŸáž™ážáŸ’áž–ážŸáŸ‹áž“áŸƒáž€áž¶ážšážáž¶ážáž”áž„áŸ‹ážŠáž¾áž˜áž‘áž»áž“ áž áž¾áž™áž˜áž·áž“ážŸáŸáž€áŸ’ážáž·ážŸáž˜ážŸáž˜áŸ’ážšáž¶áž”áŸ‹áž˜áž“áž»ážŸáŸ’ážŸáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’áž“áž¶áž“áŸ„áŸ‡áž‘áŸáŸ” áž¢áŸ’áž“áž€áž…áž¼áž›ážšáž½áž˜áž‘áž¸áž•áŸ’ážŸáž¶ážšážáŸ’ážšáž¼ážœážáŸ‚ážŸáž˜áŸ’ážšáŸáž…áž…áž·ážáŸ’ážážŠáŸ„áž™ážáŸ’áž›áž½áž“áž¯áž„ áž“áž·áž„áž¢áž“áž»ážœážáŸ’ážáž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž áž¶áž“áž·áž—áŸáž™ážŸáŸ’ážšáž”ážáž¶áž˜áž›áž‘áŸ’áž’áž—áž¶áž–áž áž·ážšáž‰áŸ’áž‰ážœážáŸ’ážáž»áž•áŸ’áž‘áž¶áž›áŸ‹ážáŸ’áž›áž½áž“áŸ”',
      'compliance.exactDisclaimer': '<strong>ážŸáŸáž…áž€áŸ’ážáž¸áž”áŸ’ážšáž€áž¶ážŸáž”ážŠáž·ážŸáŸáž’áž‡áž¶áž•áŸ’áž›áž¼ážœáž€áž¶ážšáŸ–</strong> áž˜áž¶ážáž·áž€áž¶áž“áŸáŸ‡áž‚ážºážŸáž˜áŸ’ážšáž¶áž”áŸ‹áž‚áŸ„áž›áž”áŸ†ážŽáž„áž¢áž”áŸ‹ážšáŸ†ážáŸ‚áž”áŸ‰áž»ážŽáŸ’ážŽáŸ„áŸ‡ áž áž¾áž™áž˜áž·áž“áž˜áŸ‚áž“áž‡áž¶áž€áž¶ážšážŽáŸ‚áž“áž¶áŸ†áž•áŸ’áž“áŸ‚áž€áž áž·ážšáž‰áŸ’áž‰ážœážáŸ’ážáž» áž¬áž€áž¶ážšážœáž·áž“áž·áž™áŸ„áž‚áž¡áž¾áž™áŸ” áž€áž¶ážšáž‡áž½áž‰ážŠáž¼ážšáž€áŸ’áž“áž»áž„áž‘áž¸áž•áŸ’ážŸáž¶ážšáž áž·ážšáž‰áŸ’áž‰ážœážáŸ’ážáž»áž˜áž¶áž“áž áž¶áž“áž·áž—áŸáž™áŸ” ážŸáž¼áž˜ážŸáŸ’ážšáž¶ážœáž‡áŸ’ážšáž¶ážœážŠáŸ„áž™ážáŸ’áž›áž½áž“áž¯áž„ áž“áž·áž„áž‡áž½áž‰ážŠáž¼ážšáž”áŸ’ážšáž€áž”ážŠáŸ„áž™áž€áž¶ážšáž‘áž‘áž½áž›ážáž»ážŸážáŸ’ážšáž¼ážœáž‡áž¶áž“áž·áž…áŸ’áž…áŸ”',

      // SMC Genesis Institutional Portal
      'genesis.badge': 'SMC GENESIS â€¢ BEYOND THE CHARTS',
      'genesis.heroTitle': 'SMC GENESIS â€¢ BEYOND THE CHARTS<br><span class="highlight">ážŸáŸ’ážáž¶áž”ážáŸ’áž™áž€áž˜áŸ’áž˜áž‡áž½áž‰ážŠáž¼ážšáž€áž˜áŸ’ážšáž·ážážŸáŸ’ážáž¶áž”áŸáž“ & ážáŸ’áž“áž¶áž€áŸ‹áž”áž„áŸ’ážšáŸ€áž“áž•áŸ’áž›áž¼ážœáž€áž¶ážšáŸ”</span>',
      'genesis.heroSub': 'áž€áž¶ážšážšáž½áž˜áž”áž‰áŸ’áž…áž¼áž›áž‚áŸ’áž“áž¶áž“áŸƒáž‘áŸ’ážšáž¹ážŸáŸ’ážáž¸áž‚áŸ’ážšáž¹áŸ‡ Smart Money Concepts 2.0 & 3.0 ážšáŸ€áž”áž…áŸ†áž¡áž¾áž„ážŸáž˜áŸ’ážšáž¶áž”áŸ‹áž˜áž¶ážŸ (XAU/USD) áž“áž·áž„áž‘áž¸áž•áŸ’ážŸáž¶ážšáž áž·ážšáž‰áŸ’áž‰ážœážáŸ’ážáž»áž…áž˜áŸ’áž”áž„áŸ” SMC Genesis áž›áž»áž”áž”áŸ†áž”áž¶ážáŸ‹áž€áž¶ážšážŸáŸ’áž˜áž¶áž“ážáž¶áž˜ Indicator áž‡áŸ†áž“áž½ážŸážŠáŸ„áž™áž”áŸ’ážšáž–áŸáž“áŸ’áž’áž˜áŸážšáŸ€áž“ Quantitative áž‘áž¶áŸ†áž„ áŸ¡áŸ  áž˜áŸ‰áž¼ážŒáž»áž›áž…áŸ’áž”áž¶ážŸáŸ‹áž›áž¶ážŸáŸ‹ â€” áž”áž„áŸ’ážšáŸ€áž“áž¢áŸ’áž“áž€áž–áž¸ážšáž”áŸ€áž”ážŸáŸ’ážáž¶áž”áŸáž“ážšáŸ€áž”áž…áŸ† Liquidity, áž€áž¶ážšáž•áŸ’áž‘áŸážšáž‘áž·áž“áŸ’áž“áž“áŸáž™áž–áž áž»áž€áž¶áž›ážœáŸáž›áž¶ áž“áž·áž„áž€áž¶ážšáž…áž¼áž› Trade áž‡áž¶áž˜áž½áž™áž áž¶áž“áž·áž—áŸáž™áž‘áž¶áž”áž”áŸ†áž•áž»ážáŸ”',
      'genesis.metric1Val': 'áŸ¡áŸ  áž˜áŸ‰áž¼ážŒáž»áž›',
      'genesis.metric1Label': 'áž€áž˜áŸ’áž˜ážœáž·áž’áž¸ážŸáž·áž€áŸ’ážŸáž¶ Quantitative áž–áŸáž‰áž›áŸáž‰',
      'genesis.metric2Val': 'áž‚áŸ’áž˜áž¶áž“ Indicator',
      'genesis.metric2Label': 'áž•áŸ’áž¢áŸ‚áž€áž›áž¾ Structure, S&D & Liquidity',
      'genesis.metric3Val': '0.5% â€“ 1.0%',
      'genesis.metric3Label': 'áž€áž˜áŸ’ážšáž·ážáž áž¶áž“áž·áž—áŸáž™ážŠáž¾áž˜áž‘áž»áž“áž€áŸ’áž“áž»áž„áž˜áž½áž™ Trade',
      'genesis.metric4Val': '1:3 ážŠáž›áŸ‹ 1:10+',
      'genesis.metric4Label': 'ážŸáž˜áž¶áž˜áž¶ážáŸ’ážšáž áž¶áž“áž·áž—áŸáž™áž’áŸ€áž”áž•áž›áž…áŸ†ážŽáŸáž‰ (R:R)',
      'genesis.heroApplyBtn': 'âš¡ áž…áž»áŸ‡ážˆáŸ’áž˜áŸ„áŸ‡áž…áž¼áž›ážšáŸ€áž“ â€¢ DM @Le_Bluue',
      'genesis.heroCurriculumBtn': 'áž–áž·áž“áž·ážáŸ’áž™áž˜áž¾áž›áž˜áŸážšáŸ€áž“áž‘áž¶áŸ†áž„ áŸ¡áŸ  áž˜áŸ‰áž¼ážŒáž»áž› â†“',
      'genesis.heroCommunityBtn': 'ðŸ‘¥ áž…áž¼áž›ážšáž½áž˜ Community Telegram (t.me/moonbluefx)',
      'genesis.heroBrokerBtn': 'áž‡áž½áž‰ážŠáž¼ážšáž›áž¾ Raw Spreads áž›áŸ’áž”áž¿áž“áž›áž¿áž“ â†’',
      'genesis.tenet1Title': 'áž•áŸ’áž“ážáŸ‹áž‚áŸ†áž“áž·áž (MINDSET)',
      'genesis.tenet1Desc': 'áž€áž¶ážšáž‚áž·ážážáž¶áž˜áž”áŸ’ážšáž¼áž”áž¶áž”áŸŠáž¸áž›áž¸ážáŸ áž‚áŸ’áž˜áž¶áž“áž¢áž¶ážšáž˜áŸ’áž˜ážŽáŸáž›áž˜áŸ’áž¢áŸ€áž„ áž“áž·áž„áž‘áž‘áž½áž›ážŸáŸ’áž‚áž¶áž›áŸ‹áž€áž¶ážšážáž¶ážáž”áž„áŸ‹ážŠáŸ‚áž›áž”áž¶áž“áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„',
      'genesis.tenet2Title': 'ážœáž·áž“áŸáž™áž…áŸ’áž”áž¶áž”áŸ‹ (RULES)',
      'genesis.tenet2Desc': 'áž‚áŸ„ážšáž–áž…áŸ’áž”áž¶áž”áŸ‹ Checklists 100% â€” áž‚áŸ’áž˜áž¶áž“ Confirmation áž‚ážºáž˜áž·áž“áž…áž»áž… Order ážŠáž¶áž…áŸ‹ážáž¶áž',
      'genesis.tenet3Title': 'ážŸáŸ’ážáž·ážšáž—áž¶áž– (CONSISTENT)',
      'genesis.tenet3Desc': 'ážŸáŸ’ážáž·ážšáž—áž¶áž–áž™áž¼ážšáž¢áž„áŸ’ážœáŸ‚áž„ážŠáŸ‚áž› áž…áŸ†ážŽáŸáž‰ = áž…áŸ†ážŽáŸáŸ‡ + áž‡áŸ†áž“áž¶áž‰áž¢áž“áž»ážœážáŸ’ážážŠážŠáŸ‚áž›áŸ—',
      'genesis.specAssetLabel': 'áž‘áŸ’ážšáž–áŸ’áž™ážŸáž€áž˜áŸ’áž˜áž…áž˜áŸ’áž”áž„',
      'genesis.specAssetVal': 'XAU/USD (áž˜áž¶ážŸ) & ážšáž¼áž”áž·áž™áž”áŸážŽáŸ’ážŽážŸáŸ†ážáž¶áž“áŸ‹áŸ—',
      'genesis.specStructLabel': 'áž…áŸ’áž”áž¶áž”áŸ‹ážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’',
      'genesis.specStructVal': 'áž€áž¶ážšáž”áž·áž‘áž‘áŸ’ážšáž„áŸ‹áž‘áŸ’ážšáž¶áž™áž‘áŸ€áž“áž–áŸáž‰ (Body Close)',
      'genesis.specBaseLabel': 'áž‘áž˜áŸ’ážšáž„áŸ‹áž˜áž¼áž›ážŠáŸ’áž‹áž¶áž“ (S&D)',
      'genesis.specBaseVal': 'RBD â€¢ DBR â€¢ RBR â€¢ DBD',
      'genesis.specMtfLabel': 'áž›áŸ†áž áž¼ážšáž–áŸáž›ážœáŸáž›áž¶ (Multi-TF)',
      'genesis.specMtfVal': '4H áž“áž·áž“áŸ’áž“áž¶áž€áž¶ážšáž’áŸ† â†’ 15M ážáŸ†áž”áž“áŸ‹ S&D â†’ 1M/3M áž…áž¼áž›áž•áŸ’ážŸáž¶ážš',
      'genesis.specRiskLabel': 'áž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„ážŠáž¾áž˜áž‘áž»áž“',
      'genesis.specRiskVal': 'áž áž¶áž“áž·áž—áŸáž™ 0.5% â€“ 1.0% â€¢ áž¢áž”áŸ’áž”áž”ážšáž˜áž¶ 1:3 RR',
      'genesis.introTag': 'ážŸáŸáž…áž€áŸ’ážáž¸ážŸáž„áŸ’ážáŸáž”ážŸáŸ’ážáž¶áž”áŸáž“ â€¢ BEYOND THE CHARTS',
      'genesis.introTitle': 'áž”áŸ’ážšáž–áŸáž“áŸ’áž’áž”áŸ’ážšážáž·áž”ážáŸ’ážáž·áž€áž¶ážš Quantitative ážŸáž˜áŸ’ážšáž¶áž”áŸ‹áž€áž¶ážšáž‡áž½áž‰ážŠáž¼ážšáž€áž˜áŸ’ážšáž·ážážŸáŸ’ážáž¶áž”áŸáž“',
      'genesis.introP1': 'áž‘áž¸áž•áŸ’ážŸáž¶ážšáž áž·ážšáž‰áŸ’áž‰ážœážáŸ’ážáž»áž˜áž·áž“áž˜áŸ‚áž“ážŠáž¾ážšážáž¶áž˜áž—áž¶áž–áž…áŸƒážŠáž“áŸ’áž™ áž¬áž‘áž˜áŸ’ážšáž„áŸ‹áž€áŸ’ážšáž¶áž”ážšáž”ážŸáŸ‹ Retail áž¡áž¾áž™áŸ” ážšáž¶áž›áŸ‹áž€áž¶ážšážšáž»áž‰ážáž˜áŸ’áž›áŸƒáž’áŸ†áŸ—ážŸáž»áž‘áŸ’áž’ážáŸ‚ážáŸ’ážšáž¼ážœáž”áž¶áž“áž‡áŸ†ážšáž»áž‰ážŠáŸ„áž™áž€áž¶ážšážšáŸ€áž”áž…áŸ† Liquidity ážšáž”ážŸáŸ‹ážŸáŸ’ážáž¶áž”áŸáž“ ážáž¶áž˜ážšáž™áŸˆáž€áž¶ážšážŸáŸ’ážšáž¼áž”áž™áž€ Stop Loss ážšáž”ážŸáŸ‹ Trader ážšáž¶áž™áŸ”',
      'genesis.introP2': 'SMC Genesis áž‚ážºáž‡áž¶áž€áž˜áŸ’áž˜ážœáž·áž’áž¸ážŸáž·áž€áŸ’ážŸáž¶áž•áŸ’áž›áž¼ážœáž€áž¶ážšáž•áŸ’ážáž¶áž…áŸ‹áž˜áž»ážážšáž”ážŸáŸ‹ BlueX AcademyáŸ” ážœáž¶áž”áž¶áž“áž…áŸ’ážšáž”áž¶áž…áŸ‹áž”áž‰áŸ’áž…áž¼áž›áž‘áŸ’ážšáž¹ážŸáŸ’ážáž¸ Smart Money Concepts áž‘áŸ…áž‡áž¶áž€áŸ’áž”áž½áž“áž”áŸ’ážšážáž·áž”ážáŸ’ážáž·áž€áž¶ážšáž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„áž€áž˜áŸ’ážšáž·ážážŸáŸ’ážáž¶áž”áŸáž“ â€” áž“áž¶áŸ†áž¢áŸ’áž“áž€ážŸáž·áž€áŸ’ážŸáž¶áž–áž¸áž€áž¶ážšáž‚áž¼ážŸážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’ážšáž áž¼ážážŠáž›áŸ‹áž…áŸ†ážŽáž»áž…áž…áž¼áž› Trade ážŠáŸáž˜áž»ážážŸáŸ’ážšáž½áž…áž›áž¾ Timeframe ážáž¼áž… ážŠáŸ„áž™áž˜áž·áž“áž–áž¹áž„áž•áŸ’áž¢áŸ‚áž€áž›áž¾ Indicator áž™ážºážáž™áŸ‰áž¶ážœáž¡áž¾áž™áŸ”',
      'genesis.charter1': '<strong>áž€áž¶ážšáž”áŸ’ážšáž˜áž¼áž›áž‘áž·áž“áŸ’áž“áž“áŸáž™ & áž€áž·áž…áŸ’áž…áž€áž¶ážšáž•áŸ’áž‘áŸ‡:</strong> áž‘áŸ’ážšáž¹ážŸáŸ’ážáž¸ážáŸ‚áž˜áž½áž™áž˜áž»ážáž˜áž·áž“áž¢áž¶áž…áž”áž„áŸ’áž€áž¾ážáž‡áŸ†áž“áž¶áž‰áž”áž¶áž“áž¡áž¾áž™áŸ” áž—áž¶áž–ážŸáŸ’áž‘áž¶ážáŸ‹áž‡áŸ†áž“áž¶áž‰áž‘áž¶áž˜áž‘áž¶ážšáž€áž¶ážš Backtest, Forward-test áž“áž·áž„áž€ážáŸ‹ážáŸ’ážšáž¶ Chart áž™áŸ‰áž¶áž„ážáŸ’áž‡áž¶áž”áŸ‹ážáŸ’áž‡áž½áž“áŸ”',
      'genesis.charter2': '<strong>áž€áž¶ážšáž•áŸ’áž‘áŸ€áž„áž•áŸ’áž‘áž¶ážáŸ‹áž…áŸ’áž”áž¶áž”áŸ‹áž…áŸ’áž”áž¶ážŸáŸ‹áž›áž¶ážŸáŸ‹:</strong> ážšáž¶áž›áŸ‹áž€áž¶ážšáž”áŸ†áž”áŸ‚áž€ážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’ (BOS), ážšáž›áž€áž‘áž¶áž‰ážáž™ (IBOS), áž€áž¶ážšáž”áŸ’ážáž¼ážšáž‘áž·ážŸ Fractal (FTS), áž“áž·áž„ Sweep ážŸáž»áž‘áŸ’áž’ážáŸ‚áž˜áž¶áž“áž›áž€áŸ’ážážážŽáŸ’ážŒáž˜áŸáž€áž¶áž“áž·áž…ážŸáž»áž€áŸ’ážšáž¹ážáŸ”',
      'genesis.charter3': '<strong>áž€áž¶ážšáž€áž¶ážšáž–áž¶ážšáž€áž˜áŸ’áž˜ážŸáž·áž‘áŸ’áž’áž·áž”áž‰áŸ’áž‰áž¶:</strong> áž‚áŸ†áž“áž¼ážšáž”áŸ’áž›áž„áŸ‹áž˜áŸážšáŸ€áž“áž–áŸáž‰áž›áŸáž‰, áž”áž‰áŸ’áž‡áž¸ážáŸ’ážšáž½ážáž–áž·áž“áž·ážáŸ’áž™ Entry, áž“áž·áž„áž€áž¶ážšáž áŸ’ážœáž¹áž€áž áž¶ážáŸ‹áž›áž¾ Chart áž•áŸ’áž‘áž¶áž›áŸ‹ ážáŸ’ážšáž¼ážœáž”áž¶áž“ážšáž€áŸ’ážŸáž¶áž‘áž»áž€ážŸáž˜áŸ’ážšáž¶áž”áŸ‹ážáŸ‚ážŸáž·ážŸáŸ’ážŸáž•áŸ’áž›áž¼ážœáž€áž¶ážšážšáž”ážŸáŸ‹ SMC Genesis áž”áŸ‰áž»ážŽáŸ’ážŽáŸ„áŸ‡áŸ”',
      'genesis.wisdom1Tag': 'áž‘ážŸáŸ’ážŸáž“ážœáž·áž‡áŸ’áž‡áž¶ážŸáŸ’ážáž¶áž”áŸáž“',
      'genesis.wisdom2Tag': 'ážœáž·áž“áŸáž™ážˆáŸ’áž“áŸ‡áž›áž¾áž¢áž¶ážšáž˜áŸ’áž˜ážŽáŸ',
      'genesis.creedText': 'SMC GENESIS: áž’áŸ’ážœáž¾áž‚ážºážŠáž¾áž˜áŸ’áž”áž¸áž‘áž¶áŸ†áž„áž¢ážŸáŸ‹áž‚áŸ’áž“áž¶ áž‘áž¶áŸ†áž„áž¢ážŸáŸ‹áž‚áŸ’áž“áž¶áž‚ážºáž’áŸ’ážœáž¾ážŠáž¾áž˜áŸ’áž”áž¸ážáŸ’áž›áž½áž“áž¯áž„!',
      'genesis.creedSub': 'áž€ážŸáž¶áž„áž¡áž¾áž„ážŸáž˜áŸ’ážšáž¶áž”áŸ‹áž‘áž¶áŸ†áž„áž¢ážŸáŸ‹áž‚áŸ’áž“áž¶ â€¢ ážŸáž˜áŸ’ážšáŸáž…áž”áž¶áž“ážŠáŸ„áž™ážœáž·áž“áŸáž™áž•áŸ’áž‘áž¶áž›áŸ‹ážáŸ’áž›áž½áž“',
      'genesis.shiftBadge': 'áž€áž¶ážšáž•áŸ’áž›áž¶ážŸáŸ‹áž”áŸ’ážáž¼ážšáž•áŸ’áž“ážáŸ‹áž‚áŸ†áž“áž·áž â€¢ ážŸáŸ’ážáž¶áž”áŸáž“áž’áŸ† vs Retail',
      'genesis.shiftTitle': 'áž áŸážáž»áž¢áŸ’ážœáž¸ Trader ážšáž¶áž™ 95% áž‚áŸ’ážšáž¶áž“áŸ‹ážáŸ‚áž‡áž¶ Liquidity áž±áŸ’áž™áž‘áž¸áž•áŸ’ážŸáž¶ážš?',
      'genesis.shiftDesc': 'áž€áž¶ážšážœáž·áž—áž¶áž‚áž”áž…áŸ’áž…áŸáž€áž‘áŸážŸáž”áŸ‚áž” Retail áž”áž„áŸ’ážšáŸ€áž“áž±áŸ’áž™ Trader ážŠáž¶áž€áŸ‹ Stop Loss áž“áŸ…áž…áŸ†áž€áž“áŸ’áž›áŸ‚áž„ážŠáŸ‚áž›ážŸáŸ’ážáž¶áž”áŸáž“áž’áŸ†áŸ—ážáŸ’ážšáž¼ážœáž€áž¶ážšáž”áŸ†áž–áŸáž‰ Order ážŠáŸáž…áŸ’ážšáž¾áž“ážŸáž“áŸ’áž’áž¹áž€ážŸáž“áŸ’áž’áž¶áž”áŸ‹áŸ” SMC Genesis áž”áž„áŸ’ážšáŸ€áž“áž¢áŸ’áž“áž€áž±áŸ’áž™ážŸáŸ’áž‚áž¶áž›áŸ‹áž¢áž“áŸ’áž‘áž¶áž€áŸ‹áž‘áž¶áŸ†áž„áž“áŸáŸ‡ áž“áž·áž„áž…áž¼áž›ážšáž½áž˜áž‡áž½áž‰ážŠáž¼ážšážŸáŸ’ážšáž”ážáž¶áž˜áž›áŸ†áž áž¼ážšážŸáŸ’ážáž¶áž”áŸáž“áŸ”',
      'genesis.retailColTitle': 'áž—áž¶áž–áž”ážšáž¶áž‡áŸáž™áž“áŸƒáž€áž¶ážšáž”áŸ’ážšáž¾ Indicator',
      'genesis.instColTitle': 'áž§ážáŸ’ážáž˜áž—áž¶áž–áž“áŸƒáž”áŸ’ážšáž–áŸáž“áŸ’áž’ážŸáŸ’ážáž¶áž”áŸáž“ SMC Genesis',
      'genesis.shiftR1': 'áž‡áž½áž‰ážŠáž¼ážšážáž¶áž˜ážŸáž¼áž…áž“áž¶áž€ážšáž™ážºážáž™áŸ‰áž¶ážœ (RSI, MACD, Stochastics) ážŠáŸ‚áž›áž”áž„áŸ’áž áž¶áž‰áž€áŸ’ážšáŸ„áž™áž–áŸáž›ážáž˜áŸ’áž›áŸƒážšážáŸ‹ážšáž½áž…áŸ”',
      'genesis.shiftI1': 'ážœáž·áž—áž¶áž‚áž€áž¶ážšáž”áŸ„ážŸážŸáž˜áŸ’áž¢áž¶áž Liquidity áž“áž·áž„áž‘áž˜áŸ’ážšáž„áŸ‹áž”áž„áŸ’áž€áž¾ážážáŸ†áž”áž“áŸ‹ Supply & Demand ážŸáŸ’ážáž¶áž”áŸáž“áž–áž·ážáž”áŸ’ážšáž¶áž€ážŠáŸ”',
      'genesis.shiftR2': 'áž‘áž·áž‰ážáž¶áž˜ Breakout áž›áž¾ Resistance áž€áŸ’áž›áž¶áž™áž‡áž¶ Liquidity áž±áŸ’áž™áž€áž¶ážš Sell ážšáž”ážŸáŸ‹ážŸáŸ’ážáž¶áž”áŸáž“áž—áŸ’áž›áž¶áž˜áŸ—áŸ”',
      'genesis.shiftI2': 'ážšáž„áŸ‹áž…áž¶áŸ†áž€áž¶ážšáž”áŸ„ážŸážŸáž˜áŸ’áž¢áž¶áž Buy-Side Liquidity (BSL) áž“áž·áž„áž…áž¼áž› Trade áž–áŸáž›ážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’áž”áž‰áŸ’áž‡áž¶áž€áŸ‹áž‘áž·ážŸážŠáŸ…áŸ”',
      'genesis.shiftR3': 'ážŸáž˜áž¶áž˜áž¶ážáŸ’ážš R:R áž‘áž¶áž”ážáŸ’ážšáž¹áž˜ 1:1 áž¬ 1:1.5 ážŠáŸ‚áž›áž‘áž¶áž˜áž‘áž¶ážš Win Rate ážáŸ’áž–ážŸáŸ‹áž–áŸáž€ážŠáž¾áž˜áŸ’áž”áž¸ážšážŸáŸ‹áŸ”',
      'genesis.shiftI3': 'ážŸáž˜áž¶áž˜áž¶ážáŸ’ážš Asymmetric 1:3+ ážŠáž›áŸ‹ 1:5+ ážŠáŸ‚áž› Win Rate ážáŸ’ážšáž¹áž˜ 40% áž€áŸáž”áž„áŸ’áž€áž¾ážáž”áŸ’ážšáž¶áž€áŸ‹áž…áŸ†ážŽáŸáž‰áž“áž·ážšáž“áŸ’ážážšáž—áž¶áž–áž”áž¶áž“áŸ”',
      'genesis.shiftR4': 'áž‡áž½áž‰ážŠáž¼ážšážáž¶áž˜áž¢áž¶ážšáž˜áŸ’áž˜ážŽáŸážáž¹áž„ážáŸ’áž“áž¶áž‰áŸ‹ áž–áž„áŸ’ážšáž¸áž€ Stop Loss áž“áž·áž„ážŸáŸ’áž˜áž¶áž“áž€áŸ†áž–áž¼áž›áž”áž¶ážážŠáŸ„áž™áž‚áŸ’áž˜áž¶áž“áž˜áž¼áž›ážŠáŸ’áž‹áž¶áž“áŸ”',
      'genesis.shiftI4': 'áž…áŸ†ážŽáž»áž…áž€áŸ†ážŽážáŸ‹ážáž»ážŸáž…áŸ’áž”áž¶ážŸáŸ‹áž›áž¶ážŸáŸ‹ áž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž‘áž»áž“áž‡áž¶áž˜áž»áž“ áž“áž·áž„áž˜áž¶áž“áž›áŸ†ážŠáž¶áž”áŸ‹áž›áŸ†ážŠáŸ„áž™áž€áŸ’áž“áž»áž„áž€áž¶ážšáž¢áž“áž»ážœážáŸ’ážáŸ”',
      'genesis.matrixBadge': 'áž€áž¶ážšážáž˜áŸ’ážšáž¹áž˜áž–áž áž»áž€áž¶áž›ážœáŸáž›áž¶',
      'genesis.matrixTitle': 'áž˜áŸ‰áž¶áž‘áŸ’ážšáž¸ážŸáž”áŸ’ážšážáž·áž”ážáŸ’ážáž·áž€áž¶ážš: áž–áž¸ HTF áž’áŸ†ážšáž áž¼ážážŠáž›áŸ‹ LTF ážáž¼áž…',
      'genesis.matrixSub': 'ážšáž”áŸ€áž”ážŠáŸ‚áž›áž‘áž»áž“ážŸáŸ’ážáž¶áž”áŸáž“áž•áŸ’áž‘áŸážšáž‘áž·áž“áŸ’áž“áž“áŸáž™áž†áŸ’áž›áž„áž€áž¶ážáŸ‹ Timeframe ážŠáž¾áž˜áŸ’áž”áž¸áž›áž»áž”áž”áŸ†áž”áž¶ážáŸ‹áž—áž¶áž–ážšáž‰áŸ‰áŸážšáž‰áŸ‰áŸƒ áž“áž·áž„áž…áž˜áŸ’ážšáž¶áž‰áŸ‹áž™áž€ Setup áž‚áž»ážŽáž—áž¶áž–ážáŸ’áž–ážŸáŸ‹áŸ”',
      'genesis.matrixHtfTier': 'HTF (H4 / D1)',
      'genesis.matrixHtfRole': 'áž‘áž·ážŸážŠáŸ…áž˜áŸ‰áž¶áž€áŸ’ážšáž¼ & BOS ážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’áž’áŸ†',
      'genesis.matrixHtfDesc': 'áž€áŸ†ážŽážáŸ‹áž‘áž·ážŸážŠáŸ…ážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’áž’áŸ†ážšáž”ážŸáŸ‹ážŸáŸ’ážáž¶áž”áŸáž“ áž“áž·áž„ážŸáž˜áŸ’áž‚áž¶áž›áŸ‹ážáŸ†áž”áž“áŸ‹ Extreme ážŸáŸ†ážáž¶áž“áŸ‹áŸ—áŸ”',
      'genesis.matrixMtfTier': 'MTF (M15 / H1)',
      'genesis.matrixMtfRole': 'ážáŸ†áž”áž“áŸ‹ S&D & áž…áž›áž“áž¶áž‘áž¶áž‰ážáž™ IBOS',
      'genesis.matrixMtfDesc': 'ážŸáŸ’ážšáž„áŸ‹ážáŸ†áž”áž“áŸ‹ážŸáŸ’áž“áž¶áž˜áž‡áž¾áž„ážŸáŸ’ážáž¶áž”áŸáž“ áž“áž·áž„áž…áŸ’ážšáŸ„áŸ‡áž™áž€ážšáž›áž€áž‘áž¶áž‰ážáž™ážáž¶áž„áž€áŸ’áž“áž»áž„ ážŠáž¾áž˜áŸ’áž”áž¸ážŸáŸ’ážœáŸ‚áž„ážšáž€áž…áŸ†ážŽáž»áž…ážáŸ’ážšáž¡áž”áŸ‹áž‘áž·ážŸáž–áž·ážáŸ”',
      'genesis.matrixLtfTier': 'LTF (M1 / M3)',
      'genesis.matrixLtfRole': 'áž…áŸ†ážŽáž»áž…áž€áŸáŸ‡áž…áž¼áž› Order & SL ážáž¼áž… (RR â‰¥ 1:3)',
      'genesis.matrixLtfDesc': 'áž”áž‰áŸ’áž‡áž¶áž€áŸ‹áž€áž¶ážšáž”áŸ’ážáž¼ážšážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’ Fractal ážáž¼áž… áž•áŸ’ážáž›áŸ‹áž€áž¶ážšáž…áž¼áž› Trade áž”áŸ‚áž”ážœáŸ‡áž€áž¶ážáŸ‹ áž áž¶áž“áž·áž—áŸáž™áž‘áž¶áž”áž”áŸ†áž•áž»áž áž•áž›áž…áŸ†ážŽáŸáž‰ážáŸ’áž–ážŸáŸ‹áŸ”',
      'genesis.curriculumBadge': 'áž”áŸ’ážšáž’áž¶áž“áž”áž‘áž˜áŸážšáŸ€áž“ážŸáŸ’ážáž¶áž”áŸáž“',
      'genesis.curriculumTitle': 'áž¢áŸ’ážœáž¸ážŠáŸ‚áž›áž™áž¾áž„áž”áž„áŸ’ážšáŸ€áž“: áž€áž˜áŸ’áž˜ážœáž·áž’áž¸ážŸáž·áž€áŸ’ážŸáž¶áž•áŸ’áž›áž¼ážœáž€áž¶ážš & ážŸážŸážšážŸáŸ’ážáž˜áŸ’áž—áž‚áŸ’ážšáž¹áŸ‡',
      'genesis.curriculumSub': 'áž€áž¶ážšážŽáŸ‚áž“áž¶áŸ†áž›áž˜áŸ’áž¢áž·ážáž¢áŸ†áž–áž¸áž”áŸ’ážšáž’áž¶áž“áž”áž‘áž‚áŸ’ážšáž¹áŸ‡ážŠáŸ‚áž›ážáŸ’ážšáž¼ážœáž”áž¶áž“áž”áž„áŸ’ážšáŸ€áž“áž€áŸ’áž“áž»áž„ SMC GenesisáŸ” ážšáŸ€áž”áž…áŸ†áž¡áž¾áž„ážŠáž¾áž˜áŸ’áž”áž¸áž”áŸ†áž–áž¶áž€áŸ‹áž”áŸ†áž”áŸ‰áž“ Trader áž±áŸ’áž™áž™áž›áŸ‹ážŠáž¹áž„áž–áž¸áž€áŸ’áž”áž½áž“áž…áŸ’áž”áž¶áž”áŸ‹ážŸáŸ’ážáž¶áž”áŸáž“áž–áž·ážáž”áŸ’ážšáž¶áž€ážŠáŸ”',
      'genesis.m1Num': 'áž˜áŸ‰áž¼ážŒáž»áž› áŸ áŸ¡',
      'genesis.m1Title': 'áž•áŸ’áž“ážáŸ‹áž‚áŸ†áž“áž·ážážŸáŸ’ážáž¶áž”áŸáž“ & áž€áž¶ážšážšáŸ€áž”áž…áŸ† TradingView',
      'genesis.m1Desc': 'áž‘ážŸáŸ’ážŸáž“ážœáž·áž‡áŸ’áž‡áž¶áž‡áž½áž‰ážŠáž¼ážšáž‚áŸ’ážšáž¹áŸ‡: áž€áž¶ážšáž‚áž·ážážáž¶áž˜áž”áŸ’ážšáž¼áž”áž¶áž”áŸŠáž¸áž›áž¸ážáŸ áž‚áŸ’áž˜áž¶áž“áž¢áž¶ážšáž˜áŸ’áž˜ážŽáŸáž›áž˜áŸ’áž¢áŸ€áž„ áž“áž·áž„ážœáž·áž“áŸáž™ Checklist áŸ¡áŸ áŸ %áŸ” áž€áž¶ážšáž€áŸ†ážŽážáŸ‹ Trendline áž“áž·áž„ážáŸ†áž”áž“áŸ‹ Zone áž›áž¾ TradingView SetupáŸ”',
      'genesis.m2Num': 'áž˜áŸ‰áž¼ážŒáž»áž› áŸ áŸ¢',
      'genesis.m2Title': 'áž‚áŸ’ážšáž¹áŸ‡ážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’áž‘áž¸áž•áŸ’ážŸáž¶ážš (BOS, IBOS, FTS)',
      'genesis.m2Desc': 'ážŸáŸ’ážáž¶áž”ážáŸ’áž™áž€áž˜áŸ’áž˜áž“áŸƒáž‘áž¸áž•áŸ’ážŸáž¶ážšáž áž·ážšáž‰áŸ’áž‰ážœážáŸ’ážáž»: áž€áž¶ážšáž”áŸ‚áž„áž…áŸ‚áž€ážŠáž¶áž…áŸ‹ážšážœáž¶áž„áž€áž¶ážšáž”áž“áŸ’ážáž‘áž·ážŸážŠáŸ…áž’áŸ† (BOS), ážšáž›áž€áž‘áž¶áž‰ážáž™ážáž¶áž„áž€áŸ’áž“áž»áž„ (IBOS), áž“áž·áž„áž€áž¶ážšáž”áŸ’ážáž¼ážšážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’ážáž¼áž… (FTS) ážŠáŸ„áž™áž‚áŸ’áž˜áž¶áž“ IndicatoráŸ”',
      'genesis.m3Num': 'áž˜áŸ‰áž¼ážŒáž»áž› áŸ áŸ£',
      'genesis.m3Title': 'áž‘áŸ†áž“áž¶áž€áŸ‹áž‘áŸ†áž“áž„áž–áž áž»áž–áŸáž›ážœáŸáž›áž¶ & áž€áž¶ážšáž•áŸ’áž‘áŸážšáž‘áž·áž“áŸ’áž“áž“áŸáž™ (Data Transfer)',
      'genesis.m3Desc': 'áž™áž›áŸ‹ážŠáž¹áž„áž–áž¸áž™áž“áŸ’ážáž€áž¶ážš Data Transfer: ážšáž”áŸ€áž”ážŠáŸ‚áž›ážšáž›áž€áž‘áž¶áž‰ážáž™áž›áž¾ HTF áž’áŸ† áž”áž„áŸ’áž€áž¾ážáž‡áž¶ážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’áž›áž¾ MTF áž€ážŽáŸ’ážáž¶áž› áž“áž·áž„áž€áž“áŸ’áž›áŸ‚áž„ážŠáŸ‚áž› LTF ážáž¼áž…áž”áž‰áŸ’áž‡áž¶áž€áŸ‹áž€áž¶ážšáž”áž‰áŸ’áž…áž”áŸ‹ážŠáž¾áž˜áŸ’áž”áž¸áž”áž“áŸ’ážáž‘áž·ážŸážŠáŸ…áž’áŸ†áŸ”',
      'genesis.m4Num': 'áž˜áŸ‰áž¼ážŒáž»áž› áŸ áŸ¤',
      'genesis.m4Title': 'ážœáž·áž’áž¸ážŸáŸ’ážšáž„áŸ‹ážáŸ†áž”áž“áŸ‹ Supply & Demand áž‘áž¶áŸ†áž„ áŸ¤ áž”áŸ’ážšáž—áŸáž‘',
      'genesis.m4Desc': 'ážˆáž¶áž“áž•áž»ážáž–áž¸ Support/Resistance áž’áž˜áŸ’áž˜ážáž¶ áž‘áŸ…áž€áž¶áž“áŸ‹ážŸáŸ’áž“áž¶áž˜áž‡áž¾áž„ážŸáŸ’ážáž¶áž”áŸáž“: Range-Based, Pivot-Based, Single-Candle Extreme Order Block, áž“áž·áž„ Fractal Wick S&D áž“áŸ…ážáŸ†áž”áž“áŸ‹ Displacement ážáŸ’áž›áž¶áŸ†áž„áŸ”',
      'genesis.m5Num': 'áž˜áŸ‰áž¼ážŒáž»áž› áŸ áŸ¥',
      'genesis.m5Title': 'ážœážŠáŸ’ážáž“áŸƒážáŸ†áž”áž“áŸ‹ áž“áž·áž„áž€áž¶ážšáž€áž¶ážáŸ‹áž”áž“áŸ’ážáž™áž”áž“áŸ’áž‘áž»áž€ (Mitigation & LDD)',
      'genesis.m5Desc': 'ážŠáŸ†ážŽáž¶áž€áŸ‹áž€áž¶áž›áž‘áž¶áŸ†áž„ áŸ£ áž“áŸƒážáŸ†áž”áž“áŸ‹ážŸáŸ’ážáž¶áž”áŸáž“: Zone Creation, Continuation Model, áž“áž·áž„ Reversal ShiftáŸ” ážŸáŸ’áž‚áž¶áž›áŸ‹áž…áŸ’áž”áž¶ážŸáŸ‹áž–áž¸ážáŸ†áž”áž“áŸ‹ Fresh Unmitigated áž“áž·áž„áž”áž“áŸ’áž‘áž¶áž™ážšáž¹áž„áž˜áž¶áŸ† Last Defender Demand/SupplyáŸ”',
      'genesis.m6Num': 'áž˜áŸ‰áž¼ážŒáž»áž› áŸ áŸ¦',
      'genesis.m6Title': 'áž€áž¶áž™ážœáž·áž—áž¶áž‚ážœáž·áž‘áŸ’áž™áž¶áž“áŸƒážŸáž¶áž…áŸ‹áž”áŸ’ážšáž¶áž€áŸ‹ & áž¢áž“áŸ’áž‘áž¶áž€áŸ‹áž‘áž¶áŸ†áž„ áŸ¥ ážšáž”ážŸáŸ‹ Retail',
      'genesis.m6Desc': 'ážšáž”áŸ€áž”ážŠáŸ‚áž›ážŸáŸ’ážáž¶áž”áŸáž“áž”áž„áŸ’áž€áž¾áž Liquidity: Buy-Side & Sell-Side Liquidity, áž¢áž“áŸ’áž‘áž¶áž€áŸ‹áž‘áž¶áŸ†áž„ áŸ¥ (Swing stops, Double structures, Trendline inducement, Range purges), áž“áž·áž„ Liquidity RUNáŸ”',
      'genesis.m7Num': 'áž˜áŸ‰áž¼ážŒáž»áž› áŸ áŸ§',
      'genesis.m7Title': 'áž™áž“áŸ’ážáž€áž¶ážš Sweep, BCC & áž‘áŸ’ážšáž¹ážŸáŸ’ážáž¸ BIO Theory',
      'genesis.m7Desc': 'áž€áž¶ážšáž™áž›áŸ‹ážŠáž¹áž„ážŸáŸŠáž¸áž‡áž˜áŸ’ážšáŸ…áž¢áŸ†áž–áž¸ Wick Sweep áž’áŸ€áž”áž“áž¹áž„ Body Candle Closed (BCC)áŸ” áž‘áŸ’ážšáž¹ážŸáŸ’ážáž¸ BIO (By Independent Objective) BOS confirm ážŠáŸ„áž™ BOS, iBOS confirm ážŠáŸ„áž™ iBOS, FT confirm ážŠáŸ„áž™ FTáŸ”',
      'genesis.m8Num': 'áž˜áŸ‰áž¼ážŒáž»áž› áŸ áŸ¨',
      'genesis.m8Title': 'áž™áž“áŸ’ážáž€áž¶ážš Canonical Liquidity Sweep (áž€ážšážŽáž¸ 1, 2 & 3)',
      'genesis.m8Desc': 'ážšáž¼áž”áž˜áž“áŸ’ážáž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„ Candlestick Closed In (-X-): áž€ážšážŽáž¸áž‘áž¸ áŸ¡ (BOS sweep ážšáž„áŸ‹áž…áž¶áŸ† iBOS shift), áž€ážšážŽáž¸áž‘áž¸ áŸ¢ (iBOS sweep ážšáž„áŸ‹áž…áž¶áŸ† FT shift), áž“áž·áž„ áž€ážšážŽáž¸áž‘áž¸ áŸ£ (Fractal sweep áž”áž‰áŸ’áž‡áž¶áž€áŸ‹áž›áž¾ M3)áŸ”',
      'genesis.m9Num': 'áž˜áŸ‰áž¼ážŒáž»áž› áŸ áŸ©',
      'genesis.m9Title': 'ážšáž¼áž”áž˜áž“áŸ’ážáž”áŸ’ážšážáž·áž”ážáŸ’ážáž·áž€áž¶ážšáž…áž¼áž›áž‘áž¸áž•áŸ’ážŸáž¶ážšáž‘áž¶áŸ†áž„ áŸ£ ážŸáŸážŽáž¶ážšáž¸áž™áŸ‰áž¼',
      'genesis.m9Desc': 'ážšáž¼áž”áž˜áž“áŸ’ážáž”áŸ’ážšážáž·áž”ážáŸ’ážáž·áž€áž¶ážšážŸáŸ’ážáž„áŸ‹ážŠáž¶ážš: Scenario 1 (Counter-Trend Exhaustion áž“áŸ… Major Zone), Scenario 2 (Pro-Trend Refinement Types 1, 2, 3), áž“áž·áž„ Scenario 3 (Instant Momentum Breakout)áŸ”',
      'genesis.m10Num': 'áž˜áŸ‰áž¼ážŒáž»áž› áŸ¡áŸ ',
      'genesis.m10Title': 'áž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž áž¶áž“áž·áž—áŸáž™ & ážœáž·áž“áŸáž™ážŸáŸ’ážáž¶áž”áŸáž“ (Trade Management)',
      'genesis.m10Desc': 'áž€áž¶ážšáž€áž¶ážšáž–áž¶ážšáž‘áž»áž“ážáž¶áž˜áž”áŸ‚áž”áž‚ážŽáž·ážážœáž·áž‘áŸ’áž™áž¶: ážŠáž¶áž€áŸ‹ SL Padding 2-3 Pips áž€áž¶ážšáž–áž¶ážš Spread, áž…áŸ’áž”áž¶áž”áŸ‹ážšáŸ†áž€áž·áž› Break-Even ážáŸ’ážšáž¹áž˜ážáŸ’ážšáž¼ážœ, áž‚áŸ„áž›ážŠáŸ… RR 1:3 ážŠáž›áŸ‹ 1:10+ áž“áž·áž„áž€áŸ†ážŽážáŸ‹ Risk ážáŸ’ážšáž¹áž˜ 0.5%â€“1.0%áŸ”',
      'genesis.tabPillars': 'áž”áž‘áž–áž·ážŸáŸ„áž’áž“áŸáž“áŸƒáž€áž¶ážšážŸáž·áž€áŸ’ážŸáž¶',
      'genesis.tabLiquidity': 'áŸ¡. ážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’ & S&D',
      'genesis.tabCommunity': 'áŸ¢. Liquidity & áž¢áž“áŸ’áž‘áž¶áž€áŸ‹',
      'genesis.tabOB': 'áŸ£. ážšáž¼áž”áž˜áž“áŸ’ážáž…áž¼áž›áž•áŸ’ážŸáž¶ážš Scenarios',
      'genesis.tabRisk': 'áŸ¤. ážŸáž áž‚áž˜áž“áŸ & ážœáž·áž“áŸáž™áž‘áž»áž“',
      'genesis.tabLqHeading': 'ážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’áž‘áž¸áž•áŸ’ážŸáž¶ážš & ážŸáŸ’ážáž¶áž”ážáŸ’áž™áž€áž˜áŸ’áž˜ Supply/Demand ážŸáŸ’ážáž¶áž”áŸáž“',
      'genesis.tabLqText': 'ážŸáŸ’áž‘áž¶ážáŸ‹áž‡áŸ†áž“áž¶áž‰áž—áž¶ážŸáž¶áž‚áŸ’ážšáž¹áŸ‡áž“áŸƒáž€áž¶ážšáž‡áž½áž‰ážŠáž¼ážšáž”áŸ‚áž”ážŸáŸ’ážáž¶áž”áŸáž“: áž€áž¶ážšáž€áŸ†ážŽážáŸ‹ BOS áž’áŸ†, ážšáž›áž€áž‘áž¶áž‰ážáž™ IBOS áž“áž·áž„áž€áž¶ážšážŸáŸ’ážšáž„áŸ‹áž™áž€áž‘áž˜áŸ’ážšáž„áŸ‹ Base áž‘áž¶áŸ†áž„ áŸ¤ (RBD, DBR, RBR, DBD) áž‘áž¶áŸ†áž„ Extreme áž“áž·áž„ Decisional ážŠáŸ„áž™ážŸáž»áž€áŸ’ážšáž¹ážáž—áž¶áž–ážáŸ’áž–ážŸáŸ‹áŸ”',
      'genesis.tabLqRule': 'áž…áŸ’áž”áž¶áž”áŸ‹ážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’: BOS ážáŸ’ážšáž¼ážœáž”áž¶áž“áž”áž‰áŸ’áž‡áž¶áž€áŸ‹áž›áž»áŸ‡ážáŸ’ážšáž¶ážáŸ‚áž˜áž¶áž“ Candle-Body áž”áž·áž‘áž•áž»áž Swing Point áž™áŸ‰áž¶áž„áž–áŸáž‰áž›áŸáž‰áŸ”',
      'genesis.tabCommunityHeading': 'áž™áž“áŸ’ážáž€áž¶ážš Liquidity & áž¢áž“áŸ’áž‘áž¶áž€áŸ‹áž‘áž¶áŸ†áž„ áŸ¥ ážšáž”ážŸáŸ‹ Retail',
      'genesis.tabCommunityText': 'ážŸáŸ’ážœáŸ‚áž„áž™áž›áŸ‹áž–áž¸ážšáž”áŸ€áž”ážŠáŸ‚áž›ážŸáŸ’ážáž¶áž”áŸáž“áž’áŸ†áŸ—ážšáŸ€áž”áž…áŸ† Liquidity ážŠáž¾áž˜áŸ’áž”áž¸áž”áŸ†áž–áŸáž‰áž‘áŸ†áž áŸ† Order ážŠáŸáž’áŸ†áŸ” ážšáŸ€áž“ážŸáž˜áŸ’áž‚áž¶áž›áŸ‹áž¢áž“áŸ’áž‘áž¶áž€áŸ‹áž‘áž¶áŸ†áž„ áŸ¥, áž€áž¶ážšáž”áŸ‚áž„áž…áŸ‚áž€ážŠáž¶áž…áŸ‹ážšážœáž¶áž„ BCC Sweep áž“áž·áž„ Wick Sweep, áž–áŸ’ážšáž˜áž‘áž¶áŸ†áž„áž‘áŸ’ážšáž¹ážŸáŸ’ážáž¸ BIO TheoryáŸ”',
      'genesis.tabCommunityRule': 'áž…áŸ’áž”áž¶áž”áŸ‹ Liquidity: áž€áž»áŸ†áž…áž¼áž› Trade áž“áŸ… Support/Resistance áž’áž˜áŸ’áž˜ážáž¶áŸ” ážáŸ’ážšáž¼ážœážšáž„áŸ‹áž…áž¶áŸ†áž±áŸ’áž™áž˜áž¶áž“áž€áž¶ážš Sweep Liquidity ážŸáž·áž“áŸ”',
      'genesis.tabObHeading': 'ážšáž¼áž”áž˜áž“áŸ’ážáž”áŸ’ážšážáž·áž”ážáŸ’ážáž·áž€áž¶ážšáž…áž¼áž›áž•áŸ’ážŸáž¶ážšáž‘áž¶áŸ†áž„ áŸ£ (Execution Scenarios)',
      'genesis.tabObText': 'áž¢áž“áž»ážœážáŸ’ážáž€áž¶ážšáž…áž¼áž› Trade áž”áŸ’ážšáž€áž”ážŠáŸ„áž™áž—áž¶áž–áž…áŸ’áž”áž¶ážŸáŸ‹áž›áž¶ážŸáŸ‹ážáž¶áž˜ážšáž™áŸˆážšáž¼áž”áž˜áž“áŸ’ážáž‘áž¶áŸ†áž„ áŸ£ áž€áŸ’áž“áž»áž„ SMC Genesis: Counter-Trend Sweep (Scenario 1), Pro-Trend Pullback Refinement (Scenario 2), áž“áž·áž„ Clean Expansion Breakout (Scenario 3)áŸ”',
      'genesis.tabObRule': 'áž…áŸ’áž”áž¶áž”áŸ‹áž”áŸ’ážšážáž·áž”ážáŸ’ážáž·áž€áž¶ážš: áž‡áŸ’ážšáž¾ážŸážšáž¾ážŸážšáž¼áž”áž˜áž“áŸ’ážáž…áž¼áž›áž•áŸ’ážŸáž¶ážšáž•áŸ’áž¢áŸ‚áž€áž›áž¾áž‘áž·áž“áŸ’áž“áž“áŸáž™áž‘áž¸áž•áŸ’ážŸáž¶ážšáž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„ áž˜áž·áž“áž˜áŸ‚áž“ážáž¶áž˜áž¢áž¶ážšáž˜áŸ’áž˜ážŽáŸážŸáŸ’áž˜áž¶áž“áž¡áž¾áž™áŸ”',
      'genesis.tabRiskHeading': 'áž€áž¶ážšáž€áž¶ážšáž–áž¶ážšážŠáž¾áž˜áž‘áž»áž“ & ážŸáž áž‚áž˜áž“áŸážŸáž·ážŸáŸ’ážŸáž•áŸ’áž›áž¼ážœáž€áž¶ážš',
      'genesis.tabRiskText': 'áž—áž¶áž–áž‡áŸ„áž‚áž‡áŸáž™áž™áž¼ážšáž¢áž„áŸ’ážœáŸ‚áž„áž‘áž¶áž˜áž‘áž¶ážšážœáž·áž“áŸáž™áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž áž¶áž“áž·áž—áŸáž™áž˜áŸ‰ážºáž„áž˜áŸ‰áž¶ážáŸ‹ áž“áž·áž„áž”ážšáž·áž™áž¶áž€áž¶ážŸážŸáž·áž€áŸ’ážŸáž¶ážáŸ’ážšáž¹áž˜ážáŸ’ážšáž¼ážœáŸ” áž¢áž“áž»ážœážáŸ’ážáž…áŸ’áž”áž¶áž”áŸ‹áž áž¶áž“áž·áž—áŸáž™ 0.5%â€“1.0% áž“áž·áž„áž–áž·áž—áž¶áž€áŸ’ážŸáž¶áž‡áž¶áž˜áž½áž™áž˜áž·ážáŸ’ážážšáž½áž˜ážáŸ’áž“áž¶áž€áŸ‹áž€áŸ’áž“áž»áž„áž€áŸ’ážšáž»áž˜ Telegram áž•áŸ’áž›áž¼ážœáž€áž¶ážš (t.me/moonbluefx)áŸ”',
      'genesis.tabRiskRule': 'áž…áŸ’áž”áž¶áž”áŸ‹áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž‘áž»áž“: ážšáž€áŸ’ážŸáž¶áž áž¶áž“áž·áž—áŸáž™ážáŸ’ážšáž¹áž˜ 0.5%â€“1.0% áž€áŸ’áž“áž»áž„áž˜áž½áž™ tradeáŸ” áž€áž¶ážšáž–áž¶ážšážŠáž¾áž˜áž‘áž»áž“áž‡áž¶áž…áž˜áŸ’áž”áž„áž˜áž»áž“ážŸáŸ’ážœáŸ‚áž„ážšáž€áž•áž›áž…áŸ†ážŽáŸáž‰áŸ”',
      'genesis.admissionBadge': 'ðŸŽ“ áž€áŸ’ážšáž”ážáŸážŽáŸ’ážŒáž‡áŸ†áž“áž¶áž‰ áŸ¥ ážŸážŸážšážŸáŸ’ážáž˜áŸ’áž— â€¢ ážáŸ’áž“áž¶áž€áŸ‹áž”áž„áŸ’ážšáŸ€áž“áž•áŸ’áž›áž¼ážœáž€áž¶ážš',
      'genesis.admissionTitle': 'ážáŸ’áž“áž¶áž€áŸ‹ážŸáž·áž€áŸ’ážŸáž¶ážŸáŸ’ážáž¶áž”áŸáž“: áž€áŸ’ážšáž”ážáŸážŽáŸ’ážŒáž‡áŸ†áž“áž¶áž‰ áŸ¥ ážŸážŸážšážŸáŸ’ážáž˜áŸ’áž—',
      'genesis.admissionSub': 'áž€áž˜áŸ’áž˜ážœáž·áž’áž¸ážŸáž·áž€áŸ’ážŸáž¶áž‡áž¶áž”áŸ’ážšáž–áŸáž“áŸ’áž’ážŠáž¾áž˜áŸ’áž”áž¸áž€ážŸáž¶áž„ážŸáž˜ážáŸ’ážáž—áž¶áž–ážœáž·áž‡áŸ’áž‡áž¶áž‡áž¸ážœáŸˆáž›áž¾ážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’áž‘áž¸áž•áŸ’ážŸáž¶ážš, Supply & Demand, áž¢áž“áŸ’áž‘áž¶áž€áŸ‹ Liquidity, ážšáž¼áž”áž˜áž“áŸ’ážáž…áž¼áž›áž•áŸ’ážŸáž¶ážš áž“áž·áž„áž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„ážŠáž¾áž˜áž‘áž»áž“:',
      'genesis.std1Title': 'ážŸážŸážšážŸáŸ’ážáž˜áŸ’áž— áŸ áŸ¡: áž˜áŸáž€áž¶áž“áž·áž…ážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’áž‘áž¸áž•áŸ’ážŸáž¶ážš (BOS, IBOS, FTS)',
      'genesis.std1Desc': 'ážŸáŸ’áž‘áž¶ážáŸ‹áž‡áŸ†áž“áž¶áž‰ Swing High/Low, áž€áž¶ážšáž”áŸ‚áž„áž…áŸ‚áž€ážŠáž¶áž…áŸ‹ážšážœáž¶áž„ Major BOS (áž”áž“áŸ’ážáž‘áž·ážŸážŠáŸ…), IBOS (ážšáž›áž€áž‘áž¶áž‰ážáž™) áž“áž·áž„ FTS (áž€áž¶ážšáž”áŸ’ážáž¼ážšážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’ážáž¼áž…)áŸ”',
      'genesis.std1Outcome': 'áž›áž‘áŸ’áž’áž•áž›áž¢áž“áž»ážœážáŸ’áž: áž€áŸ†ážŽážáŸ‹áž‘áž·ážŸážŠáŸ…ážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’ áž“áž·áž„ážáž˜áŸ’ážšáž¹áž˜ Timeframe áž…áŸ’áž”áž¶ážŸáŸ‹áž›áž¶ážŸáŸ‹áŸ”',
      'genesis.std2Title': 'ážŸážŸážšážŸáŸ’ážáž˜áŸ’áž— áŸ áŸ¢: ážŸáŸ’ážáž¶áž”ážáŸ’áž™áž€áž˜áŸ’áž˜ S&D ážŸáŸ’ážáž¶áž”áŸáž“ (RBD, DBR, RBR, DBD)',
      'genesis.std2Desc': 'ážŸáž·áž€áŸ’ážŸáž¶áž‘áž˜áŸ’ážšáž„áŸ‹ Base áž‘áž¶áŸ†áž„ áŸ¤ ážšáž”ážŸáŸ‹ážŸáŸ’ážáž¶áž”áŸáž“: Rally-Base-Drop, Drop-Base-Rally, Rally-Base-Rally, áž“áž·áž„ Drop-Base-Drop áž‡áž¶áž˜áž½áž™áž€áž¶ážšážáž¶áž˜ážŠáž¶áž“ Extreme vs DecisionaláŸ”',
      'genesis.std2Outcome': 'áž›áž‘áŸ’áž’áž•áž›áž¢áž“áž»ážœážáŸ’áž: áž‚áž¼ážŸážœáž¶ážŸážáŸ†áž”áž“áŸ‹ Base ážŸáŸ’ážáž¶áž”áŸáž“ áž“áž·áž„ážáŸ’ážŸáŸ‚ážŸáž„áŸ’ážœáž¶áž€áŸ‹ Mitigation áž”áž¶áž“ážáŸ’ážšáž¹áž˜ážáŸ’ážšáž¼ážœáŸ”',
      'genesis.std3Title': 'ážŸážŸážšážŸáŸ’ážáž˜áŸ’áž— áŸ áŸ£: áž€áž¶ážšáž”áŸ„ážŸážŸáž˜áŸ’áž¢áž¶áž Liquidity & áž€áž¶ážšáž‘áž¶áž‰áž•áž›áž–áž¸áž¢áž“áŸ’áž‘áž¶áž€áŸ‹',
      'genesis.std3Desc': 'ážŸáŸ’ážœáŸ‚áž„áž™áž›áŸ‹áž¢áž“áŸ’áž‘áž¶áž€áŸ‹áž‘áž¶áŸ†áž„ áŸ¥ ážšáž”ážŸáŸ‹ Retail: Swing pools, Double structures, Trendline traps, Range sweeps, áž“áž·áž„áž™áž“áŸ’ážáž€áž¶ážš InducementáŸ”',
      'genesis.std3Outcome': 'áž›áž‘áŸ’áž’áž•áž›áž¢áž“áž»ážœážáŸ’áž: áž˜áž¾áž›ážƒáž¾áž‰ Stop-Hunt áž“áž·áž„áž¢áž“áŸ’áž‘áž¶áž€áŸ‹áž‘áž»áž“ážšáž¶áž™áž˜áž»áž“áž–áŸáž›ážáž˜áŸ’áž›áŸƒáž…áŸáž‰ážŠáŸ†ážŽáž¾ážšáŸ”',
      'genesis.std4Title': 'ážŸážŸážšážŸáŸ’ážáž˜áŸ’áž— áŸ áŸ¤: ážšáž¼áž”áž˜áž“áŸ’ážáž…áž¼áž›áž•áŸ’ážŸáž¶ážšážŸáž»áž€áŸ’ážšáž¹áž (Scenarios 1, 2, 3)',
      'genesis.std4Desc': 'áž™áž›áŸ‹áž…áŸ’áž”áž¶ážŸáŸ‹áž–áž¸áž€áž¶ážšáž…áž¼áž› Trade ážáž¶áž˜áž€áž¶áž›áŸˆáž‘áŸážŸáŸˆ: Counter-Trend Exhaustion, Structure Refinement Pro-Trend, áž“áž·áž„ Instant Momentum ExpansionáŸ”',
      'genesis.std4Outcome': 'áž›áž‘áŸ’áž’áž•áž›áž¢áž“áž»ážœážáŸ’áž: áž™áž›áŸ‹áž…áŸ’áž”áž¶ážŸáŸ‹áž–áž¸ Scenarios 1, 2, áž“áž·áž„ 3 áž€áŸ’áž“áž»áž„áž€áž¶ážšáž”áŸ’ážšážáž·áž”ážáŸ’ážáž·áž€áž¶ážš Trade Order áž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„áŸ”',
      'genesis.std5Title': 'ážŸážŸážšážŸáŸ’ážáž˜áŸ’áž— áŸ áŸ¥: áž€áž¶ážšáž”áŸ‚áž„áž…áŸ‚áž€áž‘áž»áž“áž”áŸ‚áž” Asymmetric (áž…áŸ’áž”áž¶áž”áŸ‹ 0.5%â€“1.0%)',
      'genesis.std5Desc': 'áž€áž¶ážšáž–áž¶ážšážŠáž¾áž˜áž‘áž»áž“ážáž¶áž˜áž‘áŸ†áž áŸ† Lot áž¢áž¶áž‡áž¸áž– (0.5%â€“1.0%) áž€áž¶ážšážšáŸ†áž€áž·áž› Break-Even áž“áž·áž„áž€áž¶ážšáž…áž¶áž”áŸ‹áž™áž€áž•áž›áž…áŸ†ážŽáŸáž‰ RR â‰¥ 1:3 áž¡áž¾áž„áž‘áŸ…áŸ”',
      'genesis.std5Outcome': 'áž›áž‘áŸ’áž’áž•áž›áž¢áž“áž»ážœážáŸ’áž: áž€áž¶ážšáž–áž¶ážšážŠáž¾áž˜áž‘áž»áž“ážáž¶áž˜ážšáž¼áž”áž˜áž“áŸ’áž Risk-to-Reward (RR â‰¥ 1:3 áž¡áž¾áž„áž‘áŸ…)áŸ”',
      'genesis.quoteText': '"áž‡áŸ„áž‚áž‡áŸáž™áž€áŸ’áž“áž»áž„áž€áž¶ážšáž‡áž½áž‰ážŠáž¼ážš áž˜áž·áž“áž˜áŸ‚áž“áž€áž¾ážáž¡áž¾áž„ážŠáŸ„áž™ážŸáž¶ážšáž¢áŸ’áž“áž€áž˜áž·áž“ážŠáŸ‚áž›ážáž¶ážáž“áŸ„áŸ‡áž‘áŸ áž”áŸ‰áž»áž“áŸ’ážáŸ‚ áž€áž¾ážáž…áŸáž‰áž–áž¸áž€áž¶ážšážšáž€áŸ’ážŸáž¶ážœáž·áž“áŸáž™ áž“áž·áž„áž€áž¶ážšáž€áž¶ážšáž–áž¶ážšážŠáž¾áž˜áž‘áž»áž“ážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€áž±áŸ’áž™áž”áž¶áž“áž›áŸ’áž¢áž”áŸ†áž•áž»ážáŸ”"',
      'genesis.quoteAuthor': 'â€” áž”áŸ’áž›áž„áŸ‹áž˜áŸážŸáŸ’ážáž¶áž”áŸáž“ SMC Genesis â€¢ BlueX',
      'genesis.applyTelegramBtn': 'áž•áŸ’áž‰áž¾ážŸáž¶ážšáž•áŸ’áž‘áž¶áž›áŸ‹áž‘áŸ…áž€áž¶áž“áŸ‹ BlueX áž›áž¾ Telegram (DM: @Le_Bluue)',
      'genesis.communityTelegramBtn': 'áž…áž¼áž›ážšáž½áž˜áž€áŸ’ážšáž»áž˜ážŸáž áž‚áž˜áž“áŸáž•áŸ’áž›áž¼ážœáž€áž¶ážš (t.me/moonbluefx)',
      'genesis.announcementBadge': 'ðŸ”¥ áž”áž¾áž€áž‘áž‘áž½áž›ážŸáž·ážŸáŸ’ážŸáž…áž¼áž›ážšáŸ€áž“',
      'genesis.announcementText': 'ážáŸ’áž“áž¶áž€áŸ‹áž”áž„áŸ’ážšáŸ€áž“ SMC Genesis â€” ážšáŸ€áž“áž‡áž½áž‰ážŠáž¼ážšáž˜áž¶ážŸ (XAU/USD) ážáž¶áž˜áž€áŸ’áž”áž½áž“ážŸáŸ’ážáž¶áž”áŸáž“áž‡áž¶áž˜áž½áž™ BlueX',
      'genesis.announcementBtn': 'áž…áž»áŸ‡ážˆáŸ’áž˜áŸ„áŸ‡áž…áž¼áž›ážšáŸ€áž“ážáž¶áž˜ Telegram â†’',
      'genesis.spotlightBadge': 'ðŸŽ¯ ážáŸ’áž“áž¶áž€áŸ‹áž”áž„áŸ’ážšáŸ€áž“áž•áŸ’áž›áž¼ážœáž€áž¶ážš SMC Genesis',
      'genesis.spotlightTitle': 'áž…áž»áŸ‡ážˆáŸ’áž˜áŸ„áŸ‡áž…áž¼áž›ážšáŸ€áž“ážáŸ’áž“áž¶áž€áŸ‹ážŸáŸ’ážáž¶áž”áŸáž“ SMC Genesis',
      'genesis.spotlightSub': 'áž™áž¾áž„áž”áŸ†áž”áž¶ážáŸ‹áž…áŸ„áž›áž€áž¶ážšážŸáŸ’áž˜áž¶áž“áž”áŸ‚áž” Retail ážŠáž¾áž˜áŸ’áž”áž¸áž”áž„áŸ’ážšáŸ€áž“áž¢áŸ’áž“áž€áž–áž¸áž—áž¶áž–ážŸáž»áž€áŸ’ážšáž¹ážáž€áŸ’áž“áž»áž„áž€áž¶ážšáž‡áž½áž‰ážŠáž¼ážšážŸáŸ’ážšáž”ážáž¶áž˜ážŸáŸ’ážáž¶áž”áŸáž“áŸ” áž‘áž‘áž½áž›áž”áž¶áž“áž‘áŸ†áž“áž»áž€áž…áž·ážáŸ’áž áž…áŸ’áž”áž¶áž”áŸ‹ážœáž·áž“áŸáž™ áž“áž·áž„áž‘áž˜áŸ’áž›áž¶áž”áŸ‹áž‡áž½áž‰ážŠáž¼ážšážšáž”ážŸáŸ‹ Trader áž¢áž¶áž‡áž¸áž–áŸ”',
      'genesis.spotlightStatus': 'â— áž”áž¾áž€áž‘áž‘áž½áž›ážŸáž·ážŸáŸ’ážŸ â€¢ áž…áŸ†áž“áž½áž“áž€áŸ†ážŽážáŸ‹áž€áŸ’áž“áž»áž„áž˜áž½áž™ážáŸ’áž“áž¶áž€áŸ‹',
      'genesis.spotlightPerk1Title': 'áž€áž˜áŸ’áž˜ážœáž·áž’áž¸ážŸáž·áž€áŸ’ážŸáž¶áž‡áž¶áž”áŸ’ážšáž–áŸáž“áŸ’áž’áž€áŸ’áž“áž»áž„ážáŸ’áž“áž¶áž€áŸ‹',
      'genesis.spotlightPerk1Desc': 'áž€áž¶ážšáž”áž„áŸ’ážšáŸ€áž“áž•áŸ’áž‘áž¶áž›áŸ‹áž–áž¸ Master Trader BlueX ážáž¶áž˜ážšáž™áŸˆáž˜áŸážšáŸ€áž“áž“áž¸áž˜áž½áž™áŸ— áž€áž¶ážšáž–áž“áŸ’áž™áž›áŸ‹áž›áž¾ Chart áž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„ áž“áž·áž„áž€áž¶ážšáž†áŸ’áž›áž¾áž™ážŸáŸ†ážŽáž½ážšáž€áŸ’áž“áž»áž„ážáŸ’áž“áž¶áž€áŸ‹áŸ”',
      'genesis.spotlightPerk2Title': 'áž€áŸ’áž”áž½áž“áž…áŸ’áž”áž¶áž”áŸ‹áž”áŸ’ážšážáž·áž”ážáŸ’ážáž·áž€áž¶ážšážŸáž»áž€áŸ’ážšáž¹áž',
      'genesis.spotlightPerk2Desc': 'áž‚áŸ’áž˜áž¶áž“áž€áž¶ážšážŸáŸ’áž˜áž¶áž“ážŠáŸ„áž™áž¢áž¶ážšáž˜áŸ’áž˜ážŽáŸáŸ” áž…áŸ’áž”áž¶áž”áŸ‹áž…áŸ’áž”áž¶ážŸáŸ‹áž›áž¶ážŸáŸ‹ážŸáž˜áŸ’ážšáž¶áž”áŸ‹ Body-Close BOS, áž‘áž˜áŸ’ážšáž„áŸ‹ S&D áž‘áž¶áŸ†áž„ áŸ¤ áž“áž·áž„ážšáž¼áž”áž˜áž“áŸ’ážáž…áž¼áž›áž•áŸ’ážŸáž¶ážšáž‘áž¶áŸ†áž„ áŸ£áŸ”',
      'genesis.spotlightPerk3Title': 'áž€áž¶ážšážœáž·áž—áž¶áž‚áž›áž¾ Chart áž˜áž¶ážŸáž•áŸ’áž‘áž¶áž›áŸ‹',
      'genesis.spotlightPerk3Desc': 'ážœáž·áž—áž¶áž‚ážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’áž‘áž¸áž•áŸ’ážŸáž¶ážšáž˜áž¶ážŸ (XAU/USD) áž˜áž»áž“áž–áŸáž› Session ážŸáŸ†ážáž¶áž“áŸ‹áŸ—áž”áž¾áž€ážŠáŸ†ážŽáž¾ážšáž€áž¶ážšáŸ” áž˜áž¾áž›ážƒáž¾áž‰áž€áž¶ážšáž€áŸ†ážŽážáŸ‹ážáŸ†áž”áž“áŸ‹ážŸáŸ’ážáž¶áž”áŸáž“áž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„áŸ”',
      'genesis.spotlightPerk4Title': 'ážŸáž áž‚áž˜áž“áŸážŸáž·ážŸáŸ’ážŸáž•áŸ’áž›áž¼ážœáž€áž¶ážš',
      'genesis.spotlightPerk4Desc': 'ážŸáž·áž‘áŸ’áž’áž·áž…áž¼áž›ážšáž½áž˜áž€áŸ’áž“áž»áž„áž€áŸ’ážšáž»áž˜ážŸáž áž‚áž˜áž“áŸážŸáž·ážŸáŸ’ážŸ (t.me/moonbluefx) ážŠáž¾áž˜áŸ’áž”áž¸ážáž¶áž˜ážŠáž¶áž“áž€áž¶ážšážœáž·áž—áž¶áž‚áž‘áž·ážŸážŠáŸ…áž”áŸ’ážšáž…áž¶áŸ†ážáŸ’áž„áŸƒ áž“áž·áž„áž”áž„áŸ’áž€áž¾áž“ážŸáž˜ážáŸ’ážáž—áž¶áž–áž‡áž¶áž”áž“áŸ’ážáž”áž“áŸ’áž‘áž¶áž”áŸ‹áŸ”',
      'genesis.spotlightActionTitle': 'ážáŸ’ážšáŸ€áž˜ážáŸ’áž›áž½áž“ážšáž½áž…ážšáž¶áž›áŸ‹áž áž¾áž™áž¬áž“áŸ…ážŠáž¾áž˜áŸ’áž”áž¸áž€áŸ’áž›áž¶áž™áž‡áž¶ Trader ážŸáŸ’ážáž¶áž”áŸáž“?',
      'genesis.spotlightActionDesc': 'áž€áŸ†ážŽážáŸ‹áž…áŸ†áž“áž½áž“ážŸáž·ážŸáŸ’ážŸáž€áŸ’áž“áž»áž„áž˜áž½áž™ážáŸ’áž“áž¶áž€áŸ‹ážŠáž¾áž˜áŸ’áž”áž¸áž’áž¶áž“áž¶áž€áž¶ážšáž™áž›áŸ‹ážŠáž¹áž„ážŸáŸŠáž¸áž‡áž˜áŸ’ážšáŸ… áž“áž·áž„áž€áž¶ážšáž¢áž“áž»ážœážáŸ’ážáž”áŸ’ážšáž€áž”ážŠáŸ„áž™áž”áŸ’ážšážŸáž·áž‘áŸ’áž’áž—áž¶áž–áŸ”',
      'genesis.spotlightActionBtn': 'âš¡ ážŸáž¶áž€ážŸáž½ážšáž…áž»áŸ‡ážˆáŸ’áž˜áŸ„áŸ‡áž…áž¼áž›ážšáŸ€áž“: DM @Le_Bluue',
      'genesis.floatingCta': 'âš¡ áž…áž»áŸ‡ážˆáŸ’áž˜áŸ„áŸ‡áž…áž¼áž›ážšáŸ€áž“: DM @Le_Bluue',
      'genesis.brokerBadge': 'áž›áŸ’áž”áž¿áž“áž”áŸ’ážšážáž·áž”ážáŸ’ážáž·áž€áž¶ážš & ážŸáž¶áž…áŸ‹áž”áŸ’ážšáž¶áž€áŸ‹ážŸáŸ’ážáž¶áž”áŸáž“',
      'genesis.brokerTitle': 'Broker ážŠáŸƒáž‚áž¼ážŠáŸ‚áž›ážŽáŸ‚áž“áž¶áŸ†ážŸáž˜áŸ’ážšáž¶áž”áŸ‹áž¢áž“áž»ážœážáŸ’áž SMC',
      'genesis.brokerDesc': 'áž€áž¶ážšáž¢áž“áž»ážœážáŸ’áž Smart Money Concepts áž‘áž¶áž˜áž‘áž¶ážšáž›áŸ’áž”áž¿áž“áž›áž¿áž“áž”áŸ†áž•áž»áž, Spreads áž‘áž¶áž”áž”áŸ†áž•áž»áž, ážŸáž¶áž…áŸ‹áž”áŸ’ážšáž¶áž€áŸ‹áž‡áŸ’ážšáŸ… áž“áž·áž„áž‚áŸ’áž˜áž¶áž“ Slippage ážŸáž·áž”áŸ’áž”áž“áž·áž˜áŸ’áž˜áž·ážáŸ” áž™áž¾áž„ážŸáž¼áž˜ážŽáŸ‚áž“áž¶áŸ†ážŠáŸƒáž‚áž¼ážŠáŸ‚áž›áž˜áž¶áž“áž¢áž¶áž‡áŸ’áž‰áž¶áž”áŸážŽáŸ’ážŽáž›áŸ†ážŠáž¶áž”áŸ‹áž€áŸ†áž–áž¼áž›ážŠáž¼áž…ážáž¶áž„áž€áŸ’ážšáŸ„áž˜:',
      'genesis.brokerTrenoNote': 'ážŠáŸƒáž‚áž¼áž€áŸ†áž–áž¼áž› â€¢ Raw Spreads â€¢ áž›áŸ’áž”áž¿áž“áž›áž¿áž“áž”áŸ†áž•áž»áž',
      'genesis.brokerGtcNote': 'áž¢áž¶áž‡áŸ’áž‰áž¶áž”áŸážŽáŸ’ážŽážŸáž€áž›áž…áŸ’ážšáž¾áž“ â€¢ ážŸáž¶áž…áŸ‹áž”áŸ’ážšáž¶áž€áŸ‹áž€áž˜áŸ’ážšáž·ážážŸáŸ’ážáž¶áž”áŸáž“',
      'genesis.brokerLirunexNote': 'Broker STP áž˜áž¶áž“áž¢áž¶áž‡áŸ’áž‰áž¶áž”áŸážŽáŸ’ážŽ â€¢ ážŸáž¶áž…áŸ‹áž”áŸ’ážšáž¶áž€áŸ‹ Forex & áž˜áž¶ážŸáž‡áŸ’ážšáŸ…',
      'genesis.faqBadge': 'ážŸáŸ†ážŽáž½ážšážŠáŸ‚áž›ážŸáž½ážšáž‰áž¹áž€áž‰áž¶áž”áŸ‹',
      'genesis.faqTitle': 'áž¢áŸ’ážœáž¸áŸ—áž‘áž¶áŸ†áž„áž¢ážŸáŸ‹ážŠáŸ‚áž›áž¢áŸ’áž“áž€ážáŸ’ážšáž¼ážœážŠáž¹áž„áž¢áŸ†áž–áž¸ SMC Genesis',
      'genesis.faq1Q': 'ážáž¾áž¢áŸ’ážœáž¸ážŠáŸ‚áž›áž’áŸ’ážœáž¾áž±áŸ’áž™ SMC Genesis ážáž»ážŸáž”áŸ’áž›áŸ‚áž€áž‘áž¶áŸ†áž„ážŸáŸ’ážšáž»áž„áž–áž¸áž€áž¶ážšážœáž·áž—áž¶áž‚áž”áž…áŸ’áž…áŸáž€áž‘áŸážŸáž‘áž¼áž‘áŸ…?',
      'genesis.faq1A': 'áž€áž¶ážšážœáž·áž—áž¶áž‚áž”áŸ‚áž” Retail áž–áž¹áž„áž•áŸ’áž¢áŸ‚áž€áž›áž¾ Indicator áž™ážºážáž™áŸ‰áž¶ážœ (RSI, Moving Averages) áž“áž·áž„ Trendline ážŠáŸ‚áž›ážŸáŸ’ážáž¶áž”áŸáž“áž’áŸ†áŸ—ážáŸ‚áž„ážáŸ‚ážšáž»áž‰áž±áŸ’áž™áž”áž»áž€ážŠáž¾áž˜áŸ’áž”áž¸áž™áž€ LiquidityáŸ” SMC Genesis áž”áž„áŸ’ážšáŸ€áž“áž¢áŸ’áž“áž€áž–áž¸ážšáž”áŸ€áž”ážŠáŸ‚áž›ážŸáŸ’ážáž¶áž”áŸáž“ážšáž»áž‰ážáž˜áŸ’áž›áŸƒáž–áž·ážáž”áŸ’ážšáž¶áž€ážŠ áž€áž“áŸ’áž›áŸ‚áž„ážŠáŸ‚áž› Stop áž”áŸ’ážšáž˜áž¼áž›áž•áŸ’ážáž»áŸ† áž“áž·áž„ážšáž”áŸ€áž”áž…áž¼áž› Trade áž€áŸ’ážšáŸ„áž™áž€áž¶ážšáž”áŸ„ážŸážŸáž˜áŸ’áž¢áž¶ážážšáž½áž…ážšáž¶áž›áŸ‹áž“áŸ…ážáŸ†áž”áž“áŸ‹ Supply & DemandáŸ”',
      'genesis.faq2Q': 'ážáž¾áž¢áŸ’áž“áž€áž‘áž¾áž”áž…áž¶áž”áŸ‹áž•áŸ’ážáž¾áž˜áž¢áž¶áž…ážšáŸ€áž“ SMC Genesis áž”áž¶áž“áž‘áŸ áž¬ážáŸ’ážšáž¼ážœáž€áž¶ážšáž”áž‘áž–áž·ážŸáŸ„áž’áž“áŸáž–áž¸áž˜áž»áž“?',
      'genesis.faq2A': 'ážáž¶áž˜áž–áž·ážáž‘áŸ… áž¢áŸ’áž“áž€áž‘áž¾áž”áž…áž¶áž”áŸ‹áž•áŸ’ážáž¾áž˜áž…áŸ’ážšáž¾áž“ážáŸ‚áž™áž›áŸ‹áž”áž¶áž“áž›áž¿áž“áž‡áž¶áž„ áž–áŸ’ážšáŸ„áŸ‡áž–áž½áž€áž‚áŸáž˜áž·áž“áž‘áž¶áž“áŸ‹áž‡áž¶áž”áŸ‹áž‘áž˜áŸ’áž›áž¶áž”áŸ‹áž”áŸ’ážšáž¾ Indicator ážáž»ážŸáŸ—áž‡áž¶áž…áŸ’ážšáž¾áž“áž†áŸ’áž“áž¶áŸ†áŸ” SMC Genesis áž…áž¶áž”áŸ‹áž•áŸ’ážáž¾áž˜áž–áž¸áž˜áž¼áž›ážŠáŸ’áž‹áž¶áž“áž‚áŸ’ážšáž¹áŸ‡áž“áŸƒ Liquidity áž‘áž¸áž•áŸ’ážŸáž¶ážš áž áž¾áž™áž€ážŸáž¶áž„áž¡áž¾áž„áž˜áž½áž™áž‡áŸ†áž áž¶áž“áž˜áŸ’ážáž„áŸ—ážšáž áž¼ážážŠáž›áŸ‹áž€áž¶ážšáž¢áž“áž»ážœážáŸ’ážáž€áž˜áŸ’ážšáž·ážážáŸ’áž–ážŸáŸ‹áŸ”',
      'genesis.faq3Q': 'ážáž¾áž§áž”áž€ážšážŽáŸáž áž·ážšáž‰áŸ’áž‰ážœážáŸ’ážáž»ážŽáž¶ážáŸ’áž›áŸ‡ážŠáŸ‚áž›ážŠáŸ†ážŽáž¾ážšáž€áž¶ážšáž›áŸ’áž¢áž”áŸ†áž•áž»ážáž‡áž¶áž˜áž½áž™ SMC Genesis?',
      'genesis.faq3A': 'SMC Genesis áž‚ážºáž‡áž¶áž€áŸ’ážšáž”ážáŸážŽáŸ’ážŒ Supply & Demand ážŸáž€áž›áŸ” ážœáž¶ážŠáŸ†ážŽáž¾ážšáž€áž¶ážšáž™áŸ‰áž¶áž„áž›áŸ’áž¢áž¥ážážáŸ’áž…áŸ„áŸ‡áž›áž¾áž˜áž¶ážŸ (XAUUSD), áž‚áž¼ážšáž¼áž”áž·áž™áž”áŸážŽáŸ’ážŽážŸáŸ†ážáž¶áž“áŸ‹áŸ— (EURUSD, GBPUSD, USDJPY), ážŸáž“áŸ’áž‘ážŸáŸ’ážŸáž“áŸáž—áž¶áž‚áž áŸŠáž»áž“ (US30, NAS100) áž“áž·áž„ážšáž¼áž”áž·áž™áž”áŸážŽáŸ’ážŽážŒáž¸áž‡áž¸ážáž› (BTC, ETH)áŸ”',
      'genesis.faq4Q': 'ážáž¾ážáŸ’áž‰áž»áŸ†áž¢áž¶áž…ážšáŸ†áž–áž¹áž„áž‘áž‘áž½áž›áž”áž¶áž“ážŸáž˜áž¶áž˜áž¶ážáŸ’ážš R:R áž€áž˜áŸ’ážšáž·ážážŽáž¶áž–áž¸áž™áž»áž‘áŸ’áž’ážŸáž¶ážŸáŸ’ážáŸ’ážšáž“áŸáŸ‡?',
      'genesis.faq4A': 'Setup ážšáž”ážŸáŸ‹ SMC áž•áŸ’ážáŸ„ážáž›áž¾áž•áž›áž…áŸ†ážŽáŸáž‰ Asymmetric áž…áž¶áž”áŸ‹áž–áž¸ 1:3 ážŠáž›áŸ‹ 1:5+áŸ” ážŠáŸ„áž™ážŸáž¶ážšáž…áŸ†ážŽáž»áž…áž…áž¼áž›ážáŸ’ážšáž¼ážœáž”áž¶áž“ážŸáž˜áŸ’ážšáž·ážážŸáž˜áŸ’ážšáž¶áŸ†áž„áž›áž¾ Timeframe ážáž¼áž…áž“áŸ…ážáŸ†áž”áž“áŸ‹ Imbalance áž…áŸ’áž”áž¶ážŸáŸ‹áž›áž¶ážŸáŸ‹ Stop Loss áž‚ážºážáž¼áž… áž“áž·áž„áž˜áž¶áž“ážŸáž»ážœážáŸ’ážáž·áž—áž¶áž–ážáŸ’áž–ážŸáŸ‹áŸ”',
      'genesis.faq5Q': 'ážáž¾ážáŸ’áž‰áž»áŸ†áž¢áž¶áž…áž…áž»áŸ‡ážˆáŸ’áž˜áŸ„áŸ‡áž…áž¼áž›ážšáŸ€áž“ážáŸ’áž“áž¶áž€áŸ‹áž“áŸáŸ‡ áž¬áž‘áž¶áž€áŸ‹áž‘áž„áž˜áž€áž€áž¶áž“áŸ‹ BlueX ážŠáŸ„áž™áž•áŸ’áž‘áž¶áž›áŸ‹ážŠáŸ„áž™ážšáž”áŸ€áž”ážŽáž¶?',
      'genesis.faq5A': 'ážŠáž¾áž˜áŸ’áž”áž¸áž…áž»áŸ‡ážˆáŸ’áž˜áŸ„áŸ‡áž…áž¼áž›ážšáŸ€áž“ áž¬ážŸáž¶áž€ážŸáž½ážšáž–áŸážáŸŒáž˜áž¶áž“ ážŸáž¼áž˜áž•áŸ’áž‰áž¾ážŸáž¶ážšáž•áŸ’áž‘áž¶áž›áŸ‹ (DM) áž‘áŸ…áž€áž¶áž“áŸ‹ Telegram ážšáž”ážŸáŸ‹ BlueX: @Le_BluueáŸ” áž áž¾áž™ážŠáž¾áž˜áŸ’áž”áž¸áž…áž¼áž›ážšáž½áž˜áž€áž¶ážšáž–áž·áž—áž¶áž€áŸ’ážŸáž¶ áž“áž·áž„áž˜áž¾áž›áž€áž¶ážšážœáž·áž—áž¶áž‚áž‘áž¸áž•áŸ’ážŸáž¶ážšáž”áŸ’ážšáž…áž¶áŸ†ážáŸ’áž„áŸƒ ážŸáž¼áž˜áž…áž¼áž›ážšáž½áž˜áž€áŸ’áž“áž»áž„áž€áŸ’ážšáž»áž˜ Telegram ážŸáž áž‚áž˜áž“áŸ: t.me/moonbluefxáŸ”',
      'genesis.ctaTitle': 'ážáŸ’ážšáŸ€áž˜ážáŸ’áž›áž½áž“ážšáž½áž…ážšáž¶áž›áŸ‹áž áž¾áž™áž¬áž“áŸ…ážŠáž¾áž˜áŸ’áž”áž¸ážˆáž¶áž“áž‡áž¾áž„áž…áž¼áž›áž€áŸ’áž“áž»áž„áž›áŸ†áž áž¼ážšážŸáŸ’ážáž¶áž”áŸáž“?',
      'genesis.ctaSub': 'áž”áž‰áŸ’ážˆáž”áŸ‹áž€áž¶ážšáž•áŸ’ážáž›áŸ‹áž”áŸ’ážšáž¶áž€áŸ‹áž±áŸ’áž™áž‘áž¸áž•áŸ’ážŸáž¶ážšážŠáŸ„áž™áž„áž„áž¹ážáž„áž„áž›áŸ‹áŸ” áž‘áŸ†áž“áž¶áž€áŸ‹áž‘áŸ†áž“áž„áž•áŸ’áž‘áž¶áž›áŸ‹áž‡áž¶áž˜áž½áž™ BlueX áž¬áž…áž¼áž›ážšáž½áž˜áž€áŸ’áž“áž»áž„ážŸáž áž‚áž˜áž“áŸ Trader ážšáž”ážŸáŸ‹áž™áž¾áž„áŸ”',

      // ========================================================
      // Gold Hedging Protocol (Khmer)
      // ========================================================
      'hedging.heroBadge': 'ážŸáŸ’ážáž¶áž”ážáŸ’áž™áž€áž˜áŸ’áž˜ážšážáž“áž¶áž‚áž¶ážš & Delta-Neutral áž˜áž¶ážŸážŸáž»áž‘áŸ’áž’',
      'hedging.heroSubBadge': 'áž€áž¶ážšážáž—áŸ’áž‡áž¶áž”áŸ‹ážšážœáž¶áž„áž áž¶áž„áž˜áž¶ážŸážšáž¼áž”ážœáž“áŸ’áž áž“áž·áž„ XAU/USD Digital',
      'hedging.heroTitle': 'áž–áž·áž’áž¸áž€áž¶ážšáž€áž¶ážšáž–áž¶ážšáž áž¶áž“áž·áž—áŸáž™áž˜áž¶ážŸ <span class="gold-accent">Gold Hedging</span>',
      'hedging.heroDesc': 'áž›áž»áž”áž”áŸ†áž”áž¶ážáŸ‹áž áž¶áž“áž·áž—áŸáž™áž€áž¶ážšáž”áŸ’ážšáŸ‚áž”áŸ’ážšáž½áž›ážáŸ’áž›áŸƒáž˜áž¶ážŸážŸáž˜áŸ’ážšáž¶áž”áŸ‹áž áž¶áž„áž˜áž¶ážŸ áž áž¶áž„áž›áž€áŸ‹áž‚áŸ’ážšáž¿áž„áž¢áž›áž„áŸ’áž€áž¶ážš áž“áž·áž„ážƒáŸ’áž›áž¶áŸ†áž„ážŸáŸ’ážáž»áž€áž˜áž¶ážŸáŸ” áž”áž˜áŸ’áž›áŸ‚áž„áž¯áž€ážáž¶áž˜áž¶ážŸážáŸ’áž˜áŸ‚ážšážŠáž¼áž…áž‡áž¶ ážáž˜áŸ’áž›áž¹áž„ áž‡áž¸ áž“áž·áž„áž€áŸ’ážšáž¶áž˜ áž‘áŸ…áž‡áž¶áž‘áŸ†áž áŸ†áž€áž·áž…áŸ’áž…ážŸáž“áŸ’áž™áž¶ážŒáž¸áž‡áž¸ážáž› (Lots) áž›áž¾ MT4/MT5 áž™áŸ‰áž¶áž„áž‡áž¶áž€áŸ‹áž›áž¶áž€áŸ‹ ážŠáž¾áž˜áŸ’áž”áž¸áž€áž¶ážšáž–áž¶ážšáž…áŸ†ážŽáŸáž‰áž–áž¸ážáŸ’áž›áŸƒážˆáŸ’áž“áž½áž› áž“áž·áž„áž‚áž˜áŸ’áž›áž¶ážážáŸ’áž›áŸƒáž‘áž·áž‰-áž›áž€áŸ‹áž”áž¶áž“ áŸ¡áŸ áŸ %áŸ”',
      'hedging.btnCalc': 'âš¡ áž”áž¾áž€áž˜áŸ‰áž¶ážŸáŸŠáž¸áž“áž‚ážŽáž“áž¶ Hedging',
      'hedging.btnArch': 'áž™áž“áŸ’ážáž€áž¶ážš Delta-Neutral âž”',
      'hedging.ribbonDelta': 'áž›áŸ†áž“áž¹áž„ Delta-Neutral ážŸáŸ’áž˜áž¾ áŸ ',
      'hedging.ribbonConversion': 'áž”áž˜áŸ’áž›áŸ‚áž„áž‘áŸ†áž áŸ† Lot ážŸáŸ’ážáž„áŸ‹ážŠáž¶ážšážŸáž»áž€áŸ’ážšáž¹áž',
      'hedging.ribbonProfit': 'áž€áž¶ážšáž–áž¶ážšáž”áŸ’ážšáž¶áž€áŸ‹áž…áŸ†ážŽáŸáž‰áž–áž¸áž‚áž˜áŸ’áž›áž¶ážážáŸ’áž›áŸƒ áž“áž·áž„ážˆáŸ’áž“áž½áž› áŸ¡áŸ áŸ %',
      'hedging.calcBadge': 'áž§áž”áž€ážšážŽáŸážšážáž“áž¶áž‚áž¶ážšážáž¶áž˜áž–áŸáž›ážœáŸáž›áž¶áž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„',
      'hedging.calcTitle': 'áž˜áŸ‰áž¶ážŸáŸŠáž¸áž“áž‚ážŽáž“áž¶ <span class="gold-accent">Hedging áž˜áž¶ážŸážšáž¼áž”ážœáž“áŸ’ážáž‘áŸ…ážŒáž¸áž‡áž¸ážáž›</span>',
      'hedging.calcSubtitle': 'áž‚ážŽáž“áž¶áž”áž‰áŸ’áž‡áž¶áž€áž¶ážšáž–áž¶ážšáž áž¶áž“áž·áž—áŸáž™ážáž¶áž˜áž‚ážŽáž·ážážœáž·áž‘áŸ’áž™áž¶ážŸáž»áž€áŸ’ážšáž¹áž áž”áŸ’ážšáž¶áž€áŸ‹ážáž˜áŸ’áž€áž›áŸ‹ Margin áž“áž·áž„áž‘áž»áž“áž”áž˜áŸ’ážšáž»áž„ážŸáž»ážœážáŸ’ážáž·áž—áž¶áž–ážŠáž¾áž˜áŸ’áž”áž¸ážšáž€áŸ’ážŸáž¶ážáž»áž›áŸ’áž™áž—áž¶áž– Delta-NeutraláŸ”',
      'hedging.ribbonStep1Title': 'áŸ¡. ážáŸ’áž›áž¹áž„áž‘áž˜áŸ’áž„áž“áŸ‹ & áž‘áž¼áž‘áž¶ážáŸ‹áž”áŸ’ážšáž¶áž€áŸ‹ážšáž¼áž”ážœáž“áŸ’áž',
      'hedging.ribbonStep1Sub': 'áž¢ážáž·ážáž·áž‡áž“ážŠáŸ„áŸ‡ážŠáž¼ážšáž˜áž¶ážŸáž“áŸ…ážáž»áž áž¶áž„ážáž¶áž˜ážáž˜áŸ’áž›áŸƒáž€áŸ’áž“áž»áž„ážŸáŸ’ážšáž»áž€',
      'hedging.ribbonStep2Title': 'áŸ¢. áž”áž¾áž€áž”áž‰áŸ’áž‡áž¶ Hedge (áŸ¡áŸ  ážœáž·áž“áž¶áž‘áž¸)',
      'hedging.ribbonStep2Sub': 'áž…áž»áž… Sell/Buy ážáž¶áž˜áž‘áŸ†áž áŸ† Lot ážŠáŸ‚áž›áž˜áŸ‰áž¶ážŸáŸŠáž¸áž“áž”áž„áŸ’áž áž¶áž‰',
      'hedging.ribbonStep3Title': 'áŸ£. áž áž¶áž“áž·áž—áŸáž™ážŸáŸ’áž˜áž¾ 0%',
      'hedging.ribbonStep3Sub': 'áž€áž¶ážšáž–áž¶ážšáž”áŸ’ážšáž¶áž€áŸ‹áž…áŸ†ážŽáŸáž‰áž–áž¸áž‚áž˜áŸ’áž›áž¶ážážáŸ’áž›áŸƒ áž“áž·áž„ážˆáŸ’áž“áž½áž› áŸ¡áŸ áŸ %',
      'hedging.assetSelectLabel': 'áŸ¡. áž‡áŸ’ážšáž¾ážŸážšáž¾ážŸáž›áŸ„áž áŸˆáž’áž¶ážáž»ážŠáŸáž˜áž¶áž“ážáž˜áŸ’áž›áŸƒ',
      'hedging.metalGoldName': 'áž˜áž¶ážŸ (XAU/USD)',
      'hedging.metalSilverName': 'áž”áŸ’ážšáž¶áž€áŸ‹ (XAG/USD)',
      'hedging.btnRefresh': 'áž‘áž¶áž‰ážáž˜áŸ’áž›áŸƒážáŸ’áž˜áž¸',
      'hedging.step1Label': 'áŸ¢. áž…ážšáž“áŸ’ážážŸáŸ’ážáž»áž€áž˜áž¶ážŸážšáž¼áž”ážœáž“áŸ’ážáž€áŸ’áž“áž»áž„áž áž¶áž„',
      'hedging.inputStep1Title': 'áž…ážšáž“áŸ’ážážŸáŸ’ážáž»áž€áž˜áž¶ážŸážšáž¼áž”ážœáž“áŸ’áž (ážáž»áž áž¶áž„áž˜áž¶ážŸážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€)',
      'hedging.inputStep1Desc': 'áž‡áŸ’ážšáž¾ážŸážšáž¾ážŸáž…ážšáž“áŸ’ážážŸáŸ’ážáž»áž€ áž“áž·áž„áž‘áž˜áŸ’áž„áž“áŸ‹áž˜áž¶ážŸáž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„ážŠáŸ‚áž›áž¢ážáž·ážáž·áž‡áž“ážŠáŸ„áŸ‡ážŠáž¼ážš',
      'hedging.dirBuyTitle': 'áž áž¶áž„áž‘áž·áž‰áž˜áž¶ážŸáž…áž¼áž›',
      'hedging.dirBuySub': 'ážŸáŸ’ážáž»áž€áž˜áž¶ážŸáž€áž¾áž“ (+áž‘áž˜áŸ’áž„áž“áŸ‹) âž” ážáŸ’ážšáž¼ážœáž”áž¾áž€ Digital SHORT',
      'hedging.dirSellTitle': 'áž áž¶áž„áž›áž€áŸ‹áž˜áž¶ážŸáž…áŸáž‰',
      'hedging.dirSellSub': 'ážŸáŸ’ážáž»áž€áž˜áž¶ážŸážáž™ (-áž‘áž˜áŸ’áž„áž“áŸ‹) âž” ážáŸ’ážšáž¼ážœáž”áž¾áž€ Digital LONG',
      'hedging.presetsCaption': 'áž‘áŸ†áž áŸ†ážŸáŸ’ážáž„áŸ‹ážŠáž¶ážšáž áž¶áž„áž˜áž¶ážŸ (Quick Presets):',
      'hedging.fieldWeight': 'áž‘áž˜áŸ’áž„áž“áŸ‹áž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„',
      'hedging.fieldUnit': 'áž¯áž€ážáž¶',
      'hedging.localRateLabel': 'áŸ£. ážáŸ’áž›áŸƒáž‘áž¸áž•áŸ’ážŸáž¶ážšáž”áŸ’ážšáž¶áž€áŸ‹ážšáž¼áž”ážœáž“áŸ’ážáž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„áž“áŸ…áž€áž˜áŸ’áž–áž»áž‡áž¶ (áž€áŸ’ážšáŸ… Digital)',
      'hedging.btnSyncSpot': 'áž‘áž¶áž‰ážáž¶áž˜ Spot',
      'hedging.damlungRateLabel': 'ážáŸ’áž›áŸƒáž€áŸ’áž“áž»áž„ áŸ¡ ážáž˜áŸ’áž›áž¹áž„ (ážŠáž»áž›áŸ’áž›áž¶ážš / áŸ¡ ážáž˜áŸ’áž›áž¹áž„)',
      'hedging.chiRateLabel': 'áž‚áž·ážáž‡áž¶ áŸ¡ áž‡áž¸ (ážŠáž»áž›áŸ’áž›áž¶ážš / áŸ¡ áž‡áž¸)',
      'hedging.localRateHelp': 'ážáž˜áŸ’áž›áŸƒáž”áŸ’ážšáž¶áž€áŸ‹ážšáž¼áž”ážœáž“áŸ’ážáž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„ážŠáŸ‚áž›áž‘áž·áž‰-áž›áž€áŸ‹áž“áŸ…ážáž»áž áž¶áž„áž˜áž¶ážŸáŸ” áŸ¡ ážáž˜áŸ’áž›áž¹áž„ = áŸ¡áŸ  áž‡áž¸ = áŸ£áŸ§.áŸ¥ áž€áŸ’ážšáž¶áž˜ â‰ˆ áŸ¡.áŸ¢áŸ áŸ¥áŸ¦áŸ¥ Troy OuncesáŸ”',
      'hedging.step2Label': 'áŸ¤. áž‘áž˜áŸ’áž„áž“áŸ‹áž˜áž¶ážŸážšáž¼áž”ážœáž“áŸ’áž áž“áž·áž„áž¯áž€ážáž¶',
      'hedging.shopPresetsTitle': 'áž‘áŸ†áž áŸ†ážŸáŸ’ážáž„áŸ‹ážŠáž¶ážšáž áž¶áž„áž˜áž¶ážŸ (Quick Presets):',
      'hedging.inputStep2Title': 'ážŠáž¾áž˜áž‘áž»áž“áž‚ážŽáž“áž¸ & áž‘áž»áž“áž”áž˜áŸ’ážšáž»áž„ážŸáž»ážœážáŸ’ážáž·áž—áž¶áž–',
      'hedging.inputStep2Desc': 'áž€áŸ†ážŽážáŸ‹áž…áŸ†áž“áž½áž“áž‘áž»áž“ážŠáž¾áž˜áŸ’áž”áž¸áž’áž¶áž“áž¶ážáž¶áž‚ážŽáž“áž¸áž˜áž·áž“ážŠáŸ‚áž›ážšáž„áž€áž¶ážš Stop-Out',
      'hedging.paramSpot': 'ážáŸ’áž›áŸƒáž˜áž¶ážŸáž–áž·áž—áž–áž›áŸ„áž€ Spot ($/oz)',
      'hedging.paramLeverage': 'Leverage ážˆáŸ’áž˜áž½áž‰áž€ážŽáŸ’ážáž¶áž›',
      'hedging.accountBalanceLabel': 'áŸ¥. áž…áŸ†áž“áž½áž“ážŠáž¾áž˜áž‘áž»áž“áž€áŸ’áž“áž»áž„áž‚ážŽáž“áž¸ Broker (ážŸáž˜ážáž»áž›áŸ’áž™ $ USD)',
      'hedging.btnAutoFillBalance': 'áž”áŸ†áž–áŸáž‰áž‘áž»áž“ážŸáž»ážœážáŸ’ážáž·áž—áž¶áž–ážŸáŸ’ážœáŸáž™áž”áŸ’ážšážœážáŸ’ážáž·',
      'hedging.balanceHelperNote': 'ážáž¾áž‚áž½ážšážŠáž¶áž€áŸ‹áž‘áž»áž“áž”áŸ‰áž»áž“áŸ’áž˜áž¶áž“áŸ– áž”áž‰áŸ’áž…áž¼áž›áž‘áž»áž“ážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€ážŠáž¾áž˜áŸ’áž”áž¸áž•áŸ’áž‘áŸ€áž„áž•áŸ’áž‘áž¶ážáŸ‹ážáž¶ážáž¾áž‘áž»áž“áž”áž˜áŸ’ážšáž»áž„ážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€áž¢áž¶áž…áž‘áž”áŸ‹áž‘áž›áŸ‹áž“áž¹áž„áž€áž¶ážšáž”áŸ’ážšáŸ‚áž”áŸ’ážšáž½áž›áž áž¶áž„áž†áŸáž„áž‘áž¸áž•áŸ’ážŸáž¶ážšážŠáŸ„áž™ážŸáž»ážœážáŸ’ážáž·áž—áž¶áž– áž¬ážáŸ’ážšáž¼ážœáž”áž“áŸ’ážáŸ‚áž˜áž‘áž»áž“áŸ”',
      'hedging.paramBuffer': 'áž‘áž»áž“áž”áž˜áŸ’ážšáž»áž„áž€áž¶ážšáž”áŸ’ážšáŸ‚áž”áŸ’ážšáž½áž›ážáŸ’áž›áŸƒ ($/oz)',
      'hedging.bufferHelp': 'áž‘áž»áž“áž”áž˜áŸ’ážšáž»áž„ážŸáž»ážœážáŸ’ážáž·áž—áž¶áž–áž€áŸ’áž“áž»áž„áž‚ážŽáž“áž¸ Broker ážŠáž¾áž˜áŸ’áž”áž¸áž€áž¶ážšáž–áž¶ážšáž€áž»áŸ†áž±áŸ’áž™ Stop-Out áž“áŸ…áž–áŸáž›áž‘áž¸áž•áŸ’ážŸáž¶ážšáž”áŸ’ážšáŸ‚áž”áŸ’ážšáž½áž›ážšáž áŸážŸ áž˜áž»áž“áž–áŸáž›ážŸáŸ’ážáž»áž€áž˜áž¶ážŸážáŸ’ážšáž¼ážœáž”áž¶áž“áž‘áž¼áž‘áž¶ážáŸ‹áŸ”',
      'hedging.btnCopyOrder': 'áž…áž˜áŸ’áž›áž„áž”áž‰áŸ’áž‡áž¶áž‡áž½áž‰ážŠáž¼ážš',
      'hedging.cashCounterBadge': 'áž”áŸ’ážšáž¶áž€áŸ‹ážšáž¼áž”ážœáž“áŸ’ážáž“áŸ…ážáž»áž áž¶áž„ & áž”áŸ’ážšáž¶áž€áŸ‹áž…áŸ†ážŽáŸáž‰áž‚áž˜áŸ’áž›áž¶ážážŠáŸ‚áž›áž”áž¶áž“áž…áž¶áž€áŸ‹ážŸáŸ„',
      'hedging.counterCashLabel': 'áž”áŸ’ážšáž¶áž€áŸ‹ážšáž¼áž”ážœáž“áŸ’ážáž‘áž¼áž‘áž¶ážáŸ‹áž“áŸ…ážáž»áž áž¶áž„:',
      'hedging.digitalSpotLabel': 'ážáž˜áŸ’áž›áŸƒ Spot ážŒáž¸áž‡áž¸ážáž› (Hedge):',
      'hedging.lockedSpreadLabel': 'ðŸ”’ áž”áŸ’ážšáž¶áž€áŸ‹áž…áŸ†ážŽáŸáž‰ážŸáž»áž‘áŸ’áž’ážŠáŸ‚áž›áž”áž¶áž“áž€áž¶ážšáž–áž¶ážš:',
      'hedging.resBrokerLots': 'áž‘áŸ†áž áŸ† Lot ážŸáŸ’ážáž„áŸ‹ážŠáž¶ážšáž›áž¾ Broker',
      'hedging.resResidual': 'áž‘áž˜áŸ’áž„áž“áŸ‹áž“áŸ…ážŸáž›áŸ‹áž˜áž·áž“áž‘áž¶áž“áŸ‹ Hedged',
      'hedging.resNotional': 'ážáž˜áŸ’áž›áŸƒážŸážšáž»áž”áž“áŸƒážŸáŸ’ážáž»áž€áž˜áž¶ážŸážšáž¼áž”ážœáž“áŸ’áž',
      'hedging.resMargin': 'áž”áŸ’ážšáž¶áž€áŸ‹ážáž˜áŸ’áž€áž›áŸ‹ Margin ážŠáŸ†áž”áž¼áž„',
      'hedging.stopOutRisk': 'áž€áž˜áŸ’ážšáž·áž Spot ážŠáŸ‚áž›áž”áŸ’ážšážˆáž˜áž“áž¹áž„ Stop-Out',
      'hedging.safeCapBadge': 'áž‘áž»áž“áž‚ážŽáž“áž¸ážŸáž»ážœážáŸ’ážáž·áž—áž¶áž–ážŠáŸ‚áž›ážŽáŸ‚áž“áž¶áŸ†',
      'hedging.safeCapTag': 'ážŸáŸ’ážáž¶áž”ážáŸ’áž™áž€áž˜áŸ’áž˜áž‚áŸ’áž˜áž¶áž“ Stop-Out',
      'hedging.healthStatusLabel': 'ážŸáŸ’ážáž¶áž“áž—áž¶áž–ážŠáž¾áž˜áž‘áž»áž“áž‚ážŽáž“áž¸:',
      'hedging.fastSopTitle': 'âš¡ ážŸáž€áž˜áŸ’áž˜áž—áž¶áž– áŸ£áŸ  ážœáž·áž“áž¶áž‘áž¸ážŸáž˜áŸ’ážšáž¶áž”áŸ‹áž”áŸáž¡áž¶áž€ážš:',
      'hedging.fastStep1': 'áž‘áž¼áž‘áž¶ážáŸ‹áž”áŸ’ážšáž¶áž€áŸ‹áž‡áž¶áž˜áž½áž™áž¢ážáž·ážáž·áž‡áž“áž“áŸ…ážáž»áž áž¶áž„',
      'hedging.fastStep2': 'áž”áž¾áž€ App MT5 & ážŠáž¶áž€áŸ‹áž”áž‰áŸ’áž‡áž¶áž‘áŸ†áž áŸ†',
      'hedging.fastStep3': 'áž áž¶áž“áž·áž—áŸáž™ážáŸ’ážšáž¼ážœáž”áž¶áž“áž›áž»áž”áž”áŸ†áž”áž¶ážáŸ‹áŸ” áž”áŸ’ážšáž¶áž€áŸ‹áž…áŸ†ážŽáŸáž‰ážáŸ’ážšáž¼ážœáž”áž¶áž“áž€áž¶ážšáž–áž¶ážš áŸ¡áŸ áŸ %áŸ”',
      'hedging.toggleDetails': 'â–¼ áž”áž„áŸ’áž áž¶áž‰ážšáž¼áž”áž˜áž“áŸ’ážáž‚ážŽáž·ážážœáž·áž‘áŸ’áž™áž¶ & áž‘áž˜áŸ’áž„áž“áŸ‹áž“áŸ…ážŸáž›áŸ‹',
      'hedging.hideDetails': 'â–² áž›áž¶áž€áŸ‹áž–áŸážáŸŒáž˜áž¶áž“áž›áž˜áŸ’áž¢áž·áž',
      'hedging.userBalanceRow': 'áž‘áž»áž“ážŠáŸ‚áž›áž¢áŸ’áž“áž€áž”áž¶áž“áž”áž‰áŸ’áž…áž¼áž›:',
      'hedging.capRowMargin': 'Margin ážáž˜áŸ’áž€áž›áŸ‹ (Broker áž…áž¶áž€áŸ‹ážŸáŸ„):',
      'hedging.capRowBuffer': 'áž‘áž»áž“áž”áž˜áŸ’ážšáž»áž„áž”áŸ’ážšáŸ‚áž”áŸ’ážšáž½áž›ážáŸ’áž›áŸƒ (+$100/oz):',
      'hedging.balanceStatusLabel': 'ážŸáŸ’ážáž¶áž“áž—áž¶áž–áž‘áž»áž“áž”áž˜áŸ’ážšáž»áž„ážŸáž»ážœážáŸ’ážáž·áž—áž¶áž–:',
      'hedging.sopHeader': 'ážšáž”áŸ€áž”áž”áŸ’ážšáž¾áž”áŸ’ážšáž¶ážŸáŸ‹áž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„áž“áŸ…ážáž»áž áž¶áž„áž˜áž¶ážŸ (How Every Shop Uses It)',
      'hedging.step1Title': 'áž¢ážáž·ážáž·áž‡áž“áž˜áž€ážŠáŸ„áŸ‡ážŠáž¼ážšáž˜áž¶ážŸáž“áŸ…ážáž»áž áž¶áž„',
      'hedging.step1Desc': 'ážáŸ’áž›áž¹áž„áž‘áž˜áŸ’áž„áž“áŸ‹áž˜áž¶ážŸ (ážáž˜áŸ’áž›áž¹áž„/áž‡áž¸) âž” áž‚ážŽáž“áž¶áž”áŸ’ážšáž¶áž€áŸ‹ážšáž¼áž”ážœáž“áŸ’ážáž‡áž¼áž“áž¢ážáž·ážáž·áž‡áž“ážáž¶áž˜ážáž˜áŸ’áž›áŸƒážáž»áž áž¶áž„áŸ”',
      'hedging.step2Title': 'áž”áž¾áž€ App MT5 / Broker ážšáž™áŸˆáž–áŸáž› áŸ¡áŸ  ážœáž·áž“áž¶áž‘áž¸',
      'hedging.step2Desc': 'áž…áž»áž… Sell/Buy ážáž¶áž˜áž‘áŸ†áž áŸ† Lots ážŠáŸ‚áž›áž˜áŸ‰áž¶ážŸáŸŠáž¸áž“áž”áž„áŸ’áž áž¶áž‰ážáž¶áž„áž›áž¾áŸ”',
      'hedging.step3Title': 'ážšáž½áž…ážšáž¶áž›áŸ‹ â€¢ áž áž¶áž“áž·áž—áŸáž™áž˜áž¶ážŸáž…áž»áŸ‡ážáŸ’áž›áŸƒážŸáŸ’áž˜áž¾ 0%',
      'hedging.step3Desc': 'áž‘áŸ„áŸ‡áž˜áž¶ážŸáž¡áž¾áž„áž¬áž…áž»áŸ‡ $100-$300 áž€áŸáž”áŸ’ážšáž¶áž€áŸ‹áž…áŸ†ážŽáŸáž‰áž áž¶áž„ážáŸ’ážšáž¼ážœáž”áž¶áž“áž€áž¶ážšáž–áž¶ážš áŸ¡áŸ áŸ %áŸ”',
      'hedging.proofTitle': 'ážšáž¼áž”áž˜áž“áŸ’ážáž”áž˜áŸ’áž›áŸ‚áž„ážáž¶áž˜áž€áž˜áŸ’ážšáž·ážážŸáŸ’ážáž¶áž”áŸáž“',
      'hedging.simTitle': 'ážŸáž¶áž€áž›áŸ’áž”áž„ážáŸážŸáŸ’ážáž áž¶áž„áž†áŸáž„áž‘áž¸áž•áŸ’ážŸáž¶ážšáž’áŸ’áž›áž¶áž€áŸ‹áž…áž»áŸ‡áŸ– <span class="gold-accent">áž˜áž¾áž›áž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„áž–áž¸ážšáž”áŸ€áž”ážŠáŸ‚áž› Hedging áž€áž¶ážšáž–áž¶ážšáž”áŸ’ážšáž¶áž€áŸ‹ážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€</span>',
      'hedging.simSubtitle': 'ážáž¾áž˜áž¶áž“áž¢áŸ’ážœáž¸áž€áž¾ážáž¡áž¾áž„áž…áŸ†áž–áŸ„áŸ‡ážŠáž¾áž˜áž‘áž»áž“áž áž¶áž„ážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€ áž”áŸ’ážšážŸáž·áž“áž”áž¾ážáž˜áŸ’áž›áŸƒáž˜áž¶ážŸáž–áž·áž—áž–áž›áŸ„áž€áž”áŸ’ážšáŸ‚áž”áŸ’ážšáž½áž›áž—áŸ’áž›áž¶áž˜áŸ—? áž…áž»áž…áž‡áŸ’ážšáž¾ážŸážšáž¾ážŸážŸáŸ’ážáž¶áž“áž—áž¶áž–ážáž¶áž„áž€áŸ’ážšáŸ„áž˜ážŠáž¾áž˜áŸ’áž”áž¸ážáŸážŸáŸ’ážáž—áŸ’áž›áž¶áž˜áŸ—áž›áž¾ážŸáŸ’ážáž»áž€áž˜áž¶ážŸážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€áŸ–',
      'hedging.balanceStatusLabel': 'ážŸáŸ’ážáž¶áž“áž—áž¶áž–áž‘áž»áž“áž”áž˜áŸ’ážšáž»áž„ážŸáž»ážœážáŸ’ážáž·áž—áž¶áž–:',
      'hedging.sopHeader': 'ážšáž”áŸ€áž”áž”áŸ’ážšáž¾áž”áŸ’ážšáž¶ážŸáŸ‹áž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„áž“áŸ…ážáž»áž áž¶áž„áž˜áž¶ážŸ (How Every Shop Uses It)',
      'hedging.step1Title': 'áž¢ážáž·ážáž·áž‡áž“áž˜áž€ážŠáŸ„áŸ‡ážŠáž¼ážšáž˜áž¶ážŸáž“áŸ…ážáž»áž áž¶áž„',
      'hedging.step1Desc': 'ážáŸ’áž›áž¹áž„áž‘áž˜áŸ’áž„áž“áŸ‹áž˜áž¶ážŸ (ážáž˜áŸ’áž›áž¹áž„/áž‡áž¸) âž” áž‚ážŽáž“áž¶áž”áŸ’ážšáž¶áž€áŸ‹ážšáž¼áž”ážœáž“áŸ’ážáž‡áž¼áž“áž¢ážáž·ážáž·áž‡áž“ážáž¶áž˜ážáž˜áŸ’áž›áŸƒážáž»áž áž¶áž„áŸ”',
      'hedging.step2Title': 'áž”áž¾áž€ App MT5 / Broker ážšáž™áŸˆáž–áŸáž› áŸ¡áŸ  ážœáž·áž“áž¶áž‘áž¸',
      'hedging.step2Desc': 'áž…áž»áž… Sell/Buy ážáž¶áž˜áž‘áŸ†áž áŸ† Lots ážŠáŸ‚áž›áž˜áŸ‰áž¶ážŸáŸŠáž¸áž“áž”áž„áŸ’áž áž¶áž‰ážáž¶áž„áž›áž¾áŸ”',
      'hedging.step3Title': 'ážšáž½áž…ážšáž¶áž›áŸ‹ â€¢ áž áž¶áž“áž·áž—áŸáž™áž˜áž¶ážŸáž…áž»áŸ‡ážáŸ’áž›áŸƒážŸáŸ’áž˜áž¾ 0%',
      'hedging.step3Desc': 'áž‘áŸ„áŸ‡áž˜áž¶ážŸáž¡áž¾áž„áž¬áž…áž»áŸ‡ $100-$300 áž€áŸáž”áŸ’ážšáž¶áž€áŸ‹áž…áŸ†ážŽáŸáž‰áž áž¶áž„ážáŸ’ážšáž¼ážœáž”áž¶áž“áž€áž¶ážšáž–áž¶ážš áŸ¡áŸ áŸ %áŸ”',
      'hedging.proofTitle': 'ážšáž¼áž”áž˜áž“áŸ’ážáž”áž˜áŸ’áž›áŸ‚áž„ážáž¶áž˜áž€áž˜áŸ’ážšáž·ážážŸáŸ’ážáž¶áž”áŸáž“',
      'hedging.archBadge': 'áž‚áŸ„áž›áž€áž¶ážšážŽáŸážŸáž˜áŸ’ážšáž¶áž”áŸ‹áž¢áž¶áž‡áž¸ážœáž€áž˜áŸ’áž˜áž˜áž¶ážŸ',
      'hedging.archTitle': 'áž™áž“áŸ’ážáž€áž¶ážšáž“áŸƒ <span class="gold-accent">áž›áŸ†áž“áž¹áž„ Delta-Neutral</span>',
      'hedging.archSubtitle': 'áž áž¶áž„áž˜áž¶ážŸážšáž¼áž”ážœáž“áŸ’ážáž”áž„áŸ’áž€áž¾ážáž”áŸ’ážšáž¶áž€áŸ‹áž…áŸ†ážŽáŸáž‰áž‡áž¶áž”áŸ‹áž›áž¶áž”áŸ‹áž–áž¸áž‚áž˜áŸ’áž›áž¶ážážáŸ’áž›áŸƒáž‘áž·áž‰-áž›áž€áŸ‹ áž“áž·áž„ážáŸ’áž›áŸƒážˆáŸ’áž“áž½áž›áž€áŸ‚áž…áŸ’áž“áŸƒáŸ” áž€áž¶ážšáž‘áž»áž€áž±áŸ’áž™ážŸáŸ’ážáž»áž€áž˜áž¶ážŸáž”áŸ’ážšážˆáž˜áž“áž¹áž„áž‘áž¸áž•áŸ’ážŸáž¶ážšážŠáŸ„áž™áž‚áŸ’áž˜áž¶áž“ Hedging áž‚ážºáž‡áž¶áž€áž¶ážšáž™áž€áž‘áž»áž“áž¢áž¶áž‡áž¸ážœáž€áž˜áŸ’áž˜áž‘áŸ…áž›áŸáž„áž›áŸ’áž”áŸ‚áž„áž‡áž¶áž˜áž½áž™áž‘áž¸áž•áŸ’ážŸáž¶ážšáž–áž·áž—áž–áž›áŸ„áž€áŸ”',
      'hedging.unhedgedTag': 'áž áž¶áž„áž˜áž¶ážŸáž”áž»ážšáž¶ážŽážŠáŸ‚áž›áž˜áž·áž“áž”áž¶áž“ Hedging',
      'hedging.unhedgedTitle': 'ážŸáŸ’ážáž»áž€áž˜áž¶ážŸáž”áŸ’ážšážˆáž˜áž áž¶áž“áž·áž—áŸáž™ áŸ¡áŸ áŸ %',
      'hedging.unhedgedDesc': 'áž áž¶áž„áž‘áž·áž‰áž˜áž¶ážŸ áŸ¡áŸ áŸ  ážáž˜áŸ’áž›áž¹áž„ ($áŸ¢áŸ§áŸ¤,áŸ áŸ áŸ ) áž–áž¸áž¢ážáž·ážáž·áž‡áž“áŸ” áž†áŸ’áž›áž„áž…áž»áž„ážŸáž”áŸ’ážáž¶áž áŸ ážáŸ’áž›áŸƒáž˜áž¶ážŸáž–áž·áž—áž–áž›áŸ„áž€áž’áŸ’áž›áž¶áž€áŸ‹áž…áž»áŸ‡ $áŸ¡áŸ¢áŸ /oz ážŠáŸ„áž™ážŸáž¶ážšáž–áŸážáŸŒáž˜áž¶áž“áž˜áŸ‰áž¶áž€áŸ’ážšáž¼ážŸáŸážŠáŸ’áž‹áž€áž·áž…áŸ’áž…áŸ”',
      'hedging.hedgedTag': 'áž–áž·áž’áž¸áž€áž¶ážš BLUEX DELTA-NEUTRAL',
      'hedging.hedgedTitle': 'áž›áŸ†áž“áž¹áž„ Delta ážŸáŸ’áž˜áž¾ áŸ  ážŸáž»áž€áŸ’ážšáž¹áž (Î” = 0)',
      'hedging.hedgedDesc': 'áž áž¶áž„áž€ážáŸ‹ážáŸ’ážšáž¶ áŸ¡áŸ áŸ  ážáž˜áŸ’áž›áž¹áž„áž€áŸ’áž“áž»áž„ BlueX Terminal áž áž¾áž™áž”áž¾áž€áž”áž‰áŸ’áž‡áž¶ Short áŸ¡.áŸ¢áŸ¡ Lot XAU/USD áž—áŸ’áž›áž¶áž˜áŸ—áž–áŸáž›áž‘áž‘áž½áž›áž˜áž¶ážŸážšáž¼áž”ážœáž“áŸ’ážáŸ”',
      'hedging.protocolBadge': 'áž–áž·áž’áž¸áž€áž¶ážšážŸáŸ’ážáž„áŸ‹ážŠáž¶ážšáž”áŸ’ážšážáž·áž”ážáŸ’ážáž·áž€áž¶ážš (SOP)',
      'hedging.protocolTitle': 'áž“áž¸ážáž·ážœáž·áž’áž¸áž”áŸ’ážšážáž·áž”ážáŸ’ážáž·áž€áž¶ážš áŸ¤ áž‡áŸ†áž áž¶áž“ <span class="gold-accent">Dealer SOP</span>',
      'hedging.protocolSubtitle': 'áž“áž¸ážáž·ážœáž·áž’áž¸ážŠáŸ‚áž›áž¢áž“áž»ážœážáŸ’ážážŠáŸ„áž™áž”áŸáž¡áž¶áž’áž·áž€áž¶ážš áž“áž¶áž™áž€ážƒáŸ’áž›áž¶áŸ†áž„ áž“áž·áž„áž¢áŸ’áž“áž€áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„ážšážáž“áž¶áž‚áž¶ážš ážŠáž¾áž˜áŸ’áž”áž¸áž›áž»áž”áž”áŸ†áž”áž¶ážáŸ‹ Slippage áž“áž·áž„ážšáž€áŸ’ážŸáž¶ážáž»áž›áŸ’áž™áž—áž¶áž–áŸ”',
      'hedging.sop1Title': 'áž€áž¶ážšážáŸ’áž›áž¹áž„áž‘áž˜áŸ’áž„áž“áŸ‹ & áž•áŸ’áž‘áŸ€áž„áž•áŸ’áž‘áž¶ážáŸ‹áž˜áž¶ážŸáž…áž¼áž›',
      'hedging.sop1Desc': 'ážáŸ’áž›áž¹áž„áž‚áŸ’ážšáž¿áž„áž¢áž›áž„áŸ’áž€áž¶ážš áž¬áž˜áž¶ážŸážŠáž»áŸ†áž›áž¾áž‡áž‰áŸ’áž‡áž¸áž„ážŸáŸ’ážáž„áŸ‹ážŠáž¶ážšáŸ” áž€ážáŸ‹ážáŸ’ážšáž¶áž…áŸ†áž“áž½áž“ážáž˜áŸ’áž›áž¹áž„ áž‡áž¸ áž¬áž€áŸ’ážšáž¶áž˜áž…áž¼áž›áž€áŸ’áž“áž»áž„áž”áž‰áŸ’áž‡áž¸áž áž¶áž„áž±áŸ’áž™áž”áž¶áž“áž…áŸ’áž”áž¶ážŸáŸ‹áž›áž¶ážŸáŸ‹ áž“áž·áž„áž”áž‰áŸ’áž‡áž¶áž€áŸ‹áž€áž˜áŸ’ážšáž·ážáž‘áž¹áž€áž˜áž¶ážŸ (áŸ©áŸ©.áŸ©áŸ©% áž¬ áŸ¢áŸ¤K)áŸ”',
      'hedging.sop2Title': 'áž€áž¶ážšáž”áž¾áž€áž”áž‰áŸ’áž‡áž¶áž€áž¶ážšáž–áž¶ážšáž áž¶áž“áž·áž—áŸáž™áž—áŸ’áž›áž¶áž˜áŸ—',
      'hedging.sop2Desc': 'áž”áž¾áž€áž€áž˜áŸ’áž˜ážœáž·áž’áž¸ Hedging (MT4/MT5) áž áž¾áž™ážŠáž¶áž€áŸ‹áž”áž‰áŸ’áž‡áž¶ Lot ážáž¶áž˜áž€áž¶ážšáž‚ážŽáž“áž¶áŸ” áž”áŸ’ážšážŸáž·áž“áž”áž¾áž áž¶áž„áž‘áž·áž‰áž˜áž¶ážŸáž…áž¼áž› ážáŸ’ážšáž¼ážœážŠáž¶áž€áŸ‹ Market ShortáŸ” áž”áŸ’ážšážŸáž·áž“áž”áž¾áž áž¶áž„áž›áž€áŸ‹áž˜áž¶ážŸáž…áŸáž‰ ážáŸ’ážšáž¼ážœážŠáž¶áž€áŸ‹ Market LongáŸ”',
      'hedging.sop3Title': 'áž€áž¶ážšáž›áž€áŸ‹áž˜áž¶ážŸážšáž¼áž”ážœáž“áŸ’ážáž…áŸáž‰ & áž”áž·áž‘áž”áž‰áŸ’áž‡áž¶ážŒáž¸áž‡áž¸ážáž›',
      'hedging.sop3Desc': 'áž“áŸ…áž–áŸáž›áž˜áž¶ážŸážšáž¼áž”ážœáž“áŸ’ážážáŸ’ážšáž¼ážœáž”áž¶áž“áž›áž€áŸ‹áž‘áŸ…áž±áŸ’áž™áž¢ážáž·ážáž·áž‡áž“ážšáž¶áž™ áž¬áž”áž‰áŸ’áž‡áž¼áž“áž‘áŸ…ážšáŸ„áž„áž…áž€áŸ’ážšáž…áž˜áŸ’ážšáž¶áž‰áŸ‹ ážáŸ’ážšáž¼ážœáž”áž·áž‘áž”áž‰áŸ’áž‡áž¶ážŒáž¸áž‡áž¸ážáž›ážŠáŸ‚áž›ážáŸ’ážšáž¼ážœáž‚áŸ’áž“áž¶áž“áŸ…áž›áž¾ MT4/MT5 áž—áŸ’áž›áž¶áž˜áŸ—áŸ”',
      'hedging.sop4Title': 'ážœáž·áž“áŸáž™ Swap-Free & áž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž áž·ážšáž‰áŸ’áž‰ážœážáŸ’ážáž»',
      'hedging.sop4Desc': 'ážœážŠáŸ’ážážŸáŸ’ážáž»áž€áž˜áž¶ážŸáž‡áž¶ážšáž¿áž™áŸ—áž¢áž¼ážŸáž”áž“áŸ’áž›áž¶áž™áž…áŸ’ážšáž¾áž“ážáŸ’áž„áŸƒ áž¬ážŸáž”áŸ’ážáž¶áž áŸáŸ” áž‚ážŽáž“áž¸áž‘áž¼áž‘áŸ…áž€áž¶ážáŸ‹ážáŸ’áž›áŸƒ Swap áž–áŸáž›áž€áž¶áž“áŸ‹ážšáŸ†áž›áž„áž™áž”áŸ‹ážŠáŸ‚áž›áž’áŸ’ážœáž¾áž±áŸ’áž™áž”áž¶ážáŸ‹áž…áŸ†ážŽáŸáž‰áŸ” ážáŸ’ážšáž¼ážœážáŸ‚áž”áŸ’ážšáž¾áž”áŸ’ážšáž¶ážŸáŸ‹áž‚ážŽáž“áž¸ Swap-Free ážŸáŸ’ážáž¶áž”áŸáž“áž‡áž¶ážŠáž¶áž…áŸ‹ážáž¶ážáŸ”',
      'hedging.matrixBadge': 'ážáž¶ážšáž¶áž„áž”áž˜áŸ’áž›áŸ‚áž„ážáŸ’áž“áž¶áž',
      'hedging.matrixTitle': 'ážŸáŸ’ážáž„áŸ‹ážŠáž¶ážšáž‘áž˜áŸ’áž„áž“áŸ‹ <span class="gold-accent">áž€áž˜áŸ’ážšáž·ážážŸáŸ’ážáž¶áž”áŸáž“</span>',
      'hedging.matrixSubtitle': 'ážŸáž˜áž˜áž¼áž›áž‚ážŽáž·ážážœáž·áž‘áŸ’áž™áž¶ážšážœáž¶áž„áž¯áž€ážáž¶áž˜áž¶ážŸáž”áŸ’ážšáž–áŸƒážŽáž¸ážáŸ’áž˜áŸ‚ážš áž‘áž˜áŸ’áž„áž“áŸ‹áž˜áŸ‰áŸ‚ážáŸ’ážš áž¯áž€ážáž¶áž¢áž“áŸ’ážážšáž‡áž¶ážáž· Troy Ounces áž“áž·áž„áž€áž·áž…áŸ’áž…ážŸáž“áŸ’áž™áž¶ážŒáž¸áž‡áž¸ážáž› LotsáŸ”',
      'hedging.colUnit': 'áž¯áž€ážáž¶áž˜áž¶ážŸ',
      'hedging.colKhmer': 'ážˆáŸ’áž˜áŸ„áŸ‡áž”áŸ’ážšáž–áŸƒážŽáž¸ážáŸ’áž˜áŸ‚ážš',
      'hedging.colGrams': 'áž‘áž˜áŸ’áž„áž“áŸ‹áž‚áž·ážáž‡áž¶áž€áŸ’ážšáž¶áž˜ (g)',
      'hedging.colOunces': 'Troy Ounces (oz)',
      'hedging.colLots': 'Lots ážŸáŸ’ážáž„áŸ‹ážŠáž¶ážš MT4/MT5',
      'hedging.colEquiv': 'ážŸáž˜áž˜áž¼áž›',
      'hedging.brokerBadge': 'ážŠáŸƒáž‚áž¼áž áŸážŠáŸ’áž‹áž¶ážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’ážŸáŸ’ážáž¶áž”áŸáž“',
      'hedging.brokerTitle': 'áž€áž¶ážšáž¢áž“áž»ážœážáŸ’ážáž”áž‰áŸ’áž‡áž¶áž‚áŸ’áž˜áž¶áž“ Spread áž‡áž¶áž˜áž½áž™ <span class="cyan-accent">Treno Markets</span>',
      'hedging.brokerDesc': 'áž€áž¶ážšáž€áž¶ážšáž–áž¶ážšáž áž¶áž“áž·áž—áŸáž™áž›áž¾ážŸáŸ’ážáž»áž€áž˜áž¶ážŸáž‘áž¶áž˜áž‘áž¶ážšáž›áž€áŸ’ážážážŽáŸ’ážŒážŸáŸ’ážáž¶áž”áŸáž“áž™áŸ‰áž¶áž„ážáž¹áž„ážšáŸ‰áž¹áž„áŸ” Treno Markets áž•áŸ’ážáž›áŸ‹ Raw Spread (0.0 pips áž›áž¾ XAU/USD), áž‚ážŽáž“áž¸ Swap-Free áž“áž·áž„áž›áŸ’áž”áž¿áž“áž”áž‰áŸ’áž‡áž¼áž“áž”áž‰áŸ’áž‡áž¶áž›áž¿áž“áž”áŸ†áž•áž»ážáž€áŸ’ážšáŸ„áž˜ áŸ¡áŸ¥ áž˜áž·áž›áŸ’áž›áž¸ážœáž·áž“áž¶áž‘áž¸áŸ”',
      'hedging.brokerCta': 'áž”áž¾áž€áž‚ážŽáž“áž¸ážŸáŸ’ážáž¶áž”áŸáž“áž›áž¾ Treno Markets âž”',
      'hedging.faqBadge': 'ážŸáŸ†ážŽáž½ážšážŠáŸ‚áž›ážŸáž½ážšáž‰áž¹áž€áž‰áž¶áž”áŸ‹',
      'hedging.faqTitle': 'ážŸáŸ†ážŽáž½ážš-áž…áž˜áŸ’áž›áž¾áž™áž¢áŸ†áž–áž¸ <span class="gold-accent">Gold Hedging</span>',
      'hedging.q1Title': 'áž áŸážáž»áž¢áŸ’ážœáž¸áž”áž¶áž“áž‡áž¶áž áž¶áž„áž™áž¾áž„ážáŸ’áž‰áž»áŸ†ážáŸ’ážšáž¼ážœ Hedging áž”áž¾áž˜áž¶ážŸáž¡áž¾áž„ážáŸ’áž›áŸƒáž‡áž¶áž“áž·áž…áŸ’áž…áž€áŸ’áž“áž»áž„ážšáž™áŸˆáž–áŸáž›ážœáŸ‚áž„?',
      'hedging.q1Answer': 'áž€áŸ’áž“áž»áž„áž“áž¶áž˜áž‡áž¶áž¢áŸ’áž“áž€áž›áž€áŸ‹áž˜áž¶ážŸ áž”áŸ’ážšáž—áž–áž…áŸ†ážŽáŸáž‰ážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€áž‚ážºáž‚áž˜áŸ’áž›áž¶ážážáŸ’áž›áŸƒáž‘áž·áž‰-áž›áž€áŸ‹ áž“áž·áž„ážáŸ’áž›áŸƒážˆáŸ’áž“áž½áž›áž€áŸ‚áž…áŸ’áž“áŸƒáŸ” áž¢áŸ’áž“áž€áž€áŸ†áž–áž»áž„áž”áŸ’ážšáž€áž”áž¢áž¶áž‡áž¸ážœáž€áž˜áŸ’áž˜áž›áž€áŸ‹ážšáž¶áž™ážŠáŸ‚áž›áž‘áž¶áž˜áž‘áž¶ážšáž…ážšáž“áŸ’ážáž›áž¿áž“ áž˜áž·áž“áž˜áŸ‚áž“áž‡áž¶áž€áž¶ážšážœáž·áž“áž·áž™áŸ„áž‚áž‘áž»áž€ážšáž™áŸˆáž–áŸáž›ážœáŸ‚áž„áž¡áž¾áž™áŸ” áž€áž¶ážšáž’áŸ’áž›áž¶áž€áŸ‹áž…áž»áŸ‡ áŸ£%â€“áŸ¥% áž—áŸ’áž›áž¶áž˜áŸ—áž€áŸ’áž“áž»áž„áž˜áž½áž™ážŸáž”áŸ’ážáž¶áž áŸáž¢áž¶áž…áž›áŸáž”áž™áž€áž”áŸ’ážšáž¶áž€áŸ‹áž…áŸ†ážŽáŸáž‰ážšáž¶áž”áŸ‹ážáŸ‚ážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€ áž”áŸ’ážšážŸáž·áž“áž”áž¾ážŸáŸ’ážáž»áž€áž˜áž¶ážŸáž˜áž·áž“ážáŸ’ážšáž¼ážœáž”áž¶áž“áž€áž¶ážšáž–áž¶ážšáŸ”',
      'hedging.q2Title': 'ážáž¾áž˜áž¶áž“áž¢áŸ’ážœáž¸áž€áž¾ážáž¡áž¾áž„áž”áŸ’ážšážŸáž·áž“áž”áž¾áž˜áž¶ážŸáž¡áž¾áž„ážáŸ’áž›áŸƒážáŸ’áž›áž¶áŸ†áž„ áž–áŸáž›ážŠáŸ‚áž›áž™áž¾áž„áž€áŸ†áž–áž»áž„áž€áž¶áž“áŸ‹ Short Hedging?',
      'hedging.q2Answer': 'áž”áŸ’ážšážŸáž·áž“áž”áž¾ážáŸ’áž›áŸƒáž˜áž¶ážŸáž¡áž¾áž„ážáŸ’áž–ážŸáŸ‹ áž”áž‰áŸ’áž‡áž¶ážŒáž¸áž‡áž¸ážáž› Short ážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€áž“áž¹áž„áž”áž„áŸ’áž áž¶áž‰áž€áž¶ážšážáž¶ážáž”áž„áŸ‹áž”ážŽáŸ’ážáŸ„áŸ‡áž¢áž¶ážŸáž“áŸ’áž“áŸ” áž”áŸ‰áž»áž“áŸ’ážáŸ‚ážŸáŸ’ážáž»áž€áž˜áž¶ážŸážšáž¼áž”ážœáž“áŸ’ážáž“áŸ…áž€áŸ’áž“áž»áž„áž‘áž¼áž áž¶áž„ážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€áž”áž¶áž“áž¡áž¾áž„ážáŸ’áž›áŸƒáž€áŸ’áž“áž»áž„áž…áŸ†áž“áž½áž“áž‘áž¹áž€áž”áŸ’ážšáž¶áž€áŸ‹ážŸáŸ’áž˜áž¾áž‚áŸ’áž“áž¶áž”áŸáŸ‡áž”áž·áž‘áŸ” áž“áŸáŸ‡áž áž¾áž™áž‡áž¶áž˜áž¼áž›áž áŸážáž»ážŠáŸ‚áž›áž€áž¶ážšážšáž€áŸ’ážŸáž¶áž‘áž»áž“áž”áž˜áŸ’ážšáž»áž„ážŸáž»ážœážáŸ’ážáž·áž—áž¶áž– Safe Capital ($100/oz) áž˜áž¶áž“ážŸáž¶ážšáŸˆážŸáŸ†ážáž¶áž“áŸ‹áž”áŸ†áž•áž»áž ážŠáž¾áž˜áŸ’áž”áž¸áž’áž¶áž“áž¶ážáž¶áž‚ážŽáž“áž¸áž˜áž·áž“ážšáž„áž€áž¶ážš Stop-OutáŸ”',
      'hedging.q3Title': 'ážáž¾áž™áž¾áž„áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž‘áž˜áŸ’áž„áž“áŸ‹ážáž¼áž…áŸ—áž€áŸ’ážšáŸ„áž˜ áŸ .áŸ áŸ¡ Lot (áŸ£áŸ¡.áŸ¡áž€áŸ’ážšáž¶áž˜) ážŠáŸ„áž™ážšáž”áŸ€áž”ážŽáž¶?',
      'hedging.q3Answer': 'Broker MT4/MT5 áž¢áž“áž»áž‰áŸ’áž‰áž¶ážáž±áŸ’áž™áž”áž¾áž€áž”áž‰áŸ’áž‡áž¶áž¢áž”áŸ’áž”áž”ážšáž˜áž¶ áŸ .áŸ áŸ¡ Lot (áŸ¡ Troy Ounce = áŸ£áŸ¡.áŸ¡áŸ  áž€áŸ’ážšáž¶áž˜ â‰ˆ áŸ .áŸ¨áŸ£ ážáž˜áŸ’áž›áž¹áž„)áŸ” ážŸáž˜áŸ’ážšáž¶áž”áŸ‹áž‘áž˜áŸ’áž„áž“áŸ‹ážáž¼áž…áŸ— áž˜áŸ‰áž¶ážŸáŸŠáž¸áž“áž‚ážŽáž“áž¶áž“áž¹áž„áž”áž„áŸ’áž áž¶áž‰áž‘áž˜áŸ’áž„áž“áŸ‹áž“áŸ…ážŸáž›áŸ‹ (Micro-Residual)áŸ” áž¢áŸ’áž“áž€áž‚áŸ’ážšáž¶áž“áŸ‹ážáŸ‚áž”áŸ’ážšáž˜áž¼áž›áž€áž¶ážšáž‘áž·áž‰ážšáž¶áž™ážáž¼áž…áŸ—ážšáž áž¼ážážŠáž›áŸ‹áž‚áŸ’ážšáž”áŸ‹ áŸ .áŸ áŸ¡ Lot ážŠáž¾áž˜áŸ’áž”áž¸áž”áž¾áž€áž”áž‰áŸ’áž‡áž¶ ážŠáŸ„áž™ážšáž€áŸ’ážŸáž¶áž”áŸ’ážšážŸáž·áž‘áŸ’áž’áž—áž¶áž– Hedging áž”áž¶áž“áž‡áž¶áž„ áŸ©áŸ¨%áŸ”',
      'hedging.q4Title': 'ážáž¾áž™áž¾áž„áž¢áž¶áž… Hedging áž›áŸ„áž áŸˆáž’áž¶ážáž»áž•áŸ’ážŸáŸáž„áž‘áŸ€ážážŠáž¼áž…áž‡áž¶ áž”áŸ’ážšáž¶áž€áŸ‹ áž¬áž”áŸ’áž›áž¶áž‘áž¸áž“áž”áž¶áž“áž‘áŸ?',
      'hedging.q4Answer': 'áž”áž¶áž“áŸ” áž‚áŸ„áž›áž€áž¶ážšážŽáŸáž‚ážŽáž·ážážœáž·áž‘áŸ’áž™áž¶ Delta-Neutral áž‚ážºážŠáž¼áž…áž‚áŸ’áž“áž¶ážŸáž˜áŸ’ážšáž¶áž”áŸ‹áž”áŸ’ážšáž¶áž€áŸ‹ (XAG/USD) áž“áž·áž„áž”áŸ’áž›áž¶áž‘áž¸áž“ (XPT/USD) ážŠáŸ„áž™áž‚áŸ’ážšáž¶áž“áŸ‹ážáŸ‚áž€áŸ‚ážŸáž˜áŸ’ážšáž½áž›áž‘áŸ†áž áŸ†áž€áž·áž…áŸ’áž…ážŸáž“áŸ’áž™áž¶ážŸáŸ’ážáž„áŸ‹ážŠáž¶ážš (áŸ¥,áŸ áŸ áŸ  oz áž€áŸ’áž“áž»áž„áž˜áž½áž™ Lot áž”áŸ’ážšáž¶áž€áŸ‹)áŸ” BlueX Terminal áž•áŸ’ážáž›áŸ‹ážšáž¼áž”áž˜áž“áŸ’ážáž‡áž¶áž€áŸ‹áž›áž¶áž€áŸ‹ážŸáž˜áŸ’ážšáž¶áž”áŸ‹ážáž»ážšážáž“áž¶áž‚áž¶ážšáž–áž áž»áž›áŸ„áž áŸˆáŸ”',
      'hedging.floatingCta': 'áž–áž·áž‚áŸ’ážšáŸ„áŸ‡áž™áŸ„áž”áž›áŸ‹ážšáŸ€áž”áž…áŸ†ážšážáž“áž¶áž‚áž¶ážš â€¢ DM @Le_Bluue',

      // Real Phnom Penh Case Study (Khmer)
      'hedging.caseBadge': 'ðŸ“ áž§áž‘áž¶áž ážšážŽáŸáž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„áž“áŸ…áž—áŸ’áž“áŸ†áž–áŸáž‰',
      'hedging.caseTitle': 'ážšáž”áŸ€áž”ážŠáŸ‚áž›áž áž¶áž„áž˜áž¶ážŸ áž áŸáž„ ážŠáž¶ážšáŸ‰áž¶ (áž•áŸ’ážŸáž¶ážšáž’áŸ†ážáŸ’áž˜áž¸) áž€áž¶ážšáž–áž¶ážšáž˜áž·áž“áž±áŸ’áž™ážáž¶áž <span class="gold-accent">$3,375.00</span> áž€áŸ’áž“áž»áž„áž…áž»áž„ážŸáž”áŸ’ážáž¶áž áŸ',
      'hedging.caseCol1Title': 'áž›áŸ†áž áž¼ážšáž…áž¼áž›ážáŸ’áž„áŸƒážŸáŸ…ážšáŸ (áž‘áž·áž‰áž˜áž¶ážŸáž…áž¼áž›)',
      'hedging.caseCol1Desc': 'áž“áŸ…ážšážŸáŸ€áž›ážáŸ’áž„áŸƒážŸáŸ…ážšáŸ áž¢ážáž·ážáž·áž‡áž“áž”áž¶áž“áž›áž€áŸ‹áž˜áž¶ážŸáž‚áŸ’ážšáž¿áž„áž…áŸ†áž“áž½áž“ <strong>áŸ¢áŸ  ážáž˜áŸ’áž›áž¹áž„ (áŸ§áŸ¥áŸ .áŸ áŸ  áž€áŸ’ážšáž¶áž˜)</strong> áž˜áž€áž±áŸ’áž™áž áž¶áž„áŸ” áž”áŸáž¡áž¶áž€ážšáž”áž¶áž“áž‘áž¼áž‘áž¶ážáŸ‹áž”áŸ’ážšáž¶áž€áŸ‹ážŸáž»áž‘áŸ’áž’ <strong>$96,000 USD</strong> áž€áŸ’áž“áž»áž„ážáž˜áŸ’áž›áŸƒ $4,800/ážáž˜áŸ’áž›áž¹áž„ (Spot áž–áž·áž—áž–áž›áŸ„áž€ $3,948/oz)áŸ”',
      'hedging.caseCol2Title': 'ážŸáž€áž˜áŸ’áž˜áž—áž¶áž– áŸ¡áŸ  ážœáž·áž“áž¶áž‘áž¸ (Hedging)',
      'hedging.caseCol2Desc': 'áž‡áŸ†áž“áž½ážŸáž±áŸ’áž™áž€áž¶ážšáž”áž¶ážšáž˜áŸ’áž—ážáŸ’áž›áž¶áž…áž˜áž¶ážŸáž’áŸ’áž›áž¶áž€áŸ‹ážáŸ’áž›áŸƒážáŸ’áž„áŸƒáž¢áž¶áž‘áž·ážáŸ’áž™ áž˜áŸ’áž…áž¶ážŸáŸ‹áž áž¶áž„áž”áž¶áž“áž”áž¾áž€ BlueX Terminal áž áž¾áž™áž…áž»áž… <strong>Sell 0.24 Lot XAU/USD</strong> áž›áž¾ MT5 ážŠáž¾áž˜áŸ’áž”áž¸áž…áž¶áž€áŸ‹ážŸáŸ„áž”áŸ’ážšáž¶áž€áŸ‹áž…áŸ†ážŽáŸáž‰áž€áž˜áŸ’ážšáŸƒáž‡áž¾áž„ážŸáž¶ážš $789.80áŸ”',
      'hedging.caseCol3Title': 'áž‘áž¸áž•áŸ’ážŸáž¶ážšáž’áŸ’áž›áž¶áž€áŸ‹áž…áž»áŸ‡ážáŸ’áž„áŸƒáž…áž“áŸ’áž‘ (áž€áž¶ážšáž–áž¶ážš áŸ¡áŸ áŸ %)',
      'hedging.caseCol3Desc': 'áž–áŸ’ážšáž¹áž€ážáŸ’áž„áŸƒáž…áž“áŸ’áž‘ áž˜áŸ‰áŸ„áž„ áŸ¦:áŸ áŸ áŸ– áž–áŸážáŸŒáž˜áž¶áž“áž¢áž“áŸ’ážážšáž‡áž¶ážáž·áž•áŸ’áž‘áž»áŸ‡áž¡áž¾áž„ ážáž˜áŸ’áž›áŸƒáž˜áž¶ážŸáž–áž·áž—áž–áž›áŸ„áž€áž’áŸ’áž›áž¶áž€áŸ‹áž…áž»áŸ‡áž™áŸ‰áž¶áž„áž‚áŸ†áž áž»áž€ <strong>-$140.00/oz</strong>áŸ” áž áž¶áž„ážŠáŸ‚áž›áž˜áž·áž“áž”áž¶áž“ Hedge ážáž¶ážáž”áž„áŸ‹áž›áž¾ážŸáŸ’ážáž»áž€ $3,375áŸ” áž…áŸ†ážŽáŸ‚áž€áž áž¶áž„ áž áŸáž„ ážŠáž¶ážšáŸ‰áž¶ áž‘áž‘áž½áž›áž”áž¶áž“áž”áŸ’ážšáž¶áž€áŸ‹áž…áŸ†ážŽáŸáž‰áž–áž¸ MT5 +$3,360 ážŠáŸ‚áž›áž‘áž¼áž‘áž¶ážáŸ‹áž€áž¶ážšážáž¶ážáž”áž„áŸ‹ážŸáŸ’áž˜áž¾áž‚áŸ’áž“áž¶áž‘áž¶áŸ†áž„ážŸáŸ’ážšáž»áž„áŸ” áž€áž¶ážšážáž¶ážáž”áž„áŸ‹ážŸáž»áž‘áŸ’áž’áŸ– <strong>$0.00</strong>áŸ”',

      // Crash & Rally Simulator (Khmer)
      'hedging.simBadge': 'áž˜áŸ‰áž¶ážŸáŸŠáž¸áž“áž–áž·ážŸáŸ„áž’áž“áŸáž€áž¶ážšáž”áŸ’ážšáŸ‚áž”áŸ’ážšáž½áž›áž‘áž¸áž•áŸ’ážŸáž¶ážšáž‚áŸ†áž áž»áž€',
      'hedging.simTitle': 'áž–áž·ážŸáŸ„áž’áž“áŸážŸáŸ’ážáž»áž€áž˜áž¶ážŸáž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„áž’áŸ€áž”áž“áž¹áž„áž€áž·áž…áŸ’áž…ážŸáž“áŸ’áž™áž¶ážŒáž¸áž‡áž¸ážáž›',
      'hedging.simSubtitle': 'áž–áž·áž“áž·ážáŸ’áž™áž˜áž¾áž›áž•áž›áž”áŸ‰áŸ‡áž–áž¶áž›áŸ‹áž›áž¾áž€áž¶ážšáž‘áž·áž‰áž˜áž¶ážŸ áŸ¡áŸ  ážáž˜áŸ’áž›áž¹áž„ áž”áŸ’ážšážŸáž·áž“áž”áž¾ážáž˜áŸ’áž›áŸƒáž˜áž¶ážŸáž–áž·áž—áž–áž›áŸ„áž€áž’áŸ’áž›áž¶áž€áŸ‹áž…áž»áŸ‡ -$100/oz áž¬áž áž€áŸ‹áž¡áž¾áž„ +$100/oz',
      'hedging.simShockLabel': 'áž‡áŸ’ážšáž¾ážŸážšáž¾ážŸáž‘áŸ†áž áŸ†ážšáž›áž¶áž€áŸ‹áž‘áž¸áž•áŸ’ážŸáž¶ážš:',
      'hedging.simUnhedgedBadge': 'áž áž¶áž„áž”áž»ážšáž¶ážŽážŠáŸ‚áž›áž˜áž·áž“áž”áž¶áž“ HEDGE (ážšáž„áž áž¶áž“áž·áž—áŸáž™áž–áŸáž‰áž›áŸáž‰)',
      'hedging.simUnhedgedTitle': 'áž€áž¶ážšážáž¶ážáž”áž„áŸ‹áž›áž¾ážŸáŸ’ážáž»áž€áž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„',
      'hedging.simRowStockDeval': 'áž€áž¶ážšážáž™áž…áž»áŸ‡ážáž˜áŸ’áž›áŸƒážŸáŸ’ážáž»áž€áž˜áž¶ážŸážšáž¼áž”ážœáž“áŸ’áž:',
      'hedging.simRowDigitalProtect': 'áž€áž¶ážšáž€áž¶ážšáž–áž¶ážšáž–áž¸áž€áž·áž…áŸ’áž…ážŸáž“áŸ’áž™áž¶ážŒáž¸áž‡áž¸ážáž›:',
      'hedging.simRowNetLoss': 'áž›áž‘áŸ’áž’áž•áž›áž…áŸ†ážŽáŸáž‰/ážáž¶ážážŸáž»áž‘áŸ’áž’:',
      'hedging.simHedgedBadge': 'áž–áž·áž’áž¸áž€áž¶ážš BLUEX DELTA-NEUTRAL (áž áž¶áž„áž˜áž¶áž“ HEDGING)',
      'hedging.simHedgedTitle': 'áž›áž‘áŸ’áž’áž•áž›áž˜áž¶áž“áž›áŸ†áž“áž¹áž„ážŸáž»ážœážáŸ’ážáž·áž—áž¶áž– áŸ¡áŸ áŸ %',
      'hedging.simRowDigitalGain': 'áž”áŸ’ážšáž¶áž€áŸ‹áž…áŸ†ážŽáŸáž‰áž–áž¸ MT5 Short Hedge:',
      'hedging.simRowNetFluct': 'áž€áž¶ážšáž”áŸ’ážšáŸ‚áž”áŸ’ážšáž½áž›ážŸáž»áž‘áŸ’áž’:',

      // Progressive 3-Step Navigation (Khmer)
      'hedging.tab1': 'áŸ¡. áž›áŸ†áž áž¼ážšáž‘áž·áž‰-áž›áž€áŸ‹áž“áŸ…ážáž»áž áž¶áž„',
      'hedging.tab2': 'áŸ¢. ážŠáž¾áž˜áž‘áž»áž“ & áž‘áž»áž“áž”áž˜áŸ’ážšáž»áž„ážŸáž»ážœážáŸ’ážáž·áž—áž¶áž–',
      'hedging.tab3': 'áŸ£. ážŸáŸ†áž”áž»ážáŸ’ážšáž”áž‰áŸ’áž‡áž¶ MT4/MT5',
      'hedging.btnNextStep2': 'áž”áž“áŸ’áž‘áž¶áž”áŸ‹áŸ– áž‘áž»áž“áž”áž˜áŸ’ážšáž»áž„ážŸáž»ážœážáŸ’ážáž·áž—áž¶áž– âž”',
      'hedging.btnBackStep1': 'â† ážáŸ’ážšáž¡áž”áŸ‹áž‘áŸ…áž›áŸ†áž áž¼ážšáž‘áž·áž‰-áž›áž€áŸ‹',
      'hedging.btnNextStep3': 'áž˜áž¾áž›ážŸáŸ†áž”áž»ážáŸ’ážšáž”áž‰áŸ’áž‡áž¶ MT5 âž”',

      // Footer
      'footer.copy': 'Â© 2026 BlueX. áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž¢áž áŸ†áž€áž¶ážšážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€áŸ” áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž€áž¶ážšáž‡áž½áž‰ážŠáž¼ážšážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€áŸ” ážšáž€áŸ’ážŸáž¶ážŸáž·áž‘áŸ’áž’áž·áž‚áŸ’ážšáž”áŸ‹áž™áŸ‰áž¶áž„áŸ”'
    }
  };

  // ========================================================
  // 4. FOREX & GOLD LOT SIZE & RISK CALCULATOR ENGINE
  // ========================================================
  const calcPairSelect = document.getElementById('calcPair');
  const calcBalanceInput = document.getElementById('calcBalance');
  const calcStopLossInput = document.getElementById('calcStopLoss');
  const calcRiskPercentInput = document.getElementById('calcRiskPercent');
  const calcStopLossLabel = document.getElementById('calcStopLossLabel');
  const calcStopLossUnit = document.getElementById('calcStopLossUnit');
  const presetBtns = document.querySelectorAll('.preset-btn');

  // Outputs
  const calcLotOutput = document.getElementById('calcLotOutput');
  const calcRiskCashDisplay = document.getElementById('calcRiskCashDisplay');
  const calcCashLossVal = document.getElementById('calcCashLossVal');
  const calcPipVal = document.getElementById('calcPipVal');
  const calcRewardVal = document.getElementById('calcRewardVal');
  const riskSafetyBadge = document.getElementById('riskSafetyBadge');

  // Instrument specifications
  // pipValPerLot = cash value per 1 unit of stop loss for 1 standard lot
  const instruments = {
    XAUUSD: { name: 'Gold', unitName: 'oz Gold', slUnit: 'points', pipValPerLot: 10, contractSize: 100, defaultSL: 30 },
    EURUSD: { name: 'EUR/USD', unitName: 'units', slUnit: 'pips', pipValPerLot: 10, contractSize: 100000, defaultSL: 25 },
    GBPUSD: { name: 'GBP/USD', unitName: 'units', slUnit: 'pips', pipValPerLot: 10, contractSize: 100000, defaultSL: 25 },
    USDJPY: { name: 'USD/JPY', unitName: 'units', slUnit: 'pips', pipValPerLot: 6.70, contractSize: 100000, defaultSL: 25 },
    AUDUSD: { name: 'AUD/USD', unitName: 'units', slUnit: 'pips', pipValPerLot: 10, contractSize: 100000, defaultSL: 20 },
    USDCAD: { name: 'USD/CAD', unitName: 'units', slUnit: 'pips', pipValPerLot: 7.30, contractSize: 100000, defaultSL: 25 },
    GBPJPY: { name: 'GBP/JPY', unitName: 'units', slUnit: 'pips', pipValPerLot: 6.70, contractSize: 100000, defaultSL: 35 },
    BTCUSD: { name: 'Bitcoin', unitName: 'BTC', slUnit: '$ move', pipValPerLot: 1, contractSize: 1, defaultSL: 500 }
  };

  currentLang = safeGetStorage('bluex_lang', 'en');
  const langToggleBtn = document.getElementById('langToggleBtn');
  const langBtnText = document.getElementById('langBtnText');

  function updatePairSpecs() {
    const pair = calcPairSelect ? calcPairSelect.value : 'XAUUSD';
    const spec = instruments[pair] || instruments.XAUUSD;

    if (calcStopLossUnit) {
      calcStopLossUnit.textContent = spec.slUnit;
    }
    if (calcStopLossLabel) {
      calcStopLossLabel.textContent = currentLang === 'km' 
        ? `Stop Loss (${spec.slUnit})` 
        : `Stop Loss (${spec.slUnit.charAt(0).toUpperCase() + spec.slUnit.slice(1)})`;
    }
  }

  function calculateLotSize() {
    if (!calcBalanceInput || !calcStopLossInput || !calcRiskPercentInput) return;

    const balance = Math.max(1, parseFloat(calcBalanceInput.value) || 0);
    const stopLoss = Math.max(0.1, parseFloat(calcStopLossInput.value) || 0);
    const riskPercent = Math.max(0.01, parseFloat(calcRiskPercentInput.value) || 0);
    const pair = calcPairSelect ? calcPairSelect.value : 'XAUUSD';
    const spec = instruments[pair] || instruments.XAUUSD;

    // 1. Calculate maximum allowed cash loss
    const cashRisk = balance * (riskPercent / 100);

    // 2. Calculate standard lot size: CashRisk / (SL * PipValuePerLot)
    let calculatedLots = cashRisk / (stopLoss * spec.pipValPerLot);
    
    // Clamp to minimum 0.01 lot
    if (calculatedLots < 0.01) {
      calculatedLots = 0.01;
    }

    // Format lot size
    const lotDisplay = calculatedLots >= 10 ? calculatedLots.toFixed(1) : calculatedLots.toFixed(2);
    if (calcLotOutput) calcLotOutput.textContent = lotDisplay;

    // 3. Update cash risk display
    if (calcRiskCashDisplay) {
      calcRiskCashDisplay.textContent = `$${cashRisk.toFixed(2)} ${currentLang === 'km' ? 'áž áž¶áž“áž·áž—áŸáž™ážŸáž¶áž…áŸ‹áž”áŸ’ážšáž¶áž€áŸ‹' : 'cash risk'}`;
    }

    // 4. Max Cash Loss
    const actualCashLoss = calculatedLots * stopLoss * spec.pipValPerLot;
    if (calcCashLossVal) {
      calcCashLossVal.textContent = `$${actualCashLoss.toFixed(2)}`;
    }

    // 5. Point / Pip Value for this specific position
    const totalPipVal = calculatedLots * spec.pipValPerLot;
    if (calcPipVal) {
      calcPipVal.textContent = `$${totalPipVal.toFixed(2)}`;
    }

    // 6. Asymmetric 1:3 Target Profit (Rule of Thumb)
    const targetReward = actualCashLoss * 3;
    if (calcRewardVal) {
      calcRewardVal.textContent = `+$${targetReward.toFixed(2)}`;
    }

    // 7. Risk Safety Badge Logic
    if (riskSafetyBadge) {
      if (riskPercent <= 1.0) {
        riskSafetyBadge.innerHTML = `
          <span class="badge-dot green"></span>
          <span>${currentLang === 'km' ? 'áž áž¶áž“áž·áž—áŸáž™áž˜áž¶áž“ážœáž·áž“áŸáž™' : 'Disciplined Risk'}</span>
        `;
        riskSafetyBadge.style.borderColor = 'rgba(212, 255, 0, 0.4)';
        riskSafetyBadge.style.background = 'rgba(212, 255, 0, 0.08)';
        riskSafetyBadge.style.color = '#d4ff00';
      } else if (riskPercent <= 2.0) {
        riskSafetyBadge.innerHTML = `
          <span class="badge-dot" style="background:#ffb800; box-shadow:0 0 10px #ffb800;"></span>
          <span>${currentLang === 'km' ? 'áž áž¶áž“áž·áž—áŸáž™áž€áž˜áŸ’ážšáž·ážáž˜áž’áŸ’áž™áž˜' : 'Moderate Risk'}</span>
        `;
        riskSafetyBadge.style.borderColor = 'rgba(255, 184, 0, 0.4)';
        riskSafetyBadge.style.background = 'rgba(255, 184, 0, 0.08)';
        riskSafetyBadge.style.color = '#ffb800';
      } else {
        riskSafetyBadge.innerHTML = `
          <span class="badge-dot" style="background:#ef4444; box-shadow:0 0 10px #ef4444;"></span>
          <span>${currentLang === 'km' ? 'áž áž¶áž“áž·áž—áŸáž™ážáŸ’áž–ážŸáŸ‹ - ážáž»ážŸáž€áŸ’áž”áž½áž“' : 'High Risk Violation'}</span>
        `;
        riskSafetyBadge.style.borderColor = 'rgba(239, 68, 68, 0.4)';
        riskSafetyBadge.style.background = 'rgba(239, 68, 68, 0.08)';
        riskSafetyBadge.style.color = '#ef4444';
      }
    }
  }

  // ========================================================
  // 3. COMPLETE KHMER & ENGLISH LOCALIZATION ENGINE
  // ========================================================
  function switchLanguage(lang) {
    currentLang = lang;
    document.documentElement.setAttribute('lang', lang);

    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key] !== undefined) {
        el.innerHTML = translations[lang][key];
      }
    });

    if (langBtnText) {
      langBtnText.textContent = lang === 'km' ? 'English' : 'ážáŸ’áž˜áŸ‚ážš';
    }

    if (typeof updateFxButtonTexts === 'function') {
      updateFxButtonTexts();
    }

    // Update calculator dynamic labels/status
    updatePairSpecs();
    calculateLotSize();
    if (typeof window.recalcGoldHedging === 'function') {
      window.recalcGoldHedging();
    }

    safeSetStorage('bluex_lang', lang);
  }

  // Apply initial language
  switchLanguage(currentLang);

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      const nextLang = currentLang === 'en' ? 'km' : 'en';
      switchLanguage(nextLang);
    });
  }

  // Preset Buttons Event Listeners (0.5%, 1.0%, 2.0%)
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const riskVal = btn.getAttribute('data-risk');
      if (calcRiskPercentInput) {
        calcRiskPercentInput.value = riskVal;
      }
      calculateLotSize();
    });
  });

  // Input listeners
  if (calcPairSelect) {
    calcPairSelect.addEventListener('change', () => {
      const pair = calcPairSelect.value;
      const spec = instruments[pair];
      if (spec && calcStopLossInput) {
        calcStopLossInput.value = spec.defaultSL;
      }
      updatePairSpecs();
      calculateLotSize();
    });
  }

  if (calcBalanceInput) calcBalanceInput.addEventListener('input', calculateLotSize);
  if (calcStopLossInput) calcStopLossInput.addEventListener('input', calculateLotSize);
  if (calcRiskPercentInput) {
    calcRiskPercentInput.addEventListener('input', () => {
      const cur = parseFloat(calcRiskPercentInput.value);
      presetBtns.forEach(b => {
        if (parseFloat(b.getAttribute('data-risk')) === cur) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
      calculateLotSize();
    });
  }

  // Initial Calculation Run
  updatePairSpecs();
  calculateLotSize();

  // ========================================================
  // 4B. GOLD & SILVER HEDGING PROTOCOL REAL-TIME CALCULATOR ENGINE
  // ========================================================
  function initGoldHedgingCalculator() {
    const hedgeWeightInput = document.getElementById('hedgeWeightInput');
    const hedgeWeightSlider = document.getElementById('hedgeWeightSlider');
    const hedgeUnitSelect = document.getElementById('hedgeUnitSelect');
    const hedgeSpotInput = document.getElementById('hedgeSpotInput');
    const hedgeLeverageSelect = document.getElementById('hedgeLeverageSelect');
    const hedgeBufferSelect = document.getElementById('hedgeBufferSelect');
    const localPremiumInput = document.getElementById('localPremiumInput');
    const hedgeAccountBalanceInput = document.getElementById('hedgeAccountBalanceInput');
    const dirBuyGold = document.getElementById('dirBuyGold');
    const dirSellGold = document.getElementById('dirSellGold');
    const metalSwitchGold = document.getElementById('metalSwitchGold');
    const metalSwitchSilver = document.getElementById('metalSwitchSilver');
    const btnRefreshSpot = document.getElementById('btnRefreshSpot');
    const btnDepositGuide = document.getElementById('btnDepositGuide');
    const deskUnitBtns = document.querySelectorAll('.desk-unit-btn');
    const deskChipPresets = document.querySelectorAll('.desk-chip-preset');
    const simScenarioBtns = document.querySelectorAll('.sim-scenario-btn');

    if (!hedgeWeightInput || !hedgeSpotInput || !hedgeLeverageSelect) return;

    let currentHedgeMetal = 'XAU';
    let currentHedgeDirection = 'BUY_PHYSICAL';
    let currentHedgeBuffer = 100;
    let currentSimDelta = -150;

    const cachedLivePrices = {
      XAU: 3937.05,
      XAG: 50.15
    };

    // Gram conversion factors
    const gramsPerUnit = {
      damlung: 37.5,
      chi: 3.75,
      grams: 1.0,
      ounces: 31.1034768,
      kilograms: 1000.0
    };

    const unitNamesKhmer = {
      damlung: 'ážáž˜áŸ’áž›áž¹áž„',
      chi: 'áž‡áž¸',
      grams: 'áž€áŸ’ážšáž¶áž˜',
      ounces: 'Troy Ounces',
      kilograms: 'áž‚áž¸áž¡áž¼'
    };

    // 1. Live Market Spot Price Fetcher
    async function fetchLiveSpotPrice(metal = currentHedgeMetal, isUserClick = false) {
      if (btnRefreshSpot && isUserClick) btnRefreshSpot.classList.add('loading');

      try {
        let spotPrice = null;
        const apiUrl = `https://api.gold-api.com/price/${metal}`;
        
        try {
          const res = await fetch(apiUrl, { cache: 'no-store' });
          if (res.ok) {
            const data = await res.json();
            if (data && typeof data.price === 'number') {
              spotPrice = data.price;
            }
          }
        } catch (apiErr) {
          console.warn('[BlueX Hedging] Primary gold-api failed, testing fallback...', apiErr);
        }

        // Fallback for Gold: Binance PAXGUSDT
        if (!spotPrice && metal === 'XAU') {
          try {
            const binanceRes = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=PAXGUSDT', { cache: 'no-store' });
            if (binanceRes.ok) {
              const binanceData = await binanceRes.json();
              if (binanceData && binanceData.price) {
                spotPrice = parseFloat(binanceData.price);
              }
            }
          } catch (binanceErr) {
            console.warn('[BlueX Hedging] Binance fallback failed:', binanceErr);
          }
        }

        if (spotPrice && !isNaN(spotPrice) && spotPrice > 0) {
          cachedLivePrices[metal] = spotPrice;
          if (currentHedgeMetal === metal) {
            hedgeSpotInput.value = spotPrice.toFixed(2);
            const livePriceDisplay = document.getElementById('liveSpotPriceDisplay');
            if (livePriceDisplay) {
              livePriceDisplay.textContent = `${spotPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }
          }
        }
      } catch (err) {
        console.error('[BlueX Hedging] Spot fetch error:', err);
      } finally {
        if (btnRefreshSpot) btnRefreshSpot.classList.remove('loading');
        calculateGoldHedging();
      }
    }

    // 2. Main Institutional Hedging Math Execution Engine
    function calculateGoldHedging() {
      const weight = parseFloat(hedgeWeightInput.value) || 0;
      const unit = (hedgeUnitSelect ? hedgeUnitSelect.value : 'damlung') || 'damlung';
      const spot = parseFloat(hedgeSpotInput.value) || cachedLivePrices[currentHedgeMetal];
      const leverage = parseFloat(hedgeLeverageSelect.value) || 100;
      const buffer = hedgeBufferSelect ? (parseFloat(hedgeBufferSelect.value) || currentHedgeBuffer) : currentHedgeBuffer;
      const premium = localPremiumInput ? (parseFloat(localPremiumInput.value) || 0) : 30;
      const userBalance = hedgeAccountBalanceInput ? (parseFloat(hedgeAccountBalanceInput.value) || 0) : 10000;

      // Metal specifications
      const isXAU = currentHedgeMetal === 'XAU';
      const contractSize = isXAU ? 100 : 5000;
      const metalSymbol = isXAU ? 'XAU/USD' : 'XAG/USD';
      const metalLabelKhmer = isXAU ? 'áž˜áž¶ážŸ' : 'áž”áŸ’ážšáž¶áž€áŸ‹';
      const metalLabelEn = isXAU ? 'Gold' : 'Silver';
      const isBuy = currentHedgeDirection === 'BUY_PHYSICAL';

      // Weight conversions
      const totalGrams = weight * (gramsPerUnit[unit] || 37.5);
      const troyOunces = totalGrams / 31.1034768;
      const exactLots = troyOunces / contractSize;
      let brokerLots = Math.round(exactLots * 100) / 100;
      if (brokerLots === 0 && exactLots > (isXAU ? 0.005 : 0.0002)) {
        brokerLots = 0.01;
      }

      // Local Cambodian Counter Valuations
      const damlungMultiplier = 37.5 / 31.1034768; // 1.205653 Troy Oz per Damlung
      const baseDamlungSpot = spot * damlungMultiplier;
      const pricePerDamlung = baseDamlungSpot + (isXAU ? premium : (premium / 15));
      const pricePerChi = pricePerDamlung / 10;
      const totalDamlungCount = totalGrams / 37.5;
      const totalShopPhysicalValue = totalDamlungCount * pricePerDamlung;

      // Update Local Cambodian Card
      const elPricePerDamlung = document.getElementById('dispPricePerDamlung');
      const elPricePerChi = document.getElementById('dispPricePerChi');
      const elTroyOunces = document.getElementById('dispTroyOunces');
      const elTotalPhysicalValue = document.getElementById('dispTotalPhysicalValue');

      if (elPricePerDamlung) elPricePerDamlung.textContent = `${pricePerDamlung.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      if (elPricePerChi) elPricePerChi.textContent = `${pricePerChi.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      if (elTroyOunces) elTroyOunces.textContent = `${troyOunces.toFixed(2)} oz`;
      if (elTotalPhysicalValue) elTotalPhysicalValue.textContent = `${totalShopPhysicalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

      // Financial Valuations
      const marginUSD = brokerLots > 0 ? ((brokerLots * contractSize * spot) / leverage) : 0;
      const bufferUSD = brokerLots * contractSize * buffer;
      const safeCapitalUSD = marginUSD + bufferUSD;

      // Update Left Column Dynamic Header
      const elUnitHeader = document.getElementById('dispUnitHeaderName');
      const elQuantityVal = document.getElementById('dispQuantityValText');
      if (elUnitHeader) {
        elUnitHeader.textContent = `${metalSymbol} ${unit.toUpperCase()} / ${weight} ${unitNamesKhmer[unit] || unit}`;
      }
      if (elQuantityVal) {
        elQuantityVal.textContent = `${weight} ${unit.charAt(0).toUpperCase() + unit.slice(1)}`;
      }

      // Update Right Column Directive
      const netPill = document.getElementById('directiveNetPill');
      const headline = document.getElementById('hedgeActionHeadline');
      const reason = document.getElementById('hedgeActionReason');
      const elLots = document.getElementById('resStandardLots');
      const elMargin = document.getElementById('dispMarginRequired');
      const elSafeCap = document.getElementById('cardSafeCapital');
      const elWeight = document.getElementById('dispConvertedWeight');
      const elMathProof = document.getElementById('mathProofSteps');
      const btnTicket = document.getElementById('btnDispatchTicket');

      if (netPill) {
        if (isBuy) {
          netPill.className = 'directive-net-pill long';
          netPill.textContent = `NET ${metalSymbol} INVENTORY: LONG`;
        } else {
          netPill.className = 'directive-net-pill short';
          netPill.textContent = `NET ${metalSymbol} INVENTORY: SHORT`;
        }
      }

      if (headline) {
        if (isBuy) {
          headline.className = 'hero-cmd-text text-danger';
          headline.textContent = `SELL ${brokerLots.toFixed(2)} LOTS ${metalSymbol}`;
        } else {
          headline.className = 'hero-cmd-text text-cyan';
          headline.textContent = `BUY ${brokerLots.toFixed(2)} LOTS ${metalSymbol}`;
        }
      }

      if (reason) {
        if (isBuy) {
          reason.textContent = `Shop holds physical ${metalLabelEn.toLowerCase()} in showcase/safe. Open Digital Short to neutralize spot market price drops.`;
        } else {
          reason.textContent = `Physical ${metalLabelEn.toLowerCase()} sold from showcase/safe. Open Digital Long to protect replenishment inventory purchase.`;
        }
      }

      if (elLots) elLots.textContent = `${brokerLots.toFixed(2)} Lots`;
      if (elMargin) elMargin.textContent = `${marginUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      if (elSafeCap) elSafeCap.textContent = `${safeCapitalUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      if (elWeight) elWeight.textContent = `${totalGrams.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} g / ${troyOunces.toFixed(2)} oz`;

      if (elMathProof) {
        const damlungDivisor = (contractSize / damlungMultiplier).toFixed(2);
        elMathProof.textContent = `Lots = ${weight} ${unit.charAt(0).toUpperCase() + unit.slice(1)} Ã· ${damlungDivisor} = ${exactLots.toFixed(4)} Lots â†’ ${brokerLots.toFixed(2)} Lots MT4/MT5 (${metalSymbol})`;
      }

      if (btnTicket) {
        const actionStr = isBuy ? 'SELL' : 'BUY';
        btnTicket.href = `https://t.me/MongsayFX?text=BlueX%20Hedging%20Desk%3A%20${actionStr}%20${brokerLots.toFixed(2)}%20LOTS%20${metalSymbol}%20for%20${weight}%20${unit}`;
      }

      // Update Bottom Advisory Card
      const elRecDeposit = document.getElementById('dispAdvisoryRecDeposit');
      const elDiagPill = document.getElementById('cardAccountDiagPill');
      const elDiagText = document.getElementById('diagnosticExplanationText');

      if (elRecDeposit) {
        elRecDeposit.textContent = `${safeCapitalUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }

      if (elDiagPill && elDiagText) {
        if (userBalance >= safeCapitalUSD) {
          elDiagPill.className = 'account-diagnostic-pill';
          elDiagPill.textContent = 'CAPITAL FULLY PROTECTED';
          elDiagText.textContent = `ðŸŸ¢ Safe Capital: Your balance safely covers required margin plus more than ${buffer}/oz market swing against your hedge. Zero liquidation risk.`;
        } else if (userBalance >= marginUSD) {
          const shortfall = safeCapitalUSD - userBalance;
          elDiagPill.className = 'account-diagnostic-pill status-tight';
          elDiagPill.textContent = 'TIGHT MARGIN BUFFER';
          elDiagText.textContent = `ðŸŸ¡ Tight Buffer: Position can open, but buffer is slim. Deposit ${shortfall.toFixed(2)} more to reach full Â±${buffer}/oz protection.`;
        } else {
          elDiagPill.className = 'account-diagnostic-pill status-danger';
          elDiagPill.textContent = 'INSUFFICIENT BALANCE';
          elDiagText.textContent = `ðŸ”´ Insufficient Capital: Cannot execute ${brokerLots.toFixed(2)} Lots. Minimum initial margin required is ${marginUSD.toFixed(2)} USD.`;
        }
      }

      // Re-run crash test simulator
      runCrashSimulation(currentSimDelta);
    }

    // 3. Dynamic Market Volatility Stress-Test Simulator Engine
    function runCrashSimulation(deltaPrice) {
      currentSimDelta = deltaPrice;
      const weight = parseFloat(hedgeWeightInput.value) || 0;
      const unit = (hedgeUnitSelect ? hedgeUnitSelect.value : 'damlung') || 'damlung';
      const isXAU = currentHedgeMetal === 'XAU';
      const contractSize = isXAU ? 100 : 5000;
      const isBuy = currentHedgeDirection === 'BUY_PHYSICAL';
      const currentLang = document.documentElement.getAttribute('lang') || 'en';

      const totalGrams = weight * (gramsPerUnit[unit] || 37.5);
      const troyOunces = totalGrams / 31.1034768;
      const exactLots = troyOunces / contractSize;
      let brokerLots = Math.round(exactLots * 100) / 100;
      if (brokerLots === 0 && exactLots > (isXAU ? 0.005 : 0.0002)) brokerLots = 0.01;

      // Physical gold value delta
      const physicalDiff = troyOunces * deltaPrice;

      // Digital hedge trade delta
      const digitalDiff = isBuy ? (brokerLots * contractSize * (-deltaPrice)) : (brokerLots * contractSize * deltaPrice);

      // Net impact
      const unhedgedNet = physicalDiff;
      const hedgedNet = physicalDiff + digitalDiff;

      const elSimUnhedgedPhysical = document.getElementById('simUnhedgedPhysicalDiff');
      const elSimUnhedgedNet = document.getElementById('simUnhedgedNet');
      const elSimHedgedPhysical = document.getElementById('simHedgedPhysicalDiff');
      const elSimHedgedDigital = document.getElementById('simHedgedDigitalDiff');
      const elSimHedgedNet = document.getElementById('simHedgedNet');
      const elSimUnhedgedVerdict = document.getElementById('simUnhedgedVerdict');
      const elSimHedgedVerdict = document.getElementById('simHedgedVerdict');

      if (elSimUnhedgedPhysical) {
        elSimUnhedgedPhysical.textContent = (physicalDiff >= 0 ? '+' : '-') + `${Math.abs(physicalDiff).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
      }
      if (elSimUnhedgedNet) {
        elSimUnhedgedNet.textContent = (unhedgedNet >= 0 ? '+' : '-') + `${Math.abs(unhedgedNet).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${unhedgedNet >= 0 ? 'Gain' : 'Capital Loss'}`;
      }
      if (elSimHedgedPhysical) {
        elSimHedgedPhysical.textContent = (physicalDiff >= 0 ? '+' : '-') + `${Math.abs(physicalDiff).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
      }
      if (elSimHedgedDigital) {
        elSimHedgedDigital.textContent = (digitalDiff >= 0 ? '+' : '-') + `${Math.abs(digitalDiff).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
      }
      if (elSimHedgedNet) {
        elSimHedgedNet.textContent = `${Math.abs(hedgedNet).toFixed(2)} Net Difference (${currentLang === 'km' ? 'áž€áž¶ážšáž–áž¶ážš áŸ¡áŸ áŸ %' : '100% Protected'})`;
      }

      if (elSimUnhedgedVerdict && elSimHedgedVerdict) {
        if (deltaPrice < 0) {
          elSimUnhedgedVerdict.textContent = currentLang === 'km'
            ? `áž€áž¶ážšáž’áŸ’áž›áž¶áž€áŸ‹áž…áž»áŸ‡ ${Math.abs(deltaPrice)}/oz áž”áž¶áž“áž›áŸáž”ážáŸ’ážšáž”áž¶áž€áŸ‹áž™áž€áž”áŸ’ážšáž¶áž€áŸ‹áž…áŸ†ážŽáŸáž‰ áž“áž·áž„áž”áž¶áž“áž”áŸ†áž•áŸ’áž›áž¶áž‰ážŠáž¾áž˜áž‘áž»áž“áž¢áž¶áž‡áž¸ážœáž€áž˜áŸ’áž˜ážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€áž¢ážŸáŸ‹ ${Math.abs(unhedgedNet).toFixed(2)} USD áž—áŸ’áž›áž¶áž˜áŸ—!`
            : `The ${Math.abs(deltaPrice)}/oz drop wiped out your retail spread profit and destroyed ${Math.abs(unhedgedNet).toFixed(2)} USD of core business capital!`;
          elSimHedgedVerdict.innerHTML = currentLang === 'km'
            ? `áž‚áŸ’áž˜áž¶áž“áž€áž¶ážšážáž¶ážáž”áž„áŸ‹áž¡áž¾áž™! áž”áž‰áŸ’áž‡áž¶ MT5 Short áž”áž¶áž“áž•áŸ’ážáž›áŸ‹áž•áž›áž…áŸ†ážŽáŸáž‰áž˜áž€ážœáž·áž‰áž…áŸ†áž“áž½áž“ <strong>+${Math.abs(digitalDiff).toFixed(2)} USD</strong> ážŸáŸ’áž˜áž¾áž“áž¹áž„áž€áž¶ážšážáž¶ážážšáž¼áž”ážœáž“áŸ’ážáž”áŸáŸ‡áž”áž·áž‘áŸ” áž”áŸ’ážšáž¶áž€áŸ‹áž…áŸ†ážŽáŸáž‰áž áž¶áž„ážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€ážáŸ’ážšáž¼ážœáž”áž¶áž“áž€áž¶ážšáž–áž¶ážš áŸ¡áŸ áŸ %! ðŸ†`
            : `Zero loss! The digital short generated <strong>+${Math.abs(digitalDiff).toFixed(2)} USD</strong> to offset the physical drop dollar-for-dollar. Your counter profit is 100% secure in your bank account! ðŸ†`;
        } else {
          elSimUnhedgedVerdict.textContent = currentLang === 'km'
            ? `áž˜áž¶ážŸáž¡áž¾áž„ážáŸ’áž›áŸƒ ${deltaPrice}/oz áž”áŸ‰áž»áž“áŸ’ážáŸ‚áž€áž¶ážšážšáž„áŸ‹áž…áž¶áŸ†áž‘áž·áž‰áž”áŸ†áž–áŸáž‰ážŸáŸ’ážáž»áž€áž¡áž¾áž„ážœáž·áž‰áž“áž¹áž„ážáŸ’ážšáž¼ážœáž…áŸ†ážŽáž¶áž™ážáŸ’áž›áŸƒážŠáž¾áž˜ážáŸ’áž–ážŸáŸ‹áž‡áž¶áž„áž˜áž»áž“ ${Math.abs(physicalDiff).toFixed(2)} USD!`
            : `Gold gained ${deltaPrice}/oz, but replenishing sold inventory now costs ${Math.abs(physicalDiff).toFixed(2)} USD more out of pocket!`;
          elSimHedgedVerdict.innerHTML = currentLang === 'km'
            ? `ážáž»áž›áŸ’áž™áž—áž¶áž– Delta-Neutral ážšáž€áŸ’ážŸáž¶ážŠáž¾áž˜áž‘áž»áž“áž”áŸ†áž–áŸáž‰ážŸáŸ’ážáž»áž€áž”áž¶áž“ážŸáŸ’áž˜áž¾ áŸ¡áŸ áŸ % ážŠáŸ„áž™áž‚áŸ’áž˜áž¶áž“áž€áž¶ážšáž”áŸ’ážšáŸ‚áž”áŸ’ážšáž½áž›áž¡áž¾áž™áŸ” ðŸ†`
            : `Delta-Neutral balance neutralized replenishment cost perfectly. Total price risk =   // ========================================================
  // 4B. GOLD & SILVER HEDGING PROTOCOL REAL-TIME CALCULATOR ENGINE
  // ========================================================
  function initGoldHedgingCalculator() {
    const hedgeWeightInput = document.getElementById('hedgeWeightInput');
    const hedgeUnitSelect = document.getElementById('hedgeUnitSelect');
    const hedgeSpotInput = document.getElementById('hedgeSpotInput');
    const hedgeLeverageSelect = document.getElementById('hedgeLeverageSelect');
    const hedgeLocalDamlungInput = document.getElementById('hedgeLocalDamlungInput');
    const hedgeAccountBalanceInput = document.getElementById('hedgeAccountBalanceInput');
    const dirBuyGold = document.getElementById('dirBuyGold');
    const dirSellGold = document.getElementById('dirSellGold');
    const metalSwitchGold = document.getElementById('metalSwitchGold');
    const metalSwitchSilver = document.getElementById('metalSwitchSilver');
    const btnRefreshSpot = document.getElementById('btnRefreshSpot');
    const btnSyncLocalRate = document.getElementById('btnSyncLocalRate');
    const btnAutoFillSafeBalance = document.getElementById('btnAutoFillSafeBalance');
    const btnCopyTicket = document.getElementById('btnCopyTicket');
    const btnToggleDetails = document.getElementById('btnToggleDetails');
    const curBtnUSD = document.getElementById('curBtnUSD');
    const curBtnKHR = document.getElementById('curBtnKHR');
    const bufferChips = document.querySelectorAll('.chip-buffer, .btn-buffer-chip');
    const shopPresetChips = document.querySelectorAll('.chip-preset, .btn-shop-preset');
    const simScenarioBtns = document.querySelectorAll('.sim-scenario-btn');

    if (!hedgeWeightInput || !hedgeUnitSelect || !hedgeSpotInput || !hedgeLeverageSelect) return;

    let currentHedgeMetal = 'XAU';
    let currentHedgeDirection = 'BUY_PHYSICAL';
    let currentHedgeBuffer = 100;
    let currentCurrency = 'USD';
    let currentSimDelta = -150;
    const KHR_RATE = 4080;

    const cachedLivePrices = {
      XAU: 3948.50,
      XAG: 50.15
    };

    // Gram conversion factors
    const gramsPerUnit = {
      damlung: 37.5,
      chi: 3.75,
      grams: 1.0,
      ounces: 31.1034768,
      kilograms: 1000.0
    };

    const unitNamesKhmer = {
      damlung: 'ážáž˜áŸ’áž›áž¹áž„',
      chi: 'áž‡áž¸',
      grams: 'áž€áŸ’ážšáž¶áž˜',
      ounces: 'Troy Ounces',
      kilograms: 'áž‚áž¸áž¡áž¼áž€áŸ’ážšáž¶áž˜'
    };

    // 1. Live Market Spot Price Fetcher
    async function fetchLiveSpotPrice(metal = currentHedgeMetal, isUserClick = false) {
      if (btnRefreshSpot && isUserClick) btnRefreshSpot.classList.add('loading');

      try {
        let spotPrice = null;
        const apiUrl = `https://api.gold-api.com/price/${metal}`;
        
        try {
          const res = await fetch(apiUrl, { cache: 'no-store' });
          if (res.ok) {
            const data = await res.json();
            if (data && typeof data.price === 'number') {
              spotPrice = data.price;
            }
          }
        } catch (apiErr) {
          console.warn('[BlueX Hedging] Primary gold-api failed, testing fallback...', apiErr);
        }

        // Fallback for Gold: Binance PAXGUSDT
        if (!spotPrice && metal === 'XAU') {
          try {
            const binanceRes = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=PAXGUSDT', { cache: 'no-store' });
            if (binanceRes.ok) {
              const binanceData = await binanceRes.json();
              if (binanceData && binanceData.price) {
                spotPrice = parseFloat(binanceData.price);
              }
            }
          } catch (binanceErr) {
            console.warn('[BlueX Hedging] Binance fallback failed:', binanceErr);
          }
        }

        if (spotPrice && !isNaN(spotPrice) && spotPrice > 0) {
          cachedLivePrices[metal] = spotPrice;
          if (currentHedgeMetal === metal) {
            hedgeSpotInput.value = spotPrice.toFixed(2);
            const livePriceDisplay = document.getElementById('liveSpotPriceDisplay');
            if (livePriceDisplay) {
              livePriceDisplay.textContent = `$${spotPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }
            const liveTimestamp = document.getElementById('liveFeedTimestamp');
            if (liveTimestamp) {
              const now = new Date();
              liveTimestamp.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            }
            if (hedgeLocalDamlungInput && (!hedgeLocalDamlungInput.value || isUserClick)) {
              syncLocalRateWithSpot();
            }
          }
        }
      } catch (err) {
        console.error('[BlueX Hedging] Spot fetch error:', err);
      } finally {
        if (btnRefreshSpot) btnRefreshSpot.classList.remove('loading');
        calculateGoldHedging();
      }
    }

    function syncLocalRateWithSpot() {
      if (!hedgeLocalDamlungInput) return;
      const spot = parseFloat(hedgeSpotInput.value) || cachedLivePrices[currentHedgeMetal];
      const pureDamlungValue = spot * 1.205653;
      const retailMarkup = currentHedgeMetal === 'XAU' ? 40 : 2;
      const localQuote = pureDamlungValue + retailMarkup;
      hedgeLocalDamlungInput.value = localQuote.toFixed(2);
      updateChiDisplay();
    }

    function updateChiDisplay() {
      const dispChi = document.getElementById('dispPricePerChi');
      if (dispChi && hedgeLocalDamlungInput) {
        const localDamlung = parseFloat(hedgeLocalDamlungInput.value) || 0;
        dispChi.textContent = (localDamlung / 10).toFixed(2);
      }
    }

    // 2. Main Institutional Hedging Math Execution Engine
    function calculateGoldHedging() {
      const weight = parseFloat(hedgeWeightInput.value) || 0;
      const unit = hedgeUnitSelect.value || 'damlung';
      const spot = parseFloat(hedgeSpotInput.value) || cachedLivePrices[currentHedgeMetal];
      const leverage = parseFloat(hedgeLeverageSelect.value) || 200;
      const buffer = currentHedgeBuffer;
      const localDamlungPrice = hedgeLocalDamlungInput ? (parseFloat(hedgeLocalDamlungInput.value) || 0) : 0;
      const userBalance = hedgeAccountBalanceInput ? (parseFloat(hedgeAccountBalanceInput.value) || 0) : 0;

      updateChiDisplay();

      // Metal specifications
      const isXAU = currentHedgeMetal === 'XAU';
      const contractSize = isXAU ? 100 : 5000;
      const metalSymbol = isXAU ? 'XAU/USD' : 'XAG/USD';
      const metalLabelKhmer = isXAU ? 'áž˜áž¶ážŸ' : 'áž”áŸ’ážšáž¶áž€áŸ‹';
      const metalLabelEn = isXAU ? 'Gold' : 'Silver';

      const totalGrams = weight * (gramsPerUnit[unit] || 37.5);
      const troyOunces = totalGrams / 31.1034768;
      const exactLots = troyOunces / contractSize;
      let brokerLots = Math.round(exactLots * 100) / 100;
      if (brokerLots === 0 && exactLots > (isXAU ? 0.005 : 0.0002)) {
        brokerLots = 0.01;
      }

      // Financial Valuation
      const notionalUSD = troyOunces * spot;
      const marginUSD = brokerLots > 0 ? ((brokerLots * contractSize * spot) / leverage) : 0;
      const bufferUSD = brokerLots * contractSize * buffer;
      const safeCapitalUSD = marginUSD + bufferUSD;

      // Residual calculation
      const hedgedGrams = brokerLots * contractSize * 31.1034768;
      const residualGrams = Math.abs(totalGrams - hedgedGrams);
      const residualDamlung = residualGrams / 37.5;
      const residualChi = residualGrams / 3.75;

      // Local Cambodian Cash vs Digital Hedge Margin
      const totalDamlungCount = totalGrams / 37.5;
      const physicalCashTotal = totalDamlungCount * localDamlungPrice;
      const digitalSpotTotal = notionalUSD;
      const isBuy = currentHedgeDirection === 'BUY_PHYSICAL';
      const lockedProfit = Math.abs(physicalCashTotal - digitalSpotTotal);

      // Stop-Out Liquidation Calculation
      let stopOutSpot = 0;
      let stopOutDistance = 0;
      if (brokerLots > 0 && userBalance > 0) {
        const availableLossUSD = userBalance - (0.5 * marginUSD);
        stopOutDistance = availableLossUSD / (brokerLots * contractSize);
        if (isBuy) {
          stopOutSpot = spot + stopOutDistance;
        } else {
          stopOutSpot = Math.max(0, spot - stopOutDistance);
        }
      }

      // DOM Updates
      const currentLang = document.documentElement.getAttribute('lang') || 'en';

      // Action Recommendation Banner
      const banner = document.getElementById('hedgeActionBanner');
      const actionPill = document.getElementById('ticketActionType');
      const headline = document.getElementById('hedgeActionHeadline');
      const reason = document.getElementById('hedgeActionReason');
      const resStandardLots = document.getElementById('resStandardLots');
      const quickLotsText = document.getElementById('quickLotsText');
      const quickCashTotal = document.getElementById('quickCashTotal');

      if (resStandardLots) resStandardLots.textContent = brokerLots.toFixed(2);
      if (quickLotsText) quickLotsText.textContent = `${brokerLots.toFixed(2)} Lots ${metalSymbol}`;
      if (quickCashTotal) quickCashTotal.textContent = `$${physicalCashTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

      const mobileJumpLots = document.getElementById('mobileJumpLots');
      if (mobileJumpLots) {
        mobileJumpLots.textContent = (isBuy ? (currentLang === 'km' ? 'áž›áž€áŸ‹ ' : 'Sell ') : (currentLang === 'km' ? 'áž‘áž·áž‰ ' : 'Buy ')) + `${brokerLots.toFixed(2)} Lots`;
      }

      if (banner && headline && reason) {
        if (isBuy) {
          banner.classList.remove('action-buy');
          if (actionPill) actionPill.textContent = currentLang === 'km' ? 'áž”áž‰áŸ’áž‡áž¶áž›áž€áŸ‹ / SHORT HEDGE' : 'SHORT HEDGE EXECUTION';
          headline.innerHTML = currentLang === 'km'
            ? `áž›áž€áŸ‹ <span class="gold-accent">${brokerLots.toFixed(2)}</span> LOTS ${metalSymbol}`
            : `SELL <span class="gold-accent">${brokerLots.toFixed(2)}</span> LOTS ${metalSymbol}`;
          reason.textContent = currentLang === 'km'
            ? `ážŸáŸ’ážáž»áž€${metalLabelKhmer}áž€áŸ’áž“áž»áž„áž áž¶áž„áž€áž¾áž“áž¡áž¾áž„ ${totalGrams.toFixed(2)}g (${weight} ${unitNamesKhmer[unit] || unit})áŸ” áž”áž¾áž€ Digital SHORT ážŠáž¾áž˜áŸ’áž”áž¸áž€áž¶ážšáž–áž¶ážšáž€áž¶ážšáž’áŸ’áž›áž¶áž€áŸ‹ážáŸ’áž›áŸƒáž“áŸƒážŸáŸ’ážáž»áž€áŸ”`
            : `Physical ${metalLabelEn} inventory increased by ${totalGrams.toFixed(2)}g (${weight} ${unit}). Open a ${brokerLots.toFixed(2)} digital short to eliminate spot drop risk.`;
        } else {
          banner.classList.add('action-buy');
          if (actionPill) actionPill.textContent = currentLang === 'km' ? 'áž”áž‰áŸ’áž‡áž¶áž‘áž·áž‰ / LONG HEDGE' : 'LONG HEDGE EXECUTION';
          headline.innerHTML = currentLang === 'km'
            ? `áž‘áž·áž‰ <span class="cyan-accent">${brokerLots.toFixed(2)}</span> LOTS ${metalSymbol}`
            : `BUY <span class="cyan-accent">${brokerLots.toFixed(2)}</span> LOTS ${metalSymbol}`;
          reason.textContent = currentLang === 'km'
            ? `ážŸáŸ’ážáž»áž€${metalLabelKhmer}áž€áŸ’áž“áž»áž„áž áž¶áž„ážáž™áž…áž»áŸ‡ ${totalGrams.toFixed(2)}g (${weight} ${unitNamesKhmer[unit] || unit})áŸ” áž”áž¾áž€ Digital LONG ážŠáž¾áž˜áŸ’áž”áž¸áž€áž¶ážšáž–áž¶ážšážáŸ’áž›áŸƒáž‘áž·áž‰áž”áŸ†áž–áŸáž‰ážŸáŸ’ážáž»áž€áž¡áž¾áž„ážáŸ’áž›áŸƒáŸ”`
            : `Physical ${metalLabelEn} inventory decreased by ${totalGrams.toFixed(2)}g (${weight} ${unit}). Open a ${brokerLots.toFixed(2)} digital long to hedge inventory replenishment.`;
        }
      }

      // Currency Equivalents & Metrics
      const elLockedProfit = document.getElementById('cardLockedProfit');
      const elLockedProfitKhr = document.getElementById('cardLockedProfitKhr');
      if (elLockedProfit) {
        elLockedProfit.textContent = `+$${lockedProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
      }
      if (elLockedProfitKhr) {
        const khrVal = Math.round(lockedProfit * KHR_RATE);
        elLockedProfitKhr.textContent = `â‰ˆ ${khrVal.toLocaleString('en-US')} áŸ› (${currentLang === 'km' ? 'áž€áž¶ážšáž–áž¶ážš áŸ¡áŸ áŸ %' : '100% Protected'})`;
      }

      const elSafeCapital = document.getElementById('cardSafeCapital');
      const elSafeCapitalKhr = document.getElementById('cardSafeCapitalKhr');
      if (elSafeCapital) {
        elSafeCapital.textContent = `$${safeCapitalUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
      }
      if (elSafeCapitalKhr) {
        const khrCap = Math.round(safeCapitalUSD * KHR_RATE);
        elSafeCapitalKhr.textContent = `â‰ˆ ${khrCap.toLocaleString('en-US')} áŸ› (${currentLang === 'km' ? 'áž‚áŸ’áž˜áž¶áž“ Stop-Out' : 'Zero Stop-Out'})`;
      }

      const elBalanceKhr = document.getElementById('balanceKhrEquivalent');
      if (elBalanceKhr) {
        const khrUserBal = Math.round(userBalance * KHR_RATE);
        elBalanceKhr.textContent = `â‰ˆ ${khrUserBal.toLocaleString('en-US')} áŸ›`;
      }

      // Stop-Out Price Card
      const elStopOutPrice = document.getElementById('cardStopOutPrice');
      const elStopOutDistance = document.getElementById('cardStopOutDistance');
      if (elStopOutPrice && elStopOutDistance) {
        if (userBalance > 0 && brokerLots > 0) {
          elStopOutPrice.textContent = `$${stopOutSpot.toFixed(2)}`;
          elStopOutDistance.textContent = (isBuy ? '+' : '-') + `$${Math.abs(stopOutDistance).toFixed(2)} / oz distance`;
        } else {
          elStopOutPrice.textContent = currentLang === 'km' ? 'ážŸáž¼áž˜áž”áž‰áŸ’áž…áž¼áž›áž‘áž»áž“' : 'Input Balance';
          elStopOutDistance.textContent = currentLang === 'km' ? 'ážŠáž¾áž˜áŸ’áž”áž¸áž‚ážŽáž“áž¶áž áž¶áž“áž·áž—áŸáž™' : 'to view stop-out level';
        }
      }

      // Account Health & Capital Safety Box
      const elDiagPill = document.getElementById('cardAccountDiagPill');
      const elDiagText = document.getElementById('diagnosticExplanationText');
      const elBreakdownSurplus = document.getElementById('breakdownSurplus');
      const elBreakdownUserBalance = document.getElementById('breakdownUserBalance');
      const elBreakdownMargin = document.getElementById('breakdownMargin');
      const elBreakdownBuffer = document.getElementById('breakdownBuffer');
      const elBufferValText = document.getElementById('hedgeBufferValText');

      if (elBreakdownUserBalance) elBreakdownUserBalance.textContent = `$${userBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
      if (elBreakdownMargin) elBreakdownMargin.textContent = `$${marginUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
      if (elBreakdownBuffer) elBreakdownBuffer.textContent = `$${bufferUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
      if (elBufferValText) elBufferValText.textContent = `Â±$${buffer.toFixed(2)} / oz`;

      const surplus = userBalance - safeCapitalUSD;
      if (elBreakdownSurplus && elDiagPill && elDiagText) {
        if (userBalance >= safeCapitalUSD) {
          elDiagPill.className = 'account-diagnostic-pill';
          elDiagPill.textContent = currentLang === 'km' ? 'áž‘áž»áž“ážŸáž»ážœážáŸ’ážáž·áž—áž¶áž–áž–áŸáž‰áž›áŸáž‰ (100%)' : 'CAPITAL FULLY PROTECTED';
          elBreakdownSurplus.className = 'text-success';
          elBreakdownSurplus.textContent = `+$${surplus.toFixed(2)} Surplus`;
          elDiagText.className = 'health-explanation-text';
          elDiagText.textContent = currentLang === 'km'
            ? `ðŸŸ¢ ážŸáž»ážœážáŸ’ážáž·áž—áž¶áž–ážáŸ’áž–ážŸáŸ‹áž”áŸ†áž•áž»ážáŸ– ážŠáž¾áž˜áž‘áž»áž“ážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€áž‚áŸ’ážšáž”ážŠážŽáŸ’ážáž”áŸ‹áž‘áž¶áŸ†áž„ Margin áž“áž·áž„áž‘áž»áž“áž”áž˜áŸ’ážšáž»áž„áž›áž¾ážŸáž–áž¸ $${buffer}/ozáŸ” áž‚áŸ’áž˜áž¶áž“áž áž¶áž“áž·áž—áŸáž™ Stop-Out áž¡áž¾áž™áŸ”`
            : `ðŸŸ¢ Capital Protected: Your balance safely covers required margin plus more than $${buffer}/oz market swing against your hedge. Zero liquidation risk.`;
        } else if (userBalance >= marginUSD) {
          elDiagPill.className = 'account-diagnostic-pill status-tight';
          elDiagPill.textContent = currentLang === 'km' ? 'áž‘áž»áž“áž”áž˜áŸ’ážšáž»áž„áž“áŸ…áž˜áž¶áž“áž€áž˜áŸ’ážšáž·áž' : 'TIGHT MARGIN BUFFER';
          elBreakdownSurplus.className = 'text-danger';
          elBreakdownSurplus.textContent = `-$${Math.abs(surplus).toFixed(2)} Shortfall`;
          elDiagText.className = 'health-explanation-text';
          elDiagText.textContent = currentLang === 'km'
            ? `ðŸŸ¡ áž‘áž»áž“áž”áž˜áŸ’ážšáž»áž„áž“áŸ…ážŸáŸ’ážáž¾áž„áŸ– áž‚ážŽáž“áž¸áž¢áž¶áž…áž”áž¾áž€áž”áž‰áŸ’áž‡áž¶áž”áž¶áž“ áž”áŸ‰áž»áž“áŸ’ážáŸ‚ážŠáž¾áž˜áŸ’áž”áž¸áž€áž¶ážšáž–áž¶ážšáž€áž¶ážš Stop-Out áž“áŸ…áž–áŸáž›áž‘áž¸áž•áŸ’ážŸáž¶ážšážšáž›áž¶áž€áŸ‹ ážŸáž¼áž˜áž”áž“áŸ’ážáŸ‚áž˜ $${Math.abs(surplus).toFixed(2)} áž‘áŸ€ážáŸ”`
            : `ðŸŸ¡ Tight Buffer: Position can open, but buffer is slim. Deposit $${Math.abs(surplus).toFixed(2)} more to reach full Â±$${buffer}/oz protection.`;
        } else {
          elDiagPill.className = 'account-diagnostic-pill status-danger';
          elDiagPill.textContent = currentLang === 'km' ? 'áž‘áž»áž“áž˜áž·áž“áž‘áž¶áž“áŸ‹áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž¶áž“áŸ‹' : 'INSUFFICIENT BALANCE';
          elBreakdownSurplus.className = 'text-danger';
          elBreakdownSurplus.textContent = `-$${Math.abs(surplus).toFixed(2)} Under Margin`;
          elDiagText.className = 'health-explanation-text';
          elDiagText.textContent = currentLang === 'km'
            ? `ðŸ”´ áž‘áž»áž“áž˜áž·áž“áž‚áŸ’ážšáž”áŸ‹áŸ– áž¢áŸ’áž“áž€áž˜áž·áž“áž¢áž¶áž…áž”áž¾áž€ ${brokerLots.toFixed(2)} Lots áž”áž¶áž“áž¡áž¾áž™áŸ” ážáž˜áŸ’ážšáž¼ážœáž€áž¶ážš Margin áž¢áž”áŸ’áž”áž”ážšáž˜áž¶áž‚ážº $${marginUSD.toFixed(2)} USDáŸ”`
            : `ðŸ”´ Insufficient Capital: Cannot execute ${brokerLots.toFixed(2)} Lots. Minimum initial margin required is $${marginUSD.toFixed(2)} USD.`;
        }
      }

      // Detailed Table Metrics
      const elBrokerLots = document.getElementById('cardBrokerLots');
      if (elBrokerLots) elBrokerLots.textContent = `${brokerLots.toFixed(2)} Lots`;

      const elExactLots = document.getElementById('cardExactLots');
      if (elExactLots) elExactLots.textContent = `${exactLots.toFixed(5)} Lots`;

      const elResidualWeight = document.getElementById('cardResidualWeight');
      if (elResidualWeight) {
        elResidualWeight.textContent = `${residualGrams.toFixed(2)}g (â‰ˆ ${residualDamlung.toFixed(2)} ${currentLang === 'km' ? 'ážáž˜áŸ’áž›áž¹áž„' : 'Damlung'})`;
      }

      const elPhysicalCashTotal = document.getElementById('cardPhysicalCashTotal');
      if (elPhysicalCashTotal) elPhysicalCashTotal.textContent = `$${physicalCashTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;

      const elDigitalSpotTotal = document.getElementById('cardDigitalSpotTotal');
      if (elDigitalSpotTotal) elDigitalSpotTotal.textContent = `$${digitalSpotTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;

      // Mathematical Proof Step Breakdown
      const elMathProofSteps = document.getElementById('mathProofSteps');
      if (elMathProofSteps) {
        elMathProofSteps.innerHTML = currentLang === 'km'
          ? `${weight} ${unitNamesKhmer[unit] || unit} Ã— ${(gramsPerUnit[unit] || 37.5).toFixed(2)}g = ${totalGrams.toFixed(2)}g ${metalLabelKhmer}ážšáž¼áž”ážœáž“áŸ’áž<br>${totalGrams.toFixed(2)}g Ã· 31.1035g/oz = ${troyOunces.toFixed(4)} Troy Ounces<br>${troyOunces.toFixed(4)} oz Ã· ${contractSize} oz/Lot = <strong>${exactLots.toFixed(5)} Digital Lots</strong>`
          : `${weight} ${unit} Ã— ${(gramsPerUnit[unit] || 37.5).toFixed(2)}g = ${totalGrams.toFixed(2)}g Physical ${metalLabelEn}<br>${totalGrams.toFixed(2)}g Ã· 31.1035g/oz = ${troyOunces.toFixed(4)} Troy Ounces<br>${troyOunces.toFixed(4)} oz Ã· ${contractSize} oz/Lot = <strong>${exactLots.toFixed(5)} Digital Lots</strong>`;
      }

      // Re-run simulator with current parameters
      runCrashSimulation(currentSimDelta);
    }

    // 3. Dynamic Market Volatility Stress-Test Simulator Engine
    function runCrashSimulation(deltaPrice) {
      currentSimDelta = deltaPrice;
      const weight = parseFloat(hedgeWeightInput.value) || 0;
      const unit = hedgeUnitSelect.value || 'damlung';
      const isXAU = currentHedgeMetal === 'XAU';
      const contractSize = isXAU ? 100 : 5000;
      const isBuy = currentHedgeDirection === 'BUY_PHYSICAL';
      const currentLang = document.documentElement.getAttribute('lang') || 'en';

      const totalGrams = weight * (gramsPerUnit[unit] || 37.5);
      const troyOunces = totalGrams / 31.1034768;
      const exactLots = troyOunces / contractSize;
      let brokerLots = Math.round(exactLots * 100) / 100;
      if (brokerLots === 0 && exactLots > (isXAU ? 0.005 : 0.0002)) brokerLots = 0.01;

      // Physical gold value delta
      const physicalDiff = troyOunces * deltaPrice;

      // Digital hedge trade delta
      // When shop buys physical gold, it opens SHORT. If price drops (deltaPrice < 0), Short makes profit (+).
      const digitalDiff = isBuy ? (brokerLots * contractSize * (-deltaPrice)) : (brokerLots * contractSize * deltaPrice);

      // Net impact
      const unhedgedNet = physicalDiff;
      const hedgedNet = physicalDiff + digitalDiff;

      const elSimUnhedgedPhysical = document.getElementById('simUnhedgedPhysicalDiff');
      const elSimUnhedgedNet = document.getElementById('simUnhedgedNet');
      const elSimHedgedPhysical = document.getElementById('simHedgedPhysicalDiff');
      const elSimHedgedDigital = document.getElementById('simHedgedDigitalDiff');
      const elSimHedgedNet = document.getElementById('simHedgedNet');
      const elSimUnhedgedVerdict = document.getElementById('simUnhedgedVerdict');
      const elSimHedgedVerdict = document.getElementById('simHedgedVerdict');

      if (elSimUnhedgedPhysical) {
        elSimUnhedgedPhysical.textContent = (physicalDiff >= 0 ? '+' : '-') + `$${Math.abs(physicalDiff).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
      }
      if (elSimUnhedgedNet) {
        elSimUnhedgedNet.textContent = (unhedgedNet >= 0 ? '+' : '-') + `$${Math.abs(unhedgedNet).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${unhedgedNet >= 0 ? 'Gain' : 'Capital Loss'}`;
      }
      if (elSimHedgedPhysical) {
        elSimHedgedPhysical.textContent = (physicalDiff >= 0 ? '+' : '-') + `$${Math.abs(physicalDiff).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
      }
      if (elSimHedgedDigital) {
        elSimHedgedDigital.textContent = (digitalDiff >= 0 ? '+' : '-') + `$${Math.abs(digitalDiff).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
      }
      if (elSimHedgedNet) {
        const sign = hedgedNet >= 0 ? '+' : '-';
        elSimHedgedNet.textContent = `$${Math.abs(hedgedNet).toFixed(2)} Net Difference (${currentLang === 'km' ? 'áž€áž¶ážšáž–áž¶ážš áŸ¡áŸ áŸ %' : '100% Protected'})`;
      }

      if (elSimUnhedgedVerdict && elSimHedgedVerdict) {
        if (deltaPrice < 0) {
          elSimUnhedgedVerdict.textContent = currentLang === 'km'
            ? `áž€áž¶ážšáž’áŸ’áž›áž¶áž€áŸ‹áž…áž»áŸ‡ $${Math.abs(deltaPrice)}/oz áž”áž¶áž“áž›áŸáž”ážáŸ’ážšáž”áž¶áž€áŸ‹áž™áž€áž”áŸ’ážšáž¶áž€áŸ‹áž…áŸ†ážŽáŸáž‰ áž“áž·áž„áž”áž¶áž“áž”áŸ†áž•áŸ’áž›áž¶áž‰ážŠáž¾áž˜áž‘áž»áž“áž¢áž¶áž‡áž¸ážœáž€áž˜áŸ’áž˜ážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€áž¢ážŸáŸ‹ $${Math.abs(unhedgedNet).toFixed(2)} USD áž—áŸ’áž›áž¶áž˜áŸ—!`
            : `The $${Math.abs(deltaPrice)}/oz drop wiped out your retail spread profit and destroyed $${Math.abs(unhedgedNet).toFixed(2)} USD of core business capital!`;
          elSimHedgedVerdict.innerHTML = currentLang === 'km'
            ? `áž‚áŸ’áž˜áž¶áž“áž€áž¶ážšážáž¶ážáž”áž„áŸ‹áž¡áž¾áž™! áž”áž‰áŸ’áž‡áž¶ MT5 Short áž”áž¶áž“áž•áŸ’ážáž›áŸ‹áž•áž›áž…áŸ†ážŽáŸáž‰áž˜áž€ážœáž·áž‰áž…áŸ†áž“áž½áž“ <strong>+$${Math.abs(digitalDiff).toFixed(2)} USD</strong> ážŸáŸ’áž˜áž¾áž“áž¹áž„áž€áž¶ážšážáž¶ážážšáž¼áž”ážœáž“áŸ’ážáž”áŸáŸ‡áž”áž·áž‘áŸ” áž”áŸ’ážšáž¶áž€áŸ‹áž…áŸ†ážŽáŸáž‰áž áž¶áž„ážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€ážáŸ’ážšáž¼ážœáž”áž¶áž“áž€áž¶ážšáž–áž¶ážš áŸ¡áŸ áŸ %! ðŸ†`
            : `Zero loss! The digital short generated <strong>+$${Math.abs(digitalDiff).toFixed(2)} USD</strong> to offset the physical drop dollar-for-dollar. Your counter profit is 100% secure in your bank account! ðŸ†`;
        } else {
          elSimUnhedgedVerdict.textContent = currentLang === 'km'
            ? `áž˜áž¶ážŸáž¡áž¾áž„ážáŸ’áž›áŸƒ $${deltaPrice}/oz áž”áŸ‰áž»áž“áŸ’ážáŸ‚áž€áž¶ážšážšáž„áŸ‹áž…áž¶áŸ†áž‘áž·áž‰áž”áŸ†áž–áŸáž‰ážŸáŸ’ážáž»áž€áž¡áž¾áž„ážœáž·áž‰áž“áž¹áž„ážáŸ’ážšáž¼ážœáž…áŸ†ážŽáž¶áž™ážáŸ’áž›áŸƒážŠáž¾áž˜ážáŸ’áž–ážŸáŸ‹áž‡áž¶áž„áž˜áž»áž“ $${Math.abs(physicalDiff).toFixed(2)} USD!`
            : `Gold gained $${deltaPrice}/oz, but replenishing sold inventory now costs $${Math.abs(physicalDiff).toFixed(2)} USD more out of pocket!`;
          elSimHedgedVerdict.innerHTML = currentLang === 'km'
            ? `ážáž»áž›áŸ’áž™áž—áž¶áž– Delta-Neutral ážšáž€áŸ’ážŸáž¶ážŠáž¾áž˜áž‘áž»áž“áž”áŸ†áž–áŸáž‰ážŸáŸ’ážáž»áž€áž”áž¶áž“ážŸáŸ’áž˜áž¾ áŸ¡áŸ áŸ % ážŠáŸ„áž™áž‚áŸ’áž˜áž¶áž“áž€áž¶ážšáž”áŸ’ážšáŸ‚áž”áŸ’ážšáž½áž›áž¡áž¾áž™áŸ” ðŸ†`
            : `Delta-Neutral balance neutralized replenishment cost perfectly. Total price risk = $0.00! ðŸ†`;
        }
      }
    }

    // Expose recalculate globally for language switcher
    window.recalcGoldHedging = calculateGoldHedging;

    // 4. Register All Event Listeners
    if (metalSwitchGold && metalSwitchSilver) {
      metalSwitchGold.addEventListener('click', () => {
        if (currentHedgeMetal === 'XAU') return;
        currentHedgeMetal = 'XAU';
        metalSwitchGold.classList.add('active');
        metalSwitchSilver.classList.remove('active');
        const symbolEl = document.getElementById('liveSpotSymbol');
        if (symbolEl) symbolEl.textContent = 'XAU/USD:';
        fetchLiveSpotPrice('XAU', true);
      });

      metalSwitchSilver.addEventListener('click', () => {
        if (currentHedgeMetal === 'XAG') return;
        currentHedgeMetal = 'XAG';
        metalSwitchSilver.classList.add('active');
        metalSwitchGold.classList.remove('active');
        const symbolEl = document.getElementById('liveSpotSymbol');
        if (symbolEl) symbolEl.textContent = 'XAG/USD:';
        fetchLiveSpotPrice('XAG', true);
      });
    }

    if (dirBuyGold && dirSellGold) {
      dirBuyGold.addEventListener('click', () => {
        currentHedgeDirection = 'BUY_PHYSICAL';
        dirBuyGold.classList.add('active');
        dirSellGold.classList.remove('active');
        calculateGoldHedging();
      });
      dirSellGold.addEventListener('click', () => {
        currentHedgeDirection = 'SELL_PHYSICAL';
        dirSellGold.classList.add('active');
        dirBuyGold.classList.remove('active');
        calculateGoldHedging();
      });
    }

    if (curBtnUSD && curBtnKHR) {
      curBtnUSD.addEventListener('click', () => {
        currentCurrency = 'USD';
        curBtnUSD.classList.add('active');
        curBtnKHR.classList.remove('active');
        calculateGoldHedging();
      });
      curBtnKHR.addEventListener('click', () => {
        currentCurrency = 'KHR';
        curBtnKHR.classList.add('active');
        curBtnUSD.classList.remove('active');
        calculateGoldHedging();
      });
    }

    if (btnCopyTicket) {
      btnCopyTicket.addEventListener('click', () => {
        const actionText = currentHedgeDirection === 'BUY_PHYSICAL' ? 'SELL (SHORT)' : 'BUY (LONG)';
        const weightVal = hedgeWeightInput.value;
        const unitVal = hedgeUnitSelect.value;
        const spotVal = hedgeSpotInput.value;
        const lotsVal = document.getElementById('resStandardLots') ? document.getElementById('resStandardLots').textContent : '0.12';
        const profitVal = document.getElementById('cardLockedProfit') ? document.getElementById('cardLockedProfit').textContent : '$0';
        const safeCapVal = document.getElementById('cardSafeCapital') ? document.getElementById('cardSafeCapital').textContent : '$0';
        const stopOutVal = document.getElementById('cardStopOutPrice') ? document.getElementById('cardStopOutPrice').textContent : '$0';

        const ticketSummary = `[BLUEX HEDGING EXECUTION ORDER]
Asset: ${currentHedgeMetal === 'XAU' ? 'XAU/USD (Gold)' : 'XAG/USD (Silver)'}
Action: ${actionText} ${lotsVal} Lots
Physical Inventory: ${weightVal} ${unitVal}
Live Spot: $${spotVal} / oz
Locked Spread Profit: ${profitVal}
Recommended Safe Deposit: ${safeCapVal}
Stop-Out Price Level: ${stopOutVal}
Protocol Status: 100% Delta-Neutral Protected`;

        navigator.clipboard.writeText(ticketSummary).then(() => {
          const copyBtnText = document.getElementById('copyBtnText');
          const currentLang = document.documentElement.getAttribute('lang') || 'en';
          if (copyBtnText) {
            const original = copyBtnText.textContent;
            copyBtnText.textContent = currentLang === 'km' ? 'âœ“ áž”áž¶áž“áž…áž˜áŸ’áž›áž„!' : 'âœ“ Copied!';
            btnCopyTicket.style.borderColor = '#10b981';
            btnCopyTicket.style.color = '#10b981';
            setTimeout(() => {
              copyBtnText.textContent = original;
              btnCopyTicket.style.borderColor = '';
              btnCopyTicket.style.color = '';
            }, 2500);
          }
        }).catch(err => {
          console.warn('[BlueX] Clipboard copy failed:', err);
        });
      });
    }

    if (btnToggleDetails) {
      btnToggleDetails.addEventListener('click', () => {
        const content = document.getElementById('ticketDetailedContent');
        const textSpan = document.getElementById('toggleDetailsText');
        const currentLang = document.documentElement.getAttribute('lang') || 'en';
        if (content) {
          const isHidden = content.style.display === 'none' || content.style.display === '';
          content.style.display = isHidden ? 'block' : 'none';
          btnToggleDetails.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
          if (textSpan) {
            if (isHidden) {
              textSpan.textContent = currentLang === 'km' ? 'â–² áž›áž¶áž€áŸ‹áž–áŸážáŸŒáž˜áž¶áž“áž›áž˜áŸ’áž¢áž·áž' : 'â–² Hide Detailed Arithmetic';
            } else {
              textSpan.textContent = currentLang === 'km' ? 'â–¼ áž”áž„áŸ’áž áž¶áž‰ážšáž¼áž”áž˜áž“áŸ’ážáž‚ážŽáž·ážážœáž·áž‘áŸ’áž™áž¶ & áž‘áž˜áŸ’áž„áž“áŸ‹áž“áŸ…ážŸáž›áŸ‹' : 'â–¼ Show Advanced Arithmetic & Residuals';
            }
          }
        }
      });
    }

    simScenarioBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        simScenarioBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const scenarioDelta = parseFloat(btn.getAttribute('data-scenario')) || -150;
        runCrashSimulation(scenarioDelta);
      });
    });

    if (btnRefreshSpot) {
      btnRefreshSpot.addEventListener('click', () => {
        fetchLiveSpotPrice(currentHedgeMetal, true);
      });
    }

    if (btnSyncLocalRate) {
      btnSyncLocalRate.addEventListener('click', () => {
        syncLocalRateWithSpot();
        calculateGoldHedging();
      });
    }

    if (btnAutoFillSafeBalance) {
      btnAutoFillSafeBalance.addEventListener('click', () => {
        const spot = parseFloat(hedgeSpotInput.value) || cachedLivePrices[currentHedgeMetal];
        const leverage = parseFloat(hedgeLeverageSelect.value) || 200;
        const weight = parseFloat(hedgeWeightInput.value) || 0;
        const unit = hedgeUnitSelect.value || 'damlung';
        const isXAU = currentHedgeMetal === 'XAU';
        const contractSize = isXAU ? 100 : 5000;
        const totalGrams = weight * (gramsPerUnit[unit] || 37.5);
        const troyOunces = totalGrams / 31.1034768;
        let lots = Math.round((troyOunces / contractSize) * 100) / 100;
        if (lots === 0 && troyOunces > 0) lots = 0.01;
        const marginUSD = (lots * contractSize * spot) / leverage;
        const bufferUSD = lots * contractSize * currentHedgeBuffer;
        const target = Math.ceil((marginUSD + bufferUSD) / 50) * 50;
        hedgeAccountBalanceInput.value = target.toFixed(2);
        calculateGoldHedging();
      });
    }

    bufferChips.forEach(chip => {
      chip.addEventListener('click', () => {
        bufferChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentHedgeBuffer = parseFloat(chip.getAttribute('data-buffer')) || 100;
        calculateGoldHedging();
      });
    });

    shopPresetChips.forEach(presetBtn => {
      presetBtn.addEventListener('click', () => {
        shopPresetChips.forEach(p => p.classList.remove('active'));
        presetBtn.classList.add('active');
        const weightVal = presetBtn.getAttribute('data-weight');
        const unitVal = presetBtn.getAttribute('data-unit');
        if (weightVal) hedgeWeightInput.value = weightVal;
        if (unitVal) hedgeUnitSelect.value = unitVal;
        calculateGoldHedging();
      });
    });

    hedgeWeightInput.addEventListener('input', calculateGoldHedging);
    hedgeUnitSelect.addEventListener('change', calculateGoldHedging);
    hedgeSpotInput.addEventListener('input', calculateGoldHedging);
    hedgeLeverageSelect.addEventListener('change', calculateGoldHedging);
    if (hedgeLocalDamlungInput) {
      hedgeLocalDamlungInput.addEventListener('input', calculateGoldHedging);
    }
    if (hedgeAccountBalanceInput) {
      hedgeAccountBalanceInput.addEventListener('input', calculateGoldHedging);
    }

    // Progressive Step Navigation (PC & Mobile)
    const workflowTabs = document.querySelectorAll('.workflow-tab');
    const stepBlocks = document.querySelectorAll('[data-calc-step]');
    const nextButtons = document.querySelectorAll('[data-next-step]');
    const backButtons = document.querySelectorAll('[data-prev-step]');

    function switchWorkflowStep(stepNum) {
      const stepStr = String(stepNum);
      workflowTabs.forEach(t => {
        const isMatch = t.getAttribute('data-step') === stepStr;
        t.classList.toggle('active', isMatch);
        t.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      });

      const isMobile = window.innerWidth <= 992;
      stepBlocks.forEach(b => {
        const bStep = b.getAttribute('data-calc-step');
        if (isMobile) {
          // On mobile, show only selected step
          b.style.display = (bStep === stepStr) ? 'block' : 'none';
        } else {
          // On desktop:
          // Step 1: Show Step 1 in left column, ticket in right column
          // Step 2: Show Step 2 in left column, ticket in right column
          // Step 3: Show both Step 1 & 2 in left column, highlight ticket and scroll to it
          if (bStep === '1') {
            b.style.display = (stepStr === '1' || stepStr === '3') ? 'block' : 'none';
          } else if (bStep === '2') {
            b.style.display = (stepStr === '2' || stepStr === '3') ? 'block' : 'none';
          } else if (bStep === '3') {
            b.style.display = 'block';
            if (stepStr === '3') {
              const ticketEl = document.getElementById('calcTicketCard');
              if (ticketEl) {
                ticketEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                ticketEl.classList.add('ticket-highlight-pulse');
                setTimeout(() => ticketEl.classList.remove('ticket-highlight-pulse'), 1500);
              }
            }
          }
        }
      });
    }

    workflowTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const step = tab.getAttribute('data-step');
        if (step) switchWorkflowStep(step);
      });
    });

    nextButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const step = btn.getAttribute('data-next-step');
        if (step) switchWorkflowStep(step);
      });
    });

    backButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const step = btn.getAttribute('data-prev-step');
        if (step) switchWorkflowStep(step);
      });
    });

    // Handle responsive resize layout
    window.addEventListener('resize', () => {
      const activeTab = document.querySelector('.workflow-tab.active');
      const step = activeTab ? activeTab.getAttribute('data-step') : '1';
      switchWorkflowStep(step || '1');
    });

    // Default to Step 1
    switchWorkflowStep('1');

    // Initial spot fetch & execution
    fetchLiveSpotPrice(currentHedgeMetal, false);

    // Auto-refresh spot every 60 seconds
    setInterval(() => {
      if (!document.hidden) {
        fetchLiveSpotPrice(currentHedgeMetal, false);
      }
    }, 60000);
  }.00! ðŸ†`;
        }
      }
    }

    // 4. Register All Event Listeners
    // Slider & Input Sync
    if (hedgeWeightInput && hedgeWeightSlider) {
      hedgeWeightInput.addEventListener('input', () => {
        hedgeWeightSlider.value = hedgeWeightInput.value;
        calculateGoldHedging();
      });
      hedgeWeightSlider.addEventListener('input', () => {
        hedgeWeightInput.value = hedgeWeightSlider.value;
        calculateGoldHedging();
      });
    }

    // Unit Buttons
    deskUnitBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        deskUnitBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const unit = btn.getAttribute('data-unit');
        if (hedgeUnitSelect && unit) {
          hedgeUnitSelect.value = unit;
        }
        calculateGoldHedging();
      });
    });

    // Preset Chips
    deskChipPresets.forEach(chip => {
      chip.addEventListener('click', () => {
        deskChipPresets.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const weight = chip.getAttribute('data-weight');
        if (weight && hedgeWeightInput) {
          hedgeWeightInput.value = weight;
          if (hedgeWeightSlider) hedgeWeightSlider.value = weight;
        }
        calculateGoldHedging();
      });
    });

    // Direction Toggle
    if (dirBuyGold && dirSellGold) {
      dirBuyGold.addEventListener('click', () => {
        currentHedgeDirection = 'BUY_PHYSICAL';
        dirBuyGold.classList.add('active');
        dirSellGold.classList.remove('active');
        calculateGoldHedging();
      });
      dirSellGold.addEventListener('click', () => {
        currentHedgeDirection = 'SELL_PHYSICAL';
        dirSellGold.classList.add('active');
        dirBuyGold.classList.remove('active');
        calculateGoldHedging();
      });
    }

    // Metal Switcher
    if (metalSwitchGold && metalSwitchSilver) {
      metalSwitchGold.addEventListener('click', () => {
        if (currentHedgeMetal === 'XAU') return;
        currentHedgeMetal = 'XAU';
        metalSwitchGold.classList.add('active');
        metalSwitchSilver.classList.remove('active');
        const symEl = document.getElementById('liveSpotSymbol');
        if (symEl) symEl.textContent = 'XAU/USD LIVE SPOT:';
        fetchLiveSpotPrice('XAU', true);
      });
      metalSwitchSilver.addEventListener('click', () => {
        if (currentHedgeMetal === 'XAG') return;
        currentHedgeMetal = 'XAG';
        metalSwitchSilver.classList.add('active');
        metalSwitchGold.classList.remove('active');
        const symEl = document.getElementById('liveSpotSymbol');
        if (symEl) symEl.textContent = 'XAG/USD LIVE SPOT:';
        fetchLiveSpotPrice('XAG', true);
      });
    }

    // Inputs & Selects
    if (hedgeSpotInput) hedgeSpotInput.addEventListener('input', calculateGoldHedging);
    if (hedgeLeverageSelect) hedgeLeverageSelect.addEventListener('change', calculateGoldHedging);
    if (hedgeBufferSelect) {
      hedgeBufferSelect.addEventListener('change', () => {
        currentHedgeBuffer = parseFloat(hedgeBufferSelect.value) || 100;
        calculateGoldHedging();
      });
    }
    if (localPremiumInput) localPremiumInput.addEventListener('input', calculateGoldHedging);
    if (hedgeAccountBalanceInput) hedgeAccountBalanceInput.addEventListener('input', calculateGoldHedging);

    if (btnRefreshSpot) {
      btnRefreshSpot.addEventListener('click', () => {
        fetchLiveSpotPrice(currentHedgeMetal, true);
      });
    }

    if (btnDepositGuide) {
      btnDepositGuide.addEventListener('click', () => {
        const spot = parseFloat(hedgeSpotInput.value) || cachedLivePrices[currentHedgeMetal];
        const leverage = parseFloat(hedgeLeverageSelect.value) || 100;
        const weight = parseFloat(hedgeWeightInput.value) || 0;
        const unit = (hedgeUnitSelect ? hedgeUnitSelect.value : 'damlung') || 'damlung';
        const isXAU = currentHedgeMetal === 'XAU';
        const contractSize = isXAU ? 100 : 5000;
        const totalGrams = weight * (gramsPerUnit[unit] || 37.5);
        const troyOunces = totalGrams / 31.1034768;
        let lots = Math.round((troyOunces / contractSize) * 100) / 100;
        if (lots === 0 && troyOunces > 0) lots = 0.01;
        const marginUSD = (lots * contractSize * spot) / leverage;
        const bufferUSD = lots * contractSize * currentHedgeBuffer;
        const target = Math.ceil((marginUSD + bufferUSD) / 100) * 100;
        if (hedgeAccountBalanceInput) {
          hedgeAccountBalanceInput.value = target.toFixed(0);
          calculateGoldHedging();
        }
      });
    }

    simScenarioBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        simScenarioBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const scenarioDelta = parseFloat(btn.getAttribute('data-scenario')) || -150;
        runCrashSimulation(scenarioDelta);
      });
    });

    // Expose recalculate globally for language switcher
    window.recalcGoldHedging = calculateGoldHedging;

    // Initial spot fetch & execution
    fetchLiveSpotPrice(currentHedgeMetal, false);

    // Auto-refresh spot every 60 seconds
    setInterval(() => {
      if (!document.hidden) {
        fetchLiveSpotPrice(currentHedgeMetal, false);
      }
    }, 60000);
  }

  // Initialize Hedging Calculator
  initGoldHedgingCalculator();


  // ========================================================
  // 5. YOUTUBE VIDEO SHOWCASE SWITCHER
  // ========================================================
  const mainYouTubeIframe = document.getElementById('mainYouTubeIframe');
  const ytSwitchBtns = document.querySelectorAll('.yt-switch-btn');
  const ytPlayerTitle = document.getElementById('ytPlayerTitle');
  const ytPlayerDesc = document.getElementById('ytPlayerDesc');
  const ytDirectWatchBtn = document.getElementById('ytDirectWatchBtn');

  ytSwitchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const vid = btn.getAttribute('data-vid');
      const title = btn.getAttribute('data-title');
      const desc = btn.getAttribute('data-desc');

      ytSwitchBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (mainYouTubeIframe && vid) {
        mainYouTubeIframe.src = `https://www.youtube-nocookie.com/embed/${vid}?rel=0&enablejsapi=1&autoplay=1`;
      }
      if (ytDirectWatchBtn && vid) {
        ytDirectWatchBtn.href = `https://www.youtube.com/watch?v=${vid}`;
      }
      if (ytPlayerTitle && title) {
        ytPlayerTitle.textContent = title;
      }
      if (ytPlayerDesc && desc) {
        ytPlayerDesc.textContent = desc;
      }
    });
  });


  // ========================================================
  // 6. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  // ========================================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-left, .reveal-right, .reveal-scale');
  revealElements.forEach(el => el.classList.add('is-visible'));
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, {
      root: null,
      threshold: 0.05,
      rootMargin: '0px 0px 50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }


  // ========================================================
  // 7. INTERACTIVE FAQ ACCORDION
  // ========================================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (questionBtn && answer) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Close all other open items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
          }
        });

        // Toggle clicked item
        if (isOpen) {
          item.classList.remove('active');
          answer.style.maxHeight = null;
        } else {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  // Open first FAQ item by default for intuitive discovery
  if (faqItems.length > 0) {
    const firstItem = faqItems[0];
    const firstAnswer = firstItem.querySelector('.faq-answer');
    if (firstItem && firstAnswer) {
      firstItem.classList.add('active');
      firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
    }
  }


  // ========================================================
  // 8. CONTACT FORM SUBMISSION & TOAST NOTIFICATION
  // ========================================================
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('senderName');
      const emailInput = document.getElementById('senderEmail');
      const messageInput = document.getElementById('senderMessage');

      if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
        showToast(currentLang === 'km' ? 'âš ï¸ ážŸáž¼áž˜áž”áŸ†áž–áŸáž‰áž–áŸážáŸŒáž˜áž¶áž“ážŠáŸ‚áž›ážáŸ’ážšáž¼ážœáž€áž¶ážšáž‘áž¶áŸ†áž„áž¢ážŸáŸ‹áŸ”' : 'âš ï¸ Please complete all required fields.');
        return;
      }

      showToast(currentLang === 'km' 
        ? 'ðŸš€ ážŸáž¼áž˜áž¢ážšáž‚áž»ážŽ ' + nameInput.value + '! ážŸáž¶ážšážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€ážáŸ’ážšáž¼ážœáž”áž¶áž“áž•áŸ’áž‰áž¾áž‡áž¼áž“ BlueX ážšáž½áž…ážšáž¶áž›áŸ‹áž áž¾áž™áŸ”' 
        : 'ðŸš€ Thank you ' + nameInput.value + '! Your inquiry has been delivered directly to BlueX.');
      contactForm.reset();
    });
  }


  // ========================================================
  // 9. KNOWLEDGE & BOOKS FILTER TABS
  // ========================================================
  const knowledgeTabs = document.querySelectorAll('.knowledge-tab-btn');
  const lessonsBlock = document.getElementById('knowledgeLessonsBlock');
  const booksBlock = document.getElementById('knowledgeBooksBlock');

  if (knowledgeTabs.length > 0) {
    knowledgeTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        knowledgeTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.getAttribute('data-filter');

        if (filter === 'all') {
          if (lessonsBlock) lessonsBlock.style.display = 'block';
          if (booksBlock) booksBlock.style.display = 'block';
        } else if (filter === 'lessons') {
          if (lessonsBlock) lessonsBlock.style.display = 'block';
          if (booksBlock) booksBlock.style.display = 'none';
        } else if (filter === 'books') {
          if (lessonsBlock) lessonsBlock.style.display = 'none';
          if (booksBlock) booksBlock.style.display = 'block';
        }
      });
    });
  }


  // ========================================================
  // 9B. SMC GENESIS INTERACTIVE CONCEPT TABS
  // ========================================================
  const genesisConceptTabs = document.querySelectorAll('.genesis-concept-tab');
  const genesisConceptCards = document.querySelectorAll('.genesis-concept-card');
  if (genesisConceptTabs.length > 0) {
    genesisConceptTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        genesisConceptTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.getAttribute('data-concept');
        genesisConceptCards.forEach(card => {
          if (card.getAttribute('data-concept') === target) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }


  // ========================================================
  // 10. SUBTLE AMBIENT CARD SPOTLIGHT GLOW (R-A-F THROTTLED)
  // ========================================================
  const cards = document.querySelectorAll('.pillar-card, .mentorship-card-main, .about-portrait-card, .capital-card-main, .calculator-card-main, .brokers-card-main, .broker-tier-box, .course-standards-box, .compliance-card, .social-direct-box, .knowledge-card-main, .lesson-card, .book-card, .genesis-module-card, .genesis-compare-col, .genesis-concept-card, .genesis-metric-card, .course-genesis-banner');
  let cardHoverFrame = null;
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (cardHoverFrame) return;
      cardHoverFrame = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
        cardHoverFrame = null;
      });
    }, { passive: true });
  });



  // ========================================================
  // 11. LUXURY STARLIGHT BEAMING & TWILIGHT CONSTELLATION ENGINE (SILKY 60FPS)
  // ========================================================
  function initBluexStarlightCanvas() {
    const canvas = document.getElementById('bluexStarlightCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const isMobile = window.innerWidth <= 768;
    const particleCount = isMobile ? 10 : 26;
    let shootingStar = null;
    let animFrameId = null;
    let isPaused = false;
    let isScrolling = false;
    let scrollStopTimer = null;
    let mouse = { x: -1000, y: -1000 };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    }, { passive: true });

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    class CosmicParticle {
      constructor() {
        this.reset(true);
      }
      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 10;
        this.vy = -(Math.random() * 0.35 + 0.1);
        this.vx = (Math.random() - 0.5) * 0.16;
        this.size = Math.random() * 1.8 + 0.7;
        this.baseAlpha = Math.random() * 0.45 + 0.2;
        this.alpha = this.baseAlpha;
        this.phase = Math.random() * Math.PI * 2;
        this.twinkleSpeed = Math.random() * 0.025 + 0.01;
        const rand = Math.random();
        this.colorType = rand > 0.52 ? 'gold' : (rand > 0.22 ? 'cyan' : 'white');
        this.isStar = Math.random() > 0.72;
      }
      update() {
        this.y += this.vy;
        this.x += this.vx;
        this.phase += this.twinkleSpeed;
        this.alpha = this.baseAlpha + Math.sin(this.phase) * 0.16;

        // Interactive Starlight Cursor Physics (Squared distance optimization for 0ms CPU cost)
        if (!isMobile && mouse.x > 0 && mouse.y > 0) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 10000 && distSq > 0) { // 100px deflection halo
            const dist = Math.sqrt(distSq);
            const force = (100 - dist) / 100;
            this.x += (dx / dist) * force * 1.6;
            this.y += (dy / dist) * force * 1.6;
          }
        }

        if (this.y < -15 || this.x < -15 || this.x > width + 15) {
          this.reset();
        }
      }
      draw(isLight) {
        const currentAlpha = Math.max(0.08, Math.min(0.9, this.alpha));
        const color = this.colorType === 'cyan'
          ? (isLight ? `rgba(2, 132, 199, ${currentAlpha * 0.85})` : `rgba(0, 255, 224, ${currentAlpha * 0.9})`)
          : (this.colorType === 'white'
            ? (isLight ? `rgba(15, 23, 42, ${currentAlpha * 0.75})` : `rgba(255, 255, 255, ${currentAlpha})`)
            : (isLight ? `rgba(180, 83, 9, ${currentAlpha})` : `rgba(255, 184, 0, ${currentAlpha})`));

        if (this.isStar) {
          // Sleek 4-point diamond star sparkle
          const s = this.size * 2.1;
          ctx.save();
          ctx.translate(this.x, this.y);
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.quadraticCurveTo(0, 0, s, 0);
          ctx.quadraticCurveTo(0, 0, 0, s);
          ctx.quadraticCurveTo(0, 0, -s, 0);
          ctx.quadraticCurveTo(0, 0, 0, -s);
          ctx.fill();

          ctx.strokeStyle = color;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(-s * 1.5, 0);
          ctx.lineTo(s * 1.5, 0);
          ctx.moveTo(0, -s * 1.5);
          ctx.lineTo(0, s * 1.5);
          ctx.stroke();
          ctx.restore();
        } else {
          // Circular stardust ember
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new CosmicParticle());
    }

    // Periodic Twilight Shooting Star / Meteor Spawner
    function spawnShootingStar() {
      if (shootingStar || isPaused || isScrolling || document.documentElement.classList.contains('effects-frozen')) return;
      const startX = Math.random() * (width * 0.7);
      const startY = Math.random() * (height * 0.35);
      shootingStar = {
        x: startX,
        y: startY,
        vx: 7 + Math.random() * 4,
        vy: 3.5 + Math.random() * 2.5,
        life: 1.0,
        decay: 0.022
      };
    }
    const meteorInterval = setInterval(spawnShootingStar, 7500);

    function render() {
      if (document.documentElement.classList.contains('effects-frozen') || isPaused || isScrolling) {
        animFrameId = null;
        return;
      }
      if (document.hidden) {
        animFrameId = requestAnimationFrame(render);
        return;
      }
      ctx.clearRect(0, 0, width, height);
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';

      // Constellation Connecting Beams (Twilight Celestial Web)
      if (!isMobile) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distSq = dx * dx + dy * dy;
            if (distSq < 7225) { // 85px max link distance
              const dist = Math.sqrt(distSq);
              const beamAlpha = (isLight ? 0.11 : 0.075) * (1 - dist / 85);
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = particles[i].colorType === 'cyan'
                ? (isLight ? `rgba(2, 132, 199, ${beamAlpha})` : `rgba(0, 255, 224, ${beamAlpha})`)
                : (isLight ? `rgba(180, 83, 9, ${beamAlpha})` : `rgba(255, 184, 0, ${beamAlpha})`);
              ctx.lineWidth = 0.55;
              ctx.stroke();
            }
          }
        }
      }

      // Draw and update celestial particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(isLight);
      }

      // Draw Twilight Meteor Streak
      if (shootingStar) {
        const tailX = shootingStar.x - shootingStar.vx * 13;
        const tailY = shootingStar.y - shootingStar.vy * 13;
        const grad = ctx.createLinearGradient(shootingStar.x, shootingStar.y, tailX, tailY);
        grad.addColorStop(0, isLight ? `rgba(15, 23, 42, ${shootingStar.life})` : `rgba(255, 255, 255, ${shootingStar.life})`);
        grad.addColorStop(0.35, isLight ? `rgba(180, 83, 9, ${shootingStar.life * 0.75})` : `rgba(255, 184, 0, ${shootingStar.life * 0.8})`);
        grad.addColorStop(0.7, isLight ? `rgba(2, 132, 199, ${shootingStar.life * 0.4})` : `rgba(0, 255, 224, ${shootingStar.life * 0.5})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(shootingStar.x, shootingStar.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = isLight ? `rgba(15, 23, 42, ${shootingStar.life})` : `rgba(255, 255, 255, ${shootingStar.life})`;
        ctx.fill();

        shootingStar.x += shootingStar.vx;
        shootingStar.y += shootingStar.vy;
        shootingStar.life -= shootingStar.decay;

        if (shootingStar.life <= 0 || shootingStar.x > width + 40 || shootingStar.y > height + 40) {
          shootingStar = null;
        }
      }

      animFrameId = requestAnimationFrame(render);
    }
    render();

    // Auto-pause canvas during active scrolling to free 100% GPU for buttery 60+ FPS scroll
    window.addEventListener('scroll', () => {
      isScrolling = true;
      clearTimeout(scrollStopTimer);
      scrollStopTimer = setTimeout(() => {
        isScrolling = false;
        if (!animFrameId && !isPaused && !document.documentElement.classList.contains('effects-frozen')) {
          animFrameId = requestAnimationFrame(render);
        }
      }, 100);
    }, { passive: true });

    window.pauseBluexCanvas = function() {
      isPaused = true;
    };

    window.resumeBluexCanvas = function() {
      if (isPaused) {
        isPaused = false;
        if (!animFrameId && !document.documentElement.classList.contains('effects-frozen')) {
          animFrameId = requestAnimationFrame(render);
        }
      }
    };
  }
  initBluexStarlightCanvas();

  // ========================================================
  // 11B. CONCISE KHMER NAVBAR LABELS TO PREVENT TOOLBAR OVERFLOW
  // ========================================================
  if (translations && translations.km) {
    translations.km['nav.about'] = 'áž¢áŸ†áž–áž¸áž™áž¾áž„';
    translations.km['nav.brokers'] = 'Brokers';
    translations.km['nav.capital'] = 'áž™áž»áž‘áŸ’áž’ážŸáž¶ážŸáŸ’ážáŸ’ážš';
    translations.km['nav.pillars'] = 'áž‚áŸ„áž›áž€áž¶ážšážŽáŸ';
    translations.km['nav.faq'] = 'ážŸáŸ†ážŽáž½ážš';
    translations.km['nav.connect'] = 'áž‘áž¶áž€áŸ‹áž‘áž„';
    if (currentLang === 'km') {
      switchLanguage('km');
    }
  }

  // ========================================================
  // 12. SMART TOOLBAR: HIDE ON SCROLL DOWN, SHOW ON SCROLL UP
  // ========================================================
  let lastScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
  let scrollTicking = false;

  function handleHeaderScrollDirection() {
    if (!siteHeader) return;
    // CRITICAL: NEVER hide header or close menu while mobile menu is open
    if (navMenu && navMenu.classList.contains('mobile-open')) {
      siteHeader.classList.remove('header-hidden');
      return;
    }
    const currentScrollY = Math.max(0, window.pageYOffset || document.documentElement.scrollTop || 0);
    const delta = currentScrollY - lastScrollY;

    if (currentScrollY <= 55) {
      siteHeader.classList.remove('header-hidden');
      lastScrollY = currentScrollY;
    } else if (delta > 8 && currentScrollY > 70) {
      siteHeader.classList.add('header-hidden');
      lastScrollY = currentScrollY;
    } else if (delta < -4) {
      siteHeader.classList.remove('header-hidden');
      lastScrollY = currentScrollY;
    }
    scrollTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(handleHeaderScrollDirection);
      scrollTicking = true;
    }
  }, { passive: true });
});
