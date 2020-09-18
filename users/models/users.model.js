const mongoose = require('../../common/services/mongoose.service').mongoose
const Schema = mongoose.Schema
const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    passwd: String,
    tmpPassword: String,
    permissionLevel: Number,
    otherPermissionLevel: Number
});
const userDeliveryData = new Schema({
    userId: String,
    longitude: Number,
    latitude: Number,
    distance: String
});

userDeliveryData.virtual('id').get(function (){
    return this._id.toHexString();
})

userDeliveryData.set('toJSON', {
    virtuals: true
})

userSchema.virtual('id').get(function(){
    return this._id.toHexString();
})

userSchema.set('toJSON', {
    virtuals: true
})

const userModel = mongoose.model('Users', userSchema)
const userDeliveryModel = mongoose.model('delivery_details', userDeliveryData)

exports.createUser = (userData) => {
    const user = new userModel(userData)
    return user.save()
}

exports.addDeliveryData = (id, deliveryData) => {
    deliveryData.userId = id;
    const delData = new userDeliveryModel(deliveryData)
    return delData.save()
}

exports.getDeliveryData = (id) => {
    try {
        return userDeliveryModel.find({userId: id}).then(result => {
            if(result == null) return {}
            return userDeliveryModel.findById(result[0]._id).then(r=> {
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
        userDeliveryModel.find({userId: id}).then(delivery => {
            userDeliveryModel.findById(delivery[0]._id).then(delData => {
                for (let i in deliveryData) {
                    if(deliveryData.hasOwnProperty(i)) {
                        delData[i] = deliveryData[i]
                    }
                }
                delData.save((err, upDelivery) => {
                    if(err) return rej(err)
                    upDelivery = upDelivery.toJSON()
                    delete upDelivery._id
                    delete upDelivery.__v
                    res(upDelivery)
                })
            })
        }, err => {
            if(err) rej(err)
        }).catch(err=> {
            console.log(err)
            return err
        })
    })
}

exports.findById = (id) => {
    try {
        return userModel.findById(id).then(result => {
            if(result == null) return null
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
            if(err) rej(err)
            for (let i in userData) {
                if(userData.hasOwnProperty(i)) {
                    user[i] = userData[i]
                }
            }
            user.save((err, UpUser) => {
                if(err) return rej(err)
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
        userModel.remove({ _id: userId}, (result) => {
            if(result) {
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