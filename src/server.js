const util = require('util');
const express = require('express');
const ex_server = express();
const server = require('http').createServer(ex_server);
module.exports.server = server;

const response = require("./resources/responses.js")
const device_handler = require('./device-handler.js');

const PORT = process.env.PORT || 8080;
const SILENT = true;


ex_server
    .get("/api/:data", (req, res)=>{
        switch(req.params.data){
            case "election_data":
                res.status(200).json(response.election_data);
                break;
            default:
                res.status(404);
                res.end("invalid");
        }
        SILENT && util.log(req.params.data, "fetched");
    });
    
device_handler.start_server();

server.listen(PORT, ()=>console.log(`server listening on port ${PORT}`));




