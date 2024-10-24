'use strict';
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.API_PORT || 4000;
app.use('/', require('./routes/rootRouter'));
app.use('/exams', require('./routes/examRouter'));
app.listen(port, () => {
    console.log(`server start at port: ${port}`);
});
