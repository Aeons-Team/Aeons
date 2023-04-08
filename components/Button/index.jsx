import Spinner from 'react-spinner-material'
import style from './style.module.css'

export default function Button({ children, disabled = () => false, loading, ...remaining } = {}) {
  return (
    <button disabled={disabled() || loading} {...remaining} className={style.button}>
      {children} 

      {
        loading &&
        <Spinner radius={12} color='var(--color-inner)' stroke={1.5} />
      }
    </button>
  )
}