import { Router } from 'express';
import BankAccount from '../models/bankAccountModel';
import { setToken, verifyToken } from '../middleware/accessToken';

export default ({ config, db}) => {

    let api = Router();

    // '/coltra_api/v1/bankAccount/create' Endpoint to create a new bank Account [Auth Required]
    api.post('/create', async (req, res) => {
        let accessToken = req.body.token || req.query.token || req.headers['x-access-token'];

        if(!accessToken) return res.status(407).json({ message: "No token provided" });

        let isTokenValid = verifyToken(accessToken);
        
        if(isTokenValid === false) return res.status(407).json({ message: "Failed to verify token"});

        try {
            
            let data = {
                belongsTo: req.body.belongsTo,
                bankName: req.body.bankName,
                bankAccountName: req.body.bankAccountName,
                bankAccountNumber: req.body.bankAccountNumber
            }

            let userBankAccount = await BankAccount.create(data);
        
            if(userBankAccount) {
                res.json({ 
                    message: "BankAccount Added Successfully",
                    userBankAccount   
                });
            }
        } catch (error) {
            res.status(422).json(error);
        }
    });


    // '/coltra_api/v1/bankAccount/:id' Endpoint to get all BankAccounts in the database [Auth Required]
     api.get('/:id', async (req, res) => {

        let accessToken = req.body.token || req.query.token || req.headers['x-access-token'];

        if(!accessToken) return res.status(407).json({ message: "No token provided" });

        let isTokenValid = verifyToken(accessToken);
        
        if(isTokenValid === false) return res.status(407).json({ message: "Failed to verify token"});

        try {
            let result = await BankAccount.findById(req.params.id);
            
            if(result) {
                res.json(result);
            }
        } catch (error) {
            res.status(417).json({ message: "Could not find requested Bank Account"});
        }
    });

    // '/coltra_api/v1/bankAccount/:id' Endpoint to access a BankAccount in the database [Auth Required]
    api.get('/:id', async (req, res) => {
        let accessToken = req.body.token || req.query.token || req.headers['x-access-token'];

        if(!accessToken) return res.status(407).json({ message: "No token provided" });

        let isTokenValid = verifyToken(accessToken);
        
        if(isTokenValid === false) return res.status(407).json({ message: "Failed to verify token"});

        try {
            let result = await BankAccount.findById(req.params.id);

            if(result) {
                res.json(result);
            }
        } catch (error) {
            res.status(417).json({message: "Could not get BankAccount details"});
        }
    });

    // '/coltra_api/v1/bankAccount/:id/delete' Endpoint to access a BankAccount in the database [Auth Required]
    api.delete('/:id/delete', async (req, res) => {
        let accessToken = req.body.token || req.query.token || req.headers['x-access-token'];

        if(!accessToken) return res.status(407).json({ message: "No token provided" });

        let isTokenValid = verifyToken(accessToken);
        
        if(isTokenValid === false) return res.status(407).json({ message: "Failed to verify token"});

        try {
            let bankAccount = await BankAccount.findByIdAndDelete(req.params.id);

            if(bankAccount) {
                res.json({message: "Bank account deleted successfully"})
            }
        } catch (error) {
            res.status(401).json({message: "Bank Account not found"});
        }
    });


    return api;
}