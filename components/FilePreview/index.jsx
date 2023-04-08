import { useEffect, useState } from "react";
import Icon from '../Icon'

export default function FilePreview({ src, file, contentType, className, enableControls, onLoad, size }) {
    const [localSrc, setLocalSrc] = useState(src)
    
    useEffect(() => {
        const init = async () => {
            if (file) {
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

    useEffect(() => {
        if (localSrc) {
            if (!contentType.match('(image/*|video/*|audio/*)')) {
                onLoad()
            }
        }
    }, [localSrc])

    if (!localSrc || !contentType) return <div className={className} />

    if (contentType.match("image/*")) {
        return <img onLoad={onLoad} src={localSrc} className={className} width={size} height={size} />;
    }

    if (contentType.match("video/*")) {
        return (
            <video  
                onCanPlay={onLoad} 
                onPause={(e) => {
                    e.target.currentTime = 0
                    e.target.play().catch(() => {})
                }} 
                autoPlay 
                muted 
                className={className} 
                controls={enableControls}
            >
                <source src={localSrc + '#t=0,3'} />
            </video>
        );
    }

    if (contentType.match("audio/*")) {
        return (
            <audio onLoad={onLoad} className={className} controls>
                <source src={localSrc} />
            </audio>
        );
    }

    return <div className={className} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name='file' width='2.5rem' height='2.5rem' fill />
    </div>
}