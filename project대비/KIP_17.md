KIP-7(klay의 ERC-20) -> 표준 토큰
KIP-17(klay의 ERC-721)-> nft 토큰(erc 20 + token ID + 메타데이터JSON)
    token ID : nft에 붙는 개별 식별 번호 -> nft 중복 방지
    메타데이터JSON : nft에 넣을 정보를 담는 그릇 (nft 이름 정보 등등)

IPFS = 분산 저장소(p2p 토렌트 느낌)
    위변조가 불가능 
    블록체인 안에다가 무언가를 저장하면 너무 비싸니까 
    이미지나 텍스트는 분산저장소에 넣어두고 분산저장소에 가는 경로를 저장해두는 편

과정 
1) 이미지를 IPFS에 올린다
2) metadata JSON 파일을 IPFS에 올린다
3) KIP17 코드를 블록체인에 올린다
4) NFT를 민트한다
5) 클레이튼 스코프 & Opensea 에서 확인한다

준비물
- 소스코드 / NFT 이미지 / metadata.JSON 파일
- Pinata API -> IPFS 용 
- Kaikas -> 웹지갑 
- 테스트 클레이 
- Klaytn IDE
- Klaytnscope -> 조회
- Opensea -> 확인 사이트