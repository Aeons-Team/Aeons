import { WebBundlr } from "@bundlr-network/client";
import Arweave from "arweave";
import { ethers } from "ethers";
import internal from "stream";
import { ApolloClient, InMemoryCache, NormalizedCacheObject, OperationVariables, QueryOptions } from "@apollo/client";
import { CreateAndUploadOptions } from "@bundlr-network/client/build/common/types";

const networkInfos = {
  'homestead': {
    name: 'Ethereum',
    currency: 'ether',
    currencySym: 'ETH'
  },
  'arbitrum': {
    name: 'Aribtrum One',
    currency: 'arbitrum',
    currencySym: 'ETH'
  },
  'matic': {
    name: 'Polygon',
    currency: 'matic',
    currencySym: 'MTC'
  },
  'maticmum': {
    name: 'Polygon Testnet (Mumbai)',
    currency: 'matic',
    currencySym: 'MTC'
  }
}

export default class BundlrClient {
  provider: ethers.providers.Web3Provider
  address: string 
  network: ethers.providers.Network
  instance: WebBundlr
  walletBalance: string 
  owner: string 
  apolloClient: ApolloClient<NormalizedCacheObject>
  networkName: string
  networkCurrencySym: string
  networkCurrency: string

  async initialize(provider: ethers.providers.Web3Provider) {
    this.provider = provider
    this.address = await this.provider.getSigner().getAddress();
    this.network = await this.provider.getNetwork();

    const networkInfo = networkInfos[this.network.name]

    if (this.network.name == 'maticmum') {
      this.instance = new WebBundlr(process.env.NEXT_PUBLIC_BUNDLR_NODE_URL ?? '', networkInfo.currency, this.provider);
    }

    else {
      this.instance = new WebBundlr(process.env.NEXT_PUBLIC_DEV_BUNDLR_NODE_URL ?? '', 'matic', this.provider, { 
        providerUrl: 'https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78' 
      });
    }

    await this.instance.ready();

    const publicKey = this.instance.getSigner().publicKey;
    const ownerHash = await Arweave.crypto.hash(publicKey);
    this.owner = Arweave.utils.bufferTob64Url(ownerHash);

    this.networkName = networkInfo.name
    this.networkCurrencySym = networkInfo.currencySym
    this.networkCurrency = networkInfo.currency

    this.apolloClient = new ApolloClient({
      uri: `${process.env.NEXT_PUBLIC_ARWEAVE_URL}/graphql`,
      cache: new InMemoryCache(),
    });
  }

  async getWalletBalance() {
    const atomicWalletBalance = await this.provider.getBalance(this.address);
    
    this.walletBalance = this.instance.utils
      .unitConverter(atomicWalletBalance.toBigInt())
      .valueOf();

    return this.walletBalance
  }

  async upload(data: string | Buffer | internal.Readable, opts: CreateAndUploadOptions) {
    const tx = await this.instance.upload(data, opts);
    return tx;
  }

  async fund(amount: number) {
    const rate = this.instance.currencyConfig.base[1];
    const atomicAmount = BigInt(amount * rate);
    let response = await this.instance.fund(atomicAmount);
    return response;
  }

  async getLoadedBalance() {
    let atomicBalance = await this.instance.getLoadedBalance();
    let convertedBalance = this.instance.utils.unitConverter(atomicBalance);
    return convertedBalance.valueOf();
  }

  async query(opts: QueryOptions<OperationVariables, any>) {
    const res = await this.apolloClient.query(opts);
    return res;
  }

  async getPrice(bytes: number) {
    const atomicPrice = await this.instance.getPrice(bytes);
    let price = this.instance.utils.unitConverter(atomicPrice);
    return price.valueOf();
  }

  uploadChunked(data: any, opts: any, events: any) {
    const uploader = this.instance.uploader.chunkedUploader;
    uploader.uploadData(data, opts);

    uploader.setBatchSize(Number(process.env.NEXT_PUBLIC_CHUNKED_UPLOADER_BATCH_SIZE));
    uploader.setChunkSize(Number(process.env.NEXT_PUBLIC_CHUNKED_UPLOADER_CHUNK_SIZE));

    for (const eventName in events) {
      uploader.on(eventName, events[eventName]);
    }

    return uploader;
  }
}
