import math

def calculer_irpp_2026(salaire_brut_mensuel, chef_de_famille, nb_enfants, nb_etudiants):
    """
    Calcul rigoureux de l'IRPP et CSS selon la Loi de Finances Tunisie 2026.
    """
    
    # 1. Constantes
    CNSS_TAUX = 0.0918
    FRAIS_PRO_TAUX = 0.10
    FRAIS_PRO_PLAFOND = 2000.0
    DEDUC_CHEF_FAMILLE = 300.0
    DEDUC_ENFANT = 100.0
    DEDUC_ETUDIANT = 1000.0
    CSS_TAUX = 0.005 # 0.5%
    
    LIMIT_ENFANTS_STD = 4
    
    # Barème 2026
    BAREME = [
        (0, 5000, 0.0),
        (5000, 10000, 0.15),
        (10000, 20000, 0.25),
        (20000, 30000, 0.30),
        (30000, 40000, 0.33),
        (40000, 50000, 0.36),
        (50000, 70000, 0.38),
        (70000, float('inf'), 0.40)
    ]

    # 2. Calculs Initiaux
    salaire_brut_annuel = salaire_brut_mensuel * 12
    
    # 3. CNSS
    cnss_annuelle = salaire_brut_annuel * CNSS_TAUX
    salaire_brut_apres_cnss = salaire_brut_annuel - cnss_annuelle
    
    # 4. Frais Professionnels
    frais_pros = min(salaire_brut_apres_cnss * FRAIS_PRO_TAUX, FRAIS_PRO_PLAFOND)
    
    net_imposable_base = salaire_brut_apres_cnss - frais_pros
    
    # 5. Déductions Familiales
    deductions = 0.0
    
    if chef_de_famille:
        deductions += DEDUC_CHEF_FAMILLE
        
    # Enfants (Max 4 pour les 100 DT)
    nb_enfants_valids = min(nb_enfants, LIMIT_ENFANTS_STD)
    deductions += (nb_enfants_valids * DEDUC_ENFANT)
    
    # Etudiants (Specific deduction)
    deductions += (nb_etudiants * DEDUC_ETUDIANT)
    
    # 6. Assiette Imposable
    assiette = max(0, net_imposable_base - deductions)
    
    # 7. Calcul IRPP par tranches
    irpp_total = 0.0
    details_tranches = []
    
    print(f"\n--- DÉTAIL CALCUL TRANCHES (Assiette : {assiette:.3f} DT) ---")
    
    for (lower, upper, rate) in BAREME:
        if assiette > lower:
            # La base taxable dans cette tranche est la partie de l'assiette qui tombe dedans
            # C'est le min(assiette, upper) - lower
            base_tranche = min(assiette, upper) - lower
            
            tax_tranche = base_tranche * rate
            irpp_total += tax_tranche
            
            if base_tranche > 0 or rate == 0:
                 print(f"Tranche {lower}-{upper} ({rate*100}%): {base_tranche:.3f} DT -> {tax_tranche:.3f} DT")
    
    # 8. CSS
    css_total = assiette * CSS_TAUX
    
    # 9. Totaux et Net
    total_impot = irpp_total + css_total
    
    net_annuel = salaire_brut_annuel - cnss_annuelle - total_impot
    net_mensuel = net_annuel / 12
    
    return {
        "Brut Annuel": salaire_brut_annuel,
        "CNSS": cnss_annuelle,
        "Frais Pros": frais_pros,
        "Déductions Famille": deductions,
        "Assiette Imposable": assiette,
        "IRPP": irpp_total,
        "CSS": css_total,
        "Total Impôt": total_impot,
        "Net Mensuel": net_mensuel
    }

# --- EXEMPLE D'EXECUTION (TEST) ---
# Cas : Salarié, 2400 DT Brut/mois, Chef de famille, 2 enfants dont 1 étudiant
res = calculer_irpp_2026(2400, True, 2, 1)

print("\n--- RÉSULTATS FINAUX ---")
for k, v in res.items():
    print(f"{k}: {v:.3f} DT")
