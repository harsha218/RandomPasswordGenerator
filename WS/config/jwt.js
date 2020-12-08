import jwt from 'jsonwebtoken'

const jwtCreate = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '10d',
    })
}

const jwtVerify = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET)
}

export {
    jwtCreate,
    jwtVerify,
}