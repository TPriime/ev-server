import http from 'http';
import express from 'express';
import fileUpload from 'express-fileupload';
import jwt from 'jsonwebtoken';

import config from './config';
import routes from './routes';

let app = express();
let server = http.createServer(app);

// defaults
/* app.use(express.json({
    limit: config.bodyLimit
})); */
app.use(express.urlencoded({ extended: false }));
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

server.listen(config.port);
console.log(`server running on port ${server.address().port}`);

export default app;