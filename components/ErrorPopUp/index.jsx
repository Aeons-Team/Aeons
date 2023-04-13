import { useEffect, useRef } from "react";
import IconButton from "../IconButton";
import { useAppState } from "../../stores/AppStore";
import style from './style.module.css';
import { motion } from "framer-motion";

export default function ErrorPopUp({message}) {
	const timeoutRef = useRef()

	const { setErrorMessage, setFunding, setShowWallet } = useAppState((state) => ({
		setErrorMessage: state.setErrorMessage,
		setFunding: state.setFunding,
		setShowWallet: state.setShowWallet
	}));

	useEffect(() => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current)

		timeoutRef.current = setTimeout(() => setErrorMessage(''), 5000);
	}, [message])

	let popUpMessage='Something went wrong, please try again';
	let popUpFunction = () => setErrorMessage('');
	let error = message.split(' ');

	const errorObject = {
		'insufficientBalance' : ['Not','enough','funds','to','send','data'],
		'userRejection' : ['user','rejected','signing'],
	}

	const closePopUp = (e) => {
		e.stopPropagation();
		setErrorMessage('');
	}

	for (const [key, value] of Object.entries(errorObject)) {
		if (value.every((v) => error.includes(v))) {
			error = key;
			break;
		}
	}

	switch(error) {
		case 'insufficientBalance':
			popUpMessage = `You don't have enough funds to upload, click here to fund`;
			popUpFunction = (e) => 
			{
				e.stopPropagation();
				setShowWallet(true);
				setFunding(true);
				setErrorMessage('');
			}
			break;

		case 'userRejection':
			popUpMessage = 'User rejected signing, please try again';
			break;

	}

	return(
		<div className={style.popUpParent}>
			<motion.div 
				className={style.popUp} 
				onClick={popUpFunction}
				initial={{
					opacity: 0,
					y : -35,
					scaleX: 0.4,
					scaleY: 0.55
				}}
				animate={{
					opacity: 1,
					y : 0,
					scaleX: 1,
					scaleY: 1
				}}
				exit={{
					opacity: 0,
					y : -35,
					scaleX: 0.4,
					scaleY: 0.55
				}}
				transition={{
					type: 'spring', 
					damping: 14,
					stiffness: 150, 
				}}
			>
				<div className={style.section}>
					<motion.div 
						className={style.oops}
						initial={{
							opacity: 0,
							y : -5,
						}}
						animate={{
							opacity: 1,
							y : 0,
						}}
						transition={{
							type: 'spring', 
							damping: 15,
							stiffness: 150,
							delay: 0.1
						}}
						>
							Oops!
					</motion.div>
					<motion.div
						className={style.text}
						initial={{
							opacity: 0,
							y : -5,
						}}
						animate={{
							opacity: 1,
							y : 0,
						}}
						transition={{
							type: 'spring', 
							damping: 15,
							stiffness: 150,
							delay: 0.15
						}}
					>
						{popUpMessage}
					</motion.div>
				</div>

				<div className={style.progress}>
					<motion.div 
						className={style.progressInner} 
						initial={{
							width: '100%'
						}}
						animate={{
							width: '0%'
						}}
						transition={{
							type: 'linear',
							duration: 5
						}}
					/>
				</div>

				<div className={style.close}>
					<IconButton name='cross' width='1.5rem' height='1.5rem' onClick={closePopUp} />
				</div>
			</motion.div>
		</div>
	)
}