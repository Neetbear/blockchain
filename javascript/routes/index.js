const express = require('express');
const router = express()

router.get('/', (req, res)=> {
    // res.send("Hello Router");
    res.render('index');
})

module.exports = router;