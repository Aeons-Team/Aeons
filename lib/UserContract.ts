import { WarpFactory, LoggerFactory, Contract, Warp } from 'warp-contracts'
import { DeployPlugin, InjectedEthereumSigner } from 'warp-contracts-plugin-deploy'
import { ethers } from 'ethers'
import { gql } from '@apollo/client'
import ContractState, { ContractStateData } from './ContractState'
import BundlrClient from './BundlrClient'
import initialState from '../contracts/data/initialState.json'

interface InsertData {
    id?: string,
    contentType: string,
    size?: number,
    parentId: string,
    name: string
}

export default class UserContract {
    contractId: string
    instance: Contract<ContractStateData>
    state: ContractState
    warp: Warp
    provider: ethers.providers.Web3Provider
    client: BundlrClient

    setContractId(contractId: string) {
        this.contractId = contractId
    }

    async updateState() {
        const stateData = (await this.instance.readState()).cachedValue.state
        this.state = new ContractState(stateData)
    }

    async createContract() {
        this.warp.use(new DeployPlugin())

        const signer = new InjectedEthereumSigner(this.provider)
        await signer.setPublicKey()

        const result = await this.warp.deployFromSourceTx({
            wallet: signer,
            initState: JSON.stringify({
                ...initialState,
                owner: this.client.owner 
            }),
            srcTxId: process.env.NEXT_PUBLIC_CONTRACT_SRC_ID ?? '',
            tags: [
                { name: 'Client-App-Name', value: process.env.NEXT_PUBLIC_APP_NAME ?? '' }
            ]
        })

        this.setContractId(result.contractTxId)
    }

    async initializeContract() {
        const contractId = localStorage.getItem(`${this.client.owner}-${process.env.NEXT_PUBLIC_CONTRACT_SRC_ID}`)

        if (contractId) {
            this.setContractId(contractId)
        }

        else {
            const res = await this.client.query({
                query: gql`
                    query($owners: [String!]!, $contractSrcId: String!) {
                        transactions(
                            owners: $owners,
                            tags:[
                                { name: "App-Name", values: "SmartWeaveContract" }
                                { name: "Contract-Src", values: [$contractSrcId] }
                            ]
                        ) {
                            edges {
                                node {
                                    id
                                    owner {
                                        address
                                    }
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
                    contractSrcId: process.env.NEXT_PUBLIC_CONTRACT_SRC_ID
                }
            })
    
            const edges = res.data.transactions.edges

            if (edges.length == 0) {
                await this.createContract()
            }

            else {
                this.setContractId(edges[0].node.id)
            }

            localStorage.setItem(`${this.client.owner}-${process.env.NEXT_PUBLIC_CONTRACT_SRC_ID}`, this.contractId)
        }
    }

    async initialize(provider: ethers.providers.Web3Provider, client: BundlrClient) {
        this.provider = provider
        this.client = client

        this.warp = process.env.NEXT_PUBLIC_MODE == 'production' 
            ? WarpFactory.forMainnet()
            : WarpFactory.forTestnet()

        LoggerFactory.INST.logLevel('none')
        
        await this.initializeContract()

        const { evmSignature } = await import('warp-contracts-plugin-signature')

        this.instance = this.warp.contract<ContractStateData>(this.contractId)

        this.instance.connect({ signer: evmSignature, signatureType: 'ethereum' })

        await this.updateState()
    }

    async insert(data: InsertData) {
        await this.instance.writeInteraction({ input: 'insert', ...data })
        await this.updateState()
    }

    async rename(id: string, newName: string) {
        await this.instance.writeInteraction({ name: 'rename', id, newName })
        await this.updateState()
    }

    async relocate(ids: string[], oldParentId: string, newParentId: string) {
        await this.instance.writeInteraction({ input: 'relocate', ids, oldParentId, newParentId })
        await this.updateState()
    }
}