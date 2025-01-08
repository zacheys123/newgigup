import { Search } from "lucide-react";
import SearchInput from "./SearchInput";

const FormData = () => {
  return (
    <form className="w-[100vw] h-[70px]  fixed bg-black z-50 ">
      <div className=" flex justify-center items-center w-[90vw] mx-auto h-[50px] border-2 border-b-neutral-600 border-r-0 border-l-0 border-t-0  ">
        <Search
          size="17px"
          style={{ color: "white" }}
          className="text-gray-200 my-6"
        />
        <SearchInput />
      </div>
    </form>
  );
};

export default FormData;
