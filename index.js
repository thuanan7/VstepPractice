'use strict';
require('dotenv').config();
const express = require('express');
const redisStore = require('connect-redis').default;
const {createClient} = require('redis');
const session = require('express-session');
const app = express();
const port = process.env.API_PORT || 4000;
const passport = require('./back-end/controllers/passport');
const flash = require('connect-flash');
const redisClient = createClient({
    url: process.env.REDIS_URL
})
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

app.use('/api', require('./back-end/routes/rootRouter'));
app.use('/api/users', require('./back-end/routes/authRouter'));
app.use('/api/exams', require('./back-end/routes/examRouter'));

app.listen(port, () => {
    console.log(`server start at port: ${port}`);
});
