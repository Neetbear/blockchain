## 기타 개발 툴
https://github.com/ConsenSys/ethereum-developer-tools-list/blob/master/README_Korean.md

### truffle 이더리움 테스트넷에 배포
https://velog.io/@repedore/ruffle%EA%B3%BC-TestNet-%EC%97%B0%EA%B2%B0%ED%95%98%EA%B8%B0-feat.-ropsten
https://kimsfamily.kr/331

infura.io/ -> 테스트넷에 우리의 코드를 배포하기 위해서는 블록체인에 접속을 해야 하는데 Inura라는 홈페이지에서 키 제공

npm install @truffle/hdwallet-provider

### migration & truffle react
https://muna76.tistory.com/113
truffle 에서 react 사용하기
truffle unbox react

Compile:              truffle compile
Migrate:              truffle migrate
Test contracts:       truffle test
Test dapp:            cd client && npm test
Run dev server:       cd client && npm run start
Build for production: cd client && npm run build

### myetherwallet


////////////////////////////////////////
다시 컴파일하고 다시 배포하면 이력같은게 남는데 그 처리해주는 쪽이 migrations

////////////////////////////////////////
truffle에서도 ganache처럼 제공
PS C:\Users\User\Documents\GitHub\blockchain\truffle> truffle develop
Truffle Develop started at http://127.0.0.1:9545/

Accounts:
(0) 0xc02ae16d8b3898d7bd12fbd6fc130f47e05ca6af
(1) 0x3d7cfcf156fd06eebd90240efdc8168a16a932f2
(2) 0x724bad8c64653f5fbbda318dc6881fad5d5370b2
(3) 0xbcc3efd92beb27cb648003efa0de6dec9bbf6926
(4) 0x8bff56620528003021607cab3ef017ca48885b2b
(5) 0x21750e372ac303c2f4bf760962fee13745456904
(6) 0xe77a8c66ff1db2ed33c850564a262155cf4839f0
(7) 0x7e0d43af695cef5c6a8b10ac2ddaabd0e5b5ec28
(8) 0x6052a90fe2ff0c3384287b64768067121a64246e
(9) 0x77092bdd7904026041b1f96f7faeaf78835d7575

Private Keys:
(0) b2bb5a35af4eff000b49bf0826aefc8a64f795da0213f20bb8cf5b7b3ae7fb2c
(1) ecc30b64cd3a49f755bb1853ccbc7d82067c25fba4348d126b528483fbe85320
(2) 060068f6c3ea7bd47aa2375ca9b7b1455eabc88dd060813b88db638d26d44bca
(3) 898cca58b7e27632aa69c6397ad014b9c537df0596ba69a4f8491d7fb7821573
(4) 7fb4b971e47f5907d6d6497412b1dd9ed32387fcd02a78dc72d37209d5d72897
(5) 3e1a7e3a1952f0c1785035a650aac91ae926ce7c754606fb14512e57364f5544
(6) e4a670c8b117ceac977b9292f89e84ce114780aaf5a7abcd9a0d27f52e02f1db
(7) be2558e48505e424d2fc929fb1a9c71aa2ab4c05901d02ce7a74400e28cd2dbc
(8) 8187d47a704e7e2651bcfe728dd52a7ddc1ff3721cc1fbc8b54715e6dcbf77f9
(9) 2b80262f08e97a73d13a7fac6e82add96ae57294d048ba10164ccc5ef18017da

Mnemonic: strong glass water midnight soldier catalog system okay concert hotel circle tool

⚠️  Important ⚠️  : This mnemonic was created for you by Truffle. It is not secure.       
Ensure you do not use it on production blockchains, or else you risk losing funds. 

//////////////////////////////////////
mocha
https://mochajs.org/#hooks
beforeeach
before
aftereach
after

BN { negative: 0, words: [ 0, <1 empty item> ], length: 1, red: null }
console.log(`value1 : ${value1}`); -> BN의 words의 값만 가져온다?