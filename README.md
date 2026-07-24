# Interactive Statistics Learning Website (পরিসংখ্যান পরিচিতি ও চিত্রায়ন)

An industry-standard, interactive, bilingual (Bengali & English) learning dashboard built to explain all topics in the `Statistics.pdf` textbook.

## Features

- **Responsive Light Mode Design**: A visually stunning interface using custom green shades, clean typography (Outfit and Inter), and animations.
- **Bilingual Explanations**: Concepts are explained clearly in both English and Bengali, utilizing intuitive real-world examples (like coin tosses, biased dice, and diagnostic tests).
- **Interactive Calculators**:
  - **Descriptive Statistics**: Input list of numbers to compute Mean, Median, Mode, Range, IQR, Variance, Standard Deviation, and the 5-Number Summary.
  - **Z-Score & Normal Curve Visualizer**: Computes Z-scores and renders an SVG-based Normal Distribution curve marking the position of standard deviation zones.
  - **Bayes' Theorem Visualizer**: Simulates diagnostic tests (e.g., Corona test probability) and biased dice rolls with step-by-step math breakdowns.
  - **Hypothesis Testing Simulator**: Simulates Z-Tests, T-Tests, and Chi-Square Tests based on sample metrics.

## File Structure

- `index.html`: Web layout, articles, equations, and interactive widgets.
- `styles.css`: Modern styling sheet using CSS variables, flexbox/grid layout, custom scrollbars, and responsiveness.
- `app.js`: Interactive functionality, math engines, SVG rendering, and sidebar routing logic.
- `.gitignore`: Standard git settings to avoid committing IDE temp files.

## How to Run

1. Simply double-click `index.html` to open it in any browser, or use a local dev server (like Live Server in VS Code or running `npx serve .`).
2. No internet connection is strictly required, though a connection is recommended to load Google Fonts and MathJax for LaTeX mathematical formatting.
