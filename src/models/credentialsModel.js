const mongoose = require('../config/db')
const crypto = require("crypto-js")

const CredentialsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true,
    },
    login: {
        type: String,
        required: true
    },
    folderId: {
        type: mongoose.Types.ObjectId,
        required: false,
        ref: 'Folder'
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    versionKey: false,
    timestamps: true
})

CredentialsSchema.pre('save', function (next) {

    const encryptedPass = crypto.AES.encrypt(this.password, process.env.ENCRYPT_SECRET).toString()

    this.password = encryptedPass;

    next();
})

CredentialsSchema.pre('updateOne', function (next) {

    const encryptedPass = crypto.AES.encrypt(this._update.password, process.env.ENCRYPT_SECRET).toString()

    this._update.password = encryptedPass;

    next();
})

const Credentials = mongoose.model("Credentials", CredentialsSchema)

module.exports = Credentials