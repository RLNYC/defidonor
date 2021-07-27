pragma solidity ^0.6.12;

import "./Token.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";

contract Charity is ERC721 {
  Token private token;
  AggregatorV3Interface internal priceFeed;

  /**
  * Network: Kovan
  * Aggregator: ETH/USD
  * Address: 0x9326BFA02ADD2366b30bacB125260Af641031331
  */
  constructor(Token _token) ERC721("DeFi Donor", "DFD") public {
    token = _token;
    priceFeed = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331);
  }
  
  event Receipt (
    uint receiptId,
    uint date,
    string receiptURI,
    address sender,
    address receipt
  );

  function createReceiptandMint(string memory _tokenURI, address payable _receipt) public payable {
    _receipt.transfer(msg.value);

    uint _tokenId = totalSupply().add(1);
    _safeMint(msg.sender, _tokenId);
    _setTokenURI(_tokenId, _tokenURI);

    token.mint(_receipt, msg.value);

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