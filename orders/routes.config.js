const OrderController = require('./controllers/orders.controller')
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware')
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware')

const VERSION = process.env.API_VERSION

exports.routeConfig = (app) => {
    app.get(VERSION + '/qeats/orders/:userId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        OrderController.getByUser
    ])

    app.post(VERSION + '/qeats/orders', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(process.env.PERMISSION_ALL),
        OrderController.addOrder
    ])

    app.patch(VERSION + '/qeats/:userId/order/:orderId/cancel-order', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        OrderController.cancelOrder
    ])

    app.get(VERSION + '/qeats/:userId/order/:orderId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        OrderController.getById
    ])
}