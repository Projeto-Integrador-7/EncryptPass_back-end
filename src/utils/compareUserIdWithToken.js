
const isUserAllowed = (reqUserId, tokenUserId) => {

    if(tokenUserId != reqUserId)
        return false
    return true
}

module.exports = isUserAllowed;