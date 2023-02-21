import { WebBundlr } from "@bundlr-network/client";
import { ethers } from "ethers";
import Arweave from "arweave";
import fileReaderStream from "filereader-stream";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

export default class BundlrClient {
  async initialize() {
    await window.ethereum.enable();

    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    this.network = await this.provider.getNetwork();

    this.bundlr = new WebBundlr(
      "https://node2.bundlr.network",
      this.network.name, 
      this.provider 
    );
    await this.bundlr.ready();

    const balance  = await this.provider.getBalance(this.bundlr.address)
    this.balanceInEth = ethers.utils.formatEther(balance);

    this.publicKey = this.bundlr.getSigner().publicKey;
    this.ownerHash = await Arweave.crypto.hash(this.publicKey);
    this.owner = Arweave.utils.bufferTob64Url(this.ownerHash);

    this.apolloClient = new ApolloClient({
      uri: "https://arweave.net/graphql",
      cache: new InMemoryCache(),
    });
  }

  async upload(file) {
    const stream = fileReaderStream(file);
    const tx = await this.bundlr.upload(stream, {
      tags: [
        { name:"type" , value:"file"},
        { name: "Content-Type", value: file.type }
      ]
    });

    return tx;
  }

  async createFolder(folderName) {

    const tx = await this.bundlr.upload("", {
      tags: [
        { name:"type", value: "folder" },
        { name:"name" , value: folderName }
      ]
    });

    return tx;
  }

  async getTransactions() {
    const res = await this.apolloClient.query({
      query: gql`
        query ($owners: [String!]) {
          transactions(owners: $owners) {
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
        owners: [this.owner],
      },
    });

    return res.data.transactions.edges.map((edge) => edge.node);
  }

  async fund(amount) {
    try {
     
        if (amount < this.balanceInEth) {

          const rate = this.bundlr.currencyConfig.base[1];
          const atomicAmount = BigInt(amount * rate);

          let response = await this.bundlr.fund(atomicAmount);
          console.log(
            `Funding successful txID=${response.id} amount funded=${response.quantity}`
          );
        } 
        
        else console.log("Insufficient Funds");

    } catch (e) {
      console.log("Error funding node ", e);
    }
  }

  async getBalance() {
    let atomicBalance = await this.bundlr.getLoadedBalance();
    let convertedBalance = this.bundlr.utils.unitConverter(atomicBalance);
    return convertedBalance.valueOf();

   
  }
}
