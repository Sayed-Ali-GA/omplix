const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }]

}, { timestamps: true })

const User = mongoose.model('User', userSchema)
module.exports = User
