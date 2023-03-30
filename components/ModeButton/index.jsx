import { useState } from "react";
import Button from "../Button";
import style from "./style.module.css";

export default function ModeButton() {

  const [mode, setMode] = useState("dark");
  const toggleMode = () => {

    var r = document.querySelector(':root');

    if(mode === "dark"){
      r.style.setProperty('--color-primary', '#FFFFFF');
      r.style.setProperty('--color-secondary', '#000000');
      r.style.setProperty('--color-background', '#F8F8F8');
      setMode("light");
    }
    else {
      r.style.setProperty('--color-primary', '#000000');
      r.style.setProperty('--color-secondary', '#FFFFFF');
      r.style.setProperty('--color-background', '#0c0c0c');
      setMode("dark"); 
    }
  };
  
  return (
    <div className={style.modeButton}>
      <Button
        onClick={() => {
          toggleMode()
        }}
      >
        Theme
      </Button>
    </div>
  );
}

