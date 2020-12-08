import { jwtCreate } from '../config/jwt.js'
import User from '../Models/User.js'

const UserSignup = async (req, res, next) => {
    try {
        const { name, email, phone, password } = req.body

        const existingEmail = email != null ? await User.findOne({ email }) : null
        const existingPhone = phone != null ? await User.findOne({ phone }) : null

        if (existingEmail) {
            res.status(400)
            return next(new Error('Email is already registered'))
        }
        if (existingPhone) {
            res.status(400)
            return next(new Error('Phone number is already registered'))
        }

        const user = await User.create({
            name,
            email,
            phone,
            password
        })

        if (user) {
            return res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                token: jwtCreate(user._id),
            })
        } else {
            res.status(400)
            return next(new Error('Invalid user data'))
        }
    } catch (error) {
        return next(error)
    }
}

const UserSignin = async (req, res, next) => {
    try {
        const { email, phone, password } = req.body

        let user, passwordMatch

        if (email != null) {
            user = await User.findOne({ email })
        } else if (phone != null) {
            user = await User.findOne({ phone })
        } else {
            res.status(400)
            return next(new Error('Must Provide either Email or Phone'))
        }

        if (user) {
            passwordMatch = await user.matchPassword(password)
        } else {
            res.status(404)
            return next(new Error('User Not Found'))
        }

        if (passwordMatch) {
            return res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                token: jwtCreate(user._id),
            })
        } else {
            res.status(400)
            return next(new Error('Invalid Credentials'))
        }
    } catch (error) {
        return next(error)
    }

}

const UpdateUser = async (req, res, next) => {
    try {
        const { name, email, phone, password } = req.body

        const user = await User.findById(req.user._id)

        if(email){
            const existingEmail = await User.findOne({ $and: [{email}, {_id: {$not: { $eq: user._id}}}] })
            if (existingEmail) {
                res.status(400)
                return next(new Error('Email is already registered'))
            }
        }

        if(phone){
            const existingPhone = await User.findOne({ $and: [{phone}, {_id: {$not: { $eq: user._id}}}] })
            if (existingPhone) {
                res.status(400)
                return next(new Error('Phone is already registered'))
            }
        }

        if (user) {
            user.name = name != null ? name: user.name
            user.email = email != null ? email: user.email
            user.phone = phone != null ? phone: user.phone
            user.password = password != null ? password: user.password

            const updatedUser = await user.save()

            return res.status(201).json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                token: jwtCreate(updatedUser._id),
            })
        } else {
            res.status(404)
            return next(new Error('User not found'))
        }
    } catch (error) {
        return next(error)
    }
}

const GetProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
        
        if (user) {
            return res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            })
        } else {
            res.status(404)
            return next(new Error('User not found'))
        }
    } catch (error) {
        return next(error)
    }
}

export {
    UserSignup,
    UserSignin,    //Using (Email || Phone) & Password
    UpdateUser,
    GetProfile,
}