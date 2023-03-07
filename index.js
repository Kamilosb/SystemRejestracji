const express = require('express')
const app = express()
const circularJSON = require('circular-json')
const compression = require("compression")
const cookieParser = require('cookie-parser')
const cookieAuth = require('./cookieAuth')
const cors = require('cors')
// łączenie się z bazą danych
const mongoose = require('mongoose')
require("dotenv").config()
mongoose.connect(process.env.DB_URL)
const Room = require('./room')
const userRouter = require('./loginRouter')
const adminRouter = require('./adminRouter')


// zamienamy body requestu na json 
app.use(cors())
app.use(express.json())
app.use(compression())
app.use(cookieParser())
const porcik = process.env.PORT
app.listen(porcik, () => {
    console.log("server is working on port " + porcik)
})

app.use('/users', userRouter)
app.use('/admin', cookieAuth.cookieAuth, adminRouter)
// TODO - zwracać wszystkie pokoje
app.get('/rooms', (req, res) => {
    getAllRooms(res)
})

// zwraca dany pokój po id
app.get('/room/:id', (req, res) => {
    const id = req.params.id
    findRoom(id, res)
})

async function getAllRooms(res) {
    await Room.find().then((allRooms) => {
        const str = circularJSON.stringify(allRooms)
        JSON.parse(str) 
        res.send(str)
    }).catch((err) => {
        console.log(err)
    })
}

async function findRoom(id, res) {
    const room = await Room.findById(id)
    const str = circularJSON.stringify(room)
    JSON.parse(str) 
    res.send(str)
}

