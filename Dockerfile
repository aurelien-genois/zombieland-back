FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY ./ ./

RUN npm run db:generate

# RUN npm run build if use "start:prod" instead of "start:dev"

CMD ["npm", "run", "start:dev"]