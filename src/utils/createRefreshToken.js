const UserModel = require('../models/userModel')
const dayjs = require('dayjs')

async function createRefreshToken (userId) {

    await UserModel.updateOne({ _id: userId },
        {
            refreshToken: {
                expiresIn: dayjs().add(14, "day").unix()
            }
        }
    )
}

module.exports = createRefreshToken;