import { useBundlrContext } from '../../contexts/BundlrContext'
import Preview from "./../Preview";

export default function Explorer() {
  const { fileSystem } = useBundlrContext()

  return (
    <div>
      {
        fileSystem.hierarchy.getChildren('root').map((file, i) => (
          <Preview key={i} file={file} />
        ))
      }
    </div>
  );
}
