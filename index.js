const express = require('express')
const dotenv = require('dotenv')
const apiLimit = require('./common/config/slidingWindowCounter')
dotenv.config({ path: "common/config/config.env" })
const app = express()
var bodyParser = require('body-parser')
const OrderModel = require('./orders/models/order.model')


const AuthRouter = require('./auth/routes.config')
const UserRouter = require('./users/routes.config')
const OrderRouter = require('./orders/routes.config')
const RestaurantRouter = require('./restaurant/routes.config')
const MenuRouter = require('./menu/routes.config')
const { now } = require('moment')

const CRUDHandler = async (req, res, next) => {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    }
    res.writeHead(200, headers)

    const data2Send = await OrderModel.getAllByAdmin('18471268', req.query.today == 'true' ? true : false)

    const d = JSON.stringify(data2Send)
    const clientId = req.params.client_id
    let exists = false
    clients.some((value) => {
        if (value.id === clientId) {
            exists = true
        }
    })
    if (!exists) {
        const newClient = {
            id: clientId
        }
        clients.push(newClient)
        console.log(`[${Date(now)}]: Client ${clientId} - Connected`)

        const data = `data: ${d}\n\n`;
        res.write(`retry: 10000\n\n`);
        res.write(data);

        req.on('close', () => {
            console.log(`[${Date(now)}]: Client ${clientId} - Closed Connection`)
            clients = clients.filter(c => c.id != clientId)
        })
    } else {
        res.write(`event: repeat`)
        const data = `data: ${d}\n\n`;
        res.write(data);
        res.write(`event: close`)
    }
    // }
}
// Iterate clients list and use write res object method to send new nest
function sendEventsToAll(newNest) {
    clients.forEach(c => c.res.write(`data: [${JSON.stringify(newNest)}]\n\n`))
}
// Middleware for POST /nest endpoint
async function addNest(req, res, next) {
    const newNest = req.body;
    nests.push(newNest);
    // Send recently added nest as POST result
    res.json(newNest)
    // Invoke iterate and send function
    return sendEventsToAll(newNest);
}

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Allow-Methods', 'GET, POST', 'DELETE', 'UPDATE')
    res.header('Access-Control-Allow-Expose-Headers', 'Content-Length')
    res.header('Access-Control-Allow-Headers', 'Accept, x-api-key, Content-Type, X-Requested-With, Range')

    if (req.method === 'OPTIONS') {
        res.sendStatus(200)
    } else {
        return next()
    }
})
// app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// For requests to the root of the api
app.get(process.env.API_VERSION, (req, res) => {
    res.status(200).send({ wel: ['You\'ve reached the food delivery api'] })
})
app.get('/', (req, res) => {
    res.status(200).send({ wel: ['You\'ve reached the food delivery website'] })
})

// Middleware for 
// Implementation of a way to limit api access requests for all users
// All requests below this impose on apiRequest limit
if (process.env.ENV != 'dev')
    app.use(apiLimit.limitRequests(2, 100))

// Configurations for all routes used by api
AuthRouter.routesConfig(app)
UserRouter.routesConfig(app)
OrderRouter.routeConfig(app)
RestaurantRouter.routeConfig(app)
MenuRouter.routeConfig(app)
app.post('/nest', addNest);
app.get('/admin/updates/:client_id', CRUDHandler)
app.get('/status', (req, res) => res.json({ clients: clients.length }))

app.listen(process.env.PORT, _ => {
    console.log('API Server is listening at port %s', process.env.PORT)
})

let clients = []
let nests = []
exports.clis = clients
