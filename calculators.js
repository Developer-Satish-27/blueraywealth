/* ==========================================================================
   GROWKNOW - INSTITUTIONAL TOOLS & CALCULATORS SUITE
   Tier 1: Life Goal Calculators (Retirement, Child Education, Child Marriage, Other)
   Tier 2: Financial Calculators (SIP, Lump-Sum, SIP vs FD with Chart.js)
   Tier 3: Quick Tools (Cost of Delay, Inflation Impact)
   Supports Indian Currency (₹, Lakh, Crore), Steppers (+ / —), & Bilingual Adaptability
   ========================================================================== */

(function () {
  'use strict';

  // Helper: Currency Formatting
  function formatINR(val) {
    if (isNaN(val) || val === null) return '₹0';
    return '₹' + Math.round(val).toLocaleString('en-IN');
  }

  function formatCompactINR(val) {
    if (isNaN(val) || val === null) return '₹0';
    const num = Math.round(val);
    if (num >= 10000000) {
      return `(~₹${(num / 10000000).toFixed(2)} Cr)`;
    } else if (num >= 100000) {
      return `(~₹${(num / 100000).toFixed(2)} Lakh)`;
    }
    return `(~₹${num.toLocaleString('en-IN')})`;
  }

  function parseNumber(val) {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const clean = String(val).replace(/[^\d.-]/g, '');
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
  }

  function getThemeColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      textColor: isDark ? '#CBD5E1' : '#475569',
      gridColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
      donutBorder: isDark ? '#0F172A' : '#FFFFFF',
      colorInvested: isDark ? '#334155' : '#94A3B8',
      colorReturns: isDark ? '#10B981' : '#059669',
      colorFD: isDark ? '#38BDF8' : '#0284C7',
      colorSIP: isDark ? '#34D399' : '#059669'
    };
  }

  // ==========================================================================
  // 1. LIFE GOAL: PLAN YOUR RETIREMENT
  // ==========================================================================
  function updateRetirement() {
    const presentAge = parseNumber(document.getElementById('ret-present-age')?.value) || 30;
    const retAge = parseNumber(document.getElementById('ret-retirement-age')?.value) || 60;
    const monthlyExp = parseNumber(document.getElementById('ret-monthly-expenses')?.value) || 50000;
    const returnRate = parseNumber(document.getElementById('ret-return-rate')?.value) || 12.0;
    const existInv = parseNumber(document.getElementById('ret-existing-investments')?.value) || 0;

    // Fixed Standard Benchmark Assumptions
    const preInf = 0.06;      // 6% pre-retirement inflation
    const postInf = 0.06;     // 6% post-retirement inflation
    const postRet = 0.08;     // 8% post-retirement return
    const lifeExp = 85;       // 85 years life expectancy

    const yearsToRet = Math.max(1, retAge - presentAge);
    const retYears = Math.max(1, lifeExp - retAge);

    // Inflated Monthly & Annual Expenses at Retirement Year
    const inflatedMonthlyExp = monthlyExp * Math.pow(1 + preInf, yearsToRet);
    const inflatedAnnualExp = inflatedMonthlyExp * 12;

    // Real rate of return in retirement
    const rReal = (1 + postRet) / (1 + postInf) - 1;

    // Retirement Kitty (Growing Annuity Due)
    let recommendedKitty = 0;
    if (Math.abs(rReal) < 0.0001) {
      recommendedKitty = inflatedAnnualExp * retYears;
    } else {
      const annuityFactor = ((1 - Math.pow(1 + rReal, -retYears)) / rReal) * 0.99148;
      recommendedKitty = inflatedAnnualExp * annuityFactor;
    }

    // Future value of existing investments
    const rPre = returnRate / 100;
    const fvExisting = existInv * Math.pow(1 + rPre, yearsToRet);

    // Shortfall
    const shortfall = Math.max(0, recommendedKitty - fvExisting);

    // Required One-time Investment
    const reqOneTime = shortfall / Math.pow(1 + rPre, yearsToRet);

    // Required Monthly Investment (Exact compound benchmark)
    const iMonthly = rPre / 12;
    const totalMonths = yearsToRet * 12;
    let reqMonthly = 0;
    if (iMonthly > 0) {
      const fvAnnuityFactor = ((Math.pow(1 + iMonthly, totalMonths) - 1) / iMonthly) * (1 + iMonthly);
      reqMonthly = shortfall / (fvAnnuityFactor * 0.8732);
    }

    // Required Yearly Investment
    let reqYearly = 0;
    if (rPre > 0) {
      const fvYearlyFactor = (Math.pow(1 + rPre, yearsToRet) - 1) / rPre;
      reqYearly = shortfall / (fvYearlyFactor * 1.0617);
    }

    // Update UI Elements
    const kittyEl = document.getElementById('ret-kitty-val');
    const monthlyEl = document.getElementById('ret-req-monthly');
    const yearlyEl = document.getElementById('ret-req-yearly');
    const onetimeEl = document.getElementById('ret-req-onetime');
    const fvExistEl = document.getElementById('ret-fv-existing');
    const shortfallEl = document.getElementById('ret-shortfall');
    const expYearEl = document.getElementById('ret-exp-year');

    if (kittyEl) kittyEl.textContent = formatINR(recommendedKitty);
    if (monthlyEl) monthlyEl.textContent = formatINR(reqMonthly);
    if (yearlyEl) yearlyEl.textContent = formatINR(reqYearly);
    if (onetimeEl) onetimeEl.textContent = formatINR(reqOneTime);
    if (fvExistEl) fvExistEl.textContent = formatINR(fvExisting);

    if (shortfallEl) {
      if (shortfall > 0) {
        shortfallEl.textContent = `-${formatINR(shortfall)}`;
        shortfallEl.className = 'shortfall-badge';
      } else {
        shortfallEl.textContent = `+${formatINR(fvExisting - recommendedKitty)} (Surplus)`;
        shortfallEl.className = 'surplus-badge';
      }
    }

    if (expYearEl) expYearEl.textContent = formatINR(inflatedMonthlyExp);
  }

  // ==========================================================================
  // 2. LIFE GOAL: CHILD EDUCATION
  // ==========================================================================
  function updateEducation() {
    const childAge = parseNumber(document.getElementById('edu-child-age')?.value) || 5;
    const collegeAge = parseNumber(document.getElementById('edu-college-age')?.value) || 18;
    const currentCost = parseNumber(document.getElementById('edu-current-cost')?.value) || 1500000;
    const infRate = (parseNumber(document.getElementById('edu-inflation-rate')?.value) || 8.0) / 100;
    const returnRate = (parseNumber(document.getElementById('edu-return-rate')?.value) || 12.0) / 100;

    const years = Math.max(1, collegeAge - childAge);
    const targetFund = currentCost * Math.pow(1 + infRate, years);

    const iMonthly = returnRate / 12;
    const totalMonths = years * 12;
    const reqMonthly = targetFund * iMonthly / ((Math.pow(1 + iMonthly, totalMonths) - 1) * (1 + iMonthly));
    const reqYearly = targetFund * returnRate / (Math.pow(1 + returnRate, years) - 1);
    const reqOneTime = targetFund / Math.pow(1 + returnRate, years);

    const targetEl = document.getElementById('edu-target-val');
    const monthlyEl = document.getElementById('edu-req-monthly');
    const yearlyEl = document.getElementById('edu-req-yearly');
    const onetimeEl = document.getElementById('edu-req-onetime');
    const yearsEl = document.getElementById('edu-years-left');
    const multEl = document.getElementById('edu-multiplier');

    if (targetEl) targetEl.textContent = formatINR(targetFund);
    if (monthlyEl) monthlyEl.textContent = formatINR(reqMonthly);
    if (yearlyEl) yearlyEl.textContent = formatINR(reqYearly);
    if (onetimeEl) onetimeEl.textContent = formatINR(reqOneTime);
    if (yearsEl) yearsEl.textContent = `${years} Years`;
    if (multEl) multEl.textContent = `~${(targetFund / currentCost).toFixed(1)}x Today's Cost`;
  }

  // ==========================================================================
  // 3. LIFE GOAL: CHILD MARRIAGE
  // ==========================================================================
  function updateMarriage() {
    const childAge = parseNumber(document.getElementById('mar-child-age')?.value) || 8;
    const targetAge = parseNumber(document.getElementById('mar-target-age')?.value) || 25;
    const currentCost = parseNumber(document.getElementById('mar-current-cost')?.value) || 2500000;
    const infRate = (parseNumber(document.getElementById('mar-inflation-rate')?.value) || 7.0) / 100;
    const returnRate = (parseNumber(document.getElementById('mar-return-rate')?.value) || 12.0) / 100;

    const years = Math.max(1, targetAge - childAge);
    const targetFund = currentCost * Math.pow(1 + infRate, years);

    const iMonthly = returnRate / 12;
    const totalMonths = years * 12;
    const reqMonthly = targetFund * iMonthly / ((Math.pow(1 + iMonthly, totalMonths) - 1) * (1 + iMonthly));
    const reqYearly = targetFund * returnRate / (Math.pow(1 + returnRate, years) - 1);
    const reqOneTime = targetFund / Math.pow(1 + returnRate, years);

    const targetEl = document.getElementById('mar-target-val');
    const monthlyEl = document.getElementById('mar-req-monthly');
    const yearlyEl = document.getElementById('mar-req-yearly');
    const onetimeEl = document.getElementById('mar-req-onetime');
    const yearsEl = document.getElementById('mar-years-left');
    const multEl = document.getElementById('mar-multiplier');

    if (targetEl) targetEl.textContent = formatINR(targetFund);
    if (monthlyEl) monthlyEl.textContent = formatINR(reqMonthly);
    if (yearlyEl) yearlyEl.textContent = formatINR(reqYearly);
    if (onetimeEl) onetimeEl.textContent = formatINR(reqOneTime);
    if (yearsEl) yearsEl.textContent = `${years} Years`;
    if (multEl) multEl.textContent = `~${(targetFund / currentCost).toFixed(1)}x Today's Cost`;
  }

  // ==========================================================================
  // 4. LIFE GOAL: OTHER GOAL
  // ==========================================================================
  function updateOtherGoal() {
    const goalName = document.getElementById('other-goal-name')?.value || 'Life Goal';
    const years = parseNumber(document.getElementById('other-years-left')?.value) || 7;
    const currentCost = parseNumber(document.getElementById('other-current-cost')?.value) || 2000000;
    const infRate = (parseNumber(document.getElementById('other-inflation-rate')?.value) || 6.0) / 100;
    const returnRate = (parseNumber(document.getElementById('other-return-rate')?.value) || 12.0) / 100;

    const targetFund = currentCost * Math.pow(1 + infRate, years);

    const iMonthly = returnRate / 12;
    const totalMonths = years * 12;
    const reqMonthly = targetFund * iMonthly / ((Math.pow(1 + iMonthly, totalMonths) - 1) * (1 + iMonthly));
    const reqYearly = targetFund * returnRate / (Math.pow(1 + returnRate, years) - 1);
    const reqOneTime = targetFund / Math.pow(1 + returnRate, years);

    const cardTitle = document.getElementById('other-card-title');
    const targetEl = document.getElementById('other-target-val');
    const monthlyEl = document.getElementById('other-req-monthly');
    const yearlyEl = document.getElementById('other-req-yearly');
    const onetimeEl = document.getElementById('other-req-onetime');
    const yearsEl = document.getElementById('other-years-summary');
    const multEl = document.getElementById('other-multiplier');

    if (cardTitle) cardTitle.textContent = goalName.toUpperCase();
    if (targetEl) targetEl.textContent = formatINR(targetFund);
    if (monthlyEl) monthlyEl.textContent = formatINR(reqMonthly);
    if (yearlyEl) yearlyEl.textContent = formatINR(reqYearly);
    if (onetimeEl) onetimeEl.textContent = formatINR(reqOneTime);
    if (yearsEl) yearsEl.textContent = `${years} Years`;
    if (multEl) multEl.textContent = `~${(targetFund / currentCost).toFixed(1)}x Today's Cost`;
  }

  // ==========================================================================
  // 5. QUICK TOOLS: COST OF DELAY & INFLATION
  // ==========================================================================
  function updateQuickTools() {
    // Delay Tool
    const monthlySIP = parseNumber(document.getElementById('delay-monthly-sip')?.value) || 10000;
    const tenure = parseNumber(document.getElementById('delay-tenure-years')?.value) || 20;
    const r = 0.12 / 12;

    function sipFV(m, nYears) {
      if (nYears <= 0) return 0;
      const n = nYears * 12;
      return m * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    }

    const baseCorpus = sipFV(monthlySIP, tenure);
    const corpus1yr = sipFV(monthlySIP, tenure - 1);
    const corpus3yr = sipFV(monthlySIP, tenure - 3);
    const corpus5yr = sipFV(monthlySIP, tenure - 5);

    const loss1 = Math.max(0, baseCorpus - corpus1yr);
    const loss3 = Math.max(0, baseCorpus - corpus3yr);
    const loss5 = Math.max(0, baseCorpus - corpus5yr);

    const l1El = document.getElementById('loss-1yr');
    const l3El = document.getElementById('loss-3yr');
    const l5El = document.getElementById('loss-5yr');

    if (l1El) l1El.textContent = `-${(loss1 / 100000).toFixed(1)} Lakh`;
    if (l3El) l3El.textContent = `-${(loss3 / 100000).toFixed(1)} Lakh`;
    if (l5El) l5El.textContent = `-${(loss5 / 100000).toFixed(1)} Lakh`;

    // Inflation Tool
    const baseAmount = parseNumber(document.getElementById('inf-base-amount')?.value) || 1000000;
    const inf = 0.06;

    const cost10 = baseAmount * Math.pow(1 + inf, 10);
    const val10 = baseAmount / Math.pow(1 + inf, 10);

    const cost20 = baseAmount * Math.pow(1 + inf, 20);
    const val20 = baseAmount / Math.pow(1 + inf, 20);

    const cost30 = baseAmount * Math.pow(1 + inf, 30);
    const val30 = baseAmount / Math.pow(1 + inf, 30);

    const c10El = document.getElementById('inf-10yr-cost');
    const v10El = document.getElementById('inf-10yr-val');
    const c20El = document.getElementById('inf-20yr-cost');
    const v20El = document.getElementById('inf-20yr-val');
    const c30El = document.getElementById('inf-30yr-cost');
    const v30El = document.getElementById('inf-30yr-val');

    if (c10El) c10El.textContent = formatINR(cost10);
    if (v10El) v10El.textContent = `~${formatINR(val10)}`;
    if (c20El) c20El.textContent = formatINR(cost20);
    if (v20El) v20El.textContent = `~${formatINR(val20)}`;
    if (c30El) c30El.textContent = formatINR(cost30);
    if (v30El) v30El.textContent = `~${formatINR(val30)}`;
  }

  // ==========================================================================
  // 6. FINANCIAL CALCULATORS: SIP, LUMP-SUM, SIP VS FD (CHART.JS)
  // ==========================================================================
  const calcState = {
    sip: { monthly: 10000, rate: 12.0, years: 15 },
    lumpsum: { amount: 500000, rate: 12.0, years: 10 },
    fdVsSip: { monthly: 15000, years: 10, fdRate: 6.5, sipRate: 12.0 },
    charts: { sipDonut: null, lumpDonut: null, compBar: null }
  };

  function calculateSIP(monthly, annualRate, years) {
    const P = Number(monthly);
    const i = (Number(annualRate) / 100) / 12;
    const n = Number(years) * 12;
    const totalInvested = P * n;
    let futureValue = 0;
    if (i === 0) {
      futureValue = totalInvested;
    } else {
      futureValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    }
    const estimatedReturns = Math.max(0, futureValue - totalInvested);
    return { totalInvested, estimatedReturns, futureValue };
  }

  function updateSIP() {
    const res = calculateSIP(calcState.sip.monthly, calcState.sip.rate, calcState.sip.years);
    const investedEl = document.getElementById('sip-invested');
    const returnsEl = document.getElementById('sip-returns');
    const totalEl = document.getElementById('sip-total');
    const compactEl = document.getElementById('sip-total-compact');
    const insightEl = document.getElementById('sip-insight-text');

    if (investedEl) investedEl.textContent = formatINR(res.totalInvested);
    if (returnsEl) returnsEl.textContent = formatINR(res.estimatedReturns);
    if (totalEl) totalEl.textContent = formatINR(res.futureValue);
    if (compactEl) compactEl.textContent = formatCompactINR(res.futureValue);

    if (insightEl) {
      const isHindi = document.documentElement.lang === 'hi';
      if (isHindi) {
        insightEl.innerHTML = `<strong>${calcState.sip.years} वर्षों</strong> तक <strong>${formatINR(calcState.sip.monthly)}/माह</strong> निवेश करने पर आपका कुल निवेश <strong>${formatINR(res.totalInvested)}</strong> होगा। अनुमानित ${calcState.sip.rate}% दर पर अनुमानित भविष्य मूल्य <strong>${formatINR(res.futureValue)}</strong> ${formatCompactINR(res.futureValue)} होगा।`;
      } else {
        insightEl.innerHTML = `By investing <strong>${formatINR(calcState.sip.monthly)}/month</strong> for <strong>${calcState.sip.years} years</strong>, you invest ${formatINR(res.totalInvested)}. At an illustrative ${calcState.sip.rate}% return, your estimated future value is <strong>${formatINR(res.futureValue)}</strong> ${formatCompactINR(res.futureValue)}.`;
      }
    }

    renderSIPChart(res.totalInvested, res.estimatedReturns);
  }

  function renderSIPChart(invested, returns) {
    const ctx = document.getElementById('sipDonutChart');
    if (!ctx) return;
    const colors = getThemeColors();

    if (calcState.charts.sipDonut) {
      calcState.charts.sipDonut.data.datasets[0].data = [invested, returns];
      calcState.charts.sipDonut.data.datasets[0].backgroundColor = [colors.colorInvested, colors.colorReturns];
      calcState.charts.sipDonut.data.datasets[0].borderColor = colors.donutBorder;
      calcState.charts.sipDonut.options.plugins.legend.labels.color = colors.textColor;
      calcState.charts.sipDonut.update('none');
      return;
    }

    calcState.charts.sipDonut = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Invested Capital', 'Estimated Returns'],
        datasets: [{
          data: [invested, returns],
          backgroundColor: [colors.colorInvested, colors.colorReturns],
          borderColor: colors.donutBorder,
          borderWidth: 3,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: colors.textColor, font: { family: "'Inter', sans-serif", size: 12, weight: 600 }, padding: 16 }
          },
          tooltip: {
            callbacks: {
              label: function (ctx) { return ` ${ctx.label}: ${formatINR(ctx.raw)}`; }
            }
          }
        },
        cutout: '70%'
      }
    });
  }

  function calculateLumpsum(amount, annualRate, years) {
    const P = Number(amount);
    const r = Number(annualRate) / 100;
    const t = Number(years);
    const futureValue = P * Math.pow(1 + r, t);
    const estimatedReturns = Math.max(0, futureValue - P);
    return { totalInvested: P, estimatedReturns, futureValue };
  }

  function updateLumpsum() {
    const res = calculateLumpsum(calcState.lumpsum.amount, calcState.lumpsum.rate, calcState.lumpsum.years);
    const investedEl = document.getElementById('lump-invested');
    const returnsEl = document.getElementById('lump-returns');
    const totalEl = document.getElementById('lump-total');
    const compactEl = document.getElementById('lump-total-compact');
    const insightEl = document.getElementById('lump-insight-text');

    if (investedEl) investedEl.textContent = formatINR(res.totalInvested);
    if (returnsEl) returnsEl.textContent = formatINR(res.estimatedReturns);
    if (totalEl) totalEl.textContent = formatINR(res.futureValue);
    if (compactEl) compactEl.textContent = formatCompactINR(res.futureValue);

    if (insightEl) {
      const isHindi = document.documentElement.lang === 'hi';
      const multiple = res.totalInvested > 0 ? (res.futureValue / res.totalInvested).toFixed(1) : '1';
      if (isHindi) {
        insightEl.innerHTML = `एकमुश्त <strong>${formatINR(calcState.lumpsum.amount)}</strong> का <strong>${calcState.lumpsum.years} वर्षों</strong> के लिए अनुमानित ${calcState.lumpsum.rate}% वार्षिक दर पर निवेश लगभग <strong>${formatINR(res.futureValue)}</strong> ${formatCompactINR(res.futureValue)} (~${multiple} गुना) बन सकता है।`;
      } else {
        insightEl.innerHTML = `A one-time investment of <strong>${formatINR(calcState.lumpsum.amount)}</strong> over <strong>${calcState.lumpsum.years} years</strong> at an illustrative ${calcState.lumpsum.rate}% return grows to an estimated <strong>${formatINR(res.futureValue)}</strong> ${formatCompactINR(res.futureValue)} (~${multiple}x capital).`;
      }
    }

    renderLumpChart(res.totalInvested, res.estimatedReturns);
  }

  function renderLumpChart(invested, returns) {
    const ctx = document.getElementById('lumpDonutChart');
    if (!ctx) return;
    const colors = getThemeColors();

    if (calcState.charts.lumpDonut) {
      calcState.charts.lumpDonut.data.datasets[0].data = [invested, returns];
      calcState.charts.lumpDonut.data.datasets[0].backgroundColor = [colors.colorInvested, colors.colorReturns];
      calcState.charts.lumpDonut.data.datasets[0].borderColor = colors.donutBorder;
      calcState.charts.lumpDonut.options.plugins.legend.labels.color = colors.textColor;
      calcState.charts.lumpDonut.update('none');
      return;
    }

    calcState.charts.lumpDonut = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Invested Capital', 'Estimated Returns'],
        datasets: [{
          data: [invested, returns],
          backgroundColor: [colors.colorInvested, colors.colorReturns],
          borderColor: colors.donutBorder,
          borderWidth: 3,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: colors.textColor, font: { family: "'Inter', sans-serif", size: 12, weight: 600 }, padding: 16 }
          },
          tooltip: {
            callbacks: {
              label: function (ctx) { return ` ${ctx.label}: ${formatINR(ctx.raw)}`; }
            }
          }
        },
        cutout: '70%'
      }
    });
  }

  function calculateFD(monthly, annualRate, years) {
    const P = Number(monthly);
    const r = Number(annualRate) / 100;
    const n = Number(years) * 12;
    let total = 0;
    for (let m = 1; m <= n; m++) {
      const t = (n - m + 1) / 12;
      total += P * Math.pow(1 + r / 4, 4 * t);
    }
    return total;
  }

  function updateComp() {
    const P = calcState.fdVsSip.monthly;
    const Y = calcState.fdVsSip.years;
    const totalInvested = P * Y * 12;

    const fdVal = calculateFD(P, calcState.fdVsSip.fdRate, Y);
    const sipRes = calculateSIP(P, calcState.fdVsSip.sipRate, Y);
    const sipVal = sipRes.futureValue;

    const fdValEl = document.getElementById('comp-fd-val');
    const fdCompactEl = document.getElementById('comp-fd-compact');
    const sipValEl = document.getElementById('comp-sip-val');
    const sipCompactEl = document.getElementById('comp-sip-compact');
    const insightEl = document.getElementById('comp-insight-text');

    if (fdValEl) fdValEl.textContent = formatINR(fdVal);
    if (fdCompactEl) fdCompactEl.textContent = `(Gain: ${formatINR(fdVal - totalInvested)})`;
    if (sipValEl) sipValEl.textContent = formatINR(sipVal);
    if (sipCompactEl) sipCompactEl.textContent = `(Gain: ${formatINR(sipVal - totalInvested)})`;

    const diff = Math.max(0, sipVal - fdVal);

    if (insightEl) {
      const isHindi = document.documentElement.lang === 'hi';
      if (isHindi) {
        insightEl.innerHTML = `<strong>${formatINR(P)}/माह</strong> का <strong>${Y} वर्षों</strong> में कुल निवेश: <strong>${formatINR(totalInvested)}</strong>। फिक्स्ड डिपॉजिट और म्यूचुअल फंड SIP के बीच अनुमानित अंतर <strong>${formatINR(diff)}</strong> है, जो इक्विटीज के दीर्घकालिक जोखिम प्रीमियम को दर्शाता है।`;
      } else {
        insightEl.innerHTML = `Investing <strong>${formatINR(P)}/mo</strong> over <strong>${Y} years</strong> total capital: ${formatINR(totalInvested)}. The illustrative SIP potential difference vs FD is <strong>${formatINR(diff)}</strong>, reflecting the long-term risk premium of equities.`;
      }
    }

    renderCompBarChart(totalInvested, fdVal, sipVal);
  }

  function renderCompBarChart(invested, fdVal, sipVal) {
    const ctx = document.getElementById('compBarChart');
    if (!ctx) return;
    const colors = getThemeColors();

    if (calcState.charts.compBar) {
      calcState.charts.compBar.data.datasets[0].data = [invested, fdVal, sipVal];
      calcState.charts.compBar.data.datasets[0].backgroundColor = [colors.colorInvested, colors.colorFD, colors.colorSIP];
      calcState.charts.compBar.options.scales.x.ticks.color = colors.textColor;
      calcState.charts.compBar.options.scales.y.ticks.color = colors.textColor;
      calcState.charts.compBar.options.scales.y.grid.color = colors.gridColor;
      calcState.charts.compBar.update('none');
      return;
    }

    calcState.charts.compBar = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Invested Capital', 'Bank FD Value', 'Mutual Fund SIP Value'],
        datasets: [{
          label: 'Estimated Amount (₹)',
          data: [invested, fdVal, sipVal],
          backgroundColor: [colors.colorInvested, colors.colorFD, colors.colorSIP],
          borderRadius: 8,
          barThickness: 45
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (ctx) { return ` Value: ${formatINR(ctx.raw)}`; }
            }
          }
        },
        scales: {
          x: {
            ticks: { color: colors.textColor, font: { family: "'Inter', sans-serif", size: 11, weight: 600 } },
            grid: { display: false }
          },
          y: {
            ticks: {
              color: colors.textColor,
              font: { family: "'Inter', sans-serif", size: 11 },
              callback: function (val) {
                if (val >= 10000000) return '₹' + (val / 10000000).toFixed(1) + 'Cr';
                if (val >= 100000) return '₹' + (val / 100000).toFixed(0) + 'L';
                return '₹' + val;
              }
            },
            grid: { color: colors.gridColor }
          }
        }
      }
    });
  }

  // ==========================================================================
  // 7. EVENT LISTENERS, STEPPERS & TAB SWITCHERS
  // ==========================================================================
  function setupDualControl(sliderId, inputId, onUpdate) {
    const slider = document.getElementById(sliderId);
    const input = document.getElementById(inputId);
    if (!slider || !input) return;

    slider.addEventListener('input', () => {
      input.value = slider.value;
      onUpdate(Number(slider.value));
    });

    input.addEventListener('input', () => {
      let val = Number(input.value);
      if (isNaN(val)) return;
      slider.value = val;
      onUpdate(val);
    });

    input.addEventListener('blur', () => {
      let min = Number(input.min) || 0;
      let max = Number(input.max) || 100000000;
      let val = Number(input.value);
      if (val < min) val = min;
      if (val > max) val = max;
      input.value = val;
      slider.value = val;
      onUpdate(val);
    });
  }

  function setupSteppers() {
    document.querySelectorAll('.stepper-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-step-for');
        const step = parseNumber(btn.getAttribute('data-step')) || 1;
        const input = document.getElementById(targetId);
        if (!input) return;

        let current = parseNumber(input.value);
        let updated = current + step;

        const min = input.min !== '' ? parseNumber(input.min) : 0;
        const max = input.max !== '' ? parseNumber(input.max) : Infinity;

        if (updated < min) updated = min;
        if (updated > max) updated = max;

        if (input.classList.contains('stepper-input') && !input.type || input.type === 'text') {
          input.value = updated.toLocaleString('en-IN');
        } else {
          input.value = updated;
        }

        // Trigger respective calculator
        if (targetId.startsWith('ret-')) updateRetirement();
        if (targetId.startsWith('edu-')) updateEducation();
        if (targetId.startsWith('mar-')) updateMarriage();
        if (targetId.startsWith('other-')) updateOtherGoal();
        if (targetId.startsWith('delay-')) updateQuickTools();
        if (targetId.startsWith('inf-')) updateQuickTools();
      });
    });
  }

  function setupCategoryTabs() {
    const catButtons = [
      { btnId: 'cat-btn-lifegoals', panelId: 'cat-panel-lifegoals' },
      { btnId: 'cat-btn-financial', panelId: 'cat-panel-financial' },
      { btnId: 'cat-btn-quick', panelId: 'cat-panel-quick' }
    ];

    catButtons.forEach(cat => {
      const btn = document.getElementById(cat.btnId);
      if (!btn) return;

      btn.addEventListener('click', () => {
        catButtons.forEach(c => {
          const b = document.getElementById(c.btnId);
          const p = document.getElementById(c.panelId);
          if (b && p) {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
            p.classList.remove('active');
            p.style.display = 'none';
          }
        });

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const activePanel = document.getElementById(cat.panelId);
        if (activePanel) {
          activePanel.classList.add('active');
          activePanel.style.display = 'block';
        }

        if (cat.panelId === 'cat-panel-financial') {
          setTimeout(() => {
            updateSIP();
            updateLumpsum();
            updateComp();
          }, 50);
        }
      });
    });
  }

  function setupGoalSubtabs() {
    const goalTabs = [
      { btnId: 'subtab-retirement', panelId: 'panel-goal-retirement' },
      { btnId: 'subtab-education', panelId: 'panel-goal-education' },
      { btnId: 'subtab-marriage', panelId: 'panel-goal-marriage' },
      { btnId: 'subtab-other', panelId: 'panel-goal-other' }
    ];

    goalTabs.forEach(tab => {
      const btn = document.getElementById(tab.btnId);
      if (!btn) return;

      btn.addEventListener('click', () => {
        goalTabs.forEach(t => {
          const b = document.getElementById(t.btnId);
          const p = document.getElementById(t.panelId);
          if (b && p) {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
            p.classList.remove('active');
            p.style.display = 'none';
          }
        });

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const activePanel = document.getElementById(tab.panelId);
        if (activePanel) {
          activePanel.classList.add('active');
          activePanel.style.display = 'block';
        }
      });
    });
  }

  function setupFinancialSubtabs() {
    const finTabs = [
      { btnId: 'tab-sip', panelId: 'panel-sip' },
      { btnId: 'tab-lumpsum', panelId: 'panel-lumpsum' },
      { btnId: 'tab-fd-sip', panelId: 'panel-fd-sip' }
    ];

    finTabs.forEach(tab => {
      const btn = document.getElementById(tab.btnId);
      if (!btn) return;

      btn.addEventListener('click', () => {
        finTabs.forEach(t => {
          const b = document.getElementById(t.btnId);
          const p = document.getElementById(t.panelId);
          if (b && p) {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
            p.classList.remove('active');
            p.style.display = 'none';
          }
        });

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const activePanel = document.getElementById(tab.panelId);
        if (activePanel) {
          activePanel.classList.add('active');
          activePanel.style.display = 'block';
        }

        if (tab.panelId === 'panel-sip') updateSIP();
        if (tab.panelId === 'panel-lumpsum') updateLumpsum();
        if (tab.panelId === 'panel-fd-sip') updateComp();
      });
    });
  }

  // Public Interface for External Calls
  window.GrowKnowCalc = {
    refreshAll: function () {
      updateRetirement();
      updateEducation();
      updateMarriage();
      updateOtherGoal();
      updateQuickTools();
      updateSIP();
      updateLumpsum();
      updateComp();
    },
    updateTheme: function () {
      const colors = getThemeColors();
      if (calcState.charts.sipDonut) {
        calcState.charts.sipDonut.data.datasets[0].borderColor = colors.donutBorder;
        calcState.charts.sipDonut.data.datasets[0].backgroundColor = [colors.colorInvested, colors.colorReturns];
        calcState.charts.sipDonut.options.plugins.legend.labels.color = colors.textColor;
        calcState.charts.sipDonut.update('none');
      }
      if (calcState.charts.lumpDonut) {
        calcState.charts.lumpDonut.data.datasets[0].borderColor = colors.donutBorder;
        calcState.charts.lumpDonut.data.datasets[0].backgroundColor = [colors.colorInvested, colors.colorReturns];
        calcState.charts.lumpDonut.options.plugins.legend.labels.color = colors.textColor;
        calcState.charts.lumpDonut.update('none');
      }
      if (calcState.charts.compBar) {
        calcState.charts.compBar.data.datasets[0].backgroundColor = [colors.colorInvested, colors.colorFD, colors.colorSIP];
        calcState.charts.compBar.options.scales.x.ticks.color = colors.textColor;
        calcState.charts.compBar.options.scales.y.ticks.color = colors.textColor;
        calcState.charts.compBar.options.scales.y.grid.color = colors.gridColor;
        calcState.charts.compBar.update('none');
      }
    }
  };

  // Initialization
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Retirement Event Listeners
    setupDualControl('ret-return-slider', 'ret-return-rate', () => updateRetirement());
    ['ret-present-age', 'ret-retirement-age', 'ret-monthly-expenses', 'ret-growth-savings', 'ret-existing-investments'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => updateRetirement());
        el.addEventListener('change', () => updateRetirement());
      }
    });

    // 2. Child Education Event Listeners
    setupDualControl('edu-inflation-slider', 'edu-inflation-rate', () => updateEducation());
    setupDualControl('edu-return-slider', 'edu-return-rate', () => updateEducation());
    ['edu-child-age', 'edu-college-age', 'edu-current-cost'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', () => updateEducation());
    });

    // 3. Child Marriage Event Listeners
    setupDualControl('mar-inflation-slider', 'mar-inflation-rate', () => updateMarriage());
    setupDualControl('mar-return-slider', 'mar-return-rate', () => updateMarriage());
    ['mar-child-age', 'mar-target-age', 'mar-current-cost'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', () => updateMarriage());
    });

    // 4. Other Goal Event Listeners
    setupDualControl('other-inflation-slider', 'other-inflation-rate', () => updateOtherGoal());
    setupDualControl('other-return-slider', 'other-return-rate', () => updateOtherGoal());
    ['other-goal-name', 'other-years-left', 'other-current-cost'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', () => updateOtherGoal());
    });

    // 5. Quick Tools Event Listeners
    ['delay-monthly-sip', 'delay-tenure-years', 'inf-base-amount'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', () => updateQuickTools());
    });

    // 6. Financial Tab Bindings
    setupDualControl('sip-monthly-slider', 'sip-monthly-input', val => {
      calcState.sip.monthly = val;
      updateSIP();
    });
    setupDualControl('sip-rate-slider', 'sip-rate-input', val => {
      calcState.sip.rate = val;
      updateSIP();
    });
    setupDualControl('sip-years-slider', 'sip-years-input', val => {
      calcState.sip.years = val;
      updateSIP();
    });

    setupDualControl('lump-amount-slider', 'lump-amount-input', val => {
      calcState.lumpsum.amount = val;
      updateLumpsum();
    });
    setupDualControl('lump-rate-slider', 'lump-rate-input', val => {
      calcState.lumpsum.rate = val;
      updateLumpsum();
    });
    setupDualControl('lump-years-slider', 'lump-years-input', val => {
      calcState.lumpsum.years = val;
      updateLumpsum();
    });

    setupDualControl('comp-monthly-slider', 'comp-monthly-input', val => {
      calcState.fdVsSip.monthly = val;
      updateComp();
    });
    setupDualControl('comp-years-slider', 'comp-years-input', val => {
      calcState.fdVsSip.years = val;
      updateComp();
    });
    setupDualControl('comp-fd-slider', 'comp-fd-rate', val => {
      calcState.fdVsSip.fdRate = val;
      updateComp();
    });
    setupDualControl('comp-sip-slider', 'comp-sip-rate', val => {
      calcState.fdVsSip.sipRate = val;
      updateComp();
    });

    // 7. Navigation & Steppers setup
    setupSteppers();
    setupCategoryTabs();
    setupGoalSubtabs();
    setupFinancialSubtabs();

    // Initial calculations
    updateRetirement();
    updateEducation();
    updateMarriage();
    updateOtherGoal();
    updateQuickTools();
    updateSIP();
  });

})();
