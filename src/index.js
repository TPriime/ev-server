import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import routes from './routes';

let app = express();
let server = http.createServer(app);
let port = 4050 || process.env.PORT;
let bodyLimit = '1000kb';

// defaults
app.use(express.json({
    limit: bodyLimit
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(fileUpload({
    createParentPath: true
}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*",);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
    next();
});

// api routes v1
app.use('/evoting_api/v1', routes);

server.listen(port);
console.log(`server running on port ${server.address().port}`);

export default app;