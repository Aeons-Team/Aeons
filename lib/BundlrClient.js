import { WebBundlr } from "@bundlr-network/client";
import { ethers } from "ethers";
import Arweave from "arweave";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import Transaction from "./Transaction";

export default class BundlrClient {
  async initialize() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    this.network = await this.provider.getNetwork();

    this.bundlr = new WebBundlr(
      "https://node2.bundlr.network",
      this.network.name,
      this.provider
    );

    await this.bundlr.ready();

    const atomicNetworkBalance = await this.provider.getBalance(
      this.bundlr.address
    );
    this.networkBalance = this.bundlr.utils.unitConverter(atomicNetworkBalance);

    this.address = this.bundlr.address;
    this.publicKey = this.bundlr.getSigner().publicKey;
    this.ownerHash = await Arweave.crypto.hash(this.publicKey);
    this.owner = Arweave.utils.bufferTob64Url(this.ownerHash);

    this.apolloClient = new ApolloClient({
      uri: `${process.env.NEXT_PUBLIC_ARWEAVE_URL}graphql`,
      cache: new InMemoryCache(),
    });
  }

  async upload(data, opts) {
    const tx = await this.bundlr.upload(data, opts);
    return new Transaction({
      id: tx.id,
      pending: true,
      ...opts,
    });
  }

  async fund(amount) {
    const rate = this.bundlr.currencyConfig.base[1];
    const atomicAmount = BigInt(amount * rate);
    let response = await this.bundlr.fund(atomicAmount);
    return response;
  }

  async getBalance() {
    let atomicBalance = await this.bundlr.getLoadedBalance();
    let convertedBalance = this.bundlr.utils.unitConverter(atomicBalance);
    return convertedBalance.valueOf();
  }

  async query(opts) {
    const res = await this.apolloClient.query(opts);
    return res;
  }
}
