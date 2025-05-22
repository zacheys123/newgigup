"use client";
import { Textarea } from "flowbite-react";
import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
} from "react";
import { Button } from "../ui/button";
import {
  ArrowDown,
  ArrowDown01Icon,
  ArrowUp,
  Briefcase,
  Calendar,
  Clock,
  Disc,
  DollarSign,
  Edit,
  EyeIcon,
  EyeOff,
  FileText,
  Guitar,
  Info,
  Lock,
  MapPin,
  Mic,
  Music,
  Phone,
  Type,
  Users,
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
import { Badge } from "../ui/badge";

import {
  BusinessCategory,
  CategoryVisibility,
  CustomProps,
  FieldValue,
  GigField,
  GigInputs,
  TalentType,
  UserInfo,
} from "./create/types";
import TalentModal from "./create/TalentModal";
import SchedulerComponent from "./create/SchedulerComponent";
import { cn } from "@/lib/utils";
import { mutate } from "swr";
import { useNetworkStatus } from "@/hooks/useNetwork";
import {
  clearDraftFromLocal,
  getDraftFromLocal,
  saveDraftToLocal,
} from "@/lib/storage";
import { OfflineNotification } from "../offline/OfflineNotification";

const CreateGig = () => {
  // State Hooks
  const isOnline = useNetworkStatus();

  const [hasOfflineDraft, setHasOfflineDraft] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [secretpass, setSecretPass] = useState<boolean>(false);
  const [showcustomization, setShowCustomization] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [imageUrl, setUrl] = useState<string>("");
  const [fileUrl, setFileUrl] = useState<string>("");
  const {
    setRefetchData,
    isSchedulerOpen,
    setisSchedulerOpen,
    showOfflineNotification,
    setShowOfflineNotification,
  } = useStore();
  const { user } = useCurrentUser();
  const [activeTalentType, setActiveTalentType] = useState<TalentType>(null);
  const [showTalentModal, setShowTalentModal] = useState(false);
  const [gigcustom, setGigCustom] = useState<CustomProps>({
    fontColor: "",
    font: "",
    backgroundColor: "",
  });

  useEffect(() => {
    const savedDraft = getDraftFromLocal();
    if (savedDraft) {
      setHasOfflineDraft(true);
      // Optionally: Auto-load draft with user confirmation
    }
  }, []);
  useEffect(() => {
    if (!isOnline) {
      setShowOfflineNotification(true);
    }
  }, [isOnline]);
  // const [secretreturn] = useState<string>("");
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
    pricerange: "",
    currency: "KES",
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

  const [schedulingProcedure, setSchedulingProcedure] = useState({
    type: "",
    date: new Date(),
  });

  // default to new Date if date is undefined
  const getSchedulingData = (type: string, date?: Date) => {
    setSchedulingProcedure({
      type,
      date: date ?? new Date(),
    });
  };

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
        user?.user,
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
      setError(true);
      return;
    }

    try {
      setIsLoading(true);
      if (!isOnline) {
        saveDraftToLocal(gigInputs);
        setHasOfflineDraft(true);
        toast.warning("Gig saved locally - will submit when back online");
        return;
      }
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
          postedBy: user?.user?._id,
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
          pricerange: gigInputs.pricerange,
          currency: gigInputs.currency,
          isPending:
            schedulingProcedure.type === "automatic"
              ? true
              : schedulingProcedure.type === "regular"
              ? true
              : schedulingProcedure.type === "create"
              ? false
              : false,
          scheduleDate: schedulingProcedure.date,
        }),
      });
      const data = await res.json();
      console.log(data);
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
          pricerange: "",
          currency: "",
        });
        setUserInfo({ prefferences: [] });
        setBussinessCategory(null);
        setFieldErrors({});
        mutate("/api/gigs/getgigs");
      }
      if (data.gigstatus === "false") {
        setEditMessage(data.message + " try again later");
        setError(true);
        setIsVisible(true);
      }
    } catch (error) {
      // In your form submission error handling
      console.log(error);
      if (!isOnline) {
        setEditMessage("Saved locally - will submit when back online");
        setError(false); // This is a "soft" error
      } else {
        setEditMessage("Failed to create gig - please try again");
        setError(true);
      }
      setIsVisible(true);
    } finally {
      setIsLoading(false);
    }
  };
  console.log(typeof gigInputs.price);
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

  // Types (keep your existing types)

  // State Hooks (keep your existing state)

  // Animation variants
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Adjust variants for mobile
  const sectionVariants = isMobile
    ? {
        hidden: { opacity: 0, y: 10 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.3,
            ease: "easeOut",
          },
        },
      }
    : {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: "easeOut",
          },
        },
      };

  const inputVariants = {
    focus: {
      scale: 1.02,
      boxShadow: "0 0 0 2px rgba(99, 102, 241, 0.5)",
    },
  };

  useEffect(() => {
    const handleOnline = async () => {
      const draft = getDraftFromLocal();
      if (draft && isOnline) {
        try {
          setIsLoading(true);
          const res = await fetch(`/api/gigs/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(draft),
          });

          if (res.ok) {
            clearDraftFromLocal();
            setHasOfflineDraft(false);
            toast.success("Offline gig submitted successfully!");
          }
        } catch (error) {
          console.error("Sync failed:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [isOnline]);
  useEffect(() => {
    if (!isOnline && showOfflineNotification) {
      const timer = setTimeout(() => {
        setShowOfflineNotification(false);
      }, 5000); // Auto-dismiss after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [isOnline, showOfflineNotification]);
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Add near the top of your return */}

      {showOfflineNotification && !isOnline && (
        <OfflineNotification
          onClose={() => setShowOfflineNotification(false)}
        />
      )}
      {/* Add this near your form buttons */}
      {hasOfflineDraft && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-3 mb-4 flex items-center gap-3"
        >
          <Info className="text-amber-300" size={18} />
          <div>
            <p className="text-amber-100 text-sm font-medium">
              You have an unsaved gig draft
            </p>
            <div className="flex gap-2 mt-1">
              <button
                onClick={async () => {
                  const draft = getDraftFromLocal();
                  if (draft) {
                    // Implement draft loading logic
                    toast.success("Draft loaded");
                  }
                }}
                className="text-xs bg-amber-600/50 hover:bg-amber-600/70 text-white px-2 py-1 rounded"
              >
                Load Draft
              </button>
              <button
                onClick={() => {
                  clearDraftFromLocal();
                  setHasOfflineDraft(false);
                }}
                className="text-xs bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 px-2 py-1 rounded"
              >
                Discard
              </button>
            </div>
          </div>
        </motion.div>
      )}
      <AnimatePresence>
        {isVisible && editMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={cn(
              "fixed top-6 left-1/2 transform -translate-x-1/2 z-50 rounded-lg px-6 py-3 shadow-lg",
              error ? "bg-red-500/90" : "bg-emerald-500/90"
            )}
          >
            <motion.span
              className="text-white font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {editMessage}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="max-w-4xl mx-auto px-4 py-3 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className=" mb-2 md:mb-10 text-center -mt-4"
        >
          <p className="text-gray-400 font-light">Create Your Gig</p>
        </motion.div>{" "}
        <motion.form
          className="space-y-2 md:space-y-10 flex-col"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {/* Business Type Section */}
          <motion.div
            variants={sectionVariants}
            className="space-y-2 md:space-y-4"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Who do you want?
                </label>
                <select
                  onChange={handleBussinessChange}
                  value={bussinesscat || ""}
                  className="w-full text-sm sm:text-base bg-gray-700/50 border border-gray-600 text-gray-100 h-12 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  {" "}
                  <option value="" className="bg-gray-800">
                    Select category
                  </option>
                  <option value="full" className="bg-gray-800">
                    Full Band
                  </option>
                  <option value="personal" className="bg-gray-800">
                    Individual
                  </option>
                  <option value="other" className="bg-gray-800">
                    Create your own band
                  </option>
                  <option value="mc" className="bg-gray-800">
                    MC
                  </option>
                  <option value="dj" className="bg-gray-800">
                    DJ
                  </option>
                  <option value="vocalist" className="bg-gray-800">
                    Vocalist
                  </option>
                </select>
              </div>
            </div>

            {/* Talent Preview */}

            {!show &&
              (gigInputs.mcType ||
                gigInputs.djGenre ||
                gigInputs.vocalistGenre?.length) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 relative"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <Music className="text-amber-400" size={18} />
                      <h3 className="text-gray-200 font-medium">
                        Talent Details
                      </h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-amber-400 hover:bg-gray-700/50"
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
                      <Edit size={14} className="mr-1" /> Edit
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {gigInputs.mcType && (
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-2 items-center">
                          <span className="text-gray-400 text-sm flex items-center gap-1">
                            <Mic size={14} /> MC Type:
                          </span>
                          <Badge
                            variant="outline"
                            className="text-amber-400 border-amber-400/30"
                          >
                            {gigInputs.mcType}
                          </Badge>
                        </div>
                      </div>
                    )}

                    {gigInputs.djGenre && (
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-2 items-center">
                          <span className="text-gray-400 text-sm flex items-center gap-1">
                            <Disc size={14} /> DJ Genre:
                          </span>
                          <Badge
                            variant="outline"
                            className="text-blue-400 border-blue-400/30"
                          >
                            {gigInputs.djGenre}
                          </Badge>
                        </div>
                      </div>
                    )}

                    {gigInputs.vocalistGenre?.length && (
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-2 items-center">
                          <span className="text-gray-400 text-sm flex items-center gap-1">
                            <Mic size={14} /> Vocalist Genres:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {gigInputs.vocalistGenre.map((genre) => (
                              <Badge
                                key={genre}
                                variant="outline"
                                className="text-purple-400 border-purple-400/30"
                              >
                                {genre}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <span
                    className="text-white text-[16px] absolute right-3 top-1 cursor-pointer"
                    onClick={() => setShow(true)}
                  >
                    &times;
                  </span>
                </motion.div>
              )}
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full md:w-auto  mt-0 flex justify-between item"
          >
            <Button
              onClick={() => setShowCustomization(true)}
              type="button"
              variant="outline"
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/30 text-white hover:bg-purple-700/40 hover:border-purple-400/50 transition-all"
            >
              <span className="text-xs md:text-sm">Customize Gig Card</span>
            </Button>
            {show && (
              <div
                className="p-2 h-[20px] text-neutral-400 text-[11px] bg-gray-200 w-fit flex justify-center items-center rounded-xl cursor-pointer"
                onClick={() => setShow(false)}
              >
                Show Data
              </div>
            )}
          </motion.div>
          {/* Title Section */}
          <motion.div variants={sectionVariants}>
            <div
              className="flex items-center justify-between p-4 bg-gray-800/50 rounded-t-lg border border-gray-700/50 cursor-pointer hover:bg-gray-700/30 transition-all"
              onClick={() =>
                setshowCategories({
                  ...showCategories,
                  title: !showCategories.title,
                })
              }
            >
              <div className="flex items-center gap-3">
                <Type className="text-amber-400" size={18} />
                <h3 className="text-gray-200 font-medium">Title Information</h3>
              </div>
              <FaComment className="text-gray-400" size={16} />
            </div>

            <AnimatePresence>
              {showCategories.title && (
                <motion.div
                  initial={{ maxHeight: 0, opacity: 0 }}
                  animate={{
                    maxHeight: 200, // Enough for title fields
                    opacity: 1,
                  }}
                  exit={{ maxHeight: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden bg-gray-800/30 rounded-b-lg border border-gray-700/50 border-t-0"
                >
                  <div className="p-4 space-y-4">
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={16}
                      />
                      <input
                        onChange={handleInputChange}
                        name="secret"
                        value={gigInputs?.secret}
                        type={!secretpass ? "password" : "text"}
                        placeholder="Enter secret passphrase (optional)"
                        className="w-full pl-10 pr-10 bg-gray-700/50 text-gray-100 h-12 title rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setSecretPass(!secretpass)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {secretpass ? (
                          <EyeOff size={18} />
                        ) : (
                          <EyeIcon size={18} />
                        )}
                      </button>
                    </div>

                    <div>
                      <motion.input
                        variants={inputVariants}
                        whileFocus="focus"
                        onChange={handleInputChange}
                        name="title"
                        value={gigInputs?.title}
                        type="text"
                        placeholder="Enter a captivating title for your gig"
                        className={cn(
                          "w-full bg-gray-700/50 text-gray-100 h-12 title rounded-lg border border-gray-600 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all",
                          fieldErrors.title
                            ? "border-red-500/50 focus:ring-red-500/50"
                            : ""
                        )}
                      />
                      {fieldErrors.title && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-xs mt-1 pl-2"
                        >
                          {fieldErrors.title}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Description Section */}
          <motion.div variants={sectionVariants}>
            <div
              className="flex items-center justify-between p-4 bg-gray-800/50 rounded-t-lg border border-gray-700/50 cursor-pointer hover:bg-gray-700/30 transition-all"
              onClick={() =>
                setshowCategories({
                  ...showCategories,
                  description: !showCategories.description,
                })
              }
            >
              <div className="flex items-center gap-3">
                <FileText className="text-amber-400" size={18} />
                <h3 className="text-gray-200 font-medium">Description</h3>
              </div>
              <Info className="text-gray-400" size={16} />
            </div>

            <AnimatePresence>
              {showCategories.description && (
                <motion.div
                  initial={{ maxHeight: 0, opacity: 0 }}
                  animate={{
                    maxHeight: 300, // Larger for textarea
                    opacity: 1,
                  }}
                  exit={{ maxHeight: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden bg-gray-800/30 rounded-b-lg border border-gray-700/50 border-t-0"
                >
                  <div className="p-4">
                    <motion.div variants={inputVariants} whileFocus="focus">
                      <Textarea
                        onChange={handleInputChange}
                        name="description"
                        value={gigInputs?.description}
                        className={cn(
                          "w-full bg-gray-700/50 text-gray-100 min-h-[120px] rounded-lg border border-gray-600 p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all",
                          fieldErrors.description
                            ? "border-red-500/50 focus:ring-red-500/50"
                            : ""
                        )}
                        placeholder="Describe your gig in detail (e.g., type of music, event vibe, special requirements)"
                      />
                      {fieldErrors.description && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-xs mt-1 pl-2"
                        >
                          {fieldErrors.description}
                        </motion.p>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Business Information Section */}
          <motion.div variants={sectionVariants}>
            <div
              className="flex items-center justify-between p-4 bg-gray-800/50 rounded-t-lg border border-gray-700/50 cursor-pointer hover:bg-gray-700/30 transition-all"
              onClick={() =>
                setshowCategories({
                  ...showCategories,
                  business: !showCategories.business,
                })
              }
            >
              <div className="flex items-center gap-3">
                <Briefcase className="text-amber-400" size={18} />
                <h3 className="text-gray-200 font-medium">
                  Business Information
                </h3>
              </div>
              <Info className="text-gray-400" size={16} />
            </div>

            <AnimatePresence>
              {showCategories.business && (
                <motion.div
                  initial={{ maxHeight: 0, opacity: 0 }}
                  animate={{
                    maxHeight: 240, // Largest section
                    opacity: 1,
                  }}
                  exit={{ maxHeight: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-y-auto bg-gray-800/30 rounded-b-lg border border-gray-700/50 border-t-0"
                >
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Contact Information
                      </label>
                      <div className="flex items-center bg-gray-700/50 rounded-lg border border-gray-600 px-3">
                        <Phone className="text-gray-400 mr-2" size={16} />
                        <motion.input
                          variants={inputVariants}
                          whileFocus="focus"
                          type="text"
                          placeholder="Your phone number"
                          className={cn(
                            "w-full bg-transparent text-gray-100 h-12 focus:outline-none",
                            fieldErrors.phoneNo ? "border-red-500/50" : ""
                          )}
                          onChange={handleInputChange}
                          name="phoneNo"
                          value={gigInputs?.phoneNo}
                        />
                      </div>
                      {fieldErrors.phoneNo && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-xs mt-1 pl-2"
                        >
                          {fieldErrors.phoneNo}
                        </motion.p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="col-span-1">
                        <label className="block text-sm text-gray-400 mb-1">
                          Currency
                        </label>
                        <select
                          onChange={(e) => {
                            setGigs((prev) => ({
                              ...prev,
                              currency: e.target.value,
                            }));
                          }}
                          value={gigInputs.currency || "USD"}
                          className="w-full bg-gray-700/50 text-gray-100 h-12 title rounded-lg border border-gray-600 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="KES">KES (KSh)</option>
                          <option value="NGN">NGN (₦)</option>
                        </select>
                      </div>

                      <div className="col-span-1">
                        <label className="block text-sm text-gray-400 mb-1">
                          Price
                        </label>
                        <div className="relative">
                          <DollarSign
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={16}
                          />
                          <motion.input
                            variants={inputVariants}
                            whileFocus="focus"
                            type="number"
                            placeholder="Amount"
                            className={cn(
                              "w-full bg-gray-700/50 text-gray-100 h-12 title rounded-lg border border-gray-600 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent",
                              fieldErrors.price
                                ? "border-red-500/50 focus:ring-red-500/50"
                                : ""
                            )}
                            onChange={handleInputChange}
                            name="price"
                            value={gigInputs?.price}
                            min="0"
                          />
                        </div>
                      </div>

                      <div className="col-span-1">
                        <label className="block text-sm text-gray-400 mb-1">
                          Price Range
                        </label>
                        <select
                          onChange={handleInputChange}
                          name="pricerange"
                          value={gigInputs?.pricerange}
                          className="w-full bg-gray-700/50 text-gray-100 h-12 title rounded-lg border border-gray-600 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                          <option value="0">Select range</option>
                          <option value="hundreds">Hundreds (00)</option>
                          <option value="thousands">Thousands (000)</option>
                          <option value="tensofthousands">
                            Tens of thousands (0000)
                          </option>
                          <option value="hundredsofthousands">
                            Hundreds of thousands (00000)
                          </option>
                          <option value="millions">Millions (000000)</option>
                        </select>
                      </div>
                    </div>

                    {(gigInputs?.price || gigInputs?.pricerange !== "0") && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-gray-700/20 rounded-lg p-3 border border-gray-600/30"
                      >
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <span className="font-medium">Estimated Price:</span>
                          <span>
                            {gigInputs?.price &&
                            gigInputs?.pricerange !== "0" ? (
                              <>
                                {gigInputs.currency === "USD" && "$"}
                                {gigInputs.currency === "EUR" && "€"}
                                {gigInputs.currency === "GBP" && "£"}
                                {gigInputs.currency === "KES" && "KSh"}
                                {gigInputs.currency === "NGN" && "₦"}
                                {gigInputs.price} - {gigInputs.pricerange}
                              </>
                            ) : gigInputs?.price ? (
                              <>
                                Fixed price:
                                {gigInputs.currency === "USD" && "$"}
                                {gigInputs.currency === "EUR" && "€"}
                                {gigInputs.currency === "GBP" && "£"}
                                {gigInputs.currency === "KES" && "KSh"}
                                {gigInputs.currency === "NGN" && "₦"}
                                {gigInputs.price}
                              </>
                            ) : (
                              <span>
                                Price magnitude: {gigInputs.pricerange}
                              </span>
                            )}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Gig Timeline Section */}
          <motion.div variants={sectionVariants}>
            <div
              className="flex items-center justify-between p-4 bg-gray-800/50 rounded-t-lg border border-gray-700/50 cursor-pointer hover:bg-gray-700/30 transition-all"
              onClick={() =>
                setshowCategories({
                  ...showCategories,
                  gtimeline: !showCategories.gtimeline,
                })
              }
            >
              <div className="flex items-center gap-3">
                <Clock className="text-amber-400" size={18} />
                <h3 className="text-gray-200 font-medium">Gig Timeline</h3>
              </div>
              <Calendar className="text-gray-400" size={16} />
            </div>

            <AnimatePresence>
              {showCategories.gtimeline && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: 200, // Largest section
                    opacity: 1,
                  }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-y-scroll bg-gray-800/30 rounded-b-lg border border-gray-700/50 border-t-0"
                >
                  <div className="p-4 space-y-4">
                    <div className="flex items-center bg-gray-700/50 rounded-lg border border-gray-600 px-3">
                      <MapPin className="text-gray-400 mr-2" size={16} />
                      <motion.input
                        variants={inputVariants}
                        whileFocus="focus"
                        type="text"
                        placeholder="Location or venue"
                        className={cn(
                          "w-full bg-transparent text-gray-100 h-12 focus:outline-none",
                          fieldErrors.location ? "border-red-500/50" : ""
                        )}
                        onChange={handleInputChange}
                        name="location"
                        value={gigInputs?.location}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          Gig Type
                        </label>
                        <select
                          onChange={handleInputChange}
                          name="gigtimeline"
                          value={gigInputs.gigtimeline}
                          className="w-full bg-gray-700/50 text-gray-100 h-12 title rounded-lg border border-gray-600 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                          <option value="">Select timeline</option>
                          <option value="once">One-time event</option>
                          <option value="weekly">Weekly</option>
                          <option value="other">Other...</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          Day of Week
                        </label>
                        <select
                          className="w-full bg-gray-700/50 text-gray-100 h-12 title rounded-lg border border-gray-600 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          value={gigInputs?.day}
                          onChange={handleInputChange}
                          name="day"
                        >
                          {days().map((i) => (
                            <option
                              key={i?.id}
                              value={i.val}
                              className="bg-gray-800"
                            >
                              {i?.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {gigInputs?.gigtimeline === "other" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <input
                          type="text"
                          placeholder="Describe your custom timeline info"
                          className="w-full bg-gray-700/50 text-gray-100 h-12 title rounded-lg border border-gray-600 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          onChange={handleInputChange}
                          name="otherTimeline"
                          value={gigInputs?.otherTimeline}
                        />
                      </motion.div>
                    )}

                    {gigInputs?.gigtimeline === "once" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <label className="block text-sm text-gray-400 mb-1">
                          Event Date
                        </label>
                        <DatePicker
                          selected={selectedDate}
                          onChange={handleDate}
                          minDate={minDate}
                          maxDate={maxDate}
                          className="w-full bg-gray-700/50 text-gray-100 h-12 title rounded-lg border border-gray-600 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholderText="Select date"
                          isClearable
                        />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Duration Section */}
          <motion.div variants={sectionVariants}>
            {showduration ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-gray-200 font-medium flex items-center gap-2">
                      <Clock className="text-amber-400" size={18} />
                      Set Duration
                    </h3>
                    <button
                      onClick={() => setshowduration(false)}
                      className="text-gray-400 hover:text-gray-200 transition-colors"
                    >
                      &times;
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Start Time
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Time (e.g., 10)"
                          className="w-full bg-gray-700/50 text-gray-100 h-12 title rounded-lg border border-gray-600 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          onChange={handleInputChange}
                          name="start"
                          value={gigInputs?.start}
                        />
                        <select
                          onChange={handleInputChange}
                          name="durationfrom"
                          value={gigInputs?.durationfrom}
                          className="w-20 bg-gray-700/50 text-gray-100 h-12 title rounded-lg border border-gray-600 px-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                          <option value="pm">PM</option>
                          <option value="am">AM</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        End Time
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Time (e.g., 10)"
                          className="w-full bg-gray-700/50 text-gray-100 h-12 title rounded-lg border border-gray-600 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          onChange={handleInputChange}
                          name="end"
                          value={gigInputs?.end}
                        />
                        <select
                          onChange={handleInputChange}
                          name="durationto"
                          value={gigInputs?.durationto}
                          className="w-20 bg-gray-700/50 text-gray-100 h-12 title rounded-lg border border-gray-600 px-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                          <option value="pm">PM</option>
                          <option value="am">AM</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div
                onClick={() => setshowduration(true)}
                className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 cursor-pointer hover:bg-gray-700/30 transition-all"
              >
                <h3 className="text-gray-200 font-medium flex items-center gap-2">
                  <Clock className="text-amber-400" size={18} />
                  Add Duration
                </h3>
                <ArrowDown01Icon className="text-gray-400" size={18} />
              </div>
            )}
          </motion.div>
          {/* Band Setup Section */}
          {bussinesscat === "other" && (
            <motion.div variants={sectionVariants}>
              <div
                className="flex justify-between items-center p-4 bg-gray-800/50 rounded-t-lg border border-gray-700/50 cursor-pointer hover:bg-gray-700/30 transition-all"
                onClick={() =>
                  setshowCategories({
                    ...showCategories,
                    othergig: !showCategories.othergig,
                  })
                }
              >
                <h3 className="text-gray-200 font-medium flex items-center gap-2">
                  <Users className="text-amber-400" size={18} />
                  Band Setup
                </h3>
                {showCategories.othergig ? (
                  <ArrowDown className="text-gray-400" size={18} />
                ) : (
                  <ArrowUp className="text-gray-400" size={18} />
                )}
              </div>

              <AnimatePresence>
                {!showCategories.othergig && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: 200, // Largest section
                      opacity: 1,
                    }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden bg-gray-800/30 rounded-b-lg border border-gray-700/50 border-t-0"
                  >
                    <div className="p-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {[
                          "vocalist",
                          "piano",
                          "sax",
                          "guitar",
                          "drums",
                          "bass",
                        ].map((item) => (
                          <motion.div
                            key={item}
                            whileHover={{ scale: 1.03 }}
                            className="flex items-center space-x-2 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg p-2 transition-colors"
                          >
                            <input
                              onChange={handleChange}
                              type="checkbox"
                              id={item}
                              name={item}
                              value={item}
                              checked={userinfo.prefferences.includes(item)}
                              className="accent-amber-500"
                            />
                            <label
                              htmlFor={item}
                              className="text-gray-300 text-sm capitalize cursor-pointer"
                            >
                              {item === "sax"
                                ? "Saxophone"
                                : item === "drums"
                                ? "Drummer"
                                : item === "bass"
                                ? "Bass Guitar"
                                : item}
                            </label>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Individual Instrument Selection */}
          {bussinesscat === "personal" && (
            <motion.div variants={sectionVariants}>
              <div className="flex items-center bg-gray-800/50 rounded-lg border border-gray-700/50 px-3">
                <Guitar className="text-gray-400 mr-2" size={18} />
                <select
                  onChange={handleInputChange}
                  name="category"
                  value={gigInputs?.category}
                  className="w-full bg-gray-700/50 text-gray-100 h-12 title focus:outline-none"
                >
                  <option value="">Select your instrument</option>
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
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.div variants={sectionVariants} className="pt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setisSchedulerOpen(true)}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              Finalize & Schedule Gig
            </motion.button>
          </motion.div>
        </motion.form>
      </div>
      {/* Modals */}
      <AnimatePresence>
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
      </AnimatePresence>
      <AnimatePresence>
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
        )}{" "}
      </AnimatePresence>
      <AnimatePresence>
        <SchedulerComponent
          getScheduleData={getSchedulingData}
          isLoading={isLoading}
          isSchedulerOpen={isSchedulerOpen}
          setisSchedulerOpen={setisSchedulerOpen}
          onSubmit={onSubmit}
        />
      </AnimatePresence>
    </div>
  );
};

// Reusable Components
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

export default CreateGig;
