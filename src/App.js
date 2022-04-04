import { useState, useEffect } from 'react';
import { ethers, utils } from "ethers";
import abi from "./contract/stakingContract.json";
import _tokenAbi from "./contract/TokenForDefi.json";

function App() {
  const contractAddress='0x3716F8dEe455DaE74fF207f662a77B249176e988';
  const tokenaddress='0x072879584049FAf96A8939Cd60Bad6B4CD5860f5';
  const contractABI=abi.abi;
  const tokenAbi=_tokenAbi.abi;

  const [isWallectConnect,setWallectConnet]=useState(false);
  const [inputValue,setInPutValue]=useState({_amount:""});
  const [yourWalletAddress,setYourWalletAddress]=useState(null);

  const checkWalletConnect=async()=>{
    try{
      if (window.ethereum){
      const accounts=await window.ethereum.request({method: 'eth_requestAccounts'});
      const account = accounts[0];
      setWallectConnet(true);
      setYourWalletAddress(account);
      console.log("Account Connected: ", account);
    }else{
      console.log("No Metamask detected");
      }
    }catch(error){
      console.log(error);
    }
  }
  const stake=async(event)=>{
    event.preventDefault();
    try{
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const Contract = new ethers.Contract(contractAddress, contractABI, signer);
        const tokenContract = new ethers.Contract(tokenaddress, tokenAbi, signer);

        let stakingAmount=utils.parseEther(inputValue._amount);
        const txn0=await tokenContract.approve("0x3716F8dEe455DaE74fF207f662a77B249176e988",stakingAmount);
        console.log("approving");
        await txn0.wait();
        console.log("approve done",txn0.hash);
        const txn=await Contract.stake7Days(stakingAmount);
        console.log("adding");
        await txn.wait();
        console.log("done",txn.hash);
      }else{
        console.log("Ethereum object not found, install Metamask.");
      }
    }catch(error){
      console.log(error);
    }
  }
  const unstake=async(event)=>{
    event.preventDefault();
    try{
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const Contract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn=await Contract.unstake();
        console.log("unstaking");
        await txn.wait();
        console.log("done",txn.hash);
      }else{
        console.log("Ethereum object not found, install Metamask.");
      }
    }catch(error){
      console.log(error);
    }
  }
  const mint=async(event)=>{
    event.preventDefault();
    try{
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const Contract = new ethers.Contract(tokenaddress, tokenAbi, signer);

        let mAmount=utils.parseEther("5");
        const txn=await Contract.mintToken(mAmount);
        console.log("minting");
        await txn.wait();
        console.log("done",txn.hash);
      }else{
        console.log("Ethereum object not found, install Metamask.");
      }
    }catch(error){
      console.log(error);
    }
  }
  
  const handleInputChange = (event) => {
    setInPutValue(prevFormData => ({ ...prevFormData, [event.target.name]: event.target.value }));
  };
  useEffect(() => {
    checkWalletConnect();
  }, []);
  return (
    <main>
      <h2>staking pool (On Rinkeby testnet)</h2>
      <div>
        {isWallectConnect &&(<p>your address:{yourWalletAddress} </p>)}
        {!isWallectConnect &&(<button onClick={checkWalletConnect}> connect wallet </button>)}
      </div>
      <div>
        <h4>Let's mint some coins for free to join the staking.</h4>
        <button onClick={mint}>mint</button>
      </div>
      <div>
        <h4>Stake the coin and get the reward.(Min stake period is 7 days)</h4>
        <input
          type="text"
          onChange={handleInputChange}
          name="_amount"
          placeholder="stake amount"
          value={inputValue._amount}/>
          <button onClick={stake}>stake</button>
      </div>
      <div>
        <h4>Unstake and claim the reward.</h4>
        <button onClick={unstake}>unstake</button>
      </div>
    </main>
  );
}

export default App;
