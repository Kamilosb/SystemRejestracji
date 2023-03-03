const express = require('express')
const app = express()
const circularJSON = require('circular-json')
const compression = require("compression");

// łączenie się z bazą danych
const mongoose = require('mongoose')
require("dotenv").config()
mongoose.connect(process.env.DB_URL)
const Room = require('./room')
const Account = require('./account')
// zamienamy body requestu na json 
app.use(express.json())
app.use(compression())
app.listen(5000, () => {
    console.log("server is working on port 2137")
})

// TODO - logowanie i rejestracja, dodanie tutaj checków z premisjami

app.post('/', (req, res) => {
    res.send('Wszystko powinno działać :D')
})

app.post('/register', (req, res) => {
    const { login, password } = req.body
    if(!login || !password) {  
        res.send('Login oraz hasło są wymagane!')
        return
    }
    // TODO - sesje i te inne gówna
    doesLoginExist(login).then(function(result) {
        if(result) {
            res.send('Konto o takim loginie już istnieje!')
        } else {
            createAccount(login, password, res)
        }
    })
})

app.post('/login', (req, res) => {
    const { login, password } = req.body
    if(!login || !password) {  
        res.send('Login oraz hasło są wymagane!')
        console.log(req.params)
    } else {
        const request = req.body
        findAccount(request, res)
    }
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
async function doesLoginExist(login) {
    const isObject = (value) => typeof value === "object" && value !== null
    const asd = await Account.exists({"login": login})
    if(!isObject(asd)) {
        return(false)
    } else {
        return(true)
    }
}

async function findAccount(request, res) {
    const asd = await Account.exists(request)
    if(asd) {
        res.send('Logowanie pomyślne')
    } else {
        res.send('Błędne hasło lub login')
    }
}

async function createAccount(login, password, res) {
    const account = {
        "login": login,
        "password": password
    }
    await Account.create(account)
    res.status(200).send("Konto stworzone pomyślnie")
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