// p2p 피어 투 피어 (노드 대 노드, 개인 대 개인) 서버가 서로서로 필요한 정보를 보유
// 다른 노드와 통신을 위한 서버
// web socket 사용

import WebSocket from 'ws';
import { WebSocketServer } from 'ws';

const sockets = []; 
// const로 선언한 배열이 가지는건 메모리 주소 push로 들어가는 값과는 별개
// 단, sockets를 재할당하는건 불가능

const initP2PServer = (p2pPort) => {
    const server = new WebSocketServer({port:p2pPort});
    // WebSocket -> url까지 필요 / WebSocketServer -> port만 있으면 됨

    // websocket에서 발생할 수 있는 이벤트들은 이미 정의되어 있어서 사용하면 된다
    server.on('connection', (ws) => {
        initConnection(ws); // initConnection 이건 만들어서 사용할 함수
    }) 
    console.log('listening P2PServer Port : ', p2pPort);
}

const initConnection = (ws) => {
    sockets.push(ws);
}

export { initP2PServer }