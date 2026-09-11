/* ==========================================================================
   GROWKNOW - MAIN APPLICATION & INTERACTION CONTROLLER
   Bilingual Translation Engine (English & Hindi), Light/Dark Theme,
   15-Field Portfolio Review Form, Lead Modal, Learning Deep-Dive, & FAQs
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // 1. LIGHT / DARK THEME ENGINE
  // ==========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const savedTheme = localStorage.getItem('growknow_theme');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('growknow_theme', theme);

    const moonIcon = document.querySelector('.theme-icon-moon');
    const sunIcon = document.querySelector('.theme-icon-sun');

    if (moonIcon && sunIcon) {
      if (theme === 'dark') {
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'block';
      } else {
        moonIcon.style.display = 'block';
        sunIcon.style.display = 'none';
      }
    }

    if (window.GrowKnowCalc && typeof window.GrowKnowCalc.updateTheme === 'function') {
      window.GrowKnowCalc.updateTheme();
    }
  }

  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (prefersDarkScheme.matches) {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
      showToast(current === 'dark' ? 'Light mode enabled' : 'Dark mode enabled');
    });
  }

  // ==========================================================================
  // 2. BILINGUAL TRANSLATION ENGINE (ENGLISH & NATURAL INDIAN HINDI)
  // ==========================================================================
  const translations = {
    en: {
      skip_to_content: "Skip to main content",
      bar_distributor: "Suresh Saini",
      bar_amfi: "AMFI Registered Mutual Fund Distributor (ARN: 347947)",
      bar_location: "Jaipur, Rajasthan • Serving Pan-India",
      bar_tagline: "Education • Guidance • Support",
      nav_subtag: "Mutual Fund Guidance",
      nav_home: "Home",
      nav_about: "About",
      nav_mf: "Mutual Funds",
      nav_solutions: "Solutions",
      nav_calculators: "Calculators",
      nav_learn: "Learn",
      nav_review: "Portfolio Review",
      nav_contact: "Contact",
      nav_cta: "Talk to Us",
      hero_pill: "Professional Guidance • Simple Explanations • Goal-Focused Investing",
      hero_h1_p1: "Invest With Clarity.",
      hero_h1_p2: "Grow With Purpose.",
      hero_subline: "Simple mutual fund guidance for your goals, your future and your peace of mind.",
      hero_desc: "Understand your options, plan around your goals and make informed investment decisions with professional guidance.",
      hero_cta_primary: "Start Your Investment Journey",
      hero_cta_secondary: "Explore Mutual Funds",
      trust_p1_title: "Education First",
      trust_p1_desc: "Concepts simplified without jargon",
      trust_p2_title: "Goal Orientation",
      trust_p2_desc: "Tailored to your time horizon",
      trust_p3_title: "Human Advisor",
      trust_p3_desc: "Personal relationship & ongoing review",
      advisor_distributor_title: "Mutual Fund Distributor",
      advisor_card_quote: "\"Investing is not about guessing the market—it is about staying disciplined towards what matters to your family.\"",
      advisor_loc_label: "Location:",
      advisor_loc_val: "Jaipur, Rajasthan (Serving India)",
      advisor_partner_label: "Platform Partner:",
      advisor_approach_label: "Approach:",
      advisor_approach_val: "Goal-based • Transparent • Non-Transactional",
      hero_compounding_title: "Disciplined SIP Compounding Concept",
      hero_compounding_badge: "Illustrative",
      hero_compounding_note: "Small regular monthly amounts grow over time through the discipline of compounding.",
      advisor_card_cta: "Request Direct Consultation",
      trust_kicker: "Our Core Philosophy",
      trust_heading: "Mutual Fund Investing Doesn't Have To Be Complicated.",
      trust_subtitle: "We strip away financial noise and jargon so you can build wealth with clarity, confidence, and peace of mind.",
      trust_c1_title: "Learn",
      trust_c1_desc: "Understand mutual funds in simple language. Learn the fundamentals of asset classes, risk, and returns before committing a single rupee.",
      trust_c2_title: "Plan",
      trust_c2_desc: "Connect investments with your financial goals. Whether it is retirement, a child's education, or building emergency resilience.",
      trust_c3_title: "Review",
      trust_c3_desc: "Get support to understand your existing portfolio. Identify overlap, excessive risk, or misalignments with your life timeline.",
      trust_c4_title: "Support",
      trust_c4_desc: "Get ongoing assistance when you need it. Life changes, and market cycles happen—we stay accessible for guidance every step of the journey.",
      mf_kicker: "Mutual Fund Fundamentals",
      mf_heading: "What is a Mutual Fund?",
      mf_quote: "\"A mutual fund collects money from many investors and invests that money in a portfolio of securities such as shares, bonds or other assets, depending on the fund's objective.\"",
      flow_n1_title: "Investors",
      flow_n1_desc: "Many individuals pool their hard-earned money (small or large)",
      flow_n2_title: "Mutual Fund & AMC",
      flow_n2_desc: "Managed professionally by registered Fund Managers",
      flow_n3_title: "Diversified Portfolio",
      flow_n3_desc: "Money is spread across multiple companies & sectors",
      flow_n4_title: "Underlying Securities",
      flow_n4_desc: "Shares, government bonds, corporate debentures, etc.",
      mf_step1_title: "Step 1: You Invest",
      mf_step1_desc: "You start by choosing to invest an amount (either as a monthly SIP or a lump sum) based on your comfort and goals.",
      mf_step2_title: "Step 2: Pooled Investment",
      mf_step2_desc: "Your money joins with contributions from thousands of fellow investors under a regulated Asset Management Company (AMC).",
      mf_step3_title: "Step 3: Professional Allocation",
      mf_step3_desc: "Experienced fund managers deploy the pooled capital into securities that match the fund's published mandate.",
      mf_step4_title: "Step 4: Value Tracking",
      mf_step4_desc: "Your investment value (NAV) fluctuates proportionally with the performance of the underlying holdings, passing gains back to you.",
      cat_kicker: "Broad Asset Classes",
      cat_heading: "Explore Mutual Fund Categories",
      cat_subtitle: "Understand the core categories. We do not promote specific schemes; every choice must align with your time horizon and risk tolerance.",
      cat_disclaimer: "May be suitable depending on your goals, time horizon and risk profile. Not an endorsement of any specific scheme.",
      cat_eq_badge: "Growth Oriented",
      risk_high_tag: "Higher Risk / Volatile",
      cat_eq_title: "Equity Funds",
      cat_eq_desc: "Invests predominantly in company shares listed on the stock market. Aims for capital appreciation by participating in business growth.",
      cat_profile_label: "Suitable Investor Profile:",
      cat_eq_profile: "Long-term investors willing to tolerate short-term market ups and downs.",
      cat_purpose_label: "Typical Purpose:",
      cat_eq_purpose: "Long-term wealth creation, retirement corpus, child's higher education (5+ years).",
      cat_understand_label: "Key Thing to Understand:",
      cat_eq_understand: "Subject to market volatility; values can drop in the short run. Requires patience.",
      cat_discuss_btn: "Discuss Options",
      cat_debt_badge: "Capital Preservation",
      risk_mod_low_tag: "Lower to Moderate Risk",
      cat_debt_title: "Debt Funds",
      cat_debt_desc: "Invests in fixed-income securities like Government Bonds, Treasury Bills, and Corporate Debentures. Aims to generate regular interest income.",
      cat_debt_profile: "Conservative investors seeking relatively more stable options with low volatility.",
      cat_debt_purpose: "Emergency funds, parking surplus cash, short-to-medium-term goals (1–3 years).",
      cat_debt_understand: "Subject to interest rate and credit risk; not risk-free, but generally less volatile than equity.",
      cat_hybrid_badge: "Balanced Allocation",
      risk_med_tag: "Moderate Risk",
      cat_hybrid_title: "Hybrid Funds",
      cat_hybrid_desc: "Combines both Equity (for growth) and Debt (for stability) in a single fund. Dynamically rebalances between asset classes as markets move.",
      cat_hybrid_profile: "Investors looking for moderate growth without full exposure to stock market swings.",
      cat_hybrid_purpose: "Medium-term goals (3 to 5 years), first-time investors moving beyond traditional deposits.",
      cat_hybrid_understand: "Smooths the ride during market drops, but equity component still carries market risk.",
      sol_kicker: "Customized Assistance",
      sol_heading: "Solutions For Different Goals",
      sol_subtitle: "Every investor has unique responsibilities and timelines. Explore our specialized services and discuss what matches your life priorities.",
      sol_btn_discuss: "Discuss Your Goal →",
      sol_btn_review: "Request Review →",
      sip_kicker: "The Power of Discipline",
      sip_heading: "SIP: Start Small. Stay Consistent. Think Long Term.",
      sip_lead: "A Systematic Investment Plan (SIP) is not a separate financial product—it is simply a disciplined method of investing in mutual funds. It allows anyone to participate in India's growth journey.",
      sip_calc_cta: "Calculate Your SIP",
      sip_how_title: "How SIP Works",
      sip_vs_title: "SIP vs Lump-Sum",
      sip_risks_title: "Important Risks & Limitations",
      calc_kicker: "Explore The Possibilities",
      calc_heading: "Interactive Investment Calculators",
      calc_subtitle: "Understand how disciplined investing compounds over time. Adjust the numbers below to visualize your potential journey.",
      tools_calc_heading: "Tools & Calculators",
      tools_calc_subtitle: "Plan your life milestones, compare investment options, and visualize the power of disciplined compounding.",
      cat_title_lifegoal: "LIFE GOAL",
      cat_sub_calculators: "CALCULATORS",
      cat_title_financial: "FINANCIAL",
      cat_title_quick: "QUICK",
      cat_sub_tools: "TOOLS",
      goal_lbl_plan: "PLAN YOUR",
      goal_lbl_retirement: "RETIREMENT",
      goal_lbl_child: "CHILD",
      goal_lbl_education: "EDUCATION",
      goal_lbl_marriage_for: "MARRIAGE FOR",
      goal_lbl_child_upper: "CHILD",
      goal_lbl_your: "YOUR",
      goal_lbl_other_goal: "OTHER GOAL",
      lbl_present_age: "Present Age",
      lbl_ret_age: "Retirement Age",
      lbl_monthly_expenses: "Monthly Expenses",
      lbl_expected_returns: "Expected Returns %",
      lbl_growth_savings: "Expected Growth in Savings",
      lbl_existing_investments: "Existing Investments",
      lbl_assumptions: "Assumptions",
      lbl_assump_pre_inf: "Pre-Retirement Inflation:",
      lbl_assump_post_inf: "Post-Retirement Inflation:",
      lbl_assump_post_ret: "Post-Retirement Return:",
      lbl_assump_life_exp: "Life Expectancy:",
      lbl_rec_kitty: "Recommended Retirement Kitty Amount",
      lbl_req_invest_amt: "Required Investment Amount",
      lbl_monthly: "Monthly",
      lbl_yearly: "Yearly",
      lbl_onetime: "One Time",
      lbl_fv_existing: "Future value of Existing Investment",
      lbl_shortfall_surplus: "Shortfall / Surplus to Target Amount",
      lbl_ret_exp_year: "Monthly expenses in Retirement Year",
      btn_plan_retirement_suresh: "Discuss Retirement Plan With Suresh",
      calc_disclaimer: "Calculations are illustrative estimates and are not a guarantee of future returns. Mutual fund investments are subject to market risks.",
      tab_sip: "SIP Calculator",
      tab_lumpsum: "Lump-Sum Calculator",
      tab_fd: "SIP vs FD Comparison",
      sip_inputs_title: "SIP Parameters",
      lbl_monthly_sip: "Monthly Investment",
      lbl_sip_rate: "Expected Annual Return (Estimated)",
      lbl_duration: "Investment Duration",
      unit_years: "Yrs",
      calc_interactive_tip: "Adjust sliders to see real-time updates in the chart.",
      calc_est_breakdown: "Estimated Wealth Breakdown",
      kpi_invested: "Total Invested Amount",
      kpi_own_capital: "From your pocket",
      kpi_gain: "Estimated Returns",
      kpi_compounded: "Wealth generated",
      kpi_total: "Estimated Future Value",
      btn_plan_sip: "Start Planning This SIP Goal",
      lump_inputs_title: "Lump-Sum Parameters",
      lbl_initial_invest: "Initial Investment",
      btn_plan_lump: "Discuss Lump-Sum Options",
      fd_inputs_title: "Comparison Inputs",
      lbl_monthly_amount: "Monthly Amount",
      lbl_fd_rate: "FD Interest Rate (Illustrative)",
      lbl_sip_comp_rate: "SIP Expected Return (Illustrative)",
      fd_comp_clarity: "Fair Comparison: Bank FDs offer guaranteed interest backed by DICGC up to ₹5 Lakhs, whereas Mutual Funds carry market risk and returns vary. This comparison is purely illustrative of mathematical compounding.",
      comp_results_title: "Side-by-Side Projection",
      btn_discuss_strategy: "Discuss The Right Allocation For You",
      nj_kicker: "Institutional Backbone",
      nj_heading: "Why NJ Wealth?",
      nj_subtitle: "GrowKnow partners with NJ Wealth—one of India's largest and most trusted financial products distribution networks—to provide you with institutional-grade security, cutting-edge technology, and seamless service.",
      nj_c1_title: "Bank-to-Fund Direct Security",
      nj_c1_desc: "Your money never passes through individual accounts. All transactions are routed directly between your verified bank account and the respective mutual fund AMC or clearing corporation (NSE/BSE).",
      nj_c2_title: "Paperless Digital Ecosystem",
      nj_c2_desc: "Enjoy 100% digital onboarding, instant e-mandate setup for SIPs, online KYC verification, and e-mail transaction confirmations without cumbersome paperwork.",
      nj_c3_title: "Access to 40+ AMCs on One Platform",
      nj_c3_desc: "Unrestricted access to all leading Asset Management Companies in India (SBI, HDFC, ICICI Prudential, Nippon, Kotak, Axis, Tata, Mirae, Parag Parikh, etc.) through a single unified desk.",
      nj_c4_title: "Consolidated Family Portfolio Tracking",
      nj_c4_desc: "Access comprehensive multi-folio statements, capital gains reports for easy tax filing, performance valuation, and family wealth summaries through secure portal access.",
      about_kicker: "The Story Behind GrowKnow",
      about_heading: "Building Wealth Through Knowledge & Personal Trust.",
      about_role: "Mutual Fund Distributor",
      about_loc: "Jaipur, Rajasthan • Serving Pan India",
      about_quote: "\"Real financial security doesn't come from market excitement or chasing the next hot tip. It comes from patience, simple explanations, and investments purposefully aligned with your life goals.\"",
      cred_1: "AMFI Registered Mutual Fund Distributor",
      cred_2: "Affiliated with NJ Wealth Distribution Network",
      cred_3: "Strict Adherence to SEBI & AMFI Code of Ethics",
      cred_4: "Focus on Educating First-Time & Long-Term Investors",
      about_story_1: "GrowKnow was created with a straightforward mission: to eliminate confusion, mistrust, and aggressive sales pitches from mutual fund investing.",
      about_story_2: "For many Indian families—whether salaried professionals in Jaipur, local business owners in Rajasthan, or young investors starting their first job—the stock market can feel intimidating. Between complex jargon, endless fund options, and aggressive advertising, it is hard to know where to begin.",
      about_story_3: "We believe financial guidance should be human, transparent, and approachable. We do not push schemes or guarantee returns. Instead, we listen to your life aspirations, explain options in simple everyday language, and help you establish a sustainable, goal-oriented habit.",
      why_work_title: "Why Work With Us?",
      why_1_title: "Personal Guidance",
      why_1_desc: "Direct access to Suresh Saini rather than faceless automated call centers or chatbots.",
      why_2_title: "Simple Explanations",
      why_2_desc: "Zero financial jargon. Understand exactly what your money is doing at all times.",
      why_3_title: "Goal-Based Approach",
      why_3_desc: "Every rupee invested is connected to a specific milestone: retirement, child's future, or emergency cushion.",
      why_4_title: "Ongoing Support",
      why_4_desc: "Continuous guidance across market cycles, portfolio reviews, and redemption assistance.",
      why_5_title: "Investor Education",
      why_5_desc: "Empowering you with knowledge so you can make confident, calm decisions without FOMO.",
      about_cta_review: "Request a Portfolio Discussion",
      about_cta_discuss: "Schedule an Introductory Call",
      review_kicker: "Comprehensive Evaluation",
      review_heading: "Not Sure If Your Portfolio Is Aligned With Your Goals?",
      review_subtitle: "Share a few details and request a portfolio discussion with Suresh Saini. We will examine scheme overlaps, asset allocation, and goal readiness without pushing unnecessary changes.",
      review_notice: "*A portfolio review is an educational and alignment exercise. It does not guarantee higher returns or eliminate market risks.",
      form_sec1_title: "Personal & Contact Details",
      form_sec2_title: "Investment Profile & Goals",
      form_sec3_title: "Communication Preferences & Notes",
      fld_name: "Full Name",
      fld_mobile: "Mobile Number",
      fld_email: "Email Address",
      fld_city: "City & State",
      fld_age: "Age Group",
      fld_occ: "Occupation",
      fld_monthly_inv: "Monthly Investment Capacity",
      fld_existing_inv: "Existing Investment Range",
      fld_exp: "Investment Experience",
      fld_goal: "Primary Financial Goal",
      fld_horizon: "Investment Time Horizon",
      fld_lang_pref: "Preferred Language for Discussion",
      fld_method: "Preferred Contact Method",
      fld_contact_time: "Best Time to Call",
      fld_message: "Message or Questions about your existing investments",
      form_consent: "I agree to be contacted by Suresh Saini (Mutual Fund Distributor, ARN-347947) regarding my portfolio enquiry. I understand this is for consultation and does not constitute an automated transaction.",
      btn_submit_review: "Request Portfolio Review",
      success_review_title: "Portfolio Review Request Received!",
      learn_kicker: "Knowledge Before Capital",
      learn_heading: "Mutual Fund Learning Center",
      learn_subtitle: "Master the essentials of mutual fund investing without confusing technical jargon. Click on any topic to explore simple explanations, real-world examples, and key takeaways.",
      filter_all: "All Topics",
      filter_basics: "Fundamentals",
      filter_strategies: "Strategies",
      filter_terms: "Terminology",
      faq_kicker: "Clarity & Answers",
      faq_heading: "Frequently Asked Questions",
      faq_subtitle: "Straightforward answers to the most common questions first-time and seasoned investors ask us.",
      cta_kicker: "Take The First Step",
      cta_heading: "Your Financial Goals Deserve A Plan.",
      cta_subtext: "Whether you're starting your first SIP, reviewing an existing portfolio or planning for a future goal, start with understanding.",
      cta_talk_suresh: "Talk to Suresh",
      cta_explore_calc: "Explore Calculators",
      footer_brand_sub: "Mutual Fund Guidance",
      footer_dist_role: "Mutual Fund Distributor",
      footer_nav_title: "Navigation",
      footer_sol_title: "Solutions",
      footer_connect_title: "Connect With Us",
      wa_fab_label: "Chat with Suresh",
      modal_kicker: "Personal Guidance",
      modal_title: "Talk to Suresh Saini",
      modal_sub: "Share your details to request an introductory goal-planning consultation.",
      modal_consent: "I agree to receive mutual fund guidance from Suresh Saini (ARN-347947).",
      modal_submit_btn: "Schedule Free Consultation",
      modal_success_title: "Enquiry Sent Successfully!",
      modal_success_desc: "Suresh Saini has received your request and will connect with you shortly."
    },
    hi: {
      skip_to_content: "मुख्य सामग्री पर जाएं",
      bar_distributor: "सुरेश सैनी",
      bar_amfi: "AMFI रजिस्टर्ड म्यूचुअल फंड वितरक (ARN: 347947)",
      bar_location: "जयपुर, राजस्थान • संपूर्ण भारत में सेवा",
      bar_tagline: "शिक्षा • मार्गदर्शन • निरंतर सहयोग",
      nav_subtag: "म्यूचुअल फंड मार्गदर्शन",
      nav_home: "होम",
      nav_about: "परिचय",
      nav_mf: "म्यूचुअल फंड",
      nav_solutions: "समाधान",
      nav_calculators: "कैलकुलेटर",
      nav_learn: "सीखें",
      nav_review: "पोर्टफोलियो समीक्षा",
      nav_contact: "संपर्क",
      nav_cta: "बात करें",
      hero_pill: "पेशेवर मार्गदर्शन • सरल भाषा में समझ • लक्ष्य-केंद्रित निवेश",
      hero_h1_p1: "स्पष्टता के साथ निवेश करें।",
      hero_h1_p2: "उद्देश्य के साथ आगे बढ़ें।",
      hero_subline: "आपके लक्ष्यों, आपके भविष्य और मानसिक शांति के लिए सरल म्यूचुअल फंड मार्गदर्शन।",
      hero_desc: "पेशेवर मार्गदर्शन के साथ अपने विकल्पों को समझें, अपने वित्तीय लक्ष्यों की योजना बनाएं और सोच-समझकर निर्णय लें।",
      hero_cta_primary: "अपनी निवेश यात्रा शुरू करें",
      hero_cta_secondary: "म्यूचुअल फंड समझें",
      trust_p1_title: "पहले सीखें, फिर निवेश",
      trust_p1_desc: "बिना किसी तकनीकी उलझन के सरल भाषा में समझ",
      trust_p2_title: "लक्ष्य आधारित योजना",
      trust_p2_desc: "आपकी समय-सीमा और प्राथमिकताओं के अनुरूप",
      trust_p3_title: "व्यक्तिगत सलाहकार",
      trust_p3_desc: "मानवीय संबंध और निरंतर समीक्षा सहायता",
      advisor_distributor_title: "म्यूचुअल फंड डिस्ट्रीब्यूटर",
      advisor_card_quote: "\"निवेश बाज़ार का अनुमान लगाने के बारे में नहीं है—यह अपने परिवार के सपनों के प्रति अनुशासित रहने के बारे में है।\"",
      advisor_loc_label: "स्थान:",
      advisor_loc_val: "जयपुर, राजस्थान (पूरे भारत में सेवा)",
      advisor_partner_label: "प्लेटफ़ॉर्म पार्टनर:",
      advisor_approach_label: "दृष्टिकोण:",
      advisor_approach_val: "लक्ष्य-आधारित • पारदर्शी • गैर-लेनदेनकारी",
      hero_compounding_title: "अनुशासित SIP चक्रवृद्धिकरण (Compounding) संकल्पना",
      hero_compounding_badge: "उदाहरणात्मक",
      hero_compounding_note: "हर महीने की छोटी बचत समय के साथ चक्रवृद्धि ब्याज की ताकत से बड़ा फंड बनती है।",
      advisor_card_cta: "सीधे परामर्श का अनुरोध करें",
      trust_kicker: "हमारा मूल सिद्धांत",
      trust_heading: "म्यूचुअल फंड में निवेश करना जटिल होने की आवश्यकता नहीं है।",
      trust_subtitle: "हम बाज़ार के शोर और तकनीकी शब्दों को हटाते हैं ताकि आप आत्मविश्वास और शांति से धन का निर्माण कर सकें।",
      trust_c1_title: "सीखें (Learn)",
      trust_c1_desc: "एक भी रुपया लगाने से पहले सरल भाषा में म्यूचुअल फंड, जोखिम और रिटर्न की बुनियादी बातों को अच्छी तरह समझें।",
      trust_c2_title: "योजना (Plan)",
      trust_c2_desc: "निवेश को अपने जीवन के लक्ष्यों से जोड़ें—जैसे रिटायरमेंट, बच्चों की उच्च शिक्षा, शादी या आपातकालीन सुरक्षा।",
      trust_c3_title: "समीक्षा (Review)",
      trust_c3_desc: "अपने पुराने और बिखरे हुए निवेश को समझें। अत्यधिक ओवरलैप, गैर-जरूरी जोखिम या गलत फंड्स की पहचान करें।",
      trust_c4_title: "सहयोग (Support)",
      trust_c4_desc: "जब भी आपको ज़रूरत हो, निरंतर सहायता प्राप्त करें। बाज़ार के उतार-चढ़ाव में हम आपके साथ बने रहते हैं।",
      mf_kicker: "म्यूचुअल फंड की बुनियादी बातें",
      mf_heading: "म्यूचुअल फंड क्या है?",
      mf_quote: "\"म्यूचुअल फंड कई निवेशकों से पैसा इकट्ठा करता है और उस पैसे को फंड के उद्देश्य के अनुसार शेयरों, बॉन्ड या अन्य संपत्तियों के पोर्टफोलियो में निवेश करता है।\"",
      flow_n1_title: "निवेशक (आप और अन्य)",
      flow_n1_desc: "हजारों लोग अपनी छोटी-बड़ी बचत को एक साथ मिलाते हैं",
      flow_n2_title: "म्यूचुअल फंड एवं AMC",
      flow_n2_desc: "रजिस्टर्ड फंड मैनेजर द्वारा पेशेवर रूप से प्रबंधित",
      flow_n3_title: "विविध पोर्टफोलियो",
      flow_n3_desc: "पैसा कई अलग-अलग कंपनियों और क्षेत्रों में बांटा जाता है",
      flow_n4_title: "अंतर्निहित प्रतिभूतियां",
      flow_n4_desc: "शेयर, सरकारी बॉन्ड, कॉर्पोरेट डिबेंचर आदि",
      mf_step1_title: "चरण 1: आप निवेश करते हैं",
      mf_step1_desc: "आप अपनी सुविधा और वित्तीय लक्ष्यों के आधार पर एक राशि (मासिक SIP या एकमुश्त) चुनकर निवेश शुरू करते हैं।",
      mf_step2_title: "चरण 2: सामूहिक निवेश",
      mf_step2_desc: "आपकी राशि एक सेबी-विनियमित एसेट मैनेजमेंट कंपनी (AMC) के तहत हजारों अन्य निवेशकों के साथ जुड़ती है।",
      mf_step3_title: "चरण 3: पेशेवर आवंटन",
      mf_step3_desc: "अनुभवी फंड मैनेजर इस राशि को फंड के घोषित उद्देश्य के अनुसार विभिन्न प्रतिभूतियों में निवेश करते हैं।",
      mf_step4_title: "चरण 4: मूल्य वृद्धि",
      mf_step4_desc: "अंतर्निहित प्रतिभूतियों के मूल्य में होने वाले बदलाव के साथ आपकी निवेशित इकाइयों का मूल्य (NAV) बढ़ता या घटता है।",
      cat_kicker: "प्रमुख संपत्ति वर्ग",
      cat_heading: "म्यूचुअल फंड की श्रेणियां समझें",
      cat_subtitle: "मूल श्रेणियों को समझें। हम किसी विशिष्ट स्कीम का प्रचार नहीं करते; हर चुनाव आपकी समय-सीमा और जोखिम क्षमता पर निर्भर करता है।",
      cat_disclaimer: "आपके लक्ष्यों, समय-सीमा और जोखिम प्रोफ़ाइल के आधार पर उपयुक्त हो सकता है। किसी विशिष्ट स्कीम का समर्थन नहीं।",
      cat_eq_badge: "पूंजी वृद्धि (Growth)",
      risk_high_tag: "उच्च जोखिम / उतार-चढ़ाव",
      cat_eq_title: "इक्विटी फंड्स (Equity Funds)",
      cat_eq_desc: "मुख्य रूप से शेयर बाज़ार में सूचीबद्ध कंपनियों के शेयरों में निवेश करता है। व्यापार वृद्धि में भाग लेकर पूंजी बढ़ाने का लक्ष्य।",
      cat_profile_label: "उपयुक्त निवेशक प्रोफाइल:",
      cat_eq_profile: "दीर्घकालिक निवेशक जो अल्पावधि बाज़ार के उतार-चढ़ाव को सहन करने के लिए तैयार हैं।",
      cat_purpose_label: "विशिष्ट उद्देश्य:",
      cat_eq_purpose: "दीर्घकालिक संपत्ति निर्माण, सेवानिवृत्ति फंड, बच्चों की उच्च शिक्षा (5+ वर्ष)।",
      cat_understand_label: "समझने योग्य मुख्य बात:",
      cat_eq_understand: "बाज़ार के उतार-चढ़ाव के अधीन; अल्पावधि में मूल्य घट सकता है। धैर्य आवश्यक है।",
      cat_discuss_btn: "विकल्पों पर चर्चा करें",
      cat_debt_badge: "पूंजी संरक्षण",
      risk_mod_low_tag: "कम से मध्यम जोखिम",
      cat_debt_title: "डेट फंड्स (Debt Funds)",
      cat_debt_desc: "सरकारी बॉन्ड, ट्रेजरी बिल और कॉर्पोरेट डिबेंचर जैसी निश्चित आय वाली प्रतिभूतियों में निवेश करता है। नियमित आय का लक्ष्य।",
      cat_debt_profile: "रूढ़िवादी निवेशक जो कम उतार-चढ़ाव के साथ अपेक्षाकृत अधिक स्थिर विकल्प चाहते हैं।",
      cat_debt_purpose: "आपातकालीन फंड, अतिरिक्त नकदी रखना, अल्पकालिक से मध्यम अवधि के लक्ष्य (1 से 3 वर्ष)।",
      cat_debt_understand: "ब्याज दरों और क्रेडिट जोखिम के अधीन; जोखिम मुक्त नहीं, लेकिन आमतौर पर इक्विटी से कम उतार-चढ़ाव।",
      cat_hybrid_badge: "संतुलित आवंटन",
      risk_med_tag: "मध्यम जोखिम",
      cat_hybrid_title: "हाइब्रिड फंड्स (Hybrid Funds)",
      cat_hybrid_desc: "एक ही फंड में इक्विटी (वृद्धि के लिए) और डेट (स्थिरता के लिए) दोनों को जोड़ता है। बाज़ार की स्थिति के अनुसार पुनर्संतुलन।",
      cat_hybrid_profile: "ऐसे निवेशक जो शेयर बाज़ार के पूरे उतार-चढ़ाव के बिना संतुलित वृद्धि चाहते हैं।",
      cat_hybrid_purpose: "मध्यम अवधि के लक्ष्य (3 से 5 वर्ष), पारंपरिक जमा से आगे बढ़ने वाले पहली बार के निवेशक।",
      cat_hybrid_understand: "बाज़ार में गिरावट के समय प्रभाव को कम करता है, लेकिन इक्विटी हिस्सा बाज़ार जोखिम वहन करता है।",
      sol_kicker: "अनुकूलित सहायता",
      sol_heading: "विभिन्न लक्ष्यों के लिए समाधान",
      sol_subtitle: "हर निवेशक की ज़िम्मेदारियां और समय-सीमा अलग होती हैं। अपनी प्राथमिकताओं के अनुसार समाधान तलाशें।",
      sol_btn_discuss: "अपने लक्ष्य पर चर्चा करें →",
      sol_btn_review: "समीक्षा का अनुरोध करें →",
      sip_kicker: "अनुशासन की शक्ति",
      sip_heading: "SIP: छोटी शुरुआत। निरंतरता। दीर्घकालिक सोच।",
      sip_lead: "सिस्टमैटिक इन्वेस्टमेंट प्लान (SIP) कोई अलग वित्तीय उत्पाद नहीं है—यह म्यूचुअल फंड में निवेश करने का एक अनुशासित तरीका है। यह हर किसी को भारत की विकास यात्रा में भाग लेने का अवसर देता है।",
      sip_calc_cta: "अपनी SIP गणना करें",
      sip_how_title: "SIP कैसे काम करता है",
      sip_vs_title: "SIP बनाम एकमुश्त निवेश",
      sip_risks_title: "महत्वपूर्ण जोखिम और सीमाएं",
      calc_kicker: "संभावनाएं तलाशें",
      calc_heading: "इंटरएक्टिव निवेश कैलकुलेटर",
      calc_subtitle: "समझें कि अनुशासित निवेश समय के साथ कैसे बढ़ता है। अपनी संभावित यात्रा देखने के लिए नीचे दिए गए नंबर बदलें।",
      tools_calc_heading: "टूल्स एवं कैलकुलेटर",
      tools_calc_subtitle: "अपने जीवन के लक्ष्यों की योजना बनाएं, निवेश विकल्पों की तुलना करें और चक्रवृद्धि ब्याज की ताकत को समझें।",
      cat_title_lifegoal: "जीवन लक्ष्य",
      cat_sub_calculators: "कैलकुलेटर",
      cat_title_financial: "वित्तीय",
      cat_title_quick: "त्वरित",
      cat_sub_tools: "टूल्स",
      goal_lbl_plan: "योजना बनाएं",
      goal_lbl_retirement: "रिटायरमेंट",
      goal_lbl_child: "बच्चों की",
      goal_lbl_education: "शिक्षा",
      goal_lbl_marriage_for: "बच्चों का",
      goal_lbl_child_upper: "विवाह",
      goal_lbl_your: "आपका",
      goal_lbl_other_goal: "अन्य लक्ष्य",
      lbl_present_age: "वर्तमान आयु",
      lbl_ret_age: "सेवानिवृत्ति आयु",
      lbl_monthly_expenses: "वर्तमान मासिक खर्च",
      lbl_expected_returns: "अपेक्षित वार्षिक रिटर्न %",
      lbl_growth_savings: "बचत में वार्षिक वृद्धि दर",
      lbl_existing_investments: "वर्तमान निवेशित राशि",
      lbl_assumptions: "मान्यताएं एवं आधार",
      lbl_assump_pre_inf: "रिटायरमेंट पूर्व मुद्रास्फीति:",
      lbl_assump_post_inf: "रिटायरमेंट बाद मुद्रास्फीति:",
      lbl_assump_post_ret: "रिटायरमेंट बाद अपेक्षित रिटर्न:",
      lbl_assump_life_exp: "संभावित जीवन काल:",
      lbl_rec_kitty: "आवश्यक अनुमानित रिटायरमेंट फंड",
      lbl_req_invest_amt: "आवश्यक निवेश राशि",
      lbl_monthly: "मासिक SIP",
      lbl_yearly: "वार्षिक",
      lbl_onetime: "एकमुश्त",
      lbl_fv_existing: "वर्तमान निवेश का भविष्य में मूल्य",
      lbl_shortfall_surplus: "लक्ष्य तक पहुँचने के लिए कमी / अधिकता",
      lbl_ret_exp_year: "रिटायरमेंट वर्ष में अनुमानित मासिक खर्च",
      btn_plan_retirement_suresh: "सुरेश जी के साथ रिटायरमेंट प्लान बनाएं",
      calc_disclaimer: "गणनाएं उदाहरणात्मक अनुमान हैं और भविष्य के रिटर्न की कोई गारंटी नहीं हैं। म्यूचुअल फंड निवेश बाज़ार जोखिमों के अधीन हैं।",
      tab_sip: "SIP कैलकुलेटर",
      tab_lumpsum: "एकमुश्त कैलकुलेटर",
      tab_fd: "SIP बनाम FD तुलना",
      sip_inputs_title: "SIP पैरामीटर",
      lbl_monthly_sip: "मासिक निवेश",
      lbl_sip_rate: "अपेक्षित वार्षिक रिटर्न (अनुमानित)",
      lbl_duration: "निवेश अवधि",
      unit_years: "वर्ष",
      calc_interactive_tip: "चार्ट में रीयल-टाइम अपडेट देखने के लिए स्लाइडर को समायोजित करें।",
      calc_est_breakdown: "अनुमानित संपत्ति विवरण",
      kpi_invested: "कुल निवेशित राशि",
      kpi_own_capital: "आपकी जेब से",
      kpi_gain: "अनुमानित रिटर्न",
      kpi_compounded: "अर्जित लाभ",
      kpi_total: "अनुमानित कुल मूल्य",
      btn_plan_sip: "इस SIP लक्ष्य की योजना बनाएं",
      lump_inputs_title: "एकमुश्त पैरामीटर",
      lbl_initial_invest: "आरंभिक निवेश राशि",
      btn_plan_lump: "एकमुश्त विकल्पों पर चर्चा करें",
      fd_inputs_title: "तुलना इनपुट",
      lbl_monthly_amount: "मासिक राशि",
      lbl_fd_rate: "FD ब्याज दर (उदाहरणात्मक)",
      lbl_sip_comp_rate: "SIP अपेक्षित रिटर्न (उदाहरणात्मक)",
      fd_comp_clarity: "उचित तुलना: बैंक FD ₹5 लाख तक DICGC द्वारा सुरक्षित गारंटीकृत ब्याज प्रदान करती है, जबकि म्यूचुअल फंड में बाज़ार जोखिम होता है। यह तुलना विशुद्ध रूप से गणितीय चक्रवृद्धि का उदाहरण है।",
      comp_results_title: "आमने-सामने तुलना",
      btn_discuss_strategy: "सही आवंटन पर चर्चा करें",
      nj_kicker: "संस्थागत मजबूती",
      nj_heading: "NJ Wealth क्यों?",
      nj_subtitle: "GrowKnow भारत के सबसे बड़े और सबसे भरोसेमंद वित्तीय वितरण नेटवर्कों में से एक NJ Wealth के साथ साझेदारी करता है—ताकि आपको संस्थागत सुरक्षा, उन्नत तकनीक और निर्बाध सेवा मिले।",
      nj_c1_title: "बैंक से फंड सीधा सुरक्षित लेनदेन",
      nj_c1_desc: "आपका पैसा कभी किसी व्यक्तिगत खाते में नहीं जाता। सभी लेनदेन आपके सत्यापित बैंक खाते और संबंधित म्यूचुअल फंड AMC या क्लीयरिंग कॉर्पोरेशन (NSE/BSE) के बीच सीधे होते हैं।",
      nj_c2_title: "पेपरलेस डिजिटल व्यवस्था",
      nj_c2_desc: "100% डिजिटल ऑनबोर्डिंग, SIP के लिए तुरंत ई-मैंडेट सेटअप, ऑनलाइन KYC सत्यापन और ई-मेल पुष्टिकरण का लाभ उठाएं।",
      nj_c3_title: "एक ही मंच पर 40+ AMCs",
      nj_c3_desc: "भारत की सभी प्रमुख एसेट मैनेजमेंट कंपनियों (SBI, HDFC, ICICI प्रूडेंशियल, निप्पॉन, कोटक, एक्सिस, टाटा आदि) तक एक ही डेस्क से पहुंच।",
      nj_c4_title: "परिवार का समेकित पोर्टफोलियो ट्रैकिंग",
      nj_c4_desc: "सुरक्षित पोर्टल के माध्यम से बहु-फोलियो विवरण, टैक्स फाइलिंग के लिए कैपिटल गेन रिपोर्ट और पारिवारिक संपत्ति सारांश आसानी से देखें।",
      about_kicker: "GrowKnow की कहानी",
      about_heading: "ज्ञान और व्यक्तिगत विश्वास के माध्यम से धन का निर्माण।",
      about_role: "म्यूचुअल फंड वितरक",
      about_loc: "जयपुर, राजस्थान • संपूर्ण भारत में सेवा",
      about_quote: "\"वास्तविक वित्तीय सुरक्षा बाज़ार के उत्साह या किसी गुप्त टिप के पीछे भागने से नहीं आती। यह धैर्य, सरल समझ और अपने जीवन के लक्ष्यों के प्रति समर्पित रहने से आती है।\"",
      cred_1: "AMFI रजिस्टर्ड म्यूचुअल फंड डिस्ट्रीब्यूटर",
      cred_2: "NJ Wealth वितरण नेटवर्क से संबद्ध",
      cred_3: "SEBI और AMFI की आचार संहिता का कड़ाई से पालन",
      cred_4: "नए और दीर्घकालिक निवेशकों को शिक्षित करने पर विशेष ध्यान",
      about_story_1: "GrowKnow की स्थापना एक स्पष्ट उद्देश्य के साथ की गई थी: म्यूचुअल फंड निवेश से भ्रम, अविश्वास और आक्रामक बिक्री को समाप्त करना।",
      about_story_2: "जयपुर के वेतनभोगी कर्मचारियों, राजस्थान के व्यापारियों से लेकर पहली नौकरी शुरू करने वाले युवाओं तक—अक्सर शेयर बाज़ार डरावना लगता है। जटिल शब्दों और हज़ारों फंड्स के बीच यह समझना कठिन हो जाता है कि शुरुआत कहाँ से करें।",
      about_story_3: "हमारा मानना है कि वित्तीय मार्गदर्शन मानवीय, पारदर्शी और सहज होना चाहिए। हम योजनाओं को थोपते नहीं हैं और न ही रिटर्न की गारंटी देते हैं। हम आपकी आकांक्षाओं को सुनते हैं, रोज़मर्रा की भाषा में समझाते हैं और एक अनुशासित आदत बनाने में मदद करते हैं।",
      why_work_title: "हमारे साथ क्यों काम करें?",
      why_1_title: "व्यक्तिगत मार्गदर्शन",
      why_1_desc: "स्वचालित कॉल सेंटर या बॉट के बजाय सीधे सुरेश सैनी से संवाद और मार्गदर्शन।",
      why_2_title: "सरल भाषा में समझ",
      why_2_desc: "शून्य वित्तीय शब्दावली। हर समय जानें कि आपका पैसा कहाँ और क्या कर रहा है।",
      why_3_title: "लक्ष्य-आधारित दृष्टिकोण",
      why_3_desc: "निवेश किया गया हर रुपया एक विशिष्ट मील के पत्थर से जुड़ा होता है: रिटायरमेंट, बच्चों का भविष्य या आपातकाल।",
      why_4_title: "निरंतर सहयोग",
      why_4_desc: "बाज़ार के विभिन्न चक्रों में लगातार मार्गदर्शन, पोर्टफोलियो समीक्षा और निकासी में सहायता।",
      why_5_title: "निवेशक शिक्षा",
      why_5_desc: "ज्ञान के माध्यम से आपको सशक्त बनाना ताकि आप बिना किसी घबराहट या लालच के शांत निर्णय ले सकें।",
      about_cta_review: "पोर्टफोलियो समीक्षा का अनुरोध करें",
      about_cta_discuss: "परिचयात्मक कॉल शेड्यूल करें",
      review_kicker: "व्यापक मूल्यांकन",
      review_heading: "क्या आपका पोर्टफोलियो आपके लक्ष्यों के अनुकूल है?",
      review_subtitle: "कुछ विवरण साझा करें और सुरेश सैनी के साथ अपने पोर्टफोलियो पर चर्चा करें। हम अनावश्यक बदलाव किए बिना स्कीम ओवरलैप और जोखिम की जांच करेंगे।",
      review_notice: "*पोर्टफोलियो समीक्षा एक शैक्षिक और संरेखण प्रक्रिया है। यह अधिक रिटर्न की गारंटी नहीं देती और न ही बाज़ार जोखिम समाप्त करती है।",
      form_sec1_title: "व्यक्तिगत एवं संपर्क विवरण",
      form_sec2_title: "निवेश प्रोफ़ाइल और लक्ष्य",
      form_sec3_title: "संपर्क प्राथमिकताएं और संदेश",
      fld_name: "पूरा नाम",
      fld_mobile: "मोबाइल नंबर",
      fld_email: "ईमेल पता",
      fld_city: "शहर एवं राज्य",
      fld_age: "आयु वर्ग",
      fld_occ: "व्यवसाय",
      fld_monthly_inv: "मासिक निवेश क्षमता",
      fld_existing_inv: "वर्तमान निवेश दायरा",
      fld_exp: "निवेश अनुभव",
      fld_goal: "प्राथमिक वित्तीय लक्ष्य",
      fld_horizon: "निवेश समय-सीमा",
      fld_lang_pref: "बातचीत के लिए पसंदीदा भाषा",
      fld_method: "संपर्क का पसंदीदा माध्यम",
      fld_contact_time: "कॉल करने का सर्वोत्तम समय",
      fld_message: "अपने मौजूदा निवेश या प्रश्नों के बारे में संदेश",
      form_consent: "मैं अपने पोर्टफोलियो समीक्षा के संबंध में सुरेश सैनी (म्यूचुअल फंड वितरक, ARN-347947) द्वारा संपर्क किए जाने के लिए सहमत हूं। मैं समझता/ती हूं कि यह परामर्श के लिए है और कोई स्वचालित लेनदेन नहीं है।",
      btn_submit_review: "पोर्टफोलियो समीक्षा का अनुरोध करें",
      success_review_title: "समीक्षा अनुरोध सफलतापूर्वक प्राप्त हुआ!",
      learn_kicker: "ज्ञान ही पूंजी है",
      learn_heading: "म्यूचुअल फंड लर्निंग सेंटर",
      learn_subtitle: "म्यूचुअल फंड के आवश्यक विषयों को बिना किसी भ्रम के समझें। किसी भी कार्ड पर क्लिक करके विस्तृत विवरण, व्यावहारिक उदाहरण और मुख्य सीख पढ़ें।",
      filter_all: "सभी विषय",
      filter_basics: "बुनियादी बातें",
      filter_strategies: "निवेश रणनीतियां",
      filter_terms: "शब्दावली समझें",
      faq_kicker: "स्पष्टता और उत्तर",
      faq_heading: "अक्सर पूछे जाने वाले सवाल",
      faq_subtitle: "नए और अनुभवी निवेशकों द्वारा पूछे जाने वाले सबसे आम सवालों के सीधे और संतुलित उत्तर।",
      cta_kicker: "पहला कदम उठाएं",
      cta_heading: "आपके वित्तीय लक्ष्य एक योजना के हकदार हैं।",
      cta_subtext: "चाहे आप अपनी पहली SIP शुरू कर रहे हों, पुराने पोर्टफोलियो की समीक्षा चाहते हों या किसी बड़े लक्ष्य की तैयारी कर रहे हों—शुरुआत सही समझ से करें।",
      cta_talk_suresh: "सुरेश सैनी से बात करें",
      cta_explore_calc: "कैलकुलेटर देखें",
      footer_brand_sub: "म्यूचुअल फंड मार्गदर्शन",
      footer_dist_role: "म्यूचुअल फंड वितरक",
      footer_nav_title: "नेविगेशन",
      footer_sol_title: "समाधान",
      footer_connect_title: "संपर्क सूत्र",
      wa_fab_label: "सुरेश जी से व्हाट्सएप करें",
      modal_kicker: "व्यक्तिगत मार्गदर्शन",
      modal_title: "सुरेश सैनी से परामर्श",
      modal_sub: "मुफ्त परिचयात्मक परामर्श के लिए अपना विवरण साझा करें।",
      modal_consent: "मैं सुरेश सैनी (ARN-347947) से म्यूचुअल फंड मार्गदर्शन प्राप्त करने के लिए सहमत हूँ।",
      modal_submit_btn: "मुफ्त परामर्श बुक करें",
      modal_success_title: "अनुरोध सफलतापूर्वक भेजा गया!",
      modal_success_desc: "सुरेश सैनी को आपका विवरण मिल गया है और वे शीघ्र ही आपसे संपर्क करेंगे।"
    }
  };

  let currentLang = localStorage.getItem('growknow_lang') || 'en';

  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('growknow_lang', lang);
    document.documentElement.lang = lang;

    const dict = translations[lang] || translations.en;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    const langLabel = document.getElementById('lang-label');
    const drawerLangLabel = document.getElementById('drawer-lang-label');

    if (langLabel) {
      langLabel.textContent = lang === 'en' ? 'हिंदी' : 'English';
    }
    if (drawerLangLabel) {
      drawerLangLabel.textContent = lang === 'en' ? 'Switch to हिंदी' : 'Switch to English';
    }

    if (window.GrowKnowCalc && typeof window.GrowKnowCalc.refreshAll === 'function') {
      window.GrowKnowCalc.refreshAll();
    }
  }

  const langToggleBtn = document.getElementById('lang-toggle-btn');
  const drawerLangBtn = document.getElementById('drawer-lang-btn');

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      setLanguage(currentLang === 'en' ? 'hi' : 'en');
      showToast(currentLang === 'en' ? 'Language: English' : 'भाषा: हिंदी');
    });
  }

  if (drawerLangBtn) {
    drawerLangBtn.addEventListener('click', () => {
      setLanguage(currentLang === 'en' ? 'hi' : 'en');
      showToast(currentLang === 'en' ? 'Language: English' : 'भाषा: हिंदी');
    });
  }

  setLanguage(currentLang);

  // ==========================================================================
  // 3. LEARNING CENTER ARTICLES DATA & DEEP-DIVE MODAL (14 ARTICLES)
  // ==========================================================================
  const learningArticles = [
    {
      id: 1,
      category: "basics",
      titleEn: "What is a Mutual Fund?",
      titleHi: "म्यूचुअल फंड क्या है?",
      descEn: "A mutual fund is a trust that pools savings from numerous investors who share a common financial goal. This pool is managed by a SEBI-registered Asset Management Company (AMC) and invested in a diversified basket of equities, bonds, or money market instruments. Instead of buying individual shares of 40 different companies, you buy units of a mutual fund that already owns those shares.",
      descHi: "म्यूचुअल फंड एक ऐसा ट्रस्ट है जो समान वित्तीय लक्ष्य रखने वाले कई निवेशकों से बचत एकत्रित करता है। इस सामूहिक राशि को SEBI-रजिस्टर्ड फंड मैनेजर द्वारा विभिन्न कंपनियों के शेयरों, सरकारी बॉन्ड और सिक्योरिटीज में निवेश किया जाता है। व्यक्तिगत रूप से 40 अलग-अलग कंपनियों के शेयर खरीदने के बजाय, आप एक म्यूचुअल फंड की यूनिट्स खरीदते हैं जिसमें वे सभी शेयर पहले से शामिल होते हैं।",
      exampleEn: "Think of it like hiring a taxi pool: instead of buying a whole car and navigating heavy traffic yourself, you and other passengers share the ride, while a professional driver handles the navigation.",
      exampleHi: "इसे एक साझा टैक्सी की तरह समझें: खुद पूरी कार खरीदने और भारी ट्रैफ़िक में अकेले गाड़ी चलाने के बजाय, आप अन्य यात्रियों के साथ खर्च साझा करते हैं और एक पेशेवर ड्राइवर आपको मंजिल तक पहुंचाता है।",
      keyTakeawayEn: "Instant diversification, professional asset management, and strictly regulated safety by SEBI.",
      keyTakeawayHi: "कम पैसे में तुरंत विविधीकरण (Diversification), पेशेवर फंड प्रबंधन और SEBI द्वारा कड़े नियमन की सुरक्षा।"
    },
    {
      id: 2,
      category: "basics",
      titleEn: "What is SIP?",
      titleHi: "SIP (सिस्टमैटिक इन्वेस्टमेंट प्लान) क्या है?",
      descEn: "A Systematic Investment Plan (SIP) is a tool that allows you to invest a fixed predetermined amount into a mutual fund scheme on a specific date every month or quarter. SIP eliminates the stress of timing the market. Through Rupee-Cost Averaging, you get more units when the market falls and fewer units when it rises, resulting in a lower average cost per unit over the long term.",
      descHi: "SIP म्यूचुअल फंड में निवेश करने का एक बेहद अनुशासित तरीका है जिसमें आप हर महीने या तिमाही एक निश्चित तारीख पर एक तय राशि निवेश करते हैं। SIP में आपको यह सोचने की ज़रूरत नहीं होती कि आज बाज़ार ऊपर है या नीचे। जब बाज़ार गिरता है तो आपको अधिक यूनिट्स मिलती हैं और जब बढ़ता है तो कम, जिससे समय के साथ आपकी औसत खरीद लागत कम हो जाती है।",
      exampleEn: "Investing ₹5,000 every month on the 5th, immediately after salary credit, turning saving into an automated habit before spending.",
      exampleHi: "वेतन आते ही हर महीने की 5 तारीख को ₹5,000 की SIP का कटना, जिससे खर्च करने से पहले ही बचत की आदत पक्की हो जाती है।",
      keyTakeawayEn: "Disciplined investing, removes emotional market timing, and builds long-term wealth through rupee-cost averaging.",
      keyTakeawayHi: "अनुशासित निवेश, बाज़ार के उतार-चढ़ाव की चिंता से मुक्ति और छोटी बचत से बड़ा फंड बनाने की ताकत।"
    },
    {
      id: 3,
      category: "basics",
      titleEn: "Equity vs Debt vs Hybrid Funds",
      titleHi: "इक्विटी, डेट और हाइब्रिड फंड्स में क्या अंतर है?",
      descEn: "Mutual funds fall into three broad asset classes: Equity Funds invest primarily in stocks for capital growth (higher return potential with short-term volatility); Debt Funds invest in fixed-income securities like government bonds and treasury bills for stability and regular accrual; Hybrid Funds blend both equity and debt to balance risk and return dynamically.",
      descHi: "म्यूचुअल फंड को मुख्य रूप से तीन श्रेणियों में बांटा जाता है: इक्विटी फंड्स मुख्य रूप से कंपनी शेयरों में पूंजी बढ़ाने के लिए निवेश करते हैं (अधिक रिटर्न की संभावना के साथ अधिक उतार-चढ़ाव); डेट फंड्स सरकारी बॉन्ड और कॉर्पोरेट डिबेंचर जैसी सुरक्षित संपत्तियों में स्थिरता के लिए निवेश करते हैं; जबकि हाइब्रिड फंड्स दोनों का संतुलित मिश्रण होते हैं।",
      exampleEn: "A 25-year-old planning for retirement at 60 can afford equity funds, while a retiree needing monthly cashflow should focus on debt and conservative hybrid funds.",
      exampleHi: "25 साल का युवा अपने 60वें वर्ष के लिए इक्विटी फंड चुन सकता है, जबकि एक सेवानिवृत्त व्यक्ति को मासिक खर्च के लिए डेट या कंजर्वेटिव हाइब्रिड फंड चुनना चाहिए।",
      keyTakeawayEn: "Asset allocation matching your time horizon is the number one driver of long-term investment success.",
      keyTakeawayHi: "अपनी समय सीमा और उम्र के अनुसार सही एसेट क्लास का चयन करना ही सफल निवेश की सबसे बड़ी कुंजी है।"
    },
    {
      id: 4,
      category: "basics",
      titleEn: "Understanding Investment Risk",
      titleHi: "निवेश के जोखिम को कैसे समझें?",
      descEn: "Risk in mutual funds is not about your money vanishing overnight; it is the fluctuation in value (volatility) caused by broader economic cycles, interest rate shifts, and company performances. In equity investing, short-term volatility is the price you pay for long-term inflation-beating returns. Over 7 to 10 years, historical equity market volatility smooths out significantly.",
      descHi: "म्यूचुअल फंड में जोखिम का मतलब यह नहीं है कि आपका पैसा रातों-रात गायब हो जाएगा; इसका मतलब है बाज़ार के अनुसार फंड की कीमत में उतार-चढ़ाव (volatility)। इक्विटी में यह अल्पकालिक उतार-चढ़ाव महंगाई को मात देने वाले रिटर्न की स्वाभाविक कीमत है। 7 से 10 वर्षों में यह जोखिम ऐतिहासिक रूप से काफी कम हो जाता है।",
      exampleEn: "During market corrections, your portfolio might temporarily show a paper loss of -10%, but as businesses grow over the next 5 years, the value recovers and advances.",
      exampleHi: "बाज़ार में गिरावट के समय आपका पोर्टफोलियो अस्थायी रूप से -10% दिख सकता है, लेकिन जैसे-जैसे देश की अर्थव्यवस्था बढ़ती है, मूल्य वापस बढ़कर नए स्तर पर पहुंचता है।",
      keyTakeawayEn: "Never invest emergency cash into equity. Give equity at least 5 to 7 years to perform.",
      keyTakeawayHi: "आपातकालीन पैसे को कभी इक्विटी में न लगाएं। इक्विटी फंड को फलने-फूलने के लिए कम से कम 5 से 7 साल का समय दें।"
    },
    {
      id: 5,
      category: "terms",
      titleEn: "What is NAV?",
      titleHi: "NAV (Net Asset Value) क्या है?",
      descEn: "Net Asset Value (NAV) represents the per-unit market value of a mutual fund scheme. It is calculated at the close of every business day by adding the total market value of all securities held, subtracting operating expenses, and dividing by total outstanding units. A common beginner misconception is that a fund with an NAV of ₹20 is 'cheaper' than a fund with an NAV of ₹100—this is false. NAV reflects age and past growth, not valuation.",
      descHi: "NAV म्यूचुअल फंड की एक यूनिट का शुद्ध बाज़ार मूल्य होता है। हर कारोबारी दिन के अंत में फंड की कुल संपत्तियों में से खर्चों को घटाकर बची राशि को कुल यूनिट्स से भाग देकर NAV निकाली जाती है। कई नए निवेशक सोचते हैं कि ₹20 की NAV वाला फंड ₹100 वाले से 'सस्ता' है—यह पूरी तरह गलत है। ₹10,000 लगाने पर दोनों में समान प्रतिशत रिटर्न मिलेगा।",
      exampleEn: "If you invest ₹10,000 in Fund A (NAV ₹10) you get 1,000 units. If you invest ₹10,000 in Fund B (NAV ₹100) you get 100 units. If both funds grow by 10%, your wealth in both is exactly ₹11,000.",
      exampleHi: "यदि आप ₹10,000 फंड A (NAV ₹10) में लगाते हैं तो 1,000 यूनिट्स मिलेंगी। फंड B (NAV ₹100) में 100 यूनिट्स मिलेंगी। दोनों में 10% की बढ़त होने पर आपकी रकम दोनों जगह बराबर ₹11,000 ही होगी।",
      keyTakeawayEn: "Do not choose mutual funds based on a lower NAV; focus on portfolio quality and consistency.",
      keyTakeawayHi: "कम NAV देखकर कभी फंड न चुनें; फंड का ट्रैक रिकॉर्ड, पोर्टफोलियो और रणनीति ही महत्वपूर्ण है।"
    },
    {
      id: 6,
      category: "terms",
      titleEn: "What is Expense Ratio?",
      titleHi: "एक्सपेंस रेशियो क्या होता है?",
      descEn: "The Expense Ratio is the annual fee that the Asset Management Company charges for managing the mutual fund. It covers fund manager compensation, research, administrative, custody, audit, and distribution expenses. It is expressed as an annual percentage of the fund's daily average net assets and is already deducted from the published NAV daily.",
      descHi: "एक्सपेंस रेशियो वह वार्षिक शुल्क है जो फंड हाउस आपके निवेश को प्रबंधित करने, रिसर्च करने, ऑडिट और वितरण के लिए लेता है। यह एक वार्षिक प्रतिशत के रूप में होता है जिसे SEBI के नियमों के तहत सीमित रखा जाता है और यह प्रतिदिन NAV से अपने-आप घट जाता है।",
      exampleEn: "If a fund generates a gross return of 14% and has an expense ratio of 1.2%, your net published return will be 12.8%.",
      exampleHi: "यदि किसी फंड का कुल मुनाफा 14% रहा और उसका एक्सपेंस रेशियो 1.2% है, तो आपको मिला शुद्ध रिटर्न 12.8% होगा।",
      keyTakeawayEn: "All returns published in statements and apps are already net of the expense ratio.",
      keyTakeawayHi: "म्यूचुअल फंड के सभी प्रदर्शित रिटर्न पहले से ही एक्सपेंस रेशियो काटकर दिखाए जाते हैं।"
    },
    {
      id: 7,
      category: "strategies",
      titleEn: "What is Compounding?",
      titleHi: "कंपाउंडिंग (चक्रवृद्धि) की ताकत",
      descEn: "Compounding is the process where your investment returns begin earning their own returns over time. In the first 5 years of an investment, growth looks modest because most of the portfolio consists of your own contributions. But after 10, 15, or 20 years, the accumulated returns dwarf your original principal, creating exponential wealth creation.",
      descHi: "कंपाउंडिंग वह प्रक्रिया है जिसमें आपके निवेश से मिला मुनाफा भी आगे चलकर नया मुनाफा कमाने लगता है। शुरुआत के 5 सालों में बढ़त धीमी लग सकती है क्योंकि अधिकांश पूंजी आपकी अपनी होती है। लेकिन 10, 15 या 20 साल बाद कंपाउंडिंग का जादू चलता है और मुनाफा मूलधन से कई गुना बड़ा हो जाता है।",
      exampleEn: "A monthly SIP of ₹10,000 for 20 years at 12% results in an investment of ₹24 Lakhs, but the total future value reaches nearly ₹1 Crore (a compounding gain of ~₹76 Lakhs)!",
      exampleHi: "12% अनुमानित दर पर 20 साल तक ₹10,000/माह की SIP में आपका कुल निवेश ₹24 लाख होगा, लेकिन कुल फंड लगभग ₹1 करोड़ तक पहुंच सकता है (यानी ~₹76 लाख केवल कंपाउंडिंग का लाभ)!",
      keyTakeawayEn: "Time in the market matters far more than timing the market. Start as early as possible.",
      keyTakeawayHi: "बाज़ार में बिताया गया समय (Time in Market) सबसे महत्वपूर्ण है। जितनी जल्दी शुरू करेंगे, कंपाउंडिंग उतनी ही बड़ी होगी।"
    },
    {
      id: 8,
      category: "strategies",
      titleEn: "SIP vs Lump Sum",
      titleHi: "SIP बनाम एकमुश्त (Lumpsum) निवेश",
      descEn: "SIP is the ideal path for regular monthly earners who want to build a discipline of investing part of their salary without worrying about market tops or bottoms. Lump-sum investment is suitable when you have idle surplus liquidity (like an annual performance bonus, maturity of another deposit, or sale of an asset) that you wish to deploy productively.",
      descHi: "नौकरीपेशा लोगों के लिए SIP सबसे बेहतरीन है क्योंकि यह हर महीने की बचत को नियमित निवेश में बदलती है। एकमुश्त निवेश तब उपयुक्त होता है जब आपके पास बोनस, संपत्ति बिक्री या पुरानी बचत का एक बड़ा हिस्सा तुरंत उपलब्ध हो।",
      exampleEn: "If you receive a ₹5 Lakh bonus, you can either invest it in a balanced advantage fund or put it into a liquid fund and set up a 12-month STP into equity.",
      exampleHi: "यदि आपको ₹5 लाख का बोनस मिलता है, तो आप उसे लिक्विड फंड में रखकर 12 महीने के STP द्वारा धीरे-धीरे इक्विटी में ट्रांसफर कर सकते हैं।",
      keyTakeawayEn: "Do not wait to collect a lump sum to start; start with a ₹1,000 SIP today.",
      keyTakeawayHi: "बड़ा पैसा इकट्ठा होने का इंतज़ार न करें; आज ही ₹1,000 की SIP से शुरुआत करें।"
    },
    {
      id: 9,
      category: "basics",
      titleEn: "How to Start Investing in Mutual Funds",
      titleHi: "म्यूचुअल फंड में निवेश कैसे शुरू करें?",
      descEn: "Starting your investment journey in India is now 100% paperless and straightforward. All you need is your PAN Card, Aadhaar Card (linked to your active mobile number for OTP), and an active Savings Bank Account in your name. Once your C-KYC is verified, you can set up automated monthly investments safely.",
      descHi: "भारत में म्यूचुअल फंड शुरू करना अब पूरी तरह डिजिटल और आसान है। इसके लिए केवल पैन कार्ड, आधार कार्ड (ओटीपी के लिए मोबाइल से लिंक) और आपके नाम का बैंक खाता चाहिए। C-KYC पूरा होते ही आप तुरंत निवेश शुरू कर सकते हैं।",
      exampleEn: "Our guidance desk helps verify your KYC status within minutes and sets up an e-mandate with your bank so you never miss an installment.",
      exampleHi: "हमारा ऑफिस कुछ ही मिनटों में आपकी KYC जांच पूरी करने और बैंक e-mandate सेट करने में पूरी मदद करता है।",
      keyTakeawayEn: "Zero physical paperwork required; completely secure bank-to-fund direct connectivity.",
      keyTakeawayHi: "कागजी दस्तावेजों का कोई झंझट नहीं; बैंक से सीधे म्यूचुअल फंड में पारदर्शी लेन-देन।"
    },
    {
      id: 10,
      category: "strategies",
      titleEn: "How Goal-Based Investing Works",
      titleHi: "लक्ष्य आधारित निवेश क्या है?",
      descEn: "Goal-based investing means assigning a specific purpose and target date to every investment portfolio. Instead of randomly buying funds because a friend recommended them, you create specific buckets: Retirement, Child Higher Education, Buying a Home, or Emergency Fund. This prevents emotional panic during market corrections.",
      descHi: "लक्ष्य आधारित निवेश का मतलब है हर निवेश को एक निश्चित उद्देश्य और समय से जोड़ना। किसी के कहने पर बिना सोचे फंड खरीदने के बजाय, अपने लक्ष्यों की अलग-अलग बाल्टियां बनाएं: रिटायरमेंट, बच्चों की पढ़ाई, घर खरीदना या इमरजेंसी फंड। इससे बाज़ार गिरने पर घबराहट नहीं होती।",
      exampleEn: "Knowing your child's college admission is 12 years away allows you to comfortably ignore temporary market drops this month.",
      exampleHi: "जब आपको पता हो कि बच्चे के कॉलेज का खर्च 12 साल बाद चाहिए, तो आज बाज़ार के 5% गिरने से आप कतई विचलित नहीं होंगे।",
      keyTakeawayEn: "A clear goal gives you the conviction to stay invested when the market is volatile.",
      keyTakeawayHi: "एक स्पष्ट लक्ष्य आपको बाज़ार के मुश्किल समय में भी टिके रहने का आत्मविश्वास देता है।"
    },
    {
      id: 11,
      category: "strategies",
      titleEn: "What is ELSS (Tax Saving Mutual Fund)?",
      titleHi: "ELSS टैक्स सेविंग फंड क्या है?",
      descEn: "Equity Linked Savings Scheme (ELSS) is a diversified equity fund that offers tax deductions under Section 80C of the Income Tax Act up to ₹1.5 Lakhs annually. It has the shortest lock-in period (only 3 years) among all Section 80C investment options, compared to 5 years for Tax-Saving FDs and 15 years for PPF.",
      descHi: "ELSS एक इक्विटी म्यूचुअल फंड है जिसमें आयकर की धारा 80C के तहत हर साल ₹1.5 लाख तक की टैक्स छूट मिलती है। धारा 80C के सभी विकल्पों में इसका लॉक-इन पीरियड सबसे कम (केवल 3 साल) है, जबकि टैक्स-सेविंग FD में 5 साल और PPF में 15 साल का लॉक-इन होता है।",
      exampleEn: "An investor in the 30% tax bracket can save up to ₹46,800 in annual income taxes while participating in equity wealth creation.",
      exampleHi: "30% टैक्स स्लैब में आने वाले व्यक्ति हर साल ₹46,800 तक टैक्स बचा सकते हैं और साथ ही इक्विटी में वेल्थ भी बना सकते हैं।",
      keyTakeawayEn: "Shortest 80C lock-in of 3 years with equity growth potential, but subject to equity market risks.",
      keyTakeawayHi: "केवल 3 साल का सबसे कम लॉक-इन और बेहतर ग्रोथ क्षमता, लेकिन यह शेयर बाज़ार से जुड़ा होता है।"
    },
    {
      id: 12,
      category: "strategies",
      titleEn: "What is SWP (Systematic Withdrawal Plan)?",
      titleHi: "SWP क्या है? नियमित मासिक आय का साधन",
      descEn: "Systematic Withdrawal Plan (SWP) allows you to withdraw a fixed predetermined sum from your accumulated mutual fund corpus at regular intervals (monthly or quarterly). It is widely favored by senior citizens and retirees because only the capital gain portion of the withdrawn amount is taxed, making it significantly more tax-efficient than traditional interest payouts.",
      descHi: "SWP म्यूचुअल फंड से नियमित अंतराल पर एक तय राशि निकालने की सुविधा है। यह SIP का ठीक उल्टा है। सेवानिवृत्त लोगों के लिए यह एक नियमित पेंशन की तरह काम करता है। इसमें केवल मुनाफे वाले हिस्से पर टैक्स लगता है, जिससे यह बैंक ब्याज की तुलना में बहुत अधिक टैक्स-कुशल बन जाता है।",
      exampleEn: "A retiree with a ₹50 Lakh corpus sets an SWP of ₹30,000/month to meet household expenses while the remaining ₹49.7+ Lakhs continues to grow.",
      exampleHi: "₹50 लाख के रिटायरमेंट फंड से ₹30,000 प्रति माह की SWP शुरू करने पर घर का खर्च भी चलता रहता है और बचा हुआ फंड बढ़ता भी रहता है।",
      keyTakeawayEn: "Ideal for generating a predictable monthly pension with high tax efficiency in retirement.",
      keyTakeawayHi: "रिटायरमेंट के बाद नियमित मासिक पेंशन पाने और टैक्स बचाने का सबसे आधुनिक और कारगर तरीका।"
    },
    {
      id: 13,
      category: "strategies",
      titleEn: "What is STP (Systematic Transfer Plan)?",
      titleHi: "STP (सिस्टमैटिक ट्रांसफर प्लान) क्या है?",
      descEn: "A Systematic Transfer Plan (STP) allows you to park a lump sum in a low-risk debt or liquid mutual fund and automatically transfer a fixed amount periodically (weekly or monthly) into an equity fund. This gives you the peace of mind of earning liquid fund returns while averaging your equity entry valuations safely.",
      descHi: "STP के जरिए आप एकमुश्त बड़ी रकम को पहले किसी सुरक्षित लिक्विड या डेट फंड में रखते हैं, और फिर वहां से हर हफ्ते या महीने एक तय रकम अपने-आप इक्विटी फंड में ट्रांसफर होती रहती है। इससे एकमुश्त पैसा बाज़ार के पीक पर फंसने का डर खत्म हो जाता है।",
      exampleEn: "Parking ₹12 Lakhs from an inheritance in a liquid fund and running an STP of ₹50,000/month into equity over 24 months.",
      exampleHi: "पैतृक संपत्ति या बोनस से मिले ₹12 लाख को लिक्विड फंड में रखकर अगले 24 महीनों तक ₹50,000/माह इक्विटी में ट्रांसफर करना।",
      keyTakeawayEn: "The safest way to deploy large windfalls into equity without emotional market timing stress.",
      keyTakeawayHi: "बड़ी एकमुश्त रकम को शेयर बाज़ार के झटकों से बचाते हुए धीरे-धीरे निवेश करने का सबसे सुरक्षित तरीका।"
    },
    {
      id: 14,
      category: "basics",
      titleEn: "Understanding Portfolio Diversification",
      titleHi: "पोर्टफोलियो विविधीकरण (Diversification)",
      descEn: "Diversification is the timeless financial principle of 'not putting all your eggs in one basket'. A well-constructed mutual fund portfolio spreads your capital across multiple asset classes (equity, debt, gold), market capitalizations (large cap, mid cap), and industry sectors (banking, IT, pharma, manufacturing). When one sector experiences a downturn, others stabilize your wealth.",
      descHi: "विविधीकरण का सीधा सा अर्थ है 'अपने सारे अंडे एक ही टोकरी में न रखना'। एक समझदार पोर्टफोलियो आपके पैसे को विभिन्न एसेट क्लास (इक्विटी, डेट, गोल्ड), विभिन्न आकारों (लार्ज कैप, मिड कैप) और अलग-अलग सेक्टरों में बांटता है। जब कोई एक सेक्टर मंदी में होता है, तो दूसरा सेक्टर पोर्टफोलियो को संभाल लेता है।",
      exampleEn: "If you only buy shares of one airline and it goes bankrupt, you lose 100%. If you hold a mutual fund owning 50 companies, a fall in one has negligible impact on your overall wealth.",
      exampleHi: "यदि आप केवल किसी एक कंपनी का शेयर खरीदते हैं और वह डूब जाती है तो सारा पैसा चला जाता है। लेकिन 50 कंपनियों वाले म्यूचुअल फंड में एक कंपनी के गिरने से आपके पूरे फंड पर बहुत मामूली असर पड़ता है।",
      keyTakeawayEn: "Diversification significantly lowers investment risk without necessarily sacrificing long-term returns.",
      keyTakeawayHi: "विविधीकरण आपके जोखिम को बहुत कम कर देता है और लंबी अवधि में रिटर्न को स्थिर बनाए रखता है।"
    }
  ];

  // Learning Modal Elements
  const learnModal = document.getElementById('learn-modal');
  const learnModalClose = document.getElementById('learn-modal-close');
  const learnModalTitle = document.getElementById('learn-modal-title');
  const learnModalKicker = document.getElementById('learn-modal-kicker');
  const learnModalContent = document.getElementById('learn-modal-content');

  function openLearnArticle(articleId) {
    const article = learningArticles.find(a => a.id === Number(articleId));
    if (!article || !learnModal) return;

    const isHi = currentLang === 'hi';

    if (learnModalTitle) {
      learnModalTitle.textContent = isHi ? article.titleHi : article.titleEn;
    }
    if (learnModalKicker) {
      learnModalKicker.textContent = isHi ? "GrowKnow निवेशक शिक्षा" : "GrowKnow Investor Education";
    }

    if (learnModalContent) {
      learnModalContent.innerHTML = `
        <div class="article-deep-dive">
          <div class="article-section">
            <h4 style="color:var(--color-accent); font-size:1.1rem; margin-bottom:8px;">${isHi ? 'सरल व्याख्या' : 'Detailed Explanation'}</h4>
            <p style="font-size:1rem; line-height:1.65; color:var(--text-secondary); margin-bottom:18px;">
              ${isHi ? article.descHi : article.descEn}
            </p>
          </div>

          <div style="background-color:var(--bg-surface-muted); border-left:4px solid var(--color-blue); padding:16px; border-radius:8px; margin-bottom:18px;">
            <strong style="color:var(--text-primary); font-size:0.95rem; display:block; margin-bottom:4px;">${isHi ? '💡 व्यावहारिक उदाहरण:' : '💡 Real-World Scenario:'}</strong>
            <p style="font-size:0.925rem; line-height:1.5; color:var(--text-secondary); margin:0;">
              ${isHi ? article.exampleHi : article.exampleEn}
            </p>
          </div>

          <div style="background-color:var(--color-accent-light); border-left:4px solid var(--color-accent); padding:16px; border-radius:8px; margin-bottom:24px;">
            <strong style="color:var(--color-accent-dark); font-size:0.95rem; display:block; margin-bottom:4px;">${isHi ? '✅ मुख्य सीख (Key Takeaway):' : '✅ Key Takeaway:'}</strong>
            <p style="font-size:0.925rem; line-height:1.5; color:var(--text-secondary); margin:0;">
              ${isHi ? article.keyTakeawayHi : article.keyTakeawayEn}
            </p>
          </div>

          <div style="display:flex; gap:12px; flex-wrap:wrap; justify-content:flex-end;">
            <button class="btn btn-primary" data-open-modal="Article Question: ${article.titleEn}">
              ${isHi ? 'सुरेश जी से इस पर चर्चा करें' : 'Discuss This With Suresh'}
            </button>
          </div>
        </div>
      `;
    }

    learnModal.classList.add('open');
    learnModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLearnArticle() {
    if (!learnModal) return;
    learnModal.classList.remove('open');
    learnModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (learnModalClose) {
    learnModalClose.addEventListener('click', closeLearnArticle);
  }
  if (learnModal) {
    learnModal.addEventListener('click', e => {
      if (e.target === learnModal) closeLearnArticle();
    });
  }

  // Bind article card clicks
  document.querySelectorAll('.learn-card').forEach(card => {
    card.addEventListener('click', () => {
      const topicId = card.getAttribute('data-topic-id');
      if (topicId) openLearnArticle(topicId);
    });
  });

  // Filter Buttons
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      document.querySelectorAll('.learn-card').forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ==========================================================================
  // 4. LEAD CONSULTATION MODAL CONTROLLER
  // ==========================================================================
  const leadModal = document.getElementById('lead-modal');
  const leadModalClose = document.getElementById('lead-modal-close');
  const leadModalForm = document.getElementById('lead-modal-form');
  const leadSuccess = document.getElementById('modal-success');

  function openLeadModal(context = '') {
    if (!leadModal) return;
    leadModal.classList.add('open');
    leadModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (leadModalForm) {
      leadModalForm.style.display = 'block';
    }
    if (leadSuccess) {
      leadSuccess.style.display = 'none';
    }

    if (context && leadModalForm) {
      const msgField = document.getElementById('lead-msg');
      if (msgField && !msgField.value) {
        msgField.placeholder = `I am interested in: ${context}`;
      }
    }
  }

  function closeLeadModal() {
    if (!leadModal) return;
    leadModal.classList.remove('open');
    leadModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (leadModalClose) {
    leadModalClose.addEventListener('click', closeLeadModal);
  }
  if (leadModal) {
    leadModal.addEventListener('click', e => {
      if (e.target === leadModal) closeLeadModal();
    });
  }

  // Bind all buttons with [data-open-modal]
  document.addEventListener('click', e => {
    const trigger = e.target.closest('[data-open-modal]');
    if (trigger) {
      e.preventDefault();
      const context = trigger.getAttribute('data-open-modal') || '';
      openLeadModal(context);
    }
  });

  // Lead Form Submission Validation & Handling
  if (leadModalForm) {
    leadModalForm.addEventListener('submit', e => {
      e.preventDefault();

      let hasError = false;
      const name = document.getElementById('lead-name');
      const mobile = document.getElementById('lead-mobile');
      const city = document.getElementById('lead-city');
      const consent = document.getElementById('lead-consent');

      // Reset errors
      document.getElementById('err-lead-name').textContent = '';
      document.getElementById('err-lead-mobile').textContent = '';
      document.getElementById('err-lead-city').textContent = '';
      document.getElementById('err-lead-consent').textContent = '';

      if (!name.value.trim()) {
        document.getElementById('err-lead-name').textContent = 'Please enter your full name.';
        name.classList.add('is-invalid');
        hasError = true;
      } else {
        name.classList.remove('is-invalid');
      }

      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(mobile.value.trim())) {
        document.getElementById('err-lead-mobile').textContent = 'Enter a valid 10-digit Indian mobile number.';
        mobile.classList.add('is-invalid');
        hasError = true;
      } else {
        mobile.classList.remove('is-invalid');
      }

      if (!city.value.trim()) {
        document.getElementById('err-lead-city').textContent = 'Please enter your city.';
        city.classList.add('is-invalid');
        hasError = true;
      } else {
        city.classList.remove('is-invalid');
      }

      if (!consent.checked) {
        document.getElementById('err-lead-consent').textContent = 'Please check the consent box to proceed.';
        hasError = true;
      }

      if (hasError) return;

      // Simulated clean frontend lead submission hook
      leadModalForm.style.display = 'none';
      if (leadSuccess) {
        leadSuccess.style.display = 'block';
      }
      showToast('Enquiry received! Suresh Saini will connect with you soon.');
    });
  }

  // ==========================================================================
  // 5. 15-FIELD PORTFOLIO REVIEW FORM VALIDATION & HANDLING
  // ==========================================================================
  const reviewForm = document.getElementById('portfolio-review-form');
  const reviewSuccessState = document.getElementById('review-success-state');
  const resetReviewFormBtn = document.getElementById('reset-review-form-btn');

  if (reviewForm) {
    reviewForm.addEventListener('submit', e => {
      e.preventDefault();

      let hasError = false;
      const name = document.getElementById('review-name');
      const mobile = document.getElementById('review-mobile');
      const email = document.getElementById('review-email');
      const city = document.getElementById('review-city');
      const age = document.getElementById('review-age');
      const occ = document.getElementById('review-occupation');
      const goal = document.getElementById('review-goal');
      const horizon = document.getElementById('review-horizon');
      const consent = document.getElementById('review-consent');

      // Clear errors
      ['err-review-name', 'err-review-mobile', 'err-review-email', 'err-review-city', 'err-review-age', 'err-review-occupation', 'err-review-goal', 'err-review-horizon', 'err-review-consent'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '';
      });

      if (!name.value.trim()) {
        document.getElementById('err-review-name').textContent = 'Please provide your full name.';
        name.classList.add('is-invalid');
        hasError = true;
      } else {
        name.classList.remove('is-invalid');
      }

      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(mobile.value.trim())) {
        document.getElementById('err-review-mobile').textContent = 'Valid 10-digit mobile required.';
        mobile.classList.add('is-invalid');
        hasError = true;
      } else {
        mobile.classList.remove('is-invalid');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        document.getElementById('err-review-email').textContent = 'Valid email address required.';
        email.classList.add('is-invalid');
        hasError = true;
      } else {
        email.classList.remove('is-invalid');
      }

      if (!city.value.trim()) {
        document.getElementById('err-review-city').textContent = 'Please enter your city and state.';
        city.classList.add('is-invalid');
        hasError = true;
      } else {
        city.classList.remove('is-invalid');
      }

      if (!age.value) {
        document.getElementById('err-review-age').textContent = 'Please select your age group.';
        age.classList.add('is-invalid');
        hasError = true;
      } else {
        age.classList.remove('is-invalid');
      }

      if (!occ.value) {
        document.getElementById('err-review-occupation').textContent = 'Please select your occupation.';
        occ.classList.add('is-invalid');
        hasError = true;
      } else {
        occ.classList.remove('is-invalid');
      }

      if (!goal.value) {
        document.getElementById('err-review-goal').textContent = 'Please select your primary financial goal.';
        goal.classList.add('is-invalid');
        hasError = true;
      } else {
        goal.classList.remove('is-invalid');
      }

      if (!horizon.value) {
        document.getElementById('err-review-horizon').textContent = 'Please select your time horizon.';
        horizon.classList.add('is-invalid');
        hasError = true;
      } else {
        horizon.classList.remove('is-invalid');
      }

      if (!consent.checked) {
        document.getElementById('err-review-consent').textContent = 'Your consent is required to contact you regarding your review.';
        hasError = true;
      }

      if (hasError) {
        showToast('Please fill all mandatory fields marked with *');
        return;
      }

      // Populate Success State
      const userNameEl = document.getElementById('success-user-name');
      const contactMethodEl = document.getElementById('success-contact-method');
      const method = document.getElementById('review-method').value;

      if (userNameEl) userNameEl.textContent = name.value.trim();
      if (contactMethodEl) contactMethodEl.textContent = method;

      reviewForm.style.display = 'none';
      if (reviewSuccessState) {
        reviewSuccessState.style.display = 'block';
      }

      showToast('Portfolio review request submitted successfully!');
    });
  }

  if (resetReviewFormBtn) {
    resetReviewFormBtn.addEventListener('click', () => {
      if (reviewForm) {
        reviewForm.reset();
        reviewForm.style.display = 'block';
      }
      if (reviewSuccessState) {
        reviewSuccessState.style.display = 'none';
      }
    });
  }

  // ==========================================================================
  // 6. FAQ ACCORDION CONTROLLER
  // ==========================================================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other active items for clean presentation
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.faq-trigger');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      if (isActive) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ==========================================================================
  // 7. MOBILE NAVIGATION DRAWER
  // ==========================================================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileCloseBtn = document.getElementById('mobile-close-btn');

  function toggleDrawer(open) {
    if (!mobileDrawer) return;
    if (open) {
      mobileDrawer.classList.add('open');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      mobileDrawer.classList.remove('open');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => toggleDrawer(true));
  }
  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', () => toggleDrawer(false));
  }

  document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', () => toggleDrawer(false));
  });

  // ==========================================================================
  // 8. TOAST NOTIFICATION UTILITY
  // ==========================================================================
  let toastTimer = null;
  function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  // Escape Key Handler for all open modals
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeLeadModal();
      closeLearnArticle();
      toggleDrawer(false);
    }
  });

  // Smooth active nav highlighting on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-links a[href*="${sectionId}"]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  }, { passive: true });

});
