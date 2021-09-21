const { time, balance, expectRevert } = require('@openzeppelin/test-helpers');

const delay = duration => new Promise(resolve => setTimeout(resolve, duration));
const { expect } = require("chai");  

const { loadFixture } = require('ethereum-waffle');
const dataUriToBuffer = require('data-uri-to-buffer');
const { ethers } = require('hardhat');
const ether = require('@openzeppelin/test-helpers/src/ether');

let S; //Souls

let dfPrice = "0.01"; // ~$30
let dxPrice = "0.068"; // ~$200

describe("Souls", function() {
  let s;
  let provider;
  let signers;
  let accounts;
  let snapshot;
  const gasLimit = 30000000; // if gas limit is set, it doesn't superfluosly run estimateGas, slowing tests down.

  this.beforeAll(async function() {
    provider = new ethers.providers.Web3Provider(web3.currentProvider);
    signers = await ethers.getSigners();
    accounts = await Promise.all(signers.map(async function(signer) {return await signer.getAddress(); }));
    S = await ethers.getContractFactory("Souls");
    s = await S.deploy("Souls", "SOULS", accounts[2], accounts[3], '100', '1941431093', '0xaF69610ea9ddc95883f97a6a3171d52165b69B03'); // wide campaign window for tests. dates tested separately
    await s.deployed();
    snapshot = await provider.send('evm_snapshot', []);
  });

 this.beforeEach(async function() {
    await provider.send('evm_revert', [snapshot]);
    snapshot = await provider.send('evm_snapshot', []);
  });

  it('S: proper contract created', async () => {
    expect(await s.name()).to.equal("Souls");
    expect(await s.symbol()).to.equal("SOULS");
    expect(await s.balanceOf("0xaF69610ea9ddc95883f97a6a3171d52165b69B03")).to.equal("1");
    expect(await s.claimedACIDs("86944833354306826451453519009172227432197817959411860297499850535918774474487")).to.be.true;
  });

  it('S: mint sketch', async () => {
    const tx = await s.connect(signers[1]).mintSoul({value: ethers.utils.parseEther(dfPrice), gasLimit});
    const receipt = await tx.wait();
    const tokenId = receipt.events[0].args.tokenId.toString();

    expect(await s.ownerOf(tokenId)).to.equal(accounts[1]);

    const t = await s.soulsType(tokenId);
    expect(t).to.be.false;

    const blob = await s.tokenURI(tokenId);
    const decoded = dataUriToBuffer(blob);
    const j = JSON.parse(decoded.toString());

    expect(j.description).to.equal("Paintings of forgotten souls by various simulated minds that try to remember those who they once knew in the default world.");
  });

  it('S: not enough funds to mint', async () => {
    await expect(s.connect(signers[1]).mintSoul({value: ethers.utils.parseEther('0.00001'), gasLimit})).to.be.revertedWith('MORE ETH NEEDED');
  });

  it('S: mint full soul', async () => {
    const tx = await s.connect(signers[1]).mintSoul({value: ethers.utils.parseEther(dxPrice), gasLimit});
    const receipt = await tx.wait();
    const tokenId = receipt.events[0].args.tokenId.toString();

    expect(await s.ownerOf(tokenId)).to.equal(accounts[1]);

    const t = await s.soulsType(tokenId);
    expect(t).to.be.true;

  });

  it('S: mint 10 soul sketches', async () => {
    await s.connect(signers[1]).mintSoul({value: ethers.utils.parseEther(dfPrice), gasLimit});
    await s.connect(signers[1]).mintSoul({value: ethers.utils.parseEther(dfPrice), gasLimit});
    await s.connect(signers[1]).mintSoul({value: ethers.utils.parseEther(dfPrice), gasLimit});
    await s.connect(signers[1]).mintSoul({value: ethers.utils.parseEther(dfPrice), gasLimit});
    await s.connect(signers[1]).mintSoul({value: ethers.utils.parseEther(dfPrice), gasLimit});
    await s.connect(signers[1]).mintSoul({value: ethers.utils.parseEther(dfPrice), gasLimit});
    await s.connect(signers[1]).mintSoul({value: ethers.utils.parseEther(dfPrice), gasLimit});
    await s.connect(signers[1]).mintSoul({value: ethers.utils.parseEther(dfPrice), gasLimit});
    await s.connect(signers[1]).mintSoul({value: ethers.utils.parseEther(dfPrice), gasLimit});
    const tx = await s.connect(signers[1]).mintSoul({value: ethers.utils.parseEther(dfPrice), gasLimit});
    const receipt = await tx.wait();
    const tokenId = receipt.events[0].args.tokenId.toString();

    expect(await s.ownerOf(tokenId)).to.equal(accounts[1]);

  });

  it('S: mint 10 fully painted souls', async () => {
    await s.connect(signers[1]).mintSoul({value: ethers.utils.parseEther(dxPrice), gasLimit});
    await s.connect(signers[1]).mintSoul({value: ethers.utils.parseEther(dxPrice), gasLimit});
    await s.connect(signers[1]).mintSoul({value: ethers.utils.parseEther(dxPrice), gasLimit});
    await s.connect(signers[1]).mintSoul({value: ethers.utils.parseEther(dxPrice), gasLimit});
    await s.connect(signers[1]).mintSoul({value: ethers.utils.parseEther(dxPrice), gasLimit});
    await s.connect(signers[1]).mintSoul({value: ethers.utils.parseEther(dxPrice), gasLimit});
    await s.connect(signers[1]).mintSoul({value: ethers.utils.parseEther(dxPrice), gasLimit});
    await s.connect(signers[1]).mintSoul({value: ethers.utils.parseEther(dxPrice), gasLimit});
    await s.connect(signers[1]).mintSoul({value: ethers.utils.parseEther(dxPrice), gasLimit});
    const tx = await s.connect(signers[1]).mintSoul({value: ethers.utils.parseEther(dxPrice), gasLimit});
    const receipt = await tx.wait();
    const tokenId = receipt.events[0].args.tokenId.toString();

    expect(await s.ownerOf(tokenId)).to.equal(accounts[1]);
  });

  it('S: mint 5/5 sketch/full souls', async () => {
    await s.connect(signers[1]).mintSoul({value: ethers.utils.parseEther(dxPrice), gasLimit});
    await s.connect(signers[2]).mintSoul({value: ethers.utils.parseEther(dxPrice), gasLimit});
    await s.connect(signers[3]).mintSoul({value: ethers.utils.parseEther(dxPrice), gasLimit});
    await s.connect(signers[4]).mintSoul({value: ethers.utils.parseEther(dxPrice), gasLimit});
    const dxTx = await s.connect(signers[5]).mintSoul({value: ethers.utils.parseEther(dxPrice), gasLimit});
    await s.connect(signers[1]).mintSoul({value: ethers.utils.parseEther(dfPrice), gasLimit});
    await s.connect(signers[2]).mintSoul({value: ethers.utils.parseEther(dfPrice), gasLimit});
    await s.connect(signers[3]).mintSoul({value: ethers.utils.parseEther(dfPrice), gasLimit});
    await s.connect(signers[4]).mintSoul({value: ethers.utils.parseEther(dfPrice), gasLimit});
    const tx = await s.connect(signers[5]).mintSoul({value: ethers.utils.parseEther(dfPrice), gasLimit});
    const receipt = await tx.wait();
    const tokenId = receipt.events[0].args.tokenId.toString();

    const dxReceipt = await dxTx.wait();
    const dxTokenId = dxReceipt.events[0].args.tokenId.toString(); 

    expect(await s.ownerOf(tokenId)).to.equal(accounts[5]);
    expect(await s.ownerOf(dxTokenId)).to.equal(accounts[5]);
  });

  it('S: test withdraw of funds', async () => {
    await s.connect(signers[3]).mintSoul({value: ethers.utils.parseEther(dxPrice), gasLimit});
    await expect(s.connect(signers[1]).withdrawETH()).to.be.revertedWith("NOT_COLLECTOR");
    const tx = await s.connect(signers[2]).withdrawETH();
    await expect(tx).to.changeEtherBalance(signers[3], ethers.utils.parseEther(dxPrice));
  });

  it("S: hit buyable cap", async () => {
    for(let i = 0; i < 96; i+=1) {
      await s.connect(signers[1]).mintSoul({value: ethers.utils.parseEther(dxPrice), gasLimit});
    }

    await expect(s.connect(signers[1]).mintSoul({value: ethers.utils.parseEther(dxPrice), gasLimit})).to.be.revertedWith("MAX_SOLD_96");
    await s.connect(signers[1]).mintSoul({value: ethers.utils.parseEther(dfPrice), gasLimit});
    expect(await s.buyableSoulSupply()).to.equal('96');
  });

  it("S: test start date + end date", async () => {
    const s2 = await S.deploy("Souls", "SOULS", accounts[2], accounts[3], '2541431093', '3541431094','0xaF69610ea9ddc95883f97a6a3171d52165b69B03'); // wide campaign window for tests. dates tested separately
    await s2.deployed();

    await expect(s2.connect(signers[1]).mintSoul({value: ethers.utils.parseEther(dfPrice), gasLimit})).to.be.revertedWith("NOT_STARTED");
    await time.increaseTo("3541431095"); // 1 sec after end campaign
    await expect(s2.connect(signers[1]).mintSoul({value: ethers.utils.parseEther(dfPrice), gasLimit})).to.be.revertedWith("ENDED");
  });


  it("S: test claim success", async () => {
    const s2 = await S.deploy("Souls", "SOULS2", accounts[2], accounts[3], '100', '3541431094', '0xaF69610ea9ddc95883f97a6a3171d52165b69B03'); // wide campaign window for tests. dates tested separately
    await s2.deployed();
    const tx = await s2.connect(signers[1]).mintSoul({value: ethers.utils.parseEther(dxPrice), gasLimit});
    const receipt = await tx.wait();
    const tokenId = receipt.events[0].args.tokenId.toString();

    const s3 = await S.deploy("Souls", "SOULS2", accounts[2], accounts[3], '100', '3541431094', s2.address); // wide campaign window for tests. dates tested separately
    await s3.deployed();

    const tx2 = await s3.connect(signers[1]).claimSoul(tokenId, {gasLimit});
    const receipt2 = await tx2.wait();
    expect(await s3.claimedACIDs(tokenId)).to.be.true;
    expect(receipt2.events[1].args.tokenId.toString()).to.equal(tokenId);
    
  });

  it("S: test claim twice. failing", async () => {
    const s2 = await S.deploy("Souls", "SOULS2", accounts[2], accounts[3], '100', '3541431094', '0xaF69610ea9ddc95883f97a6a3171d52165b69B03'); // wide campaign window for tests. dates tested separately
    await s2.deployed();
    const tx = await s2.connect(signers[1]).mintSoul({value: ethers.utils.parseEther(dxPrice), gasLimit});
    const receipt = await tx.wait();
    const tokenId = receipt.events[0].args.tokenId.toString();

    const s3 = await S.deploy("Souls", "SOULS2", accounts[2], accounts[3], '100', '3541431094', s2.address); // wide campaign window for tests. dates tested separately
    await s3.deployed();

    await s3.connect(signers[1]).claimSoul(tokenId, {gasLimit});
    await expect(s3.connect(signers[1]).claimSoul(tokenId, {gasLimit})).to.be.revertedWith("AC_ID ALREADY CLAIMED");
  });  
  
  it("S: test start date + end date for claim", async () => {
    // certificates mock
    const s2 = await S.deploy("Souls", "SOULS2", accounts[2], accounts[3], '100', '3541431094', '0xaF69610ea9ddc95883f97a6a3171d52165b69B03'); // wide campaign window for tests. dates tested separately
    await s2.deployed();
    const tx = await s2.connect(signers[1]).mintSoul({value: ethers.utils.parseEther(dxPrice), gasLimit});
    const receipt = await tx.wait();
    const tokenId = receipt.events[0].args.tokenId.toString();

    // souls mock
    const s3 = await S.deploy("Souls", "SOULS2", accounts[2], accounts[3], '2541431093', '3541431094', s2.address);
    await s3.deployed();

    await expect(s3.connect(signers[1]).claimSoul(tokenId, {gasLimit})).to.be.revertedWith("NOT_STARTED");
    await time.increaseTo("3541431095"); // 1 sec after end campaign
    await expect(s3.connect(signers[1]).claimSoul(tokenId, {gasLimit})).to.be.revertedWith("ENDED");
  });

  it("S: test claim with existing id, but not owner. failing", async () => {
    const s2 = await S.deploy("Souls", "SOULS2", accounts[2], accounts[3], '100', '3541431094', '0xaF69610ea9ddc95883f97a6a3171d52165b69B03'); // wide campaign window for tests. dates tested separately
    await s2.deployed();
    const tx = await s2.connect(signers[1]).mintSoul({value: ethers.utils.parseEther(dxPrice), gasLimit});
    const receipt = await tx.wait();
    const tokenId = receipt.events[0].args.tokenId.toString();

    const s3 = await S.deploy("Souls", "SOULS2", accounts[2], accounts[3], '100', '3541431094', s2.address); // wide campaign window for tests. dates tested separately
    await s3.deployed();

    await expect(s3.connect(signers[2]).claimSoul(tokenId, {gasLimit})).to.be.revertedWith("AC_ID NOT OWNED BY SENDER");
  });

  it("S: test claim with non existing ID. failing", async () => {
    const s2 = await S.deploy("Souls", "SOULS2", accounts[2], accounts[3], '100', '3541431094', '0xaF69610ea9ddc95883f97a6a3171d52165b69B03'); // wide campaign window for tests. dates tested separately
    await s2.deployed();
    const tx = await s2.connect(signers[1]).mintSoul({value: ethers.utils.parseEther(dxPrice), gasLimit});
    const receipt = await tx.wait();
    const tokenId = receipt.events[0].args.tokenId.toString();

    const s3 = await S.deploy("Souls", "SOULS2", accounts[2], accounts[3], '100', '3541431094', s2.address); // wide campaign window for tests. dates tested separately
    await s3.deployed();

    await expect(s3.connect(signers[1]).claimSoul(42, {gasLimit})).to.be.revertedWith("ERC721: owner query for nonexistent token");
  });

  it("S: test claim by transferring OG id to another account then claiming.", async () => {
    const s2 = await S.deploy("Souls", "SOULS2", accounts[2], accounts[3], '100', '3541431094', '0xaF69610ea9ddc95883f97a6a3171d52165b69B03'); // wide campaign window for tests. dates tested separately
    await s2.deployed();
    const tx = await s2.connect(signers[1]).mintSoul({value: ethers.utils.parseEther(dxPrice), gasLimit});
    const receipt = await tx.wait();
    const tokenId = receipt.events[0].args.tokenId.toString();
    await s2.connect(signers[1]).transferFrom(accounts[1], accounts[2], tokenId, {gasLimit});

    const s3 = await S.deploy("Souls", "SOULS3", accounts[2], accounts[3], '100', '3541431094', s2.address); // wide campaign window for tests. dates tested separately
    await s3.deployed();

    await s3.connect(signers[2]).claimSoul(tokenId, {gasLimit});
    await expect(s3.connect(signers[2]).claimSoul(tokenId, {gasLimit})).to.be.revertedWith("AC_ID ALREADY CLAIMED");
  });

  it("S: test claim by transferring OG id to another account after claimed.", async () => {
    const s2 = await S.deploy("Souls", "SOULS3", accounts[2], accounts[3], '100', '3541431094', '0xaF69610ea9ddc95883f97a6a3171d52165b69B03'); // wide campaign window for tests. dates tested separately
    await s2.deployed();
    const tx = await s2.connect(signers[1]).mintSoul({value: ethers.utils.parseEther(dxPrice), gasLimit});
    const receipt = await tx.wait();
    const tokenId = receipt.events[0].args.tokenId.toString();

    const s3 = await S.deploy("Souls", "SOULS2", accounts[2], accounts[3], '100', '3541431094', s2.address); // wide campaign window for tests. dates tested separately
    await s3.deployed();

    await s3.connect(signers[1]).claimSoul(tokenId, {gasLimit});
    await s2.connect(signers[1]).transferFrom(accounts[1], accounts[2], tokenId, {gasLimit});

    await expect(s3.connect(signers[2]).claimSoul(tokenId, {gasLimit})).to.be.revertedWith("AC_ID ALREADY CLAIMED");
  });

  it("S: test claim by transferring OG id to another account after claimed.", async () => {
    const s2 = await S.deploy("Souls", "SOULS3", accounts[2], accounts[3], '100', '3541431094', '0xaF69610ea9ddc95883f97a6a3171d52165b69B03'); // wide campaign window for tests. dates tested separately
    await s2.deployed();
    const tx = await s2.connect(signers[1]).mintSoul({value: ethers.utils.parseEther(dxPrice), gasLimit});
    const receipt = await tx.wait();
    const tokenId = receipt.events[0].args.tokenId.toString();

    const s3 = await S.deploy("Souls", "SOULS2", accounts[2], accounts[3], '100', '3541431094', s2.address); // wide campaign window for tests. dates tested separately
    await s3.deployed();

    await s3.connect(signers[1]).claimSoul(tokenId, {gasLimit});
    await s2.connect(signers[1]).transferFrom(accounts[1], accounts[2], tokenId, {gasLimit});

    await expect(s3.connect(signers[2]).claimSoul(tokenId, {gasLimit})).to.be.revertedWith("AC_ID ALREADY CLAIMED");
  });

  //tested separately that if 0 layers are drawn, it will be a white square.
  // to do this. change toUint8 to return > 128.

});
