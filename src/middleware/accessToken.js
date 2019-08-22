import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import config from '../config';

export const setToken = (payload) => {
    let TOKENTIME = 60*60*24*30; // expires in 30 days
    let token = jwt.sign({payload}, config.secret, {
        expiresIn: TOKENTIME 
    });

    return token;
}

export const verifyToken = (accessToken) => {
    let output;
    jwt.verify(accessToken, config.secret, (e, decoded) => {
        if(e) {
            output = false;
        } else {
            output = true;
        }
    });

    return output;
}