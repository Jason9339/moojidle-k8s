FROM node:20-alpine

LABEL org.opencontainers.image.source=https://github.com/jason9339/moojidle-k8s

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 3000

CMD ["node", "main.js"]
