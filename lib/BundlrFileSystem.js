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
    const promises = [];
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
        const tx = new Transaction({ ...edge.node, cursor: edge.cursor });

        if (tx.tags.type == "move" && !tx.tags.file) {
          const promise = fetch(
            `${process.env.NEXT_PUBLIC_ARWEAVE_URL}/${tx.id}`
          )
            .then((res) => res.text())
            .then((text) => (tx.content = text));

          promises.push(promise);
        }

        transactions.push(tx);
      }
    } while (edges.length == 100);

    await Promise.all(promises);

    transactions.sort(
      (a, b) =>
        new Date(a.tags.time).getTime() - new Date(b.tags.time).getTime()
    );

    return transactions;
  }

  createFile(file, opts, events) {
    const stream = fileReaderStream(file);
    const tags = [
      { name: "application", value: this.application },
      { name: "type", value: "file" },
      { name: "name", value: opts.name ?? file.name },
      { name: "time", value: new Date().toUTCString() },
      { name: "Content-Type", value: file.type },
    ];

    if (opts.parent && opts.parent != "root") {
      tags.push({ name: "parent", value: opts.parent });
    }

    const doneEvent = events.done;

    events.done = (res) => {
      const tx = new Transaction({
        id: res.data.id,
        pending: true,
        data: {
          size: file.size,
        },
        tags,
      });

      this.hierarchy.addFromTransaction(tx);
      this.pending.addTransaction(tx);

      doneEvent(res);
    };

    const uploader = this.client.uploadChunked(stream, { tags }, events);
    return uploader;
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

  moveFile(file, destination) {
    return this.moveFiles([file], destination);
  }

  async moveFiles(files, destination) {
    const tags = [
      { name: "application", value: this.application },
      { name: "type", value: "move" },
      { name: "destination", value: destination },
      { name: "time", value: new Date().toUTCString() },
    ];

    let content = "";

    if (files.length == 1) {
      tags.push({ name: "file", value: files[0] });
    } else {
      content = files.join(" ");
    }

    const tx = await this.client.upload(content, { tags });

    tx.content = content;

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

  async createUser() {
    const publicKey = await ethereum.request({
      method: "eth_getEncryptionPublicKey",
      params: [this.client.address],
    });

    const tags = [
      { name: "type", value: "user" },
      { name: "publicKey", value: publicKey },
    ];

    const tx = await this.client.upload("", { tags });

    this.hierarchy.addFromTransaction(tx);

    this.pending.addTransaction(tx);

    return tx;
  }

  fileMovableTo(fileId, destinationId) {
    const file = this.hierarchy.getFile(fileId);
    const destination = this.hierarchy.getFile(destinationId);

    return file.movableTo(destination);
  }
}
