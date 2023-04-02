import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import copy from 'clipboard-copy'
import { useDriveState } from '../../stores/DriveStore'
import Icon from '../Icon'
import Funder from '../Funder'
import style from './style.module.css';

export default function Wallet() {
  const { client, loadedBalance, walletBalance } = useDriveState(state => ({
    client: state.client,
    loadedBalance: state.loadedBalance,
    walletBalance: state.walletBalance
  }));

  const [funding, setFunding] = useState(false)
  const [hoveringAddress, setHoveringAddress] = useState(false)
  const [copyText, setCopyText] = useState('Copy address')
  const [height, setHeight] = useState(0)
  const section1Ref = useRef()
  const section2Ref = useRef()

  useEffect(() => {
    const elem = !funding ? section1Ref.current : section2Ref.current
    const height = elem.getBoundingClientRect().height 
    setHeight(height)
  }, [funding])

  return (
    <div className={style.wallet}>
      <div className={style.avatar} />

      <motion.div className={style.walletInner} animate={{ height }}>
        <AnimatePresence>
          {
            !funding &&
            <motion.div 
              key='wallet'
              ref={section1Ref}
              className={style.section} 
              initial={{ right: '100%' }} 
              animate={{ right: '0%' }} 
              exit={{ right: '100%' }}
            >
              <div className={style.walletUpper}>
                <div className={style.network}>
                  {client.networkName}
                </div>
                
                <div className={style.walletAddress}>                  
                  <div className={style.address} 
                    onClick={() => {
                      setCopyText('Copied!')
                      setTimeout(() => setCopyText('Copy address'), 2000)
                      copy(client.address)
                    }} 
                    onMouseEnter={() => setHoveringAddress(true)} 
                    onMouseLeave={() => setHoveringAddress(false)}>
                    <div>{client.address.substring(0, 6) + '...' + client.address.substring(client.address.length - 3)}</div>
                    <Icon name='copy-clipboard' fill width='1rem' height='1rem' />
                  </div>

                  <motion.div initial={{ opacity: 0 }} animate={ hoveringAddress ? { opacity: 1, top: '1.5rem' } : { opacity: 0, top: '1rem' }}>
                    {copyText}
                  </motion.div>
                </div>
              </div>
    
              <div className={style.walletLower}>
                <div className={style.walletBalance}>
                  <span>Metamask Wallet</span>
                  <span>{Number(walletBalance).toFixed(6)} {client.networkCurrencySym}</span>
                </div>
    
                <div className={style.transfer} onClick={() => setFunding(true)}>
                  <Icon name='arrow-right' width='1.5rem' height='1.5rem' strokeWidth={0.8} invert />
                </div>
    
                <div className={style.walletBalance}>
                  <span>Bundlr Wallet</span>
                  <span>{Number(loadedBalance).toFixed(6)} {client.networkCurrencySym}</span>
                </div>
              </div>
            </motion.div>
          }

          {
            funding &&
            <motion.div 
              key='funder'
              ref={section2Ref}
              className={style.section} 
              initial={{ right: '-100%' }} 
              animate={{ right: '0%' }} 
              exit={{ right: '-100%' }}
            >
              <Funder onBack={() => setFunding(false)} />
            </motion.div>
          }
        </AnimatePresence>
      </motion.div>
    </div>
  );
}