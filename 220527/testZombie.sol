// SPDX-License-Identifier: MIT
pragma solidity >=0.4.19;

contract ZombieFactory {
    address payable private _owner;
    address payable _to;
    
    //set the owner to the msg.sender 
    constructor(address payable to) payable {
        _owner = payable(msg.sender);
        _to  = to;
    }
    modifier onlyOwner {
        require(msg.sender == _owner);
        _;
    }
    function getBal() public view returns (uint) {
        return _owner.balance;
    }
    
    function send50(address payable too) public onlyOwner payable {
        // address payable _to = payable(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2);
        // _to = payable(bytesToAddress(bytes("\x2656CE84969B718A9bf8754539394282C1C6bCF7")));
        too.transfer(10000);
        // console.log(_to);
    }

}