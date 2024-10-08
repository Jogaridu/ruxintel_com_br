const mongoose = require('mongoose');
const moment = require('moment-timezone');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    id: { type: String, required: true },
    body: { type: String, required: true },
    timestamp: { type: Number, required: true },
    notifyName: { type: String, required: true },
    type: { type: String, enum: ['chat', 'sticker', 'ptt', 'image', 'video'], required: true },
    duration: { type: Number },
    hasMedia: { type: Boolean, required: true },
    deviceType: { type: String, enum: ['web', 'android', 'ios'], required: true },
    score: { type: Number },
    ignored: { type: Boolean, required: false, default: false },
    phone_number: { type: String, required: true },
}, {
    _id: false
});

const contactSchema = new Schema({
    phone: { type: String, required: true },
    region: { type: String, required: true },
    messages: [messageSchema]
}, {
    _id: false
});

const userSchema = new Schema({
    phone: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tokenQrcode: { type: String, required: false },
    contacts: { type: Map, of: contactSchema },
    terms: { type: Boolean },
    statusInstance: { type: Boolean, required: false },
    messagesCritical: [messageSchema],
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

const Usuarios = mongoose.model('usuarios', userSchema);

module.exports = Usuarios;