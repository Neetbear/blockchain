// board.controller.js -> .js만 확장자 명

const items = [];

const list = (req, res)=> {
    // res.send("Hello Router");
    res.render('board/list');
}

const view = (req, res)=> {
    console.log(req.query);
    const {index} = req.query;
    console.log(index);

    res.render('board/view', {
        item:items[index-1]
    });
}

const write = (req, res)=> {
    res.render('board/write');
}

const update = (req, res)=> {
    res.render('board/update'); // render views 폴더 기준
}

const writeAction = (req, res) => {
    // render 없으면 응답 한없이 기다려서 무한 로딩
    console.log(req.body.subject, req.body.content);
    // db 저장
    const {subject, content} = req.body
    const obj = { subject, content}
    items.push(obj)
    // redirect -> post는 페이지 이동용이 아니니까
    res.redirect(`/board/view?index=${items.length}`) // url 기준
}

module.exports = {
    list, // list:list
    view, write, update,
    writeAction
}