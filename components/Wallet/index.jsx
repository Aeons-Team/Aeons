import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import copy from 'clipboard-copy'
import { useMediaQuery } from 'react-responsive';
import { useDriveState } from '../../stores/DriveStore'
import { useAppState } from '../../stores/AppStore';
import Icon from '../Icon'
import InputForm from '../InputForm'
import style from './style.module.css';

export default function Wallet() {
  const isMobile = useMediaQuery({ maxWidth: 500 })
  const scale = isMobile ? 0.8 : 1

  const { client, loadedBalance, walletBalance, fetchLoadedBalance, fetchWalletBalance } = useDriveState(state => ({
    client: state.client,
    loadedBalance: state.loadedBalance,
    walletBalance: state.walletBalance,
    fetchLoadedBalance: state.fetchLoadedBalance,
    fetchWalletBalance: state.fetchWalletBalance
  }));

  const { showWallet, setShowWallet, activateContextMenu } = useAppState(state => ({
    showWallet: state.showWallet,
    setShowWallet: state.setShowWallet,
    activateContextMenu: state.activateContextMenu
  }));

  const [funding, setFunding] = useState(false)
  const [hoveringAddress, setHoveringAddress] = useState(false)
  const [copyText, setCopyText] = useState('Copy address')
  const [height, setHeight] = useState(0)
  const section1Ref = useRef()
  const section2Ref = useRef()
  const walletRef = useRef()
  const walletInnerRef = useRef()
  const firstActivationRef = useRef(false)

  useEffect(() => {
    const transform = walletInnerRef.current.style.transform 
    const result = new RegExp(/scale\((.+?)\)/).exec(transform)
    const scale = Number((result && result[1]) ?? 1.0)

    const elem = !funding ? section1Ref.current : section2Ref.current
    const height = elem.getBoundingClientRect().height * (1.0 / scale)
    setHeight(height)
  }, [funding])

  useEffect(() => {
    const onClick = (e) => {
      if (!walletRef.current.contains(e.target)) {
        setShowWallet(false)
        setFunding(false)
      }
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div className={style.wallet} ref={walletRef}>
      <div className={style.avatar} 
        onClick={() => {
          firstActivationRef.current = true
          setShowWallet(!showWallet)
        }}
      >
        <Icon name='wallet' transform='translate(0.5 0)' width='1.1rem' height='1.1rem' fill invert />
      </div>

      <motion.div 
        className={style.walletInner} 
        ref={walletInnerRef}
        initial={{
          height, 
          opacity: 0,
          scale: scale * 0.9,
          transformOrigin: 'top right',
          pointerEvents: 'none'
        }}
        animate={{ 
          height, 
          opacity: showWallet ? 1 : 0,
          scale: showWallet ? scale : scale * 0.9,
          transformOrigin: 'top right',
          pointerEvents: showWallet ? 'auto' : 'none'
        }}
        transition={{ 
          type: 'spring',
          damping: 16,
          stiffness: 250
        }}
      >
        <AnimatePresence>
          {
            !funding &&
            <motion.div 
              key='wallet'
              ref={section1Ref}
              className={style.section} 
              initial={{ 
                right: firstActivationRef.current ? '0%' : '60%',
                opacity: 0 
              }}
              animate={{ right: '0%', opacity: 1 }} 
              exit={{ right: '60%', opacity: 0 }}
            >
              <div className={style.walletUpper}>
                <Icon name={client.networkCurrency} width='3rem' height='3rem' />

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
                    onMouseLeave={() => setHoveringAddress(false)}
                  >
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
    
                <div className={style.transfer} 
                  onClick={() => {
                    firstActivationRef.current = false
                    setFunding(true)
                  }}
                >
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
              initial={{ right: '-60%', opacity: 0 }} 
              animate={{ right: '0%', opacity: 1 }} 
              exit={{ right: '-60%', opacity: 0 }}
            >
              <InputForm 
                heading='Fund Bundlr'
                icon='wallet'
                type='number'
                description='transfer funds to your internal bundlr wallet'
                onBack={() => {
                  setFunding(false)
                }}

                onClick={async (amount) => {
                  activateContextMenu(false);

                  if (amount) {
                    await client.fund(amount)

                    fetchLoadedBalance()
                    fetchWalletBalance()
                  }
                }}
              
              />
            </motion.div>
          }
        </AnimatePresence>
      </motion.div>
    </div>
  );
}