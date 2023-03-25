import { useRouter } from "next/router";
import { useDriveStore } from "../../../stores/DriveStore";
import Drive from "../../../components/Drive";

function SearchPage() {
  const { search } = useRouter().query;
  const searchList = search.split(",");

  const initialized = useDriveStore((state) => state.initialized);
  if (initialized) {
    return (
      <div>
        <Drive searchList={searchList} />
      </div>
    );
  }
}

export default SearchPage;
