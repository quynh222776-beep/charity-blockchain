// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CharityFund {
    event DonationReceived(address indexed donor, uint256 amount);

    receive() external payable {
        emit DonationReceived(msg.sender, msg.value);
    }

    function donate() external payable {
        require(msg.value > 0, "Amount must be > 0");
        emit DonationReceived(msg.sender, msg.value);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
