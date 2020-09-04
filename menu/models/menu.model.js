const mongoose = require('../../common/services/mongoose.service').mongoose
const Schema = mongoose.Schema
const MenuSchema = new Schema({
    restaurantId: String,
    items: Array
});

MenuSchema.virtual('id').get(function () {
    return this._id.toHexString();
})

MenuSchema.set('toJSON', {
    virtuals: true
})

const ItemSchema = new Schema({
    itemId: String,
    name: String,
    imageUrl: String,
    price: Object,
    attributes: Array
});

ItemSchema.virtual('id').get(function () {
    return this._id.toHexString();
})

ItemSchema.set('toJSON', {
    virtuals: true
})

const quantitySchema = new Schema({
    itemId: String,
    restaurantId: String,
    quantity: Number
});

quantitySchema.virtual('id').get(function () {
    return this._id.toHexString();
})

quantitySchema.set('toJSON', {
    virtuals: true
});

const MenuModel = mongoose.model('menus', MenuSchema)
const ItemModel = mongoose.model('items', ItemSchema)
const QuantitiyModel = mongoose.model('quantities', quantitySchema)

getItemData = (item, resId) => {
    item['restaurantId'] = resId
    return ItemModel.find({itemId: item['itemId']}).then(result => {
        if (result != null) {
            item['imageUrl'] = result[0]['imageUrl']
            return item
        } else {
            return item
        }
    })
}

exports.findByRestId = (id) => {
    try {
        return ItemModel.find().then(items => {
            return QuantitiyModel.find({restaurantId: id}).then(quantities => {
                return MenuModel.find({restaurantId: id}).then(result => {
                    if (result == null) return null
                    const numItems = result[0]['items'].length
                    let editted = 0
                    let resData = {}
                    resData['items'] = []
                    for (let i = 0; i < numItems; i++) {
                        let it = result[0]['items'][i]
                        it['_id'] = ''
                        it['restaurantId'] = ''
                        it['imageUrl'] = ''
                        it['total_items'] = 0
                        it['is_available'] = false
                        it['in_inventory'] = 0
                        for (const itemsKey in items) {
                            if (items.hasOwnProperty(itemsKey)) {
                                const itemData = items[itemsKey]
                                if(it['itemId'] !== itemData['itemId']) continue
                                it['_id'] = itemData['_id']
                                it['restaurantId'] = id
                                it['imageUrl'] = itemData['imageUrl']
                            }
                        }
                        for (const quantitiesKey in quantities) {
                            if (quantities.hasOwnProperty(quantitiesKey)) {
                                const quantity = quantities[quantitiesKey]
                                if(it['itemId'] !== quantity['itemId'] && id !== quantity['restaurantId']) continue
                                it['total_items'] = 0
                                it['in_inventory'] = quantity['quantity']
                                it['is_available'] = quantity['quantity'] !== 0
                            }
                        }
                        resData['items'][i] = it
                    }
                    return resData
                })
            })
        })
    } catch (_) {
        return null
    }
}