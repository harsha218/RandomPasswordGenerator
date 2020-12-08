import express from 'express'
import connectDB from './config/db.js'
import router from './Routes/Router.js'
import { notFound, errorHandler } from './Middleware/ErrorMiddleware.js'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'

dotenv.config()

connectDB()

const app = express()

if (process.env.NODE_ENV === 'dev') {
    app.use(morgan('dev'))
}

app.use(express.json(), cors())

app.use('/', router);

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));