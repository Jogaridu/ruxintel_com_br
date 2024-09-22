const mongoose = require('mongoose');
const moment = require('moment-timezone');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const blockListSchema = new Schema({
    _id: { type: String, default: uuidv4 },
    phone: { type: String, required: true, unique: true },
    countReports: { type: Number, default: 0 },
    createdAt: {
        type: Date,
        default: () => moment().tz('America/Sao_Paulo').toDate()
    },
    updatedAt: {
        type: Date,
        default: () => moment().tz('America/Sao_Paulo').toDate()
    }
}, {
    timestamps: true
});

const BlockList = mongoose.model('blocklist', blockListSchema);

module.exports = BlockList;