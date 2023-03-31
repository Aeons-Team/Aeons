import { useState } from "react";
import Icon from '../Icon'
import style from "./style.module.css";

export default function ModeButton() {
  const [mode, setMode] = useState("dark");

  const toggleMode = () => {
    var r = document.querySelector(':root');

    if(mode === "dark"){
      setMode("light");
    }
    else {
      setMode("dark"); 
    }
  };
  
  return (
    <div className={style.modeButton}>
      <Icon name='moon' fill />
      <Icon name='sun' fill />
    </div>
  );
}

