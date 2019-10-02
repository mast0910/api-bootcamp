FROM node:8.10.0-alpine

WORKDIR /app

COPY app/package*.json ./

RUN npm install

COPY app/ .

expose 8081

CMD [ "npm", "start" ]
