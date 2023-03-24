import { WarpFactory } from 'warp-contracts'
import { DeployPlugin, InjectedEthereumSigner } from 'warp-contracts-plugin-deploy'

export default class UserContract {
    constructor(provider) {
        this.provider = provider
        this.warp = WarpFactory.forMainnet()
    }

    setContractId(contractId) {
        this.contractId = contractId
    }

    async create() {
        this.warp.use(new DeployPlugin())

        const signer = new InjectedEthereumSigner(provider)
        await signer.setPublicKey()

        const contractSource = await fetch('/contract.js').then(res => res.text())

        const result = await this.warp.deploy({
            src: contractSource,
            initState: JSON.stringify({}),
            wallet: signer
        })

        this.setContractId(result.contractTxId)
    }

    async initialize() {
        const { evmSignature } = await import('warp-contracts-plugin-signature')

        this.contract = this.warp.contract(this.contractId)
        contract.connect({ signer: evmSignature, signatureType: 'ethereum' })
    }
}