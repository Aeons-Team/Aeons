import { decryptWithPrivateKey, encryptWithPublicKey, Encrypted } from 'eth-crypto'
import { ContractFile } from './ContractState'

interface KeyIv {
    key: ArrayBuffer,
    iv: ArrayBuffer
}

export default class Crypto {
    static async aesGenKey(): Promise<CryptoKey> {
        return crypto.subtle.generateKey({ name: 'aes-cbc', length: 256 }, true, ['encrypt', 'decrypt'])
    }

    static async aesExportKey(key: CryptoKey): Promise<string> {
        const buffer = await crypto.subtle.exportKey('raw', key)
        return Buffer.from(buffer).toString('hex')
    }
    
    static async aesImportKey(key: ArrayBuffer): Promise<CryptoKey> {
        return crypto.subtle.importKey('raw', key, { name: 'aes-cbc', length: 256 }, true, ['encrypt', 'decrypt'])
    }

    static async aesEncryptFile(file: File, key: CryptoKey, iv: ArrayBuffer): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
    
            reader.onload = async () => {
                if (!reader.result) {
                    reject()
                }

                const encrypted = await crypto.subtle.encrypt({ name: 'aes-cbc', length: 256, iv }, key, reader.result)
                resolve(Buffer.from(encrypted))
            }
    
            reader.readAsArrayBuffer(file)
        })
    }

    static async decryptedFileUrl(id: string, encryption: string, privateKey: string, contentType: string): Promise<string> {
        const decrypted = await Crypto.decrypt(encryption, privateKey)
        const key = Buffer.from(decrypted.key).toString('hex')
        const iv = Buffer.from(decrypted.iv).toString('hex')
        const url = `https://${window.location.host}/file/${id}?key=${key}&iv=${iv}&contentType=${contentType}`

        return url
    }

    static async aesDecrypt(buffer: ArrayBuffer, key: CryptoKey, iv: ArrayBuffer): Promise<ArrayBuffer> {
        return crypto.subtle.decrypt({ name: 'aes-cbc', length: 256, iv }, key, buffer)
    }

    static async encryptKey(key: CryptoKey, publicKey: string): Promise<Encrypted> {
        let keyExported = await Crypto.aesExportKey(key)

        return encryptWithPublicKey(publicKey, keyExported)
    }

    static async decrypt(encryption: string, privateKey: string): Promise<KeyIv> {
        const iv = encryption.substring(0, 32)
        const mac = encryption.substring(32, 96)
        const ephemPublicKey = encryption.substring(96, 226)
        const ciphertext = encryption.substring(226)

        const key = await decryptWithPrivateKey(privateKey, {
            iv,
            mac,
            ephemPublicKey,
            ciphertext
        })

        return { 
            key: Buffer.from(key, 'hex').buffer, 
            iv: Buffer.from(iv, 'hex').buffer 
        }
    }

    static async decryptFromUrl(url: string, encryption: string, privateKey: string, contentType: string): Promise<string> {
        const { key, iv } = await this.decrypt(encryption, privateKey)

        const encrypted = await fetch(url).then(res => res.arrayBuffer())

        const keyImported = await this.aesImportKey(key)

        const decrypted = await this.aesDecrypt(encrypted, keyImported, iv)

        const blob = new Blob([decrypted], {type: contentType})

        return URL.createObjectURL(blob)
    }

    static async decryptContractFile(file: ContractFile, privateKey: string): Promise<string> {
        if (!file.encryption) throw new Error('file is not encrypted') 

        return this.decryptFromUrl(`${process.env.NEXT_PUBLIC_ARWEAVE_URL}/${file.id}`, file.encryption, privateKey, file.contentType)
    }
}