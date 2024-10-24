'use strict';
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.API_PORT || 4000;
app.use('/', require('./back-end/routes/rootRouter'));
app.use('/exams', require('./back-end/routes/examRouter'));
app.listen(port, () => {
    console.log(`server start at port: ${port}`);
});
