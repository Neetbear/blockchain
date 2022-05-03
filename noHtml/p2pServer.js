// p2p 피어 투 피어 (노드 대 노드, 개인 대 개인) 서버가 서로서로 필요한 정보를 보유
// 다른 노드와 통신을 위한 서버
// web socket 사용

import random from 'random';
import WebSocket from 'ws';
import { WebSocketServer } from 'ws';
import { getBlocks, getLatestBlock, addBlock, createBlock, isValidNewBlock, blocks } from './block.js';

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

    write(ws, queryAllMessage());
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
            case MessageType.QUERY_LATEST:          
                // 최신 블록을 요청 받았을 때
                ws.send(JSON.stringify(responseLatestMessage()))
                break;
            case MessageType.QUERY_ALL:             
                // 모든 블록 정보를 요청 받았을 때
                // ws.send(JSON.stringify(responseAllMessage()));
                write(ws, responseAllMessage());
                break;
            case MessageType.RESPONSE_BLOCKCHAIN:    
                // 요청한 블록들 받을때
                console.log(ws._socket.remoteAddress, ' : ', message.data);
                // handleBlockchainResponse(message.data);
                replaceBlockchain(message.data);
                break;
        }
    })
}

// 올바른 블록 데이터를 받았나 판별
const isValidBlockchain = (receiveBlockchain) => {
    // 같은 제네시스 블록인가? 
    console.log("test1 ", receiveBlockchain[0]);
    console.log("test2 ", getBlocks()[0]);
    console.log("test3 ", JSON.stringify(receiveBlockchain[0]) ==  JSON.stringify(getBlocks()[0]));

    if(JSON.stringify(receiveBlockchain[0]) !==  JSON.stringify(getBlocks()[0])) {
        console.log("제네시스 블록이 다름");
        return false
    };

    // 체인 내의 모든 블록을 확인
    for(let i = 1; i < receiveBlockchain.length; i++) {
        console.log(receiveBlockchain);
        if(!isValidNewBlock(receiveBlockchain[i], receiveBlockchain[i-1])) {
            console.log("체인 내의 블록 체크 중에 오류");
            return false
        };
    }

    return true;
}

// 블록 교체 함수
const replaceBlockchain = (receiveBlockchain) => {
    receiveBlockchain = JSON.parse(receiveBlockchain);
    if(isValidBlockchain(receiveBlockchain)) {
        // let blocks = getBlocks();
        if(receiveBlockchain.length > getBlocks().length) {
            console.log("받은 블록체인의 길이가 길다")
            for (let i = 0; i < receiveBlockchain.length - 1; i++) {
                blocks[i] = receiveBlockchain[i];
            }
            // blocks = JSON.parse(receiveBlockchain);
        } else if(receiveBlockchain.length == getBlocks().length && random.boolean()) {
            // random.boolean() 랜덤으로 true or false
            console.log("받은 블록체인의 길이가 같고 교체한다")
            blocks = receiveBlockchain;
        }
    } else {
        console.log("받은 블록체인에 문제가 있음");
    }
}

const handleBlockchainResponse = (receiveBlockchain) => {
    // 받은 블록체인보다 현재 블록체인이 더 길면 -> 안 바꿈

    // 같으면 -> 바꾸거나 안 바꿈 (랜덤성(의외성)에 의의를 둔다, 상태 케어 용)
    
    // 받은 블록체인이 현재 블록체인보다 더 길면 -> 바꾼다

}

const queryLatestMessage = () => { 
    // 다른 노드에 최신 블록 요청 메시지 보내기
    return ({ 
        "type" : MessageType.QUERY_LATEST,
        "data" : null
    })
}

const queryAllMessage = () => { 
    // 다른 노드에 모든 블록 요청 메시지 보내기
    return ({ 
        "type" : MessageType.QUERY_ALL,
        "data" : null
    })
}

const responseLatestMessage = () => { 
    // 최신 블록 요청에 대한 응답
    return ({ 
        "type" : MessageType.RESPONSE_BLOCKCHAIN,
        "data" : JSON.stringify(getLatestBlock())
    })
}

const responseAllMessage = () => { 
    // 모든 블록 요청에 대한 응답
    return ({ 
        "type" : MessageType.RESPONSE_BLOCKCHAIN,
        "data" : JSON.stringify(getBlocks())
    })
}

const write = (ws, message) => {
    console.log(message);
    ws.send(JSON.stringify(message)); 
}

// send 원장
const broadcasting = (message) => {
    sockets.forEach((socket) => {
        write(socket, message);
    })
}

// 내가 새로운 블록을 채굴했을 때 연결된 노드들에게 전파
const mineBlock = (blockData) => {
    const newBlock = createBlock(blockData);
    if(addBlock(newBlock, getLatestBlock())) {
        broadcasting(responseLatestMessage());
    }
}

export { initP2PServer, connectionToPeer, getPeers, mineBlock, broadcasting }