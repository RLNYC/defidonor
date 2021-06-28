const Charity = artifacts.require("Charity");

module.exports = async function(deployer){
	deployer.deploy(Charity);
};