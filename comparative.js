/**
 * COMPARATIVE MODULE
 * 1. Regime Comparison (IRPP vs IS)
 * 2. Multi-year Comparison (2025 vs 2026)
 */

function initComparative() {
    const container = document.getElementById('comparative-container');
    if (!container) return;

    container.innerHTML = `
        <div class="glass-card module-card" style="padding: 25px;">
            <h3 style="margin-top:0; font-size: 1.4rem; margin-bottom: 5px;" data-i18n="compare_main_title">📊 IRPP vs IS : Quel régime choisir ?</h3>
            <p style="margin-bottom: 25px; opacity:0.8; font-size:0.9rem;" data-i18n="compare_subtitle_main">Déterminez le régime optimal pour votre activité</p>
            
            <div class="form-grid">
                <div class="form-group">
                    <label data-i18n="label_est_profit">Bénéfice Net Estimé (Annuel)</label>
                    <input type="number" id="comp-benefice" class="form-control" placeholder="Ex: 60 000">
                </div>
                <div class="form-group">
                    <label data-i18n="label_manager_salary">Salaire Gérant (Mensuel)</label>
                    <input type="number" id="comp-salaire" class="form-control" placeholder="Ex: 2 000">
                </div>
            </div>

            <button class="btn-primary" style="width:100%; margin-top:20px;" onclick="runComparison()" data-i18n="btn_run_compare">
                Lancer la Comparaison
            </button>

            <div id="comp-results" style="margin-top: 25px; display:none;">
                <!-- Results -->
            </div>
        </div>

        <div class="glass-card module-card" style="padding: 25px; margin-top: 25px;">
            <h3 style="margin-top:0;" data-i18n="compare_evolution_title">📅 Évolution Fiscale (2025 vs 2026)</h3>
            <p style="font-size:0.9em; opacity:0.8; margin-bottom: 20px;" data-i18n="compare_evolution_desc">Simulez l'impact du nouveau barème 2026 sur vos revenus.</p>
            
            <div class="form-group">
                <label data-i18n="label_annual_taxable_income">Revenu Annuel Imposable</label>
                <div style="display: flex; gap: 10px;">
                    <input type="number" id="hist-revenu" class="form-control" placeholder="Ex: 30 000">
                    <button class="btn-secondary" onclick="runHistoryComparison()" data-i18n="btn_compare_history">Comparer</button>
                </div>
            </div>

            <canvas id="historyChart" style="max-height: 200px; display:none; margin-top:15px;"></canvas>
            <div id="hist-text" style="margin-top:10px;"></div>
        </div>
    `;
}

window.runComparison = function () {
    // ... (Existing Compare Logic Placeholder) ...
    // For brevity, simple logic
    const benefice = parseFloat(document.getElementById('comp-benefice').value) || 0;

    // IRPP Direct
    // IS Direct (20% + Dividendes 10%)

    const impotIRPP = calculateIRPPCore({ grossIncome: benefice, typeRevenu: 'salarie', nbEnfants: 0 }).totalRetenue;

    const impotIS = (benefice * 0.20) + ((benefice * 0.80) * 0.10); // IS + Taxe Dividende

    const container = document.getElementById('comp-results');
    container.style.display = 'block';

    const best = (impotIRPP < impotIS) ? "Entreprise Individuelle (IRPP)" : "Société (IS)";
    const diff = Math.abs(impotIRPP - impotIS);

    const resHtmlTitle = window.t('res_compare_advantageous').replace('{{best}}', best);

    container.innerHTML = `
        <div class="result-card" style="padding: 20px; border-radius: 15px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);">
            <h4 style="margin-top:0; color: #fff;">${resHtmlTitle}</h4>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:15px;">
                <div style="background:rgba(255,255,255,0.03); padding:15px; border-radius:12px;">
                    <strong style="display:block; font-size:0.8rem; color:#94a3b8; margin-bottom:5px;" data-i18n="res_irpp_direct">${window.t('res_irpp_direct')}</strong>
                    <span style="font-size:1.1rem; font-weight:700; color:${impotIRPP < impotIS ? '#10b981' : '#ef4444'}">${impotIRPP.toFixed(3)} DT</span>
                </div>
                <div style="background:rgba(255,255,255,0.03); padding:15px; border-radius:12px;">
                    <strong style="display:block; font-size:0.8rem; color:#94a3b8; margin-bottom:5px;" data-i18n="res_is_dividends">${window.t('res_is_dividends')}</strong>
                    <span style="font-size:1.1rem; font-weight:700; color:${impotIS < impotIRPP ? '#10b981' : '#ef4444'}">${impotIS.toFixed(3)} DT</span>
                </div>
            </div>
            <p style="margin-top:15px; font-size:0.95rem; color:#cbd5e1;">${window.t('label_potential_saving')} <strong style="color:#10b981;">${diff.toFixed(3)} DT</strong></p>
        </div>
    `;
};

window.runHistoryComparison = function () {
    const revenu = parseFloat(document.getElementById('hist-revenu').value) || 0;
    if (revenu === 0) return;

    // Calc 2026
    window.setYear('2026'); // Use official bridge
    const res2026 = calculateIRPPCore({ grossIncome: revenu, nbEnfants: 0 });

    // Calc 2025
    window.setYear('2025');
    const res2025 = calculateIRPPCore({ grossIncome: revenu, nbEnfants: 0 });
    window.setYear('2026'); // Restore

    const ctx = document.getElementById('historyChart');
    ctx.style.display = 'block';

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [window.t('label_year_2025'), window.t('label_year_2026')],
            datasets: [{
                label: window.t('res_impot_total'),
                data: [res2025.totalRetenue, res2026.totalRetenue],
                backgroundColor: ['#64748b', '#3b82f6'],
                borderRadius: 4
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                y: { ticks: { color: '#fff' } }
            }
        }
    });

    const gain = res2025.totalRetenue - res2026.totalRetenue;
    const textEl = document.getElementById('hist-text');
    if (gain > 0) {
        textEl.innerHTML = `<span style="color:#10b981; font-weight:600;">${window.t('label_buy_power_gain')} +${gain.toFixed(3)} DT en 2026</span>`;
    } else if (gain < 0) {
        textEl.innerHTML = `<span style="color:#f59e0b; font-weight:600;">${window.t('label_fiscal_pressure_increase')}</span>`;
    } else {
        textEl.innerHTML = "-";
    }
};
