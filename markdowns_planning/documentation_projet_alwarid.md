# 🏥 ALWARID — Documentation Complète du Projet
### Plateforme d'Aide à la Décision Médicale avec Intelligence Artificielle
*Version 2.0 — Mars 2026*

---

## 📋 Table des Matières

1. [Vision & Problématique](#1-vision--problématique)
2. [Prémisse Fondamentale — Le Maroc Numérise sa Santé](#2-prémisse-fondamentale)
3. [Architecture de la Plateforme](#3-architecture-de-la-plateforme)
4. [Les 4 Modes Opératoires](#4-les-4-modes-opératoires)
5. [Mode Urgence — Détails Complets](#5-mode-urgence)
6. [Mode Consultation — Détails Complets](#6-mode-consultation)
7. [Mode Suivi — Détails Complets](#7-mode-suivi)
8. [Mode Transfert — Détails Complets](#8-mode-transfert)
9. [Le Modèle 3D Anatomique Interactif](#9-le-modèle-3d-anatomique-interactif)
10. [L'Intelligence Artificielle — Toutes les Couches](#10-lintelligence-artificielle)
11. [Le Modèle de Données Patient](#11-le-modèle-de-données-patient)
12. [Stack Technique](#12-stack-technique)
13. [Proposition de Valeur](#13-proposition-de-valeur)

---

## 1. Vision & Problématique

### Le Constat

Dans les hôpitaux publics marocains — et notamment au CHU Hassan II de Fès — un médecin passe une proportion significative de son temps **non pas à soigner, mais à chercher des informations**. Face à un patient, surtout aux urgences, il doit :

- Retrouver l'historique médical complet (consultations, opérations, analyses…)
- Identifier les allergies connues et les interactions médicamenteuses
- Consulter les scans et imageries précédentes
- Comprendre les pathologies chroniques en cours et leur sévérité
- Communiquer ces informations lors d'un transfert entre services

**Ce temps perdu n'est pas juste un problème d'efficacité — dans un contexte médical, chaque minute peut avoir des conséquences irréversibles.**

### La Vision

**Alwarid** (الوريد — "la veine" en arabe, symbolisant le flux vital d'information) est une plateforme qui agit comme un **copilote médical** : elle ne remplace pas le médecin, elle lui redonne du temps, de la clarté, et de la sérénité dans les moments où il en a le plus besoin.

---

## 2. Prémisse Fondamentale

### Le Maroc Construit l'Infrastructure — Alwarid Apporte l'Intelligence

Alwarid repose sur une prémisse fondamentale : **le Maroc est en train de centraliser et numériser les données de santé de ses citoyens.** Notre plateforme est conçue pour fonctionner **au-dessus** de cette infrastructure en construction.

#### Ce que le Maroc met en place :

| Initiative | Description | Statut |
|---|---|---|
| **Registre National de la Population (RNP)** | Identifiant Digital Civil et Social (IDCS) unique pour chaque citoyen — 9-10 chiffres, basé sur biométrie (iris, Face ID, empreintes) | Déployé |
| **Identifiant Patient (IDP)** | Numéro de santé intégré dans la puce de la CNIE (Carte Nationale d'Identité Électronique) | En cours |
| **Dossier Médical Partagé (DMP)** | Dossier patient national partagé entre tous les établissements et cabinets — budget de 190M DH | Convention signée (fév. 2024) |
| **Feuille de Soins Électronique (FSE)** | Prescription avec QR code unique, scannable par tout professionnel de santé | Pilote Kénitra (mars 2026) |
| **Système HOSIX** | Dossier Médical Électronique déjà fonctionnel dans les hôpitaux | Actif dans 140 hôpitaux |
| **AMO généralisée** | 32 millions de bénéficiaires (88% de la population) | Opérationnel |

#### Le Gap qu'Alwarid Comble :

```
Infrastructure Nationale (Stockage + Centralisation)
    └── RNP → IDCS → CNIE → DMP → SIH → FSE → QR code patient
            │
            │ ← LES DONNÉES SONT LÀ, CENTRALISÉES
            │
            ▼
    ╔══════════════════════════════════════╗
    ║         ALWARID INTERVIENT ICI       ║
    ║  Couche d'Intelligence au-dessus     ║
    ║                                      ║
    ║  • Visualisation 3D des alertes      ║
    ║  • Priorisation des urgences         ║
    ║  • IA d'interprétation (ECG, scans)  ║
    ║  • Chatbot médical contextualisé     ║
    ║  • Génération automatique de rapports║
    ║  • Transfert sécurisé inter-services ║
    ╚══════════════════════════════════════╝
```

**La donnée centralisée sans intelligence reste inutilisable efficacement par un médecin sous pression.** Alwarid est le pont entre la donnée brute et la décision médicale.

---

## 3. Architecture de la Plateforme

### Vue Globale

```
┌──────────────────────────────────────────────────────┐
│                    ALWARID                            │
├──────────┬──────────┬──────────┬─────────────────────┤
│ URGENCE  │ CONSULT  │  SUIVI   │    TRANSFERT        │
│ (Rouge)  │ (Bleu)   │ (Vert)   │    (Orange)         │
├──────────┴──────────┴──────────┴─────────────────────┤
│              COUCHE TRANSVERSALE                      │
│  ┌─────────┐  ┌──────────┐  ┌────────────────────┐  │
│  │ 3D Body │  │ Chatbot  │  │  Moteur IA (Gemini │  │
│  │ Viewer  │  │  Médical │  │  + T-MECA ECG)     │  │
│  └─────────┘  └──────────┘  └────────────────────┘  │
├──────────────────────────────────────────────────────┤
│              DONNÉES PATIENT                          │
│  Identité | Historique | Scans | Médicaments |       │
│  Allergies | Interactions | Régions corporelles      │
└──────────────────────────────────────────────────────┘
```

### Parcours Utilisateur

1. **Page d'accueil** → Le médecin se connecte
2. **Sélection du mode** → Urgence, Consultation, Suivi, ou Transfert
3. **Recherche patient** → Par nom, identifiant, ou CIN (connecté au DMP national)
4. **Dashboard contextuel** → Interface adaptée au mode choisi avec toutes les données du patient

---

## 4. Les 4 Modes Opératoires

Chaque mode est conçu pour un **contexte clinique précis**, avec une interface, des données et des fonctionnalités adaptées à la situation.

| Mode | Couleur | Contexte | Objectif Principal |
|------|---------|----------|-------------------|
| **Urgence** | 🔴 Rouge | Patient critique, temps compté | Accès immédiat aux infos vitales + alertes |
| **Consultation** | 🔵 Bleu | Rendez-vous programmé | Exploration complète du dossier + rapports IA |
| **Suivi** | 🟢 Vert | Pathologie chronique | Monitoring continu + courbes d'évolution |
| **Transfert** | 🟠 Orange | Changement de service/hôpital | Partage sécurisé du dossier avec consentement |

---

## 5. Mode Urgence

### Objectif
Donner au médecin urgentiste **tout ce dont il a besoin en moins de 5 secondes**, même si le patient est inconscient et sans famille.

### Fonctionnalités Détaillées

#### 5.1 — Bandeau d'Alertes Critiques
Dès l'ouverture du dossier, un bandeau rouge affiche :
- **Allergies connues** (ex: Pénicilline, Sulfamides) — impossible à rater
- **Interactions médicamenteuses dangereuses** avec niveau de sévérité (critique / attention)
- **Pathologies chroniques actives** avec détails (ex: Diabète T2, HbA1c 7.8%)

#### 5.2 — Constantes Vitales en Temps Réel
Tableau de bord des constantes avec **codes couleur automatiques** :
- Fréquence cardiaque (normal: 60-100 bpm)
- Pression artérielle (normal: < 140/90)
- Saturation O2 (normal: > 95%)
- Température (normal: 36.1-37.8°C)
- Glycémie (normal: 0.7-1.1 g/L)

Les valeurs anormales s'affichent **automatiquement en rouge** avec un signal visuel.

#### 5.3 — Modèle 3D Anatomique
Le corps humain 3D du patient s'affiche avec :
- **Zone Thorax en rouge** → le patient a une HTA stade 2 + arythmie
- **Zone Abdomen en rouge** → diabète type 2
- **Zone Jambe gauche en orange** → gonarthrose + neuropathie
- Un **clic** sur une zone → affiche instantanément les conditions, scans, et traitements associés

#### 5.4 — Chatbot IA Urgentiste
Un assistant IA contextuel spécifiquement conçu pour les urgences :
- Le médecin pose une question en langage naturel (texte ou voix)
- L'IA répond **en tenant compte du dossier complet du patient**
- Exemples de questions :
  - *"Quelles sont les allergies de ce patient ?"*
  - *"Est-ce que je peux lui donner de la pénicilline ?"*
  - *"Résume-moi son historique cardiaque"*
  - *"Quels sont ses derniers résultats de labo ?"*
- Messages rapides pré-définis pour les situations critiques

#### 5.5 — Historique Filtré
En mode urgence, l'historique n'affiche **que les événements critiques** :
- Passages aux urgences antérieurs
- Opérations chirurgicales
- Résultats d'analyses récents
Les consultations de routine (dentiste, dermato...) sont **automatiquement masquées** pour ne pas encombrer.

#### 5.6 — Médicaments et Interactions
Liste complète des médicaments avec :
- Nom, dosage, fréquence, indication
- **Alertes d'interactions** croisées (ex: Amlodipine + Bisoprolol → risque de bradycardie)
- Sources des interactions (Base Vidal, DrugBank)

---

## 6. Mode Consultation

### Objectif
Permettre au médecin consulteur d'**explorer le dossier en profondeur**, de **générer des rapports IA**, et de **prescrire** — tout dans une seule interface.

### Les 6 Onglets

#### 6.1 — Vue d'Ensemble
Fiche patient complète :
- Identité (nom, âge, sexe, groupe sanguin, taille, poids, ville)
- Contact d'urgence
- Allergies connues
- Pathologies actives avec niveau de sévérité (critique / attention)
- Traitements en cours avec posologie et indication
- Interactions médicamenteuses

#### 6.2 — Historique Médical Complet
Timeline chronologique de **tous les événements médicaux** du patient :
- Consultations spécialisées (cardiologie, diabétologie, ophtalmologie, dermatologie, ORL, rhumatologie, pneumologie, allergologie, gastro-entérologie, podologie, urologie...)
- Analyses de laboratoire
- Imagerie médicale (ECG, écho, IRM, scanner, radiographie, EMG...)
- Opérations chirurgicales
- Vaccinations
- Passages aux urgences

Chaque entrée contient : **date, type, titre, médecin, hôpital, détails cliniques.**

**Filtrage par type** (consultation, analyse, imagerie, opération, vaccination, urgence) pour retrouver rapidement un événement précis.

#### 6.3 — Documents & Intelligence Artificielle
C'est le **cœur de l'IA** d'Alwarid. Le médecin choisit un type de document, et l'IA le génère :

| Document IA | Description | Technologie |
|---|---|---|
| **ECG / Arythmie** | Analyse d'ECG avec classification + Explainable AI (Grad-CAM) | Modèle T-MECA (ResNet18) |
| **Compte-rendu Échographique** | Rapport structuré basé sur les observations du médecin | Gemini 2.0 Flash |
| **Compte-rendu Radiologique** | Interprétation et recommandations pour radio/IRM/scanner | Gemini 2.0 Flash |
| **Fiche de Surveillance** | Monitoring et évolution des paramètres vitaux | Gemini 2.0 Flash |
| **Protocole de Traitement** | Plan thérapeutique personnalisé et posologie | Gemini 2.0 Flash |
| **Fiche d'Évaluation** | Comparaison avec les états précédents du patient | Gemini 2.0 Flash |

**Fonctionnement détaillé de la génération de rapport :**
1. Le médecin sélectionne le type de document
2. Il tape ses observations cliniques (texte) **ou dicte par voix** (reconnaissance vocale intégrée)
3. L'IA génère un rapport médical structuré complet en quelques secondes
4. Le rapport s'affiche avec une **animation de frappe** (typing effect)
5. Le médecin peut **télécharger en Word (.docx)** ou **ajouter au dossier patient**

**Fonctionnement détaillé de l'ECG :**
1. Sélection du type de signal (Normal, Supra-ventriculaire, Ventriculaire, Fusion, Unknown)
2. Lancement de l'analyse par le modèle T-MECA
3. Résultats affichés :
   - **Tracé ECG** en SVG avec le signal original
   - **Carte de chaleur Grad-CAM 1D** superposée — montre visuellement **où l'IA a regardé** pour prendre sa décision (rouge = haute attention, vert = basse attention)
   - **Classification** avec classe prédite et pourcentage de confiance
   - **Probabilités** pour chaque classe d'arythmie
   - **Incertitude MC-Dropout** : entropie prédictive, épistémique (confiance du modèle), aléatoire (bruit des données)
   - **Recommandation de referral** : si l'incertitude est trop élevée, l'IA recommande explicitement un avis cardiologique
4. Le rapport ECG peut être ajouté au dossier

#### 6.4 — Cartographie 3D
Le modèle anatomique interactif en plein écran :
- Clic sur une zone → panneau latéral avec toutes les infos de la zone
- Conditions, opérations, scans avec images, médicaments, notes

#### 6.5 — Ordonnance
Module de prescription intégré :
- Ajout de médicaments avec : nom, dosage, fréquence, durée, instructions
- Formulaire dynamique (ajouter / supprimer des lignes)
- Aperçu de l'ordonnance en format officiel
- **Téléchargement en PDF** formaté avec en-tête CHU

#### 6.6 — Analyse IA (Chatbot)
Interface de chat médical contextuel :
- Le médecin pose des questions sur le patient en langage naturel
- L'IA a accès à **tout le dossier** (historique, médicaments, scans, conditions...)
- Réponses structurées avec mise en forme markdown
- Suggestions de questions rapides pré-définies :
  - *"Résume l'état clinique actuel"*
  - *"Quelles sont les interactions médicamenteuses à surveiller ?"*
  - *"Quelle est l'évolution de la glycémie sur les 6 derniers mois ?"*

---

## 7. Mode Suivi

### Objectif
Assurer le **monitoring continu** d'un patient atteint de pathologie chronique (diabète, HTA...) avec des visualisations d'évolution.

### Fonctionnalités Détaillées

#### 7.1 — Courbe Glycémique du Jour
Graphique SVG interactif montrant le **cycle glycémique** de la journée :
- 6 mesures (à jeun, post petit-déj, pré-déjeuner, post-déjeuner, pré-dîner, post-dîner)
- **Zone normale** (0.7–1.4 g/L) affichée en vert
- Points au-dessus → orange / rouge avec alertes automatiques
- Tooltips au survol avec heure et valeur exacte

#### 7.2 — Alertes de Dépassement
Système d'alerte automatique :
- **Seuil haut dépassé** → carte rouge avec valeur et recommandation
- **Seuil bas dépassé** → carte orange avec risque d'hypoglycémie
- Contexte spécial : **Ramadan** — alerte spécifique sur le risque de jeûne

#### 7.3 — Traitement en Cours
Vue complète des médicaments avec :
- Rappel d'observance quotidienne
- Dernière prise enregistrée
- Prochaine prise recommandée

#### 7.4 — Recommandations IA
L'IA analyse les tendances et génère des recommandations :
- Ajustement de posologie si les seuils sont souvent dépassés
- Alertes sur les périodes à risque (Ramadan, été, activité physique)

---

## 8. Mode Transfert

### Objectif
Permettre le **transfert sécurisé** d'un dossier patient entre services ou entre hôpitaux, avec **consentement patient** et **traçabilité complète**.

### Le Processus en 4 Étapes

#### Étape 1 — Sélection des Informations
Le médecin choisit **exactement** ce qu'il partage :
- ☑️ Résumé clinique
- ☑️ Traitements en cours
- ☑️ Résultats d'analyses récents
- ☑️ Imagerie
- ☐ Historique complet (optionnel)
- ☐ Données psychiatriques (sensibles)

**Principe de minimisation des données** : on n'envoie que le nécessaire.

#### Étape 2 — Consentement Patient
- Présentation claire au patient de ce qui va être partagé
- **Validation explicite** (signature numérique ou confirmation verbale enregistrée)
- Conformité avec les règles de consentement médical marocain

#### Étape 3 — Génération du Dossier
- L'IA génère un **résumé structuré** du dossier sélectionné
- Format standardisé compatible avec les SIH (Systèmes d'Information Hospitaliers)
- Chiffrement des données

#### Étape 4 — Envoi & QR Code
- Génération d'un **QR code d'accès temporaire**
- Le médecin receveur scanne le QR → accès immédiat au dossier de transfert
- **Expiration automatique** après consultation (sécurité)
- Log de traçabilité : qui a accédé, quand, quoi

---

## 9. Le Modèle 3D Anatomique Interactif

### Technologie : Slicer 2.5D (React-Three-Fiber)

Le modèle 3D n'est pas un simple schéma — c'est une **modélisation anatomique haute fidélité** affichée sur un plan 3D interactif.

### Comment ça Fonctionne

1. Une **image anatomique haute résolution** est mappée sur un plan dans un environnement 3D (Canvas Three.js)
2. Des **hitboxes invisibles** sont positionnées précisément sur chaque zone anatomique
3. L'utilisateur peut **tourner, zoomer, incliner** le modèle (OrbitControls)
4. La rotation est limitée pour maintenir l'illusion 3D (pas de vue du "dos" de l'image)

### Les 7 Zones Interactives

| Zone | Région Anatomique | Ce qui s'affiche au clic |
|------|-------------------|--------------------------|
| **Tête** | Neurologie | Scanner cérébral, céphalées, traitements |
| **Thorax** | Cardiovasculaire | ECG, écho, radio thorax, HTA, arythmie |
| **Abdomen** | Métabolisme | Écho abdo, bilans, diabète, stéatose |
| **Bras gauche** | Vasculaire | Site TA, voie veineuse, perfusions |
| **Bras droit** | Général | État général |
| **Jambe gauche** | Orthopédie | IRM genou, gonarthrose, neuropathie |
| **Jambe droite** | Chirurgie | Historique fracture, ostéosynthèse |

### Système d'Alertes Visuelles

Chaque zone a un **niveau de sévérité** qui détermine sa couleur :
- 🔴 **Critique** (rouge, pulsation) → pathologie active grave nécessitant attention immédiate
- 🟠 **Attention** (orange) → pathologie à surveiller
- 🟡 **Caution** (jaune) → historique notable mais stable
- 🔵 **Info** (bleu) → information contextuelle
- 🟢 **Stable** (vert) → aucun problème identifié

---

## 10. L'Intelligence Artificielle

Alwarid intègre **3 couches d'IA** distinctes :

### 10.1 — IA Générative (Google Gemini 2.0 Flash)

**Rôle :** Génération de rapports médicaux et chatbot conversationnel.

**Fonctionnement :**
- Le médecin fournit ses observations cliniques
- L'IA reçoit en contexte le **dossier complet du patient** (pathologies, historique, traitements, allergies)
- Elle génère un rapport structuré adapté au type de document demandé
- Prompts système spécialisés pour chaque type de rapport (écho, radio, surveillance, traitement, évaluation)

**Sécurité :**
- Disclaimer permanent : *"Outil d'aide à la décision — ne remplace pas le jugement clinique"*
- L'IA ne prescrit jamais — elle rédige et suggère

**Entrée voix :**
- Reconnaissance vocale intégrée (Web Speech API)
- Le médecin dicte ses observations au lieu de taper
- Transcription en temps réel dans le champ d'observation

### 10.2 — IA d'Analyse ECG (T-MECA)

**Rôle :** Classification automatique d'ECG avec explainabilité visuelle.

**Architecture du Modèle :**
- **Base :** ResNet18 modifié (1D) avec mécanisme d'attention
- **Entraînement :** MIT-BIH Arrhythmia Database
- **5 Classes :** Normal (N), Supra-ventriculaire (S), Ventriculaire (V), Fusion (F), Unknown (Q)

**Explainable AI (XAI) :**
- **Grad-CAM 1D** : carte de chaleur superposée au tracé ECG montrant les segments auxquels le modèle a prêté attention pour sa classification
- **MC-Dropout** (Monte Carlo Dropout) : 50 inférences stochastiques pour calculer l'incertitude :
  - Entropie prédictive (incertitude totale)
  - Entropie épistémique (ce que le modèle ne sait pas)
  - Entropie aléatoire (bruit intrinsèque aux données)
- **Seuil de referral** : si l'incertitude épistémique dépasse un seuil, l'IA recommande explicitement un avis cardiologique

**Mode Offline :**
- Si le serveur Python (Flask) n'est pas disponible, l'API bascule automatiquement sur des résultats pré-calculés basés sur l'analyse de variance du signal
- La démo fonctionne à 100% même sans le backend IA

### 10.3 — IA Contextuelle (Chatbot Médical)

**Rôle :** Répondre aux questions du médecin sur le dossier patient.

**Architecture :**
- Prompt système spécialisé "médecin assistant" avec contexte patient complet injecté
- Le chatbot a connaissance de : identité, allergies, conditions, historique, médicaments, interactions, scans
- Réponses formatées en markdown avec listes structurées

**Exemples d'utilisation :**
- *"Quel est le risque si je prescris de la Pénicilline ?"* → L'IA détecte l'allergie et avertit
- *"Résume l'évolution cardiaque des 2 dernières années"* → Synthèse chronologique
- *"Ce patient peut-il jeûner pendant le Ramadan ?"* → Analyse des risques (hypoglycémie sous Gliclazide)

---

## 11. Le Modèle de Données Patient

Alwarid utilise un modèle de données patient complet, conçu pour être **compatible avec le futur DMP national marocain**.

### Structure d'un Dossier Patient

```
Patient
├── Identité
│   ├── ID unique (PAT-XXXX-XXXXX)
│   ├── Nom, Prénom, Initiales
│   ├── Date de naissance, Âge, Sexe
│   ├── Groupe sanguin
│   ├── Mesures (taille, poids)
│   ├── Ville, Téléphone
│   └── Contact d'urgence
│
├── Données Cliniques
│   ├── Allergies []
│   ├── Pathologies actives [] (nom, sévérité, depuis, détails)
│   ├── Médicaments en cours [] (nom, dosage, fréquence, indication)
│   └── Interactions médicamenteuses [] (sévérité, médicaments impliqués, risque, source)
│
├── Régions Corporelles (7 zones)
│   └── Par zone :
│       ├── Label anatomique
│       ├── Niveau de sévérité
│       ├── Conditions associées []
│       ├── Opérations antérieures []
│       ├── Scans/Imagerie [] (type, date, labo, médecin, résultat, image)
│       ├── Médicaments liés []
│       └── Notes cliniques
│
└── Historique Médical Complet []
    └── Par événement :
        ├── Date
        ├── Type (consultation / analyse / imagerie / opération / vaccination / urgence)
        ├── Titre
        ├── Médecin responsable
        ├── Établissement
        └── Détails cliniques
```

### Patient de Démonstration : Youssef El Amrani

Le patient utilisé pour la démonstration illustre un cas complexe typique :
- **58 ans, homme, Fès**
- **4 pathologies** : Diabète T2, HTA stade 2, Hypercholestérolémie, Gonarthrose
- **6 médicaments** en cours avec **3 interactions** (dont 2 critiques)
- **2 allergies** connues (Pénicilline, Sulfamides)
- **15+ scans/imageries** répartis sur 7 zones corporelles
- **30+ événements** dans l'historique (urgences, opérations, consultations spécialisées, analyses, vaccinations)
- **2 opérations** chirurgicales historiques (ostéosynthèse tibia)
- **Contexte spécial** : patient jeûnant pendant le Ramadan (risque hypoglycémie x7.5)

---

## 12. Stack Technique

| Couche | Technologie | Rôle |
|--------|-------------|------|
| **Frontend** | Next.js 16 (React) | Interface utilisateur, routing, SSR |
| **Design System** | CSS Variables custom (Design tokens) | Thème bleu médical, composants réutilisables |
| **3D Engine** | React-Three-Fiber + Three.js + Drei | Modèle anatomique interactif |
| **IA Générative** | Google Gemini 2.0 Flash (API) | Rapports médicaux + chatbot |
| **IA ECG** | T-MECA (ResNet18 + Attention, Python/PyTorch) | Classification ECG + Grad-CAM + MC-Dropout |
| **Backend IA** | Flask (Python) | Serveur d'inférence pour le modèle ECG |
| **Proxy API** | Next.js API Routes | Proxy sécurisé entre frontend et Flask |
| **Voix** | Web Speech API (navigateur) | Dictée vocale des observations |
| **Export** | Blob/Word generation | Téléchargement des rapports en .docx |

---

## 13. Proposition de Valeur

### En une phrase :
> **Alwarid redonne aux médecins ce qui leur manque le plus : du temps — parce que dans un hôpital, chaque minute gagnée peut sauver une vie.**

### Les 4 Gains Concrets :

| Gain | Sans Alwarid | Avec Alwarid |
|------|-------------|--------------|
| **Accès aux infos critiques** | 5-15 min de recherche dans les dossiers | 5 secondes (visualisation 3D) |
| **Rédaction d'un rapport** | 15-20 min de frappe | 30 secondes (IA + observations) |
| **Identification d'une interaction** | Vérification manuelle (risque d'oubli) | Alerte automatique en rouge |
| **Transfert de dossier** | Appels téléphoniques + photocopies | QR code sécurisé en 4 étapes |

### Ce qu'Alwarid N'Est PAS :
- ❌ Un remplacement du médecin
- ❌ Un outil de diagnostic autonome
- ❌ Un dossier médical électronique (c'est le rôle du DMP national)

### Ce qu'Alwarid EST :
- ✅ Un **copilote** qui présente l'information de façon optimale
- ✅ Un **assistant** qui rédige et analyse sur demande
- ✅ Une **couche d'intelligence** au-dessus de l'infrastructure nationale
- ✅ Un outil qui **rend la donnée centralisée réellement exploitable** en situation clinique
