import { Router } from 'express';
import Admin from '../models/adminModel';
import { hashPassword } from '../middleware/passwordMiddleware';
import { setToken, validateToken } from '../middleware/accessToken';

export default ({ config, db}) => {
    let api = Router();

    // 'evoting_api/v1/admins/register' Endpoint to create a new admin
    api.post('/register', async (req, res) => {
        const encryptedPassword = hashPassword(req.body.adminPassword);
        const data = {
            adminName: req.body.adminName,
            adminEmail: req.body.adminEmail,
            adminPassword: encryptedPassword,
        }

        let existingAdminEmails = await Admin.findOne({adminEmail: data.adminEmail});
        if (existingAdminEmails) return res.status(400).json({message: 'Email already in use'});

        try {
            let admin = await Admin.create(data);
            if (!admin) return res.status(401).json({message: "Admin Registration was not successful"});

            res.json({message: 'Admin Registration done.', admin});
        } catch (error) {
            res.status(422).json({error: error});
        }
    });

    // 'evoting_api/v1/admins/login' Endpoint to login a admin
    api.post('/login', async (req, res) => {
        try {
            let result = await Admin.find({adminEmail: req.body.adminEmail});

            if (result.length === 0) return res.status(401).json({message: "Email/Password is Incorrect"});

            for (const admin of result){
                const encryptedPassword = hashPassword(req.body.adminPassword);

                if (admin.adminPassword !== encryptedPassword) return res.status(401).json({message: "Email/Password is Incorrect"});

                let payload = {
                    id: admin._id
                }
                let token = setToken(payload);

                res.json({
                    authenticated: true,
                    adminId: admin._id,
                    token: token
                })
            }

        } catch (error) {
            res.status(422).json({error: error});
        }

    });

    // 'evoting_api/v1/admins/' Endpoint to see all admins, admin only
    api.get('/', async (req, res)=> {
        validateToken(req, res);

        try {
            let admins = await Admin.find();

            if (admins.length === 0) return res.status(401).json({message: "No admin found"});
            res.json(admins);
        } catch (error) {
            res.status(422).json({error: error});
        }
    });

    // 'evoting_api/v1/admins/:id' Endpoint to see all admins, admin only
    api.get('/:id', async (req, res)=> {
        validateToken(req, res);

        const id = req.params.id;
        try {
            let admin = await Admin.findById(id);

            if (!admin) return res.status(401).json({message: "No admin found"});
            res.json(admin);
        } catch (error) {
            res.status(422).json({error: error});
        }
    });

    // 'evoting_api/v1/admins/update/:id' Endpoint to update any admin parameters
    api.put('/update/:id', async (req, res) => {
        validateToken(req, res);

        const id = req.params.id;
        const {adminName} = req.body; //TODO: how to ensure password is not included here
        try {
            let admin = await Admin.findByIdAndUpdate(id, {adminName});
            if (!admin) return res.status(401).json({message: "No admin found"});
            res.json({message: 'Update successful'});
        } catch (error){
            res.status(422).json({error: error});
        }
    });

    // 'evoting_api/v1/admins/delete/:id' Endpoint to delete any admin
    api.delete('/delete/:id', async (req, res) => {
        validateToken(req, res);

        const id = req.params.id;
        try {
            let admin = await Admin.findByIdAndDelete(id);
            if (!admin) return res.status(401).json({message: "No admin found"});
            res.json({message: 'Admin account deleted successfully'});

        } catch (error) {
            res.status(422).json({error: error});
        }
    });

    return api;
}