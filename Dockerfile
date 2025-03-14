# 🚀 Backend (Node.js)
FROM node:18 AS backend

# Définir le dossier de travail
WORKDIR /app

# Copier uniquement les fichiers package.json et package-lock.json
COPY BACKEND/package.json BACKEND/package-lock.json ./

# Installer les dépendances
RUN npm install --production

# Copier le reste du code
COPY BACKEND/. .

# Exposer le port sur lequel l'application écoute
EXPOSE 5000

# Lancer le backend
CMD ["npm", "start"]



# 🚀 Frontend (React ou autre)
FROM node:18 AS build

# Définir le dossier de travail
WORKDIR /app

# Copier uniquement les fichiers package.json et package-lock.json
COPY FRONTEND/package.json FRONTEND/package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY FRONTEND/. .

# Construire le frontend
RUN npm run build


# 🚀 Utiliser Nginx pour servir le frontend
FROM nginx:alpine AS frontend

# Copier le build du frontend dans le serveur Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Lancer le serveur Nginx
CMD ["nginx", "-g", "daemon off;"]
