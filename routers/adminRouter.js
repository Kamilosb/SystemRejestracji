const express = require('express')
const router = express.Router()
const Room = require('../schemas/room')
const Reservations = require('../schemas/reservations')
const circularJSON = require('circular-json')

router.post('/create', async (req, res) => { // dodawanie pokoju
    const request = req.body
    if(request.bedCount <= 0 || request.peopleCount <= 0) {
        res.status(400).send("Liczba łóżek i/lub osób nie może być ujemna!")
    } else {
        const checkResponse = check(request) // sprawdzamy czy frontend nie zapomniał wpisać wszystkiego
        if(checkResponse.length > 28) { // chciałem robić na zasadzie false jeśli błąd ale nie działało ¯\_(ツ)_/¯
            res.send(checkResponse)
        } else {
            const newRoom = await Room.create(request)
            const str = circularJSON.stringify(newRoom)
            JSON.parse(str) 
            res.status(200).send(str)
        }
    }
})

function check(request) {
    let properSchema = []
    for(i in Room.schema.tree) {
        // po braniu schema dodawane jest w nim jakiś syf więc go odfiltrowywuje
        if(i == '_id' || i == '__v' || i == 'id') {
        } else {
            properSchema.push(i)
        } 
    }
    let errorString = "W twoim objekcie brakuje: \n"
    // porównuje poprawny schemat z requestem by upewnić sie że mamy wszystko co wymagane
    for(i in properSchema) {
        if(request[`${properSchema[i]}`] == void 0) {
            errorString += `${properSchema[i]} \n `
        }
    }
    return errorString    
}

router.get('/reservations', async (req, res) => { // zwraca wszystkie rezerwacje
    await Reservations.find().then((allReservations) => {
        const str = circularJSON.stringify(allReservations)
        JSON.parse(str) 
        res.send(str)
    }).catch((err) => {
        console.log(err)
    })
})

module.exports = router