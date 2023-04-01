import { useRouter } from "next/router";
import { useState } from "react";
import { useDriveStore } from "../../stores/DriveStore";
import { useAppStore } from "../../stores/AppStore";
import Button from "../Button";
import FilePreview from "../FilePreview";
import Icon from "../Icon";
import style from "./style.module.css";

let seq = 0

export default function Uploader() {
  const { id: activeFileId } = useRouter().query;
  
  const { uploadFiles, client } = useDriveStore((state) => ({ 
    uploadFiles: state.uploadFiles, 
    client: state.client
  }));

  const activateContextMenu = useAppStore((state) => state.activateContextMenu)

  const [files, setFiles] = useState();

  return (
    <div className={style.uploader}>
      <span className={style.title}>
        Upload Files
      </span>

      <div className={style.uploaderInner}>
        <input
          id='upload-input'
          hidden
          type="file"
          multiple
          onChange={async (e) => {
            const files = {}

            Array.from(e.target.files).forEach(file => {
              const key = `file-${seq++}`

              files[key] = {
                obj: file, 
                url: URL.createObjectURL(file),
                price: -1
              }
            })

            setFiles(files)

            for (const key of Object.keys(files)) {
              const price = await client.getPrice(files[key].obj.size)

              setFiles(files => {
                files[key].price = price 
                return { ...files }
              })
            }

            e.target.value = null
          }}
        />

        <label htmlFor='upload-input'>
          <div className={style.uploadLabel}>
            <Icon name='add' width='2rem' height='2rem' invert />
          </div>
        </label>

        {
          files && 
          <div>
            {
              Object.keys(files).map(key => {
                const file = files[key]

                return (
                  <div key={key} className={style.uploaderItem}>
                    <FilePreview className={style.uploaderPreview} contentType={file.obj.type} src={file.url} />
                    <span>{file.obj.name}</span>
                    
                    { file.price == -1 ? 'loading..' : file.price }

                    <span 
                      onClick={() => {
                        setFiles(files => {
                          delete files[key]
                          return { ...files }
                        })
                      }}>
                      <Icon name='cross' width='1.5rem' height='1.5rem' />
                    </span>
                  </div>
                )
              })
            }

            <Button
              onClick={() => {
                activateContextMenu(false);
                uploadFiles(Object.keys(files).map(key => files[key].obj), activeFileId);
              }}
            >
              Upload
            </Button>
          </div>
        }
      </div>
    </div>
  );
}
