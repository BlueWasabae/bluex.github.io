// ========================================================
// BlueX Portfolio & Trading Ecosystem - Core Engine
// Features:
// 1. Navigation & Smooth Scroll
// 2. Light & Dark Theme Toggle with Persistence
// 3. Complete Bilingual Khmer (ខ្មែរ) & English Localization Engine
// 4. Institutional Forex & Gold Lot Size & Risk Calculator
// 5. YouTube Video Showcase Switcher
// 6. Interactive FAQ Accordion
// 7. Scroll Reveal & Ambient Light Animations
// 8. Contact Form Handling
// ========================================================

document.addEventListener('DOMContentLoaded', () => {

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
    const subpages = ['smc-genesis.html', 'knowledge.html', 'gold-hedging.html'];
    const activeSubpage = subpages.find(page => currentPath.endsWith(page));

    if (activeSubpage) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        if (href === activeSubpage || href.startsWith(activeSubpage + '#')) {
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
      if (fxNavIcon) fxNavIcon.textContent = '❄️';
      if (fxBtnText) fxBtnText.textContent = 'OFF';
      if (fxToggleBtn) {
        fxToggleBtn.classList.add('fx-frozen');
        fxToggleBtn.setAttribute('title', currentLang === 'km' ? 'ចលនា: ផ្អាក (ចុចដើម្បីបើក)' : 'Effects: Frozen (Click to Resume)');
      }
      if (fxDrawerIcon) fxDrawerIcon.textContent = '❄️';
      if (fxDrawerText) {
        fxDrawerText.textContent = currentLang === 'km' ? 'ចលនា: ផ្អាក (ចុចដើម្បីបើក)' : 'Effects: Frozen (Tap to Resume)';
      }
      if (fxToggleDrawerBtn) fxToggleDrawerBtn.classList.add('fx-frozen');
    } else {
      if (fxNavIcon) fxNavIcon.textContent = '⚡';
      if (fxBtnText) fxBtnText.textContent = 'FX';
      if (fxToggleBtn) {
        fxToggleBtn.classList.remove('fx-frozen');
        fxToggleBtn.setAttribute('title', currentLang === 'km' ? 'ចលនា: បើក (ចុចដើម្បីផ្អាក)' : 'Effects: Active (Click to Freeze)');
      }
      if (fxDrawerIcon) fxDrawerIcon.textContent = '⚡';
      if (fxDrawerText) {
        fxDrawerText.textContent = currentLang === 'km' ? 'ចលនា: បើក (ចុចដើម្បីផ្អាក)' : 'Effects: Active (Tap to Freeze)';
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
        showToast(currentLang === 'km' ? '❄️ បានផ្អាកចលនា — ដំណើរការលឿនរលូន (Smooth 60FPS)' : '❄️ Effects Frozen — Smooth Performance Mode');
      }
    } else {
      document.documentElement.classList.remove('effects-frozen');
      safeSetStorage('bluex_fx_mode', 'on');
      updateFxButtonTexts();
      if (triggerToast) {
        showToast(currentLang === 'km' ? '⚡ ចលនាត្រូវបានបើកដំណើរការឡើងវិញ' : '⚡ Visual Effects Resumed');
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
  // 3. COMPLETE KHMER (ខ្មែរ) & ENGLISH I18N DICTIONARY & ENGINE
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
      'nav.drawerDm': 'Register Now — Direct DM (@Le_Bluue)',
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
      'hero.btnCapital': 'Private Portfolio Strategy ↗',
      'hero.offeringsTitle': 'Core Offerings',
      'hero.offering1': 'Study Course & Live Teaching',
      'hero.offering2': 'Private Portfolio Strategy',
      'hero.offering3': 'Treno Markets, GTC GO & Lirunex',
      'hero.offering4': 'Institutional Liquidity',
      'hero.offering5': 'Strategic Risk Control',
      'hero.offering6': 'Trading Psychology & Ego',
      'hero.bioSnippet': 'Passionate senior trader and mentor committed to building high-probability trading discipline, institutional risk architecture, and long-term capital preservation.',

      // About
      'about.mentorBadge': 'BlueX • Senior Mentor',
      'about.availableTag': 'Available for Mentorship',
      'about.signatureMotto': '"Master Your Ego.<br><span>Master Your Trades.</span>"',
      'about.signatureRole': 'Senior Trader & Private Mentor',
      'about.leadText': 'I\'m a passionate trader and mentor committed to building opportunities through <span style="color:var(--color-gold);">disciplined execution</span>, strategic risk management, and a long-term market perspective.',
      'about.p1': 'I believe that <strong>successful investing is driven by consistency, patience, and sound decision making</strong> — not emotion or speculation. My focus is on creating sustainable value while navigating the markets with <strong>professionalism, transparency, and integrity</strong>.',
      'about.p2': 'Whether you\'re an experienced investor or an ambitious trader looking to eliminate psychological sabotage and achieve true consistency, <strong>I welcome individuals who share a long-term vision</strong> and appreciate a disciplined approach to capital management.',
      'about.sagfxNote': 'Affiliate partnerships and payment gateway inquiries via SAGFX are available upon direct request.',
      'about.btnExplore': 'Explore Study Course',

      // Study Course
      'course.badge': 'Selective Admission • Direct Live Coaching',
      'course.title': 'Study Course with BlueX:<br><span class="highlight">Interactive Live Teaching.</span>',
      'course.leadPitch': 'Direct, interactive live teaching sessions where we dissect real-time market structure together. Every concept is taught live, verified on real-time charts, and tailored to build disciplined institutional execution.',
      'course.standardsTitle': 'Curriculum Standards & Prerequisites',
      'course.standardsSub': 'We uphold selective admission standards to ensure high-conviction execution.',
      'course.std1Title': 'Capital Preservation First',
      'course.std1Desc': 'Must commit to zero-tolerance risk management (0.5%–1.0% per trade). Gamblers seeking "get-rich-quick" signals are not admitted.',
      'course.std2Title': 'Rule-Based Mechanical Execution',
      'course.std2Desc': 'Dedication to objective setups: liquidity sweeps, market structure shifts, and imbalances rather than emotional guessing.',
      'course.std3Title': 'Trade Journaling & Review Discipline',
      'course.std3Desc': 'Active maintenance of trade logs, statistical tracking, and execution checklists to eradicate psychological errors.',
      'course.std4Title': 'Commitment to Live Sessions & Practice',
      'course.std4Desc': 'Active participation in live chart sessions, disciplined note-taking, and systematic simulation before deploying live capital.',
      'course.liveBarTitle': 'Direct Live Screen-Sharing Sessions',
      'course.liveBarSub': 'Interactive Real-Time Execution',
      'course.bodyText': 'Most retail traders burn through accounts not because their charts lack technical indicators, but because they have never been taught how institutional Supply & Demand operates, nor how to conquer the emotional sabotage of fear, greed, and ego. In my Study Course, everything is taught through live, real-time chart breakdowns — covering market liquidity sweeps, displacement imbalances, asymmetric 1:3+ risk-to-reward architecture, and live execution checklists. You receive real-time guidance to eliminate hesitation, master your ego, and build an enduring, profitable career in financial markets.',
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
      'course.genesisBannerTitle': '⚡ SMC GENESIS • BEYOND THE CHARTS — Official Institutional Masterclass ➔',
      'course.genesisBannerSub': 'Explore our 10-Module Quantitative Architecture for XAU/USD Market Structure, S&D Extractions, Liquidity Traps, and Asymmetric Execution.',
      'course.genesisBannerBtn': 'Explore SMC Genesis ➔',

      // Capital & Portfolio Strategy
      'capital.badge': 'Private Capital & Portfolio Strategy • Negotiable Terms',
      'capital.title': 'Private Capital & Portfolio Strategy for <span class="gold-accent">Qualified Partners.</span>',
      'capital.leadText': 'Systematic portfolio execution and disciplined risk architecture. Bespoke terms negotiable for qualified partners — 100% segregated client custody with zero pooled risk.',
      'capital.p1Title': 'Segregated Custody & Account Sovereignty',
      'capital.p1Desc': 'Capital remains strictly in the client\'s own segregated account via institutional broker API, PAMM, or MAM architecture. No pooled retail funds; you retain 100% custodial ownership.',
      'capital.p2Title': 'Negotiable Risk & Drawdown Frameworks',
      'capital.p2Desc': 'Risk parameters, stop-out boundaries, and performance hurdles are established through bilateral negotiation to align precisely with your capital preservation goals.',
      'capital.p3Title': 'Strict Legal & Regulatory Compliance',
      'capital.p3Desc': 'Conducted privately with accredited partners in full adherence to applicable financial laws and SERC non-public solicitation standards.',
      'capital.btnInquire': 'Inquire via Direct Telegram (@Le_Bluue) ↗',
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
      'calc.badge': 'Risk Architecture • Position Sizing',
      'calc.title': 'Forex & Gold <span class="gold-accent">Lot Size Calculator</span>',
      'calc.desc': 'Calculate your exact mathematical position size before every market entry. Protect your equity by adhering strictly to BlueX\'s disciplined 0.5%–1.0% risk rule.',
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
      'calc.mottoQuote': '"Master your ego. Never risk capital beyond your rule-based edge." — BlueX',

      // Brokers Header
      'broker.sectionSubtitle': 'Partner Infrastructure',
      'broker.sectionTitle': 'Official <span class="italic">Broker Partners</span>',

      // Brokers (GTC GO)
      'broker.tag': 'Recommended Broker Platform',
      'broker.title': 'Trade with <span class="cyan-accent">GTC GO</span>',
      'broker.subDesc': 'Institutional multi-asset trading infrastructure with deep liquidity, ultra-fast STP execution, and advanced charting tools.',
      'broker.trust1': '✓ Tier-1 Regulated',
      'broker.trust2': '✓ Fast Deposit & Withdrawal',
      'broker.trust3': '✓ Raw Interbank Liquidity',
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
      'lirunex.trust1': '✓ Multi-Regulated (CySEC & LFSA)',
      'lirunex.trust2': '✓ Fast Deposit & Withdrawal',
      'lirunex.trust3': '✓ Raw Interbank STP / ECN',
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
      'treno.trust1': '✓ MetaTrader 5 (MT5)',
      'treno.trust2': '✓ Fast Deposit & Withdrawal',
      'treno.trust3': '✓ Deep Interbank Liquidity',
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
      'knowledge.badge': 'Proven Market Wisdom • Curated Library',
      'knowledge.title': 'Knowledge I Learned & <span class="gold-accent">Must-Read Books</span>',
      'knowledge.subDesc': 'Hard-earned market principles, psychological truths, and timeless books on trading, money, and emotional mastery that shaped my disciplined edge.',
      'knowledge.tabAll': 'All Resources',
      'knowledge.tabLessons': 'Lessons Learned',
      'knowledge.tabBooks': 'Popular Books',
      'knowledge.lessonsHeading': 'Core Lessons Learned in the Real Market',
      'knowledge.booksHeading': 'Must-Read Books: Trading, Money & Psychology',
      'knowledge.openPageBtn': 'Open Full Knowledge Vault ↗',

      // Lessons
      'knowledge.l1Tag': 'Market Structure & Liquidity',
      'knowledge.l1Title': 'Liquidity Sweeps Over Blind Patterns',
      'knowledge.l1Text': 'Retail traders memorize static chart patterns like double tops and trendlines. Institutions view these exact patterns as liquidity pools to sweep before moving price. Never enter until retail stops have been triggered and market structure confirms institutional directional alignment.',
      'knowledge.l1Rule': '“Wait for the liquidity sweep before committing capital. Without a sweep, you are the liquidity.”',

      'knowledge.l2Tag': 'Risk & Survival Math',
      'knowledge.l2Title': 'Capital Preservation is Your Only Lifeline',
      'knowledge.l2Text': 'A trader with a 40% win rate and a 1:3 Risk-to-Reward ratio will exponentially outperform a 90% scalper with no stop loss. Always calculate your exact lot size based on dollar risk (1% to 2% max per trade) and the distance to invalidation—never on emotion.',
      'knowledge.l2Rule': '“Define your dollar risk before you even consider potential reward. Survive first, compound second.”',

      'knowledge.l3Tag': 'Trading Psychology & Ego',
      'knowledge.l3Title': 'Ego is the Greatest Account Destroyer',
      'knowledge.l3Text': 'The market has no memory and zero personal interest in you. Losses are operating business expenses, not personal insults. Revenge trading is ego demanding to be right. Elite trading is executing a probabilistic edge with complete emotional detachment.',
      'knowledge.l3Rule': '“Master your ego. If a loss makes you angry, your position size was too big for your nervous system.”',

      'knowledge.l4Tag': 'Process & Daily Routine',
      'knowledge.l4Title': 'Consistency is Built in the Unseen Habits',
      'knowledge.l4Text': 'Professional trading is a high-performance mental sport. Consistency is not created during the trade; it is forged through pre-market session reviews, trade journaling, emotional check-ins, and strict adherence to personal non-negotiables.',
      'knowledge.l4Rule': '“A trade outside your rules is a losing trade, even if it ended in profit. Process is everything.”',

      // Books
      'knowledge.b1Genre': 'Psychology & Probabilities',
      'knowledge.b1Title': 'Trading in the Zone',
      'knowledge.b1Author': 'By Mark Douglas',
      'knowledge.b1Desc': 'The definitive masterwork on eliminating fear, accepting unavoidable market risk, and thinking in statistical probabilities.',
      'knowledge.b1Quote': '“When you genuinely accept the risks, you will be at peace with any outcome.”',
      'knowledge.b1Why': 'Essential for: Overcoming fear of losing & trade execution paralysis.',

      'knowledge.b2Genre': 'Money & Wealth Mindset',
      'knowledge.b2Title': 'The Psychology of Money',
      'knowledge.b2Author': 'By Morgan Housel',
      'knowledge.b2Desc': 'Timeless lessons on how behavioral discipline, staying humble, and long-term compounding surpass raw technical intelligence.',
      'knowledge.b2Quote': '“Doing well with money has a little to do with how smart you are and a lot to do with how you behave.”',
      'knowledge.b2Why': 'Essential for: Capital longevity & managing wealth without reckless greed.',

      'knowledge.b3Genre': 'Emotional Discipline',
      'knowledge.b3Title': 'The Disciplined Trader',
      'knowledge.b3Author': 'By Mark Douglas',
      'knowledge.b3Desc': 'Deep psychological roadmap detailing how internal beliefs and fear of being wrong sabotage traders, and how to construct rigid mental boundaries.',
      'knowledge.b3Quote': '“Ninety-five percent of trading errors stem from fear—fear of being wrong, losing money, and missing out.”',
      'knowledge.b3Why': 'Essential for: Eradicating emotional tilt and impulsive overtrading.',

      'knowledge.b4Genre': 'Market History & Tape',
      'knowledge.b4Title': 'Reminiscences of a Stock Operator',
      'knowledge.b4Author': 'By Edwin Lefèvre',
      'knowledge.b4Desc': 'The legendary fictionalized biography of Jesse Livermore. Unmatched insights on sitting through winning trends and respecting price action.',
      'knowledge.b4Quote': '“It was never my thinking that made the big money for me. It was always my sitting.”',
      'knowledge.b4Why': 'Essential for: Developing immense patience & letting winning trades run.',

      'knowledge.b5Genre': 'Master Strategies',
      'knowledge.b5Title': 'Market Wizards',
      'knowledge.b5Author': 'By Jack D. Schwager',
      'knowledge.b5Desc': 'Legendary interviews with top institutional traders proving that divergent methodologies all share one bedrock: ruthless risk management.',
      'knowledge.b5Quote': '“Risk control is the single most important factor shared by all great traders.”',
      'knowledge.b5Why': 'Essential for: Understanding how real institutional winners think and operate.',

      'knowledge.b6Genre': 'Habits & Routine',
      'knowledge.b6Title': 'Atomic Habits',
      'knowledge.b6Author': 'By James Clear',
      'knowledge.b6Desc': 'Practical guide to building systematic routines, eliminating friction in positive habits, and compounding 1% daily process improvements.',
      'knowledge.b6Quote': '“You do not rise to the level of your goals. You fall to the level of your systems.”',
      'knowledge.b6Why': 'Essential for: Creating daily pre-market preparation & journaling discipline.',

      'knowledge.b7Genre': 'Decision Under Pressure',
      'knowledge.b7Title': 'Thinking, Fast and Slow',
      'knowledge.b7Author': 'By Daniel Kahneman',
      'knowledge.b7Desc': 'Nobel laureate breakdown of System 1 (emotional intuition) vs System 2 (analytical logic), exposing dangerous cognitive biases.',
      'knowledge.b7Quote': '“We are prone to overestimate how much we understand and underestimate the role of chance.”',
      'knowledge.b7Why': 'Essential for: Recognizing cognitive bias and eliminating impulsive gambling.',

      'knowledge.b8Genre': 'Margin of Safety',
      'knowledge.b8Title': 'The Intelligent Investor',
      'knowledge.b8Author': 'By Benjamin Graham',
      'knowledge.b8Desc': 'The foundational bible of investment discipline. Teaches emotional detachment from market swings and the vital concept of risk margins.',
      'knowledge.b8Quote': '“The essence of investment management is the management of risks, not returns.”',
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
      'media.fbPostMeta': 'Recent Market Update • Public',
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
      'compliance.sercBadge': 'SERC Guidance • Law on Non-Government Securities',
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
      'genesis.badge': 'SMC GENESIS • BEYOND THE CHARTS • VERSION 4.0 PRO',
      'genesis.heroTitle': 'SMC GENESIS • BEYOND THE CHARTS<br><span class="highlight">Institutional Trading Architecture & Masterclass.</span>',
      'genesis.heroSub': 'An institutional-grade synthesis of Smart Money Concepts 2.0 & 3.0 engineered for Gold (XAU/USD) and major liquid markets. SMC Genesis replaces retail indicator guesswork with a structured 10-Module Quantitative Architecture—teaching you how institutions engineer liquidity, transfer multi-timeframe data, and execute with asymmetric risk precision.',
      'genesis.metric1Val': '10 Modules',
      'genesis.metric1Label': 'Structured Quantitative Curriculum',
      'genesis.metric2Val': 'Zero Indicators',
      'genesis.metric2Label': 'Pure Structure, S&D & Liquidity',
      'genesis.metric3Val': '0.5% – 1.0%',
      'genesis.metric3Label': 'Strict Capital Risk Per Setup',
      'genesis.metric4Val': '1:3 to 1:10+',
      'genesis.metric4Label': 'Asymmetric Risk-to-Reward Profile',
      'genesis.heroApplyBtn': '⚡ Register Now • DM @Le_Bluue',
      'genesis.heroCurriculumBtn': 'Explore 10-Module Syllabus ↓',
      'genesis.heroCommunityBtn': '👥 Join Community Telegram (t.me/moonbluefx)',
      'genesis.heroBrokerBtn': 'Execute on Low-Latency Raw Spreads →',
      'genesis.tenet1Title': 'MINDSET',
      'genesis.tenet1Desc': 'Probabilistic thinking, emotional neutrality & controlled risk acceptance',
      'genesis.tenet2Title': 'RULES',
      'genesis.tenet2Desc': '100% mechanical checklist discipline — no confirmation, no execution',
      'genesis.tenet3Title': 'CONSISTENT',
      'genesis.tenet3Desc': 'Long-term durability where Profit = Knowledge + Repeatable Skill',
      'genesis.introTag': 'EXECUTIVE BRIEFING • BEYOND THE CHARTS',
      'genesis.introTitle': 'A Quantitative Operating System for Institutional Price Delivery',
      'genesis.introP1': 'Financial markets do not move by random chance or retail chart patterns. Every major price expansion is driven by institutional liquidity engineering—accumulating orders where retail traders place predictable stop-losses.',
      'genesis.introP2': 'SMC Genesis (Version 4.0 Pro) is the proprietary flagship curriculum of BlueX Academy. It synthesizes foundational Smart Money Concepts 2.0 & 3.0 into a clean, rule-based institutional desk framework—designed to take a trader from raw structural mapping to surgical lower-timeframe execution without ever relying on lagging indicators.',
      'genesis.charter1': 'Data Collection & Homework Discipline: Theory alone builds zero skill. Mastery requires structured backtesting, forward-testing, and systematic chart logging.',
      'genesis.charter2': 'Objective Rule Validation: Every structural break (BOS), internal pullback (IBOS), fractal shift (FTS), and sweep is governed by strict mechanical criteria.',
      'genesis.charter3': 'Protected Intellectual Property: Complete lesson schematics, proprietary entry checklists, and live chart drills are reserved exclusively for enrolled SMC Genesis students.',
      'genesis.wisdom1Tag': 'INSTITUTIONAL WISDOM',
      'genesis.wisdom2Tag': 'DISCIPLINE OVER EMOTION',
      'genesis.creedText': 'SMC GENESIS: ធ្វើគឺដើម្បីទាំងអស់គ្នា ទាំងអស់គ្នាគឺធ្វើដើម្បីខ្លួនឯង!',
      'genesis.creedSub': 'Built for the collective • Mastered through personal discipline',
      'genesis.shiftBadge': 'The Paradigm Shift • Institutional vs Retail',
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
      'genesis.matrixLtfRole': 'Surgical Trigger & Tight SL (RR ≥ 1:3)',
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
      'genesis.m10Desc': 'Defending capital with mathematical rigor: 2-3 Pip Stop Loss Padding against spread spikes, mechanical Break-Even rules, asymmetric 1:3 to 1:10+ RR targets, and strict 0.5%–1.0% risk limits.',
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
      'genesis.tabRiskText': 'Institutional success requires unbreakable risk discipline and a focused learning environment. Adhere to our strict 0.5%–1.0% risk rule and collaborate with fellow disciplined traders inside our official group (t.me/moonbluefx).',
      'genesis.tabRiskRule': 'Capital Philosophy: Keep risk strictly at 0.5%–1.0% per trade. Let asymmetric math create long-term compound growth.',
      'genesis.admissionBadge': '🎓 5-Pillar Mastery Framework • Official Institutional Class',
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
      'genesis.std5Title': 'Pillar 05: Asymmetric Capital Allocation (0.5%–1.0% Rule)',
      'genesis.std5Desc': 'Defend trading capital through disciplined position sizing (0.5%–1.0%), dynamic break-even progression, and targeting asymmetric RR ≥ 1:3.',
      'genesis.std5Outcome': 'Applied Outcome: Safeguard capital longevity through mathematical asymmetric expectancy.',
      'genesis.quoteText': '"Trading success is not built on never taking a loss, but on unwavering discipline and defending your capital at all costs."',
      'genesis.quoteAuthor': '— SMC Genesis Institutional Blueprint • BlueX',
      'genesis.applyTelegramBtn': 'Message BlueX on Telegram (Direct DM: @Le_Bluue)',
      'genesis.communityTelegramBtn': 'Join Official Community Group (t.me/moonbluefx)',
      'genesis.announcementBadge': '🔥 Admissions Open',
      'genesis.announcementText': 'SMC Genesis Class — Master Gold (XAU/USD) Market Structure & S&D with BlueX',
      'genesis.announcementBtn': 'Enroll in Class via Telegram →',
      'genesis.spotlightBadge': '🎯 Official SMC Genesis Class',
      'genesis.spotlightTitle': 'Enroll in the SMC Genesis Institutional Class',
      'genesis.spotlightSub': 'We cut through retail illusions to teach you the mechanical precision required to trade institutional markets. Gain the confidence, rules, and execution habits of a professional operator.',
      'genesis.spotlightStatus': '● Admissions Active • Limited Class Intake',
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
      'genesis.spotlightActionBtn': '⚡ Inquire for Class Admissions: DM @Le_Bluue',
      'genesis.floatingCta': '⚡ Register Now - DM @Le_Bluue',
      'genesis.brokerBadge': 'Execution Speed & Raw Liquidity',
      'genesis.brokerTitle': 'Recommended Brokers for SMC Execution',
      'genesis.brokerDesc': 'Smart Money Concepts execution requires ultra-low latency, tightest raw spreads, deep order books, and zero artificial slippage. We recommend the following tier-1 regulated partners:',
      'genesis.brokerTrenoNote': 'Top Partner • Raw Spreads • Ultra-Low Latency',
      'genesis.brokerGtcNote': 'Global Multi-Regulated • Institutional Liquidity',
      'genesis.brokerLirunexNote': 'Regulated STP Broker • Deep Forex & Gold Liquidity',
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
      'hedging.heroDesc': 'Eliminate directional market exposure for jewelry stores, physical bullion vaults, and bullion custodians. Seamlessly translate Cambodian Damlung (តម្លឹង), Chi (ជី), and Grams into exact MT4/MT5 digital spot positions to lock in 100% of retail spread and fabrication margins.',
      'hedging.btnCalc': '⚡ Launch Hedging Calculator',
      'hedging.btnArch': 'Delta-Neutral Mechanics ➔',
      'hedging.ribbonDelta': 'Delta-Neutral Equilibrium',
      'hedging.ribbonConversion': 'Precision Standard Lot Conversion',
      'hedging.ribbonProfit': 'Retail Spread & Fabrication Margin Protected',
      'hedging.calcBadge': 'Real-Time Treasury Tool',
      'hedging.calcTitle': 'Physical-to-Digital <span class="gold-accent">Hedging Calculator</span>',
      'hedging.calcSubtitle': 'Calculate the exact mathematical counter-order, required initial margin, and safe fluctuation buffer required to keep your business delta-neutral.',
      'hedging.assetSelectLabel': '1. Select Precious Metal',
      'hedging.metalGoldName': 'Gold (XAU/USD)',
      'hedging.metalSilverName': 'Silver (XAG/USD)',
      'hedging.btnRefresh': 'Refresh',
      'hedging.step1Label': '2. Physical Inventory Flow',
      'hedging.dirBuyTitle': 'Shop Buys Metal',
      'hedging.dirBuySub': 'Inventory UP (+Weight) ➔ Need Digital SHORT',
      'hedging.dirSellTitle': 'Shop Sells Metal',
      'hedging.dirSellSub': 'Inventory DOWN (-Weight) ➔ Need Digital LONG',
      'hedging.localRateLabel': '3. Cambodian Physical Shop Cash Price (Outside Digital)',
      'hedging.btnSyncSpot': 'Auto-Sync Spot',
      'hedging.damlungRateLabel': 'Local Cash / Damlung (USD / 1 Damlung)',
      'hedging.chiRateLabel': 'Equivalent per Chi (USD / 1 Chi)',
      'hedging.localRateHelp': 'Physical counter cash rate quoted in Cambodian shops. 1 Damlung = 10 Chi = 37.5g ≈ 1.20565 Troy Ounces.',
      'hedging.step2Label': '4. Physical Quantity & Unit',
      'hedging.shopPresetsTitle': 'Shop Standard Presets (Relatable Unit Sizes):',
      'hedging.paramSpot': 'Digital Spot Price ($/oz)',
      'hedging.paramLeverage': 'Broker Leverage',
      'hedging.accountBalanceLabel': '5. Your Broker Account Balance ($ USD Equity)',
      'hedging.btnAutoFillBalance': 'Auto-Fill Safe Target',
      'hedging.balanceHelperNote': 'How much to deposit: Enter your account equity to verify if your capital buffer safely covers adverse market swings or if more capital is needed.',
      'hedging.paramBuffer': 'Adverse Price Swing Buffer ($/oz)',
      'hedging.bufferHelp': 'Capital reserve held in broker equity to absorb market moves against your hedge without triggering a stop-out before physical inventory is settled.',
      'hedging.cashCounterBadge': 'COUNTER CASH & LOCKED SPREAD PROFIT',
      'hedging.counterCashLabel': 'Physical Counter Cash Paid/Received:',
      'hedging.digitalSpotLabel': 'Digital Hedge Spot Value:',
      'hedging.lockedSpreadLabel': '🔒 Locked Counter Margin Profit:',
      'hedging.resBrokerLots': 'Standard Broker Lots',
      'hedging.resResidual': 'Unhedged Micro-Residual',
      'hedging.resNotional': 'Physical Inventory Value',
      'hedging.resMargin': 'Initial Margin Required',
      'hedging.stopOutRisk': 'Stop-Out Invalidation Spot',
      'hedging.safeCapBadge': 'RECOMMENDED BROKER CAPITAL',
      'hedging.safeCapTag': 'Zero Stop-Out Architecture',
      'hedging.userBalanceRow': 'Your Input Balance:',
      'hedging.capRowMargin': 'Initial Margin (Broker Lock):',
      'hedging.capRowBuffer': 'Adverse Swing Buffer (+$100/oz):',
      'hedging.balanceStatusLabel': 'Buffer Surplus / Shortfall:',
      'hedging.sopHeader': 'Practical Cashier Execution (How Every Shop Uses It)',
      'hedging.step1Title': 'Client Arrives at Shop Counter',
      'hedging.step1Desc': 'Weigh physical metal (Damlung/Chi) ➔ Pay/receive local counter cash.',
      'hedging.step2Title': 'Open Broker App on Phone/PC (10 Seconds)',
      'hedging.step2Desc': 'Place the exact digital hedge lot size displayed by the calculator.',
      'hedging.step3Title': 'Complete • Zero Gold Price Risk',
      'hedging.step3Desc': 'Whether gold moves $100-$300 up or down, your shop profit is 100% protected.',
      'hedging.proofTitle': 'Institutional Conversion Formulation',
      'hedging.archBadge': 'Dealer Principles',
      'hedging.archTitle': 'The Mechanics of <span class="gold-accent">Delta-Neutral Equilibrium</span>',
      'hedging.archSubtitle': 'Physical gold shops generate consistent profit from retail spreads, fabrication premiums, and minting markups. Holding naked directional risk gambles your business equity against global macroeconomic volatility.',
      'hedging.unhedgedTag': 'TRADITIONAL UNHEDGED SHOP',
      'hedging.unhedgedTitle': 'Naked Inventory Exposure',
      'hedging.unhedgedDesc': 'A shop buys 100 Damlung ($274,000) of gold from walk-in retail clients. Over the weekend, gold drops $120/oz on global macroeconomic news.',
      'hedging.hedgedTag': 'BLUEX DELTA-NEUTRAL PROTOCOL',
      'hedging.hedgedTitle': 'Pure Delta Equilibrium (Δ = 0)',
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
      'hedging.brokerCta': 'Open Institutional Account on Treno Markets ➔',
      'hedging.faqBadge': 'Frequently Answered',
      'hedging.faqTitle': 'Institutional <span class="gold-accent">Hedging FAQ</span>',
      'hedging.q1Title': 'Why should our shop hedge when gold generally rises in the long term?',
      'hedging.q1Answer': 'As a gold retailer, your profit engine is the spread between your buying price and selling price plus fabrication markup. You are in the business of high-turnover retail trading, not long-term speculative investing. Sudden 3%–5% intra-week market drops can completely wipe out months of retail profits if your vault inventory remains unhedged.',
      'hedging.q2Title': 'What happens if gold spikes while we have an open Short hedge?',
      'hedging.q2Answer': 'If the gold spot price surges, your digital short position will show a floating loss. However, the physical gold in your shop\'s vault appreciates by the exact same dollar amount. That is why holding our recommended Safe Capital Buffer ($100/oz adverse reserve) is essential: it ensures your broker account comfortably absorbs the temporary digital drawdown while your physical bullion gains value.',
      'hedging.q3Title': 'How do we handle odd weights smaller than 0.01 lot (31.1g)?',
      'hedging.q3Answer': 'Standard MT4/MT5 brokers execute in minimum increments of 0.01 lot (1 Troy Ounce = 31.10g ≈ 0.83 Damlung). For fractional transactions below 1 Troy Ounce, the calculator identifies your exact unhedged micro-residual. You simply accumulate minor retail purchases until reaching the 0.01 lot threshold, maintaining over 98% portfolio hedging efficiency.',
      'hedging.q4Title': 'Can we hedge other metals like Silver or Platinum?',
      'hedging.q4Answer': 'Yes. The mathematical delta-neutral principles remain identical across Silver (XAG/USD) and Platinum (XPT/USD), adjusting only for standard contract sizes (5,000 oz per standard Silver lot). BlueX Terminal provides custom formulas for multi-metal treasury desks.',
      'hedging.floatingCta': 'Consult Treasury Setup • DM @Le_Bluue',

      // Footer
      'footer.copy': '© 2026 BlueX. Master Your Ego. Master Your Trades. All rights reserved.'
    },

    km: {
      // Nav
      'nav.home': 'ទំព័រដើម',
      'nav.about': 'អំពី BlueX',
      'nav.brokers': 'ឈ្មួញកណ្តាល',
      'nav.courses': 'វគ្គសិក្សា',
      'nav.genesis': '<span class="genesis-pulse-dot"></span> SMC Genesis <span class="nav-new-badge">ថ្មី</span>',
      'nav.hedging': 'Hedging<span class="nav-label-full"> មាស</span>',
      'nav.drawerBrand': 'បណ្តាញ BLUEX TERMINAL',
      'nav.spotlightDesc': 'ស្ថាបត្យកម្មស្ថាប័ន ១០ ម៉ូឌុល',
      'nav.drawerDm': 'ចុះឈ្មោះឥឡូវនេះ — ផ្ញើសារផ្ទាល់ (@Le_Bluue)',
      'nav.capital': 'យុទ្ធសាស្ត្រ',
      'nav.calculator': 'គណនា Lot',
      'nav.knowledge': 'ចំណេះដឹង',
      'nav.pillars': 'គោលការណ៍គ្រឹះ',
      'nav.media': 'មេឌា',
      'nav.faq': 'សំណួរ-ចម្លើយ',
      'nav.connect': 'ទំនាក់ទំនង',
      'nav.telegram': 'តេឡេក្រាម',
      'nav.register': 'ចុះឈ្មោះ',
      'nav.registerNow': 'ចុះឈ្មោះ',
      'nav.fx': 'FX',
      'nav.fxDrawer': 'ចលនា: បើក (ចុចដើម្បីផ្អាក)',
      'nav.fxDrawerOff': 'ចលនា: ផ្អាក (ចុចដើម្បីបើក)',

      // Hero
      'hero.hey': 'សួស្តី',
      'hero.imBluex': 'ខ្ញុំគឺ BlueX',
      'hero.roleMentor': 'វគ្គសិក្សា (បង្រៀនផ្ទាល់) & យុទ្ធសាស្ត្រផលប័ត្រ',
      'hero.sagfxPartner': 'ដៃគូ SAGFX',
      'hero.title': 'គ្រប់គ្រងអហំការ (Ego) របស់អ្នក។<br>គ្រប់គ្រងការជួញដូររបស់អ្នក។',
      'hero.subRole1': 'ការជួញដូរប្រកបដោយវិន័យ',
      'hero.subRole2': 'វគ្គសិក្សាផ្ទាល់',
      'hero.subRole3': 'យុទ្ធសាស្ត្រផលប័ត្រ',
      'hero.btnCourse': 'វគ្គសិក្សា (បង្រៀនផ្ទាល់)',
      'hero.btnCapital': 'យុទ្ធសាស្ត្រផលប័ត្រឯកជន ↗',
      'hero.offeringsTitle': 'សេវាកម្មចម្បង',
      'hero.offering1': 'វគ្គសិក្សា & ការបង្រៀនផ្ទាល់',
      'hero.offering2': 'យុទ្ធសាស្ត្រផលប័ត្រឯកជន (ចរចាលក្ខខណ្ឌបាន)',
      'hero.offering3': 'ឈ្មួញកណ្តាលដៃគូ Treno Markets, GTC GO & Lirunex',
      'hero.offering4': 'ស្វែងយល់ពី Liquidity ស្ថាប័ន',
      'hero.offering5': 'យុទ្ធសាស្ត្រគ្រប់គ្រងហានិភ័យ',
      'hero.offering6': 'ចិត្តវិទ្យាជួញដូរ & ការគ្រប់គ្រង Ego',
      'hero.bioSnippet': 'ជា Trader និងគ្រូបង្វឹកផ្ទាល់ ដែលផ្តោតលើការកសាងវិន័យជួញដូរឱ្យមានប្រសិទ្ធភាពខ្ពស់ ការគ្រប់គ្រងហានិភ័យបែបស្ថាប័ន និងការការពារដើមទុនឱ្យគង់វង្សរយៈពេលវែង។',

      // About
      'about.mentorBadge': 'BlueX • គ្រូបង្វឹកជាន់ខ្ពស់',
      'about.availableTag': 'បើកទទួលការបង្វឹកផ្ទាល់',
      'about.signatureMotto': '"គ្រប់គ្រងអហំការរបស់អ្នក។<br><span>គ្រប់គ្រងការជួញដូររបស់អ្នក។</span>"',
      'about.signatureRole': 'Senior Trader & គ្រូបង្វឹកឯកជន',
      'about.leadText': 'ខ្ញុំជា Trader និងជាអ្នកបង្ហាត់បង្រៀនផ្ទាល់ ដែលជឿជាក់លើ<span style="color:var(--color-gold);">ការជួញដូរប្រកបដោយវិន័យម៉ឺងម៉ាត់</span> ការគ្រប់គ្រងហានិភ័យច្បាស់លាស់ និងការមើលឃើញទីផ្សារក្នុងរយៈពេលវែង។',
      'about.p1': 'ខ្ញុំជឿជាក់ថា <strong>ការជួញដូរដែលជោគជ័យ និងមានស្ថិរភាព គឺកើតចេញពីការអត់ធ្មត់ វិន័យ និងការសម្រេចចិត្តផ្អែកលើក្បួនច្បាប់</strong> — មិនមែនកើតចេញពីអារម្មណ៍ ឬការស្មាននោះឡើយ។ គោលដៅរបស់ខ្ញុំគឺបង្កើតតម្លៃពិតប្រាកដ និងយូរអង្វែង តាមរយៈ<strong>វិជ្ជាជីវៈ តម្លាភាព និងភាពស្មោះត្រង់</strong>។',
      'about.p2': 'មិនថាអ្នកជាវិនិយោគិន ឬជា Trader ដែលចង់កម្ចាត់បញ្ហាផ្លូវចិត្តដើម្បីសម្រេចបានលទ្ធផលថិតថេរនោះទេ <strong>ខ្ញុំស្វាគមន៍អ្នកដែលមានការគិតវែងឆ្ងាយ</strong> និងឱ្យតម្លៃខ្ពស់លើការគ្រប់គ្រងហានិភ័យ និងការការពារដើមទុន។',
      'about.sagfxNote': 'ដៃគូសហការ និងច្រកទូទាត់ប្រាក់តាម SAGFX អាចសាកសួរបានតាមការស្នើសុំផ្ទាល់។',
      'about.btnExplore': 'ស្វែងយល់ពីវគ្គសិក្សា',

      // Study Course
      'course.badge': 'ទទួលចំនួនកំណត់ • បង្រៀនផ្ទាល់ (Live 1-on-1 / Group)',
      'course.title': 'វគ្គសិក្សាផ្ទាល់ជាមួយ BlueX:<br><span class="highlight">Interactive Live Teaching (បង្រៀនលើក្រាហ្វិកផ្ទាល់)</span>',
      'course.leadPitch': 'ការបង្រៀនផ្ទាល់តាមរយៈការចែករំលែកអេក្រង់ (Share Screen) ដោយយើងវិភាគរចនាសម្ព័ន្ធទីផ្សារជាក់ស្តែងជាមួយគ្នា។ គ្មានវីដេអូចាស់ថតទុកឡើយ — រាល់មេរៀនទាំងអស់គឺបង្រៀនផ្ទាល់ ផ្ទៀងផ្ទាត់លើក្រាហ្វិក Real-Time និងផ្តោតលើការអនុវត្តជាក់ស្តែង។',
      'course.standardsTitle': 'លក្ខខណ្ឌតម្រូវក្នុងការចូលរៀន',
      'course.standardsSub': 'យើងកំណត់ស្តង់ដារច្បាស់លាស់ ដើម្បីធានាថាអ្នករៀនពិតជាទទួលបានលទ្ធផលពិតប្រាកដ។',
      'course.std1Title': 'ផ្តល់អាទិភាពលើការការពារដើមទុនជាចម្បង',
      'course.std1Desc': 'ត្រូវតែប្តេជ្ញាគ្រប់គ្រងហានិភ័យយ៉ាងតឹងរ៉ឹង (0.5%–1.0% ក្នុងមួយ Trade)។ មិនទទួលអ្នកដែលចង់លេងល្បែង ឬរំពឹងចង់មានបានលឿនតាមសញ្ញា (Signals) ឡើយ។',
      'course.std2Title': 'ជួញដូរតាមក្បួនច្បាប់ច្បាស់លាស់',
      'course.std2Desc': 'រៀនពី Setup ស្ថាប័នពិតប្រាកដ៖ Liquidity Sweeps, Market Structure Shifts, និង Imbalances មិនមែនស្មានតាមចិត្តឡើយ។',
      'course.std3Title': 'កត់ត្រាកំណត់ហេតុ (Trade Journal) គ្រប់ Trade',
      'course.std3Desc': 'តាមដានស្ថិតិ និងប្រើប្រាស់ Checklist មុនចូលផ្សារ ដើម្បីលុបបំបាត់កំហុសផ្លូវចិត្ត និងការជួញដូរតាមអារម្មណ៍។',
      'course.std4Title': 'ប្តេជ្ញាចិត្តចូលរួមរៀន និងអនុវត្តផ្ទាល់',
      'course.std4Desc': 'ចូលរួមរៀនលើ Live Chart យ៉ាងសកម្ម កត់ត្រាមេរៀន និងអនុវត្តលើគណនី Demo/Simulation ឱ្យស្ទាត់ជំនាញសិន មុននឹងប្រើប្រាស់លុយពិត។',
      'course.liveBarTitle': 'វគ្គចែករំលែកអេក្រង់បង្រៀនផ្ទាល់ (Live Screen-Share)',
      'course.liveBarSub': 'វិភាគ និងអនុវត្តលើទីផ្សារជាក់ស្តែង',
      'course.bodyText': 'Trader ភាគច្រើនខាតបង់គណនី មិនមែនដោយសារខ្វះ Indicator នោះទេ ប៉ុន្តែដោយសារពួកគេមិនយល់ពីរបៀបដែលស្ថាប័នធំៗជួញដូរ (Supply & Demand) និងមិនអាចគ្រប់គ្រងអារម្មណ៍ភ័យខ្លាច លោភលន់ និង Ego របស់ខ្លួនបាន។ នៅក្នុងវគ្គសិក្សារបស់ខ្ញុំ អ្វីៗទាំងអស់ត្រូវបានបង្រៀនផ្ទាល់តាមរយៈការវិភាគក្រាហ្វិក Real-Time — គ្របដណ្តប់លើ Liquidity Sweeps, Supply & Demand Imbalances, សមាមាត្រចំណេញធៀបការខាត 1:3+ និង Checklist ត្រួតពិនិត្យមុនចូលផ្សារ។ អ្នកនឹងទទួលបានការបង្ហាត់បង្ហាញផ្ទាល់ដើម្បីបំបាត់ការស្ទាក់ស្ទើរ គ្រប់គ្រង Ego និងកសាងអាជីពជួញដូរដែលទទួលបានផលចំណេញយូរអង្វែង។',
      'course.card1Title': 'ការបង្រៀនផ្ទាល់ Interactive Live',
      'course.card1Desc': 'បង្រៀនផ្ទាល់លើក្រាហ្វិកជាក់ស្តែង យល់ដឹងពី Institutional Supply & Demand, Liquidity Sweeps និង Setup ដែលមានភាគរយឈ្នះខ្ពស់។',
      'course.card2Title': 'ការគ្រប់គ្រងហានិភ័យ Asymmetric 1:3+',
      'course.card2Desc': 'ការពារដើមទុនជាចម្បង ជាមួយសមាមាត្រចំណេញធៀបហានិភ័យយ៉ាងតិច 1:3 និងការគ្រប់គ្រង Drawdown យ៉ាងម៉ឺងម៉ាត់។',
      'course.card3Title': 'គ្រប់គ្រង Ego & ចិត្តវិទ្យាជួញដូរ',
      'course.card3Desc': 'កម្ចាត់ការជួញដូរបែបសងសឹកទីផ្សារ (Revenge Trading), FOMO, ការ Overtrade និងភាពភ័យខ្លាចពេលចូលផ្សារ។',
      'course.card4Title': 'វិភាគក្រាហ្វិកទីផ្សារជាក់ស្តែង',
      'course.card4Desc': 'វិភាគទីផ្សារផ្ទាល់ ពិនិត្យ Setup ជាមួយគ្នា និងសួរសំណួរដេញដោលផ្ទាល់មាត់ ដើម្បីពង្រឹងការអនុវត្តជាក់ស្តែង។',
      'course.btnEnroll': 'ចុះឈ្មោះ / ផ្ញើសារផ្ទាល់ទៅកាន់ BlueX (@Le_Bluue)',
      'course.btnInquire': 'ផ្ញើសំណួរសាកសួរខាងក្រោម',
      'course.genesisBannerTitle': '⚡ SMC GENESIS • BEYOND THE CHARTS — វគ្គសិក្សាស្ថាបត្យកម្មស្ថាប័នផ្លូវការ ➔',
      'course.genesisBannerSub': 'ស្វែងយល់ពីស្ថាបត្យកម្ម Quantitative ទាំង ១០ ម៉ូឌុលសម្រាប់រចនាសម្ព័ន្ធមាស XAU/USD, ការស្រង់តំបន់ S&D, អន្ទាក់សាច់ប្រាក់ និងការចូលផ្សារបែប Asymmetric។',
      'course.genesisBannerBtn': 'ស្វែងយល់ SMC Genesis ➔',

      // Capital & Portfolio Strategy
      'capital.badge': 'យុទ្ធសាស្ត្រដើមទុន & ផលប័ត្រឯកជន • លក្ខខណ្ឌអាចចរចាបាន',
      'capital.title': 'យុទ្ធសាស្ត្រដើមទុន & ផលប័ត្រសម្រាប់ <span class="gold-accent">ដៃគូវិនិយោគ</span>',
      'capital.leadText': 'ការអនុវត្តជួញដូរផលប័ត្រជាប្រព័ន្ធ និងការគ្រប់គ្រងហានិភ័យយ៉ាងម៉ឺងម៉ាត់។ យើងអាចជួបពិភាក្សាចរចាលក្ខខណ្ឌផ្ទាល់ខ្លួន ដោយអនុលោមតាមច្បាប់ហិរញ្ញវត្ថុយ៉ាងតឹងរ៉ឹង — អតិថិជនរក្សាកម្មសិទ្ធិ ១០០% លើគណនីផ្ទាល់ខ្លួន គ្មានការប្រមូលប្រាក់រួមឡើយ។',
      'capital.p1Title': 'អតិថិជនកាន់កាប់គណនីផ្ទាល់ខ្លួន ១០០% (Segregated Custody)',
      'capital.p1Desc': 'ដើមទុនស្ថិតនៅក្នុងគណនីផ្ទាល់ខ្លួនរបស់អតិថិជននៅឯ Broker ស្ថាប័ន តាមរយៈប្រព័ន្ធ API, PAMM ឬ MAM។ គ្មានការប្រមូលលុយរួមឡើយ — អ្នកមានសិទ្ធិកាន់កាប់ និងដកប្រាក់គ្រប់ពេលវេលា។',
      'capital.p2Title': 'អាចចរចាកម្រិតហានិភ័យ & Drawdown បាន',
      'capital.p2Desc': 'កម្រិតហានិភ័យ កម្រិត Stop-Out និងគោលដៅប្រាក់ចំណេញ អាចជួបពិភាក្សាចរចាគ្នាជាលក្ខណៈឯកជន ដើម្បីឆ្លើយតបទៅនឹងគោលដៅការពារដើមទុនរបស់អ្នក។',
      'capital.p3Title': 'អនុលោមតាមច្បាប់ & បទដ្ឋាន SERC យ៉ាងតឹងរ៉ឹង',
      'capital.p3Desc': 'ធ្វើឡើងជាលក្ខណៈឯកជនជាមួយដៃគូដែលមានលក្ខណៈសម្បត្តិគ្រប់គ្រាន់ ដោយគោរពតាមបទប្បញ្ញត្តិហិរញ្ញវត្ថុ និងគោលការណ៍មិនកៀរគរទុនសាធារណៈរបស់និយ័តករមូលបត្រកម្ពុជា (SERC)។',
      'capital.btnInquire': 'សាកសួរតាម Telegram ផ្ទាល់ (@Le_Bluue) ↗',
      'capital.confidentialNote': 'ការពិគ្រោះយោបល់ឯកជន ១ ទល់នឹង ១',
      'capital.overlayBadge': 'ការគ្រប់គ្រងផលប័ត្រកំពុងដំណើរការ',
      'capital.targetModel': 'ម៉ូដែលគ្រប់គ្រងហានិភ័យ:',
      'capital.govTitle': 'រចនាសម្ព័ន្ធយុទ្ធសាស្ត្រផលប័ត្រឯកជន',
      'capital.govSub': 'ភ្ជាប់តាមរយៈ Direct API / PAMM / MAM',
      'capital.custodyLabel': 'ការកាន់កាប់គណនី',
      'capital.custodyVal': 'អតិថិជនកាន់កាប់ ១០០%',
      'capital.structureLabel': 'លក្ខខណ្ឌ',
      'capital.structureVal': 'ចរចាជាឯកជនទ្វេភាគី',
      'capital.riskGateLabel': 'កម្រិតការពារ',
      'capital.riskGateVal': 'កំណត់ Stop-Out ដាច់ខាត',

      // Calculator
      'calc.badge': 'ការគ្រប់គ្រងហានិភ័យ • ការគណនាទំហំ Lot',
      'calc.title': 'កម្មវិធីគណនា <span class="gold-accent">ទំហំ Lot មាស & Forex</span>',
      'calc.desc': 'គណនាទំហំ Position របស់អ្នកតាមរូបមន្តច្បាស់លាស់ មុនពេលចូលផ្សារនីមួយៗ។ ការពារដើមទុនរបស់អ្នកដោយប្រកាន់ខ្ជាប់នូវច្បាប់ហានិភ័យ 0.5%–1.0% របស់ BlueX។',
      'calc.ruleLabel': 'ច្បាប់ BlueX ទី ០១',
      'calc.ruleVal': 'កុំប្រថុយលើសពី ១.០% ក្នុងមួយ Trade',
      'calc.pairLabel': 'ជ្រើសរើសគូរូបិយប័ណ្ណ / មាស',
      'calc.balanceLabel': 'សមតុល្យគណនី ($)',
      'calc.stopLossLabel': 'Stop Loss (Points / Pips)',
      'calc.riskPercentLabel': 'ភាគរយហានិភ័យ (%)',
      'calc.resultsTag': 'ទំហំ Lot ដែលត្រូវចូល',
      'calc.safeRisk': 'ហានិភ័យមានវិន័យ',
      'calc.lotsUnit': 'Standard Lots',
      'calc.cashRiskLabel': 'ការខាតបង់ជាសាច់ប្រាក់អតិបរមា',
      'calc.pipValLabel': 'តម្លៃក្នុង ១ Point / Pip',
      'calc.contractUnitsLabel': 'បរិមាណកិច្ចសន្យា',
      'calc.targetRewardLabel': 'គោលដៅចំណេញ ១:៣',
      'calc.mottoQuote': '«គ្រប់គ្រងអហំការរបស់អ្នក។ កុំប្រថុយដើមទុនលើសពីច្បាប់ដែលអ្នកបានកំណត់ឱ្យសោះ។» — BlueX',

      // Brokers Header
      'broker.sectionSubtitle': 'ដៃគូហេដ្ឋារចនាសម្ព័ន្ធ',
      'broker.sectionTitle': 'ដៃគូ <span class="italic">ឈ្មួញកណ្តាលផ្លូវការ</span>',

      // Brokers (GTC GO)
      'broker.tag': 'ឈ្មួញកណ្តាលដែលបានណែនាំ',
      'broker.title': 'ជួញដូរជាមួយ <span class="cyan-accent">GTC GO</span>',
      'broker.subDesc': 'ប្រព័ន្ធជួញដូរកម្រិតស្ថាប័ន មានសន្ទុះសាច់ប្រាក់ជ្រៅ ការបញ្ជូនបញ្ជា STP ល្បឿនលឿន និងឧបករណ៍វិភាគទាន់សម័យ។',
      'broker.trust1': '✓ គ្រប់គ្រងដោយអាជ្ញាប័ណ្ណ Tier-1',
      'broker.trust2': '✓ ដាក់ & ដកប្រាក់រហ័សទាន់ចិត្ត',
      'broker.trust3': '✓ សន្ទុះសាច់ប្រាក់ Interbank ផ្ទាល់',
      'broker.tier1Badge': 'គណនី Standard',
      'broker.tier1Chip': 'គ្មានកម្រៃជើងសារ (Zero Commission)',
      'broker.tier1Title': 'គណនី Standard STP',
      'broker.tier1Desc': 'ការអនុវត្តបញ្ជា STP ផ្ទាល់ទៅកាន់ទីផ្សារ ដោយគ្មានកម្រៃជើងសារបន្ថែម។ ស័ក្តិសមបំផុតសម្រាប់ Trader ដែលជួញដូរប្រចាំថ្ងៃ។',
      'broker.tier1Check1': 'គ្មានកម្រៃលើការដាក់ & ដកប្រាក់',
      'broker.tier1Check2': 'ការបញ្ជូនបញ្ជា STP ល្បឿនលឿនបំផុត',
      'broker.tier1Check3': 'ជួញដូរមាស, Forex និងសន្ទស្សន៍សកលពេញលេញ',
      'broker.tier2Badge': 'គណនី Spread ទាប',
      'broker.tier2Chip': 'Spread ដើមពីផ្សារ (Zero Markup)',
      'broker.tier2Title': 'គណនី Raw Spread Interbank',
      'broker.tier2Desc': 'Spread ដើមផ្ទាល់ពីទីផ្សារ Interbank ដោយគ្មានការបន្ថែម Markup ឡើយ។ ស័ក្តិសមសម្រាប់ Swing Trader និងការចូលផ្សារច្បាស់លាស់។',
      'broker.tier2Check1': 'Spread កម្រិតស្ថាប័នផ្ទាល់ពី Interbank',
      'broker.tier2Check2': 'គ្មានការបន្ថែម Markup លើ Spread ទីផ្សារឡើយ',
      'broker.tier2Check3': 'ភាពជាក់លាក់ខ្ពស់បំផុតសម្រាប់ Setup ស្ថាប័ន',
      'broker.registerBtn': 'Register here',

      // Brokers (LIRUNEX)
      'lirunex.tag': 'ឈ្មួញកណ្តាលដែលបានណែនាំ',
      'lirunex.title': 'ជួញដូរជាមួយ <span class="gold-accent">LIRUNEX</span>',
      'lirunex.subDesc': 'ឈ្មួញកណ្តាល STP/ECN សកលដែលគ្រប់គ្រងដោយអាជ្ញាប័ណ្ណអន្តរជាតិ ផ្តល់ជូន Spread ចាប់ពី 0.0 pips ការបញ្ជាទិញរហ័ស និងប្រព័ន្ធ MT4/MT5 ទំនើប។',
      'lirunex.trust1': '✓ គ្រប់គ្រងដោយអាជ្ញាប័ណ្ណ (CySEC & LFSA)',
      'lirunex.trust2': '✓ ដាក់ & ដកប្រាក់រហ័សទាន់ចិត្ត',
      'lirunex.trust3': '✓ សន្ទុះសាច់ប្រាក់ Interbank STP / ECN',
      'lirunex.tier1Badge': 'គណនី Standard',
      'lirunex.tier1Chip': 'គ្មានកម្រៃជើងសារ (Zero Commission)',
      'lirunex.tier1Title': 'គណនី Standard STP',
      'lirunex.tier1Desc': 'ការអនុវត្តបញ្ជា STP ផ្ទាល់ទៅកាន់ទីផ្សារ ដោយគ្មានកម្រៃជើងសារបន្ថែម។ ស័ក្តិសមបំផុតសម្រាប់ Trader ដែលជួញដូរប្រចាំថ្ងៃ។',
      'lirunex.tier1Check1': 'គ្មានកម្រៃលើការដាក់ & ដកប្រាក់',
      'lirunex.tier1Check2': 'ការបញ្ជូនបញ្ជា STP ល្បឿនលឿន',
      'lirunex.tier1Check3': 'ជួញដូរមាស (XAU/USD), Forex & សន្ទស្សន៍ពេញលេញ',
      'lirunex.tier2Badge': 'គណនី Spread ទាប',
      'lirunex.tier2Chip': 'Raw ចាប់ពី 0.0 Pips',
      'lirunex.tier2Title': 'គណនី Prime ECN Interbank',
      'lirunex.tier2Desc': 'Spread ផ្ទាល់ពីទីផ្សារ Interbank ចាប់ពី 0.0 pips និងសន្ទុះសាច់ប្រាក់កម្រិតស្ថាប័ន។ ស័ក្តិសមសម្រាប់ការចូលផ្សារច្បាស់លាស់ និងការជួញដូរ Swing។',
      'lirunex.tier2Check1': 'Spread ផ្ទាល់ពី Interbank ចាប់ពី 0.0 pips',
      'lirunex.tier2Check2': 'សន្ទុះសាច់ប្រាក់ ECN ផ្ទាល់ & ជម្រៅទីផ្សារជ្រៅ',
      'lirunex.tier2Check3': 'ភាពជាក់លាក់ខ្ពស់បំផុតសម្រាប់ Setup ស្ថាប័ន',

      // Treno Markets Broker
      'treno.tag': 'ឈ្មួញកណ្តាលដែលបានណែនាំ',
      'treno.title': 'ជួញដូរជាមួយ <span class="cyan-accent">TRENO MARKETS</span>',
      'treno.subDesc': 'ឈ្មួញកណ្តាលពហុទ្រព្យសកម្មជំនាន់ថ្មី ដំណើរការលើ MetaTrader 5 (MT5) ជាមួយល្បឿនបញ្ជូនបញ្ជាលឿនបំផុត Spread ស្តើងពីទីផ្សារ និងការដាក់/ដកប្រាក់រហ័សទាន់ចិត្ត។',
      'treno.trust1': '✓ ដំណើរការលើ MetaTrader 5 (MT5)',
      'treno.trust2': '✓ ដាក់ & ដកប្រាក់រហ័សទាន់ចិត្ត',
      'treno.trust3': '✓ សន្ទុះសាច់ប្រាក់ Interbank ជ្រៅ',
      'treno.tier1Badge': 'គណនី Standard',
      'treno.tier1Chip': 'គ្មានកម្រៃជើងសារ (Zero Commission)',
      'treno.tier1Title': 'គណនី Standard MT5',
      'treno.tier1Desc': 'ការអនុវត្តបញ្ជាផ្ទាល់ទៅកាន់ទីផ្សារដោយគ្មានកម្រៃជើងសារ។ ស័ក្តិសមបំផុតសម្រាប់អ្នកជួញដូរប្រចាំថ្ងៃ និងការគ្រប់គ្រងហានិភ័យប្រកបដោយវិន័យ។',
      'treno.tier1Check1': 'គ្មានកម្រៃលើការដាក់ & ដកប្រាក់',
      'treno.tier1Check2': 'ការបញ្ជូនបញ្ជា MT5 ល្បឿនលឿនបំផុត',
      'treno.tier1Check3': 'ជួញដូរមាស (XAU/USD), Forex, សន្ទស្សន៍ & ទំនិញពេញលេញ',
      'treno.tier2Badge': 'គណនី Spread ទាប',
      'treno.tier2Chip': 'Raw ចាប់ពី 0.0 Pips',
      'treno.tier2Title': 'គណនី Raw Spread ECN',
      'treno.tier2Desc': 'Spread ផ្ទាល់ពីទីផ្សារ Interbank ចាប់ពី 0.0 pips និងជម្រៅទីផ្សារជ្រៅ។ បង្កើតឡើងសម្រាប់ Scalper, ការជួញដូរតាមប្រព័ន្ធ Algo និងចំណុចចូលច្បាស់លាស់។',
      'treno.tier2Check1': 'Spread ផ្ទាល់ពី Interbank ចាប់ពី 0.0 pips',
      'treno.tier2Check2': 'សន្ទុះសាច់ប្រាក់កម្រិតស្ថាប័ន & ជម្រៅទីផ្សារ',
      'treno.tier2Check3': 'ភាពជាក់លាក់ខ្ពស់បំផុតសម្រាប់ Stop-Loss តូចបំផុត',

      // Knowledge & Must-Read Books
      'knowledge.badge': 'ចំណេះដឹងពិតពីទីផ្សារ • បណ្ណាល័យសៀវភៅល្អៗ',
      'knowledge.title': 'ចំណេះដឹងដែលខ្ញុំបានរៀន & <span class="gold-accent">សៀវភៅល្អៗគួរអាន</span>',
      'knowledge.subDesc': 'គោលការណ៍ទីផ្សារដែលឆ្លងកាត់ការអនុវត្តផ្ទាល់ ចិត្តវិទ្យាពិត និងសៀវភៅល្បីៗលើពិភពលោកស្តីពីការជួញដូរ លុយកាក់ និងការគ្រប់គ្រងចិត្ត។',
      'knowledge.tabAll': 'ទាំងអស់',
      'knowledge.tabLessons': 'មេរៀនដែលបានរៀន',
      'knowledge.tabBooks': 'សៀវភៅពេញនិយម',
      'knowledge.lessonsHeading': 'មេរៀនគ្រឹះដែលខ្ញុំបានរៀនពីទីផ្សារជាក់ស្តែង',
      'knowledge.booksHeading': 'សៀវភៅពេញនិយមបំផុត៖ ការជួញដូរ លុយកាក់ & ចិត្តវិទ្យា',
      'knowledge.openPageBtn': 'ចូលមើលទំព័របណ្ណាល័យពេញលេញ ↗',

      // Lessons Khmer
      'knowledge.l1Tag': 'ទម្រង់ទីផ្សារ & Liquidity',
      'knowledge.l1Title': 'ការបោសសម្អាត Liquidity សំខាន់ជាង Pattern',
      'knowledge.l1Text': 'Trader ទូទៅតែងចាំ Chart Pattern បែបស្តង់ដារ ប៉ុន្តែស្ថាប័នធនាគារធំៗមើលឃើញ Pattern ទាំងនោះជាកន្លែង Stop Loss របស់គេ។ កុំប្រញាប់ចូលផ្សាររហូតដល់ទីផ្សារបោសសម្អាត Liquidity រួចរាល់ ហើយ Supply & Demand បញ្ជាក់ច្បាស់លាស់។',
      'knowledge.l1Rule': '«រង់ចាំទីផ្សារ Sweep Liquidity សិនមុននឹងចូលបញ្ជា។ បើគ្មានការ Sweep ទេ អ្នកហើយគឺជា Liquidity របស់ទីផ្សារ។»',

      'knowledge.l2Tag': 'ការគ្រប់គ្រងហានិភ័យ & ការរស់រាន',
      'knowledge.l2Title': 'ការការពារដើមទុន គឺជាជីវិតតែមួយគត់របស់អ្នក',
      'knowledge.l2Text': 'Trader ដែលមាន Win Rate ត្រឹម 40% ជាមួយសមាមាត្រ Risk-to-Reward 1:3 អាចបង្កើតប្រាក់ចំណេញបានច្រើនជាង Scalper ដែលមាន Win Rate 90% តែគ្មាន Stop Loss។ គណនាទំហំ Lot Size ជាក់លាក់ជានិច្ច មិនលើសពី 1% ទៅ 2% ក្នុង ១ Trade ឡើយ។',
      'knowledge.l2Rule': '«កំណត់ហានិភ័យរបស់អ្នកឱ្យច្បាស់លាស់ មុនពេលគិតដល់ប្រាក់ចំណេញ។ ការពារដើមទុនជាចម្បង។»',

      'knowledge.l3Tag': 'ចិត្តវិទ្យា & ការគ្រប់គ្រងអហំការ',
      'knowledge.l3Title': 'អហំការ (Ego) គឺជាអ្នកបំផ្លាញគណនីធំបំផុត',
      'knowledge.l3Text': 'ទីផ្សារមិនដែលចាំអ្នក ឬខ្វល់ពីអារម្មណ៍អ្នកឡើយ។ ការខាតបង់គឺជាថ្លៃដើមអាជីវកម្ម មិនមែនជាការប្រមាថលើខ្លួនអ្នកទេ។ ការជួញដូរបែបសងសឹក គឺជាការចង់ឈ្នះទីផ្សារ។ Trader អាជីពជួញដូរលើប្រូបាប៊ីលីតេ ដោយគ្មានអារម្មណ៍លោភលន់ ឬភ័យខ្លាច។',
      'knowledge.l3Rule': '«គ្រប់គ្រងអហំការរបស់អ្នក។ បើការខាតធ្វើឱ្យអ្នកខឹង មានន័យថាទំហំ Lot របស់អ្នកធំជ្រុលហួសកម្រិត។»',

      'knowledge.l4Tag': 'វិន័យ & ទម្លាប់ប្រចាំថ្ងៃ',
      'knowledge.l4Title': 'ភាពស្ថិតស្ថេរកើតចេញពីទម្លាប់រៀបចំទុកជាមុន',
      'knowledge.l4Text': 'ការជួញដូរគឺជាកីឡាផ្លូវចិត្តកម្រិតខ្ពស់។ ភាពជោគជ័យមិនមែនកើតឡើងពេលកំពុងចុច Trade ទេ គឺកើតចេញពីការវិភាគទុកជាមុន ការកត់ត្រា Journal គ្រប់ Trade និងការប្រកាន់ខ្ជាប់នូវច្បាប់របស់ខ្លួនយ៉ាងម៉ឺងម៉ាត់។',
      'knowledge.l4Rule': '«Trade ណាដែលចូលខុសពីផែនការ គឺជា Trade ខាត ទោះបីជាទទួលបានប្រាក់ចំណេញក៏ដោយ។ ដំណើរការត្រឹមត្រូវសំខាន់ជាងអ្វីៗទាំងអស់។»',

      // Books Khmer
      'knowledge.b1Genre': 'ចិត្តវិទ្យា & ប្រូបាប៊ីលីតេ',
      'knowledge.b1Title': 'Trading in the Zone',
      'knowledge.b1Author': 'និពន្ធដោយ Mark Douglas',
      'knowledge.b1Desc': 'សៀវភៅគ្រឹះដ៏ល្បីល្បាញបំផុតលើពិភពលោកស្តីពីការលុបបំបាត់ការភ័យខ្លាច ការទទួលយកហានិភ័យ និងការគិតលើប្រូបាប៊ីលីតេ។',
      'knowledge.b1Quote': '«នៅពេលដែលអ្នកទទួលយកហានិភ័យដោយស្មោះស្ម័គ្រ ចិត្តរបស់អ្នកនឹងមានសេចក្តីស្ងប់ចំពោះគ្រប់លទ្ធផល។»',
      'knowledge.b1Why': 'ចាំបាច់សម្រាប់៖ ការលុបបំបាត់ការភ័យខ្លាច និងការស្ទាក់ស្ទើរពេលចូលផ្សារ។',

      'knowledge.b2Genre': 'ផ្នត់គំនិតលុយកាក់',
      'knowledge.b2Title': 'The Psychology of Money',
      'knowledge.b2Author': 'និពន្ធដោយ Morgan Housel',
      'knowledge.b2Desc': 'មេរៀនមិនចេះចាស់ស្តីពីឥរិយាបថក្នុងការគ្រប់គ្រងលុយ ភាពរាបទាប និងការបង្កើតទ្រព្យសម្បត្តិដោយនិរន្តរភាព។',
      'knowledge.b2Quote': '«ការជោគជ័យជាមួយលុយ អាស្រ័យលើភាពឆ្លាតវៃបន្តិចបន្តួចប៉ុណ្ណោះ តែអាស្រ័យលើឥរិយាបថរបស់អ្នកស្ទើរតែទាំងស្រុង។»',
      'knowledge.b2Why': 'ចាំបាច់សម្រាប់៖ ការរក្សាដើមទុន និងការគ្រប់គ្រងទ្រព្យសម្បត្តិដោយមិនលោភលន់។',

      'knowledge.b3Genre': 'ការគ្រប់គ្រងអារម្មណ៍',
      'knowledge.b3Title': 'The Disciplined Trader',
      'knowledge.b3Author': 'និពន្ធដោយ Mark Douglas',
      'knowledge.b3Desc': 'ពន្យល់លម្អិតអំពីជំនឿផ្ទៃក្នុងដែលធ្វើឱ្យ Trader បរាជ័យ និងវិធីសាស្ត្រកសាងវិន័យផ្លូវចិត្តរឹងមាំក្នុងការជួញដូរ។',
      'knowledge.b3Quote': '«កំហុស ៩៥% ក្នុងការជួញដូរកើតចេញពីការភ័យខ្លាច—ខ្លាចខុស ខ្លាចបាត់បង់លុយ និងខ្លាចខកខានឱកាស (FOMO)។»',
      'knowledge.b3Why': 'ចាំបាច់សម្រាប់៖ ការបញ្ឈប់ការជួញដូរតាមអារម្មណ៍ និងការ Overtrade។',

      'knowledge.b4Genre': 'ប្រវត្តិទីផ្សារ & Tape Reading',
      'knowledge.b4Title': 'Reminiscences of a Stock Operator',
      'knowledge.b4Author': 'និពន្ធដោយ Edwin Lefèvre',
      'knowledge.b4Desc': 'ជីវប្រវត្តិបែបប្រលោមលោករបស់ស្តេចជួញដូរ Jesse Livermore បង្ហាញពីការអត់ធ្មត់ក្នុងការរង់ចាំឱកាស និងការបណ្តោយឱ្យចំណេញរត់ទៅមុខ។',
      'knowledge.b4Quote': '«វាមិនមែនជាការគិតច្រើនរបស់ខ្ញុំដែលរកលុយបានច្រើននោះទេ ប៉ុន្តែគឺការចេះអង្គុយរង់ចាំដោយអត់ធ្មត់។»',
      'knowledge.b4Why': 'ចាំបាច់សម្រាប់៖ ការបណ្តុះការអត់ធ្មត់ខ្ពស់ និងការមិនប្រញាប់កាត់ចំណេញ។',

      'knowledge.b5Genre': 'យុទ្ធសាស្ត្រស្ថាប័នកំពូល',
      'knowledge.b5Title': 'Market Wizards',
      'knowledge.b5Author': 'និពន្ធដោយ Jack D. Schwager',
      'knowledge.b5Desc': 'កិច្ចសម្ភាសន៍ជាក់ស្តែងជាមួយកំពូល Trader និងអ្នកគ្រប់គ្រងមូលនិធិធំៗលើពិភពលោក ដែលសុទ្ធសឹងប្រកាន់ខ្ជាប់នូវការគ្រប់គ្រងហានិភ័យ។',
      'knowledge.b5Quote': '«ការគ្រប់គ្រងហានិភ័យ គឺជាកត្តាសំខាន់បំផុតដែលកំពូល Trader ទាំងអស់ប្រកាន់ខ្ជាប់ដូចគ្នា។»',
      'knowledge.b5Why': 'ចាំបាច់សម្រាប់៖ ការយល់ដឹងពីផ្នត់គំនិតរបស់ Trader អាជីពកំពូល ១%។',

      'knowledge.b6Genre': 'ទម្លាប់ & វិន័យ',
      'knowledge.b6Title': 'Atomic Habits',
      'knowledge.b6Author': 'និពន្ធដោយ James Clear',
      'knowledge.b6Desc': 'ការកសាងប្រព័ន្ធទម្លាប់តូចៗ ១% ជារៀងរាល់ថ្ងៃ ដែលជួយបង្កើតវិន័យជាប់លាប់ក្នុងការរៀបចំផែនការ និងការកត់ត្រា Journal។',
      'knowledge.b6Quote': '«អ្នកមិនអាចឈានដល់កម្រិតនៃគោលដៅរបស់អ្នកទេ ប៉ុន្តែអ្នកនឹងធ្លាក់មកត្រឹមកម្រិតនៃប្រព័ន្ធទម្លាប់របស់អ្នក។»',
      'knowledge.b6Why': 'ចាំបាច់សម្រាប់៖ ការបង្កើតទម្លាប់ត្រៀមខ្លួនមុនទីផ្សារបើក និងការកត់ត្រាទិន្នន័យ។',

      'knowledge.b7Genre': 'ការសម្រេចចិត្តក្រោមសម្ពាធ',
      'knowledge.b7Title': 'Thinking, Fast and Slow',
      'knowledge.b7Author': 'និពន្ធដោយ Daniel Kahneman',
      'knowledge.b7Desc': 'ការស្រាវជ្រាវកម្រិតរង្វាន់ណូបែលអំពីការគិតបែបអារម្មណ៍ទាន់ហន់ (System 1) និងការគិតបែបវិភាគស៊ីជម្រៅ (System 2) ក្នុងទីផ្សារ។',
      'knowledge.b7Quote': '«មនុស្សយើងច្រើនតែវាយតម្លៃខ្ពស់លើការយល់ដឹងរបស់ខ្លួន ហើយវាយតម្លៃទាបលើតួនាទីនៃប្រូបាប៊ីលីតេ។»',
      'knowledge.b7Why': 'ចាំបាច់សម្រាប់៖ ការដឹងទាន់នូវភាពលំអៀងនៃការគិត និងការបញ្ឈប់ការភ្នាល់ដោយងងឹតងងល់។',

      'knowledge.b8Genre': 'Margin of Safety',
      'knowledge.b8Title': 'The Intelligent Investor',
      'knowledge.b8Author': 'និពន្ធដោយ Benjamin Graham',
      'knowledge.b8Desc': 'សៀវភៅគ្រឹះដ៏ល្បីស្តីពីការវិនិយោគដោយវិន័យ ការមិនតក់ស្លុតតាមទីផ្សារ (Mr. Market) និងការការពារហានិភ័យជាចម្បង។',
      'knowledge.b8Quote': '«ខ្លឹមសារនៃការគ្រប់គ្រងការវិនិយោគ គឺជាការគ្រប់គ្រងហានិភ័យ មិនមែនជាការគ្រប់គ្រងប្រាក់ចំណេញនោះទេ។»',
      'knowledge.b8Why': 'ចាំបាច់សម្រាប់៖ ការយល់ដឹងពីតម្លៃហានិភ័យ និងការជួញដូរបែប Swing Trading។',

      // Pillars
      'pillars.subtitle': 'ទស្សនវិជ្ជាជួញដូរ',
      'pillars.title': 'គោលការណ៍គ្រឹះ ៣ នៃ <span class="italic">ភាពជោគជ័យយូរអង្វែង</span>',
      'pillars.quoteHead': 'គ្រប់គ្រងអហំការរបស់អ្នក។ គ្រប់គ្រងការជួញដូររបស់អ្នក។',
      'pillars.quoteSub': 'ជួញដូរដោយចិត្តស្ងប់ គ្មានការរំខានពីអារម្មណ៍ និងប្រកាន់ខ្ជាប់នូវក្បួនច្បាប់ច្បាស់លាស់។',
      'pillars.p1Num': 'គោលការណ៍គ្រឹះ ០១',
      'pillars.p1Title': 'ការអនុវត្តប្រកបដោយវិន័យ & ការគ្រប់គ្រងហានិភ័យ',
      'pillars.p1Desc': 'រាល់ការចូលផ្សារទាំងអស់ត្រូវមានទំហំ Position ច្បាស់លាស់ កម្រិត Stop Loss កំណត់ជាមុន និងសមាមាត្រចំណេញធៀបហានិភ័យជាប្រព័ន្ធ។ ការការពារដើមទុន គឺជាកាតព្វកិច្ចចម្បង មុននឹងគិតដល់ការបង្កើនប្រាក់ចំណេញ។',
      'pillars.p2Num': 'គោលការណ៍គ្រឹះ ០២',
      'pillars.p2Title': 'ការគ្រប់គ្រង Ego & អារម្មណ៍',
      'pillars.p2Desc': '«គ្រប់គ្រងអហំការរបស់អ្នក។ គ្រប់គ្រងការជួញដូររបស់អ្នក។» យកឈ្នះ FOMO ការលោភលន់ និងការជួញដូរតាមអារម្មណ៍។ យើងជួញដូរដោយការអត់ធ្មត់ និងធ្វើការសម្រេចចិត្តផ្អែកលើទិន្នន័យ និងប្រូបាប៊ីលីតេ។',
      'pillars.p3Num': 'គោលការណ៍គ្រឹះ ០៣',
      'pillars.p3Title': 'ទស្សនវិស័យវែងឆ្ងាយ & ការរៀនសូត្រជាប្រចាំ',
      'pillars.p3Desc': 'ការរៀនសូត្រជាបន្ត និងការយល់ដឹងស៊ីជម្រៅអំពីទីផ្សារហិរញ្ញវត្ថុសកល។ កសាងទំនុកចិត្ត បង្កើតតម្លៃយូរអង្វែង និងរីកចម្រើនជាមួយគ្នាប្រកបដោយចក្ខុវិស័យវែងឆ្ងាយ។',

      // Media
      'media.subtitle': 'ទស្សនា & រៀនសូត្រ',
      'media.title': 'វីដេអូវិភាគចុងក្រោយ & <span class="italic">បណ្តាញសង្គម</span>',
      'media.ytBadge': 'វីដេអូ YouTube ពិសេស',
      'media.latestUpload': 'វីដេអូចុងក្រោយ',
      'media.ytSubscribe': 'ជាវ (Subscribe) លើ YouTube',
      'media.watchDirect': 'មើលលើ YouTube',
      'media.tiktokTitle': 'TikTok វីដេអូខ្លីប្រចាំថ្ងៃ',
      'media.tt1Title': 'មូលហេតុ 95% នៃ Trader ខាតបង់ប្រាក់ (អន្ទាក់ Ego)',
      'media.tt2Title': 'របៀបដែលធនាគារ Sweep Stop Loss មុនពេលទីផ្សាររត់ធំ',
      'media.fbTitle': 'ការចែករំលែកលើ Facebook',
      'media.fbPostMeta': 'ការអាប់ដេតទីផ្សារថ្មីៗ • សាធារណៈ',
      'media.fbPostText': '«ការអត់ធ្មត់គឺជាប្រៀបខ្លាំងបំផុតរបស់អ្នកក្នុងទីផ្សារប្រែប្រួល។ កុំដេញចាប់ទៀនបៃតងដោយសារតែខ្លាចខកខានឱកាស (FOMO)។ អ្នកជំនាញពិតប្រាកដតែងតែរង់ចាំ Setup របស់ខ្លួនឱ្យស្របតាមក្បួនច្បាស់លាស់ ទើបចូលផ្សារដោយគ្មានភាពស្ទាក់ស្ទើរ។»',
      'media.fbView': 'មើលការពិភាក្សាលើ Facebook',

      // FAQ
      'faq.subtitle': 'សំណួរដែលសួរញឹកញាប់',
      'faq.title': 'ចម្លើយច្បាស់លាស់សម្រាប់ <span class="italic">Trader ប្រកបដោយវិន័យ</span>',
      'faq.desc': 'អ្វីៗដែលអ្នកគួរដឹងអំពីកម្មវិធីសិក្សា ការបង្រៀនផ្ទាល់ ម៉ូដែលហានិភ័យ និងអនុលោមភាពច្បាប់។',
      'faq.q1': 'តើវគ្គសិក្សា និងកម្មវិធីបង្វឹកនេះស័ក្តិសមសម្រាប់អ្នកណា?',
      'faq.a1': 'កម្មវិធីសិក្សានេះរៀបចំឡើងសម្រាប់ Trader កម្រិតដំបូង និងមធ្យម ដែលមិនទាន់ទទួលបានលទ្ធផលថិតថេរ ឬកំពុងវង្វេងជាមួយ Indicator ច្រើនពេក ឬជួញដូរតាមអារម្មណ៍។ មិនថាអ្នកចង់យល់ដឹងពីមូលដ្ឋានគ្រឹះទីផ្សារ ឬចង់ប្តូរមកជួញដូរបែប Institutional Supply & Demand នោះទេ កម្មវិធីនេះផ្តល់ជូននូវក្បួនច្បាប់ច្បាស់លាស់ និងអាចអនុវត្តជាក់ស្តែងបាន។',
      'faq.q2': 'តើអ្នកបង្រៀនលើវិធីសាស្ត្រជួញដូរ និងទីផ្សារណាខ្លះ?',
      'faq.a2': 'យើងមានជំនាញលើ Institutional Supply & Demand, Liquidity Sweeps, Supply & Demand Imbalances និង Asymmetric Risk Architecture។ យើងផ្តោតលើទីផ្សារដែលមានសន្ទុះសាច់ប្រាក់ខ្ពស់ រួមមានគូរូបិយប័ណ្ណសំខាន់ៗ មាស (XAU/USD) និងសន្ទស្សន៍សកល។ យើងមិនជួញដូរតាមការស្មាន ឬទីផ្សារដែលគ្មានសាច់ប្រាក់នោះឡើយ។',
      'faq.q3': 'តើវគ្គសិក្សា Study Course ត្រូវបានរៀបចំ និងបង្រៀនយ៉ាងដូចម្តេច?',
      'faq.a3': 'រាល់ការបង្រៀនទាំងអស់គឺធ្វើឡើងតាមរយៈការ Live បង្រៀនផ្ទាល់ជាមួយ BlueX (Share Screen)។ រាល់ទ្រឹស្តីទាំងអស់ត្រូវបានបង្រៀនផ្ទាល់លើក្រាហ្វិកជាក់ស្តែង Real-Time ជជែកសួរដេញដោលផ្ទាល់មាត់ វិភាគ Trade ផ្ទាល់ និងកែតម្រូវកំហុសផ្លូវចិត្តរបស់អ្នកភ្លាមៗ។',
      'faq.q4': 'តើវិធីសាស្ត្រគ្រប់គ្រងហានិភ័យរបស់អ្នកមានលក្ខណៈដូចម្តេច?',
      'faq.a4': 'ការគ្រប់គ្រងហានិភ័យគឺជាបេះដូងចម្បង៖ <em>ការពារដើមទុនជាមុនសិន មុននឹងស្វែងរកផលចំណេញ</em>។ ការកំណត់ទំហំ Position ត្រូវតែគោរពតាមហានិភ័យដែលបានកំណត់ (0.5% ទៅ 1.0% ក្នុងមួយ Trade) និងកំណត់គោលដៅចំណេញធៀបហានិភ័យយ៉ាងហោចណាស់ 1:3។ យើងប្រើប្រាស់ Stop Loss ដាច់ខាត និងមិនប្រើប្រាស់យុទ្ធសាស្ត្រ Martingale ឬ Grid ដែលប្រថុយប្រថានឡើយ។',
      'faq.q5': 'តើទំនាក់ទំនងរវាង BlueX និង SAGFX គឺជាអ្វី?',
      'faq.a5': 'SAGFX គឺជាដៃគូ Affiliate និងជាអ្នកផ្តល់សេវាច្រកទូទាត់ប្រាក់ (Payment Gateway)។ ការចូលរួមជាមួយ Broker ឬវេទិកាភាគីទីបីណាមួយ គឺជាការស្ម័គ្រចិត្ត និងការសម្រេចចិត្តផ្ទាល់ខ្លួនរបស់ Trader ម្នាក់ៗ។ អតិថិជនអាចសាកសួរព័ត៌មានបន្ថែមបានតាមការស្នើសុំ។',
      'faq.q6': 'តើ BlueX អនុវត្តស្របតាមបទប្បញ្ញត្តិហិរញ្ញវត្ថុកម្ពុជា (SERC) យ៉ាងដូចម្តេច?',
      'faq.a6': 'ដើម្បីគោរពតាមបទប្បញ្ញត្តិរបស់និយ័តករមូលបត្រកម្ពុជា (SERC) និងច្បាប់ស្តីពីមូលបត្រមិនមែនរដ្ឋ រាល់មាតិកា វគ្គសិក្សា ការបង្រៀនផ្ទាល់ និងការវិភាគទីផ្សារដែលផ្តល់ដោយ BlueX គឺសម្រាប់គោលបំណង<strong>អប់រំ និងការវិភាគ ១០០%</strong>។ BlueX មិនកៀរគរ ទទួល ឬគ្រប់គ្រងមូលនិធិសាធារណៈឡើយ ហើយមិនមែនជាឈ្មួញកណ្តាលឧបករណ៍ហិរញ្ញវត្ថុដែលគ្មានអាជ្ញាប័ណ្ណនៅកម្ពុជាឡើយ។ រាល់សកម្មភាពជួញដូរទាំងអស់គឺជាការសម្រេចចិត្តដោយខ្លួនឯងរបស់បុគ្គលម្នាក់ៗ។',
      'faq.q7': 'តើខ្ញុំអាចចុះឈ្មោះចូលរៀន ឬទាក់ទងដោយរបៀបណា?',
      'faq.a7': 'អ្នកអាចទាក់ទងមកកាន់ Telegram ផ្ទាល់របស់ BlueX (<a href="https://t.me/Le_Bluue" target="_blank" rel="noopener noreferrer" style="color:var(--color-gold); font-weight:700;">@Le_Bluue</a>) ឬចូលរួមក្នុងក្រុម Telegram សហគមន៍ផ្លូវការ (<a href="https://t.me/moonbluefx" target="_blank" rel="noopener noreferrer" style="color:var(--color-cyan); font-weight:700;">t.me/moonbluefx</a>) ឬបំពេញទម្រង់សាកសួរនៅលើគេហទំព័រនេះ។ ខ្ញុំនឹងផ្តល់ជូននូវព័ត៌មានលម្អិត និងកាលវិភាគជូនអ្នក។',

      // Connect
      'connect.heading': 'តាមដាន & ទំនាក់ទំនងជាមួយ <span class="gold">BlueX</span>',
      'connect.desc': 'តាមដានបណ្តាញសង្គមផ្លូវការរបស់ខ្ញុំ ដើម្បីទទួលបានការវិភាគទីផ្សារប្រចាំថ្ងៃ ចិត្តវិទ្យាជួញដូរ ការប្រកាសវគ្គសិក្សា និងការអាប់ដេតទីផ្សារផ្ទាល់។',
      'connect.nameLabel': 'ឈ្មោះពេញរបស់អ្នក',
      'connect.emailLabel': 'អ៊ីមែលរបស់អ្នក',
      'connect.messageLabel': 'សារ / ការសាកសួរព័ត៌មានវគ្គសិក្សា',
      'connect.btnSubmit': 'ផ្ញើសារសាកសួរផ្ទាល់',

      // Compliance
      'compliance.flagBadge': 'ក្របខ័ណ្ឌបទប្បញ្ញត្តិកម្ពុជា',
      'compliance.title': 'សេចក្តីថ្លែងការណ៍ស្តីពីអនុលោមភាពច្បាប់ & បទប្បញ្ញត្តិ',
      'compliance.sercBadge': 'គោលការណ៍ណែនាំ SERC • ច្បាប់ស្តីពីមូលបត្រមិនមែនរដ្ឋ',
      'compliance.item1Title': 'គោលបំណងអប់រំ & ការវិភាគ ១០០%',
      'compliance.item1Desc': 'រាល់វគ្គសិក្សា ការបង្រៀនផ្ទាល់ និងការវិភាគទីផ្សារនៅលើគេហទំព័រនេះ គឺផ្តល់ជូនក្នុងគោលបំណងអប់រំតែប៉ុណ្ណោះ។ BlueX មិនផ្តល់ដំបូន្មានវិនិយោគផ្ទាល់ខ្លួន សេវាប្រឹក្សាហិរញ្ញវត្ថុ ឬផ្តល់សញ្ញាជួញដូរ (Signals) ឡើយ។',
      'compliance.item2Title': 'មិនមានការកៀរគរទុន ឬគ្រប់គ្រងមូលនិធិសាធារណៈឡើយ',
      'compliance.item2Desc': 'ដើម្បីអនុលោមតាមច្បាប់នៃព្រះរាជាណាចក្រកម្ពុជា BlueX មិនកៀរគរ ប្រមូល ទទួល ឬគ្រប់គ្រងមូលនិធិរួម ឬដើមទុនវិនិយោគសាធារណៈឡើយ។ មិនមានការផ្តល់ជូននូវគណនីគ្រប់គ្រង ឬគម្រោងវិនិយោគរួម (CIS) ដល់វិនិយោគិនទូទៅឡើយ។',
      'compliance.item3Title': 'ជាអ្នកបណ្តុះបណ្តាលឯករាជ្យ មិនមែនជាឈ្មួញកណ្តាលគ្មានអាជ្ញាប័ណ្ណ',
      'compliance.item3Desc': 'BlueX ដំណើរការជាគ្រូបង្វឹក និងជាអ្នកអប់រំឯករាជ្យ មិនមែនជាក្រុមហ៊ុនមូលបត្រ ឬឈ្មួញកណ្តាលឧបករណ៍ហិរញ្ញវត្ថុដែលគ្មានអាជ្ញាប័ណ្ណនៅកម្ពុជាឡើយ។ ការលើកឡើងអំពី SAGFX គឺកំណត់ត្រឹមតែជាដៃគូ Affiliate និងច្រកទូទាត់ប្រាក់ស្រេចចិត្តតែប៉ុណ្ណោះ។',
      'compliance.item4Title': 'ការជួញដូរដោយខ្លួនឯង & សេចក្តីជូនដំណឹងអំពីហានិភ័យ',
      'compliance.item4Desc': 'ការជួញដូររូបិយប័ណ្ណបរទេស (Forex), CFD និងឧបករណ៍ហិរញ្ញវត្ថុដេរីវេទីវ មានហានិភ័យខ្ពស់នៃការខាតបង់ដើមទុន ហើយមិនស័ក្តិសមសម្រាប់មនុស្សគ្រប់គ្នានោះទេ។ អ្នកចូលរួមទីផ្សារត្រូវតែសម្រេចចិត្តដោយខ្លួនឯង និងអនុវត្តការគ្រប់គ្រងហានិភ័យស្របតាមលទ្ធភាពហិរញ្ញវត្ថុផ្ទាល់ខ្លួន។',
      'compliance.exactDisclaimer': '<strong>សេចក្តីប្រកាសបដិសេធជាផ្លូវការ៖</strong> មាតិកានេះគឺសម្រាប់គោលបំណងអប់រំតែប៉ុណ្ណោះ ហើយមិនមែនជាការណែនាំផ្នែកហិរញ្ញវត្ថុ ឬការវិនិយោគឡើយ។ ការជួញដូរក្នុងទីផ្សារហិរញ្ញវត្ថុមានហានិភ័យ។ សូមស្រាវជ្រាវដោយខ្លួនឯង និងជួញដូរប្រកបដោយការទទួលខុសត្រូវជានិច្ច។',

      // SMC Genesis Institutional Portal
      'genesis.badge': 'SMC GENESIS • BEYOND THE CHARTS • ជំនាន់ 4.0 PRO',
      'genesis.heroTitle': 'SMC GENESIS • BEYOND THE CHARTS<br><span class="highlight">ស្ថាបត្យកម្មជួញដូរកម្រិតស្ថាប័ន & ថ្នាក់បង្រៀនផ្លូវការ។</span>',
      'genesis.heroSub': 'ការរួមបញ្ចូលគ្នានៃទ្រឹស្តីគ្រឹះ Smart Money Concepts 2.0 & 3.0 រៀបចំឡើងសម្រាប់មាស (XAU/USD) និងទីផ្សារហិរញ្ញវត្ថុចម្បង។ SMC Genesis លុបបំបាត់ការស្មានតាម Indicator ជំនួសដោយប្រព័ន្ធមេរៀន Quantitative ទាំង ១០ ម៉ូឌុលច្បាស់លាស់ — បង្រៀនអ្នកពីរបៀបស្ថាប័នរៀបចំ Liquidity, ការផ្ទេរទិន្នន័យពហុកាលវេលា និងការចូល Trade ជាមួយហានិភ័យទាបបំផុត។',
      'genesis.metric1Val': '១០ ម៉ូឌុល',
      'genesis.metric1Label': 'កម្មវិធីសិក្សា Quantitative ពេញលេញ',
      'genesis.metric2Val': 'គ្មាន Indicator',
      'genesis.metric2Label': 'ផ្អែកលើ Structure, S&D & Liquidity',
      'genesis.metric3Val': '0.5% – 1.0%',
      'genesis.metric3Label': 'កម្រិតហានិភ័យដើមទុនក្នុងមួយ Trade',
      'genesis.metric4Val': '1:3 ដល់ 1:10+',
      'genesis.metric4Label': 'សមាមាត្រហានិភ័យធៀបផលចំណេញ (R:R)',
      'genesis.heroApplyBtn': '⚡ ចុះឈ្មោះចូលរៀន • DM @Le_Bluue',
      'genesis.heroCurriculumBtn': 'ពិនិត្យមើលមេរៀនទាំង ១០ ម៉ូឌុល ↓',
      'genesis.heroCommunityBtn': '👥 ចូលរួម Community Telegram (t.me/moonbluefx)',
      'genesis.heroBrokerBtn': 'ជួញដូរលើ Raw Spreads ល្បឿនលឿន →',
      'genesis.tenet1Title': 'ផ្នត់គំនិត (MINDSET)',
      'genesis.tenet1Desc': 'ការគិតតាមប្រូបាប៊ីលីតេ គ្មានអារម្មណ៍លម្អៀង និងទទួលស្គាល់ការខាតបង់ដែលបានគ្រប់គ្រង',
      'genesis.tenet2Title': 'វិន័យច្បាប់ (RULES)',
      'genesis.tenet2Desc': 'គោរពច្បាប់ Checklists 100% — គ្មាន Confirmation គឺមិនចុច Order ដាច់ខាត',
      'genesis.tenet3Title': 'ស្ថិរភាព (CONSISTENT)',
      'genesis.tenet3Desc': 'ស្ថិរភាពយូរអង្វែងដែល ចំណេញ = ចំណេះ + ជំនាញអនុវត្តដដែលៗ',
      'genesis.introTag': 'សេចក្តីសង្ខេបស្ថាប័ន • BEYOND THE CHARTS',
      'genesis.introTitle': 'ប្រព័ន្ធប្រតិបត្តិការ Quantitative សម្រាប់ការជួញដូរកម្រិតស្ថាប័ន',
      'genesis.introP1': 'ទីផ្សារហិរញ្ញវត្ថុមិនមែនដើរតាមភាពចៃដន្យ ឬទម្រង់ក្រាបរបស់ Retail ឡើយ។ រាល់ការរុញតម្លៃធំៗសុទ្ធតែត្រូវបានជំរុញដោយការរៀបចំ Liquidity របស់ស្ថាប័ន តាមរយៈការស្រូបយក Stop Loss របស់ Trader រាយ។',
      'genesis.introP2': 'SMC Genesis (ជំនាន់ 4.0 Pro) គឺជាកម្មវិធីសិក្សាផ្លូវការផ្តាច់មុខរបស់ BlueX Academy។ វាបានច្របាច់បញ្ចូលទ្រឹស្តី Smart Money Concepts 2.0 & 3.0 ទៅជាក្បួនប្រតិបត្តិការជាក់ស្តែងកម្រិតស្ថាប័ន — នាំអ្នកសិក្សាពីការគូសរចនាសម្ព័ន្ធរហូតដល់ចំណុចចូល Trade ដ៏មុតស្រួចលើ Timeframe តូច ដោយមិនពឹងផ្អែកលើ Indicator យឺតយ៉ាវឡើយ។',
      'genesis.charter1': '<strong>ការប្រមូលទិន្នន័យ & កិច្ចការផ្ទះ:</strong> ទ្រឹស្តីតែមួយមុខមិនអាចបង្កើតជំនាញបានឡើយ។ ភាពស្ទាត់ជំនាញទាមទារការ Backtest, Forward-test និងកត់ត្រា Chart យ៉ាងខ្ជាប់ខ្ជួន។',
      'genesis.charter2': '<strong>ការផ្ទៀងផ្ទាត់ច្បាប់ច្បាស់លាស់:</strong> រាល់ការបំបែករចនាសម្ព័ន្ធ (BOS), រលកទាញថយ (IBOS), ការប្តូរទិស Fractal (FTS), និង Sweep សុទ្ធតែមានលក្ខខណ្ឌមេកានិចសុក្រឹត។',
      'genesis.charter3': '<strong>ការការពារកម្មសិទ្ធិបញ្ញា:</strong> គំនូរប្លង់មេរៀនពេញលេញ, បញ្ជីត្រួតពិនិត្យ Entry, និងការហ្វឹកហាត់លើ Chart ផ្ទាល់ ត្រូវបានរក្សាទុកសម្រាប់តែសិស្សផ្លូវការរបស់ SMC Genesis ប៉ុណ្ណោះ។',
      'genesis.wisdom1Tag': 'ទស្សនវិជ្ជាស្ថាប័ន',
      'genesis.wisdom2Tag': 'វិន័យឈ្នះលើអារម្មណ៍',
      'genesis.creedText': 'SMC GENESIS: ធ្វើគឺដើម្បីទាំងអស់គ្នា ទាំងអស់គ្នាគឺធ្វើដើម្បីខ្លួនឯង!',
      'genesis.creedSub': 'កសាងឡើងសម្រាប់ទាំងអស់គ្នា • សម្រេចបានដោយវិន័យផ្ទាល់ខ្លួន',
      'genesis.shiftBadge': 'ការផ្លាស់ប្តូរផ្នត់គំនិត • ស្ថាប័នធំ vs Retail',
      'genesis.shiftTitle': 'ហេតុអ្វី Trader រាយ 95% គ្រាន់តែជា Liquidity ឱ្យទីផ្សារ?',
      'genesis.shiftDesc': 'ការវិភាគបច្ចេកទេសបែប Retail បង្រៀនឱ្យ Trader ដាក់ Stop Loss នៅចំកន្លែងដែលស្ថាប័នធំៗត្រូវការបំពេញ Order ដ៏ច្រើនសន្ធឹកសន្ធាប់។ SMC Genesis បង្រៀនអ្នកឱ្យស្គាល់អន្ទាក់ទាំងនេះ និងចូលរួមជួញដូរស្របតាមលំហូរស្ថាប័ន។',
      'genesis.retailColTitle': 'ភាពបរាជ័យនៃការប្រើ Indicator',
      'genesis.instColTitle': 'ឧត្តមភាពនៃប្រព័ន្ធស្ថាប័ន SMC Genesis',
      'genesis.shiftR1': 'ជួញដូរតាមសូចនាករយឺតយ៉ាវ (RSI, MACD, Stochastics) ដែលបង្ហាញក្រោយពេលតម្លៃរត់រួច។',
      'genesis.shiftI1': 'វិភាគការបោសសម្អាត Liquidity និងទម្រង់បង្កើតតំបន់ Supply & Demand ស្ថាប័នពិតប្រាកដ។',
      'genesis.shiftR2': 'ទិញតាម Breakout លើ Resistance ក្លាយជា Liquidity ឱ្យការ Sell របស់ស្ថាប័នភ្លាមៗ។',
      'genesis.shiftI2': 'រង់ចាំការបោសសម្អាត Buy-Side Liquidity (BSL) និងចូល Trade ពេលរចនាសម្ព័ន្ធបញ្ជាក់ទិសដៅ។',
      'genesis.shiftR3': 'សមាមាត្រ R:R ទាបត្រឹម 1:1 ឬ 1:1.5 ដែលទាមទារ Win Rate ខ្ពស់ពេកដើម្បីរស់។',
      'genesis.shiftI3': 'សមាមាត្រ Asymmetric 1:3+ ដល់ 1:5+ ដែល Win Rate ត្រឹម 40% ក៏បង្កើតប្រាក់ចំណេញនិរន្តរភាពបាន។',
      'genesis.shiftR4': 'ជួញដូរតាមអារម្មណ៍ខឹងខ្នាញ់ ពង្រីក Stop Loss និងស្មានកំពូលបាតដោយគ្មានមូលដ្ឋាន។',
      'genesis.shiftI4': 'ចំណុចកំណត់ខុសច្បាស់លាស់ ការគ្រប់គ្រងទុនជាមុន និងមានលំដាប់លំដោយក្នុងការអនុវត្ត។',
      'genesis.matrixBadge': 'ការតម្រឹមពហុកាលវេលា',
      'genesis.matrixTitle': 'ម៉ាទ្រីសប្រតិបត្តិការ: ពី HTF ធំរហូតដល់ LTF តូច',
      'genesis.matrixSub': 'របៀបដែលទុនស្ថាប័នផ្ទេរទិន្នន័យឆ្លងកាត់ Timeframe ដើម្បីលុបបំបាត់ភាពរញ៉េរញ៉ៃ និងចម្រាញ់យក Setup គុណភាពខ្ពស់។',
      'genesis.matrixHtfTier': 'HTF (H4 / D1)',
      'genesis.matrixHtfRole': 'ទិសដៅម៉ាក្រូ & BOS រចនាសម្ព័ន្ធធំ',
      'genesis.matrixHtfDesc': 'កំណត់ទិសដៅរចនាសម្ព័ន្ធធំរបស់ស្ថាប័ន និងសម្គាល់តំបន់ Extreme សំខាន់ៗ។',
      'genesis.matrixMtfTier': 'MTF (M15 / H1)',
      'genesis.matrixMtfRole': 'តំបន់ S&D & ចលនាទាញថយ IBOS',
      'genesis.matrixMtfDesc': 'ស្រង់តំបន់ស្នាមជើងស្ថាប័ន និងច្រោះយករលកទាញថយខាងក្នុង ដើម្បីស្វែងរកចំណុចត្រឡប់ទិសពិត។',
      'genesis.matrixLtfTier': 'LTF (M1 / M3)',
      'genesis.matrixLtfRole': 'ចំណុចកេះចូល Order & SL តូច (RR ≥ 1:3)',
      'genesis.matrixLtfDesc': 'បញ្ជាក់ការប្តូររចនាសម្ព័ន្ធ Fractal តូច ផ្តល់ការចូល Trade បែបវះកាត់ ហានិភ័យទាបបំផុត ផលចំណេញខ្ពស់។',
      'genesis.curriculumBadge': 'ប្រធានបទមេរៀនស្ថាប័ន',
      'genesis.curriculumTitle': 'អ្វីដែលយើងបង្រៀន: កម្មវិធីសិក្សាផ្លូវការ & សសរស្តម្ភគ្រឹះ',
      'genesis.curriculumSub': 'ការណែនាំលម្អិតអំពីប្រធានបទគ្រឹះដែលត្រូវបានបង្រៀនក្នុង SMC Genesis។ រៀបចំឡើងដើម្បីបំពាក់បំប៉ន Trader ឱ្យយល់ដឹងពីក្បួនច្បាប់ស្ថាប័នពិតប្រាកដ។',
      'genesis.m1Num': 'ម៉ូឌុល ០១',
      'genesis.m1Title': 'ផ្នត់គំនិតស្ថាប័ន & ការរៀបចំ TradingView',
      'genesis.m1Desc': 'ទស្សនវិជ្ជាជួញដូរគ្រឹះ: ការគិតតាមប្រូបាប៊ីលីតេ គ្មានអារម្មណ៍លម្អៀង និងវិន័យ Checklist ១០០%។ ការកំណត់ Trendline និងតំបន់ Zone លើ TradingView Setup។',
      'genesis.m2Num': 'ម៉ូឌុល ០២',
      'genesis.m2Title': 'គ្រឹះរចនាសម្ព័ន្ធទីផ្សារ (BOS, IBOS, FTS)',
      'genesis.m2Desc': 'ស្ថាបត្យកម្មនៃទីផ្សារហិរញ្ញវត្ថុ: ការបែងចែកដាច់រវាងការបន្តទិសដៅធំ (BOS), រលកទាញថយខាងក្នុង (IBOS), និងការប្តូររចនាសម្ព័ន្ធតូច (FTS) ដោយគ្មាន Indicator។',
      'genesis.m3Num': 'ម៉ូឌុល ០៣',
      'genesis.m3Title': 'ទំនាក់ទំនងពហុពេលវេលា & ការផ្ទេរទិន្នន័យ (Data Transfer)',
      'genesis.m3Desc': 'យល់ដឹងពីយន្តការ Data Transfer: របៀបដែលរលកទាញថយលើ HTF ធំ បង្កើតជារចនាសម្ព័ន្ធលើ MTF កណ្តាល និងកន្លែងដែល LTF តូចបញ្ជាក់ការបញ្ចប់ដើម្បីបន្តទិសដៅធំ។',
      'genesis.m4Num': 'ម៉ូឌុល ០៤',
      'genesis.m4Title': 'វិធីស្រង់តំបន់ Supply & Demand ទាំង ៤ ប្រភេទ',
      'genesis.m4Desc': 'ឈានផុតពី Support/Resistance ធម្មតា ទៅកាន់ស្នាមជើងស្ថាប័ន: Range-Based, Pivot-Based, Single-Candle Extreme Order Block, និង Fractal Wick S&D នៅតំបន់ Displacement ខ្លាំង។',
      'genesis.m5Num': 'ម៉ូឌុល ០៥',
      'genesis.m5Title': 'វដ្តនៃតំបន់ និងការកាត់បន្ថយបន្ទុក (Mitigation & LDD)',
      'genesis.m5Desc': 'ដំណាក់កាលទាំង ៣ នៃតំបន់ស្ថាប័ន: Zone Creation, Continuation Model, និង Reversal Shift។ ស្គាល់ច្បាស់ពីតំបន់ Fresh Unmitigated និងបន្ទាយរឹងមាំ Last Defender Demand/Supply។',
      'genesis.m6Num': 'ម៉ូឌុល ០៦',
      'genesis.m6Title': 'កាយវិភាគវិទ្យានៃសាច់ប្រាក់ & អន្ទាក់ទាំង ៥ របស់ Retail',
      'genesis.m6Desc': 'របៀបដែលស្ថាប័នបង្កើត Liquidity: Buy-Side & Sell-Side Liquidity, អន្ទាក់ទាំង ៥ (Swing stops, Double structures, Trendline inducement, Range purges), និង Liquidity RUN។',
      'genesis.m7Num': 'ម៉ូឌុល ០៧',
      'genesis.m7Title': 'យន្តការ Sweep, BCC & ទ្រឹស្តី BIO Theory',
      'genesis.m7Desc': 'ការយល់ដឹងស៊ីជម្រៅអំពី Wick Sweep ធៀបនឹង Body Candle Closed (BCC)។ ទ្រឹស្តី BIO (By Independent Objective) BOS confirm ដោយ BOS, iBOS confirm ដោយ iBOS, FT confirm ដោយ FT។',
      'genesis.m8Num': 'ម៉ូឌុល ០៨',
      'genesis.m8Title': 'យន្តការ Canonical Liquidity Sweep (ករណី 1, 2 & 3)',
      'genesis.m8Desc': 'រូបមន្តជាក់ស្តែង Candlestick Closed In (-X-): ករណីទី ១ (BOS sweep រង់ចាំ iBOS shift), ករណីទី ២ (iBOS sweep រង់ចាំ FT shift), និង ករណីទី ៣ (Fractal sweep បញ្ជាក់លើ M3)។',
      'genesis.m9Num': 'ម៉ូឌុល ០៩',
      'genesis.m9Title': 'រូបមន្តប្រតិបត្តិការចូលទីផ្សារទាំង ៣ សេណារីយ៉ូ',
      'genesis.m9Desc': 'រូបមន្តប្រតិបត្តិការស្តង់ដារ: Scenario 1 (Counter-Trend Exhaustion នៅ Major Zone), Scenario 2 (Pro-Trend Refinement Types 1, 2, 3), និង Scenario 3 (Instant Momentum Breakout)។',
      'genesis.m10Num': 'ម៉ូឌុល ១០',
      'genesis.m10Title': 'ការគ្រប់គ្រងហានិភ័យ & វិន័យស្ថាប័ន (Trade Management)',
      'genesis.m10Desc': 'ការការពារទុនតាមបែបគណិតវិទ្យា: ដាក់ SL Padding 2-3 Pips ការពារ Spread, ច្បាប់រំកិល Break-Even ត្រឹមត្រូវ, គោលដៅ RR 1:3 ដល់ 1:10+ និងកំណត់ Risk ត្រឹម 0.5%–1.0%។',
      'genesis.tabPillars': 'បទពិសោធន៍នៃការសិក្សា',
      'genesis.tabLiquidity': '១. រចនាសម្ព័ន្ធ & S&D',
      'genesis.tabCommunity': '២. Liquidity & អន្ទាក់',
      'genesis.tabOB': '៣. រូបមន្តចូលផ្សារ Scenarios',
      'genesis.tabRisk': '៤. សហគមន៍ & វិន័យទុន',
      'genesis.tabLqHeading': 'រចនាសម្ព័ន្ធទីផ្សារ & ស្ថាបត្យកម្ម Supply/Demand ស្ថាប័ន',
      'genesis.tabLqText': 'ស្ទាត់ជំនាញភាសាគ្រឹះនៃការជួញដូរបែបស្ថាប័ន: ការកំណត់ BOS ធំ, រលកទាញថយ IBOS និងការស្រង់យកទម្រង់ Base ទាំង ៤ (RBD, DBR, RBR, DBD) ទាំង Extreme និង Decisional ដោយសុក្រឹតភាពខ្ពស់។',
      'genesis.tabLqRule': 'ច្បាប់រចនាសម្ព័ន្ធ: BOS ត្រូវបានបញ្ជាក់លុះត្រាតែមាន Candle-Body បិទផុត Swing Point យ៉ាងពេញលេញ។',
      'genesis.tabCommunityHeading': 'យន្តការ Liquidity & អន្ទាក់ទាំង ៥ របស់ Retail',
      'genesis.tabCommunityText': 'ស្វែងយល់ពីរបៀបដែលស្ថាប័នធំៗរៀបចំ Liquidity ដើម្បីបំពេញទំហំ Order ដ៏ធំ។ រៀនសម្គាល់អន្ទាក់ទាំង ៥, ការបែងចែកដាច់រវាង BCC Sweep និង Wick Sweep, ព្រមទាំងទ្រឹស្តី BIO Theory។',
      'genesis.tabCommunityRule': 'ច្បាប់ Liquidity: កុំចូល Trade នៅ Support/Resistance ធម្មតា។ ត្រូវរង់ចាំឱ្យមានការ Sweep Liquidity សិន។',
      'genesis.tabObHeading': 'រូបមន្តប្រតិបត្តិការចូលផ្សារទាំង ៣ (Execution Scenarios)',
      'genesis.tabObText': 'អនុវត្តការចូល Trade ប្រកបដោយភាពច្បាស់លាស់តាមរយៈរូបមន្តទាំង ៣ ក្នុង SMC Genesis: Counter-Trend Sweep (Scenario 1), Pro-Trend Pullback Refinement (Scenario 2), និង Clean Expansion Breakout (Scenario 3)។',
      'genesis.tabObRule': 'ច្បាប់ប្រតិបត្តិការ: ជ្រើសរើសរូបមន្តចូលផ្សារផ្អែកលើទិន្នន័យទីផ្សារជាក់ស្តែង មិនមែនតាមអារម្មណ៍ស្មានឡើយ។',
      'genesis.tabRiskHeading': 'ការការពារដើមទុន & សហគមន៍សិស្សផ្លូវការ',
      'genesis.tabRiskText': 'ភាពជោគជ័យយូរអង្វែងទាមទារវិន័យគ្រប់គ្រងហានិភ័យម៉ឺងម៉ាត់ និងបរិយាកាសសិក្សាត្រឹមត្រូវ។ អនុវត្តច្បាប់ហានិភ័យ 0.5%–1.0% និងពិភាក្សាជាមួយមិត្តរួមថ្នាក់ក្នុងក្រុម Telegram ផ្លូវការ (t.me/moonbluefx)។',
      'genesis.tabRiskRule': 'ច្បាប់គ្រប់គ្រងទុន: រក្សាហានិភ័យត្រឹម 0.5%–1.0% ក្នុងមួយ trade។ ការពារដើមទុនជាចម្បងមុនស្វែងរកផលចំណេញ។',
      'genesis.admissionBadge': '🎓 ក្របខ័ណ្ឌជំនាញ ៥ សសរស្តម្ភ • ថ្នាក់បង្រៀនផ្លូវការ',
      'genesis.admissionTitle': 'ថ្នាក់សិក្សាស្ថាប័ន: ក្របខ័ណ្ឌជំនាញ ៥ សសរស្តម្ភ',
      'genesis.admissionSub': 'កម្មវិធីសិក្សាជាប្រព័ន្ធដើម្បីកសាងសមត្ថភាពវិជ្ជាជីវៈលើរចនាសម្ព័ន្ធទីផ្សារ, Supply & Demand, អន្ទាក់ Liquidity, រូបមន្តចូលផ្សារ និងការគ្រប់គ្រងដើមទុន:',
      'genesis.std1Title': 'សសរស្តម្ភ ០១: មេកានិចរចនាសម្ព័ន្ធទីផ្សារ (BOS, IBOS, FTS)',
      'genesis.std1Desc': 'ស្ទាត់ជំនាញ Swing High/Low, ការបែងចែកដាច់រវាង Major BOS (បន្តទិសដៅ), IBOS (រលកទាញថយ) និង FTS (ការប្តូររចនាសម្ព័ន្ធតូច)។',
      'genesis.std1Outcome': 'លទ្ធផលអនុវត្ត: កំណត់ទិសដៅរចនាសម្ព័ន្ធ និងតម្រឹម Timeframe ច្បាស់លាស់។',
      'genesis.std2Title': 'សសរស្តម្ភ ០២: ស្ថាបត្យកម្ម S&D ស្ថាប័ន (RBD, DBR, RBR, DBD)',
      'genesis.std2Desc': 'សិក្សាទម្រង់ Base ទាំង ៤ របស់ស្ថាប័ន: Rally-Base-Drop, Drop-Base-Rally, Rally-Base-Rally, និង Drop-Base-Drop ជាមួយការតាមដាន Extreme vs Decisional។',
      'genesis.std2Outcome': 'លទ្ធផលអនុវត្ត: គូសវាសតំបន់ Base ស្ថាប័ន និងខ្សែសង្វាក់ Mitigation បានត្រឹមត្រូវ។',
      'genesis.std3Title': 'សសរស្តម្ភ ០៣: ការបោសសម្អាត Liquidity & ការទាញផលពីអន្ទាក់',
      'genesis.std3Desc': 'ស្វែងយល់អន្ទាក់ទាំង ៥ របស់ Retail: Swing pools, Double structures, Trendline traps, Range sweeps, និងយន្តការ Inducement។',
      'genesis.std3Outcome': 'លទ្ធផលអនុវត្ត: មើលឃើញ Stop-Hunt និងអន្ទាក់ទុនរាយមុនពេលតម្លៃចេញដំណើរ។',
      'genesis.std4Title': 'សសរស្តម្ភ ០៤: រូបមន្តចូលផ្សារសុក្រឹត (Scenarios 1, 2, 3)',
      'genesis.std4Desc': 'យល់ច្បាស់ពីការចូល Trade តាមកាលៈទេសៈ: Counter-Trend Exhaustion, Structure Refinement Pro-Trend, និង Instant Momentum Expansion។',
      'genesis.std4Outcome': 'លទ្ធផលអនុវត្ត: យល់ច្បាស់ពី Scenarios 1, 2, និង 3 ក្នុងការប្រតិបត្តិការ Trade Order ជាក់ស្តែង។',
      'genesis.std5Title': 'សសរស្តម្ភ ០៥: ការបែងចែកទុនបែប Asymmetric (ច្បាប់ 0.5%–1.0%)',
      'genesis.std5Desc': 'ការពារដើមទុនតាមទំហំ Lot អាជីព (0.5%–1.0%) ការរំកិល Break-Even និងការចាប់យកផលចំណេញ RR ≥ 1:3 ឡើងទៅ។',
      'genesis.std5Outcome': 'លទ្ធផលអនុវត្ត: ការពារដើមទុនតាមរូបមន្ត Risk-to-Reward (RR ≥ 1:3 ឡើងទៅ)។',
      'genesis.quoteText': '"ជោគជ័យក្នុងការជួញដូរ មិនមែនកើតឡើងដោយសារអ្នកមិនដែលខាតនោះទេ ប៉ុន្តែ កើតចេញពីការរក្សាវិន័យ និងការការពារដើមទុនរបស់អ្នកឱ្យបានល្អបំផុត។"',
      'genesis.quoteAuthor': '— ប្លង់មេស្ថាប័ន SMC Genesis • BlueX',
      'genesis.applyTelegramBtn': 'ផ្ញើសារផ្ទាល់ទៅកាន់ BlueX លើ Telegram (DM: @Le_Bluue)',
      'genesis.communityTelegramBtn': 'ចូលរួមក្រុមសហគមន៍ផ្លូវការ (t.me/moonbluefx)',
      'genesis.announcementBadge': '🔥 បើកទទួលសិស្សចូលរៀន',
      'genesis.announcementText': 'ថ្នាក់បង្រៀន SMC Genesis — រៀនជួញដូរមាស (XAU/USD) តាមក្បួនស្ថាប័នជាមួយ BlueX',
      'genesis.announcementBtn': 'ចុះឈ្មោះចូលរៀនតាម Telegram →',
      'genesis.spotlightBadge': '🎯 ថ្នាក់បង្រៀនផ្លូវការ SMC Genesis',
      'genesis.spotlightTitle': 'ចុះឈ្មោះចូលរៀនថ្នាក់ស្ថាប័ន SMC Genesis',
      'genesis.spotlightSub': 'យើងបំបាត់ចោលការស្មានបែប Retail ដើម្បីបង្រៀនអ្នកពីភាពសុក្រឹតក្នុងការជួញដូរស្របតាមស្ថាប័ន។ ទទួលបានទំនុកចិត្ត ច្បាប់វិន័យ និងទម្លាប់ជួញដូររបស់ Trader អាជីព។',
      'genesis.spotlightStatus': '● បើកទទួលសិស្ស • ចំនួនកំណត់ក្នុងមួយថ្នាក់',
      'genesis.spotlightPerk1Title': 'កម្មវិធីសិក្សាជាប្រព័ន្ធក្នុងថ្នាក់',
      'genesis.spotlightPerk1Desc': 'ការបង្រៀនផ្ទាល់ពី Master Trader BlueX តាមរយៈមេរៀននីមួយៗ ការពន្យល់លើ Chart ជាក់ស្តែង និងការឆ្លើយសំណួរក្នុងថ្នាក់។',
      'genesis.spotlightPerk2Title': 'ក្បួនច្បាប់ប្រតិបត្តិការសុក្រឹត',
      'genesis.spotlightPerk2Desc': 'គ្មានការស្មានដោយអារម្មណ៍។ ច្បាប់ច្បាស់លាស់សម្រាប់ Body-Close BOS, ទម្រង់ S&D ទាំង ៤ និងរូបមន្តចូលផ្សារទាំង ៣។',
      'genesis.spotlightPerk3Title': 'ការវិភាគលើ Chart មាសផ្ទាល់',
      'genesis.spotlightPerk3Desc': 'វិភាគរចនាសម្ព័ន្ធទីផ្សារមាស (XAU/USD) មុនពេល Session សំខាន់ៗបើកដំណើរការ។ មើលឃើញការកំណត់តំបន់ស្ថាប័នជាក់ស្តែង។',
      'genesis.spotlightPerk4Title': 'សហគមន៍សិស្សផ្លូវការ',
      'genesis.spotlightPerk4Desc': 'សិទ្ធិចូលរួមក្នុងក្រុមសហគមន៍សិស្ស (t.me/moonbluefx) ដើម្បីតាមដានការវិភាគទិសដៅប្រចាំថ្ងៃ និងបង្កើនសមត្ថភាពជាបន្តបន្ទាប់។',
      'genesis.spotlightActionTitle': 'ត្រៀមខ្លួនរួចរាល់ហើយឬនៅដើម្បីក្លាយជា Trader ស្ថាប័ន?',
      'genesis.spotlightActionDesc': 'កំណត់ចំនួនសិស្សក្នុងមួយថ្នាក់ដើម្បីធានាការយល់ដឹងស៊ីជម្រៅ និងការអនុវត្តប្រកបដោយប្រសិទ្ធភាព។',
      'genesis.spotlightActionBtn': '⚡ សាកសួរចុះឈ្មោះចូលរៀន: DM @Le_Bluue',
      'genesis.floatingCta': '⚡ ចុះឈ្មោះចូលរៀន: DM @Le_Bluue',
      'genesis.brokerBadge': 'ល្បឿនប្រតិបត្តិការ & សាច់ប្រាក់ស្ថាប័ន',
      'genesis.brokerTitle': 'Broker ដៃគូដែលណែនាំសម្រាប់អនុវត្ត SMC',
      'genesis.brokerDesc': 'ការអនុវត្ត Smart Money Concepts ទាមទារល្បឿនលឿនបំផុត, Spreads ទាបបំផុត, សាច់ប្រាក់ជ្រៅ និងគ្មាន Slippage សិប្បនិម្មិត។ យើងសូមណែនាំដៃគូដែលមានអាជ្ញាប័ណ្ណលំដាប់កំពូលដូចខាងក្រោម:',
      'genesis.brokerTrenoNote': 'ដៃគូកំពូល • Raw Spreads • ល្បឿនលឿនបំផុត',
      'genesis.brokerGtcNote': 'អាជ្ញាប័ណ្ណសកលច្រើន • សាច់ប្រាក់កម្រិតស្ថាប័ន',
      'genesis.brokerLirunexNote': 'Broker STP មានអាជ្ញាប័ណ្ណ • សាច់ប្រាក់ Forex & មាសជ្រៅ',
      'genesis.faqBadge': 'សំណួរដែលសួរញឹកញាប់',
      'genesis.faqTitle': 'អ្វីៗទាំងអស់ដែលអ្នកត្រូវដឹងអំពី SMC Genesis',
      'genesis.faq1Q': 'តើអ្វីដែលធ្វើឱ្យ SMC Genesis ខុសប្លែកទាំងស្រុងពីការវិភាគបច្ចេកទេសទូទៅ?',
      'genesis.faq1A': 'ការវិភាគបែប Retail ពឹងផ្អែកលើ Indicator យឺតយ៉ាវ (RSI, Moving Averages) និង Trendline ដែលស្ថាប័នធំៗតែងតែរុញឱ្យបុកដើម្បីយក Liquidity។ SMC Genesis បង្រៀនអ្នកពីរបៀបដែលស្ថាប័នរុញតម្លៃពិតប្រាកដ កន្លែងដែល Stop ប្រមូលផ្តុំ និងរបៀបចូល Trade ក្រោយការបោសសម្អាតរួចរាល់នៅតំបន់ Supply & Demand។',
      'genesis.faq2Q': 'តើអ្នកទើបចាប់ផ្តើមអាចរៀន SMC Genesis បានទេ ឬត្រូវការបទពិសោធន៍ពីមុន?',
      'genesis.faq2A': 'តាមពិតទៅ អ្នកទើបចាប់ផ្តើមច្រើនតែយល់បានលឿនជាង ព្រោះពួកគេមិនទាន់ជាប់ទម្លាប់ប្រើ Indicator ខុសៗជាច្រើនឆ្នាំ។ SMC Genesis ចាប់ផ្តើមពីមូលដ្ឋានគ្រឹះនៃ Liquidity ទីផ្សារ ហើយកសាងឡើងមួយជំហានម្តងៗរហូតដល់ការអនុវត្តកម្រិតខ្ពស់។',
      'genesis.faq3Q': 'តើឧបករណ៍ហិរញ្ញវត្ថុណាខ្លះដែលដំណើរការល្អបំផុតជាមួយ SMC Genesis?',
      'genesis.faq3A': 'SMC Genesis គឺជាក្របខ័ណ្ឌ Supply & Demand សកល។ វាដំណើរការយ៉ាងល្អឥតខ្ចោះលើមាស (XAUUSD), គូរូបិយប័ណ្ណសំខាន់ៗ (EURUSD, GBPUSD, USDJPY), សន្ទស្សន៍ភាគហ៊ុន (US30, NAS100) និងរូបិយប័ណ្ណឌីជីថល (BTC, ETH)។',
      'genesis.faq4Q': 'តើខ្ញុំអាចរំពឹងទទួលបានសមាមាត្រ R:R កម្រិតណាពីយុទ្ធសាស្ត្រនេះ?',
      'genesis.faq4A': 'Setup របស់ SMC ផ្តោតលើផលចំណេញ Asymmetric ចាប់ពី 1:3 ដល់ 1:5+។ ដោយសារចំណុចចូលត្រូវបានសម្រិតសម្រាំងលើ Timeframe តូចនៅតំបន់ Imbalance ច្បាស់លាស់ Stop Loss គឺតូច និងមានសុវត្ថិភាពខ្ពស់។',
      'genesis.faq5Q': 'តើខ្ញុំអាចចុះឈ្មោះចូលរៀនថ្នាក់នេះ ឬទាក់ទងមកកាន់ BlueX ដោយផ្ទាល់ដោយរបៀបណា?',
      'genesis.faq5A': 'ដើម្បីចុះឈ្មោះចូលរៀន ឬសាកសួរព័ត៌មាន សូមផ្ញើសារផ្ទាល់ (DM) ទៅកាន់ Telegram របស់ BlueX: @Le_Bluue។ ហើយដើម្បីចូលរួមការពិភាក្សា និងមើលការវិភាគទីផ្សារប្រចាំថ្ងៃ សូមចូលរួមក្នុងក្រុម Telegram សហគមន៍: t.me/moonbluefx។',
      'genesis.ctaTitle': 'ត្រៀមខ្លួនរួចរាល់ហើយឬនៅដើម្បីឈានជើងចូលក្នុងលំហូរស្ថាប័ន?',
      'genesis.ctaSub': 'បញ្ឈប់ការផ្តល់ប្រាក់ឱ្យទីផ្សារដោយងងឹតងងល់។ ទំនាក់ទំនងផ្ទាល់ជាមួយ BlueX ឬចូលរួមក្នុងសហគមន៍ Trader របស់យើង។',

      // ========================================================
      // Gold Hedging Protocol (Khmer)
      // ========================================================
      'hedging.heroBadge': 'ស្ថាបត្យកម្មរតនាគារ & Delta-Neutral មាសសុទ្ធ',
      'hedging.heroSubBadge': 'ការតភ្ជាប់រវាងហាងមាសរូបវន្ត និង XAU/USD Digital',
      'hedging.heroTitle': 'ពិធីការការពារហានិភ័យមាស <span class="gold-accent">Gold Hedging</span>',
      'hedging.heroDesc': 'លុបបំបាត់ហានិភ័យការប្រែប្រួលថ្លៃមាសសម្រាប់ហាងមាស ហាងលក់គ្រឿងអលង្ការ និងឃ្លាំងស្តុកមាស។ បម្លែងឯកតាមាសខ្មែរដូចជា តម្លឹង ជី និងក្រាម ទៅជាទំហំកិច្ចសន្យាឌីជីថល (Lots) លើ MT4/MT5 យ៉ាងជាក់លាក់ ដើម្បីការពារចំណេញពីថ្លៃឈ្នួល និងគម្លាតថ្លៃទិញ-លក់បាន ១០០%។',
      'hedging.btnCalc': '⚡ បើកម៉ាស៊ីនគណនា Hedging',
      'hedging.btnArch': 'យន្តការ Delta-Neutral ➔',
      'hedging.ribbonDelta': 'លំនឹង Delta-Neutral ស្មើ ០',
      'hedging.ribbonConversion': 'បម្លែងទំហំ Lot ស្តង់ដារសុក្រឹត',
      'hedging.ribbonProfit': 'ការពារប្រាក់ចំណេញពីគម្លាតថ្លៃ និងឈ្នួល ១០០%',
      'hedging.calcBadge': 'ឧបករណ៍រតនាគារតាមពេលវេលាជាក់ស្តែង',
      'hedging.calcTitle': 'ម៉ាស៊ីនគណនា <span class="gold-accent">Hedging មាសរូបវន្តទៅឌីជីថល</span>',
      'hedging.calcSubtitle': 'គណនាបញ្ជាការពារហានិភ័យតាមគណិតវិទ្យាសុក្រឹត ប្រាក់តម្កល់ Margin និងទុនបម្រុងសុវត្ថិភាពដើម្បីរក្សាតុល្យភាព Delta-Neutral។',
      'hedging.assetSelectLabel': '១. ជ្រើសរើសលោហៈធាតុដ៏មានតម្លៃ',
      'hedging.metalGoldName': 'មាស (XAU/USD)',
      'hedging.metalSilverName': 'ប្រាក់ (XAG/USD)',
      'hedging.btnRefresh': 'ទាញតម្លៃថ្មី',
      'hedging.step1Label': '២. ចរន្តស្តុកមាសរូបវន្តក្នុងហាង',
      'hedging.dirBuyTitle': 'ហាងទិញមាសចូល',
      'hedging.dirBuySub': 'ស្តុកមាសកើន (+ទម្ងន់) ➔ ត្រូវបើក Digital SHORT',
      'hedging.dirSellTitle': 'ហាងលក់មាសចេញ',
      'hedging.dirSellSub': 'ស្តុកមាសថយ (-ទម្ងន់) ➔ ត្រូវបើក Digital LONG',
      'hedging.localRateLabel': '៣. ថ្លៃទីផ្សារប្រាក់រូបវន្តជាក់ស្តែងនៅកម្ពុជា (ក្រៅ Digital)',
      'hedging.btnSyncSpot': 'ទាញតាម Spot',
      'hedging.damlungRateLabel': 'ថ្លៃក្នុង ១ តម្លឹង (ដុល្លារ / ១ តម្លឹង)',
      'hedging.chiRateLabel': 'គិតជា ១ ជី (ដុល្លារ / ១ ជី)',
      'hedging.localRateHelp': 'តម្លៃប្រាក់រូបវន្តជាក់ស្តែងដែលទិញ-លក់នៅតុហាងមាស។ ១ តម្លឹង = ១០ ជី = ៣៧.៥ ក្រាម ≈ ១.២០៥៦៥ Troy Ounces។',
      'hedging.step2Label': '៤. ទម្ងន់មាសរូបវន្ត និងឯកតា',
      'hedging.shopPresetsTitle': 'ទំហំស្តង់ដារហាងមាស (Quick Presets):',
      'hedging.paramSpot': 'ថ្លៃមាសពិភពលោក Spot ($/oz)',
      'hedging.paramLeverage': 'Leverage ឈ្មួញកណ្តាល',
      'hedging.accountBalanceLabel': '៥. ចំនួនដើមទុនក្នុងគណនី Broker (សមតុល្យ $ USD)',
      'hedging.btnAutoFillBalance': 'បំពេញទុនសុវត្ថិភាពស្វ័យប្រវត្តិ',
      'hedging.balanceHelperNote': 'តើគួរដាក់ទុនប៉ុន្មាន៖ បញ្ចូលទុនរបស់អ្នកដើម្បីផ្ទៀងផ្ទាត់ថាតើទុនបម្រុងរបស់អ្នកអាចទប់ទល់នឹងការប្រែប្រួលហាងឆេងទីផ្សារដោយសុវត្ថិភាព ឬត្រូវបន្ថែមទុន។',
      'hedging.paramBuffer': 'ទុនបម្រុងការប្រែប្រួលថ្លៃ ($/oz)',
      'hedging.bufferHelp': 'ទុនបម្រុងសុវត្ថិភាពក្នុងគណនី Broker ដើម្បីការពារកុំឱ្យ Stop-Out នៅពេលទីផ្សារប្រែប្រួលរហ័ស មុនពេលស្តុកមាសត្រូវបានទូទាត់។',
      'hedging.cashCounterBadge': 'ប្រាក់រូបវន្តនៅតុហាង & ប្រាក់ចំណេញគម្លាតដែលបានចាក់សោ',
      'hedging.counterCashLabel': 'ប្រាក់រូបវន្តទូទាត់នៅតុហាង:',
      'hedging.digitalSpotLabel': 'តម្លៃ Spot ឌីជីថល (Hedge):',
      'hedging.lockedSpreadLabel': '🔒 ប្រាក់ចំណេញសុទ្ធដែលបានការពារ:',
      'hedging.resBrokerLots': 'ទំហំ Lot ស្តង់ដារលើ Broker',
      'hedging.resResidual': 'ទម្ងន់នៅសល់មិនទាន់ Hedged',
      'hedging.resNotional': 'តម្លៃសរុបនៃស្តុកមាសរូបវន្ត',
      'hedging.resMargin': 'ប្រាក់តម្កល់ Margin ដំបូង',
      'hedging.stopOutRisk': 'កម្រិត Spot ដែលប្រឈមនឹង Stop-Out',
      'hedging.safeCapBadge': 'ទុនគណនីសុវត្ថិភាពដែលណែនាំ',
      'hedging.safeCapTag': 'ស្ថាបត្យកម្មគ្មាន Stop-Out',
      'hedging.userBalanceRow': 'ទុនដែលអ្នកបានបញ្ចូល:',
      'hedging.capRowMargin': 'Margin តម្កល់ (Broker ចាក់សោ):',
      'hedging.capRowBuffer': 'ទុនបម្រុងប្រែប្រួលថ្លៃ (+$100/oz):',
      'hedging.balanceStatusLabel': 'ស្ថានភាពទុនបម្រុងសុវត្ថិភាព:',
      'hedging.sopHeader': 'របៀបប្រើប្រាស់ជាក់ស្តែងនៅតុហាងមាស (How Every Shop Uses It)',
      'hedging.step1Title': 'អតិថិជនមកដោះដូរមាសនៅតុហាង',
      'hedging.step1Desc': 'ថ្លឹងទម្ងន់មាស (តម្លឹង/ជី) ➔ គណនាប្រាក់រូបវន្តជូនអតិថិជនតាមតម្លៃតុហាង។',
      'hedging.step2Title': 'បើក App MT5 / Broker រយៈពេល ១០ វិនាទី',
      'hedging.step2Desc': 'ចុច Sell/Buy តាមទំហំ Lots ដែលម៉ាស៊ីនបង្ហាញខាងលើ។',
      'hedging.step3Title': 'រួចរាល់ • ហានិភ័យមាសចុះថ្លៃស្មើ 0%',
      'hedging.step3Desc': 'ទោះមាសឡើងឬចុះ $100-$300 ក៏ប្រាក់ចំណេញហាងត្រូវបានការពារ ១០០%។',
      'hedging.proofTitle': 'រូបមន្តបម្លែងតាមកម្រិតស្ថាប័ន',
      'hedging.archBadge': 'គោលការណ៍សម្រាប់អាជីវកម្មមាស',
      'hedging.archTitle': 'យន្តការនៃ <span class="gold-accent">លំនឹង Delta-Neutral</span>',
      'hedging.archSubtitle': 'ហាងមាសរូបវន្តបង្កើតប្រាក់ចំណេញជាប់លាប់ពីគម្លាតថ្លៃទិញ-លក់ និងថ្លៃឈ្នួលកែច្នៃ។ ការទុកឱ្យស្តុកមាសប្រឈមនឹងទីផ្សារដោយគ្មាន Hedging គឺជាការយកទុនអាជីវកម្មទៅលេងល្បែងជាមួយទីផ្សារពិភពលោក។',
      'hedging.unhedgedTag': 'ហាងមាសបុរាណដែលមិនបាន Hedging',
      'hedging.unhedgedTitle': 'ស្តុកមាសប្រឈមហានិភ័យ ១០០%',
      'hedging.unhedgedDesc': 'ហាងទិញមាស ១០០ តម្លឹង ($២៧៤,០០០) ពីអតិថិជន។ ឆ្លងចុងសប្តាហ៍ ថ្លៃមាសពិភពលោកធ្លាក់ចុះ $១២០/oz ដោយសារព័ត៌មានម៉ាក្រូសេដ្ឋកិច្ច។',
      'hedging.hedgedTag': 'ពិធីការ BLUEX DELTA-NEUTRAL',
      'hedging.hedgedTitle': 'លំនឹង Delta ស្មើ ០ សុក្រឹត (Δ = 0)',
      'hedging.hedgedDesc': 'ហាងកត់ត្រា ១០០ តម្លឹងក្នុង BlueX Terminal ហើយបើកបញ្ជា Short ១.២១ Lot XAU/USD ភ្លាមៗពេលទទួលមាសរូបវន្ត។',
      'hedging.protocolBadge': 'ពិធីការស្តង់ដារប្រតិបត្តិការ (SOP)',
      'hedging.protocolTitle': 'នីតិវិធីប្រតិបត្តិការ ៤ ជំហាន <span class="gold-accent">Dealer SOP</span>',
      'hedging.protocolSubtitle': 'នីតិវិធីដែលអនុវត្តដោយបេឡាធិការ នាយកឃ្លាំង និងអ្នកគ្រប់គ្រងរតនាគារ ដើម្បីលុបបំបាត់ Slippage និងរក្សាតុល្យភាព។',
      'hedging.sop1Title': 'ការថ្លឹងទម្ងន់ & ផ្ទៀងផ្ទាត់មាសចូល',
      'hedging.sop1Desc': 'ថ្លឹងគ្រឿងអលង្ការ ឬមាសដុំលើជញ្ជីងស្តង់ដារ។ កត់ត្រាចំនួនតម្លឹង ជី ឬក្រាមចូលក្នុងបញ្ជីហាងឱ្យបានច្បាស់លាស់ និងបញ្ជាក់កម្រិតទឹកមាស (៩៩.៩៩% ឬ ២៤K)។',
      'hedging.sop2Title': 'ការបើកបញ្ជាការពារហានិភ័យភ្លាមៗ',
      'hedging.sop2Desc': 'បើកកម្មវិធី Hedging (MT4/MT5) ហើយដាក់បញ្ជា Lot តាមការគណនា។ ប្រសិនបើហាងទិញមាសចូល ត្រូវដាក់ Market Short។ ប្រសិនបើហាងលក់មាសចេញ ត្រូវដាក់ Market Long។',
      'hedging.sop3Title': 'ការលក់មាសរូបវន្តចេញ & បិទបញ្ជាឌីជីថល',
      'hedging.sop3Desc': 'នៅពេលមាសរូបវន្តត្រូវបានលក់ទៅឱ្យអតិថិជនរាយ ឬបញ្ជូនទៅរោងចក្រចម្រាញ់ ត្រូវបិទបញ្ជាឌីជីថលដែលត្រូវគ្នានៅលើ MT4/MT5 ភ្លាមៗ។',
      'hedging.sop4Title': 'វិន័យ Swap-Free & ការគ្រប់គ្រងហិរញ្ញវត្ថុ',
      'hedging.sop4Desc': 'វដ្តស្តុកមាសជារឿយៗអូសបន្លាយច្រើនថ្ងៃ ឬសប្តាហ៍។ គណនីទូទៅកាត់ថ្លៃ Swap ពេលកាន់រំលងយប់ដែលធ្វើឱ្យបាត់ចំណេញ។ ត្រូវតែប្រើប្រាស់គណនី Swap-Free ស្ថាប័នជាដាច់ខាត។',
      'hedging.matrixBadge': 'តារាងបម្លែងខ្នាត',
      'hedging.matrixTitle': 'ស្តង់ដារទម្ងន់ <span class="gold-accent">កម្រិតស្ថាប័ន</span>',
      'hedging.matrixSubtitle': 'សមមូលគណិតវិទ្យារវាងឯកតាមាសប្រពៃណីខ្មែរ ទម្ងន់ម៉ែត្រ ឯកតាអន្តរជាតិ Troy Ounces និងកិច្ចសន្យាឌីជីថល Lots។',
      'hedging.colUnit': 'ឯកតាមាស',
      'hedging.colKhmer': 'ឈ្មោះប្រពៃណីខ្មែរ',
      'hedging.colGrams': 'ទម្ងន់គិតជាក្រាម (g)',
      'hedging.colOunces': 'Troy Ounces (oz)',
      'hedging.colLots': 'Lots ស្តង់ដារ MT4/MT5',
      'hedging.colEquiv': 'សមមូល',
      'hedging.brokerBadge': 'ដៃគូហេដ្ឋារចនាសម្ព័ន្ធស្ថាប័ន',
      'hedging.brokerTitle': 'ការអនុវត្តបញ្ជាគ្មាន Spread ជាមួយ <span class="cyan-accent">Treno Markets</span>',
      'hedging.brokerDesc': 'ការការពារហានិភ័យលើស្តុកមាសទាមទារលក្ខខណ្ឌស្ថាប័នយ៉ាងតឹងរ៉ឹង។ Treno Markets ផ្តល់ Raw Spread (0.0 pips លើ XAU/USD), គណនី Swap-Free និងល្បឿនបញ្ជូនបញ្ជាលឿនបំផុតក្រោម ១៥ មិល្លីវិនាទី។',
      'hedging.brokerCta': 'បើកគណនីស្ថាប័នលើ Treno Markets ➔',
      'hedging.faqBadge': 'សំណួរដែលសួរញឹកញាប់',
      'hedging.faqTitle': 'សំណួរ-ចម្លើយអំពី <span class="gold-accent">Gold Hedging</span>',
      'hedging.q1Title': 'ហេតុអ្វីបានជាហាងយើងខ្ញុំត្រូវ Hedging បើមាសឡើងថ្លៃជានិច្ចក្នុងរយៈពេលវែង?',
      'hedging.q1Answer': 'ក្នុងនាមជាអ្នកលក់មាស ប្រភពចំណេញរបស់អ្នកគឺគម្លាតថ្លៃទិញ-លក់ និងថ្លៃឈ្នួលកែច្នៃ។ អ្នកកំពុងប្រកបអាជីវកម្មលក់រាយដែលទាមទារចរន្តលឿន មិនមែនជាការវិនិយោគទុករយៈពេលវែងឡើយ។ ការធ្លាក់ចុះ ៣%–៥% ភ្លាមៗក្នុងមួយសប្តាហ៍អាចលេបយកប្រាក់ចំណេញរាប់ខែរបស់អ្នក ប្រសិនបើស្តុកមាសមិនត្រូវបានការពារ។',
      'hedging.q2Title': 'តើមានអ្វីកើតឡើងប្រសិនបើមាសឡើងថ្លៃខ្លាំង ពេលដែលយើងកំពុងកាន់ Short Hedging?',
      'hedging.q2Answer': 'ប្រសិនបើថ្លៃមាសឡើងខ្ពស់ បញ្ជាឌីជីថល Short របស់អ្នកនឹងបង្ហាញការខាតបង់បណ្តោះអាសន្ន។ ប៉ុន្តែស្តុកមាសរូបវន្តនៅក្នុងទូហាងរបស់អ្នកបានឡើងថ្លៃក្នុងចំនួនទឹកប្រាក់ស្មើគ្នាបេះបិទ។ នេះហើយជាមូលហេតុដែលការរក្សាទុនបម្រុងសុវត្ថិភាព Safe Capital ($100/oz) មានសារៈសំខាន់បំផុត ដើម្បីធានាថាគណនីមិនរងការ Stop-Out។',
      'hedging.q3Title': 'តើយើងគ្រប់គ្រងទម្ងន់តូចៗក្រោម ០.០១ Lot (៣១.១ក្រាម) ដោយរបៀបណា?',
      'hedging.q3Answer': 'Broker MT4/MT5 អនុញ្ញាតឱ្យបើកបញ្ជាអប្បបរមា ០.០១ Lot (១ Troy Ounce = ៣១.១០ ក្រាម ≈ ០.៨៣ តម្លឹង)។ សម្រាប់ទម្ងន់តូចៗ ម៉ាស៊ីនគណនានឹងបង្ហាញទម្ងន់នៅសល់ (Micro-Residual)។ អ្នកគ្រាន់តែប្រមូលការទិញរាយតូចៗរហូតដល់គ្រប់ ០.០១ Lot ដើម្បីបើកបញ្ជា ដោយរក្សាប្រសិទ្ធភាព Hedging បានជាង ៩៨%។',
      'hedging.q4Title': 'តើយើងអាច Hedging លោហៈធាតុផ្សេងទៀតដូចជា ប្រាក់ ឬប្លាទីនបានទេ?',
      'hedging.q4Answer': 'បាន។ គោលការណ៍គណិតវិទ្យា Delta-Neutral គឺដូចគ្នាសម្រាប់ប្រាក់ (XAG/USD) និងប្លាទីន (XPT/USD) ដោយគ្រាន់តែកែសម្រួលទំហំកិច្ចសន្យាស្តង់ដារ (៥,០០០ oz ក្នុងមួយ Lot ប្រាក់)។ BlueX Terminal ផ្តល់រូបមន្តជាក់លាក់សម្រាប់តុរតនាគារពហុលោហៈ។',
      'hedging.floatingCta': 'ពិគ្រោះយោបល់រៀបចំរតនាគារ • DM @Le_Bluue',

      // Footer
      'footer.copy': '© 2026 BlueX. គ្រប់គ្រងអហំការរបស់អ្នក។ គ្រប់គ្រងការជួញដូររបស់អ្នក។ រក្សាសិទ្ធិគ្រប់យ៉ាង។'
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
      calcRiskCashDisplay.textContent = `$${cashRisk.toFixed(2)} ${currentLang === 'km' ? 'ហានិភ័យសាច់ប្រាក់' : 'cash risk'}`;
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
          <span>${currentLang === 'km' ? 'ហានិភ័យមានវិន័យ' : 'Disciplined Risk'}</span>
        `;
        riskSafetyBadge.style.borderColor = 'rgba(212, 255, 0, 0.4)';
        riskSafetyBadge.style.background = 'rgba(212, 255, 0, 0.08)';
        riskSafetyBadge.style.color = '#d4ff00';
      } else if (riskPercent <= 2.0) {
        riskSafetyBadge.innerHTML = `
          <span class="badge-dot" style="background:#ffb800; box-shadow:0 0 10px #ffb800;"></span>
          <span>${currentLang === 'km' ? 'ហានិភ័យកម្រិតមធ្យម' : 'Moderate Risk'}</span>
        `;
        riskSafetyBadge.style.borderColor = 'rgba(255, 184, 0, 0.4)';
        riskSafetyBadge.style.background = 'rgba(255, 184, 0, 0.08)';
        riskSafetyBadge.style.color = '#ffb800';
      } else {
        riskSafetyBadge.innerHTML = `
          <span class="badge-dot" style="background:#ef4444; box-shadow:0 0 10px #ef4444;"></span>
          <span>${currentLang === 'km' ? 'ហានិភ័យខ្ពស់ - ខុសក្បួន' : 'High Risk Violation'}</span>
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
      langBtnText.textContent = lang === 'km' ? 'English' : 'ខ្មែរ';
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
    const bufferChips = document.querySelectorAll('.btn-buffer-chip');
    const shopPresetChips = document.querySelectorAll('.btn-shop-preset');

    if (!hedgeWeightInput || !hedgeUnitSelect || !hedgeSpotInput || !hedgeLeverageSelect) return;

    let currentHedgeMetal = 'XAU';
    let currentHedgeDirection = 'BUY_PHYSICAL';
    let currentHedgeBuffer = 100;
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
      damlung: 'តម្លឹង',
      chi: 'ជី',
      grams: 'ក្រាម',
      ounces: 'Troy Ounces',
      kilograms: 'គីឡូក្រាម'
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
            // Auto-update Cambodian local price baseline if present
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
      // 1 Damlung = 37.5g = 1.205653 Troy Oz
      const pureDamlungValue = spot * 1.205653;
      // Add typical local Cambodian physical spread premium ($40/Damlung for gold, $2 for silver)
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
      const metalLabelKhmer = isXAU ? 'មាស' : 'ប្រាក់';
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
          // Short hedge: stop-out occurs if spot RISES
          stopOutSpot = spot + stopOutDistance;
        } else {
          // Long hedge: stop-out occurs if spot DROPS
          stopOutSpot = Math.max(0, spot - stopOutDistance);
        }
      }

      // DOM Updates
      const currentLang = document.documentElement.getAttribute('lang') || 'en';

      // Action Recommendation Banner
      const banner = document.getElementById('hedgeActionBanner');
      const pill = document.getElementById('hedgeActionPill');
      const headline = document.getElementById('hedgeActionHeadline');
      const reason = document.getElementById('hedgeActionReason');
      const resStandardLots = document.getElementById('resStandardLots');
      const walkthroughLotsText = document.getElementById('walkthroughLotsText');

      if (resStandardLots) resStandardLots.textContent = brokerLots.toFixed(2);
      if (walkthroughLotsText) walkthroughLotsText.textContent = `${brokerLots.toFixed(2)} Lots ${metalSymbol}`;

      if (banner && pill && headline && reason) {
        if (isBuy) {
          banner.classList.remove('action-buy');
          pill.textContent = currentLang === 'km' ? `បើកលក់ / SHORT ${metalSymbol}` : `OPEN SHORT / SELL ${metalSymbol}`;
          headline.innerHTML = currentLang === 'km'
            ? `លក់ <span class="gold-accent">${brokerLots.toFixed(2)}</span> LOTS ${metalSymbol}`
            : `SELL <span class="gold-accent">${brokerLots.toFixed(2)}</span> LOTS ${metalSymbol}`;
          reason.textContent = currentLang === 'km'
            ? `ស្តុក${metalLabelKhmer}ក្នុងហាងកើនឡើង ${totalGrams.toFixed(2)}g (${weight} ${unitNamesKhmer[unit] || unit})។ បើក Digital SHORT ដើម្បីការពារការធ្លាក់ថ្លៃនៃស្តុក។`
            : `Physical ${metalLabelEn} inventory increased by ${totalGrams.toFixed(2)}g (${weight} ${unit}). Open a ${brokerLots.toFixed(2)} digital short to eliminate spot drop risk.`;
        } else {
          banner.classList.add('action-buy');
          pill.textContent = currentLang === 'km' ? `បើកទិញ / LONG ${metalSymbol}` : `OPEN LONG / BUY ${metalSymbol}`;
          headline.innerHTML = currentLang === 'km'
            ? `ទិញ <span class="cyan-accent">${brokerLots.toFixed(2)}</span> LOTS ${metalSymbol}`
            : `BUY <span class="cyan-accent">${brokerLots.toFixed(2)}</span> LOTS ${metalSymbol}`;
          reason.textContent = currentLang === 'km'
            ? `ស្តុក${metalLabelKhmer}ក្នុងហាងថយចុះ ${totalGrams.toFixed(2)}g (${weight} ${unitNamesKhmer[unit] || unit})។ បើក Digital LONG ដើម្បីការពារថ្លៃទិញបំពេញស្តុកឡើងថ្លៃ។`
            : `Physical ${metalLabelEn} inventory decreased by ${totalGrams.toFixed(2)}g (${weight} ${unit}). Open a ${brokerLots.toFixed(2)} digital long to hedge inventory replenishment.`;
        }
      }

      // Physical Counter Cash & Locked Profit Card
      const elPhysicalCashTotal = document.getElementById('cardPhysicalCashTotal');
      if (elPhysicalCashTotal) elPhysicalCashTotal.textContent = `$${physicalCashTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

      const elPhysicalCashBreakdown = document.getElementById('cardPhysicalCashBreakdown');
      if (elPhysicalCashBreakdown) {
        elPhysicalCashBreakdown.textContent = currentLang === 'km'
          ? `${totalDamlungCount.toFixed(2)} តម្លឹង × $${localDamlungPrice.toFixed(2)}/តម្លឹង`
          : `${totalDamlungCount.toFixed(2)} Damlung × $${localDamlungPrice.toFixed(2)}/Damlung`;
      }

      const elDigitalSpotTotal = document.getElementById('cardDigitalSpotTotal');
      if (elDigitalSpotTotal) elDigitalSpotTotal.textContent = `$${digitalSpotTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

      const elDigitalSpotBreakdown = document.getElementById('cardDigitalSpotBreakdown');
      if (elDigitalSpotBreakdown) {
        elDigitalSpotBreakdown.textContent = `${troyOunces.toFixed(3)} oz × $${spot.toFixed(2)}/oz`;
      }

      const elLockedProfit = document.getElementById('cardLockedProfit');
      if (elLockedProfit) {
        elLockedProfit.textContent = `+$${lockedProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
      }

      // Primary Results Metrics
      const elBrokerLots = document.getElementById('cardBrokerLots');
      if (elBrokerLots) elBrokerLots.textContent = `${brokerLots.toFixed(2)} Lots`;

      const elExactLots = document.getElementById('cardExactLots');
      if (elExactLots) {
        elExactLots.textContent = currentLang === 'km'
          ? `ពិតប្រាកដ: ${exactLots.toFixed(5)} Lots`
          : `Exact: ${exactLots.toFixed(5)} Lots`;
      }

      const elResidualWeight = document.getElementById('cardResidualWeight');
      if (elResidualWeight) elResidualWeight.textContent = `${residualGrams.toFixed(2)} g`;

      const elResidualDamlung = document.getElementById('cardResidualDamlung');
      if (elResidualDamlung) {
        elResidualDamlung.textContent = currentLang === 'km'
          ? `≈ ${residualDamlung.toFixed(2)} តម្លឹង (${residualChi.toFixed(2)} ជី)`
          : `≈ ${residualDamlung.toFixed(2)} Damlung (${residualChi.toFixed(2)} Chi)`;
      }

      const elMarginVal = document.getElementById('cardMarginVal');
      if (elMarginVal) elMarginVal.textContent = `$${marginUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

      const elLeverageNote = document.getElementById('cardLeverageNote');
      if (elLeverageNote) elLeverageNote.textContent = currentLang === 'km' ? `នៅកម្រិត 1:${leverage}` : `At 1:${leverage} leverage`;

      // Stop-Out Price Card
      const elStopOutPrice = document.getElementById('cardStopOutPrice');
      const elStopOutDistance = document.getElementById('cardStopOutDistance');
      if (elStopOutPrice && elStopOutDistance) {
        if (userBalance > 0 && brokerLots > 0) {
          elStopOutPrice.textContent = `$${stopOutSpot.toFixed(2)}`;
          elStopOutDistance.textContent = (isBuy ? '+' : '-') + `$${Math.abs(stopOutDistance).toFixed(2)} / oz distance`;
        } else {
          elStopOutPrice.textContent = currentLang === 'km' ? 'សូមបញ្ចូលទុន' : 'Input Balance';
          elStopOutDistance.textContent = currentLang === 'km' ? 'ដើម្បីគណនាហានិភ័យ' : 'to view stop-out level';
        }
      }

      // Account Health & Capital Safety Box
      const elSafeCapital = document.getElementById('cardSafeCapital');
      if (elSafeCapital) elSafeCapital.textContent = `$${safeCapitalUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;

      const elBreakdownUserBalance = document.getElementById('breakdownUserBalance');
      if (elBreakdownUserBalance) elBreakdownUserBalance.textContent = `$${userBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

      const elBreakdownMargin = document.getElementById('breakdownMargin');
      if (elBreakdownMargin) elBreakdownMargin.textContent = `$${marginUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

      const elBreakdownBuffer = document.getElementById('breakdownBuffer');
      if (elBreakdownBuffer) elBreakdownBuffer.textContent = `$${bufferUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

      const elBufferValText = document.getElementById('hedgeBufferValText');
      if (elBufferValText) elBufferValText.textContent = `+$${buffer.toFixed(2)} / oz`;

      const elBreakdownSurplus = document.getElementById('breakdownSurplus');
      const elDiagPill = document.getElementById('cardAccountDiagPill');
      const elDiagText = document.getElementById('diagnosticExplanationText');

      const surplus = userBalance - safeCapitalUSD;
      if (elBreakdownSurplus && elDiagPill && elDiagText) {
        if (userBalance >= safeCapitalUSD) {
          elDiagPill.className = 'account-diagnostic-pill';
          elDiagPill.textContent = currentLang === 'km' ? 'ទុនសុវត្ថិភាពពេញលេញ (100%)' : 'CAPITAL FULLY PROTECTED';
          elBreakdownSurplus.className = 'text-success';
          elBreakdownSurplus.textContent = `+$${surplus.toFixed(2)} Surplus`;
          elDiagText.className = 'diagnostic-explanation';
          elDiagText.textContent = currentLang === 'km'
            ? `🟢 សុវត្ថិភាពខ្ពស់បំផុត៖ ដើមទុនរបស់អ្នកគ្របដណ្តប់ទាំង Margin និងទុនបម្រុងលើសពី $${buffer}/oz។ គ្មានហានិភ័យ Stop-Out ឡើយ។`
            : `🟢 Capital Protected: Your balance safely covers required margin plus more than $${buffer}/oz market swing against your hedge. Zero liquidation risk.`;
        } else if (userBalance >= marginUSD) {
          elDiagPill.className = 'account-diagnostic-pill status-tight';
          elDiagPill.textContent = currentLang === 'km' ? 'ទុនបម្រុងនៅមានកម្រិត' : 'TIGHT MARGIN BUFFER';
          elBreakdownSurplus.className = 'text-danger';
          elBreakdownSurplus.textContent = `-$${Math.abs(surplus).toFixed(2)} Shortfall`;
          elDiagText.className = 'diagnostic-explanation status-tight';
          elDiagText.textContent = currentLang === 'km'
            ? `🟡 ទុនបម្រុងនៅស្តើង៖ គណនីអាចបើកបញ្ជាបាន ប៉ុន្តែដើម្បីការពារការ Stop-Out នៅពេលទីផ្សាររលាក់ សូមបន្ថែម $${Math.abs(surplus).toFixed(2)} ទៀត។`
            : `🟡 Tight Buffer: Position can open, but buffer is slim. Deposit $${Math.abs(surplus).toFixed(2)} more to reach full ±$${buffer}/oz protection.`;
        } else {
          elDiagPill.className = 'account-diagnostic-pill status-danger';
          elDiagPill.textContent = currentLang === 'km' ? 'ទុនមិនទាន់គ្រប់គ្រាន់' : 'INSUFFICIENT BALANCE';
          elBreakdownSurplus.className = 'text-danger';
          elBreakdownSurplus.textContent = `-$${Math.abs(surplus).toFixed(2)} Under Margin`;
          elDiagText.className = 'diagnostic-explanation status-danger';
          elDiagText.textContent = currentLang === 'km'
            ? `🔴 ទុនមិនគ្រប់៖ អ្នកមិនអាចបើក ${brokerLots.toFixed(2)} Lots បានឡើយ។ តម្រូវការ Margin អប្បបរមាគឺ $${marginUSD.toFixed(2)} USD។`
            : `🔴 Insufficient Capital: Cannot execute ${brokerLots.toFixed(2)} Lots. Minimum initial margin required is $${marginUSD.toFixed(2)} USD.`;
        }
      }

      // Mathematical Proof Step Breakdown
      const elMathProofSteps = document.getElementById('mathProofSteps');
      if (elMathProofSteps) {
        elMathProofSteps.innerHTML = currentLang === 'km'
          ? `${weight} ${unitNamesKhmer[unit] || unit} × ${(gramsPerUnit[unit] || 37.5).toFixed(2)}g = ${totalGrams.toFixed(2)}g ${metalLabelKhmer}រូបវន្ត<br>${totalGrams.toFixed(2)}g ÷ 31.1035g/oz = ${troyOunces.toFixed(4)} Troy Ounces<br>${troyOunces.toFixed(4)} oz ÷ ${contractSize} oz/Lot = <strong>${exactLots.toFixed(5)} Digital Lots</strong>`
          : `${weight} ${unit} × ${(gramsPerUnit[unit] || 37.5).toFixed(2)}g = ${totalGrams.toFixed(2)}g Physical ${metalLabelEn}<br>${totalGrams.toFixed(2)}g ÷ 31.1035g/oz = ${troyOunces.toFixed(4)} Troy Ounces<br>${troyOunces.toFixed(4)} oz ÷ ${contractSize} oz/Lot = <strong>${exactLots.toFixed(5)} Digital Lots</strong>`;
      }
    }

    // Expose recalculate globally for language switcher
    window.recalcGoldHedging = calculateGoldHedging;

    // 3. Register All Event Listeners
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
        showToast(currentLang === 'km' ? '⚠️ សូមបំពេញព័ត៌មានដែលត្រូវការទាំងអស់។' : '⚠️ Please complete all required fields.');
        return;
      }

      showToast(currentLang === 'km' 
        ? '🚀 សូមអរគុណ ' + nameInput.value + '! សាររបស់អ្នកត្រូវបានផ្ញើជូន BlueX រួចរាល់ហើយ។' 
        : '🚀 Thank you ' + nameInput.value + '! Your inquiry has been delivered directly to BlueX.');
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
    translations.km['nav.about'] = 'អំពីយើង';
    translations.km['nav.brokers'] = 'Brokers';
    translations.km['nav.capital'] = 'យុទ្ធសាស្ត្រ';
    translations.km['nav.pillars'] = 'គោលការណ៍';
    translations.km['nav.faq'] = 'សំណួរ';
    translations.km['nav.connect'] = 'ទាក់ទង';
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
