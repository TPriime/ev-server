import { Router } from 'express';
import Election from '../models/electionModel';
import { validateToken } from '../middleware/accessToken';

export default ({ config, db}) => {

    let api = Router();

    // '/evoting_api/v1/elections/create' Endpoint to create a new Election [Auth Required]
    api.post('/create', async (req, res) => {
        validateToken(req, res);

        try {
            let existingElection = await Election.findOne({electionCode: req.body.electionCode});
            if(existingElection) return res.status(400).json({message: 'Election with code already exist'});

            let data = {
                electionCode: req.body.electionCode,
                electionParties: [...new Set(req.body.electionParties)],
                electionName: req.body.electionName,
                electionDate: req.body.electionDate
            }

            let election = await Election.create(data);

            if(election) {
                res.json({
                    message: "Election Created Successfully",
                    election
                });
            }else{
                return res.status(401).json({message: 'Its from me'});
            }
        } catch (error) {
            res.status(422).json(error);
        }
    });


    // '/evoting_api/v1/elections/:id' Endpoint to get an Election in the database by Id [Auth Required]
     api.get('/:id', async (req, res) => {
        validateToken(req, res);

        try {
            let result = await Election.findById(req.params.id);

            if(result) {
                res.json(result);
            }
        } catch (error) {
            res.status(417).json({ message: "Could not find requested Election"});
        }
    });

    // '/evoting_api/v1/elections/search/:electionCode' Endpoint to get an Election in the database by electionCode [Auth Required]
    api.get('/search/:electionCode', async (req, res) => {
        validateToken(req, res);

        let searchParam = new RegExp(req.params.electionCode,'i');
        console.log(searchParam);

        try {
            let result = await Election.find({electionCode: searchParam});

            if(result) {
                res.json(result);
            }
        } catch (error) {
            res.status(417).json({ message: "Could not find any Election"});
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
        const {electionParties,electionName,electionDate} = req.body;

        try {
            let election = await Election.findByIdAndUpdate(id, {electionParties,electionName,electionDate});
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