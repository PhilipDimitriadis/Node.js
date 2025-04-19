# version of node to use
FROM node:22
# Directory to save image
WORKDIR /app
# Install all dependencies
COPY package*.json ./
RUN npm install
RUN npm rebuild bcrypt --build-from-source
# Bundle app source
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start"]