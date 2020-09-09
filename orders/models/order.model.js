const { Mongoose, mongo } = require("mongoose");

const mongoose = require('../../common/services/mongoose.service').mongoose
const Schema = mongoose.Schema
const OrderSchema = new Schema({
    restaurantId: String,
    userId: String,
    items: Array,
    total: Number,
    total_items: Number,
    status: String,
    ordered_on: Date
});

OrderSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

OrderSchema.set('toJSON', {
    virtuals: true
})

const orderModel = mongoose.model('orders', OrderSchema)

exports.store = (userId, restaurantId, items, total) => {
    let date = new Date(Date.now())
    let d = date.toUTCString().split(' ');
    let l = date.toLocaleTimeString();
    let dString = [].concat(d[0]).concat(d[1]).concat(d[2]).concat(d[3]);
    const order = {
        restaurantId: restaurantId,
        userId: userId,
        items: items,
        total: total,
        total_items: items.length,
        status: "OFD",
        ordered_on: dString.join(' ').concat(' ').concat(l)
    }

    const orderReturn = new orderModel(order);
    return orderReturn.save();
}

exports.findById = (id) => {
    try {
        return orderModel.findById(id).then(result => {
            if (result == null) return null
            result = result.toJSON()
            return result
        })
    } catch (_) {
        return null
    }
}

exports.findByUserId = (id) => {
    try {
        return orderModel.find({ userId: id }, result => {
            if (result == null) return null
            result.toJSON()
            return result
        }).sort("-ordered_on").sort("-status").then(resul => {
            return resul
        })
    } catch (_) {
        return null
    }
}

exports.cancelOrder = (id) => {
    try {
        return new Promise((res, rej) => {
            orderModel.findById(id, (err, order) => {
                if (err) rej(err)
                for (const key in order) {
                    const element = order[key];
                    if (key == "status") {
                        order[key] = "CANCELLED"
                    }
                }
                order.save((err, update) => {
                    if (err) return rej(err)
                    res(update)
                })
            })
        })
    } catch (error) {
        return null
    }
}