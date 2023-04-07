import { motion } from 'framer-motion';
import Topbar from '../Topbar';
import Sidebar from '../Sidebar';
import UploadQueue from "../UploadQueue"
import style from "./style.module.css";

export default function Drive({ children }) {
  return (
    <div className={style.drive}>
      <Topbar />
      <Sidebar />
      <motion.div 
        initial={{  
          y: 100
        }}
        animate={{
          y: 0
        }}
      >
        {children}
      </motion.div>
      <UploadQueue />
    </div>
  );
}
