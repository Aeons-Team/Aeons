import Spinner from 'react-spinner-material'
import { useDriveStore } from '../../stores/DriveStore'
import style from './style.module.css'

export default function Loading() {
    const loadingText = useDriveStore(state => state.loadingText)

    return (
        <div className={style.loading}>
            <Spinner radius={64} color='var(--color-active)' stroke={2} />
            
            <span className={style.loadingText}>
                {loadingText}
            </span>
        </div>
    )
}