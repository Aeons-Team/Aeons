import { useRouter } from "next/router";
import { useBundlrState } from "../../stores/BundlrStore";
import style from "./style.module.css";

export default function SearchList({ inputValue }) {
  const router = useRouter();
  const [fileSystem] = useBundlrState((state) => [state.fileSystem]);
  const files = fileSystem.hierarchy.tree.nodes;
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
