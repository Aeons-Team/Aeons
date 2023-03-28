export default class Crypto {
    iv: Uint8Array
    config: any 
    key: CryptoKey

    constructor() {
        this.iv = crypto.getRandomValues(new Uint8Array(16))
        this.config = { name: 'aes-cbc', length: 256, iv: this.iv }
    }

    async initialize() {
        this.key = await crypto.subtle.generateKey(this.config, false, ['encrypt', 'decrypt'])
    }

    encrypt(text: string): Promise<ArrayBuffer> {
        const textEncoder = new TextEncoder()
        const encodedText = textEncoder.encode(text)

        return crypto.subtle.encrypt(this.config, this.key, encodedText)
    }

    async decrypt(cipherText: ArrayBuffer): Promise<string> {
        const decryptedBuffer = await crypto.subtle.decrypt(this.config, this.key, cipherText)
        const textDecoder = new TextDecoder()

        return textDecoder.decode(decryptedBuffer)
    }
}