// import { ethers } from "ethers";

async function main() {
    const S = await ethers.getContractFactory("Souls");

    const s = await S.deploy("Souls", "SOULS","0xaF69610ea9ddc95883f97a6a3171d52165b69B03", "0xaF69610ea9ddc95883f97a6a3171d52165b69B03", '100', '2627308000', '0x600a4446094C341693C415E6743567b9bfc8a4A8');
    const sd = await s.deployed();
    const sAddress = await s.address;
    const id = await s.newlyMinted();
    const ig = await sd.estimateGas.tokenURI(id);
    const i = await s.generateImage(id);
    const t = await s.generateTraits(id);
    const u = await s.tokenURI(id);

    console.log(ig.toString());
    console.log(t.toString());
    console.log(u.toString());
    console.log("Souls deployed to: ", sAddress);
    console.log(i);
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });