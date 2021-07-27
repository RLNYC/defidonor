const Token = artifacts.require("Token");
const Charity = artifacts.require("Charity");

module.exports = async function(deployer){
	await deployer.deploy(Token);
    const token = await Token.deployed();

    await deployer.deploy(Charity, token.address);
    const charity = await Charity.deployed();

    await token.passMinterRole(charity.address);
};