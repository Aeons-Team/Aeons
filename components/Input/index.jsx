import { forwardRef } from 'react'
import style from './style.module.css'

const Input = forwardRef(({...props}, ref) => {
	return (
		<input ref={ref} {...props} className={style.input} />
	)
})

export default Input