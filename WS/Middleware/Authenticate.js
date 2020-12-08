import { jwtVerify } from '../config/jwt.js'
import User from '../Models/User.js'

const auth = async (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]

            const decoded = jwtVerify(token)

            req.user = await User.findById(decoded.id).select('-password')
            next()
        } catch (error) {
            console.error(error)
            res.status(401)
            next(new Error('Not authorized, token failed'))
        }
    }

    if (!token) {
        res.status(401)
        next(new Error('Not authorized, no token'))
    }
}

export default auth