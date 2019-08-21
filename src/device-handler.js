const WebsocketServer = require('ws').Server;
const util = require('util');
const server = require('./server').server;



function start_server(){
    let wss = new WebsocketServer({server});
    wss.on('connection', (ws)=>{
        util.log(ws + ' connected');
        ws.send('hey'); 
    });

}


module.exports = {
    start_server
};