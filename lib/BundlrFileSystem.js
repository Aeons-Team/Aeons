import fileReaderStream from "filereader-stream";
import { gql } from "@apollo/client";
import Transaction from "./Transaction";
import FileHierarchy from "./FileHierarchy";
import PendingTransactions from "./PendingTransactions";

export default class BundlrFileSystem {
  constructor(client) {
    this.client = client;
  }

  async initialize() {
    const transactions = await this.getTransactions();
    this.pending = new PendingTransactions();
    this.pending.removeTransactions(transactions);

    this.hierarchy = new FileHierarchy([
      ...transactions,
      ...this.pending.transactions,
    ]);
  }

  async getTransactions() {
    const transactions = [];
    let after = null;
    const application = process.env.NEXT_PUBLIC_APP_NAME;

    do {
      const res = await this.client.query({
        query: gql`
          query ($owners: [String!], $after: String) {
            transactions(
              owners: $owners
              after: $after
              first: 100
              sort: HEIGHT_ASC
            ) {
              edges {
                node {
                  id
                  tags {
                    name
                    value
                  }
                  data {
                    size
                  }
                }
                cursor
              }
            }
          }
        `,

        variables: {
          owners: [this.client.owner],
          after,
        },
      });

      var edges = res.data.transactions.edges;

      if (edges.length) {
        after = edges[edges.length - 1].cursor;
      }

      for (const edge of edges) {
        transactions.push(
          new Transaction({ ...edge.node, cursor: edge.cursor })
        );
      }
    } while (edges.length == 100);

    return transactions;
  }

  async createFile(file, parent) {
    const stream = fileReaderStream(file);
    const application = process.env.NEXT_PUBLIC_APP_NAME;
    const tags = [
      { name: "application", value: `${application}` },
      { name: "type", value: "file" },
      { name: "name", value: file.name },
      { name: "Content-Type", value: file.type },
    ];

    if (parent) {
      tags.push({ name: "parent", value: parent });
    }

    const tx = await this.client.upload(stream, { tags });

    this.hierarchy.addFromTransaction(tx);

    this.pending.addTransaction(tx);

    return tx;
  }

  async createFolder(folderName, parent) {
    const application = process.env.NEXT_PUBLIC_APP_NAME;
    const tags = [
      { name: "application", value: `${application}` },
      { name: "type", value: "folder" },
      { name: "name", value: folderName },
    ];

    if (parent) {
      tags.push({ name: "parent", value: parent });
    }

    const tx = await this.client.upload("", { tags });

    this.hierarchy.addFromTransaction(tx);

    this.pending.addTransaction(tx);

    return tx;
  }

  async createDrive(driveName) {
    const application = process.env.NEXT_PUBLIC_APP_NAME;
    const tags = [
      { name: "application", value: `${application}` },
      { name: "type", value: "drive" },
      { name: "name", value: driveName },
    ];

    const tx = await this.client.upload("", { tags });

    this.hierarchy.addFromTransaction(tx);

    this.pending.addTransaction(tx);

    return tx;
  }
}
