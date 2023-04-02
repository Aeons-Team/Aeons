import Icon from "../Icon";
import style from "./style.module.css";

export default function IconButton({name, onClick}){
	return(
			<button className={style.iconButton} onClick={onClick}>
				<Icon name={name} width='1rem' height='1rem' />
			</button>
	)
}