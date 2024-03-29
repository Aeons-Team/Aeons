import path from 'path'
import fs from 'fs'
import ArLocal from 'arlocal'
import { WarpFactory, Warp, ContractDeploy, Contract } from 'warp-contracts'
import { DeployPlugin } from 'warp-contracts-plugin-deploy'
import { Wallet } from 'warp-contracts/lib/types/contract/testing/Testing'

jest.setTimeout(20000)

describe('testing aeons DRE contract', () => {
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
    
        const initialState = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/initialState.json'), 'utf8'))
        const contractSrc = fs.readFileSync(path.join(__dirname, '../dist/contract.js'), 'utf8')

        contractDeploy = await warp.deploy({
            wallet: ownerWallet.jwk,
            initState: JSON.stringify(
                {
                    ...initialState,
                    owner: ownerWallet.address
                }
            ),
            src: contractSrc
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

        const state = (await contract.readState()).cachedValue.state as any

        let file2 = state.hierarchy.files[ownerWallet.address]['id2']

        expect(state.hierarchy.files[ownerWallet.address]['id1'].name).toBe('file1')
        
        expect(state.hierarchy.files[ownerWallet.address]['id1'].children.length).toBe(0)
        
        expect(state.hierarchy.files[ownerWallet.address]['id2'].children.length).toBe(1)
        
        expect(file2.children[0]).toBe('id3')

        expect(state.hierarchy.files[ownerWallet.address][file2.children[0]].name).toBe('file3_renamed')
    })
})