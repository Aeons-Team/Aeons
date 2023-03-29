import path from 'path'
import fs from 'fs'
import ArLocal from 'arlocal'
import { WarpFactory, Warp, ContractDeploy, Contract } from 'warp-contracts'
import { DeployPlugin } from 'warp-contracts-plugin-deploy'
import { Wallet } from 'warp-contracts/lib/types/contract/testing/Testing'

const initialStatePath = path.join(__dirname, '../data/initialState.json')
const contractSrcPath = path.join(__dirname, '../pkg/xdrive_contract_bg.wasm')
const wasmSrcCodeDirPath = path.join(__dirname, '../src')
const wasmGlueCodePath = path.join(__dirname, '../pkg/xdrive_contract.js')

jest.setTimeout(20000)

describe('testing xdrive contract', () => {
    let arlocal: ArLocal 
    let warp: Warp
    let ownerWallet: Wallet
    let contractDeploy: ContractDeploy
    let contract: Contract

    beforeAll(async () => {
        arlocal = new ArLocal(1820, false)
        await arlocal.start()
    
        warp = WarpFactory.forLocal(1820).use(new DeployPlugin())
        ownerWallet = await warp.generateWallet()
    
        const initialState = JSON.parse(fs.readFileSync(initialStatePath, 'utf8'))
        const contractSrc = fs.readFileSync(contractSrcPath)
    
        contractDeploy = await warp.deploy({
            wallet: ownerWallet.jwk,
            initState: JSON.stringify(
                {
                    ...initialState,
                    owner: ownerWallet.address
                }
            ),
            src: contractSrc,
            wasmSrcCodeDir: wasmSrcCodeDirPath,
            wasmGlueCode: wasmGlueCodePath
        })

        contract = warp.contract(contractDeploy.contractTxId)
        contract.connect(ownerWallet.jwk)
    })
    
    afterAll(async () => {
        await arlocal.stop()
    })
    
    it('should correctly update state', async () => {        
        await contract.writeInteraction({
            function: 'insert', id: 'id1', name: 'file1', contentType: 'folder'
        })

        await contract.writeInteraction({
            function: 'insert', id: 'id2', name: 'file2', contentType: 'folder'
        })
        
        await contract.writeInteraction({
            function: 'insert', id: 'id3', name: 'file3', parentId: 'id1', contentType: 'image/png'
        })
        
        await contract.writeInteraction({
            function: 'rename', id: 'id3', newName: 'file3_renamed'
        })
        
        await contract.writeInteraction({
            function: 'relocate', ids: ['id3'], oldParentId: 'id1', newParentId: 'id2'
        })

        await contract.writeInteraction({
            function: 'setInternalOwner', value: 'internal'
        })

        const state = (await contract.readState()).cachedValue.state as any
        let file2 = state.hierarchy.files['id2']

        expect(state.hierarchy.files['id1'].name).toBe('file1')
        
        expect(state.hierarchy.files['id1'].children.length).toBe(0)
        
        expect(state.hierarchy.files['id2'].children.length).toBe(1)
        
        expect(file2.children[0]).toBe('id3')

        expect(state.hierarchy.files[file2.children[0]].name).toBe('file3_renamed')

        expect(state.internalOwner).toBe('internal')
    })
})