# lesson 6
## web3.js
### Web3.js가 뭔가요?
이더리움 네트워크는 노드로 구성되어 있고, 각 노드는 블록체인의 복사본을 가지고 있다
스마트 컨트랙트의 함수를 실행하고자 한다면, 이 노드들 중 하나에 질의를 보내 아래 내용을 전달해야한다
1. 스마트 컨트랙트의 주소
2. 실행하고자 하는 함수, 그리고
3. 그 함수에 전달하고자 하는 변수들

이더리움 노드들은 JSON-RPC라고 불리는 언어로만 소통할 수 있다
```
// 그래... 이런 방법으로 모든 함수 호출을 잘 작성할 수 있길 빌겠네!
// 오른쪽으로 스크롤하게 ==>
{"jsonrpc":"2.0","method":"eth_sendTransaction","params":[{"from":"0xb60e8dd61c5d32be8058bb8eb970870f07233155","to":"0xd46e8dd67c5d32be8058bb8eb970870f07244567","gas":"0x76c0","gasPrice":"0x9184e72a000","value":"0x9184e72a","data":"0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675"}],"id":1}
```
web3.js를 사용하면 위의 질의문을 작성할 필요 없이, 자네의 코드에서 함수를 호출하는 것은 다음과 같다
```
CryptoZombies.methods.createRandomZombie("Vitalik Nakamoto 🤔").send({ from: "0xb60e8dd61c5d32be8058bb8eb970870f07233155", gas: "3000000" })
```
```
// NPM을 사용할 때
npm install web3

// Yarn을 사용할 때
yarn add web3

// Bower를 사용할 때
bower install web3

// ...기타 등등.
```
```
<script language="javascript" type="text/javascript" src="web3.min.js"></script>
```

## Web3 프로바이더(Provider)
### Infura
Infura는 빠른 읽기를 위한 캐시 계층을 포함하는 다수의 이더리움 노드를 운영하는 서비스
접근을 위한 API를 무료로 사용할 수 있다
Infura를 프로바이더로 사용하면, 이더리움을 설치하고 계속 유지할 필요 없이 이더리움 블록체인과 메세지를 확실히 주고받을 수 있다
```
var web3 = new Web3(new Web3.providers.WebsocketProvider("wss://mainnet.infura.io/ws"));
```
### 메타마스크(Metamask)
메타마스크는 사용자들이 이더리움 계정과 개인 키를 안전하게 관리할 수 있게 해주는 크롬과 파이어폭스의 브라우저 확장 프로그램
해당 계정들을 써서 Web3.js를 사용하는 웹사이트들과 상호작용을 할 수 있도록 해준다
### 메타마스크의 Web3 프로바이더 사용하기
```
window.addEventListener('load', function() {

  // Web3가 브라우저에 주입되었는지 확인(Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Mist/MetaMask의 프로바이더 사용
    web3js = new Web3(web3.currentProvider);
  } else {
    // 사용자가 Metamask를 설치하지 않은 경우에 대해 처리
    // 사용자들에게 Metamask를 설치하라는 등의 메세지를 보여줄 것
  }

  // 이제 자네 앱을 시작하고 web3에 자유롭게 접근할 수 있네:
  startApp()

})
```

## 컨트랙트와 대화하기
### 컨트랙트 주소
스마트 컨트랙트를 모두 작성한 후, 컴파일한 후 이더리움에 배포할 것