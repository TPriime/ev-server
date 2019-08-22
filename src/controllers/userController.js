import { Router } from 'express';
import path from 'path';
import Collection from '../models/collectionModel';
import User from '../models/userModel';
import { hashPassword } from '../middleware/passwordMiddleware';
import { doesEmailExist } from '../middleware/validators/emailValidator';
import { validateDisplayPicture } from '../middleware/validators/fileTypeValidators';
import { sendVerificationMail } from '../middleware/verificationMail';
import { setToken, verifyToken } from '../middleware/accessToken';
import { addProfilePicture} from '../middleware/cloudinary';

export default ({ config, db}) => {
    let api = Router();
    
    // 'coltra_api/v1/user/signup' Endpoint to create a new user
    api.post('/signup', async (req, res) => {
        const encryptedPassword = hashPassword(req.body.userPassword);
        const data = {
            fullName: req.body.fullName,
            userEmail: req.body.userEmail,
            userPassword: encryptedPassword,
        }
        let existingUserEmails = await User.find({email: data.userEmail});
        const emailStatus = doesEmailExist(data.userEmail, existingUserEmails);

        if (emailStatus) return res.status(400).json({message: 'Email already in use'});

        try {
            let user = await User.create(data);
            if(user){
                sendVerificationMail(user.userEmail);
                res.json({message: "Account created, check your mail for verification"});
            }    
        } catch (error) {
            res.status(422).json({error: error});
        }
    });

    // 'coltra_api/v1/user/login' Endpoint to login a user
    api.post('/login', async (req, res) => {
        try {
            let result = await User.find({ userEmail: req.body.userEmail});

            if (result.length === 0) return res.status(401).json({message: "Email/Password is Incorrect"});

            for (const user of result){
                const encryptedPassword = hashPassword(req.body.userPassword);

                if(user.userVerified === false) return res.status(401).json({message: "Account Not Verified"});

                if (user.userPassword !== encryptedPassword) return res.status(401).json({message: "Email/Password is Incorrect"});

                let payload = {
                    id: user._id
                }
                let token = setToken(payload);

                res.json({
                    authenticated: true,
                    userId: user._id,
                    token: token
                })
            }
            
        } catch (error) {
            res.status(422).json({error: error});
        }
        
    });

    // 'coltra_api/v1/user/users' Endpoint to see all users, admin only
    api.get('/users', async (req, res)=> {

        try {
            let users = await User.find();

            if (users.length === 0) return res.status(401).json({message: "No user found"});
            res.json(users);
        } catch (error) {
            res.status(422).json({error: error});
        }
    });

    // 'coltra_api/v1/user/:id/update' Endpoint to update any user parameters
    api.put('/:id/update', async (req, res) => {
        let accessToken = req.body.token || req.query.token || req.headers['x-access-token'];

        if(!accessToken) return res.status(407).json({ message: "No token provided" });

        let isTokenValid = verifyToken(accessToken);
        
        if(isTokenValid === false) return res.status(407).json({ message: "Failed to verify token"});
        const id = req.params.id;
        const data = req.body; //how to ensure password us nt included here
        try {
            let user = await User.findByIdAndUpdate(id, data);
            if (!user) return res.status(401).json({message: "No user found"});
            res.json({message: 'Update successful'});
        } catch (error){
            res.status(422).json({error: error});
        }
    });

    // 'coltra_api/v1/user/:id/delete' Endpoint to delete any user
    api.delete('/:id/delete', async (req, res) => {
        let accessToken = req.body.token || req.query.token || req.headers['x-access-token'];

        if(!accessToken) return res.status(407).json({ message: "No token provided" });

        let isTokenValid = verifyToken(accessToken);
        
        if(isTokenValid === false) return res.status(407).json({ message: "Failed to verify token"});
        const id = req.params.id;
        try {
            let user = await User.findByIdAndDelete(id);
            if (!user) return res.status(401).json({message: "No user found"});
            res.json({message: 'User account deleted successfully'});

        } catch (error) {
            res.status(422).json({error: error});
        }
    });

    // 'coltra_api/v1/user/:id/verify' Endpoint to verify user account
    api.put('/:id/verify', async (req, res) => {
        const id = req.params.id;
        try {
            let user = await User.findByIdAndUpdate(id, {userVerified: true});
            if (!user) return res.status(401).json({message: "No user found"});
            res.json({message: 'User verified'});
        } catch (error){
            res.status(422).json({error: error});
        }
    });

    // 'coltra_api/v1/user/:userId/uploadProfilePicture'
    api.post('/:userId/uploadProfilePicture', async (req, res) => {
        let accessToken = req.body.token || req.query.token || req.headers['x-access-token'];

        if(!accessToken) return res.status(407).json({ message: "No token provided" });

        let isTokenValid = verifyToken(accessToken);
        
        if(isTokenValid === false) return res.status(407).json({ message: "Failed to verify token"});

        if (!req.files) return res.status(400).json({message: "No files were uploaded"});

        let mediaFile = req.files.profilePicture;
        let isValid = validateDisplayPicture(mediaFile);

        if (!isValid) return res.status(400).json({message: "Please upload a valid filetype"});

        try {
            mediaFile.mv(`./tempMedia/${mediaFile.name}`); //move the file to a temp storage
            const mediaPath = path.resolve(`./tempMedia/${mediaFile.name}`);
            let data = {
                userId: req.params.userId,
                profilePicture: mediaPath,
                profilePictureId: ''
            }
            let result = await addProfilePicture(data.profilePicture);

            data.profilePicture = result.secure_url;
            data.profilePictureId = result.public_id;

            let upload = await User.findOneAndUpdate(data.userId, {userProfilePicture: data.profilePicture, userProfilePictureId : data.profilePictureId});
            
            if (!upload) return res.status(401).json({message: "Upload was not successful"});
            res.json({message: 'Upload done.', upload: upload});  

        } catch (error) {
            res.status(422).json({error: error});
        }
    });

    return api;
}