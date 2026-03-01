# R-Tool — Statistical Research Workbench

A browser-native inferential statistics environment with exact distributional computations, multivariate visualization, and AI-augmented interpretation. Zero server-side dependencies. Zero data exfiltration. Every computation executes deterministically in the client runtime.

## Motivation

Most browser-based "statistics tools" approximate significance via hard-coded threshold tables or offload computation to remote APIs that introduce latency, privacy exposure, and vendor lock-in. R-Tool eliminates all three by implementing the full inferential pipeline — from raw data ingestion through regularized special functions to final p-value resolution — entirely within a single-page client application. The result is a workbench that behaves like a local R or SPSS session but deploys as a static web asset.

## Capabilities

### Data Ingestion

Flexible multi-modal input supporting heterogeneous datasets:

- **Delimited Import** — Paste or drag-and-drop CSV with automatic column type inference (numeric vs. categorical) via heuristic classification at an 80% numeric threshold
- **Schema-First Manual Entry** — Define column names and types a priori, then populate observations row-by-row with type-enforced validation
- **Programmatic Column Detection** — Quoted fields, mixed delimiters, and sparse entries are handled by a streaming character-level parser with quote-state tracking

```
name,age,group,score,hours,satisfaction,region
Alice,28,A,82,12,4.2,North
Bob,35,B,67,8,3.1,South
Carol,22,A,91,15,4.7,North
...
```

Upon ingestion, the engine partitions columns into numeric and categorical sets, auto-selects default axis mappings, and initializes the correlation inclusion vector.

### Descriptive Statistics

Each numeric variable produces a full summary vector:

| Statistic | Method |
|---|---|
| Arithmetic Mean | $\bar{x} = \frac{1}{n}\sum x_i$ |
| Sample Standard Deviation | Bessel-corrected ($n - 1$ denominator) |
| Median | Midpoint of sorted array; averaged middle pair for even $n$ |
| Min / Max | Extrema of observed range |
| Q1 / Q3 | Linear interpolation at positions $0.25(n-1)$ and $0.75(n-1)$ in the sorted sample |
| Skewness | Adjusted Fisher-Pearson: $\frac{n}{(n-1)(n-2)} \sum\left(\frac{x_i - \bar{x}}{s}\right)^3$ |
| Excess Kurtosis | $\frac{n(n+1)}{(n-1)(n-2)(n-3)} \sum\left(\frac{x_i - \bar{x}}{s}\right)^4 - \frac{3(n-1)^2}{(n-2)(n-3)}$ |

**Example output** for a variable `score` with $n = 15$:

```
Mean: 82.67  |  SD: 14.23  |  Med: 85.00
Min: 54.00   |  Max: 95.00
Q1: 61.50    |  Q3: 90.50
Skew: -0.41  |  Kurt: -1.18
```

A negative skew indicates left-tail elongation; a negative excess kurtosis (platykurtic) suggests lighter tails than the Gaussian reference.

### Inferential Testing

Four parametric tests, each producing exact p-values from continuous distribution functions — not discretized lookup tables:

#### Welch's Independent Samples t-Test

Compares means of two groups without assuming equal variances. Degrees of freedom via the Welch-Satterthwaite approximation:

$$df = \frac{\left(\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}\right)^2}{\frac{(s_1^2/n_1)^2}{n_1 - 1} + \frac{(s_2^2/n_2)^2}{n_2 - 1}}$$

Reports: $t$-statistic, $df$, two-tailed $p$, and Cohen's $d$ (pooled SD denominator) with qualitative magnitude (small/medium/large per Cohen 1988).

#### Pearson Product-Moment Correlation

Computes $r$, then transforms to a $t$-statistic for significance testing:

$$t = r\sqrt{\frac{n - 2}{1 - r^2}}, \quad df = n - 2$$

Reports: $r$, $r^2$, $t$, and two-tailed $p$.

#### Ordinary Least Squares Regression

Simple bivariate OLS with slope significance:

$$\hat{\beta}_1 = r \cdot \frac{s_y}{s_x}, \quad \hat{\beta}_0 = \bar{y} - \hat{\beta}_1\bar{x}$$

Slope $t$-statistic derived from the same $r \to t$ transformation. Reports: $\hat{\beta}_0$, $\hat{\beta}_1$, slope $t$, slope $p$, $r$, $R^2$, and the fitted equation.

#### One-Way ANOVA

Partitions total variance into between-group and within-group components:

$$F = \frac{MS_{between}}{MS_{within}}, \quad p \text{ from } F(df_1, df_2)$$

Reports: $F$, $df_{between}$, $df_{within}$, $MS_{between}$, $MS_{within}$, and exact $p$.

### P-Value Engine

The core of the inferential pipeline is a numerically stable implementation of the **regularized incomplete beta function** $I_x(a, b)$, evaluated via Lentz's continued fraction algorithm (Numerical Recipes, Ch. 6):

1. **Log-Gamma** — Lanczos approximation ($g = 7$, 9-term series) with reflection formula for $z < 0.5$
2. **Continued Fraction** — Modified Lentz's method with $\epsilon = 3 \times 10^{-14}$ convergence tolerance and 200-iteration ceiling
3. **Symmetry Exploitation** — Automatic argument swap when $x > (a+1)/(a+b+2)$ to ensure rapid convergence

From $I_x(a,b)$, both the Student's $t$ CDF and the Fisher-Snedecor $F$ CDF are derived:

$$P(T \leq t) = 1 - \tfrac{1}{2}\,I_{\frac{df}{df + t^2}}\!\left(\tfrac{df}{2}, \tfrac{1}{2}\right)$$

$$P(F \leq f) = I_{\frac{d_1 f}{d_1 f + d_2}}\!\left(\tfrac{d_1}{2}, \tfrac{d_2}{2}\right)$$

All p-values are displayed to four decimal places, with values below $10^{-4}$ rendered as `< .0001`.

### Visualization

Five chart types rendered via Chart.js (scatter, histogram, bar, line) and custom SVG (box plot):

| Chart | Use Case | Encoding |
|---|---|---|
| **Scatter** | Bivariate numeric relationships | Optional categorical grouping with color-coded series |
| **Histogram** | Univariate distributional shape | Configurable bin count (2–30) |
| **Bar** | Group means comparison | Categorical X, numeric Y (mean aggregation) |
| **Line** | Sequential / time-series trends | Cubic Bezier interpolation ($\tau = 0.3$) with area fill |
| **Box Plot** | Distributional comparison across groups | Custom SVG: whiskers (min/max), IQR box (Q1–Q3), median rule, per-group $n$ annotation |

**Box plot example** — `score` by `group` with groups A and B:

```
Group A (n=8):  Min=82, Q1=85.5, Med=88.5, Q3=91.5, Max=95
Group B (n=7):  Min=54, Q1=56.5, Med=60.0, Q3=65.0, Max=72
```

Each box renders proportionally within a shared Y-axis domain with 5% padding, axis tick marks, and group labels.

### Correlation Matrix

Interactive Pearson $r$ matrix for all selected numeric variables. Cells are chromatically encoded:

- **Diagonal** — $r = 1.00$ (blue tint)
- **Strong positive** ($r > 0.50$) — green
- **Moderate positive** ($r > 0.20$) — light green
- **Negative** ($r < -0.20$) — orange
- **Weak** ($|r| \leq 0.20$) — neutral grey

Column inclusion is toggled via checkboxes; a "Select All" control is provided.

### Azura Interpretation Layer

An on-demand AI-generated statistical narrative synthesized from the current dataset state. Activated explicitly via a **Generate Analysis** button (no auto-computation) to preserve user agency and prevent stale interpretations.

The summary includes:
- Dataset dimensionality ($N$, variable counts by type)
- Top-3 variable descriptives
- Strongest pairwise correlation from the active matrix
- Most recent test result
- Statistical power advisory ($N < 30$ caveat)

A **thumbs-up / thumbs-down** feedback mechanism persists ratings to `localStorage` keyed by a deterministic hash of the dataset, enabling per-dataset feedback continuity across sessions.

## Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org/) (App Router, static export) |
| Visualization | [Chart.js](https://www.chartjs.org/) + [react-chartjs-2](https://react-chartjs-2.js.org/) + custom SVG |
| Statistical Engine | Pure TypeScript — no external stats libraries |
| Readings | [react-markdown](https://github.com/remarkjs/react-markdown) |
| Persistence | Browser `localStorage` (feedback ratings only) |

## Part of Mental Wealth Academy

This application is a standalone module extracted from the [Mental Wealth Academy](https://github.com/Mental-Wealth-Academy/platform) platform. It operates independently with no shared backend, database, or authentication requirements.
