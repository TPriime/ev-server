import { Router } from 'express';
import Election from '../models/electionModel';
import { validateToken, checkPartiesUnique } from '../middleware/accessToken';

export default ({ config, db}) => {

    let api = Router();

    // '/evoting_api/v1/elections/create' Endpoint to create a new Election [Auth Required]
    api.post('/create', async (req, res) => {
        validateToken(req, res);

        try {
            let existingElection = await Election.findOne({electionCode: req.body.electionCode});
            if(existingElection) return res.status(400).json({message: 'Election with code already exist'});
            let parties = checkPartiesUnique(req.body.electionParties);

            let data = {
                electionCode: req.body.electionCode,
                electionParties: parties,
                electionName: req.body.electionName,
                electionDate: req.body.electionDate,
                electionAvailable: false
            }

            let election = await Election.create(data);

            if(election) {
                res.json({
                    message: "Election Created Successfully",
                    election
                });
            }else{
                return res.status(401).json({message: 'Election not created'});
            }
        } catch (error) {
            res.status(422).json(error);
        }
    });

    // '/evoting_api/v1/elections/search' Endpoint to get an Election in the database by electionCode [Auth Required]
    api.get('/search', async (req, res) => {
        validateToken(req, res);

        let q, result;
        try {
            if (req.query.electioncode) {
                q = req.query.electioncode;
                result = await Election.find({
                    electionCode: {
                        $regex: new RegExp(q,'i')
                    }},{
                        __v: 0
                    });
            }else if (req.query.electionname) {
                q = req.query.electionname;
                result = await Election.find({
                    electionName: {
                        $regex: new RegExp(q,'i')
                    }},{
                        __v: 0
                    });

            }else if (req.query.electionDate) {
                q = new Date(req.query.electionDate);
                result = await Election.find({electionDate: {$eq: q}},{__v: 0});

            }else if (req.query.electionname && req.query.electioncode) {
                q = req.query.electionname;
                p = req.query.electioncode;
                result = await Election.find({
                    $or: [
                        {electionName:{$regex: new RegExp(q,'i')}},
                        {electionCode:{$regex: new RegExp(p,'i')}}
                    ]
                },{
                    __v: 0
                });
            }
            if(result.length === 0) res.status(401).json({message: "Election not found"});
            res.json(result);
        } catch (error) {
            console.log(error);
            res.status(417).json({ message: "Could not find any Election", error});
        }

    });

    // '/evoting_api/v1/elections/' Endpoint to access all Elections in the database [Auth Required]
    api.get('/', async (req, res) => {
        validateToken(req, res);

        try {
            let elections = await Election.find();

            if(elections === 0) return res.status(401).json({message: "No Election found"});
            res.json(elections);
        } catch (error) {
            res.status(417).json({message: "Could not get Elections details"});
        }
    });

    // '/evoting_api/v1/elections/update/:id' Endpoint to update an election details
    api.put('/update/:id', async (req, res) => {
        validateToken(req, res);

        const id = req.params.id;
        let {electionParties,electionName,electionDate,electionAvailable} = req.body;

        electionParties = checkPartiesUnique(electionParties);

        try {
            let election = await Election.findByIdAndUpdate(id, {electionParties,electionName,electionDate,electionAvailable});
            if (!election) return res.status(401).json({message: "No election Found"});
            res.json({message: 'Election Update successful'});
        } catch (error){
            res.status(422).json({error: error});
        }
    });

    // '/evoting_api/v1/elections/delete/:id' Endpoint to delete an election from the database [Auth Required]
    api.delete('/delete/:id', async (req, res) => {
        validateToken(req, res);

        try {
            let election = await Election.findByIdAndDelete(req.params.id);

            if(election) {
                res.json({message: "Election deleted successfully"})
            }
        } catch (error) {
            res.status(401).json({message: "Election not found"});
        }
    });

    return api;
}