# Pour specifier la version de node de notre projet
FROM node:18

# Pour definir le repertoire de travail
WORKDIR /app

# Copier les fichiers nécessaires
COPY package.json package-lock.json ./

# Installer les dependances
RUN npm install

# Permet de copier les fichiers les fichier dans notre repertoire de travail
COPY . .

# Exposer le port sur lequel l'application ecoute
EXPOSE 5000

# Lancer l'application
CMD ["npm", "start"]