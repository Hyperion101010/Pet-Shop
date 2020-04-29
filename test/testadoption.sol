pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/adoption.sol";

contract testadoption {
    adoption Aadoption = adoption(DeployedAddresses.adoption());

    uint expectedpetid = 8;

    address expectedadoptee = address(this);

    function testusercanadopt()  public {
        uint returnedid = Aadoption.adopt(expectedpetid);

        Assert.equal(returnedid, expectedpetid, "Adopted ids should match");
    }

    function testgetadoption() public {
        address adoptedad = Aadoption.adoptee(expectedpetid);

        Assert.equal(adoptedad, expectedadoptee, "owner ids should match");
        
    }

    function testadopteebyidinarray() public {
        address[16] memory adoptee = Aadoption.getadoptee();

        Assert.equal(adoptee[expectedpetid], expectedadoptee, "ids should match");
    }

}