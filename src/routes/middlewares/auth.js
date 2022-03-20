const jwt = require("jsonwebtoken")

function auth(req, res, next) {

    const { authorization } = req.headers

    if(!authorization)
        return res.status(401).json({Erro : "O campo 'authorization' não foi fornecido!"});
    
    const [ _, token ] = authorization.split(' ');

    try {

        jwt.verify(token, process.env.JWT_SECRET)


    } catch (error) {

        return res.status(400).json({Erro: "O token fornceido é inválido!"})
    }

    next()
}

module.exports = auth;