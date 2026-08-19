import { createContext, useContext } from "react";
import type { SchoolDetail } from "../../../types/school";

export interface SchoolContextType {
  school: SchoolDetail | null;
  error: string | null;
  loading: boolean;
}

export const SchoolContext = createContext<SchoolContextType>({
  school: null,
  error: null,
  loading: true,
});

export function useSchool() {
  return useContext(SchoolContext);
}
