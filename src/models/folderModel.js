const mongoose = require('../config/db');

const FolderSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        trype: String,
        required: false
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    }
},
{
    versionKey: false,
    timestamps: true
});

const Folder = mongoose.model("Folder", FolderSchema);
module.exports = Folder;