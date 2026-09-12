# AI Global Growth Copilot 🚀
### *The practical AI decision layer designed for Fridayy's e-commerce platform*

> **"Where should I sell this product?"**  
> Fridayy already solves execution (creating product photos, catalogs, websites, and marketplace listings). This Copilot introduces the **intelligence layer before execution**: determining which global market to enter, the optimal pricing, expected profit margins, competitive landscape, and one-click localized listing generation.

---

## 🌟 Key Capabilities & The 5 Intelligence Engines

```
Current Fridayy Flow:
Product Photo → AI → Images → Catalog → Website → Marketplace → Sell → Inventory

Proposed Growth Copilot Flow:
Product → Market Intelligence → Decision → Listing → Sell → Learn
```

1. **Product Understanding Engine (Vision + Attributes)**
   - Powered by **Google Gemini 2.5 Flash Multimodal Vision API**.
   - Extracts materials, aesthetic vibes, buyer personas, transit fragility, and HS Code classification.

2. **Market Opportunity Engine (Multi-Country Intelligence)**
   - Real-time quantitative scoring for **UAE 🇦🇪, USA 🇺🇸, UK 🇬🇧, Germany 🇩🇪, Singapore 🇸🇬, Australia 🇦🇺**.
   - Evaluates country demand, year-over-year market growth, competition level, and calculates an Opportunity Index (0–100).

3. **Price Intelligence Engine (Landed Economics & Net Margins)**
   - Computes landed costs: COGS + International Air Freight + Marketplace Commissions (~18%) + Import Tariffs + VAT/GST.
   - Recommends localized retail price in local currency (AED, USD, GBP, EUR, SGD) and demonstrates profit multiplier vs domestic sales.

4. **Global Readiness Engine (5-Factor Radar Score)**
   - Radar assessment across:
     - *Product Attractiveness*
     - *International Demand*
     - *Competition Resilience*
     - *Expected Margin*
     - *Operational Complexity*
   - Issues unambiguous executive verdict: **"GO GLOBAL"** vs **"DON'T GO GLOBAL YET"**.

5. **Recommendation & Listing Generator Engine (1-Click Launch)**
   - Generates localized high-converting marketplace listings for **Amazon.ae, Amazon.com, Noon, Etsy, and Shopify**.
   - Includes SEO-optimized titles, 5 benefit-driven bullets, narrative story descriptions, backend search terms, and cross-border compliance checklists.

6. **Closed-Loop Learning & Simulation Sandbox**
   - Implements: `Data → Decision → Action → Result → Learning → Better Decision`.
   - Simulates real-world sales outcomes (Views, CTR, Orders, Conversion Rate, Customer Ratings) and dynamically recalibrates future opportunity scores and pricing elasticity.

---

## 🔑 Google AI Studio API Key Setup

1. Get a free API key from **[Google AI Studio](https://aistudio.google.com/app/apikey)**.
2. In the application header, click the **"Google AI Studio API"** pill.
3. Paste your Gemini API key (`AIza...`) and click **"Test Connection"** & **"Save Key"**.
4. The key is securely stored in your browser's `localStorage` and sent directly to Google Gemini endpoints.
5. *Note: If no API key is provided, the platform automatically runs in realistic Heuristic Simulation Mode with built-in presets.*

---

## 📁 Project Structure

```
FridayPlatform/
├── index.html                   # Core Single Page Application UI
├── css/
│   ├── style.css                # Fridayy brand theme, dark mode, glassmorphism & typography
│   └── components.css           # Marketplace preview cards, radar charts & responsive widgets
├── js/
│   ├── config.js                # Configuration, country economics, FX rates & demo presets
│   ├── api.js                   # Google Gemini AI Studio API service (Vision + JSON mode)
│   ├── engines/
│   │   ├── productUnderstanding.js  # Engine 1: Visual understanding & attribute extraction
│   │   ├── marketOpportunity.js     # Engine 2: Multi-country opportunity scoring
│   │   ├── priceIntelligence.js     # Engine 3: Landed cost & margin calculation
│   │   ├── globalReadiness.js       # Engine 4: 5-Factor radar readiness & GO/NO-GO logic
│   │   └── listingGenerator.js      # Engine 5: Localized listing generator
│   ├── closedLoopLearning.js   # Closed-loop learning & launch outcome simulator
│   ├── chartManager.js          # Interactive Chart.js radar, bar, and doughnut charts
│   └── app.js                   # Main application coordinator & state manager
└── README.md                    # Documentation & architecture breakdown
```

---

## 🚀 How to Run Locally

Because the application is built with modern ES Modules and zero runtime dependencies:
1. Open `index.html` directly in any web browser (Google Chrome, Microsoft Edge, Safari, Firefox).
2. Or serve using any static server (e.g. VS Code Live Server, `npx serve`, or Python `python -m http.server 8000`).
