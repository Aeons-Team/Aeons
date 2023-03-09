import fileReaderStream from "filereader-stream";
import { gql } from "@apollo/client";
import Transaction from "./Transaction";
import FileHierarchy from "./FileHierarchy";
import PendingTransactions from "./PendingTransactions";

export default class BundlrFileSystem {
  constructor(client) {
    this.client = client;
    this.application = process.env.NEXT_PUBLIC_APP_NAME;
  }

  async initialize() {
    const transactions = await this.getTransactions();
    this.pending = new PendingTransactions(this.client.address);
    this.pending.removeTransactions(transactions);

    this.hierarchy = new FileHierarchy([
      ...transactions,
      ...this.pending.transactions,
    ]);
  }

  async getTransactions() {
    const transactions = [];
    let after = null;

    do {
      const res = await this.client.query({
        query: gql`
          query (
            $owners: [String!]
            $after: String
            $applications: [String!]!
          ) {
            transactions(
              owners: $owners
              after: $after
              tags: { name: "application", values: $applications }
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
          applications: [this.application],
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

    transactions.sort(
      (a, b) =>
        new Date(a.tags.time).getTime() - new Date(b.tags.time).getTime()
    );
    return transactions;
  }

  async createFile(file, parent, fileName) {
    const stream = fileReaderStream(file);
    const tags = [
      { name: "application", value: this.application },
      { name: "type", value: "file" },
      { name: "name", value: fileName },
      { name: "time", value: new Date().toUTCString() },
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
    const tags = [
      { name: "application", value: this.application },
      { name: "type", value: "folder" },
      { name: "time", value: new Date().toUTCString() },
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
    const tags = [
      { name: "application", value: this.application },
      { name: "type", value: "drive" },
      { name: "time", value: new Date().toUTCString() },
      { name: "name", value: driveName },
    ];

    const tx = await this.client.upload("", { tags });

    this.hierarchy.addFromTransaction(tx);

    this.pending.addTransaction(tx);

    return tx;
  }

  async moveFile(file, destination) {
    const tags = [
      { name: "application", value: this.application },
      { name: "type", value: "move" },
      { name: "destination", value: destination },
      { name: "time", value: new Date().toUTCString() },
      { name: "file", value: file },
    ];

    const tx = await this.client.upload("", { tags });

    this.hierarchy.addFromTransaction(tx);

    this.pending.addTransaction(tx);

    return tx;
  }

  async rename(file, name) {
    const tags = [
      { name: "application", value: this.application },
      { name: "type", value: "rename" },
      { name: "newName", value: name },
      { name: "time", value: new Date().toUTCString() },
      { name: "file", value: file },
    ];

    const tx = await this.client.upload("", { tags });

    this.hierarchy.addFromTransaction(tx);

    this.pending.addTransaction(tx);

    return tx;
  }
}
