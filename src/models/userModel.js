const moongose = require('../config/db')
const { hash } = require('bcrypt')
const { default: mongoose } = require('mongoose')

const RefreshToken = new mongoose.Schema({

    expiresIn: {
        type: Number,
        required: true
    }

})

const UserSchema = new moongose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        select: false
    },
    passwordReminder: {
        type: Boolean,
        required: true,
    },
    passwordReminderTip: {
        type: String,
        required: false
    },
    phoneNumber: {
        type: String,
        required: false,
        trim: true
    },
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordRefreshToken: {
        type: Date,
        select: false
    },
    expirePassword: {
        type: Date,
        default: Date.now(30)
    },
    refreshToken: {
        type: RefreshToken,
        required: false
    }
}, 
{
    versionKey: false,
    timestamps: true
})

UserSchema.pre('save', async function(next) {

    const encryptedPass = await hash(this.password, 10);
    this.password = encryptedPass;

    return next();
})

UserSchema.pre('updateOne', async function (next) {

    if(this._update.password) {
        const encryptedPass = await hash(this._update.password, 10);
        this._update.password = encryptedPass;
    }

    return next();
})

UserSchema.pre('resetExpirePassword', async function(next) {
    if(this.reset.password) {
        const encryptedPass = await hash(this.reset.password, 10);
        this.reset.password = encryptedPass;
    }
    return next();
})

const User = moongose.model("User", UserSchema)

module.exports = User;