import { useRef, useState, useEffect } from 'react'
import { useDriveStore } from '../../stores/DriveStore'
import Crypto from '../../lib/Crypto'
import style from './style.module.css'

export default function Settings() {
    const client = useDriveStore(state => state.client)

    const [src, setSrc] = useState()
    const [file, setFile] = useState()

    const onInput = (e) => {
        const file = e.target.files[0]
        setFile(file)
    }

    const onClick = (e) => {
        const content = new Blob()

        const url = URL.createObjectURL(file)
        setSrc(url)
    }

    useEffect(() => {
        const crypto = new Crypto()
        crypto.initialize().then(() => 
            crypto.encrypt("hi world").then(encrypted => crypto.decrypt(encrypted)).then(decrypted => console.log(decrypted))
        )
    }, [])

    return (
        <div className={style.settings}>
            <input type='file' onInput={onInput} />
            <button onClick={onClick}>submit</button>
            <img className={style.preview} src={src} />
        </div>
    )
}