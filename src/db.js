import mongoose from 'mongoose';

let mongoUrl = process.env.MONGODB_URI || "mongodb://localhost:27017/evoting";

export default callback => {
    let db = mongoose.connect(mongoUrl, {useNewUrlParser: true, useCreateIndex: true});
    callback(db);
}