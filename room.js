const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    bedCount: Number,
    peopleCount: Number,
    price: Number,
    amenities: [ String ]
})

module.exports = mongoose.model("rooms", roomSchema)