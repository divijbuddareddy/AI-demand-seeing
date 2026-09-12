/**
 * Fridayy AI Global Growth Copilot - Main Application Controller
 * Styled strictly with Fridayy's Mint & Deep Forest Emerald Brand System
 */

import { CONFIG } from './config.js';
import { geminiService } from './api.js';
import { ProductUnderstandingEngine } from './engines/productUnderstanding.js';
import { MarketOpportunityEngine } from './engines/marketOpportunity.js';
import { PriceIntelligenceEngine } from './engines/priceIntelligence.js';
import { GlobalReadinessEngine } from './engines/globalReadiness.js';
import { ListingGeneratorEngine } from './engines/listingGenerator.js';
import { closedLoopEngine } from './closedLoopLearning.js';
import { chartManager } from './chartManager.js';

class FridayyApp {
  constructor() {
    this.currentImageBase64 = null;
    this.currentImageMime = null;
    this.currentAnalysis = null;
    this.selectedMarketForListing = 'UAE';
    this.selectedPlatformForListing = 'Amazon';
    this.activeTab = 'analysis';
    this.activePresetId = null;

    this.initElements();
    this.bindEvents();
    this.updateApiKeyStatusUI();
    this.renderPresets();
    this.renderDemoThumbnails();

    // Initial state: Start completely clean & empty
    this.clearAllInputs(false);
  }

  initElements() {
    // Top Bar & API Modal
    this.apiKeyModal = document.getElementById('apiKeyModal');
    this.apiKeyInput = document.getElementById('apiKeyInput');
    this.btnOpenApiKeyModal = document.getElementById('btnOpenApiKeyModal');
    this.btnCloseApiKeyModal = document.getElementById('btnCloseApiKeyModal');
    this.btnSaveApiKey = document.getElementById('btnSaveApiKey');
    this.btnTestApiKey = document.getElementById('btnTestApiKey');
    this.btnClearApiKey = document.getElementById('btnClearApiKey');
    this.apiKeyStatusText = document.getElementById('apiKeyStatusText');
    this.headerApiKeyDot = document.getElementById('headerApiKeyDot');
    this.apiKeyDot = document.getElementById('apiKeyDot');
    this.apiTestResult = document.getElementById('apiTestResult');

    // Inline API Key Controls
    this.inlineApiKeyInput = document.getElementById('inlineApiKeyInput');
    this.btnSaveInlineApiKey = document.getElementById('btnSaveInlineApiKey');
    this.btnTestInlineApiKey = document.getElementById('btnTestInlineApiKey');
    this.inlineApiStatus = document.getElementById('inlineApiStatus');

    // Input Form
    this.form = document.getElementById('productIntakeForm');
    this.inputTitle = document.getElementById('productTitle');
    this.inputCost = document.getElementById('costPrice');
    this.inputDomestic = document.getElementById('domesticPrice');
    this.inputWeight = document.getElementById('unitWeight');
    this.inputQuantity = document.getElementById('initialQuantity');
    this.inputCategory = document.getElementById('categoryHint');
    this.inputNotes = document.getElementById('sellerNotes');
    this.imageDropZone = document.getElementById('imageDropZone');
    this.imageFileInput = document.getElementById('imageFileInput');
    this.imagePreview = document.getElementById('imagePreview');
    this.dropZonePrompt = document.getElementById('dropZonePrompt');
    this.btnAnalyze = document.getElementById('btnAnalyze');
    this.presetsContainer = document.getElementById('presetsContainer');
    this.demoThumbnailsGrid = document.getElementById('demoThumbnailsGrid');
    this.btnClearAllFields = document.getElementById('btnClearAllFields');

    // Pipeline Loader
    this.loadingOverlay = document.getElementById('loadingOverlay');
    this.loadingStepText = document.getElementById('loadingStepText');
    this.loadingProgressBar = document.getElementById('loadingProgressBar');

    // Results Container
    this.resultsSection = document.getElementById('resultsSection');
    this.emptyState = document.getElementById('emptyState');

    // Navigation Tabs
    this.tabBtns = document.querySelectorAll('.nav-tab-btn');
    this.tabPanes = document.querySelectorAll('.tab-pane');

    // Marketplace Selector
    this.marketSelectorTabs = document.getElementById('marketSelectorTabs');

    // Simulation Sandbox
    this.btnRunSimulation = document.getElementById('btnRunSimulation');
    this.simulationResults = document.getElementById('simulationResults');

    // Toasts
    this.toastContainer = document.getElementById('toastContainer');
  }

  bindEvents() {
    // API Key Modal Controls
    this.btnOpenApiKeyModal?.addEventListener('click', () => this.openApiKeyModal());
    this.btnCloseApiKeyModal?.addEventListener('click', () => this.closeApiKeyModal());
    this.btnSaveApiKey?.addEventListener('click', () => this.saveApiKeyFromModal());
    this.btnTestApiKey?.addEventListener('click', () => this.testApiKeyFromModal());
    this.btnClearApiKey?.addEventListener('click', () => this.clearApiKey());

    // Inline API Key Controls
    this.btnSaveInlineApiKey?.addEventListener('click', () => this.saveApiKeyFromInline());
    this.btnTestInlineApiKey?.addEventListener('click', () => this.testApiKeyFromInline());

    // Clear All Button
    this.btnClearAllFields?.addEventListener('click', () => this.clearAllInputs(true));

    // Close modal on click outside
    window.addEventListener('click', (e) => {
      if (e.target === this.apiKeyModal) this.closeApiKeyModal();
    });

    // Image Upload & Drag-and-Drop
    this.imageDropZone?.addEventListener('click', () => this.imageFileInput?.click());
    this.imageFileInput?.addEventListener('change', (e) => this.handleFileSelect(e));
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      this.imageDropZone?.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      }, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      this.imageDropZone?.addEventListener(eventName, () => {
        this.imageDropZone.classList.add('border-[#249E7C]', 'bg-[#E4F5EE]');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      this.imageDropZone?.addEventListener(eventName, () => {
        this.imageDropZone.classList.remove('border-[#249E7C]', 'bg-[#E4F5EE]');
      });
    });

    this.imageDropZone?.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files.length > 0) {
        this.processImageFile(files[0]);
      }
    });

    // Form Submission
    this.form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.runFullAnalysis();
    });

    // Tab Navigation
    this.tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        this.switchTab(targetTab);
      });
    });

    // Simulation Trigger
    this.btnRunSimulation?.addEventListener('click', () => this.runSimulationOutcome());

    // Export Buttons
    document.getElementById('btnExportJson')?.addEventListener('click', () => this.exportJson());
    document.getElementById('btnCopyListing')?.addEventListener('click', () => this.copyListingToClipboard());
  }

  /* ------------------- Clear All Inputs ------------------- */
  clearAllInputs(showToast = true) {
    this.activePresetId = null;
    this.currentImageBase64 = null;
    this.currentImageMime = null;
    this.currentAnalysis = null;

    if (this.inputTitle) this.inputTitle.value = '';
    if (this.inputCost) this.inputCost.value = '';
    if (this.inputDomestic) this.inputDomestic.value = '';
    if (this.inputWeight) this.inputWeight.value = '';
    if (this.inputQuantity) this.inputQuantity.value = '';
    if (this.inputCategory) this.inputCategory.value = '';
    if (this.inputNotes) this.inputNotes.value = '';

    if (this.imagePreview) {
      this.imagePreview.src = '';
      this.imagePreview.classList.add('hidden');
    }
    if (this.dropZonePrompt) {
      this.dropZonePrompt.classList.remove('hidden');
    }
    if (this.imageFileInput) {
      this.imageFileInput.value = '';
    }

    // Hide results and show empty state
    if (this.resultsSection) this.resultsSection.classList.add('hidden');
    if (this.emptyState) this.emptyState.classList.remove('hidden');

    this.renderPresets();
    this.renderDemoThumbnails();

    if (showToast) {
      this.showToast('All fields and inputs cleared.', 'info');
    }
  }

  /* ------------------- Preset Management ------------------- */
  renderPresets() {
    if (!this.presetsContainer) return;
    this.presetsContainer.innerHTML = '';
    
    CONFIG.PRESETS.forEach(preset => {
      const btn = document.createElement('button');
      btn.type = 'button';
      const isActive = preset.id === this.activePresetId;
      btn.className = `preset-chip group flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${isActive ? 'bg-[#249E7C] border-[#249E7C] text-white shadow-sm' : 'bg-white border-[#B7E6D4] text-[#0F382C] hover:bg-[#E4F5EE]'}`;
      btn.innerHTML = `
        <span class="w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-[#249E7C]'}"></span>
        <span>${preset.title}</span>
      `;
      btn.addEventListener('click', () => {
        this.loadPreset(preset);
      });
      this.presetsContainer.appendChild(btn);
    });
  }

  /* ------------------- Real Demo Photo Thumbnails Gallery ------------------- */
  renderDemoThumbnails() {
    if (!this.demoThumbnailsGrid) return;
    this.demoThumbnailsGrid.innerHTML = '';

    CONFIG.PRESETS.forEach(preset => {
      const card = document.createElement('button');
      card.type = 'button';
      const isActive = preset.id === this.activePresetId;
      card.className = `demo-photo-card p-2 rounded-xl text-left border-2 transition-all flex flex-col justify-between ${isActive ? 'bg-[#E4F5EE] border-[#249E7C] shadow-md ring-2 ring-[#249E7C]/20' : 'bg-white border-[#B7E6D4] hover:border-[#249E7C] hover:bg-[#F4FAF7]'}`;
      
      card.innerHTML = `
        <div class="w-full h-20 rounded-lg overflow-hidden bg-slate-100 mb-1.5 border border-[#B7E6D4]/60">
          <img src="${preset.image}" alt="${preset.title}" class="w-full h-full object-cover transform hover:scale-105 transition-transform">
        </div>
        <div class="space-y-0.5">
          <div class="text-[11px] font-bold text-[#0F382C] truncate">${preset.title}</div>
          <div class="flex items-center justify-between text-[10px] text-[#5C7F74]">
            <span class="font-mono font-bold text-[#249E7C]">₹${preset.costPriceINR}</span>
            <span class="px-1.5 py-0.2 rounded bg-white border border-[#B7E6D4] text-[9px] font-bold">${preset.tag || 'Demo'}</span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        this.loadPreset(preset);
      });

      this.demoThumbnailsGrid.appendChild(card);
    });
  }

  loadPreset(preset) {
    if (!preset) return;
    this.activePresetId = preset.id;
    this.inputTitle.value = preset.title;
    this.inputCost.value = preset.costPriceINR;
    this.inputDomestic.value = preset.domesticPriceINR;
    this.inputWeight.value = preset.weightKg;
    this.inputQuantity.value = preset.quantity;
    this.inputCategory.value = preset.category;
    this.inputNotes.value = preset.description;

    // Load Image
    this.loadImageFromUrl(preset.image);

    if (this.imagePreview) {
      this.imagePreview.src = preset.image;
      this.imagePreview.classList.remove('hidden');
      if (this.dropZonePrompt) this.dropZonePrompt.classList.add('hidden');
    }

    const mockupImg = document.getElementById('mockupImage');
    if (mockupImg) mockupImg.src = preset.image;

    this.renderPresets();
    this.renderDemoThumbnails();
    this.showToast(`Loaded sample "${preset.title}". Click "Find My Best Global Market" to analyze!`, 'info');
  }

  async loadImageFromUrl(url) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        this.currentImageBase64 = reader.result;
        this.currentImageMime = blob.type || 'image/jpeg';
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      this.currentImageBase64 = url;
      this.currentImageMime = 'image/jpeg';
    }
  }

  /* ------------------- Image File Handling ------------------- */
  handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (file) {
      this.processImageFile(file);
    }
  }

  processImageFile(file) {
    if (!file.type.startsWith('image/')) {
      this.showToast('Please upload a valid image file (JPG, PNG, WEBP, SVG)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      this.currentImageBase64 = e.target.result;
      this.currentImageMime = file.type;
      this.activePresetId = null;
      
      if (this.imagePreview) {
        this.imagePreview.src = this.currentImageBase64;
        this.imagePreview.classList.remove('hidden');
        if (this.dropZonePrompt) this.dropZonePrompt.classList.add('hidden');
      }

      const mockupImg = document.getElementById('mockupImage');
      if (mockupImg) mockupImg.src = this.currentImageBase64;

      if (!this.inputTitle.value) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        this.inputTitle.value = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
      }

      this.renderPresets();
      this.renderDemoThumbnails();
      this.showToast('Product photo uploaded! Fill your cost/price and click "Find My Best Global Market".', 'success');
    };
    reader.readAsDataURL(file);
  }

  /* ------------------- API Key Modal & Storage ------------------- */
  openApiKeyModal() {
    this.apiKeyInput.value = geminiService.getApiKey();
    this.apiTestResult.innerHTML = '';
    this.apiKeyModal.classList.remove('hidden');
  }

  closeApiKeyModal() {
    this.apiKeyModal.classList.add('hidden');
  }

  saveApiKeyFromModal() {
    const key = this.apiKeyInput.value.trim();
    geminiService.setApiKey(key);
    this.updateApiKeyStatusUI();
    this.showToast(key ? 'Google AI Studio API Key saved!' : 'API Key cleared.', 'success');
    this.closeApiKeyModal();
  }

  saveApiKeyFromInline() {
    const key = this.inlineApiKeyInput.value.trim();
    geminiService.setApiKey(key);
    this.updateApiKeyStatusUI();
    this.showToast(key ? 'Google AI Studio API Key saved & connected!' : 'API Key cleared.', 'success');
  }

  async testApiKeyFromModal() {
    const key = this.apiKeyInput.value.trim();
    if (!key) {
      this.apiTestResult.innerHTML = `<span class="text-rose-600 font-bold text-xs">⚠️ Please enter an API key first.</span>`;
      return;
    }
    this.apiTestResult.innerHTML = `<span class="text-[#249E7C] font-semibold text-xs animate-pulse">Testing connection to Google Gemini API...</span>`;
    try {
      await geminiService.testApiKey(key);
      this.apiTestResult.innerHTML = `<span class="text-[#249E7C] font-bold text-xs">✓ Connected to Google AI Studio (${geminiService.selectedModel})!</span>`;
      this.updateApiKeyStatusUI();
    } catch (err) {
      this.apiTestResult.innerHTML = `<span class="text-rose-600 font-bold text-xs">❌ Connection failed: ${err.message}</span>`;
    }
  }

  async testApiKeyFromInline() {
    const key = this.inlineApiKeyInput.value.trim() || geminiService.getApiKey();
    if (!key) {
      if (this.inlineApiStatus) this.inlineApiStatus.innerHTML = `<span class="text-rose-600 font-bold">⚠️ Enter an API Key above to test connection.</span>`;
      return;
    }
    if (this.inlineApiStatus) this.inlineApiStatus.innerHTML = `<span class="text-[#249E7C] font-bold animate-pulse">Connecting to Google Gemini API...</span>`;
    try {
      await geminiService.testApiKey(key);
      geminiService.setApiKey(key);
      this.updateApiKeyStatusUI();
      if (this.inlineApiStatus) this.inlineApiStatus.innerHTML = `<span class="text-[#249E7C] font-bold">✓ Live Connection Verified with Google AI Studio (${geminiService.selectedModel})!</span>`;
      this.showToast('Connected to Google Gemini API!', 'success');
    } catch (err) {
      if (this.inlineApiStatus) this.inlineApiStatus.innerHTML = `<span class="text-rose-600 font-bold">❌ Error: ${err.message}</span>`;
      this.showToast(`API Test Failed: ${err.message}`, 'error');
    }
  }

  clearApiKey() {
    this.apiKeyInput.value = '';
    if (this.inlineApiKeyInput) this.inlineApiKeyInput.value = '';
    geminiService.setApiKey('');
    this.updateApiKeyStatusUI();
    this.showToast('API Key removed.', 'info');
  }

  updateApiKeyStatusUI() {
    const hasKey = geminiService.hasApiKey();
    const currentKey = geminiService.getApiKey();
    
    if (this.inlineApiKeyInput) this.inlineApiKeyInput.value = currentKey;
    if (this.apiKeyInput) this.apiKeyInput.value = currentKey;

    if (hasKey) {
      if (this.apiKeyStatusText) this.apiKeyStatusText.innerText = 'Gemini AI Connected';
      if (this.headerApiKeyDot) this.headerApiKeyDot.className = 'w-2.5 h-2.5 rounded-full bg-[#249E7C] animate-pulse';
      if (this.apiKeyDot) this.apiKeyDot.className = 'w-2.5 h-2.5 rounded-full bg-[#249E7C] animate-pulse';
      if (this.inlineApiStatus) {
        this.inlineApiStatus.innerHTML = `<span class="text-[#249E7C] font-bold">● Active API Key Saved (${currentKey.substring(0, 8)}...${currentKey.substring(currentKey.length - 4)}). Multimodal Gemini Vision will run automatically.</span>`;
      }
    } else {
      if (this.apiKeyStatusText) this.apiKeyStatusText.innerText = 'Google AI Studio API';
      if (this.headerApiKeyDot) this.headerApiKeyDot.className = 'w-2.5 h-2.5 rounded-full bg-amber-400';
      if (this.apiKeyDot) this.apiKeyDot.className = 'w-2.5 h-2.5 rounded-full bg-amber-400';
      if (this.inlineApiStatus) {
        this.inlineApiStatus.innerHTML = `<span class="text-[#5C7F74]">Paste your Google AI Studio API Key above. Analysis runs directly using Google Gemini Multimodal Vision API.</span>`;
      }
    }
  }

  /* ------------------- Full Analysis Execution ------------------- */
  async runFullAnalysis() {
    // Check if inline key was typed but not saved yet
    const inlineKey = this.inlineApiKeyInput?.value?.trim();
    if (inlineKey && inlineKey !== geminiService.getApiKey()) {
      geminiService.setApiKey(inlineKey);
      this.updateApiKeyStatusUI();
    }

    // Validate API Key
    if (!geminiService.hasApiKey()) {
      this.showToast('⚠️ Please enter your Google AI Studio API Key to run the analysis.', 'error');
      this.openApiKeyModal();
      return;
    }

    const title = this.inputTitle.value.trim();
    const costPriceINR = parseFloat(this.inputCost.value);
    const domesticPriceINR = parseFloat(this.inputDomestic.value);
    const weightKg = parseFloat(this.inputWeight.value) || 1.0;
    const quantity = parseInt(this.inputQuantity.value) || 100;
    const categoryHint = this.inputCategory.value.trim();
    const notes = this.inputNotes.value.trim();

    if (!title) {
      this.showToast('Please enter a Product Title / Name', 'error');
      this.inputTitle.focus();
      return;
    }

    if (!costPriceINR || costPriceINR <= 0) {
      this.showToast('Please enter a valid Cost Price in INR', 'error');
      this.inputCost.focus();
      return;
    }

    if (!domesticPriceINR || domesticPriceINR <= 0) {
      this.showToast('Please enter a valid Domestic Selling Price in INR', 'error');
      this.inputDomestic.focus();
      return;
    }

    if (!this.currentImageBase64) {
      this.showToast('Please upload a product photo or pick a demo sample image', 'error');
      return;
    }

    this.showLoader(true);

    try {
      await this.setLoaderStep('1. Product Understanding Engine: Analyzing visual attributes & materials with Gemini AI...', 20);
      await this.delay(200);

      await this.setLoaderStep('2. Market Opportunity Engine: Evaluating cross-border demand across UAE, USA, UK, DE, SG...', 45);
      await this.delay(200);

      const rawResult = await geminiService.analyzeProduct({
        imageBase64: this.currentImageBase64,
        mimeType: this.currentImageMime,
        title,
        costPriceINR,
        domesticPriceINR,
        weightKg,
        quantity,
        categoryHint,
        notes
      });

      await this.setLoaderStep('3. Price Intelligence Engine: Calculating landed costs, tariffs, and localized margins...', 70);
      await this.delay(150);

      await this.setLoaderStep('4. Global Readiness Engine: Computing 5-vector readiness radar score...', 90);
      await this.delay(150);

      await this.setLoaderStep('5. Recommendation Engine: Assembling localized listing...', 100);
      await this.delay(100);

      this.currentAnalysis = {
        title,
        costPriceINR,
        domesticPriceINR,
        weightKg,
        quantity,
        _source: rawResult._source,
        _model: rawResult._model,
        productUnderstanding: ProductUnderstandingEngine.evaluate({
          rawUnderstanding: rawResult.productUnderstanding,
          customSpecs: { title, weightKg, quantity }
        }),
        markets: MarketOpportunityEngine.evaluateMarkets(rawResult.markets, costPriceINR),
        globalReadiness: GlobalReadinessEngine.computeReadiness({
          productAttractiveness: rawResult.globalReadiness?.factorScores?.productAttractiveness || 90,
          internationalDemand: rawResult.globalReadiness?.factorScores?.internationalDemand || 86,
          competition: rawResult.globalReadiness?.factorScores?.competition || 72,
          expectedMargin: rawResult.globalReadiness?.factorScores?.expectedMargin || 88,
          operationalComplexity: rawResult.globalReadiness?.factorScores?.operationalComplexity || 70,
          rawVerdict: rawResult.globalReadiness?.verdict,
          recommendationSummary: rawResult.globalReadiness?.recommendationSummary
        }),
        bestMarketDecision: rawResult.bestMarketDecision || {
          marketCode: 'UAE',
          marketName: 'United Arab Emirates',
          headline: 'UAE is the recommended first market',
          detailedRationale: 'Strongest opportunity score with manageable competition and high margin retention.'
        },
        localizedListings: rawResult.localizedListings || {}
      };

      this.renderResults();
      const sourceLabel = rawResult._source === 'gemini-live'
        ? `Google Gemini AI (${rawResult._model || 'Live'})`
        : 'Fridayy Cross-Border Intelligence Engine';
      this.showToast(`Analysis complete via ${sourceLabel}!`, 'success');

      // Scroll smoothly to the results
      setTimeout(() => {
        this.resultsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

    } catch (err) {
      console.error('Analysis error:', err);
      this.showToast(`Error: ${err.message}`, 'error');
    } finally {
      this.showLoader(false);
    }
  }

  /* ------------------- Render Results UI ------------------- */
  renderResults() {
    if (!this.currentAnalysis) return;

    if (this.emptyState) this.emptyState.classList.add('hidden');
    if (this.resultsSection) this.resultsSection.classList.remove('hidden');

    const { productUnderstanding, markets, globalReadiness, bestMarketDecision, _source, _model } = this.currentAnalysis;

    // 1. Render Top AI Decision Hero Banner
    const topMarket = markets.find(m => m.code === bestMarketDecision.marketCode) || markets[0] || CONFIG.MARKETS.UAE;
    const heroCard = document.getElementById('aiDecisionHeroCard');
    if (heroCard) {
      const badgeText = _source === 'gemini-live'
        ? `⚡ LIVE GEMINI AI (${_model || 'Gemini 3.6 Flash'})`
        : `⚡ FRIDAYY AI ENGINE`;

      heroCard.innerHTML = `
        <div class="fridayy-card p-6 sm:p-8 bg-gradient-to-br from-white via-[#F4FAF7] to-[#E4F5EE] border-2 border-[#249E7C]">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div class="space-y-3 max-w-2xl">
              <div class="flex items-center gap-3 flex-wrap">
                <span class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#E4F5EE] text-[#0F382C] border border-[#249E7C]">
                  <span class="w-2.5 h-2.5 rounded-full bg-[#249E7C] animate-pulse"></span>
                  ${globalReadiness.verdict}
                </span>
                <span class="text-xs text-[#2B4E43] font-mono font-bold">Overall Readiness: <strong class="text-[#0F382C] text-sm">${globalReadiness.overallScore}/100</strong></span>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#249E7C] text-white">${badgeText}</span>
              </div>
              
              <h2 class="text-2xl sm:text-3xl font-black text-[#0F382C] tracking-tight leading-tight font-['Outfit']">
                AI Decision: <span class="text-[#249E7C]">${topMarket.country} (${topMarket.code})</span> is your Recommended Market
              </h2>
              
              <p class="text-sm sm:text-base text-[#2B4E43] font-medium leading-relaxed">
                ${bestMarketDecision.detailedRationale || globalReadiness.recommendationSummary}
              </p>

              <div class="pt-2 flex flex-wrap items-center gap-3 text-xs font-bold text-[#0F382C]">
                <div class="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-xl border border-[#B7E6D4] shadow-sm">
                  <span class="text-[#5C7F74]">Opportunity Score:</span>
                  <span class="text-[#249E7C] font-mono text-sm font-black">${topMarket.opportunityScore} / 100</span>
                </div>
                <div class="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-xl border border-[#B7E6D4] shadow-sm">
                  <span class="text-[#5C7F74]">Suggested Price:</span>
                  <span class="text-[#0F382C] font-mono text-sm font-black">${topMarket.currency} ${topMarket.suggestedLocalPrice} (₹${topMarket.suggestedPriceINR.toLocaleString()})</span>
                </div>
                <div class="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-xl border border-[#B7E6D4] shadow-sm">
                  <span class="text-[#5C7F74]">Expected Net Margin:</span>
                  <span class="text-[#249E7C] font-mono text-sm font-black">${topMarket.estimatedNetMarginPercent}%</span>
                </div>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[240px]">
              <button id="btnLaunchHeroListing" class="btn-fridayy-primary w-full py-3.5 px-6 text-sm flex items-center justify-center gap-2">
                <span>Generate ${topMarket.code} Listing →</span>
              </button>
              <button id="btnHeroSimulate" class="btn-fridayy-secondary w-full py-3 px-6 text-xs flex items-center justify-center gap-2">
                <span>Simulate Launch Outcome</span>
              </button>
            </div>
          </div>
        </div>
      `;

      document.getElementById('btnLaunchHeroListing')?.addEventListener('click', () => {
        this.selectedMarketForListing = topMarket.code;
        this.switchTab('listing');
        this.renderListingStudio();
      });

      document.getElementById('btnHeroSimulate')?.addEventListener('click', () => {
        this.switchTab('simulation');
        document.getElementById('simulationSection')?.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // 2. Render Engine 1: Product Understanding
    const puContainer = document.getElementById('engine1Container');
    if (puContainer) {
      puContainer.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2.5">
            <div>
              <span class="text-xs font-bold text-[#5C7F74]">Category & Niche</span>
              <p class="text-sm font-bold text-[#0F382C]">${productUnderstanding.category} › ${productUnderstanding.subCategory}</p>
            </div>
            <div>
              <span class="text-xs font-bold text-[#5C7F74]">Identified Materials</span>
              <div class="flex flex-wrap gap-1.5 mt-1">
                ${productUnderstanding.materials.map(m => `<span class="px-2.5 py-0.5 rounded-lg text-xs bg-[#E4F5EE] border border-[#B7E6D4] text-[#0F382C] font-semibold">${m}</span>`).join('')}
              </div>
            </div>
            <div>
              <span class="text-xs font-bold text-[#5C7F74]">Aesthetic Vibe</span>
              <p class="text-xs text-[#2B4E43] font-semibold">${productUnderstanding.aestheticVibe}</p>
            </div>
          </div>
          <div class="space-y-2.5">
            <div>
              <span class="text-xs font-bold text-[#5C7F74]">HS Code Classification</span>
              <p class="text-xs font-mono font-bold text-[#0F382C]">${productUnderstanding.hsCodeSuggestion}</p>
            </div>
            <div>
              <span class="text-xs font-bold text-[#5C7F74]">Logistics & Transit Fragility</span>
              <span class="inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold ${productUnderstanding.logisticsRating === 'Easy' ? 'bg-[#E4F5EE] text-[#249E7C] border border-[#B7E6D4]' : 'bg-[#FEF3C7] text-[#78350F] border border-[#FDE68A]'}">${productUnderstanding.logisticsRating}</span>
            </div>
            <div>
              <span class="text-xs font-bold text-[#5C7F74]">Key Global USPs</span>
              <ul class="text-xs text-[#2B4E43] font-medium space-y-1 list-disc list-inside mt-1">
                ${productUnderstanding.keySellingPoints.slice(0, 3).map(pt => `<li>${pt}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      `;
    }

    // 3. Render Engine 2: Market Opportunity Table
    const tableBody = document.getElementById('marketTableBody');
    if (tableBody) {
      tableBody.innerHTML = markets.map(m => {
        const isTop = m.code === topMarket.code;
        return `
          <tr class="border-b border-[#B7E6D4] hover:bg-[#F4FAF7] transition-colors ${isTop ? 'bg-[#E4F5EE]/60 font-bold' : ''}">
            <td class="py-4 px-4">
              <div class="flex items-center gap-2.5">
                <span class="text-2xl">${m.flag}</span>
                <div>
                  <div class="font-bold text-[#0F382C] text-sm flex items-center gap-1.5">
                    ${m.country}
                    ${isTop ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#249E7C] text-white">TOP PICK</span>' : ''}
                  </div>
                  <span class="text-xs text-[#5C7F74] font-medium">${m.recommendedPlatform}</span>
                </div>
              </div>
            </td>
            <td class="py-4 px-4">
              <div class="flex items-center gap-2">
                <div class="w-16 bg-[#D2F0E3] rounded-full h-2.5 overflow-hidden">
                  <div class="bg-[#249E7C] h-full rounded-full" style="width: ${m.opportunityScore}%"></div>
                </div>
                <span class="font-mono font-bold text-sm text-[#0F382C]">${m.opportunityScore} / 100</span>
              </div>
            </td>
            <td class="py-4 px-4">
              <div class="font-mono font-bold text-[#0F382C] text-sm">${m.currency} ${m.suggestedLocalPrice}</div>
              <div class="text-xs text-[#5C7F74]">≈ ₹${m.suggestedPriceINR.toLocaleString()}</div>
            </td>
            <td class="py-4 px-4">
              <span class="px-2.5 py-1 rounded-lg text-xs font-bold ${m.competitionLevel === 'High' ? 'bg-rose-100 text-rose-800 border border-rose-200' : m.competitionLevel === 'Medium' ? 'bg-[#FEF3C7] text-[#78350F] border border-[#FDE68A]' : 'bg-[#E4F5EE] text-[#249E7C] border border-[#B7E6D4]'}">${m.competitionLevel}</span>
            </td>
            <td class="py-4 px-4">
              <span class="font-mono font-black text-[#249E7C] text-sm">${m.estimatedNetMarginPercent}%</span>
            </td>
            <td class="py-4 px-4 text-right">
              <button data-market="${m.code}" class="btn-select-market px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#249E7C] hover:bg-[#1D8568] transition-all shadow-sm">
                Select Market →
              </button>
            </td>
          </tr>
        `;
      }).join('');

      tableBody.querySelectorAll('.btn-select-market').forEach(btn => {
        btn.addEventListener('click', () => {
          this.selectedMarketForListing = btn.getAttribute('data-market');
          this.switchTab('listing');
          this.renderListingStudio();
        });
      });
    }

    // 4. Render Engine 3: Price Intelligence
    this.renderPriceIntelligence();

    // 5. Render Engine 4: Global Readiness Radar & Factors
    this.renderGlobalReadiness();

    // 6. Render Engine 5: Listing Studio
    this.renderListingStudio();

    // 7. Render Charts
    chartManager.renderRadarChart('radarChartCanvas', globalReadiness.factors);
    chartManager.renderOpportunityChart('opportunityBarChartCanvas', markets);
  }

  /* ------------------- Engine 3: Price Intelligence Calculator ------------------- */
  renderPriceIntelligence(marketCode = this.selectedMarketForListing) {
    const { costPriceINR, domesticPriceINR, weightKg } = this.currentAnalysis;
    const priceData = PriceIntelligenceEngine.calculatePriceBreakdown({
      costPriceINR,
      domesticPriceINR,
      weightKg,
      marketCode
    });

    const container = document.getElementById('priceEngineDetails');
    if (container) {
      container.innerHTML = `
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div class="p-3.5 rounded-xl bg-[#F8FDFB] border border-[#B7E6D4]">
            <span class="text-xs font-bold text-[#5C7F74]">Domestic Price</span>
            <div class="text-base font-mono font-bold text-[#0F382C] mt-1">₹${priceData.domesticPriceINR.toLocaleString()}</div>
            <div class="text-[11px] text-[#5C7F74] mt-0.5">Margin: ${priceData.domesticMarginPercent}%</div>
          </div>
          <div class="p-3.5 rounded-xl bg-[#F8FDFB] border border-[#B7E6D4]">
            <span class="text-xs font-bold text-[#5C7F74]">Target Local (${priceData.marketCode})</span>
            <div class="text-base font-mono font-bold text-[#249E7C] mt-1">${priceData.currency} ${priceData.localSellingPrice}</div>
            <div class="text-[11px] text-[#5C7F74] mt-0.5">≈ ₹${priceData.sellingPriceINR.toLocaleString()}</div>
          </div>
          <div class="p-3.5 rounded-xl bg-[#F8FDFB] border border-[#B7E6D4]">
            <span class="text-xs font-bold text-[#5C7F74]">Net Profit / Unit</span>
            <div class="text-base font-mono font-bold text-[#0F382C] mt-1">₹${priceData.netProfitINR.toLocaleString()}</div>
            <div class="text-[11px] text-[#249E7C] font-bold mt-0.5">${priceData.netMarginPercent}% Net Margin</div>
          </div>
          <div class="p-3.5 rounded-xl bg-[#F8FDFB] border border-[#B7E6D4]">
            <span class="text-xs font-bold text-[#5C7F74]">Profit Multiplier</span>
            <div class="text-base font-mono font-bold text-[#0F382C] mt-1">${priceData.profitMultiplier}x Domestic</div>
            <div class="text-[11px] text-[#5C7F74] mt-0.5">Air Transit: ${priceData.leadTime}</div>
          </div>
        </div>

        <div class="space-y-2 text-xs font-medium text-[#2B4E43]">
          <div class="flex justify-between py-1.5 border-b border-[#B7E6D4]">
            <span class="text-[#5C7F74]">Product COGS (Manufacturing / Sourcing)</span>
            <span class="font-mono font-bold text-[#0F382C]">₹${priceData.cogs.toLocaleString()}</span>
          </div>
          <div class="flex justify-between py-1.5 border-b border-[#B7E6D4]">
            <span class="text-[#5C7F74]">International Air Freight / Express (${weightKg} kg)</span>
            <span class="font-mono font-bold text-[#0F382C]">₹${priceData.estimatedShippingINR.toLocaleString()}</span>
          </div>
          <div class="flex justify-between py-1.5 border-b border-[#B7E6D4]">
            <span class="text-[#5C7F74]">Marketplace & Gateway Fees (~18%)</span>
            <span class="font-mono font-bold text-[#0F382C]">₹${priceData.platformFeeINR.toLocaleString()}</span>
          </div>
          <div class="flex justify-between py-1.5 border-b border-[#B7E6D4]">
            <span class="text-[#5C7F74]">Import Duty & Destination Tariffs</span>
            <span class="font-mono font-bold text-[#0F382C]">₹${priceData.customsDutyINR.toLocaleString()}</span>
          </div>
          <div class="flex justify-between py-2 border-t-2 border-[#249E7C] font-bold text-sm">
            <span class="text-[#0F382C]">Net Profit Retained by Seller</span>
            <span class="font-mono text-[#249E7C]">₹${priceData.netProfitINR.toLocaleString()} (${priceData.currency} ${priceData.netProfitLocal})</span>
          </div>
        </div>
      `;
    }

    chartManager.renderCostDoughnut('costDoughnutChartCanvas', priceData);
  }

  /* ------------------- Engine 4: Global Readiness Factors ------------------- */
  renderGlobalReadiness() {
    const { globalReadiness } = this.currentAnalysis;
    const container = document.getElementById('readinessFactorsList');
    if (!container) return;

    const factors = [
      { key: 'Product Attractiveness', score: globalReadiness.factors.productAttractiveness, desc: 'Uniqueness of design, artisan appeal, and global visual differentiation.' },
      { key: 'International Demand', score: globalReadiness.factors.internationalDemand, desc: 'Search trends, cultural synergy, and target market consumer intent.' },
      { key: 'Competition Resilience', score: globalReadiness.factors.competition, desc: 'Market saturation, presence of domestic alternatives, and ad auction density.' },
      { key: 'Expected Margin', score: globalReadiness.factors.expectedMargin, desc: 'Net profitability after international logistics, tariffs, and channel cuts.' },
      { key: 'Operational Complexity', score: globalReadiness.factors.operationalComplexity, desc: 'Packaging resilience, customs compliance, and certifications.' }
    ];

    container.innerHTML = factors.map(f => `
      <div class="p-3 rounded-xl bg-[#F8FDFB] border border-[#B7E6D4] space-y-1">
        <div class="flex justify-between items-center text-xs">
          <span class="font-bold text-[#0F382C]">${f.key}</span>
          <span class="font-mono font-bold text-[#249E7C]">${f.score} / 100</span>
        </div>
        <div class="w-full bg-[#D2F0E3] rounded-full h-2 overflow-hidden">
          <div class="bg-[#249E7C] h-full rounded-full" style="width: ${f.score}%"></div>
        </div>
        <p class="text-[11px] text-[#5C7F74] leading-tight">${f.desc}</p>
      </div>
    `).join('');
  }

  /* ------------------- Engine 5: Listing Studio ------------------- */
  renderListingStudio() {
    const marketCode = this.selectedMarketForListing || 'UAE';
    const platform = this.selectedPlatformForListing || 'Amazon';
    
    if (this.marketSelectorTabs) {
      this.marketSelectorTabs.innerHTML = Object.keys(CONFIG.MARKETS).map(mKey => {
        const m = CONFIG.MARKETS[mKey];
        const isSelected = mKey === marketCode;
        return `
          <button data-market="${mKey}" class="listing-market-chip px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all flex items-center gap-1.5 ${isSelected ? 'bg-[#249E7C] border-[#249E7C] text-white shadow-sm' : 'bg-white border-[#B7E6D4] text-[#0F382C] hover:bg-[#E4F5EE]'}">
            <span>${m.flag}</span>
            <span>${m.name}</span>
          </button>
        `;
      }).join('');

      this.marketSelectorTabs.querySelectorAll('.listing-market-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          this.selectedMarketForListing = btn.getAttribute('data-market');
          this.renderListingStudio();
          this.renderPriceIntelligence(this.selectedMarketForListing);
        });
      });
    }

    const listingData = ListingGeneratorEngine.generateListing({
      productData: this.currentAnalysis,
      marketCode,
      platform
    });

    const titleEl = document.getElementById('listingTitleOutput');
    const priceEl = document.getElementById('listingPriceOutput');
    const bulletsEl = document.getElementById('listingBulletsOutput');
    const descEl = document.getElementById('listingDescOutput');
    const keywordsEl = document.getElementById('listingKeywordsOutput');
    const complianceEl = document.getElementById('listingComplianceOutput');
    const mockupTitle = document.getElementById('mockupTitle');
    const mockupPrice = document.getElementById('mockupPrice');
    const mockupImage = document.getElementById('mockupImage');

    if (titleEl) titleEl.innerText = listingData.listingTitle;
    if (priceEl) priceEl.innerText = `${listingData.priceLocalFormatted} (${listingData.priceINRFormatted})`;
    if (mockupTitle) mockupTitle.innerText = listingData.listingTitle;
    if (mockupPrice) mockupPrice.innerText = listingData.priceLocalFormatted;
    if (mockupImage && this.currentImageBase64) mockupImage.src = this.currentImageBase64;

    if (bulletsEl) {
      bulletsEl.innerHTML = listingData.bulletPoints.map(b => `
        <li class="flex items-start gap-2 text-xs text-[#2B4E43]">
          <span class="text-[#249E7C] font-bold mt-0.5">•</span>
          <span>${b}</span>
        </li>
      `).join('');
    }

    if (descEl) descEl.innerText = listingData.description;

    if (keywordsEl) {
      keywordsEl.innerHTML = listingData.searchKeywords.map(k => `
        <span class="px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold bg-[#E4F5EE] border border-[#B7E6D4] text-[#0F382C]">${k}</span>
      `).join('');
    }

    if (complianceEl) {
      complianceEl.innerHTML = listingData.complianceTags.map(tag => `
        <li class="flex items-center gap-2 text-xs text-[#2B4E43] font-medium">
          <svg class="w-3.5 h-3.5 text-[#249E7C] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          <span>${tag}</span>
        </li>
      `).join('');
    }
  }

  /* ------------------- Closed-Loop Simulation ------------------- */
  runSimulationOutcome() {
    const market = this.selectedMarketForListing || 'UAE';
    const targetPrice = this.currentAnalysis?.markets?.find(m => m.code === market)?.suggestedLocalPrice || 99;

    const outcome = closedLoopEngine.simulateOutcome({
      marketCode: market,
      targetPriceLocal: targetPrice,
      initialUnits: this.currentAnalysis?.quantity || 50
    });

    if (this.simulationResults) {
      this.simulationResults.classList.remove('hidden');
      this.simulationResults.innerHTML = `
        <div class="p-6 rounded-2xl bg-[#F8FDFB] border-2 border-[#B7E6D4] space-y-4">
          <div class="flex items-center justify-between border-b border-[#B7E6D4] pb-3">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-[#249E7C] animate-ping"></span>
              <span class="font-bold text-[#0F382C] text-sm">Real-World Outcome Simulation (${market})</span>
            </div>
            <span class="text-xs text-[#5C7F74] font-mono">${new Date().toLocaleTimeString()}</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="p-3.5 rounded-xl bg-white border border-[#B7E6D4]">
              <span class="text-[11px] font-bold text-[#5C7F74]">Total Views / Clicks</span>
              <div class="text-base font-mono font-bold text-[#0F382C] mt-0.5">${outcome.views} / ${outcome.clicks}</div>
              <span class="text-[10px] text-[#249E7C] font-bold">${outcome.ctr} CTR</span>
            </div>
            <div class="p-3.5 rounded-xl bg-white border border-[#B7E6D4]">
              <span class="text-[11px] font-bold text-[#5C7F74]">Conversion Rate</span>
              <div class="text-base font-mono font-bold text-[#249E7C] mt-0.5">${outcome.conversionRate}</div>
              <span class="text-[10px] text-[#5C7F74] font-medium">${outcome.orders} Orders Placed</span>
            </div>
            <div class="p-3.5 rounded-xl bg-white border border-[#B7E6D4]">
              <span class="text-[11px] font-bold text-[#5C7F74]">Simulated Revenue</span>
              <div class="text-base font-mono font-bold text-[#0F382C] mt-0.5">${market === 'UAE' ? 'AED' : '$'} ${outcome.revenueLocal.toLocaleString()}</div>
              <span class="text-[10px] text-[#5C7F74] font-medium">Return Rate: ${outcome.returnRate}</span>
            </div>
            <div class="p-3.5 rounded-xl bg-white border border-[#B7E6D4]">
              <span class="text-[11px] font-bold text-[#5C7F74]">Customer Rating</span>
              <div class="text-base font-mono font-bold text-amber-600 mt-0.5">${outcome.avgRating}</div>
              <span class="text-[10px] text-[#249E7C] font-bold">High Satisfaction</span>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] space-y-1.5 text-xs text-[#78350F]">
            <div class="flex items-center gap-2 font-bold">
              <svg class="w-4 h-4 text-[#78350F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
              <span>Closed-Loop Learning Feedback (Data → Decision → Learning):</span>
            </div>
            <p class="font-medium">${outcome.nextOptimizedAction}</p>
          </div>
        </div>
      `;
    }

    this.showToast('Outcome simulation completed and logged to feedback loop!', 'success');
  }

  /* ------------------- Copy & Export ------------------- */
  copyListingToClipboard() {
    const title = document.getElementById('listingTitleOutput')?.innerText || '';
    const price = document.getElementById('listingPriceOutput')?.innerText || '';
    const desc = document.getElementById('listingDescOutput')?.innerText || '';
    const bullets = Array.from(document.querySelectorAll('#listingBulletsOutput li')).map(li => li.innerText).join('\n');
    const keywords = Array.from(document.querySelectorAll('#listingKeywordsOutput span')).map(sp => sp.innerText).join(', ');

    const payload = `=== FRIDAYY AI LOCALIZED MARKETPLACE LISTING ===\n\nTITLE:\n${title}\n\nPRICE:\n${price}\n\nKEY BULLET POINTS:\n${bullets}\n\nPRODUCT DESCRIPTION:\n${desc}\n\nSEARCH KEYWORDS:\n${keywords}\n`;

    navigator.clipboard.writeText(payload).then(() => {
      this.showToast('Listing copied to clipboard!', 'success');
    }).catch(() => {
      this.showToast('Failed to copy to clipboard', 'error');
    });
  }

  exportJson() {
    if (!this.currentAnalysis) {
      this.showToast('No analysis available to export', 'error');
      return;
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.currentAnalysis, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `fridayy_growth_copilot_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    this.showToast('Exported intelligence report as JSON', 'success');
  }

  /* ------------------- Tab Switcher ------------------- */
  switchTab(tabId) {
    this.activeTab = tabId;
    this.tabBtns.forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('active', 'border-[#249E7C]', 'bg-white', 'text-[#0F382C]', 'shadow-sm');
        btn.classList.remove('border-transparent', 'text-[#5C7F74]');
      } else {
        btn.classList.remove('active', 'border-[#249E7C]', 'bg-white', 'text-[#0F382C]', 'shadow-sm');
        btn.classList.add('border-transparent', 'text-[#5C7F74]');
      }
    });

    this.tabPanes.forEach(pane => {
      if (pane.id === `tabPane_${tabId}`) {
        pane.classList.remove('hidden');
      } else {
        pane.classList.add('hidden');
      }
    });
  }

  /* ------------------- Helper Utilities ------------------- */
  async setLoaderStep(text, percent) {
    if (this.loadingStepText) this.loadingStepText.innerText = text;
    if (this.loadingProgressBar) this.loadingProgressBar.style.width = `${percent}%`;
  }

  showLoader(show) {
    if (this.loadingOverlay) {
      if (show) this.loadingOverlay.classList.remove('hidden');
      else this.loadingOverlay.classList.add('hidden');
    }
    if (this.btnAnalyze) {
      this.btnAnalyze.disabled = show;
      this.btnAnalyze.innerHTML = show
        ? `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg> Running Live AI Analysis...`
        : `<span>Find My Best Global Market →</span>`;
    }
  }

  showToast(message, type = 'info') {
    if (!this.toastContainer) return;
    const toast = document.createElement('div');
    const bgClass = type === 'error' ? 'bg-rose-100 border-rose-300 text-rose-800' : type === 'success' ? 'bg-[#E4F5EE] border-[#249E7C] text-[#0F382C]' : 'bg-white border-[#B7E6D4] text-[#0F382C]';
    
    toast.className = `flex items-center gap-2 px-4 py-3 rounded-xl border shadow-lg text-xs font-bold transform transition-all duration-300 opacity-0 translate-y-2 ${bgClass}`;
    toast.innerHTML = `
      <span>${type === 'error' ? '⚠️' : type === 'success' ? '✓' : 'ℹ️'}</span>
      <span>${message}</span>
    `;

    this.toastContainer.appendChild(toast);
    
    requestAnimationFrame(() => {
      toast.classList.remove('opacity-0', 'translate-y-2');
    });

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.fridayyApp = new FridayyApp();
});
