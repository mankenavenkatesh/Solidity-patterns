# Withdrawal from Contracts

Problem Statement - 
Let's take the example contract where the goal is to send the most money to the contract in order to become the “richest”. To become richest, you have to send more money than the money sent by previous richest person.

Most intuitive way of smart contract is
```
pragma solidity >0.4.24;

contract SendContract {
    address public richest;
    uint public mostSent;

    constructor() public payable {
        richest = msg.sender;
        mostSent = msg.value;
    }

    function becomeRichest() public payable returns (bool) {
        if (msg.value > mostSent) {
            // This line can cause problems (explained below).
            richest.transfer(msg.value);
            richest = msg.sender;
            mostSent = msg.value;
            return true;
        } else {
            return false;
        }
    }
}
```

Notice that, in this example, an attacker could trap the contract into an unusable state by causing richest to be the address of a contract that has a fallback function which fails (e.g. by using revert() or by just consuming more than the 2300 gas stipend). That way, whenever transfer is called to deliver funds to the “poisoned” contract, it will fail and thus also becomeRichest will fail, with the contract being stuck forever.



## Solution 
The recommended method of sending funds after an effect is using the withdrawal pattern. 
```
pragma solidity >0.4.24;

contract WithdrawalContract {
    address public richest;
    uint public mostSent;

    mapping (address => uint) pendingWithdrawals;

    constructor() public payable {
        richest = msg.sender;
        mostSent = msg.value;
    }

    function becomeRichest() public payable returns (bool) {
        if (msg.value > mostSent) {
            pendingWithdrawals[richest] += msg.value;
            richest = msg.sender;
            mostSent = msg.value;
            return true;
        } else {
            return false;
        }
    }

    function withdraw() public {
        uint amount = pendingWithdrawals[msg.sender];
        // Remember to zero the pending refund before
        // sending to prevent re-entrancy attacks
        pendingWithdrawals[msg.sender] = 0;
        msg.sender.transfer(amount);
    }
}
```