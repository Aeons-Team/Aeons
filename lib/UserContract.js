import { WarpFactory, LoggerFactory } from 'warp-contracts'
import { DeployPlugin, InjectedEthereumSigner } from 'warp-contracts-plugin-deploy'
import initialState from '../contracts/data/initialState.json'

export default class UserContract {
    constructor(provider) {
        this.provider = provider
        this.warp = WarpFactory.forMainnet()

        LoggerFactory.INST.logLevel('none')
    }

    setContractId(contractId) {
        this.contractId = contractId
    }

    async create() {
        this.warp.use(new DeployPlugin())

        const signer = new InjectedEthereumSigner(this.provider)
        await signer.setPublicKey()

        const result = await this.warp.deployFromSourceTx({
            wallet: signer,
            initState: JSON.stringify(initialState),
            srcTxId: process.env.NEXT_PUBLIC_CONTRACT_SRC_ID
        })

        this.setContractId(result.contractTxId)
    }

    async initialize() {
        const { evmSignature } = await import('warp-contracts-plugin-signature')

        this.instance = this.warp.contract(this.contractId)
        this.instance.connect({ signer: evmSignature, signatureType: 'ethereum' })
    }
}