import { WebBundlr } from "@bundlr-network/client";
import Arweave from "arweave";
import { ethers } from "ethers";
import internal from "stream";
import { ApolloClient, InMemoryCache, NormalizedCacheObject, OperationVariables, QueryOptions } from "@apollo/client";
import { CreateAndUploadOptions } from "@bundlr-network/client/build/common/types";

export default class BundlrClient {
  provider: ethers.providers.Web3Provider
  address: string 
  network: ethers.providers.Network
  instance: WebBundlr
  walletBalance: string 
  owner: string 
  apolloClient: ApolloClient<NormalizedCacheObject>

  async initialize(provider) {
    this.provider = provider
    this.address = await this.provider.getSigner().getAddress();
    this.network = await this.provider.getNetwork();

    switch (process.env.NEXT_PUBLIC_BUNDLR_ENV) {
      case "mainnet":
        this.instance = new WebBundlr(
          process.env.NEXT_PUBLIC_BUNDLR_NODE_URL ?? '',
          this.network.name,
          this.provider
        );
        break;
        
      case "devnet":
        this.instance = new WebBundlr(
          process.env.NEXT_PUBLIC_DEV_BUNDLR_NODE_URL ?? '',
          process.env.NEXT_PUBLIC_DEV_BUNDLR_CURRENCY ?? '',
          this.provider,
          { providerUrl: process.env.NEXT_PUBLIC_DEV_BUNDLR_PROVIDER_URL }
        );
        break;
    }

    await this.instance.ready();

    const atomicWalletBalance = await this.provider.getBalance(this.address);
    this.walletBalance = this.instance.utils
      .unitConverter(atomicWalletBalance.toBigInt())
      .valueOf();

    const publicKey = this.instance.getSigner().publicKey;
    const ownerHash = await Arweave.crypto.hash(publicKey);
    this.owner = Arweave.utils.bufferTob64Url(ownerHash);

    this.apolloClient = new ApolloClient({
      uri: `${process.env.NEXT_PUBLIC_ARWEAVE_URL}/graphql`,
      cache: new InMemoryCache(),
    });
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

    // FOR TESTING, REMOVE LATER
    uploader.setBatchSize(3);
    uploader.setChunkSize(500000);

    for (const eventName in events) {
      uploader.on(eventName, events[eventName]);
    }

    return uploader;
  }
}
