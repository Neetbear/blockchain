// 블록체인 관련 함수
// 블록 구조 설계

/*
    index : 블록체인의높이 height
    data : 블록에 포함된 모든데이터 (트랜잭션 포함)
    timestamp : 블록이 생성된 시간
    hash : 블록 내부 데이터로 생성한 sha256 값 (블록의 유일성 보장)
    previousHash : 이전 블록의 해쉬(이전 블록을 참조한다)
*/

import random from 'random';
import CryptoJS from 'crypto-js' // 모듈이 없다고 나오면 npm install 
import _ from 'lodash';
import { getCoinbaseTransaction, getTransactionPool, updateTransactionPool, processTransaction, addToTransactionPool } from './transaction.js'
import { getPublicKeyFromWallet } from './wallet.js'

const BLOCK_GENERATION_INTERVAL = 10;              // SECOND 
const DIFFICULTY_ADJUSTMENT_INTERVAL = 10;         // generate block count

class Block {
    constructor(index, data, timestamp, hash, previousHash, difficulty, nonce)
    {
        this.index = index;
        this.data = data;
        this.timestamp = timestamp;
        this.hash = hash;
        this.previousHash = previousHash;
        this.difficulty = difficulty;
        this.nonce = nonce;
    }
}

let unspentTxOuts = processTransaction(getTransactionPool(), [], 0);
const getUnspentTxOuts = () => {
    return _.cloneDeep(unspentTxOuts);
}

const calculateHash = (index, data, timestamp, previousHash, difficulty, nonce) => {
    // return CryptoJS.SHA256(index + data + timestamp + previousHash).toString();
    return CryptoJS.SHA256((index + data + timestamp + previousHash + difficulty + nonce).toString()).toString();

    // 0 하나로 시작하는 hash값을 만드는 매개변수 (nonce)를 찾는다.
    // 0 두개로 시작하는 hash값을 만드는 매개변수를 찾는다. 난이도 오른다.
    // 16진수 64자리 
    // 16진수 1자리 -> 2진수 4자리로 / 256개의 0과 1로 표현

    // return CryptoJS.SHA256((2).toString()).toString();
}

const createGenesisBlock = () => {
    const genesisBlock = new Block(0, 'The Times 03/Jan/2009 Chancellor on brink of second bailout for banks', 0 /* new Date().getTime() / 1000 */, 0, 0, 1, 0);

    genesisBlock.hash = calculateHash(genesisBlock.index, genesisBlock.data, genesisBlock.timestamp, genesisBlock.previousHash, genesisBlock.difficulty, genesisBlock.nonce);
    genesisBlock.data = getCoinbaseTransaction(getPublicKeyFromWallet(), 1);

    // addToTransactionPool(genesisBlock.data);
    unspentTxOuts = processTransaction([genesisBlock.data], getUnspentTxOuts(), 0);

    return genesisBlock;
}

const genesisBlock = createGenesisBlock()
let blocks = [genesisBlock];

const getBlocks = () => {
    return blocks;
}

const getLatestBlock = () => {
    return blocks[blocks.length - 1];
}

const createBlock = (blockdata) => {
    const previousBlock = blocks[blocks.length - 1];
    const nextIndex = previousBlock.index + 1;
    const nextTimestamp = new Date().getTime() / 1000;
    const nextDifficulty = getDifficulty();
    const nextNonce = findNonce(nextIndex, blockdata, nextTimestamp, previousBlock.hash, nextDifficulty);
    const nextHash = calculateHash(nextIndex, blockdata, nextTimestamp, previousBlock.hash, nextDifficulty, nextNonce);
    
    const newBlock = new Block(nextIndex, blockdata, nextTimestamp, nextHash, previousBlock.hash, nextDifficulty, nextNonce);

    
    return newBlock; // 간소화
}        

const createNextBlock = () => {
    // 1. 코인베이스 트랜잭션 생성
    const coinbaseTx = getCoinbaseTransaction(getPublicKeyFromWallet(), getLatestBlock().index + 1);

    // 2. 생성된 코인베이스 트랜잭션 뒤에 현재 보유 중인 트랜잭션 풀의 내용을 포함 (마이닝된 블록의 데이터)
    const blockdata = [coinbaseTx].concat(getTransactionPool())
    return createBlock(blockdata); 
}

const addBlock = (newBlock, previousBlock) => {
    if (isValidNewBlock(newBlock, previousBlock)) {        
        blocks.push(newBlock);

        // 사용되지 않는 txOuts 셋팅
        processTransaction(newBlock.data, getUnspentTxOuts(), newBlock.index);
            

        // 트랜잭션 풀 업데이트
        updateTransactionPool(unspentTxOuts);

        return true;        
    }
    return false;
}


// 블록의 무결성 검증

/* 
    블록의 인덱스가 이전 블록인덱스보다 1 크다.
    블록의 previousHash가 이전 블록의 hash 이다.
    블록의 구조가 일치해야 한다.
*/

const isValidBlockStructure = (newBlock) => {
    if (typeof (newBlock.index) === 'number' 
     && typeof (newBlock.data) === 'object' 
     && typeof (newBlock.timestamp) === 'number' 
     && typeof (newBlock.hash) === 'string' 
     && typeof (newBlock.previousHash) === 'string' 
     && typeof (newBlock.difficulty) === 'number' 
     && typeof (newBlock.nonce) === 'number') {
        return true;
    }
    return false;
}

/* 
(typeof (newBlock.index) !== 'number' 
          || typeof (newBlock.data) !== 'string' 
          || typeof (newBlock.timestamp) !== 'number' 
          || typeof (newBlock.hash) !== 'string' 
          || typeof (newBlock.previousHash) !== 'string' ) 
*/


const isValidNewBlock = (newBlock, previousBlock) => {
    if (newBlock.index !== previousBlock.index + 1) // !== 타입까지 비교해준다.
    {
        console.log('invalid index');
        return false;
    }
    else if (newBlock.previousHash !== previousBlock.hash) 
    {
        console.log('invalid previous hash');
        return false;
    }
    else if(isValidBlockStructure(newBlock) == false) {
        console.log('invalid previous structure')
        return false;
    }

    return true;
}

// let testHash = calculateHash(10, 20, 30, 40);
// console.log(testHash);
// console.log(testHash.length);

// 문제 해결을 검사하는 함수
const hashMatchDifficulty = (hash, difficulty) => {
    const binaryHash = hexToBinary(hash);
    const requiredPrefix = '0'.repeat(difficulty);

    return binaryHash.startsWith(requiredPrefix);
}

const hexToBinary = (hex) => {
    const lookupTable = {
        '0' : '0000', '1' : '0001', '2' : '0010', '3' : '0011', 
        '4' : '0100', '5' : '0101', '6' : '0110', '7' : '0111',
        '8' : '1000', '9' : '1001', 'a' : '1010', 'b' : '1011',
        'c' : '1100', 'd' : '1101', 'e' : '1110', 'f' : '1111'
    }
    
    // 03cf
    // 0000001111001111

    let binary = '';
    for(let i =0; i < hex.length; i++)
    {
        if(lookupTable[hex[i]]) {
            binary += lookupTable[hex[i]]
        }
        else {
            console.log('invalid hex : ', hex);
            return null;
        }
    }

    return binary;
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
        // console.log(receiveBlockchain);
        if(!isValidNewBlock(receiveBlockchain[i], receiveBlockchain[i-1])) {
            console.log("체인 내의 블록 체크 중에 오류");
            return false
        };
    }

    return true;
}

const findNonce = (index, data, timestamp, previousHash, difficulty) => {
    let nonce = 0;

    while(true)
    {
        let hash = calculateHash(index, data, timestamp, previousHash, difficulty, nonce);

        if (hashMatchDifficulty(hash, difficulty)) {
            return nonce;
        }
        nonce++;
    }
    
}


// 통채로 교체가 필요가 있을때
const replaceBlockchain = (receiveBlockchain) => {
    console.log(receiveBlockchain);
    if (isValidBlockchain(receiveBlockchain))
    {
        //let blocks = getblock();
        if ((receiveBlockchain.length > blocks.length) || 
            receiveBlockchain.length == blocks.length && random.boolean())
        {
            console.log('받은 블록체인의 길이가 길거나 같아서 바꿈');
            blocks = receiveBlockchain;            
            // for(let i = 0; i < newBlocks.length - 1; i++ ){                
            //     blocks[i] = newBlocks[i];
            // }
            // 받은 블록체인이 현재 블록체인보다 더 길면 (바꿈)

            // 사용되지 않은 txOuts 셋팅
            const latestBlock = getLatestBlock();
            processTransaction(latestBlock.data, getUnspentTxOuts(), latestBlock.index);
            
            // 트랜잭션 풀 업데이트
            updateTransactionPool(unspentTxOuts);
        }
    }
    else{
        console.log('받은 블록체인에 문제가 있음');
    }
}

const getAdjustmentDifficulty = () => {
    // 현재 (만들 블록의) 시간, 마지막으로 난이도 조정된 시간 인터벌로 정의한 시간보다 적으면 난이도 낮추고 정의한 시간보다 크면 난이도를 올린다 
    const prevAdjustedBlock = blocks[blocks.length - DIFFICULTY_ADJUSTMENT_INTERVAL - 1];
    const latestBlock = getLatestBlock();
    const elapsedTime = latestBlock.timestamp - prevAdjustedBlock.timestamp;
    const expectedTime = DIFFICULTY_ADJUSTMENT_INTERVAL * BLOCK_GENERATION_INTERVAL;

    if (elapsedTime > expectedTime * 2)
    {
        // 오래걸린다 -> 난이도를 낮춘다.         
        return prevAdjustedBlock.difficulty - 1;
    }
    else if (elapsedTime < expectedTime / 2)
    {
        // 적게걸린다 -> 난이도를 높인다.         
        return prevAdjustedBlock.difficulty + 1;
    }
    else
    {
        return prevAdjustedBlock.difficulty;
    }

}

const getDifficulty = () => {
    const latestBlock = getLatestBlock();

    // 난이도 조정 주기 확인
    if (latestBlock.index % DIFFICULTY_ADJUSTMENT_INTERVAL === 0 &&
        latestBlock.index !==0 ) {
            return getAdjustmentDifficulty()
        }

    return latestBlock.difficulty;
}

export { addBlock, getBlocks, getLatestBlock, createBlock, isValidNewBlock, replaceBlockchain, getUnspentTxOuts };

// 난이도 계속 바뀌는지 시간도 적당하게 바뀌는지
// 자동으로 채굴하기 요청한번에 계속 while 