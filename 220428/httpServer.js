// 웹에 명령어를 입력해서 내 노드를 제어하는 서버
// 웹 -> express 명령어 해석 -> body-parser
// const express = require('express') // 통채로 다 불러옴 
// import 사용시 필요한 애만 불러옴 => 속도와 크기면에서 우세

import express from 'express'; 
import bodyParser from 'body-parser';
import { createBlock, getBlocks } from './block.js';

// 초기화 함수 
const initHttpServer = (myHttpPort) => {
    const app = express();
    app.use(bodyParser.json());

    app.get('/', (req, res) => {
        res.send("Hello, World!");
    })

    app.get('/blocks', (req, res) => {
        res.send(getBlocks());
    })

    app.post('/createblock', (req, res) => {
        res.send(createBlock(req.body.data));
    })

    app.listen(myHttpPort, () => {
        console.log('listening httpServer Port : ', myHttpPort);
    })
}

export { initHttpServer }