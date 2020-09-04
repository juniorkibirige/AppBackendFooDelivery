const OrderModel = require('../models/order.model')

exports.addOrder = (req, res) => {
    let userId = res.body['userId'],
        restaurantId = res.body['restaurantId'],
        items = res.body['items']
    let total = 0
    for (let i= 0; i < items.length; i++) {
        total += items[i]['price'] * items[i]['total_items']
    }
    OrderModel.store(userId, restaurantId, items, total).then((result) => {
        if(result == null) res.status(500).send({emsg: 'Re-check your data and Try Again!'})
        else res.status(200).send({success: true, msg: 'Order sent!'})
    })
}

exports.getById = (req, res) => {
    OrderModel.findById(req.params.orderId).then((result) => {

        let date = new Date(Date.now())
        result['ordered_on'] = date.toDateString();
        result['total_amount'] = result['total']
        result['preparation_time'] = 10
        console.log(result)
        if(result == null) res.status(405).send({emsg: 'Specified order doesn\'t exist!' })
        else res.status(200).send({
            success: true,
            data: result
        })
    })
}

exports.cancelOrder = (req, res) => {
}

exports.getByUser = (req, res) => {
    OrderModel.findByUserId(req.params.userId).then(result=>{
        if(result == null || result.length == 0) return res.status(404).send({success: false, emsg: 'User has no orders!' })
        else return res.status(200).send({
            success: true,
            data: result
        })
    })
}