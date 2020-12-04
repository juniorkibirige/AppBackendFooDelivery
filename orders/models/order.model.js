const UserModel = require('../../users/models/users.model')
const mongoose = require('../../common/services/mongoose.service').mongoose
const Schema = mongoose.Schema
const OrderSchema = new Schema({
    restaurantId: String,
    userId: String,
    items: Array,
    total: Number,
    total_items: Number,
    status: String,
    paid: String,
    prepTime: Number,
    ordered_on: Date
});

OrderSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

OrderSchema.set('toJSON', {
    virtuals: true
})

const orderModel = mongoose.model('orders', OrderSchema)

exports.store = (userId, restaurantId, items, total, paid) => {
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
        paid: paid ? 'true' : 'false',
        status: paid ? "ACCEPTED" : "OFD",
        ordered_on: dString.join(' ').concat(' ').concat(l)
    }

    const orderReturn = new orderModel(order);
    return orderReturn.save();
}

exports.getAllByAdmin = async (resId, all = false) => {
    const result = await orderModel.find({ restaurantId: resId });
    let ret = [];
    result.forEach(element => {
        if (all) {
            ret.push(element);
        } else {
            let date = new Date(Date.now())
            let eDate = new Date(Date.parse(element['ordered_on']))
            if (element['status'] !== 'CANCELLED' && (eDate.toISOString().includes(date.toISOString().split('T')[0]))) {
                ret.push(element);
            }
        }
    });
    console.log(ret)
    return ret;
}

exports.findById = (id) => {
    try {
        return orderModel.findById(id).then(result => {
            if (result == null) return ['No data']
            return result
        })
    } catch (_) {
        return ['No data']
    }
}

exports.addPT = async (ptime, sId, items) => {
    try {
        var result = await orderModel.findById(sId);
        if (result == null)
            return null;
        var _items = result.items;
        // console.log(result.items)
        result.prepTime = ptime
        result.items.forEach((value, index) => {
            for (let i = 0; i < items.length; i++) {
                const element = items[i];
                if (element['_id'] == _items[index]['_id']) {
                    console.log(element['_id'] == _items[index]['_id'])
                    console.log(_items[index])
                    _items[index]['prepration_time'] = element['prepration_time']
                    break
                }
            }
        })
        result.items = _items;
        var r = await orderModel.findByIdAndUpdate(sId, result)
        // var r = await result.save()
        console.log(r)
        if (result.paid == undefined || result.paid == 'false') {
            let user = await UserModel.findById(result.userId)
            if (user == null) return null
            return user
        }
        return {}
    } catch (_) {
        console.log(_)
        return null
    }
}

exports.acceptOrder = (id) => {
    try {
        return orderModel.findById(id, async (err, result) => {
            if (result == null) return null
            result.status = "ACCEPTED"
            return result.save()
        })
    } catch (error) {

    }
}

exports.findByUserId = async (id) => {
    try {
        const resul = await orderModel.find({ userId: id }, result => {
            if (result == null)
                return null;
            result.toJSON();
            return result;
        }).sort("-ordered_on").sort("-status");
        return resul;
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
