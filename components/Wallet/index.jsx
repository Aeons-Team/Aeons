import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import { useDriveState } from '../../stores/DriveStore'
import { useAppState } from '../../stores/AppStore';
import Icon from '../Icon'
import InputForm from '../InputForm'
import style from './style.module.css';
import CopyableText from '../CopyableText';

export default function Wallet() {

  const isMobile = useMediaQuery({ maxWidth: '550px' })
  const isMobileSm = useMediaQuery({ maxWidth: '350px' })
  const scale = isMobileSm ? 0.7 : (isMobile ? 0.8 : 1)

  const { client, loadedBalance, walletBalance, fetchLoadedBalance, fetchWalletBalance } = useDriveState(state => ({
    client: state.client,
    loadedBalance: state.loadedBalance,
    walletBalance: state.walletBalance,
    fetchLoadedBalance: state.fetchLoadedBalance,
    fetchWalletBalance: state.fetchWalletBalance
  }));

  const { showWallet, setShowWallet, funding, setFunding } = useAppState(state => ({
    showWallet: state.showWallet,
    setShowWallet: state.setShowWallet,
    funding: state.funding,
    setFunding: state.setFunding
  }));

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
        <Icon name='wallet' transform='translate(0.5 0)' width='1.1rem' height='1.1rem' fill color='var(--color-inner)' />
      </div>

      <motion.div 
        className={style.walletInner} 
        ref={walletInnerRef}
        initial={{
          height: 0, 
          opacity: 0,
          scale: scale * 0.9,
          transformOrigin: 'top right',
          pointerEvents: 'none'
        }}
        animate={{ 
          height: showWallet ? height : 0, 
          opacity: showWallet ? 1 : 0,
          scale: showWallet ? scale : scale * 0.9,
          transformOrigin: 'top right',
          pointerEvents: showWallet ? 'auto' : 'none'
        }}
        transition={{ 
          type: 'spring',
          damping: 22,
          stiffness: 200
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
                
                <CopyableText 
                  name='address' 
                  value={client.address} 
                  displayValue={client.address.substring(0, 6) + '....' + client.address.substring(client.address.length - 4)} 
                  fontSize='0.9rem'
                  hoverFontSize='0.7rem'
                  iconSize='1rem'
                  floatOffset={24}
                />
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
                  <Icon name='arrow-right' width='1.5rem' height='1.5rem' strokeWidth={0.8} color='var(--color-inner)' />
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
                description='Transfer funds to your internal bundlr wallet'
                onBack={() => {
                  setFunding(false)}
                }
                onClick={async (amount, setErrorMessage) => {

                  if (amount) {
                    try {
                      await client.fund(amount)
                      fetchLoadedBalance()
                      fetchWalletBalance()
                    } 
                    catch (e) {
                      setErrorMessage('Insufficient funds')
                    }
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