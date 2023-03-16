export default function FilePreview({ src, type, className, enableControls }) {
    if (!type) return <></>

    if (type.match("image/*")) {
        return <img src={src} className={className} />;
    }

    if (type.match("video/*")) {
        return (
            <video className={className} controls={enableControls}>
                <source src={src} />
            </video>
        );
    }

    if (type.match("audio/*")) {
        return (
            <audio className={className} controls>
                <source src={src} />
            </audio>
        );
    }
}