import { useRouter } from "next/router"
import { useLayoutEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useAppState } from "../../stores/AppStore"
import File from "../File"

function GridItem({ file, itemWidth, x, y }) {
    const { dragged } = useAppState((state) => ({
        dragged: state.beingDragged[file.id]
    }))

    return (
        <motion.div 
            style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: itemWidth ,
                zIndex: dragged ? 10 : 1
            }}
            initial={{
                x, 
                y: y + 10,
                opacity: 0,
                transition: {
                    delay: 1
                }
            }}
            animate={{
                x, 
                y,
                opacity: 1
            }}
            exit={{
                y: y + 10,
                opacity: 0
            }}
            transition={{  
                type: 'spring',
                damping: 18,
                stiffness: 150
            }}
        >
            <File file={file} />
        </motion.div>
    )
}

export default function Grid({ files, minWidth, gap, height, gapScale }) {
    const { id: activeFileId } = useRouter().query

    const gridRef = useRef()
    const [width, setWidth] = useState(0)

    useLayoutEffect(() => {
        const calcWidth = () => {
            const bb = gridRef.current.getBoundingClientRect()
            setWidth(bb.width)
        }

        calcWidth()
        window.addEventListener('resize', calcWidth)

        return () => window.removeEventListener('resize', calcWidth)
    }, [])

    let count = files.length
    let maxCols = width && (width + gap) / (minWidth + gap)
    let reminder = maxCols % 1
    
    maxCols = Math.floor(maxCols)
    let itemWidth = width && minWidth + reminder * (minWidth + gap) / maxCols
    let rows = width && Math.ceil(count / maxCols)
    let itemHeight = height + ((itemWidth - minWidth) / minWidth) * gapScale * height

    return (
        <motion.div 
            ref={gridRef}
            style={{ position: 'relative' }}
            animate={{ height: rows * itemHeight }}
        >
            <AnimatePresence>
            {
                width &&
                files.map((file, i) => {
                    const x = (i % maxCols) * (itemWidth + gap)
                    const y = Math.floor(i / maxCols) * (itemHeight + gap)

                    return <GridItem key={file.id + (activeFileId ?? '')} file={file} itemWidth={itemWidth} x={x} y={y} />
                })
            }
            </AnimatePresence>
        </motion.div>
    )
}