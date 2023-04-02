import { useRef, useEffect, useState } from 'react';
import { useDriveState } from '../../stores/DriveStore';
import FilePreview from "../FilePreview";
import Utility from "../../lib/Utility"
import Button from "../Button";
import Icon from '../Icon'
import style from './style.module.css';

export default function UploadQueue() {
    const {
        client,
        paused,
        uploading, 
        uploadQueue, 
        bytesUploaded, 
        pauseOrResume, 
        uploadNext, 
        currentName,
        removeFromUploadQueue
     } = useDriveState((state) => ({
         client: state.client,
         paused: state.paused,
        uploading: state.uploading,
        uploadQueue: state.uploadQueue,
        bytesUploaded: state.bytesUploaded,
        pauseOrResume: state.pauseOrResume,
        uploadNext: state.uploadNext,
        currentName: state.currentName,
        removeFromUploadQueue: state.removeFromUploadQueue
    }));

    const currentUpload = uploadQueue.length && uploadQueue[0].file
    const uploadedPerc = currentUpload && (bytesUploaded / currentUpload.size) * 100
    const currentNameRef = useRef()
    const [currentPrice, setCurrentPrice] = useState()

    useEffect(() => {
        if (currentUpload) {
            currentNameRef.current = currentUpload.name
            setCurrentPrice(-1)
    
            client.getPrice(currentUpload.size).then(price => setCurrentPrice(price))        
        }
    }, [currentUpload])

    return (
        <div className={style.uploadQueue}>

        {(uploading || uploadQueue.length > 0) && (
            <div>
                <div className={style.queueTop}>
                    <div className={style.currentUpload}>
                        <FilePreview
                            className={style.queueTopPreview}
                            src={URL.createObjectURL(currentUpload)}
                            contentType={currentUpload.type}
                        />

                        {
                            uploading &&
                            <div className={style.currentUploadInfo}>
                                <div className={style.currentUploadInfoTop}>
                                    <span>{currentName}</span>
                                    <span onClick={pauseOrResume}>
                                        <Icon name={paused ? 'play' : 'pause'} width='1rem' height='1rem' fill />
                                    </span>
                                </div>

                                <div className={style.currentUploadInfoBottom}>
                                    <span>{uploadedPerc}%</span>
                                    <span>{Utility.formatBytes(bytesUploaded)} / {Utility.formatBytes(currentUpload.size)}</span> 
                                </div>
                            </div>
                        }

                        {
                            !uploading &&
                            <div className={style.confirmUpload}>
                                <div className={style.confirmUploadInfo}>
                                    <span 
                                        contentEditable 
                                        suppressContentEditableWarning
                                        onInput={(e) => currentNameRef.current = e.target.innerHTML}
                                    >
                                        {currentUpload.name}
                                    </span>

                                    <span>
                                        {
                                            currentPrice == -1 
                                                ? 'loading..'
                                                : `${Number(currentPrice).toFixed(6)} ${client.networkCurrencySym}`
                                        }
                                    </span>
                                </div>

                                <Button onClick={() => uploadNext(currentNameRef.current)}>
                                    Confirm
                                </Button>
                            </div>
                        }

                        <span onClick={() => removeFromUploadQueue(0)}>
                            <Icon name='cross' width='1.5rem' height='1.5rem' />
                        </span>
                    </div>

                    <div className={style.loading}> 
                        <div style={{ width: `${uploadedPerc}%` }} className={style.loadingInner} />
                    </div>
                </div>

                {uploadQueue.slice(1).map((item, i) => (
                    <div key={i} className={style.queueItem}>
                        <FilePreview
                            className={style.queueItemPreview}
                            src={URL.createObjectURL(item.file)}
                            contentType={item.file.type}
                        />

                        <div className={style.queueItemInfo}>
                            <span>{item.file.name}</span>
                            <span>{Utility.formatBytes(item.file.size)}</span>
                        </div>

                        <span onClick={() => removeFromUploadQueue(i+1)}>
                            <Icon name='cross' width='1.5rem' height='1.5rem' />
                        </span>
                    </div>
                ))}
            </div>
        )}
        </div>
    )
}