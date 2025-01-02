"use client";
import { Textarea } from "flowbite-react";
import React, { useState, ChangeEvent, FormEvent } from "react";

import { Button } from "../ui/button";

// import "react-datepicker/dist/react-datepicker.css";
import { CircularProgress } from "@mui/material";
import { EyeIcon, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth } from "@clerk/nextjs";
// import useStore from "@/app/zustand/useStore";
// import { useAuth } from "@clerk/nextjs";

interface GigInputs {
  title: string;
  description: string;
  phoneNo: string;
  price: string;
  category: string;
  location: string;
  secret: string;
  end: string;
  start: string;
  durationto: string;
  durationfrom: string;
  bussinesscat: string;
}

interface UserInfo {
  prefferences: string[];
}

const CreateGig = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [secretpass, setSecretPass] = useState<boolean>(false);
  const [
    selectedDate,
    // setSelectedDate
  ] = useState<Date | null>(null);
  const [secretreturn] = useState<string>("");
  const [gigInputs, setGigs] = useState<GigInputs>({
    title: "",
    description: "",
    phoneNo: "",
    price: "",
    category: "",
    location: "",
    secret: "",
    end: "",
    start: "",
    durationto: "pm",
    durationfrom: "am",
    bussinesscat: "personal",
  });
  const [userinfo, setUserInfo] = useState<UserInfo>({
    prefferences: [],
  });
  const { userId } = useAuth();
  const {
    user: { _id },
  } = useCurrentUser(userId || null);
  //   const minDate = new Date("2020-01-01");
  //   const maxDate = new Date("2025-01-01");

  //   const handleDate = (date: Date) => {
  //     setSelectedDate(date);
  //   };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setUserInfo((prev) => ({
      prefferences: checked
        ? [...prev.prefferences, value]
        : prev.prefferences.filter((item) => item !== value),
    }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !gigInputs.title ||
      !gigInputs.description ||
      !gigInputs.phoneNo ||
      !gigInputs.price ||
      !gigInputs.location ||
      !gigInputs.end ||
      !gigInputs.start ||
      !gigInputs.durationfrom ||
      !gigInputs.durationto
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`/api/gigs/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: gigInputs.title,
          description: gigInputs.description,
          phoneNo: gigInputs.phoneNo,
          price: gigInputs.price,
          category: gigInputs.category,
          bandCategory: userinfo.prefferences,
          location: gigInputs.location,
          secret: gigInputs.secret,
          date: selectedDate,
          to: `${gigInputs.end}${gigInputs.durationto}`,
          from: `${gigInputs.start}${gigInputs.durationfrom}`,
          postedBy: _id,
          bussinesscat: gigInputs.bussinesscat,
        }),
      });
      const data = await res.json();
      if (data.gigstatus === "true") {
        toast.success(data.message);
        setGigs({
          title: "",
          description: "",
          phoneNo: "",
          price: "",
          category: "",
          location: "",
          secret: "",
          end: "",
          start: "",
          durationto: "pm",
          durationfrom: "am",
          bussinesscat: "personal",
        });
        setUserInfo({ prefferences: [] });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[100vh] overflow-y-scroll  w-[85%]  mx-auto">
      <form onSubmit={onSubmit} className=" overflow-y-scroll mt-[20px] py-3 ">
        <h6 className=" text-gray-300 font-sans text-center underline mb-3 -my-4">
          Enter info to create a gig
        </h6>
        <select
          onChange={(ev) =>
            setGigs((prev) => {
              return { ...prev, bussinesscat: ev.target.value };
            })
          }
          name="durationfrom"
          value={gigInputs?.bussinesscat}
          className="mb-2 w-[130px]  bg-neutral-300 h-[30px] rounded-md text-[12px] flex justify-center items-center p-2 font-mono"
        >
          <option value="full">Full Band</option>
          <option value="personal">Individual</option>
          <option value="other">other...</option>
        </select>{" "}
        <div className="w-full  gap-4">
          <div
            className={
              !secretreturn
                ? `flex flex-col gap-1  `
                : `flex flex-col gap-1 h-[70px] `
            }
          >
            <div className="flex items-center gap-2">
              <input
                autoComplete="off"
                onChange={(ev) =>
                  setGigs((prev) => {
                    return { ...prev, secret: ev.target.value };
                  })
                }
                name="secret"
                value={gigInputs?.secret}
                type={!secretpass ? "password" : "text"}
                placeholder="Enter secret,  NB://(valid only once)"
                className="font-mono  h-[35px] text-[12px]  bg-white mb-2 focus-within:ring-0 outline-none rounded-xl  px-3 text-black"
              />{" "}
              {secretpass ? (
                <EyeOff
                  onClick={() => setSecretPass((prev) => !prev)}
                  size="18px"
                />
              ) : (
                <EyeIcon
                  onClick={() => setSecretPass((prev) => !prev)}
                  size="18px"
                />
              )}
            </div>
            {secretreturn && (
              <h6 className="text-red-500 text-[13px] -mt-2">{secretreturn}</h6>
            )}
          </div>
          <input
            autoComplete="off"
            onChange={(ev) =>
              setGigs((prev) => {
                return { ...prev, title: ev.target.value };
              })
            }
            name="title"
            value={gigInputs?.title}
            type="text"
            placeholder="Enter any title"
            className="font-mono  h-[35px] text-[12px]  bg-white mb-2  focus-within:ring-0 outline-none rounded-xl  px-3 text-black"
          />{" "}
          <Textarea
            onChange={(ev) =>
              setGigs((prev) => {
                return { ...prev, description: ev.target.value };
              })
            }
            name="description"
            value={gigInputs?.description}
            style={{ resize: "none", height: "fit-content" }}
            className="min-h-[70px] py-2 mb-2 font-mono"
            placeholder=" Enter description e.g what songs or the vybe expected in the event/show"
          />
          <input
            autoComplete="off"
            type="text"
            placeholder="Enter phone no: "
            className="font-mono  h-[35px] text-[12px]  bg-white mb-2  focus-within:ring-0 outline-none rounded-xl  px-3 text-black"
            onChange={(ev) =>
              setGigs((prev) => {
                return { ...prev, phoneNo: ev.target.value };
              })
            }
            name="phoneNo"
            value={gigInputs?.phoneNo}
          />{" "}
          <input
            autoComplete="off"
            type="text"
            placeholder="Enter price range expected  "
            className="font-mono  h-[35px] text-[12px]  bg-white mb-2  focus-within:ring-0 outline-none rounded-xl  px-3 text-black"
            onChange={(ev) =>
              setGigs((prev) => {
                return { ...prev, price: ev.target.value };
              })
            }
            name="price"
            value={gigInputs?.price}
          />{" "}
          <input
            autoComplete="off"
            type="text"
            placeholder="Enter location  "
            className="font-mono  h-[35px] text-[12px]  bg-white mb-2  focus-within:ring-0 outline-none rounded-xl  px-3 text-black w-full"
            onChange={(ev) =>
              setGigs((prev) => {
                return { ...prev, location: ev.target.value };
              })
            }
            name="location"
            value={gigInputs?.location}
          />{" "}
          <>
            {gigInputs?.bussinesscat === "other" ? (
              <h6 className="choice mb-2">Choose the setUp of the show</h6>
            ) : (
              ""
            )}
            {gigInputs?.bussinesscat === "personal" && (
              <select
                onChange={(ev) =>
                  setGigs((prev) => {
                    return { ...prev, category: ev.target.value };
                  })
                }
                name="category"
                value={gigInputs?.category}
                className="mb-2 w-full bg-white  h-[40px] rounded-md p-3 text-[15px]  font-mono"
              >
                <option value="piano">Piano</option>
                <option value="guitar">Guitar</option>
                <option value="bass">Bass Guitar</option>
                <option value="saxophone">Saxophone</option>
                <option value="violin">Violin</option>
                <option value="ukulele">Ukulele</option>{" "}
                <option value="harp">Harp</option>
                <option value="xylophone">Xylophone</option>{" "}
                <option value="cello">Cello</option>
                <option value="percussion">Percussion</option>{" "}
              </select>
            )}
            {gigInputs?.bussinesscat === "other" && (
              <div className="h-[80px] rounded-lg shadow-xl gap-5  bg-zinc-800  p-2 choice flex flex-wrap">
                <div>
                  <input
                    onChange={handleChange}
                    type="checkbox"
                    id="vocalist"
                    name="vocalist"
                    value="vocalist"
                  />
                  <label
                    className="text-[12px] font-sans text-gray-300"
                    htmlFor="vocalist"
                  >
                    vocalist
                  </label>
                </div>
                <div>
                  {" "}
                  <input
                    onChange={handleChange}
                    type="checkbox"
                    id="piano"
                    name="piano"
                    value="piano"
                  />{" "}
                  <label
                    className="text-[12px] font-sans text-gray-300"
                    htmlFor="piano"
                  >
                    Piano
                  </label>
                </div>
                <div>
                  {" "}
                  <input
                    onChange={handleChange}
                    type="checkbox"
                    id="sax"
                    name="sax"
                    value="sax"
                  />{" "}
                  <label
                    className="text-[12px] font-sans text-gray-300"
                    htmlFor="sax"
                  >
                    Saxophone
                  </label>
                </div>{" "}
                <div>
                  {" "}
                  <input
                    onChange={handleChange}
                    type="checkbox"
                    id="guitar"
                    name="guitar"
                    value="guitar"
                  />{" "}
                  <label
                    className="text-[12px] font-sans text-gray-300"
                    htmlFor="guitar"
                  >
                    Guitar
                  </label>
                </div>{" "}
                <div>
                  {" "}
                  <input
                    onChange={handleChange}
                    type="checkbox"
                    id="drums"
                    name="drums"
                    value="drums"
                  />{" "}
                  <label
                    className="text-[12px] font-sans text-gray-300"
                    htmlFor="drums"
                  >
                    Drums
                  </label>
                </div>{" "}
                <div>
                  {" "}
                  <input
                    onChange={handleChange}
                    type="checkbox"
                    id="bass"
                    name="bass"
                    value="bass"
                  />{" "}
                  <label
                    className="text-[12px] font-sans text-gray-300"
                    htmlFor="bass"
                  >
                    Bass
                  </label>
                </div>
              </div>
            )}
          </>
          <div className="flex items-center flex-col gap-2 mt-5">
            <div className="flex items-center gap-3">
              {" "}
              <h6 className="mb-2 w-[50px] text-white font-mono flex justify-center text-[11px]">
                from:
              </h6>
              <input
                autoComplete="off"
                type="text"
                placeholder=" Time e.g 10 means 10:00 "
                className="mb-2 p-3 focus-within:ring-0 outline-none rounded-xl  px-3 text-black w-[124px] text-[9px]"
                onChange={(ev) =>
                  setGigs((prev) => {
                    return { ...prev, start: ev.target.value };
                  })
                }
                name="start"
                value={gigInputs?.start}
              />{" "}
              <select
                onChange={(ev) =>
                  setGigs((prev) => {
                    return { ...prev, durationfrom: ev.target.value };
                  })
                }
                name="durationfrom"
                value={gigInputs?.durationfrom}
                className="mb-2 w-[55px] bg-zinc-800 text-gray-200 h-[34px] rounded-full text-[11px] flex justify-center items-center p-2 font-mono"
              >
                <option value="pm">PM</option>
                <option value="am">AM</option>
              </select>{" "}
            </div>
            <div className="flex items-center gap-3 ">
              <h6 className="mb-2 w-[50px] text-white font-mono flex justify-center text-[11px]">
                to:
              </h6>
              <input
                autoComplete="off"
                type="text"
                placeholder=" Time e.g 10 means 10:00 "
                className="mb-2 p-3 focus-within:ring-0 outline-none rounded-xl  px-3 text-black w-[124px] text-[9px]"
                onChange={(ev) =>
                  setGigs((prev) => {
                    return { ...prev, end: ev.target.value };
                  })
                }
                name="end"
                value={gigInputs?.end}
              />{" "}
              <select
                onChange={(ev) =>
                  setGigs((prev) => {
                    return { ...prev, durationto: ev.target.value };
                  })
                }
                name="durationto"
                value={gigInputs?.durationto}
                className="mb-2 w-[55px] bg-zinc-800 text-gray-200 h-[34px] rounded-full text-[11px] flex justify-center items-center p-2 font-mono"
              >
                <option value="pm">PM</option>
                <option value="am">AM</option>
              </select>{" "}
            </div>
            {/* date here */}
            {/* <DatePicker
                selected={selectedDate}
                onChange={handleDate}
                dateFormat="MM/DD/YYYY"
                minDate={minDate}
                maxDate={maxDate}
                placeholderText="Set Event Date"
                className="font-mono  h-[35px] text-[12px]  bg-white mb-2  focus-within:ring-0 outline-none rounded-xl  px-3 text-black w-[300px]"
              /> */}
          </div>{" "}
          <div className="w-full flex justify-center">
            <Button
              variant="destructive"
              type="submit"
              className="mt-4 w-[60%] h-[30px] text-[12px]"
              disabled={isLoading}
            >
              {!isLoading ? (
                "Create Gig"
              ) : (
                <CircularProgress size="14px" sx={{ color: "white" }} />
              )}
            </Button>
          </div>
        </div>{" "}
      </form>
    </div>
  );
};

export default CreateGig;
