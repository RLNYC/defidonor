pragma solidity ^0.6.12;

contract Charity {
  uint public receiptCount = 0;
  mapping(uint => NFTReceipt) public receiptList;

  constructor() public {}

  struct NFTReceipt {
    uint receiptId;
    uint date;
    string asset;
    uint value;
    address send;
    address receipt;
  }
  
  event Receipt (
    uint receiptId,
    uint date,
    string asset,
    uint value,
    address sender,
    address receipt
  );

  function createReceipt(uint _value, string memory _asset, address payable _receipt) public payable {
    _receipt.transfer(msg.value);
    receiptCount++;

    receiptList[receiptCount] = NFTReceipt(receiptCount, now, _asset, _value, msg.sender, _receipt);
    emit Receipt(receiptCount, now, _asset, _value, msg.sender, _receipt);
  }
 
}