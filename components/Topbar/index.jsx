import style from './style.module.css'
import ThemeButton from '../ThemeButton';
import Search from '../Search'
import Wallet from '../Wallet';

export default function Topbar() {
    return (
        <div className={style.topbar}>
            <Search />

            <div className={style.topbarRight}>
                <ThemeButton />
                <Wallet />
            </div>
        </div>
    )
}