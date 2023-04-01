import { useDriveState } from '../../stores/DriveStore';
import FilePreview from "../FilePreview";
import Utility from "../../lib/Utility"
import style from './style.module.css';

export default function UploadQueue() {
    const {
        uploading, uploadQueue, currentUpload, bytesUploaded, pauseOrResume
     } = useDriveState((state) => ({
        uploading: state.uploading,
        uploadQueue: state.uploadQueue,
        currentUpload: state.currentUpload,
        bytesUploaded: state.bytesUploaded,
        pauseOrResume: state.pauseOrResume
    }));

    const uploadedPerc = currentUpload && (bytesUploaded / currentUpload.size) * 100

    return (
        <div className={style.uploadQueue}>

        {uploading && (
            <div>
                <div className={style.queueTop}>
                    <div className={style.currentUpload}>
                        <FilePreview
                            className={style.queueTopPreview}
                            src={URL.createObjectURL(currentUpload)}
                            contentType={currentUpload.type}
                        />

                        <div className={style.currentUploadInfo}>
                            <div className={style.currentUploadInfoTop}>
                                <span>{currentUpload.name}</span>
                                <button onClick={pauseOrResume}>pause / resume</button>
                            </div>

                            <div className={style.currentUploadInfoBottom}>
                                <span>{uploadedPerc}%</span>
                                <span>{Utility.formatBytes(bytesUploaded)} / {Utility.formatBytes(currentUpload.size)}</span> 
                            </div>
                        </div>
                    </div>

                    <div className={style.loading}> 
                        <div style={{ width: `${uploadedPerc}%` }} className={style.loadingInner} />
                    </div>
                </div>

                {uploadQueue.map((item, i) => (
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
                    </div>
                ))}
            </div>
        )}
        </div>
    )
}