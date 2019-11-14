import { Router } from 'express';
import Device from '../models/deviceModel';
import { validateToken } from '../middleware/accessToken';

export default ({ config, db}) => {

    let api = Router();

    // '/evoting_api/v1/devices/create' Endpoint to create a new Device [Auth Required]
    api.post('/create', async (req, res) => {
        validateToken(req, res);

        try {
            let existingDevice = await Device.findOne({deviceName: req.body.deviceName});
            if(existingDevice) return res.status(400).json({message: 'Device already exist'});

            let data = {
              deviceName: req.body.deviceName,
              releaseDate: req.body.releaseDate,
              currentLocation: req.body.currentLocation || '',
              status: req.body.status
            }

            let device = await Device.create(data);

            if(device) {
                res.json({
                    message: "Device Created Successfully",
                    device
                });
            }else{
                return res.status(401).json({message: 'Device not created'});
            }
        } catch (error) {
            res.status(422).json(error);
        }
    });

    // '/evoting_api/v1/devices/search' Endpoint to get an Election in the database by electionCode [Auth Required]
    api.get('/search', async (req, res) => {
        validateToken(req, res);

        try {
            let q, result;
            if(req.query.deviceName){
                q = req.query.deviceName;
                result = await Device.find({
                    deviceName: {
                        $regex: new RegExp(q,'i')
                    }},{
                        __v: 0
                    }
                );
            }else if(req.query.status){
                q = req.query.status;
                result = await Device.find({status: q},{__v: 0});
            }else if(req.query.id){
                q = req.query.id;
                result = await Device.find({_id: q},{__v: 0});
            }

            if(result.length === 0) res.status(401).json({message: "Device not found"});
            res.json(result);
        } catch (error) {
            res.status(417).json({ message: "Could not find the device"});
        }

    });

    // '/evoting_api/v1/devices/' Endpoint to access all Elections in the database [Auth Required]
    api.get('/', async (req, res) => {
        validateToken(req, res);

        try {
            let device = await Device.find();

            if(device === 0) return res.status(401).json({message: "No Device found"});
            res.json(device);
        } catch (error) {
            res.status(417).json({message: "Could not get any Device"});
        }
    });

    // '/evoting_api/v1/devices/update/:id' Endpoint to update an election details
    api.put('/update/:id', async (req, res) => {
        validateToken(req, res);

        const id = req.params.id;
        let {currentLocation,status} = req.body;

        try {
            let device = await Device.findByIdAndUpdate(id, {currentLocation,status});
            if (!device) return res.status(401).json({message: "No Device found"});
            res.json({message: 'Device Update successful'});
        } catch (error){
            res.status(422).json({error: error});
        }
    });

    // '/evoting_api/v1/devices/delete/:id' Endpoint to delete an election from the database [Auth Required]
    api.delete('/delete/:id', async (req, res) => {
        validateToken(req, res);

        try {
            let device = await Device.findByIdAndDelete(req.params.id);

            if(device) {
                res.json({message: "Device deleted successfully"})
            }
        } catch (error) {
            res.status(401).json({message: "Device not found"});
        }
    });

    return api;
}