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

OrderSchema.virtual('id').get(function() {
    return this._id.toHexString()
})

OrderSchema.set('toJSON', {
    virtuals: true
})

const orderModel = mongoose.model('orders', OrderSchema)

exports.store = (userId, restaurantId, items, total) => {
    const order = {
        restaurantId: restaurantId,
        userId: userId,
        items: items,
        total: total,
        total_items: items.length,
        status: "OFD",
        ordered_on: Date.now()
    }

    const orderReturn = new orderModel(order);
    return orderReturn.save();
}

exports.findById = (id) => {
    try {
        return orderModel.findById(id).then(result => {
            if(result == null) return null
            result = result.toJSON()
            return result
        })
    } catch(_) {
        return null
    }
}

exports.findByUserId = (id) => {
    try {
        return orderModel.find({userId: id}, result => {
            if(result == null) return null
            result.toJSON()
            return result
        })
    } catch (_) {
        return null
    }
}