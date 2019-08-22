import { Router } from 'express';
import Collection from '../models/collectionModel';
import User from '../models/userModel';
import { hashPassword } from '../middleware/passwordMiddleware';
import { doesEmailExist } from '../middleware/validators/emailValidator';
import { sendVerificationMail } from '../middleware/verificationMail';
import { setToken, verifyToken } from '../middleware/accessToken';
import { generateCollectionId } from '../middleware/generateCollectionId'

export default ({ config, db}) => {

    let api = Router();

    // '/coltra_api/v1/collection/create' Endpoint to create a new collection [Auth Required]
    api.post('/create', async (req, res) => {
        let accessToken = req.body.token || req.query.token || req.headers['x-access-token'];

        if(!accessToken) return res.status(407).json({ message: "No token provided" });

        let isTokenValid = verifyToken(accessToken);
        
        if(isTokenValid === false) return res.status(407).json({ message: "Failed to verify token"});

        try {
            let collections = await Collection.find();
            
            let coltraId = await generateCollectionId(collections);
            
            let data = {
                collectionTitle: req.body.collectionTitle,
                collectionCreatedBy: req.body.collectionCreatedBy,
                collectionCreatedAt: new Date(),
                collectionType: req.body.collectionType,
                collectionBankAccount: req.body.collectionBankAccount,
                collectionMode: req.body.collectionMode,
                collectionAmount: {
                    fixedAmount: req.body.collectionAmount.fixedAmount,
                    range: {
                        minAmount: req.body.collectionAmount.range.minAmount,
                        maxAmount: req.body.collectionAmount.range.maxAmount
                    }
                },
                coltraId: coltraId
            }

            let newCollection = await Collection.create(data);
        
            if(newCollection) {
                let result =  await User.findById(newCollection.collectionCreatedBy);

                if(result) {
                    result.userCollections.push(newCollection._id);
                    result.save();
                    res.json(newCollection);
                }
            }
        } catch (error) {
            res.status(422).json(error);
        }
    });


    // '/coltra_api/v1/collection/' Endpoint to get all collections in the database [Auth Required]
     api.get('/', async (req, res) => {

        let accessToken = req.body.token || req.query.token || req.headers['x-access-token'];

        if(!accessToken) return res.status(407).json({ message: "No token provided" });

        let isTokenValid = verifyToken(accessToken);

        // console.log(isTokenValid);
        
        if(isTokenValid === false) return res.status(407).json({ message: "Failed to verify token"});

        try {
            let result = await Collection.find();
            

            if(result) {
                res.json(result);
            }
        } catch (error) {
            res.status(417).json({ message: "Could not return collections"});
        }
    });

    // '/coltra_api/v1/collection/:id' Endpoint to access a collection in the database by database id[Auth Required]
    api.get('/:id', async (req, res) => {
        let accessToken = req.body.token || req.query.token || req.headers['x-access-token'];

        if(!accessToken) return res.status(407).json({ message: "No token provided" });

        let isTokenValid = verifyToken(accessToken);
        
        if(isTokenValid === false) return res.status(407).json({ message: "Failed to verify token"});

        try {
            let result = await Collection.findById(req.params.id);

            if(result) {
                res.json(result);
            }
        } catch (error) {
            res.status(417).json({message: "Could not get collection details"});
        }
    });

    // '/coltra_api/v1/collection/coltraId/:coltraId' Endpoint to access a collection in the database by collectionId[Auth Required]
    api.get('/coltraId/:coltraId', async (req, res) => {
        let accessToken = req.body.token || req.query.token || req.headers['x-access-token'];

        if(!accessToken) return res.status(407).json({ message: "No token provided" });

        let isTokenValid = verifyToken(accessToken);
        
        if(isTokenValid === false) return res.status(407).json({ message: "Failed to verify token"});

        try {
            let collection =  await Collection.find({coltraId: req.params.coltraId});
            
            if(collection) {
                res.json(collection);
            }
        } catch (error) {
            res.status(417).json(error);
        }
    })

    // '/coltra_api/v1/collection/:id' Endpoint to access a collection in the database by collectionId[Auth Required]
    api.put('/:id', async (req, res) => {
        let accessToken = req.body.token || req.query.token || req.headers['x-access-token'];

        if(!accessToken) return res.status(407).json({ message: "No token provided" });

        let isTokenValid = verifyToken(accessToken);
        
        if(isTokenValid === false) return res.status(407).json({ message: "Failed to verify token"});

        try {
            let collection =  await Collection.findByIdAndUpdate(req.params.id, req.body)

            if(collection) {
                res.json({message: "Collection Updated Successfully"})
            }
        } catch (error) {
            res.status(417).json(error);
        }
    });

    return api;
}