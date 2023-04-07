import { useRef, useEffect, useState } from 'react';
import Spinner from 'react-spinner-material'
import { AnimatePresence, motion } from 'framer-motion';
import { useDriveState } from '../../stores/DriveStore';
import FilePreview from "../FilePreview";
import Utility from "../../lib/Utility"
import Button from "../Button";
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
        <>        
            {(uploading || uploadQueue.length > 0) && (
                <div className={style.uploadQueue}>
                    <div>
                        <div className={style.dropdown}>
                            <IconButton 
                                name='minimize'
                                width='2rem' 
                                height='2rem' 
                                onClick={()=>setMinimized(!minimized)} 
                                animate={{ rotate: minimized ? '180deg' : '0deg' }}  
                                transition={{ 
                                    type: 'spring',
                                    damping: 14
                                }}
                                fill
                            />
                        </div>

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
                                        <div className={style.currentUploadInfoInner}>
                                            <div className={style.currentUploadInfoTop}>
                                                <span className={style.fileName}>{currentName}</span>
                                            </div>

                                            {
                                                uploadSpeed > 0 && 
                                                <div className={style.timeEstimate}>
                                                    {Utility.formatTime((uploadQueue[0].file.size - bytesUploaded) / uploadSpeed)} remaining
                                                </div>
                                            }
                                        </div>

                                        <AnimatePresence>
                                        {
                                            !minimized &&
                                            <motion.div 
                                                key='upload-stats'
                                                initial={{
                                                    height: 0,
                                                    opacity: 0,
                                                    marginTop: 0
                                                }}
                                                animate={{
                                                    height: 10,
                                                    opacity: 1,
                                                    marginTop: 8
                                                }}
                                                exit={{
                                                    height: 0,
                                                    opacity: 0,
                                                    marginTop: 0
                                                }}
                                                className={style.currentUploadInfoBottom}
                                            >
                                                <span>{uploadedPerc.toFixed(1)}%</span>
                                                <span>{Utility.formatBytes(bytesUploaded)} / {Utility.formatBytes(currentUpload.size)}</span> 
                                                <span>{Utility.formatBytes(uploadSpeed)}/s</span>
                                            </motion.div>
                                        }
                                        </AnimatePresence>
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
                                                className={style.fileName}
                                            >
                                                {currentUpload.name}
                                            </span>

                                            <span className={style.currentPrice}>
                                                {
                                                    currentPrice == -1 
                                                        ? <Spinner radius={10} stroke={1} color='var(--color-active)' />
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
                                    <div className={style.speedStats}>
                                        {uploading && <IconButton name={paused ? 'play' : 'pause'} width='0.8rem' height='0.8rem' onClick={pauseOrResume} fill />}
                                        <div className={style.topCross}>
                                            <IconButton name='cross' width='1.5rem' height='1.5rem' onClick={() => removeFromUploadQueue(0)}/>
                                        </div>
                                    </div>       
                                </div>
                            </div>

                            <div className={style.loading}> 
                                <div style={{ width: `${uploadedPerc}%` }} className={style.loadingInner} />
                            </div>
                        </div>

                        <motion.div
                            style={{ overflow: 'hidden' }}
                            animate={{ height: minimized ? 0 : 'auto' }}
                        >
                            {uploadQueue.slice(1,5).map((item, i) => (
                                <div key={i} className={style.queueItem}>
                                    <FilePreview
                                        className={style.queueItemPreview}
                                        src={URL.createObjectURL(item.file)}
                                        contentType={item.file.type}
                                    />

                                    <div className={style.queueItemInfo}>
                                        <span className={style.fileName}>{item.name}</span>
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
                        </motion.div>
                    </div>
                </div>
            )}
        </>
    )
}