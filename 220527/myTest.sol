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

    function transferBalance(address _to, uint256 _amount) public {
        // 송금
        require(msg.sender.balance >= _amount);
        // msg.sender.transfer(_amount);
        bool sent = payable(_to).send(_amount);
        require(sent, "transfer failed");
        emit Transfer(msg.sender, _to, _amount);
    }
}