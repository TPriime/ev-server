const wsaddr = 'ws://localhost:8080';

var WebSocket = require('ws');
const ws = new WebSocket(wsaddr);

console.time('connection interval');///////////////////////////////////
ws.on('message', (msg)=>{
    console.log(msg);   
})
.on('error', (err)=>{
    console.log(err)
    console.timeEnd('connection interval');/////////////////////////////
});