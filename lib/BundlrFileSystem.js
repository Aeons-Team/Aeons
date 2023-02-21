import fileReaderStream from "filereader-stream";
import { gql } from "@apollo/client"

export default class BundlrFileSystem {
	constructor(client) {
		this.client = client;
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
		const res = await this.client.queryGraphQL({
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
        owners: [this.client.owner],
      },
    });

    return res.data.transactions.edges.map((edge) => edge.node);
	}
}