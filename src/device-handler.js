import { Server as WebsocketServer } from 'ws';
import { log } from 'util';
import { server } from './server';
import { encrypt, decrypt } from './encrypt';
const response = require("./resources/responses.js")

const wsServer;

function start_server(){
    wsServer = new WebsocketServer({server});
    
    wsServer.on('connection', (ws)=>{
        log(ws.id + ' connected');
        ws.send(encrypt('r_id'));
        handle_connection(ws);
    });
}


function handle_connection(ws){
    ws.on('message', (msg)=>{
        msg = JSON.parse(decrypt(msg))
        if(!ws.id && msg.header.method==='login') regConnection(ws, msg.header.id);

        if(msg.header.method==='get')
            switch(msg.body.title){
                case 'user_data':
                    ws.send(response.user_data); break;
            }
    })
}



export default {
    start_server
};