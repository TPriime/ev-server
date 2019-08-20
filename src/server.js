const express = require('express');
const websocket = require('ws');
const response = require("./resources/responses.js")
const device_handler = require('./device-handler.js');

const PORT = process.env.PORT || 8080;
const SILENT = true;


express()
    .get("/api/:data", (req, res)=>{
        switch(req.params.data){
            case "election_data":
                res.status(200).json(response.election_data);
                break;
            default:
                res.status(404);
                res.end("invalid");
        }
        SILENT && console.log(req.params.data, "fetched");
    })
    .listen(PORT, ()=>console.log(`server listening on port ${PORT}`));
