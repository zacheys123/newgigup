import OverlaySearch from "@/components/pages/OverlaySearch";
import FormData from "@/components/pages/FormData";
import SearchComponent from "@/components/pages/SearchComponent";

const SearchPage = async () => {
  return (
    <div className=" w-[100vw] h-[100%] bg-slate-900 pb-[60px] overflow-y-hidden">
      <FormData />
      <SearchComponent />

      <OverlaySearch />
    </div>
  );
};

export default SearchPage;
