const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definir o esquema do usuário
const messageSchema = new Schema({
    id: { type: String, required: true },
    body: { type: String, required: true },
    timestamp: { type: Number, required: true },
    notifyName: { type: String, required: true },
    type: { type: String, enum: ['chat', 'sticker', 'ptt', 'image', 'video'], required: true },
    duration: { type: Number },
    hasMedia: { type: Boolean, required: true },
    deviceType: { type: String, enum: ['web', 'android', 'ios'], required: true },
    score: { type: Number }
}, {
    _id: false
});

// Definir o esquema de contatos
const contactSchema = new Schema({
    phone: { type: String, required: true },
    region: { type: String, required: true },
    messages: [messageSchema]
}, {
    _id: false
});

// Definir o esquema de usuário
const userSchema = new Schema({
    id: { type: Number, required: false, unique: true },
    phone: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contacts: { type: Map, of: contactSchema },
    terms: { type: Boolean }
}, {
    timestamps: true
});


// Criar o modelo de usuário
const Usuarios = mongoose.model('usuarios', userSchema);

module.exports = Usuarios;