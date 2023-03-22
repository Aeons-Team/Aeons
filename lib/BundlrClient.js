import { WebBundlr } from "@bundlr-network/client";
import { ethers } from "ethers";
import Arweave from "arweave";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import Transaction from "./Transaction";

export default class BundlrClient {
  async initialize(provider) {
    this.provider = new ethers.providers.Web3Provider(provider);
    this.address = await this.provider.getSigner().getAddress();
    this.network = await this.provider.getNetwork();

    switch (process.env.NEXT_PUBLIC_MODE) {
      case "production":
        this.instance = new WebBundlr(
          "https://node2.bundlr.network",
          this.network.name,
          this.provider
        );
        break;
      case "development":
        this.instance = new WebBundlr(
          "https://devnet.bundlr.network",
          "matic",
          this.provider
        );
        break;
    }

    await this.instance.ready();

    const atomicWalletBalance = await this.provider.getBalance(this.address);
    this.walletBalance = this.instance.utils
      .unitConverter(atomicWalletBalance.toBigInt())
      .valueOf();

    this.publicKey = this.instance.getSigner().publicKey;
    this.ownerHash = await Arweave.crypto.hash(this.publicKey);
    this.owner = Arweave.utils.bufferTob64Url(this.ownerHash);

    this.apolloClient = new ApolloClient({
      uri: `${process.env.NEXT_PUBLIC_ARWEAVE_URL}/graphql`,
      cache: new InMemoryCache(),
    });
  }

  async upload(data, opts) {
    const tx = await this.instance.upload(data, opts);
    return new Transaction({
      id: tx.id,
      pending: true,
      ...opts,
    });
  }

  async fund(amount) {
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

  async query(opts) {
    const res = await this.apolloClient.query(opts);
    return res;
  }

  async getPrice(bytes) {
    const atomicPrice = await this.instance.getPrice(bytes);
    let price = this.instance.utils.unitConverter(atomicPrice);
    return price.valueOf();
  }

  uploadChunked(data, opts, events) {
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
