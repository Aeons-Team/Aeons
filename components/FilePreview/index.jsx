import Spinner from 'react-spinner-material';
import { useEffect, useState } from "react";
import { useDriveState } from '../../stores/DriveStore';
import Crypto from '../../lib/Crypto';
import Utility from '../../lib/Utility';
import Icon from '../Icon'

export default function FilePreview({ src, file, contentType, encryption, className, size }) {
    const [localSrc, setLocalSrc] = useState(null)
    
    const [loading, setLoading] = useState(
        contentType.startsWith('image/')
    )

    const { contract } = useDriveState(state => ({
        contract: state.contract
    }))

    useEffect(() => {
        const init = async () => {
            if (contentType.startsWith('image/')) {
                if (file) {
                    setLocalSrc()
                    const reader = new FileReader()
    
                    reader.onload = () => {
                        Utility.resizeImage(reader.result, size).then(url => setLocalSrc(url))
                    }
    
                    reader.readAsDataURL(file)
                }

                else if (src) {
                    if (encryption) {
                        const { key, iv } = await Crypto.decrypt(encryption, contract.internalWallet.privateKey)

                        const imgDataEncrypted = await fetch(src).then(res => res.arrayBuffer())

                        const keyImported = await Crypto.aesImportKey(key)

                        const imgData = await Crypto.aesDecrypt(imgDataEncrypted, keyImported, iv)

                        const blob = new Blob([imgData])

                        const url = URL.createObjectURL(blob)

                        Utility.resizeImage(url, size).then(url => setLocalSrc(url))
                    }

                    else {
                        Utility.resizeImage(src, size).then(url => setLocalSrc(url))
                    }
                }
            }
        }

        init()

        return () => {
            URL.revokeObjectURL(localSrc)
        }
    }, [file])

    let preview

    if (!contentType) preview = <div className={className} />

    else if (contentType.match("image/*")) {
        preview = <img src={localSrc} className={className} onLoad={() => setLoading(false)} />;
    }

    else {
        preview = (
            <div className={className} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name='file' width='2rem' height='2rem' fill />
            </div>
        )
    }

    return loading 
        ? (
            <div className={className} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Spinner radius={16} color='var(--color-active)' stroke={2} />
                <div hidden>{preview}</div>
            </div>
        )
        : preview
}