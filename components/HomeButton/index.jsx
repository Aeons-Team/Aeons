import Button from "../Button";
import { useRouter } from "next/router";
import style from "./style.module.css";

export default function HomeButton() {
  const router = useRouter();
  return (
    <div className={style.homeButton}>
      <Button
        onClick={() => {
          router.push("/drive/root");
        }}
      >
        Home
      </Button>
    </div>
  );
}
