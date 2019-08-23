'use strict'
const wsaddr = 'ws://localhost:8080';
const crypt = require('../src/crypt');

var WebSocket = require('ws');
const ws = new WebSocket(wsaddr);




//testing connection
ws.on('message', (msg)=>{
    msg = crypt.decrypt(JSON.parse(msg));
    console.log(msg);
    if(msg.header.title==='ID'){
        ws.send(JSON.stringify({
            header: { 
                method: 'LOGIN',
                title: 'id',
            },
            body: {msg:'45678'}
        }));
    }   
})
.on('error', (err)=>{
    console.log(err)
});






//testing get request
setTimeout(()=>{
    ws.send(wrap())
}, 1000)







const wrap = (_method='GET', _title='user_data', _body='empty')=>{
    return JSON.stringify({
        header: { 
            method: _method,
            title: _title,
        },
        body: {msg: _body}
    });
}


















