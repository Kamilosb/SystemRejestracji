const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({
    login: String,
    password: String
})

module.exports = mongoose.model("accounts", accountSchema)