"use strict"

const express = require('express');
const app = express();
const server = require('http').Server(app);
//const socket = require('socket.io')(server);
const {initSocket} = require('./socket/SocketManager');
const robotController = require('./controller/RobotController');

const WebSocketServer = require('websocket').server;
const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});


const PORT = 9000;
const cors = require('cors')

const corsOptions = {
    origin: [
        "http://localhost:3000"
    ],
    exposedHeaders: ["set-cookie"],
};

(async function initialize(){
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
        
        next();
      });  
      app.use(express.json())   
    //app.use('/', cors(corsOptions));
    app.use('', robotController());
    await initSocket(wsServer);
})();

server.listen(PORT);