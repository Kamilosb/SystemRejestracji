const express = require('express')
const router = express.Router()
const Account = require('../schemas/account')
const bcrypt = require('bcrypt') 
const jwt = require('jsonwebtoken')

router.post('/register', async (req, res) => {
    const { login, password } = req.body
    if(!login || !password) {  
        res.send('Login oraz hasło są wymagane!')
        return
    }
    const isObject = (value) => typeof value === "object" && value !== null // do sprawdzania odpowiedzi z bazy danych czy login istnieje 
    const loginResponse = await Account.exists({"login": login})
    if(!isObject(loginResponse)) {
        let hashedPassword;
        try { // szyfrowanie hasła
            const salt = await bcrypt.genSalt()
            hashedPassword = await bcrypt.hash(password, salt)
        } catch {
            res.status(500).send
        }
        const account = {
            "login": login,
            "password": hashedPassword
        }
        await Account.create(account) // dodawanie konta do bazy
        res.status(200).send("Konto stworzone pomyślnie")
    } else {
        res.send('Konto o takim loginie już istnieje!')
    }
})

router.post('/login', async (req, res) => {
    const { login, password } = req.body
    if(!login || !password) {  
        res.send('Login oraz hasło są wymagane!')
    } else {
        const userAccount = await Account.findOne({ login: login })
        if(userAccount === null) {
            return res.send('Błędne hasło lub login')   
        } 
        try {
            if(await bcrypt.compare(password, userAccount.password)) {
                const token = await jwt.sign(login, process.env.TOKEN_SECRET)
                // res.cookie("token", token, {
                //     secure: true,
                //     sameSite: "none"
                // })
                res.status(200).json({
                    token: token
                })
            } else {
                return res.send('Błędne hasło lub login') 
            }
        } catch(err) {
            console.log(err)
        }
    }
})


module.exports = router