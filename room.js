const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    bedCount: Number,
    peopleCount: Number,
    name: String,
    description: String,
    shortDescription: String,
    image: String,
    amenities: [ String ]
})

module.exports = mongoose.model("rooms", roomSchema)