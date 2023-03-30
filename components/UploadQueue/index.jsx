import { useDriveState } from '../../stores/DriveStore';
import FilePreview from "../FilePreview";
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

    return (
        <div className={style.uploadQueue}>

        {uploading && (
            <div>
                <div className={style.currentUpload}>
                    <FilePreview
                        src={URL.createObjectURL(currentUpload)}
                        contentType={currentUpload.type}
                        className={style.queuePreview}
                    />

                    <button onClick={pauseOrResume}>pause / resume</button>
                    {(bytesUploaded / currentUpload.size) * 100}%
                </div>

                {uploadQueue.map((item, i) => (
                    <div key={i}>
                        {item.file.name}
                    </div>
                ))}
            </div>
        )}
        </div>
    )
}