FROM node:17.4.0

RUN mkdir -p /usr/src/app/kinexon/kinexon-server
WORKDIR /usr/src/app/kinexon/kinexon-server

COPY package.json /usr/src/app/kinexon/kinexon-server
RUN npm install

COPY . /usr/src/app/kinexon/kinexon-server

EXPOSE 9000

CMD "npm" "run" "start"