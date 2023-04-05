import Spinner from 'react-spinner-material'
import style from './style.module.css'

export default function Button({ children, disabled = () => false, loading, ...remaining } = {}) {
  return (
    <button disabled={disabled() || loading} {...remaining} className={style.button}>
      {children} 

      {
        loading &&
        <Spinner radius={15} color='var(--color-primary)' stroke={2} />
      }
    </button>
  )
}