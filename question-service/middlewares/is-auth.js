const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) { 
        return res.sendStatus(401)
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {

        if (err) {
            console.log(err)
            return res.status(403).json({ message: err })
        }

        req.user = user

        next()
    })
}