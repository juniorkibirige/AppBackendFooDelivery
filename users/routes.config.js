const UsersController = require('./controllers/users.controller')
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware')
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware')
 
const ADMIN = process.env.PERMISSION_ADMIN
const RIDER = process.env.PERMISSION_RIDER
const USER = process.env.PERMISSION_USER
const ALL = process.env.PERMISSION_ALL
const VERSION = process.env.API_VERSION

exports.routesConfig = (app) => {
    app.get(VERSION + '/users/list', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        UsersController.list
    ])

    app.get(VERSION + '/users/:userId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(ALL),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        UsersController.getById
    ])

    app.post(VERSION + '/users/:userId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(ALL),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        UsersController.patchById
    ])

    app.post(VERSION + '/users', [
        UsersController.insert
    ])

    app.post(VERSION + '/user/:email', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        UsersController.getByEmail
    ])

    app.post(VERSION + '/user/:userId/tel', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        UsersController.addTelNumber
    ])

    app.get(VERSION + '/user/:userId/delDetails', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(ALL),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        UsersController.getDeliveryData
    ])

    app.post(VERSION + '/user/:userId/delDetails', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(ALL),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        UsersController.addDeliveryData
    ])
}