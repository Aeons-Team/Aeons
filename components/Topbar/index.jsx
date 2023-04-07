import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive'
import Search from '../Search'
import Wallet from '../Wallet';
import style from './style.module.css'

export default function Topbar({ transition }) {
    const isMobile = useMediaQuery({ maxWidth: '820px' })

    return (
        <motion.div 
            initial={{ 
                y: isMobile ? -60 : -70, 
                opacity: 0 
            }}
            animate={{ 
                y: 0,
                opacity: 1
            }}
            className={style.topbar}
            transition={transition}
        >
            <Search />
            <Wallet />
        </motion.div>
    )
}