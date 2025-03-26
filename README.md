# Système de Gestion des Examens (SGBD)

## Description
Application web de gestion des examens en ligne permettant aux enseignants de créer et gérer des examens, et aux étudiants de les passer en ligne avec des fonctionnalités de détection de plagiat et d'assistance via chatbot.

## Fonctionnalités
- Création et gestion des examens
- Upload de documents PDF
- Système de correction en ligne
- Détection de plagiat
- Chatbot assistant
- Statistiques et rapports

## Technologies
- Frontend: React.js, Material-UI
- Backend: Node.js, Express.js
- Base de données: MariaDB
- Infrastructure: Docker, Kubernetes, Azure Storage

## Installation

### Prérequis
- Node.js (v14+)
- MariaDB
- Docker
- Kubernetes
- Azure Storage Account

### Frontend
```bash
cd FRONTEND
npm install
npm run dev
```

### Backend
```bash
cd BACKEND
npm install
npm start
```

### Base de données
```bash
cd DATABASE
mysql -u root -p < db_schema.sql
```

## Configuration
Copier les fichiers `.env.example` vers `.env` et configurer les variables d'environnement.

## Déploiement
```bash
# Frontend
kubectl apply -f FRONTEND/k8s/

# Backend
kubectl apply -f BACKEND/k8s/
```

## Structure du Projet
```tree
├── FRONTEND/                    # Application React
│   ├── src/                    # Code source React
│   │   ├── Components/         # Composants réutilisables
│   │   ├── PAGES/             # Pages de l'application
│   │   │   ├── PAGE_ETU/      # Pages pour les étudiants
│   │   │   └── PAGE__ENSEIGN/ # Pages pour les enseignants
│   │   ├── context/           # Contextes React
│   │   └── App.jsx            # Point d'entrée React
│   ├── public/                 # Fichiers statiques
│   ├── k8s/                    # Configurations Kubernetes
│   ├── nginx.conf              # Configuration Nginx
│   ├── Dockerfile              # Configuration Docker
│   ├── package.json            # Dépendances frontend
│   └── vite.config.js          # Configuration Vite
│
├── BACKEND/                     # API Node.js
│   ├── src/                    # Code source Node.js
│   │   ├── controllers/        # Contrôleurs
│   │   ├── models/            # Modèles de données
│   │   ├── routes/            # Routes API
│   │   ├── services/          # Services métier
│   │   ├── middlewares/       # Middlewares Express
│   │   └── configs/           # Configurations
│   ├── uploads/               # Dossier des uploads
│   ├── k8s/                   # Configurations Kubernetes
│   ├── Dockerfile             # Configuration Docker
│   └── package.json           # Dépendances backend
│
└── DATABASE/                   # Schéma et procédures SQL
    ├── db_schema.sql          # Schéma de la base de données
    ├── PROCEDURE.sql          # Procédures stockées
    ├── PROCEDURES_STOCKEES.png # Diagramme des procédures
    └── GestionExamens.png     # Diagramme de la base de données
```
## Contribution
1. Fork le projet
2. Créer une branche (`git checkout -b feature/NouvelleFonctionnalite`)
3. Commit (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push (`git push origin feature/NouvelleFonctionnalite`)
5. Ouvrir une Pull Request

### Lien vers la plateforme: http://sunusc.tech/ ou bien http://57.153.2.134/ 

## 📸 Démo

### Landing Page
<table>
    <tr>
        <td><img src="assets/1.png"></td>
        <td><img src="assets/2.png"></td>
        <td><img src="assets/3.png"></td>
    </tr>
    <tr>
        <td><img src="assets/4.png"></td>
        <td><img src="assets/5.png"></td>
        <td><img src="assets/1.png"></td>
    </tr>
</table>

### Chatbot Assistant 🤖
<img src="assets/CHATBOT.png">
<p>Afin de pouvoir avoir des éclaircissements sur les sujets d'examen ou les corrections, les étudiants disposent d'un chatbot avec lequel ils pourront interagir pour répondre à leurs questions. Ce chatbot utilise l'intelligence artificielle deepseek_v3 via l'API de "OpenRouter".</p>

### Pages d'Authentification
<table>
    <tr>
        <td><img src="assets/Inscription.jpg" alt="Page d'inscription via ordinateur" width="100%"></td>
        <td><img src="assets/Inscription1.jpg" alt="Page d'inscription via téléphone" width="80%"></td>
    </tr>
    <tr>
        <td><img src="assets/Connexion.jpg" alt="Page de connexion via ordinateur" width="100%"></td>
        <td><img src="assets/Connexion1.jpg" alt="Page de connexion via téléphone" width="80%"></td>
    </tr>
</table>
