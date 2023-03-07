const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    bedCount: Number,
    peopleCount: Number,
    name: String,
    description: String,
    shortDescription: String,
    image: String,
    amenities: [ String ],
    price: Number
})

module.exports = mongoose.model("rooms", roomSchema)