import express from 'express';
import config from '../config';
import middleware from '../middleware'
import initializeDb from '../db';
import collection from '../controllers/collectionController';
import user from '../controllers/userController';
import admin from '../controllers/adminController';
import bankAccount from '../controllers/bankAccountController';


let router = express();

// connect to db
initializeDb(db => {
    router.use(middleware({ config, db }));

    // api routes v1
    router.use('/collection', collection({ config, db }));  // Routes for Creating, Reading, Updating and Deleting a Collection
    router.use('/users', user({ config, db}));
    router.use('/admins', admin({ config, db}));
    router.use('/bankAccount', bankAccount({ config, db}));

});

export default router;