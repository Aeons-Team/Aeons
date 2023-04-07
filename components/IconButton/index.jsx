import { motion } from 'framer-motion'
import Icon from "../Icon";
import style from "./style.module.css";

export default function IconButton({name, className, fill, height, width, strokeWidth, ...remaining}){
	return(
		<motion.button className={`${style.iconButton} ${className}`} {...remaining}>
			<Icon 
				name={name} 
				fill={fill} 
				strokeWidth={strokeWidth}
				height={height || '1rem'} 
				width={width || '1rem'} 
			/>
		</motion.button>
	)
}