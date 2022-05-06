const { verify } = require("jsonwebtoken")

function auth(req, res, next) {

    const { authorization } = req.headers

    if(!authorization)
        return res.status(401).json({Erro : "O campo 'authorization' não foi fornecido!"});
    
    const [ , token ] = authorization.split(' ');

    try {

            verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err) 
                return res.status(401).json({Erro: "O token fornecido é inválido!"})

            req.userId = decoded.id
            
        })

    } catch (error) {

        return res.status(401).json({Erro: "Houve algum problema!"})
    }

    return next()
}

module.exports = auth;