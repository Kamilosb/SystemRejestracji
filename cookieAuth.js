const jwt = require('jsonwebtoken')

exports.cookieAuth = (req, res, next) => {
    const token = req.cookies.token
    try {
        const user = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = user
        next()
    } catch (err) {
        res.clearCookie('token')
        return res.send('token jest nie poprawny lub wygasł!')
    }
}