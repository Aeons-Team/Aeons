import { useRef, useEffect, useState } from 'react';
import Spinner from 'react-spinner-material'
import { AnimatePresence, motion } from 'framer-motion';
import { shallow } from 'zustand/shallow'
import { useDriveState, useDriveStore } from '../../stores/DriveStore';
import FilePreview from "../FilePreview";
import Utility from "../../lib/Utility"
import Button from "../Button";
import IconButton from "../IconButton"
import style from './style.module.css';

function QueueItem({ i, item, preview }) {
    const { removeFromUploadQueue } = useDriveState((state) => ({
        removeFromUploadQueue: state.removeFromUploadQueue
    }));

    return (
        <div className={style.queueItem}>
            {preview}

            <div className={style.queueItemInfo}>
                <span className={style.fileName}>{item.file.name}</span>
                <span className={style.fileSize}>{Utility.formatBytes(item.file.size)}</span>
            </div>
            <div className={style.queueItemCancel}>
                <IconButton name='cross' width='1.5rem' height='1.5rem' onClick={() => removeFromUploadQueue(i+1)}/>
            </div>
        </div>
    )
}

function QueueTop({ minimized, preview }) {
    const {
        client,
        paused,
        uploading, 
        uploadQueue, 
        pauseOrResume, 
        uploadNext, 
        currentName,
        removeFromUploadQueue,
     } = useDriveState((state) => ({
        client: state.client,
        paused: state.paused,
        uploading: state.uploading,
        uploadQueue: state.uploadQueue,
        pauseOrResume: state.pauseOrResume,
        uploadNext: state.uploadNext,
        currentName: state.currentName,
        removeFromUploadQueue: state.removeFromUploadQueue
    }));

    const currentUpload = uploadQueue.length && uploadQueue[0].file
    const currentNameRef = useRef()
    const [currentPrice, setCurrentPrice] = useState()

    const statEstimateRef = useRef()
    const statPercRef = useRef()
    const statBytesRef = useRef()
    const statSpeedRef = useRef()
    const progressBarRef = useRef()
    const initialValsRef = useRef()

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
    }, [currentUpload])

    useEffect(() => {
        if (currentUpload) {
            currentNameRef.current = currentUpload.name
            setCurrentPrice(-1)
    
            client.getPrice(currentUpload.size).then(price => setCurrentPrice(price))        
        }
    }, [currentUpload])

    useEffect(() => {
        useDriveStore.subscribe(
            (state) => [state.uploadSpeed, state.bytesUploaded, state.uploadQueue, state.uploading],
            (stats) => {
                const [uploadSpeed, bytesUploaded, uploadQueue, uploading] = stats

                if (uploading) {
                    const currentUpload = uploadQueue[0].file
                    const uploadedPerc = (bytesUploaded / currentUpload.size) * 100

                    initialValsRef.current = [
                        `${Utility.formatTime((uploadQueue[0].file.size - bytesUploaded) / uploadSpeed)} remaining`,
                        `${uploadedPerc.toFixed(1)}%`,
                        `${Utility.formatBytes(bytesUploaded)} / ${Utility.formatBytes(currentUpload.size)}`,
                        `${Utility.formatBytes(uploadSpeed)}/s`
                    ]
    
                    if (statPercRef.current) statPercRef.current.innerHTML = initialValsRef.current[1]
                    if (statBytesRef.current) statBytesRef.current.innerHTML = initialValsRef.current[2]

                    if (uploadSpeed > 0) {
                        if (statSpeedRef.current) statSpeedRef.current.innerHTML = initialValsRef.current[3]

                        if (statEstimateRef.current) {
                            statEstimateRef.current.hidden = false
                            statEstimateRef.current.innerHTML = initialValsRef.current[0]
                        }
                    }

                    else {
                        if (statEstimateRef.current) statEstimateRef.current.hidden = true
                    }

                    if (progressBarRef.current) progressBarRef.current.style.width = `${uploadedPerc}%`
                }

                else {
                    if (progressBarRef.current) progressBarRef.current.style.width = `0%`
                }
            }, 
            { equalityFn: shallow }
        )
    }, [])

    return (
        <div className={style.queueTop}>
            <div className={style.currentUpload}>
                {preview}

                {
                    uploading &&
                    <div className={style.currentUploadInfo}>
                        <div className={style.currentUploadInfoInner}>
                            <div className={style.currentUploadInfoTop}>
                                <span className={style.topFileName}>{currentName}</span>
                            </div>

                            <div ref={statEstimateRef} hidden className={style.timeEstimate}>{initialValsRef.current[0]}</div>
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
                                    marginTop: 4
                                }}
                                exit={{
                                    height: 0,
                                    opacity: 0,
                                    marginTop: 0
                                }}
                                className={style.currentUploadInfoBottom}
                            >
                                <span ref={statPercRef}>{initialValsRef.current[1]}</span>
                                <span ref={statBytesRef}>{initialValsRef.current[2]}</span> 
                                <span ref={statSpeedRef}>{initialValsRef.current[3]}</span>
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
                                className={style.topFileName}
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
                <div ref={progressBarRef} className={style.loadingInner} />
            </div>
        </div>
    )
}

export default function UploadQueue() {
    const [minimized, setMinimized] = useState(false)

    const { uploading,  uploadQueue } = useDriveState((state) => ({
        uploading: state.uploading,
        uploadQueue: state.uploadQueue,
    }));

    const previews = uploadQueue.slice(0, 5).map((item, i) => (
        <FilePreview
            key={item.file.name}
            className={i == 0 ? style.queueTopPreview : style.queueItemPreview}
            contentType={item.file.type}
            file={item.file}
            size={i == 0 ? 128 : 64}
        />
    ))

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

                        <QueueTop minimized={minimized} preview={previews[0]} />

                        <motion.div
                            style={{ overflow: 'hidden' }}
                            animate={{ height: minimized ? 0 : 'auto' }}
                        >
                            {uploadQueue.slice(1,5).map((item, i) => (
                                <QueueItem key={item.file.name} i={i} item={item} preview={previews[i+1]} />
                            ))}

                            {
                                uploadQueue.length > 5 &&
                                <div className={style.remaining}>
                                + {uploadQueue.length - 5} more file{uploadQueue.length - 5 > 1 && 's'} remaining
                                </div>
                            }
                        </motion.div>
                    </div>
                </div>
            )}
        </>
    )
}