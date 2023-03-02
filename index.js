const express = require('express')
const app = express()
const circularJSON = require('circular-json')

// łączenie się z bazą danych
const mongoose = require('mongoose')
require("dotenv").config()
mongoose.connect(process.env.DB_URL)
const Room = require('./room')

// zamienamy body requestu na json 
app.use(express.json())

app.listen(2137, () => {
    console.log("server is working on http://localhost:2137/")
})

// TODO - logowanie i rejestracja, dodanie tutaj checków z premisjami



// TODO - zwracać wszystkie pokoje
app.get('/rooms', (req, res) => {
    const dbResponse = Room.find()
        console.log(dbResponse)
        res.send(dbResponse)
})

// zwraca dany pokój po id
app.get('/room/:id', (req, res) => {
    const id = req.params.id
    findRoom(id, res)
})

// tworzy nowy pokój, po poprawne body patrz readme
app.post('/create', (req, res) => {
    const request = req.body
    if(!request.bedCount || !request.peopleCount || request.bedCount <= 0 || request.peopleCount <= 0) {
        res.status(400).send("Brakuje wymaganych danych w requeście! (lub są błędne)")
    } else {
        createNewRoom(request, res)
    }
})

async function findRoom(id, res) {
    const room = await Room.findById(id)
    const str = circularJSON.stringify(room)
    JSON.parse(str) 
    res.send(str)
}

async function createNewRoom(request, res) {
    const newRoom = await Room.create(request)
    const str = circularJSON.stringify(newRoom)
    JSON.parse(str) 
    res.status(200).send(str)
}