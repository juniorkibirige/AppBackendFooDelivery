const UserModel = require('../models/users.model')
const crypto = require('crypto')

exports.insert = (req, res) => {
    UserModel.findByEmail(req.body.email).then((result) => {
        if (result.length == 0) {
            let salt = crypto.randomBytes(32).toString('base64')
            let hash = crypto.createHmac('sha512', salt)
                .update(req.body.passwd)
                .digest('base64')
            let concat = Buffer.from(process.env.HASH_CONCAT, 'utf-8').toString('base64')
            req.body.passwd = salt + concat + hash
            req.body.permissionLevel = process.env.PERMISSION_USER
            req.body.otherPermissionLevel = process.env.PERMISSION_ALL
            UserModel.createUser(req.body)
                .then((result) => {
                    res.status(201).send({res: result, success: true})
                })
        } else {
            res.status(409).send({emsg: "User already exists"})
        }
    })
}

exports.getById = (req, res) => {
    UserModel.findById(req.params.userId).then((result) => {
        if (result == null) res.status(405).send({emsg: 'Specified user doesn\'t exist!'})
        else res.status(200).send({success: true, data: result})
    })
}

exports.getDeliveryData = (req, res) => {
    try {
        UserModel.getDeliveryData(req.params.userId).then((result) => {
            if (result.length === 0) res.status(404).send({success: false})
            else res.status(200).send({success: true, data: result})
        })
    } catch (e) {
        res.status(404).send({success: false})
    }
}

exports.addDeliveryData = (req, res) => {
    UserModel.getDeliveryData(req.params.userId).then(result => {
        if (Object.keys(result).length === 0) {
            UserModel.addDeliveryData(req.params.userId, req.body).then(result => {
                res.status(200).send({success: true, msg: "Delivery Details Added", data: result})
            }, err => {
                res.status(200).send({success: false, msg: "Error occurred"})
            })
        } else {
            UserModel.editDeliveryData(req.params.userId, req.body).then(result => {
                res.status(200).send({success: true, msg: "Updated Delivery Details", data: result})
            }, err => {
                res.status(200).send({success: false, msg: err})
            }).catch(rej => {
                res.status(200).send({success: false, msg: rej})
            })
        }
    })
}

exports.addTelNumber = (req, res) => {
    UserModel.addMobileNumber(req.params.userId, req.body.mobile).then(result => {
        res.status(202).send({success: true, msg: 'Mobile Number Added', data: result})
    }, err=>{
        res.status(404).send({success: false, msg: err})
    }).catch(rej => {
        res.status(404).send({success: false, msg: rej})
    })
}

exports.getByEmail = (req, res) => {
    UserModel.findByEmail(req.params.email).then(result => {
        if (result.length == 0) res.status(200).send({success: false});
        else res.status(201);
    })
}

exports.patchById = (req, res) => {
    if (req.body.password) {
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
        req.body.password = salt + "$" + hash;
    }
    UserModel.patchUser(req.params.userId, req.body)
        .then(result => {
            res.status(204).send({})
        })
}

exports.removeById = (req, res) => {
    UserModel.removeById(req.params.userId)
        .then(result => {
            res.status(204).send(result)
        }).catch(err => {
        console.log(err)
        res.status(404).send({errors: 'Specified user does\'nt exist!'})
    })
}

exports.list = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ?
        parseInt(req.query.limit) : 10
    let page = 0
    if (req.page) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page)
            page = Number.isInteger(req.query.page) ? req.query.page : 0
        }
    }
    UserModel.list(limit, page).then(result => {
        res.status(200).send(result)
    })
}