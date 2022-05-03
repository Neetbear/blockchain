const express = require('express');
const router = express.Router() // express express.Router 주의
const boardRouter = require('./board');

router.get('/', (req, res)=> {
    // res.send("Hello Router");
    res.render('index');
})

// boart router 따로 만들어서 관리
router.use('/board', boardRouter)

// console.log(boardRouter)

module.exports = router;