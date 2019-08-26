import mongoose from 'mongoose';

let mongoUrl = "mongodb://localhost:27017/evoting" ||  process.env.MONGODB_URI;

export default callback => {
    let db = mongoose.connect(mongoUrl, {useNewUrlParser: true, useCreateIndex: true});
    callback(db);
}