FROM node:20-alpine

WORKDIR /app

# System deps for sqlite3 build if needed
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install --production

COPY . .

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]
