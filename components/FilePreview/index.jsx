export default function FilePreview({ src, type }) {
  if (!type) return <></>

  if (type.match("image/*")) {
    return <img src={src} width="100px" height="100px"></img>;
  }

  if (type.match("video/*")) {
    return (
      <video width="200" controls>
        <source src={src} />
      </video>
    );
  }

  if (type.match("audio/*")) {
    return (
      <audio width="200" controls>
        <source src={src} />
      </audio>
    );
  }
}