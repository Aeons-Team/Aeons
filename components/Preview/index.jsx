export default function Preview({ file }) {  
    if (file.type == 'file') {
        const src = `https://arweave.net/${file.id}`;

        if (file.contentType.match("image/*")) {
            return <img src={src} width="100px" height="100px"></img>
        }
    
        if (file.contentType.match("video/*")) {
            return <video width="200" controls>
                <source src={src} />
            </video>
        }
    
        if (file.contentType.match("audio/*")) {
            return <audio width="200" controls>
                <source src={src} />
            </audio>
        }
    }

    else if (file.type == 'folder') {
        return (
            <div>{file.name}</div>
        )
    };
}