'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var http = require('http');
var WebsocketServer = require('ws').Server;
var util = require('util');
var encrypt = require('./crypt').encrypt;
var decrypt = require('./crypt').decrypt;
var response = require("./resources/responses.js");
var NODEF = 'unidentified';

var port = 8080; //dev

var method = {
    LOGIN: 'LOGIN',
    GET: 'GET',
    POST: 'POST'
};

var wsServer = void 0;
var prev_id = void 0;

function start_server(server, server_port) {
    wsServer = new WebsocketServer({ server: server });
    port = server_port || 8080;

    wsServer.on('connection', function (ws) {
        ws.id = ws.id || NODEF;
        log(ws, ' connected');
        ws_send(ws, 'id');
        handle_connection(ws);
    });
}

function handle_connection(ws) {
    ws.on('message', function (msg) {
        msg = JSON.parse(decrypt(msg));

        //process.env.VERBOSE && log(ws, `MESSAGE: ${JSON.stringify(msg)}`)

        if (ws.id === NODEF && msg.header.method === method.LOGIN) return reg_connection(ws, msg.body);

        if (msg.header.method === method.GET) switch (msg.header.title) {
            case 'USER_DATA':
                var voter_id = msg.body.msg;
                try {
                    get_send_voter_details(ws, voter_id);
                } catch (error) {
                    console.log(error);
                }
                break;

            case 'ELECTION_DATA':
                fetch_send_election_data(ws, msg.body.msg);break;
        }

        if (msg.header.method === method.POST) switch (msg.header.title) {
            case 'VOTE_DATA':
                recordVote(ws, msg.body.vote_data);
        }
    }).on('close', function (socket, code, reason) {
        log(ws, 'closed');
    });
}

function get_send_voter_details(ws, voter_id) {
console.log("///////////////////user id///////////////////////////")
console.log("/evoting_api/v1/users/" + voter_id)

    http.get({
        hostname: 'localhost',
        port: port,
        path: "/evoting_api/v1/users/" + voter_id
    }, function (res) {
        var data = '';
        res.on('data', function (chunk) {
            return data += chunk;
        });
        res.on('end', function () {
            data = JSON.parse(data);
            if (Object.entries(obj).length === 0) {
                return ws_send(ws, 'user_data_error', 'DIE');
            }

            var user_data = {};
            user_data.id = data._id, user_data.name = data.firstName, user_data.surname = data.lastName, user_data.othername = data.otherNames, user_data.gender = data.gender, user_data.state = data.state, user_data.town = data.town, user_data.lga = data.lga, user_data.fingerprint = data.fingerprint;

            try {
                user_data.image = JSON.parse(data.userProfilePicture);
            } catch (err) {
                console.log(err);
                user_data.image = { data: [255, 216] };
            }

            ws_send(ws, 'user_data', user_data);
        });
    });
}

function fetch_send_election_data(ws, user_data) {
    var _user_data$split = user_data.split(";"),
        _user_data$split2 = _slicedToArray(_user_data$split, 2),
        user_id = _user_data$split2[0],
        user_lga = _user_data$split2[1];

    var req_msg = {
        hostname: "localhost",
        port: port,
        path: "/evoting_api/v1/userelection/" + user_lga,
        method: "GET",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    var request = http.get(req_msg, function (res) {
        var data = '';
        res.on('data', function (chunk) {
            return data += chunk;
        });
        res.on('end', function () {
            var fetched_data = JSON.parse(data);
            var constructed_data = [];

            for (var election in fetched_data) {
                election = fetched_data[election];

                var constr_data = {};
                constr_data.title = election.electionName;

                constr_data.code = election.electionCode;
                constr_data.parties = [];
                for (var parties in election.electionParties) {
                    constr_data.parties.push(election.electionParties[parties].name);
                }constr_data.criteria = {};

                constructed_data.push(constr_data);
            }
            var reply = { election_data: constructed_data };
            ws_send(ws, "Election Data", reply);
        });
    });

    request.on('error', function (error) {
        return console.log(error);
    });
}

function recordVote(ws, vote_data) {
    var req_msg = {
        hostname: "localhost",
        port: port,
        path: "/evoting_api/v1/votes/cast",
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }
    };

    var request = http.request(req_msg, function (res) {
        var data = '';
        res.on('data', function (chunk) {
            return data += chunk;
        });
        res.on('end', function () {
            console.log(data); ////////////////////////////////////////////////////////////////
        });
    });

    request.on('error', function (error) {
        return console.log(error);
    });
    request.write(JSON.stringify(vote_data));
    request.end();

    /*@debug*/log(ws, vote_data);
}

function reg_connection(ws, id) {
    ws.id = id.msg;
    log(ws, 'registered');
}

var ws_send = function ws_send(ws, _title, msg) {
    msg = {
        header: {
            title: _title && _title.toUpperCase() || null,
            key: null
        },
        body: msg
    };
    ws.send(encrypt(JSON.stringify(msg)));
};

function log(ws, msg) {
    var id = ws.id;

    if (id !== prev_id) console.log();
    util.log('device-' + ws.id, msg);
    prev_id = id;
}

function getConnectedDevices() {
    return wsServer.clients;
}

module.exports = {
    start_server: start_server,
    getConnectedDevices: getConnectedDevices
};
//# sourceMappingURL=device-handler.js.map