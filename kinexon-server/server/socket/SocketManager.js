"use strict"

const {getReq} = require('../helper/rest')

const url = `http://127.0.0.1:8000`

module.exports.initSocket = (socket)=>{

    socket.on('request', async function (request){
        if (!originIsAllowed(request.origin)) {
            // Make sure we only accept requests from an allowed origin
            request.reject();
            console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
            return;
          }
          
        const io = request.accept('echo-protocol', request.origin);
        io.on('message', async function (data, callback){
            try{
                let statusResp = await getReq(`${url}/getRobotStatus/${data.utf8Data}`);
                io.sendUTF(JSON.stringify(statusResp))
            }catch(err){
                console.error('Unexpected error!')
            }
        })

        io.on('close', function(reasonCode, description) {
            console.log((new Date()) + ' Peer ' + io.remoteAddress + ' disconnected.');
        });
    })
}

function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
  }