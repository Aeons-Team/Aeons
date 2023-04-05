import style from './style.module.css'
import Search from '../Search'
import Wallet from '../Wallet';

export default function Topbar() {
    return (
        <div className={style.topbar}>
            <Search />
            <Wallet />
        </div>
    )
}