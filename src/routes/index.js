import express from 'express';
import config from '../config';
import middleware from '../middleware'
import initializeDb from '../db';
import user from '../controllers/userController';
import admin from '../controllers/adminController';
import election from '../controllers/electionController';
import electiongroup from '../controllers/electionGroupController';


let router = express();

// connect to db
initializeDb(db => {
    router.use(middleware({ config, db }));

    // api routes v1
    router.use('/users', user({ config, db}));
    router.use('/admins', admin({ config, db}));
    router.use('/elections', election({ config, db}));
    router.use('/electiongroup', electiongroup({ config, db}));

});

export default router;