const path = require("path")
const fs = require("fs")

async function main() {
    const [deployer] = await ethers.getSigners()
    console.log("Deploying the contracts with the account:", await deployer.getAddress())

    //Deploy Contracts

    //Supply Chain
    const DN = await ethers.getContractFactory("durianSupplyChain")
    const dn = await DN.deploy()
    await dn.deployed()

    // Save contract addresses to file
    saveFrontendFiles({
        dnAddress: dn.address,
    })
}

function saveFrontendFiles({ dnAddress }) {
    const contractsDir = path.join(__dirname, "/../Durian/src/contracts")
    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir)
    }

    // Save Contracts ABI to file
    const DNArtifact = artifacts.readArtifactSync("durianSupplyChain")
    fs.writeFileSync(
        path.join(contractsDir, "durianSupplyChain.json"),
        JSON.stringify(DNArtifact, null, 2)
    )

    fs.writeFileSync(
        contractsDir + "/contract-address.json",
        JSON.stringify(
            {
                DurianSupplyChain: dnAddress,
            },
            null,
            2
        )
    )
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
