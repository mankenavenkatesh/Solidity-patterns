var WithdrawalContract = artifacts.require("WithdrawalContract");

contract("WithdrawalContract", async (accounts)=>{

    let contractOwner = accounts[0];
    let addressA = accounts[1];
    let addressB = accounts[2];
    let addressC = accounts[3];

    it("Validate become richest", async () => {
        let instance = await WithdrawalContract.deployed({from : contractOwner, value : web3.toWei(0.5, "ether")});
        let currentRichest = await instance.richest();        
        assert.equal(currentRichest, contractOwner);
        let isRichest = await instance.becomeRichest({from : addressA, value : web3.toWei(1, "ether")});
        let beforeRichest = web3.fromWei(web3.eth.getBalance(contractOwner), 'ether').toNumber();
        await instance.withdrawMoney({from : contractOwner});
        let afterRichest = web3.fromWei(web3.eth.getBalance(contractOwner), 'ether').toNumber();
        assert.equal(afterRichest, beforeRichest+ 1);
    }) 
});