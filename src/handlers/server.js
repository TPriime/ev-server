const util = require('util');
const express = require('express');
const ex_server = express();
const server = require('http').createServer(ex_server);
module.exports = server;
const response = require("./resources/responses.js")
const device_handler = require('./device-handler.js');
const PORT = process.env.PORT || 8080;
const VERBOSE = process.env.VERBOSE = true;

let bodyParser = require('body-parser');

ex_server.use(bodyParser.json());

ex_server.route("/api/:data")
    .get((req, res)=>{
        switch(req.params.data){
            case "election_data":
                setTimeout(()=>{
                    res.status(200).json(response.election_data);
                }, 500)

                //res.status(200).json(response.election_data);
                break;
            
            default:
                res.status(404);
                res.end("invalid");
        }       

        VERBOSE && util.log(req.params.data, "fetched");
    })
    .post((req, res)=>{
        console.log(req.body);
        res.end("hey from server"); 
    })



device_handler.start_server(server);
server.listen(PORT, ()=>console.log(`server listening on port ${PORT}`));

