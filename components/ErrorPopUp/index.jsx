import IconButton from "../IconButton";
import { useAppState } from "../../stores/AppStore";
import style from './style.module.css';
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function ErrorPopUp({message}) {

	const { setErrorMessage, setFunding, setShowWallet } = useAppState((state) => ({
		setErrorMessage: state.setErrorMessage,
		setFunding: state.setFunding,
		setShowWallet: state.setShowWallet
	}));

	useEffect(() => {
		setTimeout(() => setErrorMessage(''), 5000);
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
		<motion.div 
			className={style.popUpParent}
			initial={{
				opacity: 0,
				y : -20,
				scale: 0.95
			}}
			animate={{
				opacity: 1,
				y : 0,
				scale: 1
			}}
			exit={{
				opacity: 0,
				y : -20,
				scale: 0.85
			}}
			transition={{
				type: 'spring', 
				damping: 13,
				stiffness: 100, 
			}}
		>
			<div className={style.popUp} onClick={popUpFunction}>
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
							damping: 13,
							stiffness: 100,
							delay: 0.1
						}}
						>
							Oops!
					</motion.div>
					<motion.div
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
							damping: 13,
							stiffness: 100,
							delay: 0.2
						}}
					>
						{popUpMessage}
					</motion.div>
				</div>
				<div className={style.close}>
					<IconButton name='cross' width='1.5rem' height='1.5rem' onClick={closePopUp} />
				</div>
			</div>
		</motion.div>
	)
}