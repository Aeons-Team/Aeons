import { useEffect } from "react";
import { AnimatePresence, motion } from 'framer-motion';
import { useDriveState } from "../../stores/DriveStore";
import { useAppStore, useAppState } from "../../stores/AppStore";
import Topbar from '../Topbar';
import Sidebar from '../Sidebar';
import Loading from "../Loading";
import UploadQueue from "../UploadQueue"
import ErrorPopUp from "../ErrorPopUp";
import style from "./style.module.css";

export default function DriveLayout({ children }) {
	const { initialize, initialized } = useDriveState((state) => ({
		initialize: state.initialize,
		initialized: state.initialized
	}));

	const cursorPosition = useAppStore((state) => state.cursorPosition);
	const errorMessage = useAppState((state) => state.errorMessage);
	
	useEffect(() => {
		if (!initialized) {
			initialize();
		}
	
		const onMouseMove = (e) => {
		  	cursorPosition.set(
				e.clientX,
				e.clientY + document.documentElement.scrollTop
		  	);
		};
	
		const onKeyDown = (e) => {
		  	switch (e.key) {
				case 'Shift':
					useAppStore.setState({ holdingShift: true })
					break 
	
				case 'Control':
			  		useAppStore.setState({ holdingControl: true })
			  		break 
			}
		}
	
		const onKeyUp = (e) => {
		  	switch (e.key) {
				case 'Shift':
			  		useAppStore.setState({ holdingShift: false })
			  		break 
	
				case 'Control':
					useAppStore.setState({ holdingControl: false })
			  		break 
		  	}
		}
	
		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("keydown", onKeyDown);
		document.addEventListener("keyup", onKeyUp);
	
		return () => {
		  	document.removeEventListener("mousemove", onMouseMove);
		  	document.removeEventListener("keydown", onKeyDown);
		  	document.removeEventListener("keyup", onKeyUp);
		};
	}, []);
	  
	const transition = {
		ease: [.88,.08,.12,.93],
		duration: 0.8
	}

	if (!initialized) return <Loading />

	return (
		<div className={style.drive}>
			<Topbar transition={transition} />
			<Sidebar transition={transition} />

			<motion.div 
				initial={{  
					opacity: 0,
					y: 100
				}}
				animate={{
					opacity: 1,
					y: 0
				}}
				transition={transition}
			>
				{children}
			</motion.div>

			<AnimatePresence>
				{ errorMessage && <ErrorPopUp key='popUp' message={errorMessage}/> }
			</AnimatePresence>
			
			<UploadQueue />
		</div>
	);
}
