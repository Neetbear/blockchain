// p2p 피어 투 피어 (노드 대 노드, 개인 대 개인) 서버가 서로서로 필요한 정보를 보유
// 다른 노드와 통신을 위한 서버
// web socket 사용

import WebSocket from 'ws';
import { WebSocketServer } from 'ws';

const MessageType = {
    RESPONSE_MESSAGE : 0,
    SENT_MESSAGE : 1,
    // 최신 블록 요청
    // 모든 블록 요청
    // 블록 전달
}

const sockets = []; 
// const로 선언한 배열이 가지는건 메모리 주소 push로 들어가는 값과는 별개
// 단, sockets를 재할당하는건 불가능

const getPeers = () => {
    return sockets;
}

const initP2PServer = (p2pPort) => {
    const server = new WebSocketServer({port:p2pPort});
    // WebSocket -> url까지 필요 / WebSocketServer -> port만 있으면 됨

    // websocket에서 발생할 수 있는 이벤트들은 이미 정의되어 있어서 사용하면 된다
    server.on('connection', (ws, request) => {
        const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
        console.log("req " + request.headers);
        initConnection(ws, ip); // initConnection 이건 만들어서 사용할 함수
        initMessgaeHandler(ws, ip);
    }) 

    console.log('listening P2PServer Port : ', p2pPort);
}

const initConnection = (ws, ip) => {
    console.log(ip);
    sockets.push(ws);
    initMessgaeHandler(ws, ip);
}

// 다른 사람의 정보를 가지고 접속하는 환경
const connectionToPeer = (newPeer) => {
    // console.log(newPeer);
    const ws = new WebSocket(newPeer);
    ws.on('open', () => { 
        initConnection(ws); 
        console.log('Connect peer : ', newPeer); 
        return true; 
    })
    ws.on('error', () => { 
        console.log('Fail to Connection peer : ', ws.remoteAddres); 
        return false; 
    })
}

const initMessgaeHandler = (ws, ip) => {
    ws.on('message', (data, listener) => {
        const message = JSON.parse(data);

        switch(message.type) {
            case MessageType.RESPONSE_MESSAGE:  
            // 메시지 받았을 때
                break;
            case MessageType.SENT_MESSAGE:      
            // 메시지 보낼 때 -> 받는 입장에서는 SEND_MESSAGE type일때 받음
                // write(ws, message);
                console.log("*ip* " + ip);
                console.log("*lis* " + listener);
                console.log(message.message);
                break;
        }
    })
}

const write = (ws, message) => {        // ws는 메세지 받을 사람꺼
    console.log(message);
    ws.send(JSON.stringify(message));   // JSON 형태의 message 문자열로 전달할 예정
}

const sendMessage = (message) => {
    sockets.forEach((socket) => {
        write(socket, message);
    })
}

export { initP2PServer, connectionToPeer, getPeers, sendMessage }