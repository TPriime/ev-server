import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let BankAccount = new Schema({
    belongsTo: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    bankName: {
        type: String,
        required: true,
    },
    bankAccountName: {
        type: String,
        required: true
    },
    bankAccountNumber: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('BankAccount', BankAccount);