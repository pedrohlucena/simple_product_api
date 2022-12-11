FROM node:16

WORKDIR /usr/src/app

COPY app/package*.json ./
RUN npm install

COPY ./app/ .

EXPOSE 3003

CMD [ "npm", "start" ]