import { decryptWithPrivateKey } from 'eth-crypto'

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

    static async aesDecrypt(buffer: ArrayBuffer, key: CryptoKey, iv: ArrayBuffer): Promise<ArrayBuffer> {
        return crypto.subtle.decrypt({ name: 'aes-cbc', length: 256, iv }, key, buffer)
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
}