import Spinner from 'react-spinner-material'
import { useEffect, useState } from "react";
import Icon from '../Icon'

export default function FilePreview({ src, file, contentType, className, enableControls, size }) {
    const [localSrc, setLocalSrc] = useState(src)
    
    const [loading, setLoading] = useState(
        contentType.match('image/*') || (src && contentType.match('video/*'))
    )
    
    useEffect(() => {
        const init = async () => {
            if (file && contentType.startsWith('image/')) {
                setLocalSrc()
                const reader = new FileReader()

                reader.onload = () => {
                    const image = new Image()
                    image.src = reader.result

                    image.onload = () => {
                        let width = image.width 
                        let height = image.height 

                        if (width > height) {
                            let tempWidth = width
                            width = size 
                            height = (size / tempWidth) * height
                        }

                        else {
                            let tempHeight = height
                            height = size
                            width = (size / tempHeight) * width
                        }

                        const canvas = document.createElement('canvas')
                        canvas.width = width
                        canvas.height = height

                        const ctx = canvas.getContext('2d')
                        ctx.drawImage(image, 0, 0, width, height)

                        setLocalSrc(canvas.toDataURL(file.type))
                        setLoading(false)
                    }
                }

                reader.readAsDataURL(file)
            }
        }

        init()

        if (file) {
            return () => {
                URL.revokeObjectURL(localSrc)
            }
        }
    }, [file])

    let preview

    if (!contentType) preview = <div className={className} />

    else if (contentType.match("image/*")) {
        preview = <img src={localSrc} onLoad={() => setLoading(false)} className={className} width={size} height={size} />;
    }

    else if (src && contentType.match("video/*")) {
        preview = (
            <video  
                onPause={(e) => {
                    e.target.currentTime = 0
                    e.target.play().catch(() => {})
                }} 
                onCanPlay={() => setLoading(false)}
                autoPlay 
                muted 
                className={className} 
                controls={enableControls}
            >
                <source src={localSrc + '#t=0,3'} />
            </video>
        )
    }

    else {
        preview = (
            <div className={className} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-primary-3)' }}>
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