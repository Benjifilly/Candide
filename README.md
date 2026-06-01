<div align="center">

# 🍃 Candide

**Assistant intelligent, discret et haut de gamme pour la plateforme Projet Voltaire.**

[![Version](https://img.shields.io/badge/version-1.0.0-amber?style=flat-square)](https://github.com/Benjifilly/candide/releases/latest)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-green?style=flat-square&logo=google-chrome)](https://developer.chrome.com/docs/extensions/mv3/)
[![License](https://img.shields.io/badge/license-MIT-orange?style=flat-square)](LICENSE)

_Ce projet est un fork personnalisé et grandement amélioré partir de l'excellent travail initial de [quelquun667/Projet-Voltaire-Solver](https://github.com/quelquun667/Projet-Voltaire-Solver)._

---

### 📸 Aperçu de l'interface

|           🌗 Mode Sombre Minimaliste           |                 🎛️ Réglages Avancés                  |
| :--------------------------------------------: | :--------------------------------------------------: |
| ![Aperçu Popup](screenshots/popup_preview.png) | ![Aperçu Réglages](screenshots/settings_preview.png) |

</div>

---

## ✨ Fonctionnalités majeures

| Fonctionnalité                          | Description                                                                                                                                             |
| :-------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 🔍 **React Fiber Extraction**           | Lit les réponses directement dans l'état interne React de l'application (pas d'IA, pas de clé API requise, 100% précis).                                |
| 🤫 **Mode Discret (Manuel)**            | Notre ajout phare : aucun clic auto, surbrillance par pointillés ultra-fins de la bonne réponse. Invisible à l'écran mais parfait pour guider vos yeux. |
| ⌨️ **Raccourcis Clavier Globaux**       | Contrôlez l'extension à la volée sans jamais ouvrir le popup (`Alt + Shift + D/A/S/F`).                                                                 |
| ✅ **Exercices "Cliquer sur la faute"** | Détecte et clique sur le mot erroné, ou sur _"Il n'y a pas de faute"_.                                                                                  |
| 📝 **Exercices "Cliquer sur le mot"**   | Identifie et clique sur le bon mot (COD, participe passé, etc.).                                                                                        |
| 📋 **Exercices "Cliquer / Déposer"**    | Place automatiquement les phrases dans les bonnes colonnes (Tableaux).                                                                                  |
| 📊 **Stats en temps réel**              | Compteur de réussite et d'erreurs réinitialisé à chaque nouvelle session.                                                                               |
| ⏱️ **Délais Humains**                   | Intervalle de temps aléatoire configurable (min/max) pour simuler un comportement humain naturel.                                                       |
| 🎲 **Taux d'Erreur Configurable**       | Possibilité de rater volontairement des questions (de 0 à 50%) pour lisser vos scores.                                                                  |
| 🕵️ **Mode Inspecteur**                  | Outil intégré pour analyser les sélecteurs DOM pour le débogage.                                                                                        |

---

## ⌨️ Raccourcis Clavier (Ultra Pratiques)

Gardez les mains sur le clavier ! Les raccourcis ont été pensés pour être réactifs instantanément, même sur la question en cours d'affichage :

- 🤫 **`Alt + Shift + D`** : Activer le **Mode Discret** (Manuel). _(Réévalue et affiche instantanément les pointillés de la phrase active)_
- ⚡ **`Alt + Shift + A`** : Activer le **Mode Automatique**.
- 🛑 **`Alt + Shift + S`** : **Désactiver** complètement l'assistant.
- 🎯 **`Alt + Shift + F`** : **Forcer** la résolution/validation uniquement de la phrase en cours.

---

## 🛠️ Guide d'Installation Pas-à-Pas

L'extension s'installe en quelques secondes via le mode développeur de votre navigateur basé sur Chromium (Chrome, Brave, Edge, Opera, Vivaldi...).

### Étape 1 : Récupérer le projet

Téléchargez ce dépôt GitHub sous forme d'archive ZIP et décompressez-la dans un dossier permanent sur votre ordinateur (par exemple dans vos Documents).

### Étape 2 : Ouvrir la page des Extensions

Dans votre navigateur :

1. Ouvrez un nouvel onglet et tapez : `chrome://extensions/`
2. Assurez-vous d'être sur la page de gestion des extensions.

### Étape 3 : Activer le Mode Développeur

En haut à droite de l'écran, cochez ou activez l'interrupteur **Mode développeur**.

![Activer le mode développeur](screenshots/step_developer_mode.png)

### Étape 4 : Charger l'extension

1. Cliquez sur le bouton **Charger l'extension non empaquetée** (en haut à gauche).
2. Sélectionnez le dossier contenant l'extension (le dossier principal `Candide` qui contient le fichier `manifest.json`).

![Charger l'extension non empaquetée](screenshots/step_load_unpacked.png)

🚀 **Félicitations !** Candide est désormais installée. Épinglez-la dans votre barre d'outils pour y accéder facilement.

---

## ⚙️ Paramètres de Sécurité Recommandés

Pour une discrétion maximale et éviter toute détection comportementale par la plateforme :

- **Délais** : Nous vous conseillons de configurer un délai aléatoire entre `2000ms` et `4000ms` afin d'imiter le rythme de lecture d'un être humain.
- **Taux d'erreur** : Un taux de `8%` à `15%` est idéal. Faire des fautes de temps en temps est indispensable pour un comportement naturel et des statistiques cohérentes.

---

## ⚖️ Mentions Légales

_Ce projet est destiné uniquement à un but éducatif, de recherche et pour un usage privé. L'auteur décline toute responsabilité quant à l'utilisation qui pourrait être faite de cet outil._
