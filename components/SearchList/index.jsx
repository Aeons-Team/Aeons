import { useRouter } from "next/router";
import { useDriveStore } from "../../stores/DriveStore";
import style from "./style.module.css";

export default function SearchList({ inputValue }) {
  const router = useRouter();
  const contractState = useDriveStore((state) => state.contractState);
  const files = contractState.data.hierarchy.files
  const filesList = {};
  
  Object.values(files).map((file) => {
    file.id !== "root" && (filesList[file.id] = file.name);
  });

  const filterOptions = (inputValue) => {
    let searchList = [];

    for (const [id, name] of Object.entries(filesList)) {
      name.toLowerCase().includes(inputValue.trim().toLowerCase()) &&
        searchList.push({ key: name, value: id, label: name });
    }
    return searchList;
  };

  return (
    <div className={style.list}>
      {inputValue &&
        filterOptions(inputValue).map((item) => (
          <div
            key={item.value}
            className={style.item}
            onClick={() => router.push(`/drive/search/${item.value}`)}
          >
            {item.label}
          </div>
        ))}
    </div>
  );
}
