import { useEffect } from "react";
import { motion } from 'framer-motion';
import { ethers } from "ethers";
import { useDriveState } from "../../stores/DriveStore";
import { useAppStore } from "../../stores/AppStore";
import Topbar from '../Topbar';
import Sidebar from '../Sidebar';
import Loading from "../Loading";
import UploadQueue from "../UploadQueue"
import style from "./style.module.css";

export default function DriveLayout({ children }) {
	const { initialize, initialized, reinitialize } = useDriveState((state) => ({
		initialize: state.initialize,
		initialized: state.initialized,
		reinitialize: state.reinitialize
	}));
	
	const cursorPosition = useAppStore((state) => state.cursorPosition);
	
	useEffect(() => {
		async function init() {
		  	try{
				await window.ethereum.request({ method: "eth_requestAccounts" });
			
				await initialize(new ethers.providers.Web3Provider(window.ethereum));
		
				window.ethereum.on('accountsChanged', () => {
					reinitialize(new ethers.providers.Web3Provider(window.ethereum));
				})
		  
				window.ethereum.on('chainChanged', () => {
				  	reinitialize(new ethers.providers.Web3Provider(window.ethereum));
				})
		  	} catch(e) {}
		}
	
		if (!initialized) {
			init();
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
			
			<UploadQueue />
		</div>
	);
}
