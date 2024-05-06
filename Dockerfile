FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
COPY package-lock*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm run start

FROM node:20-alpine AS runner
WORKDIR /app
COPY ./src ./src
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/package*.json ./
EXPOSE 3000
CMD ["npm", "run", "start"]