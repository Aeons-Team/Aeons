import { useRouter } from "next/router";
import { useDriveStore } from "../../stores/DriveStore";
import style from "./style.module.css";

export default function SearchList({ inputValue }) {
  const router = useRouter();
  const contractState = useDriveStore((state) => state.contractState);

  return (
    <div className={style.list}>
      {inputValue &&
        contractState.searchFiles(inputValue).map((file) => (
          <div
            key={file.id}
            className={style.file}
            onClick={() => router.push(`/drive/${file.id}`)}
          >
            {file.name}
          </div>
        ))}
    </div>
  );
}
