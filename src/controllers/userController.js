import { Router } from 'express';
import path from 'path';
import User from '../models/userModel';
import { validateDisplayPicture } from '../middleware/validators/fileTypeValidators';
import { validateToken } from '../middleware/accessToken';
import { addProfilePicture} from '../middleware/cloudinary';

export default ({ config, db}) => {
    let api = Router();

    // 'evoting_api/v1/users/register' Endpoint to create a new user
    api.post('/register', async (req, res) => {
        validateToken(req, res);

        if (!req.files) return res.status(400).json({message: "No files were uploaded"});

        let mediaFile = req.files.userProfilePicture;
        let isValid = validateDisplayPicture(mediaFile);

        if (!isValid) return res.status(400).json({message: "Please upload a valid filetype"});

        try {
            let existingUserEmail = await User.findOne({userEmail: req.body.userEmail});
            // console.log(existingUserEmail);
            if(existingUserEmail) return res.status(400).json({message: 'Email already in use'});

            let existingUserphone = await User.findOne({phoneNumber: req.body.phoneNumber});
            // console.log(existingUserphone);
            if (existingUserphone) return res.status(400).json({message: 'Phone number already in use'});

            mediaFile.mv(`./tempMedia/${mediaFile.name}`); //move the file to a temp storage
            const mediaPath = path.resolve(`./tempMedia/${mediaFile.name}`);

            let result = await addProfilePicture(mediaPath);
            if(result.error) return res.status(503).json({message: "Upload was not successful"});

            const data = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                otherNames: req.body.otherNames,
                phoneNumber: req.body.phoneNumber,
                dateOfBirth: req.body.dateOfBirth,
                gender: req.body.gender,
                state: req.body.state,
                lga: req.body.lga,
                town: req.body.town,
                maritalStatus: req.body.maritalStatus,
                occupation: req.body.occupation,
                userEmail: req.body.userEmail,
                fingerprint: req.body.fingerprint,
                userProfilePicture: result.secure_url,
                userProfilePictureId: result.public_id
            }

            let upload = await User.create(data);

            if (!upload) return res.status(401).json({message: "Registration was not successful"});
            res.json({message: 'Registration done.', upload});

        } catch (error) {
            res.status(422).json(error);
            console.log(error);
        }
    });

    // 'evoting_api/v1/users' Endpoint to see all users, admin only
    api.get('/', async (req, res)=> {

        validateToken(req, res);

        try {
            let users = await User.find();

            if (users.length === 0) return res.status(401).json({message: "No user found"});
            res.json(users);
        } catch (error) {
            res.status(422).json({error: error});
        }
    });

    // 'evoting_api/v1/users/:id' Endpoint to get a user
    api.get('/:id', async (req, res)=> {

        validateToken(req, res);
        const id = req.params.id;

        try {
            let user = await User.findById(id);

            if (!user) return res.status(401).json({message: "No user found"});
            res.json(user);
        } catch (error) {
            res.status(422).json({error: error});
        }
    });

    // 'evoting_api/v1/users/update/:id' Endpoint to update any user parameters
    api.put('/update/:id', async (req, res) => {
        validateToken(req, res);
        const id = req.params.id;
        const {firstName,lastName,otherNames,dateOfBirth,gender,state,lga,town,maritalStatus,occupation} = req.body;

        try {
            let user = await User.findByIdAndUpdate(id, {firstName,lastName,otherNames,dateOfBirth,gender,state,lga,town,maritalStatus,occupation});
            if (!user) return res.status(401).json({message: "No user found"});
            res.json({message: 'Update successful'});
        } catch (error){
            res.status(422).json({error: error});
        }
    });

    // 'evoting_api/v1/users/delete/:id' Endpoint to delete any user
    api.delete('/delete/:id', async (req, res) => {

        validateToken(req, res);

        const id = req.params.id;
        try {
            let user = await User.findByIdAndDelete(id);
            if (!user) return res.status(401).json({message: "No user found"});
            res.json({message: 'User account deleted successfully'});

        } catch (error) {
            res.status(422).json({error: error});
        }
    });

    // 'evoting_api/v1/users/verify/:id' Endpoint to verify user account
    api.put('/verify/:id', async (req, res) => {
        const id = req.params.id;
        try {
            let user = await User.findByIdAndUpdate(id, {userVerified: true});
            if (!user) return res.status(401).json({message: "No user found"});
            res.json({message: 'User verified'});
        } catch (error){
            res.status(422).json({error: error});
        }
    });

    return api;
}