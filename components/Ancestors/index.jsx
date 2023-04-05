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
            {
                ancestors.map((file, i) => (
                    <div className={style.ancestorItem} style={{ gap }} key={file.id}>
                        <Ancestor file={file} style={itemStyle} {...remaining} />

                        {
                            i != ancestors.length - 1 &&
                            <Icon name='arrow-head-right' width={iconSize} height={iconSize} />
                        }
                    </div>
                ))
            }
        </div>
    )
}