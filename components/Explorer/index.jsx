import Preview from "./../Preview";

export default function Explorer({ files }) {
  return (
    <>
      {files.map((file) => (
        <>
          <Preview url={file.src} type={file.type} />
        </>
      ))}
    </>
  );
}
