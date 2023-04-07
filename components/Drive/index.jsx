import { motion } from 'framer-motion';
import Topbar from '../Topbar';
import Sidebar from '../Sidebar';
import UploadQueue from "../UploadQueue"
import style from "./style.module.css";

export default function Drive({ children }) {
	const transition = {
		ease: [.88,.08,.12,.93],
		duration: 0.8
	}

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
