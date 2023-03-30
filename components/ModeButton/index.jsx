import style from "./style.module.css";
import { createContext , useState } from "react";
import ReactSwitch from "react-switch";

const ThemeContext = createContext(null);

export default function ModeButton() {
  
  const [mode , setMode] = useState();

  const toggleTheme = () => {
     setMode((curr) => (curr === "dark" ? "dark" : "light"))
   };

  return (
    <ThemeContext.Provider value = {{ mode, toggleTheme}}>
      <div id="dark">
        <ReactSwitch />
      </div>
    </ThemeContext.Provider>
  );
}
