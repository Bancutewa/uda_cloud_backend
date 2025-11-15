FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

# Copy images folder for static file serving
COPY ../Img ./Img

# Expose backend port (default 8080)
EXPOSE 8080

CMD ["npm", "start"]
