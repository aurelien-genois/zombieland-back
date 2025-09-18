FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY ./ ./

RUN npm run db:generate

# RUN npm run build if use "docker:start" instead of "docker:start:dev"

CMD ["npm", "run", "docker:dev"]