export default function Preview({ src, name, type, contentType }) {
  if (type == "file") {
    if (contentType.match("image/*")) {
      return <img src={src} width="100px" height="100px"></img>;
    }

    if (contentType.match("video/*")) {
      return (
        <video width="200" controls>
          <source src={src} />
        </video>
      );
    }

    if (contentType.match("audio/*")) {
      return (
        <audio width="200" controls>
          <source src={src} />
        </audio>
      );
    }
  } else if (type == "folder") {
    return <div>{name}</div>;
  }
}
