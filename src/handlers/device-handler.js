'use strict'
const http = require('http')
const WebsocketServer = require('ws').Server;
const util = require('util');
const encrypt = require('./crypt').encrypt;
const decrypt = require('./crypt').decrypt;
const response = require("./resources/responses.js")
const NODEF = 'unidentified'

let port = 8080; //dev

const method = {
    LOGIN: 'LOGIN',
    GET: 'GET',
    POST: 'POST'
}


let wsServer;
let prev_id;


function start_server(server, server_port){
    wsServer = new WebsocketServer({server});
    port = server_port || 8080

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

        //process.env.VERBOSE && log(ws, `MESSAGE: ${JSON.stringify(msg)}`)

        if(ws.id===NODEF && msg.header.method===method.LOGIN)
            return reg_connection(ws, msg.body);

        if(msg.header.method===method.GET)
            switch(msg.header.title){
                case 'USER_DATA':
                    let voter_id = msg.body.msg;
                    try {
                        get_send_voter_details(ws, voter_id);
                    } catch (error) {
                        console.log(error);
                    }
                    break;

                case 'ELECTION_DATA':
                    fetch_send_election_data(ws, msg.body.msg); break;
            }

        if(msg.header.method===method.POST)
            switch(msg.header.title){
                case 'VOTE_DATA': recordVote(ws, msg.body.vote_data)
            }
    })
    .on('close', (socket, code, reason)=>{
        log(ws, 'closed')
    })
}



function get_send_voter_details(ws, voter_id){
    http.get({
        hostname: 'localhost',
        port: port,
        path: '/evoting_api/v1/voter/' + voter_id
    }, res=>{
        let data = ''
        res.on('data', chunk=>data+=chunk)
        res.on('end', ()=>{
            data = JSON.parse(data);
            // data = response.user_data; //////////////////////////emulated test
            if (Object.entries(data).length === 0) {
                return ws_send(ws, 'multiple_vote', {});
            }else if (data.message == 'No user found') {
                return ws_send(ws, 'user_data_error', {});
            }

            let user_data = {};
            user_data.id = data._id,
            user_data.name = data.firstName,
            user_data.surname = data.lastName,
            user_data.othername = data.otherNames,
            user_data.gender = data.gender,
            user_data.state =  data.state,
            user_data.town = data.town,
            user_data.lga = data.lga,
            user_data.fingerprint = data.fingerprint

            try{
                user_data.image = JSON.parse(data.userProfilePicture)
            } catch(err){
                console.log(err)
                user_data.image = {data: [255,216]}
            }

            ws_send(ws, 'user_data', user_data)
        })
    })
}


function fetch_send_election_data(ws, user_data){
    let [user_id, user_lga] = user_data.split(";")

    user_lga = user_lga.replace(" ", "_");

    let req_msg = {
        hostname: "localhost",
        port: port,
        path: "/evoting_api/v1/userelection/"+user_lga,
        method: "GET",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }


    let request = http.get(req_msg, res=>{
        let data = ''
        res.on('data', chunk=>data+=chunk)
        res.on('end', ()=>{
            let fetched_data = JSON.parse(data)
            // let fetched_data = response.election_data; ///////////////////
            let constructed_data = [];

            for(let election in fetched_data){
                election = fetched_data[election];

                let constr_data = {};
                constr_data.title = election.electionName;

                constr_data.code = election.electionCode;
                constr_data.parties = [];
                for(let parties in election.electionParties)
                    constr_data.parties.push(election.electionParties[parties].name)
                constr_data.criteria = {};

                constructed_data.push(constr_data)
            }
            let reply = {election_data:constructed_data}
            ws_send(ws, "Election Data", reply)
        })

    })

    request.on('error', error=>console.log(error))
}


function recordVote(ws, vote_data){
    let req_msg = {
        hostname: "localhost",
        port: port,
        path: "/evoting_api/v1/votes/cast",
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }
    }


    let request = http.request(req_msg, res=>{
        let data = ''
        res.on('data', chunk=>data+=chunk)
        res.on('end', ()=>{
            console.log(data) ////////////////////////////////////////////////////////////////
        })
    })

    request.on('error', error=>console.log(error))
    request.write(JSON.stringify(vote_data))
    request.end();

    /*@debug*/log(ws, vote_data)
}



function reg_connection(ws, id){
    ws.id = id.msg;
    log(ws, 'registered');
}


const ws_send = (ws, _title, msg)=>{
    msg = {
        header: {
            title: (_title && _title.toUpperCase()) || null,
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

