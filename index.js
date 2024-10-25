'use strict';
require('dotenv').config();
const express = require('express');
const redisStore = require('connect-redis').default;
const {createClient} = require('redis');
const swaggerUi = require('swagger-ui-express');
const session = require('express-session');
const flash = require('connect-flash');
const cors = require('cors');
//
const swaggerDocs = require('./back-end/utils/swaggerConfig');
const {errorHandler} = require('./back-end/utils/responseFormatter');
const passport = require('./back-end/controllers/passport');

const app = express();
const port = process.env.API_PORT || 4000;

const redisClient = createClient({
    url: process.env.REDIS_URL
})
app.use(cors())
app.use(express.static(__dirname + '/dist'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        store: new redisStore({client: redisClient}),
        resave: false,
        saveUninitialized: false,
        cookie: {httpOnly: true, maxAge: 20 * 60 * 1000},
    }),
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api', require('./back-end/routes/rootRouter'));
app.use('/api/users', require('./back-end/routes/authRouter'));
app.use('/api/exams', require('./back-end/routes/examRouter'));
app.use(errorHandler);
app.listen(port, () => {
    console.log(`server start at port: ${port}`);
});
