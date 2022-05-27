// SPDX-License-Identifier: MIT
pragma solidity >=0.4.19;

contract MyTestContract {
    event Transfer(address indexed _from, address indexed _to, uint256 _amout);

    function balanceOf(address _owner) public view returns (uint256) {
        return _owner.balance;
    }

    function myBalanceOf() public view returns (uint256) {
        return msg.sender.balance;
    }

    function transferBalance(address  payable _to, uint256 _amount) public payable {
        // 송금
        require(msg.sender.balance >= _amount);
        _to.transfer(_amount * (10 ** 18));
        emit Transfer(msg.sender, _to, _amount);
    }
}