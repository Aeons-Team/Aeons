import { useState } from 'react'
import { motion } from 'framer-motion'
import Icon from '../Icon'
import copy from 'clipboard-copy'
import style from './style.module.css'

export default function CopyableText({ name, value, displayValue, elemStyle={}, fontSize, hoverFontSize, iconSize, floatOffset } = {}) {
    const [hover, setHover] = useState(false)
    const [copyText, setCopyText] = useState(`Copy ${name}`)

    return (
        <div className={style.copyableText} style={elemStyle}>
            <div
                style={{ fontSize }} 
                className={style.copyableTextInner} 
                onClick={() => {
                    setCopyText('Copied!')
                    setTimeout(() => setCopyText(`Copy ${name}`), 2000)
                    copy(value)
                }} 
                onMouseEnter={() => setHover(true)} 
                onMouseLeave={() => setHover(false)}
            >
                <div style={{ width: `calc(100% - ${iconSize})` }}>{displayValue}</div>
                <Icon name='copy-clipboard' fill width={iconSize} height={iconSize} />
            </div>

            <motion.div 
                style={{ fontSize: hoverFontSize }}
                initial={{ opacity: 0 }} 
                animate={ hover ? { opacity: 1, top: floatOffset } : { opacity: 0, top: floatOffset - 8 }}
            >
                {copyText}
            </motion.div>
        </div>
    )
}