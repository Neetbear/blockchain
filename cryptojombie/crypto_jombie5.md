# lesson 5
## 이더리움 상의 토큰
이더리움에서 토큰은 기본적으로 그저 몇몇 공통 규약을 따르는 스마트 컨트랙트
즉 다른 모든 토큰 컨트랙트가 사용하는 표준 함수 집합을 구현하는 것
transfer(address _to, uint256 _value)나 balanceOf(address _owner) 같은 함수들
내부적으로 스마트 컨트랙트는 보통 mapping(address => uint256) balances와 같은 매핑을 가지고 있다
각각의 주소에 잔액이 얼마나 있는지 기록하는 것
=> 즉 기본적으로 토큰은 그저 하나의 컨트랙트

그 안에서 누가 얼마나 많은 토큰을 가지고 있는지 기록하고, 
몇몇 함수를 가지고 사용자들이 그들의 토큰을 다른 주소로 전송할 수 있게 해주는 것
### 왜 이렇게 해야 하나요?
모든 ERC20 토큰들이 똑같은 이름의 동일한 함수 집합을 공유하기 때문에, 
이 토큰들에 똑같은 방식으로 상호작용이 가능
### 다른 토큰 표준
ERC20 토큰은 화폐처럼 사용되는 토큰으로는 정말 적절
ERC721 토큰은 교체가 불가 -> nft
각각의 토큰이 유일하고 분할이 불가하기 때문
이 토큰은 하나의 전체 단위로만 거래할 수 있고, 각각의 토큰은 유일한 ID를 가지고 있다

## ERC721 표준, 다중 상속
```
contract ERC721 {
  event Transfer(address indexed _from, address indexed _to, uint256 _tokenId);
  event Approval(address indexed _owner, address indexed _approved, uint256 _tokenId);

  function balanceOf(address _owner) public view returns (uint256 _balance);
  function ownerOf(uint256 _tokenId) public view returns (address _owner);
  function transfer(address _to, uint256 _tokenId) public;
  function approve(address _to, uint256 _tokenId) public;
  function takeOwnership(uint256 _tokenId) public;
}
```
### 토큰 컨트랙트 구현하기
solidity의 contract는 다중 상속 가능
```
contract SatoshiNakamoto is NickSzabo, HalFinney {
  // 오 이런, 이 세계의 비밀이 밝혀졌군!
}
```

## balanceOf & ownerOf
#### balanceOf
```
function balanceOf(address _owner) public view returns (uint256 _balance);
```
이 함수는 단순히 address를 받아, 해당 address가 토큰을 얼마나 가지고 있는지 반환한다
#### ownerOf
```
function ownerOf(uint256 _tokenId) public view returns (address _owner);
```
이 함수는 토큰 ID를 받아, 이를 소유하고 있는 사람의 address를 반환한다

## 리팩토링
중복 코드는 항상 정리해주기 

## ERC721: 전송 로직
```
function transfer(address _to, uint256 _tokenId) public;

function approve(address _to, uint256 _tokenId) public;
function takeOwnership(uint256 _tokenId) public;
```
1. 첫 번째 방법은 토큰의 소유자가 전송 상대의 address, 전송하고자 하는 _tokenId와 함께 transfer 함수를 호출하는 것
2. 두 번째 방법은 토큰의 소유자가 먼저 위에서 본 정보들을 가지고 approve를 호출하는 것
    그리고서 컨트랙트에 누가 해당 토큰을 가질 수 있도록 허가를 받았는지 저장
    보통 mapping (uint256 => address)를 사용한다
    이후 누군가 takeOwnership을 호출하면, 해당 컨트랙트는 이 msg.sender가 소유자로부터 토큰을 받을 수 있게 허가를 받았는지 확인
    그리고 허가를 받았다면 해당 토큰을 그에게 전송

transfer와 takeOwnership 모두 동일한 전송 로직 -> 순서만 반대
(전자는 토큰을 보내는 사람이 함수를 호출; 후자는 토큰을 받는 사람이 호출)

## 오버플로우 막기
### 오버플로우와 언더플로우
#### 오버플로우가 무엇인가?
8비트 데이터를 저장할 수 있는 uint8 하나를 가지고 있다고 했을때,
저장할 수 있는 가장 큰 수는 이진수로 11111111(또는 십진수로 2^8 - 1 = 255)이다
```
uint8 number = 255;
number++;
```
이진수 11111111에 1을 더하면, 이 수는 00000000으로 돌아간다 -> 오버플로우

### SafeMath 사용하기
OpenZeppelin에서 기본적으로 이런 문제를 막아주는 SafeMath라고 하는 라이브러리를 만들었다
라이브러리(Library)는 솔리디티에서 특별한 종류의 컨트랙트
유용하게 사용되는 경우 중 하나는 기본(native) 데이터 타입에 함수를 붙일 때
```
using SafeMath for uint256;

uint256 a = 5;
uint256 b = a.add(3); // 5 + 3 = 8
uint256 c = a.mul(2); // 5 * 2 = 10
```

```
library SafeMath {

  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    if (a == 0) {
      return 0;
    }
    uint256 c = a * b;
    assert(c / a == b);
    return c;
  }

  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return c;
  }

  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
}
```
assert는 조건을 만족하지 않으면 에러를 발생시킨다는 점에서 require와 비슷
assert와 require의 차이점은 require는 함수 실행이 실패하면 남은 가스를 사용자에게 되돌려 주지만, assert는 그렇지 않다는 것
```
using SafeMath for uint;
// 우리는 이제 이 메소드들을 아무 uint에서나 쓸 수 있네.
uint test = 2;
test = test.mul(3); // test는 이제 6이 되네
test = test.add(5); // test는 이제 11이 되네
```
SafeMath의 add, sub, mul, 그리고 div는 4개의 기본 수학 연산을 하는 함수이지만, 
오버플로우나 언더플로우가 발생하면 에러를 발생시키는 것

## 주석(Comment)
```
// 이게 한 줄 주석
contract CryptoZombies {
  /* This is a multi-lined comment. I'd like to thank all of you
    who have taken your time to try this programming course.
    I know it's free to all of you, and it will stay free
    forever, but we still put our heart and soul into making
    this as good as it can be.

    Know that this is still the beginning of Blockchain development.
    We've come very far but there are so many ways to make this
    community better. If we made a mistake somewhere, you can
    help us out and open a pull request here:
    https://github.com/loomnetwork/cryptozombie-lessons

    Or if you have some ideas, comments, or just want to say
    hi - drop by our Telegram community at https://t.me/loomnetworkdev
  */
```
natspec
```
/// @title 기본적인 산수를 위한 컨트랙트
/// @author H4XF13LD MORRIS 💯💯😎💯💯
/// @notice 지금은 곱하기 함수만 추가한다.
contract Math {
  /// @notice 2개의 숫자를 곱한다.
  /// @param x 첫 번쨰 uint.
  /// @param y 두 번째 uint.
  /// @return z (x * y) 곱의 값
  /// @dev 이 함수는 현재 오버플로우를 확인하지 않는다.
  function multiply(uint x, uint y) returns (uint z) {
    // 이것은 일반적인 주석으로, natspec에 포함되지 않는다.
    z = x * y;
  }
}
```
