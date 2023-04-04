// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import '@opengsn/contracts/src/ERC2771Recipient.sol';
// import "hardhat/console.sol";

contract Gasless is ERC2771Recipient{
    address payable public owner;
    uint256 public value;

    event Withdrawal(uint amount, uint when);

    constructor(address _forwarder) {
        _setTrustedForwarder(_forwarder);
    }

    function withdraw() public {
        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);
        owner = payable(msg.sender);
    }

    function addValue() public {
        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);
        value += value;
    }
}
