// types/filterTypes.ts
export interface FilterState {
  searchQuery: string;
  category: string;
  location: string;
  scheduler: string;
  sortOption: string;
  timelineOption: string;
}

export type FilterAction =
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_CATEGORY"; payload: string }
  | { type: "SET_LOCATION"; payload: string }
  | { type: "SET_SCHEDULER"; payload: string }
  | { type: "SET_SORT_OPTION"; payload: string }
  | { type: "SET_TIMELINE_OPTION"; payload: string }
  | { type: "RESET_FILTERS" };

export const initialFilterState: FilterState = {
  searchQuery: "",
  category: "all",
  location: "all",
  scheduler: "all",
  sortOption: "popular",
  timelineOption: "once",
};

export function filterReducer(
  state: FilterState,
  action: FilterAction
): FilterState {
  switch (action.type) {
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    case "SET_CATEGORY":
      return { ...state, category: action.payload };
    case "SET_LOCATION":
      return { ...state, location: action.payload };
    case "SET_SCHEDULER":
      return { ...state, scheduler: action.payload };
    case "SET_SORT_OPTION":
      return { ...state, sortOption: action.payload };
    case "SET_TIMELINE_OPTION":
      return { ...state, timelineOption: action.payload };
    case "RESET_FILTERS":
      return initialFilterState;
    default:
      return state;
  }
}
