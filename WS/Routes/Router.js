import express from 'express'
import { AddItem, GetItems, EditItem } from '../Controller/ItemController.js';
import { UserSignup, UserSignin, UpdateUser, GetProfile } from '../Controller/UserController.js'
import protect from '../Middleware/Authenticate.js'

const router = express.Router();

router.get('/getMyItems', protect, GetItems)

router.post('/addItem', protect, AddItem)

router.patch('/editItem/:id', protect, EditItem)

router.post('/userSignup', UserSignup)

router.post('/userSignin', UserSignin)

router.patch('/updateUser', protect, UpdateUser)

router.get('/getMyProfile', protect, GetProfile)

export default router