pragma solidity ^0.4.24;

contract WithdrawalContract {
    address public richest;
    uint public moneySent;
    mapping(address => uint) pendingWithdrawals;

    constructor() public payable{
        richest = msg.sender;
        moneySent = msg.value;
    }

    function becomeRichest() public payable returns (bool) {

        if(msg.value > moneySent){
            pendingWithdrawals[richest] += msg.value;
            richest = msg.sender;
            moneySent = msg.value;
            return true;
        }
        else {
            return false;
        }
    }

    function withdrawMoney() public {
        uint amount = pendingWithdrawals[msg.sender];        
        pendingWithdrawals[msg.sender] = 0;
        msg.sender.transfer(amount);
    }
}