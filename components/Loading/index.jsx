import Spinner from 'react-spinner-material'
import { useDriveStore } from '../../stores/DriveStore'
import style from './style.module.css'

export default function Loading() {
    const loadingText = useDriveStore(state => state.loadingText)

    return (
        <div className={style.loading}>            
            <span className={style.loadingText}>
                {loadingText}
            </span>

            <Spinner radius={24} color='var(--color-active)' stroke={2} />
        </div>
    )
}