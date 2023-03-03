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
    if(request.bedCount <= 0 || request.peopleCount <= 0) {
        res.status(400).send("Liczba łóżek lub osób nie może być ujemna!")
    } else {
        const checkResponse = check(request)
        // sprawdzamy czy jest jakiś błąd, jeśli obiekt jest poprawny zwracamy true
        if(checkResponse.length > 28) {
            console.log
            res.send(checkResponse)
        } else {
            createNewRoom(request, res)
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