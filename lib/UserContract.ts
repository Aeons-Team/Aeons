import { WarpFactory, LoggerFactory, Contract, Warp } from 'warp-contracts'
import { DeployPlugin } from 'warp-contracts-plugin-deploy'
import { ethers } from 'ethers'
import { gql } from '@apollo/client'
import ContractState, { ContractStateData } from './ContractState'
import BundlrClient from './BundlrClient'
import initialState from '../contracts/client-contract/data/initialState.json'
import { PromptArgs } from '../stores/DriveStore'

interface InsertData {
    id?: string,
    contentType: string,
    size?: number,
    parentId: string,
    createdAt?: number,
    name: string,
    encryption?: string
}

export default class UserContract {
    contractId: string
    contractSrcId: string
    instance: Contract<ContractStateData>
    state: ContractState
    warp: Warp
    provider: ethers.providers.Web3Provider
    client: BundlrClient
    updateUIAction: Function
    internalWallet: ethers.Wallet
    interactionQueue: any[]
    log: Function
    prompt: (args: PromptArgs) => void

    constructor() {
        this.state = new ContractState()
        this.interactionQueue = []
    }

    setContractSrcId(contractSrcId: string) {
        this.contractSrcId = contractSrcId
    }

    async updateState() {
        const stateData = (await this.instance.readState()).cachedValue.state
        this.state.setData(stateData)

        this.interactionQueue.forEach(x => this.localWrite(x))
    }

    async createContract() {
        this.log('Creating new user contract')

        this.warp.use(new DeployPlugin())

        const contractUpload = await this.client.upload('', {
            tags: [
                { name: 'Init-State', value: JSON.stringify({ ...initialState, owner: this.client.address, internalOwner: this.internalWallet.address }) },
                { name: 'App-Name', value: 'SmartWeaveContract' },
                { name: 'App-Version', value: process.env.NEXT_PUBLIC_WARP_SDK_VERSION ?? '' },
                { name: 'Content-Type', value: 'application/json' },
                { name: 'Contract-Src', value: process.env.NEXT_PUBLIC_CONTRACT_SRC_ID ?? '' },
                { name: 'Client-App-Name', value: process.env.NEXT_PUBLIC_APP_NAME ?? '' }
            ]
        })

        const contractDeploy = await this.warp.register(contractUpload.id, 'node2')

        this.contractId = contractDeploy.contractTxId
        this.contractSrcId = process.env.NEXT_PUBLIC_CONTRACT_SRC_ID ?? ''
    }

    async initializeContract() {
        this.log('Searching for user contract in local storage')

        const contractId = localStorage.getItem(`${this.client.address}-${process.env.NEXT_PUBLIC_APP_NAME}-ContractId`)
        const contractSrcId = localStorage.getItem(`${this.client.address}-${process.env.NEXT_PUBLIC_APP_NAME}-ContractSrcId`)

        if (contractId) {
            this.contractId = contractId
            this.contractSrcId = contractSrcId ?? ''
        }

        else {
            this.log('Searching for user contract in arweave graphql gateway')

            const res = await this.client.query({
                query: gql`
                    query($owners: [String!]!, $clientAppName: String!) {
                        transactions(
                            owners: $owners,
                            tags:[
                                { name: "App-Name", values: "SmartWeaveContract" }
                                { name: "Client-App-Name", values: [$clientAppName] }
                            ]
                        ) {
                            edges {
                                node {
                                    id
                                    tags {
                                        name
                                        value
                                    }
                                }
                            }
                        }
                    }
                `,

                variables: {
                    owners: [this.client.owner],
                    clientAppName: process.env.NEXT_PUBLIC_APP_NAME
                }
            })
    
            const edges = res.data.transactions.edges

            if (edges.length == 0) {
                this.log('Searching for user contract in warp gateway')

                const fetchUrl = `${process.env.NEXT_PUBLIC_WARP_GATEWAY_URL}/contracts-by-source?id=${process.env.NEXT_PUBLIC_CONTRACT_SRC_ID}&limit=${process.env.NEXT_PUBLIC_WARP_GATEWAY_FETCH_LIMIT}&sort=desc`
                
                const contractId = await fetch(fetchUrl)
                    .then((res) => res.json())
                    .then((data) => data.contracts)
                    .then((contracts) => contracts.find(contract => contract.owner == this.client.address.toLowerCase())?.contractId)

                if (contractId) {
                    this.contractId = contractId
                    this.contractSrcId = process.env.NEXT_PUBLIC_CONTRACT_SRC_ID ?? ''
                }

                else {
                    if (this.client.network.name == 'maticmum') {
                        throw new Error('Cannot deploy contract from a testnet')
                    }

                    await this.createInternalWallet()
                    await this.createContract()
                }
            }

            else {
                const node = edges[0].node
                this.contractId = node.id
                this.contractSrcId = node.tags.find(tag => tag.name == 'Contract-Src').value
            }

            localStorage.setItem(`${this.client.address}-${process.env.NEXT_PUBLIC_APP_NAME}-ContractId`, this.contractId)
            localStorage.setItem(`${this.client.address}-${process.env.NEXT_PUBLIC_APP_NAME}-ContractSrcId`, this.contractSrcId)
        }

    }

    async checkEvolve() {
        this.log('Checking for contract evolution')

        if (this.contractSrcId != process.env.NEXT_PUBLIC_CONTRACT_SRC_ID && this.state.getData().evolve != process.env.NEXT_PUBLIC_CONTRACT_SRC_ID) {
            this.log('User contract evolution detected, evolving contract')
            
            await this.instance.evolve(process.env.NEXT_PUBLIC_CONTRACT_SRC_ID ?? '')
            await this.updateState()
        }
    }

    async initialize(provider: ethers.providers.Web3Provider, client: BundlrClient, log: Function, prompt: (args: PromptArgs) => void) {
        this.provider = provider
        this.client = client
        this.log = log
        this.prompt = prompt

        this.warp = WarpFactory.forMainnet()

        LoggerFactory.INST.logLevel('none')
        
        await this.initializeContract()

        this.log('Evaluating contract state')

        const { evmSignature } = await import('warp-contracts-plugin-signature')

        this.instance = this.warp.contract<ContractStateData>(this.contractId)
        this.instance.connect({ signer: evmSignature, type: 'ethereum' })
        
        await this.updateState()
        
        this.log('Searching for internal wallet in local storage')

        if (!this.internalWallet) {
            const internalWalletEncrypted = localStorage.getItem(`${this.client.address}-${process.env.NEXT_PUBLIC_APP_NAME}-InternalWalletEncrypted`)
    
            if (internalWalletEncrypted) {
                const tryPassword = async (errorMessage = '') => {
                    this.log('Enter the password set for encrypting internal wallet locally')
        
                    try {
                        const password = await new Promise((resolve, reject) => {
                            this.prompt({
                                type: 'password',
                                errorMessage,
                                resolve
                            })
                        })
            
                        this.log('Decrypting internal wallet')
            
                        this.internalWallet = await ethers.Wallet.fromEncryptedJson(internalWalletEncrypted, password)
                    }

                    catch (error) {
                        await tryPassword('Invalid password')
                    }
                }

                await tryPassword()
            }
    
            else {
                await this.recoverInternalWallet()
            }
        }

        const { buildEvmSignature } = await import('warp-contracts-plugin-signature/server')

        this.log('Connecting the contract to internal wallet')

        this.instance.connect({  
            signer: buildEvmSignature(this.internalWallet),
            type: 'ethereum'
        })
        
        await this.checkEvolve()
    }

    localWrite(action: any) {
        const data = this.state.getData()
        const files = data.hierarchy.files

        switch (action.function) {
            case 'insert':
                const id = action.id

                files[id] = {
                    id,
                    contentType: action.contentType,
                    size: action.size,
                    parentId: action.parentId,
                    name: action.name,
                    children: action.contentType == 'folder' ? [] : undefined,
                    createdAt: action.createdAt,
                    encryption: action.encryption,
                    pending: true
                }

                if (action.parentId) {
                    files[action.parentId].children?.push(id)
                }
                
                break

            case 'rename':
                files[action.id].name = action.newName
                files[action.id].pending = true
                break 

            case 'relocate':
                const newParent = files[action.newParentId]
                const oldParent = files[action.oldParentId]

                const in_ids = {}
                action.ids.forEach(id => {
                    in_ids[id] = true
                    files[id].parentId = action.newParentId
                    files[id].pending = true
                })

                newParent.children?.push(...action.ids)
                oldParent.children = oldParent.children?.filter(id => !in_ids[id])
                break
        }
    }

    async updateUI() {
        if (this.updateUIAction) {
            this.updateUIAction()
        }
    }

    async writeInteraction(action: any, shouldUpdateUI: boolean) {
        this.localWrite(action)
        this.interactionQueue.push(action)

        shouldUpdateUI && this.updateUIAction()
        
        await this.instance.writeInteraction(action)
        this.interactionQueue = this.interactionQueue.filter(x => x != action)

        await this.updateState()
        
        shouldUpdateUI && this.updateUIAction()
    }

    async insert(data: InsertData) {
        await this.writeInteraction({ function: 'insert', ...data },true)
    }

    async rename(id: string, newName: string) {
        await this.writeInteraction({ function: 'rename', id, newName },true)
    }

    async relocate(ids: string[], oldParentId: string, newParentId: string) {
        await this.writeInteraction({ function: 'relocate', ids, oldParentId, newParentId },true)
    }

    async recoverInternalWallet() {
        const tryRecover = async (errorMessage = '') => {
            this.log('Enter mnemonic phrase to recover your internal wallet')

            try {
                const mnemonic = await new Promise((resolve, reject) => {
                    this.prompt({
                        type: 'recover',
                        errorMessage,
                        resolve
                    })
                })
        
                this.internalWallet = ethers.Wallet.fromMnemonic(mnemonic)
        
                await this.encryptAndStoreInternalWallet()
            }

            catch (error) {
                await tryRecover('Invalid mnemonic phrase')
            }
        }

        await tryRecover()
    }

    async createInternalWallet() {
        this.log('Creating new internal wallet')
        
        this.internalWallet = ethers.Wallet.createRandom()

        this.log('Please write down your internal wallet\'s secret recovery phrase!')

        await new Promise((resolve, reject) => {
            this.prompt({
                type: 'recovery',
                value: this.internalWallet.mnemonic.phrase,
                resolve
            })
        })

        await this.encryptAndStoreInternalWallet()
    }

    async encryptAndStoreInternalWallet() {
        this.log('Set a password for encrypting internal wallet locally')

        const password = await new Promise((resolve, reject) => {
            this.prompt({
                type: 'password',
                resolve
            })
        })

        this.log('Encrypting internal wallet locally')

        const internalWalletEncrypted = await this.internalWallet.encrypt(password, { scrypt: { N: (1 << 16) } })
        localStorage.setItem(`${this.client.address}-${process.env.NEXT_PUBLIC_APP_NAME}-InternalWalletEncrypted`, internalWalletEncrypted)
    }
}