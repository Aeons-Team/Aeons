import { useEffect, useState } from "react";
import Icon from '../Icon'

export default function FilePreview({ src, file, contentType, className, enableControls, onLoad, size }) {
    const [localSrc, setLocalSrc] = useState(src)
    
    useEffect(() => {
        const init = async () => {
            if (file) {
                if (contentType.startsWith('image/')) {
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
    
                else {
                    setLocalSrc(' ')
                }
            }
        }

        init()

        if (file) {
            return () => {
                URL.revokeObjectURL(localSrc)
            }
        }
    }, [file])

    if (!localSrc || !contentType) return <div className={className} />

    if (contentType.match("image/*")) {
        return <img onLoad={onLoad} src={localSrc} className={className} width={size} height={size} />;
    }

    if (src && contentType.match("video/*")) {
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

    onLoad()

    return <div className={className} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name='file' width='2.5rem' height='2.5rem' fill />
    </div>
}