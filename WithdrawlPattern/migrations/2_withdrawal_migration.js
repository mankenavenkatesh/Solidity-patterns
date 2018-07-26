var WithdrawalContract = artifacts.require("./WithdrawalContract.sol");

module.exports = function(deployer) {
  deployer.deploy(WithdrawalContract);
};
