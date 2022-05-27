abi -> smart contract를 json 형태로

interface -> smart phone을 쓸때 전자회로가 어떻게 돌아가는지 몰라도 사용가능
             smart phone이 제공하는 interface만 사용할줄 알면 내부 구조는 몰라도 사용 가능하다
             api application programming interface 

기본 데이터형 제외하면 대다수가 참조형

web3.js(DApp의 자바스크립트 프론트엔드)

msg.data(bytes) - call data
msg.disc(address payable) - 메시지를 보내는 주소
msg.sig (bytes4) - 타깃 함수시그니처
msg.value (uint) - 전송된 wei의 양
tx.origin - 트랜잭션의 발신자