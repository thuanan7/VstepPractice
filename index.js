'use strict'
require('dotenv').config()
const express = require('express')
const swaggerUi = require('swagger-ui-express')
const cors = require('cors')
const session = require('express-session')
const RedisStore = require('connect-redis').default
const passport = require('./back-end/configs/passport')
const redisClient = require('./back-end/configs/redisClient')
//
const swaggerDocs = require('./back-end/utils/swaggerConfig')
const { errorHandler } = require('./back-end/utils/responseFormatter')

const app = express()
const port = process.env.API_PORT || 4000

app.use(cors())
app.use(express.static(__dirname + '/dist'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.REDIS_URL,
    resave: false,
    saveUninitialized: false,
  }),
)

app.use(express.json())
app.use(passport.initialize())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use('/api', require('./back-end/routes/rootRouter'))
app.use('/api/users', require('./back-end/routes/authRouter'))
app.use('/api/exams', require('./back-end/routes/examRouter'))
app.use('/api/ai', require('./back-end/routes/openAIRouter'))
app.use(errorHandler)
app.listen(port, () => {
  console.log(`server start at port: ${port}`)
})
