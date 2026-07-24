// JavaScript Application Logic - StatCraft
// Handles routing, searching, tabs, and interactive calculators

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Sidebar Navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetSection = item.getAttribute('data-target');
            switchSection(targetSection);
        });
    });

    // 2. Initialize Mobile Navigation Toggle
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const appContainer = document.querySelector('.app-container');
    
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            appContainer.classList.toggle('sidebar-open');
            const icon = mobileNavToggle.querySelector('i');
            if (icon) {
                if (appContainer.classList.contains('sidebar-open')) {
                    icon.className = 'fa-solid fa-xmark';
                } else {
                    icon.className = 'fa-solid fa-bars';
                }
            }
        });
    }

    // Close button inside sidebar on mobile
    const btnCloseSidebar = document.getElementById('btn-close-sidebar');
    if (btnCloseSidebar) {
        btnCloseSidebar.addEventListener('click', () => {
            appContainer.classList.remove('sidebar-open');
            const icon = mobileNavToggle ? mobileNavToggle.querySelector('i') : null;
            if (icon) icon.className = 'fa-solid fa-bars';
        });
    }

    // Backdrop click listener to close sidebar drawer
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');
    if (sidebarBackdrop) {
        sidebarBackdrop.addEventListener('click', () => {
            appContainer.classList.remove('sidebar-open');
            const icon = mobileNavToggle ? mobileNavToggle.querySelector('i') : null;
            if (icon) icon.className = 'fa-solid fa-bars';
        });
    }

    // Close sidebar on item click (for mobile layout)
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            appContainer.classList.remove('sidebar-open');
            const icon = mobileNavToggle ? mobileNavToggle.querySelector('i') : null;
            if (icon) icon.className = 'fa-solid fa-bars';
        });
    });

    // 3. Quick Calculator Lab Button
    const btnQuickLab = document.getElementById('btn-quick-lab');
    if (btnQuickLab) {
        btnQuickLab.addEventListener('click', () => {
            switchSection('labs');
        });
    }

    // 4. Topic Search Box
    const searchInput = document.getElementById('topic-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterTopics(e.target.value.toLowerCase());
        });
    }

    // 5. Initialize default states
    calculateZScoreLab(); // Draw default Normal Curve
    toggleBayesInputs();   // Show correct Bayes inputs
    toggleHypothesisInputs(); // Show correct hypothesis inputs

    // 6. PDF Modal Handlers
    const btnViewPdf = document.getElementById('btn-view-pdf');
    const btnHeroViewPdf = document.getElementById('btn-hero-view-pdf');
    const btnSidebarViewPdf = document.getElementById('btn-sidebar-view-pdf');
    const pdfModal = document.getElementById('pdf-modal');
    const closePdfModal = document.getElementById('close-pdf-modal');

    if (pdfModal && closePdfModal) {
        const openModal = () => pdfModal.classList.add('active');
        const closeModal = () => pdfModal.classList.remove('active');

        if (btnViewPdf) btnViewPdf.addEventListener('click', openModal);
        if (btnHeroViewPdf) btnHeroViewPdf.addEventListener('click', openModal);
        if (btnSidebarViewPdf) btnSidebarViewPdf.addEventListener('click', openModal);

        closePdfModal.addEventListener('click', closeModal);

        // Close when clicking outside of modal container (overlay background)
        pdfModal.addEventListener('click', (e) => {
            if (e.target === pdfModal) {
                closeModal();
            }
        });
    }
});

// ROUTING: Switch between main sections
function switchSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(sec => sec.classList.remove('active'));

    // Show target section
    const targetSec = document.getElementById(`sec-${sectionId}`);
    if (targetSec) {
        targetSec.classList.add('active');
        
        // Scroll content window back to top
        const scrollBody = document.getElementById('content-body-scroll');
        if (scrollBody) scrollBody.scrollTop = 0;
    }

    // Update active nav item
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-target') === sectionId) {
            item.classList.add('active');
        }
    });

    // Update page title text
    const pageTitle = document.getElementById('page-title');
    const titles = {
        'intro': 'পরিসংখ্যান ও চিত্রায়ন হাব (Statistics & Visualization)',
        'tables': 'ওয়ান-ওয়ে ও টু-ওয়ে টেবিল (Data Tables)',
        'visualization': 'উপাত্ত চিত্রায়ন (Data Visualization Graphs)',
        'central-tendency': 'কেন্দ্রীয় প্রবণতা (Measure of Central Tendency)',
        'spread': 'বিস্তার পরিমাপ ও আউটলায়ার (Measure of Spread & Outliers)',
        'distribution': 'স্বাভাবিক বিন্যাস ও Z-স্কোর (Normal Distribution & Z-Score)',
        'bivariate': 'সহভেদ ও সহসম্পর্ক (Covariance and Correlation)',
        'probability': 'সম্ভাব্যতা ও বেইস থিওরেম (Probability & Bayes)',
        'hypothesis': 'অনুকল্প যাচাই (Hypothesis Testing)',
        'labs': 'পরিসংখ্যান ল্যাব (Interactive Calculator Labs)'
    };
    if (pageTitle && titles[sectionId]) {
        pageTitle.innerHTML = titles[sectionId];
    }

    // Trigger MathJax typeset to render LaTeX
    if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise();
    }
}

// SEARCH: Filter navigation menu items
function filterTopics(query) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        const text = item.querySelector('span').textContent.toLowerCase();
        if (text.includes(query)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// TABS: Switch between calculator tabs
function switchTab(tabId) {
    // Hide all tab contents
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));

    // Deactivate all tab buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Activate selected content and button
    document.getElementById(tabId).classList.add('active');
    
    // Find active tab button by search attributes
    buttons.forEach(btn => {
        if (btn.getAttribute('onclick').includes(tabId)) {
            btn.classList.add('active');
        }
    });

    // Trigger MathJax update for formulas inside tabs
    if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise();
    }
}

// Helper: Load sample data for calculators
function loadSampleData(type) {
    if (type === 'desc') {
        // Book example dataset (combining student ages and outliers test data)
        document.getElementById('desc-input').value = "22, 23, 24, 25, 22, 18, 30, 45, 12, 23, 24";
        calculateDescriptiveStats();
    }
}

// ==========================================
// CALCULATOR 1: Descriptive Statistics
// ==========================================
function calculateDescriptiveStats() {
    const inputVal = document.getElementById('desc-input').value;
    const resultsBox = document.getElementById('desc-results-box');

    // Parse input
    let numbers = inputVal.split(',')
        .map(n => parseFloat(n.trim()))
        .filter(n => !isNaN(n));

    if (numbers.length === 0) {
        resultsBox.innerHTML = `<p class="placeholder-text" style="color: #c92a2a;"><i class="fa-solid fa-circle-xmark"></i> অনুগ্রহ করে কিছু সঠিক সংখ্যা কমা দিয়ে আলাদা করে প্রবেশ করান!</p>`;
        return;
    }

    const n = numbers.length;
    
    // 1. Sort numbers
    const sorted = [...numbers].sort((a, b) => a - b);
    
    // 2. Mean
    const sum = sorted.reduce((acc, curr) => acc + curr, 0);
    const mean = sum / n;
    
    // 3. Median
    let median;
    if (n % 2 === 1) {
        median = sorted[Math.floor(n / 2)];
    } else {
        median = (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
    }
    
    // 4. Mode
    const freq = {};
    let maxFreq = 0;
    sorted.forEach(num => {
        freq[num] = (freq[num] || 0) + 1;
        if (freq[num] > maxFreq) maxFreq = freq[num];
    });
    
    let modes = [];
    if (maxFreq > 1) {
        for (let num in freq) {
            if (freq[num] === maxFreq) {
                modes.push(num);
            }
        }
    }
    const modeText = modes.length > 0 ? modes.join(', ') : 'কোনো প্রচুরক নেই (No unique mode)';

    // 5. Min, Max, Range
    const min = sorted[0];
    const max = sorted[n - 1];
    const range = max - min;

    // 6. Quartiles (Standard Percentile Interpolation)
    const getPercentile = (p) => {
        const idx = (n - 1) * p;
        const base = Math.floor(idx);
        const rest = idx - base;
        if (sorted[base + 1] !== undefined) {
            return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
        }
        return sorted[base];
    };
    
    const q1 = getPercentile(0.25);
    const q3 = getPercentile(0.75);
    const iqr = q3 - q1;

    // 7. Variance & Standard Deviation
    const sqDiffSum = sorted.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0);
    const popVariance = sqDiffSum / n;
    const sampleVariance = n > 1 ? sqDiffSum / (n - 1) : 0;
    const popSD = Math.sqrt(popVariance);
    const sampleSD = Math.sqrt(sampleVariance);

    // 8. Outliers Detection (1.5 * IQR Rule)
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    const outliers = sorted.filter(x => x < lowerBound || x > upperBound);
    const outlierText = outliers.length > 0 
        ? outliers.join(', ') + ' [সীমা: ' + lowerBound.toFixed(2) + ' থেকে ' + upperBound.toFixed(2) + ']'
        : 'কোনো আউটলায়ার পাওয়া যায়নি (No outliers found)';

    // Render results
    resultsBox.innerHTML = `
        <div class="results-header">
            <h3>বিশ্লেষণ ফলাফল (Descriptive Stats Output)</h3>
            <span class="badge">n = ${n}</span>
        </div>
        <table class="result-table">
            <tr>
                <th>গড় (Mean / Average)</th>
                <td><strong>${mean.toFixed(4)}</strong> <br><small>যোগফল: ${sum}, ভাগ: ${n}</small></td>
            </tr>
            <tr>
                <th>মধ্যমা (Median)</th>
                <td><strong>${median.toFixed(2)}</strong> <br><small>সাজানো ডাটা: ${sorted.join(', ')}</small></td>
            </tr>
            <tr>
                <th>প্রচুরক (Mode)</th>
                <td><strong>${modeText}</strong></td>
            </tr>
            <tr>
                <th>সর্বনিম্ন মান (Minimum)</th>
                <td><strong>${min}</strong></td>
            </tr>
            <tr>
                <th>সর্বোচ্চ মান (Maximum)</th>
                <td><strong>${max}</strong></td>
            </tr>
            <tr>
                <th>পরিসর (Range)</th>
                <td><strong>${range}</strong> (Max - Min)</td>
            </tr>
            <tr>
                <th>চতুর্থক ব্যবধান (IQR)</th>
                <td><strong>${iqr.toFixed(2)}</strong> <br><small>Q1 (25%): ${q1.toFixed(2)}, Q3 (75%): ${q3.toFixed(2)}</small></td>
            </tr>
            <tr>
                <th>ভেদাঙ্ক (Variance)</th>
                <td>
                    পপুলেশন ($\sigma^2$): <strong>${popVariance.toFixed(4)}</strong><br>
                    নমুনা ($S^2$): <strong>${sampleVariance.toFixed(4)}</strong>
                </td>
            </tr>
            <tr>
                <th>পরিমিত ব্যবধান (Std Dev)</th>
                <td>
                    পপুলেশন ($\sigma$): <strong>${popSD.toFixed(4)}</strong><br>
                    নমুনা ($S$): <strong>${sampleSD.toFixed(4)}</strong>
                </td>
            </tr>
            <tr>
                <th>আউটলায়ার (Outliers)</th>
                <td>
                    <span style="color: ${outliers.length > 0 ? '#d9480f' : 'inherit'}; font-weight: ${outliers.length > 0 ? '600' : 'normal'}">
                        ${outlierText}
                    </span>
                </td>
            </tr>
        </table>
        
        <div class="example-box" style="margin-top: 15px;">
            <strong>বাংলা ব্যাখ্যা:</strong> আপনার প্রদানকৃত তথ্যে গড় হলো ${mean.toFixed(2)} এবং মাঝখানের মান বা মধ্যমা হলো ${median.toFixed(2)}। 
            উপাত্তের মানগুলো গড় থেকে গড়ে ${sampleSD.toFixed(2)} ব্যবধানে ছড়িয়ে আছে (Standard Deviation)। 
            ${outliers.length > 0 
                ? `এখানে কিছু মান স্বাভাবিক সীমার বাইরের পাওয়া গেছে যা মূলত <strong>আউটলায়ার</strong>।` 
                : `সবগুলো মানই স্বাভাবিক সীমার মধ্যে অবস্থান করছে।`}
        </div>
    `;

    // Render Math inside results
    if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise();
    }
}

// ==========================================
// CALCULATOR 2: Z-Score & Normal Curve
// ==========================================
function calculateZScoreLab() {
    const x = parseFloat(document.getElementById('z-val-x').value);
    const mean = parseFloat(document.getElementById('z-mean').value);
    const sd = parseFloat(document.getElementById('z-sd').value);

    const mathOutput = document.getElementById('z-score-math-output');
    const interpretationText = document.getElementById('z-score-interpretation');

    if (isNaN(x) || isNaN(mean) || isNaN(sd) || sd <= 0) {
        mathOutput.innerHTML = `<span style="color: #c92a2a;">ত্রুটি: সঠিক সংখ্যা ইনপুট দিন এবং স্ট্যান্ডার্ড ডেভিয়েশন অবশ্যই ০ থেকে বড় হতে হবে!</span>`;
        return;
    }

    // Compute Z-Score
    const z = (x - mean) / sd;

    // Normal Cumulative Probability Approximation (CDF of Standard Normal)
    // Using polynomial approximation of erf
    const getNormalProbability = (zVal) => {
        // Standard normal CDF approximation
        const sign = zVal < 0 ? -1 : 1;
        const absZ = Math.abs(zVal);
        
        // Polynomial approximation constants
        const c1 = 0.196854;
        const c2 = 0.115194;
        const c3 = 0.000344;
        const c4 = 0.019527;
        
        const term = 1 + c1*absZ + c2*Math.pow(absZ, 2) + c3*Math.pow(absZ, 3) + c4*Math.pow(absZ, 4);
        const p = 1 - 0.5 * Math.pow(term, -4);
        
        return sign === 1 ? p : 1 - p;
    };

    const probBelow = getNormalProbability(z);
    const probAbove = 1 - probBelow;

    // LaTeX Math Steps Output
    mathOutput.innerHTML = `
        <p><strong>ধাপ-১: Z-Score নির্ণয়ের সূত্র বসাই:</strong></p>
        <div class="formula-display">
            $$Z = \\frac{X - \\mu}{\\sigma}$$
        </div>
        <p><strong>ধাপ-২: মানগুলো ইনপুট করি:</strong></p>
        <div class="formula-display">
            $$Z = \\frac{${x} - ${mean}}{${sd}} = \\frac{${(x - mean).toFixed(2)}}{${sd}} = ${z.toFixed(4)}$$
        </div>
        <p><strong>ফলাফল:</strong> আপনার Z-স্কোর হলো <strong>${z.toFixed(4)}</strong></p>
    `;

    // Draw SVG Curve
    drawNormalCurve(z);

    // Interpretations
    const pctBelow = (probBelow * 100).toFixed(2);
    const pctAbove = (probAbove * 100).toFixed(2);
    
    interpretationText.innerHTML = `
        <strong>বাংলা ব্যাখ্যা:</strong> আপনার মান $X = ${x}$, গড় $M = ${mean}$ থেকে <strong>${Math.abs(z).toFixed(2)}</strong> গুণ পরিমিত ব্যবধান 
        ${z >= 0 ? 'ডানে (বড়)' : 'বামে (ছোট)'} অবস্থিত। <br>
        স্বাভাবিক বিন্যাসের নিয়ম অনুযায়ী, ডাটা সেটের প্রায় <strong>${pctBelow}%</strong> মান আপনার এই সংখ্যাটির চেয়ে 
        <strong>নিচে বা সমান</strong> এবং প্রায় <strong>${pctAbove}%</strong> মান আপনার সংখ্যাটির চেয়ে <strong>উপরে</strong> অবস্থিত।
    `;

    // Render Math
    if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise();
    }
}

// Function to draw SVG normal curve and shade area under curve
function drawNormalCurve(zVal) {
    const svg = document.getElementById('normal-curve-svg');
    if (!svg) return;

    // Width/Height setup
    const w = 400;
    const h = 200;
    const margin = { left: 40, right: 40, top: 20, bottom: 30 };
    
    // Clear old elements
    svg.innerHTML = '';

    // Normal curve probability density function (PDF)
    const pdf = (x) => {
        return Math.exp(-Math.pow(x, 2) / 2) / Math.sqrt(2 * Math.PI);
    };

    // Mapping coordinates
    // Z range: -3.5 to +3.5 maps to margin.left to w - margin.right
    const mapX = (z) => {
        return margin.left + ((z + 3.5) / 7.0) * (w - margin.left - margin.right);
    };

    // PDF value range: 0 to 0.4 maps to h - margin.bottom to margin.top
    const mapY = (y) => {
        return (h - margin.bottom) - (y / 0.4) * (h - margin.bottom - margin.top);
    };

    // Draw shaded area below zVal
    let shadePathPoints = [];
    shadePathPoints.push(`${mapX(-3.5)},${mapY(0)}`);
    
    for (let z = -3.5; z <= zVal && z <= 3.5; z += 0.05) {
        shadePathPoints.push(`${mapX(z)},${mapY(pdf(z))}`);
    }
    
    // Clamp at maximum boundary
    const endShadeZ = Math.min(zVal, 3.5);
    shadePathPoints.push(`${mapX(endShadeZ)},${mapY(0)}`);
    
    const shadePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    shadePath.setAttribute('d', 'M ' + shadePathPoints.join(' L ') + ' Z');
    shadePath.setAttribute('fill', 'rgba(25, 135, 84, 0.2)');
    svg.appendChild(shadePath);

    // Draw main Curve line
    let curvePoints = [];
    for (let z = -3.5; z <= 3.5; z += 0.05) {
        curvePoints.push(`${mapX(z)},${mapY(pdf(z))}`);
    }
    
    const curveLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    curveLine.setAttribute('d', 'M ' + curvePoints.join(' L '));
    curveLine.setAttribute('fill', 'none');
    curveLine.setAttribute('stroke', '#0b3d26');
    curveLine.setAttribute('stroke-width', '2.5');
    svg.appendChild(curveLine);

    // Draw X-axis
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', margin.left - 10);
    xAxis.setAttribute('y1', h - margin.bottom);
    xAxis.setAttribute('x2', w - margin.right + 10);
    xAxis.setAttribute('y2', h - margin.bottom);
    xAxis.setAttribute('stroke', '#737e73');
    xAxis.setAttribute('stroke-width', '1.5');
    svg.appendChild(xAxis);

    // Helper: draw grid lines for standard deviations (-3, -2, -1, 0, 1, 2, 3)
    for (let sd = -3; sd <= 3; sd++) {
        const xPos = mapX(sd);
        
        // Draw vertical tick line
        const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        tick.setAttribute('x1', xPos);
        tick.setAttribute('y1', h - margin.bottom);
        tick.setAttribute('x2', xPos);
        tick.setAttribute('y2', h - margin.bottom + 5);
        tick.setAttribute('stroke', '#737e73');
        svg.appendChild(tick);

        // Tick Label
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', xPos);
        label.setAttribute('y', h - margin.bottom + 18);
        label.setAttribute('font-size', '10');
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('fill', '#4a524a');
        label.textContent = sd === 0 ? 'μ' : (sd > 0 ? `+${sd}σ` : `${sd}σ`);
        svg.appendChild(label);
    }

    // Draw specific Z marker
    const markerZ = Math.max(-3.5, Math.min(zVal, 3.5));
    const markerX = mapX(markerZ);
    const markerY = mapY(pdf(markerZ));

    // Vertical indicator line
    const vLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    vLine.setAttribute('x1', markerX);
    vLine.setAttribute('y1', h - margin.bottom);
    vLine.setAttribute('x2', markerX);
    vLine.setAttribute('y2', markerY - 15);
    vLine.setAttribute('stroke', '#d9480f');
    vLine.setAttribute('stroke-width', '2');
    vLine.setAttribute('stroke-dasharray', '3,3');
    svg.appendChild(vLine);

    // Indicator Dot on curve
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', markerX);
    dot.setAttribute('cy', markerY);
    dot.setAttribute('r', '5');
    dot.setAttribute('fill', '#d9480f');
    svg.appendChild(dot);

    // Label text for Z
    const zLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    zLabel.setAttribute('x', markerX);
    zLabel.setAttribute('y', markerY - 22);
    zLabel.setAttribute('font-size', '11');
    zLabel.setAttribute('font-weight', 'bold');
    zLabel.setAttribute('text-anchor', 'middle');
    zLabel.setAttribute('fill', '#d9480f');
    zLabel.textContent = `Z = ${zVal.toFixed(2)}`;
    svg.appendChild(zLabel);
}

// ==========================================
// CALCULATOR 3: Bayes' Theorem
// ==========================================
function toggleBayesInputs() {
    const type = document.getElementById('bayes-type').value;
    const coronaInputs = document.getElementById('bayes-inputs-corona');
    const diceInputs = document.getElementById('bayes-inputs-dice');

    if (type === 'corona') {
        coronaInputs.style.display = 'block';
        diceInputs.style.display = 'none';
    } else {
        coronaInputs.style.display = 'none';
        diceInputs.style.display = 'block';
    }
    calculateBayesLab();
}

function calculateBayesLab() {
    const type = document.getElementById('bayes-type').value;
    const resultsBox = document.getElementById('bayes-results-box');

    if (type === 'corona') {
        // Medical diagnosis test inputs
        const prior = parseFloat(document.getElementById('b-prior').value); // P(Corona)
        const sens = parseFloat(document.getElementById('b-sens').value);  // P(Pos|Corona)
        const fpr = parseFloat(document.getElementById('b-fpr').value);    // P(Pos|Healthy)

        if (isNaN(prior) || isNaN(sens) || isNaN(fpr) || prior < 0 || prior > 1 || sens < 0 || sens > 1 || fpr < 0 || fpr > 1) {
            resultsBox.innerHTML = `<span style="color: #c92a2a;">ত্রুটি: সকল সম্ভাব্যতা অবশ্যই ০ থেকে ১ এর মধ্যে হতে হবে!</span>`;
            return;
        }

        const priorHealthy = 1 - prior; // P(Healthy)
        const totalPos = (sens * prior) + (fpr * priorHealthy); // P(Pos) = P(Pos|Corona)*P(Corona) + P(Pos|Healthy)*P(Healthy)
        const posterior = (sens * prior) / totalPos; // P(Corona|Pos)

        const pctPost = (posterior * 100).toFixed(2);
        
        resultsBox.innerHTML = `
            <div class="results-header">
                <h3>ব্যায়ামের সূত্র প্রয়োগ (Bayes' Theorem Application)</h3>
                <span class="badge">মেডিকেল স্ক্রিনিং</span>
            </div>
            <p><strong>প্রদত্ত তথ্যসমূহ:</strong></p>
            <ul class="bullet-list" style="margin-bottom: 15px;">
                <li>ব্যক্তির করোনা থাকার সম্ভাবনা (Prior): $P(A) = P(\text{Corona}) = ${prior}$</li>
                <li>করোনা থাকলে টেস্ট পজিটিভ আসার সম্ভাবনা (Sensitivity): $P(B|A) = P(\text{Pos}|\text{Corona}) = ${sens}$</li>
                <li>করোনা না থাকলে ভুল করে পজিটিভ আসার সম্ভাবনা (False Positive): $P(B|\neg A) = P(\text{Pos}|\text{Healthy}) = ${fpr}$</li>
            </ul>
            
            <p><strong>গণনার ধাপসমূহ:</strong></p>
            <p>১. পপুলেশনে সুস্থ থাকার সম্ভাবনা: $P(\neg A) = 1 - P(A) = 1 - ${prior} = ${priorHealthy.toFixed(4)}$</p>
            <p>২. যেকোনো টেস্টের ফল পজিটিভ আসার মোট সম্ভাবনা $P(B)$:</p>
            <div class="formula-display">
                $$P(B) = P(B|A)P(A) + P(B|\\neg A)P(\\neg A)$$
                $$P(B) = (${sens} \\times ${prior}) + (${fpr} \\times ${priorHealthy.toFixed(4)}) = ${totalPos.toFixed(4)}$$
            </div>
            
            <p>৩. টেস্ট পজিটিভ আসার পর আসলেই করোনা থাকার চূড়ান্ত সম্ভাবনা $P(A|B)$:</p>
            <div class="formula-display">
                $$P(A|B) = \\frac{P(B|A)P(A)}{P(B)} = \\frac{${sens} \\times ${prior}}{${totalPos.toFixed(4)}} = ${posterior.toFixed(6)}$$
            </div>
            
            <div class="example-box" style="margin-top: 15px;">
                <strong>বাস্তব ব্যাখ্যা (Intuitive Comment):</strong> 
                টেস্টের নির্ভুলতা ৯৯% হওয়া সত্ত্বেও যদি কোনো সাধারণ ব্যক্তির করোনা পরীক্ষার ফল পজিটিভ আসে, 
                তবে তার আসলেই করোনা পজিটিভ হওয়ার চূড়ান্ত সম্ভাবনা মাত্র <strong>${pctPost}%</strong>। 
                বাকি <strong>${(100 - pctPost).toFixed(2)}%</strong> সম্ভাবনা যে এটি একটি ফলস এলার্ম (False Positive)! 
                এর কারণ হচ্ছে পপুলেশনে করোনার মূল হার (Prior Probability) খুবই কম (১%)।
            </div>
        `;
    } else {
        // Biased vs Fair Dice inputs
        const priorBiased = parseFloat(document.getElementById('bd-prior').value); // P(Biased)
        const biased6 = parseFloat(document.getElementById('bd-biased-prob').value); // P(6|Biased)
        const fair6 = 1/6; // P(6|Fair)

        if (isNaN(priorBiased) || isNaN(biased6) || priorBiased < 0 || priorBiased > 1 || biased6 < 0 || biased6 > 1) {
            resultsBox.innerHTML = `<span style="color: #c92a2a;">ত্রুটি: সকল সম্ভাব্যতা অবশ্যই ০ থেকে ১ এর মধ্যে হতে হবে!</span>`;
            return;
        }

        const priorFair = 1 - priorBiased; // P(Fair)
        const total6 = (biased6 * priorBiased) + (fair6 * priorFair); // P(6)
        const posterior = (biased6 * priorBiased) / total6; // P(Biased|6)

        const pctPost = (posterior * 100).toFixed(2);

        resultsBox.innerHTML = `
            <div class="results-header">
                <h3>বায়াসড ছক্কা বনাম বেইস থিওরেম</h3>
                <span class="badge">ছক্কার উদাহরণ</span>
            </div>
            <p><strong>প্রদত্ত তথ্যসমূহ:</strong></p>
            <ul class="bullet-list" style="margin-bottom: 15px;">
                <li>বায়াসড ছক্কা তোলার সম্ভাবনা: $P(\text{Biased}) = ${priorBiased}$</li>
                <li>বায়াসড ছক্কায় ৬ ওঠার সম্ভাবনা (Likelihood): $P(6|\text{Biased}) = ${biased6}$</li>
                <li>ফেয়ার ছক্কায় ৬ ওঠার সম্ভাবনা (Likelihood): $P(6|\text{Fair}) = 1/6 \\approx 0.1667$</li>
            </ul>
            
            <p><strong>গণনার ধাপসমূহ:</strong></p>
            <p>১. সাধারণ ছক্কা তোলার সম্ভাবনা: $P(\text{Fair}) = 1 - P(\text{Biased}) = ${priorFair}$</p>
            <p>২. যেকোনো ছক্কা রোল করে ৬ পাওয়ার মোট সম্ভাবনা $P(6)$:</p>
            <div class="formula-display">
                $$P(6) = P(6|\\text{Biased})P(\\text{Biased}) + P(6|\\text{Fair})P(\\text{Fair})$$
                $$P(6) = (${biased6} \\times ${priorBiased}) + (0.1667 \\times ${priorFair}) = ${total6.toFixed(4)}$$
            </div>
            
            <p>৩. ৬ ওঠার পর ছক্কাটি বায়াসড বা পক্ষপাতদুষ্ট হওয়ার চূড়ান্ত সম্ভাবনা:</p>
            <div class="formula-display">
                $$P(\\text{Biased}|6) = \\frac{P(6|\\text{Biased})P(\\text{Biased})}{P(6)} = \\frac{${biased6} \\times ${priorBiased}}{${total6.toFixed(4)}} = ${posterior.toFixed(4)}$$
            </div>
            
            <div class="example-box" style="margin-top: 15px;">
                <strong>বাস্তব ব্যাখ্যা:</strong> 
                যদি আপনি কোনো ছক্কা রোল করে ৬ পান এবং বায়াসড ছক্কা তোলার প্রাথমিক সম্ভাবনা ৫০% থাকে, 
                তবে ৬ ওঠার পর আপনার কাছে থাকা ছক্কাটি বায়াসড হওয়ার সম্ভাবনা বৃদ্ধি পেয়ে <strong>${pctPost}%</strong> (বা ৩/৪ অংশ) হয়ে যাবে।
            </div>
        `;
    }

    // Render equations
    if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise();
    }
}

// ==========================================
// CALCULATOR 4: Hypothesis Testing
// ==========================================
function toggleHypothesisInputs() {
    const testType = document.getElementById('hyp-test-type').value;
    document.getElementById('hyp-inputs-z').style.display = testType === 'ztest' ? 'block' : 'none';
    document.getElementById('hyp-inputs-t').style.display = testType === 'ttest' ? 'block' : 'none';
    document.getElementById('hyp-inputs-chisq').style.display = testType === 'chisq' ? 'block' : 'none';
    
    calculateHypothesisLab();
}

// Helper: T-Critical Value Lookup Table (Two-Tailed)
// For standard df (1-30) and alpha levels: 0.10, 0.05, 0.01
function getTCriticalValue(df, alpha) {
    const tTable = {
        0.05: {
            1: 12.706, 2: 4.303, 3: 3.182, 4: 2.776, 5: 2.571,
            6: 2.447, 7: 2.365, 8: 2.306, 9: 2.262, 10: 2.228,
            11: 2.201, 12: 2.179, 13: 2.160, 14: 2.145, 15: 2.131,
            16: 2.120, 17: 2.110, 18: 2.101, 19: 2.093, 20: 2.086,
            21: 2.080, 22: 2.074, 23: 2.069, 24: 2.064, 25: 2.060,
            26: 2.056, 27: 2.052, 28: 2.048, 29: 2.045, 30: 2.042
        },
        0.01: {
            1: 63.657, 2: 9.925, 3: 5.841, 4: 4.604, 5: 4.032,
            6: 3.707, 7: 3.499, 8: 3.355, 9: 3.250, 10: 3.169,
            11: 3.106, 12: 3.055, 13: 3.012, 14: 2.977, 15: 2.947,
            16: 2.921, 17: 2.898, 18: 2.878, 19: 2.861, 20: 2.845,
            21: 2.831, 22: 2.819, 23: 2.807, 24: 2.797, 25: 2.787,
            26: 2.779, 27: 2.771, 28: 2.763, 29: 2.756, 30: 2.750
        },
        0.10: {
            1: 6.314, 2: 2.920, 3: 2.353, 4: 2.132, 5: 2.015,
            6: 1.943, 7: 1.895, 8: 1.860, 9: 1.833, 10: 1.812,
            11: 1.796, 12: 1.782, 13: 1.771, 14: 1.761, 15: 1.753,
            16: 1.746, 17: 1.740, 18: 1.734, 19: 1.729, 20: 1.725,
            21: 1.721, 22: 1.717, 23: 1.714, 24: 1.711, 25: 1.708,
            26: 1.706, 27: 1.703, 28: 1.701, 29: 1.699, 30: 1.697
        }
    };
    
    const alphaKey = alpha.toString();
    if (tTable[alphaKey]) {
        if (df <= 30) {
            return tTable[alphaKey][df];
        } else {
            // Asymptotic normal approximation
            const zCritical = { '0.05': 1.96, '0.01': 2.576, '0.10': 1.645 };
            return zCritical[alphaKey] || 1.96;
        }
    }
    return 1.96; // Fallback
}

function calculateHypothesisLab() {
    const testType = document.getElementById('hyp-test-type').value;
    const alpha = parseFloat(document.getElementById('hyp-alpha').value);
    const resultsBox = document.getElementById('hyp-results-box');

    if (testType === 'ztest') {
        const xbar = parseFloat(document.getElementById('hz-xbar').value);
        const mu = parseFloat(document.getElementById('hz-mu').value);
        const sigma = parseFloat(document.getElementById('hz-sigma').value);
        const n = parseInt(document.getElementById('hz-n').value);

        if (isNaN(xbar) || isNaN(mu) || isNaN(sigma) || isNaN(n) || n <= 0 || sigma <= 0) {
            resultsBox.innerHTML = `<span style="color: #c92a2a;">ত্রুটি: সঠিক সংখ্যা দিন। নমুনা সংখ্যা এবং স্ট্যান্ডার্ড ডেভিয়েশন অবশ্যই ০ থেকে বড় হতে হবে!</span>`;
            return;
        }

        // Calculation
        const se = sigma / Math.sqrt(n);
        const z = (xbar - mu) / se;

        // Two-tailed Z Critical
        const zCriticalMap = { 0.05: 1.96, 0.01: 2.576, 0.10: 1.645 };
        const zCrit = zCriticalMap[alpha] || 1.96;
        const rejectNull = Math.abs(z) > zCrit;

        resultsBox.innerHTML = `
            <div class="results-header">
                <h3>One-Sample Z-Test ফলাফল</h3>
                <span class="badge">Z-Test Output</span>
            </div>
            <p><strong>দাবীকৃত বা পপুলেশন গড় ($\mu$):</strong> ${mu}</p>
            <p><strong>নমুনা গড় ($\bar{X}$):</strong> ${xbar}</p>
            <p><strong>গণনাকৃত মানসমূহ:</strong></p>
            <p>১. স্ট্যান্ডার্ড এরর (Standard Error):</p>
            <div class="formula-display">
                $$SE = \\frac{\\sigma}{\\sqrt{n}} = \\frac{${sigma}}{\\sqrt{${n}}} = ${se.toFixed(4)}$$
            </div>
            <p>২. Z-টেস্ট স্ট্যাটিসটিক (Calculated Z):</p>
            <div class="formula-display">
                $$Z = \\frac{\\bar{X} - \\mu}{SE} = \\frac{${xbar} - ${mu}}{${se.toFixed(4)}} = ${z.toFixed(4)}$$
            </div>
            <p>৩. সিদ্ধান্ত ও তুলনা:</p>
            <ul class="bullet-list" style="margin-bottom: 15px;">
                <li>তাৎপর্যপূর্ণ মাত্রা: $\\alpha = ${alpha}$</li>
                <li>Z-ক্রিটিকাল মান (দুই লেজের পরীক্ষা): $\\pm ${zCrit}$</li>
                <li>আমাদের হিসাবকৃত Z-মান: $|Z| = ${Math.abs(z).toFixed(4)}$</li>
            </ul>
            
            <div class="example-box" style="border-left-color: ${rejectNull ? '#d9480f' : '#198754'}; background-color: ${rejectNull ? '#fffaf8' : '#f7faf8'}">
                <strong>পরীক্ষার সিদ্ধান্ত:</strong><br>
                ${rejectNull 
                    ? `<span style="color: #d9480f; font-weight: bold;"><i class="fa-solid fa-circle-check"></i> নাস্তি অনুকল্প (Null Hypothesis $H_0$) বাতিল করা হলো (Reject $H_0$)!</span><br>
                       নমুনার গড় ও পপুলেশনের গড়ের মধ্যে পার্থক্যটি পরিসংখ্যানগতভাবে অত্যন্ত তাৎপর্যপূর্ণ (Statistically Significant)।`
                    : `<span style="color: #198754; font-weight: bold;"><i class="fa-solid fa-triangle-exclamation"></i> নাস্তি অনুকল্প বাতিল করতে ব্যর্থ (Fail to Reject $H_0$)!</span><br>
                       গড়ে পার্থক্যটি সাধারণ নমুনা বিচ্যুতির অংশ এবং তাৎপর্যপূর্ণ নয় (Not Statistically Significant)।`
                }
            </div>
        `;
    } else if (testType === 'ttest') {
        const xbar = parseFloat(document.getElementById('ht-xbar').value);
        const mu = parseFloat(document.getElementById('ht-mu').value);
        const s = parseFloat(document.getElementById('ht-s').value);
        const n = parseInt(document.getElementById('ht-n').value);

        if (isNaN(xbar) || isNaN(mu) || isNaN(s) || isNaN(n) || n <= 1 || s <= 0) {
            resultsBox.innerHTML = `<span style="color: #c92a2a;">ত্রুটি: সঠিক সংখ্যা দিন। নমুনা সংখ্যা অবশ্যই ১ এর চেয়ে বড় এবং স্ট্যান্ডার্ড ডেভিয়েশন ০ থেকে বড় হতে হবে!</span>`;
            return;
        }

        const df = n - 1;
        const se = s / Math.sqrt(n);
        const t = (xbar - mu) / se;
        const tCrit = getTCriticalValue(df, alpha);
        const rejectNull = Math.abs(t) > tCrit;

        resultsBox.innerHTML = `
            <div class="results-header">
                <h3>One-Sample T-Test ফলাফল</h3>
                <span class="badge">T-Test Output</span>
            </div>
            <p><strong>দাবীকৃত বা পপুলেশন গড় ($\mu$):</strong> ${mu}</p>
            <p><strong>নমুনা গড় ($\bar{X}$):</strong> ${xbar}</p>
            <p><strong>ডিগ্রী অফ ফ্রিডম ($df$):</strong> ${df}</p>
            <p><strong>গণনাকৃত মানসমূহ:</strong></p>
            <p>১. স্ট্যান্ডার্ড এরর (Standard Error):</p>
            <div class="formula-display">
                $$SE = \\frac{s}{\\sqrt{n}} = \\frac{${s}}{\\sqrt{${n}}} = ${se.toFixed(4)}$$
            </div>
            <p>২. T-টেস্ট স্ট্যাটিসটিক (Calculated T):</p>
            <div class="formula-display">
                $$t = \\frac{\\bar{X} - \\mu}{SE} = \\frac{${xbar} - ${mu}}{${se.toFixed(4)}} = ${t.toFixed(4)}$$
            </div>
            <p>৩. সিদ্ধান্ত ও তুলনা:</p>
            <ul class="bullet-list" style="margin-bottom: 15px;">
                <li>তাৎপর্যপূর্ণ মাত্রা: $\\alpha = ${alpha}$</li>
                <li>T-ক্রিটিকাল মান (df = ${df}): $\\pm ${tCrit.toFixed(3)}$</li>
                <li>আমাদের হিসাবকৃত T-মান: $|t| = ${Math.abs(t).toFixed(4)}$</li>
            </ul>
            
            <div class="example-box" style="border-left-color: ${rejectNull ? '#d9480f' : '#198754'}; background-color: ${rejectNull ? '#fffaf8' : '#f7faf8'}">
                <strong>পরীক্ষার সিদ্ধান্ত:</strong><br>
                ${rejectNull 
                    ? `<span style="color: #d9480f; font-weight: bold;"><i class="fa-solid fa-circle-check"></i> নাস্তি অনুকল্প (Null Hypothesis $H_0$) বাতিল করা হলো (Reject $H_0$)!</span><br>
                       নমুনার প্রাপ্ত মান নির্দেশ করছে যে দাবীকৃত গড়ের সাথে পার্থক্য তাৎপর্যপূর্ণ এবং পপুলেশন গড় আসলেই ভিন্ন।`
                    : `<span style="color: #198754; font-weight: bold;"><i class="fa-solid fa-triangle-exclamation"></i> নাস্তি অনুকল্প বাতিল করতে ব্যর্থ (Fail to Reject $H_0$)!</span><br>
                       নমুনার প্রাপ্ত গড় ও দাবীকৃত গড়ের মধ্যে যে পার্থক্য রয়েছে তা যথেষ্ট তাৎপর্যপূর্ণ নয় এবং এটি কাকতালীয় হতে পারে।`
                }
            </div>
        `;
    } else if (testType === 'chisq') {
        // Chi-Square Test for Independence (2x2 contingency table)
        const ma = parseFloat(document.getElementById('c-m-a').value);
        const mb = parseFloat(document.getElementById('c-m-b').value);
        const fa = parseFloat(document.getElementById('c-f-a').value);
        const fb = parseFloat(document.getElementById('c-f-b').value);

        if (isNaN(ma) || isNaN(mb) || isNaN(fa) || isNaN(fb) || ma < 0 || mb < 0 || fa < 0 || fb < 0) {
            resultsBox.innerHTML = `<span style="color: #c92a2a;">ত্রুটি: দয়া করে টেবিলে সঠিক ধনাত্মক সংখ্যা প্রবেশ করান!</span>`;
            return;
        }

        // Totals
        const row1 = ma + mb;
        const row2 = fa + fb;
        const col1 = ma + fa;
        const col2 = mb + fb;
        const grandTotal = row1 + row2;

        if (grandTotal === 0) {
            resultsBox.innerHTML = `<span style="color: #c92a2a;">ত্রুটি: মোট ডাটার পরিমাণ ০ হতে পারবে না!</span>`;
            return;
        }

        // Expected Frequencies
        const expMA = (row1 * col1) / grandTotal;
        const expMB = (row1 * col2) / grandTotal;
        const expFA = (row2 * col1) / grandTotal;
        const expFB = (row2 * col2) / grandTotal;

        // Chi-Square formula: Sum of (O - E)^2 / E
        const calcChi = Math.pow(ma - expMA, 2) / expMA +
                         Math.pow(mb - expMB, 2) / expMB +
                         Math.pow(fa - expFA, 2) / expFA +
                         Math.pow(fb - expFB, 2) / expFB;

        // Critical value for df = 1
        const chiCritMap = { 0.10: 2.706, 0.05: 3.841, 0.01: 6.635 };
        const chiCrit = chiCritMap[alpha] || 3.841;
        const rejectNull = calcChi > chiCrit;

        resultsBox.innerHTML = `
            <div class="results-header">
                <h3>Chi-Square Test ($\chi^2$) ফলাফল</h3>
                <span class="badge">Chi-Square Test</span>
            </div>
            <p><strong>উপাত্তের সারণি (Observed vs Expected Frequency Table):</strong></p>
            <table class="result-table" style="font-size: 12px; margin-bottom: 15px;">
                <thead>
                    <tr>
                        <th>লিঙ্গ</th>
                        <th>পছন্দ A (Obs / Exp)</th>
                        <th>পছন্দ B (Obs / Exp)</th>
                        <th>মোট</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>পুরুষ</th>
                        <td>${ma} / <strong>${expMA.toFixed(2)}</strong></td>
                        <td>${mb} / <strong>${expMB.toFixed(2)}</strong></td>
                        <td>${row1}</td>
                    </tr>
                    <tr>
                        <th>মহিলা</th>
                        <td>${fa} / <strong>${expFA.toFixed(2)}</strong></td>
                        <td>${fb} / <strong>${expFB.toFixed(2)}</strong></td>
                        <td>${row2}</td>
                    </tr>
                    <tr>
                        <th>মোট</th>
                        <td>${col1}</td>
                        <td>${col2}</td>
                        <td><strong>${grandTotal}</strong></td>
                    </tr>
                </tbody>
            </table>
            
            <p><strong>গণনার ধাপসমূহ:</strong></p>
            <p>১. প্রত্যাশিত গণসংখ্যা সূত্র: $E = \\frac{\\text{Row Total} \\times \\text{Col Total}}{\\text{Grand Total}}$</p>
            <p>২. $\chi^2$ স্ট্যাটিসটিক সূত্র:</p>
            <div class="formula-display" style="font-size: 13px;">
                $$\\chi^2 = \\sum \\frac{(O - E)^2}{E}$$
                $$\\chi^2 = \\frac{(${ma} - ${expMA.toFixed(2)})^2}{${expMA.toFixed(2)}} + \\frac{(${mb} - ${expMB.toFixed(2)})^2}{${expMB.toFixed(2)}} + \\dots$$
                $$\\chi^2 = ${calcChi.toFixed(4)}$$
            </div>
            <p>৩. সিদ্ধান্ত ও তুলনা (Degree of Freedom $df = 1$):</p>
            <ul class="bullet-list" style="margin-bottom: 15px;">
                <li>তাৎপর্যপূর্ণ মাত্রা: $\\alpha = ${alpha}$</li>
                <li>$\\chi^2$-ক্রিটিকাল মান: ${chiCrit}</li>
                <li>আমাদের হিসাবকৃত $\\chi^2$-মান: ${calcChi.toFixed(4)}</li>
            </ul>
            
            <div class="example-box" style="border-left-color: ${rejectNull ? '#d9480f' : '#198754'}; background-color: ${rejectNull ? '#fffaf8' : '#f7faf8'}">
                <strong>পরীক্ষার সিদ্ধান্ত:</strong><br>
                ${rejectNull 
                    ? `<span style="color: #d9480f; font-weight: bold;"><i class="fa-solid fa-circle-check"></i> নাস্তি অনুকল্প (Null Hypothesis $H_0$) বাতিল করা হলো!</span><br>
                       লিঙ্গ (Gender) এবং পছন্দের (Preferences) মধ্যে একটি অত্যন্ত তাৎপর্যপূর্ণ সম্পর্ক রয়েছে। পছন্দগুলো লিঙ্গের ওপর নির্ভরশীল।`
                    : `<span style="color: #198754; font-weight: bold;"><i class="fa-solid fa-triangle-exclamation"></i> নাস্তি অনুকল্প বাতিল করতে ব্যর্থ!</span><br>
                       লিঙ্গ এবং পছন্দের মধ্যে কোনো তাৎপর্যপূর্ণ সম্পর্ক পাওয়া যায়নি। পার্থক্যগুলো কাকতালীয় হতে পারে (অর্থাৎ তারা স্বাধীন)।`
                }
            </div>
        `;
    }

    // Render Math equations
    if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise();
    }
}
