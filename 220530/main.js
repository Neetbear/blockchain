// const Web3 = require('web3');
// -> <script src="./node_modules/web3/dist/web3.min.js"></script> 로 대체

// const web3 = new Web3(Web3.givenProvider || "ws://localhost:8535");
// console.log(web3);

// const web3 = new Web3(window.ethereum);

const connectPromise = async () => {
    let web3;
    let accounts;

    if (window.ethereum) { // 메타마스크가 설치되어 있을 때
        console.log("1. connectPromise");
        web3 = new Web3(window.ethereum);
    } else if(Web3.givenProvider || "ws://localhost:8545") {
        console.log("1. connectPromise at localhost");
        web3 = new Web3("ws://localhost:8545");
    } else {
        console.log('메타마스크 설치 필요!')
    }

    if(web3) {
        console.log("2. connectPromise");
        accounts = await web3.eth.requestAccounts();
        console.log(accounts);
    }
}

connectWallet.addEventListener('click', () => {
    console.log("connectWallet clicked");
    connectPromise();
})