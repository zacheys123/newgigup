import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { GigProps } from "@/types/giginterface";

interface DescriptionProps {
  gig: GigProps;
  open: boolean;
  handleClose: () => void;
}
const GigDescription = ({ gig, open, handleClose }: DescriptionProps) => {
  // const { userId } = useAuth();
  // const router = useRouter();

  return (
    <div className="w-[300px] inset-0 flex items-center justify-center bg-black bg-opacity-30 ">
      <Dialog
        open={open}
        onOpenChange={handleClose} // use onOpenChange to handle closing the dialog
      >
        <DialogContent>
          {" "}
          <DialogHeader>
            <DialogTitle>More Info</DialogTitle>
          </DialogHeader>
          <div className="flex">
            {" "}
            <span className="titler tracking-tighter text-white text-[15px] mx-2">
              Gig Type:
            </span>
            <span className="gigtitle text-blue-300 font-mono font-bold line-clamp-1  ">
              {gig?.bussinesscat}
            </span>
            &nbsp;
            <span className="font-mono text-[10px] text-blue-300">
              {" "}
              {gig?.bussinesscat === "personal" && <> {`(a single person)`}</>}
            </span>
            <span className="font-mono text-[10px] text-blue-300">
              {" "}
              {gig?.bussinesscat === "full" && <> {`(a full band needed)`}</>}
            </span>{" "}
            <span className="font-mono text-[10px] text-blue-300">
              {" "}
              {gig?.bussinesscat === "other" && (
                <> {`(a collection of different people person)`}</>
              )}
            </span>
          </div>
          <div className="flex">
            {" "}
            <span className="titler tracking-tighter text-white text-[15px] mx-2">
              Time:
            </span>
            <span className="gigtitle text-blue-300 font-mono font-bold line-clamp-1  ">
              {gig?.time?.from}
            </span>
            &nbsp;
            <span className="titler text-gray-300">to</span> &nbsp;
            <span className="gigtitle text-blue-300 font-mono font-bold line-clamp-1  ">
              {gig?.time?.to}
            </span>
          </div>
          <div className="flex">
            {" "}
            <span className=" tracking-tighter text-white text-[12px] mx-2">
              Contact:
            </span>
            <span className="gigtitle text-blue-300 font-mono font-bold line-clamp-1 blur-sm ">
              {gig?.phone}
            </span>
          </div>
          <div className="flex">
            {" "}
            <span className="titler tracking-tighter text-white text-[15px] mx-2">
              Pay:
            </span>
            <span className="gigtitle text-blue-300 font-mono font-bold line-clamp-1  ">
              {gig?.price}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {" "}
            <span className=" tracking-tighter text-white text-[12px] mx-2">
              Description:
            </span>
            <span className="text-blue-300 text-[11px] ">
              {gig?.description}
            </span>
          </div>{" "}
          {gig?.category && gig?.bussinesscat === "personal" && (
            <div className="flex">
              <span className="titler">Instrument: </span>

              {gig?.category && gig?.category !== null && (
                <h6 className="gigtitle text-blue-300 font-mono">
                  {gig?.category}
                </h6>
              )}
            </div>
          )}
          {!gig?.category && gig?.bussinesscat === "full" && (
            <div className="flex">
              <span className="titler text-purple-200 font-bold">
                FullBand(vocalist,instrumentalists etc){" "}
              </span>
            </div>
          )}
          {gig?.bandCategory?.length !== 0 ||
            (gig?.bussinesscat !== "full" && (
              <div>
                {" "}
                <h6 className="titler text-center underline mt-2">
                  Band Selection
                </h6>
                {gig?.bandCategory &&
                  gig?.bussinesscat === "other" &&
                  gig?.bandCategory !== null &&
                  gig?.bandCategory.map((band, idx) => {
                    return (
                      <ul className="flex title" key={idx}>
                        <li> {band}</li>
                      </ul>
                    );
                  })}
              </div>
            ))}
        </DialogContent>
      </Dialog>{" "}
    </div>
  );
};

export default GigDescription;
