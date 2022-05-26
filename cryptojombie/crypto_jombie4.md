# lesson 4
## payable
### 지금까지 요약 - 1
private은 컨트랙트 내부의 다른 함수들에서만 호출될 수 있음을 의미한다
internal은 private과 비슷하지만, 해당 컨트랙트를 상속하는 컨트랙트에서도 호출될 수 있다
external은 오직 컨트랙트 외부에서만 호출될 수 있다 
마지막으로 public은 내외부 모두에서, 어디서든 호출될 수 있다
### 지금까지 요약 -2
상태 제어자(state modifier)는 블록체인과 상호작용 하는 방법에 대해 알려준다
view는 해당 함수를 실행해도 어떤 데이터도 저장/변경되지 않음을 알려준다
pure는 해당 함수가 어떤 데이터도 블록체인에 저장하지 않을 뿐만 아니라, 블록체인으로부터 어떤 데이터도 읽지 않음을 알려준다
### 지금까지 요약 -3
제어자
onlyOwner와 aboveLevel 같은 것
제어자를 사용해서 함수에 이 제어자들이 어떻게 영향을 줄지를 결정하는 우리만의 논리를 구성할 수 있다
제어자들은 함수 하나에 다음처럼 함께 사용할 수 있다
```
function test() external view onlyOwner anotherModifier { /* ... */ }
```
### payable
이더리움에서는, 이더, 데이터, 그리고 컨트랙트 코드 자체 모두 이더리움 위에 존재하기 때문에,
함수를 실행하는 동시에 컨트랙트에 돈을 지불하는 것이 가능하다
이를 통해 굉장히 흥미로운 구성을 만들어낼 수 있다
함수를 실행하기 위해 컨트랙트에 일정 금액을 지불하게 하는 것
```
contract OnlineStore {
  function buySomething() external payable {
    // 함수 실행에 0.001이더가 보내졌는지 확실히 하기 위해 확인:
    require(msg.value == 0.001 ether);
    // 보내졌다면, 함수를 호출한 자에게 디지털 아이템을 전달하기 위한 내용 구성:
    transferThing(msg.sender);
  }
}
```
msg.value는 컨트랙트로 이더가 얼마나 보내졌는지 확인하는 방법
ether는 기본적으로 포함된 단위
여기서 일어나는 일은 누군가 web3.js(DApp의 자바스크립트 프론트엔드)에서 다음과 같이 함수를 실행할 때 발생
```
// `OnlineStore`는 자네의 이더리움 상의 컨트랙트를 가리킨다고 가정하네:
OnlineStore.buySomething({from: web3.eth.defaultAccount, value: web3.utils.toWei(0.001)})
```

## 출금
컨트랙트로 이더를 보내면, 해당 컨트랙트의 이더리움 계좌에 이더가 저장되고 거기에 갇히게 된다
컨트랙트로부터 이더를 인출하는 함수를 만들어줘야 한다
```
contract GetPaid is Ownable {
  function withdraw() external onlyOwner {
    owner.transfer(this.balance);
  }
}
```
누군가 한 아이템에 대해 초과 지불을 했다면, 이더를 msg.sender로 되돌려주는 함수를 만들 수도 있다
```
uint itemFee = 0.001 ether;
msg.sender.transfer(msg.value - itemFee);
```

## 좀비 전투

## 난수 (Random Numbers)
### keccak256
```
// Generate a random number between 1 and 100:
uint randNonce = 0;
uint random = uint(keccak256(now, msg.sender, randNonce)) % 100;
// keccak256(abi.encodePacked(now, msg.sender, randNonce)) => 차이는?
randNonce++;
uint random2 = uint(keccak256(now, msg.sender, randNonce)) % 100;
```
## 공통 로직 구조 개선하기(Refactoring)
```
require(msg.sender == zombieToOwner[_zombieId]);
```
동일한 내용을 여러 번 사용하고 있으니, 코드를 정리하고 반복을 피할 수 있도록 처리해줘야 한다

## else
```
if (zombieCoins[msg.sender] > 100000000) {
  // 엄청난 부자다!!!
} else {
  // 더 많은 좀비 코인이 필요해...
}
```
