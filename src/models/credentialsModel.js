const mongoose = require('../config/db')


const CredentialsSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true,
        trim: true
    },
    url : {
        type: String,
        required: false
    },
    password : {
        type: String,
        required: true,
    },
    login : {
        type: String,
        required: true
    },
    folderId : {
        type: mongoose.Types.ObjectId,
        required: false
    },
    userId : {
        type: mongoose.Types.ObjectId,
        required: true
    }
}, {
    versionKey: false,
    timestamps: true
})

CredentialsSchema.pre('save', async function(next) {

    const encryptedPass = await bcrypt.hash(this.password, 10);
    this.password = encryptedPass;

    next();
})

const Credentials = mongoose.model("Credentials", CredentialsSchema)

module.exports = Credentials