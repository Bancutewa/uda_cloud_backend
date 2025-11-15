# Build stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

# Expose backend port (default 8080)
EXPOSE 8080

CMD ["npm", "start"]
