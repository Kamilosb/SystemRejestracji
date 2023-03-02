const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    bedCount: Number,
    peopleCount: Number,
    amenities: [ String ]
})

module.exports = mongoose.model("rooms", roomSchema)