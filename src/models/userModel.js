const moongose = require('../config/db')
const bcrypt = require('bcrypt')
const res = require('express/lib/response')

const UserSchema = new moongose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    passwordReminder: {
        type: Boolean,
        required: true,
    },
    passwordReminderTip: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: false
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