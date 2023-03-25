import { WarpFactory, LoggerFactory } from 'warp-contracts'
import { DeployPlugin, InjectedEthereumSigner } from 'warp-contracts-plugin-deploy'
import { gql } from '@apollo/client'
import ContractState from './ContractState'
import initialState from '../contracts/data/initialState.json'

export default class UserContract {
    setContractId(contractId) {
        this.contractId = contractId
    }

    async updateState() {
        const stateVal = (await this.instance.readState()).cachedValue.state
        this.state = new ContractState(stateVal)
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
            srcTxId: process.env.NEXT_PUBLIC_CONTRACT_SRC_ID,
            tags: [
                { name: 'Client-App-Name', value: process.env.NEXT_PUBLIC_APP_NAME }
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

    async initialize(provider, client) {
        this.provider = provider
        this.client = client

        this.warp = process.env.NEXT_PUBLIC_MODE == 'production' 
            ? WarpFactory.forMainnet()
            : WarpFactory.forTestnet()

        LoggerFactory.INST.logLevel('none')
        
        await this.initializeContract()

        const { evmSignature } = await import('warp-contracts-plugin-signature')

        this.instance = this.warp.contract(this.contractId)
        this.instance.connect({ signer: evmSignature, signatureType: 'ethereum' })

        await this.updateState()
    }

    async insert(data) {
        await this.instance.writeInteraction({ input: 'insert', ...data })
        await this.updateState()
    }

    async rename(id, newName) {
        await this.instance.writeInteraction({ name: 'rename', id, newName })
        await this.updateState()
    }

    async relocate(ids, oldParentId, newParentId) {
        await this.instance.writeInteraction({ input: 'relocate', ids, oldParentId, newParentId })
        await this.updateState()
    }
}