import { Router } from 'express';
import User from '../models/userModel';
import Vote from '../models/votingModel';


export default ({ config, db}) => {
  let api = Router();

  // '/evoting_api/v1/voter/cid'
  api.get('/:cid', async (req, res)=> {
    const cid = req.params.cid;
    try {
      let user = await User.findOne({cardID: cid},{__v: 0});

      if (!user) {
        return res.status(404).json({message: "No user found"});
      }
      console.log(user._id);

      let voter = await Vote.findOne({voter: user._id},{__v: 0});

      if (voter) {
        res.status(404).json({});
      }else{
        res.json(user);
      }

    } catch (error) {
      res.status(422).json({error: "error at voter deatails"});
    }
  });

  return api;
}