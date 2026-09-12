/**
 * Fridayy Chart Manager - Chart.js Visualizations (Official Fridayy Theme)
 */

export class ChartManager {
  constructor() {
    this.readinessRadarChart = null;
    this.opportunityBarChart = null;
    this.costBreakdownChart = null;
  }

  /**
   * Render the 5-Factor Global Readiness Radar Chart
   */
  renderRadarChart(canvasId, factors = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === 'undefined') return;

    if (this.readinessRadarChart) {
      this.readinessRadarChart.destroy();
    }

    const labels = [
      'Product Attractiveness',
      'International Demand',
      'Competition Resilience',
      'Expected Margin',
      'Operational Feasibility'
    ];

    const dataValues = [
      factors.productAttractiveness || 90,
      factors.internationalDemand || 86,
      factors.competition || 72,
      factors.expectedMargin || 88,
      factors.operationalComplexity || 70
    ];

    const ctx = canvas.getContext('2d');
    
    // Fridayy emerald gradient
    const gradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 10,
      canvas.width / 2, canvas.height / 2, 140
    );
    gradient.addColorStop(0, 'rgba(36, 158, 124, 0.45)');
    gradient.addColorStop(1, 'rgba(36, 158, 124, 0.08)');

    this.readinessRadarChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Product Readiness Factor',
          data: dataValues,
          backgroundColor: gradient,
          borderColor: '#249E7C',
          borderWidth: 2.5,
          pointBackgroundColor: '#0F382C',
          pointBorderColor: '#FFFFFF',
          pointHoverBackgroundColor: '#FFFFFF',
          pointHoverBorderColor: '#249E7C',
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: {
              color: 'rgba(15, 56, 44, 0.12)'
            },
            grid: {
              color: 'rgba(15, 56, 44, 0.08)'
            },
            pointLabels: {
              color: '#0F382C',
              font: {
                family: 'Plus Jakarta Sans, sans-serif',
                size: 11,
                weight: '600'
              }
            },
            ticks: {
              display: false,
              stepSize: 20,
              min: 0,
              max: 100
            },
            suggestedMin: 0,
            suggestedMax: 100
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#0F382C',
            titleColor: '#FFFFFF',
            bodyColor: '#D2F0E3',
            borderColor: '#249E7C',
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: function(context) {
                return ` Score: ${context.raw} / 100`;
              }
            }
          }
        }
      }
    });
  }

  /**
   * Render Multi-Country Opportunity & Margin Comparison Bar Chart
   */
  renderOpportunityChart(canvasId, markets = []) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === 'undefined') return;

    if (this.opportunityBarChart) {
      this.opportunityBarChart.destroy();
    }

    const labels = markets.map(m => `${m.flag} ${m.code}`);
    const opportunityScores = markets.map(m => m.opportunityScore || 80);
    const marginPercents = markets.map(m => m.estimatedNetMarginPercent || 35);

    const ctx = canvas.getContext('2d');

    this.opportunityBarChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Opportunity Score (0-100)',
            data: opportunityScores,
            backgroundColor: 'rgba(36, 158, 124, 0.9)',
            borderColor: '#249E7C',
            borderWidth: 1,
            borderRadius: 8,
            barPercentage: 0.6
          },
          {
            label: 'Net Margin (%)',
            data: marginPercents,
            backgroundColor: 'rgba(15, 56, 44, 0.85)',
            borderColor: '#0F382C',
            borderWidth: 1,
            borderRadius: 8,
            barPercentage: 0.6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#0F382C', font: { family: 'Plus Jakarta Sans, sans-serif', weight: '700' } }
          },
          y: {
            grid: { color: 'rgba(15, 56, 44, 0.08)' },
            ticks: { color: '#5C7F74' },
            min: 0,
            max: 100
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: { color: '#0F382C', font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' } }
          },
          tooltip: {
            backgroundColor: '#0F382C',
            borderColor: '#249E7C',
            borderWidth: 1
          }
        }
      }
    });
  }

  /**
   * Render Granular Cost Breakdown Doughnut Chart
   */
  renderCostDoughnut(canvasId, priceData) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === 'undefined' || !priceData) return;

    if (this.costBreakdownChart) {
      this.costBreakdownChart.destroy();
    }

    const ctx = canvas.getContext('2d');

    const labels = ['Product Cost (COGS)', 'Intl Shipping', 'Platform Fees', 'Customs Duty', 'Net Profit'];
    const values = [
      priceData.cogs,
      priceData.estimatedShippingINR,
      priceData.platformFeeINR,
      priceData.customsDutyINR,
      priceData.netProfitINR
    ];

    this.costBreakdownChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: [
            '#94A3B8', // COGS
            '#38BDF8', // Shipping
            '#FBBF24', // Platform Fees
            '#F87171', // Duties
            '#249E7C'  // Net Profit
          ],
          borderColor: '#FFFFFF',
          borderWidth: 2.5,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#0F382C',
              font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' },
              boxWidth: 12,
              padding: 12
            }
          },
          tooltip: {
            backgroundColor: '#0F382C',
            callbacks: {
              label: function(context) {
                const val = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const pct = ((val / total) * 100).toFixed(1);
                return ` ${context.label}: ₹${val.toLocaleString()} (${pct}%)`;
              }
            }
          }
        }
      }
    });
  }
}

export const chartManager = new ChartManager();
