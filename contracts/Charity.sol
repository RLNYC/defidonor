pragma solidity ^0.6.12;

import "./Token.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";

contract Charity is ERC721 {
  Token private token;
  AggregatorV3Interface internal priceFeed;

  uint public holderCount = 0;
  mapping(uint => address) public holderList;
  uint256 REWARDAMOUNT = 1000000000000000000;     // 1 Tokens

  /**
  * Network: Kovan Testnet
  * Aggregator: ETH/USD
  * Address: 0x9326BFA02ADD2366b30bacB125260Af641031331
  */
  /**
  * Network: Rinkeby Testnet
  * Aggregator: ETH/USD
  * Address: 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
  */
  constructor(Token _token) ERC721("DeFi Donor", "DFD") public {
    token = _token;
    priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
  }
  
  event Receipt (
    uint receiptId,
    uint date,
    string receiptURI,
    address sender,
    address receipt
  );

  function createReceiptandMint(string memory _tokenURI, address payable _receipt) public payable {
    //_receipt.transfer(msg.value);

    // Send reward
    for(uint i = 1; i < holderCount + 1; i++){
      uint256 percent = (token.balanceOf(holderList[i]) * 100) / token.totalSupply();
      uint256 amount = (REWARDAMOUNT * percent) / 100;
      token.mint(holderList[i], amount);
    }

    if(token.balanceOf(_receipt) == 0){
      holderCount++;
      holderList[holderCount] = _receipt;
    }

    // Create NFT
    uint _tokenId = totalSupply().add(1);
    _safeMint(msg.sender, _tokenId);
    _setTokenURI(_tokenId, _tokenURI);

    // Eth value times 3000
    token.mint(_receipt, msg.value * 3000);

    emit Receipt(_tokenId, now, _tokenURI, msg.sender, _receipt);
  }

  // Returns the latest price
  function getThePrice() public view returns (int) {
    (
        uint80 roundID, 
        int price,
        uint startedAt,
        uint timeStamp,
        uint80 answeredInRound
    ) = priceFeed.latestRoundData();
    return price;
  }
}