import CryptoJs from "crypto-js";
import _ from 'lodash';
import ecdsa from 'elliptic';

import { getPublicKeyFromWallet, getPrivateKeyFromWallet } from './wallet.js';
import { broadcastingTransactionPool } from './p2pServer.js'
import { getUnspentTxOuts } from "./block.js";

// 블록당 코인
const COIN_BASE_AMOUNT = 50;
const ec = new ecdsa.ec('secp256k1'); 

let transactionPool = [];
const getTransactionPool = () => {
    /*
        깊은 복사(Deep Copy)는 '실제 값'을 새로운 메모리 공간에 복사하는 것을 의미
        얕은 복사(Shallow Copy)는 '주소 값'을 복사한다는 의미
        얕은 복사의 경우 주소 값을 복사하기 때문에, 참조하고 있는 실제값은 같다
        현재와 같은 코드를 짜면 얕은 복사만 된다.

        깊은 복사 같은 문법은 let trans = [...transactionPool]; -> 내부의 다른 객체들은 얕은 복사됨

        lodash가 깊은 복사 관련 지원 라이브러리라 사용
    */
    return _.cloneDeep(transactionPool);
}

class UnspentTxOut {
    constructor(txOutId, txOutIndex, address, amount) {
        this.txOutId = txOutId;
        this.txOutIndex = txOutIndex;
        this.address = address;
        this.amount = amount;
    }
}

// 코인을 어디로 얼만큼 보냈는가 
class TxOut {
    constructor(address, amount) {
        this.address = address;         // string
        this.amount = amount;           // number
    }
}

// 보내진 코인을 실제로 소유했다에 대한 증거 (영지식증명용 증거 들)
class TxIn {    // txOut으로 txIn을 해석하므로 구성이 이렇다
    constructor(txOutId, txOutIndex, sign) {
        this.txOutId = txOutId;         // string
        this.txOutIndex = txOutIndex;   // number
        this.sign = sign;               // string
    }
}

class Transaction {
    constructor(id, txIns, txOuts) {
        this.id = id;                   // string
        this.txIns = txIns;             // TxIn[]
        this.txOuts = txOuts;           // TxOut[]
    }
}

// transaction id
const getTransactionId = (transaction) => {
    // txIns에 있는 내용들을 하나의 문자열로 변환
    const txInsContent = transaction.txIns.map((txIn) => 
        // map 배열의 각 요소들을 건드릴때 사용
        (txIn.txOutId + txIn.txOutIndex)).reduce((a, b) =>      
            // reduce 배열의 각 요소들을 하나의 결과값으로 만들때 사용
             a + b, ''
        )
    
    // txOuts에 있는 내용들을 하나의 문자열로 변환
    const txOutsContent = transaction.txOuts.map((txOut) => 
        (txOut.address + txOut.amount)).reduce((a, b) =>      
           a + b, ''
        )
    // 위의 두 내용을 다 합해서 hash 처리
    return CryptoJs.SHA256(txInsContent + txOutsContent).toString();
}

// transaction signature
const signTxIn = (transaction, txInIndex, privateKey) => {
    // const txIn = transaction.txIns[txInIndex];
    // TODO : txIn 예외처리
    /*  
        서명을 할 때 key 사용 
        const ec = new ecdsa.ec('secp256k1'); 이 것을 이용해서 서명에 필요한 key 추출
            -> private key를 기반으로 서명용 key 생성
            -> 받은 입장에선 받은 public key(보낸사람의 퍼블릭키)를 가지고 검증용 key를 생성 
            -> 이 key는 서명된거만 확인가능
            -> 영지식 증명 방법
    */
    const key = ec.keyFromPrivate(privateKey,"hex");
    console.log(key);

    const signature = toHexString(key.sign(transaction.id).toDER());
    // toDER 인코딩 방식 중에 하나 pem과 비슷한 인코딩 형식
    return signature;
}

// 16진수 문자열 변환 내장에 없어서 생성
const toHexString = (byteArray) => {
    // byte 값들을 문자열로 치환 
    return Array.from(byteArray, (byte) => {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
        // 0xFF 16진수 F하나에 bit 4개 
        // 0000 0000랑 &연산 한다는 뜻
        // '0' + 은 값이 작으면 한자리로 나오니까 자릿수 유지용
    }).join();
}

// coinbase transaction 
const getCoinbaseTransaction = (address, blockIndex) => {
    const tr = new Transaction();
    const txIn = new TxIn();
    txIn.sign = '';
    txIn.txOutId = '';
    txIn.txOutIndex = blockIndex;

    tr.txIns = [txIn];

    const txOut = new TxOut();
    txOut.address = address;
    txOut.amount = COIN_BASE_AMOUNT;

    tr.txOuts = [txOut];

    tr.id = getTransactionId(tr);

    return tr;
}

const sendTransaction = (address, amount) => {
    /*   
        트랜잭션이 처리되는 순간은 블록에 담길때 
        거래 자체는 많이 생길수 있는데 이 트랜잭션은 블록에 담겨야 의미가 있다 -> 수수료에 의해서 결정
        수수료가 높은 트랜잭션부터 블록에 담겨진다 
        지금은 수수료 개념없이 할 것
        트랜잭션 풀의 용도 -> 모든 트랜잭션을 담아두고 블록생성때 처리하게 보관용?
    */
    // 1. 트랜잭션 생성 
    const tx = createTransaction(address, amount);
    console.log("send : ", tx);

    // 2. 트랜잭션 풀에 추가 
    transactionPool.push(tx); // 원래는 검증 필요

    // 3. 주변 노드에 전파 
    broadcastingTransactionPool();

    return tx;
}

const createTransaction = (address, amount) => {
    // 미사용 TxOuts 에서 사용할 내용들을 추출 findTxOutsForAmount
    const unspentTxOuts = getUnspentTxOuts();
    const { includeTxOuts, leftoverAmout } = findTxOutsForAmount(amount, unspentTxOuts);

    // 서명되지 않은 txIns 구성 
    const unsigndeTxIns = includeTxOuts.map(createUnsignedTxIn);
    console.log("unsigndeTxIns : " + unsigndeTxIns);

    const tx = new Transaction();
    tx.txIns = unsigndeTxIns
    tx.txOuts = createTxOuts(address, amount, leftoverAmout); // 받는 사람 주소
    tx.id = getTransactionId(tx);
    console.log("create : ", tx)

    // 서명 
    tx.txIns = tx.txIns.map((txIn, index) => {
        txIn.sign = signTxIn(tx, index, getPrivateKeyFromWallet())
        return txIn;
    });
    console.log("sign : ", tx)

    return tx;
}

const filterTxPoolTxs = (myUnspentTxOuts) => {
    // 트랜잭션 풀에서 트랜잭션 인풋 내용만 추출 -> 아웃풋과 매칭 시켜보게 
    // 내가 서명한 것과 남이 서명한거 구분하겠다
    const txIns = _(transactionPool).map((tx) => {tx.txIns}).flatten().value();
    // _.map(transactionPool, 'txIns') 이건 뭘까?

    console.log('트랜잭션 풀 : ', transactionPool);
    console.log('트랜잭션 풀안의 Inputs : ', txIns);

    const removable = [];
    for(const UnspentTxOut of myUnspentTxOuts) {
        const findTxIn = _.find(txIns, (txIn) => {
            return txIn.txOutIndex === UnspentTxOut.txOutIndex && txIn.txOutId === UnspentTxOut.txOutId;
            // 함수형 프로그래밍 익숙해져 보자 
        })

        if(findTxIn === undefined) {
            console.log('어라? indTxIn가 undefined인데?')
        } else {
            removable.push(UnspentTxOut);
        }
    }

    return _.without(myUnspentTxOuts, ...removable);
}

const findTxOutsForAmount = (amount, filteredUnspentTxouts) => {
    let currentAmout = 0;
    const includeTxOuts = [];

    for(const filteredUnspentTxout of filteredUnspentTxouts) {
        includeTxOuts.push(filteredUnspentTxout);
        currentAmout += filteredUnspentTxout.amount;
        if(currentAmout >= amount) {
            const leftoverAmout = currentAmout - amount; // 나한테 보낼 남은 금액
            return {includeTxOuts, leftoverAmout};
        }
    }

    throw Error('보내려는 금액보다 보유 금액이 적다!!!');
}

const createUnsignedTxIn = (UnspentTxOut) => {
    const txIn = new TxIn();
    txIn.txOutId = UnspentTxOut.txOutId;
    txIn.txOutIndex = UnspentTxOut.txOutIndex;

    return txIn;
}

const createTxOuts = (address, amount, leftoverAmout) => {
    const txOut = new TxOut(address, amount);
    if (leftoverAmout > 0) {
        const leftOverTxOut = new TxOut(getPublicKeyFromWallet(), leftoverAmout); 
        return [leftOverTxOut, txOut];
    } else {
        return [txOut];
    }
}

// 올바른 트랜잭션인지 
const addToTransactionPool = (transaction) => { 
    if (!isValidateTransaction(transaction, getUnspentTxOuts())) {
        throw Error('추가하려는 트랜잭션이 올바르지 않다!! : ', transaction)
    }
    //지금으론 중복되는지 파악이 안됨 -> txIn이 필요
    console.log(transaction) 

    if(!isValidateTxForPool(transaction)) {
        throw Error('추가하려는 트랜잭션이 이미 풀에 있습니다!! : ', transaction)
    }

    transactionPool.push(transaction);
}

const isValidateTransaction = (transaction, UnspentTxOuts) => {
    // 트랜잭션의 public key -> address
    // txOutId, txOutIndex가 같은 미사용 txOuts를 찾는다 
    const isValidateIns = transaction.txIns
        .map((txIn) => isValidateTxIn(txIn, UnspentTxOuts, transaction))
        .reduce((a, b) => a && b, true ); // 전체 배열에 하나라도 false면 false가 되는 코드

    if(!isValidateIns) {
        console.log('잘못된 txIn이 포함된 트랜잭션 발견')
        return false;
    }

    return true;
}

const isValidateTxIn = (txIn, UnspentTxOuts, transaction) => {
    // 현재 참조 중인 uTxO를 찾는다 
    console.log("uTxOs : ", UnspentTxOuts);
    console.log("txIn : ", txIn);
    const referenceUTxO = UnspentTxOuts.find((uTxO) => uTxO.txOutId === txIn.txOutId && uTxO.txOutIndex === txIn.txOutIndex);
    // find는 조건에 맞는거 하나 return

    if(referenceUTxO === undefined) {
        console.log("참조 중인 uTxO 발견 실패");
        return false;
    }

    const address = referenceUTxO.address;
    const key = ec.keyFromPublic(address, "hex");
    const isValidateSign = key.verify(transaction.id, txIn.sign);

    if(!isValidateSign) {
        console.log("잘못된 서명이 들어간 txIn");
        return false;
    }
    
    return true;
}

const getTxInAmount = (txIn, UnspentTxOuts) => {
    const findUnspentTxOut = UnspentTxOuts.find((uTxO) => uTxO.txOutId === txIn.txOutId && uTxO.txOutIndex === txIn.txOutIndex)

    return findUnspentTxOut.amount;
}

const isValidateTxForPool = (transaction) => {
    // 트랜잭션 풀에 있는 txIns 들과 transaction의 txIns들을 비교해서 같은 것이 있는지 확인 
    const txPoolIns = _(transactionPool).map((tx) => tx.txIns).flatten().value();

    const containTxIn = (txIn) => {
        return _.find(txPoolIns, (txPoolIn) => {
            console.log("1 : " + txIn.txOutIndex === txPoolIn.txOutIndex && txIn.txOutId === txPoolIn.txOutId)
            return txIn.txOutIndex === txPoolIn.txOutIndex && txIn.txOutId === txPoolIn.txOutId;
        })
    }

    for(const txIn of transaction.txIns) {
        if(containTxIn(txIn)) {
            console.log('이미 존재하는 트랜잭션이다!! : ', transaction.id);
            return false;
        }
    } 
    return true;
}

const updateTransactionPool = () => {
    /*
        현재 트랜잭션 풀에 있는 트랜잭션 중에서 
        사용되지 않은 TxOuts 내용과 일치하지 않는 ( -> 이미 처리가 된 애들?)
        트랜잭션들을 제거한다 
    */
   const removable = [];
    for(const tx of transactionPool){
        for(const txIn of tx.txIns) {
            if(isInTx(txIn)) {
                
            } else {
                removable.push(tx);
                break;
            }
        }
    }

    transactionPool = _.without(transactionPool, ...removable);
}

const isInTx = (txIn) => {
    const findTxOut = _(getUnspentTxOuts()).find((uTxO) => {
        return uTxO.txOutIndex === txIn.txOutIndex && uTxO.txOutId === txIn.txOutId
    })

    return findTxOut !== undefined;
}

// processTransaction(transactions /* Transaction[] */, [] /* UnspentTxOut[] */, 0 /* blockIndex */);
const processTransaction = (transactions , unspentTxOuts , blockIndex) => {
    console.log("process : " + transactions);
    // 2. 미사용 txouts를 추출하는 과정
    // 2_1. 블록에 있는 데이터 (처리해야 할 트랜잭션 정보) 중에서 txIns로 소모된 txOuts(UnspentTxOut)를 구성
    const consumedTxOuts = transactions.map((tx) => tx.txIns) // txIns로 구성된 배열로 변경
        .reduce((a, b) => a.concat(b), [])
        .map((txIn) => new UnspentTxOut(txIn.txOutId, txIn.txOutIndex, '', 0));
    console.log("process : " + consumedTxOuts);

    // 2_2. 새로 들어온 트랜잭션 정보에서 추출한 UnspentTxOut 생성
    const newUnspentTxOuts = transactions.map((tx) => {
        return tx.txOuts.map((txOut) => new UnspentTxOut(tx.id, blockIndex, txOut.address, txOut.amount));
    })
    .reduce((a, b) => a.concat(b), []);
    console.log("process : " + consumedTxOuts);

    // 2_3. 기존 UnspentTxOut - 소모된 UnspentTxOut + newUnspentTxOuts 을 추가
    // 두 1차원 배열의 (txOutId와 txOutIndex 를 비교해서 같은 요소)를 filter 하는 코드를 만들어보자.
    const resultUnspentTxOuts = (unspentTxOuts.filter((uTxO) => !checkSameElement(consumedTxOuts, uTxO.txOutIndex, uTxO.txOutId))).concat(newUnspentTxOuts);
    console.log("process : " + resultUnspentTxOuts);

    unspentTxOuts = resultUnspentTxOuts;
    return resultUnspentTxOuts;
}

const checkSameElement = (txOuts, txOutIndex, txOutId) => {
    return txOuts.find((txOut) => txOut.txOutId === txOutId && txOut.txOutIndex === txOutIndex);
}



export { getTransactionPool, sendTransaction, addToTransactionPool, getCoinbaseTransaction, updateTransactionPool, processTransaction }