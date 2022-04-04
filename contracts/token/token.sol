pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract TokenForDefi is ERC20,ERC20Burnable{
    constructor()ERC20("DefiToken","DT"){
        _mint(msg.sender,1000*10**decimals());//decimals()==18
    }
    function mintToken(uint _amount)public{
        require(_amount<=10*10**decimals());
        _mint(msg.sender,_amount);
    }
    function burn(uint _amount)public override {
        _burn(msg.sender,_amount);
    }
}