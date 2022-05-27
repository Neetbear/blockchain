let abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":true,"internalType":"address","name":"_to","type":"address"},{"indexed":false,"internalType":"uint256","name":"_amout","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"myBalanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"transferBalance","outputs":[],"stateMutability":"payable","type":"function"}];

let bytecode = '0x608060405234801561001057600080fd5b50610201806100206000396000f3fe6080604052600436106100345760003560e01c806356a6d9ef1461003957806370a082311461004e578063a8eb44b614610088575b600080fd5b61004c610047366004610152565b61009c565b005b34801561005a57600080fd5b5061007661006936600461017c565b6001600160a01b03163190565b60405190815260200160405180910390f35b34801561009457600080fd5b503331610076565b33318111156100aa57600080fd5b6001600160a01b0382166108fc6100c983670de0b6b3a764000061019e565b6040518115909202916000818181858888f193505050501580156100f1573d6000803e3d6000fd5b506040518181526001600160a01b0383169033907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b80356001600160a01b038116811461014d57600080fd5b919050565b6000806040838503121561016557600080fd5b61016e83610136565b946020939093013593505050565b60006020828403121561018e57600080fd5b61019782610136565b9392505050565b60008160001904831182151516156101c657634e487b7160e01b600052601160045260246000fd5b50029056fea2646970667358221220086ae991eca7eb910190ab8bd3d2b58c9abdb2596488155ead799ac076c96e7364736f6c634300080e0033';

let testTransferContract = web3.eth.contract(abi);

let testTransferContractInstance = testTransferContract.new({
    from:web3.eth.accounts[0],
    data:bytecode,
    gas:'3000000'
}, function (e, contract) {
    console.log(e, contract);
    if (typeof contract.address !== undefined) {
        console.log('Contract mined!!! address : ' + contract.address + ' transaction hash : ' + contract.transactionHash);
    }
});

