import jwt from 'jsonwebtoken';

let secret = "theamazingevoting";

export const setToken = (payload) => {
    let TOKENTIME = 60*60*24*30; // expires in 30 days
    let token = jwt.sign({payload}, secret, {
        expiresIn: TOKENTIME
    });

    return token;
}

const verifyToken = (accessToken) => {
    let output;
    jwt.verify(accessToken, secret, (e, decoded) => {
        if(e) {
            output = false;
        } else {
            output = true;
        }
    });
    return output;
}

export const validateToken = (req, res) =>{
    let accessToken = req.body.token || req.query.token || req.headers['x-access-token'];

    if(!accessToken) return res.status(407).json({ message: "No token provided" });

    let isTokenValid = verifyToken(accessToken);

    if(isTokenValid === false) return res.status(407).json({ message: "Failed to verify token"});
}

export const checkPartiesUnique = (partiesArr) => {
    partiesArr = partiesArr.sort((a, b) => (a.name > b.name) ? 1 : -1);
    let results = [];
    for (let i = 0; i <= partiesArr.length - 1; i++) {
        if (i === partiesArr.length - 1) {
            results.push(partiesArr[i]);
        }else{
            if (partiesArr[i + 1].name !== partiesArr[i].name) {
                results.push(partiesArr[i]);
            }
        }
    }
    return results;
}