import { useRef } from 'react'
import Spinner from 'react-spinner-material'
import { motion, AnimatePresence } from 'framer-motion'
import { useDriveState, useDriveStore } from '../../stores/DriveStore'
import CopyableText from '../CopyableText'
import Button from '../Button'
import Input from '../Input'
import style from './style.module.css'

export default function Loading() {
    const { loadingText, currentPrompt } = useDriveState(state => ({
        loadingText: state.loadingText,
        currentPrompt: state.currentPrompt
    }))

    const inputRef = useRef()

    const resolvePrompt = (ret) => {
        currentPrompt.resolve(ret)
        useDriveStore.setState({ currentPrompt: null })

        if (inputRef.current) inputRef.current.value = ''
    }

    return (
        <div className={style.loading}>    
            <div className={style.loadingInner}>
                <div className={style.loadingTop}>
                    <span className={style.loadingText}>
                        {loadingText}
                    </span>
                    
                    <Spinner radius={24} color='var(--color-active)' stroke={2} />
                </div>        

                <AnimatePresence>
                {
                    currentPrompt && currentPrompt.type == 'recovery' &&
                    <motion.div 
                        key='prompt'
                        initial={{ height: 0, y: 16, opacity: 0, marginTop: 0 }} 
                        animate={{ height: 'auto', y: 0, opacity: 1, marginTop: 32 }} 
                        exit={{ height: 0, y: 16, opacity: 0, marginTop: 0 }}
                        className={style.loadingBottom}
                    >
                        <CopyableText 
                            name='mnemonic phrase' 
                            value={currentPrompt.value} 
                            displayValue={currentPrompt.value}
                            fontSize='0.8rem'
                            hoverFontSize='0.8rem'
                            iconSize='1rem'
                            elemStyle={{
                                backgroundColor: 'var(--color-primary-3)',
                                padding: '0.75rem',
                                borderRadius: '4px',
                                width: '500px', 
                                maxWidth: '70vw'
                            }}
                            floatOffset={42}
                        />

                        <Button onClick={() => resolvePrompt()} style={{ padding: '0.75rem 1.25rem' }}>Continue</Button>
                    </motion.div>
                }
                
                {
                    currentPrompt && (currentPrompt.type == 'recover' || currentPrompt.type == 'password') &&
                    <motion.div 
                        initial={{ height: 0, y: 16, opacity: 0, marginTop: 0 }} 
                        animate={{ height: 'auto', y: 0, opacity: 1, marginTop: 32 }} 
                        exit={{ height: 0, y: 16, opacity: 0, marginTop: 0 }}
                        key='prompt' 
                        className={style.loadingBottom}
                    >
                        <div>
                            <Input
                                ref={inputRef} 
                                style={{ width: '500px', maxWidth: '70vw' }} 
                                type={ currentPrompt.type == 'recover' ? 'text' : 'password' }
                                placeholder={currentPrompt.type == 'recover' ? 'Mnemonic phrase' : 'Password'}
                                onKeyDown={(e) => {
                                    if (e.key == 'Enter') resolvePrompt(inputRef.current.value)
                                }}
                            />

                            {
                                currentPrompt.errorMessage &&
                                <span className={style.errorMessage}>{currentPrompt.errorMessage}</span>
                            }
                        </div>
                        
                        <Button onClick={() => resolvePrompt(inputRef.current.value)} style={{ padding: '0.75rem 1.25rem' }}>Continue</Button>
                    </motion.div>
                }
                </AnimatePresence>
            </div>
        </div>
    )
}