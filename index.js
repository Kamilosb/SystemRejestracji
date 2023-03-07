const express = require('express')
const cors = require('cors')
const app = express()
const circularJSON = require('circular-json')
const compression = require("compression")
const cookieParser = require('cookie-parser')
const cookieAuth = require('./cookieAuth')

// łączenie się z bazą danych
const mongoose = require('mongoose')
require("dotenv").config()
mongoose.connect(process.env.DB_URL)

app.use(cors({origin: true, credentials: true}))
const Room = require('./schemas/room')
const Reservations = require('./schemas/reservations')

const userRouter = require('./routers/loginRouter')
const adminRouter = require('./routers/adminRouter')


// zamienamy body requestu na json 

app.use(express.json())
app.use(compression())
app.use(cookieParser())
const porcik = process.env.PORT
app.listen(porcik, () => {
    console.log("server is working on port " + porcik)
})

app.get('/dupa', async (req, res) => {
    res.cookie("testoweCiasteczko", "wartosc_ciasteczka_123123123", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })
    res.send('asdasdasdasd')
})

// routery bo dużo syfu było w jednym pliku
app.use('/users', userRouter)
app.use('/admin', cookieAuth.cookieAuth, adminRouter) // cookie auth by tylko zalogowani użytkownicy mieli dostęp

app.get('/rooms', async (req, res) => { // zwraca wszystkie pokoje
    await Room.find().then((allRooms) => {
        const str = circularJSON.stringify(allRooms)
        JSON.parse(str) 
        res.send(str)
    }).catch((err) => {
        console.log(err)
    })
})

app.get('/room/:id', async (req, res) => { // zwraca dany pokój po id
    const room = await Room.findById(id)
    const str = circularJSON.stringify(room)
    JSON.parse(str) 
    res.send(str)
})



app.post('/reservation', async (req, res) => { // tworzenie rezerwacji
    const request = req.body
    const checkResponse = check(request) // sprawdzamy czy frontend nie zapomniał wpisać wszystkiego
    if(checkResponse.length > 28) { // chciałem robić na zasadzie false jeśli błąd ale nie działało ¯\_(ツ)_/¯
        res.send(checkResponse)
    } else {
        const newReservation = await Reservations.create(request)
        const str = circularJSON.stringify(newReservation)
        JSON.parse(str) 
        res.status(200).send(str)
    }
})

function check(request) {
    let properSchema = []
    for(i in Reservations.schema.tree) {
        // po popbraniu schema dodawany jest w nim jakiś syf więc go odfiltrowywuje
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


