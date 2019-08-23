const WebsocketServer = require('ws').Server;
const util  = require('util');
const server = require('./server');
const encrypt = require('./crypt').encrypt;
const decrypt = require('./crypt').decrypt;
const response = require("./resources/responses.js")

const NODEF = 'unidentified'

const method = {
    LOGIN: 'LOGIN',
    GET: 'GET',
    POST: 'POST'
}


let wsServer; 
let prev_id;


function start_server(){
    wsServer = new WebsocketServer({server});
    
    wsServer.on('connection', (ws)=>{
        ws.id = ws.id || NODEF
        log(ws, ' connected');
        ws_send(ws, 'id')
        handle_connection(ws);
    });
}



function handle_connection(ws){
    ws.on('message', (msg)=>{
        msg = JSON.parse(decrypt(msg))
        

        //process.env.VERBOSE && log(ws, `MESSAGE:  ${JSON.stringify(msg)}`)
        
        if(ws.id===NODEF && msg.header.method===method.LOGIN) 
            return reg_connection(ws, msg.body);


        if(msg.header.method===method.GET)
            switch(msg.header.title){
                case 'USER_DATA':
                    let voter_id = msg.body.msg;                  
                    get_send_voter_details(ws, voter_id); break;
            }
        
        if(msg.header.method===method.POST)
            switch(msg.header.title){
                case 'VOTE_DATA':
                    recordVote(ws, msg.body.vote_data)
            }    
    })

    .on('close', (socket, code, reason)=>{
        log(ws, 'closed')
    })
}



function get_send_voter_details(ws, voter_id){
    ws_send(ws, 'user_data', response.user_data)
}

function recordVote(ws, vote_data){
    log(ws, vote_data)
}


function reg_connection(ws, id){
    ws.id = id.msg;
    log(ws, 'registered');
}


const ws_send = (ws, _title, msg)=>{
    msg = {
        header: {
            title: _title.toUpperCase(),
            key: null
        },
        body: msg
    }
    ws.send(encrypt(JSON.stringify(msg)))
}



function log(ws, msg){
    let id = ws.id
    if(id!==prev_id) console.log();
    util.log(`device-${ws.id}`, msg);
    prev_id = id
}


function getConnectedDevices(){
    return wsServer.clients
}



module.exports = {
    start_server,
    getConnectedDevices
};