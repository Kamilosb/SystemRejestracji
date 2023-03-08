const jwt = require('jsonwebtoken')

exports.cookieAuth = (req, res, next) => {
    // console.log(req.headers)
    try {
        const token = req.headers.authorization.split(" ")[1];
        const user = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = user
        next()
    } catch (err) {
        res.clearCookie('token')
        return res.send('token jest nie poprawny lub wygasł!')
    }
}