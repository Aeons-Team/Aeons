export default function Preview({ url, type }) {
    if (!url || !type) return <></>

    if (type.match("image/*")) {
        return <img src={url} width="100px" height="100px"></img>
    }

    if (type.match("video/*")) {
        return <video width="200" controls>
            <source src={url} />
        </video>
    }

    if (type.match("audio/*")) {
        return <audio width="200" controls>
            <source src={url} />
        </audio>
    }
}