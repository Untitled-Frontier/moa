async function main() {
  const S = await ethers.getContractFactory("Souls");

  const collector = "0xaF69610ea9ddc95883f97a6a3171d52165b69B03";
  const recipient = "0xec0ef86a3872829F3EC40de1b1b9Df54a3D4a4b3"; // mirror split

  const startDate = "1632492000"; // Fri Sep 24 2021 14:00:00 GMT+0000
  const endDate = "1634911200"; // Fri Oct 22 2021 14:00:00 GMT+0000

  const s = await S.deploy("Paintings of Forgotten Souls", "SOULS", collector, recipient, startDate, endDate, "0x600a4446094C341693C415E6743567b9bfc8a4A8");
  const sd = await s.deployed();
  const sAddress = await s.address;
  console.log("Souls deployed to: ", sAddress);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });