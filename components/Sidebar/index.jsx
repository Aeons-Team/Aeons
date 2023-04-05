import { useRouter } from 'next/router'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useMediaQuery } from 'react-responsive'
import Icon from '../Icon'
import style from './style.module.css'

export default function Sidebar() {
    const router = useRouter()
    const [hovering, setHovering] = useState([false, false, false])
    const isMobile = useMediaQuery({ maxWidth: '820px' })

    const iconVariants = (strokeWidth, size, opacity) => ({
        normal: {
            strokeWidth,
            width: size,
            height: size,
            fill: 'var(--color-background)',
            stroke: 'var(--color-secondary)',
            opacity: opacity
        },

        selected: {
            fill: 'var(--color-secondary)',
            opacity: 1
        },

        hover: {
            opacity: opacity + 0.2
        }
    })

    const spanVariants = {
        normal: {
            height: 0,
            width: '2px',
            backgroundColor: 'var(--color-secondary)'
        },

        selected: {
            height: '180%',
            backgroundColor: 'var(--color-secondary)'
        },

        hover: {
            height: '50%'
        }
    }
    
    const spanVariantsMobile = {
        normal: {
            height: '2px',
            width: 0,
            backgroundColor: 'var(--color-secondary)'
        },

        selected: {
            height: '2px',
            width: '150%',
            backgroundColor: 'var(--color-secondary)'
        },

        hover: {
            height: '2px',
            width: '50%'
        }
    }

    return (
        <div className={style.sidebar}>
            <motion.span 
                className={style.sidebarOption} 
                onClick={() => router.push('/drive/root')}
                initial='normal'
                onMouseEnter={() => setHovering([true, false, false])}
                onMouseLeave={() => setHovering([false, false, false])}
                animate={router.pathname.startsWith('/drive') ? 'selected' : (hovering[0] ? 'hover' : 'normal')}
            >
                {
                    !isMobile 
                        ? <motion.span key='span-desk' variants={spanVariants} />
                        : <motion.span key='span-mob' variants={spanVariantsMobile} />
                }

                <Icon 
                    name='drive' 
                    variants={iconVariants(11, '1.5rem', 0.6)}
                />
            </motion.span>

            <motion.span 
                className={style.sidebarOption} 
                onClick={() => router.push('/settings')}
                initial='normal'
                onMouseEnter={() => setHovering([false, true, false])}
                onMouseLeave={() => setHovering([false, false, false])}
                animate={router.pathname.startsWith('/settings') ? 'selected' : (hovering[1] ? 'hover' : 'normal')}
            >
                {
                    !isMobile 
                        ? <motion.span key='span-desk' variants={spanVariants} />
                        : <motion.span key='span-mob' variants={spanVariantsMobile} />
                }

                <Icon 
                    name='settings' 
                    variants={iconVariants(1, '1.6rem', 0.7)}
                />
            </motion.span>

            <motion.span 
                className={style.sidebarOption}
                initial='normal'
                onMouseEnter={() => setHovering([false, false, true])}
                onMouseLeave={() => setHovering([false, false, false])}
                animate={router.pathname.startsWith('/archive') ? 'selected' : (hovering[2] ? 'hover' : 'normal')}
            >
                {
                    !isMobile 
                        ? <motion.span key='span-desk' variants={spanVariants} />
                        : <motion.span key='span-mob' variants={spanVariantsMobile} />
                }

                <Icon 
                    name='archive' 
                    variants={iconVariants(8, '1.55rem', 0.6)}
                />
            </motion.span>
        </div>
    )
}