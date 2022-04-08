function validPassForce(req, res, next) {

    const pass = req.body.password

    if(!pass.match(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/)) {
        return res.status(400).json({Erro: "A senha inserida é fraca!"})
    }

    next()

}

module.exports = validPassForce;