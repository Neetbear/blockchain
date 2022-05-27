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
```javascript
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
```javascript
<script language="javascript" type="text/javascript" src="web3.min.js"></script>
```

## Web3 프로바이더(Provider)
### Infura
Infura는 빠른 읽기를 위한 캐시 계층을 포함하는 다수의 이더리움 노드를 운영하는 서비스
접근을 위한 API를 무료로 사용할 수 있다
Infura를 프로바이더로 사용하면, 이더리움을 설치하고 계속 유지할 필요 없이 이더리움 블록체인과 메세지를 확실히 주고받을 수 있다
```javascript
var web3 = new Web3(new Web3.providers.WebsocketProvider("wss://mainnet.infura.io/ws"));
```
### 메타마스크(Metamask)
메타마스크는 사용자들이 이더리움 계정과 개인 키를 안전하게 관리할 수 있게 해주는 크롬과 파이어폭스의 브라우저 확장 프로그램
해당 계정들을 써서 Web3.js를 사용하는 웹사이트들과 상호작용을 할 수 있도록 해준다
### 메타마스크의 Web3 프로바이더 사용하기
```javascript
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
Web3.js는 스마트 컨트랙트와 통신을 위해 2가지를 필요로 한다 : 컨트랙트의 _주소_와 ABI
### 컨트랙트 주소
스마트 컨트랙트를 모두 작성한 후, 컴파일한 후 이더리움에 배포할 것
컨트랙트를 배포한 후, 해당 컨트랙트는 영원히 존재하는, 이더리움 상에서 고정된 주소를 얻을 것
스마트 컨트랙트와 통신을 하기 위해 배포 후 이 주소를 복사해야 할 것
### 컨트랙트 ABI
컨트랙트의 ABI(Application Binary Interface)
JSON 형태로 자네 컨트랙트의 메소드를 표현하는 것
컨트랙트가 이해할 수 있도록 Web3.js가 어떤 형태로 함수 호출을 해야 하는지 알려주는 것
이더리움에 배포하기 위해 컨트랙트를 컴파일할 때 솔리디티 컴파일러가 ABI를 줄 것
### Web3.js 컨트랙트 인스턴스화하기
```javascript
// myContract 인스턴스화
var myContract = new web3js.eth.Contract(myABI, myContractAddress);
```

## 컨트랙트 함수 호출하기
### Call
call은 view와 pure 함수를 위해 사용
로컬 노드에서만 실행하고, 블록체인에 트랜잭션을 만들지 않는다
```javascript
myContract.methods.myMethod(123).call()
```
### Send
send는 트랜잭션을 만들고 블록체인 상의 데이터를 변경
view와 pure가 아닌 모든 함수에 대해 send를 사용해야 하는 것
```javascript
myContract.methods.myMethod(123).send()
```
### 좀비 데이터 받기
```javascript
function getZombieDetails(id) {
  return cryptoZombies.methods.zombies(id).call()
}

// 함수를 호출하고 결과를 가지고 무언가를 처리:
getZombieDetails(15)
.then(function(result) {
  console.log("Zombie 15: " + JSON.stringify(result));
});
```
cryptoZombies.methods.zombies(id).call()는 Web3 프로바이더와 통신하여 컨트랙트의 Zombie[] public zombies에서 인덱스가 id인 좀비를 반환
외부 서버로 API 호출을 하는 것처럼 비동기적으로 일어난다는 것
Web3는 Promise를 반환
```
{
  "name": "H4XF13LD MORRIS'S COOLER OLDER BROTHER",
  "dna": "1337133713371337",
  "level": "9999",
  "readyTime": "1522498671",
  "winCount": "999999999",
  "lossCount": "0" // Obviously.
}
```

## 메타마스크 & 계정
### 메타마스크에서 사용자 계정 가져오기
```javascript
var userAccount = web3.eth.accounts[0]
```
```javascript
var accountInterval = setInterval(function() {
  // 계정이 바뀌었는지 확인
  if (web3.eth.accounts[0] !== userAccount) {
    userAccount = web3.eth.accounts[0];
    // 새 계정에 대한 UI로 업데이트하기 위한 함수 호출
    updateInterface();
  }
}, 100);
```

## 좀비 군대 보여주기
```javascript 
// 우리 컨트랙트에서 좀비 상세 정보를 찾아, `zombie` 객체 반환
getZombieDetails(id)
.then(function(zombie) {
  // HTML에 변수를 넣기 위해 ES6의 "template literal" 사용
  // 각각을 #zombies div에 붙여넣기
  $("#zombies").append(`<div class="zombie">
    <ul>
      <li>Name: ${zombie.name}</li>
      <li>DNA: ${zombie.dna}</li>
      <li>Level: ${zombie.level}</li>
      <li>Wins: ${zombie.winCount}</li>
      <li>Losses: ${zombie.lossCount}</li>
      <li>Ready Time: ${zombie.readyTime}</li>
    </ul>
  </div>`);
});
```
```javascript
// 좀비의 머리를 표현하는 1-7의 정수 얻기
var head = parseInt(zombie.dna.substring(0, 2)) % 7 + 1

// 순차적인 파일 이름으로 7개의 머리 이미지를 가지고 있네:
var headSrc = "../assets/zombieparts/head-" + head + ".png"
```

## 트랜잭션 보내기
send 함수 사용
call 함수와 다른점?
1. 트랜잭션을 전송(send)하려면 함수를 호출한 사람의 from 주소가 필요(솔리디티 코드에서는 msg.sender)
DApp의 사용자가 되어야 할 것이니, 메타마스크가 나타나 그들에게 서명을 하도록 한다
2. 트랜잭션 전송(send)은 가스를 소모
3. 사용자가 트랜잭션 전송을 하고 난 후 실제로 블록체인에 적용될 때까지는 상당한 지연이 발생할 것
트랜잭션이 블록에 포함될 때까지 기다려야 하는데, 이더리움의 평균 블록 시간이 15초이다
따라서 이 코드의 비동기적 특성을 다루기 위한 로직이 필요하다
### 좀비 만들기
solidity에서 작성한 createRandomZombie 함수를 호출한다고 할때
```
function createRandomZombie(string _name) public {
  require(ownerZombieCount[msg.sender] == 0);
  uint randDna = _generateRandomDna(_name);
  randDna = randDna - randDna % 100;
  _createZombie(_name, randDna);
}
```
```javascript
function createRandomZombie(name) {
  // 시간이 꽤 걸릴 수 있으니, 트랜잭션이 보내졌다는 것을
  // 유저가 알 수 있도록 UI를 업데이트해야 함
  $("#txStatus").text("Creating new zombie on the blockchain. This may take a while...");
  // 우리 컨트랙트에 전송하기:
  return CryptoZombies.methods.createRandomZombie(name)
  .send({ from: userAccount })
  .on("receipt", function(receipt) {
    $("#txStatus").text("Successfully created " + name + "!");
    // 블록체인에 트랜잭션이 반영되었으며, UI를 다시 그려야 함
    getZombiesByOwner(userAccount).then(displayZombies);
  })
  .on("error", function(error) {
    // 사용자들에게 트랜잭션이 실패했음을 알려주기 위한 처리
    $("#txStatus").text(error);
  });
}
```
receipt는 트랜잭션이 이더리움의 블록에 포함될 때, 즉 좀비가 생성되고 컨트랙트에 저장되었을 때 발생
error는 트랜잭션이 블럭에 포함되지 못했을 때 발생

참고 :: send를 호출할 때 gas와 gasPrice를 선택적으로 지정할 수 있다 .send({ from: userAccount, gas: 3000000 })

## Payable 함수 호출하기
호출할 payable 함수는 levelUp 함수
```
function levelUp(uint _zombieId) external payable {
  require(msg.value == levelUpFee);
  zombies[_zombieId].level++;
}
```
이더가 아니라 wei로 얼마를 보낼지 정해야 하는 제한이 있다
### Wei란?
wei는 이더의 가장 작은 하위 단위
1 ether = 10^18 wei
```javascript
// 이렇게 하면 1 ETH를 Wei로 바꿀 것이네
web3js.utils.toWei("1");
```
웨이로 코드 수정
```javascript
CryptoZombies.methods.levelUp(zombieId)
.send({ from: userAccount, value: web3js.utils.toWei("0.001") })
```

## 이벤트(Event) 구독하기
### 새로운 좀비 수신하기
zombiefactory.sol를 확인해보면, 새로운 좀비가 생성될 때마다 매번 호출되던 NewZombie라는 이벤트가 존재한다
```
event NewZombie(uint zombieId, string name, uint dna);
```
Web3.js에서 이벤트를 구독하여 해당 이벤트가 발생할 때마다 Web3 프로바이더가 코드 내의 어떠한 로직을 실행시키도록 할 수 있다
```javascript
cryptoZombies.events.NewZombie()
.on("data", function(event) {
  let zombie = event.returnValues;
  // `event.returnValue` 객체에서 이 이벤트의 세 가지 반환 값에 접근할 수 있네:
  console.log("새로운 좀비가 태어났습니다!", zombie.zombieId, zombie.name, zombie.dna);
}).on("error", console.error);
```
### indexed 사용하기
이벤트를 필터링하고 현재 사용자와 연관된 변경만을 수신하기 위해, 
ERC721을 구현할 때 Transfer 이벤트에서 했던 것처럼 솔리디티 컨트랙트에 indexed 키워드를 사용해야한다
```
event Transfer(address indexed _from, address indexed _to, uint256 _tokenId);
```
이 경우, _from과 _to가 indexed 되어 있기 때문에, 프론트엔드의 이벤트 리스너에서 이들을 필터링할 수 있다
```javascript
// `filter`를 사용해 `_to`가 `userAccount`와 같을 때만 코드를 실행
cryptoZombies.events.Transfer({ filter: { _to: userAccount } })
.on("data", function(event) {
  let data = event.returnValues;
  // 현재 사용자가 방금 좀비를 받았네!
  // 해당 좀비를 보여줄 수 있도록 UI를 업데이트할 수 있도록 여기에 추가
}).on("error", console.error);
```
event와 indexed 영역을 사용하는 것은 컨트랙트에서 변화를 감지하고 프론트엔드에 반영할 수 있게 하는 유용한 방법
### 지난 이벤트에 대해 질의하기
getPastEvents를 이용해 지난 이벤트들에 대해 질의를 하고,
fromBlock과 toBlock 필터들을 이용해 이벤트 로그에 대한 시간 범위를 솔리디티에 전달할 수 있다
(여기서 "block"은 이더리움 블록 번호)
```javascript
cryptoZombies.getPastEvents("NewZombie", { fromBlock: 0, toBlock: "latest" })
.then(function(events) {
  // `events`는 우리가 위에서 했던 것처럼 반복 접근할 `event` 객체들의 배열이네.
  // 이 코드는 생성된 모든 좀비의 목록을 우리가 받을 수 있게 할 것이네.
});
```
위 메소드를 사용해서 이벤트를 저렴한 형태의 storage로 사용하는 것도 가능하다
