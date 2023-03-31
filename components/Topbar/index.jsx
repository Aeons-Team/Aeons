import style from './style.module.css'
import ModeButton from '../ModeButton';
import Search from '../Search'
import Wallet from '../Wallet';

export default function Topbar() {
    return (
        <div className={style.topbar}>
            <Search />

            <div className={style.topbarRight}>
                <ModeButton />
                <Wallet />
            </div>
        </div>
    )
}