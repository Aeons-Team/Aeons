import { useState } from "react";
import Icon from '../Icon'
import style from "./style.module.css";

export default function ThemeButton() {
  const [dark, setDark] = useState(false);

  const toggleMode = () => {
    var r = document.querySelector(':root');
    setDark(!dark)
  };
  
  return (
    <div className={style.themeButton} onClick={toggleMode}>
      <div className={`${style.switch} ${!dark ? style.switchActive : ''}`} />
      <Icon name='moon' fill width='1.1rem' height='1.1rem' />
      <Icon name='sun' fill width='1.2rem' height='1.2rem' />
    </div>
  );
}

