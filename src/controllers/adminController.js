import { Router } from 'express';
import Admin from '../models/adminModel';
import { hashPassword } from '../middleware/passwordMiddleware';
import { doesEmailExist } from '../middleware/validators/emailValidator';
import { sendVerificationMail } from '../middleware/verificationMail';
import { setToken, verifyToken } from '../middleware/accessToken';

export default ({ config, db}) => {
    let api = Router();
    
    // 'coltra_api/v1/admin/signup' Endpoint to create a new admin
    api.post('/signup', async (req, res) => {
        const encryptedPassword = hashPassword(req.body.adminPassword);
        const data = {
            adminName: req.body.adminName,
            adminEmail: req.body.adminEmail,
            adminPassword: encryptedPassword,
        }
        let existingAdminEmails = await Admin.find({email: data.adminEmail});
        const emailStatus = doesEmailExist(data.adminEmail, existingAdminEmails);

        if (emailStatus) return res.status(400).json({message: 'Email already in use'});

        try {
            let admin = await Admin.create(data);
            if(admin){
                sendVerificationMail(admin.adminEmail);
                res.json({message: "Account created, check your mail for verification"});
            }    
        } catch (error) {
            res.status(422).json({error: error});
        }
    });

    // 'coltra_api/v1/admin/login' Endpoint to login a admin
    api.post('/login', async (req, res) => {
        try {
            let result = await Admin.find({ adminEmail: req.body.adminEmail});

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

    // 'coltra_api/v1/admin/admins' Endpoint to see all admins, admin only
    api.get('/admins', async (req, res)=> {
        try {
            let admins = await Admin.find();

            if (admins.length === 0) return res.status(401).json({message: "No admin found"});
            res.json(admins);
        } catch (error) {
            res.status(422).json({error: error});
        }
    });

    // 'coltra_api/v1/admin/:id/update' Endpoint to update any admin parameters
    api.put('/:id/update', async (req, res) => {
        const id = req.params.id;
        const data = req.body; //hpw to ensure password us nt included here
        try {
            let admin = await Admin.findByIdAndUpdate(id, data);
            if (!admin) return res.status(401).json({message: "No admin found"});
            res.json({message: 'Update successful'});
        } catch (error){
            res.status(422).json({error: error});
        }
    });

    // 'coltra_api/v1/admin/:id/delete' Endpoint to delete any admin
    api.delete('/:id/delete', async (req, res) => {
        const id = req.params.id;
        try {
            let admin = await Admin.findByIdAndDelete(id);
            if (!admin) return res.status(401).json({message: "No admin found"});
            res.json({message: 'admin account deleted successfully'});

        } catch (error) {
            res.status(422).json({error: error});
        }
    });

    return api;
}