// Type Definitions
export type TalentType = "mc" | "dj" | "vocalist" | null;
export type BusinessCategory =
  | "full"
  | "personal"
  | "other"
  | "mc"
  | "dj"
  | "vocalist"
  | null;

export interface GigInputs {
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
  pricerange: string;
  currency: string;
}

export interface TalentModalProps {
  isOpen: boolean;
  onClose: () => void;
  talentType: Exclude<TalentType, null>;
  onSubmit: (data: Partial<GigInputs>) => void;
  initialData?: Partial<GigInputs>;
  errors: Record<string, string>;
  validateField: <K extends GigField>(field: K, value: FieldValue<K>) => string;
}
export type GigField =
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

export type FieldValue<T extends GigField> = T extends "vocalistGenre"
  ? string[]
  : T extends "mcLanguages"
  ? string
  : string;
export interface CustomProps {
  fontColor: string;
  font: string;
  backgroundColor: string;
}

export interface UserInfo {
  prefferences: string[];
}

export interface CategoryVisibility {
  title: boolean;
  description: boolean;
  business: boolean;
  gtimeline: boolean;
  othergig: boolean;
  gduration: boolean;
}
