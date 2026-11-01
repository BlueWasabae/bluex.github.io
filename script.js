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
  // 1. NAVIGATION ACTIVE STATE & SMOOTH SCROLLING
  // ========================================================
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');

  function updateActiveNavLink() {
    let scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 140;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
      });
    });
  }

  // ========================================================
  // 1B. CLICK LOGO TO SMOOTH SCROLL TO TOP EVERY TIME
  // ========================================================
  const logoTriggers = document.querySelectorAll('.logo, .nav-logo-3d-img, a[href="#top"], a[href="#hero"]');
  logoTriggers.forEach(el => {
    el.addEventListener('click', (e) => {
      const anchor = el.closest('a') || (el.tagName === 'A' ? el : null);
      const href = anchor ? anchor.getAttribute('href') : null;
      const currentPath = window.location.pathname.replace(/\/$/, '');
      const isIndex = currentPath === '' || currentPath.endsWith('index.html');

      // If on index (or root) and link points to top/hero or has no href
      if (isIndex && (!href || href === '#top' || href === '#hero' || href === '#' || href === 'index.html' || href === 'index.html#top' || href === 'index.html#hero')) {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, null, window.location.pathname + window.location.search);
        }
        if (navMenu && navMenu.classList.contains('mobile-open')) {
          navMenu.classList.remove('mobile-open');
        }
      } else if (href === '#top' || href === '#' || (!href && el.classList.contains('logo'))) {
        // Subpages scrolling to top of current page
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, null, window.location.pathname + window.location.search);
        }
        if (navMenu && navMenu.classList.contains('mobile-open')) {
          navMenu.classList.remove('mobile-open');
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
  // 3. COMPLETE KHMER (ខ្មែរ) & ENGLISH I18N DICTIONARY & ENGINE
  // ========================================================
  const translations = {
    en: {
      // Nav
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.brokers': 'Brokers',
      'nav.courses': 'Courses',
      'nav.genesis': 'SMC Genesis',
      'nav.capital': 'Portfolio Strategy',
      'nav.calculator': 'Calculator',
      'nav.knowledge': 'Knowledge',
      'nav.pillars': 'Pillars',
      'nav.media': 'Media',
      'nav.faq': 'FAQ',
      'nav.connect': 'Connect',
      'nav.telegram': 'Telegram',
      'nav.register': 'Register',
      'nav.registerNow': 'Register',

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
      'course.genesisBannerTitle': '⚡ Flagship Curriculum: Explore SMC Genesis Institutional Blueprint ➔',
      'course.genesisBannerSub': 'Deep dive into institutional liquidity pools, Supply & Demand zones, displacement order blocks, and live execution mentorship.',
      'course.genesisBannerBtn': 'Open SMC Genesis Portal ➔',

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
      'genesis.badge': 'ðŸŽ“ Official Mentorship Course â€¢ Learn Institutional Trading',
      'genesis.heroTitle': 'Master Institutional Trading with SMC Genesis.<br><span class="highlight">Official Course & 1-on-1 Mentorship.</span>',
      'genesis.heroSub': 'Stop donating liquidity to retail traps. We teach you how to trade Gold (XAU/USD) with pure mechanical Market Structure, institutional Supply & Demand, liquidity sweeps, and disciplined capital preservation.',
      'genesis.metric1Val': '1:3 to 1:10+',
      'genesis.metric1Label': 'Target Risk-to-Reward Ratio',
      'genesis.metric2Val': 'Zero Indicators',
      'genesis.metric2Label': 'Pure Liquidity & Price Action',
      'genesis.metric3Val': '0.5% â€“ 1.0%',
      'genesis.metric3Label': 'Strict Capital Risk Per Setup',
      'genesis.metric4Val': 'Direct Access',
      'genesis.metric4Label': 'Course Inquiries & Direct DM (@Le_Bluue)',
      'genesis.heroApplyBtn': 'âš¡ Enroll in Course: DM @Le_Bluue',
      'genesis.heroCurriculumBtn': 'Explore Course Syllabus â†“',
      'genesis.heroCommunityBtn': 'ðŸ‘¥ Join Community Telegram (t.me/moonbluefx)',
      'genesis.heroBrokerBtn': 'Execute on Low-Latency Raw Spreads âž”',

      // 3 Core Foundation Tenets
      'genesis.tenet1Title': '01. MINDSET',
      'genesis.tenet1Desc': 'Emotional discipline & probabilistic thinking',
      'genesis.tenet2Title': '02. RULES',
      'genesis.tenet2Desc': 'Strict execution discipline & risk protection',
      'genesis.tenet3Title': '03. ACCURACY',
      'genesis.tenet3Desc': 'Consistency in institutional Supply & Demand',

      // The Paradigm Shift
      'genesis.shiftBadge': 'The Paradigm Shift â€¢ Institutional vs Retail',
      'genesis.shiftTitle': 'Why 95% of Retail Traders Are Simply Liquidity',
      'genesis.shiftDesc': 'Retail technical analysis teaches traders to place stops right where central bank algorithms look to fill massive institutional orders. SMC Genesis teaches you to identify the engineered traps and execute alongside smart money.',
      'genesis.retailColTitle': 'The Retail Indicator Fallacy',
      'genesis.instColTitle': 'The SMC Genesis Institutional Edge',
      'genesis.shiftR1': 'Trading lagging indicators (RSI, MACD, Stochastics) that react long after moves happened.',
      'genesis.shiftI1': 'Reading algorithmic Interbank Price Delivery (IPDA) and institutional time-and-price arrays.',
      'genesis.shiftR2': 'Buying breakouts above resistance, becoming instant liquidity for institutional sell orders.',
      'genesis.shiftI2': 'Waiting for Buy-Side Liquidity sweeps (BSL) and entering on structural shifts into fresh displacement zones.',
      'genesis.shiftR3': 'Poor 1:1 or 1:1.5 risk-to-reward requiring a fragile 70%+ win rate to avoid blowouts.',
      'genesis.shiftI3': 'Asymmetric 1:3+ to 1:10+ risk architecture where a 40% win rate yields substantial compound growth.',
      'genesis.shiftR4': 'Emotional revenge trading, widening stops, and guessing arbitrary tops and bottoms.',
      'genesis.shiftI4': 'Clear institutional invalidation points, predefined risk management, and structured execution routines.',

      // Timeframe Execution Matrix
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

      // Flagship Topics & Pillars
      'genesis.curriculumBadge': 'Institutional Curriculum Topics',
      'genesis.curriculumTitle': 'What We Teach: Master Course Syllabus & Core Pillars',
      'genesis.curriculumSub': 'A comprehensive introduction to the foundational topics taught inside SMC Genesis. Designed to equip serious traders with the algorithmic mechanics needed to navigate financial markets alongside smart money.',
      'genesis.m1Num': 'Topic 01',
      'genesis.m1Title': 'Market Structure Foundations (BOS, IBOS, FTS)',
      'genesis.m1Desc': 'The architecture of financial markets: distinguishing between Major Trend Continuation (BOS), Internal Retracement Pullbacks (IBOS), and Fractal Structural Shifts (FTS) without retail lagging indicators.',
      'genesis.m2Num': 'Topic 02',
      'genesis.m2Title': 'Multi-Timeframe Correlation & Data Transfer',
      'genesis.m2Desc': 'Understanding the Data Transfer Mechanism: how higher-timeframe pullbacks unfold as counter-trend structures on middle timeframes, and where structural shifts signal completion back into macro flow.',
      'genesis.m3Num': 'Topic 03',
      'genesis.m3Title': 'The 4 Supply & Demand Extraction Models',
      'genesis.m3Desc': 'Moving beyond basic support/resistance into institutional footprints: Range-Based S&D, Pivot S&D with inside-bar confluence, Single-Candle Extreme Order Blocks, and Fractal Wick S&D.',
      'genesis.m4Num': 'Topic 04',
      'genesis.m4Title': 'Mitigation Lifecycle & Zone Dynamics',
      'genesis.m4Desc': 'The 3-phase institutional zone lifecycle: Zone Creation, Continuation Model, and Reversal Shift. Why unmitigated fresh zones hold high probability and how break-even settlements occur.',
      'genesis.m5Num': 'Topic 05',
      'genesis.m5Title': 'Liquidity Anatomy & The 5 Core Retail Traps',
      'genesis.m5Desc': 'How central bank algorithms engineer liquidity: Swing High/Low stops, Equal High/Low ($$$) magnets, Trendline breakouts, Range sweeps, and the Load Transfer mechanism that purges old zones.',
      'genesis.m6Num': 'Topic 06',
      'genesis.m6Title': 'Multi-Scenario Execution & Asymmetric Compounding',
      'genesis.m6Desc': 'Executing with high-probability scenario models: Counter-Trend Exhaustion, Structure Refinement Pro-Trend, and Instant Momentum Expansion â€” paired with fixed 0.5%â€“1.0% risk and minimum 1:3 to 1:5+ RR.',

      // The Mentorship Experience & Ecosystem
      'genesis.tabPillars': 'The Learning Experience',
      'genesis.tabLiquidity': '1. Direct Guidance',
      'genesis.tabCommunity': '2. Community Telegram',
      'genesis.tabOB': '3. Live Chart Sessions',
      'genesis.tabRisk': '4. Asymmetric Capital Edge',
      'genesis.tabLqHeading': 'Personal Consultation & Setup Reviews with BlueX',
      'genesis.tabLqText': 'Every trader possesses unique strengths and psychological stumbling blocks. In SMC Genesis, you receive personalized feedback directly from BlueX via private Telegram DM (@Le_Bluue). Submit your trade setups, execution logs, and chart markups for direct institutional critique and refinement.',
      'genesis.tabLqRule': 'Direct Telegram Contact: Message @Le_Bluue on Telegram for course details, questions, and private consultation.',
      'genesis.tabCommunityHeading': 'The Official BlueX Trader Community (t.me/moonbluefx)',
      'genesis.tabCommunityText': 'Surround yourself with a community of disciplined market operators who speak the same institutional language. Our official Telegram community group (t.me/moonbluefx) provides daily market context, institutional focus zones, and collaborative discussions focused solely on capital preservation and high-conviction setups.',
      'genesis.tabCommunityRule': 'Community Highlights: Open to dedicated traders looking to study institutional Market Structure & S&D alongside BlueX and fellow members.',
      'genesis.tabObHeading': 'Live Screen-Sharing Interactive Chart Sessions',
      'genesis.tabObText': 'Theory without execution is useless. We bridge the gap through live, interactive screen-sharing chart sessions where market structure, session liquidity sweeps, and displacement order blocks are analyzed live in real time. Experience how an institutional trader reads the market before candles unfold.',
      'genesis.tabObRule': 'Real-Time Execution: Zero hindsight bias. Real charts, real liquidity, real execution discipline.',
      'genesis.tabRiskHeading': 'Asymmetric Mathematical Edge & Risk Engineering',
      'genesis.tabRiskText': 'We dismantle the retail myth that you need an 80% win rate to become wealthy. In SMC Genesis, you discover how a disciplined 40% win rate combined with a minimum 1:3 to 1:5+ risk-to-reward ratio produces consistent, exponential capital compounding while keeping risk strictly at 0.5%â€“1.0% per trade.',
      'genesis.tabRiskRule': 'Capital Philosophy: Keep risk strictly at 0.5%â€“1.0% per trade. Let asymmetric math create long-term compound growth.',

      // 5-Pillar Mastery Framework
      'genesis.admissionBadge': 'ðŸŽ“ 5-Pillar Mastery Framework â€¢ Live Mentorship Program',
      'genesis.admissionTitle': 'Study Course with BlueX: The 5-Pillar Mastery Framework',
      'genesis.admissionSub': 'A structured curriculum designed to build professional competence across market structure, supply and demand extraction, liquidity traps, execution scenarios, and capital allocation:',
      'genesis.std1Title': 'Pillar 01: Market Structure (ážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’áž‘áž¸áž•áŸ’ážŸáž¶ážš)',
      'genesis.std1Desc': 'Master Swing High/Low mechanics, distinguishing between Major BOS (continuation), IBOS (internal pullbacks), and Fractal Structural Shifts (FTS).',
      'genesis.std1Outcome': 'Applied Outcome: Map swing flow & synchronized multi-timeframe matrix with clarity.',
      'genesis.std2Title': 'Pillar 02: S&D Extraction Architecture (ážáŸ†áž”áž“áŸ‹áž•áŸ’áž‚ážáŸ‹áž•áŸ’áž‚áž„áŸ‹/ážáž˜áŸ’ážšáž¼ážœáž€áž¶ážš)',
      'genesis.std2Desc': 'Learn the 4 core institutional footprint models: Range-Based S&D, Pivot S&D with inside-bar confluence, Single-Candle Extreme Order Blocks, and Fractal Wick S&D.',
      'genesis.std2Outcome': 'Applied Outcome: Accurately mark Range, Pivot, Single-Candle & Fractal S&D zones.',
      'genesis.std3Title': 'Pillar 03: Liquidity Sweeps & Trap Exploitation (áž›áŸ†áž áž¼ážšážŸáž¶áž…áŸ‹áž”áŸ’ážšáž¶áž€áŸ‹áž¢áž“áŸ’áž‘áž¶áž€áŸ‹)',
      'genesis.std3Desc': 'Unpack the 5 core retail liquidity traps: Swing points, Equal High/Low ($$$) magnets, Trendline traps, Range sweeps, and Load Transfer mechanics.',
      'genesis.std3Outcome': 'Applied Outcome: Detect stop-hunts, liquidity magnets, and inducement traps in advance.',
      'genesis.std4Title': 'Pillar 04: Precision Execution Scenarios (ážšáž¼áž”áž˜áž“áŸ’ážáž…áž¼áž›áž•áŸ’ážŸáž¶ážš)',
      'genesis.std4Desc': 'Understand high-probability scenario execution: Counter-Trend Exhaustion, Structure Refinement Pro-Trend, and Instant Momentum Expansion.',
      'genesis.std4Outcome': 'Applied Outcome: Confidently execute order scenarios with refined triggers and tight stops.',
      'genesis.std5Title': 'Pillar 05: Asymmetric Capital Allocation (áž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž áž¶áž“áž·áž—áŸáž™)',
      'genesis.std5Desc': 'Defend trading capital through disciplined position sizing (0.5%â€“1.0%), dynamic break-even progression, and targeting asymmetric RR â‰¥ 1:3 to 1:5+.',
      'genesis.std5Outcome': 'Applied Outcome: Safeguard capital longevity through mathematical asymmetric expectancy.',
      'genesis.quoteText': '"Trading success is not built on never taking a loss, but on unwavering discipline and defending your capital at all costs."',
      'genesis.quoteAuthor': 'â€” SMC Genesis Institutional Blueprint â€¢ BlueX',
      'genesis.applyTelegramBtn': 'Message BlueX on Telegram (Direct DM: @Le_Bluue)',
      'genesis.communityTelegramBtn': 'Join Official Community Group (t.me/moonbluefx)',
      'genesis.announcementBadge': '🔥 Enrollment Open',
      'genesis.announcementText': 'SMC Genesis Course — Master Gold (XAU/USD) with 1-on-1 Mentorship & Live Execution',
      'genesis.announcementBtn': 'Claim Seat via Telegram →',
      'genesis.spotlightBadge': '🎯 Exclusive 1-on-1 Mentorship Course',
      'genesis.spotlightTitle': 'Learn Direct with BlueX: The SMC Genesis Institutional Mentorship',
      'genesis.spotlightSub': 'We cut through retail illusions to teach you the mechanical precision required to trade institutional markets. Gain the confidence, rules, and execution habits of a professional operator.',
      'genesis.spotlightStatus': '● Admissions Active • Limited Cohort',
      'genesis.spotlightPerk1Title': '1-on-1 Personal Guidance',
      'genesis.spotlightPerk1Desc': 'Direct Telegram access to mentor Limeng Sovann (@Le_Bluue) for chart reviews, setup auditing, and psychological calibration.',
      'genesis.spotlightPerk2Title': 'Pure Mechanical Playbook',
      'genesis.spotlightPerk2Desc': 'Zero subjective guesswork. Definitive rules for body-close BOS, 4 S&D extraction types, and 3 execution scenarios.',
      'genesis.spotlightPerk3Title': 'Live Chart Sessions',
      'genesis.spotlightPerk3Desc': 'Analyze live Gold (XAU/USD) market structure before high-volume sessions. See how institutional zones are identified in real time.',
      'genesis.spotlightPerk4Title': 'VIP Student Community',
      'genesis.spotlightPerk4Desc': 'Lifetime access to the private community group (t.me/moonbluefx) for daily bias sharing, key levels, and ongoing member growth.',
      'genesis.spotlightActionTitle': 'Ready to Master Institutional Trading?',
      'genesis.spotlightActionDesc': 'Limited seats per cohort to guarantee personalized feedback and rapid skill progression.',
      'genesis.spotlightActionBtn': '⚡ Message Mentor @Le_Bluue on Telegram',
      'genesis.floatingCta': '⚡ Enroll in Course • DM @Le_Bluue',

      // Institutional Brokers for SMC
      'genesis.brokerBadge': 'Execution Speed & Raw Liquidity',
      'genesis.brokerTitle': 'Recommended Brokers for SMC Execution',
      'genesis.brokerDesc': 'Smart Money Concepts execution requires ultra-low latency, tightest raw spreads, deep order books, and zero artificial slippage. We recommend the following tier-1 regulated partners:',
      'genesis.brokerTrenoNote': 'Top Partner • Raw Spreads • Ultra-Low Latency',
      'genesis.brokerGtcNote': 'Global Multi-Regulated • Institutional Liquidity',
      'genesis.brokerLirunexNote': 'Regulated STP Broker • Deep Forex & Gold Liquidity',

      // FAQ
      'genesis.faqBadge': 'Frequently Asked Questions',
      'genesis.faqTitle': 'Everything You Need to Know About SMC Genesis',
      'genesis.faq1Q': 'What makes SMC Genesis fundamentally different from retail technical analysis?',
      'genesis.faq1A': 'Retail analysis relies on lagging indicators (RSI, moving averages) and static trendlines which central bank algorithms routinely exploit for liquidity. SMC Genesis teaches you how the Interbank Price Delivery Algorithm (IPDA) actually prices markets, where buy and sell stops accumulate, and how to execute after liquidity purges.',
      'genesis.faq2Q': 'Can beginners learn SMC Genesis, or is prior experience required?',
      'genesis.faq2A': 'Beginners actually often excel faster because they do not have years of bad retail indicator habits to unlearn. SMC Genesis starts from the absolute bedrock of market liquidity and builds up step-by-step into advanced multi-timeframe execution.',
      'genesis.faq3Q': 'Which financial instruments work best with SMC Genesis?',
      'genesis.faq3A': 'SMC Genesis is a universal institutional Supply & Demand framework. It applies seamlessly to Gold (XAUUSD), major Forex pairs (EURUSD, GBPUSD, USDJPY), equity indices (US30, NAS100), and liquid cryptocurrencies (BTC, ETH).',
      'genesis.faq4Q': 'What kind of risk-to-reward ratios can I expect from this strategy?',
      'genesis.faq4A': 'SMC setups target asymmetric profiles starting from 1:3 up to 1:10+. Because entries are refined on lower timeframes at pristine imbalance zones, stop losses are tight and structural, maximizing your capital efficiency.',
      'genesis.faq5Q': 'How can I enroll in the mentorship or contact BlueX directly?',
      'genesis.faq5A': 'To apply for mentorship or ask private questions, send a direct Telegram message (DM) to BlueX at @Le_Bluue. To join the public discussion and daily market outlooks, join our official Community Telegram group at t.me/moonbluefx.',

      // Bottom CTA
      'genesis.ctaTitle': 'Ready to Step Into the Institutional Flow?',
      'genesis.ctaSub': 'Stop donating retail liquidity to algorithms. Connect directly with BlueX or join our growing trader community.',

      // Footer
      'footer.copy': '© 2026 BlueX. Master Your Ego. Master Your Trades. All rights reserved.'
    },

    km: {
      // Nav
      'nav.home': 'ទំព័រដើម',
      'nav.about': 'អំពី BlueX',
      'nav.brokers': 'ឈ្មួញកណ្តាល',
      'nav.courses': 'វគ្គសិក្សា',
      'nav.genesis': 'SMC Genesis',
      'nav.capital': 'យុទ្ធសាស្ត្រផលប័ត្រ',
      'nav.calculator': 'គណនា Lot',
      'nav.knowledge': 'ចំណេះដឹង',
      'nav.pillars': 'គោលការណ៍គ្រឹះ',
      'nav.media': 'មេឌា',
      'nav.faq': 'សំណួរ-ចម្លើយ',
      'nav.connect': 'ទំនាក់ទំនង',
      'nav.telegram': 'តេឡេក្រាម',
      'nav.register': 'ចុះឈ្មោះ',
      'nav.registerNow': 'ចុះឈ្មោះ',

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
      'course.genesisBannerTitle': '⚡ កម្មវិធីសិក្សាស្ថាប័នស្នូល: ស្វែងយល់ពីប្លង់មេ SMC Genesis ➔',
      'course.genesisBannerSub': 'ស្វែងយល់ស៊ីជម្រៅអំពី Liquidity Pools ស្ថាប័ន, Supply & Demand Zones, Order Blocks និងការបណ្តុះបណ្តាលផ្ទាល់។',
      'course.genesisBannerBtn': 'បើកទំព័រ SMC Genesis ➔',

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
      'genesis.badge': 'ðŸŽ“ ážœáž‚áŸ’áž‚áž”ážŽáŸ’ážáž»áŸ‡áž”ážŽáŸ’ážáž¶áž›áž•áŸ’áž›áž¼ážœáž€áž¶ážš â€¢ áž”áž„áŸ’ážšáŸ€áž“áž•áŸ’áž‘áž¶áž›áŸ‹ážŠáŸ„áž™ BlueX',
      'genesis.heroTitle': 'ážšáŸ€áž“áž‡áž½áž‰ážŠáž¼ážšáž”áŸ‚áž”ážŸáŸ’ážáž¶áž”áŸáž“áž‡áž¶áž˜áž½áž™ SMC Genesis.<br><span class="highlight">ážœáž‚áŸ’áž‚áž”ážŽáŸ’ážáž»áŸ‡áž”ážŽáŸ’ážáž¶áž›áž•áŸ’áž›áž¼ážœáž€áž¶ážš & áž€áž¶ážšáž”áž„áŸ’ážšáŸ€áž“áž•áŸ’áž‘áž¶áž›áŸ‹áž˜áž½áž™áž‘áž›áŸ‹áž˜áž½áž™áŸ”</span>',
      'genesis.heroSub': 'áž”áž‰áŸ’ážˆáž”áŸ‹áž€áž¶ážšážáž¶ážáž”áž„áŸ‹áž‘áŸ…áž›áž¾áž¢áž“áŸ’áž‘áž¶áž€áŸ‹áž‘áž¸áž•áŸ’ážŸáž¶ážšáŸ” áž™áž¾áž„áž”áž„áŸ’ážšáŸ€áž“áž¢áŸ’áž“áž€áž–áž¸ážšáž”áŸ€áž”áž‡áž½áž‰ážŠáž¼ážšáž˜áž¶ážŸ (XAU/USD) áž‡áž¶áž˜áž½áž™áž“áž¹áž„ážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’áž‘áž¸áž•áŸ’ážŸáž¶ážšážŸáž»áž€áŸ’ážšáž¹áž, Supply & Demand ážŸáŸ’ážáž¶áž”áŸáž“, Liquidity Sweeps áž“áž·áž„áž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„ážŠáž¾áž˜áž‘áž»áž“áž”áŸ’ážšáž€áž”ážŠáŸ„áž™ážœáž·áž“áŸáž™ážáŸ’áž–ážŸáŸ‹áž”áŸ†áž•áž»ážáŸ”',
      'genesis.metric1Val': '1:3 ážŠáž›áŸ‹ 1:10+',
      'genesis.metric1Label': 'ážŸáž˜áž¶áž˜áž¶ážáŸ’ážšáž áž¶áž“áž·áž—áŸáž™-áž•áž›áž…áŸ†ážŽáŸáž‰ (R:R)',
      'genesis.metric2Val': 'áž‚áŸ’áž˜áž¶áž“ážŸáž¼áž…áž“áž¶áž€ážšáž™ážºážáž™áŸ‰áž¶ážœ',
      'genesis.metric2Label': 'áž•áŸ’áž¢áŸ‚áž€áž›áž¾ Liquidity & ážŸáž€áž˜áŸ’áž˜áž—áž¶áž–ážáž˜áŸ’áž›áŸƒážŸáž»áž‘áŸ’áž’',
      'genesis.metric3Val': '0.5% â€“ 1.0%',
      'genesis.metric3Label': 'áž€áž˜áŸ’ážšáž·ážáž áž¶áž“áž·áž—áŸáž™áž‘áž»áž“áž¢ážáž·áž”ážšáž˜áž¶áž€áŸ’áž“áž»áž„áž˜áž½áž™ Trade',
      'genesis.metric4Val': 'áž‘áŸ†áž“áž¶áž€áŸ‹áž‘áŸ†áž“áž„áž•áŸ’áž‘áž¶áž›áŸ‹',
      'genesis.metric4Label': 'ážœáž‚áŸ’áž‚áž”áž„áŸ’ážšáŸ€áž“áž•áŸ’áž‘áž¶áž›áŸ‹ & ážŸáž¶ážšáž•áŸ’áž‘áž¶áž›áŸ‹ (@Le_Bluue)',
      'genesis.heroApplyBtn': 'âš¡ áž…áž»áŸ‡ážˆáŸ’áž˜áŸ„áŸ‡áž…áž¼áž›ážšáŸ€áž“áž•áŸ’áž‘áž¶áž›áŸ‹: DM @Le_Bluue',
      'genesis.heroCurriculumBtn': 'áž–áž·áž“áž·ážáŸ’áž™áž˜áž¾áž›áž˜áŸážšáŸ€áž“ážœáž‚áŸ’áž‚ážŸáž·áž€áŸ’ážŸáž¶ â†“',
      'genesis.heroCommunityBtn': 'ðŸ‘¥ áž…áž¼áž›ážšáž½áž˜ Community Telegram (t.me/moonbluefx)',
      'genesis.heroBrokerBtn': 'áž‡áž½áž‰ážŠáž¼ážšáž›áž¾ Raw Spreads áž›áŸ’áž”áž¿áž“áž›áž¿áž“ âž”',

      // 3 Core Foundation Tenets
      'genesis.tenet1Title': 'áŸ áŸ¡. MINDSET',
      'genesis.tenet1Desc': 'áž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž¢áž¶ážšáž˜áŸ’áž˜ážŽáŸ áž“áž·áž„áž€áž¶ážšáž‚áž·ážáž”áŸ‚áž”áž”áŸ’ážšáž¼áž”áž¶áž”áŸŠáž¸áž›áž¸ážáŸ',
      'genesis.tenet2Title': 'áŸ áŸ¢. RULES',
      'genesis.tenet2Desc': 'ážœáž·áž“áŸáž™áž‡áž½áž‰ážŠáž¼ážšážáž¹áž„ážšáŸ‰áž¹áž„ & Risk Protection',
      'genesis.tenet3Title': 'áŸ áŸ£. ACCURACY',
      'genesis.tenet3Desc': 'ážŸáŸ’ážáž·ážšáž—áž¶áž–áž€áŸ’áž“áž»áž„áž€áž¶ážšáž”áŸ’ážšážáž·áž”ážáŸ’ážáž·áž€áž¶ážš Supply & Demand',

      // The Paradigm Shift
      'genesis.shiftBadge': 'áž€áž¶ážšáž•áŸ’áž›áž¶ážŸáŸ‹áž”áŸ’ážáž¼ážšáž•áŸ’áž“ážáŸ‹áž‚áŸ†áž“áž·áž â€¢ ážŸáŸ’ážáž¶áž”áŸáž“áž’áŸ† vs Retail',
      'genesis.shiftTitle': 'áž áŸážáž»áž¢áŸ’ážœáž¸ Trader 95% áž€áŸ’áž›áž¶áž™áž‡áž¶ Liquidity ážŸáž˜áŸ’ážšáž¶áž”áŸ‹áž‘áž¸áž•áŸ’ážŸáž¶ážš',
      'genesis.shiftDesc': 'áž€áž¶ážšážœáž·áž—áž¶áž‚áž”áž…áŸ’áž…áŸáž€áž‘áŸážŸáž‘áž¼áž‘áŸ…áž”áž„áŸ’ážšáŸ€áž“áž±áŸ’áž™ážŠáž¶áž€áŸ‹ Stop-loss áž“áŸ…ážáŸ’ážšáž„áŸ‹áž€áž“áŸ’áž›áŸ‚áž„ážŠáŸ‚áž›áž€áŸ’áž”áž½áž“ážŠáŸ„áŸ‡ážŸáŸ’ážšáž¶áž™áž’áž“áž¶áž‚áž¶ážšáž€ážŽáŸ’ážáž¶áž›ážŸáŸ’ážœáŸ‚áž„ážšáž€ážŠáž¾áž˜áŸ’áž”áž¸áž”áŸ†áž–áŸáž‰áž”áž‰áŸ’áž‡áž¶áž‘áž·áž‰-áž›áž€áŸ‹ážŸáŸ’ážáž¶áž”áŸáž“áž’áŸ†áŸ—áŸ” SMC Genesis áž”áž„áŸ’ážšáŸ€áž“áž¢áŸ’áž“áž€áž±áŸ’áž™áž˜áž¾áž›ážƒáž¾áž‰áž¢áž“áŸ’áž‘áž¶áž€áŸ‹áž‘áž¶áŸ†áž„áž“áŸáŸ‡ áž áž¾áž™áž”áŸ’ážšážáž·áž”ážáŸ’ážáž·áž€áž¶ážšážŸáŸ’ážšáž”ážáž¶áž˜áž›áŸ†áž áž¼ážš Smart MoneyáŸ”',
      'genesis.retailColTitle': 'áž—áž¶áž–áž”ážšáž¶áž‡áŸáž™áž“áŸƒážœáž·áž’áž¸ážŸáž¶ážŸáŸ’ážáŸ’ážš Retail',
      'genesis.instColTitle': 'áž§ážáŸ’ážáž˜áž—áž¶áž–áž“áŸƒ SMC Genesis áž€áž˜áŸ’ážšáž·ážážŸáŸ’ážáž¶áž”áŸáž“',
      'genesis.shiftR1': 'áž‡áž½áž‰ážŠáž¼ážšážáž¶áž˜ážŸáž¼áž…áž“áž¶áž€ážšáž™ážºážáž™áŸ‰áž¶ážœ (RSI, MACD) ážŠáŸ‚áž›áž”áŸ’ážšážáž·áž€áž˜áŸ’áž˜áž€áŸ’ážšáŸ„áž™áž–áŸáž›ážáž˜áŸ’áž›áŸƒážŠáž¾ážšážšáž½áž…áž áž¾áž™áŸ”',
      'genesis.shiftI1': 'ážœáž·áž—áž¶áž‚áž™áž“áŸ’ážáž€áž¶ážšáž…áŸ‚áž€áž…áž¶áž™ážáž˜áŸ’áž›áŸƒáž’áž“áž¶áž‚áž¶ážš (IPDA) áž“áž·áž„ážœážŠáŸ’áž Time & Price ážšáž”ážŸáŸ‹ážŸáŸ’ážáž¶áž”áŸáž“áŸ”',
      'genesis.shiftR2': 'áž‘áž·áž‰ážáž¶áž˜ Breakout áž›áž¾ Resistance áž áž¾áž™áž€áŸ’áž›áž¶áž™áž‡áž¶ Liquidity áž±áŸ’áž™ážŸáŸ’ážáž¶áž”áŸáž“áž›áž€áŸ‹áž…áž»áŸ‡áž˜áž€ážœáž·áž‰áŸ”',
      'genesis.shiftI2': 'ážšáž„áŸ‹áž…áž¶áŸ†áž€áž¶ážšáž”áŸ„ážŸážŸáž˜áŸ’áž¢áž¶áž BSL ážšáž½áž…áž…áž¼áž›áž‘áž·áž‰-áž›áž€áŸ‹áž›áž¾áž€áž¶ážšáž•áŸ’áž›áž¶ážŸáŸ‹áž”áŸ’ážáž¼ážšážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’ áž“áž·áž„ Displacement ZoneáŸ”',
      'genesis.shiftR3': 'ážŸáž˜áž¶áž˜áž¶ážáŸ’ážš R:R áž‘áž¶áž” 1:1 áž¬ 1:1.5 ážŠáŸ‚áž›áž‘áž¶áž˜áž‘áž¶ážš Win-rate ážáŸ’áž–ážŸáŸ‹áž›áž¾ážŸ 70% ážŠáž¾áž˜áŸ’áž”áž¸ážšážŸáŸ‹áŸ”',
      'genesis.shiftI3': 'ážŸáž˜áž¶áž˜áž¶ážáŸ’ážš Asymmetric 1:3+ ážŠáž›áŸ‹ 1:10+ ážŠáŸ‚áž›áž‚áŸ’ážšáž¶áž“áŸ‹ážáŸ‚ Win-rate 40% áž€áŸáž”áž„áŸ’áž€áž¾ážáž”áŸ’ážšáž¶áž€áŸ‹áž…áŸ†ážŽáŸáž‰áž‡áž¶áž”áŸ’ážšáž–áŸáž“áŸ’áž’áž”áž¶áž“áŸ”',
      'genesis.shiftR4': 'áž€áž¶ážšáž‡áž½áž‰ážŠáž¼ážšážáž¶áž˜áž¢áž¶ážšáž˜áŸ’áž˜ážŽáŸážáž¹áž„ážŸáž„ážŸáž¹áž€ áž–áž„áŸ’ážšáž¸áž€ Stop-loss áž“áž·áž„áž‘ážŸáŸ’ážŸáž“áŸáž‘áž¶áž™áž…áŸ†ážŽáž»áž…áž€áŸ†áž–áž¼áž›-áž”áž¶ážážŠáŸ„áž™áž‚áŸ’áž˜áž¶áž“áž˜áž¼áž›ážŠáŸ’áž‹áž¶áž“áŸ”',
      'genesis.shiftI4': 'áž…áŸ†ážŽáž»áž…áž€áŸ†ážŽážáŸ‹ážáž¶ážáž…áŸ’áž”áž¶ážŸáŸ‹áž›áž¶ážŸáŸ‹ áž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž áž¶áž“áž·áž—áŸáž™áž‘áž»áž€áž‡áž¶áž˜áž»áž“ áž“áž·áž„áž‘áž˜áŸ’áž›áž¶áž”áŸ‹áž‡áž½áž‰ážŠáž¼ážšáž”áŸ’ážšáž€áž”ážŠáŸ„áž™ážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’áŸ”',

      // Timeframe Execution Matrix
      'genesis.matrixBadge': 'áž€áž¶ážšážáž˜áŸ’ážšáž¹áž˜áž–áž áž»áž€áž¶áž›ážœáŸáž›áž¶',
      'genesis.matrixTitle': 'áž˜áŸ‰áž¶áž‘áŸ’ážšáž¸ážŸáž”áŸ’ážšážáž·áž”ážáŸ’ážáž·áž€áž¶ážšáŸ– áž–áž¸áž€áž¶áž›ážœáŸáž›áž¶áž’áŸ† HTF áž‘áŸ…áž€áž¶áž›ážœáŸáž›áž¶ážáž¼áž… LTF',
      'genesis.matrixSub': 'ážšáž”áŸ€áž”ážŠáŸ‚áž›áž‘áž»áž“ážŸáŸ’ážáž¶áž”áŸáž“áž•áŸ’áž‘áŸážšáž‘áž·áž“áŸ’áž“áž“áŸáž™áž†áŸ’áž›áž„áž€áž¶áž›ážœáŸáž›áž¶ ážŠáž¾áž˜áŸ’áž”áž¸áž‡áž˜áŸ’ážšáž»áŸ‡áž€áž¶ážšážšáŸ†ážáž¶áž“áž”áŸ‚áž” Retail áž“áž·áž„ážŸáž˜áŸ’ážšáž·ážážŸáž˜áŸ’ážšáž¶áŸ†áž„áž…áŸ†ážŽáž»áž…áž…áž¼áž›ážŠáŸážšáž¹áž„áž˜áž¶áŸ†áŸ”',
      'genesis.matrixHtfTier': 'HTF (H4 / D1)',
      'genesis.matrixHtfRole': 'áž‘áž·ážŸážŠáŸ…áž˜áŸ‰áž¶áž€áŸ’ážšáž¼ & Major BOS',
      'genesis.matrixHtfDesc': 'áž€áŸ†ážŽážáŸ‹áž‘áž·ážŸážŠáŸ…áž›áŸ†áž áž¼ážšáž‘áž»áž“áž’áŸ† áž“áž·áž„áž”áž„áŸ’áž€áž¾ážážáŸ†áž”áž“áŸ‹ Extremes áž€áž˜áŸ’ážšáž·ážáž˜áŸ‰áž¶áž€áŸ’ážšáž¼ážŠáŸ‚áž›áž˜áž¶áž“ážŸáž»ážœážáŸ’ážáž·áž—áž¶áž–ážáŸ’áž–ážŸáŸ‹áŸ”',
      'genesis.matrixMtfTier': 'MTF (M15 / H1)',
      'genesis.matrixMtfRole': 'ážáŸ†áž”áž“áŸ‹ S&D & áž…áž›áž“áž¶áž‘áž¶áž‰ážáž™ IBOS',
      'genesis.matrixMtfDesc': 'ážŸáŸ’ážšáž„áŸ‹ážáŸ†áž”áž“áŸ‹ážŸáŸ’áž“áž¶áž˜áž‡áž¾áž„ážŸáŸ’ážáž¶áž”áŸáž“ áž“áž·áž„áž…áŸ’ážšáŸ„áŸ‡áž™áž€ážšáž›áž€áž‘áž¶áž‰ážáž™ážáž¶áž„áž€áŸ’áž“áž»áž„ ážŠáž¾áž˜áŸ’áž”áž¸áž…áž¶áž”áŸ‹áž…áŸ†ážŽáž»áž…áž”áŸ’ážáž¼ážšáž‘áž·ážŸážŠáŸ…áž–áž·ážáž”áŸ’ážšáž¶áž€ážŠáŸ”',
      'genesis.matrixLtfTier': 'LTF (M1 / M3)',
      'genesis.matrixLtfRole': 'áž…áŸ†ážŽáž»áž…áž€áŸáŸ‡áž…áž¼áž› Order & SL ážáž¼áž… (RR â‰¥ 1:3)',
      'genesis.matrixLtfDesc': 'áž”áž‰áŸ’áž‡áž¶áž€áŸ‹áž€áž¶ážšáž•áŸ’áž›áž¶ážŸáŸ‹áž”áŸ’ážáž¼ážšážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’ážáž¼áž…áž”áŸ†áž•áž»áž áž•áŸ’ážŠáž›áŸ‹áž…áŸ†ážŽáž»áž…áž…áž¼áž›áž…áŸ’áž”áž¶ážŸáŸ‹áž›áž¶ážŸáŸ‹áž‡áž¶áž˜áž½áž™ Invalidation ážáž¼áž… áž“áž·áž„ážŸáž˜áž¶áž˜áž¶ážáŸ’ážš RR ážáŸ’áž–ážŸáŸ‹áŸ”',

      // Flagship Topics & Pillars
      'genesis.curriculumBadge': 'áž”áŸ’ážšáž’áž¶áž“áž”áž‘áž”ážŽáŸ’ážáž»áŸ‡áž”ážŽáŸ’ážáž¶áž›áž€áž˜áŸ’ážšáž·ážážŸáŸ’ážáž¶áž”áŸáž“',
      'genesis.curriculumTitle': 'áž¢áŸ’ážœáž¸ážŠáŸ‚áž›áž™áž¾áž„áž”áž„áŸ’ážšáŸ€áž“áŸ– áž˜áŸážšáŸ€áž“ážœáž‚áŸ’áž‚ážŸáž·áž€áŸ’ážŸáž¶ážŸáŸ’áž“áž¼áž› & ážŸážŸážšážŸáŸ’ážáž˜áŸ’áž—ážŸáŸ’ážáž¶áž”áŸáž“',
      'genesis.curriculumSub': 'áž€áž¶ážšážŽáŸ‚áž“áž¶áŸ†áž›áž˜áŸ’áž¢áž·ážáž¢áŸ†áž–áž¸áž”áŸ’ážšáž’áž¶áž“áž”áž‘áž‚áŸ’ážšáž¹áŸ‡ážŠáŸ‚áž›áž“áž¹áž„ážáŸ’ážšáž¼ážœáž”áž„áŸ’ážšáŸ€áž“áž“áŸ…áž€áŸ’áž“áž»áž„ SMC GenesisáŸ” ážšáŸ€áž”áž…áŸ†áž¡áž¾áž„ážŠáž¾áž˜áŸ’áž”áž¸áž”áŸ†áž–áž¶áž€áŸ‹áž”áŸ†áž”áŸ‰áž“ Trader áž“áž¼ážœáž€áž¶ážšáž™áž›áŸ‹ážŠáž¹áž„áž–áž¸áž€áŸ’áž”áž½áž“ážŠáŸ„áŸ‡ážŸáŸ’ážšáž¶áž™áž‘áž¸áž•áŸ’ážŸáž¶ážš ážŠáž¾áž˜áŸ’áž”áž¸ážŠáž¾ážšáž‘áž“áŸ’áž‘áž¹áž˜áž‚áŸ’áž“áž¶áž‡áž¶áž˜áž½áž™ Smart MoneyáŸ”',
      'genesis.m1Num': 'áž”áŸ’ážšáž’áž¶áž“áž”áž‘ áŸ áŸ¡',
      'genesis.m1Title': 'ážŸáŸ’ážáž¶áž”ážáŸ’áž™áž€áž˜áŸ’áž˜ážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’áž‘áž¸áž•áŸ’ážŸáž¶ážš (BOS, IBOS, FTS)',
      'genesis.m1Desc': 'ážŸáŸ’ážœáŸ‚áž„áž™áž›áŸ‹áž–áž¸áž…áž›áž“áž¶ážáž˜áŸ’áž›áŸƒážŠáŸ‚áž›áž€áž¾ážáž¡áž¾áž„ážáž¶áž˜ážœážŠáŸ’áž Supply & Demand ážŠáŸ„áž™áž”áŸ‚áž„áž…áŸ‚áž€ážŠáž¶áž…áŸ‹ážšážœáž¶áž„ Major Trend Continuation (BOS), áž€áž¶ážšáž‘áž¶áž‰ážáž™ (IBOS) áž“áž·áž„ Fractal Structural Shift (FTS)áŸ”',
      'genesis.m2Num': 'áž”áŸ’ážšáž’áž¶áž“áž”áž‘ áŸ áŸ¢',
      'genesis.m2Title': 'áž‘áŸ†áž“áž¶áž€áŸ‹áž‘áŸ†áž“áž„áž–áž áž»áž€áž¶áž›ážœáŸáž›áž¶ & áž™áž“áŸ’ážáž€áž¶ážšáž•áŸ’áž‘áŸážšáž‘áž·áž“áŸ’áž“áž“áŸáž™',
      'genesis.m2Desc': 'áž‘áŸ’ážšáž¹ážŸáŸ’ážáž¸áž“áŸƒáž€áž¶ážšáž•áŸ’áž‘áŸážšáž‘áž·áž“áŸ’áž“áž“áŸáž™áž–áž¸ HTF áž˜áž€ MTF áž“áž·áž„ LTFáŸ– ážšáž”áŸ€áž”ážŠáŸ‚áž›ážšáž›áž€ Pullback ážšáž”ážŸáŸ‹áž€áž¶áž›ážœáŸáž›áž¶áž’áŸ†ážáŸ’ážšáž¼ážœáž”áž¶áž“áž…áŸ’ážšáŸ„áŸ‡áž›áž¾áž€áž¶áž›ážœáŸáž›áž¶ážáž¼áž… ážŠáž¾áž˜áŸ’áž”áž¸áž…áž¶áž”áŸ‹áž…áŸ†ážŽáž»áž…áž…áž¼áž›ážŠáŸ‚áž›áž˜áž¶áž“áž•áž›áž’áŸ€áž”ážáŸ’áž–ážŸáŸ‹áž”áŸ†áž•áž»ážáŸ”',
      'genesis.m3Num': 'áž”áŸ’ážšáž’áž¶áž“áž”áž‘ áŸ áŸ£',
      'genesis.m3Title': 'áž‚áŸ†ážšáž¼áž‘áž¶áŸ†áž„ áŸ¤ áž“áŸƒáž€áž¶ážšáž€áŸ†ážŽážáŸ‹ážáŸ†áž”áž“áŸ‹áž•áŸ’áž‚ážáŸ‹áž•áŸ’áž‚áž„áŸ‹ áž“áž·áž„ážáž˜áŸ’ážšáž¼ážœáž€áž¶ážš',
      'genesis.m3Desc': 'áž€áž¶ážšážŸáŸ’ážšáž„áŸ‹ážŸáŸ’áž“áž¶áž˜áž‡áž¾áž„ážŸáŸ’ážáž¶áž”áŸáž“áž–áž·ážáž”áŸ’ážšáž¶áž€ážŠáŸ– Range-Based S&D (áž…áž„áŸ’áž€áŸ„áž˜áž‘áž¶áž“), Pivot S&D (áž‚áž¼áž‘áž¶áž“ Pivot), Single-Candle Extreme Order Blocks, áž“áž·áž„ Fractal Wick S&DáŸ”',
      'genesis.m4Num': 'áž”áŸ’ážšáž’áž¶áž“áž”áž‘ áŸ áŸ¤',
      'genesis.m4Title': 'ážœážŠáŸ’ážáž“áŸƒáž€áž¶ážšáž”áž„áŸ’áž€áž¾ážážáŸ†áž”áž“áŸ‹ & áž™áž“áŸ’ážáž€áž¶ážš Mitigation',
      'genesis.m4Desc': 'ážŠáŸ†ážŽáž¶áž€áŸ‹áž€áž¶áž›áž‘áž¶áŸ†áž„ áŸ£ áž“áŸƒážáŸ†áž”áž“áŸ‹ážŸáŸ’ážáž¶áž”áŸáž“áŸ– Zone Creation, Continuation Model, áž“áž·áž„ Reversal Shift áž–áŸ’ážšáž˜áž‘áž¶áŸ†áž„áž™áž“áŸ’ážáž€áž¶ážšážáŸ’ážšáž¡áž”áŸ‹áž˜áž€áž€áž¶ážáŸ‹áž”áž“áŸ’ážáž™áž”áž“áŸ’áž‘áž»áž€ (Mitigation) áž˜áž»áž“áž–áŸáž›áž”áž“áŸ’ážážŠáŸ†ážŽáž¾ážšáŸ”',
      'genesis.m5Num': 'áž”áŸ’ážšáž’áž¶áž“áž”áž‘ áŸ áŸ¥',
      'genesis.m5Title': 'áž€áž¶áž™ážœáž·áž—áž¶áž‚ážœáž·áž‘áŸ’áž™áž¶áž“áŸƒážŸáž¶áž…áŸ‹áž”áŸ’ážšáž¶áž€áŸ‹áž¢áž“áŸ’áž‘áž¶áž€áŸ‹ & áž¢áž“áŸ’áž‘áž¶áž€áŸ‹áž‘áž¶áŸ†áž„ áŸ¥',
      'genesis.m5Desc': 'ážšáž”áŸ€áž”ážŠáŸ‚áž›áž€áŸ’áž”áž½áž“ážŠáŸ„áŸ‡ážŸáŸ’ážšáž¶áž™áž‘áž¶áž€áŸ‹áž‘áž¶áž‰ RetailáŸ– Swing High/Low Stop-hunts, Equal High/Low ($$$) magnets, áž¢áž“áŸ’áž‘áž¶áž€áŸ‹ Trendline, Range Sweeps áž“áž·áž„áž€áž¶ážšáž•áŸ’áž‘áŸážšáž”áž“áŸ’áž‘áž»áž€ Load TransferáŸ”',
      'genesis.m6Num': 'áž”áŸ’ážšáž’áž¶áž“áž”áž‘ áŸ áŸ¦',
      'genesis.m6Title': 'ážšáž¼áž”áž˜áž“áŸ’ážáž…áž¼áž›áž•áŸ’ážŸáž¶ážšážáž¶áž˜ Scenario & áž‚ážŽáž·ážážœáž·áž‘áŸ’áž™áž¶ Asymmetric',
      'genesis.m6Desc': 'áž€áž¶ážšáž…áž¼áž› Trade ážáž¶áž˜ Scenario áž‡áž¶áž€áŸ‹áž›áž¶áž€áŸ‹áŸ– Counter-Trend Exhaustion, Structure Refinement Pro-Trend áž“áž·áž„ Instant Momentum Breakout áž‡áž¶áž˜áž½áž™ážŸáž˜áž¶áž˜áž¶ážáŸ’ážš RR 1:3 ážŠáž›áŸ‹ 1:5+ áž¡áž¾áž„áž‘áŸ…áŸ”',

      // The Mentorship Experience & Ecosystem
      'genesis.tabPillars': 'áž”áž‘áž–áž·ážŸáŸ„áž’áž“áŸáž“áŸƒáž€áž¶ážšáž”ážŽáŸ’ážáž»áŸ‡áž”ážŽáŸ’ážáž¶áž›',
      'genesis.tabLiquidity': 'áŸ¡. áž€áž¶ážšážŽáŸ‚áž“áž¶áŸ†áž•áŸ’áž‘áž¶áž›áŸ‹',
      'genesis.tabCommunity': 'áŸ¢. Telegram ážŸáž áž‚áž˜áž“áŸ',
      'genesis.tabOB': 'áŸ£. ážœáž‚áŸ’áž‚ážœáž·áž—áž¶áž‚áž€áŸ’ážšáž¶áž áŸ’ážœáž·áž€áž•áŸ’áž‘áž¶áž›áŸ‹',
      'genesis.tabRisk': 'áŸ¤. áž™áž»áž‘áŸ’áž’ážŸáž¶ážŸáŸ’ážáŸ’ážšáž‘áž»áž“ Asymmetric',
      'genesis.tabLqHeading': 'áž€áž¶ážšáž–áž·áž‚áŸ’ážšáŸ„áŸ‡áž™áŸ„áž”áž›áŸ‹áž•áŸ’áž‘áž¶áž›áŸ‹ & áž€áž¶ážšáž–áž·áž“áž·ážáŸ’áž™áž•áŸ’áž‘áŸ€áž„áž•áŸ’áž‘áž¶ážáŸ‹ Setup áž‡áž¶áž˜áž½áž™ BlueX',
      'genesis.tabLqText': 'Trader áž˜áŸ’áž“áž¶áž€áŸ‹áŸ—ážŸáž»áž‘áŸ’áž’ážáŸ‚áž˜áž¶áž“áž…áŸ†ážŽáž»áž…ážáŸ’áž›áž¶áŸ†áž„ áž“áž·áž„áž§áž”ážŸáž‚áŸ’áž‚áž•áŸ’áž›áž¼ážœáž…áž·ážáŸ’ážážšáŸ€áž„áŸ—ážáŸ’áž›áž½áž“áŸ” áž“áŸ…áž€áŸ’áž“áž»áž„ SMC Genesis áž¢áŸ’áž“áž€áž“áž¹áž„áž‘áž‘áž½áž›áž”áž¶áž“áž€áž¶ážšáž•áŸ’ážáž›áŸ‹áž˜ážáž·áž™áŸ„áž”áž›áŸ‹áž•áŸ’áž‘áž¶áž›áŸ‹áž–áž¸ BlueX ážáž¶áž˜ážšáž™áŸˆ Telegram DM (@Le_Bluue)áŸ” áž¢áŸ’áž“áž€áž¢áž¶áž…áž•áŸ’áž‰áž¾ Chart áž“áž·áž„áž€áŸ†ážŽážáŸ‹ážáŸ’ážšáž¶ Trade áž˜áž€áž–áž·áž“áž·ážáŸ’áž™ážŠáŸ„áž™áž•áŸ’áž‘áž¶áž›áŸ‹ážŠáž¾áž˜áŸ’áž”áž¸áž€áŸ‚ážáž˜áŸ’ážšáž¼ážœáž±áŸ’áž™ážáŸ’ážšáž¼ážœáž€áž˜áŸ’ážšáž·ážážŸáŸ’ážáž¶áž”áŸáž“áŸ”',
      'genesis.tabLqRule': 'áž‘áŸ†áž“áž¶áž€áŸ‹áž‘áŸ†áž“áž„ážáŸáž¡áŸáž€áŸ’ážšáž¶áž˜áž•áŸ’áž‘áž¶áž›áŸ‹áŸ– áž•áŸ’áž‰áž¾ážŸáž¶ážšáž‘áŸ…áž€áž¶áž“áŸ‹ @Le_Bluue áž›áž¾ Telegram ážŸáž˜áŸ’ážšáž¶áž”áŸ‹áž–áŸážáŸŒáž˜áž¶áž“ážœáž‚áŸ’áž‚ážŸáž·áž€áŸ’ážŸáž¶ ážŸáŸ†ážŽáž½ážš áž“áž·áž„áž€áž¶ážšáž–áž·áž‚áŸ’ážšáŸ„áŸ‡áž™áŸ„áž”áž›áŸ‹áŸ”',
      'genesis.tabCommunityHeading': 'ážŸáž áž‚áž˜áž“áŸ Trader áž•áŸ’áž›áž¼ážœáž€áž¶ážšážšáž”ážŸáŸ‹ BlueX (t.me/moonbluefx)',
      'genesis.tabCommunityText': 'ážšáž½áž˜ážšážŸáŸ‹áž‡áž¶áž˜áž½áž™ážŸáž áž‚áž˜áž“áŸ Trader ážŠáŸ‚áž›áž˜áž¶áž“ážœáž·áž“áŸáž™ážáŸ’áž–ážŸáŸ‹ áž“áž·áž„áž“áž·áž™áž¶áž™áž—áž¶ážŸáž¶ážŸáŸ’ážáž¶áž”áŸáž“ážŠáž¼áž…áž‚áŸ’áž“áž¶áŸ” áž€áŸ’ážšáž»áž˜ Telegram ážŸáž áž‚áž˜áž“áŸáž•áŸ’áž›áž¼ážœáž€áž¶ážš (t.me/moonbluefx) áž•áŸ’ážáž›áŸ‹áž“áž¼ážœáž€áž¶ážšážœáž·áž—áž¶áž‚áž‘áž¸áž•áŸ’ážŸáž¶ážšáž”áŸ’ážšáž…áž¶áŸ†ážáŸ’áž„áŸƒ ážáŸ†áž”áž“áŸ‹ážŸáŸ†ážáž¶áž“áŸ‹áŸ— áž“áž·áž„áž€áž¶ážšáž–áž·áž—áž¶áž€áŸ’ážŸáž¶ážŸáŸ’ážáž¶áž”áž“áž¶ážŠáŸ‚áž›áž•áŸ’ážáŸ„ážáž›áž¾áž€áž¶ážšáž€áž¶ážšáž–áž¶ážšážŠáž¾áž˜áž‘áž»áž“áž‡áž¶áž…áž˜áŸ’áž”áž„áŸ”',
      'genesis.tabCommunityRule': 'áž…áŸ†ážŽáž»áž…áž–áž·ážŸáŸážŸážŸáž áž‚áž˜áž“áŸáŸ– áž”áž¾áž€áž‘áž¼áž›áž¶áž™ážŸáž˜áŸ’ážšáž¶áž”áŸ‹áž–áž¶ážŽáž·áž‡áŸ’áž‡áž€ážšážŠáŸ‚áž›áž˜áž¶áž“áž€áž¶ážšáž”áŸ’ážáŸáž‡áŸ’áž‰áž¶áž…áž·ážáŸ’áž ážŠáž¾áž˜áŸ’áž”áž¸ážŸáž·áž€áŸ’ážŸáž¶áž›áŸ†áž áž¼ážšáž‘áž»áž“ážŸáŸ’ážáž¶áž”áŸáž“ážšáž½áž˜áž‚áŸ’áž“áž¶áž‡áž¶áž˜áž½áž™ BlueX áž“áž·áž„ážŸáž˜áž¶áž‡áž·áž€ážŠáž‘áŸƒáž‘áŸ€ážáŸ”',
      'genesis.tabObHeading': 'áž€áž¶ážšáž”áž„áŸ’ážšáŸ€áž“áž•áŸ’áž‘áž¶áž›áŸ‹ážáž¶áž˜ážšáž™áŸˆáž€áž¶ážšáž…áŸ‚áž€ážšáŸ†áž›áŸ‚áž€áž¢áŸáž€áŸ’ážšáž„áŸ‹ Real-Time',
      'genesis.tabObText': 'áž‘áŸ’ážšáž¹ážŸáŸ’ážáž¸ážŠáŸ‚áž›áž‚áŸ’áž˜áž¶áž“áž€áž¶ážšáž¢áž“áž»ážœážáŸ’ážáž‚ážºáž‚áŸ’áž˜áž¶áž“áž”áŸ’ážšáž™áŸ„áž‡áž“áŸáž¡áž¾áž™áŸ” áž™áž¾áž„ážáž—áŸ’áž‡áž¶áž”áŸ‹áž…áž“áŸ’áž›áŸ„áŸ‡áž“áŸáŸ‡ážáž¶áž˜ážšáž™áŸˆáž€áž¶ážšáž”áž„áŸ’ážšáŸ€áž“áž•áŸ’áž‘áž¶áž›áŸ‹ Live Screen-Sharing ážŠáŸ‚áž›ážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’áž‘áž¸áž•áŸ’ážŸáž¶ážš áž“áž·áž„ Liquidity ážáŸ’ážšáž¼ážœáž”áž¶áž“ážœáž·áž—áž¶áž‚áž•áŸ’áž‘áž¶áž›áŸ‹áž›áž¾áž‘áž¸áž•áŸ’ážŸáž¶ážšáž–áž·ážáŸ” áž‘áž‘áž½áž›áž™áž€áž”áž‘áž–áž·ážŸáŸ„áž’áž“áŸáž•áŸ’áž‘áž¶áž›áŸ‹áž–áž¸ážšáž”áŸ€áž”ážŠáŸ‚áž›ážŸáŸ’ážáž¶áž”áŸáž“áž˜áž¾áž›ážƒáž¾áž‰áž‘áž¸áž•áŸ’ážŸáž¶ážšáŸ”',
      'genesis.tabObRule': 'áž€áž¶ážšáž…áŸ‚áž€ážšáŸ†áž›áŸ‚áž€áž”áž‘áž–áž·ážŸáŸ„áž’áž“áŸáž•áŸ’áž‘áž¶áž›áŸ‹áŸ– áž‚áŸ’áž˜áž¶áž“áž€áž¶ážšáž‘ážŸáŸ’ážŸáž“áŸáž‘áž¶áž™áž€áž¶ážáŸ‹áž€áŸ’ážšáŸ„áž™áŸ” áž€áŸ’ážšáž¶áž áŸ’ážœáž·áž€áž–áž·áž ážŸáž“áŸ’áž‘áž“áž¸áž™áž—áž¶áž–áž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„ áž“áž·áž„áž€áž¶ážšáž”áŸ’ážšážáž·áž”ážáŸ’ážáž·áž‡áž¶áž”áŸ’ážšáž–áŸáž“áŸ’áž’áŸ”',
      'genesis.tabRiskHeading': 'áž§ážáŸ’ážáž˜áž—áž¶áž–áž‚ážŽáž·ážážœáž·áž‘áŸ’áž™áž¶ Asymmetric & áž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž áž¶áž“áž·áž—áŸáž™',
      'genesis.tabRiskText': 'áž™áž¾áž„áž”áŸ†áž”áž¶ážáŸ‹áž‡áŸ†áž“áž¿ážáž»ážŸáž†áŸ’áž‚áž„ážŠáŸ‚áž›ážáž¶ážáŸ’ážšáž¼ážœážáŸ‚áž˜áž¶áž“ Win-rate 80% áž‘áž¾áž”áž¢áž¶áž…áž˜áž¶áž“áž”áž¶áž“áŸ” áž“áŸ…áž€áŸ’áž“áž»áž„ SMC Genesis áž¢áŸ’áž“áž€áž“áž¹áž„ážšáŸ€áž“áž–áž¸ážšáž”áŸ€áž”ážŠáŸ‚áž› Win-rate 40% ážšáž½áž˜áž•áŸ’ážŸáŸ†áž‡áž¶áž˜áž½áž™ R:R 1:3 ážŠáž›áŸ‹ 1:5+ áž”áž„áŸ’áž€áž¾ážáž€áŸ†ážŽáž¾áž“áž‘áž»áž“áž‡áž¶áž”áŸ’ážšáž–áŸáž“áŸ’áž’ ážŠáŸ„áž™áž€áŸ†ážŽážáŸ‹áž áž¶áž“áž·áž—áŸáž™ážáŸ’ážšáž¹áž˜ 0.5%â€“1.0% áž”áŸ‰áž»ážŽáŸ’ážŽáŸ„áŸ‡áž€áŸ’áž“áž»áž„áž˜áž½áž™ TradeáŸ”',
      'genesis.tabRiskRule': 'áž‘ážŸáŸ’ážŸáž“ážœáž·áž‡áŸ’áž‡áž¶áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž‘áž»áž“áŸ– ážšáž€áŸ’ážŸáž¶áž áž¶áž“áž·áž—áŸáž™ážáŸ’ážšáž¹áž˜ 0.5%â€“1.0% áž€áŸ’áž“áž»áž„áž˜áž½áž™ tradeáŸ” áž¢áž“áž»áž‰áŸ’áž‰áž¶ážáž±áŸ’áž™áž‚ážŽáž·ážážœáž·áž‘áŸ’áž™áž¶ Asymmetric áž”áž„áŸ’áž€áž¾ážáž€áŸ†ážŽáž¾áž“áž‘áž»áž“ážšáž™áŸˆáž–áŸáž›ážœáŸ‚áž„áŸ”',

      // 5-Pillar Mastery Framework
      'genesis.admissionBadge': 'ðŸŽ“ áž€áŸ’ážšáž”ážáŸážŽáŸ’ážŒáž‡áŸ†áž“áž¶áž‰ áŸ¥ ážŸážŸážšážŸáŸ’ážáž˜áŸ’áž— â€¢ áž€áž˜áŸ’áž˜ážœáž·áž’áž¸áž”ážŽáŸ’ážáž»áŸ‡áž”ážŽáŸ’ážáž¶áž›áž•áŸ’áž‘áž¶áž›áŸ‹',
      'genesis.admissionTitle': 'ážœáž‚áŸ’áž‚ážŸáž·áž€áŸ’ážŸáž¶áž‡áž¶áž˜áž½áž™ BlueXáŸ– áž•áŸ‚áž“áž‘áž¸áž“áŸƒáž€áž¶ážšážŸáž·áž€áŸ’ážŸáž¶ áŸ¥ áž‡áŸ†áž áž¶áž“',
      'genesis.admissionSub': 'áž€áž˜áŸ’áž˜ážœáž·áž’áž¸ážŸáž·áž€áŸ’ážŸáž¶áž‡áž¶áž”áŸ’ážšáž–áŸáž“áŸ’áž’ ážšáŸ€áž”áž…áŸ†áž¡áž¾áž„ážŠáž¾áž˜áŸ’áž”áž¸áž€ážŸáž¶áž„ážŸáž˜ážáŸ’ážáž—áž¶áž–áž¢áž¶áž‡áž¸áž–áž›áž¾ážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’áž‘áž¸áž•áŸ’ážŸáž¶ážš áž€áž¶ážšážŸáŸ’ážšáž„áŸ‹ážáŸ†áž”áž“áŸ‹ S&D áž¢áž“áŸ’áž‘áž¶áž€áŸ‹ Liquidity ážšáž¼áž”áž˜áž“áŸ’ážáž…áž¼áž›áž•áŸ’ážŸáž¶ážš áž“áž·áž„áž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž‘áž»áž“áŸ–',
      'genesis.std1Title': 'áž‡áŸ†áž áž¶áž“áž‘áž¸ áŸ áŸ¡áŸ– ážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’áž‘áž¸áž•áŸ’ážŸáž¶ážš (Market Structure)',
      'genesis.std1Desc': 'ážŸáŸ’áž‘áž¶ážáŸ‹áž‡áŸ†áž“áž¶áž‰áž›áž¾áž›áŸ†áž áž¼ážš Swing High/Low ážŠáŸ„áž™áž”áŸ‚áž„áž…áŸ‚áž€ážŠáž¶áž…áŸ‹ážšážœáž¶áž„ Major BOS (áž”áž“áŸ’ážáž‘áž·ážŸážŠáŸ…), IBOS (áž‘áž¶áž‰ážáž™áž€áŸ’áž“áž»áž„), áž“áž·áž„ Fractal Shift (FTS)áŸ”',
      'genesis.std1Outcome': 'áž›áž‘áŸ’áž’áž•áž›áž¢áž“áž»ážœážáŸ’ážáŸ– áž€áŸ†ážŽážáŸ‹áž›áŸ†áž áž¼ážš Swing High/Low áž“áž·áž„ Multi-Timeframe Matrix áž…áŸ’áž”áž¶ážŸáŸ‹áž›áž¶ážŸáŸ‹áŸ”',
      'genesis.std2Title': 'áž‡áŸ†áž áž¶áž“áž‘áž¸ áŸ áŸ¢áŸ– áž€áž¶ážšáž€áŸ†ážŽážáŸ‹ážáŸ†áž”áž“áŸ‹áž•áŸ’áž‚ážáŸ‹áž•áŸ’áž‚áž„áŸ‹/ážáž˜áŸ’ážšáž¼ážœáž€áž¶ážš (S&D Zones)',
      'genesis.std2Desc': 'ážŸáž·áž€áŸ’ážŸáž¶áž‚áŸ†ážšáž¼ážŸáŸ’áž“áž¶áž˜áž‡áž¾áž„ážŸáŸ’ážáž¶áž”áŸáž“áž‘áž¶áŸ†áž„ áŸ¤áŸ– Range-Based S&D, Pivot S&D, Single-Candle Extreme Order Blocks, áž“áž·áž„ Fractal Wick S&DáŸ”',
      'genesis.std2Outcome': 'áž›áž‘áŸ’áž’áž•áž›áž¢áž“áž»ážœážáŸ’ážáŸ– áž…áŸáŸ‡áž‚áž¼ážŸážœáž¶ážŸáŸ‹ážáŸ†áž”áž“áŸ‹ Range, Pivot, Single-Candle & Fractal S&D ážáŸ’ážšáž¹áž˜ážáŸ’ážšáž¼ážœáŸ”',
      'genesis.std3Title': 'áž‡áŸ†áž áž¶áž“áž‘áž¸ áŸ áŸ£áŸ– áž›áŸ†áž áž¼ážšážŸáž¶áž…áŸ‹áž”áŸ’ážšáž¶áž€áŸ‹áž¢áž“áŸ’áž‘áž¶áž€áŸ‹ (Liquidity Sweeps)',
      'genesis.std3Desc': 'ážŸáŸ’ážœáŸ‚áž„áž™áž›áŸ‹áž¢áž“áŸ’áž‘áž¶áž€áŸ‹áž‘áž¶áŸ†áž„ áŸ¥ ážšáž”ážŸáŸ‹ RetailáŸ– Swing points, Equal High/Low ($$$), Trendline traps, Range sweeps, áž“áž·áž„áž™áž“áŸ’ážáž€áž¶ážšáž•áŸ’áž‘áŸážšáž”áž“áŸ’áž‘áž»áž€ Load TransferáŸ”',
      'genesis.std3Outcome': 'áž›áž‘áŸ’áž’áž•áž›áž¢áž“áž»ážœážáŸ’ážáŸ– áž˜áž¾áž›ážƒáž¾áž‰ Stop-Hunt, Equal High/Low, Inducement áž“áž·áž„ Trendline Traps áž˜áž»áž“áž–áŸáž›áž€áž¾ážáž¡áž¾áž„áŸ”',
      'genesis.std4Title': 'áž‡áŸ†áž áž¶áž“áž‘áž¸ áŸ áŸ¤áŸ– ážšáž¼áž”áž˜áž“áŸ’ážáž…áž¼áž›áž•áŸ’ážŸáž¶ážšáž…áŸ’áž”áž¶ážŸáŸ‹áž›áž¶ážŸáŸ‹ (Execution Models)',
      'genesis.std4Desc': 'áž™áž›áŸ‹áž…áŸ’áž”áž¶ážŸáŸ‹áž–áž¸áž€áž¶ážšáž…áž¼áž› Trade ážáž¶áž˜áž€áž¶áž›áŸˆáž‘áŸážŸáŸˆáŸ– Counter-Trend Exhaustion, Structure Refinement Pro-Trend, áž“áž·áž„ Instant Momentum ExpansionáŸ”',
      'genesis.std4Outcome': 'áž›áž‘áŸ’áž’áž•áž›áž¢áž“áž»ážœážáŸ’ážáŸ– áž™áž›áŸ‹áž…áŸ’áž”áž¶ážŸáŸ‹áž–áž¸ Scenarios 1, 2, áž“áž·áž„ 3 áž€áŸ’áž“áž»áž„áž€áž¶ážšáž”áŸ’ážšážáž·áž”ážáŸ’ážáž·áž€áž¶ážš Trade Order áž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„áŸ”',
      'genesis.std5Title': 'áž‡áŸ†áž áž¶áž“áž‘áž¸ áŸ áŸ¥áŸ– áž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž áž¶áž“áž·áž—áŸáž™ (Capital Allocation)',
      'genesis.std5Desc': 'áž€áž¶ážšáž–áž¶ážšážŠáž¾áž˜áž‘áž»áž“ážáž¶áž˜áž‘áŸ†áž áŸ† Lot áž¢áž¶áž‡áž¸áž– (0.5%â€“1.0%) áž€áž¶ážšážšáŸ†áž€áž·áž› Break-Even áž“áž·áž„áž€áž¶ážšáž…áž¶áž”áŸ‹áž™áž€áž•áž›áž…áŸ†ážŽáŸáž‰ RR â‰¥ 1:3 áž¡áž¾áž„áž‘áŸ…áŸ”',
      'genesis.std5Outcome': 'áž›áž‘áŸ’áž’áž•áž›áž¢áž“áž»ážœážáŸ’ážáŸ– áž€áž¶ážšáž–áž¶ážšážŠáž¾áž˜áž‘áž»áž“ážáž¶áž˜ážšáž¼áž”áž˜áž“áŸ’áž Risk-to-Reward (RR â‰¥ 1:3 áž¡áž¾áž„áž‘áŸ…)áŸ”',
      'genesis.quoteText': '"áž‡áŸ„áž‚áž‡áŸáž™áž€áŸ’áž“áž»áž„áž€áž¶ážšáž‡áž½áž‰ážŠáž¼ážš áž˜áž·áž“áž˜áŸ‚áž“áž€áž¾ážáž¡áž¾áž„ážŠáŸ„áž™ážŸáž¶ážšáž¢áŸ’áž“áž€áž˜áž·áž“ážŠáŸ‚áž›ážáž¶ážáž“áŸ„áŸ‡áž‘áŸ áž”áŸ‰áž»áž“áŸ’ážáŸ‚ áž€áž¾ážáž…áŸáž‰áž–áž¸áž€áž¶ážšážšáž€áŸ’ážŸáž¶ážœáž·áž“áŸáž™ áž“áž·áž„áž€áž¶ážšáž€áž¶ážšáž–áž¶ážšážŠáž¾áž˜áž‘áž»áž“ážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€áž±áŸ’áž™áž”áž¶áž“áž›áŸ’áž¢áž”áŸ†áž•áž»ážáŸ”"',
      'genesis.quoteAuthor': 'â€” áž”áŸ’áž›áž„áŸ‹áž˜áŸážŸáŸ’ážáž¶áž”áŸáž“ SMC Genesis â€¢ BlueX',
      'genesis.applyTelegramBtn': 'áž•áŸ’áž‰áž¾ážŸáž¶ážšáž•áŸ’áž‘áž¶áž›áŸ‹áž‘áŸ…áž€áž¶áž“áŸ‹ BlueX áž›áž¾ Telegram (DM: @Le_Bluue)',
      'genesis.communityTelegramBtn': 'áž…áž¼áž›ážšáž½áž˜áž€áŸ’ážšáž»áž˜ážŸáž áž‚áž˜áž“áŸáž•áŸ’áž›áž¼ážœáž€áž¶ážš (t.me/moonbluefx)',
      'genesis.announcementBadge': '🔥 បើកទទួលសិស្សថ្មី',
      'genesis.announcementText': 'វគ្គបណ្តុះបណ្តាល SMC Genesis — រៀនជួញដូរមាស (XAU/USD) មួយទល់មួយ និងការវិភាគផ្ទាល់',
      'genesis.announcementBtn': 'ចុះឈ្មោះតាម Telegram →',
      'genesis.spotlightBadge': '🎯 វគ្គបណ្តុះបណ្តាលផ្ទាល់មួយទល់មួយ',
      'genesis.spotlightTitle': 'រៀនផ្ទាល់ជាមួយ BlueX៖ វគ្គបណ្តុះបណ្តាលស្ថាប័ន SMC Genesis',
      'genesis.spotlightSub': 'យើងលុបបំបាត់ការភ័ន្តច្រឡំបែប Retail ដើម្បីបង្រៀនអ្នកនូវច្បាប់ជួញដូរស្ថាប័នដ៏សុក្រឹតបំផុត។ ទទួលបានទំនុកចិត្ត វិន័យ និងទម្លាប់ជួញដូររបស់ Trader អាជីព។',
      'genesis.spotlightStatus': '● បើកទទួលការចុះឈ្មោះ • ចំនួនកំណត់',
      'genesis.spotlightPerk1Title': 'ការបង្រៀនផ្ទាល់មួយទល់មួយ',
      'genesis.spotlightPerk1Desc': 'ទាក់ទងផ្ទាល់ជាមួយគ្រូបង្រៀន លីម៉េង (@Le_Bluue) ដើម្បីត្រួតពិនិត្យក្រាហ្វិក កែតម្រូវ Setup និងពង្រឹងផ្នត់គំនិត។',
      'genesis.spotlightPerk2Title': 'ក្បួនជួញដូរច្បាស់លាស់ ១០០%',
      'genesis.spotlightPerk2Desc': 'គ្មានការស្មានដោយអារម្មណ៍។ ច្បាប់ Body-Close BOS, ការទាញយកតំបន់ S&D ៤ ប្រភេទ និងរូបមន្តចូលផ្សារ ៣ Scenarios។',
      'genesis.spotlightPerk3Title': 'ការបង្រៀនលើផ្សារជាក់ស្តែង',
      'genesis.spotlightPerk3Desc': 'វិភាគរចនាសម្ព័ន្ធមាស (XAU/USD) ផ្ទាល់មុនពេលផ្សារបើក។ មើលឃើញរបៀបកំណត់តំបន់ស្ថាប័នក្នុងពេលជាក់ស្តែង។',
      'genesis.spotlightPerk4Title': 'សហគមន៍សិស្សផ្តាច់មុខ',
      'genesis.spotlightPerk4Desc': 'សិទ្ធិចូលរួមសហគមន៍ផ្ទាល់ (t.me/moonbluefx) មួយជីវិត ដើម្បីទទួលការវិភាគប្រចាំថ្ងៃ និងពិភាក្សាជាមួយសមាជិកដទៃ។',
      'genesis.spotlightActionTitle': 'តើអ្នកត្រៀមខ្លួនរួចរាល់ហើយឬនៅ?',
      'genesis.spotlightActionDesc': 'ចំនួនសិស្សមានកំណត់ក្នុងមួយវគ្គ ដើម្បីធានាគុណភាពបង្រៀន និងការកែតម្រូវផ្ទាល់។',
      'genesis.spotlightActionBtn': '⚡ ផ្ញើសារចុះឈ្មោះជាមួយ @Le_Bluue តាម Telegram',
      'genesis.floatingCta': '⚡ ចុះឈ្មោះរៀន • DM @Le_Bluue',

      // Institutional Brokers for SMC
      'genesis.brokerBadge': 'ល្បឿនប្រតិបត្តិការ & សាច់ប្រាក់ Raw Liquidity',
      'genesis.brokerTitle': 'Broker ណែនាំសម្រាប់ជួញដូរតាមវិធីសាស្ត្រ SMC',
      'genesis.brokerDesc': 'ការជួញដូរតាម SMC ទាមទារល្បឿនលឿនបំផុត Spreads ទាបបំផុត សាច់ប្រាក់ជ្រៅ និងគ្មាន Slippage សិប្បនិម្មិត។ យើងសូមណែនាំដៃគូដែលមានអាជ្ញាប័ណ្ណលំដាប់កំពូលដូចខាងក្រោម:',
      'genesis.brokerTrenoNote': 'ដៃគូកំពូល • Raw Spreads • ល្បឿនលឿនបំផុត',
      'genesis.brokerGtcNote': 'អាជ្ញាប័ណ្ណសកលច្រើន • សាច់ប្រាក់កម្រិតស្ថាប័ន',
      'genesis.brokerLirunexNote': 'Broker STP មានអាជ្ញាប័ណ្ណ • សាច់ប្រាក់ Forex & មាសជ្រៅ',

      // FAQ
      'genesis.faqBadge': 'សំណួរដែលសួរញឹកញាប់',
      'genesis.faqTitle': 'អ្វីៗទាំងអស់ដែលអ្នកត្រូវដឹងអំពី SMC Genesis',
      'genesis.faq1Q': 'តើអ្វីដែលធ្វើឱ្យ SMC Genesis ខុសប្លែកទាំងស្រុងពីការវិភាគបច្ចេកទេសទូទៅ?',
      'genesis.faq1A': 'ការវិភាគបែប Retail ពឹងផ្អែកលើ Indicator យឺតយ៉ាវ (RSI, Moving Averages) និង Trendline ដែលក្បួនដោះស្រាយធនាគារកណ្តាលតែងតែរុញឱ្យបុកដើម្បីយក Liquidity។ SMC Genesis បង្រៀនអ្នកពីរបៀបដែល Interbank Price Delivery Algorithm (IPDA) ដំណើរការតម្លៃពិតប្រាកដ កន្លែងដែល Stop ប្រមូលផ្តុំ និងរបៀបចូល Trade ក្រោយការបោសសម្អាតរួចរាល់។',
      'genesis.faq2Q': 'តើអ្នកទើបចាប់ផ្តើមអាចរៀន SMC Genesis បានទេ ឬត្រូវការបទពិសោធន៍ពីមុន?',
      'genesis.faq2A': 'តាមពិតទៅ អ្នកទើបចាប់ផ្តើមច្រើនតែយល់បានលឿនជាង ព្រោះពួកគេមិនទាន់ជាប់ទម្លាប់ប្រើ Indicator ខុសៗជាច្រើនឆ្នាំ។ SMC Genesis ចាប់ផ្តើមពីមូលដ្ឋានគ្រឹះនៃ Liquidity ទីផ្សារ ហើយកសាងឡើងមួយជំហានម្តងៗរហូតដល់ការអនុវត្តកម្រិតខ្ពស់។',
      'genesis.faq3Q': 'តើឧបករណ៍ហិរញ្ញវត្ថុណាខ្លះដែលដំណើរការល្អបំផុតជាមួយ SMC Genesis?',
      'genesis.faq3A': 'SMC Genesis គឺជាក្របខ័ណ្ឌ Supply & Demand សកល។ វាដំណើរការយ៉ាងល្អឥតខ្ចោះលើមាស (XAUUSD), គូរូបិយប័ណ្ណសំខាន់ៗ (EURUSD, GBPUSD, USDJPY), សន្ទស្សន៍ភាគហ៊ុន (US30, NAS100) និងរូបិយប័ណ្ណឌីជីថល (BTC, ETH)។',
      'genesis.faq4Q': 'តើខ្ញុំអាចរំពឹងទទួលបានសមាមាត្រ R:R កម្រិតណាពីយុទ្ធសាស្ត្រនេះ?',
      'genesis.faq4A': 'Setup របស់ SMC ផ្តោតលើផលចំណេញ Asymmetric ចាប់ពី 1:3 ដល់ 1:10+។ ដោយសារចំណុចចូលត្រូវបានសម្រិតសម្រាំងលើ Timeframe តូចនៅតំបន់ Imbalance ច្បាស់លាស់ Stop Loss គឺតូច និងមានសុវត្ថិភាពខ្ពស់។',
      'genesis.faq5Q': 'តើខ្ញុំអាចចុះឈ្មោះចូលរៀន ឬទាក់ទងមកកាន់ BlueX ដោយផ្ទាល់ដោយរបៀបណា?',
      'genesis.faq5A': 'ដើម្បីចុះឈ្មោះចូលរៀន ឬសាកសួរព័ត៌មានផ្ទាល់ខ្លួន សូមផ្ញើសារផ្ទាល់ (DM) ទៅកាន់ Telegram របស់ BlueX: @Le_Bluue។ ហើយដើម្បីចូលរួមការពិភាក្សា និងមើលការវិភាគទីផ្សារប្រចាំថ្ងៃ សូមចូលរួមក្នុងក្រុម Telegram សហគមន៍: t.me/moonbluefx។',

      // Bottom CTA
      'genesis.ctaTitle': 'ត្រៀមខ្លួនរួចរាល់ហើយឬនៅដើម្បីឈានជើងចូលក្នុងលំហូរស្ថាប័ន?',
      'genesis.ctaSub': 'បញ្ឈប់ការផ្តល់ប្រាក់ឱ្យទីផ្សារដោយងងឹតងងល់។ ទំនាក់ទំនងផ្ទាល់ជាមួយ BlueX ឬចូលរួមក្នុងសហគមន៍ Trader របស់យើង។',

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

  let currentLang = safeGetStorage('bluex_lang', 'en');
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

    // Update calculator dynamic labels/status
    updatePairSpecs();
    calculateLotSize();

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
  const toast = document.getElementById('toastNotice');
  const toastMessage = document.getElementById('toastMessage');

  function showToast(message) {
    if (!toast) return;
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

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
  // 10. SUBTLE AMBIENT CARD SPOTLIGHT GLOW
  // ========================================================
  const cards = document.querySelectorAll('.pillar-card, .mentorship-card-main, .about-portrait-card, .capital-card-main, .calculator-card-main, .brokers-card-main, .broker-tier-box, .course-standards-box, .compliance-card, .social-direct-box, .knowledge-card-main, .lesson-card, .book-card, .genesis-module-card, .genesis-compare-col, .genesis-concept-card, .genesis-metric-card, .course-genesis-banner');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

});
