import fileReaderStream from "filereader-stream";
import { gql } from "@apollo/client"
import Transaction from './Transaction'
import FileHierarchy from "./FileHierarchy";

export default class BundlrFileSystem {
	constructor(client) {
		this.client = client;
	}

  async initialize() {
    const transactions = await this.getTransactions()
    this.hierarchy = new FileHierarchy(transactions)
  }

	async createFile(file) {
    const stream = fileReaderStream(file);
    const tx = await this.client.upload(stream, {
      tags: [
        { name:"type" , value:"file"},
        { name: "Content-Type", value: file.type }
      ]
    });

    return tx;
  }

  async createFolder(folderName) {
    const tx = await this.client.upload("", {
      tags: [
        { name:"type", value: "folder" },
        { name:"name" , value: folderName }
      ]
    });

    return tx;
  }

	async getTransactions() {
		const transactions = [];
    let after = null

    do {
      const res = await this.client.query({
        query: gql`
          query ($owners: [String!], $after: String) {
            transactions(owners: $owners, after: $after, first: 100, sort: HEIGHT_ASC) {
              edges {
                node {
                  id
                  tags {
                    name
                    value
                  }
                }
                cursor
              }
            }
          }
        `,

        variables: {
          owners: [this.client.owner],
          after
        },
      });

      var edges = res.data.transactions.edges
      after = edges[edges.length - 1].cursor

      for (const edge of edges) {
        transactions.push(new Transaction(edge.node))
      }
    } while (edges.length == 100);

    return transactions;
	}
}