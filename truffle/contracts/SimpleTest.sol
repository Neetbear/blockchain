// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract SimpleTest {
  uint256 value1;
  uint256 value2;

  address public owner;

  constructor () {
      owner = msg.sender;
  }
  
  function setValue(uint256 x, uint256 y) public {
      value1 = x;
      value2 = y;
  }

  function getValue() public view returns(uint256) {
      return value1;
  }
}
