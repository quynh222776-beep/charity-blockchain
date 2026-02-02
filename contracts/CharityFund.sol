// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract CharityFund {
    address public owner;
    uint public totalDonated;

    mapping(address => uint) public donations;

    event Donated(address indexed donor, uint amount);

    constructor() {
        owner = msg.sender;
    }

    // 👉 DONATE (MetaMask gửi ETH)
    function donate() external payable {
        require(msg.value > 0, "Must send ETH");

        donations[msg.sender] += msg.value;
        totalDonated += msg.value;

        emit Donated(msg.sender, msg.value);
    }

    // 👉 RÚT TIỀN VỀ VÍ TỪ THIỆN
    function withdraw(address payable wallet, uint amount) external {
        require(msg.sender == owner, "Not owner");
        require(address(this).balance >= amount, "Not enough balance");

        wallet.transfer(amount);
    }

    function getBalance() external view returns (uint) {
        return address(this).balance;
    }
}