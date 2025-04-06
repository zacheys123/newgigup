// "use client";
// import { Textarea } from "flowbite-react";
// import React, {
//   useState,
//   ChangeEvent,
//   FormEvent,
//   useCallback,
//   useEffect,
//   useRef,
// } from "react";
// import { Button } from "../ui/button";
// import { Box, CircularProgress } from "@mui/material";
// import {
//   ArrowDown,
//   ArrowDown01Icon,
//   ArrowUp,
//   BriefcaseConveyorBelt,
//   Edit,
//   EyeIcon,
//   EyeOff,
//   InfoIcon,
//   Music,
//   Timer,
// } from "lucide-react";
// import { useCurrentUser } from "@/hooks/useCurrentUser";
// import { toast } from "sonner";
// import GigCustomization from "./GigCustomization";
// import { fileupload } from "@/hooks/fileUpload";
// import useStore from "@/app/zustand/useStore";
// import { FaComment } from "react-icons/fa";
// import { days } from "@/data";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { AnimatePresence, motion } from "framer-motion";
// import { fonts } from "@/utils";
// import { Label } from "../ui/label";
// import { Badge } from "../ui/badge";
// import { Input } from "../ui/input";

// // Type Definitions
// type TalentType = "mc" | "dj" | "vocalist" | null;
// type BusinessCategory =
//   | "full"
//   | "personal"
//   | "other"
//   | "mc"
//   | "dj"
//   | "vocalist"
//   | null;

// interface GigInputs {
//   title: string;
//   description: string;
//   phoneNo: string;
//   price: string;
//   category: string;
//   location: string;
//   secret: string;
//   end: string;
//   start: string;
//   durationto: string;
//   durationfrom: string;
//   bussinesscat: BusinessCategory;
//   otherTimeline: string;
//   gigtimeline: string;
//   day: string;
//   date: string;
//   mcType?: string;
//   mcLanguages?: string;
//   djGenre?: string;
//   djEquipment?: string;
//   vocalistGenre?: string[];
// }

// interface TalentModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   talentType: Exclude<TalentType, null>;
//   onSubmit: (data: Partial<GigInputs>) => void;
//   initialData?: Partial<GigInputs>;
// }

// interface CustomProps {
//   fontColor: string;
//   font: string;
//   backgroundColor: string;
// }

// interface UserInfo {
//   prefferences: string[];
// }

// interface CategoryVisibility {
//   title: boolean;
//   description: boolean;
//   business: boolean;
//   gtimeline: boolean;
//   othergig: boolean;
//   gduration: boolean;
// }

// const CreateGig = () => {
//   // State Hooks
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [secretpass, setSecretPass] = useState<boolean>(false);
//   const [showcustomization, setShowCustomization] = useState<boolean>(false);
//   const [isUploading, setIsUploading] = useState<boolean>(false);
//   const [imageUrl, setUrl] = useState<string>("");
//   const [fileUrl, setFileUrl] = useState<string>("");
//   const { setRefetchData } = useStore();
//   const { user } = useCurrentUser();
//   const [activeTalentType, setActiveTalentType] = useState<TalentType>(null);
//   const [showTalentModal, setShowTalentModal] = useState(false);

//   const [gigcustom, setGigCustom] = useState<CustomProps>({
//     fontColor: "",
//     font: "",
//     backgroundColor: "",
//   });
//   const [secretreturn] = useState<string>("");
//   const [gigInputs, setGigs] = useState<GigInputs>({
//     title: "",
//     description: "",
//     phoneNo: "",
//     price: "",
//     category: "",
//     location: "",
//     secret: "",
//     end: "",
//     start: "",
//     durationto: "pm",
//     durationfrom: "am",
//     bussinesscat: null,
//     otherTimeline: "",
//     gigtimeline: "",
//     day: "",
//     date: "",
//   });
//   const [userinfo, setUserInfo] = useState<UserInfo>({
//     prefferences: [],
//   });
//   const [bussinesscat, setBussinessCategory] = useState<BusinessCategory>(null);
//   const [showduration, setshowduration] = useState<boolean>(false);
//   const [showCategories, setshowCategories] = useState<CategoryVisibility>({
//     title: false,
//     description: false,
//     business: false,
//     gtimeline: false,
//     othergig: true,
//     gduration: false,
//   });
//   const [selectedDate, setSelectedDate] = useState<Date | null>(null);
//   const [editMessage, setEditMessage] = useState("");
//   const [error, setError] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);

//   // Constants
//   const minDate = new Date("2020-01-01");
//   const maxDate = new Date("2026-01-01");

//   // Handlers
//   const handleDate = (date: Date | null) => {
//     if (date) {
//       setSelectedDate(date);
//       setGigs((prev) => ({
//         ...prev,
//         date: date.toISOString(),
//       }));
//     }
//   };

//   const handleFileChange = useCallback(
//     (event: React.ChangeEvent<HTMLInputElement>) => {
//       const dep = "image";
//       const allowedTypes = [
//         "image/png",
//         "image/jpeg",
//         "image/gif",
//         "image/webp",
//       ];

//       fileupload(
//         event,
//         (file: string) => {
//           if (file) {
//             setUrl(file);
//           }
//         },
//         toast,
//         allowedTypes,
//         fileUrl,
//         (file: string | undefined) => {
//           if (file) {
//             setFileUrl(file);
//           }
//         },
//         setIsUploading,
//         dep,
//         user,
//         setRefetchData
//       );
//     },
//     [fileUrl, user, setRefetchData]
//   );

//   const handleInputChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setGigs((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleBussinessChange = (e: ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value as BusinessCategory;
//     setBussinessCategory(value);

//     // Clear all talent data when switching to non-talent categories
//     if (!["mc", "dj", "vocalist"].includes(value || "")) {
//       setGigs((prev) => ({
//         ...prev,
//         mcType: undefined,
//         mcLanguages: undefined,
//         djGenre: undefined,
//         djEquipment: undefined,
//         vocalistGenre: undefined,
//       }));
//       setActiveTalentType(null);
//       return;
//     }

//     // For talent types, clear other talent data and set current type
//     const newTalentType = value as Exclude<TalentType, null>;
//     setActiveTalentType(newTalentType);

//     // Clear other talent data while preserving current type's data
//     setGigs((prev) => ({
//       ...prev,
//       mcType: newTalentType === "mc" ? prev.mcType : undefined,
//       mcLanguages: newTalentType === "mc" ? prev.mcLanguages : undefined,
//       djGenre: newTalentType === "dj" ? prev.djGenre : undefined,
//       djEquipment: newTalentType === "dj" ? prev.djEquipment : undefined,
//       vocalistGenre:
//         newTalentType === "vocalist" ? prev.vocalistGenre : undefined,
//     }));

//     setShowTalentModal(true);
//   };

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { value, checked } = e.target;
//     setUserInfo((prev) => ({
//       prefferences: checked
//         ? [...prev.prefferences, value]
//         : prev.prefferences.filter((item) => item !== value),
//     }));
//   };

//   const handleTalentSubmit = (data: Partial<GigInputs>) => {
//     // Only keep data for the current active talent type
//     const filteredData = {
//       ...(activeTalentType === "mc" && {
//         mcType: data.mcType,
//         mcLanguages: data.mcLanguages,
//       }),
//       ...(activeTalentType === "dj" && {
//         djGenre: data.djGenre,
//         djEquipment: data.djEquipment,
//       }),
//       ...(activeTalentType === "vocalist" && {
//         vocalistGenre: data.vocalistGenre,
//       }),
//     };

//     setGigs((prev) => ({
//       ...prev,
//       ...filteredData,
//     }));
//     setShowTalentModal(false);
//   };
//   console.log(gigInputs);
//   const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     try {
//       setIsLoading(true);
//       const res = await fetch(`/api/gigs/create`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           title: gigInputs.title,
//           description: gigInputs.description,
//           phoneNo: gigInputs.phoneNo,
//           price: gigInputs.price,
//           category: gigInputs.category,
//           bandCategory: userinfo.prefferences,
//           location: gigInputs.location,
//           secret: gigInputs.secret,
//           date: gigInputs?.date,
//           to: `${gigInputs.end}${gigInputs.durationto}`,
//           from: `${gigInputs.start}${gigInputs.durationfrom}`,
//           postedBy: user?._id,
//           bussinesscat: bussinesscat,
//           font: gigcustom.font,
//           fontColor: gigcustom.fontColor,
//           backgroundColor: gigcustom.backgroundColor,
//           logo: imageUrl,
//           otherTimeline: gigInputs.otherTimeline,
//           gigtimeline: gigInputs.gigtimeline,
//           day: gigInputs.day,
//           mcType: gigInputs.mcType,
//           mcLanguages: gigInputs.mcLanguages,
//           djGenre: gigInputs.djGenre,
//           djEquipment: gigInputs.djEquipment,
//           vocalistGenre: gigInputs.vocalistGenre,
//         }),
//       });
//       const data = await res.json();
//       if (data.gigstatus === "true") {
//         setEditMessage(data.message);
//         setError(false);
//         setIsVisible(true);
//         // In the onSubmit function, update the reset portion:
//         setGigs({
//           title: "",
//           description: "",
//           phoneNo: "",
//           price: "",
//           category: "",
//           location: "",
//           secret: "",
//           end: "",
//           start: "",
//           durationto: "pm",
//           durationfrom: "am",
//           bussinesscat: null,
//           otherTimeline: "",
//           gigtimeline: "",
//           day: "",
//           date: "",
//           mcType: undefined,
//           mcLanguages: undefined,
//           djGenre: undefined,
//           djEquipment: undefined,
//           vocalistGenre: undefined,
//         });
//         setUserInfo({ prefferences: [] });
//         setBussinessCategory(null);
//       }
//       if (data.gigstatus === "false") {
//         setEditMessage(data.message);
//         setError(true);
//         setIsVisible(true);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to create gig");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Effects
//   useEffect(() => {
//     let timer: NodeJS.Timeout;
//     if (editMessage && isVisible) {
//       timer = setTimeout(() => {
//         setIsVisible(false);
//         setEditMessage("");
//       }, 4500);
//     }
//     return () => {
//       if (timer) clearTimeout(timer);
//     };
//   }, [editMessage, isVisible]);

//   // Component Render
//   return (
//     <div className="relative">
//       <form
//         onSubmit={onSubmit}
//         className="min-h-screen bg-gray-900 px-4 py-6 w-full md:max-w-2xl lg:max-w-3xl mx-auto"
//       >
//         {/* Success/Error Message */}
//         {isVisible && editMessage && (
//           <motion.div
//             initial={{ opacity: 0, y: "-200px" }}
//             exit={{
//               opacity: 0,
//               y: "-200px",
//               transition: { duration: 0.9 },
//             }}
//             animate={{
//               opacity: 1,
//               y: 0,
//               transition: { duration: 0.9 },
//             }}
//             className="fixed top-10 p-4 rounded-md left-0 right-0 h-fit w-[90%] md:w-[80%] mx-auto z-50 flex justify-center items-center bg-zinc-800 shadow-md shadow-orange-200"
//           >
//             <span
//               className={`flex justify-center ${
//                 error ? "text-red-300" : "text-green-300"
//               }`}
//               style={{
//                 fontFamily: fonts[20],
//               }}
//             >
//               {editMessage}
//             </span>
//           </motion.div>
//         )}

//         {/* Main Form Content */}
//         <div className="space-y-6">
//           <h6 className="text-gray-100 font-sans text-center text-lg font-semibold">
//             Enter info to create a gig
//           </h6>

//           {/* Business Type Selection */}
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
//             <select
//               onChange={handleBussinessChange}
//               name="durationfrom"
//               value={bussinesscat || ""}
//               className="w-full md:w-[200px] bg-gray-700 text-gray-100 h-[40px] rounded-lg text-sm px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
//             >
//               <option value="" className="bg-gray-700">
//                 Who do you want?
//               </option>
//               <option value="full">Full Band</option>
//               <option value="personal">Individual</option>
//               <option value="other">Create your own band</option>
//               <option value="mc">Mcee</option>
//               <option value="dj">Dj</option>
//               <option value="vocalist">Vocalist</option>
//             </select>
//             {/* Talent Details Section */}
//         {!show ? (
//               <div className="relative">
//                 {/* Talent Details Section */}
//                 {(gigInputs.mcType ||
//                   gigInputs.djGenre ||
//                   gigInputs.vocalistGenre?.length) && (
//                   <SectionContainer
//                     icon={<Music size={18} />}
//                     title="Talent Details"
//                     action={
//                       <Button
//                         variant="ghost"
//                         className="text-rose-400 hover:bg-neutral-700"
//                         onClick={() => {
//                           const type = gigInputs.mcType
//                             ? "mc"
//                             : gigInputs.djGenre
//                             ? "dj"
//                             : gigInputs.vocalistGenre?.length
//                             ? "vocalist"
//                             : null;
//                           if (type) {
//                             setActiveTalentType(type);
//                             setShowTalentModal(true);
//                           }
//                         }}
//                       >
//                         <Edit size={16} className="mr-1" /> Edit
//                       </Button>
//                     }
//                   >
//                     <div className="space-y-2 ">
//                       <span
//                         className="absolute right-2 -top-[10px] text-[17px] font-bold text-gray-200 z-50 cursor-pointer"
//                         onClick={() => setShow(true)}
//                       >
//                         &times;
//                       </span>
//                       {gigInputs.mcType && (
//                         <div className="flex flex-col gap-1">
//                           <div className="flex gap-2">
//                             <span className="text-neutral-400">MC Type:</span>
//                             <span className="text-white">
//                               {gigInputs.mcType}
//                             </span>
//                           </div>
//                           {fieldErrors.mcType && (
//                             <p className="text-red-500 text-xs">
//                               {fieldErrors.mcType}
//                             </p>
//                           )}
//                         </div>
//                       )}
//                       {gigInputs.mcLanguages && (
//                         <div className="flex flex-col gap-1">
//                           <div className="flex gap-2">
//                             <span className="text-neutral-400">Languages:</span>
//                             <div className="flex flex-wrap gap-1">
//                               {gigInputs.mcLanguages.split(",").map((lang) => (
//                                 <Badge key={lang} variant="outline">
//                                   {lang.trim()}
//                                 </Badge>
//                               ))}
//                             </div>
//                           </div>
//                           {fieldErrors.mcLanguages && (
//                             <p className="text-red-500 text-xs">
//                               {fieldErrors.mcLanguages}
//                             </p>
//                           )}
//                         </div>
//                       )}
//                       {gigInputs.djGenre && (
//                         <div className="flex flex-col gap-1">
//                           <div className="flex gap-2">
//                             <span className="text-neutral-400">DJ Genre:</span>
//                             <span className="text-white">
//                               {gigInputs.djGenre}
//                             </span>
//                           </div>
//                           {fieldErrors.djGenre && (
//                             <p className="text-red-500 text-xs">
//                               {fieldErrors.djGenre}
//                             </p>
//                           )}
//                         </div>
//                       )}
//                       {gigInputs.djEquipment && (
//                         <div className="flex flex-col gap-1">
//                           <div className="flex gap-2">
//                             <span className="text-neutral-400">
//                               DJ Equipment:
//                             </span>
//                             <span className="text-white">
//                               {gigInputs.djEquipment}
//                             </span>
//                           </div>
//                           {fieldErrors.djEquipment && (
//                             <p className="text-red-500 text-xs">
//                               {fieldErrors.djEquipment}
//                             </p>
//                           )}
//                         </div>
//                       )}
//                       {gigInputs.vocalistGenre?.length && (
//                         <div className="flex flex-col gap-1">
//                           <div className="flex gap-2">
//                             <span className="text-neutral-400">
//                               Vocalist Genres:
//                             </span>
//                             <div className="flex flex-wrap gap-1">
//                               {gigInputs.vocalistGenre.map((genre) => (
//                                 <Badge
//                                   key={genre}
//                                   variant="outline"
//                                   className="text-gray-300"
//                                 >
//                                   {genre}
//                                 </Badge>
//                               ))}
//                             </div>
//                           </div>
//                           {fieldErrors.vocalistGenre && (
//                             <p className="text-red-500 text-xs">
//                               {fieldErrors.vocalistGenre}
//                             </p>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </SectionContainer>
//                 )}
//               </div>
//             ) : (
//               <div className="w-full flex justify-end">
//                 <span
//                   className="text-blue-600 text-[11px] bg-gray-300 px-2 cursor-pointer  rounded-xl"
//                   onClick={() => setShow(false)}
//                 >
//                   show
//                 </span>
//               </div>
//             )}
//             <div
//               onClick={() => setShowCustomization(true)}
//               className="cursor-pointer w-full md:w-auto"
//             >
//               <h1 className="text-sm text-gray-100 bg-gradient-to-r from-blue-500 to-purple-600 py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all text-center">
//                 Customize your Gig Card
//               </h1>
//             </div>
//           </div>

//           {/* Form Sections */}
//           <div className="w-full space-y-4">
//             {/* Title Information Section */}
//             <div className={!secretreturn ? `space-y-4` : `space-y-4 h-[70px]`}>
//               <div
//                 className="flex justify-between items-center w-full bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-amber-700 transition-all text-white"
//                 onClick={() =>
//                   setshowCategories({
//                     ...showCategories,
//                     title: !showCategories.title,
//                   })
//                 }
//               >
//                 Title Information
//                 <FaComment size="20" className="text-gray-400" />
//               </div>
//               {showCategories.title && (
//                 <div className="flex flex-col gap-4 w-full">
//                   <div className="flex items-center rounded-lg bg-gray-300 p-2">
//                     <input
//                       autoComplete="off"
//                       onChange={handleInputChange}
//                       name="secret"
//                       value={gigInputs?.secret}
//                       type={!secretpass ? "password" : "text"}
//                       placeholder="Enter secret (valid only once)"
//                       className="w-full bg-transparent text-gray-800 text-sm focus:outline-none"
//                     />
//                     {secretpass ? (
//                       <EyeOff
//                         onClick={() => setSecretPass((prev) => !prev)}
//                         size="18px"
//                         className="text-gray-400 cursor-pointer"
//                       />
//                     ) : (
//                       <EyeIcon
//                         onClick={() => setSecretPass((prev) => !prev)}
//                         size="18px"
//                         className="text-gray-400 cursor-pointer"
//                       />
//                     )}
//                   </div>
//                   <input
//                     autoComplete="off"
//                     onChange={handleInputChange}
//                     name="title"
//                     value={gigInputs?.title}
//                     type="text"
//                     placeholder="Enter a title"
//                     className="w-full bg-gray-300 text-gray-800 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               )}
//               {secretreturn && (
//                 <h6 className="text-red-500 text-sm -mt-2">{secretreturn}</h6>
//               )}
//             </div>

//             {/* Description Information Section */}
//             <div
//               className="flex justify-between items-center w-full bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-amber-700 transition-all text-white"
//               onClick={() =>
//                 setshowCategories({
//                   ...showCategories,
//                   description: !showCategories.description,
//                 })
//               }
//             >
//               Description Information
//               <InfoIcon size="20" className="text-gray-400" />
//             </div>
//             {showCategories.description && (
//               <Textarea
//                 onChange={handleInputChange}
//                 name="description"
//                 value={gigInputs?.description}
//                 style={{ resize: "none", height: "fit-content" }}
//                 className="min-h-[100px] bg-gray-300 text-gray-800 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter description (e.g., songs or vibe expected at the event/show)"
//               />
//             )}

//             {/* Business Information Section */}
//             <div
//               className="flex justify-between items-center w-full bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-amber-700 transition-all text-white"
//               onClick={() =>
//                 setshowCategories({
//                   ...showCategories,
//                   business: !showCategories.business,
//                 })
//               }
//             >
//               Business Information
//               <BriefcaseConveyorBelt size="20" className="text-gray-400" />
//             </div>
//             {showCategories.business && (
//               <div className="flex flex-col gap-4 w-full">
//                 <input
//                   autoComplete="off"
//                   type="text"
//                   placeholder="Enter phone number"
//                   className="w-full bg-gray-300 text-gray800 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   onChange={handleInputChange}
//                   name="phoneNo"
//                   value={gigInputs?.phoneNo}
//                 />
//                 <input
//                   autoComplete="off"
//                   type="text"
//                   placeholder="Enter expected price range"
//                   className="w-full bg-gray-300 text-gray-800 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   onChange={handleInputChange}
//                   name="price"
//                   value={gigInputs?.price}
//                 />
//               </div>
//             )}

//             {/* Gig Timeline Information Section */}
//             <div
//               className="flex justify-between items-center w-full bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-amber-700 transition-all text-white"
//               onClick={() =>
//                 setshowCategories({
//                   ...showCategories,
//                   gtimeline: !showCategories.gtimeline,
//                 })
//               }
//             >
//               Gig Timeline Information
//               <Timer size="20" className="text-gray-400" />
//             </div>
//             {showCategories.gtimeline && (
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
//                 <input
//                   autoComplete="off"
//                   type="text"
//                   placeholder="Enter location"
//                   className="w-full bg-gray-300 text-gray-800 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   onChange={handleInputChange}
//                   name="location"
//                   value={gigInputs?.location}
//                 />
//                 <select
//                   onChange={handleInputChange}
//                   name="gigtimeline"
//                   value={gigInputs.gigtimeline}
//                   className="w-full bg-gray-300 text-gray-800 h-[40px] rounded-lg text-xs px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value=""> Gig Timeline </option>
//                   <option value="once">
//                     One Time(function,event,recording etc)
//                   </option>
//                   <option value="weekly">Every Week</option>
//                   <option value="other">Other...</option>
//                 </select>
//                 {gigInputs?.gigtimeline === "other" && (
//                   <div className="w-full flex justify-center items-center sm:col-span-2">
//                     <input
//                       autoComplete="off"
//                       type="text"
//                       placeholder="Enter other timeline details"
//                       className="w-full bg-gray-300 text-gray-800 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       onChange={handleInputChange}
//                       name="otherTimeline"
//                       value={gigInputs?.otherTimeline}
//                       disabled={gigInputs?.durationfrom === "once"}
//                       required={gigInputs?.durationfrom === "once"}
//                     />
//                   </div>
//                 )}
//                 <select
//                   className="w-full p-2 rounded-md bg-gray-300 text-gray-800 border-none focus:ring-0 text-xs"
//                   value={gigInputs?.day}
//                   onChange={handleInputChange}
//                   name="day"
//                 >
//                   {days().map((i) => (
//                     <option key={i?.id} value={i.val}>
//                       {i?.name}
//                     </option>
//                   ))}
//                 </select>
//                 {gigInputs?.gigtimeline === "once" && (
//                   <DatePicker
//                     selected={selectedDate}
//                     onChange={handleDate}
//                     minDate={minDate}
//                     maxDate={maxDate}
//                     className="w-full bg-gray-300 text-gray-800 p-2 rounded-lg"
//                     placeholderText="Select date"
//                     isClearable
//                   />
//                 )}
//               </div>
//             )}

//             {/* Band Setup Section */}
//             {bussinesscat === "other" && (
//               <h6
//                 className="flex justify-between items-center w-full bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-amber-700 transition-all text-white"
//                 onClick={() =>
//                   setshowCategories({
//                     ...showCategories,
//                     othergig: !showCategories.othergig,
//                   })
//                 }
//               >
//                 Choose the setup of the show
//                 {showCategories.othergig ? (
//                   <ArrowDown size="20" className="text-gray-400" />
//                 ) : (
//                   <ArrowUp size="20" className="text-gray-400" />
//                 )}
//               </h6>
//             )}

//             {/* Individual Instrument Selection */}
//             {bussinesscat === "personal" && (
//               <select
//                 onChange={handleInputChange}
//                 name="category"
//                 value={gigInputs?.category}
//                 className="w-full bg-gray-300 text-gray-800 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="">Select instrument</option>
//                 <option value="piano">Piano</option>
//                 <option value="guitar">Guitar</option>
//                 <option value="bass">Bass Guitar</option>
//                 <option value="saxophone">Saxophone</option>
//                 <option value="violin">Violin</option>
//                 <option value="ukulele">Ukulele</option>
//                 <option value="harp">Harp</option>
//                 <option value="xylophone">Xylophone</option>
//                 <option value="cello">Cello</option>
//                 <option value="percussion">Percussion</option>
//               </select>
//             )}

//             {/* Band Member Selection */}
//             {!showCategories?.othergig && bussinesscat === "other" && (
//               <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-gray-300 p-4 rounded-lg">
//                 {["vocalist", "piano", "sax", "guitar", "drums", "bass"].map(
//                   (item) => (
//                     <div key={item} className="flex items-center space-x-2">
//                       <input
//                         onChange={handleChange}
//                         type="checkbox"
//                         id={item}
//                         name={item}
//                         value={item}
//                         checked={userinfo.prefferences.includes(item)}
//                         className="accent-blue-500"
//                       />
//                       <label
//                         htmlFor={item}
//                         className="text-gray-800 text-sm capitalize"
//                       >
//                         {item}
//                       </label>
//                     </div>
//                   )
//                 )}
//               </div>
//             )}

//             {/* Duration Selection */}
//             {showduration ? (
//               <div className="bg-gray-700 p-4 rounded-lg relative">
//                 <div
//                   className="text-white absolute right-2 top-2 text-xl cursor-pointer"
//                   onClick={() => setshowduration(false)}
//                 >
//                   &times;
//                 </div>
//                 <Box className="space-y-4">
//                   <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
//                     <h6 className="text-gray-100 text-sm w-[50px]">From:</h6>
//                     <input
//                       autoComplete="off"
//                       type="text"
//                       placeholder="Time (e.g., 10 means 10:00)"
//                       className="w-full sm:w-[120px] bg-gray-200 text-gray-800 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       onChange={handleInputChange}
//                       name="start"
//                       value={gigInputs?.start}
//                     />
//                     <select
//                       onChange={handleInputChange}
//                       name="durationfrom"
//                       value={gigInputs?.durationfrom}
//                       className="w-full sm:w-[60px] bg-gray-200 text-gray-800 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                       <option value="pm">PM</option>
//                       <option value="am">AM</option>
//                     </select>
//                   </div>
//                   <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
//                     <h6 className="text-gray-100 text-sm w-[50px]">To:</h6>
//                     <input
//                       autoComplete="off"
//                       type="text"
//                       placeholder="Time (e.g., 10 means 10:00)"
//                       className="w-full sm:w-[120px] bg-gray-200 text-gray-800 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       onChange={handleInputChange}
//                       name="end"
//                       value={gigInputs?.end}
//                     />
//                     <select
//                       onChange={handleInputChange}
//                       name="durationto"
//                       value={gigInputs?.durationto}
//                       className="w-full sm:w-[60px] bg-gray-300 text-gray-800 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                       <option value="pm">PM</option>
//                       <option value="am">AM</option>
//                     </select>
//                   </div>
//                 </Box>
//               </div>
//             ) : (
//               <Box
//                 onClick={() => setshowduration(true)}
//                 className="flex justify-between items-center w-full bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition-all"
//               >
//                 <h6 className="text-gray-100 text-sm">Enter Duration</h6>
//                 <ArrowDown01Icon size="20" className="text-gray-400" />
//               </Box>
//             )}

//             {/* Submit Button */}
//             <div className="w-full flex justify-center mt-6">
//               <Button
//                 variant="destructive"
//                 type="submit"
//                 className="w-full sm:w-[60%] h-[40px] text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all"
//                 disabled={isLoading}
//               >
//                 {!isLoading ? (
//                   "Create Gig"
//                 ) : (
//                   <CircularProgress size="16px" sx={{ color: "white" }} />
//                 )}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </form>

//       {/* Modals */}
//       <div className="h-full w-full relative">
//         {showcustomization && (
//           <GigCustomization
//             customization={gigcustom}
//             setCustomization={setGigCustom}
//             closeModal={() => setShowCustomization(false)}
//             logo={imageUrl}
//             handleFileChange={handleFileChange}
//             isUploading={isUploading}
//           />
//         )}
//       </div>
//       {activeTalentType && (
//         <TalentModal
//           isOpen={showTalentModal}
//           onClose={() => setShowTalentModal(false)}
//           talentType={activeTalentType}
//           onSubmit={handleTalentSubmit}
//           initialData={{
//             ...(activeTalentType === "mc" && {
//               mcType: gigInputs.mcType,
//               mcLanguages: gigInputs.mcLanguages,
//             }),
//             ...(activeTalentType === "dj" && {
//               djGenre: gigInputs.djGenre,
//               djEquipment: gigInputs.djEquipment,
//             }),
//             ...(activeTalentType === "vocalist" && {
//               vocalistGenre: gigInputs.vocalistGenre,
//             }),
//           }}
//         />
//       )}
//     </div>
//   );
// };

// // Reusable Components
// const SectionContainer = ({
//   icon,
//   title,
//   children,
//   action,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   children: React.ReactNode;
//   action?: React.ReactNode;
// }) => (
//   <div className="bg-neutral-800/50 rounded-lg p-4">
//     <div className="flex justify-between items-center mb-4">
//       <h2 className="text-lg font-bold text-white flex items-center gap-2">
//         {icon} {title}
//       </h2>
//       {action}
//     </div>
//     {children}
//   </div>
// );

// const TextInput = ({
//   label,
//   value,
//   onChange,
//   placeholder = "",
//   disabled = false,
//   className = "",
// }: {
//   label: string;
//   value: string;
//   onChange: (value: string) => void;
//   placeholder?: string;
//   disabled?: boolean;
//   className?: string;
// }) => (
//   <div className={className}>
//     <Label className="text-neutral-400 text-[12px]">{label}</Label>
//     <Input
//       className={`bg-neutral-800 border-neutral-700 text-white mt-1 text-[12px] ${
//         disabled ? "opacity-70" : ""
//       }`}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       placeholder={placeholder}
//       disabled={disabled}
//     />
//   </div>
// );

// const TalentModal = ({
//   isOpen,
//   onClose,
//   talentType,
//   onSubmit,
//   initialData,
// }: TalentModalProps) => {
//   const [localData, setLocalData] = useState<Partial<GigInputs>>(
//     initialData || {}
//   );

//   const handleSubmit = () => {
//     onSubmit(localData);
//     onClose();
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={onClose}
//       title={`${talentType.toUpperCase()} Details`}
//     >
//       <div className="space-y-4">
//         {talentType === "mc" && (
//           <>
//             <TextInput
//               label="MC Type"
//               value={localData.mcType || ""}
//               onChange={(value) =>
//                 setLocalData({ ...localData, mcType: value })
//               }
//             />
//             <TextInput
//               label="Languages (comma separated)"
//               value={localData.mcLanguages || ""}
//               onChange={(value) =>
//                 setLocalData({ ...localData, mcLanguages: value })
//               }
//             />
//           </>
//         )}

//         {talentType === "dj" && (
//           <>
//             <TextInput
//               label="DJ Genre"
//               value={localData.djGenre || ""}
//               onChange={(value) =>
//                 setLocalData({ ...localData, djGenre: value })
//               }
//             />
//             <TextInput
//               label="DJ Equipment"
//               value={localData.djEquipment || ""}
//               onChange={(value) =>
//                 setLocalData({ ...localData, djEquipment: value })
//               }
//             />
//           </>
//         )}

//         {talentType === "vocalist" && (
//           <div className="space-y-2">
//             <Label className="text-neutral-400">Vocalist Genres</Label>
//             <div className="flex flex-wrap gap-2">
//               {["Pop", "R&B", "Gospel", "Jazz", "Afrobeat"].map((genre) => (
//                 <Badge
//                   key={genre}
//                   variant={
//                     localData.vocalistGenre?.includes(genre)
//                       ? "secondary"
//                       : "outline"
//                   }
//                   className="cursor-pointer text-red-500"
//                   onClick={() => {
//                     setLocalData((prev) => ({
//                       ...prev,
//                       vocalistGenre: prev.vocalistGenre?.includes(genre)
//                         ? prev.vocalistGenre.filter((g) => g !== genre)
//                         : [...(prev.vocalistGenre || []), genre],
//                     }));
//                   }}
//                 >
//                   {genre}
//                 </Badge>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//       <ModalActions onCancel={onClose} onConfirm={handleSubmit} />
//     </Modal>
//   );
// };

// const Modal = ({
//   isOpen,
//   onClose,
//   title,
//   children,
// }: {
//   isOpen: boolean;
//   onClose?: () => void;
//   title: string;
//   children: React.ReactNode;
// }) => {
//   const modalRef = useRef<HTMLDivElement>(null);

//   // Close modal on ESC key
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Escape" && onClose) onClose();
//     };

//     if (isOpen) {
//       document.addEventListener("keydown", handleKeyDown);
//       document.body.style.overflow = "hidden"; // Prevent scrolling
//     }

//     return () => {
//       document.removeEventListener("keydown", handleKeyDown);
//       document.body.style.overflow = "auto";
//     };
//   }, [isOpen, onClose]);

//   // Close modal when clicking outside
//   const handleOutsideClick = (e: React.MouseEvent) => {
//     if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
//       onClose?.();
//     }
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.2 }}
//           className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
//           onClick={handleOutsideClick}
//         >
//           {/* Overlay with subtle gradient */}
//           <div className="fixed inset-0 bg-gradient-to-br from-black/80 to-purple-900/20" />

//           <motion.div
//             ref={modalRef}
//             initial={{ y: 20, scale: 0.98 }}
//             animate={{ y: 0, scale: 1 }}
//             exit={{ y: 20, opacity: 0 }}
//             transition={{ type: "spring", damping: 25, stiffness: 500 }}
//             className="relative w-full max-w-md rounded-xl bg-neutral-900 border border-neutral-700/50 shadow-2xl overflow-hidden"
//           >
//             {/* Header with close button */}
//             <div className="flex items-center justify-between p-5 border-b border-neutral-800">
//               <h3 className="text-xl font-semibold text-white">{title}</h3>
//               {onClose && (
//                 <button
//                   onClick={onClose}
//                   className="p-1 rounded-full hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-white"
//                   aria-label="Close modal"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     <line x1="18" y1="6" x2="6" y2="18" />
//                     <line x1="6" y1="6" x2="18" y2="18" />
//                   </svg>
//                 </button>
//               )}
//             </div>

//             {/* Content */}
//             <div className="p-5 text-neutral-300">{children}</div>

//             {/* Subtle glow effect */}
//             <div className="absolute inset-0 pointer-events-none border border-transparent group-hover:border-purple-500/30 transition-all duration-500 rounded-xl" />
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// const ModalActions = ({
//   onCancel,
//   onConfirm,
//   confirmText = "Confirm",
// }: {
//   onCancel: () => void;
//   onConfirm: () => void;
//   confirmText?: string;
// }) => (
//   <div className="flex justify-end gap-2 mt-6">
//     <Button
//       variant="outline"
//       className="text-black border-neutral-600"
//       onClick={onCancel}
//     >
//       Cancel
//     </Button>
//     <Button className="bg-rose-600 hover:bg-rose-700" onClick={onConfirm}>
//       {confirmText ? confirmText : "Confirm"}
//     </Button>
//   </div>
// );

// export default CreateGig;

"use client";
import { Textarea } from "flowbite-react";
import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { Button } from "../ui/button";
import { Box, CircularProgress } from "@mui/material";
import {
  ArrowDown,
  ArrowDown01Icon,
  ArrowUp,
  BriefcaseConveyorBelt,
  Edit,
  EyeIcon,
  EyeOff,
  InfoIcon,
  Music,
  Timer,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "sonner";
import GigCustomization from "./GigCustomization";
import { fileupload } from "@/hooks/fileUpload";
import useStore from "@/app/zustand/useStore";
import { FaComment } from "react-icons/fa";
import { days } from "@/data";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AnimatePresence, motion } from "framer-motion";
import { fonts } from "@/utils";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";

// Type Definitions
type TalentType = "mc" | "dj" | "vocalist" | null;
type BusinessCategory =
  | "full"
  | "personal"
  | "other"
  | "mc"
  | "dj"
  | "vocalist"
  | null;

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
  bussinesscat: BusinessCategory;
  otherTimeline: string;
  gigtimeline: string;
  day: string;
  date: string;
  mcType?: string;
  mcLanguages?: string;
  djGenre?: string;
  djEquipment?: string;
  vocalistGenre?: string[];
}

interface TalentModalProps {
  isOpen: boolean;
  onClose: () => void;
  talentType: Exclude<TalentType, null>;
  onSubmit: (data: Partial<GigInputs>) => void;
  initialData?: Partial<GigInputs>;
  errors: Record<string, string>;
  validateField: <K extends GigField>(field: K, value: FieldValue<K>) => string;
}
type GigField =
  | "title"
  | "description"
  | "phoneNo"
  | "price"
  | "location"
  | "mcType"
  | "mcLanguages"
  | "djGenre"
  | "djEquipment"
  | "vocalistGenre";

type FieldValue<T extends GigField> = T extends "vocalistGenre"
  ? string[]
  : T extends "mcLanguages"
  ? string
  : string;
interface CustomProps {
  fontColor: string;
  font: string;
  backgroundColor: string;
}

interface UserInfo {
  prefferences: string[];
}

interface CategoryVisibility {
  title: boolean;
  description: boolean;
  business: boolean;
  gtimeline: boolean;
  othergig: boolean;
  gduration: boolean;
}

const CreateGig = () => {
  // State Hooks
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [secretpass, setSecretPass] = useState<boolean>(false);
  const [showcustomization, setShowCustomization] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [imageUrl, setUrl] = useState<string>("");
  const [fileUrl, setFileUrl] = useState<string>("");
  const { setRefetchData } = useStore();
  const { user } = useCurrentUser();
  const [activeTalentType, setActiveTalentType] = useState<TalentType>(null);
  const [showTalentModal, setShowTalentModal] = useState(false);
  const [gigcustom, setGigCustom] = useState<CustomProps>({
    fontColor: "",
    font: "",
    backgroundColor: "",
  });
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
    bussinesscat: null,
    otherTimeline: "",
    gigtimeline: "",
    day: "",
    date: "",
  });
  const [userinfo, setUserInfo] = useState<UserInfo>({
    prefferences: [],
  });
  const [bussinesscat, setBussinessCategory] = useState<BusinessCategory>(null);
  const [showduration, setshowduration] = useState<boolean>(false);
  const [showCategories, setshowCategories] = useState<CategoryVisibility>({
    title: false,
    description: false,
    business: false,
    gtimeline: false,
    othergig: true,
    gduration: false,
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editMessage, setEditMessage] = useState("");
  const [error, setError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Constants
  const minDate = new Date("2020-01-01");
  const maxDate = new Date("2026-01-01");

  // Validation functions
  const validateField = <T extends GigField>(
    field: T,
    value: FieldValue<T>,
    bussinesscat: BusinessCategory
  ): string => {
    switch (field) {
      case "title":
      case "description":
      case "phoneNo":
      case "price":
      case "location":
        return !value
          ? `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
          : "";
      case "mcType":
        return bussinesscat === "mc" && !value ? "MC type is required" : "";
      case "mcLanguages":
        return bussinesscat === "mc" && !value ? "Languages are required" : "";
      case "djGenre":
        return bussinesscat === "dj" && !value ? "DJ genre is required" : "";
      case "djEquipment":
        return bussinesscat === "dj" && !value ? "Equipment is required" : "";
      case "vocalistGenre":
        return bussinesscat === "vocalist" && (!value || value.length === 0)
          ? "At least one genre is required"
          : "";
      default:
        return "";
    }
  };

  const validateFields = (): boolean => {
    const errors: Partial<Record<GigField, string>> = {};
    // Validate all fields
    errors.title = validateField("title", gigInputs.title, bussinesscat);
    errors.description = validateField(
      "description",
      gigInputs.description,
      bussinesscat
    );
    errors.phoneNo = validateField("phoneNo", gigInputs.phoneNo, bussinesscat);
    errors.price = validateField("price", gigInputs.price, bussinesscat);
    errors.location = validateField(
      "location",
      gigInputs.location,
      bussinesscat
    );

    // Validate talent-specific fields
    if (bussinesscat === "mc") {
      errors.mcType = validateField(
        "mcType",
        gigInputs.mcType || "",
        bussinesscat
      );
      errors.mcLanguages = validateField(
        "mcLanguages",
        gigInputs.mcLanguages || "",
        bussinesscat
      );
    } else if (bussinesscat === "dj") {
      errors.djGenre = validateField(
        "djGenre",
        gigInputs.djGenre || "",
        bussinesscat
      );
      errors.djEquipment = validateField(
        "djEquipment",
        gigInputs.djEquipment || "",
        bussinesscat
      );
    } else if (bussinesscat === "vocalist") {
      errors.vocalistGenre = validateField(
        "vocalistGenre",
        gigInputs.vocalistGenre || [],
        bussinesscat
      );
    }

    // Properly typed error filtering
    const filteredEntries = Object.entries(errors).filter(([x, value]) => {
      console.log(x);
      return value;
    }) as Array<[GigField, string]>;
    const filteredErrors = Object.fromEntries(filteredEntries) as Record<
      GigField,
      string
    >;

    setFieldErrors(filteredErrors);
    return Object.keys(filteredErrors).length === 0;
  };

  // Handlers
  const handleDate = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      setGigs((prev) => ({
        ...prev,
        date: date.toISOString(),
      }));
    }
  };

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const dep = "image";
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/gif",
        "image/webp",
      ];

      fileupload(
        event,
        (file: string) => {
          if (file) {
            setUrl(file);
          }
        },
        toast,
        allowedTypes,
        fileUrl,
        (file: string | undefined) => {
          if (file) {
            setFileUrl(file);
          }
        },
        setIsUploading,
        dep,
        user,
        setRefetchData
      );
    },
    [fileUrl, user, setRefetchData]
  );

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setGigs((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBussinessChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as BusinessCategory;
    setBussinessCategory(value);
    console.log(e.target.value);
    // Clear all talent data when switching to non-talent categories
    if (!["mc", "dj", "vocalist"].includes(value || "")) {
      setGigs((prev) => ({
        ...prev,
        mcType: undefined,
        mcLanguages: undefined,
        djGenre: undefined,
        djEquipment: undefined,
        vocalistGenre: undefined,
      }));
      setActiveTalentType(null);
      return;
    }

    // For talent types, clear other talent data and set current type
    const newTalentType = value as Exclude<TalentType, null>;
    setActiveTalentType(newTalentType);

    // Clear other talent data while preserving current type's data
    setGigs((prev) => ({
      ...prev,
      mcType: newTalentType === "mc" ? prev.mcType : undefined,
      mcLanguages: newTalentType === "mc" ? prev.mcLanguages : undefined,
      djGenre: newTalentType === "dj" ? prev.djGenre : undefined,
      djEquipment: newTalentType === "dj" ? prev.djEquipment : undefined,
      vocalistGenre:
        newTalentType === "vocalist" ? prev.vocalistGenre : undefined,
    }));

    setShowTalentModal(true);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setUserInfo((prev) => ({
      prefferences: checked
        ? [...prev.prefferences, value]
        : prev.prefferences.filter((item) => item !== value),
    }));
  };

  const handleTalentSubmit = (data: Partial<GigInputs>) => {
    // Only keep data for the current active talent type
    const filteredData = {
      ...(activeTalentType === "mc" && {
        mcType: data.mcType,
        mcLanguages: data.mcLanguages,
      }),
      ...(activeTalentType === "dj" && {
        djGenre: data.djGenre,
        djEquipment: data.djEquipment,
      }),
      ...(activeTalentType === "vocalist" && {
        vocalistGenre: data.vocalistGenre,
      }),
    };

    setGigs((prev) => ({
      ...prev,
      ...filteredData,
    }));
    setShowTalentModal(false);
  };
  console.log("mydata", gigInputs);
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateFields()) {
      setIsVisible(true);
      setEditMessage("Please fill all required fields");
      setError(true);
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
          date: gigInputs?.date,
          to: `${gigInputs.end}${gigInputs.durationto}`,
          from: `${gigInputs.start}${gigInputs.durationfrom}`,
          postedBy: user?._id,
          bussinesscat: bussinesscat,
          font: gigcustom.font,
          fontColor: gigcustom.fontColor,
          backgroundColor: gigcustom.backgroundColor,
          logo: imageUrl,
          otherTimeline: gigInputs.otherTimeline,
          gigtimeline: gigInputs.gigtimeline,
          day: gigInputs.day,
          mcType: gigInputs.mcType,
          mcLanguages: gigInputs.mcLanguages,
          djGenre: gigInputs.djGenre,
          djEquipment: gigInputs.djEquipment,
          vocalistGenre: gigInputs.vocalistGenre,
        }),
      });
      const data = await res.json();
      if (data.gigstatus === "true") {
        setEditMessage(data.message);
        setError(false);
        setIsVisible(true);
        setShow(true);
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
          bussinesscat: null,
          otherTimeline: "",
          gigtimeline: "",
          day: "",
          date: "",
        });
        setUserInfo({ prefferences: [] });
        setBussinessCategory(null);
        setFieldErrors({});
      }
      if (data.gigstatus === "false") {
        setEditMessage(data.message);
        setError(true);
        setIsVisible(true);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create gig");
    } finally {
      setIsLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (editMessage && isVisible) {
      timer = setTimeout(() => {
        setIsVisible(false);
        setEditMessage("");
      }, 4500);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [editMessage, isVisible]);

  // Component Render
  return (
    <div className="relative h-screen overflow-y-auto">
      <form
        onSubmit={onSubmit}
        className="min-h-screen bg-gray-900 px-4 py-6 pb-20 w-full md:max-w-2xl lg:max-w-3xl mx-auto"
      >
        {/* Success/Error Message */}
        {isVisible && editMessage && (
          <motion.div
            initial={{ opacity: 0, y: "-200px" }}
            exit={{
              opacity: 0,
              y: "-200px",
              transition: { duration: 0.9 },
            }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.9 },
            }}
            className="fixed top-10 p-4 rounded-md left-0 right-0 h-fit w-[90%] md:w-[80%] mx-auto z-50 flex justify-center items-center bg-zinc-800 shadow-md shadow-orange-200"
          >
            <span
              className={`flex justify-center ${
                error ? "text-red-300" : "text-green-300"
              }`}
              style={{
                fontFamily: fonts[20],
              }}
            >
              {editMessage}
            </span>
          </motion.div>
        )}

        {/* Main Form Content */}
        <div className="space-y-6">
          <h6 className="text-gray-100 font-sans text-center text-lg font-semibold">
            Enter info to create a gig
          </h6>

          {/* Business Type Selection */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="w-full md:w-[200px]">
              <select
                onChange={handleBussinessChange}
                name="durationfrom"
                value={bussinesscat || ""}
                className="w-full bg-gray-700 text-gray-100 h-[40px] rounded-lg text-sm px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              >
                <option value="" className="bg-gray-700">
                  Who do you want?
                </option>
                <option value="full">Full Band</option>
                <option value="personal">Individual</option>
                <option value="other">Create your own band</option>
                <option value="mc">Mcee</option>
                <option value="dj">Dj</option>
                <option value="vocalist">Vocalist</option>
              </select>
              {fieldErrors.bussinesscat && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.bussinesscat}
                </p>
              )}
            </div>
            {!show ? (
              <div className="relative">
                {/* Talent Details Section */}
                {(gigInputs.mcType ||
                  gigInputs.djGenre ||
                  gigInputs.vocalistGenre?.length) && (
                  <SectionContainer
                    icon={<Music size={18} />}
                    title="Talent Details"
                    action={
                      <Button
                        variant="ghost"
                        className="text-rose-400 hover:bg-neutral-700"
                        onClick={() => {
                          const type = gigInputs.mcType
                            ? "mc"
                            : gigInputs.djGenre
                            ? "dj"
                            : gigInputs.vocalistGenre?.length
                            ? "vocalist"
                            : null;
                          if (type) {
                            setActiveTalentType(type);
                            setShowTalentModal(true);
                          }
                        }}
                      >
                        <Edit size={16} className="mr-1" /> Edit
                      </Button>
                    }
                  >
                    <div className="space-y-2 ">
                      <span
                        className="absolute right-2 -top-[10px] text-[17px] font-bold text-gray-200 z-50 cursor-pointer"
                        onClick={() => setShow(true)}
                      >
                        &times;
                      </span>
                      {gigInputs.mcType && (
                        <div className="flex flex-col gap-1">
                          <div className="flex gap-2">
                            <span className="text-neutral-400">MC Type:</span>
                            <span className="text-white">
                              {gigInputs.mcType}
                            </span>
                          </div>
                          {fieldErrors.mcType && (
                            <p className="text-red-500 text-xs">
                              {fieldErrors.mcType}
                            </p>
                          )}
                        </div>
                      )}
                      {gigInputs.mcLanguages && (
                        <div className="flex flex-col gap-1">
                          <div className="flex gap-2">
                            <span className="text-neutral-400 text-sm">
                              Languages:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {gigInputs.mcLanguages.split(",").map((lang) => (
                                <Badge
                                  key={lang}
                                  variant="outline"
                                  className="text-sm"
                                >
                                  {lang.trim()}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          {fieldErrors.mcLanguages && (
                            <p className="text-red-500 text-xs">
                              {fieldErrors.mcLanguages}
                            </p>
                          )}
                        </div>
                      )}
                      {gigInputs.djGenre && (
                        <div className="flex flex-col gap-1">
                          <div className="flex gap-2">
                            <span className="text-neutral-400 text-sm">
                              DJ Genre:
                            </span>
                            <span className="text-white text-sm">
                              {gigInputs.djGenre}
                            </span>
                          </div>
                          {fieldErrors.djGenre && (
                            <p className="text-red-500 text-xs">
                              {fieldErrors.djGenre}
                            </p>
                          )}
                        </div>
                      )}
                      {gigInputs.djEquipment && (
                        <div className="flex flex-col gap-1">
                          <div className="flex gap-2">
                            <span className="text-neutral-400 text-sm">
                              DJ Equipment:
                            </span>
                            <span className="text-white text-sm">
                              {gigInputs.djEquipment}
                            </span>
                          </div>
                          {fieldErrors.djEquipment && (
                            <p className="text-red-500 text-xs">
                              {fieldErrors.djEquipment}
                            </p>
                          )}
                        </div>
                      )}
                      {gigInputs.vocalistGenre?.length && (
                        <div className="flex flex-col gap-1">
                          <div className="flex gap-2">
                            <span className="text-neutral-400">
                              Vocalist Genres:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {gigInputs.vocalistGenre.map((genre) => (
                                <Badge
                                  key={genre}
                                  variant="outline"
                                  className="text-gray-300"
                                >
                                  {genre}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          {fieldErrors.vocalistGenre && (
                            <p className="text-red-500 text-xs">
                              {fieldErrors.vocalistGenre}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </SectionContainer>
                )}
              </div>
            ) : (
              <div className="w-full flex justify-end">
                <span
                  className="text-blue-600 text-[11px] bg-gray-300 px-2 cursor-pointer  rounded-xl"
                  onClick={() => setShow(false)}
                >
                  show
                </span>
              </div>
            )}
            <div
              onClick={() => setShowCustomization(true)}
              className="cursor-pointer w-full md:w-auto"
            >
              <h1 className="text-sm text-gray-100 bg-gradient-to-r from-blue-500 to-purple-600 py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all text-center">
                Customize your Gig Card
              </h1>
            </div>
          </div>

          {/* Form Sections */}
          <div className="w-full space-y-4">
            {/* Title Information Section */}
            <div className={!secretreturn ? `space-y-4` : `space-y-4 h-[70px]`}>
              <div
                className="flex justify-between items-center w-full bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-amber-700 transition-all text-white"
                onClick={() =>
                  setshowCategories({
                    ...showCategories,
                    title: !showCategories.title,
                  })
                }
              >
                Title Information
                <FaComment size="20" className="text-gray-400" />
              </div>
              {showCategories.title && (
                <div className="flex flex-col gap-4 w-full">
                  <div className="flex items-center rounded-lg bg-gray-300 p-2">
                    <input
                      autoComplete="off"
                      onChange={handleInputChange}
                      name="secret"
                      value={gigInputs?.secret}
                      type={!secretpass ? "password" : "text"}
                      placeholder="Enter secret (valid only once)"
                      className="w-full bg-transparent text-gray-800 text-sm focus:outline-none"
                    />
                    {secretpass ? (
                      <EyeOff
                        onClick={() => setSecretPass((prev) => !prev)}
                        size="18px"
                        className="text-gray-400 cursor-pointer"
                      />
                    ) : (
                      <EyeIcon
                        onClick={() => setSecretPass((prev) => !prev)}
                        size="18px"
                        className="text-gray-400 cursor-pointer"
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <input
                      autoComplete="off"
                      onChange={handleInputChange}
                      name="title"
                      value={gigInputs?.title}
                      type="text"
                      placeholder="Enter a title"
                      className={`w-full bg-gray-300 text-gray-800 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        fieldErrors.title ? "border border-red-500" : ""
                      }`}
                    />
                    {fieldErrors.title && (
                      <p className="text-red-500 text-xs">
                        {fieldErrors.title}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {secretreturn && (
                <h6 className="text-red-500 text-sm -mt-2">{secretreturn}</h6>
              )}
            </div>

            {/* Description Information Section */}
            <div
              className="flex justify-between items-center w-full bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-amber-700 transition-all text-white"
              onClick={() =>
                setshowCategories({
                  ...showCategories,
                  description: !showCategories.description,
                })
              }
            >
              Description Information
              <InfoIcon size="20" className="text-gray-400" />
            </div>
            {showCategories.description && (
              <div className="flex flex-col gap-1">
                <Textarea
                  onChange={handleInputChange}
                  name="description"
                  value={gigInputs?.description}
                  style={{ resize: "none", height: "fit-content" }}
                  className={`min-h-[100px] bg-gray-300 text-gray-800 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    fieldErrors.description ? "border border-red-500" : ""
                  }`}
                  placeholder="Enter description (e.g., songs or vibe expected at the event/show)"
                />
                {fieldErrors.description && (
                  <p className="text-red-500 text-xs">
                    {fieldErrors.description}
                  </p>
                )}
              </div>
            )}

            {/* Business Information Section */}
            <div
              className="flex justify-between items-center w-full bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-amber-700 transition-all text-white"
              onClick={() =>
                setshowCategories({
                  ...showCategories,
                  business: !showCategories.business,
                })
              }
            >
              Business Information
              <BriefcaseConveyorBelt size="20" className="text-gray-400" />
            </div>
            {showCategories.business && (
              <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-1">
                  <input
                    autoComplete="off"
                    type="text"
                    placeholder="Enter phone number"
                    className={`w-full bg-gray-300 text-gray800 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      fieldErrors.phoneNo ? "border border-red-500" : ""
                    }`}
                    onChange={handleInputChange}
                    name="phoneNo"
                    value={gigInputs?.phoneNo}
                  />
                  {fieldErrors.phoneNo && (
                    <p className="text-red-500 text-xs">
                      {fieldErrors.phoneNo}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <input
                    autoComplete="off"
                    type="text"
                    placeholder="Enter expected price range"
                    className={`w-full bg-gray-300 text-gray-800 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      fieldErrors.price ? "border border-red-500" : ""
                    }`}
                    onChange={handleInputChange}
                    name="price"
                    value={gigInputs?.price}
                  />
                  {fieldErrors.price && (
                    <p className="text-red-500 text-xs">{fieldErrors.price}</p>
                  )}
                </div>
              </div>
            )}

            {/* Gig Timeline Information Section */}
            <div
              className="flex justify-between items-center w-full bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-amber-700 transition-all text-white"
              onClick={() =>
                setshowCategories({
                  ...showCategories,
                  gtimeline: !showCategories.gtimeline,
                })
              }
            >
              Gig Timeline Information
              <Timer size="20" className="text-gray-400" />
            </div>
            {showCategories.gtimeline && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <div className="flex flex-col gap-1">
                  <input
                    autoComplete="off"
                    type="text"
                    placeholder="Enter location"
                    className={`w-full bg-gray-300 text-gray-800 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      fieldErrors.location ? "border border-red-500" : ""
                    }`}
                    onChange={handleInputChange}
                    name="location"
                    value={gigInputs?.location}
                  />
                  {fieldErrors.location && (
                    <p className="text-red-500 text-xs">
                      {fieldErrors.location}
                    </p>
                  )}
                </div>
                <select
                  onChange={handleInputChange}
                  name="gigtimeline"
                  value={gigInputs.gigtimeline}
                  className="w-full bg-gray-300 text-gray-800 h-[40px] rounded-lg text-xs px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value=""> Gig Timeline </option>
                  <option value="once">
                    One Time(function,event,recording etc)
                  </option>
                  <option value="weekly">Every Week</option>
                  <option value="other">Other...</option>
                </select>
                {gigInputs?.gigtimeline === "other" && (
                  <div className="w-full flex justify-center items-center sm:col-span-2">
                    <input
                      autoComplete="off"
                      type="text"
                      placeholder="Enter other timeline details"
                      className="w-full bg-gray-300 text-gray-800 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={handleInputChange}
                      name="otherTimeline"
                      value={gigInputs?.otherTimeline}
                      disabled={gigInputs?.durationfrom === "once"}
                      required={gigInputs?.durationfrom === "once"}
                    />
                  </div>
                )}
                <select
                  className="w-full p-2 rounded-md bg-gray-300 text-gray-800 border-none focus:ring-0 text-xs"
                  value={gigInputs?.day}
                  onChange={handleInputChange}
                  name="day"
                >
                  {days().map((i) => (
                    <option key={i?.id} value={i.val}>
                      {i?.name}
                    </option>
                  ))}
                </select>
                {gigInputs?.gigtimeline === "once" && (
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDate}
                    minDate={minDate}
                    maxDate={maxDate}
                    className="w-full bg-gray-300 text-gray-800 p-2 rounded-lg"
                    placeholderText="Select date"
                    isClearable
                  />
                )}
              </div>
            )}

            {/* Band Setup Section */}
            {bussinesscat === "other" && (
              <h6
                className="flex justify-between items-center w-full bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-amber-700 transition-all text-white"
                onClick={() =>
                  setshowCategories({
                    ...showCategories,
                    othergig: !showCategories.othergig,
                  })
                }
              >
                Choose the setup of the show
                {showCategories.othergig ? (
                  <ArrowDown size="20" className="text-gray-400" />
                ) : (
                  <ArrowUp size="20" className="text-gray-400" />
                )}
              </h6>
            )}

            {/* Individual Instrument Selection */}
            {bussinesscat === "personal" && (
              <select
                onChange={handleInputChange}
                name="category"
                value={gigInputs?.category}
                className="w-full bg-gray-300 text-gray-800 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select instrument</option>
                <option value="piano">Piano</option>
                <option value="guitar">Guitar</option>
                <option value="bass">Bass Guitar</option>
                <option value="saxophone">Saxophone</option>
                <option value="violin">Violin</option>
                <option value="ukulele">Ukulele</option>
                <option value="harp">Harp</option>
                <option value="xylophone">Xylophone</option>
                <option value="cello">Cello</option>
                <option value="percussion">Percussion</option>
              </select>
            )}

            {/* Band Member Selection */}
            {!showCategories?.othergig && bussinesscat === "other" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-gray-300 p-4 rounded-lg">
                {["vocalist", "piano", "sax", "guitar", "drums", "bass"].map(
                  (item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <input
                        onChange={handleChange}
                        type="checkbox"
                        id={item}
                        name={item}
                        value={item}
                        checked={userinfo.prefferences.includes(item)}
                        className="accent-blue-500"
                      />
                      <label
                        htmlFor={item}
                        className="text-gray-800 text-sm capitalize"
                      >
                        {item}
                      </label>
                    </div>
                  )
                )}
              </div>
            )}

            {/* Duration Selection */}
            {showduration ? (
              <div className="bg-gray-700 p-4 rounded-lg relative">
                <div
                  className="text-white absolute right-2 top-2 text-xl cursor-pointer"
                  onClick={() => setshowduration(false)}
                >
                  &times;
                </div>
                <Box className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                    <h6 className="text-gray-100 text-sm w-[50px]">From:</h6>
                    <input
                      autoComplete="off"
                      type="text"
                      placeholder="Time (e.g., 10 means 10:00)"
                      className="w-full sm:w-[120px] bg-gray-200 text-gray-800 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={handleInputChange}
                      name="start"
                      value={gigInputs?.start}
                    />
                    <select
                      onChange={handleInputChange}
                      name="durationfrom"
                      value={gigInputs?.durationfrom}
                      className="w-full sm:w-[60px] bg-gray-200 text-gray-800 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pm">PM</option>
                      <option value="am">AM</option>
                    </select>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                    <h6 className="text-gray-100 text-sm w-[50px]">To:</h6>
                    <input
                      autoComplete="off"
                      type="text"
                      placeholder="Time (e.g., 10 means 10:00)"
                      className="w-full sm:w-[120px] bg-gray-200 text-gray-800 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={handleInputChange}
                      name="end"
                      value={gigInputs?.end}
                    />
                    <select
                      onChange={handleInputChange}
                      name="durationto"
                      value={gigInputs?.durationto}
                      className="w-full sm:w-[60px] bg-gray-300 text-gray-800 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pm">PM</option>
                      <option value="am">AM</option>
                    </select>
                  </div>
                </Box>
              </div>
            ) : (
              <Box
                onClick={() => setshowduration(true)}
                className="flex justify-between items-center w-full bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition-all"
              >
                <h6 className="text-gray-100 text-sm">Enter Duration</h6>
                <ArrowDown01Icon size="20" className="text-gray-400" />
              </Box>
            )}

            {/* Submit Button */}
            <div className="w-full flex justify-center mt-6 mb-10">
              <Button
                variant="destructive"
                type="submit"
                className="w-full sm:w-[60%] h-[40px] text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all"
                disabled={isLoading}
              >
                {!isLoading ? (
                  "Create Gig"
                ) : (
                  <CircularProgress size="16px" sx={{ color: "white" }} />
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Modals */}
      <div className="h-full w-full relative">
        {showcustomization && (
          <GigCustomization
            customization={gigcustom}
            setCustomization={setGigCustom}
            closeModal={() => setShowCustomization(false)}
            logo={imageUrl}
            handleFileChange={handleFileChange}
            isUploading={isUploading}
          />
        )}
      </div>

      {activeTalentType && (
        <TalentModal
          isOpen={showTalentModal}
          onClose={() => setShowTalentModal(false)}
          talentType={activeTalentType}
          onSubmit={handleTalentSubmit}
          initialData={{
            ...(activeTalentType === "mc" && {
              mcType: gigInputs.mcType,
              mcLanguages: gigInputs.mcLanguages,
            }),
            ...(activeTalentType === "dj" && {
              djGenre: gigInputs.djGenre,
              djEquipment: gigInputs.djEquipment,
            }),
            ...(activeTalentType === "vocalist" && {
              vocalistGenre: gigInputs.vocalistGenre,
            }),
          }}
          errors={fieldErrors}
          validateField={(field, value) => {
            // For the modal, we only validate the field value without businesscat
            switch (field) {
              case "mcType":
              case "mcLanguages":
                return !value ? `${field} is required` : "";
              case "djGenre":
              case "djEquipment":
                return !value ? `${field} is required` : "";
              case "vocalistGenre":
                return !value || (Array.isArray(value) && value.length === 0)
                  ? "At least one genre is required"
                  : "";
              default:
                return "";
            }
          }}
        />
      )}
    </div>
  );
};

// Reusable Components
const SectionContainer = ({
  icon,
  title,
  children,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) => (
  <div className="bg-neutral-800/50 rounded-lg p-4">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-bold text-white flex items-center gap-2">
        {icon} {title}
      </h2>
      {action}
    </div>
    {children}
  </div>
);

const TextInput = ({
  label,
  value,
  onChange,
  placeholder = "",
  disabled = false,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}) => (
  <div className={className}>
    <Label className="text-neutral-400 text-[12px]">{label}</Label>
    <Input
      className={`bg-neutral-800 border-neutral-700 text-white mt-1 text-[12px] ${
        disabled ? "opacity-70" : ""
      } ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
    />
  </div>
);

const TalentModal = ({
  isOpen,
  onClose,
  talentType,
  onSubmit,
  initialData,
  validateField, // Now only expects field and value
}: TalentModalProps) => {
  const [localData, setLocalData] = useState<Partial<GigInputs>>(
    initialData || {}
  );
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  const handleFieldChange = <K extends GigField>(
    field: K,
    value: FieldValue<K>
  ) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
    const error = validateField(field, value);
    setLocalErrors((prev) => ({ ...prev, [field]: error }));
  };
  const handleVocalistGenreChange = (genre: string) => {
    const updatedGenres = localData.vocalistGenre?.includes(genre)
      ? localData.vocalistGenre.filter((g) => g !== genre)
      : [...(localData.vocalistGenre || []), genre];

    setLocalData((prev) => ({
      ...prev,
      vocalistGenre: updatedGenres,
    }));

    const error = validateField("vocalistGenre", updatedGenres);
    setLocalErrors((prev) => ({
      ...prev,
      vocalistGenre: error,
    }));
  };
  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    if (talentType === "mc") {
      newErrors.mcType = validateField("mcType", localData.mcType as string);
      newErrors.mcLanguages = validateField(
        "mcLanguages",
        localData.mcLanguages as string
      );
    } else if (talentType === "dj") {
      newErrors.djGenre = validateField("djGenre", localData.djGenre as string);
      newErrors.djEquipment = validateField(
        "djEquipment",
        localData.djEquipment as string
      );
    } else if (talentType === "vocalist") {
      newErrors.vocalistGenre = validateField(
        "vocalistGenre",
        localData.vocalistGenre as [string]
      );
    }

    const filteredErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([x, value]) => {
        console.log(x);
        return value;
      })
    );

    setLocalErrors(filteredErrors);

    if (Object.keys(filteredErrors).length === 0) {
      onSubmit(localData);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${talentType.toUpperCase()} Details`}
    >
      <div className="space-y-4">
        {talentType === "mc" && (
          <>
            <div className="flex flex-col gap-1">
              <TextInput
                label="MC Type"
                value={localData.mcType || ""}
                onChange={(value) => handleFieldChange("mcType", value)}
                className={localErrors.mcType ? "border-red-500" : ""}
                placeholder="Wedding/Co-orporate/Birthdays/Eventss"
              />
              {localErrors.mcType && (
                <p className="text-red-500 text-xs">{localErrors.mcType}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <TextInput
                label="Languages (comma separated)"
                value={localData.mcLanguages || ""}
                onChange={(value) => handleFieldChange("mcLanguages", value)}
                className={localErrors.mcLanguages ? "border-red-500" : ""}
              />
              {localErrors.mcLanguages && (
                <p className="text-red-500 text-xs">
                  {localErrors.mcLanguages}
                </p>
              )}
            </div>
          </>
        )}

        {talentType === "dj" && (
          <>
            <div className="flex flex-col gap-1">
              <TextInput
                label="DJ Genre"
                value={localData.djGenre || ""}
                onChange={(value) => handleFieldChange("djGenre", value)}
                className={localErrors.djGenre ? "border-red-500" : ""}
              />
              {localErrors.djGenre && (
                <p className="text-red-500 text-xs">{localErrors.djGenre}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <TextInput
                label="DJ Equipment"
                value={localData.djEquipment || ""}
                onChange={(value) => handleFieldChange("djEquipment", value)}
                className={localErrors.djEquipment ? "border-red-500" : ""}
              />
              {localErrors.djEquipment && (
                <p className="text-red-500 text-xs">
                  {localErrors.djEquipment}
                </p>
              )}
            </div>
          </>
        )}

        {talentType === "vocalist" && (
          <div className="space-y-2">
            <Label className="text-neutral-400">Vocalist Genres</Label>
            <div className="flex flex-wrap gap-2">
              {["Pop", "R&B", "Gospel", "Jazz", "Afrobeat"].map((genre) => (
                <Badge
                  key={genre}
                  variant={
                    localData.vocalistGenre?.includes(genre)
                      ? "secondary"
                      : "outline"
                  }
                  className="cursor-pointer text-red-500"
                  onClick={() => handleVocalistGenreChange(genre)}
                >
                  {genre}
                </Badge>
              ))}
            </div>
            {localErrors.vocalistGenre && (
              <p className="text-red-500 text-xs">
                {localErrors.vocalistGenre}
              </p>
            )}
          </div>
        )}
      </div>
      <ModalActions onCancel={onClose} onConfirm={handleSubmit} />
    </Modal>
  );
};

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose?: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent scrolling
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  // Close modal when clicking outside
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose?.();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={handleOutsideClick}
        >
          {/* Overlay with subtle gradient */}
          <div className="fixed inset-0 bg-gradient-to-br from-black/80 to-purple-900/20" />

          <motion.div
            ref={modalRef}
            initial={{ y: 20, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
            className="relative w-full max-w-md rounded-xl bg-neutral-900 border border-neutral-700/50 shadow-2xl overflow-hidden"
          >
            {/* Header with close button */}
            <div className="flex items-center justify-between p-5 border-b border-neutral-800">
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-white"
                  aria-label="Close modal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>

            {/* Content */}
            <div className="p-5 text-neutral-300">{children}</div>

            {/* Subtle glow effect */}
            <div className="absolute inset-0 pointer-events-none border border-transparent group-hover:border-purple-500/30 transition-all duration-500 rounded-xl" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ModalActions = ({
  onCancel,
  onConfirm,
  confirmText = "Confirm",
}: {
  onCancel: () => void;
  onConfirm: () => void;
  confirmText?: string;
}) => (
  <div className="flex justify-end gap-2 mt-6">
    <Button
      variant="outline"
      className="text-black border-neutral-600"
      onClick={onCancel}
    >
      Cancel
    </Button>
    <Button className="bg-rose-600 hover:bg-rose-700" onClick={onConfirm}>
      {confirmText}
    </Button>
  </div>
);

export default CreateGig;
