FROM node:20.11.0-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci && npm cache clean --force
COPY . .
CMD ["npm", "run", "dev"]