# lesson 3 
## 컨트랙트의 불변성
이더리움에 컨트랙트를 배포하고 나면, 컨트랙트는 변하지 않는다
컨트랙트로 배포한 최초의 코드는 항상, 블록체인에 영구적으로 존재한다
    => 솔리디티에 있어서 보안이 굉장히 큰 이슈
### 외부 의존성
대개의 경우 DApp의 중요한 일부를 수정할 수 있도록 하는 함수를 만들어놓는 것이 합리적

## 소유 가능한 컨트랙트
컨트랙트를 대상으로 특별한 권리를 가지는 소유자가 있음을 의미
### OpenZeppelin의 Ownable 컨트랙트
OpenZeppelin : DApp에서 사용할 수 있는, 안전하고 커뮤니티에서 검증받은 스마트 컨트랙트의 라이브러리
```
/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  address public owner;
  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  function Ownable() public {
    owner = msg.sender;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) public onlyOwner {
    require(newOwner != address(0));
    OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }
}
```
#### 생성자 (Constructor)
function Ownable()는 생성자
컨트랙트와 동일한 이름을 가진, 생략할 수 있는 특별한 함수
이 함수는 컨트랙트가 생성될 때 딱 한 번만 실행
#### 함수 제어자 (Function Modifier)
제어자는 다른 함수들에 대한 접근을 제어하기 위해 사용되는 일종의 유사 함수
보통 함수 실행 전의 요구사항 충족 여부를 확인하는 데에 사용
onlyOwner의 경우에는 접근을 제한해서 오직 컨트랙트의 소유자만 해당 함수를 실행할 수 있도록 하기 위해 사용
TODO : _;의 역활은?
TODO : indexed 키워드는?

## onlyOwner 함수 제어자
```
ZombieFeeding is ZombieFactory
ZombieFactory is Ownable
```
ZombieFeeding 또한 Ownable이고, Ownable 컨트랙트의 함수/이벤트/제어자에 접근할 수 있다

### 함수 제어자
함수 제어자는 함수처럼 보이지만, function 키워드 대신 modifier 키워드를 사용한다
함수를 호출하듯이 직접 호출할 수는 없다
대신에 함수 정의부 끝에 해당 함수의 작동 방식을 바꾸도록 제어자의 이름을 붙일 수 있다
```
/**
 * @dev Throws if called by any account other than the owner.
 */
modifier onlyOwner() {
  require(msg.sender == owner);
  _;
}
```
```
contract MyContract is Ownable {
  event LaughManiacally(string laughter);

  // 아래 `onlyOwner`의 사용 방법을 잘 보게:
  function likeABoss() external onlyOwner {
    LaughManiacally("Muahahahaha");
  }
}
```
likeABoss 함수를 호출하면, onlyOwner의 코드가 먼저 실행된다
그후, onlyOwner의 _; 부분에서 likeABoss 함수로 되돌아가 해당 코드를 실행하게 된다
일반적으로 쓰는 예시 중 하나는 함수 실행 전에 require 체크를 넣는 것
        
참고 :: 이렇게 소유자가 컨트랙트에 특별한 권한을 갖도록 하는 것은 자주 필요하지만, 이게 악용될 수도 있다네. 예를 들어, 소유자가 다른 사람의 좀비를 뺏어올 수 있도록 하는 백도어 함수를 추가할 수도 있다
        개발자로서는 자네가 잠재적인 버그를 수정하고 DApp을 안정적으로 유지하도록 하는 것과, 사용자들이 그들의 데이터를 믿고 저장할 수 있는 소유자가 없는 플랫폼을 만드는 것 사이에서 균형을 잘 잡는 것이 중요하다

## 가스(Gas)
### 가스 - 이더리움 DApp이 사용하는 연료
솔리디티에서는 사용자들이 자네가 만든 DApp의 함수를 실행할 때마다 가스라고 불리는 화폐를 지불해야 한다
함수를 실행하는 데에 얼마나 많은 가스가 필요한지는 그 함수의 로직(논리 구조)이 얼마나 복잡한지에 따라 달라진다
연산을 수행하는 데에 소모되는 컴퓨팅 자원의 양이 이 비용을 결정

### 가스는 왜 필요한가?
누군가가 무한 반복문을 써서 네트워크를 방해하거나, 자원 소모가 큰 연산을 써서 네트워크 자원을 모두 사용하지 못하도록 해주기 위해서

### 가스를 아끼기 위한 구조체 압축
가능한 한 작은 크기의 정수 타입을 쓰는 것이 좋다
```
struct NormalStruct {
  uint a;
  uint b;
  uint c;
}

struct MiniMe {
  uint32 a;
  uint32 b;
  uint c;
}

// `mini`는 구조체 압축을 했기 때문에 `normal`보다 가스를 조금 사용할 것이네.
NormalStruct normal = NormalStruct(10, 20, 30);
MiniMe mini = MiniMe(10, 20, 30); 
```

동일한 데이터 타입은 하나로 묶어놓는 것이 좋다
구조체에서 서로 옆에 있도록 선언하면 솔리디티에서 사용하는 저장 공간을 최소화한다
```
struct Example1 {
    uint c; uint32 a; uint32 b;
}
struct Example2 {
    uint32 a; uint c; uint32 b;
}
```
Example1의 경우 uint32 필드가 묶여있기 때문에 가스를 덜 소모한다

## 시간 단위
솔리디티는 시간을 다룰 수 있는 단위계를 기본적으로 제공
now 변수를 쓰면 현재의 유닉스 타임스탬프(1970년 1월 1일부터 지금까지의 초 단위 합) 값
```
uint lastUpdated;

// `lastUpdated`를 `now`로 설정
function updateTimestamp() public {
  lastUpdated = now;
}

// 마지막으로 `updateTimestamp`가 호출된 뒤 5분이 지났으면 `true`를, 5분이 아직 지나지 않았으면 `false`를 반환
function fiveMinutesHavePassed() public view returns (bool) {
  return (now >= (lastUpdated + 5 minutes));
}
```

## 좀비 재사용 대기 시간
### 구조체를 인수로 전달하기
private 또는 internal 함수에 인수로서 구조체의 storage 포인터를 전달할 수 있다
```
function _doStuff(Zombie storage _zombie) internal {
  // _zombie로 할 수 있는 것들을 처리
}
```

## Public 함수 & 보안
public과 external 함수 보안 문제(사용자들은 이 함수를 직접적으로 호출 가능) -> internal 함수 사용

## 함수 제어자의 또 다른 특징
### 인수를 가지는 함수 제어자
```
// 사용자의 나이를 저장하기 위한 매핑
mapping (uint => uint) public age;

// 사용자가 특정 나이 이상인지 확인하는 제어자
modifier olderThan(uint _age, uint _userId) {
  require (age[_userId] >= _age);
  _;
}

// 차를 운전하기 위햐서는 16살 이상이어야 하네(적어도 미국에서는).
// `olderThan` 제어자를 인수와 함께 호출하려면 이렇게 하면 되네:
function driveCar(uint _userId) public olderThan(16, _userId) {
  // 필요한 함수 내용들
}
```

## 'View' 함수를 사용해 가스 절약하기
### View 함수는 가스를 소모하지 않네
DApp의 가스 사용을 최적화하는 비결은 가능한 모든 곳에 읽기 전용의 external view 함수를 쓰는 것

단, 만약 view 함수가 동일 컨트랙트 내에 있는, view 함수가 아닌 다른 함수에서 내부적으로 호출될 경우, 여전히 가스를 소모할 것
이것은 다른 함수가 이더리움에 트랜잭션을 생성하고, 이는 모든 개별 노드에서 검증되어야 하기 때문
view 함수는 외부에서 호출됐을 때에만 무료
### Storage는 비싸다
어떤 배열에서 내용을 빠르게 찾기 위해, 단순히 변수에 저장하는 것 대신 함수가 호출될 때마다 배열을 memory에 다시 만드는 것이 더 저렴하다

## 메모리에 배열 선언하기
Storage에 아무것도 쓰지 않고도 함수 안에 새로운 배열을 만들려면 배열에 memory 키워드를 쓰면 된다
이 배열은 함수가 끝날 때까지만 존재할 것
storage의 배열을 직접 업데이트하는 것보다 가스 소모 측면에서 훨씬 저렴
```
function getArray() external pure returns(uint[]) {
  // 메모리에 길이 3의 새로운 배열을 생성한다.
  uint[] memory values = new uint[](3);
  // 여기에 특정한 값들을 넣는다.
  values.push(1);
  values.push(2);
  values.push(3);
  // 해당 배열을 반환한다.
  return values;
}
```

## For 반복문
함수 내에서 배열을 다룰 때, 그냥 storage에 해당 배열을 저장하는 것이 아니라 for 반복문을 사용해서 구성해야 할 때가 있을 것
```
mapping (address => uint[]) public ownerToZombies;
function getZombiesByOwner(address _owner) external view returns (uint[]) {
  return ownerToZombies[_owner];
}
```
문제점
배열이라서 좀비가 지워진 구멍을 메우기 위해 기존 소유자의 배열에서 모든 좀비를 한 칸씩 움직인다
  -> 가스비 소모가 크다
### for 반복문 사용하기
```
function getEvens() pure external returns(uint[]) {
  uint[] memory evens = new uint[](5);
  // 새로운 배열의 인덱스를 추적하는 변수
  uint counter = 0;
  // for 반복문에서 1부터 10까지 반복함
  for (uint i = 1; i <= 10; i++) {
    // `i`가 짝수라면...
    if (i % 2 == 0) {
      // 배열에 i를 추가함
      evens[counter] = i;
      // `evens`의 다음 빈 인덱스 값으로 counter를 증가시킴
      counter++;
    }
  }
  return evens;
}
```