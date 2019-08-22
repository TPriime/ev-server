import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let Collection = new Schema({
    collectionCreatedBy: {
        type: Schema.Types.ObjectId,
        required: true
    },
    collectionCreatedAt: {
        type: Date,
        required: true
    },
    collectionTitle: {
        type: String,
        required: true
    },
    collectionType: {
        type: String,
        default: "public"
    },
    collectionStatus: {
        type: String,
        default: "ongoing"
    },
    collectionMembers: [
        {
            type: Schema.Types.ObjectId,
            amountPayed: {
                type: Number,
                default: 0.00
            },
            ref: "User"
        }
    ],
    collectionBankAccount: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "BankAccount"
    },
    collectionMode: {
        type: String,
        default: "fixed"
    },
    collectionBankAmount: {
        fixedAmount: {
            type: String,
            default: "nil"
        },
        Range: {
            minAmount: {
                type: String,
                default: "nil"
            },
            maxAmount: {
                type: String,
                default: "nil"
            }
        }
    },
    coltraId: {
        type: String,
        required: true
    },
    totalAmount: {
        type: String,
        default: "0.00"
    }
});

module.exports = mongoose.model('Collection', Collection);