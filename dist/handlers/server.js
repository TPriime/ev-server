'use strict';

var util = require('util');
var express = require('express');
var ex_server = express();
var server = require('http').createServer(ex_server);
module.exports = server;
var response = require("./resources/responses.js");
var device_handler = require('./device-handler.js');
var PORT = process.env.PORT || 8080;
var VERBOSE = process.env.VERBOSE = true;

var bodyParser = require('body-parser');

ex_server.use(bodyParser.json());

ex_server.route("/api/:data").get(function (req, res) {
    switch (req.params.data) {
        case "election_data":
            setTimeout(function () {
                res.status(200).json(response.election_data);
            }, 500);

            //res.status(200).json(response.election_data);
            break;

        default:
            res.status(404);
            res.end("invalid");
    }

    VERBOSE && util.log(req.params.data, "fetched");
}).post(function (req, res) {
    console.log(req.body);
    res.end("hey from server");
});

device_handler.start_server(server);
server.listen(PORT, function () {
    return console.log('server listening on port ' + PORT);
});
//# sourceMappingURL=server.js.map