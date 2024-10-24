'use strict';
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.API_PORT || 4000;
app.use('/', require('./back-end/routes/rootRouter'));
app.use((error, req, res) => {
    console.error(error);
    res.status(500).render('error', {message: 'Internal Server Error!'});
});
app.listen(port, () => {
    console.log(`server start at port: ${port}`);
});
