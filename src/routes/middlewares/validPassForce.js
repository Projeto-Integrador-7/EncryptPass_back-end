

function validPassForce(req, res, next) {

    const pass = req.body.password

    console.log(pass)

    if(!pass.match(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/)) {
        return res.status(400).json({error: "weak password"})
    }

    next()

}

module.exports = validPassForce;