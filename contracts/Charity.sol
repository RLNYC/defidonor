pragma solidity ^0.6.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Charity is ERC721 {
  constructor() ERC721("DeFi Donor", "DFD") public {}
  
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

    emit Receipt(_tokenId, now, _tokenURI, msg.sender, _receipt);
  }
}