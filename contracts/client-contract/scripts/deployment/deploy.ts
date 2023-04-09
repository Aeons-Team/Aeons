import path from 'path'
import fs from 'fs'
import { Warp } from 'warp-contracts'
import { DeployPlugin, ArweaveSigner } from 'warp-contracts-plugin-deploy'

const walletJwkPath = path.join(__dirname, '../../data/wallet.json')
const contractSrcPath = path.join(__dirname, '../../pkg/aeons_contract_bg.wasm')
const wasmSrcCodeDirPath = path.join(__dirname, '../../src')
const wasmGlueCodePath = path.join(__dirname, '../../pkg/aeons_contract.js')
const contractDeploymentPath = path.join(__dirname, '../../data/contract_deployment.txt')

async function deploy(warp: Warp) {
    warp.use(new DeployPlugin())

    const walletJwk = JSON.parse(fs.readFileSync(walletJwkPath, 'utf8'))
    const contractSrc = fs.readFileSync(contractSrcPath)

    const deployedSource = await warp.createSource({
        src: contractSrc,
        wasmSrcCodeDir: wasmSrcCodeDirPath,
        wasmGlueCode: wasmGlueCodePath,
    }, new ArweaveSigner(walletJwk))

    await warp.saveSource(deployedSource)

    console.log(`contract source id: ${deployedSource.id}`)
    fs.writeFileSync(contractDeploymentPath, deployedSource.id)
}

export default deploy