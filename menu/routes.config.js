const MenuController = require('./controllers/menu.controller')
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware')
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware')

const VERSION = process.env.API_VERSION
exports.routeConfig = (app) => {
    app.get(VERSION + '/qeats/restaurant/:id/menu', [
        // ValidationMiddleware.validJWTNeeded,
        // PermissionMiddleware.minimumPermissionLevelRequired(process.env.PERMISSION_ALL),
        MenuController.index,
        // MenuController.getItemData
    ])
}