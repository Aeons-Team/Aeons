import { useLayoutEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
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
                x, y
            }}
            animate={{
                x, y
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

export default function Grid({ files, minWidth, gap = 10, height, gapScale }) {
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
        <div 
            ref={gridRef}
            style={{ position: 'relative', height: rows * itemHeight }}
        >
            {
                width &&
                files.map((file, i) => {
                    const x = (i % maxCols) * (itemWidth + gap)
                    const y = Math.floor(i / maxCols) * (itemHeight + gap)

                    return <GridItem key={file.id} file={file} itemWidth={itemWidth} x={x} y={y} />
                })
            }
        </div>
    )
}