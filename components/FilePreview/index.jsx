import { useEffect } from "react";
import Icon from '../Icon'

export default function FilePreview({ src, contentType, className, enableControls, onLoad }) {
    useEffect(() => {
        return () => URL.revokeObjectURL(src)
    }, [])

    useEffect(() => {
        if (!contentType.match('(image/*|video/*|audio/*)')) {
            onLoad()
        }
    }, [])

    if (!contentType) return <></>

    if (contentType.match("image/*")) {
        return <img onLoad={onLoad} src={src} className={className} />;
    }

    if (contentType.match("video/*")) {
        return (
            <video onCanPlay={onLoad} autoPlay muted loop className={className} controls={enableControls}>
                <source src={src} />
            </video>
        );
    }

    if (contentType.match("audio/*")) {
        return (
            <audio onLoad={onLoad} className={className} controls>
                <source src={src} />
            </audio>
        );
    }

    return <div className={className} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name='file' width='2.5rem' height='2.5rem' fill />
    </div>
}