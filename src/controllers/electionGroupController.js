import { Router } from 'express';
import ElectionGroup from '..//models/electionGroupModel';
import { validateToken } from '../middleware/accessToken';

export default ({ config, db}) => {

    let api = Router();

    // '/evoting_api/v1/electiongroup/create' Endpoint to create a new Election [Auth Required]
    api.post('/create', async (req, res) => {
        validateToken(req, res);

        try {
            let existingGroup = await ElectionGroup.findOne({groupName: req.body.groupName});
            if(existingGroup) return res.status(400).json({message: 'Election Group already exist'});

            let data = {
                groupName: req.body.groupName,
                groupDescription: req.body.groupDescription
            }

            let electionGroup = await ElectionGroup.create(data);

            if(electionGroup) {
                res.json({
                    message: "Election Group Created Successfully",
                    electionGroup
                });
            }else{
                return res.status(401).json({message: 'Election Group not created'});
            }
        } catch (error) {
            res.status(422).json(error);
        }
    });

    // '/evoting_api/v1/electiongroup/search' Endpoint to get an Election in the database by electionCode [Auth Required]
    api.get('/search', async (req, res) => {
        validateToken(req, res);

        try {
            let q = req.query.groupName;
            let result = await ElectionGroup.find({
                groupName: {
                    $regex: new RegExp(q,'i')
                }},{
                    __v: 0
                });

            if(result.length === 0) res.status(401).json({message: "Election Group not found"});
            res.json(result);
        } catch (error) {
            res.status(417).json({ message: "Could not find any the Group"});
        }

    });

    // '/evoting_api/v1/electiongroup/' Endpoint to access all Elections in the database [Auth Required]
    api.get('/', async (req, res) => {
        validateToken(req, res);

        try {
            let electiongroups = await ElectionGroup.find();

            if(electiongroups === 0) return res.status(401).json({message: "No Election Group found"});
            res.json(electiongroups);
        } catch (error) {
            res.status(417).json({message: "Could not get Elections groups"});
        }
    });

    // '/evoting_api/v1/electiongroup/update/:id' Endpoint to update an election details
    api.put('/update/:id', async (req, res) => {
        validateToken(req, res);

        const id = req.params.id;
        let {groupName,groupDescription} = req.body;

        try {
            let electiongroups = await ElectionGroup.findByIdAndUpdate(id, {groupName,groupDescription});
            if (!electiongroups) return res.status(401).json({message: "No election group found"});
            res.json({message: 'Election Group Update successful'});
        } catch (error){
            res.status(422).json({error: error});
        }
    });

    // '/evoting_api/v1/electiongroup/delete/:id' Endpoint to delete an election from the database [Auth Required]
    api.delete('/delete/:id', async (req, res) => {
        validateToken(req, res);

        try {
            let electiongroups = await ElectionGroup.findByIdAndDelete(req.params.id);

            if(electiongroups) {
                res.json({message: "Election Group deleted successfully"})
            }
        } catch (error) {
            res.status(401).json({message: "Election Group not found"});
        }
    });

    return api;
}