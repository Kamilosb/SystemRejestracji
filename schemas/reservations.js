const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
    country: String,
    city: String,
    street: String
})

const reservationSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { 
        type: String,
        required: true,
        match: /.+\@.+\..+/,
        unique: true
    },
    address: addressSchema,
    dateFrom: Date,
    dateTo: Date,
    roomId: String
})

module.exports = mongoose.model("reservations", reservationSchema)