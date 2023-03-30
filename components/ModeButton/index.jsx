import { useState } from "react";
import { useEffect } from "react";
import Button from "../Button";
import style from "./style.module.css";

export default function ModeButton() {

  const [mode, setMode] = useState("dark");
  const toggleMode = () => {
    if(mode === "dark"){
      setMode("light");
    }
    else {
      setMode("dark"); 
    }
  };

  useEffect(() => {
    document.body.className = mode;
  }, [mode]);
  
  return (
    <div className={style.modeButton}>
      <Button
        onClick={() => {
          toggleMode()
        }}
      >
        Mode
      </Button>
    </div>
  );
}

