# Solidity 20220523
# chaper 1
## pragma solidity ^0.4.19; 버전

## 상태 변수 & 정수
상태 변수는 컨트랙트 저장소에 영구적으로 저장 
    -> 이더리움 생태계에 무조건 저장이되고 수수료 비싸다
uint 자료형은 부호 없는 정수 (값이 음수가 아니어야 한다)
부호 있는 정수를 위한 int 자료형도 있네.
string 스트링은 임의의 길이를 가진 UTF-8 데이터

## 수학 연산
덧셈: x + y
뺄셈: x - y,
곱셈: x * y
나눗셈: x / y
나머지: x % y
지수: x ** y

## 구조체
구조체를 통해 여러 특성을 가진, 보다 복잡한 자료형을 생성
```
struct Person {
    uint age;
    string name;
}
```

## 배열
### 정적 배열과 동적 배열
```
string[5] stringArray; vs uint[] dynamicArray;
```

### 구조체 배열
```
Person[] people;
```

### Public 배열
솔리디티는 public 배열을 위해 getter 메소드를 자동적으로 생성 
다른 컨트랙트들이 이 배열을 읽을 수 있지만 쓸 수는 없다
```
Person[] public people;
```

우리 앱에 좀비 군대를 저장하고 싶네. 
그리고 우리 좀비들을 다른 앱에 자랑하고 싶네. -> 다른 컨트랙트와 상호작용
그러니 좀비 군대 저장소를 public으로 해야 하네.

## 함수 선언 & 호출
```
function eatHamburgers(string _name, uint _amount) {
}

// 함수 인자명을 언더스코어(_)로 시작해서 전역 변수와 구별하는 것이 관례

eatHamburgers("vitalik", 100);
```

## 구조체와 배열 활용
```
// 새로운 사람을 생성한다:
Person satoshi = Person(172, "Satoshi");

// 이 사람을 배열에 추가한다:
people.push(satoshi);

// 한 줄로 만들면
people.push(Person(16, "Vitalik"));
```
array.push()는 무언가를 배열의 끝에 추가해서 모든 원소가 순서를 유지하도록 한다

## Private / Public 함수
default -> public

Private -> 컨트랙트 내의 다른 함수들만이 이 함수를 호출 가능
        -> 외부에서 접근 못해야하는 경우 사용
```
uint[] numbers;

function _addToArray(uint _number) private {
  numbers.push(_number);
}
```
private 함수명 언더바(_)로 시작하는 것이 관례

## 반환값
return 
```
string greeting = "What's up dog";

function sayHello() public returns (string) {
  return greeting;
}
```

## 함수 제어자
### view
어떤 값을 변경하거나 무언가를 쓰지 않고 참조만 하는 함수의 경우 view 함수로 선언
이는 함수가 데이터를 보기만 하고 변경하지 않는다는 뜻
```
function sayHello() public view returns (string) {
    return greeting;
}
```
### pure
함수가 앱에서 어떤 데이터도 접근하지 않는 것을 의미
```
function _multiply(uint a, uint b) private pure returns (uint) {
  return a * b;
}
```
이 함수는 앱에서 읽는 것도 하지 않고, 다만 반환값이 함수에 전달된 인자값에 따라서 달라진다
이런 경우에 함수를 pure로 선언한다
 
참고 :: 솔리디티 컴파일러는 어떤 제어자를 써야 하는지 경고 메시지를 통해 알려준다

## Keccak256과 형 변환
### Keccak256
이더리움은 SHA3의 한 버전인 keccak256를 내장 해시 함수로 가지고 있다
해시 함수는 기본적으로 입력 스트링을 랜덤 256비트 16진수로 매핑
```
//6e91ec6b618bb462a4a6ee5aa2cb0e9cf30f7a052bb467b0ba58b8748c00d2e5
keccak256("aaaab");
//b1f078126895a1424524de5321b339ab00408010b7cf0e6ed451514981e58aa9
keccak256("aaaac");
```
### 형 변환 
자료형 간에 변환
```
uint8 a = 5;
uint b = 6;
// a * b가 uint8이 아닌 uint를 반환하기 때문에 에러 메시지가 난다:
uint8 c = a * b; 
// b를 uint8으로 형 변환해서 코드가 제대로 작동하도록 해야 한다:
uint8 c = a * uint8(b);
```

## 이벤트
컨트랙트가 블록체인 상에서 자네 앱의 사용자 단에서 무언가 액션이 발생했을 때 의사소통하는 방법
컨트랙트는 특정 이벤트가 일어나는지 "귀를 기울이고" 그 이벤트가 발생하면 행동을 취한다
```
// 이벤트를 선언한다
event IntegersAdded(uint x, uint y, uint result);

function add(uint _x, uint _y) public {
  uint result = _x + _y;
  // 이벤트를 실행하여 앱에게 add 함수가 실행되었음을 알린다:
  IntegersAdded(_x, _y, result);
  return result;
}
```
자바스크립트로 구현시
```
YourContract.IntegersAdded(function(error, result) {
  // 결과와 관련된 행동을 취한다
  // _x, _y, result 가 result에 Serialize해서 드간다?
  // result._x , result._y, result.result
})
```

## cryptozombies example code
```
// 여기에 우리가 만든 컨트랙트에 접근하는 방법을 제시한다:
var abi = /* abi generated by the compiler */
var ZombieFactoryContract = web3.eth.contract(abi)
var contractAddress = /* our contract address on Ethereum after deploying */
var ZombieFactory = ZombieFactoryContract.at(contractAddress)
// `ZombieFactory`는 우리 컨트랙트의 public 함수와 이벤트에 접근할 수 있다.

// 일종의 이벤트 리스너가 텍스트 입력값을 취한다:
$("#ourButton").click(function(e) {
  var name = $("#nameInput").val()
  // 우리 컨트랙트의 `createRandomZombie`함수를 호출한다:
  ZombieFactory.createRandomZombie(name)
})

// `NewZombie` 이벤트가 발생하면 사용자 인터페이스를 업데이트한다
var event = ZombieFactory.NewZombie(function(error, result) {
  if (error) return
  generateZombie(result.zombieId, result.name, result.dna)
})

// 좀비 DNA 값을 받아서 이미지를 업데이트한다
function generateZombie(id, name, dna) {
  let dnaStr = String(dna)
  // DNA 값이 16자리 수보다 작은 경우 앞 자리를 0으로 채운다
  while (dnaStr.length < 16)
    dnaStr = "0" + dnaStr

  let zombieDetails = {
    // 첫 2자리는 머리의 타입을 결정한다. 머리 타입에는 7가지가 있다. 그래서 모듈로(%) 7 연산을 하여
    // 0에서 6 중 하나의 값을 얻고 여기에 1을 더해서 1에서 7까지의 숫자를 만든다. 
    // 이를 기초로 "head1.png"에서 "head7.png" 중 하나의 이미지를 불러온다:
    headChoice: dnaStr.substring(0, 2) % 7 + 1,
    // 두번째 2자리는 눈 모양을 결정한다. 눈 모양에는 11가지가 있다:
    eyeChoice: dnaStr.substring(2, 4) % 11 + 1,
    // 셔츠 타입에는 6가지가 있다:
    shirtChoice: dnaStr.substring(4, 6) % 6 + 1,
    // 마지막 6자리는 색깔을 결정하며, 360도(degree)까지 지원하는 CSS의 "filter: hue-rotate"를 이용하여 아래와 같이 업데이트된다:
    skinColorChoice: parseInt(dnaStr.substring(6, 8) / 100 * 360),
    eyeColorChoice: parseInt(dnaStr.substring(8, 10) / 100 * 360),
    clothesColorChoice: parseInt(dnaStr.substring(10, 12) / 100 * 360),
    zombieName: name,
    zombieDescription: "A Level 1 CryptoZombie",
  }
  return zombieDetails
}
```

# Chapter 2
## 매핑과 주소
### 주소
주소는 특정 계정을 가리키는 고유 식별자
0x0cE446255506E92DF41614C46F1d6df9Cc969183
### 매핑
매핑은 솔리디티에서 구조화된 데이터를 저장하는 또다른 방법
```
// 금융 앱용으로, 유저의 계좌 잔액을 보유하는 uint를 저장한다: 
mapping (address => uint) public accountBalance;
// 혹은 userID로 유저 이름을 저장/검색하는 데 매핑을 쓸 수도 있다 
mapping (uint => string) userIdToName;
```
키-값 (key-value) 저장소, 데이터를 저장하고 검색하는 데 이용

## Msg.sender
솔리디티에는 모든 함수에서 이용 가능한 특정 전역 변수들이 존재 
msg.sender -> 현재 함수를 호출한 사람 (혹은 스마트 컨트랙트)의 주소

참고 :: 솔리디티에서 함수 실행은 항상 외부 호출자가 시작하네. 
        컨트랙트는 누군가가 컨트랙트의 함수를 호출할 때까지 
        블록체인 상에서 아무 것도 안 하고 있을 것이네. 
        그러니 항상 msg.sender가 있어야 하네.

```
mapping (address => uint) favoriteNumber;

function setMyNumber(uint _myNumber) public {
  // `msg.sender`에 대해 `_myNumber`가 저장되도록 `favoriteNumber` 매핑을 업데이트한다 `
  favoriteNumber[msg.sender] = _myNumber;
  // ^ 데이터를 저장하는 구문은 배열로 데이터를 저장할 떄와 동일하다 
}

function whatIsMyNumber() public view returns (uint) {
  // sender의 주소에 저장된 값을 불러온다 
  // sender가 `setMyNumber`을 아직 호출하지 않았다면 반환값은 `0`이 될 것이다
  return favoriteNumber[msg.sender];
}
```

## Require
require를 활용하면 특정 조건이 참이 아닐 때 함수가 에러 메시지를 발생하고 실행을 멈추게 된다
```
function sayHiToVitalik(string _name) public returns (string) {
  // _name이 "Vitalik"인지 비교한다. 참이 아닐 경우 에러 메시지를 발생하고 함수를 벗어난다
  // (참고: 솔리디티는 고유의 스트링 비교 기능을 가지고 있지 않기 때문에 
  // 스트링의 keccak256 해시값을 비교하여 스트링 값이 같은지 판단한다)
  require(keccak256(_name) == keccak256("Vitalik"));
  // 참이면 함수 실행을 진행한다:
  return "Hi!";
}
```

참고 :: 솔리디티에서 값을 비교할 때 어떤 항이 먼저 오느냐는 중요하지 않다. 어떤 순서든 동일하다. 

## 상속 
```
contract Doge {
  function catchphrase() public returns (string) {
    return "So Wow CryptoDoge";
  }
}

contract BabyDoge is Doge {
  function anotherCatchphrase() public returns (string) {
    return "Such Moon BabyDoge";
  }
}
```
상속 개념은 "고양이는 동물이다"의 경우처럼 부분집합 클래스가 있을 때 논리적 상속을 위해 활용한다.
하지만 동일한 로직을 다수의 클래스로 분할해서 단순히 코드를 정리할 때도 활용할 수 있다.

## Import
여러 파일로 나누어 정리하면 관리
다수의 파일이 있고 어떤 파일을 다른 파일로 불러오고 싶을 때, 솔리디티는 import라는 키워드를 이용
```
import "./someothercontract.sol";
// ./ : 이 컨트랙트와 동일한 폴더에 있음을 의미한다
contract newContract is SomeOtherContract {

}
```

## Storage vs Memory
Storage는 블록체인 상에 영구적으로 저장되는 변수
Memory는 임시적으로 저장되는 변수 -> 컨트랙트 함수에 대한 외부 호출들이 일어나는 사이에 지워진다

상태 변수(함수 외부에 선언된 변수)는 초기 설정상 storage로 선언되어 블록체인에 영구적으로 저장되는 반면, 
함수 내에 선언된 변수는 memory로 자동 선언되어서 함수 호출이 종료되면 사라진다.

구조체와 배열을 처리할때는 이 키워드들을 사용해야 한다 
```
contract SandwichFactory {
  struct Sandwich {
    string name;
    string status;
  }

  Sandwich[] sandwiches;

  function eatSandwich(uint _index) public {
    // Sandwich mySandwich = sandwiches[_index];

    // ^ 꽤 간단해 보이나, 솔리디티는 여기서 
    // `storage`나 `memory`를 명시적으로 선언해야 한다는 경고 메시지를 발생한다. 
    // 그러므로 `storage` 키워드를 활용하여 다음과 같이 선언해야 한다:
    Sandwich storage mySandwich = sandwiches[_index];
    // ...이 경우, `mySandwich`는 저장된 `sandwiches[_index]`를 가리키는 포인터이다.
    // 그리고 
    mySandwich.status = "Eaten!";
    // ...이 코드는 블록체인 상에서 `sandwiches[_index]`을 영구적으로 변경한다. 

    // 단순히 복사를 하고자 한다면 `memory`를 이용하면 된다: 
    Sandwich memory anotherSandwich = sandwiches[_index + 1];
    // ...이 경우, `anotherSandwich`는 단순히 메모리에 데이터를 복사하는 것이 된다. 
    // 그리고 
    anotherSandwich.status = "Eaten!";
    // ...이 코드는 임시 변수인 `anotherSandwich`를 변경하는 것으로 
    // `sandwiches[_index + 1]`에는 아무런 영향을 끼치지 않는다. 그러나 다음과 같이 코드를 작성할 수 있다: 
    sandwiches[_index + 1] = anotherSandwich;
    // ...이는 임시 변경한 내용을 블록체인 저장소에 저장하고자 하는 경우이다.
  }
}
```

## 함수 접근 제어자
```
function feedAndMultiply(uint _zombieId, uint _targetDna) public {
  require(msg.sender == zombieToOwner[_zombieId]);
  Zombie storage myZombie = zombies[_zombieId];
  _targetDna = _targetDna % dnaModulus;
  uint newDna = (myZombie.dna + _targetDna) / 2;
  _createZombie("NoName", newDna);
}
```
위의 코드 컴파일시 컴파일러가 에러 메시지를 출력한다
_createZombie 함수는 ZombieFactory 컨트랙트 내의 private 함수인데 ZombieFeeding 컨트랙트 내에서 _createZombie 함수를 호출하여서 오류가 발생한다
ZombieFactory 컨트랙트를 상속하는 어떤 컨트랙트도 이 함수에 접근할 수 없다

### Internal과 External
internal은 함수가 정의된 컨트랙트를 상속하는 컨트랙트에서도 접근이 가능하다 점을 제외하면 private과 동일
external은 함수가 컨트랙트 바깥에서만 호출될 수 있고 컨트랙트 내의 다른 함수에 의해 호출될 수 없다는 점을 제외하면 public과 동일
```
contract Sandwich {
  uint private sandwichesEaten = 0;

  function eat() internal {
    sandwichesEaten++;
  }
}

contract BLT is Sandwich {
  uint private baconSandwichesEaten = 0;

  function eatWithBacon() public returns (string) {
    baconSandwichesEaten++;
    // eat 함수가 internal로 선언되었기 때문에 여기서 호출이 가능하다 
    eat();
  }
}
```

## 다른 컨트랙트와 상호작용하기
블록체인 상에 있으면서 우리가 소유하지 않은 컨트랙트와 우리 컨트랙트가 상호작용을 하려면 우선 인터페이스를 정의해야 한다
```
contract LuckyNumber {
  mapping(address => uint) numbers;

  function setNum(uint _num) public {
    numbers[msg.sender] = _num;
  }

  function getNum(address _myAddress) public view returns (uint) {
    return numbers[_myAddress];
  }
}
```