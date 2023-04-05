import { useEffect } from "react";

export default function FilePreview({ src, contentType, className, enableControls, onLoad }) {
    useEffect(() => {
        return () => URL.revokeObjectURL(src)
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
}