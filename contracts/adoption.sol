pragma solidity ^0.5.0;

contract adoption{

    address[16] public adoptee;

    function adopt(uint petid) public returns (uint) {
        adoptee[petid] = msg.sender;
        return petid;
    }

    function getadoptee() public view returns (address[16] memory) {
        return adoptee;
    }
}