import { useRouter } from 'next/router'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useMediaQuery } from 'react-responsive'
import Icon from '../Icon'
import style from './style.module.css'

export default function Sidebar({ transition }) {
    const router = useRouter()
    const [hovering, setHovering] = useState([false, false, false])
    const isMobile = useMediaQuery({ maxWidth: '820px' })

    const iconVariants = (strokeWidth, size, opacity, disabledOpacity) => ({
        normal: {
            strokeWidth,
            width: size,
            height: size,
            fill: 'var(--color-background)',
            stroke: 'var(--color-secondary-5)',
            opacity: opacity,
            cursor: 'pointer'
        },

        selected: {
            fill: 'var(--color-active)',
            stroke: 'var(--color-active)',
            opacity: 1
        },

        hover: {
            opacity: opacity + 0.2
        },

        disabled: {
            opacity: disabledOpacity,
            cursor: 'default'
        }
    })

    const spanVariants = {
        normal: {
            height: 0,
            width: '2px',
            backgroundColor: 'var(--color-active)'
        },

        selected: {
            height: '125%',
            backgroundColor: 'var(--color-active)'
        },

        hover: {
            height: '30%'
        }
    }
    
    const spanVariantsMobile = {
        normal: {
            height: '2px',
            width: 0,
            backgroundColor: 'var(--color-active)'
        },

        selected: {
            height: '2px',
            width: '160%',
            backgroundColor: 'var(--color-active)'
        },

        hover: {
            height: '2px',
            width: '50%'
        }
    }

    const optionNameVariants = {
        normal: {
            opacity: 0.2
        },

        selected: {
            opacity: 1
        },

        hover: {
            opacity: 0.4
        },

        disabled: {
            opacity: 0.125
        }
    }

    return (
        <motion.div
            initial={{ 
                x: isMobile ? 0 : -65,
                y: isMobile ? 70 : 0,
                opacity: 0
            }} 
            animate={{ 
                x: 0, 
                y: 0,
                opacity: 1
            }} 
            className={style.sidebar}
            transition={transition}
        >
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
                    variants={iconVariants(11, '1.55rem', 0.35)}
                />

                {
                    !isMobile &&
                    <motion.span variants={optionNameVariants} className={style.optionName}>Drive</motion.span>
                }
            </motion.span>

            <motion.span 
                className={style.sidebarOption} 
                // onClick={() => router.push('/settings')}
                initial='normal'
                onMouseEnter={() => setHovering([false, true, false])}
                onMouseLeave={() => setHovering([false, false, false])}
                // animate={router.pathname.startsWith('/settings') ? 'selected' : (hovering[1] ? 'hover' : 'normal')}
                
                animate='disabled'
            >
                {
                    !isMobile 
                        ? <motion.span key='span-desk' variants={spanVariants} />
                        : <motion.span key='span-mob' variants={spanVariantsMobile} />
                }

                <Icon 
                    name='settings' 
                    variants={iconVariants(1, '1.65rem', 0.45, 0.35)}
                />

                
                    {
                        !isMobile &&
                        <motion.span variants={optionNameVariants} className={style.optionName}>Settings</motion.span>
                    }
            </motion.span>

            <motion.span 
                className={style.sidebarOption}
                //onClick={() => router.push('/drive/archive')}
                initial='normal'
                onMouseEnter={() => setHovering([false, false, true])}
                onMouseLeave={() => setHovering([false, false, false])}
                //animate={router.pathname.startsWith('/archive') ? 'selected' : (hovering[2] ? 'hover' : 'normal')}
                animate='disabled'
            
            >
                {
                    !isMobile 
                        ? <motion.span key='span-desk' variants={spanVariants} />
                        : <motion.span key='span-mob' variants={spanVariantsMobile} />
                }

                <Icon 
                    name='archive' 
                    variants={iconVariants(7, '1.6rem', 0.35, 0.15)}
                />

                {
                    !isMobile &&
                    <motion.span variants={optionNameVariants} className={style.optionName}>Archive</motion.span>
                }
            </motion.span>
        </motion.div>
    )
}