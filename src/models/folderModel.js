const mongoose = require('../config/db');

const FolderSchema = new mongoose.Schema({
    title: {
        type: String,
        minLength: 3,
        maxLength: 20,
        required: true,
    },
    description: {
        type: String,
        minLength: 3,
        maxLength: 40,
        required: false
    },
    userId: [{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }]
},
{
    versionKey: false,
    timestamps: true
});

const Folder = mongoose.model("Folder", FolderSchema);
module.exports = Folder;