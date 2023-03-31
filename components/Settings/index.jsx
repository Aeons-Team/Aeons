import style from './style.module.css'
import { useDriveState } from '../../stores/DriveStore'

export default function Settings() {

    const [contract] = useDriveState(state => [state.contract])
    const getInternalOwner = () => contract.createInternalOwner()

    return (
        <div className={style.settings}>
            <button onClick={getInternalOwner}>Create Internal Wallet</button>
        </div>
    )
}