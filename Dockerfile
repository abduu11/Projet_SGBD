# Pour specifier la version de node de notre projet
FROM node:18

# Pour definir le repertoire de travail
WORKDIR /app

# Copier les fichiers nécessaires
COPY ./BACKEND/package.json ./BACKEND/package-lock.json ./BACKEND/./

# Installer les dependances
RUN npm install

# Permet de copier les fichiers les fichier dans notre repertoire de travail
COPY . .

# Exposer le port sur lequel l'application ecoute
EXPOSE 5000

# Lancer l'application
CMD ["npm", "start"]





FROM node:18 AS build

WORKDIR /front

COPY ./FRONTEND/package.json ./FRONTEND/package-lock.json ./FRONTEND/./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /front/dist /usr/share/nginx/html

EXPOSE 80

# Lancer l'application
CMD ["nginx", "-g", "daemon off;"]


