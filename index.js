const express = require('express')
const dotenv = require('dotenv')
const apiLimit = require('./common/config/slidingWindowCounter')
dotenv.config({ path: "common/config/config.env" })
const app = express()
var bodyParser = require('body-parser')

const AuthRouter = require('./auth/routes.config')
const UserRouter = require('./users/routes.config')
const OrderRouter = require('./orders/routes.config')
const RestaurantRouter = require('./restaurant/routes.config')
const MenuRouter = require('./menu/routes.config')

app.use( (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Allow-Methods', 'GET, POST', 'DELETE', 'UPDATE')
    res.header('Access-Control-Allow-Expose-Headers', 'Content-Length')
    res.header('Access-Control-Allow-Headers', 'Accept, x-api-key, Content-Type, X-Requested-With, Range')

    if(req.method === 'OPTIONS') {
        res.sendStatus(200)
    } else {
        return next()
    }
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// For requests to the root of the api
app.get(process.env.API_VERSION, (req, res) => {
    res.status(200).send({wel: ['You\'ve reached the food delivery api']})
})
app.get('/', (req, res) => {
    res.status(200).send({wel: ['You\'ve reached the food delivery website']})
})
app.get('/api/hours', (req, res) => {
    res.status(200).send([{"name":"Kojo Yeboah","hours":90,"country":"Ghana","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700848/Top-learner.png"},{"name":"Sam George","hours":97,"country":"Nigeria","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700848/Top-learner.png"},{"name":"Kojo Asante","hours":115,"country":"Kenya","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700848/Top-learner.png"},{"name":"Eric Yenge","hours":106,"country":"Tanzania","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700848/Top-learner.png"},{"name":"Kojo Yeboah","hours":92,"country":"Ghana","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700848/Top-learner.png"},{"name":"Sam George","hours":75,"country":"Nigeria","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700848/Top-learner.png"},{"name":"Kojo Asante","hours":75,"country":"Kenya","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700848/Top-learner.png"},{"name":"Eric Yenge","hours":60,"country":"Tanzania","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700848/Top-learner.png"},{"name":"Kojo Yeboah","hours":67,"country":"Ghana","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700848/Top-learner.png"},{"name":"Sam George","hours":72,"country":"Nigeria","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700848/Top-learner.png"},{"name":"Kojo Asante","hours":116,"country":"Kenya","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700848/Top-learner.png"},{"name":"Eric Yenge","hours":89,"country":"Tanzania","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700848/Top-learner.png"},{"name":"Kojo Yeboah","hours":85,"country":"Ghana","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700848/Top-learner.png"},{"name":"Sam George","hours":59,"country":"Nigeria","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700848/Top-learner.png"},{"name":"Kojo Asante","hours":67,"country":"Kenya","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700848/Top-learner.png"},{"name":"Eric Yenge","hours":102,"country":"Tanzania","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700848/Top-learner.png"},{"name":"Kojo Yeboah","hours":119,"country":"Ghana","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700848/Top-learner.png"},{"name":"Sam George","hours":60,"country":"Nigeria","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700848/Top-learner.png"},{"name":"Sam George","hours":101,"country":"Nigeria","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700848/Top-learner.png"},{"name":"Kojo Asante","hours":107,"country":"Kenya","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700848/Top-learner.png"}])
})
app.get('/api/skilliq', (req, res) => {
    res.status(200).send([{"name":"Perry Oluwatobi","score":170,"country":"Nigeria","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700835/skill-IQ-trimmed.png"},{"name":"Perry Oluwatobi","score":229,"country":"Nigeria","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700835/skill-IQ-trimmed.png"},{"name":"Perry Oluwatobi","score":236,"country":"Nigeria","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700835/skill-IQ-trimmed.png"},{"name":"Perry Oluwatobi","score":280,"country":"Nigeria","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700835/skill-IQ-trimmed.png"},{"name":"Perry Oluwatobi","score":166,"country":"Nigeria","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700835/skill-IQ-trimmed.png"},{"name":"Perry Oluwatobi","score":299,"country":"Nigeria","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700835/skill-IQ-trimmed.png"},{"name":"Perry Oluwatobi","score":166,"country":"Nigeria","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700835/skill-IQ-trimmed.png"},{"name":"Perry Oluwatobi","score":208,"country":"Nigeria","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700835/skill-IQ-trimmed.png"},{"name":"Perry Oluwatobi","score":238,"country":"Nigeria","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700835/skill-IQ-trimmed.png"},{"name":"Perry Oluwatobi","score":179,"country":"Nigeria","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700835/skill-IQ-trimmed.png"},{"name":"Perry Oluwatobi","score":236,"country":"Nigeria","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700835/skill-IQ-trimmed.png"},{"name":"Perry Oluwatobi","score":221,"country":"Nigeria","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700835/skill-IQ-trimmed.png"},{"name":"Perry Oluwatobi","score":175,"country":"Nigeria","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700835/skill-IQ-trimmed.png"},{"name":"Perry Oluwatobi","score":170,"country":"Nigeria","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700835/skill-IQ-trimmed.png"},{"name":"Perry Oluwatobi","score":179,"country":"Nigeria","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700835/skill-IQ-trimmed.png"},{"name":"Perry Oluwatobi","score":223,"country":"Nigeria","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700835/skill-IQ-trimmed.png"},{"name":"Perry Oluwatobi","score":258,"country":"Nigeria","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700835/skill-IQ-trimmed.png"},{"name":"Perry Sam","score":161,"country":"South Africa","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700835/skill-IQ-trimmed.png"},{"name":"Perry Zimo","score":221,"country":"Tanzania","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700835/skill-IQ-trimmed.png"},{"name":"Paul Chenge","score":158,"country":"Zimbabwe","badgeUrl":"https://res.cloudinary.com/mikeattara/image/upload/v1596700835/skill-IQ-trimmed.png"}])
})

// Implementation of a way to limit api access requests for all users
// All requests below this impose on apiRequest limit
if(process.env.ENV != 'dev')
    app.use(apiLimit.limitRequests(2, 100))

// Configurations for all routes used by api
AuthRouter.routesConfig(app)
UserRouter.routesConfig(app)
OrderRouter.routeConfig(app)
RestaurantRouter.routeConfig(app)
MenuRouter.routeConfig(app)

app.listen(process.env.PORT, _ => {
    console.log('API Server is listening at port %s', process.env.PORT)
})
