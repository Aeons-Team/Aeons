import { useDriveStore } from '../../stores/DriveStore'
import style from './style.module.css'

export default function Settings() {
    const contract = useDriveStore(state => state.contract)

    return (
        <div className={style.settings}>
            <button>create new</button>
        </div>
    )
}