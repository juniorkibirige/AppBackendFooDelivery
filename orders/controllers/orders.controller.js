const OrderModel = require('../models/order.model')
const index = require('../../index')

exports.addOrder = (req, res) => {
    console.log(req.body)
    let userId = req.body['userId'],
        restaurantId = req.body['restaurantId'],
        items = req.body['items'],
        paid = req.body['paid'] == true
    let total = req.body['grandCost']
    OrderModel.store(userId, restaurantId, items, total, paid).then((result) => {
        if (result == null) res.status(500).send({ emsg: 'Re-check your data and Try Again!' })
        else {
            index.clis.forEach(c => c.res.write(`data: ${JSON.stringify(result)}\n\n`))
            res.status(200).send({ success: true, data: result })
        }
    })
}

exports.getById = (req, res) => {
    OrderModel.findById(req.params.orderId).then((result) => {
        let date = new Date(result['ordered_on'] != null ? result['ordered_on'] : Date.now())
        let d = date.toUTCString().split(' ');
        let l = date.toLocaleTimeString();
        let dString = [].concat(d[0]).concat(d[1]).concat(d[2]).concat(d[3]);
        result['ordered_on'] = dString.join(' ').concat(' ').concat(l);
        result['total_amount'] = result['total']
        result['preparation_time'] = result['preparation_time'] == 0 || result['preparation_time'] == null ? result['preparation_time'] : 10
        if (result == null) res.status(405).send({ emsg: 'Specified order doesn\'t exist!' })
        else res.status(200).send({
            success: true,
            data: result
        })
    })
}

exports.cancelOrder = (req, res) => {
    OrderModel.cancelOrder(req.params.orderId).then(result => {
        if (result == null) res.status(404).send({ success: false, emsg: "Order not found" })
        res.status(200).send({ success: true, data: result })
    })
}

exports.addPrepTime4Order = (req, res) => {
    const prepTime = parseInt(req.params.pTime) + 10
    const sId = req.params.orderId
    const newItems = req.body.items
    console.log(newItems)
    OrderModel.addPT(prepTime, sId, newItems).then(result => {
        if(result == null) res.status(404).send({ success: false, emsg: "Order not found" })
        res.status(200).send({ success: true, data: result })
    })
}

exports.acceptOrder = (req, res) => {
    const orderId = req.params.orderId
    OrderModel.acceptOrder(orderId).then(result => {
        if(result == null) res.status(404).send({ success: false, emsg: "Order not found" })
        res.status(200).send({ success: true, data: result })
    })
}

exports.getByUser = (req, res) => {
    OrderModel.findByUserId(req.params.userId).then(result => {
        if (result == null || result.length == 0) return res.status(404).send({ success: false, emsg: 'User has no orders!' })
        else return res.status(200).send({
            success: true,
            data: result
        })
    })
}
