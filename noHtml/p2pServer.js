// p2p 피어 투 피어 (노드 대 노드, 개인 대 개인) 서버가 서로서로 필요한 정보를 보유
// 다른 노드와 통신을 위한 서버
// web socket 사용

import WebSocket from 'ws';
import { WebSocketServer } from 'ws';
import { getBlocks, getLatestBlock } from './block.js';

const MessageType = {
    // RESPONSE_MESSAGE : 0,
    // SENT_MESSAGE : 1,

    // 최신 블록 요청
    QUERY_LATEST : 0,
    // 모든 블록 요청
    QUERY_ALL : 1,
    // 블록 전달
    RESPONSE_BLOCKCHAIN : 2,
}

const sockets = []; 

const getPeers = () => {
    return sockets;
}

const initP2PServer = (p2pPort) => {
    const server = new WebSocketServer({port:p2pPort});

    server.on('connection', (ws, request) => {
        console.log("req " + request.headers);
        initConnection(ws);
    }) 

    console.log('listening P2PServer Port : ', p2pPort);
}

const initConnection = (ws) => {
    sockets.push(ws);
    initMessgaeHandler(ws);
}

const connectionToPeer = (newPeer) => {
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

const initMessgaeHandler = (ws) => {
    ws.on('message', (data) => {
        const message = JSON.parse(data);
        switch(message.type) {
            case MessageType.QUERY_LATEST:          // 상대의 최신 블록을 요청
                ws.send(JSON.stringify(responseLatestMessage()))
                break;
            case MessageType.QUERY_ALL:             // 연결시 상대의 모든 블록 정보를 요청
                ws.send(JSON.stringify(responseAllMessage()));
                break;
            case MessageType.RESPONSE_BLOCKCHAIN:    // 요청한 블록들 받을때
                console.log(message);
                break;
        }
    })
}

const queryLatestMessage = () => {
    return ({ 
        "type" : MessageType.QUERY_LATEST,
        "data" : null
    })
}

const queryAllMessage = () => {
    return ({ 
        "type" : MessageType.QUERY_ALL,
        "data" : null
    })
}

const responseLatestMessage = () => {
    return ({ 
        "type" : MessageType.RESPONSE_BLOCKCHAIN,
        "data" : JSON.stringify(getLatestBlock())
    })
}

const responseAllMessage = () => {
    return ({ 
        "type" : MessageType.RESPONSE_BLOCKCHAIN,
        "data" : JSON.stringify(getBlocks())
    })
}

export { initP2PServer, connectionToPeer, getPeers, queryLatestMessage, queryAllMessage }