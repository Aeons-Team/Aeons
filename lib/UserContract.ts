import { WarpFactory, LoggerFactory, Contract, Warp } from 'warp-contracts'
import { DeployPlugin } from 'warp-contracts-plugin-deploy'
import { ethers } from 'ethers'
import { gql } from '@apollo/client'
import ContractState, { ContractStateData } from './ContractState'
import BundlrClient from './BundlrClient'
import initialState from '../contracts/client-contract/data/initialState.json'

interface InsertData {
    id?: string,
    contentType: string,
    size?: number,
    parentId: string,
    name: string
}

export default class UserContract {
    contractId: string
    contractSrcId: string
    instance: Contract<ContractStateData>
    state: ContractState
    warp: Warp
    provider: ethers.providers.Web3Provider
    client: BundlrClient

    setContractSrcId(contractSrcId: string) {
        this.contractSrcId = contractSrcId
    }

    async updateState() {
        const stateData = (await this.instance.readState()).cachedValue.state
        this.state = new ContractState(stateData)
    }

    async createContract() {
        this.warp.use(new DeployPlugin())

        const contractUpload = await this.client.upload('', {
            tags: [
                { name: 'Init-State', value: JSON.stringify({ ...initialState, owner: this.client.owner }) },
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
        const contractId = localStorage.getItem(`${this.client.owner}-${process.env.NEXT_PUBLIC_APP_NAME}-ContractId`)
        const contractSrcId = localStorage.getItem(`${this.client.owner}-${process.env.NEXT_PUBLIC_APP_NAME}-ContractSrcId`)

        if (contractId) {
            this.contractId = contractId
            this.contractSrcId = contractSrcId ?? ''
        }

        else {
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
                await this.createContract()
            }

            else {
                const node = edges[0].node
                this.contractId = node.id
                this.contractSrcId = node.tags.find(tag => tag.name == 'Contract-Src').value
            }

            localStorage.setItem(`${this.client.owner}-${process.env.NEXT_PUBLIC_APP_NAME}-ContractId`, this.contractId)
            localStorage.setItem(`${this.client.owner}-${process.env.NEXT_PUBLIC_APP_NAME}-ContractSrcId`, this.contractSrcId)
        }
    }

    async checkEvolve() {
        console.log(this.state)

        if (this.contractSrcId != process.env.NEXT_PUBLIC_CONTRACT_SRC_ID && this.state.data.evolve != process.env.NEXT_PUBLIC_CONTRACT_SRC_ID) {
            await this.instance.evolve(process.env.NEXT_PUBLIC_CONTRACT_SRC_ID ?? '')
            await this.updateState()
        }
    }

    async initialize(provider: ethers.providers.Web3Provider, client: BundlrClient) {
        this.provider = provider
        this.client = client

        this.warp = WarpFactory.forMainnet()

        LoggerFactory.INST.logLevel('none')
        
        await this.initializeContract()

        const { evmSignature } = await import('warp-contracts-plugin-signature')

        this.instance = this.warp.contract<ContractStateData>(this.contractId)
        this.instance.connect({ signer: evmSignature, signatureType: 'ethereum' })

        await this.updateState()
        await this.checkEvolve()
    }

    async insert(data: InsertData) {
        await this.instance.writeInteraction({ function: "insert", ...data })
        await this.updateState()
    }

    async rename(id: string, newName: string) {
        await this.instance.writeInteraction({ function: "rename", id, newName })
        await this.updateState()
    }

    async relocate(ids: string[], oldParentId: string, newParentId: string) {
        await this.instance.writeInteraction({ function: "relocate", ids, oldParentId, newParentId })
        await this.updateState()
    }
}