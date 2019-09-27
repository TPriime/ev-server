import { Router } from 'express';
import User from '../models/userModel';
import lga_data from '../models/lgaModel';
import Election from '../models/electionModel';

export default ({ config, db}) => {

    let api = Router();

    // '/evoting_api/v1/userelection/:id' Endpoint to get voters
    api.get('/:id', async (req, res) => {
        const id = req.params.id;
        try {
            let user = await User.findOne({cardID: id},{__v: 0});

            if (!user) return res.status(401).json({message: "No user found"});

            // Get User LGA Details
            let lgaDetails = await lga_data.findOne({LGA: user.lga});
            if (!lgaDetails) return res.status(401).json({message: "LGA not found"});

            // To get the three (3) elections
            let elections = await Election.find({
                $or: [
                    {electionCode:lgaDetails.FC},
                    {electionCode:lgaDetails.SD},
                    {electionCode:"PD/111/NIG"}
                ]
            });
            if (elections.length < 1) return res.status(401).json({message: "Elections not found!"});

            res.json(elections);
        } catch (error) {
            console.log(error);
            res.status(422).json({error: "The error"});
        }
    });


    return api;
}