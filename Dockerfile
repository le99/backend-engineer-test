# https://nodejs.org/fr/docs/guides/nodejs-docker-webapp/

FROM node:22.16.0-bullseye 

WORKDIR /app/server
COPY ./package*.json ./

WORKDIR /app/server
RUN npm install --loglevel verbose
COPY ./ ./

EXPOSE 3000

CMD [ "node", "bin/www" ]
