FROM node:17.4.0

RUN mkdir -p /usr/src/app/kinexon/client
WORKDIR /usr/src/app/kinexon/client

COPY package.json /usr/src/app/kinexon/client
RUN npm install

COPY . /usr/src/app/kinexon/client

#RUN npm run build

EXPOSE 3000


CMD "npm" "run" "dev"