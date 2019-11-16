import { Router } from 'express';
import Vote from '../models/votingModel';
import { validateToken } from '../middleware/accessToken';

export default ({ config, db}) => {

    let api = Router();

    // '/evoting_api/v1/votes/cast' Endpoint to cast a vote
    api.post('/cast', async (req, res) => {
        try {
            let voterID = await Vote.findById(req.body.voter);
            if(voterID) {return res.status(400).json({message: 'Voter has Voted Before!!!'})};

            let data = {
                voter: req.body.voter,
                votes: req.body.votes,
                device: req.body.device,
                voteTime: new Date(req.body.voteTime)
            }

            let votes = await Vote.create(data);

            if(votes) {
                res.json({
                    message: "Vote Counted Successfully"
                });
            }else{
                return res.status(401).json({message: 'Voting not Successful!'});
            }
        } catch (error) {
            return res.status(422).json({error: error});
        }
    });

    // '/evoting_api/v1/votes/search' Endpoint to get an Election in the database by electionCode [Auth Required]
    api.get('/search', async (req, res) => {
        // validateToken(req, res);

        let q,p, result;
        try {
            if (req.query.device) {
                q = req.query.device;
                result = await Vote.find({
                    device: {
                        $regex: new RegExp(q,'i')
                    }},{
                        __v: 0
                    });

            }else if (req.query.election && req.query.party) {
                q = req.query.election;
                p = req.query.party;
                result = await Vote.find({
                    $and: [
                        {"votes.election":{$regex: new RegExp(q,'i')}},
                        {"votes.party":{$regex: new RegExp(p,'i')}}
                    ]
                },{ __v:0, voter:0, _id:0, voteTime:0, device:0});

            }else if (req.query.election) {
                q = req.query.election;
                result = await Vote.find({"votes.election":q},{ __v:0, voter:0, _id:0, voteTime:0, device:0});
            }
            if(result.length === 0) res.status(401).json({message: "Election not found"});
            res.json(result);
        } catch (error) {
            console.log(error);
            res.status(417).json({ message: "Could not find any Election", error});
        }

    });

    // '/evoting_api/v1/votes/' Endpoint to access all Votes in the database [NO Auth Required]
    api.get('/', async (req, res) => {

        try {
            let votes = await Vote.find({},{__v:0, voteTime:0, device:0, _id:0}).populate({path: 'voter', select: ['state','lga']});

            if(votes === 0) return res.status(401).json({message: "No Vote found"});

            res.json(votes);
        } catch (error) {
            res.status(417).json({message: "Could not get the required data"});
        }
    });

    return api;
}