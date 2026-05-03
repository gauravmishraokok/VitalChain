const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MedicalAudit", function () {
  let medicalAudit;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const MedicalAudit = await ethers.getContractFactory("MedicalAudit");
    medicalAudit = await MedicalAudit.deploy();
  });

  it("Should set the right owner", async function () {
    expect(await medicalAudit.owner()).to.equal(owner.address);
  });

  it("Should log a batch", async function () {
    const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("test"));
    const ipfsCid = "QmTest";
    const deviceDid = "did:vital:123";
    const batchSize = 10;

    await expect(medicalAudit.logBatch(merkleRoot, ipfsCid, deviceDid, batchSize))
      .to.emit(medicalAudit, "BatchLogged");

    const log = await medicalAudit.getBatchLog(0);
    expect(log.merkleRoot).to.equal(merkleRoot);
    expect(log.ipfsCid).to.equal(ipfsCid);
  });
});
