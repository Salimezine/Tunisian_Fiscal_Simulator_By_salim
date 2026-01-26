# Changelog - Simulateur Fiscal Tunisien

## Version 2.1.0 - Assistant Éducatif (2026-01-17)

### 🎓 Assistant AI Transformé
- **Assistant Éducatif Strict** : L'IA ne fournit plus de conseils juridiques, uniquement des explications pédagogiques
- **Structure de réponse obligatoire** : Toutes les réponses suivent 4 parties (Explication → Hypothèses → Référence Légale → Avertissement)
- **Disclaimer automatique** : Chaque réponse inclut l'avertissement obligatoire sur la nature éducative
- **Références légales uniquement officielles** : Code IRPP/IS, Loi de Finances 2026, JORT, Ministère des Finances

### 💬 Interface AI Améliorée
- **Bouton "Expliquez-moi" visible** : Label textuel sur desktop pour meilleure découvrabilité
- **Animation pulsée** : Attire l'attention sur l'assistant AI
- **Header clair** : "Assistant Éducatif - Non Juridique" pour éviter toute confusion
- **Raccourcis simplifiés** : IRPP, ZDR, Mon résultat (plus facile d'utilisation)

### 🎨 Design & UX
- **Hiérarchie visuelle renforcée** : Espacement amélioré entre sections (35px padding)
- **Disclaimers mis en évidence** : Boîtes jaunes pour les avertissements
- **Références légales stylisées** : Icône 📚 avant chaque citation légale
- **Glassmorphism amélioré** : Effets de verre dépoli plus prononcés
- **Responsive optimisé** : Adaptation parfaite mobile/tablet/desktop

### 📱 Mobile
- **Design moderne** : Interface fintech premium avec gradients
- **Bouton AI adaptatif** : Texte sur desktop, icône seule sur mobile
- **Chat widget fluide** : Scroll naturel sur petits écrans

### 🛡️ Signaux de Confiance
- **Avertissements visibles** : Style warning (jaune/amber) pour les disclaimers
- **Sources officielles** : Footer avec liens JORT, Ministère des Finances
- **Citations légales** : Format automatique pour articles et lois

### 🔧 Technique
- Ajout de classes CSS : `.result-disclaimer`, `.legal-reference-box`, `.chat-disclaimer`
- Formatage automatique des réponses AI avec `formatChatResponse()`
- Configuration stricte dans `AI_CONFIG.systemPrompt`
- Constante `mandatoryDisclaimer` pour cohérence

---

## Version 2.0.0 - Loi de Finances 2026 (Précédent)
- Mise à jour barème IRPP (8 tranches)
- Intégration n8n chatbot
- Mode Audit activé
