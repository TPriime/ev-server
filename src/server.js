const response = require("./resources/responses.js")
const express = require('express');

const PORT = process.env.PORT || 8080

express()
    .get("/api/:data", (req, res)=>{
        switch(req.params.data){
            case "election_data":
                res.status(200).json(response.election_data)
                break
            default:
                res.status(404)
                res.end("invalid")
        }
    })
    .listen(PORT, ()=>console.log(`server listening on port ${PORT}`));
