import style from './style.module.css'

export default function Button({ children, ...remaining }) {
  return <button {...remaining} className={style.button}>
    {children}
  </button>
}