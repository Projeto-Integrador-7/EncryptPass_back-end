function validEmail(req, res, next) {

    const email = req.body.email

    if(!email) 
        return res.status(400).json({Erro: "O campo 'email' é obrigatório"})

    if(!email.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)) {
        return res.status(400).json({Erro: "O email inserido é inválido!"})
    }

    next()

}

module.exports = validEmail;