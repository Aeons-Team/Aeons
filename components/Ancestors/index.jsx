import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion'
import Icon from '../Icon'
import { useDriveStore } from '../../stores/DriveStore'
import style from './style.module.css'

function Ancestor({ file, onClick, onDrop, ...remaining }) {
    return (
        <div 
            className={style.ancestor} 
            onClick={() => onClick(file)}
            onDrop={() => onDrop(file)}
            {...remaining}
        >
            {file.name}
        </div>
    )
}


export default function Ancestors({ id, itemStyle, gap, iconSize, ...remaining }) {
    const contractState = useDriveStore(state => state.contractState)
    const ancestors = contractState.getAncestors(id)

    return (
        <div className={style.ancestors} style={{ gap }}>
            <AnimatePresence>
            {
                    ancestors.map((file, i) => (
                        <motion.div 
                            className={style.ancestorItem} 
                            style={{ gap }} 
                            key={file.id}
                            initial={{
                                opacity: 0,
                                y: 4
                            }}
                            animate={{
                                opacity: 1,
                                y: 0
                            }}
                            exit={{
                                opacity: 0,
                                y: 4
                            }}
                        >
                            <Ancestor file={file} style={itemStyle} {...remaining} />
    
                            <Icon 
                                name='arrow-head-right'
                                width={iconSize} 
                                height={iconSize} 
                                animate={{
                                    opacity: i != ancestors.length - 1 ? 1 : 0,
                                    y: (i != ancestors.length - 1 ? 0 : 4) + 2
                                }}
                            />
                        </motion.div>
                    ))
                }
            </AnimatePresence>
        </div>
    )
}