# ALWARID — Specification Securite & Architecture Donnees
## Database, Chiffrement, Conformite Legale, Authentification
### Document de reference pour le developpement securise de la plateforme
### Ce document est AUTO-SUFFISANT. Il contient tout le contexte necessaire.
*Version 2.0 — Mars 2026*

---

## Table des Matieres

1. [Contexte et Enjeux](#1-contexte-et-enjeux)
2. [Cadre Legal Marocain](#2-cadre-legal-marocain)
3. [Identification des Utilisateurs](#3-identification-des-utilisateurs)
4. [Architecture Base de Donnees](#4-architecture-base-de-donnees)
5. [Schema de la Base de Donnees](#5-schema-de-la-base-de-donnees)
6. [Chiffrement — Les 3 Couches](#6-chiffrement)
7. [Authentification et Controle d'Acces](#7-authentification)
8. [Audit Trail et Journalisation](#8-audit-trail)
9. [Securite du Transfert de Dossier](#9-securite-transfert)
10. [Securite de l'IA et Souverainete des Donnees](#10-securite-ia)
11. [Architecture Reseau et Infrastructure](#11-architecture-reseau)
12. [Gestion des Cles de Chiffrement](#12-gestion-des-cles)
13. [Anonymisation pour les Dashboards GaaS](#13-anonymisation)
14. [Certifications et Conformite](#14-certifications)
15. [Plan de Reponse aux Incidents](#15-incidents)
16. [Matrice Securite Hackathon vs Production](#16-matrice)
17. [Recherches Complementaires](#17-recherches)

---

## 1. Contexte et Enjeux

### Qu'est-ce qu'Alwarid ?
Alwarid est une plateforme web d'aide a la decision medicale pour les hopitaux publics marocains. Elle traite des **donnees de sante** qui sont classees comme **donnees sensibles** par la legislation marocaine. Le niveau de securite requis est donc le plus eleve possible.

### Les donnees que nous traitons
| Type de donnee | Exemples | Sensibilite |
|---|---|---|
| Identite patient | Nom, prenom, CIN, date de naissance, telephone | Tres sensible |
| Donnees medicales | Pathologies, allergies, historique, diagnostics | Critique |
| Imagerie | ECG, radios, scanners, IRM, echographies | Sensible |
| Prescriptions | Medicaments, dosages, ordonnances | Sensible |
| Conversations IA | Echanges medecin-chatbot (contiennent des donnees patient) | Critique |
| Identite medecin | Nom, INPE, specialite, identifiants de connexion | Sensible |
| Donnees de transfert | Dossier partage entre services, tokens d'acces | Critique |

### Principes fondamentaux
1. **Souverainete** — Les donnees de sante des citoyens marocains restent sur le territoire marocain
2. **Minimisation** — Ne collecter et afficher que les donnees strictement necessaires au contexte
3. **Chiffrement par defaut** — Tout est chiffre, au repos et en transit
4. **Tracabilite** — Chaque acces a un dossier est journalise
5. **Consentement** — Le patient est informe et donne son accord explicite
6. **Defense en profondeur** — Plusieurs couches de securite independantes

---

## 2. Cadre Legal Marocain

### Lois applicables

#### Loi n 09-08 — Protection des donnees personnelles
C'est la loi fondatrice. Points cles pour Alwarid :

| Article | Obligation | Impact sur Alwarid |
|---|---|---|
| Art. 1 | Les donnees de sante sont des donnees sensibles | Niveau de protection maximal requis |
| Art. 4 | Consentement explicite, libre et eclaire du patient | Interface de consentement obligatoire (mode Transfert + premiere utilisation) |
| Art. 7 | Droit d'acces — le patient peut demander a voir ses donnees | Prevoir un mecanisme (V2 : portail patient) |
| Art. 8 | Droit de rectification et suppression | Le patient peut demander la correction ou la suppression |
| Art. 12 | Notification de fuite a la CNDP | Procedure d'incident obligatoire |
| Art. 21 | Autorisation prealable de la CNDP pour donnees sensibles | Formulaire F112 ou F113 a deposer AVANT mise en production |
| Art. 43 | Transfert hors du Maroc soumis a autorisation CNDP | L'IA en phase hackathon utilise des API externes — necessaire de documenter la migration vers du local |

#### Loi n 05-20 — Cybersecurite
| Obligation | Impact |
|---|---|
| Hebergement local des donnees sensibles | Datacenter marocain obligatoire en production |
| Conformite DNSSI (Directive Nationale de Securite des SI) | Suivre les recommandations de la DGSSI |
| Systemes d'information critiques = protection renforcee | Alwarid traite des donnees de sante = SI critique |

#### Decret n 2.24.921
Precise l'application de la Loi 05-20 pour les prestataires cloud et les donnees sensibles. Impose la gestion par des acteurs nationaux pour les donnees les plus critiques.

### Autorite de controle : CNDP
- **Commission Nationale de controle de la protection des Donnees a caractere Personnel**
- Site : www.cndp.ma
- Alwarid doit deposer une **demande d'autorisation prealable** (pas une simple declaration) car nous traitons des donnees de sante
- Formulaire **F112** (demande normale) ou **F113** (demande simplifiee)
- Delai de reponse : variable (quelques semaines a quelques mois)

### Autorite de cybersecurite : DGSSI
- **Direction Generale de la Securite des Systemes d'Information**
- Definit la **DNSSI** (Directive Nationale de la Securite des Systemes d'Information)
- Ses recommandations sont la reference pour les mesures techniques

---

## 3. Identification des Utilisateurs

### Medecins — Code INPE

Le **code INPE** (Identifiant National des Professionnels et des Etablissements de sante) est le systeme d'identification officiel :

| Propriete | Detail |
|---|---|
| **Format** | 9 chiffres |
| **Attribue par** | ANAM (Agence Nationale de l'Assurance Maladie) |
| **Obligatoire sur** | Ordonnances, feuilles de soins, documents AMO |
| **Verification** | Via le Tableau de l'Ordre (CNOM — Conseil National de l'Ordre des Medecins, www.cnom.ma) |
| **Registre** | Le medecin doit etre inscrit au CNOM pour obtenir un INPE |

**Dans Alwarid :**
- Chaque compte medecin est lie a son **code INPE**
- A la creation du compte, le code INPE est verifie (V2 : integration avec l'API ANAM si disponible)
- L'INPE est affiche sur les ordonnances et rapports generes
- L'INPE est utilise dans les logs d'audit (qui a accede a quel dossier)

### Patients — Identifiant

Le patient est identifie par :
- **ID interne Alwarid** : `PAT-YYYY-XXXXX` (genere par la plateforme)
- **IDCS** (Identifiant Digital Civil et Social) : numero unique national du RNP (quand disponible)
- **Numero CIN** (Carte Nationale d'Identite) : en attendant l'IDCS
- **IDP** (Identifiant Patient) : integre dans la puce CNIE (quand deploye)

**Strategie :**
- Hackathon : ID interne uniquement
- V2 : Integration CIN + IDCS quand le RNP sera connecte aux SI hospitaliers

---

## 4. Architecture Base de Donnees

### Vue generale

```
┌─────────────────────────────────────────────────────┐
│                    NEXT.JS APP                       │
│                 (API Routes / Frontend)               │
├─────────────────────────────────────────────────────┤
│              COUCHE API (authentifiee)                │
│  ├── JWT RS256 (verification a chaque requete)       │
│  ├── Rate limiting (protection brute force)          │
│  └── Validation des inputs (zod / joi)               │
├─────────────────────────────────────────────────────┤
│              ORM / Query Builder                     │
│  └── Prisma (type-safe, migrations, audit hooks)     │
├─────────────────────────────────────────────────────┤
│              POSTGRESQL 16+                          │
│  ├── Chiffrement colonnes sensibles (pgcrypto)       │
│  ├── Row-Level Security (RLS)                        │
│  ├── Connexion SSL/TLS obligatoire                   │
│  ├── Authentification SCRAM-SHA-256                  │
│  └── Audit logging (pg_audit)                        │
├─────────────────────────────────────────────────────┤
│              STOCKAGE DISQUE                         │
│  └── Volume chiffre LUKS (AES-256-XTS)               │
└─────────────────────────────────────────────────────┘
```

### Pourquoi PostgreSQL ?
| Critere | PostgreSQL | MySQL | MongoDB |
|---|---|---|---|
| Row-Level Security natif | Oui | Non | Non |
| Extension chiffrement (pgcrypto) | Oui | Limites | Non natif |
| Conformite sante / referentiels | Standard industriel | Acceptable | Deconseille |
| Extension audit (pg_audit) | Oui | Partiellement | Non |
| Open-source + gratuit | Oui | Oui | Oui |

### ORM recommande : Prisma
- **Type-safe** : erreurs detectees a la compilation, pas a l'execution
- **Migrations** : schema versionne et reproductible
- **Middleware hooks** : permet d'ajouter du logging automatique a chaque requete
- **Compatible Next.js** nativement

### Phase Hackathon
Pour le hackathon, les donnees sont stockees en **mock data** (fichier JSON statique dans le code). MAIS l'architecture PostgreSQL est documentee et prete a etre deployee. On peut installer PostgreSQL localement et y injecter les mock data pour montrer au jury une vraie BDD fonctionnelle.

---

## 5. Schema de la Base de Donnees

### Diagramme Entite-Relation

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────────┐
│   Medecins   │       │     Patients     │       │  BodyRegions     │
├──────────────┤       ├──────────────────┤       ├──────────────────┤
│ id (PK)      │       │ id (PK)          │       │ id (PK)          │
│ inpe_code    │──┐    │ internal_id      │──┐    │ patient_id (FK)  │
│ first_name   │  │    │ first_name  [ENC]│  │    │ region_key       │
│ last_name    │  │    │ last_name   [ENC]│  │    │ label            │
│ speciality   │  │    │ cin         [ENC]│  │    │ severity         │
│ hospital_id  │  │    │ idcs        [ENC]│  │    │ conditions (JSON) │
│ email   [ENC]│  │    │ date_of_birth    │  │    │ operations (JSON) │
│ password_hash│  │    │ sex              │  │    │ scans (JSON)      │
│ phone   [ENC]│  │    │ blood_type       │  │    │ medications (JSON)│
│ role         │  │    │ height           │  │    │ notes        [ENC]│
│ is_active    │  │    │ weight           │  │    └──────────────────┘
│ created_at   │  │    │ city             │  │
│ last_login   │  │    │ phone       [ENC]│  │    ┌──────────────────┐
└──────────────┘  │    │ emergency_  [ENC]│  │    │   MedHistory     │
                  │    │   contact        │  │    ├──────────────────┤
┌──────────────┐  │    │ allergies (ARRAY)│  ├───>│ id (PK)          │
│  Sessions    │  │    │ created_at       │  │    │ patient_id (FK)  │
├──────────────┤  │    │ updated_at       │  │    │ date             │
│ id (PK)      │  │    └──────────────────┘  │    │ type (enum)      │
│ medecin_id   │──┘              │            │    │ title            │
│ token_hash   │                 │            │    │ doctor           │
│ ip_address   │     ┌───────────┘            │    │ hospital         │
│ user_agent   │     │                        │    │ details     [ENC]│
│ expires_at   │     │    ┌──────────────┐    │    └──────────────────┘
│ created_at   │     │    │ Conditions   │    │
└──────────────┘     │    ├──────────────┤    │    ┌──────────────────┐
                     ├───>│ id (PK)      │    │    │   Medications    │
┌──────────────┐     │    │ patient_id   │    │    ├──────────────────┤
│  AuditLog    │     │    │ name         │    ├───>│ id (PK)          │
├──────────────┤     │    │ severity     │    │    │ patient_id (FK)  │
│ id (PK)      │     │    │ since        │    │    │ name             │
│ medecin_id   │     │    │ details [ENC]│    │    │ dosage           │
│ patient_id   │     │    └──────────────┘    │    │ frequency        │
│ action       │     │                        │    │ purpose          │
│ resource     │     │    ┌──────────────┐    │    └──────────────────┘
│ details      │     │    │ Interactions │    │
│ ip_address   │     │    ├──────────────┤    │    ┌──────────────────┐
│ timestamp    │     ├───>│ id (PK)      │    │    │  Conversations   │
└──────────────┘     │    │ patient_id   │    │    ├──────────────────┤
                     │    │ severity     │    └───>│ id (PK)          │
┌──────────────┐     │    │ drugs (ARRAY)│         │ medecin_id (FK)  │
│  Transfers   │     │    │ risk    [ENC]│         │ patient_id (FK)  │
├──────────────┤     │    │ source       │         │ mode (enum)      │
│ id (PK)      │     │    └──────────────┘         │ messages (JSON)  │
│ sender_id    │     │                              │   [ENCRYPTED]    │
│ receiver_id  │     │                              │ created_at       │
│ patient_id   │─────┘                              │ updated_at       │
│ token_hash   │                                    └──────────────────┘
│ data_scope   │
│ consent_at   │
│ expires_at   │
│ accessed_at  │
│ is_revoked   │
│ created_at   │
└──────────────┘
```

### Legende
- `[ENC]` = colonne chiffree avec pgcrypto (AES-256-CBC)
- `(FK)` = cle etrangere
- `(PK)` = cle primaire
- `(ARRAY)` = type PostgreSQL array
- `(JSON)` = type PostgreSQL JSONB
- `(enum)` = type PostgreSQL enum

### Colonnes chiffrees (pgcrypto AES-256-CBC)
Seules les colonnes contenant des **donnees directement identifiantes ou medicales sensibles** sont chiffrees individuellement. Les autres colonnes ne necessitent pas de chiffrement niveau colonne car le disque est deja chiffre (LUKS).

| Table | Colonne | Raison |
|---|---|---|
| patients | first_name, last_name | Identification directe |
| patients | cin, idcs | Numero national |
| patients | phone, emergency_contact | Coordonnees personnelles |
| conditions | details | Donnees medicales |
| interactions | risk | Description medicale |
| body_regions | notes | Notes cliniques |
| med_history | details | Details medicaux |
| conversations | messages | Contenu des echanges avec l'IA |
| medecins | email, phone | Coordonnees personnelles |

### Implementation pgcrypto
```sql
-- Activation de l'extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Chiffrement a l'ecriture (exemple)
INSERT INTO patients (first_name, last_name, cin)
VALUES (
  pgp_sym_encrypt('Youssef', current_setting('app.encryption_key')),
  pgp_sym_encrypt('El Amrani', current_setting('app.encryption_key')),
  pgp_sym_encrypt('AB123456', current_setting('app.encryption_key'))
);

-- Dechiffrement a la lecture
SELECT
  pgp_sym_decrypt(first_name::bytea, current_setting('app.encryption_key')) as first_name,
  pgp_sym_decrypt(last_name::bytea, current_setting('app.encryption_key')) as last_name
FROM patients
WHERE id = 'PAT-2024-00147';
```

### Row-Level Security (RLS)
Chaque medecin ne voit que les patients **qui lui sont assignes** ou qu'il a **explicitement consultes** via le mode de recherche.

```sql
-- Activation RLS
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Politique : le medecin ne voit que ses patients
CREATE POLICY medecin_patients ON patients
  USING (
    id IN (
      SELECT patient_id FROM patient_assignments
      WHERE medecin_id = current_setting('app.current_medecin_id')::uuid
    )
  );
```

---

## 6. Chiffrement — Les 3 Couches

### Vue d'ensemble

```
COUCHE 1 — TRANSIT (donnees en mouvement)
│
│  Tout le trafic reseau est chiffre
│  ├── Frontend <-> Backend : HTTPS (TLS 1.3)
│  ├── Backend <-> PostgreSQL : SSL obligatoire (pg_hba.conf: hostssl)
│  ├── Backend <-> Flask T-MECA : HTTPS
│  └── Backend <-> API IA (Mistral) : HTTPS
│
COUCHE 2 — REPOS (donnees stockees)
│
│  ├── Niveau disque : LUKS (dm-crypt, AES-256-XTS)
│  │   Tout le volume de stockage est chiffre
│  │   Si le disque est vole physiquement = illisible
│  │
│  ├── Niveau colonnes : pgcrypto (AES-256-CBC)
│  │   Les colonnes marquees [ENC] sont chiffrees individuellement
│  │   Meme un DBA ne peut pas lire les donnees sans la cle applicative
│  │
│  └── Niveau backups : chiffres avec GPG ou la meme cle KMS
│
COUCHE 3 — APPLICATION (dans le code)
│
│  ├── Cles API : variables d'environnement (.env.local), JAMAIS dans le code
│  ├── Mots de passe : bcrypt (cout 12)
│  ├── Tokens de session : JWT signe RS256 (asymetrique)
│  ├── Tokens de transfert : UUID v4 + hash SHA-256
│  └── Secrets : rotation trimestrielle
```

### TLS 1.3 — Configuration
```
Protocole :        TLS 1.3 uniquement (pas TLS 1.2, pas SSL)
Cipher suites :    TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256
Certificat :       Let's Encrypt (gratuit) ou certificat EV pour la production
HSTS :             Strict-Transport-Security: max-age=63072000
Certificate pinning (V2) : extra securite contre les attaques MITM
```

---

## 7. Authentification et Controle d'Acces

### Niveaux d'acces (RBAC)

| Role | Droits | Exemple |
|---|---|---|
| `medecin` | Lire/ecrire les dossiers de ses patients, generer rapports, prescrire | Dr. Alaoui |
| `chef_service` | Tout `medecin` + voir les stats du service | Chef service cardiologie |
| `admin_hopital` | Dashboard hopital, gestion des comptes medecins | Direction CHU |
| `admin_national` | Dashboard GaaS gouvernement (donnees anonymisees) | Ministere de la Sante |
| `system` | Maintenance, backups, audit (pas d'acces aux donnees patients) | Equipe technique |

### Flux d'authentification

```
1. CONNEXION
   Medecin entre : email + mot de passe
   ├── Backend verifie le mot de passe (bcrypt)
   ├── Si valide → generer JWT (RS256, expire 8h)
   ├── Le JWT contient : medecin_id, role, inpe_code, hospital_id
   ├── Le JWT est signe avec une cle privee RSA (serveur)
   └── Le JWT est stocke en httpOnly secure cookie (PAS localStorage)

2. CHAQUE REQUETE
   ├── Le cookie JWT est envoye automatiquement
   ├── Le backend verifie la signature avec la cle publique
   ├── Si expire → redirect vers login
   ├── Si valide → set current_medecin_id dans la session PostgreSQL
   └── RLS s'applique automatiquement

3. DECONNEXION
   ├── Le JWT est supprime (cookie efface)
   └── Le token est ajoute a une blacklist Redis (invalidation forcee)
```

### Politique de mots de passe
```
Longueur minimum :    12 caracteres
Complexite :          au moins 1 majuscule + 1 chiffre + 1 special
Stockage :            bcrypt, cout 12 (jamais MD5, jamais SHA-x seul)
Historique :          interdiction de reutiliser les 5 derniers mots de passe
Expiration :          6 mois (recommandation DGSSI)
Tentatives :          5 tentatives max, puis blocage 15 min
Notification :        email au medecin si connexion depuis un nouvel appareil
```

### 2FA (Authentification a Deux Facteurs) — V2

| Phase | Methode | Comment |
|---|---|---|
| Hackathon | Pas de 2FA | Email + mot de passe suffisent pour la demo |
| V2 | **TOTP** (Time-based One-Time Password) | Google Authenticator / Authy — le medecin scanne un QR a l'inscription, puis entre un code 6 chiffres a chaque connexion |
| V3 | **Biometrie** (optionnel) | Face ID / empreinte sur tablette hospitaliere |
| V3+ | **SSO hospitalier** | Integration avec le systeme d'authentification de l'hopital (LDAP / Active Directory) |

### Pourquoi PAS de YubiKey ?
Les YubiKeys sont excellentes en securite mais couteraient ~60EUR par medecin. Pour 13 000 medecins publics = 780 000 EUR juste pour les cles physiques. Le TOTP (gratuit, deja sur le telephone du medecin) offre un niveau de securite suffisant pour la V2.

---

## 8. Audit Trail et Journalisation

### Principe
**Chaque action** touchant un dossier patient est journalisee de facon **immuable** :

### Structure du log
```javascript
AuditLog = {
    id:          "uuid-v4",
    timestamp:   "2026-03-28T14:32:15Z",
    medecin_id:  "uuid-medecin",
    inpe_code:   "123456789",
    patient_id:  "PAT-2024-00147",
    action:      "VIEW_PATIENT",        // enum
    resource:    "body_region.chest",    // quel element
    details:     "Acces zone Thorax",    // description
    ip_address:  "192.168.1.45",
    user_agent:  "Mozilla/5.0...",
    session_id:  "jwt-id"
}
```

### Actions loguees
| Action | Declencheur |
|---|---|
| `LOGIN` | Medecin se connecte |
| `LOGOUT` | Medecin se deconnecte |
| `LOGIN_FAILED` | Tentative echouee |
| `VIEW_PATIENT` | Ouverture d'un dossier patient |
| `VIEW_REGION` | Clic sur une zone du modele 3D |
| `VIEW_SCAN` | Consultation d'une imagerie |
| `GENERATE_REPORT` | Generation d'un rapport IA |
| `DOWNLOAD_REPORT` | Telechargement d'un rapport (Word/PDF) |
| `CREATE_PRESCRIPTION` | Creation d'une ordonnance |
| `DOWNLOAD_PRESCRIPTION` | Telechargement d'une ordonnance |
| `ECG_ANALYSIS` | Lancement d'une analyse ECG |
| `CHAT_MESSAGE` | Message envoye au chatbot IA |
| `TRANSFER_INIT` | Debut d'un transfert de dossier |
| `TRANSFER_CONSENT` | Consentement patient enregistre |
| `TRANSFER_ACCESS` | Le receveur accede au dossier transfere |
| `TRANSFER_REVOKE` | Revocation d'un transfert |
| `SEARCH_PATIENT` | Recherche d'un patient |
| `EXPORT_DATA` | Toute exportation de donnees |

### Regles critiques
- Les logs audit ne sont **JAMAIS supprimables** (append-only)
- Les logs ne contiennent **JAMAIS** le contenu medical en clair (juste les actions)
- Retention : **10 ans minimum** (standard medical)
- Stockage separe : les logs audit sont dans une base/table separee avec des droits restreints
- Le role `medecin` ne peut pas acceder aux logs audit

---

## 9. Securite du Transfert de Dossier

### Architecture du transfert securise

Le transfert utilise un **token temporaire a usage unique** couple a l'authentification du medecin receveur :

```
MEDECIN EMETTEUR                              MEDECIN RECEVEUR
      │                                             │
      │  1. Selectionne les donnees a partager       │
      │  2. Obtient le consentement patient          │
      │  3. Clique "Generer le transfert"            │
      │                                             │
      │  ┌─────────────────────────────────┐        │
      │  │ SERVEUR ALWARID                 │        │
      │  │                                 │        │
      │  │ a. Genere un UUID v4 (token)    │        │
      │  │ b. Hash le token (SHA-256)      │        │
      │  │ c. Stocke le hash + metadata    │        │
      │  │ d. Retourne le token brut       │        │
      │  │    (JAMAIS stocke en clair)      │        │
      │  └─────────────────────────────────┘        │
      │                                             │
      │  4. Le token est encode dans un QR code      │
      │     (ou tout autre mecanisme decide par      │
      │      le gouvernement : RFID, NFC, etc.)      │
      │                                             │
      │──────────── QR / RFID / NFC ───────────────>│
      │                                             │
      │                                    5. Le receveur scanne
      │                                    6. Il est OBLIGE de se
      │                                       connecter a Alwarid
      │                                       (authentification)
      │                                    7. Le token est verifie
      │                                       (hash compare)
      │                                    8. Acces au dossier
      │                                    9. Token invalide
      │                                       apres acces
      │                                             │
```

### Regles de securite du token
| Propriete | Valeur |
|---|---|
| Format | UUID v4 (128 bits d'entropie) |
| Stockage serveur | Hash SHA-256 uniquement (le token brut n'est jamais stocke) |
| Expiration | 30 minutes apres generation |
| Usage | Unique (invalide apres le premier acces) |
| Revocation | Le medecin emetteur peut revoquer a tout moment |
| Authentification receveur | Obligatoire (le scan seul ne suffit PAS) |
| Log | Qui a cree, qui a scanne, quand, IP, donnees accedees |

### Remarque sur le mecanisme physique
Le choix du support physique (QR code, RFID, NFC, badge...) depend de l'infrastructure que le gouvernement decidera de deployer. Alwarid est **agnostique** sur ce point : le systeme genere un **token securise**, et le mecanisme de transmission physique est interchangeable. L'architecture est concue pour supporter n'importe quel vecteur.

---

## 10. Securite de l'IA et Souverainete des Donnees

### Le Probleme Critique
Quand le medecin envoie des observations a l'API Mistral/Gemini pour generer un rapport, les donnees du patient **sortent du territoire marocain**. C'est contraire a la Loi 05-20.

### Strategie en 3 phases

| Phase | Solution | Souverainete |
|---|---|---|
| **Hackathon** | API Mistral (serveurs Paris, entreprise europeenne) | Partielle — disclaimer "prototype" |
| **V2** | Mistral 7B open-source heberge sur datacenter marocain | Totale |
| **V3** | Modele fine-tune medical + AtlasIA Darija, tout local | Totale + adapte |

### Mesures de protection des donnees envoyees a l'API (hackathon)
Meme en utilisant une API externe, on peut minimiser les risques :

1. **Pseudonymisation** : avant d'envoyer a l'API, remplacer les noms/CIN par des identifiants temporaires
   ```
   Avant envoi : "Youssef El Amrani, CIN AB123456, diabetique"
   Apres pseudo: "Patient P-TEMP-001, diabetique"
   ```
2. **Pas de CIN/IDCS** dans les prompts — jamais d'identifiant national
3. **Pas de coordonnees** (telephone, adresse) dans les prompts
4. **Suppression des logs API** : demander a Mistral de ne pas stocker les prompts (option disponible dans leur API)
5. **Disclaimer** visible dans l'interface : *"Prototype — en production, l'IA sera hebergee sur le territoire marocain"*

### Securite du modele ECG (T-MECA)
Le modele T-MECA est heberge **localement** (serveur Flask sur la machine). Il n'y a aucun transfert de donnees vers l'exterieur pour l'analyse ECG. Les signaux ECG restent 100% en local.

---

## 11. Architecture Reseau et Infrastructure

### Hackathon (local)
```
┌─────────────────────────────────────────┐
│           MACHINE LOCALE                 │
│                                         │
│  ┌──────────┐    ┌──────────────┐       │
│  │ Next.js  │    │ Flask T-MECA │       │
│  │ :3000    │───>│ :5050        │       │
│  └──────────┘    └──────────────┘       │
│       │                                 │
│       │ HTTPS                           │
│       ▼                                 │
│  API Mistral (externe, Paris)           │
└─────────────────────────────────────────┘
```

### Production (V2) — Architecture cible
```
┌─────────────────── DATACENTER MAROCAIN ──────────────────┐
│                                                          │
│  ┌──────────────────┐                                    │
│  │   REVERSE PROXY  │  (Nginx, rate limiting, WAF)       │
│  │   + TLS TERM.    │                                    │
│  └────────┬─────────┘                                    │
│           │                                              │
│  ┌────────▼─────────┐    ┌──────────────────┐           │
│  │    NEXT.JS APP   │    │ NestJS API       │           │
│  │    (Frontend)    │───>│ (Backend secure) │           │
│  └──────────────────┘    └────────┬─────────┘           │
│                                   │                      │
│           ┌───────────────────────┼───────────┐          │
│           │                       │           │          │
│  ┌────────▼─────┐    ┌───────────▼──┐  ┌─────▼──────┐  │
│  │ PostgreSQL   │    │ Flask T-MECA │  │ Mistral 7B │  │
│  │ (chiffre)    │    │ (ECG local)  │  │(LLM local) │  │
│  └──────────────┘    └──────────────┘  └────────────┘  │
│                                                          │
│  ┌──────────────┐    ┌──────────────┐                   │
│  │ Redis        │    │ KMS          │                   │
│  │ (sessions,   │    │ (gestion     │                   │
│  │  blacklist)  │    │  des cles)   │                   │
│  └──────────────┘    └──────────────┘                   │
│                                                          │
│  ┌──────────────────────────────────────┐               │
│  │ LOGS AUDIT (base separee, immuable) │               │
│  └──────────────────────────────────────┘               │
└──────────────────────────────────────────────────────────┘
```

### Protection reseau
| Mesure | Outil | Description |
|---|---|---|
| **Reverse Proxy** | Nginx | Point d'entree unique, terminaison TLS |
| **WAF** | ModSecurity / Cloudflare | Protection contre injections SQL, XSS, CSRF |
| **Rate Limiting** | Nginx + application | 100 requetes/min/IP max |
| **CORS** | Next.js config | Seules les origines autorisees |
| **CSP** | Headers HTTP | Content Security Policy strict |
| **HSTS** | Headers HTTP | Force HTTPS |
| **Firewall** | iptables / ufw | Seuls les ports 80/443 ouverts |

---

## 12. Gestion des Cles de Chiffrement

### Architecture de cles (Envelope Encryption)

```
┌─────────────────────────────────────┐
│  KMS (Key Management System)        │
│  HashiCorp Vault ou AWS KMS         │
│                                     │
│  Contient : KEK (Key Encryption Key)│
│  = la cle maitre qui protege tout   │
└────────────────┬────────────────────┘
                 │
                 │ chiffre/dechiffre
                 ▼
┌─────────────────────────────────────┐
│  DEK (Data Encryption Key)          │
│  = cle utilisee par pgcrypto        │
│  pour chiffrer les colonnes [ENC]   │
│                                     │
│  Stockee CHIFFREE dans la config    │
│  (pas en clair, pas dans le code)   │
└─────────────────────────────────────┘
```

### Rotation des cles
| Evenement | Action |
|---|---|
| **Tous les 90 jours** | Rotation planifiee de la KEK. Les DEK sont re-chiffrees avec la nouvelle KEK. Les donnees ne bougent pas. |
| **Compromission suspectee** | Rotation immediate de la KEK + re-chiffrement des DEK + invalidation de toutes les sessions |
| **Depart d'un admin** | Rotation de la KEK + changement de tous les acces infra |

### Hackathon
Pour le hackathon, la cle de chiffrement est dans un fichier `.env.local` (non commite dans git). En production, elle est dans un KMS.

---

## 13. Anonymisation pour les Dashboards GaaS

### Principe
Les dashboards Hopital et Gouvernement ne montrent **jamais** de donnees patient individuelles. Tout est **agrege et anonymise**.

### Techniques d'anonymisation

| Technique | Description | Utilisation |
|---|---|---|
| **Agregation** | Compter, moyenner, regrouper par zone/periode | KPIs (nombre de cas, taux d'occupation) |
| **K-Anonymite** | Chaque combinaison d'attributs doit correspondre a au moins K personnes | Statistiques regionales (K=10 min) |
| **Suppression** | Retirer les identifiants directs | Tout export de donnees |
| **Generalisation** | "58 ans" → "50-60 ans", "Fes" → "Region Fes-Meknes" | Rapports epidemiologiques |
| **Bruit differentiel** | Ajouter un bruit aleatoire aux chiffres exacts | Donnees publiques open data |

### Exemples concrets
```
DONNEE BRUTE (JAMAIS affichee dans le dashboard) :
  Youssef El Amrani, 58 ans, Fes, Diabete T2, HTA Stade 2

DONNEE ANONYMISEE (dashboard hopital) :
  Homme, 50-60 ans, Diabete T2 + HTA → comptabilise dans les stats

DONNEE AGREGEE (dashboard gouvernement) :
  Region Fes-Meknes : 12 453 cas de diabete T2, +3.2% vs 2025
```

---

## 14. Certifications et Conformite

### Certification obligatoire
| Certification | Autorite | Obligatoire ? | Status |
|---|---|---|---|
| **Autorisation CNDP** | CNDP (formulaire F112/F113) | OUI, avant mise en production | A faire |
| **Conformite DNSSI** | DGSSI | OUI pour les SI traitant des donnees sensibles | A evaluer |

### Certifications recommandees (argument jury)
| Certification | Description | Pourquoi |
|---|---|---|
| **ISO 27001** | Management de la Securite de l'Information | Standard recommande par la DGSSI, exige dans les appels d'offres sante |
| **ISO 27701** | Extension vie privee de l'ISO 27001 | Specifique a la protection des donnees personnelles |
| **HDS** (Hebergement Donnees de Sante) | Certification francaise, reconnue internationalement | Pas d'equivalent marocain mais reference de qualite |
| **Tier III** (datacenter) | Certification infrastructure physique | Pour le choix de l'hebergeur marocain |

### Reponse au jury
> *"Nous visons la certification ISO 27001 pour notre solution. C'est le standard recommande par la DGSSI pour les systemes d'information traitant des donnees sensibles au Maroc. De plus, nous avons identifie la procedure d'autorisation CNDP (formulaire F112) qui est un prealable obligatoire avant toute mise en production."*

---

## 15. Plan de Reponse aux Incidents

### Classifications
| Niveau | Type | Exemple | Delai de reponse |
|---|---|---|---|
| **P0 — Critique** | Fuite de donnees patient confirmee | Base de donnees exposee | Immediat (< 1h) |
| **P1 — Eleve** | Acces non autorise detecte | Connexion suspecte depuis l'etranger | < 4h |
| **P2 — Moyen** | Tentative d'intrusion bloquee | Brute force detecte et bloque | < 24h |
| **P3 — Faible** | Anomalie dans les logs | Nombre inhabituel de requetes | < 72h |

### Procedure P0 (fuite confirmee)
```
1. CONTAINMENT (< 1h)
   ├── Isoler le systeme affecte
   ├── Revoquer tous les tokens actifs
   ├── Bloquer tous les acces externes
   └── Activer le mode maintenance

2. NOTIFICATION (< 24h)
   ├── Notifier la CNDP (obligation Loi 09-08 Art. 12)
   ├── Notifier la DGSSI (obligation Loi 05-20)
   ├── Notifier les medecins concernes
   └── Evaluer si les patients doivent etre informes

3. INVESTIGATION (< 72h)
   ├── Analyser les logs audit
   ├── Identifier la cause racine
   ├── Evaluer l'etendue de la fuite
   └── Documenter tout

4. REMEDIATION
   ├── Corriger la vulnerabilite
   ├── Rotation de toutes les cles
   ├── Re-audit complet
   └── Rapport a la CNDP
```

---

## 16. Matrice Securite Hackathon vs Production

| Mesure | Hackathon | V2 Production |
|---|---|---|
| HTTPS / TLS | TLS 1.3 (localhost dev cert) | TLS 1.3 (certificat EV) |
| Base de donnees | Mock data JSON | PostgreSQL chiffre |
| Chiffrement disque | Non | LUKS AES-256 |
| Chiffrement colonnes | Non | pgcrypto AES-256 |
| Authentification | Email + mot de passe | Email + mot de passe + 2FA TOTP |
| JWT | HS256 (symetrique, simplifie) | RS256 (asymetrique) |
| RBAC | Simplifie (1 role) | Complet (5 roles) |
| Row-Level Security | Non | Oui |
| Audit trail | Console.log | pg_audit + table dediee |
| Rate limiting | Non | Nginx + applicatif |
| WAF | Non | ModSecurity |
| KMS | .env.local | HashiCorp Vault |
| Backups chiffres | Non | Oui + test de restauration |
| Pseudonymisation IA | Partielle | Totale |
| Hebergement | Local | Datacenter marocain |
| Autorisation CNDP | Non necessaire (prototype) | Obligatoire |

---

## 17. Recherches Complementaires

| # | Sujet | Pourquoi | Ou chercher |
|---|---|---|---|
| 1 | Procedure exacte depot CNDP (F112) | Si le jury demande "vous avez l'autorisation ?" | cndp.ma |
| 2 | Hebergeurs marocains certifies | Pour nommer un partenaire concret | nindohost.ma, n+one, inwi business |
| 3 | Cout hebergement datacenter marocain | Pour le budget previsionnel | Devis hebergeurs |
| 4 | DNSSI — directives techniques exactes | Pour montrer la conformite | dgssi.gov.ma |
| 5 | Exemples de fuites de donnees sante au Maroc | Pour l'argument "c'est urgent de securiser" | Presse, CNDP rapports annuels |
| 6 | ISO 27001 au Maroc — nombre d'entreprises certifiees | Pour montrer que c'est faisable | Bureau Veritas Maroc |
| 7 | API ANAM pour verification INPE | Pour l'integration V2 | anam.ma |
| 8 | CNOM Tableau de l'Ordre — acces API | Pour verifier les medecins | cnom.ma |
| 9 | Loi 09-08 texte integral | Pour citer les articles exacts | Bulletin Officiel, cndp.ma |
| 10 | Decret 2.24.921 — obligations cloud | Pour les exigences d'hebergement | SGG (Secretariat General du Gouvernement) |
