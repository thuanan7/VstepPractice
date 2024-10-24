
'use strict';
const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
    let someHTML = "<div><p><h2>Wellcome to my server</h2></p><p><a href=\"/create-tables\">Create Database</a></p></div>"
    res.send(someHTML);
})
router.get('/create-tables', (req, res) => {
    let models = require('../../models');
    models.sequelize.sync().then(() => {
        res.send('tables created!');
    });
});


module.exports = router;
