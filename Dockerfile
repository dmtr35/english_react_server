FROM node

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . .

EXPOSE $PORT

CMD [ "node", "index.js" ]