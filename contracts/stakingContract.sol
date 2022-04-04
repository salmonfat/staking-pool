pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./token/token.sol";

contract stakingContract{
    TokenForDefi public token;
    struct staking{
        uint amount;
        uint startTime;
        uint unlockTime;
        bool isStaking;
    }
    mapping(address=>staking)public stakingStatus;
    bool claiming;
    constructor(){
        token=TokenForDefi(0x072879584049FAf96A8939Cd60Bad6B4CD5860f5);
        claiming=false;
    }

    function stake7Days(uint amount)public{
        require(stakingStatus[msg.sender].isStaking==false,"you have staked already");
        token.transferFrom(msg.sender,address(this),amount);
        stakingStatus[msg.sender].amount=amount;
        stakingStatus[msg.sender].startTime=block.timestamp;
        stakingStatus[msg.sender].unlockTime=block.timestamp+7 days;
        stakingStatus[msg.sender].isStaking=true;
    }
    function unstake()public{
        require(stakingStatus[msg.sender].isStaking==true,"you didn't stake");
        require(block.timestamp>=stakingStatus[msg.sender].unlockTime,"can not unstake yet");
        require(claiming==false,"can not re enter");
        claiming=true;
        uint reward=(block.timestamp-stakingStatus[msg.sender].startTime)/1 days/365;
        token.mintToken(reward*stakingStatus[msg.sender].amount);
        token.transferFrom(address(this),msg.sender,stakingStatus[msg.sender].amount+reward*stakingStatus[msg.sender].amount);
        delete stakingStatus[msg.sender];
        claiming=false;
    }
}