import { useState, useRef } from "react";
import Button from "../Button";
import style from "./style.module.css";
import Icon from '../Icon'
import Input from "../Input";

export default function InputForm({ icon, fillIcon = true, heading, initialVal='', type='text', description, onClick, onBack } = {}) {
  const [input, setInput] = useState(initialVal);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef()

  const onButtonClick = async () => {
    if (loadingRef.current) return
    
    loadingRef.current = true 

    setLoading(true)
    await onClick(input)
    setLoading(false)
  }

  return (
    <div className={style.form}>
      <div className={style.top}>
        <div className={style.header}>
          <Icon width='1.75rem' height='1.75rem' name={icon} fill={fillIcon} />
          <div className={style.title}>{heading}</div>
        </div>
        
        <p className={style.description}>{description}</p>
      </div>

      <Input
        type={type}
        value={input}
        maxLength={32}
        step='0.0001'
        onInput={(e) => {setInput(e.target.value)}}
        onKeyDown={(e) => { e.key === "Enter" && onClick()}}
      />

      <div className={style.lower}>
        <button   
          className={style.back} 
          disabled={loading}
          onClick={(e) => {
            e.stopPropagation()
            onBack()
          }
        }>
          Back
        </button>

        <Button disabled={() => input == initialVal} onClick={onButtonClick} loading={loading}>
          Submit
        </Button>
      </div>
    </div>
  );
}
