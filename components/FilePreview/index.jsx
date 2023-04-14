import { useEffect, useState, useRef } from "react";
import Spinner from 'react-spinner-material';
import { useDriveState } from '../../stores/DriveStore';
import { useAppState, useAppStore } from '../../stores/AppStore';
import Crypto from '../../lib/Crypto';
import Utility from '../../lib/Utility';
import Icon from '../Icon'

export default function FilePreview({ src, file, contentType, encryption, className, size }) {
    const [localSrc, setLocalSrc] = useState(null)
    const localSrcRef = useRef()
    
    const [loading, setLoading] = useState(
        contentType.startsWith('image/')
    )

    const { contract } = useDriveState(state => ({
        contract: state.contract
    }))

    const { cacheResource } = useAppState(state => ({
        cacheResource: state.cacheResource
    }))

    useEffect(() => {
        localSrcRef.current = localSrc
    }, [localSrc])

    useEffect(() => {
        const init = async () => {
            if (contentType.startsWith('image/')) {
                if (file) {
                    setLocalSrc()
                    const reader = new FileReader()
    
                    reader.onload = async () => {
                        const resized = await Utility.resizeImage(reader.result, size)

                        setLocalSrc(resized)
                    }
    
                    reader.readAsDataURL(file)
                }

                else if (src) {
                    if (encryption) {
                        const decrypted = await Crypto.decryptFromUrl(src, encryption, contract.internalWallet.privateKey)
                        const resized = await Utility.resizeImage(decrypted, size)

                        setLocalSrc(resized)
                        cacheResource(src, resized)
                    }

                    else {
                        const resized = await Utility.resizeImage(src, size)

                        setLocalSrc(resized)
                        cacheResource(src, resized)
                    }
                }
            }
        }

        const cache = useAppStore.getState().resourceCache

        if (src && src in cache) {
            setLocalSrc(cache[src])
        }

        else {
            init()
        }

        if (file && contentType.startsWith('image/')) {
            return () => {  
                URL.revokeObjectURL(localSrcRef.current)
            }
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
                <Icon name='file' width='2.25rem' height='2.25rem' fill />
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