import CryptoJs from "crypto-js";
import _ from 'lodash';
import { getPublicKeyFromWallet, getPrivateKeyFromWallet } from './wallet.js';

// 블록당 코인
const COIN_BASE_AMOUNT = 50;

let transactionPool = [];
const getTransationPool = () => {
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

let UnspentTxOuts = []; // UnspentTxOut []

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
    const txInsContent = transaction.txIns.map((txIn) => {
        // map 배열의 각 요소들을 건드릴때 사용
        (txIn.txOutId + txIn.txOutIndex).reduce((a, b) => {     
            // reduce 배열의 각 요소들을 하나의 결과값으로 만들때 사용
            a + b, ''
        })
    })
    // txOuts에 있는 내용들을 하나의 문자열로 변환
    const txOutsContent = transaction.txOuts.map((txOut) => {
        (txOut.address + txOut.amount).reduce((a, b) => {     
            a + b, ''
        })
    })
    // 위의 두 내용을 다 합해서 hash 처리
    return CryptoJs.SHA256(txInsContent + txOutsContent).toString();
}

// transaction signature
const signTxIn = (transaction, txInIndex, privateKey) => {
    const txIn = transaction.txIns[txInIndex];

    // TODO : 구현 확인 
    const signature = toHexString(privateKey, transaction.id).toDER();
    // toDER 인코딩 방식 중에 하나 
    return signature;
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

    // 2. 트랜잭션 풀에 추가 
    transactionPool.push(tx); // 원래는 검증 필요

    // 3. 주변 노드에 전파 

    return tx;
}

const createTransaction = (address, amount) => {
    /*
        1. 아직 처리되지 않았지만 트랜잭션 풀에 올라가 있는 내용을 확인
        2. 거래에 사용되지 않은 TxOuts를 구성, 트랜잭션에 필요한 코인을 확인 (balance) 
            -> 넘기는 금액은 다시 나한테 전달
            내가 보유한 TxOuts 10, 15, 20, 40 
            내가 지금 만들고 싶은 트랜잭션 코인 100 -> 총 코인이 85라 실패
            60일 경우 -> 잘짜면 20, 40 짜리 2개면 60이니까 2개로 처리 
            아닐경우 앞에서부터 85로 처리 -> 그 후 25는 다시 나에게 보내기 -> 이렇게 한다는 뜻
        3. 서명 전에 TxIns로 구성 
        4. 트랜잭션 구성
    */
    // 1
    const myAddress = getPublicKeyFromWallet();
    const myUnspentTxOuts = UnspentTxOuts.filter((uTxO) => { uTxO.address === myAddress });
    // TODO : 확인해보기 UnspentTxOuts.filter(uTxO => uTxO.address === myAddress );
    
    const filteredUnspentTxouts = filterTxPoolTxs(myUnspentTxOuts);

    // 2
    const {includeTxOuts, leftoverAmout} = findTxOutsForAmount(amount, filteredUnspentTxouts); 

    // 3
    const unsignedtxIns = includeTxOuts.map(createUnsignedTxIn);
    
    // 4
    const tx = new Transaction();
    tx.txIns = unsignedtxIns;
    tx.txOuts = createTxOuts(address, amount, leftoverAmout); // 받는 사람 주소
    tx.id = getTransactionId(tx);

    // 서명 해줘야 함 
    tx.txIns = tx.txIns.map((txIn) => {
        txIn.sign = signTxIn(tx, txIn.txOutIndex, getPrivateKeyFromWallet())
        return txIn;
    }); 

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

    for(const filteredUnspentTxout of filteredUnspentTxout) {
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
    if (!isValidateTransaction(transaction, UnspentTxOuts)) {
        throw Error('추가하려는 트랜잭션이 올바르지 않다!! : ', transaction)
    }
    // 중복되는지
    if(!isValidateTxForPool(transaction)) {
        throw Error('추가하려는 트랜잭션이 이미 풀에 있습니다!! : ', transaction)
    }

    transactionPool.push(transaction);
}

const isValidateTransaction = (transaction, UnspentTxOuts) => {
    if(getTransactionId(transaction) === transaction.id) {
        console.log('invalid transaction id : ', transaction.id);
        return false;
    }

    const totalTxInValues = transaction.txIns.map((txIn) => getTxInAmount(txIn, UnspentTxOuts)).reduce((a, b) => (a + b), 0);

    const totalTxOutValues = transaction.txOuts.map((txOut) => txOut.amount).reduce((a, b) => (a + b), 0);

    if(totalTxInValues !== totalTxOutValues) {
        console.log('totalTxInValues !== totalTxOutValues : ', transaction.id);
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
            return txIn.txOutIndex === txPoolIn.txOutIndex && txIn.txOutId === txPoolIn.txOutId;
        })
    }

    for(const txIn of transaction.txIns) {
        if(containTxIn(txIn)) {
            console.log('이미 존재하는 트랜잭션이다!! : ', transaction.id);
            return false;
        }
    } 
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
    const findTxOut = _(UnspentTxOuts).find((uTxO) => {
        return uTxO.txOutIndex === txIn.txOutIndex && uTxO.txOutId === txIn.txOutId
    })

    return findTxOut !== undefined;
}

export { sendTransaction, getTransationPool, addToTransactionPool, getCoinbaseTransaction, updateTransactionPool }