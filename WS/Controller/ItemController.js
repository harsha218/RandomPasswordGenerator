import Item from '../Models/Item.js'

const GetItems = async (req, res, next) => {
    try {
        const items = await Item.find({ author: req.user._id })

        if (items.length) {
            return res.status(201).json(items)
        } else {
            res.status(404)
            return next(new Error('No Items Found'))
        }
    } catch (error) {
        return next(error)
    }
}

const AddItem = async (req, res, next) => {
    try {
        const { name, url, type, comment } = req.body

        const author = req.user._id

        const exisitngItem = await Item.findOne({ $and: [{ name }, { author }] })

        if (exisitngItem) {
            res.status(400)
            return next(new Error('Duplicate Name'))
        }

        const item = await Item.create({
            author,
            name,
            url,
            type,
            comment
        })

        if (item) {
            return res.status(201).json({
                _id: item._id,
                author: item.author,
                name: item.name,
                url: item.url,
                type: item.type,
                comment: item.comment
            })
        } else {
            res.status(400)
            return next(new Error('Invalid input data'))
        }
    } catch (error) {
        return next(error)
    }
}

const EditItem = async (req, res, next) => {
    try {
        const {name, url, type, comment} = req.body
        const item = await Item.findById(req.params.id)

        if (item.author != req.user._id) {
            res.status(400)
            return next(new Error('Not Authorized'))
        }

        if(name){
            const existingName = await Item.findOne({ $and: [{author: item.author}, {name}, {_id: {$not: { $eq: item._id}}}] })
            if (existingName) {
                res.status(400)
                return next(new Error('This name is already been used by the same author'))
            }
        }

        if (item) {
            item.name = name != null ? name: item.name
            item.url = url != null ? url: item.url
            item.type = type != null ? type: item.type
            item.comment = comment != null ? comment: item.comment

            const updatedItem = await item.save()

            return res.status(201).json({
                _id: updatedItem._id,
                author: updatedItem.author,
                name: updatedItem.name,
                url: updatedItem.url,
                type: updatedItem.type,
                comment: updatedItem.comment
            })
        } else {
            res.status(400)
            return next(new Error('Invalid input data'))
        }
    } catch (error) {
        return next(error)
    }
}

export {
    GetItems,
    AddItem,
    EditItem,
}