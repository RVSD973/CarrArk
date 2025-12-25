# Diagramme de Flux du Site CarrArk Navigator

Ce document présente le diagramme de flux du site CarrArk Navigator, illustrant la structure, les interactions utilisateur et les flux de navigation.

## Diagramme de Flux Principal

```mermaid
flowchart TD
    Start([Visiteur arrive sur le site]) --> IndexChoice{Quelle version?}
    
    IndexChoice -->|Par défaut| IndexPage[index.html<br/>Version LIVE 4.5.0]
    IndexChoice -->|Navigation| PTUPage[PTU.html<br/>Version PTU 4.2.1]
    IndexChoice -->|Via bouton| StarmapPage[starmap.html<br/>API Viewer]
    
    %% Page Index LIVE
    IndexPage --> IndexFeatures{Actions disponibles}
    IndexFeatures -->|Clic Menu| OpenForm[📝 Ouvrir formulaire de calcul]
    IndexFeatures -->|URL avec paramètres| LoadRoute[📍 Charger itinéraire partagé]
    IndexFeatures -->|Clic Aide| ShowHelp[❓ Afficher aide]
    IndexFeatures -->|Clic Logo| OrgSite[🔗 Redirection Sibylla]
    IndexFeatures -->|Clic API| StarmapPage
    
    %% Formulaire de calcul
    OpenForm --> FormInput[Saisie des données:<br/>- Titre du trajet<br/>- Sélection astre<br/>- OM vers noyau<br/>- Surface vers noyau<br/>- Distances OM1-6]
    FormInput --> FormActions{Action choisie}
    FormActions -->|Calcul| Calculate[🧮 Calcul de l'itinéraire]
    FormActions -->|Effacer| ClearForm[🗑️ Réinitialiser formulaire]
    FormActions -->|Fermer| CloseForm[❌ Fermer formulaire]
    FormActions -->|Aide| ShowHelp
    
    Calculate --> Validate{Validation données}
    Validate -->|Données valides| Render3D[🎨 Rendu 3D de l'itinéraire]
    Validate -->|Données invalides| ErrorMsg[⚠️ Message d'erreur]
    ErrorMsg --> FormInput
    
    Render3D --> Display3D[Affichage visuel:<br/>- Planète/Lune 3D<br/>- Orbital Markers OM1-6<br/>- Ligne de route<br/>- Points de passage]
    Display3D --> Interact3D{Interactions 3D}
    Interact3D -->|Rotation| OrbitControl[🔄 Contrôle orbital caméra]
    Interact3D -->|Zoom| ZoomControl[🔍 Zoom in/out]
    Interact3D -->|CTRL+D| SaveBookmark[💾 Sauvegarder comme favori]
    
    SaveBookmark --> URLGenerated[🔗 URL générée avec paramètres]
    URLGenerated --> ShareURL[📤 Partage possible]
    
    OrbitControl --> Display3D
    ZoomControl --> Display3D
    
    %% Page PTU
    PTUPage --> PTUFeatures{Actions disponibles}
    PTUFeatures -->|Similar à Index| PTUSimilar[Même fonctionnalités<br/>que version LIVE]
    PTUSimilar --> PTUDiff[❌ Sans système Nyx]
    PTUFeatures -->|Clic LIVE button| IndexPage
    
    %% Page Starmap
    StarmapPage --> StarmapLoad[⏳ Chargement API<br/>starmap.space]
    StarmapLoad --> StarmapDisplay[📊 Affichage tableau:<br/>- ID objet<br/>- Système<br/>- Type<br/>- Coordonnées<br/>- OM/Body Radius]
    StarmapDisplay --> StarmapFilter{Filtres}
    StarmapFilter -->|Par type| FilterType[🔽 Filtrer données]
    FilterType --> StarmapDisplay
    StarmapDisplay -->|Clic retour| IndexPage
    
    %% Aide overlay
    ShowHelp --> HelpDisplay[📋 Affichage overlay aide:<br/>1. Nommer itinéraire<br/>2. Choisir astre<br/>3. Entrer min 3 OM<br/>4. Lancer calcul<br/>5. Sauvegarder CTRL+D<br/>Légende systèmes]
    HelpDisplay -->|Fermer| CloseHelp[❌ Fermer aide]
    CloseHelp --> IndexFeatures
    
    %% Données système
    LoadRoute --> ParseURL[🔍 Parser URL parameters]
    ParseURL --> AutoCalculate[⚡ Calcul automatique]
    AutoCalculate --> Render3D
    
    style Start fill:#b16286,stroke:#333,stroke-width:2px,color:#fff
    style IndexPage fill:#458588,stroke:#333,stroke-width:2px,color:#fff
    style PTUPage fill:#458588,stroke:#333,stroke-width:2px,color:#fff
    style StarmapPage fill:#458588,stroke:#333,stroke-width:2px,color:#fff
    style Render3D fill:#689d6a,stroke:#333,stroke-width:2px,color:#fff
    style Display3D fill:#689d6a,stroke:#333,stroke-width:2px,color:#fff
    style Calculate fill:#d79921,stroke:#333,stroke-width:2px,color:#fff
    style URLGenerated fill:#d65d0e,stroke:#333,stroke-width:2px,color:#fff
```

## Structure des Pages

```mermaid
graph TB
    subgraph "Architecture du Site"
        A[CarrArk Navigator] --> B[index.html]
        A --> C[PTU.html]
        A --> D[starmap.html]
        
        B --> E[Navigation.js]
        C --> E
        E --> F[Dom.js]
        E --> G[Three.js]
        
        B --> H[main.css]
        C --> H
        D --> I[Inline CSS]
        
        D --> J[Starmap.space API]
    end
    
    subgraph "Systèmes disponibles"
        K[index.html - LIVE] --> L[Nyx]
        K --> M[Pyro]
        K --> N[Stanton]
        
        O[PTU.html] --> M
        O --> N
    end
    
    style A fill:#C4D7E6,stroke:#333,stroke-width:3px
    style B fill:#458588,color:#fff
    style C fill:#458588,color:#fff
    style D fill:#458588,color:#fff
    style E fill:#d79921,color:#fff
    style K fill:#689d6a,color:#fff
    style O fill:#689d6a,color:#fff
```

## Flux de Calcul de Navigation

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant F as Formulaire
    participant N as Navigation.js
    participant T as Three.js
    participant V as Vue 3D
    
    U->>F: Saisit données POI
    U->>F: Clic "Calcul"
    F->>N: Soumet données formulaire
    N->>N: Validation données
    alt Données invalides
        N->>U: Affiche erreur
    else Données valides
        N->>N: Parse distances OM1-6
        N->>N: Calcule position POI
        N->>N: Détermine itinéraire optimal
        N->>T: Crée scène 3D
        T->>T: Génère planète/lune
        T->>T: Place 6 Orbital Markers
        T->>T: Trace ligne de route
        T->>T: Ajoute points de passage
        T->>V: Render scène
        V->>U: Affiche visualisation 3D
        N->>F: Génère URL avec paramètres
        F->>U: URL partageable disponible
    end
```

## Flux de Navigation Entre Pages

```mermaid
stateDiagram-v2
    [*] --> IndexLIVE: Accès initial
    
    IndexLIVE --> StarmapAPI: Clic "Starmap.space API"
    StarmapAPI --> IndexLIVE: Clic "CarrArk - Navigator"
    
    IndexLIVE --> OrgSibylla: Clic logo Sibylla
    PTU --> OrgSibylla: Clic logo Sibylla
    
    note right of IndexLIVE
        Version LIVE 4.5.0
        Systèmes: Nyx, Pyro, Stanton
    end note
    
    note right of PTU
        Version PTU 4.2.1
        Systèmes: Pyro, Stanton
    end note
    
    note right of StarmapAPI
        Viewer API externe
        Données temps réel
    end note
```

## Composants et Fonctionnalités

### Pages Principales

| Page | Description | Systèmes | Fonctionnalités |
|------|-------------|----------|-----------------|
| **index.html** | Version LIVE 4.5.0 | Nyx, Pyro, Stanton | Navigation complète, calcul 3D, partage URL |
| **PTU.html** | Version PTU 4.2.1 | Pyro, Stanton | Même fonctionnalités sans Nyx |
| **starmap.html** | API Viewer | N/A | Consultation données API, filtres |

### Fonctionnalités Clés

#### Calcul de Navigation
- **Input**: Distances depuis 3+ Orbital Markers (OM)
- **Process**: Triangulation position POI
- **Output**: Route optimale visualisée en 3D

#### Visualisation 3D (Three.js)
- Rendu planète/lune avec texture
- 6 Orbital Markers positionnés
- Ligne de route avec points de passage
- Contrôles caméra orbital
- Zoom et rotation interactive

#### Partage et Sauvegarde
- Génération URL avec paramètres
- Sauvegarde favoris (CTRL+D)
- Exemples de routes pré-configurées

#### Interface Utilisateur
- Formulaire de saisie données
- Overlay d'aide contextuelle
- Sélection astre par système
- Validation données en temps réel

## Technologies Utilisées

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **3D**: Three.js (WebGL)
- **Architecture**: Modules ES6
- **API**: Starmap.space REST API
- **Design**: Custom CSS avec thème Star Citizen

## Liens de Navigation

```mermaid
graph LR
    A[index.html] -->|Bouton API| B[starmap.html]
    B -->|Bouton Retour| A
    A -->|Bouton désactivé| C[PTU.html]
    C -->|Bouton LIVE| A
    A -->|Logo| D[sibyllasc.fr]
    C -->|Logo| D
    A -->|GitHub link| E[github.com/JoeCaire/CarrArk]
    C -->|GitHub link| E
    
    style A fill:#458588,color:#fff
    style B fill:#d79921,color:#fff
    style C fill:#458588,color:#fff
    style D fill:#b16286,color:#fff
    style E fill:#689d6a,color:#fff
```

---

## Exemples de Routes Pré-configurées

Le site propose des exemples de routes partagées via URL:

1. **Daymar - Constellation Wreck**
2. **Clio - Starfarer Wreck**
3. **Lyria - Paradise Cove**
4. **Magda - Caterpillar Wreck**

Chaque exemple charge automatiquement les données dans le visualiseur 3D.

---

*Diagramme généré pour CarrArk Navigator v4.5.0*  
*Auteur: Joe-Caire @ Sibylla*  
*License: CC BY 4.0*
