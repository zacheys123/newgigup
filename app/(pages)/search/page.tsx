import OverlaySearch from "@/components/pages/OverlaySearch";
import FormData from "@/components/pages/FormData";
import SearchComponent from "@/components/pages/SearchComponent";

const SearchPage = async () => {
  return (
    <div className=" w-[100vw] h-[86%] bg-slate-900 overflow-y-hidden">
      <FormData />
      <SearchComponent />

      <OverlaySearch />
    </div>
  );
};

export default SearchPage;
