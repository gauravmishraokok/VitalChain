const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("Starting deployment on network:", hre.network.name);

    // Paths relative to project root
    const rootDir = path.join(__dirname, "..");
    const abiDir = path.join(rootDir, "abi");
    const addressPath = path.join(rootDir, "deployed_address.json");

    if (!fs.existsSync(abiDir)) {
        fs.mkdirSync(abiDir, { recursive: true });
    }

    // Deploy MedicalAudit
    const MedicalAudit = await hre.ethers.getContractFactory("MedicalAudit");
    const audit = await MedicalAudit.deploy();
    await audit.waitForDeployment();
    const auditAddr = await audit.getAddress();
    
    // Deploy TriageDAO
    const TriageDAO = await hre.ethers.getContractFactory("TriageDAO");
    const dao = await TriageDAO.deploy();
    await dao.waitForDeployment();
    const daoAddr = await dao.getAddress();
    
    const addresses = {
        MedicalAudit: auditAddr,
        TriageDAO: daoAddr,
        deployedAt: new Date().toISOString(),
        network: hre.network.name
    };
    
    // Save addresses
    fs.writeFileSync(addressPath, JSON.stringify(addresses, null, 2));
    
    // Export ABIs (wrapped in object so eth_client.py can read ['abi'])
    const auditArtifact = await hre.artifacts.readArtifact("MedicalAudit");
    fs.writeFileSync(path.join(abiDir, "MedicalAudit.json"), JSON.stringify({ abi: auditArtifact.abi }, null, 2));
    
    const daoArtifact = await hre.artifacts.readArtifact("TriageDAO");
    fs.writeFileSync(path.join(abiDir, "TriageDAO.json"), JSON.stringify({ abi: daoArtifact.abi }, null, 2));
    
    console.log("MedicalAudit deployed to:", auditAddr);
    console.log("TriageDAO deployed to:", daoAddr);
    console.log("Initialization complete: ABIs and addresses exported.");
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
