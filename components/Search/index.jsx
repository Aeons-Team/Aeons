import { useRouter } from "next/router";
import { useBundlrState } from "../../stores/BundlrStore";
import style from "./style.module.css";
import AsyncSelect from "react-select/async";

export default function Search() {
  const router = useRouter();
  const [fileSystem] = useBundlrState((state) => [state.fileSystem]);
  const files = fileSystem.hierarchy.tree.nodes;
  const filesList = {};

  const filterOptions = (inputValue) => {
    let searchList = [];

    Object.values(files).map((file) => {
      file.id !== "root" && (filesList[file.id] = file.name);
    });

    for (const [id, name] of Object.entries(filesList)) {
      name.toLowerCase().includes(inputValue.trim().toLowerCase()) &&
        searchList.push({ key: name, value: id, label: name });
    }
    return searchList;
  };

  const loadOptions = (inputValue, callback) => {
    setTimeout(() => {
      callback(filterOptions(inputValue));
    }, 1000);
  };

  return (
    <div className={style.search}>
      <AsyncSelect
        cacheOptions
        loadOptions={loadOptions}
        noOptionsMessage={() => null}
        placeholder="Search"
        blurInputOnSelect={true}
        onChange={(e) => {
          router.push(`/drive/search/${e.value}`);
        }}
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
        }}
      />
    </div>
  );
}
