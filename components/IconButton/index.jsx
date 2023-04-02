import Icon from "../Icon";
import style from "./style.module.css";

export default function IconButton({name, fill, height, width, ...remaining}){
	return(
		<button className={style.iconButton} {...remaining}>
			<Icon 
				name={name} 
				fill={fill} 
				height={height || '1rem'} 
				width={width || '1rem'} 
			/>
		</button>
	)
}