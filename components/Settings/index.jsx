import style from './style.module.css'
import { useDriveState } from '../../stores/DriveStore'

export default function Settings() {

    const [contract] = useDriveState(state => [state.contract])
    async function getInternalOwner ()
     {
        const internalOwner = await contract.createInternalOwner()
        console.log(internalOwner)
    }
    return (
        <div className={style.settings}>
            <button onClick={getInternalOwner}>Create Internal User</button>
        </div>
    )
}