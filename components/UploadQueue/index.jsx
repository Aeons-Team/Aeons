import { useRef, useEffect, useState } from 'react';
import { useDriveState } from '../../stores/DriveStore';
import FilePreview from "../FilePreview";
import Utility from "../../lib/Utility"
import Button from "../Button";
import Icon from '../Icon'
import IconButton from "../IconButton"
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
        removeFromUploadQueue,
        uploadSpeed
     } = useDriveState((state) => ({
         client: state.client,
         paused: state.paused,
        uploading: state.uploading,
        uploadQueue: state.uploadQueue,
        bytesUploaded: state.bytesUploaded,
        pauseOrResume: state.pauseOrResume,
        uploadNext: state.uploadNext,
        currentName: state.currentName,
        removeFromUploadQueue: state.removeFromUploadQueue,
        uploadSpeed: state.uploadSpeed
    }));

    const currentUpload = uploadQueue.length && uploadQueue[0].file
    const uploadedPerc = currentUpload && (bytesUploaded / currentUpload.size) * 100
    const currentNameRef = useRef()
    const [currentPrice, setCurrentPrice] = useState()
    const [minimized, setMinimized] = useState(false)

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
                                    <span>{currentName.length > 17 ? currentName.substring(0, 10) + '...' + currentName.substring(currentName.length - 7) : currentName}</span>
                                </div>

                                {
                                    uploadSpeed > 0 && 
                                    <div>
                                        {Utility.formatTime((uploadQueue[0].file.size - bytesUploaded) / uploadSpeed)} remaining
                                    </div>
                                }

                                {   
                                    !minimized && 
                                    <div className={style.currentUploadInfoBottom}>
                                        <span>{uploadedPerc.toFixed(1)}%</span>
                                        <span>{Utility.formatBytes(bytesUploaded)} / {Utility.formatBytes(currentUpload.size)}</span> 
                                        {uploadSpeed > 0 && <span>{Utility.formatBytes(uploadSpeed)}/s</span>}
                                    </div>
                                }
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
                                        {currentUpload.name.length > 17 ? currentUpload.name.substring(0, 10) + '...' + currentUpload.name.substring(currentUpload.name.length - 7) : currentUpload.name}
                                    </span>

                                    <span>
                                        {
                                            currentPrice == -1 
                                                ? 'loading..'
                                                : `${Number(currentPrice).toFixed(6)} ${client.networkCurrencySym}`
                                        }
                                    </span>
                                </div>
                                <div className={style.speedStatsLeft}>
                                    <Button onClick={() => uploadNext(currentNameRef.current)}>
                                        Confirm
                                    </Button>
                                </div>
                            </div>
                        }
                        <div className={style.currentUploadRight}>
                            <div className={style.dropdown}>
                                <IconButton name={minimized ? 'maximize' : 'minimize'}  width='2rem' height='2rem' onClick={()=>setMinimized(!minimized)} fill/>
                            </div>
                            <div className={style.speedStats}>
                                {uploading && <IconButton name={paused ? 'play' : 'pause'} width='1rem' height='1rem' onClick={pauseOrResume} fill />}
                                <div className={style.dropdown}>
                                    <IconButton name='cross' width='1.5rem' height='1.5rem' onClick={() => removeFromUploadQueue(0)}/>
                                </div>
                            </div>       
                        </div>
                    </div>

                    <div className={style.loading}> 
                        <div style={{ width: `${uploadedPerc}%` }} className={style.loadingInner} />
                    </div>
                </div>

                {!minimized && uploadQueue.slice(1,5).map((item, i) => (
                    <div key={i} className={style.queueItem}>
                        <FilePreview
                            className={style.queueItemPreview}
                            src={URL.createObjectURL(item.file)}
                            contentType={item.file.type}
                        />

                        <div className={style.queueItemInfo}>
                            <span>{item.file.name.length > 17 ? item.file.name.substring(0, 10) + '...' + item.file.name.substring(item.file.name.length - 7) : item.file.name}</span>
                            <span>{Utility.formatBytes(item.file.size)}</span>
                        </div>
                        <div className={style.queueItemCancel}>
                            <IconButton name='cross' width='1.5rem' height='1.5rem' onClick={() => removeFromUploadQueue(i+1)}/>
                        </div>
                    </div>
                ))}

                {
                    uploadQueue.length > 5 &&
                    <div className={style.queueItem}>
                        <div className={style.remaining}>
                        + {uploadQueue.length - 5} more file{uploadQueue.length - 5 > 1 && 's'} remaining
                        </div>
                    </div>
                }
            </div>
        )}
        </div>
    )
}