import { useRouter } from 'next/router'
import Icon from '../Icon'
import style from './style.module.css'

export default function Sidebar() {
    const router = useRouter()

    return (
        <div className={style.sidebar}>
            <span onClick={() => router.push('/drive/root')}>
                <Icon name='drive' fill />
            </span>

            <span>
                <Icon name='settings' fill />
            </span>

            <span>
                <Icon name='archive' strokeWidth={2} width='1.9rem' height='1.9rem' />
            </span>
        </div>
    )
}