import Icon from '../Icon'
import style from './style.module.css'

export default function Sidebar() {
    return (
        <div className={style.sidebar}>
            <Icon name='drive' fill />
            <Icon name='settings' fill />
            <Icon name='archive' />
        </div>
    )
}