import path from 'path'
import fs from 'fs'
import { WarpFactory } from 'warp-contracts'
import { DeployPlugin } from 'warp-contracts-plugin-deploy'

const walletJwkPath = path.join(__dirname, '../data/wallet.json')
const initialStatePath = path.join(__dirname, '../data/initialState.json')
const contractSrcPath = path.join(__dirname, '../pkg/xdrive_contract_bg.wasm')
const wasmSrcCodeDirPath = path.join(__dirname, '../src')
const wasmGlueCodePath = path.join(__dirname, '../pkg/xdrive_contract.js')

async function deploy() {
    const warp = WarpFactory.forMainnet().use(new DeployPlugin())

    const walletJwk = JSON.parse(fs.readFileSync(walletJwkPath, 'utf8'))
    const initialStateJson = fs.readFileSync(initialStatePath, 'utf8')
    const contractSrc = fs.readFileSync(contractSrcPath)

    const contractDeploy = await warp.deploy({
        wallet: walletJwk,
        initState: initialStateJson,
        src: contractSrc,
        wasmSrcCodeDir: wasmSrcCodeDirPath,
        wasmGlueCode: wasmGlueCodePath
    })

    console.log(`contract deployed successfully`)
    console.log(`contract id: ${contractDeploy.contractTxId}`)
    console.log(`contract source id: ${contractDeploy.srcTxId}`)

    fs.writeFileSync(path.join(__dirname, '../data/contract_deployment.json'), JSON.stringify(contractDeploy))
}

deploy()