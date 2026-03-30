# 📊 ALWARID — Spécification Business Complète
### Document de Référence pour le Développement de la Plateforme
### ⚠️ CE DOCUMENT EST AUTO-SUFFISANT : il contient TOUT ce qu'il faut savoir pour reconstruire la plateforme de zéro.
*Version 2.0 — Mars 2026*

---

## 📋 Table des Matières

1. [Contexte & Vision du Projet](#1-contexte--vision)
2. [Contexte National — Le Maroc et la Santé Numérique](#2-contexte-national)
3. [Parcours Utilisateur Complet](#3-parcours-utilisateur)
4. [Le Modèle de Données Patient](#4-modèle-de-données-patient)
5. [Les 4 Modes Opératoires — Spécifications Complètes](#5-les-4-modes)
6. [Chat Centralisé — Spécification](#6-chat-centralisé)
7. [Le Modèle 3D Anatomique — Spécification](#7-modèle-3d)
8. [Intelligence Artificielle — Toutes les Couches](#8-intelligence-artificielle)
9. [Ordonnance Numérique — Spécification](#9-ordonnance)
10. [Transfert Sécurisé — Spécification](#10-transfert-sécurisé)
11. [GaaS — Government as a Service](#11-gaas)
12. [Architecture IA — Stratégie Maintenant et Après](#12-architecture-ia-stratégie)
13. [Modèle Économique & Business Model](#13-modèle-économique)
14. [Impact Social — Confiance Citoyenne](#14-impact-social)
15. [Impact Économique — ROI pour l'État](#15-impact-économique)
16. [Différenciation Concurrentielle](#16-différenciation)
17. [Indicateurs de Performance (KPIs)](#17-kpis)
18. [Matrice des Fonctionnalités & Priorités](#18-matrice-fonctionnalités)
19. [Recherches Approfondies (Jury)](#19-recherches)

---

## 1. Contexte & Vision

### Qu'est-ce qu'Alwarid ?
**Alwarid** (الوريد — "la veine" en arabe, symbolisant le flux vital d'information) est une **plateforme web d'aide à la décision médicale** destinée aux médecins des hôpitaux publics marocains.

### Le Problème
Dans les hôpitaux publics marocains, un médecin passe une proportion significative de son temps **non pas à soigner, mais à chercher des informations**. Face à un patient (surtout aux urgences), il doit :
- Retrouver l'historique médical complet
- Identifier les allergies et interactions médicamenteuses
- Consulter les scans et imageries
- Comprendre les pathologies chroniques
- Rédiger des rapports et comptes-rendus

**Ce temps perdu a un coût humain : dans un contexte médical, chaque minute peut avoir des conséquences irréversibles.**

### La Solution
Alwarid est un **copilote médical** qui :
- **Centralise** toutes les données du patient dans une seule interface
- **Visualise** les alertes critiques sur un modèle anatomique 3D interactif
- **Génère** des rapports médicaux grâce à l'IA
- **Analyse** des ECG avec explainabilité visuelle (Grad-CAM)
- **Assiste** le médecin via un chatbot contextuel qui connaît tout le dossier
- **Transfère** les dossiers de façon sécurisée entre services/hôpitaux

### Qui sont les utilisateurs ?
| Utilisateur | Rôle dans Alwarid |
|---|---|
| **Médecin (principal)** | Consulte les dossiers, génère rapports, analyse ECG, prescrit |
| **Direction d'hôpital** | Supervise les KPIs de l'établissement |
| **Ministère de la Santé** | Dashboard national, surveillance épidémique |
| **Patient (futur)** | Borne d'hôpital en Darija pour pré-triage |

---

## 2. Contexte National

### Le Maroc Construit l'Infrastructure — Alwarid Apporte l'Intelligence

Alwarid repose sur une prémisse fondamentale : **le Maroc centralise et numérise les données de santé de ses 36 millions de citoyens.** Notre plateforme est la couche d'intelligence au-dessus de cette infrastructure.

#### Initiatives en cours :

| Initiative | Description | Statut |
|---|---|---|
| **Registre National de la Population (RNP)** | Identifiant Digital Civil et Social (IDCS) unique — 9-10 chiffres basé sur biométrie (iris, Face ID, empreintes) | Déployé |
| **Identifiant Patient (IDP)** | Numéro de santé intégré dans la puce de la CNIE | En cours |
| **Dossier Médical Partagé (DMP)** | Dossier patient national partagé entre établissements — budget 190M DH | Convention signée (fév. 2024) |
| **Feuille de Soins Électronique (FSE)** | Prescription avec QR code unique scannable | Pilote Kénitra (mars 2026) |
| **Système HOSIX** | Dossier Médical Électronique hospitalier | Actif dans 140 hôpitaux |
| **AMO généralisée** | 32M de bénéficiaires (88% de la population) | Opérationnel |
| **Plan Santé 2025** | 2.5 milliards $ pour moderniser le système | En cours |
| **Morocco Digital 2030** | Santé = pilier central de la transformation numérique | En cours |

#### Le Gap qu'Alwarid Comble :
L'État construit le stockage et la centralisation. **Alwarid rend cette donnée exploitable par le médecin en temps réel** grâce à la visualisation 3D, l'IA, et les alertes automatiques.

#### Cadre légal :
- **Loi 09-08** : Protection des données personnelles. Les données de santé = données sensibles. Transfert hors Maroc soumis à autorisation CNDP.
- **Loi 05-20** : Cybersécurité. Hébergement local obligatoire pour données sensibles.
- **CNDP** : Commission Nationale de contrôle de la protection des Données. Déclaration obligatoire pour tout traitement de données de santé.

---

## 3. Parcours Utilisateur Complet

```
1. PAGE D'ACCUEIL (Login)
   └── Le médecin se connecte avec ses identifiants
       ↓
2. SÉLECTION DU MODE
   └── 4 cartes clicables :
       ├── 🔴 Mode Urgence
       ├── 🔵 Mode Consultation
       ├── 🟢 Mode Suivi
       └── 🟠 Mode Transfert
       ↓
3. RECHERCHE PATIENT
   └── Barre de recherche par nom, ID, ou CNIE
   └── Liste de patients récents avec badges d'alerte
       ↓
4. DASHBOARD PATIENT (adapté au mode sélectionné)
   └── Interface contextuelle avec :
       ├── Données patient
       ├── Modèle 3D anatomique
       ├── Chat IA centralisé (bouton flottant)
       └── Fonctionnalités spécifiques au mode
```

### Pages de la plateforme :
| Page | URL | Description |
|---|---|---|
| Accueil / Login | `/` | Authentification du médecin |
| Sélection du mode | `/mode` | 4 cartes pour choisir le mode |
| Recherche patient | `/search` | Liste des patients récents + recherche |
| Dashboard | `/dashboard` | Interface principale adaptée au mode |

---

## 4. Modèle de Données Patient

Voici la structure COMPLÈTE d'un dossier patient. **Toute l'application est construite autour de ce modèle.**

### Structure

```javascript
Patient = {
    // ── IDENTITÉ ──
    id: "PAT-2024-00147",           // Identifiant unique
    firstName: "Youssef",
    lastName: "El Amrani",
    initials: "YA",
    age: 58,
    dateOfBirth: "1968-03-15",
    sex: "Homme",
    bloodType: "A+",
    height: "174 cm",
    weight: "89 kg",
    city: "Fes",
    phone: "+212 6 12 34 56 78",
    emergencyContact: "Fatima El Amrani (epouse) — +212 6 23 45 67 89",

    // ── DONNÉES CLINIQUES ──
    allergies: ["Penicilline", "Sulfamides"],

    conditions: [
        { name: "Diabete type 2", severity: "critical", since: "2016", details: "HbA1c : 7.8%" },
        { name: "HTA stade 2", severity: "critical", since: "2018", details: "TA : 155/95 mmHg" },
        { name: "Hypercholesterolemie", severity: "warning", since: "2019", details: "LDL : 1.8 g/L" },
        { name: "Gonarthrose genou gauche", severity: "warning", since: "2023", details: "Grade 2" }
    ],
    // severity: "critical" | "warning" | "caution" | "info" | "stable"

    medications: [
        { name: "Metformine 1000mg", dosage: "2x/jour", purpose: "Diabete" },
        { name: "Gliclazide 60mg", dosage: "1x/jour matin", purpose: "Diabete" },
        { name: "Amlodipine 10mg", dosage: "1x/jour", purpose: "HTA" },
        { name: "Bisoprolol 5mg", dosage: "1x/jour matin", purpose: "HTA" },
        { name: "Atorvastatine 20mg", dosage: "1x/jour soir", purpose: "Cholesterol" },
        { name: "Ibuprofene 400mg", dosage: "PRN", purpose: "Douleur articulaire" }
    ],

    interactions: [
        {
            severity: "critical",
            drugs: ["Amlodipine", "Bisoprolol"],
            risk: "Risque de bradycardie severe. Surveillance FC requise.",
            source: "Base Vidal"
        },
        {
            severity: "critical",
            drugs: ["Gliclazide", "Jeune Ramadan"],
            risk: "Risque eleve d'hypoglycemie (x7.5).",
            source: "DrugBank"
        },
        {
            severity: "warning",
            drugs: ["Ibuprofene", "Amlodipine"],
            risk: "Reduction de l'effet antihypertenseur.",
            source: "Base Vidal"
        }
    ],

    // ── RÉGIONS CORPORELLES (7 zones pour le modèle 3D) ──
    bodyRegions: {
        head: {
            label: "Tete / Neurologie",
            severity: "caution",
            conditions: ["Cephalees de tension chroniques (depuis 2021)"],
            operations: [],
            scans: [
                { type: "Scanner cerebral", date: "2021-09-14", lab: "Centre d'Imagerie Atlas, Fes",
                  doctor: "Dr. Bennani", result: "Normal", image: "/scan-brain.png" }
            ],
            medications: ["Paracetamol 1g PRN"],
            notes: "Scanner cerebral normal. Migraines gerees par paracetamol."
        },
        chest: {
            label: "Thorax / Cardiovasculaire",
            severity: "critical",
            conditions: [
                "HTA stade 2 (diagnostiquee 2018)",
                "Arythmie sinusale detectee a l'ECG (2024)",
                "Cholesterol LDL eleve : 1.8 g/L"
            ],
            operations: [],
            scans: [
                { type: "ECG", date: "2024-06-20", lab: "CHU Hassan II, Fes",
                  doctor: "Dr. Alaoui", result: "Arythmie sinusale", image: "/scan-ecg.png" },
                { type: "Echocardiographie", date: "2024-07-05", lab: "CHU Hassan II, Fes",
                  doctor: "Dr. Alaoui", result: "FE 55%, sans anomalie", image: "/scan-echo-cardio.png" },
                { type: "Radio thoracique", date: "2023-01-12", lab: "Clinique Ibn Sina, Fes",
                  doctor: "Dr. Moussaoui", result: "ICT normal", image: "/scan-thorax.png" }
            ],
            medications: ["Amlodipine 10mg", "Bisoprolol 5mg", "Atorvastatine 20mg"],
            notes: "Suivi cardiologique trimestriel."
        },
        abdomen: {
            label: "Abdomen / Metabolisme",
            severity: "critical",
            conditions: [
                "Diabete type 2 (2016) — HbA1c : 7.8%",
                "Steatose hepatique grade 1"
            ],
            operations: [],
            scans: [
                { type: "Echo abdominale", date: "2022-11-03", lab: "Centre Radio Fes Medina",
                  doctor: "Dr. Tazi", result: "Steatose hepatique grade 1", image: "/scan-abdomen.png" },
                { type: "Bilan sanguin", date: "2026-01-08", lab: "Laboratoire Central Fes",
                  doctor: "Dr. Karimi", result: "HbA1c 7.8%, Creatinine 12 mg/L" }
            ],
            medications: ["Metformine 1000mg", "Gliclazide 60mg"],
            notes: "Patient jeune pendant le Ramadan. 2 episodes hypoglycemiques en 2025."
        },
        leftArm: {
            label: "Bras gauche / Vasculaire",
            severity: "info",
            conditions: ["Site de mesure TA habituel"],
            operations: [],
            scans: [],
            medications: [],
            notes: "Voie veineuse peripherique posee lors du passage aux urgences (mars 2025)."
        },
        rightArm: {
            label: "Bras droit",
            severity: "stable",
            conditions: [],
            operations: [],
            scans: [],
            medications: [],
            notes: "Aucune condition signalee."
        },
        leftLeg: {
            label: "Jambe gauche / Orthopedie",
            severity: "warning",
            conditions: [
                "Gonarthrose du genou gauche (Grade 2)",
                "Neuropathie diabetique peripherique debutante"
            ],
            operations: [],
            scans: [
                { type: "IRM genou gauche", date: "2023-04-18", lab: "IRM Atlas, Fes",
                  doctor: "Dr. Cherkaoui", result: "Gonarthrose grade 2", image: "/scan-genou.png" },
                { type: "EMG membres inferieurs", date: "2025-02-10", lab: "CHU Hassan II, Fes",
                  doctor: "Dr. Fassi Fihri", result: "Neuropathie sensitive debutante" }
            ],
            medications: ["Ibuprofene 400mg PRN"],
            notes: "Neuropathie liee au diabete."
        },
        rightLeg: {
            label: "Jambe droite",
            severity: "stable",
            conditions: ["Cicatrice tibia droit (fracture 2005)"],
            operations: [
                { name: "Osteosynthese tibia", date: "2005-08-22", hospital: "CHR Meknes", surgeon: "Dr. El Hajjami" },
                { name: "Ablation materiel", date: "2007-03-14", hospital: "CHR Meknes", surgeon: "Dr. El Hajjami" }
            ],
            scans: [
                { type: "Radio tibia", date: "2007-06-01", lab: "CHR Meknes",
                  doctor: "Dr. El Hajjami", result: "Consolidation complete" }
            ],
            medications: [],
            notes: "Consolidation complete. Pas de sequelle."
        }
    },

    // ── HISTORIQUE MÉDICAL COMPLET ──
    // Chaque entrée a : date, type, title, doctor, hospital, details
    // Types possibles : "urgence", "operation", "consultation", "analyse", "imagerie", "vaccination"
    history: [
        // 30+ entrées couvrant : urgences, opérations, consultations spécialisées
        // (cardiologie, diabétologie, ophtalmologie, dermatologie, ORL, rhumatologie,
        //  pneumologie, allergologie, gastro-entérologie, podologie, urologie, dentaire),
        // analyses de laboratoire, imageries, vaccinations
    ]
}
```

### Patients Récents (pour la page de recherche)
La page de recherche affiche une liste de patients récents avec des cas d'usage variés :

| Patient | Âge | Sexe | Spécialité | Niveau d'Alerte | Cas d'usage |
|---|---|---|---|---|---|
| Youssef El Amrani | 58 | H | Cardio/Diabéto | 🔴 Critique (3 alertes) | Diabète + HTA + Cardio |
| Khadija Benkirane | 34 | F | Gynéco/Obstétrique | 🟢 Aucune | Grossesse suivi prénatal |
| Mohammed Tazi | 72 | H | Neuro/Rééducation | 🟡 Warning (1 alerte) | Post-AVC + Revalidation |
| Amina Fassi Fihri | 45 | F | Endocrinologie | 🟢 Aucune | Suivi thyroïde + Bilan |
| Hassan El Mansouri | 63 | H | Oncologie/Chirurgie | 🟡 Warning (2 alertes) | Cancer colon — Chimio |

### Types d'Historique
| Type | Label | Couleur |
|---|---|---|
| consultation | Consultation | Bleu |
| analyse | Analyse | Bleu |
| vaccination | Vaccination | Vert |
| urgence | Urgence | Rouge |
| imagerie | Imagerie | Bleu |
| operation | Operation | Orange |

---

## 5. Les 4 Modes — Spécifications Complètes

Chaque mode est une **page/vue différente** du dashboard, adaptée à un contexte clinique précis.

### 5.1 — Mode Urgence 🔴

**Contexte :** Patient critique, temps compté, possiblement inconscient.
**Objectif :** Tout afficher en 5 secondes. Rien à chercher.
**Couleur dominante :** Rouge

#### Layout :
```
┌─────────────────────────────────────────────────┐
│ HEADER : Identité patient + alertes critiques   │
├─────────────┬───────────────────────────────────┤
│             │                                   │
│  MODÈLE 3D │  PANNEAU DROIT                    │
│  ANATOMIQUE│  (change selon la zone cliquée)   │
│             │  - Conditions de la zone          │
│  (clicable) │  - Scans avec images              │
│             │  - Médicaments                    │
│             │  - Notes                          │
│             │                                   │
├─────────────┴───────────────────────────────────┤
│ SECTION BAS :                                   │
│ ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│ │CONSTANTES│ │MÉDICA-   │ │HISTORIQUE FILTRÉ │ │
│ │VITALES   │ │MENTS +   │ │(urgences +       │ │
│ │(en temps │ │INTER-    │ │ opérations       │ │
│ │ réel)    │ │ACTIONS   │ │ uniquement)      │ │
│ └──────────┘ └──────────┘ └──────────────────┘ │
└─────────────────────────────────────────────────┘
      + BOUTON FLOTTANT CHAT IA (coin bas-droit)
```

#### Composants du Mode Urgence :

**A. Bandeau d'Alertes Critiques (haut de page)**
- Allergies en gros + rouge
- Interactions médicamenteuses critiques
- Pathologies chroniques actives avec sévérité

**B. Constantes Vitales**
Tableau de données avec codes couleur automatiques :
| Constante | Normal | Alerte si |
|---|---|---|
| Fréquence cardiaque | 60-100 bpm | < 60 ou > 100 |
| Pression artérielle | < 140/90 mmHg | > 140/90 |
| Saturation O2 | > 95% | < 95% |
| Température | 36.1-37.8°C | < 36.1 ou > 37.8 |
| Glycémie | 0.7-1.1 g/L | < 0.7 ou > 1.4 |

Les valeurs anormales sont affichées en **rouge avec animation de pulsation**.

**C. Modèle 3D Anatomique** (voir section 7)

**D. Détail de Région (panneau latéral)**
Au clic sur une zone 3D, un panneau s'affiche avec :
- Liste des conditions de la zone
- Scans/imageries avec miniatures d'images
- Opérations antérieures
- Médicaments liés
- Notes cliniques
- Bouton "Voir le scan en grand"

**E. Historique Filtré**
En mode urgence, l'historique n'affiche QUE :
- Passages aux urgences
- Opérations chirurgicales
- Analyses récentes critiques
Les consultations de routine (dentiste, dermato...) sont **automatiquement masquées**.

**F. Médicaments et Interactions**
Liste de tous les médicaments avec :
- Nom, dosage, fréquence, indication
- Badge de sévérité si interaction (🔴 critique / 🟡 warning)
- Source de l'interaction (Base Vidal, DrugBank)

---

### 5.2 — Mode Consultation 🔵

**Contexte :** RDV programmé, le médecin a du temps pour explorer le dossier en profondeur.
**Objectif :** Exploration complète + génération de rapports IA + prescription.
**Couleur dominante :** Bleu

#### Layout : Système d'onglets
```
┌──────────────────────────────────────────────────────────────┐
│ HEADER : Identité patient + résumé rapide                    │
├──────────────────────────────────────────────────────────────┤
│ [Vue d'ensemble] [Historique] [Documents & IA] [3D] [Ordonnance] [Analyse IA] │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                CONTENU DE L'ONGLET ACTIF                     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
      + BOUTON FLOTTANT CHAT IA (coin bas-droit)
```

#### Onglet 1 — Vue d'Ensemble
Fiche patient complète :
- Identité (nom, âge, sexe, groupe sanguin, taille, poids, ville, téléphone)
- Contact d'urgence
- Allergies connues (affichées avec badges rouges)
- Pathologies actives avec sévérité et date de début
- Traitements en cours avec posologie et indication
- Interactions médicamenteuses avec niveau de risque

#### Onglet 2 — Historique Médical
Timeline chronologique de TOUS les événements médicaux :
- Affichage en liste avec icônes par type (consultation, analyse, imagerie, opération, vaccination, urgence)
- Chaque entrée : date formatée, badge de type coloré, titre, médecin, hôpital, détails cliniques
- **Système de filtrage par type** : boutons pour filtrer par consultation/analyse/imagerie/opération/vaccination/urgence

#### Onglet 3 — Documents & IA (LE PLUS IMPORTANT)
C'est le **cœur de l'IA** d'Alwarid. Le médecin choisit un type de document, et l'IA le génère.

**Types de documents IA :**
| # | Document | Description | Badge |
|---|---|---|---|
| 1 | **ECG / Arythmie** | Analyse ECG avec Explainable AI (Grad-CAM) | ✅ Modèle entraîné |
| 2 | **Compte-rendu Échographique** | Rédaction du rapport écho à partir des observations | 🤖 IA |
| 3 | **Compte-rendu Radiologique** | Interprétation radio/IRM/scanner | 🤖 IA |
| 4 | **Fiche de Surveillance** | Monitoring des paramètres vitaux | 🤖 IA |
| 5 | **Protocole de Traitement** | Plan thérapeutique personnalisé | 🤖 IA |
| 6 | **Fiche d'Évaluation** | Comparaison avec les états précédents | 🤖 IA |

**Processus de génération de rapport (pour les types 2-6) :**
1. Le médecin sélectionne le type de document
2. Un champ d'observation s'affiche
3. Le médecin tape ses observations cliniques **OU** dicte par voix (bouton micro → Web Speech API → transcription temps réel)
4. Il clique "Générer le rapport"
5. L'IA reçoit : observations du médecin + dossier complet du patient + prompt spécialisé au type de document
6. Le rapport est généré et s'affiche avec une **animation de frappe** (typing effect, caractère par caractère)
7. **NOUVEAU : L'IA relit automatiquement le rapport** et signale les incohérences vs le dossier patient (2ème appel API)
8. Le médecin peut : **Télécharger en Word (.docx)** ou **Ajouter au dossier patient**

**Processus ECG (pour le type 1) — Voir détails en section 8.2 :**
1. Choisir un type de signal (Normal, Supra-V, Ventriculaire, Fusion, Unknown)
2. Lancer l'analyse
3. Résultats : tracé ECG + Grad-CAM + classification + probabilités + incertitude + recommandation de referral

#### Onglet 4 — Cartographie 3D
Le modèle anatomique en plein écran (voir section 7).

#### Onglet 5 — Ordonnance (voir section 9)

#### Onglet 6 — Analyse IA (Chatbot)
Interface de chat contextuel — MAIS dans la V2, ce chatbot sera remplacé par le **Chat Centralisé** (section 6). L'onglet pointera vers le chat centralisé.

---

### 5.3 — Mode Suivi 🟢

**Contexte :** Patient avec pathologie chronique (diabète, HTA...). Le médecin fait un suivi régulier.
**Objectif :** Monitoring continu, courbes d'évolution, alertes de dépassement.
**Couleur dominante :** Vert

#### Layout :
```
┌──────────────────────────────────────────────┐
│ HEADER : Patient + dernière visite           │
├──────────────────────────────────────────────┤
│                                              │
│  COURBE GLYCÉMIQUE DU JOUR                   │
│  (graphique SVG interactif)                  │
│                                              │
├──────────────┬───────────────────────────────┤
│  ALERTES     │  TRAITEMENT EN COURS          │
│  DE DÉPAS-   │  (médicaments + observance)   │
│  SEMENT      │                               │
├──────────────┴───────────────────────────────┤
│  RECOMMANDATIONS IA                          │
└──────────────────────────────────────────────┘
      + BOUTON FLOTTANT CHAT IA
```

#### Composants :

**A. Courbe Glycémique du Jour**
Graphique SVG dessiné manuellement (pas de lib externe) :
- Axe X : heures de la journée (06:00 → 20:30)
- Axe Y : glycémie en g/L
- **Zone normale** (0.7–1.4 g/L) affichée en vert semi-transparent
- Points de données avec tooltips au survol (heure + valeur + label ex: "Post petit-déj")
- Points au-dessus de la zone normale = orange/rouge
- Ligne reliant les points

Données du cycle journalier type :
```javascript
[
    { time: "06:00", value: 1.10, label: "A jeun" },
    { time: "08:30", value: 1.82, label: "Post petit-dej" },
    { time: "12:30", value: 1.20, label: "Pre-dejeuner" },
    { time: "14:00", value: 2.10, label: "Post-dejeuner" },
    { time: "18:30", value: 1.25, label: "Pre-diner" },
    { time: "20:30", value: 1.90, label: "Post-diner" }
]
```

**B. Alertes de Dépassement**
Cartes d'alerte automatiques :
- 🔴 Seuil haut dépassé → valeur + recommandation
- 🟠 Seuil bas → risque d'hypoglycémie
- ⚠️ Contexte Ramadan → alerte spécifique jeûne

**C. Traitement en Cours**
Liste des médicaments avec rappels d'observance.

**D. Recommandations IA**
L'IA analyse les tendances et génère des recommandations automatiques.

---

### 5.4 — Mode Transfert 🟠

Voir section 10 pour les spécifications complètes.

---

## 6. Chat Centralisé

### NOUVEAU — Remplace les chatbots éclatés dans chaque mode

**Concept :** Un seul chat accessible depuis **n'importe quel mode** via un bouton flottant en bas à droite de l'écran.

#### Architecture :
```
┌──────────────────────────────┐
│ BOUTON FLOTTANT (bas-droit)  │
│ 💬 + badge nombre de convs   │
└──────────┬───────────────────┘
           │ clic
           ▼
┌──────────────────────────────┐
│ PANNEAU LATERAL (slide-in)   │
├──────────────────────────────┤
│ LISTE DES CONVERSATIONS     │
│ ┌──────────────────────────┐ │
│ │ 🔴 Urgence | Y. El Amrani│ │
│ │ 🔵 Consult | K. Benkirane│ │
│ │ 🟢 Suivi  | Y. El Amrani│ │
│ │ + Nouvelle conversation  │ │
│ └──────────────────────────┘ │
├──────────────────────────────┤
│ ZONE DE CHAT                 │
│ (messages + input + micro)   │
└──────────────────────────────┘
```

#### Comportement :
- Chaque conversation est **labellée** avec : icône du mode (🔴🔵🟢🟠) + nom du patient
- Le **contexte patient complet** est automatiquement injecté dans le prompt système
- Le médecin peut poser des questions en texte ou en voix (micro)
- Messages rapides pré-définis disponibles :
  - *"Résume l'état clinique actuel"*
  - *"Quelles sont les interactions médicamenteuses ?"*
  - *"Ce patient peut-il jeûner pendant le Ramadan ?"*
- L'historique des conversations est **persistant** et consultable

#### IA du Chat :
- L'IA a accès à TOUT le dossier patient (identité, allergies, conditions, historique, médicaments, interactions, scans)
- Réponses formatées en markdown (listes, gras, tableaux)
- Si le médecin pose une question dangereuse ("puis-je donner de la pénicilline ?"), l'IA détecte l'allergie et **avertit immédiatement**

---

## 7. Modele 3D Anatomique

### IMPORTANT — Ce composant doit etre reconstruit

La version precedente du modele 3D etait **simplement une image 2D mappee sur un plan dans un canvas Three.js**. Ce n'etait pas un vrai modele 3D. C'etait basique et ne rendait pas justice au projet. **Il faut le reconstruire correctement.**

### Technologie : React-Three-Fiber + Three.js

**Approche recommandee (par ordre de preference) :**

1. **Option A — Modele GLB** : Utiliser le fichier `public/models/body.glb` (un vrai mesh 3D humanoide). Le charger avec `useGLTF` de `@react-three/drei`. Appliquer des materiaux semi-transparents / wireframe / style medical. Definir des hitboxes sur les 7 zones anatomiques.

2. **Option B — SVG anatomique interactif** : Si le 3D est trop complexe a bien faire, creer un SVG anatomique haute qualite (style illustration medicale) avec des zones clicables bien definies + des animations CSS pour les alertes pulsantes. Plus simple mais tout aussi impressionnant visuellement si bien fait.

3. **Option C — Image 2.5D amelioree** : En dernier recours, utiliser l'image `public/anatomy-reference.png` mappee sur un plan Three.js, MAIS avec un rendu nettement ameliore (eclairage, materiaux, overlay d'indicateurs 3D).

### Fichiers disponibles :
- `public/models/body.glb` — Mesh 3D humanoide (GLTF/GLB)
- `public/anatomy-reference.png` — Image anatomique haute resolution (fallback)

### Les 7 Zones Interactives

| Zone | Cle | Region anatomique | Severite (patient demo) |
|---|---|---|---|
| Tete | `head` | Neurologie | Caution |
| Thorax | `chest` | Cardiovasculaire | Critique |
| Abdomen | `abdomen` | Metabolisme | Critique |
| Bras gauche | `leftArm` | Vasculaire | Info |
| Bras droit | `rightArm` | General | Stable |
| Jambe gauche | `leftLeg` | Orthopedie | Warning |
| Jambe droite | `rightLeg` | Chirurgie | Stable |

### Systeme d'Alertes Visuelles
Chaque zone a un **indicateur visuel** base sur sa severite :
- `critical` → Indicateur rouge pulsant (glow + animation pulse CSS/Three.js)
- `warning` → Indicateur orange
- `caution` → Indicateur jaune
- `info` → Indicateur bleu
- `stable` → Pas d'indicateur ou vert subtil

### Comportement :
- **Clic sur une zone** → affiche un panneau lateral slide-in avec : conditions, scans (avec miniatures d'images), operations, medicaments, notes
- **Rotation** : OrbitControls, rotation libre (ou limitee selon l'approche choisie)
- **Zoom** : min-max raisonnables
- **Eclairage** : ambient light + directional light pour un rendu medical professionnel
- **Fond** : gradient subtil ou grille medicale, pas de fond plat

### 2 Versions du Composant :
1. **BodyViewer3D** — version grande (mode Urgence + onglet 3D en Consultation)
2. **BodyViewerMini** — version miniature avec auto-rotation lente (pour widgets ou apercu)

---

## 8. Intelligence Artificielle

### 8.1 — IA Générative (Rapports + Chatbot)

**Modèle :** API Mistral (ou Gemini) en phase hackathon → Mistral 7B open-source en prod

**Fonctionnement du Chatbot :**
- Le prompt système contient le dossier patient complet
- Le médecin pose des questions en langage naturel
- L'IA répond en tenant compte de tout le contexte

**Fonctionnement de la Génération de Rapports :**
- Prompts spécialisés par type de document (un prompt différent pour écho vs radio vs surveillance)
- L'IA reçoit : prompt type + observations médecin + dossier patient
- Animation de typing pour l'affichage du résultat

**NOUVEAU — Relecture IA :**
Après la génération d'un rapport, un 2ème appel API automatique :
- Prompt : *"Relis ce rapport. Compare-le au dossier patient. Signale toute incohérence, donnée manquante, ou point de clarification."*
- L'IA retourne une liste de remarques/questions
- Le médecin peut valider ou corriger

**Entrée vocale :**
- Bouton micro → Web Speech API (navigateur) → transcription temps réel
- Le médecin dicte au lieu de taper

### 8.2 — IA d'Analyse ECG (T-MECA)

**Modèle :** ResNet18 modifié (1D) avec mécanisme d'attention, entraîné sur MIT-BIH.
**Backend :** Flask Python (port 5050). Connexion automatique depuis l'API Next.js.
**Fallback :** Si Flask n'est pas disponible, résultats pré-calculés basés sur l'analyse de variance.

**5 Classes :**
| Classe | Code | Description |
|---|---|---|
| Normal | N | Battement normal |
| Supra-ventriculaire | S | Origine au-dessus des ventricules |
| Ventriculaire | V | Origine ventriculaire |
| Fusion | F | Battement de fusion |
| Unknown | Q | Non classifiable |

**Résultats affichés :**
1. **Tracé ECG en SVG** — signal original (187 points)
2. **Carte de chaleur Grad-CAM 1D** — superposée au tracé, montre où l'IA a regardé (rouge = haute attention, vert = basse attention)
3. **Classification** — classe prédite + pourcentage de confiance
4. **Probabilités** — barre pour chaque classe
5. **Incertitude MC-Dropout** (50 inférences stochastiques) :
   - Entropie prédictive (incertitude totale)
   - Entropie épistémique (ce que le modèle ne sait pas → confiance du modèle)
   - Entropie aléatoire (bruit des données)
6. **Recommandation de referral** — si l'incertitude épistémique est trop élevée → "Avis cardiologique recommandé"

### 8.3 — IA Contextuelle (Chat Centralisé)
Voir section 6.

---

## 9. Ordonnance Numérique

**Disponible dans :** Mode Consultation (onglet Ordonnance)

**Fonctionnement :**
- Formulaire dynamique avec lignes de médicaments
- Chaque ligne : nom du médicament, dosage, fréquence, durée, instructions spéciales
- Bouton "Ajouter un médicament" → ajoute une nouvelle ligne vide
- Bouton "Supprimer" (croix) par ligne
- **Aperçu** de l'ordonnance en format officiel (mise en page CHU)
- **Téléchargement en PDF** formaté avec en-tête

---

## 10. Transfert Sécurisé

**Disponible dans :** Mode Transfert 🟠

**Objectif :** Permettre le transfert sécurisé d'un dossier patient entre services ou entre hôpitaux.

### Processus en 4 Étapes (workflow guidé)

| Étape | Titre | Description |
|---|---|---|
| 1 | **Sélection des informations** | Le médecin coche ce qu'il partage : résumé clinique ☑️, traitements ☑️, analyses ☑️, imagerie ☑️, historique complet ☐, données sensibles ☐ |
| 2 | **Consentement patient** | Présentation claire au patient + validation explicite (signature numérique ou confirmation) |
| 3 | **Génération du dossier** | L'IA génère un résumé structuré du dossier sélectionné, chiffré |
| 4 | **Envoi & QR code** | Génération d'un QR code d'accès temporaire. Le médecin receveur scanne → accès immédiat. Expiration automatique après consultation. Log de traçabilité. |

#### Layout : Stepper horizontal
```
  [ 1 ]────[ 2 ]────[ 3 ]────[ 4 ]
  Sélection  Consentement  Génération  QR Code
  
  ← Précédent                    Suivant →
```

---

## 11. GaaS — Government as a Service

Alwarid se vend comme une **infrastructure intelligente pour le Ministère de la Santé**, avec 3 couches :

```
┌─────────────────────────────────────────┐
│           ALWARID GaaS                   │
├─────────────────────────────────────────┤
│ Couche 1 — MÉDECIN                      │
│ └── Interface quotidienne (4 modes)     │
│                                         │
│ Couche 2 — HÔPITAL                      │
│ └── Dashboard de gestion établissement  │
│     (taux occupation, attente, stocks)  │
│                                         │
│ Couche 3 — GOUVERNEMENT / MINISTÈRE     │
│ └── Dashboard de supervision nationale  │
│     ├── Carte du Maroc (hotspots)       │
│     ├── KPIs par région                 │
│     ├── Alertes épidémiques             │
│     ├── Tendances saisonnières          │
│     └── Aide à la décision politique    │
└─────────────────────────────────────────┘
```

### Dashboard Gouvernement — Contenu (maquette avec données simulées)

| Section | Données | Utilité |
|---|---|---|
| **Vue Nationale** | Carte du Maroc interactive avec indicateurs par région | Identifier les zones en tension |
| **Épidémies** | Courbes d'évolution des maladies par zone et période | Détection précoce |
| **Urgences** | Taux d'occupation, temps d'attente, cas critiques | Allocation dynamique de ressources |
| **Tendances** | Top pathologies par an/mois/saison/zone | Politique de prévention ciblée |
| **Économique** | Nombre de consultations, coût moyen, économies | Justification budgétaire |

---

## 12. Architecture IA — Stratégie

### Phase Hackathon (Maintenant)

| Composant | Technologie | Hébergement |
|---|---|---|
| Chatbot + Rapports | API Mistral (européenne, Paris) | Serveurs Mistral |
| ECG Analysis | T-MECA (ResNet18, PyTorch) | Local (Flask) |
| Speech-to-Text | Web Speech API | Local (navigateur) |

### Phase Production (Vision)

| Composant | Technologie | Hébergement |
|---|---|---|
| LLM principal | Mistral 7B/Mixtral open-source fine-tuné médical | Cloud souverain marocain |
| LLM Darija | AtlasIA Terjman (open-source, HuggingFace) | Cloud souverain marocain |
| ECG | T-MECA amélioré | Cloud souverain marocain |
| ASR | AtlasIA DODa (fine-tuné médical) | Cloud souverain marocain |

**Justification Mistral :** Open-source, excellent en français, hébergeable localement, entreprise européenne (Paris), fine-tuning possible.

---

## 13. Modèle Économique

### Licence d'Exploitation + PPP + Transfert de Compétences

| Phase | Activité |
|---|---|
| **Année 1-2** | Déploiement dans les CHU pilotes + formation + support 24/7 |
| **Année 3+** | Licence annuelle par établissement + mises à jour + maintenance |
| **Option** | Reprise en régie par l'État (code transférable) |

**Conformité marchés publics :** PPP avec licence SaaS via appel d'offres public.

---

## 14. Impact Social — Confiance Citoyenne

**Problème :** Les Marocains fuient le secteur public de santé vers le privé (temps d'attente, sentiment de mauvaise prise en charge).

**Comment Alwarid restaure la confiance :**
| Problème perçu | Solution Alwarid |
|---|---|
| "Le médecin ne connaît pas mon dossier" | Il voit tout en 5 sec via la 3D |
| "Il n'a pas le temps" | L'IA rédige les rapports → plus de temps pour écouter |
| "Il peut se tromper" | L'IA relit, signale les interactions |
| "Pas de suivi" | Mode Suivi avec courbes + alertes |
| "Transfert chaotique" | QR code sécurisé en 4 étapes |

---

## 15. Impact Économique — ROI

**Hypothèse :** Médecin fait 20 consultations/jour, perd ~10 min/patient à chercher des infos.

| Avec Alwarid | Calcul |
|---|---|
| Temps gagné/patient | 8 minutes |
| Patients supplémentaires/jour/médecin | +4 à 6 |
| ~13 000 médecins publics au Maroc | × 4 patients |
| = **52 000 consultations supplémentaires/jour** | |
| = **~15 millions/an** | |

**Économies additionnelles :** diagnostic précoce (moins de cas graves), réduction des erreurs médicamenteuses, réduction des examens redondants.

---

## 16. Différenciation

| Concurrent | Ce qu'il fait | Ce qu'Alwarid fait en plus |
|---|---|---|
| HOSIX (SIH marocain) | Stocke les dossiers | IA + 3D + chatbot |
| DMP national | Centralise les données | Visualisation + interprétation |
| Doctolib/Vezeeta | Prise de RDV | Aide à la décision clinique |
| Solutions internationales | EHR complets | Pas adapté Maroc, pas souverain |

**5 différenciateurs :** 3D anatomique, IA explicable (XAI), souveraineté des données, Darija (AtlasIA), GaaS 3 couches.

---

## 17. KPIs

### Pour le Médecin
- Temps d'accès à l'info patient (cible < 5 sec)
- Nombre de rapports générés/jour
- Taux de correction post-relecture IA
- Consultations/jour (avant vs après)

### Pour l'Hôpital
- Taux d'occupation services
- Temps d'attente urgences
- Erreurs médicamenteuses signalées
- Transferts réussis via QR

### Pour le Gouvernement
- % d'hôpitaux équipés
- Alertes épidémiques détectées
- Économies (consultations × coût)
- Satisfaction patient secteur public
- Réduction flux vers privé

---

## 18. Matrice des Fonctionnalites

| # | Fonctionnalite | Difficulte | Priorite | Notes |
|---|---|---|---|---|
| F1 | Chat centralise (bouton flottant) | 3/10 | P1 | Remplace les chatbots eclates |
| F2 | Conversations labellees par mode | 4/10 | P1 | Va avec F1 |
| F3 | IA relit rapport + pose des questions | 5/10 | P1 | 2eme appel API automatique |
| F4 | Mode vocal (dictee + commandes) | 6/10 | P2 | Web Speech API simplifie |
| F5 | 4 modes (Urgence/Consultation/Suivi/Transfert) | a recoder | P1 | Tout reconstruire proprement |
| F6 | Modele 3D anatomique interactif | 6/10 | P1 | RECONSTRUIRE — voir section 7, utiliser body.glb ou SVG |
| F7 | Analyse ECG + Grad-CAM + MC-Dropout | a recoder | P1 | T-MECA Flask, fichiers fournis |
| F8 | Generation rapports IA | a recoder | P1 | 6 types de rapports |
| F9 | Ordonnance numerique + PDF | a recoder | P1 | Formulaire dynamique |
| F10 | Transfert securise + QR code | a recoder | P1 | 4 etapes |
| F11 | Agents vocaux (interface vocale) | 7/10 | P3 | V2 |
| F12 | IA memoire medecin (24h learning) | 7/10 | P3 | V2 |
| F13 | Dashboard Gouvernement (GaaS) | 5/10 | P2 | Maquette donnees simulees |
| F14 | Dashboard Hopital | 5/10 | P3 | V2 |
| F15 | Dashboard Medecin personnel | 3/10 | P4 | V2 |
| F16 | Borne Darija (kiosque hopital) | 8/10 | P4 | V2, AtlasIA |
| F17 | IoT capteurs connectes | 9/10 | P5 | V3 |
| F18 | Portail Patient (suivi consultations) | 5/10 | P4 | Espace patient pour voir son historique et ses prochains RDV |
| F19 | Visualisation medecins proches | 4/10 | P4 | Carte/liste des medecins par specialite et proximite |
| F20 | Rapports imprimables (format pro) | 3/10 | P2 | En-tete CHU, mise en page officielle, code INPE |

---

## 19. Recherches a Faire

| # | Sujet | Pourquoi |
|---|---|---|
| 1 | Budget sante numerique Maroc (chiffres exacts) | Justifier le financement |
| 2 | ROI detaille (cout d'une consultation) | Calcul economique jury |
| 3 | Loi 09-08 + Loi 05-20 (obligations exactes) | Questions securite |
| 4 | Fuite vers le prive (chiffres) | Argument confiance |
| 5 | AtlasIA (etat d'avancement) | Faisabilite Darija |
| 6 | Marches publics sante | Business model |
| 7 | HOSIX (couverture + limites) | Differenciation |
| 8 | Nombre de medecins publics | Calcul ROI |
| 9 | Cout passage urgences | Argument economique |
| 10 | DMP deploiement reel | Connaissance terrain |

---

## 20. Fichiers Assets a Fournir a l'IA

Ces fichiers DOIVENT etre donnes a l'IA qui va coder la plateforme, en plus des 4 markdowns de specification.

### Fichiers obligatoires

| Fichier | Chemin | Description | Utilisation |
|---|---|---|---|
| **Logo Alwarid** | `public/logo.png` | Logo de la plateforme | Header, page login, ordonnances, rapports |
| **Modele 3D corps** | `public/models/body.glb` | Mesh 3D humanoide (GLTF/GLB) | Composant BodyViewer3D (section 7) |
| **Image anatomique** | `public/anatomy-reference.png` | Image anatomique haute resolution | Fallback si le GLB ne marche pas |
| **Scanner cerebral** | `public/scan-brain.png` | Image scan cerveau du patient | Zone Tete — panneau detail |
| **ECG** | `public/scan-ecg.png` | Image ECG du patient | Zone Thorax — panneau detail |
| **Echocardiographie** | `public/scan-echo-cardio.png` | Image echo coeur du patient | Zone Thorax — panneau detail |
| **Radio thorax** | `public/scan-thorax.png` | Image radio thoracique | Zone Thorax — panneau detail |
| **Echo abdominale** | `public/scan-abdomen.png` | Image echo abdo du patient | Zone Abdomen — panneau detail |
| **IRM genou** | `public/scan-genou.png` | Image IRM genou gauche | Zone Jambe gauche — panneau detail |
| **Echantillons ECG** | `public/ecg-samples.json` | Donnees brutes ECG (187 points par signal) | Analyse ECG — T-MECA |

### Fichiers T-MECA (modele ECG)

| Fichier | Chemin | Description |
|---|---|---|
| **Modele PyTorch** | `T-MECA/checkpoints/best_model.pth` | Poids du modele ResNet18 entraine |
| **Backend Flask** | `T-MECA/interface/app.py` | Serveur Python pour l'inference ECG |

### Instructions pour l'IA
Tous les chemins des fichiers scans sont deja references dans le modele de donnees patient (section 4, champ `image` dans les objets `scans`). L'IA doit s'assurer que ces images s'affichent correctement quand le medecin clique sur une zone du modele 3D ou consulte l'historique d'imagerie.

---

## 21. Exigences de Qualite UX

### CETTE SECTION EST CRITIQUE
Nous sommes en **phase nationale du hackathon**. L'interface doit etre **irreprochable**. Un design moyen = elimination.

### Regles absolues

1. **Zero friction** — Le medecin ne doit JAMAIS se demander "ou est ce bouton ?" ou "comment je fais pour...?". Chaque action est a maximum 2 clics.

2. **Navigation fluide** — Les transitions entre pages sont douces (fade, slide). Pas de rechargement brutal. Pas de flash blanc.

3. **Feedback instantane** — Chaque clic produit un retour visuel immediat (changement de couleur, animation, loader). Le medecin ne doit jamais se demander "est-ce que ca a marche ?".

4. **Hierarchy informationnelle** — Les informations critiques (allergies, interactions) sont TOUJOURS visibles sans scroller. Les informations secondaires sont accessibles mais ne polluent pas la vue principale.

5. **Mobile-ready** — L'interface fonctionne parfaitement sur tablette (cas d'usage principal en hopital). Le layout s'adapte proprement.

6. **Loading states** — Chaque appel API a un etat de chargement elegant (skeleton screens, pas juste un spinner). Les rapports IA ont un typing effect.

7. **Empty states** — Si une section n'a pas de donnees, afficher un message elegant avec illustration (pas juste "Aucune donnee").

8. **Error states** — Si une API echoue, afficher un message clair avec un bouton "Reessayer" (pas une erreur technique brute).

9. **Micro-animations** — Les cartes reagissent au survol (elevation, ombre). Les badges pulsent doucement pour les alertes critiques. Les panneaux glissent avec des courbes de bezier fluides.

10. **Coherence totale** — Memes espacements, memes rayons de bordure, memes ombres partout. Un seul design system applique religieusement. Voir `uiux.md` pour les tokens.

### Points de difference qui impressionnent le jury
- Le modele 3D qui reagit au clic avec un panel qui slide = effet "wow"
- La carte de chaleur Grad-CAM sur l'ECG = montre que l'IA est explicable
- Le typing effect sur les rapports = montre que l'IA travaille en temps reel
- Le badge de chat flottant avec les conversations labellees = montre la maturite du produit
- Le stepper du transfert avec le QR code = montre un vrai flux securise
- Le graphique glycemique SVG custom = montre qu'on maitrise la data visualization
