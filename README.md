# Research

Data visualization, statistical analysis, and curated daily readings

## Overview

Research is a client-side statistical workbench with an AI interpretation layer. It provides:

- **CSV Upload** — Import datasets via paste, file upload, or drag-and-drop
- **Manual Entry** — Define a schema and enter rows by hand
- **Chart Visualization** — Scatter, histogram, bar, line, and box plot charts
- **Descriptive Statistics** — Mean, SD, median, min, max, Q1, Q3, skewness, kurtosis per variable
- **Correlation Matrix** — Pearson r heatmap with selectable columns
- **Inferential Tests** — T-test, correlation, regression, and ANOVA with exact p-values computed from t/F distributions
- **Azura Interpretation** — On-demand AI statistical summary with thumbs up/down feedback
- **Curated Daily Readings** — Hand-picked pieces from domain experts, refreshed regularly

## Statistical Engine

All computations run client-side with zero dependencies beyond Chart.js for rendering:

- **P-values** — Regularized incomplete beta function powering exact t-distribution and F-distribution CDFs (no lookup tables or threshold approximations)
- **Effect sizes** — Cohen's d for t-tests, R² for regression, Pearson r for correlations
- **Extended descriptives** — Quartiles via linear interpolation, sample skewness (adjusted), excess kurtosis
- **Box plots** — Custom SVG rendering with whiskers, IQR boxes, and median lines per group

## Daily Readings

Three curated pieces currently available:

1. **How to Make Something Great** — On craft, iteration, and the pursuit of quality
2. **Micro University?** — Rethinking education at the smallest viable scale
3. **From Viral 2 Ethereal** — Moving beyond attention metrics toward lasting impact

## Stack

- [Next.js](https://nextjs.org/) — React framework with App Router
- [Chart.js](https://www.chartjs.org/) + react-chartjs-2 — Data visualization
- [react-markdown](https://github.com/remarkjs/react-markdown) — Markdown rendering for daily readings

## Part of Mental Wealth Academy

This app is a standalone module extracted from the [Mental Wealth Academy](https://github.com/Mental-Wealth-Academy/platform) platform.
