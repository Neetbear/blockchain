const express = require('express')
const app = express()
const router = require('./routes')
const nunjucks = require('nunjucks')

app.use(express.urlencoded({extended:true})) // request message body req.body

app.set('view engine', 'html')
nunjucks.configure('views', {
    express:app
})

// console.log(router) // 해보면 Layer로 쫙 뜸

app.use(router) 
// 라우터 여러개 사용 가능 router 에 router 사용해서 /a/b 이런식 가능


app.listen(3000, () => {
    console.log("서버 시작")
})