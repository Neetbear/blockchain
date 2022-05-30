## web3.js - 메타마스크 연결
npm install web3

### callback Promises Events
```
web3.eth.sendTransaction({from: '0x123...', data: '0x432...'})
.once('sending', function(payload){ ... })
.once('sent', function(payload){ ... })
.once('transactionHash', function(hash){ ... })
.once('receipt', function(receipt){ ... })
.on('confirmation', function(confNumber, receipt, latestBlockHash){ ... })  // 처리 잘됨
.on('error', function(error){ ... })                                        // 에러 처리
.then(function(receipt){
    // will be fired once the receipt is mined
});
```

### glossary
https://web3js.readthedocs.io/en/v1.7.3/glossary.html#