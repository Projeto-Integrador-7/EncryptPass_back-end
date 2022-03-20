const moongose = require('../config/db')
const bcrypt = require('bcrypt')

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
    }
}, 
{
    versionKey: false
})

UserSchema.pre('save', async function(next) {

    const encryptedPass = await bcrypt.hash(this.password, 10);
    this.password = encryptedPass;

    next();
})

const User = moongose.model("User", UserSchema)

module.exports = User;