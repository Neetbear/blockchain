### account 생성
geth --datadir ./ethereum/data/ account new

### 사설 네트워크 생성
1. genesis block 생성
-> genesis.json

"chainId": 14 -> 사설 네트워크 chain ID
              -> 다른 네트워크 ID와 충돌 주의
              -> 천번대 사용할면 보통 충돌 안남

"difficulty": "0x00001" -> 빠르게 하려고 최소로 만듬

"alloc": {
    "e441db777a3bbda3e6cfad4fd3057772a4815bd4": {
    "balance": "0x200000000000000000000000000000000000000000000000000000000000000"
} -> 채굴시 누구에게 얼만큼 (단위 wei)

geth --datadir .\ethereum\data init ./genesis.json

geth --identity 'PrivateNetwork' --datadir .\ethereum\data\ --port '30303' --http --http.addr 127.0.0.1 --http.port '8001' --http.corsdomain '*' --nodiscover --networkid 14 --nat 'any' --http.api 'db, eth, net, web3, miner' --allow-insecure-unlock console
-> linux는 http말고 rpc로 해야될 수도 있음
-> --nodiscover 피어 자동찾기 방지
-> --allow-insecure-unlock unlock하려면 줘야하는 옵션
 
self="enode://2b1ae7c0db08fb3197fb944ec9107803f713054c0fbc056c0caafb99345f5df1ab2d8c3494f5c17c92dc24385a682ffe3a15dfc41bf9117ab8dfd19a7459fc55@127.0.0.1:30303?discport=0"
내 노드 주소

새 cmd 창에서 
geth attach ipc:\\.\pipe\geth.ipc
miner.threads=1 -> 4~5 넣으면 컴 전체 쓰레드 사용됨
miner.start() -> 채굴 시작
miner.stop() -> 채굴 중지
eth.blockNumber -> 현재 블록 갯수
eth.getBalance(eth.accounts[0]) -> account 보유 balance
miner.setEtherbase(personal.listAccounts[0]) -> 마이닝 보상 계정 변경?
personal.unlockAccount(eth.accounts[0]) -> account unlock
eth.getBlock(10) -> 블록 정보 확인
personal.listWallets[0].status -> n번째 계정 상태 확인

### contract 
크립토좀비 하나 가져왔음
extension solidity
F1 누르고 solidity:change global complier version(remote) -> latest

F1 누르고 solidity:compile contract -> bin폴더 생기면 성공 
    -> 에러시 버전 문제등 일수도 있으니 한번 더 해보기

### test transfer

0x5529CcC3EcA35B4EeECb206A7C475bB69CC07dB0
testTransferContractInstance.at(0x6D3163983b31B01a2dc8D23a557F223fa491087D).myBalanceOf()
address : 0x6d3163983b31b01a2dc8d23a557f223fa491087d
transactionHash : 0x568c5c6d10a763625112946e921ea633fbdf47f128db868793fe2ad8fd6aa25b

https://medium.com/coinmonks/solidity-transfer-vs-send-vs-call-function-64c92cfc878a

#### trasaction msg.value 
https://cryptozombies.io/ko/lesson/4/chapter/1

address.function{ value: amount }(arg1, arg2, arg3)

#### 에러 처리 assert, revert, require
assert : gas를 다 소비한후, 특정한 조건에 부합하지 않으면 에러를 발생시킨다.
revert: 조건없이 에러를 발생시키고, gas를 환불 시켜준다. 
require: 특정한 조건에 부합하지 않으면 에러를 발생시키고, gas를 환불 시켜준다.


Access to XMLHttpRequest at 'http://localhost:8000/cats' from origin 'http://127.0.0.1:3000' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'. The credentials mode of requests initiated by the XMLHttpRequest is controlled by the withCredentials attribute.