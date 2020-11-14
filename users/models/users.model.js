const mongoose = require('../../common/services/mongoose.service').mongoose
const config = require('../../common/config/env.config')
var user = config.username;
var apiKey = config.apiKey;
const cred = {
    apiKey: apiKey,
    username: user
}

const AfricasTalking = require('africastalking')(cred)

const sms = AfricasTalking.SMS

const Schema = mongoose.Schema
const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    tel: String,
    passwd: String,
    tmpPassword: String,
    permissionLevel: Number,
    otherPermissionLevel: Number,
    tel_confirmed: { type: Boolean, default: false }
});
const userDeliveryData = new Schema({
    userId: String,
    longitude: Number,
    latitude: Number,
    distance: String,
    name: String
});

userDeliveryData.virtual('id').get(function () {
    return this._id.toHexString();
})

userDeliveryData.set('toJSON', {
    virtuals: true
})

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
})

userSchema.set('toJSON', {
    virtuals: true
})

const userModel = mongoose.model('Users', userSchema)
const userDeliveryModel = mongoose.model('delivery_details', userDeliveryData)

exports.createUser = (userData) => {
    userData['tel_confirmed'] = false
    const user = new userModel(userData)
    return user.save()
}

exports.addDeliveryData = (id, deliveryData) => {
    deliveryData.userId = id;
    const delData = new userDeliveryModel(deliveryData)
    return delData.save()
}

function generateVerificationCode(mobile) {
    var randNum = Math.floor(1000 +
        Math.random() * 8000)
    var CONFIG_VERIFICATION_CODE = 'VC-' + randNum;

    var date = new Date(Date.now());

    var message = 'Your verification code for Mars Cafe is ' + CONFIG_VERIFICATION_CODE + ';\nIt is a one use code and will expire in five minutes.\nSent on ' + date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();

    // console.log('Sending message ... to ' + mobile.length == 14 ? mobile : "+256" + mobile.substring(1) + ' with code ' + CONFIG_VERIFICATION_CODE)
    return { 'success': true, "message": message, 'code': CONFIG_VERIFICATION_CODE };
}

exports.addMobileNumber = (id, mobileNumber) => {
    return new Promise((res, rej) => {
        userModel.findById(id).then(user => {
            if (user == null) return null;
            user['tel'] = mobileNumber;
            user['tel_confirmed'] = true;
            // const ver_code = generateVerificationCode(mobileNumber)
            // // console.log(ver_code)
            // if (ver_code['success'] == true) {
            // sms.send({
            //     to: mobileNumber.length == 14 ? mobileNumber : "+256" + mobileNumber.substring(1),
            //     message: ver_code['message']
            // }).then(function (response) {
            //     // console.log('Message Sent!')
            //     console.log(response)

            //     user['ver_code'] = ver_code['code']
            user.save((err, up) => {
                if (err) return rej(err)
                up = up.toJSON()
                delete up._id
                delete up.__v
                res(up)
            });
            // }).catch(function (error) {
            //     // console.log('Message send failed')
            //     console.log(error)
            //     return rej('SMS send failed.')
            // })
            // } else {
            //     return rej('SMS send failed.')
            // }
        })
    })

}

exports.getDeliveryData = (id) => {
    try {
        return userDeliveryModel.find({ userId: id }).then(result => {
            if (result == null || result.length == 0) return {}
            return userDeliveryModel.findById(result[0]._id).then(r => {
                r = r.toJSON()
                delete r._id
                delete r.__v
                return r
            })
        })
    } catch (e) {
        console.log(e)
        return {}
    }
}

exports.editDeliveryData = (id, deliveryData) => {
    return new Promise((res, rej) => {
        userDeliveryModel.find({ userId: id }).then(delivery => {
            userDeliveryModel.findById(delivery[0]._id).then(delData => {
                for (let i in deliveryData) {
                    if (deliveryData.hasOwnProperty(i)) {
                        delData[i] = deliveryData[i]
                    }
                }
                delData.save((err, upDelivery) => {
                    if (err) return rej(err)
                    upDelivery = upDelivery.toJSON()
                    delete upDelivery._id
                    delete upDelivery.__v
                    res(upDelivery)
                })
            })
        }, err => {
            if (err) rej(err)
        }).catch(err => {
            console.log(err)
            return err
        })
    })
}

exports.findById = (id) => {
    try {
        return userModel.findById(id).then(result => {
            if (result == null) return null
            result = result.toJSON()
            delete result._id
            delete result.__v
            delete result.passwd
            return result
        })
    } catch (_) {
        return null
    }
}

exports.patchUser = (id, userData) => {
    return new Promise((res, rej) => {
        userModel.findById(id, (err, user) => {
            if (err) rej(err)
            for (let i in userData) {
                if (userData.hasOwnProperty(i)) {
                    user[i] = userData[i]
                }
            }
            user.save((err, UpUser) => {
                if (err) return rej(err)
                res(UpUser)
            })
        })
    })
}

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        userModel.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, users) {
                if (err) {
                    reject(err)
                } else {
                    resolve(users)
                }
            })
    })
}

exports.removeById = (userId) => {
    return new Promise((resolve, reject) => {
        userModel.remove({ _id: userId }, (result) => {
            if (result) {
                reject(result)
                return result
            } else {
                resolve(result)
            }
        })
    })
}

exports.findByEmail = (e) => {
    return userModel.find({ email: e })
}