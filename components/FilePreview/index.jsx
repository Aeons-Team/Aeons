export default function FilePreview({ src, contentType, className, enableControls }) {
    if (!contentType) return <></>

    if (contentType.match("image/*")) {
        return <img src={src} className={className} />;
    }

    if (contentType.match("video/*")) {
        return (
            <video className={className} controls={enableControls}>
                <source src={src} />
            </video>
        );
    }

    if (contentType.match("audio/*")) {
        return (
            <audio className={className} controls>
                <source src={src} />
            </audio>
        );
    }
}