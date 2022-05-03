const express = require('express')
const boardRouter = express.Router()
const boardController = require('./board.controller')

boardRouter.get('/list', boardController.list
    // , (req, res)=> {
    //     // res.render('board/list');
    // }
)
// MVC 컨트롤러로 미들웨어도 나눔
boardRouter.get('/view', boardController.view)
boardRouter.get('/write', boardController.write)
boardRouter.get('/update', boardController.update)

boardRouter.post('/write', boardController.writeAction)

module.exports = boardRouter;