import { WebBundlr } from '@bundlr-network/client';
import { ethers } from 'ethers';
import fileReaderStream from 'filereader-stream'

export default class BundlrClient {
    async initialize() {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        this.bundlr = new WebBundlr("https://node2.bundlr.network", "arbitrum", provider);
        await this.bundlr.ready();
    }

    async upload(file) {
        const dataStream = fileReaderStream(file);
        
        const tx = await this.bundlr.upload(dataStream, {
            tags: [
                { name: "Content-Type", value: file.type }
            ],
        });
        
        console.log(`File uploaded ==> https://arweave.net/${tx.id}`);
    }
}